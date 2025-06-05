
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#008080',
					foreground: '#FFFFFF',
					50: '#E0FFFF',
					100: '#4ED4D4',
					200: '#00B2A9',
					300: '#008080',
					400: '#006666',
					500: '#004D4D',
					600: '#003333',
					700: '#001A1A',
					800: '#000000',
					900: '#000000'
				},
				secondary: {
					DEFAULT: '#2C3E50',
					foreground: '#FFFFFF',
					50: '#E8EAED',
					100: '#BDC3C7',
					200: '#95A5A6',
					300: '#7F8C8D',
					400: '#566573',
					500: '#2C3E50',
					600: '#273746',
					700: '#212F3D',
					800: '#1B2631',
					900: '#17202A'
				},
				accent: {
					DEFAULT: '#4ED4D4',
					foreground: '#2C3E50'
				},
				teal: {
					50: '#E0FFFF',
					100: '#4ED4D4',
					200: '#00B2A9',
					300: '#008080',
					400: '#006666',
					500: '#004D4D',
					600: '#003333',
					700: '#001A1A'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
