import type { Config } from 'tailwindcss';

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				primary: '#635fc7', // Purple
				primaryLight: '#a8a4ff', // Light Purple
				dark: '#000012', // Almost Black
				darkGray: '#20212c', // Dark Gray
				mediumGray: '#2b2c37', // Medium Gray
				lightGray: '#3e3f4e', // Light Gray
				gray: '#828fa3', // Gray
				veryLightGray: '#e4ebfa', // Very Light Gray
				lightestGray: '#f4f7fd', // Lightest Gray
				white: '#ffffff', // White
				danger: '#ea5555', // Red
				dangerLight: '#ff9898', // Light Red
			},

			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate'), function({ addUtilities }) {
		addUtilities({
			'.no-scrollbar': {
				'-ms-overflow-style': 'none', /* IE and Edge */
				'scrollbar-width': 'none', /* Firefox */
			},
			'.no-scrollbar::-webkit-scrollbar': {
				'display': 'none', /* Chrome, Safari, Opera */
			},
		});
	},],
} satisfies Config;

export default config;
