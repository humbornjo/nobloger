/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'selector',
	theme: {
		fontFamily: {
			'sans': ['Hack'],
		},
		extend: {
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						code: {
							backgroundColor: theme('colors.stone.200'),
							borderRadius: theme('borderRadius.md'),
							paddingTop: theme('padding[1]'),
							paddingRight: theme('padding[1.5]'),
							paddingBottom: theme('padding[1]'),
							paddingLeft: theme('padding[1.5]'),
						},
						'code::before': {
							content: 'normal',
						},
						'code::after': {
							content: 'normal',
						},
					},
				},
				invert: {
					css: {
						code: {
							backgroundColor: theme('colors.stone.700'),
							borderRadius: theme('borderRadius.md'),
							paddingTop: theme('padding[1]'),
							paddingRight: theme('padding[1.5]'),
							paddingBottom: theme('padding[1]'),
							paddingLeft: theme('padding[1.5]'),
						},
						'--tw-prose-body': 'var(--tw-prose-invert-body)',
						'--tw-prose-headings': 'var(--tw-prose-invert-headings)',
						'--tw-prose-lead': 'var(--tw-prose-invert-lead)',
						'--tw-prose-links': 'var(--tw-prose-invert-links)',
						'--tw-prose-bold': 'var(--tw-prose-invert-bold)',
						'--tw-prose-counters': 'var(--tw-prose-invert-counters)',
						'--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
						'--tw-prose-hr': 'var(--tw-prose-invert-hr)',
						'--tw-prose-quotes': 'var(--tw-prose-invert-quotes)',
						'--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
						'--tw-prose-captions': 'var(--tw-prose-invert-captions)',
						'--tw-prose-kbd': 'var(--tw-prose-invert-kbd)',
						'--tw-prose-kbd-shadows': 'var(--tw-prose-invert-kbd-shadows)',
						'--tw-prose-code': 'var(--tw-prose-invert-code)',
						'--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
						'--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
						'--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
						'--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
					},
				},
			}),
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}

