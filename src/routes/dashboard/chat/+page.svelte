<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Card } from '$lib/components/ui/card'
	import { Input } from '$lib/components/ui/input'
	import type { ChatMessage } from '$lib/types/chat'
	import { onMount } from 'svelte'

	let { data } = $props()

	let message = $state('')
	let sending = $state(false)
	let ending = $state(false)
	let chatEnded = $state(false)
	let chatMessages = $state<ChatMessage[]>([])

	onMount(() => {
		chatMessages = (data.patient?.conversation?.transcript as ChatMessage[] | undefined) ?? []
		chatEnded = Boolean(data.patient?.conversation?.endedAt)
	})

	const sendMessage = async () => {
		if (!message.trim() || sending || chatEnded) return
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
		if (ending || chatEnded) return
		ending = true
		const response = await fetch('/api/chat/end', { method: 'POST' })
		ending = false
		if (!response.ok) return
		const payload = await response.json()
		chatMessages = payload.transcript
		chatEnded = true
	}
</script>

<section class="space-y-4">
	<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
		<div class="flex items-start justify-between gap-3">
			<div>
				<h1 class="text-3xl font-bold">AI Intake Chat</h1>
				<p class="text-slate-600/95">
					Hi {data.patient.firstName}, share what has been most difficult lately.
				</p>
			</div>
			<a href="/dashboard" class="inline-block">
				<Button type="button" variant="outline">Back to dashboard</Button>
			</a>
		</div>
		<p class="mt-2 text-sm text-slate-600">
			This assistant asks probing intake questions and does not provide therapeutic treatment
			advice.
		</p>
		{#if !data.patient.consent}
			<p
				class="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
			>
				You must provide consent on your dashboard before using the intake chat.
			</p>
		{/if}
		{#if chatEnded}
			<p
				class="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
			>
				This conversation has ended.
			</p>
		{/if}
	</Card>

	<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
		<div class="max-h-112 space-y-2 overflow-auto pr-1">
			{#if chatMessages.length === 0}
				<p class="text-sm text-slate-500">No conversation yet. Send your first message.</p>
			{:else}
				{#each chatMessages as chat, idx (idx)}
					<article
						class={chat.role === 'user'
							? 'ml-10 rounded-xl border border-sky-100 bg-sky-50/75 p-3 text-sm'
							: 'mr-10 rounded-xl border border-cyan-100 bg-cyan-50/80 p-3 text-sm'}
					>
						<p class="mb-1 font-semibold">{chat.role === 'user' ? 'You' : 'Intake AI'}</p>
						<p>{chat.content}</p>
					</article>
				{/each}
			{/if}
		</div>

		<div class="mt-4 flex gap-2">
			<Input bind:value={message} placeholder="Share what has been most difficult lately..." />
			<Button
				type="button"
				onclick={sendMessage}
				disabled={!data.patient.consent || sending || chatEnded}>Send</Button
			>
		</div>
		<Button
			type="button"
			variant="outline"
			class="mt-2"
			onclick={endConversation}
			disabled={!data.patient.consent || ending || chatEnded}
		>
			End conversation
		</Button>
	</Card>
</section>
