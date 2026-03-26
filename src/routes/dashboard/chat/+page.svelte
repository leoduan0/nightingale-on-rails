<script lang="ts">
	import { resolve } from '$app/paths'
	import { Button } from '$lib/components/ui/button'
	import * as Card from '$lib/components/ui/card'
	import { Input } from '$lib/components/ui/input'
	import type { ChatMessage } from '$lib/types/chat'
	import { onMount } from 'svelte'

	let { data } = $props()

	let message = $state('')
	let sending = $state(false)
	let chatMessages = $state<ChatMessage[]>([])

	onMount(() => {
		chatMessages = (data.patient?.conversation?.transcript as ChatMessage[] | undefined) ?? []
	})

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
</script>

<main class="flex-1 space-y-4 py-4 max-w-6xl mx-auto w-full">
	<section class="flex justify-between">
		<div>
			<h1 class="normal">AI Intake Chat</h1>
			<p class="text-muted-foreground">
				Hi {data.patient.firstName}! Feel free to share what has been most difficult lately.
			</p>
			<p class="text-muted-foreground">
				This assistant asks probing intake questions and does not provide therapeutic treatment
				advice.
			</p>
			<p class="text-muted-foreground">In an emergency, call your local emergency number.</p>
		</div>
		<div>
			<Button href={resolve('/dashboard')}>Back to dashboard</Button>
		</div>
	</section>

	<section>
		{#if !data.patient.consent}
			<p
				class="mt-2 rounded-lg border border-destructive/35 bg-destructive/10 px-3 py-2 text-sm text-destructive"
			>
				You must provide consent on your dashboard before using the intake chat.
			</p>
		{/if}
	</section>

	<section>
		<Card.Root class="border border-border bg-card p-4 shadow-sm">
			<div class="max-h-112 space-y-2 overflow-auto pr-1">
				{#if chatMessages.length === 0}
					<p class="text-sm text-muted-foreground">No conversation yet. Send your first message.</p>
				{:else}
					{#each chatMessages as chat, idx (idx)}
						<article
							class={chat.role === 'user'
								? 'ml-96 rounded-xl border border-border bg-accent p-3 text-sm'
								: 'mr-96 rounded-xl border border-border bg-muted p-3 text-sm'}
						>
							<p class="mb-1 font-semibold">{chat.role === 'user' ? 'You' : 'Intake AI'}</p>
							<p>{chat.content}</p>
						</article>
					{/each}
				{/if}
			</div>

			<div class="mt-4 flex gap-2">
				<Input
					disabled={!data.patient.consent}
					bind:value={message}
					placeholder="Share what has been most difficult lately..."
				/>
				<Button type="button" onclick={sendMessage} disabled={!data.patient.consent || sending}
					>Send</Button
				>
			</div>
		</Card.Root>
	</section>
</main>
