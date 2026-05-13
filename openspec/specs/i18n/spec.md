# Internationalization Specification

## Purpose

Multi-language UI support using react-i18next with browser language detection.

## Requirements

### Requirement: Supported Languages

The system SHALL support 15 UI languages: English, Polish, German, French, Spanish, Portuguese, Italian, Japanese, Chinese, Korean, Arabic, Hindi, Russian, Turkish, Dutch.

#### Scenario: All translation keys present

- GIVEN any supported language
- WHEN the UI is rendered in that language
- THEN all UI strings are translated (no missing keys shown as raw key paths)

### Requirement: Language Detection

The system SHALL detect language from localStorage first, then browser navigator.

#### Scenario: Stored language preference

- GIVEN the user previously selected Polish
- WHEN the app loads
- THEN the UI renders in Polish

#### Scenario: Browser fallback

- GIVEN no stored language preference
- WHEN the browser language is "fr"
- THEN the UI renders in French

#### Scenario: Unsupported language fallback

- GIVEN the browser language is "sw" (not supported)
- WHEN the app loads
- THEN the UI renders in English (fallback)

### Requirement: Plural Forms

The system SHALL handle plural forms correctly per language rules.

#### Scenario: Polish plurals (3 forms)

- GIVEN Polish language is active
- WHEN displaying "1 day left"
- THEN it shows "Pozostal 1 dzien" (one form)
- WHEN displaying "2 days left"
- THEN it shows "Pozostaly 2 dni" (few form)
- WHEN displaying "12 days left"
- THEN it shows "Pozostalo 12 dni" (many form)

#### Scenario: Arabic plurals (6 forms)

- GIVEN Arabic language is active
- WHEN displaying countdown
- THEN correct form is used for zero/one/two/few/many/other

### Requirement: RTL Support

The system SHALL apply right-to-left text direction for Arabic.

#### Scenario: Arabic activates RTL

- GIVEN the user selects Arabic language
- WHEN the language changes
- THEN document root gets dir="rtl"
- AND the layout mirrors to RTL

#### Scenario: Switching away from Arabic restores LTR

- GIVEN Arabic is active (RTL)
- WHEN the user switches to English
- THEN document root gets dir="ltr"

### Requirement: Holiday Names Not Translated

The system SHALL NOT translate holiday/event names. They remain in the native language of the origin country.

#### Scenario: Polish holiday displayed in English UI

- GIVEN the UI language is English
- WHEN Polish holidays are loaded
- THEN holiday names display in Polish (e.g., "Dzien Niepodleglosci")
