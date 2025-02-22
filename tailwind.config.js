import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
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
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			animation: {
				shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) forwards',
				fadeOut: 'fadeOut 1s ease-in-out forwards',
				dropDown: 'dropDown 0.5s cubic-bezier(.36,.07,.19,.97) forwards',
				dropDownReverse: 'dropDown 0.5s cubic-bezier(.36,.07,.19,.97) reverse forwards',
				gradient: 'gradient 60s ease-in-out infinite',
				ambitionEditModeAnimation: 'ambitionEditModeAnimation 1s ease-in-out infinite',
				borderPulse: 'borderPulse 2s ease-in-out infinite',
				shine: 'shine 3s ease-in-out infinite',
				highlight: 'highlight 2s ease-in-out forwards',
				fadeInDown: 'fadeInDown 0.5s ease-in-out forwards'
			},
			keyframes: {
				shake: {
					'10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
					'20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
					'30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
					'40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
				},
				fadeOut: {
					'0%': { opacity: 1 },
					'100%': { opacity: 0, display: 'none' }
				},
				dropDown: {
					'0%': { transform: 'translateY(-100%)', opacity: 0 },
					'100%': { transform: 'translateY(0)', opacity: 1 }
				},
				dropDownReverse: {
					'0%': { transform: 'translateY(0)', opacity: 1 },
					'100%': { transform: 'translateY(-100%)', opacity: 0 }
				},
				gradient: {
					'0%, 100%': {
						backgroundSize: '200% 200%',
						backgroundPosition: 'left center',
						backgroundImage: 'linear-gradient(270deg, #64CCC5, #176B87)'
					},
					'50%': {
						backgroundSize: '200% 200%',
						backgroundPosition: 'right center',
						backgroundImage: 'linear-gradient(270deg, #176B87, #64CCC5)'
					}
				},
				ambitionEditModeAnimation: {
					'0%, 100%': { filter: 'brightness(1)' },
					'50%': { filter: 'brightness(1.2)' }
				},
				borderPulse: {
					'0%': { borderColor: 'hsl(var(--border) / 0.5)' },
					'50%': { borderColor: 'hsl(var(--border) / 1)' },
					'100%': { borderColor: 'hsl(var(--border) / 0.5)' }
				},
				shine: {
					'0%': { backgroundPosition: '200% center' },
					'100%': { backgroundPosition: '-200% center' }
				},
				highlight: {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				fadeInDown: {
					'0%': {
						opacity: 0,
						filter: 'blur(10px)',
						transform: 'translateY(-20px) scale(0.9)'
					},
					'100%': {
						opacity: 1,
						filter: 'blur(0)',
						transform: 'translateY(0) scale(1)'
					}
				}
			}
		}
	}
};

export default config;
