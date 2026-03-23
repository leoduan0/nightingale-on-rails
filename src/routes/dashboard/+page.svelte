<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Card } from '$lib/components/ui/card'
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import * as Select from '$lib/components/ui/select'
	import { GENDER, ROLE } from '../../generated/prisma/enums'
	import { formSchema } from './schema'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { defaults, superForm } from 'sveltekit-superforms'
	import { zod4 } from 'sveltekit-superforms/adapters'

	let { data } = $props()

	const form = superForm(defaults(zod4(formSchema)), {
		validators: zod4(formSchema),
		SPA: true,
		onUpdate: ({ form }) => {
			if (form.valid) {
				toast.success('Form submitted successfully!')
			} else {
				toast.error('Please fix the errors in the form.')
			}
		}
	})

	const { form: formData, enhance } = form

	onMount(() => {
		if (data.role !== ROLE.PATIENT || !data.patient.questionnaire) return
		const questionnaire = data.patient.questionnaire

		formData.update((current) => ({
			...current,
			age: questionnaire.age,
			gender: questionnaire.gender
		}))
	})
</script>

{#if data.role === ROLE.PATIENT}
	<section class="space-y-4">
		<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
			<h1 class="text-3xl font-bold">Patient Dashboard</h1>
			<p class="text-slate-600/95">
				Welcome back, {data.patient.firstName}.
			</p>
			{#if data.patient.clinicians.length > 0}
				<p class="mt-2 text-sm text-slate-600/95">
					Assigned clinician:
					<strong
						>{data.patient.clinicians[0].firstName} {data.patient.clinicians[0].lastName}</strong
					>
				</p>
			{/if}
		</Card>

		{#if !data.patient.consent}
			<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
				<h2 class="text-xl font-bold">Consent Required</h2>
				<p class="text-slate-700">
					By continuing, you consent to collection and processing of your demographic intake and
					chatbot messages for clinical intake and care coordination. Your data can be reviewed by
					authorized clinicians.
				</p>
				<form method="POST" action="?/saveConsent" class="mt-3">
					<Button type="submit">I understand and consent</Button>
				</form>
			</Card>
		{/if}

		<div class="grid gap-4 md:grid-cols-2">
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

			<Card class="border border-sky-100/80 bg-white/90 p-4 shadow-sm shadow-sky-900/10">
				<h2 class="text-xl font-bold">AI Intake Chat</h2>
				<a href="/dashboard/chat">
					<Button type="button" disabled={!data.patient.consent}>Open AI intake chat</Button>
				</a>
				<p>
					Chat freely with the Intake AI about anything related to why you are seeking out help.
					Share as little or as much as you'd like. There is absolutely no pressure.
				</p>
				<p>
					Intake AI will not be giving an official diagnosis or attempt at therapy, but will listen
					attentively and ask probing questions to learn more about you to provide the best
					information for your clinician.
				</p>
			</Card>
		</div>
	</section>
{:else}
	<section class="space-y-4">
		<Card class="border border-sky-100/80 bg-white/90 shadow-sm shadow-sky-900/10">
			<h1 class="text-3xl font-bold">Clinician Dashboard</h1>
			<p class="text-slate-600/95">
				Welcome, Dr. {data.clinician.lastName}. Search, filter, and review your assigned patients.
			</p>
			<form method="GET" class="mt-4 grid gap-3 sm:grid-cols-4">
				<label class="space-y-1 sm:col-span-2">
					<span class="text-sm font-semibold">Search by first or last name</span>
					<Input name="q" value={data.filters.search} placeholder="e.g. Jordan" />
				</label>
				<label class="space-y-1">
					<span class="text-sm font-semibold">Sort by</span>
					<Select.Root type="single" name="sort">
						<Select.Trigger class="w-45">Sort</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Item value="firstName" label="firstName">First Name</Select.Item>
								<Select.Item value="lastName" label="lastName">Last Name</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</label>
				<label class="space-y-1">
					<span class="text-sm font-semibold">Direction</span>
					<Select.Root type="single" name="direction">
						<Select.Trigger class="w-45">Direction</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Item value="ascending" label="Ascending">Ascending</Select.Item>
								<Select.Item value="descending" label="Descending">Descending</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</label>
				<Button type="submit" class="sm:col-span-4">Apply filters</Button>
			</form>
		</Card>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#if data.patients.length === 0}
				<Card class="border border-sky-100/80 bg-white/90 shadow-sm shadow-sky-900/10">
					<p class="text-slate-600">No assigned patients match your filters yet.</p>
				</Card>
			{:else}
				{#each data.patients as patient (patient.id)}
					<Card class="border border-sky-100/80 bg-white/90 shadow-sm shadow-sky-900/10">
						<h2 class="text-xl font-bold">{patient.firstName} {patient.lastName}</h2>
						<p class="text-sm text-slate-600">Email: {patient.email}</p>
						<p class="text-sm text-slate-600">
							Questionnaire: {patient.questionnaire ? 'Completed' : 'Pending'}
						</p>
						<p class="text-sm text-slate-600">
							Chat ended: {patient.conversation?.endedAt ? 'Yes' : 'No'}
						</p>
						<a
							class="mt-2 inline-block font-semibold text-sky-700 hover:text-sky-800"
							href={`/dashboard/patients/${patient.id}`}>Open profile</a
						>
					</Card>
				{/each}
			{/if}
		</div>
	</section>
{/if}
