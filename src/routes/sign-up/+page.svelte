<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import * as Select from '$lib/components/ui/select'
	import { ROLE } from '../../generated/prisma/enums'
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

	const { form: formData, enhance } = form
</script>

<section class="mx-auto max-w-xl">
	<div
		class="rounded-3xl border border-sky-100/90 bg-white/90 p-6 shadow-lg shadow-sky-900/10 sm:p-8"
	>
		<p class="text-sm font-bold tracking-wide text-sky-700 uppercase">Create account</p>
		<h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
			Start your intake journey
		</h1>
		<p class="mt-2 text-sm text-slate-600">
			Choose your role and complete registration to begin secure intake workflows.
		</p>

		<form method="POST" use:enhance class="mt-6 space-y-4">
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
									<Select.Label>Account Role</Select.Label>
									<Select.Item value={ROLE.PATIENT} label="Patient">Patient</Select.Item>
									<Select.Item value={ROLE.CLINICIAN} label="Clinician">Clinician</Select.Item>
								</Select.Group>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button class="w-full">Create account</Form.Button>
		</form>

		<p class="mt-4 text-sm text-slate-600">
			Already have an account?
			<a class="font-semibold text-sky-700 hover:text-sky-800" href="/sign-in">Sign in</a>.
		</p>
	</div>
</section>
