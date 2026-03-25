<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { Card } from '$lib/components/ui/card'
	import PatientQuestionnaireForm from './patient-questionnaire.svelte'
	import { formSchema } from './schema'
	import { toast } from 'svelte-sonner'
	import { superForm } from 'sveltekit-superforms'
	import { zod4Client } from 'sveltekit-superforms/adapters'

	let { data } = $props()

	const form = superForm(page.data.form, {
		validators: zod4Client(formSchema),
		resetForm: false,
		onUpdate: ({ result }) => {
			if (result.type === 'success') toast.success('Success')
			else toast.error('Fail')
		}
	})

	const { form: formData, enhance } = form
</script>

<section class="space-y-4">
	<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
		<h1 class="text-3xl font-bold">Patient Dashboard</h1>
		<p class="text-slate-600/95">
			Welcome back, {data.patient.firstName}.
		</p>
		{#if data.patient.clinicians.length > 0}
			<p class="mt-2 text-sm text-slate-600/95">
				Assigned clinician:
				<strong
					>{data.patient.clinicians[0].clinician.firstName}
					{data.patient.clinicians[0].clinician.lastName}</strong
				>
			</p>
		{/if}
	</Card>

	{#if !data.patient.consent}
		<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
			<h2 class="text-xl font-bold">Consent Required</h2>
			<p class="text-slate-700">
				By continuing, you consent to collection and processing of your demographic intake and
				chatbot messages for clinical intake and care coordination. Your data can be reviewed by
				authorized clinicians.
			</p>
			<form method="POST" action="?/saveConsent" class="mt-3">
				<Button type="submit">I understand and consent</Button>
			</form>
		</Card>
	{/if}

	<div class="grid gap-4 md:grid-cols-2">
		<PatientQuestionnaireForm {form} {formData} {enhance} />

		<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
			<h2 class="text-xl font-bold">AI Intake Chat</h2>
			<a href="/dashboard/chat">
				<Button type="button" disabled={!data.patient.consent}>Open AI intake chat</Button>
			</a>
			<p>
				Chat freely with the Intake AI about anything related to why you are seeking out help. Share
				as little or as much as you'd like. There is absolutely no pressure.
			</p>
			<p>
				Intake AI will not be giving an official diagnosis or attempt at therapy, but will listen
				attentively and ask probing questions to learn more about you to provide the best
				information for your clinician.
			</p>
		</Card>
	</div>
</section>
