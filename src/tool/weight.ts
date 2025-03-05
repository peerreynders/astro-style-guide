import * as v from 'valibot';
import { transferToSettings } from './shared.js';

import type { BaseConfig } from './shared.js';

const weightTokenSchema = v.array(
	v.object({
		id: v.string(),
		value: v.pipe(
			v.number(),
			v.integer(),
			v.gtValue(0, 'Weight must be greater than 0'),
			v.ltValue(1000, 'Weight must be less than 1000')
		),
	})
);
type WeightTokenSchema = v.InferOutput<typeof weightTokenSchema>;

export type WeightConfig = BaseConfig & {
	kind: 'weight';
};

const toTokens = (content: string) =>
	v.parse(weightTokenSchema, JSON.parse(content));

const toString = (token: WeightTokenSchema[number]) =>
	`\t"${token.id}": ${token.value},\n`;

async function weightToSettings(config: WeightConfig, projectPath: string) {
	transferToSettings({
		source: projectPath + config.source,
		target: projectPath + config.target.path,
		from: config.source,
		id: config.target.id,
		contentToTokens: toTokens,
		tokenToString: toString,
	});
}

export { weightToSettings };
