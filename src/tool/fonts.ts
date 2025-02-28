import * as v from 'valibot';
import { readContent, streamEntries, writeMap } from './shared.js';

import type { BaseConfig } from './shared.js';

const fontTokenSchema = v.array(
	v.object({
		id: v.string(),
		value: v.array(v.string()),
	})
);
type FontTokenSchema = v.InferOutput<typeof fontTokenSchema>;

export type FontsConfig = BaseConfig & {
	kind: 'fonts';
};

const toString = (entry: FontTokenSchema[number]) =>
	`\t"${entry.id}": "${entry.value.join(', ')}",\n`;

async function fontsToSettings(config: FontsConfig, projectPath: string) {
	try {
		const content = await readContent(projectPath + config.source);
		const tokens = v.parse(fontTokenSchema, JSON.parse(content));
		await writeMap(
			(out) => streamEntries(tokens, toString, out),
			config.target.id,
			projectPath + config.target.path,
			config.source
		);
	} catch (error) {
		console.error(error);
		throw [error as Error];
	}
}

export { fontsToSettings };
