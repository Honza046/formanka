# Formanka Žeravice

Moderní homepage pro rodinnou restauraci a penzion v Žeravicích.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Lucide React** — ikony
- **Playfair Display** + **Plus Jakarta Sans** — typografie

## Spuštění

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Struktura

```
src/app/
  layout.tsx       # fonty, metadata
  page.tsx         # homepage — skládá sekce
  globals.css      # design tokens (ivory, forest, terracotta…)

components/
  Navbar.tsx       # sticky navigace + CTA „Dnešní menu"
  HeroBento.tsx    # bento grid hero (menu, penzion, bowling, hodiny)
  MenuTabs.tsx     # interaktivní záložky jídelního lístku
  Footer.tsx       # kontakt, mapa, sociální sítě

lib/data.ts        # veškerý obsah (menu, telefony, otevírací doba…)
```

## Design

Modernizovaná moravská hospoda — teplé ivory pozadí (#FDFBF7), lesní zelená (#14532D), terakotové akcenty, serifové nadpisy, bento grid hero.
