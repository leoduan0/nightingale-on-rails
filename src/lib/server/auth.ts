import prisma from '$lib/server/prisma'
import { supabase } from '$lib/supabase-client'
import { ROLE } from '../../generated/prisma/enums'
import { redirect } from '@sveltejs/kit'

export const requireSession = async (locals: App.Locals) => {
	const { session, user } = await locals.safeGetSession()
	if (!session || !user) {
		redirect(303, '/sign-in')
	}
	return { session, user }
}

export const resolveRole = async (locals: App.Locals) => {
	const { user } = await locals.safeGetSession()

	if (!user) throw new Error('Not signed in')

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
		throw new Error('User is neither patient nor clinician')
	} else {
		throw new Error('User is both patient and clinician')
	}
}
