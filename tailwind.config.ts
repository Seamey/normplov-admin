import tailwindcssAnimate from "tailwindcss-animate";

const config: {
	plugins: { handler: () => void }[];
	theme: {
		extend: {
			borderRadius: { md: string; sm: string; lg: string };
			colors: {
				secondary: string;
				textprimary: string;
				warning: string;
				yellowlish: string;
				danger: string;
				accent: string;
				bgdark: string;
				primary: string
			}
		}
	};
	darkMode: string[];
	content: string[]
} = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: '#0BBB8A',
				secondary: '#FFA500',
				accent: '#F88787',
				danger: '#D43B3B',
				warning: '#F5C449',
				bgdark: '#02042C',
				textprimary: '#034B72',
				yellowlish: '#FFD300',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
};
export default config;