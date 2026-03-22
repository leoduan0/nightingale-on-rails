import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import prisma from '$lib/server/prisma'
import { superValidate } from 'sveltekit-superforms'
import { formSchema } from './schema'
import { zod4 } from 'sveltekit-superforms/adapters'
import { ROLE } from '../../generated/prisma/enums'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession()

	if (session) {
		redirect(303, '/dashboard')
	}

	return {
		form: await superValidate(zod4(formSchema))
	}
}

export const actions: Actions = {
	default: async (event) => {
		const {
			locals: { supabase }
		} = event

		const form = await superValidate(event, zod4(formSchema))
		if (!form.valid) {
			return fail(400, {
				message: 'Please provide a valid email, password, and first name, last name, and role.'
			})
		}

		const { email, password, firstName, lastName, role } = form.data

		const { data, error } = await supabase.auth.signUp({ email, password })

		if (!data || !data.user || error) {
			return fail(400, { success: false, email, message: error?.message })
		}

		try {
			if (role === ROLE.PATIENT) {
				await prisma.patient.create({
					data: { id: data.user.id, email: email, firstName: firstName, lastName: lastName }
				})
			} else {
				await prisma.clinician.create({
					data: { id: data.user.id, email: email, firstName: firstName, lastName: lastName }
				})
			}
		} catch {
			return fail(409, { message: 'Profile already exists for this account.' })
		}

		// await supabase.auth.signInWithPassword({ email, password });

		return { success: true, message: 'Successfully signed up!' }
	}
}
