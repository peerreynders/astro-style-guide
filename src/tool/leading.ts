import * as v from 'valibot';
import { transferToSettings } from './shared.js';

import type { BaseConfig } from './shared.js';

const leadingTokenSchema = v.array(
	v.object({
		id: v.string(),
		value: v.pipe(v.number()),
	})
);
type LeadingTokenSchema = v.InferOutput<typeof leadingTokenSchema>;

export type LeadingConfig = BaseConfig & {
	kind: 'leading';
};

const toTokens = (content: string) =>
	v.parse(leadingTokenSchema, JSON.parse(content));

const toString = (token: LeadingTokenSchema[number]) =>
	`\t"${token.id}": ${token.value},\n`;

async function leadingToSettings(config: LeadingConfig, projectPath: string) {
	transferToSettings({
		source: projectPath + config.source,
		target: projectPath + config.target.path,
		from: config.source,
		id: config.target.id,
		contentToTokens: toTokens,
		tokenToString: toString,
	});
}

export { leadingToSettings };
