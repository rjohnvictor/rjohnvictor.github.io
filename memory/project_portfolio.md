---
name: Portfolio App — Full Feature State
description: Next.js 16 portfolio with i18n (EN/ES), 3-mode theme system, ki cursor, DBZ power level intro, Three.js animations
type: project
---

Built 2026-07-14. At /Users/rjohn.victor/Meltwater/Portfolio.

**Stack:** Next.js 16.2, TypeScript, Tailwind CSS v4, Three.js (installed).

**Structure:**
- `src/data/portfolio.ts` — all content (PERSONAL, SKILLS, EXPERIENCE, PROJECTS, PHILOSOPHY, TECH_STACK)
- `messages/en.json` + `messages/es.json` — i18n translations
- `src/types/dictionary.ts` — Dictionary type
- `src/app/[locale]/` — locale-based routing (en/es)
- `src/context/ThemeContext.tsx` — ThemeProvider, useTheme, AppTheme type
- `src/components/` — all section components + new features

**Three modes (AppTheme):**
- `professional` — dark charcoal, blue accent, subtle particle bg, grid
- `power` — black/electric blue/purple, ki cursor, DBZ power level intro, energy effects
- `zen` — warm gray, serif font, minimal motion, no Three.js

**Key components:**
- `ThemeSwitcher.tsx` — floating bottom-right panel (💼/⚡/🧘)
- `KiCursor.tsx` — canvas cursor, only active in power mode
- `PowerLevelIntro.tsx` — DBZ-style power level charging intro (sessionStorage gated)
- `ThemeEffects.tsx` — mounts intro when user first enters power mode
- `HeroCanvas.tsx` — Three.js particle network (hidden in zen mode)
- `IcosahedronCanvas.tsx` — Three.js rotating wireframe (hidden in zen mode)

**i18n pattern:** No next-intl. middleware.ts redirects / → /en. getDictionary(locale) with static JSON imports. dict passed as props from [locale]/page.tsx to all components.

**Dev command:** `node node_modules/next/dist/bin/next dev --port 3001`
**Build:** `node node_modules/next/dist/bin/next build`

**Why npm workaround:** npm shell fn (_op_load NPM_TOKEN) conflicts; use `command npm` or node directly.
