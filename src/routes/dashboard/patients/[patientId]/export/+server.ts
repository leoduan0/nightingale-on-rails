import { resolveRole } from '$lib/server/auth'
import prisma from '$lib/server/prisma'
import { ROLE } from '../../../../../generated/prisma/enums'
import type { RequestHandler } from './$types'
import { error } from '@sveltejs/kit'
import PDFDocument from 'pdfkit'

export const GET: RequestHandler = async ({ params, locals }) => {
	const { user } = await locals.safeGetSession()
	if (!user) throw error(401, 'Not signed in')

	const role = await resolveRole(locals)
	if (role !== ROLE.CLINICIAN) throw error(403, 'Forbidden')

	const clinician = await prisma.clinician.findUnique({
		where: { id: user.id }
	})
	if (!clinician) throw error(403, 'Forbidden')

	const assignment = await prisma.clinicianPatient.findFirst({
		where: { clinicianId: clinician.id, patientId: params.patientId }
	})
	if (!assignment) throw error(403, 'Forbidden')

	const patient = await prisma.patient.findUnique({
		where: { id: params.patientId },
		include: { questionnaire: true, conversation: true }
	})
	if (!patient) throw error(404, 'Patient not found')

	const doc = new PDFDocument({ margin: 50 })
	const chunks: Uint8Array[] = []
	const done = new Promise<Buffer>((resolve) => {
		doc.on('data', (chunk) => chunks.push(chunk))
		doc.on('end', () => resolve(Buffer.concat(chunks)))
	})

	doc.fontSize(20).text('Nightingale Intake Export')
	doc.moveDown()
	doc.fontSize(12).text(`Patient: ${patient.firstName} ${patient.lastName}`)
	doc.text(`Email: ${patient.email}`)
	doc.text(`Generated: ${new Date().toISOString()}`)
	doc.moveDown()

	doc.fontSize(14).text('Questionnaire')
	doc.fontSize(12).text(`Age: ${patient.questionnaire?.age ?? 'N/A'}`)
	doc.text(`Gender: ${patient.questionnaire?.gender ?? 'N/A'}`)
	doc.text(`Summary: ${patient.questionnaire?.summary ?? 'N/A'}`)
	doc.moveDown()

	doc.fontSize(14).text('Conversation Summary')
	doc.fontSize(12).text(patient.conversation?.summary ?? 'N/A')
	doc.moveDown()

	doc.fontSize(14).text('Triage Label')
	doc.fontSize(12).text(patient.conversation?.riskTier ?? 'LOW')
	doc.moveDown()

	doc.fontSize(14).text('Chat Transcript')
	const transcript =
		(patient.conversation?.transcript as Array<{
			role: string
			content: string
		}> | null) ?? []
	for (const line of transcript) {
		doc.fontSize(11).text(`${line.role.toUpperCase()}: ${line.content}`)
		doc.moveDown(0.4)
	}

	doc.end()
	const pdfBuffer = await done

	return new Response(new Uint8Array(pdfBuffer), {
		headers: {
			'content-type': 'application/pdf',
			'content-disposition': `attachment; filename="patient-${patient.id}.pdf"`
		}
	})
}
