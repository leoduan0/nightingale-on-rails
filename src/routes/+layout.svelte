<script lang="ts">
	import './layout.css'
	import { invalidate } from '$app/navigation'
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

	import { page } from '$app/stores'
	// import favicon from '$lib/assets/favicon.svg'
	import './layout.css'

	const nav = [
		{ href: '/', label: 'Home' },
		{ href: '/privacy-policy', label: 'Privacy Policy' },
		{ href: '/terms-of-service', label: 'Terms of Service' }
	]
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
	<title>Nightingale on Rails</title>
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-amber-50 via-cyan-50 to-sky-100 text-slate-900">
	<header class="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
		<div
			class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<a href="/" class="text-lg font-bold tracking-tight text-slate-900">Nightingale on Rails</a>

			<nav class="flex flex-wrap items-center gap-2">
				{#each nav as item (item.href)}
					<a
						class={$page.url.pathname === item.href
							? 'rounded-md bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-900'
							: 'rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
						href={item.href}>{item.label}</a
					>
				{/each}

				{#if $page.data.session}
					<a
						class="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-800"
						href="/dashboard">Dashboard</a
					>

					<form method="POST" action="/sign-out" class="inline">
						<button
							type="submit"
							class="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
							>Sign out</button
						>
					</form>
				{:else}
					<a
						class="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-800"
						href="/sign-in">Sign in</a
					>
					<a
						class="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-800"
						href="/sign-up">Sign up</a
					>
				{/if}
			</nav>
		</div>
	</header>

	<main class="mx-auto w-full max-w-6xl px-4 py-6">{@render children()}</main>
</div>
