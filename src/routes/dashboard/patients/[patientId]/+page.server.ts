import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import { requireSession, resolveRole } from '$lib/server/auth'
import type { PageServerLoad } from './$types'
import { ROLE } from '../../../../generated/prisma/enums'

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await requireSession(locals)
	const role = await resolveRole()
	if (role !== ROLE.CLINICIAN) throw error(403, 'User is not clinician')

	const clinician = await prisma.clinician.findUnique({ where: { id: user.id } })
	if (!clinician) throw error(403, 'No Prisma clinician')

	const assignment = await prisma.clinicianPatient.findFirst({
		where: {
			clinicianId: clinician.id,
			patientId: params.patientId
		}
	})
	if (!assignment) throw error(403, 'You are not assigned to this patient.')

	const patient = await prisma.patient.findUnique({
		where: { id: params.patientId },
		include: {
			questionnaire: true,
			conversation: true,
			consent: true
		}
	})
	if (!patient) throw error(404, 'Patient not found.')

	return {
		patient,
		summaries: {
			questionnaire: patient.questionnaire?.summary ?? '',
			conversation: patient.conversation?.summary ?? ''
		}
	}
}
