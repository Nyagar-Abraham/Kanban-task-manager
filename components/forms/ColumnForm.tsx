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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import Button from '../shared/Button';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createColumn } from '@/lib/actions/actions';
import { DialogClose } from '../ui/dialog';
import { FaSpinner } from 'react-icons/fa6';

const formSchema = z.object({
	column: z.string().min(1).max(50),
});

export default function ColumnForm({}: {}) {
	const [submitting, setSubmitting] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			column: '',
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setSubmitting(true);

		try {
			await createColumn({
				boardId: pathname.split('/').at(2)!,
				name: values.column,
				path: `/boards/${pathname.split('/').at(2)}`,
			});
		} catch (error) {
			console.error('Error creating board:', error);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={`flex flex-col gap-4 ${
					submitting && 'cursor-not-allowed opacity-85'
				}`}
			>
				<h2 className="h3 capitalize mb-4">create column</h2>

				<FormField
					control={form.control}
					name="column"
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1">
							<FormLabel className="text-sm font semibold capitalize">
								column
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
						{submitting ? 'Creating...' : 'Create Column'}
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
