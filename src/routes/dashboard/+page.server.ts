import { summarizeQuestionnaire } from '$lib/server/ai'
import { requireSession, resolveRole } from '$lib/server/auth'
import prisma from '$lib/server/prisma'
import { ROLE } from '../../generated/prisma/enums'
import { type PatientGetPayload } from '../../generated/prisma/models'
import type { Actions, PageServerLoad } from './$types'
import { formSchema } from './schema'
import { error, fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession()
	if (!user) redirect(303, '/sign-in')

	const role = await resolveRole(locals)

	if (role !== ROLE.PATIENT) throw error(400, 'User is not a patient.')

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

	if (!patient) throw error(403, 'User has patient role but not patient profile')

	return {
		role,
		patient: patient as PatientGetPayload<{
			include: {
				consent: true
				questionnaire: true
				conversation: true
				clinicians: {
					include: { clinician: true }
				}
			}
		}>,
		form: await superValidate(patient.questionnaire, zod4(formSchema))
	}
}

export const actions = {
	saveConsent: async ({ locals }) => {
		const { user } = await requireSession(locals)
		const role = await resolveRole(locals)
		if (role !== ROLE.PATIENT) return fail(403, { message: 'Only patients can submit consent.' })

		const patient = await prisma.patient.findUnique({ where: { id: user.id } })
		if (!patient) return fail(404, { message: 'Patient not found.' })

		await prisma.patientConsent.upsert({
			where: { patientId: patient.id },
			create: { patient: { connect: { id: patient.id } } },
			update: { createdAt: new Date() }
		})

		return { success: true }
	},
	submitQuestionnaire: async (event) => {
		const { locals } = event

		const form = await superValidate(event, zod4(formSchema))

		if (!form.valid) return message(form, 'Age and gender are required.', { status: 400 })

		const { user } = await requireSession(locals)
		const role = await resolveRole(locals)

		if (role !== ROLE.PATIENT)
			return message(form, 'Only patients can submit questionnaire.', { status: 400 })

		const patient = await prisma.patient.findUnique({
			where: { id: user.id },
			include: { consent: true }
		})

		if (!patient) return message(form, 'No patient.', { status: 500 })

		if (!patient.consent)
			return message(form, 'Consent is required before intake.', { status: 400 })

		const { age, gender } = form.data
		const summary = await summarizeQuestionnaire(age, gender)

		await prisma.questionnaire.upsert({
			where: { patientId: patient.id },
			create: { patient: { connect: { id: patient.id } }, age, gender, summary },
			update: { age, gender, summary }
		})

		return message(form, 'Questionnaire saved successfully!')
	}
} satisfies Actions
