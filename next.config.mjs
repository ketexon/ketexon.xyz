import path from 'node:path';
import { fileURLToPath } from 'url';

const isProd = process.env.NODE_ENV === 'production'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import("next").NextConfig} */
const nextConfig = {
	env: {},
	pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
	assetPrefix: isProd ? '/ketexon.xyz/' : '',
	images: {
		unoptimized: true,
	},
	webpack: (config, {isServer}) => {
		config.resolve.alias["~"] = path.join(__dirname, "src");
		config.module.rules.push({
			test: /\.mdx?$/,
			type: 'asset/source'
		})
		return config;
	},
}

export default nextConfig