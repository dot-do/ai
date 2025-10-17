// @ts-check
import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	typescript: {
		// TODO: Fix TypeScript errors properly instead of ignoring them
		ignoreBuildErrors: true,
	},
};

const withMDX = createMDX();

export default withMDX(config);
