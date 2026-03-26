<script lang="ts">
	import { resolve } from '$app/paths'
	import { APP_NAME, SUPPORT_EMAIL } from '$lib/constants'

	const year = new Date().getFullYear()
	const productLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Dashboard', href: '/dashboard' }
	] as const
	const legalLinks = [
		{ label: 'Privacy Policy', href: '/privacy-policy' },
		{ label: 'Terms of Service', href: '/terms-of-service' }
	] as const
</script>

<footer class="t-12 border-t border-border/80 bg-card/60 backdrop-blur-sm">
	<div class="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
		<section class="space-y-3 lg:col-span-2">
			<p class="text-sm font-semibold tracking-wide text-primary uppercase">{APP_NAME}</p>
			<h2 class="text-xl font-bold text-foreground">Secure, clinician-ready intake workflows.</h2>
			<p class="max-w-xl text-sm leading-relaxed text-muted-foreground">
				Built for patient trust and operational clarity, from first conversation to summary review.
			</p>
		</section>

		<section class="space-y-3">
			<h3 class="text-sm font-semibold text-foreground">Product</h3>
			<ul class="space-y-2 text-sm text-muted-foreground">
				{#each productLinks as link (link.href)}
					<li>
						<a class="transition-colors hover:text-primary" href={resolve(link.href)}
							>{link.label}</a
						>
					</li>
				{/each}
			</ul>
		</section>

		<section class="space-y-3">
			<h3 class="text-sm font-semibold text-foreground">Legal</h3>
			<ul class="space-y-2 text-sm text-muted-foreground">
				{#each legalLinks as link (link.href)}
					<li>
						<a class="transition-colors hover:text-primary" href={resolve(link.href)}
							>{link.label}</a
						>
					</li>
				{/each}
				<li>
					<a class="transition-colors hover:text-primary" href={`mailto:${SUPPORT_EMAIL}`}
						>Contact Support</a
					>
				</li>
			</ul>
		</section>
	</div>

	<div class="border-t border-border/70">
		<div
			class="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
		>
			<p>&copy; {year} {APP_NAME}. All rights reserved.</p>
			<p>Designed for secure and compassionate care coordination.</p>
		</div>
	</div>
</footer>
