/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors,
        // 🚀 FUTURISTIC CYBERPUNK COLOR PALETTE
        'cyber-primary': '#00D4FF',    // Electric Blue
        'cyber-secondary': '#8B5CF6',  // Neon Purple
        'cyber-accent': '#00FF88',     // Cyber Green
        'cyber-warning': '#FF6B35',    // Electric Orange
        'cyber-error': '#FF0080',      // Neon Red
        'cyber-background': '#0A0A0A', // Deep Space Black
        'cyber-surface': '#1A1A1A',    // Glass Gray
        'cyber-text': '#FFFFFF',       // Pure White
        'cyber-text-secondary': 'rgba(255, 255, 255, 0.7)', // Muted White

        // Legacy colors (keeping for backward compatibility)
        primary: '#00D4FF', // Updated to cyber-primary
        secondary: '#8B5CF6', // Updated to cyber-secondary
        accent: '#00FF88', // Updated to cyber-accent
      },
      fontFamily: {
        // 🚀 FUTURISTIC TYPOGRAPHY SYSTEM
        'cyber-header': ['Orbitron', 'monospace'],
        'cyber-body': ['Roboto Mono', 'monospace'],
        'cyber-accent': ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        // Cyber spacing for futuristic layouts
        'cyber-xs': '0.25rem',
        'cyber-sm': '0.5rem',
        'cyber-md': '1rem',
        'cyber-lg': '1.5rem',
        'cyber-xl': '2rem',
        'cyber-2xl': '3rem',
      },
      animation: {
        // Legacy animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',

        // 🚀 CYBERPUNK ANIMATIONS
        'cyber-pulse': 'cyber-pulse 2s ease-in-out infinite',
        'cyber-float': 'float-cyber 6s ease-in-out infinite',
        'cyber-glow': 'glow-cycle 3s ease-in-out infinite',
        'cyber-scan': 'scan-line 2s linear infinite',
        'cyber-loading': 'loading-cyber 1.5s ease-in-out infinite',
        'cyber-spin': 'spin-cyber 1s linear infinite',
        'cyber-progress': 'progress-cyber 2s ease-in-out infinite',
        'cyber-status': 'status-pulse 2s ease-in-out infinite',
        'cyber-particle-odd': 'particle-float-odd 8s linear infinite',
        'cyber-particle-even': 'particle-float-even 10s linear infinite',
      },
      keyframes: {
        // Legacy keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink-caret': {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'currentColor' },
        },

        // 🚀 CYBERPUNK KEYFRAMES
        'cyber-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)'
          },
        },
        'float-cyber': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-cycle': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
          },
          '33%': {
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
          },
          '66%': {
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
          },
        },
        'scan-line': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        'loading-cyber': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-cyber': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'progress-cyber': {
          '0%': { width: '0%' },
          '50%': { width: '70%' },
          '100%': { width: '100%' },
        },
        'status-pulse': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.7',
            transform: 'scale(1.2)'
          },
        },
        'particle-float-odd': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: '0'
          },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '50%': {
            transform: 'translateY(-100vh) translateX(50px)'
          },
        },
        'particle-float-even': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: '0'
          },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '50%': {
            transform: 'translateY(-100vh) translateX(-50px)'
          },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      boxShadow: {
        // 🚀 CYBERPUNK GLOW EFFECTS
        'cyber-electric': '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1), 0 0 60px rgba(0, 212, 255, 0.05)',
        'cyber-neon': '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1), 0 0 60px rgba(0, 255, 136, 0.05)',
        'cyber-purple': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1), 0 0 60px rgba(139, 92, 246, 0.05)',
        'cyber-glow': '0 0 20px rgba(0, 212, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'cyber': '20px',
      },
    },
  },
  plugins: [],
};
