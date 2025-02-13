import { fileURLToPath } from 'node:url';
import { access, constants, readFile } from 'node:fs/promises';
import { nameFromPattern } from './collections.js';

import type { CollectionEntry } from 'astro:content';

const CWD = ((meta: string) => {
	const filepath = fileURLToPath(meta);
	const end = filepath.lastIndexOf('src/');
	return filepath.slice(0, end);
})(import.meta.url);
const DEFAULT_PREVIEW = 'preview.astro';

type PreviewItem = {
	name: string;
	title: string;
	previewHref: string;
	source?: string;
};

async function prepareSource(sourcePath: string) {
	const fullpath = CWD + sourcePath;
	let data: string | undefined;
	try {
		await access(fullpath, constants.R_OK);
		data = await readFile(fullpath, { encoding: 'utf8' });
	} catch (error) {
		if (
			error instanceof Error &&
			'code' in error &&
			error.code === 'ENOENT' &&
			'syscall' in error &&
			error.syscall === 'access'
		)
			return undefined;

		throw error;
	}

	return data.trim();
}

function patternPathFromFile(filePath?: string) {
	if (!filePath) return undefined;
	const end = filePath.lastIndexOf('/');
	return end > 0 ? filePath.slice(0, end) : '';
}

function pathToSource(
	patternPath: string | undefined,
	previewName: string | undefined
) {
	if (!previewName || patternPath === undefined) return undefined;
	return patternPath.length > 0 ? patternPath + '/' + previewName : previewName;
}

function hrefForPreview(name: string, variant?: string) {
	return (
		'/pattern-library/pattern-preview/' + name + (variant ? `/${variant}` : '')
	);
}

async function prepareItem(
	pattern: string,
	title: string,
	variant?: string,
	sourcePath?: string
) {
	const name = variant ? variant : pattern;
	const previewHref = hrefForPreview(pattern, variant);
	const source = sourcePath ? await prepareSource(sourcePath) : undefined;

	return source
		? {
				name,
				title,
				previewHref,
				source,
			}
		: {
				name,
				title,
				previewHref,
			};
}

async function preparePreviews(entry: CollectionEntry<'patterns'>) {
	const patternPath = patternPathFromFile(entry.filePath);
	const pattern = nameFromPattern(entry);
	const promises: Array<Promise<PreviewItem>> = [
		prepareItem(
			pattern,
			entry.data.title,
			undefined,
			pathToSource(patternPath, DEFAULT_PREVIEW)
		),
	];

	if (entry.data.variants)
		for (const variant of entry.data.variants)
			promises.push(
				prepareItem(
					pattern,
					variant.title,
					variant.name,
					pathToSource(patternPath, variant.preview)
				)
			);

	const items = await Promise.all(promises);

	return items;
}

export { preparePreviews };
