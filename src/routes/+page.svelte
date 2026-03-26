<script lang="ts">
	import { resolve } from '$app/paths'
	import { APP_NAME } from '$lib/constants'
</script>

<main class="flex-1 space-y-4 py-4 max-w-6xl mx-auto w-full">
	<section
		class="overflow-hidden rounded-3xl border border-border bg-card/82 p-8 shadow-lg backdrop-blur"
	>
		<div class="grid items-center gap-4 md:grid-cols-2">
			<div>
				<p class="m-0 font-bold text-primary">Mental Health Intake, Reimagined</p>
				<h1 class="mt-2 mb-4 text-4xl leading-tight font-extrabold tracking-tight md:text-5xl">
					From first conversation to clinician-ready insight.
				</h1>
				<p class="max-w-prose text-lg text-muted-foreground">
					{APP_NAME} helps patients share context safely through guided conversation and structured intake,
					then delivers editable summaries for clinicians.
				</p>
				<div class="mt-5 flex flex-wrap gap-3">
					<a
						class="bg-primary text-primary-foreground rounded-full px-4 py-3 font-semibold no-underline shadow-sm"
						href={resolve('/sign-up')}
					>
						Start intake
					</a>
					<a
						class="bg-secondary text-secondary-foreground rounded-full border px-4 py-3 font-semibold no-underline"
						href={resolve('/sign-up')}>Sign in</a
					>
				</div>
			</div>
			<div class="rounded-2xl border border-border bg-linear-to-br from-muted to-accent p-5">
				<h2 class="mt-0 text-xl font-bold">How it works</h2>
				<ol class="grid list-decimal gap-2 pl-5 text-muted-foreground">
					<li>Patient gives consent and completes demographic intake.</li>
					<li>AI asks probing follow-up questions and captures context.</li>
					<li>Patient reviews and edits generated summaries.</li>
					<li>Clinician reviews patient details, triage labels, and exports a PDF.</li>
				</ol>
			</div>
		</div>
	</section>
</main>
