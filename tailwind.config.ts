import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0e1416",
        foreground: "#dde4e5",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        // AetherOS Colors
        tertiary: "#ffd6a3",
        outline: "#859397",
        surface: "#0e1416",
        "surface-container-lowest": "#090f11",
        "tertiary-container": "#ffb13b",
        "on-background": "#dde4e5",
        "on-primary-container": "#005763",
        "on-error-container": "#ffdad6",
        "inverse-surface": "#dde4e5",
        "inverse-on-surface": "#2b3233",
        "primary-fixed-dim": "#2fd9f4",
        "on-tertiary-fixed-variant": "#643f00",
        error: "#ffb4ab",
        "on-tertiary": "#462b00",
        "outline-variant": "#3c494c",
        "surface-container-low": "#161d1e",
        "surface-container": "#1a2122",
        "surface-container-high": "#242b2d",
        "on-secondary-fixed": "#23005c",
        "on-surface": "#dde4e5",
        "surface-bright": "#343a3c",
        primary: {
          DEFAULT: "#8aebff",
          foreground: "#00363e"
        },
        "on-secondary": "#3c0091",
        "on-primary": "#00363e",
        "primary-fixed": "#a2eeff",
        "error-container": "#93000a",
        "on-secondary-fixed-variant": "#5516be",
        "surface-dim": "#0e1416",
        "surface-container-highest": "#2f3638",
        "on-tertiary-container": "#6e4600",
        secondary: {
          DEFAULT: "#d0bcff",
          foreground: "#3c0091"
        },
        "surface-tint": "#2fd9f4",
        "secondary-fixed-dim": "#d0bcff",
        "tertiary-fixed": "#ffddb5",
        "on-secondary-container": "#c4abff",
        "inverse-primary": "#006877",
        "tertiary-fixed-dim": "#ffb957",
        "surface-variant": "#2f3638",
        "primary-container": "#22d3ee",
        "on-primary-fixed-variant": "#004e5a",
        "on-tertiary-fixed": "#2a1800",
        "on-error": "#690005",
        "on-primary-fixed": "#001f25",
        "secondary-fixed": "#e9ddff",
        "secondary-container": "#571bc1",
        "on-surface-variant": "#bbc9cd",
        success: "#4ade80",
        "success-container": "#14532d",
        "on-success-container": "#bbf7d0",
        warning: "#facc15",
        "warning-container": "#713f12",
        "on-warning-container": "#fef08a"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        unit: "4px",
        gutter: "16px",
        "panel-padding": "24px",
        "margin-safe": "32px"
      },
      fontFamily: {
        "display-lg": ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        "body-md": ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        "headline-sm": ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        "label-caps": ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        "headline-md": ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        "body-lg": ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        "data-mono": ["var(--font-space-grotesk)", "Space Grotesk", "monospace"]
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "0.1em", fontWeight: "700" }],
        "body-md": ["14px", { lineHeight: "1.6", letterSpacing: "0.02em", fontWeight: "400" }],
        "headline-sm": ["18px", { lineHeight: "1.2", letterSpacing: "0.15em", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.2em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.2", letterSpacing: "0.15em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "1.6", letterSpacing: "0.02em", fontWeight: "400" }],
        "data-mono": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "500" }]
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        },
        pulseBorder: {
          "0%, 100%": { borderColor: "rgba(34, 211, 238, 0.2)", boxShadow: "0 0 8px rgba(34, 211, 238, 0.1)" },
          "50%": { borderColor: "rgba(34, 211, 238, 0.5)", boxShadow: "0 0 15px rgba(34, 211, 238, 0.3)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        glitch: {
          "0%, 96%, 98%, 100%": { opacity: "1", transform: "translate(0)" },
          "97%": { opacity: "0.8", transform: "translate(-2px, 1px)" },
          "99%": { opacity: "0.9", transform: "translate(2px, -1px)" }
        }
      },
      animation: {
        scanline: "scanline 8s linear infinite",
        "pulse-border": "pulseBorder 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 4s ease-in-out infinite",
        glitch: "glitch 3s infinite",
      }
    }
  },
  plugins: [animate]
} satisfies Config;

export default config;
