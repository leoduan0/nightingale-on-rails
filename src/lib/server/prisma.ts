import { DATABASE_URL } from '$env/static/private'
import { PrismaClient } from '$lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
	connectionString: DATABASE_URL
})

const prisma = new PrismaClient({
	adapter
})

export default prisma
