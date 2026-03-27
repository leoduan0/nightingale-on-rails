import { ROLE } from '$lib/generated/prisma/enums'
import { generateAssistantReply } from '$lib/server/ai'
import { resolveRole } from '$lib/server/auth'
import prisma from '$lib/server/prisma'
import type { ChatMessage } from '$lib/types/chat'
import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { z } from 'zod'

const schema = z.object({
	message: z.string().min(1).max(3000)
})

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = await locals.safeGetSession()
	if (!user) return json({ error: 'Not signed in' }, { status: 401 })

	const role = await resolveRole(locals)
	if (role !== ROLE.PATIENT) return json({ error: 'Only patients can chat.' }, { status: 403 })

	const patient = await prisma.patient.findUnique({
		where: { id: user.id },
		include: { consent: true, conversation: true }
	})
	if (!patient?.consent) return json({ error: 'Consent required first.' }, { status: 400 })

	const body = await request.json()
	const parsed = schema.safeParse(body)
	if (!parsed.success) return json({ error: 'Invalid message.' }, { status: 400 })

	const transcript = (patient.conversation?.transcript as ChatMessage[] | null) ?? []
	const nextTranscript: ChatMessage[] = [
		...transcript,
		{
			role: 'user',
			content: parsed.data.message.trim(),
			ts: new Date().toISOString()
		}
	]

	const assistant = await generateAssistantReply(nextTranscript)
	nextTranscript.push({
		role: 'assistant',
		content: assistant,
		ts: new Date().toISOString()
	})

	await prisma.conversation.upsert({
		where: { patientId: patient.id },
		create: { patientId: patient.id, transcript: nextTranscript },
		update: { transcript: nextTranscript, endedAt: null }
	})

	return json({ transcript: nextTranscript, assistant })
}
