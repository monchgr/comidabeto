module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{css,png,ico,svg,webmanifest,jpeg,html,json,md,js}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};