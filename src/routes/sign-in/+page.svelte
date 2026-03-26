<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { type FormSchema, formSchema } from './schema'
	import { toast } from 'svelte-sonner'
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
	import { zod4Client } from 'sveltekit-superforms/adapters'

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props()

	const form = superForm(data.form, {
		validators: zod4Client(formSchema),
		onUpdate: ({ form }) => {
			if (form.valid) {
				toast.success(String(form.message))
			} else {
				toast.error(String(form.message))
			}
		}
	})

	const { form: formData, enhance, message, submitting } = form
</script>

<section class="mx-auto max-w-xl">
	<div
		class="rounded-3xl border border-sky-100/90 bg-white/90 p-6 shadow-lg shadow-sky-900/10 sm:p-8"
	>
		<p class="text-sm font-bold tracking-wide text-sky-700 uppercase">Welcome back</p>
		<h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
			Sign in to continue care
		</h1>
		<p class="mt-2 text-sm text-slate-600">
			Your intake records are private and only visible to authorized clinicians and you.
		</p>

		<form method="POST" use:enhance class="mt-6 space-y-4">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$formData.email} type="email" autocomplete="email" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input
							{...props}
							bind:value={$formData.password}
							type="password"
							autocomplete="current-password"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button disabled={$submitting} class="w-full">
				{$submitting ? 'Signing in...' : 'Sign in'}
			</Form.Button>
		</form>

		<p class="mt-4 text-sm text-slate-600">
			New to Nightingale on Rails?
			<a class="font-semibold text-sky-700 hover:text-sky-800" href="/sign-up">Create an account</a
			>.
		</p>
	</div>
</section>
