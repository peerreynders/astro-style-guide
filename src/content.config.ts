// file: src/content.config.ts
import { defineCollection } from 'astro:content';
import {
	designColors,
	designFonts,
	designSpacing,
	designTextLeading,
	designTextSizes,
	designTextWeights,
	sidebar,
	patterns,
} from './configs.js';

export const collections = {
	designColors: defineCollection(designColors),
	designFonts: defineCollection(designFonts),
	designSpacing: defineCollection(designSpacing),
	designTextLeading: defineCollection(designTextLeading),
	designTextSizes: defineCollection(designTextSizes),
	designTextWeights: defineCollection(designTextWeights),
	patterns: defineCollection(patterns),
	sidebar: defineCollection(sidebar),
};
