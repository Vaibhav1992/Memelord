/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#7C3AED',
          'purple-light': '#A855F7',
          'purple-dark': '#5B21B6',
        },
        secondary: {
          blue: '#3B82F6',
          'blue-light': '#60A5FA',
        },
        accent: {
          green: '#10B981',
          'green-light': '#34D399',
          orange: '#F59E0B',
          red: '#EF4444',
        },
        neutral: {
          white: '#FFFFFF',
          'gray-50': '#F9FAFB',
          'gray-100': '#F3F4F6',
          'gray-200': '#E5E7EB',
          'gray-300': '#D1D5DB',
          'gray-400': '#9CA3AF',
          'gray-500': '#6B7280',
          'gray-600': '#4B5563',
          'gray-700': '#374151',
          'gray-800': '#1F2937',
          'gray-900': '#111827',
          'slate-700': '#334155',
          'slate-800': '#1E293B',
          'slate-900': '#0F172A',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        'gradient-danger': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-background': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      fontFamily: {
        'heading': ['Nunito', 'sans-serif'],
        'subheading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'celebration': 'celebration 0.8s ease-out',
        'timer-pulse': 'timerPulse 1s infinite',
        'confetti': 'confetti 3s linear infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { 
            opacity: '0', 
            transform: 'translateY(16px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        fadeOut: {
          'from': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
          'to': { 
            opacity: '0', 
            transform: 'translateY(16px)' 
          },
        },
        slideIn: {
          'from': { 
            transform: 'translateX(-100%)', 
            opacity: '0' 
          },
          'to': { 
            transform: 'translateX(0)', 
            opacity: '1' 
          },
        },
        slideUp: {
          'from': { 
            transform: 'translateY(100%)', 
            opacity: '0' 
          },
          'to': { 
            transform: 'translateY(0)', 
            opacity: '1' 
          },
        },
        scaleIn: {
          'from': { 
            transform: 'scale(0.9)', 
            opacity: '0' 
          },
          'to': { 
            transform: 'scale(1)', 
            opacity: '1' 
          },
        },
        celebration: {
          '0%': { 
            transform: 'scale(1) rotate(0deg)' 
          },
          '25%': { 
            transform: 'scale(1.1) rotate(3deg)' 
          },
          '50%': { 
            transform: 'scale(1.15) rotate(-3deg)' 
          },
          '75%': { 
            transform: 'scale(1.1) rotate(2deg)' 
          },
          '100%': { 
            transform: 'scale(1) rotate(0deg)' 
          },
        },
        timerPulse: {
          '0%': { 
            transform: 'scale(1)', 
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' 
          },
          '70%': { 
            transform: 'scale(1.05)', 
            boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' 
          },
          '100%': { 
            transform: 'scale(1)', 
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' 
          },
        },
        confetti: {
          '0%': { 
            transform: 'translateY(0) rotate(0deg)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateY(-100vh) rotate(360deg)', 
            opacity: '0' 
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200px 0',
          },
          '100%': {
            backgroundPosition: 'calc(200px + 100%) 0',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
    },
  },
  plugins: [],
}