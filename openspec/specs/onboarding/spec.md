# Onboarding Specification

## Purpose

First-time user onboarding flow that configures country, language, timezone, and optionally loads default holiday events.

## Requirements

### Requirement: Multi-step Onboarding Modal

The system SHALL present a multi-step onboarding modal on first visit when settings have not been configured.

#### Scenario: First visit triggers onboarding

- GIVEN a user visits the application for the first time (no localStorage data)
- WHEN the app loads
- THEN the onboarding modal is displayed with step 1 (country selection)

#### Scenario: Returning user skips onboarding

- GIVEN a user has completed onboarding previously (onboardingCompleted = true)
- WHEN the app loads
- THEN no onboarding modal is shown

### Requirement: Country Detection and Selection

The system SHALL attempt to detect the user's country from browser language and offer it as the default selection.

#### Scenario: Country auto-detected

- GIVEN the browser language is "pl"
- WHEN onboarding step 1 loads
- THEN Poland (PL) is pre-selected in the country dropdown

#### Scenario: User changes country

- GIVEN the country dropdown shows a pre-selected value
- WHEN the user selects a different country
- THEN the selection updates accordingly

### Requirement: Language Selection

The system SHALL offer supported languages with the detected language pre-selected.

#### Scenario: Language matches browser

- GIVEN the browser language is "de"
- WHEN onboarding step 2 loads
- THEN German (Deutsch) is pre-selected

### Requirement: Timezone Selection

The system SHALL detect timezone from Intl API and allow user to change it.

#### Scenario: Timezone auto-detected

- GIVEN the user's system timezone is "Europe/Warsaw"
- WHEN onboarding step 3 loads
- THEN "Europe/Warsaw" is pre-selected

### Requirement: Default Holidays Loading

The system SHALL offer to load pre-defined holidays for the selected country.

#### Scenario: Country has holidays available

- GIVEN the user selected Poland (which has holiday data)
- WHEN onboarding step 4 loads
- THEN a checkbox is shown to load default holidays
- AND it is checked by default

#### Scenario: Country has no holidays

- GIVEN the user selected a country without holiday data
- WHEN onboarding step 4 loads
- THEN a message indicates no default holidays are available

#### Scenario: User accepts default holidays

- GIVEN the checkbox is checked
- WHEN the user clicks "Finish"
- THEN country holidays are added to the user's event list as yearly recurring events

### Requirement: Skip Onboarding

The system SHALL allow users to skip onboarding entirely.

#### Scenario: User clicks skip

- GIVEN the onboarding modal is displayed
- WHEN the user clicks "Skip"
- THEN settings are populated from browser defaults (detected country, language, timezone)
- AND onboardingCompleted is set to true
- AND no default holidays are loaded
