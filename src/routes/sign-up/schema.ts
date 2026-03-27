import { ROLE } from '$lib/generated/prisma/enums'
import { z } from 'zod'

export const formSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	firstName: z.string().min(1).max(60),
	lastName: z.string().min(1).max(60),
	role: z.enum(ROLE)
})

export type FormSchema = typeof formSchema
