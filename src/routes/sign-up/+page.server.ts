import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import prisma from '$lib/server/prisma'
import { message, superValidate } from 'sveltekit-superforms'
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
			return message(
				form,
				'Please provide a valid email, password, and first name, last name, and role.',
				{ status: 400 }
			)
		}

		const { email, password, firstName, lastName, role } = form.data

		const { data, error } = await supabase.auth.signUp({ email, password })

		if (error) {
			return message(form, error.message, { status: 400 })
		}

		if (!data.user) {
			throw new Error('No error but no data.user')
		}

		if (role === ROLE.PATIENT) {
			await prisma.patient.create({
				data: { id: data.user.id, email: email, firstName: firstName, lastName: lastName }
			})
		} else if (role === ROLE.CLINICIAN) {
			await prisma.clinician.create({
				data: { id: data.user.id, email: email, firstName: firstName, lastName: lastName }
			})
		} else {
			return message(form, 'Role is invalid', { status: 400 })
		}

		await supabase.auth.signInWithPassword({ email, password })

		return message(form, 'Signed up successfully!')
	}
}
