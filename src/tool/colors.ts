import * as v from 'valibot';
import { transferToSettings } from './shared.js';

import type { BaseConfig } from './shared.js';

const colorTokenSchema = v.array(
	v.object({
		id: v.string(),
		value: v.pipe(v.string(), v.hexColor()),
	})
);
type ColorTokenSchema = v.InferOutput<typeof colorTokenSchema>;

export type ColorsConfig = BaseConfig & {
	kind: 'colors';
};

const toTokens = (content: string) =>
	v.parse(colorTokenSchema, JSON.parse(content));

const toString = (token: ColorTokenSchema[number]) =>
	`\t"${token.id}": "${token.value}",\n`;

async function colorsToSettings(config: ColorsConfig, projectPath: string) {
	transferToSettings({
		source: projectPath + config.source,
		target: projectPath + config.target.path,
		from: config.source,
		id: config.target.id,
		contentToTokens: toTokens,
		tokenToString: toString,
	});
}

export { colorsToSettings };
