import { fail } from '@sveltejs/kit'
import type { Clinician } from '@prisma/client'
import { z } from 'zod'
import prisma from '$lib/server/prisma'
import { requireSession, resolveRole } from '$lib/server/auth'
import { summarizeQuestionnaire } from '$lib/server/ai'
import type { Actions, PageServerLoad } from './$types'
import { ROLE } from '../../generated/prisma/enums'

const questionnaireSchema = z.object({
	age: z.coerce.number().int().min(1).max(120),
	gender: z.string().min(1).max(80)
})

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession()
	if (!user) throw error(404, 'Not signed in')

	const role = await resolveRole()

	switch (role) {
		case ROLE.PATIENT: {
			const patient = await prisma.patient.findUnique({
				where: { id: user.id },
				include: {
					consent: true,
					questionnaire: true,
					conversation: true,
					clinicians: {
						include: { clinician: true }
					}
				}
			})

			if (!patient) throw error(403, 'User with patient role does not have patient profile')

			return {
				role,
				patient: {
					id: patient.id,
					firstName: patient.firstName,
					lastName: patient.lastName,
					consent: patient.consent,
					questionnaire: patient.questionnaire,
					conversation: patient.conversation
						? {
								id: patient.conversation.id,
								transcript: patient.conversation.transcript,
								summary: patient.conversation.summary,
								endedAt: patient.conversation.endedAt,
								createdAt: patient.conversation.createdAt,
								updatedAt: patient.conversation.updatedAt
							}
						: null,
					clinicians: patient.clinicians.map((entry: { clinician: Clinician }) => ({
						id: entry.clinician.id,
						firstName: entry.clinician.firstName,
						lastName: entry.clinician.lastName,
						email: entry.clinician.email
					}))
				}
			}
		}
		case ROLE.CLINICIAN: {
			const clinician = await prisma.clinician.findUnique({ where: { id: user.id } })

			if (!clinician) throw error(403, 'User with clinician role does not have clinician profile')

			const search = (url.searchParams.get('q') ?? '').trim()
			const sort = url.searchParams.get('sort') === 'lastName' ? 'lastName' : 'firstName'
			const dir = url.searchParams.get('dir') === 'desc' ? 'desc' : 'asc'

			const patients = await prisma.patient.findMany({
				where: {
					clinicians: { some: { clinicianId: clinician.id } },
					AND: search
						? [
								{
									OR: [
										{ firstName: { contains: search, mode: 'insensitive' } },
										{ lastName: { contains: search, mode: 'insensitive' } }
									]
								}
							]
						: undefined
				},
				include: {
					questionnaire: true,
					conversation: true
				},
				orderBy: {
					[sort]: dir
				}
			})

			return {
				role,
				clinician: {
					id: clinician.id,
					firstName: clinician.firstName,
					lastName: clinician.lastName
				},
				filters: { search, sort, dir },
				patients
			}
		}
		default:
			throw error(403, 'No valid role')
	}
}

export const actions: Actions = {
	saveConsent: async ({ locals }) => {
		const { user } = await requireSession(locals)
		const role = await resolveRole()
		if (role !== ROLE.PATIENT) return fail(403, { message: 'Only patients can submit consent.' })

		const patient = await prisma.patient.findUnique({ where: { id: user.id } })
		if (!patient) return fail(404, { message: 'Patient not found.' })

		await prisma.patientConsent.upsert({
			where: { patientId: patient.id },
			create: { patientId: patient.id, version: 'v1' },
			update: { createdAt: new Date(), version: 'v1' }
		})

		return { success: true }
	},
	saveQuestionnaire: async ({ request, locals }) => {
		const { user } = await requireSession(locals)
		const role = await resolveRole()
		if (role !== ROLE.PATIENT)
			return fail(403, { message: 'Only patients can submit questionnaire.' })

		const patient = await prisma.patient.findUnique({
			where: { id: user.id },
			include: { consent: true }
		})
		if (!patient?.consent) return fail(400, { message: 'Consent is required before intake.' })

		const data = Object.fromEntries(await request.formData())
		const parsed = questionnaireSchema.safeParse(data)
		if (!parsed.success) return fail(400, { message: 'Age and gender are required.' })

		const { age, gender } = parsed.data
		const summary = await summarizeQuestionnaire(age, gender)

		await prisma.questionnaire.upsert({
			where: { patientId: patient.id },
			create: { patientId: patient.id, age, gender, summary },
			update: { age, gender, summary }
		})

		return { success: true }
	}
}
