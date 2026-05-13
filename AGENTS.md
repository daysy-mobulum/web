# AGENTS.md — Technical Documentation

## Architecture

```
src/
├── components/       # Reusable UI components
│   ├── Layout.tsx           # Main layout with header, nav, footer
│   ├── OnboardingModal.tsx  # Multi-step onboarding wizard
│   ├── OnboardingWrapper.tsx # Conditional onboarding display
│   ├── EventForm.tsx        # Create/edit event modal form
│   └── CountryChangeModal.tsx # Country change confirmation
├── context/
│   └── AppContext.tsx       # Global state (React Context + localStorage)
├── data/
│   ├── countries.ts         # 50 countries with metadata
│   └── holidays/            # JSON files per country (*.json) + loader
├── i18n/
│   ├── index.ts             # i18next configuration
│   └── locales/             # 15 language translation files
├── pages/
│   ├── HomePage.tsx         # Events list with countdown
│   ├── SettingsPage.tsx     # All user settings
│   └── AboutPage.tsx        # Project info and support links
├── test/                    # Vitest test files
├── types.ts                 # TypeScript type definitions
└── utils/
    ├── countdown.ts         # Event date calculation logic
    ├── icsParser.ts         # ICS/iCal file parser (Google/Apple Calendar import)
    ├── storage.ts           # localStorage CRUD operations
    └── theme.ts             # Dark/light mode application
```

## Key Design Decisions

### No backend / No database
All data lives in `localStorage` under key `daysy-data`. No IndexedDB/Dexie needed — data is flat (events array + tags array + settings object).

### SPA on GitHub Pages
GitHub Pages doesn't support SPA routing natively. Solution:
1. `public/404.html` — redirects any path to `/?/path`
2. `index.html` — inline script reads `?/path` from URL and uses `history.replaceState` to restore the original path
3. React Router (`BrowserRouter`) handles routing normally after that

### Data Model

```typescript
interface UserEvent {
  id: string;              // UUID v4
  name: string;           
  date: string;           // YYYY-MM-DD
  time?: string;          // HH:mm
  recurrence: "none" | "weekly" | "monthly" | "yearly";
  comment?: string;
  tags: string[];         // Tag IDs
}

interface Tag {
  id: string;
  name: string;
  color: string;          // hex
}

interface AppSettings {
  country: string;        // ISO 3166-1 alpha-2
  language: string;       // ISO 639-1
  timezone: string;       // IANA timezone
  appearance: "light" | "dark" | "system";
  onboardingCompleted: boolean;
}
```

### Holiday Data Format

Fixed-date holidays:
```json
{ "name": "Dzień Niepodległości", "month": 11, "day": 11 }
```

Variable-date holidays (Easter, lunar):
```json
{ "name": "Easter Monday", "dates": ["2025-04-21", "2026-04-06", ...] }
```

### Countdown Logic (`utils/countdown.ts`)
- **none**: Show only if today or future. Past = hidden.
- **yearly**: Next occurrence = same month/day this year or next year.
- **monthly**: Next occurrence = same day this month or next month.
- **weekly**: Next occurrence = same weekday, within 7 days.

### i18n
- `react-i18next` with `i18next-browser-languagedetector`
- Detection order: localStorage → navigator language
- Fallback: English
- Holiday names are NOT translated (native language of origin country only)
- UI strings are translated to 15 languages

### Theme
- Tailwind CSS `dark:` variant with class strategy
- Theme applied before React render (in `main.tsx`) to prevent FOUC
- `applyTheme()` function updates `document.documentElement.classList`

## Development

### Prerequisites
- Node.js 20+
- npm

### Testing
```bash
npm test              # Run once
npm run test:watch    # Watch mode
```

Tests use:
- `vitest` as test runner
- `@testing-library/react` for component tests
- `jsdom` environment
- Mocked `react-i18next` and `AppContext` in component tests

### Linting & Formatting
```bash
npm run lint          # ESLint
npm run format        # Prettier (write)
npm run format:check  # Prettier (check only)
```

### Deployment
Push to `main` branch triggers GitHub Actions workflow:
1. Install dependencies
2. Lint
3. Test
4. Build
5. Deploy to GitHub Pages

Custom domain: `daysy.mobulum.com` (CNAME in `public/`)

## Adding a New Country

1. Create `src/data/holidays/{CODE}.json` with holiday array
2. Add country entry to `src/data/countries.ts`
3. That's it — the holiday loader uses `import.meta.glob` to auto-discover JSON files

## Adding a New Language

1. Create `src/i18n/locales/{code}.json` (copy structure from `en.json`)
2. Import and register in `src/i18n/index.ts`
3. Add entry to `supportedLanguages` array
