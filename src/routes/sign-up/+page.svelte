<script lang="ts">
	import { resolve } from '$app/paths'
	import * as Card from '$lib/components/ui/card'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import * as Select from '$lib/components/ui/select'
	import { Spinner } from '$lib/components/ui/spinner'
	import { ROLE } from '$lib/generated/prisma/enums'
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

<main class="flex-1 space-y-4 py-4 w-full max-w-6xl mx-auto">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title class="text-primary uppercase font-bold">Create account</Card.Title>
			<Card.Description>
				Choose your role and complete registration to begin secure intake workflows.
			</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="POST" use:enhance>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} autocomplete="email" />
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
								autocomplete="new-password"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="firstName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>First Name</Form.Label>
							<Input {...props} bind:value={$formData.firstName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="lastName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Last Name</Form.Label>
							<Input {...props} bind:value={$formData.lastName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="role">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Role</Form.Label>
							<Select.Root {...props} type="single" name="role" bind:value={$formData.role}>
								<Select.Trigger class="w-full">
									{$formData.role}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Item value={ROLE.PATIENT} label="Patient">Patient</Select.Item>
										<Select.Item value={ROLE.CLINICIAN} label="Clinician">Clinician</Select.Item>
									</Select.Group>
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="w-full">
					{#if $submitting}
						<Spinner />
					{/if}
					{$submitting ? 'Creating account...' : 'Create account'}
				</Form.Button>
			</form>
		</Card.Content>

		<Card.Footer>
			<p class="mt-4 text-sm text-muted-foreground">
				Already have an account?
				<a class="font-semibold text-primary hover:text-primary/90" href={resolve('/sign-in')}
					>Sign in</a
				>.
			</p>
		</Card.Footer>
	</Card.Root>
</main>
