<script lang="ts">
	import { invalidate } from '$app/navigation'
	// import favicon from '$lib/assets/favicon.svg'
	import { Toaster } from '$lib/components/ui/sonner'
	import './layout.css'
	import Navigation from './navigation.svelte'
	import { onMount } from 'svelte'

	let { data, children } = $props()
	let { supabase, session } = $derived(data)
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
	<title>Nightingale on Rails</title>
</svelte:head>

<Toaster />

<div class="min-h-screen text-slate-900">
	<Navigation />

	<main class="mx-auto w-full max-w-6xl px-4 py-8">{@render children()}</main>
</div>
