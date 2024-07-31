'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Button from '../shared/Button';

import { createTask, updateTask } from '@/lib/actions/actions';
import { compareArrays } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaDeleteLeft, FaSpinner } from 'react-icons/fa6';
import { DialogClose } from '../ui/dialog';

const formSchema = z.object({
	title: z.string().min(3).max(100),
	description: z.string().min(3).max(500),
	subTasks: z.array(z.string().min(3).max(70)).max(10),
	status: z.string().min(1).max(50),
});

export default function TaskForm({
	type,
	task,
}: {
	task?: string;
	type: string;
}) {
	const [submitting, setSubmitting] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	const Task = task && JSON.parse(task);

	const subTasks = Task?.subTasks?.map((s: any) => s?.title);

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: Task?.title || '',
			description: Task?.description || '',
			status: Task?.status || '',
			subTasks: subTasks || [],
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setSubmitting(true);

		try {
			if (type === 'create') {
				const task = await createTask({
					title: values.title,
					status: values.status,
					subTasks: values.subTasks,
					board: pathname.split('/').at(2)!,
					description: values.description,
					path: `/boards/${pathname.split('/').at(2)}`,
				});
			} else {
				const newSubTasks = values.subTasks;

				const updateSubtasks = compareArrays(subTasks, newSubTasks);

				await updateTask({
					taskId: Task._id,
					boardId: pathname.split('/').at(2)!,
					updateData: {
						title: values.title,
						description: values.description,
						status: values.status,
						subTasks: updateSubtasks,
					},
					path: `/boards/${pathname.split('/').at(2)}`,
				});
			}
		} catch (error) {
			console.error('Error creating board:', error);
		} finally {
			setSubmitting(false);
		}
	}

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: any
	) => {
		if (e.key === 'Enter' && field.name === 'subTasks') {
			e.preventDefault();

			const subTaskInput = e.target as HTMLInputElement;
			const subTaskValue = subTaskInput.value.trim();

			if (subTaskValue !== '') {
				if (subTaskValue.length > 70) {
					return form.setError('subTasks', {
						type: 'required',
						message: 'Subtask name must be less than 70 characters',
					});
				}

				if (!field.value.includes(subTaskValue as never)) {
					form.setValue('subTasks', [...field.value, subTaskValue]);
					subTaskInput.value = '';
					form.clearErrors('subTasks');
				}
			} else {
				form.trigger();
			}
		}
	};

	const handleRemove = (subTask: string, field: any) => {
		const newsubTasks = field.value.filter((s: string) => s !== subTask);

		form.setValue('subTasks', newsubTasks);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={`flex flex-col gap-4 ${
					submitting && 'cursor-not-allowed opacity-85'
				}`}
			>
				<h2 className="h3 capitalize mb-2">
					{type === 'create' ? 'add new task' : 'edit task'}
				</h2>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1">
							<FormLabel className="text-sm font semibold capitalize">
								Title
								<span className="text-primary">*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="eg. create a readme"
									{...field}
									className={`h-[40px placeholder:text-gray focus:outline-none text-mediumgray-verylightgray  bg-white-dark border border-gray/40 p-4] focus:ring-2 focus:ring-primary/70 `}
								/>
							</FormControl>

							<FormMessage className="text-danger text-xs " />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1">
							<FormLabel className="text-sm font semibold capitalize">
								description
								<span className="text-primary">*</span>
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder="eg. describe what the user should do"
									{...field}
									className={`h-[65px placeholder:text-gray focus:outline-none text-mediumgray-verylightgray  bg-white-dark border border-gray/40 p-4] focus:ring-2 focus:ring-primary/70 `}
								/>
							</FormControl>

							<FormMessage className="text-danger text-xs " />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="subTasks"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1">
							<FormLabel className="text-sm font semibold capitalize">
								enter subTasks
								<span className="text-primary">*</span>
							</FormLabel>
							<FormControl>
								<Input
									onChange={() => {
										form.clearErrors();
									}}
									placeholder="+Add subTasks"
									onKeyDown={(e) => handleKeyDown(e, field)}
									className={`h-[40px placeholder:text-primaryLight focus:outline-none text-mediumgray-verylightgray  bg-white-dark border border-gray/40 p-4] focus:ring-2 focus:ring-primary/70 `}
								/>
							</FormControl>
							<div className="flex gap-3 flex-wrap">
								{!!field.value.length &&
									field.value.map((subTask: any) => (
										<button
											key={subTask}
											onClick={(e) => handleRemove(subTask, field)}
											className="py-1 px-3 flex gap-2 items-center text-primary font-semibold text-xs rounded-full bg-white-darkgray"
										>
											<span>{subTask}</span>
											<FaDeleteLeft />
										</button>
									))}
							</div>
							<FormMessage className="text-danger text-xs " />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1">
							<FormLabel className="text-sm font semibold capitalize">
								select status
								<span className="text-primary">*</span>
							</FormLabel>
							<FormControl>
								<Select {...field} onValueChange={field.onChange}>
									<SelectTrigger className=" bg-white-dark border border-gray/40 h-[40px] focus:outline-none focus:ring-2 focus:ring-primary/70  ">
										<SelectValue placeholder="Select a Column" />
									</SelectTrigger>
									<SelectContent className="border border-gray/40 bg-white-dark">
										{/* <SelectGroup> */}
										<SelectItem value="Todo">Todo</SelectItem>
										<SelectItem value="Doing">Doing</SelectItem>
										<SelectItem value="Done">Done</SelectItem>
										{/* </SelectGroup> */}
									</SelectContent>
								</Select>
							</FormControl>

							<FormMessage className="text-danger text-xs " />
						</FormItem>
					)}
				/>
				<div className="flex mt-4 gap-3 max-sm:flex-wrap">
					<Button
						className="flex-1 relative"
						disabled={submitting}
						type="primary"
					>
						{submitting && (
							<span className="absolute right-4 top-1/2 -translate-y-1/2">
								<FaSpinner className="text-white animate-spin" />
							</span>
						)}
						{type === 'create'
							? submitting
								? 'Creating..'
								: 'Create Task'
							: submitting
							? 'Editing..'
							: 'Edit Task'}
					</Button>
					<DialogClose className="flex-1 sm:w-full">
						<Button className="w-full" type="secondary">
							Cancel
						</Button>
					</DialogClose>
				</div>
			</form>
		</Form>
	);
}
