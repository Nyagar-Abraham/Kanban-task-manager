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
import Button from '../shared/Button';

import { createBoard, updateBoard } from '@/lib/actions/actions';
import { compareArrays } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaDeleteLeft, FaSpinner } from 'react-icons/fa6';
import { DialogClose } from '../ui/dialog';

const formSchema = z.object({
	board: z.string().min(3).max(30),
	columns: z.array(z.string().min(3).max(10)).max(5),
});

export default function BoardForm({
	type,
	board,
}: {
	type: string;
	board?: string;
}) {
	const [submitting, setSubmitting] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	const Board = board && JSON.parse(board);

	const columns = Board?.columns?.map((c: any) => c?.name);

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			board: Board?.name || '',
			columns: columns || [],
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setSubmitting(true);

		try {
			if (type === 'create') {
				const board = await createBoard({
					name: values.board,
					columns: values.columns,
					path: '/',
				});
    // @ts-ignore
				router.push(`/boards/${board?._id}`);
			} else {
				const newColumns = values.columns;

				const updateColumns = compareArrays(columns, newColumns);

				const board = await updateBoard({
					boardId: pathname.split('/').at(2)!,
					updateData: {
						name: values.board,
						columns: updateColumns,
					},
					path: '/',
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
		if (e.key === 'Enter' && field.name === 'columns') {
			e.preventDefault();

			const columnInput = e.target as HTMLInputElement;
			const columnValue = columnInput.value.trim();

			if (columnValue !== '') {
				if (columnValue.length > 10) {
					return form.setError('columns', {
						type: 'required',
						message: 'Column name must be less than 10 characters',
					});
				}

				if (!field.value.includes(columnValue as never)) {
					form.setValue('columns', [...field.value, columnValue]);
					columnInput.value = '';
					form.clearErrors('columns');
				}
			} else {
				form.trigger();
			}
		}
	};

	const handleRemove = (column: string, field: any) => {
		const newColumns = field.value.filter((c: string) => c !== column);

		form.setValue('columns', newColumns);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={`flex flex-col gap-4
					${submitting && 'opacity-85 cursor-not-allowed'}
					`}
			>
				<h2 className="h3 capitalize mb-2">add new board</h2>

				<FormField
					control={form.control}
					name="board"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1">
							<FormLabel className="text-sm font semibold capitalize">
								Board
								<span className="text-primary">*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="eg. Product Launch"
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
					name="columns"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1">
							<FormLabel className="text-sm font semibold capitalize">
								enter columns
								<span className="text-primary">*</span>
							</FormLabel>
							<FormControl>
								<Input
									onChange={() => {
										form.clearErrors();
									}}
									placeholder="+Add columns"
									onKeyDown={(e) => handleKeyDown(e, field)}
									className={`h-[40px placeholder:text-primaryLight focus:outline-none text-mediumgray-verylightgray  bg-white-dark border border-gray/40 p-4] focus:ring-2 focus:ring-primary/70 `}
								/>
							</FormControl>
							<div className="flex gap-3 flex-wrap">
								{!!field.value.length &&
									field.value.map((column) => (
										<button
											key={column}
											onClick={(e) => handleRemove(column, field)}
											className="py-1 px-3 flex gap-2 items-center text-primary font-semibold text-xs rounded-full bg-white-darkgray"
										>
											<span>{column}</span>
											<FaDeleteLeft />
										</button>
									))}
							</div>
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
								: 'Create Board'
							: submitting
							? 'Editing..'
							: 'Edit Board'}
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
