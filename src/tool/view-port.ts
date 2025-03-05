import * as v from 'valibot';
import { transferToSettings } from './shared.js';

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

type FluidToken = {
	id: string;
	data:
		| number
		| [minRem: number, baseRem: number, vwOffset: number, maxRem: number];
};

function toFluidToken(
	rootPx: number,
	minWidthRem: number,
	maxWidthRem: number,
	token: SizeToken
): FluidToken {
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

function makeContentToTokens(
	rootPx: number,
	minWidthRem: number,
	maxWidthRem: number
) {
	return (content: string) =>
		v
			.parse(sizeTokenSchema, JSON.parse(content))
			.map((token) => toFluidToken(rootPx, minWidthRem, maxWidthRem, token));
}

const fluidTokenToString = (token: FluidToken) =>
	`\t"${token.id}": ${typeof token.data === 'number' ? `${token.data.toFixed(2)}rem` : `clamp(${token.data[0]}rem, ${token.data[1].toFixed(2)}rem + ${token.data[2].toFixed(2)}vw, ${token.data[3]}rem)`},\n`;

const viewPortSchema = v.intersect([
	v.object({
		min: v.number(),
		max: v.number(),
	}),
	v.record(v.string(), v.number()),
]);

export type ViewPortConfig = BaseConfig & {
	kind: 'viewport';
	fluid: {
		rootPx: number;
		configs: Array<SizeConfig>;
	};
};

const byViewPortWidthAsc = ([, a]: [string, number], [, b]: [string, number]) =>
	a - b;
const toString = ([id, width]: [string, number]) => `\t"${id}": ${width}px,\n`;

async function viewPortToSettings(config: ViewPortConfig, projectPath: string) {
	let minViewPort = 0;
	let maxViewPort = 0;

	const contentToTokens = (content: string) => {
		const viewPorts = v.parse(viewPortSchema, JSON.parse(content));
		minViewPort = viewPorts.min;
		maxViewPort = viewPorts.max;
		return Object.entries(viewPorts).sort(byViewPortWidthAsc);
	};

	await transferToSettings({
		source: projectPath + config.source,
		target: projectPath + config.target.path,
		from: config.source,
		id: config.target.id,
		contentToTokens,
		tokenToString: toString,
	});

	if (
		minViewPort > 0 &&
		minViewPort <= maxViewPort &&
		config.fluid &&
		config.fluid.configs.length > 0
	) {
		const contentToTokens = makeContentToTokens(
			config.fluid.rootPx,
			minViewPort / config.fluid.rootPx,
			maxViewPort / config.fluid.rootPx
		);

		const tasks = Promise.allSettled(
			config.fluid.configs.map((c) =>
				transferToSettings({
					source: projectPath + c.source,
					target: projectPath + c.target.path,
					from: c.source,
					id: c.target.id,
					contentToTokens,
					tokenToString: fluidTokenToString,
				})
			)
		);

		const errors = (await tasks).reduce<Array<Error>>((collect, result) => {
			if (result.status === 'rejected') collect.push(result.reason as Error);
			return collect;
		}, []);
		if (errors.length > 0) throw errors;
	}
}

export { viewPortToSettings };
