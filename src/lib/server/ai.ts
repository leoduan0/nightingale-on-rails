import { RISK_TIER } from '$lib/generated/prisma/enums'
import type { ChatMessage } from '$lib/types/chat'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = process.env.OPENAI_API_KEY
	? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
	: null
const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

const summarySchema = z.object({
	summary: z.string().min(10),
	riskTier: z.enum(RISK_TIER)
})

const heuristicRisk = (text: string) => {
	const value = text.toLowerCase()
	if (/(suicide|kill myself|self-harm|end my life|hurt myself)/.test(value)) return RISK_TIER.HIGH
	if (/(panic|can.t function|hopeless|worthless|constant anxiety|severe depression)/.test(value))
		return RISK_TIER.MEDIUM
	return RISK_TIER.LOW
}

const transcriptText = (messages: ChatMessage[]) =>
	messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')

export const generateAssistantReply = async (messages: ChatMessage[]) => {
	if (!openai) {
		return 'Thank you for sharing that. What has been weighing on you the most recently, and what do you think has contributed to it?'
	}

	const response = await openai.chat.completions.create({
		model,
		temperature: 0.6,
		messages: [
			{
				role: 'system',
				content:
					'You are a compassionate mental-health intake assistant. You only listen and ask natural, probing, open-ended follow-up questions that help a clinician understand context and causes. Never provide diagnosis or therapeutic treatment plans. If safety risk appears, include a brief safety reminder to contact emergency services or a crisis hotline and trusted support.'
			},
			...messages.map((m) => ({ role: m.role, content: m.content }))
		]
	})

	return response.choices[0]?.message?.content?.trim() ?? 'Can you tell me more about that?'
}

export const summarizeQuestionnaire = async (age: number, gender: string) => {
	if (!openai) {
		return `Client demographics summary: ${age} years old, gender identity reported as ${gender}.`
	}

	const response = await openai.chat.completions.create({
		model,
		temperature: 0.2,
		messages: [
			{
				role: 'system',
				content: "Summarize this patient's demographics in one concise sentence."
			},
			{ role: 'user', content: `Age: ${age}\nGender: ${gender}` }
		]
	})

	return response.choices[0]?.message?.content?.trim() ?? 'Demographic intake captured.'
}

export const summarizeConversation = async (messages: ChatMessage[]) => {
	const text = transcriptText(messages)

	if (!openai) {
		return {
			summary:
				'Client described ongoing mental health struggles and shared context about recent stressors, emotions, and coping experiences.',
			riskTier: heuristicRisk(text)
		}
	}

	const response = await openai.chat.completions.create({
		model,
		temperature: 0.2,
		response_format: { type: 'json_object' },
		messages: [
			{
				role: 'system',
				content:
					'Return strict JSON with keys: summary (string), riskTier (HIGH|MEDIUM|LOW). Summary should be factual and concise for clinical intake. riskTier is for clinician triage urgency and must not be shown to patients.'
			},
			{ role: 'user', content: text }
		]
	})

	const raw = response.choices[0]?.message?.content ?? '{}'
	const parsed = summarySchema.safeParse(JSON.parse(raw))
	if (parsed.success) return parsed.data

	return {
		summary:
			'Client shared mental health concerns and discussed likely triggers, symptom patterns, and personal context for clinician follow-up.',
		riskTier: heuristicRisk(text)
	}
}
