# Settings Specification

## Purpose

User preferences management including appearance, locale, tags, data import/export, and data deletion.

## Requirements

### Requirement: Appearance Mode

The system SHALL support three appearance modes: light, dark, and system.

#### Scenario: Select dark mode

- GIVEN the user is on the settings page
- WHEN the user selects "Dark"
- THEN the dark class is added to the document root
- AND the preference is saved to localStorage

#### Scenario: System mode follows OS preference

- GIVEN the user selects "System" mode
- WHEN the OS prefers dark mode
- THEN dark mode is applied
- AND if the OS preference changes, the theme updates accordingly

### Requirement: Locale Settings

The system SHALL allow changing country, language, and timezone after onboarding.

#### Scenario: Change language

- GIVEN the user is on settings page
- WHEN the user selects a different language
- THEN the UI immediately re-renders in the new language
- AND the preference is persisted

#### Scenario: Change country triggers modal

- GIVEN the user changes the country selection
- WHEN the new country differs from the current
- THEN a confirmation modal appears informing that existing events are kept
- AND the user is offered to load default holidays for the new country
- AND the user is offered to change the language

### Requirement: Tag Management

The system SHALL allow creating, viewing, and deleting tags from settings.

#### Scenario: Create new tag

- GIVEN the user enters a tag name and clicks "Add Tag"
- WHEN the tag is created
- THEN it appears in the tag list with an auto-assigned color

#### Scenario: Delete tag

- GIVEN a tag exists that is assigned to events
- WHEN the user deletes the tag
- THEN the tag is removed from the tag list
- AND the tag reference is removed from all events that had it

### Requirement: Data Export

The system SHALL export all user data (settings, events, tags) as a JSON file.

#### Scenario: Export data

- GIVEN the user clicks "Export Data"
- WHEN the export completes
- THEN a JSON file named "daysy-data.json" is downloaded
- AND the file contains complete settings, events, and tags

### Requirement: Data Import

The system SHALL import previously exported JSON data.

#### Scenario: Valid import

- GIVEN the user selects a valid daysy-data.json file
- WHEN the import is processed
- THEN all settings, events, and tags are replaced with imported data
- AND the UI updates to reflect imported state

#### Scenario: Invalid import

- GIVEN the user selects an invalid or malformed file
- WHEN the import is attempted
- THEN an error message is displayed
- AND existing data is not modified

### Requirement: Delete All Data

The system SHALL allow complete data deletion with confirmation.

#### Scenario: Delete all with confirmation

- GIVEN the user clicks "Delete All Data"
- WHEN the confirmation panel appears
- THEN the user must click a second button to confirm
- AND upon confirmation, all data is removed from localStorage
- AND the onboarding flow becomes available again
