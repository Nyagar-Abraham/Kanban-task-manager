import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

interface Change {
	item: string;
	type: 'added' | 'removed';
}

export function compareArrays(
	original: string[],
	replacement: string[]
): Change[] {
	const changes: Change[] = [];

	// Create sets for faster lookup
	const originalSet = new Set(original);
	const replacementSet = new Set(replacement);

	// Find items that were added
	for (const item of replacement) {
		if (!originalSet.has(item)) {
			changes.push({ item, type: 'added' });
		}
	}

	// Find items that were removed
	for (const item of original) {
		if (!replacementSet.has(item)) {
			changes.push({ item, type: 'removed' });
		}
	}

	return changes;
}
