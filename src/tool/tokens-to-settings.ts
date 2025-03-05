import { fileURLToPath } from 'node:url';
import { colorToSettings } from './color.js';
import { fontToSettings } from './font.js';
import { leadingToSettings } from './leading.js';
import { viewPortToSettings } from './view-port.js';
import { weightToSettings } from './weight.js';

import type { ColorConfig } from './color.js';
import type { FontConfig } from './font.js';
import type { LeadingConfig } from './leading.js';
import type { ViewPortConfig } from './view-port.js';
import type { WeightConfig } from './weight.js';

const PROJECT_PATH = ((fileURL: string) => {
	const filePath = fileURLToPath(fileURL);
	const end = filePath.lastIndexOf('/src');
	return filePath.slice(0, end);
})(import.meta.url);

type SettingsConfig = Array<
	ColorConfig | FontConfig | LeadingConfig | ViewPortConfig | WeightConfig
>;

async function tokensToSettings(config: SettingsConfig) {
	const tasks = Promise.allSettled(
		config.map((c) => {
			switch (c.kind) {
				case 'color':
					return colorToSettings(c, PROJECT_PATH);

				case 'font':
					return fontToSettings(c, PROJECT_PATH);

				case 'leading':
					return leadingToSettings(c, PROJECT_PATH);

				case 'viewport':
					return viewPortToSettings(c, PROJECT_PATH);

				case 'weight':
					return weightToSettings(c, PROJECT_PATH);

				default:
					const _exhaustiveCheck: never = c;
					return _exhaustiveCheck;
			}
		})
	);

	const errors = (await tasks).reduce<Array<Error>>((collect, result) => {
		if (result.status === 'rejected')
			collect.push(...(result.reason as Array<Error>));
		return collect;
	}, []);

	if (errors.length > 0) throw errors;
}

export { tokensToSettings };
