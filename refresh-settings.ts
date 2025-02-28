import { tokensToSettings } from './src/tool/tokens-to-settings.js';

await tokensToSettings([
	{
		kind: 'fonts',
		source: '/src/data/design/tokens/fonts.json',
		target: {
			id: 'font-tokens',
			path: '/src/tool/_font-tokens.scss',
		},
	},
	{
		kind: 'viewport',
		source: '/src/data/design/tokens/viewports.json',
		target: {
			id: 'viewport-tokens',
			path: '/src/tool/_viewport-tokens.scss',
		},
		fluid: {
			rootPx: 16,
			configs: [
				{
					source: '/src/data/design/tokens/spacing.json',
					target: {
						id: 'space-tokens',
						path: '/src/tool/_space-tokens.scss',
					},
				},
				{
					source: '/src/data/design/tokens/text-sizes.json',
					target: {
						id: 'size-tokens',
						path: '/src/tool/_size-tokens.scss',
					},
				},
			],
		},
	},
]);
