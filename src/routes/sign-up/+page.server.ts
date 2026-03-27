import { ROLE } from '$lib/generated/prisma/enums'
import prisma from '$lib/server/prisma'
import type { Actions, PageServerLoad } from './$types'
import { formSchema } from './schema'
import { error, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession()

	if (session) {
		throw redirect(303, '/dashboard')
	}

	return {
		form: await superValidate(zod4(formSchema))
	}
}

export const actions = {
	default: async (event) => {
		const {
			locals: { supabase }
		} = event

		const form = await superValidate(event, zod4(formSchema))

		if (!form.valid)
			return message(
				form,
				'Please provide a valid email, password, and first name, last name, and role.',
				{ status: 400 }
			)

		const { email, password, firstName, lastName, role } = form.data

		const { data, error: supabaseError } = await supabase.auth.signUp({ email, password })

		if (supabaseError) return message(form, supabaseError.message)

		if (!data.user) throw error(500, 'No data.user')

		if (role === ROLE.PATIENT) {
			await prisma.patient.create({
				data: {
					id: data.user.id,
					email: email,
					firstName: firstName,
					lastName: lastName
				}
			})
		} else if (role === ROLE.CLINICIAN) {
			await prisma.clinician.create({
				data: {
					id: data.user.id,
					email: email,
					firstName: firstName,
					lastName: lastName
				}
			})
		} else {
			throw error(500, 'Role is invalid')
		}

		await supabase.auth.signInWithPassword({ email, password })

		return message(form, 'Signed up successfully!')
	}
} satisfies Actions
