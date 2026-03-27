import { ROLE } from '$lib/generated/prisma/enums'
import prisma from '$lib/server/prisma'
import { error, redirect } from '@sveltejs/kit'

export const requireSession = async (locals: App.Locals) => {
	const { session, user } = await locals.safeGetSession()
	if (!session || !user) {
		redirect(303, '/sign-in')
	}
	return { session, user }
}

export const resolveRole = async (locals: App.Locals) => {
	const { user } = await locals.safeGetSession()

	if (!user) throw error(400, 'Not signed in')

	const prismaPatient = await prisma.patient.findUnique({
		where: {
			id: user.id
		}
	})

	const prismaClinician = await prisma.clinician.findUnique({
		where: {
			id: user.id
		}
	})

	if (prismaPatient && !prismaClinician) {
		return ROLE.PATIENT
	} else if (!prismaPatient && prismaClinician) {
		return ROLE.CLINICIAN
	} else if (!prismaPatient && !prismaClinician) {
		throw error(500, 'User is neither patient nor clinician')
	} else {
		throw error(500, 'User is both patient and clinician')
	}
}
