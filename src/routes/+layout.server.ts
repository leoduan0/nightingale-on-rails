import { resolveRole } from '$lib/server/auth'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const { session, user } = await locals.safeGetSession()
	const role = await resolveRole(locals)

	return {
		session,
		user,
		role,
		cookies: cookies.getAll()
	}
}
