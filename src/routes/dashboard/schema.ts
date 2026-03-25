import { GENDER } from '../../generated/prisma/enums'
import { z } from 'zod'

export const formSchema = z.object({
	age: z.coerce.number().int().min(1).max(120),
	gender: z.enum(GENDER)
})

export type FormSchema = typeof formSchema
