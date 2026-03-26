import { resolveRole } from '$lib/server/auth'
import prisma from '$lib/server/prisma'
import { ROLE } from '../../../generated/prisma/enums'
import type { PageServerLoad } from './$types'
import { error, redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession()
	if (!user) redirect(303, '/sign-in')

	const role = await resolveRole(locals)
	if (role !== ROLE.PATIENT) throw error(400, 'Only patients can access intake chat.')

	const patient = await prisma.patient.findUnique({
		where: { id: user.id },
		include: {
			consent: true,
			conversation: true
		}
	})

	if (!patient) throw error(400, 'Patient not found')

	return {
		patient: {
			firstName: patient.firstName,
			consent: patient.consent,
			conversation: patient.conversation
		}
	}
}
