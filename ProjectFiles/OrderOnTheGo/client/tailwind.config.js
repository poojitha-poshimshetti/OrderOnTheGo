/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#f43f5e',
                    600: '#e11d48',
                    700: '#be123c',
                    800: '#9f1239',
                    900: '#881337',
                },
                dark: {
                    bg: '#0a0a0f',
                    card: '#131320',
                    surface: '#1a1a2e',
                    border: '#2a2a40',
                    accent: '#3a3a50',
                },
                accent: {
                    rose: '#fb7185',
                    purple: '#a78bfa',
                    cyan: '#22d3ee',
                    amber: '#fbbf24',
                    emerald: '#34d399',
                    blue: '#60a5fa',
                },
                gradient: {
                    start: '#f43f5e',
                    mid: '#a855f7',
                    end: '#06b6d4',
                }
            },
            fontFamily: {
                sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'mesh-gradient': 'linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #06b6d4 100%)',
                'mesh-dark': 'linear-gradient(135deg, #1a1a2e 0%, #131320 50%, #0a0a0f 100%)',
                'glow-gradient': 'radial-gradient(ellipse at center, rgba(244, 63, 94, 0.15) 0%, transparent 70%)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'bounce-slow': 'bounce 2s infinite',
                'fly-to-cart': 'flyToCart 0.8s ease-in-out',
                'glow': 'glow 2s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'gradient-x': 'gradient-x 3s ease infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                flyToCart: {
                    '0%': { transform: 'scale(1) translate(0, 0)', opacity: '1' },
                    '50%': { transform: 'scale(0.5) translate(50px, -50px)', opacity: '0.8' },
                    '100%': { transform: 'scale(0) translate(100px, -100px)', opacity: '0' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)' },
                },
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            boxShadow: {
                'glow': '0 0 20px rgba(244, 63, 94, 0.25)',
                'glow-lg': '0 0 40px rgba(244, 63, 94, 0.35)',
                'glow-purple': '0 0 30px rgba(168, 85, 247, 0.3)',
                'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.3)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
                'inner-glow': 'inset 0 0 30px rgba(244, 63, 94, 0.1)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            }
        },
    },
    plugins: [],
}
