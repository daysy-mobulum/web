# Storage Specification

## Purpose

Client-side data persistence using browser localStorage. All user data stays on-device.

## Requirements

### Requirement: Single Storage Key

The system SHALL store all application data under a single localStorage key "daysy-data".

#### Scenario: Data structure

- GIVEN the application is running
- WHEN data is saved
- THEN localStorage key "daysy-data" contains a JSON object with: settings, events, tags

### Requirement: Default State

The system SHALL provide sensible defaults when no data exists.

#### Scenario: First load

- GIVEN localStorage has no "daysy-data" key
- WHEN loadData() is called
- THEN default settings are returned (empty country/language, system timezone, appearance "system", onboardingCompleted false)
- AND events and tags arrays are empty

### Requirement: Data Integrity

The system SHALL handle corrupted or invalid stored data gracefully.

#### Scenario: Corrupted JSON

- GIVEN localStorage contains invalid JSON in "daysy-data"
- WHEN loadData() is called
- THEN default data is returned without throwing

### Requirement: No Server Communication

The system MUST NOT send any user data to external servers. All data operations are local.

#### Scenario: Network isolation

- GIVEN the application is running
- WHEN any data operation occurs (save, load, export, import)
- THEN no network requests are made
- AND all data remains in the browser
