// file: src/content.config.ts
import { defineCollection } from 'astro:content';
import {
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
} from './data/config.js';

export const collections = {
	courses: defineCollection(courses),
	quotes: defineCollection(quotes),
	designColors: defineCollection(designColors),
	designFonts: defineCollection(designFonts),
	designPatterns: defineCollection(designPatterns),
	designSidebar: defineCollection(designSidebar),
	designSpacing: defineCollection(designSpacing),
	designTextLeading: defineCollection(designTextLeading),
	designTextSizes: defineCollection(designTextSizes),
	designTextWeights: defineCollection(designTextWeights),
};
