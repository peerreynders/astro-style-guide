import * as v from 'valibot';
import { transferToSettings } from './shared.js';

import type { BaseConfig } from './shared.js';

const fontTokenSchema = v.array(
	v.object({
		id: v.string(),
		value: v.array(v.string()),
	})
);
type FontTokenSchema = v.InferOutput<typeof fontTokenSchema>;

export type FontConfig = BaseConfig & {
	kind: 'font';
};

const toTokens = (content: string) =>
	v.parse(fontTokenSchema, JSON.parse(content));

const toString = (token: FontTokenSchema[number]) =>
	`\t"${token.id}": "${token.value.join(', ')}",\n`;

async function fontToSettings(config: FontConfig, projectPath: string) {
	transferToSettings({
		source: projectPath + config.source,
		target: projectPath + config.target.path,
		from: config.source,
		id: config.target.id,
		contentToTokens: toTokens,
		tokenToString: toString,
	});
}

export { fontToSettings };
