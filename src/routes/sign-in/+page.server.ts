import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { formSchema } from './schema'
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
		if (!form.valid)
			return fail(400, { message: 'Please provide a valid email, password, and role.' })

		const { email, password } = form.data

		const { error } = await supabase.auth.signInWithPassword({ email, password })
		if (error) return fail(400, { success: false, email, message: error.message })

		return { success: true, message: 'Successfully signed in!' }
	}
}
