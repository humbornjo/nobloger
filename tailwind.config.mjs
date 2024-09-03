/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			'mono': ['Monocraft', 'SFMono-Regular'],
		},
		extend: {},
	},
	plugins: [
		plugin(function({ addBase, theme }) {
			addBase({
				'h1': {
					fontFamily: 'NanumGothic',
					fontSize: theme('fontSize.2xl'),
					fontWeight: '800',
					marginBottom: '36px',
					marginTop: '36px'
				},
				'h2': {
					fontFamily: 'NanumGothic',
					fontSize: theme('fontSize.xl'),
					fontWeight: '700',
					marginBottom: '24px',
					marginTop: '24px'
				},
				'h3': {
					fontFamily: 'NanumGothic',
					fontWeight: '600',
					fontSize: theme('fontSize.lg'),
					marginBottom: '16px',
					marginTop: '16px'
				},
				'pre': {
					marginBottom: '10px',
					marginTop: '10px',
					padding: '1.5em',
					borderRadius: '0.75em',
				},
				'code': {
					fontFamily: 'Menlo',
					fontSize: theme('fontSize.md'),
					filter: 'brightness(.82)',
				},
				'p': {
					fontFamily: 'NanumGothic',
					fontSize: theme('fontSize.md'),
					fontWeight: '200',
					marginBottom: '8px',
					marginTop: '8px'
				},
			})
		})
	],
}
