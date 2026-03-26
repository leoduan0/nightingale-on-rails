<script lang="ts">
	import { resolve } from '$app/paths'
	import { Card } from '$lib/components/ui/card'

	let { data } = $props()
	const transcript =
		(data.patient.conversation?.transcript as
			| Array<{ role: 'user' | 'assistant'; content: string }>
			| undefined) ?? []
</script>

<section class="space-y-4">
	<Card class="border border-border bg-card shadow-sm">
		<h1 class="text-3xl font-bold">{data.patient.firstName} {data.patient.lastName}</h1>
		<p class="text-sm text-muted-foreground">{data.patient.email}</p>
		<a
			class="mt-2 inline-block font-semibold text-primary hover:text-primary/90"
			href={resolve('/dashboard/patients/[patientId]/export', { patientId: data.patient.id })}
			>Export to PDF</a
		>
	</Card>

	<div class="grid gap-4 md:grid-cols-2">
		<Card class="border border-border bg-card shadow-sm">
			<h2 class="text-xl font-bold">Questionnaire</h2>
			<p class="text-muted-foreground">Age: {data.patient.questionnaire?.age ?? 'Not provided'}</p>
			<p class="text-muted-foreground">
				Gender: {data.patient.questionnaire?.gender ?? 'Not provided'}
			</p>
			<p class="mt-3 text-sm text-muted-foreground">Summary</p>
			<p>{data.summaries.questionnaire || 'No summary yet.'}</p>
		</Card>

		<Card class="border border-border bg-card shadow-sm">
			<h2 class="text-xl font-bold">Conversation Summary</h2>
			<p>{data.summaries.conversation || 'No summary yet.'}</p>
			<p class="mt-3 text-sm text-muted-foreground">Triage Label</p>
			<p class="font-semibold">{data.patient.conversation?.riskTier ?? 'LOW'}</p>
		</Card>
	</div>

	<Card class="border border-border bg-card shadow-sm">
		<h2 class="text-xl font-bold">Chatlog</h2>
		<div class="mt-3 space-y-2">
			{#if transcript.length === 0}
				<p class="text-muted-foreground">No messages available.</p>
			{:else}
				{#each transcript as entry (entry.role)}
					<article
						class={entry.role === 'user'
							? 'rounded-xl border border-border bg-accent p-2 text-sm'
							: 'rounded-xl border border-border bg-muted p-2 text-sm'}
					>
						<p class="mb-1 font-semibold">{entry.role === 'user' ? 'Patient' : 'Intake AI'}</p>
						<p>{entry.content}</p>
					</article>
				{/each}
			{/if}
		</div>
	</Card>
</section>
