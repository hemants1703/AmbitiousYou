<script lang="ts">
	import { ambitions } from '$lib/mockDB';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import {
		CircleHelp,
		CircleCheckBig,
		LoaderPinwheel,
		Check,
		CalendarArrowUp,
		CircleSlash
	} from 'lucide-svelte';
	// import { page } from '$app/stores';
	// import * as Tabs from '$lib/components/ui/tabs';
	import type { PageData } from './$types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ListPlus, MessageSquareDiff, X, InfoIcon } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svoast';
	import type { AmbitionNoteType, AmbitionTaskType, AmbitionType } from '$lib/types/ambitionType';
	import { ChevronLeft } from 'svelte-radix';
	import Trash_2 from 'lucide-svelte/icons/trash-2';
	import type { ActionData } from '../$types';
	import { afterUpdate } from 'svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import AmbitionStatsContainer from '$lib/components/AmbitionStatsContainer.svelte';
	import AmbitionLoader from '$lib/components/AmbitionLoader.svelte';

	export let form: ActionData;
	export let data: PageData;
	// console.log('view ambitions page data: ', data);

	$: if (form) {
		console.log('form data: ', form);
		if (!form.success) {
			toast.error(form.message);
			if (form.message === 'Error deleting Ambition') deleteButtonClicked = false;
		} else {
			toast.success(form.message);
		}
	}

	const ambitionData: AmbitionType = data.body as AmbitionType;

	const daysLeft = Math.floor(
		(new Date(ambitionData.ambitionEndDate).getTime() - new Date().getTime()) /
			(1000 * 60 * 60 * 24)
	);

	let taskName: string = '';
	let taskDescription: string = '';

	let noteContent: string = '';

	let ambitionCompletionDate: string | null =
		ambitionData.ambitionCompletionDate === null
			? 'Incomplete Ambition!'
			: new Date(ambitionData.ambitionCompletionDate).toLocaleDateString();

	const ambitionStartDate: string = new Date(ambitionData.ambitionStartDate).toLocaleDateString();
	const ambitionEndDate: string = new Date(ambitionData.ambitionEndDate).toLocaleDateString();

	let ambitionTasks = ambitionData.ambitionTasks.map((task) => JSON.parse(task));
	// const ambitionTags = JSON.parse(ambitionData.ambitionTags);
	let ambitionNotes: AmbitionNoteType[] = ambitionData.ambitionNotes.map((note) =>
		JSON.parse(note)
	);
	const ambitionStatus: string =
		ambitionData.ambitionStatus[0].toUpperCase() + ambitionData.ambitionStatus.slice(1);
	const ambitionPriority: string =
		ambitionData.ambitionPriority[0].toUpperCase() + ambitionData.ambitionPriority.slice(1);
	const ambitionCategory: string =
		ambitionData.ambitionCategory[0].toUpperCase() + ambitionData.ambitionCategory.slice(1);

	const finishedAmbitionTasks: AmbitionTaskType[] =
		ambitionTasks.length > 0 ? ambitionTasks.filter((task) => task.checked) : [];
	let totalAmbitionTasks: number = ambitionTasks.length;

	let percentageCompleted: number =
		ambitionStatus === 'Completed' && totalAmbitionTasks === 0
			? 100
			: totalAmbitionTasks === 0
				? 0
				: Math.floor((finishedAmbitionTasks.length / totalAmbitionTasks) * 100);

	let askForUpdation = false;
	let askForCompleteUpdation = false;
	let updateAmbitionEnabled = false;
	let askBeforeDeletion = false;
	let deletingAnimation = false;
	let updatingAmbition = false;

	let deleteButtonClicked = false;

	let updatedAmbitionStatus: string = ambitionStatus;

	async function submitAmbitionUpdates() {
		const currentAmbitionStatus = ambitionData.ambitionStatus;
		const currentAmbitionTasks = ambitionData.ambitionTasks;
		const currentAmbitionNotes = ambitionData.ambitionNotes;

		if (
			currentAmbitionNotes === ambitionNotes &&
			currentAmbitionTasks === ambitionTasks &&
			currentAmbitionStatus === updatedAmbitionStatus
		) {
			toast.info('No changes made to the Ambition!');
			return;
		}

		if (updatedAmbitionStatus === 'Completed') {
			ambitionCompletionDate = new Date().toLocaleDateString();
		} else {
			ambitionCompletionDate = null;
		}

		ambitionData.ambitionStatus = updatedAmbitionStatus;
		ambitionData.ambitionTasks = ambitionTasks.filter((task) => JSON.stringify(task));
		ambitionData.ambitionNotes = ambitionNotes.filter((note) => JSON.stringify(note));
		ambitionData.ambitionCompletionDate = ambitionCompletionDate;

		// console.log('Updating ambitions: ', ambitionData);

		try {
			let response = await fetch('/api/updateAmbition', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(ambitionData)
			});

			// console.log('Ambition updated successfully: ', response);

			// response = await response.json();

			if (response.ok) {
				const data = await response.json();
				// console.log('Ambition updated successfully: ', data);
				toast.success('Ambition updated successfully!');
			} else {
				ambitionData.ambitionStatus = currentAmbitionStatus;
				ambitionData.ambitionTasks = currentAmbitionTasks;
				ambitionData.ambitionNotes = currentAmbitionNotes;
				console.error('Error updating Ambition: ', response);
				toast.error('Error updating Ambition');
			}
		} catch (error) {
			console.error('Error updating Ambition: ', error);
			toast.error('Error updating Ambition');
		}

		askForCompleteUpdation = false;
		updatingAmbition = false;
	}

	function handleNewTaskAddition() {
		const newAmbitionTask = {
			id: ambitionTasks.length,
			name: taskName,
			description: taskDescription,
			checked: false
		};

		ambitionTasks = [...ambitionTasks, newAmbitionTask];

		totalAmbitionTasks++;
		taskName = '';
		taskDescription = '';
	}

	function handleRemoveAmbitionTask(taskId: number) {
		ambitionTasks = ambitionTasks.filter((task) => task.id !== taskId);
		totalAmbitionTasks--;
	}

	function handleNewNoteAddition() {
		const newAmbitionNote = {
			id: ambitionNotes.length,
			content: noteContent,
			created_at: new Date().toISOString()
		};

		ambitionNotes = [...ambitionNotes, newAmbitionNote];

		noteContent = '';
	}

	function handleRemoveAmbitionNote(noteId: number) {
		console.log('Notes: ', ambitionNotes);

		ambitionNotes = ambitionNotes.filter((note) => note.id !== noteId);
	}

	function updateAmbitionDetails() {
		const totalAmbitionTasks = ambitionTasks.length;
		const finishedAmbitionTasks = ambitionTasks.filter((task) => task.checked);

		if (finishedAmbitionTasks.length === totalAmbitionTasks) {
			ambitionCompletionDate = new Date().toLocaleDateString();
			updatedAmbitionStatus = 'completed';
		} else if (finishedAmbitionTasks.length === 0) {
			ambitionCompletionDate = 'Incomplete Ambition!';
			updatedAmbitionStatus = 'future';
		} else {
			ambitionCompletionDate = 'Incomplete Ambition!';
			updatedAmbitionStatus = 'ongoing';
		}

		percentageCompleted = Math.floor((finishedAmbitionTasks.length / totalAmbitionTasks) * 100);
	}
