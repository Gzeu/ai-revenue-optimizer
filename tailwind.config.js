/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Custom color palette for revenue optimizer
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a'
				},
				secondary: {
					50: '#faf5ff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7',
					600: '#9333ea',
					700: '#7c3aed',
					800: '#6b21a8',
					900: '#581c87'
				},
				accent: {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981',
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b'
				},
				warning: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f'
				},
				danger: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'Fira Code', 'monospace']
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-in': 'slideIn 0.3s ease-out',
				'bounce-in': 'bounceIn 0.6s ease-out',
				'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'gradient-x': 'gradientX 15s ease infinite',
				'gradient-y': 'gradientY 15s ease infinite',
				'gradient-xy': 'gradientXY 15s ease infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideIn: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				bounceIn: {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				pulseGlow: {
					'0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
					'50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				gradientX: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				gradientY: {
					'0%, 100%': { backgroundPosition: '50% 0%' },
					'50%': { backgroundPosition: '50% 100%' }
				},
				gradientXY: {
					'0%, 100%': { backgroundPosition: '0% 0%' },
					'25%': { backgroundPosition: '100% 0%' },
					'50%': { backgroundPosition: '100% 100%' },
					'75%': { backgroundPosition: '0% 100%' }
				}
			},
			boxShadow: {
				'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
				'glow-lg': '0 0 30px rgba(59, 130, 246, 0.6)',
				'glow-xl': '0 0 40px rgba(59, 130, 246, 0.7)',
				'accent-glow': '0 0 20px rgba(16, 185, 129, 0.5)',
				'warning-glow': '0 0 20px rgba(245, 158, 11, 0.5)',
				'danger-glow': '0 0 20px rgba(239, 68, 68, 0.5)'
			},
			backdropBlur: {
				xs: '2px'
			}
		}
	},
	plugins: []
};