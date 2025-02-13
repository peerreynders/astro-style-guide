// .prettierrc.mjs
/** @type {import("prettier").Config} */
const options = {
	arrowParens: 'always',
	bracketSpacing: true,
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'es5',
	useTabs: true,
};

export default {
	plugins: ['prettier-plugin-astro'],
	overrides: [
		{
			files: '*.astro',
			options: { ...options, parser: 'astro' },
		},
		{
			files: ['*.ts', '*.js', '*.mts', '*.mjs'],
			options,
		},
	],
};
