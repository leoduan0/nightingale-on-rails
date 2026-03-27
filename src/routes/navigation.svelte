<script lang="ts">
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { APP_NAME } from '$lib/constants'
	import ThemeToggle from './theme-toggle.svelte'
	import { MenuIcon } from '@lucide/svelte'

	const nav = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' }
	] as const

	let mobileMenuOpen = $state(false)

	const closeMobileMenu = () => {
		mobileMenuOpen = false
	}
	const toggleMobileMenu = () => {
		mobileMenuOpen = !mobileMenuOpen
	}
</script>

<header class="sticky top-0 z-10 border-b border-border/80 bg-background/86 backdrop-blur-xl">
	<div class="mx-auto w-full max-w-6xl px-4 py-2 lg:flex lg:justify-between">
		<div class="flex items-center justify-between gap-3">
			<a href={resolve('/')} class="text-lg font-extrabold tracking-tight text-foreground"
				>{APP_NAME}</a
			>

			<div class="flex items-center gap-2 sm:hidden">
				<ThemeToggle />
				<Button
					type="button"
					class="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-accent"
					aria-expanded={mobileMenuOpen}
					aria-controls="site-nav"
					onclick={toggleMobileMenu}
				>
					<MenuIcon />
				</Button>
			</div>
		</div>

		<nav
			id="site-nav"
			class={`mt-3 w-full flex-col gap-2 ${mobileMenuOpen ? 'flex' : 'hidden'} sm:mt-0 sm:flex sm:w-auto sm:flex-row sm:items-center sm:justify-end`}
		>
			{#each nav as item (item.href)}
				<a
					class={page.url.pathname === item.href
						? 'rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground ring-1 ring-border'
						: 'rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
					href={resolve(item.href)}
					onclick={closeMobileMenu}>{item.label}</a
				>
			{/each}

			{#if page.data.session}
				<a
					class="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
					href={resolve('/dashboard')}
					onclick={closeMobileMenu}>Dashboard</a
				>

				<form method="POST" action="/sign-out" class="inline">
					<Button
						type="submit"
						class="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-accent"
						onclick={closeMobileMenu}>Sign out</Button
					>
				</form>
			{:else}
				<a
					class="rounded-full border border-primary bg-background px-3 py-1.5 text-sm font-semibold text-primary"
					href={resolve('/sign-in')}
					onclick={closeMobileMenu}>Sign in</a
				>
				<a
					class="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
					href={resolve('/sign-up')}
					onclick={closeMobileMenu}>Sign up</a
				>
			{/if}
		</nav>
	</div>
</header>
