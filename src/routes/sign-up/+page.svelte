<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import { Select } from '$lib/components/ui/select'
	import { formSchema, type FormSchema } from './schema'
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms'
	import { zod4Client } from 'sveltekit-superforms/adapters'

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props()

	const form = superForm(data.form, {
		validators: zod4Client(formSchema)
	})

	const { form: formData, enhance } = form
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input {...props} bind:value={$formData.password} type="password" />
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
				<Select {...props} bind:value={$formData.role} type="single">
					<option value="PATIENT">Patient</option>
					<option value="CLINICIAN">Clinician</option>
				</Select>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
