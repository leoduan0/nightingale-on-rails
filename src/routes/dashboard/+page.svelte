<script lang="ts">
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card/index.js'
	import PatientQuestionnaireForm from './patient-questionnaire.svelte'
	import { formSchema } from './schema'
	import { toast } from 'svelte-sonner'
	import { superForm } from 'sveltekit-superforms'
	import { zod4Client } from 'sveltekit-superforms/adapters'

	let { data } = $props()

	const form = superForm(page.data.form, {
		validators: zod4Client(formSchema),
		resetForm: false,
		onUpdate: ({ form, result }) => {
			if (result.type === 'success') toast.success(String(form.message))
			else toast.error(String(form.message))
		}
	})

	const { form: formData, enhance } = form
</script>

<main class="flex-1 space-y-4 py-4 lg:max-w-6xl lg:mx-auto max-w-full mx-4">
	<section>
		<h1 class="normal">Patient Dashboard</h1>
		<p class="text-muted-foreground">
			Welcome back, {data.patient.firstName}.
		</p>
		{#if data.patient.clinicians.length > 0}
			<p class="mt-2 text-sm text-muted-foreground">
				Assigned clinician:
				<strong
					>{data.patient.clinicians[0].clinician.firstName}
					{data.patient.clinicians[0].clinician.lastName}</strong
				>
			</p>
		{/if}
	</section>

	<section>
		<Card.Root class="border border-border bg-card p-4 shadow-sm">
			<Card.Header>
				<Card.Title>Consent</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-muted-foreground">
					By continuing, you consent to collection and processing of your demographic intake and
					chatbot messages for clinical intake and care coordination. Your data can be reviewed by
					authorized clinicians.
				</p>
				<p>
					{data.patient.consent
						? 'You have already given consent'
						: 'You have yet to give consent'}.
				</p>
			</Card.Content>
			<Card.Footer class="block">
				<form method="POST" action="?/saveConsent">
					<Button disabled={!!data.patient.consent} type="submit">I understand and consent</Button>
				</form>
			</Card.Footer>
		</Card.Root>
	</section>

	<section>
		<div class="grid gap-4 md:grid-cols-2">
			<PatientQuestionnaireForm {form} {formData} {enhance} />

			<Card.Root class="border border-border bg-card p-4 shadow-sm">
				<Card.Header>
					<Card.Title>AI Intake Chat</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground">
						Chat freely with the Intake AI about anything related to why you are seeking out help.
						Share as little or as much as you'd like. There is absolutely no pressure.
					</p>
					<p class="text-muted-foreground">
						Intake AI will not be giving an official diagnosis or attempt at therapy, but will
						listen attentively and ask probing questions to learn more about you to provide the best
						information for your clinician.
					</p>
				</Card.Content>
				<Card.Footer>
					<Button href={resolve('/dashboard/chat')} type="button" disabled={!data.patient.consent}
						>Open AI intake chat</Button
					>
				</Card.Footer>
			</Card.Root>
		</div>
	</section>
</main>
