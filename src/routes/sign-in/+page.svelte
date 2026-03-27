<script lang="ts">
	import { resolve } from '$app/paths'
	import * as Card from '$lib/components/ui/card'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { Spinner } from '$lib/components/ui/spinner'
	import { APP_NAME } from '$lib/constants'
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

	const { form: formData, enhance, submitting } = form
</script>

<main class="flex-1 space-y-4 py-4 lg:max-w-6xl lg:mx-auto max-w-full mx-4">
	<Card.Root>
		<Card.Header>
			<Card.Title class="font-bold uppercase text-primary">Sign in</Card.Title>
			<Card.Description>
				Your intake records are private and only visible to authorized clinicians and you.
			</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="POST" use:enhance>
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
					{#if $submitting}
						<Spinner />
					{/if}
					{$submitting ? 'Signing in...' : 'Sign in'}
				</Form.Button>
			</form>
		</Card.Content>

		<Card.Footer>
			<p class="mt-4 text-sm text-muted-foreground">
				New to {APP_NAME}?
				<a class="font-semibold text-primary hover:text-primary/90" href={resolve('/sign-up')}
					>Create an account</a
				>.
			</p>
		</Card.Footer>
	</Card.Root>
</main>
