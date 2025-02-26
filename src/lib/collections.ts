// file: src/lib/collections.ts
import { getCollection } from 'astro:content';

import type { CollectionEntry } from 'astro:content';

export type CourseEntry = CollectionEntry<'courses'>;
export type QuoteEntry = CollectionEntry<'quotes'>;
export type DesignPatternEntry = CollectionEntry<'designPatterns'>;
export type DesignSidebarEntry = CollectionEntry<'designSidebar'>;

async function fromCourses() {
	return getCollection('courses');
}

async function fromQuotes() {
	return getCollection('quotes');
}

async function fromDesignSidebar() {
	return getCollection('designSidebar');
}

async function fromDesignPatterns() {
	return getCollection('designPatterns');
}

function nameFromPattern(entry: DesignPatternEntry) {
	const end = entry.id.indexOf('/');
	return end > -1 ? entry.id.slice(0, end) : entry.id;
}

function findPatternByName(
	collection: Array<DesignPatternEntry>,
	name: string
) {
	return collection.find((entry) => nameFromPattern(entry) === name);
}

function patternByNameAsc(a: DesignPatternEntry, b: DesignPatternEntry) {
	return nameFromPattern(a).localeCompare(nameFromPattern(b));
}

function sortPatternsByNameAsc(collection: Array<DesignPatternEntry>) {
	return collection.sort(patternByNameAsc);
}

function hrefFromPattern(entry: DesignPatternEntry) {
	return `/pattern-library/pattern/${nameFromPattern(entry)}`;
}

export {
	findPatternByName,
	fromCourses,
	fromQuotes,
	fromDesignPatterns,
	fromDesignSidebar,
	hrefFromPattern,
	nameFromPattern,
	sortPatternsByNameAsc,
};
