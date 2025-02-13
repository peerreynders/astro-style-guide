// file: configs.ts
import { z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// --- designColors

const colorSchema = z.object({
	id: z.string(),
	name: z.string(),
	value: z.string(),
});

const designColors = {
	loader: file('src/data/design/tokens/colors.json'),
	schema: colorSchema,
};

// --- designFonts

const fontSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	value: z.array(z.string()),
});

const designFonts = {
	loader: file('src/data/design/tokens/fonts.json'),
	schema: fontSchema,
};

// --- designSpacing

const spacingSchema = z.object({
	id: z.string(),
	name: z.string(),
	min: z.number(),
	max: z.number(),
});

const designSpacing = {
	loader: file('src/data/design/tokens/spacing.json'),
	schema: spacingSchema,
};

// --- text leading

const leadingSchema = z.object({
	id: z.string(),
	name: z.string(),
	value: z.number(),
});

const designTextLeading = {
	loader: file('src/data/design/tokens/text-leading.json'),
	schema: leadingSchema,
};

// --- text sizes

const sizeSchema = z.object({
	id: z.string(),
	name: z.string(),
	min: z.number(),
	max: z.number(),
});

const designTextSizes = {
	loader: file('src/data/design/tokens/text-sizes.json'),
	schema: sizeSchema,
};

// --- text weights

const weightSchema = z.object({
	id: z.string(),
	name: z.string(),
	value: z.number(),
});

const designTextWeights = {
	loader: file('src/data/design/tokens/text-weights.json'),
	schema: weightSchema,
};

// --- patterns

const patternSchema = z.object({
	title: z.string(),
	summary: z.string().optional(),
	variants: z
		.array(
			z.object({
				name: z.string(),
				title: z.string(),
				preview: z.string().optional(),
			})
		)
		.optional(),
});

const patterns = {
	loader: glob({ pattern: '**/*.md', base: './src/data/design/pattern' }),
	schema: patternSchema,
};

// --- sidebar

const sidebarSchema = z.object({
	id: z.string(),
	title: z.string(),
	items: z.array(
		z.object({
			text: z.string(),
			url: z.string(),
		})
	),
});

const sidebar = {
	loader: file('src/data/design/sidebar.json'),
	schema: sidebarSchema,
};

export {
	designColors,
	designFonts,
	designSpacing,
	designTextLeading,
	designTextSizes,
	designTextWeights,
	patterns,
	sidebar,
};
