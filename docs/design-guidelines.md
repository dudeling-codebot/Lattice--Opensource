# Design Guidelines — LATTICE Smart Energy Monitor

Plain-English guide to the look, feel, colors, fonts, and visual style of the LATTICE app.

## Brand Identity
- **Name:** LATTICE
- **Tagline:** Connecting Ideas. Building Solutions.
- **Personality:** Precise, Effortless, Professional, Smooth, Calm (Clean & Purposeful — no useless decorative charts or gimmick graphs).
- **Aesthetic:** Modern Liquid Glass OS style (frosted glass cards, backdrop blur, translucent layers, sleek glass borders) with clean, node-and-line lattice elements.

## Color Palette
Based on the official LATTICE logo and visual identity:

1. **Background (Dark Mode — Default):** Deep Slate/Navy (`#0B0F19`) — translucent frosted glass layers hover over this deep backdrop.
2. **Primary Accent (Free Account - Default):** LATTICE Magenta (`#E11D48` / `#F43F5E`) — used for standard UI highlights, energy nodes, and primary actions.
3. **Pro Accent (PRO Account Exclusive):** Electric Cyan/Blue (`#0EA5E9` / `#38BDF8`) — exclusively unlocks when the user has a PRO account, giving a special blue glass glow to the dashboard.
4. **Surface Cards (Liquid Glass OS):** Translucent Slate Glass (`rgba(30, 41, 59, 0.6)` with `backdrop-filter: blur(16px)` and subtle border `rgba(255, 255, 255, 0.1)`).
6. **Text:** High-contrast White/Off-white (`#F8FAFC`) for headings, Muted Ice Blue (`#94A3B8`) for secondary labels.

## Typography
- **Headings & Logo:** Geometric, wide sans-serif font (Space Grotesk or Rajdhani / Orbitron style) to match the techy "LATTICE" logotype.
- **Body & Data:** Clean, highly readable sans-serif (Inter or Plus Jakarta Sans) with tabular numbers for live energy readings.

## Key Visual Signature Element
- **Live Electricity Flow Diagram:** A clean, functional visual diagram showing power flowing from the main meter to rooms and appliances, where every line and indicator directly reflects real or simulated energy consumption (no useless fluff graphs).

## Component Style
- Tailwind CSS + DaisyUI / shadcn-style components.
- Generous padding, smooth micro-animations, clean status badges (Green = Eco/Low, Yellow = Normal, Red = High Consumption).
- Fully responsive layout that scales seamlessly from phone screens to desktop monitors.