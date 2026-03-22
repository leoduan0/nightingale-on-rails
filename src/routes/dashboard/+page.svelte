<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button } from '$lib/components/ui/button'
	import { Card } from '$lib/components/ui/card'
	import { Input } from '$lib/components/ui/input'
	import { Select } from '$lib/components/ui/select'
	import type { ChatMessage } from '$lib/types/chat'
	import { ROLE } from '../../generated/prisma/enums'

	let { data, form } = $props()
	const initialTranscript =
		(data.patient?.conversation?.transcript as ChatMessage[] | undefined) ?? []

	let message = $state('')
	let sending = $state(false)
	let ending = $state(false)
	let chatMessages = $state<ChatMessage[]>(initialTranscript)
	let localConversationSummary = $state(data.patient?.conversation?.summary ?? '')
	let localQuestionnaireSummary = $state(data.patient?.questionnaire?.summary ?? '')

	const sendMessage = async () => {
		if (!message.trim() || sending) return
		sending = true
		const response = await fetch('/api/chat/send', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ message })
		})
		sending = false
		if (!response.ok) return
		const payload = await response.json()
		chatMessages = payload.transcript
		message = ''
	}

	const endConversation = async () => {
		if (ending) return
		ending = true
		const response = await fetch('/api/chat/end', { method: 'POST' })
		ending = false
		if (!response.ok) return
		const payload = await response.json()
		chatMessages = payload.transcript
		localConversationSummary = payload.summary
	}
</script>

