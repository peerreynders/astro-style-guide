// file: configs.ts
import { z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const imgSchema = z.object({
	src: z.string(),
	alt: z.string(),
});

// --- courses

const courseSchema = z.object({
	id: z.string(),
	heading: z.string(),
	meta: z.string(),
	buttonLabel: z.string(),
	href: z.string(),
	img: imgSchema,
	alertText: z.string().optional(),
});

const courses = {
	loader: file('src/data/courses.json'),
	schema: courseSchema,
};

// --- quotes

const quoteSchema = z.object({
	id: z.string(),
	content: z.string().optional(),
	quote: z.string().optional(),
	cite: z
		.object({
			href: z.string().optional(),
			text: z.string(),
		})
		.optional(),
});

const quotes = {
	loader: file('src/data/quotes.json'),
	schema: quoteSchema,
};

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

const designPatterns = {
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

const designSidebar = {
	loader: file('src/data/design/sidebar.json'),
	schema: sidebarSchema,
};

export {
	courses,
	quotes,
	designColors,
	designFonts,
	designPatterns,
	designSidebar,
	designSpacing,
	designTextLeading,
	designTextSizes,
	designTextWeights,
};
