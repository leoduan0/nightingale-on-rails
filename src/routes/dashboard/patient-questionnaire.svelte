<script lang="ts">
	import { Card } from '$lib/components/ui/card'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import * as Select from '$lib/components/ui/select'
	import { GENDER } from '../../generated/prisma/enums'

	let { form, formData, enhance } = $props()
</script>

<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
	<h2 class="text-xl font-bold">Demographics Questionnaire</h2>
	<form method="POST" action="?/submitQuestionnaire" class="w-2/3 space-y-6" use:enhance>
		<Form.Field {form} name="age">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Age</Form.Label>
					<Input {...props} type="number" bind:value={$formData.age} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="gender">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Gender</Form.Label>
					<Select.Root {...props} type="single" name="gender" bind:value={$formData.gender}>
						<Select.Trigger class="w-45">{$formData.gender}</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Item value={GENDER.FEMALE} label={GENDER.FEMALE}>Female</Select.Item>
								<Select.Item value={GENDER.MALE} label={GENDER.MALE}>Male</Select.Item>
								<Select.Item value={GENDER.OTHER} label={GENDER.OTHER}>Other</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
</Card>
