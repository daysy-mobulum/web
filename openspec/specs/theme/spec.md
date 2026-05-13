# Theme Specification

## Purpose

Visual appearance management with dark mode, light mode, and system preference detection.

## Requirements

### Requirement: Theme Persistence Without Flash

The system SHALL apply the theme before React renders to prevent flash of unstyled content (FOUC).

#### Scenario: Stored dark mode

- GIVEN the user previously selected dark mode
- WHEN the page loads
- THEN the dark class is applied to the document root before React mounts
- AND no flash of light theme is visible

#### Scenario: System preference on first load

- GIVEN no stored preference exists
- WHEN the page loads and OS prefers dark
- THEN dark mode is applied before React mounts

### Requirement: Tailwind Dark Mode via Class Strategy

The system SHALL use Tailwind CSS class-based dark mode (class "dark" on html element).

#### Scenario: Dark class enables dark styles

- GIVEN the dark class is present on document.documentElement
- WHEN components render with dark: variants
- THEN dark mode styles are applied

### Requirement: Theme Switching

The system SHALL switch themes immediately when the user changes preference.

#### Scenario: Switch from light to dark

- GIVEN light mode is active
- WHEN the user selects dark
- THEN the dark class is immediately added
- AND the preference is saved to localStorage
