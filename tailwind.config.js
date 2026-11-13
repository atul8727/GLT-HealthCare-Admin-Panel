/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          light: "#EEF2FF",
          dark: "#4338CA",
          gradientStart: "#4F46E5",
          gradientEnd: "#6D5BF0",
        },
        navy: "#0F172A",
        secondary: "#0EA5E9",
        surface: "#F8FAFC",
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
          dark: "#15803D",
          gradientStart: "#16A34A",
          gradientEnd: "#22C55E",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          dark: "#B45309",
        },
        danger: {
          DEFAULT: "#E11D48",
          light: "#FFE4E6",
          dark: "#BE123C",
          gradientStart: "#E11D48",
          gradientEnd: "#F43F5E",
        },
        edit: {
          DEFAULT: "#0EA5E9",
          light: "#E0F2FE",
          dark: "#0369A1",
          gradientStart: "#0EA5E9",
          gradientEnd: "#2B7FD1",
        },
        info: {
          DEFAULT: "#0EA5E9",
          light: "#DBEAFE",
          dark: "#1D4ED8",
        },
        heading: "#14142B",
        muted: "#64748B",
        border: "#E2E8F0",
        "input-bg": "#F8FAFC",
        "input-border": "#CBD5E1",
        text: {
          primary: "#14142B",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15, 23, 42, 0.06)",
        card: "0 8px 24px rgba(79, 70, 229, 0.08)",
        "card-hover": "0 12px 28px rgba(79, 70, 229, 0.12)",
        "primary-btn": "0 8px 16px rgba(79, 70, 229, 0.3)",
        "blue-btn": "0 8px 16px rgba(14, 165, 233, 0.3)",
        "green-btn": "0 8px 16px rgba(22, 163, 74, 0.3)",
        "rose-btn": "0 8px 16px rgba(225, 29, 72, 0.3)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      backgroundImage: {
        "page-gradient": "linear-gradient(135deg, #EEF0FB, #F8FAFC 60%, #E8F1F8)",
        "primary-gradient": "linear-gradient(135deg, #4F46E5 0%, #6D5BF0 100%)",
        "edit-gradient": "linear-gradient(135deg, #0EA5E9 0%, #2B7FD1 100%)",
        "success-gradient": "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
        "danger-gradient": "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
      },
    },
  },
  plugins: [],
};