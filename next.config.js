const path = require("node:path")

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	env: {},
	assetPrefix: isProd ? '/ketexon.xyz/' : '',
	images: {
		unoptimized: true,
	},
}