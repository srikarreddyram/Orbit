/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy token names kept so every existing className cascades the
        // new palette automatically — see DESIGN.md for the v3 spec these
        // map to.
        base: '#0B0A0C',        // void
        surface: '#17151A',     // card
        elevated: '#221E27',    // card-raised
        border: '#FFFFFF0D',    // worn hairline
        'border-subtle': '#FFFFFF08',
        accent: {
          purple: '#7C3AED',    // cursed-purple
          green: '#38BDF8',     // success reads as cursed-blue, not a separate green
          amber: '#C2872A',     // worn brass/gold
          red: '#B91C1C',       // blood-red
          blue: '#38BDF8',      // cursed-blue
          pink: '#9D5C7C',      // dusty maroon
          cyan: '#2DB8D8',
        },
        text: {
          primary: '#EDEAF0',
          secondary: '#9B94A6',
          muted: '#6E6877',
        },
        // v3-native tokens for new/rewritten components
        void: '#0B0A0C',
        card: '#17151A',
        'card-raised': '#221E27',
        cursed: {
          purple: '#7C3AED',
          'purple-glow': '#7C3AED33',
          blue: '#38BDF8',
        },
        blood: '#B91C1C',
        ring: {
          tasks: '#7C3AED',
          sleep: '#38BDF8',
          workouts: '#B91C1C',
          nutrition: '#8B5CF6',
          finance: '#CA8A04',
        },
        category: {
          rust: '#6B2B2B',
          umber: '#5C3A1E',
          olive: '#4A4A1E',
          moss: '#2E4A2E',
          teal: '#1E4A4A',
          indigo: '#2E3A6B',
          violet: '#4A2E6B',
          maroon: '#6B2E4A',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 12px 32px -12px rgba(0,0,0,0.6)',
        elevated: '0 4px 12px rgba(0,0,0,0.4), 0 24px 48px -16px rgba(0,0,0,0.6)',
        'glow-purple': '0 0 0 1px rgba(124,58,237,0.3), 0 8px 24px -4px rgba(124,58,237,0.4)',
        'glow-signature': '0 0 0 1px rgba(124,58,237,0.25), 0 10px 28px -6px rgba(124,58,237,0.45)',
      },
      backgroundImage: {
        signature: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Oswald', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        'card': '20px',
        'pill': '999px',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.1s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'ring-fill': 'ringFill 1.5s ease-out forwards',
        'flicker': 'flicker 0.5s ease-out',
        'flash-edge': 'flashEdge 0.15s ease-out',
        'pulse-danger': 'pulseDanger 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        ringFill: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--ring-offset)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '15%': { opacity: '0.3' },
          '30%': { opacity: '1' },
          '45%': { opacity: '0.5' },
          '60%': { opacity: '1' },
        },
        flashEdge: {
          '0%': { opacity: '0' },
          '40%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        pulseDanger: {
          '0%': { boxShadow: '0 0 0 0 rgba(185,28,28,0.5)' },
          '100%': { boxShadow: '0 0 0 8px rgba(185,28,28,0)' },
        },
      },
    },
  },
  plugins: [],
}
