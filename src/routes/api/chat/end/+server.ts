import { json } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import { summarizeConversation } from '$lib/server/ai'
import { resolveRole } from '$lib/server/auth'
import type { RequestHandler } from './$types'
import type { ChatMessage } from '$lib/types/chat'
import { ROLE } from '../../../../generated/prisma/enums'

export const POST: RequestHandler = async ({ locals }) => {
	const { user } = await locals.safeGetSession()
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 })

	const role = await resolveRole(locals)
	if (role !== ROLE.PATIENT)
		return json({ error: 'Only patients can end this conversation.' }, { status: 403 })

	const patient = await prisma.patient.findUnique({
		where: { id: user.id },
		include: { conversation: true }
	})
	if (!patient) return json({ error: 'Patient not found.' }, { status: 404 })

	const transcript = (patient.conversation?.transcript as ChatMessage[] | null) ?? []
	const farewell: ChatMessage = {
		role: 'assistant',
		content:
			'Thank you for sharing. I appreciate your honesty today. Please take care of yourself, and reach out to emergency services or a crisis hotline if you feel unsafe.',
		ts: new Date().toISOString()
	}

	const finalTranscript = [...transcript, farewell]
	const { summary, riskTier } = await summarizeConversation(finalTranscript)

	await prisma.conversation.upsert({
		where: { patientId: patient.id },
		create: {
			patientId: patient.id,
			transcript: finalTranscript,
			summary,
			riskTier,
			endedAt: new Date()
		},
		update: {
			transcript: finalTranscript,
			summary,
			riskTier,
			endedAt: new Date()
		}
	})

	return json({ transcript: finalTranscript, summary })
}
