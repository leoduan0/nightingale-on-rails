import type { Actions, PageServerLoad } from './$types'
import { formSchema } from './schema'
import { redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

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
			return message(form, 'Please provide a valid email and password.', { status: 400 })
		}

		const { email, password } = form.data

		const { error } = await supabase.auth.signInWithPassword({ email, password })
		if (error) {
			return message(form, error.message, { status: 400 })
		}

		return message(form, 'Signed in successfully!')
	}
}
