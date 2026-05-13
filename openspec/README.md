# OpenSpec — Daysy

This directory contains the specifications for Daysy, organized by domain.

## Spec Domains

| Domain | Description |
|--------|-------------|
| `events/` | Core event management, countdown logic, CRUD, recurrence |
| `onboarding/` | First-time user onboarding flow |
| `settings/` | User preferences, tags, data management |
| `storage/` | localStorage persistence, data model |
| `i18n/` | Internationalization, plurals, RTL support |
| `theme/` | Dark/light mode, FOUC prevention |
| `about/` | Project info and support links |

## Structure

```
openspec/
├── specs/           # Source of truth — current system behavior
├── changes/         # Proposed modifications (empty when stable)
└── schemas/         # Workflow definitions
```

## Usage

To propose a change:
```
/opsx:propose <description>
```

To review current specs, browse the `specs/` directory by domain.