</script>

<svelte:head>
	<title>{ambitionData.ambitionName} - AmbitiousYou!</title>
	<meta name="description" content={ambitionData.ambitionDefinition} />
</svelte:head>

<!-- MODALS THAT ASK FOR PERMISSIONS TO MAKE CHANGES/UPDATE THE AMBITION AND CONFIRMATION -->
{#if askForUpdation}
	<div class="fixed inset-0 bg-background bg-opacity-90 z-10">
		<div class="animate-dropDown fixed inset-0 flex justify-center items-center">
			<div class="border bg-background p-5 max-sm:mx-10 rounded-lg shadow-lg max-w-lg">
				<h1 class="text-xl font-bold flex gap-2">
					Are you sure you want to update this Ambition?
					<CircleHelp class="text-yellow-500 w-8 h-8" />
				</h1>
				<h2 class="text-muted-foreground text-sm mt-2">
					Updating Ambitions allows you to make updates & changes to your tasks and notes and update
					them as per your requirements!
				</h2>
				<div class="flex justify-end gap-2 mt-5">
					<button
						id="secondaryButton"
						class="hover:bg-[--custom-dark] px-4 py-1 text-foreground rounded-lg"
						on:click|preventDefault={() => (askForUpdation = false)}
					>
						No
					</button>
					<button
						id="primaryButton"
						class="bg-[--custom-light] hover:bg-[--custom-light] hover:brightness-110 active:brightness-90 text-black px-4 py-1 rounded-lg"
						on:click|preventDefault={() => {
							updateAmbitionEnabled = true;
							askForUpdation = false;
							// handleAmbitionUpdation();
						}}
					>
						Yes
					</button>
				</div>
			</div>
		</div>
	</div>
{:else if askForCompleteUpdation}
	<div class="fixed inset-0 bg-background bg-opacity-90 z-10">
		<div class="animate-dropDown fixed inset-0 flex justify-center items-center">
			<div class="border bg-background p-5 max-sm:mx-10 rounded-lg shadow-lg max-w-lg">
				<h1 class="text-xl font-bold flex gap-2">
					Are your updates to this Ambition Complete?
					<Check class="text-[#10b981] w-8 h-8" />
				</h1>
				<h2 class="text-muted-foreground text-sm mt-2">
					Completing Ambitions allows you to finalize your updates and changes to your tasks and
					notes and update them as per your requirements!
				</h2>
				<div class="flex justify-end gap-2 mt-5">
					<button
						id="secondaryButton"
						class="hover:bg-[--custom-dark] px-4 py-1 text-foreground rounded-lg"
						on:click|preventDefault={() => (askForCompleteUpdation = false)}
					>
						No
					</button>
					<button
						id="primaryButton"
						class="flex justify-center items-center gap-2 bg-[--custom-light] hover:bg-[--custom-light] hover:brightness-110 active:brightness-90 text-black px-4 py-1 rounded-lg"
						on:click|preventDefault={() => {
							updateAmbitionEnabled = false;

							updatingAmbition = true;
							submitAmbitionUpdates();
						}}
					>
						{#if updatingAmbition}
							<span class="animate-spin"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path
										d="m16.2 16.2 2.9 2.9"
									/><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path
										d="m4.9 4.9 2.9 2.9"
									/></svg
								></span
							>
							Updating Ambition...
						{:else}
							Update
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if askBeforeDeletion}
	<div class="fixed inset-0 bg-background bg-opacity-90 z-10">
		<div class="animate-dropDown fixed inset-0 flex justify-center items-center">
			<div class="border bg-background p-5 max-sm:mx-10 rounded-lg shadow-lg max-w-lg">
				<h1 class="text-xl font-bold flex gap-2">
					Are you sure you want to delete this Ambition?
					<CircleHelp class="text-red-500 w-8 h-8" />
				</h1>
				<h2 class="text-muted-foreground text-sm mt-2">
					Deleting Ambitions will remove all the tasks, notes, and details associated with this
					Ambition. This action is irreversible!
				</h2>
				<div class="flex justify-end gap-2 mt-5">
					<button
						class="hover:bg-[--custom-dark] px-4 py-1 text-foreground rounded-lg"
						on:click|preventDefault={() => {
							askBeforeDeletion = false;
							deleteButtonClicked = false;
						}}
					>
						No
					</button>
					<form
						action="?/deleteAmbition"
						method="POST"
						use:enhance={() => {
							deleteButtonClicked = true;
							deletingAnimation = true;
						}}
					>
						<button
							class="flex gap-2 justify-center items-center bg-red-200 hover:bg-red-500 hover:text-white active:bg-red-700 text-red-500 px-4 py-1 rounded-lg"
						>
							{#if deletingAnimation}
								<span class="animate-spin"
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path
											d="m16.2 16.2 2.9 2.9"
										/><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path
											d="m4.9 4.9 2.9 2.9"
										/></svg
									></span
								>
								Deleting Ambition...
							{:else}
								Yes
							{/if}
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- BACK BUTTON -->
{#if !updateAmbitionEnabled}
	<div class="w-full flex justify-between items-start gap-5">
		<a
			href="/all_ambitions"
			class="inline-flex justify-start items-center opacity-50 mb-5 hover:opacity-100 active:opacity-30 transition-all duration-300 ease-in-out"
			><ChevronLeft />Back</a
		>
		<Tooltip.Root>
			<Tooltip.Trigger><InfoIcon class="w-5 h-5 opacity-50" /></Tooltip.Trigger>
			<Tooltip.Content>
				<p>
					To make any changes to your Ambition, you need to go to Update mode by clicking the "<b
						>Update Ambition</b
					>" button below
				</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
{/if}

<div class="flex flex-col gap-5 pb-20">
	<header class="flex max-sm:flex-col justify-between items-center gap-5">
		<div>
			<h1 class="font-bold text-3xl max-sm:text-center">
				{ambitionData.ambitionName}
				<Badge
					class="bg-[--custom-dark] hover:bg[--custom-light] text-white hover:dark:text-black px-2 py-px -translate-y-1.5 rounded-full"
					>{ambitionData.ambitionCategory.toUpperCase()}</Badge
				>
			</h1>
			{#if ambitionData.ambitionDefinition.trim().length > 0}
				<p class="text-muted-foreground text-md max-sm:text-center">
					{ambitionData.ambitionDefinition}
				</p>
			{/if}
		</div>
		<div class="flex gap-2">
			<!-- {#each JSON.parse(ambitionData.tags) as tag, idx}
				<Badge>{tag}</Badge>
			{/each} -->
			<button
				id="primaryButton"
				class="text-[--custom-light] hover:brightness-110"
				on:click|preventDefault={() => {
					if (!askForUpdation && !updateAmbitionEnabled) askForUpdation = !askForUpdation;
					if (updateAmbitionEnabled) {
						askForCompleteUpdation = true;
					}
				}}
			>
				{#if updateAmbitionEnabled}
					<span>Complete Updation</span>
				{:else}
					<span>Update Ambition</span>
				{/if}
			</button>
		</div>
	</header>
	<!-- AMBITION PERCENTAGE COMPLETE PROGRESS BAR ANIMATION -->
	<AmbitionLoader {percentageCompleted} />
	<section class="grid lg:grid-cols-2 gap-5 w-full">
		<div class="w-full flex flex-col gap-10">
			<!-- AMBITION TASKS SECTION  -->
			<div>
				<div
					class="flex flex-col border-2 border-[--custom-light-pale] bg-[--custom-light-pale] rounded-xl overflow-hidden"
				>
					<h1 class="font-extrabold text-sm p-2 text-center">TASKS TO ACCOMPLISH YOUR AMBITION</h1>
					<div
						class="p-3 bg-background rounded-lg max-h-96 space-y-4 overflow-y-auto overflow-x-hidden"
					>
						{#if ambitionTasks.length === 0}
							<p class="text-muted-foreground text-center">No tasks added yet!</p>
						{:else}
							{#each ambitionTasks as task, idx}
								<div
									class="{updateAmbitionEnabled
										? 'animate-ambitionEditModeAnimation relative'
										: ''} {task.checked
										? 'bg-lime-100 dark:bg-lime-950 border-lime-500'
										: 'border-[--custom-light]'} flex items-center space-x-3 p-4 border rounded-lg shadow-sm"
								>
									{#if updateAmbitionEnabled}
										<Checkbox
											id={typeof task.id !== 'string' ? task.id.toString() : task.id}
											onCheckedChange={() => {
												task.checked = !task.checked;
												updateAmbitionDetails();
											}}
											checked={task.checked}
											aria-labelledby="ambitionTasks-checkbox-label"
										/>
										<!-- <button
											on:click={() => handleRemoveAmbitionTask(task.id)}
											type="button"
											class="absolute top-px right-px bg-red-500 hover:brightness-150 active:bg-red-800 rounded-full p-px"
											><X size="20" /></button
										> -->
									{:else if task.checked}
										<CircleCheckBig class="text-lime-500" size="30" />
									{:else}
										<span class="text-muted-foreground text-xl">{idx + 1}</span>
									{/if}
									<Label
										for={updateAmbitionEnabled
											? typeof task.id !== 'string'
												? task.id.toString()
												: task.id
											: ''}
										class="{task.checked ? 'opacity-60' : ''} text-sm font-medium"
									>
										<h2 class="text-lg font-medium">{task.name}</h2>
										<p class="text-sm text-muted-foreground whitespace-pre-wrap">
											{task.description}
										</p>
									</Label>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			{#if updateAmbitionEnabled}
				<div>
					<h2 class="text-xl font-semibold mb-4">Add a new Task</h2>
					<div class=" border rounded-xl p-4">
						<!-- ADD A NEW TASK TO AMBITION SECTION -->
						<!-- <form
							action="?/addNewTaskForAmbition"
							method="POST"
							use:enhance={() => {
								if (taskName === '' || taskDescription === '') {
									toast.error('Please fill in all the fields for adding a new task!');
								}
							}}
						> -->
						<div class="space-y-4">
							<div>
								<Label for="taskName" class="text-sm font-semibold">Name</Label>
								<Input bind:value={taskName} name="taskName" placeholder="Enter task name" />
							</div>
							<div>
								<Label for="taskDescription" class="text-sm font-semibold">Description</Label>
								<Textarea
									bind:value={taskDescription}
									name="taskDescription"
									placeholder="Enter task description"
								/>
							</div>
							<Button
								disabled={taskName.length === 0 || taskDescription.length === 0}
								on:click={handleNewTaskAddition}
								type="button"
								class="bg-[--custom-light] hover:bg-[--custom-light] hover:brightness-110 active:brightness-90 w-full flex place-items-center gap-5"
							>
								<ListPlus />
								<p>Add Task</p>
							</Button>
						</div>
						<!-- </form> -->
					</div>
				</div>
			{/if}
			<!-- AMBITION TASKS SECTION  -->

			<!-- AMBITION STATS  -->
			<div
				class="border-2 {daysLeft < 0 && updatedAmbitionStatus.toUpperCase() !== 'COMPLETED'
					? 'border-red-500'
					: ' border-[--custom-light-pale]'} bg-[--custom-light-pale] rounded-xl overflow-hidden"
			>
				<h2 class="font-extrabold text-sm p-2 text-center">AMBITION STATS</h2>
				<div class="bg-background rounded-lg space-y-5 p-3">
					<div class="flex justify-between w-full border-b">
						<strong>Days Left:</strong>
						{#if updatedAmbitionStatus.toLowerCase() === 'completed'}
							<p class="text-green-500">{updatedAmbitionStatus.toUpperCase()}!</p>
						{:else if daysLeft < 0 && updatedAmbitionStatus.toLowerCase() !== 'completed'}
							<p class="text-red-500">Deadline passed</p>
						{:else if daysLeft <= 0 && updatedAmbitionStatus.toLowerCase() === 'completed'}
							<p class="text-green-500">{updatedAmbitionStatus.toUpperCase()}!</p>
						{:else}
							<p>{daysLeft}</p>
						{/if}
					</div>
					<div class="flex justify-between w-full border-b">
						<strong>Percentage Completed:</strong>
						<p>{percentageCompleted}%</p>
					</div>
					<div class="flex justify-between w-full border-b">
						<strong>Unfinished Tasks:</strong>
						<p>{ambitionTasks.filter((task) => !task.checked).length}</p>
					</div>
					<div class="flex justify-between w-full border-b">
						<strong>Finished Tasks:</strong>
						<p>{ambitionTasks.filter((task) => task.checked).length}</p>
					</div>
					<div class="flex justify-between w-full border-b">
						<strong>Total Tasks:</strong>
						<p>{ambitionTasks.length}</p>
					</div>
				</div>
			</div>
			<!-- AMBITION STATS -->
		</div>
		<div class="w-full flex flex-col gap-10">
			<!-- NOTES SECTION  -->
			<div
				class="flex flex-col border-2 border-[--custom-light-pale] bg-[--custom-light-pale] overflow-hidden rounded-xl w-full"
			>
				<h1 class="font-extrabold text-sm p-2 text-center">
					NOTE{ambitionNotes.length > 1 ? 'S' : ''}
				</h1>
				<div class="flex flex-col space-y-4 max-h-96 bg-background rounded-lg overflow-y-auto p-3">
					{#if ambitionNotes.length === 0}
						<p class="text-muted-foreground text-center">No notes added yet!</p>
					{:else}
						{#each ambitionNotes as note}
							<div
								class="{updateAmbitionEnabled
									? 'animate-ambitionEditModeAnimation relative'
									: ''} flex flex-col gap-2 justify-between items-start bg-yellow-200 dark:bg-yellow-900 dark:bg-opacity-20 bg-opacity-20 border border-yellow-400 rounded-lg p-2 max-w-full"
							>
								<p class="text-md opacity-80 break-words max-sm:max-w-64">
									{note.content}
								</p>
								<span class="text-muted-foreground opacity-50 text-xs self-end">
									{new Intl.DateTimeFormat('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									}).format(new Date(note.created_at))}
								</span>
								<!-- {#if updateAmbitionEnabled}
										<button
											on:click={() => handleRemoveAmbitionNote(note.id)}
											type="button"
											class="absolute top-px right-px bg-red-500 hover:brightness-150 active:bg-red-800 rounded-full p-px"
											><X size="20" /></button
										>
									{/if} -->
							</div>
						{/each}
					{/if}
				</div>
			</div>
			{#if updateAmbitionEnabled}
				<div>
					<!-- <h2 class="text-xl font-semibold mb-4">Add a new Note</h2> -->
					<div class="border rounded-xl p-4 space-y-2">
						<h1 class="font-bold text-xs">ADD A NEW NOTE</h1>
						<form
							action="?/addNewTaskForAmbition"
							method="POST"
							use:enhance={() => {
								if (noteContent === '') {
									toast.error('Please fill in the note content!');
								}
							}}
						>
							<div class="space-y-4">
								<Textarea
									bind:value={noteContent}
									name="note"
									placeholder="Enter your new Note"
									class="bg-yellow-200 dark:bg-yellow-900 dark:bg-opacity-20 bg-opacity-20"
								/>
								<Button
									disabled={noteContent.length === 0}
									on:click={handleNewNoteAddition}
									type="submit"
									class="bg-yellow-200 hover:bg-yellow-300 active:bg-yellow-400 text-black w-full flex place-items-center gap-5"
								>
									<MessageSquareDiff />
									<p>Add Note</p>
								</Button>
							</div>
						</form>
					</div>
				</div>
			{/if}
			<!-- NOTES SECTION  -->

			<!-- AMBITION DETAILS SECTION  -->
			<div class="max-w-full overflow-hidden">
				<div
					class="overflow-hidden border-2 border-[--custom-light-pale] bg-[--custom-light-pale] rounded-xl"
				>
					<h2 class="font-extrabold text-sm p-2 text-center">AMBITION DETAILS</h2>
					<div class="bg-background rounded-lg space-y-10 p-3">
						<ul class="space-y-5">
							<li class="flex justify-between gap-10 w-full border-b py-1">
								<strong>Start Date:</strong>
								{ambitionStartDate}
							</li>
							<li class="flex justify-between gap-10 w-full border-b py-1">
								<strong>End Date:</strong>
								{ambitionEndDate}
							</li>
							<li class="flex justify-between gap-10 w-full border-b py-1">
								<strong>Completion Date:</strong>
								{ambitionCompletionDate ?? 'Not completed yet'}
							</li>
							<li class="flex justify-between gap-10 w-full border-b py-1">
								<strong>Status:</strong>
								<p class="flex place-items-center gap-2">
									{#if updatedAmbitionStatus.toLowerCase() === 'completed'}
										<CircleCheckBig color="#10b981" />
									{:else if updatedAmbitionStatus.toLowerCase() === 'ongoing'}
										<div class="animate-spin">
											<LoaderPinwheel color="#3b82f6" />
										</div>
									{:else if updatedAmbitionStatus.toLowerCase() === 'future'}
										<CalendarArrowUp color="#a855f7" />
									{:else if updatedAmbitionStatus.toLowerCase() === 'incomplete'}
										<CircleSlash color="#ff6347" />
									{/if}
									{updatedAmbitionStatus.toUpperCase()}
								</p>
							</li>
							<li class="flex justify-between gap-10 w-full border-b py-1">
								<strong>Priority:</strong>
								<p class="flex place-items-center gap-2">
									{#if ambitionPriority === 'High'}
										<span class="border border-red-500 px-1 rounded-md text-red-500 text-sm"
											>!!!</span
										>
									{:else if ambitionPriority === 'Medium'}
										<span class="border border-yellow-500 px-1 rounded-md text-yellow-500 text-sm"
											>!!</span
										>
									{:else if ambitionPriority === 'Low'}
										<span class="border border-green-500 px-1 rounded-md text-green-500 text-sm"
											>!</span
										>
									{/if}
									<span>
										{ambitionPriority}
									</span>
								</p>
							</li>
							<li class="flex justify-between gap-10 w-full border-b py-1">
								<strong>Category:</strong>
								{ambitionCategory}
							</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- AMBITION DETAILS SECTION  -->
		</div>
	</section>

	<!-- AMBITION DELETE BUTTON -->
	{#if updateAmbitionEnabled}
		<button
			on:click={() => {
				deleteButtonClicked = true;
				askBeforeDeletion = true;
			}}
			disabled={deleteButtonClicked}
			type="submit"
			class="mb-20 flex gap-2 justify-center items-center rounded-md bg-red-200 w-fit px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
		>
			{#if deleteButtonClicked}
				<span class="animate-spin"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path
							d="m16.2 16.2 2.9 2.9"
						/><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path
							d="m4.9 4.9 2.9 2.9"
						/></svg
					></span
				>
				Deleting Ambition
			{:else}
				<Trash_2 />
				Delete Ambition
			{/if}
		</button>
	{/if}
</div>
