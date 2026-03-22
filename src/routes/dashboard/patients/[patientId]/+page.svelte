<script lang="ts">
	import { Card } from '$lib/components/ui/card'
	let { data } = $props()
	const transcript =
		(data.patient.conversation?.transcript as
			| Array<{ role: 'user' | 'assistant'; content: string }>
			| undefined) ?? []
</script>

<section class="space-y-4">
	<Card>
		<h1 class="text-3xl font-bold">{data.patient.firstName} {data.patient.lastName}</h1>
		<p class="text-sm text-slate-600">{data.patient.email}</p>
		<a
			class="mt-2 inline-block font-semibold text-teal-700"
			href={`/dashboard/patients/${data.patient.id}/export`}>Export to PDF</a
		>
	</Card>

	<div class="grid gap-4 md:grid-cols-2">
		<Card>
			<h2 class="text-xl font-bold">Questionnaire</h2>
			<p class="text-slate-700">Age: {data.patient.questionnaire?.age ?? 'Not provided'}</p>
			<p class="text-slate-700">Gender: {data.patient.questionnaire?.gender ?? 'Not provided'}</p>
			<p class="mt-3 text-sm text-slate-600">Summary</p>
			<p>{data.summaries.questionnaire || 'No summary yet.'}</p>
		</Card>

		<Card>
			<h2 class="text-xl font-bold">Conversation Summary</h2>
			<p>{data.summaries.conversation || 'No summary yet.'}</p>
			<p class="mt-3 text-sm text-slate-600">Triage Label</p>
			<p class="font-semibold">{data.patient.conversation?.riskTier ?? 'LOW'}</p>
		</Card>
	</div>

	<Card>
		<h2 class="text-xl font-bold">Chatlog</h2>
		<div class="mt-3 space-y-2">
			{#if transcript.length === 0}
				<p class="text-slate-600">No messages available.</p>
			{:else}
				{#each transcript as entry (entry.role)}
					<article
						class={entry.role === 'user'
							? 'rounded-md bg-slate-100 p-2 text-sm'
							: 'rounded-md bg-teal-50 p-2 text-sm'}
					>
						<p class="mb-1 font-semibold">{entry.role === 'user' ? 'Patient' : 'Intake AI'}</p>
						<p>{entry.content}</p>
					</article>
				{/each}
			{/if}
		</div>
	</Card>
</section>
