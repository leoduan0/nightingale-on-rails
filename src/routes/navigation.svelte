<script lang="ts">
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { APP_NAME } from '$lib/constants'
	import ThemeToggle from './theme-toggle.svelte'

	const nav = [
		{ href: '/', label: 'Home' },
		{ href: '/privacy-policy', label: 'Privacy Policy' },
		{ href: '/terms-of-service', label: 'Terms of Service' }
	] as const
</script>

<header class="sticky top-0 z-10 border-b border-border/80 bg-background/86 backdrop-blur-xl">
	<div
		class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
	>
		<a href={resolve('/')} class="text-lg font-extrabold tracking-tight text-foreground"
			>{APP_NAME}</a
		>

		<nav class="flex flex-wrap items-center gap-2">
			{#each nav as item (item.href)}
				<a
					class={page.url.pathname === item.href
						? 'rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground ring-1 ring-border'
						: 'rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
					href={resolve(item.href)}>{item.label}</a
				>
			{/each}

			{#if page.data.session}
				<a
					class="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
					href={resolve('/dashboard')}>Dashboard</a
				>

				<form method="POST" action="/sign-out" class="inline">
					<Button
						type="submit"
						class="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-accent"
						>Sign out</Button
					>
				</form>
			{:else}
				<a
					class="rounded-full border border-primary bg-background px-3 py-1.5 text-sm font-semibold text-primary"
					href={resolve('/sign-in')}>Sign in</a
				>
				<a
					class="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
					href={resolve('/sign-up')}>Sign up</a
				>
			{/if}
			<ThemeToggle />
		</nav>
	</div>
</header>
