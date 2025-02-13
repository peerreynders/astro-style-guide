// file: src/lib/collections.ts
import { getCollection } from 'astro:content';

import type { CollectionEntry } from 'astro:content';

async function fromSidebar() {
	return getCollection('sidebar');
}

async function fromPatterns() {
	return getCollection('patterns');
}

function nameFromPattern(entry: CollectionEntry<'patterns'>) {
	const end = entry.id.indexOf('/');
	return end > -1 ? entry.id.slice(0, end) : entry.id;
}

function findPatternByName(
	collection: Array<CollectionEntry<'patterns'>>,
	name: string
) {
	return collection.find((entry) => nameFromPattern(entry) === name);
}

function patternByNameAsc(
	a: CollectionEntry<'patterns'>,
	b: CollectionEntry<'patterns'>
) {
	return nameFromPattern(a).localeCompare(nameFromPattern(b));
}

function sortPatternsByNameAsc(collection: Array<CollectionEntry<'patterns'>>) {
	return collection.sort(patternByNameAsc);
}

function hrefFromPattern(entry: CollectionEntry<'patterns'>) {
	return `/pattern-library/pattern/${nameFromPattern(entry)}`;
}

export {
	findPatternByName,
	fromPatterns,
	fromSidebar,
	hrefFromPattern,
	nameFromPattern,
	sortPatternsByNameAsc,
};
