import * as v from 'valibot';
import { readContent, streamEntries, writeMap } from './shared.js';

import type { BaseConfig } from './shared.js';

const sizeTokenSchema = v.array(
	v.object({
		id: v.string(),
		min: v.number(),
		max: v.number(),
	})
);

type SizeTokenSchema = v.InferOutput<typeof sizeTokenSchema>;
type SizeToken = SizeTokenSchema[number];

type SizeEntry = {
	id: string;
	data:
		| number
		| [minRem: number, baseRem: number, vwOffset: number, maxRem: number];
};

function toSizeEntry(
	rootPx: number,
	minWidthRem: number,
	maxWidthRem: number,
	token: SizeToken
): SizeEntry {
	if (token.min === token.max) {
		// i.e. fixed size in rem
		return { id: token.id, data: token.min / rootPx };
	}
	const minRem = token.min / rootPx;
	const maxRem = token.max / rootPx;
	const sizeWidthRatio = (maxRem - minRem) / (maxWidthRem - minWidthRem);
	// i.e. values for clamp
	return {
		id: token.id,
		data: [
			minRem,
			minRem - minWidthRem * sizeWidthRatio,
			sizeWidthRatio * 100,
			maxRem,
		],
	};
}

type SizeConfig = BaseConfig;

const sizeEntryToString = (entry: SizeEntry) =>
	`\t"${entry.id}": ${typeof entry.data === 'number' ? `${entry.data.toFixed(2)}rem` : `clamp(${entry.data[0]}rem, ${entry.data[1].toFixed(2)}rem + ${entry.data[2].toFixed(2)}vw, ${entry.data[3]}rem)`},\n`;

async function sizeTokensToSettings(
	config: SizeConfig,
	projectPath: string,
	rootPx: number,
	minWidthRem: number,
	maxWidthRem: number
) {
	try {
		const content = await readContent(projectPath + config.source);
		const tokens = v.parse(sizeTokenSchema, JSON.parse(content));
		const entries = tokens.map((token) =>
			toSizeEntry(rootPx, minWidthRem, maxWidthRem, token)
		);
		await writeMap(
			(out) => streamEntries(entries, sizeEntryToString, out),
			config.target.id,
			projectPath + config.target.path,
			config.source
		);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

const viewPortSchema = v.intersect([
	v.object({
		min: v.number(),
		max: v.number(),
	}),
	v.record(v.string(), v.number()),
]);

type ViewPortSchema = v.InferOutput<typeof viewPortSchema>;

export type ViewPortsConfig = BaseConfig & {
	kind: 'viewport';
	fluid: {
		rootPx: number;
		configs: Array<SizeConfig>;
	};
};

const byViewPortWidthAsc = ([, a]: [string, number], [, b]: [string, number]) =>
	a - b;
const toString = ([id, width]: [string, number]) => `\t"${id}": ${width}px,\n`;

async function viewPortsToSettings(
	config: ViewPortsConfig,
	projectPath: string
) {
	let viewPorts: ViewPortSchema;
	try {
		const content = await readContent(projectPath + config.source);
		viewPorts = v.parse(viewPortSchema, JSON.parse(content));
		const entries = Object.entries(viewPorts).sort(byViewPortWidthAsc);
		await writeMap(
			(out) => streamEntries(entries, toString, out),
			config.target.id,
			projectPath + config.target.path,
			config.source
		);
	} catch (error) {
		console.error(error);
		throw [error as Error];
	}

	if (config.fluid && config.fluid.configs.length > 0) {
		const rootPx = config.fluid.rootPx;
		const minRem = viewPorts.min / rootPx;
		const maxRem = viewPorts.max / rootPx;

		const tasks = Promise.allSettled(
			config.fluid.configs.map((c) =>
				sizeTokensToSettings(c, projectPath, rootPx, minRem, maxRem)
			)
		);
		const errors = (await tasks).reduce<Array<Error>>((collect, result) => {
			if (result.status === 'rejected') collect.push(result.reason as Error);
			return collect;
		}, []);
		if (errors.length > 0) throw errors;
	}
}

export { viewPortsToSettings };
