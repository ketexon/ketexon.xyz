import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import NextMDX from "@next/mdx"

const withMDX = NextMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [
			remarkGfm,
			remarkMath,
		],
		rehypePlugins: [
			rehypeKatex,
		],
		providerImportSource: "@mdx-js/react"
	},
})

import path from 'node:path';

const isProd = process.env.NODE_ENV === 'production'

/** @type {import("next").NextConfig} */
const nextConfig = {
	env: {},
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	assetPrefix: isProd ? '/ketexon.xyz/' : '',
	images: {
		unoptimized: true,
	},
}

export default withMDX(nextConfig)