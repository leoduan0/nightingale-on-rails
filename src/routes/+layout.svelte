<script lang="ts">
	import { invalidate } from '$app/navigation'
	// import favicon from '$lib/assets/favicon.svg'
	import { Toaster } from '$lib/components/ui/sonner'
	import { APP_NAME, APP_DESCRIPTION } from '$lib/constants'
	import Footer from './footer.svelte'
	import './layout.css'
	import Navigation from './navigation.svelte'
	import { ModeWatcher } from 'mode-watcher'
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
	<title>{APP_NAME}</title>
	<meta name="description" content={APP_DESCRIPTION} />
</svelte:head>

<Toaster />
<ModeWatcher />

<div class="min-h-screen bg-background flex flex-col">
	<Navigation />
	{@render children()}
	<Footer />
</div>
