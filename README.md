# LATTICE — Smart Energy Monitor

> **Connecting Ideas. Building Solutions.**

LATTICE is an affordable smart energy monitor for Indian homes. It shows room-by-room and appliance-by-appliance electricity usage in real time — in watts and rupees — so homeowners can finally see what is driving up their monthly bill and cut waste without guesswork.

Built as a collaboration with a school student founder (grade 8–12, no coding background). All technical decisions are made by the builder; this repo contains both the working app and the plain-English project guides.

## What it does

- **Live Home Assistant-style dashboard** with a real-time electricity flow map (main meter → rooms → appliances)
- **Live ₹ cost per appliance, room, and home** — usage × tariff, updated automatically
- **Home Assistant integration flow** — connect wizard that imports rooms, devices, and energy sensors
- **AI device identification** — a small model (SLM) studies usage patterns of unknown devices, verifies specs online, and the user confirms or corrects
- **Device detail pages** — 24-hour usage curve, today's kWh, cost math
- **Privacy & insights controls** — opt-in anonymized insight sharing, withdrawable at any time
- **PRO mode** — Electric Blue accent theme (demo toggle; PRO features designed for later)

> Note: live energy values are **simulated** for the demo. Real Home Assistant integration arrives in a later stage.

## Pages

| Route | Page |
| --- | --- |
| `/welcome` | Brand landing / demo entry |
| `/` | Live dashboard (flow map, totals, energy hogs, rooms, appliances) |
| `/connect` | Home Assistant connect wizard (3 steps) |
| `/devices` | Imported devices + AI identification, confirm/correct/edit |
| `/device/:id` | Appliance detail with 24h curve and cost math |
| `/insights` | Tariff setting, anonymized-sharing consent, PRO info |

## Tech stack

- **React 18 + Vite** — fast, browser-based web app (works on phones too)
- **Tailwind CSS** — styling with a Liquid Glass palette (deep slate navy, LATTICE magenta, PRO electric blue)
- **React Router** — multi-page navigation
- **Supabase** (planned) — free database + user accounts (no credit card)
- **Google Colab** (planned) — the SLM AI engine for appliance identification
- **Vercel** (planned) — free publishing for a shareable link

## Run it locally

Requirements: [Node.js LTS](https://nodejs.org) (free).

```bash
npm install     # first time only
npm run dev     # start the app
```

Then open **http://localhost:3000** in your browser. That's it.

Production build:

```bash
npm run build
npm run preview
```

## Project structure

```
docs/                plain-English guides (always up to date)
  PRD.md             master guide — links to everything
  database-plan.md   what we store (Supabase) + rules
  design-guidelines.md  colors, fonts, style rules
src/
  pages/             one file per screen
  components/        shell, cards, flow map, header
  hooks/             live energy simulation
  data/              demo data
public/              brand assets (lattice-mark.svg)
```

## Guides for non-coders

The whole project is documented in plain English inside [`docs/`](docs/PRD.md) — idea, who it's for, database plan, design guidelines. Read them or hand them to anyone.

## Status

- ✅ Stage 1–4: idea, logic, design, plan
- 🚧 Stage 5: base app built, multi-page flow working (simulated data)
- ⏳ Remaining: final UI from Google Stitch, Supabase wiring, AI engine (Colab), Vercel publish, real Home Assistant integration