<script lang="ts">
	import { page } from '$app/state'

	const nav = [
		{ href: '/', label: 'Home' },
		{ href: '/privacy-policy', label: 'Privacy Policy' },
		{ href: '/terms-of-service', label: 'Terms of Service' }
	]
</script>

<header class="sticky top-0 z-10 border-b border-sky-200/80 bg-white/86 backdrop-blur-xl">
	<div
		class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
	>
		<a href="/" class="text-lg font-extrabold tracking-tight text-slate-800">Nightingale on Rails</a
		>

		<nav class="flex flex-wrap items-center gap-2">
			{#each nav as item (item.href)}
				<a
					class={page.url.pathname === item.href
						? 'rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-800 ring-1 ring-sky-200'
						: 'rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-800'}
					href={item.href}>{item.label}</a
				>
			{/each}

			{#if page.data.session}
				<a
					class="rounded-full bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-sky-900/20 hover:bg-sky-800"
					href="/dashboard">Dashboard</a
				>

				<form method="POST" action="/sign-out" class="inline">
					<button
						type="submit"
						class="cursor-pointer rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-sky-50"
						>Sign out</button
					>
				</form>
			{:else}
				<a
					class="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm font-semibold text-sky-800 hover:bg-sky-50"
					href="/sign-in">Sign in</a
				>
				<a
					class="rounded-full bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-sky-900/20 hover:bg-sky-800"
					href="/sign-up">Sign up</a
				>
			{/if}
		</nav>
	</div>
</header>
