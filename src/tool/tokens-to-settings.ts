import { fileURLToPath } from 'node:url';
import { fontsToSettings } from './fonts.js';
import { viewPortsToSettings } from './view-ports.js';

import type { FontsConfig } from './fonts.js';
import type { ViewPortsConfig } from './view-ports.js';

const PROJECT_PATH = ((fileURL: string) => {
	const filePath = fileURLToPath(fileURL);
	const end = filePath.lastIndexOf('/src');
	return filePath.slice(0, end);
})(import.meta.url);

type SettingsConfig = Array<FontsConfig | ViewPortsConfig>;

async function tokensToSettings(config: SettingsConfig) {
	const tasks = Promise.allSettled(
		config.map((c) => {
			switch (c.kind) {
				case 'fonts':
					return fontsToSettings(c, PROJECT_PATH);

				case 'viewport':
					return viewPortsToSettings(c, PROJECT_PATH);

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
