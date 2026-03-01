import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["Libre Baskerville", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        ui: ["Source Sans 3", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Premium Design System Colors */
        oxford: "hsl(var(--oxford-blue))",
        teal: "hsl(var(--academic-teal))",
        gold: "hsl(var(--antique-gold))",
        "bg-alt": "hsl(var(--bg-alt))",
        "text-muted": "hsl(var(--text-muted))",
        charcoal: "hsl(var(--text-primary))",
      },
      borderRadius: {
        none: "0",
        sm: "0px",
        DEFAULT: "2px",
        md: "4px",
        lg: "6px",
        xl: "12px",
        full: "9999px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "128": "32rem",
        "144": "36rem",
      },
      fontSize: {
        "display-sm": ["2.125rem", { lineHeight: "2.5rem", letterSpacing: "-0.025em" }],
        "display": ["3rem", { lineHeight: "3.75rem", letterSpacing: "-0.025em" }],
        "display-lg": ["3.75rem", { lineHeight: "4.5rem", letterSpacing: "-0.025em" }],
        "heading-xs": ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.025em" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.875rem", letterSpacing: "-0.025em" }],
        "heading-md": ["1.5rem", { lineHeight: "2.25rem", letterSpacing: "-0.025em" }],
        "heading-lg": ["1.875rem", { lineHeight: "2.375rem", letterSpacing: "-0.025em" }],
        "body-xs": ["0.75rem", { lineHeight: "1rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.375rem" }],
        "body-md": ["1rem", { lineHeight: "1.75rem" }],
        "body-lg": ["1.125rem", { lineHeight: "1.875rem" }],
      },
      screens: {
        "xs": "480px",
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
      },
      keyframes: {
        "academic-reveal": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "section-entry": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "underline-grow": {
          "0%": { backgroundSize: "0% 2px" },
          "100%": { backgroundSize: "100% 2px" },
        },
      },
      animation: {
        "academic-reveal": "academic-reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "section-entry": "section-entry 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
