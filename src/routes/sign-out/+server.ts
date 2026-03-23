import type { RequestHandler } from './$types'
import { redirect } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession()
	if (session) {
		await supabase.auth.signOut()
		redirect(303, '/')
	}
}
