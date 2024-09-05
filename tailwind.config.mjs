/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'selector', // Enable selector strategy for dark mode
	theme: {
		fontFamily: {
			'sans': ['Hack'],
		},
		extend: {},
	},
	plugins: [],
}

