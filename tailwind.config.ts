import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'gold-polished': 'rgb(var(--accent-primary-rgb) / <alpha-value>)',
                'accent-secondary': 'var(--accent-secondary)',
                'premium-border': 'rgba(255, 255, 255, 0.1)',
                'secondary-text': '#A1A1AA',
                'emerald-green': '#10B981',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                'premium-fade': 'premium-fade 0.5s ease-out',
            },
            keyframes: {
                'premium-fade': {
                    'from': { opacity: '0', transform: 'translateY(10px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
