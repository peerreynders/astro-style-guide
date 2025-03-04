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

function writeMap(
	streamEntries: (out: WriteStream) => void,
	name: string,
	path: string,
	from?: string
) {
	let { promise, resolve, reject } = Promise.withResolvers<void>();
	try {
		const out = createWriteStream(path);
		out.on('error', (error) => reject(error));

		if (from) out.write(`// Generated from: ${from}\n`);

		out.write(`$${name}: (\n`);
		streamEntries(out);
		out.write(');');
		out.close((error) => (error ? reject(error) : resolve()));
	} catch (error) {
		reject(error);
	}
	return promise;
}

async function transferToSettings<T>(config: {
	source: string;
	target: string;
	id: string;
	from?: string;
	contentToTokens: (content: string) => Array<T>;
	tokenToString: (token: T) => string;
}) {
	try {
		const content = await readFile(config.source, { encoding: 'utf8' });
		const tokens = config.contentToTokens(content);
		await writeMap(
			(out) => {
				for (const token of tokens) out.write(config.tokenToString(token));
			},
			config.id,
			config.target,
			config.from
		);
	} catch (error) {
		console.error(error);
		throw [error as Error];
	}
}

export { transferToSettings };
