import { createWriteStream } from 'node:fs';
import { readFile } from 'node:fs/promises';

import type { WriteStream } from 'node:fs';

export type BaseConfig = {
	source: string;
	target: {
		path: string;
		id: string;
	};
};

function readContent(fullPath: string) {
	return readFile(fullPath, { encoding: 'utf8' });
}

function streamEntries<T>(
	entries: Array<T>,
	toString: (v: T) => string,
	out: WriteStream
) {
	for (const entry of entries) out.write(toString(entry));
}

function writeMap(
	streamEntries: (out: WriteStream) => void,
	name: string,
	path: string,
	source?: string
) {
	let { promise, resolve, reject } = Promise.withResolvers<void>();
	try {
		const out = createWriteStream(path);
		out.on('error', (error) => reject(error));

		if (source) out.write(`// Generated from: ${source}\n`);

		out.write(`$${name}: (\n`);
		streamEntries(out);
		out.write(');');
		out.close((error) => (error ? reject(error) : resolve()));
	} catch (error) {
		reject(error);
	}
	return promise;
}

export { readContent, streamEntries, writeMap };