{#if data.role === ROLE.PATIENT}
	<section class="space-y-4">
		<Card>
			<h1 class="text-3xl font-bold">Patient Dashboard</h1>
			<p class="text-slate-600">
				Welcome back, {data.patient.firstName}. Your information stays private and encrypted in
				transit.
			</p>
			{#if data.patient.clinicians.length > 0}
				<p class="mt-2 text-sm text-slate-600">
					Assigned clinician:
					<strong
						>{data.patient.clinicians[0].firstName} {data.patient.clinicians[0].lastName}</strong
					>
				</p>
			{/if}
		</Card>

		{#if !data.patient.consent}
			<Card>
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
			<Card>
				<h2 class="text-xl font-bold">Demographics Questionnaire</h2>
				<form method="POST" action="?/saveQuestionnaire" class="mt-3 space-y-3">
					<label class="block space-y-1">
						<span class="text-sm font-semibold">Age</span>
						<Input
							name="age"
							type="number"
							min="1"
							max="120"
							value={data.patient.questionnaire?.age ?? ''}
							required
						/>
					</label>
					<label class="block space-y-1">
						<span class="text-sm font-semibold">Gender</span>
						<Select name="gender" required type="single">
							<option value="" selected={!data.patient.questionnaire?.gender}>Select one</option>
							<option value="Woman" selected={data.patient.questionnaire?.gender === 'Woman'}
								>Woman</option
							>
							<option value="Man" selected={data.patient.questionnaire?.gender === 'Man'}
								>Man</option
							>
							<option
								value="Non-binary"
								selected={data.patient.questionnaire?.gender === 'Non-binary'}>Non-binary</option
							>
							<option
								value="Prefer not to say"
								selected={data.patient.questionnaire?.gender === 'Prefer not to say'}
								>Prefer not to say</option
							>
						</Select>
					</label>
					<Button type="submit">Save questionnaire</Button>
				</form>
			</Card>

			<Card>
				<h2 class="text-xl font-bold">AI Intake Chat</h2>
				<p class="text-sm text-slate-600">
					This assistant asks probing intake questions and does not provide therapeutic treatment
					advice.
				</p>
				<div class="mt-3 max-h-80 space-y-2 overflow-auto pr-1">
					{#if chatMessages.length === 0}
						<p class="text-sm text-slate-500">No conversation yet. Send your first message.</p>
					{:else}
						{#each chatMessages as chat (chat.content)}
							<article
								class={chat.role === 'user'
									? 'ml-6 rounded-md bg-slate-100 p-2 text-sm'
									: 'mr-6 rounded-md bg-teal-50 p-2 text-sm'}
							>
								<p class="mb-1 font-semibold">{chat.role === 'user' ? 'You' : 'Intake AI'}</p>
								<p>{chat.content}</p>
							</article>
						{/each}
					{/if}
				</div>
				<div class="mt-3 flex gap-2">
					<Input bind:value={message} placeholder="Share what has been most difficult lately..." />
					<Button type="button" on:click={sendMessage} disabled={!data.patient.consent || sending}
						>Send</Button
					>
				</div>
				<Button
					type="button"
					variant="outline"
					class="mt-2"
					on:click={endConversation}
					disabled={!data.patient.consent || ending}
				>
					End conversation
				</Button>
			</Card>
		</div>

		<Card>
			<h2 class="text-xl font-bold">Review and Edit AI Summaries</h2>
			<form method="POST" action="?/saveSummaryEdits" class="mt-3 space-y-3" use:enhance>
				<label class="block space-y-1">
					<span class="text-sm font-semibold">Questionnaire Summary</span>
					<textarea
						name="questionnaireSummary"
						bind:value={localQuestionnaireSummary}
						class="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
					></textarea>
				</label>
				<label class="block space-y-1">
					<span class="text-sm font-semibold">Conversation Summary</span>
					<textarea
						name="conversationSummary"
						bind:value={localConversationSummary}
						class="min-h-36 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
					></textarea>
				</label>
				<Button type="submit">Save summary edits</Button>
			</form>
			{#if form?.message}
				<p class="mt-2 text-sm text-rose-700">{form.message}</p>
			{/if}
		</Card>
	</section>
{:else}
	<section class="space-y-4">
		<Card>
			<h1 class="text-3xl font-bold">Clinician Dashboard</h1>
			<p class="text-slate-600">
				Welcome, Dr. {data.clinician.lastName}. Search, filter, and review your assigned patients.
			</p>
			<form method="GET" class="mt-4 grid gap-3 sm:grid-cols-4">
				<label class="space-y-1 sm:col-span-2">
					<span class="text-sm font-semibold">Search by first or last name</span>
					<Input name="q" value={data.filters.search} placeholder="e.g. Jordan" />
				</label>
				<label class="space-y-1">
					<span class="text-sm font-semibold">Sort by</span>
					<Select name="sort" type="single">
						<option value="firstName" selected={data.filters.sort === 'firstName'}
							>First name</option
						>
						<option value="lastName" selected={data.filters.sort === 'lastName'}>Last name</option>
					</Select>
				</label>
				<label class="space-y-1">
					<span class="text-sm font-semibold">Direction</span>
					<Select name="dir" type="single">
						<option value="asc" selected={data.filters.dir === 'asc'}>Ascending</option>
						<option value="desc" selected={data.filters.dir === 'desc'}>Descending</option>
					</Select>
				</label>
				<Button type="submit" class="sm:col-span-4">Apply filters</Button>
			</form>
		</Card>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#if data.patients.length === 0}
				<Card>
					<p class="text-slate-600">No assigned patients match your filters yet.</p>
				</Card>
			{:else}
				{#each data.patients as patient (patient.id)}
					<Card>
						<h2 class="text-xl font-bold">{patient.firstName} {patient.lastName}</h2>
						<p class="text-sm text-slate-600">Email: {patient.email}</p>
						<p class="text-sm text-slate-600">
							Questionnaire: {patient.questionnaire ? 'Completed' : 'Pending'}
						</p>
						<p class="text-sm text-slate-600">
							Chat ended: {patient.conversation?.endedAt ? 'Yes' : 'No'}
						</p>
						<a
							class="mt-2 inline-block font-semibold text-teal-700"
							href={`/dashboard/patients/${patient.id}`}>Open profile</a
						>
					</Card>
				{/each}
			{/if}
		</div>
	</section>
{/if}
