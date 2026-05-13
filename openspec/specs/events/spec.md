# Events Specification

## Purpose

Core event management — creating, editing, deleting user events, displaying countdown timers, and managing event recurrence logic.

## Requirements

### Requirement: Event Countdown Display

The system SHALL display a sorted list of user events with the number of days remaining until each event's next occurrence.

#### Scenario: Events sorted by proximity

- GIVEN a user has multiple events with different upcoming dates
- WHEN the home page is rendered
- THEN events are sorted ascending by days remaining (nearest first)

#### Scenario: Event is today

- GIVEN an event whose next occurrence is today
- WHEN the home page is rendered
- THEN the event displays "Today!" instead of a day count

#### Scenario: Past non-recurring event is hidden

- GIVEN a one-time event whose date has passed
- WHEN the home page is rendered
- THEN the event is not displayed in the list

### Requirement: Event Recurrence

The system SHALL support recurring events with types: none, weekly, monthly, yearly.

#### Scenario: Yearly recurrence rolls over

- GIVEN a yearly event dated March 15
- WHEN today is March 16
- THEN the next occurrence is calculated as March 15 of the following year

#### Scenario: Monthly recurrence

- GIVEN a monthly event dated on the 15th
- WHEN today is the 16th of the current month
- THEN the next occurrence is the 15th of the next month

#### Scenario: Weekly recurrence

- GIVEN a weekly event set for Sunday
- WHEN today is Monday
- THEN the next occurrence is the following Sunday (6 days later)

#### Scenario: Non-recurring event shows only if future

- GIVEN a one-time event
- WHEN the event date is in the past
- THEN it returns no next occurrence (hidden from list)

### Requirement: Event CRUD

The system SHALL allow users to create, edit, and delete events.

#### Scenario: Create event

- GIVEN a user on the home page
- WHEN the user clicks "Add Event" and fills in name, date, recurrence
- THEN a new event is added to the list with a generated UUID
- AND the list re-sorts to include the new event

#### Scenario: Edit event

- GIVEN an existing event in the list
- WHEN the user clicks edit and modifies the event name
- THEN the event is updated in place with the new name

#### Scenario: Delete event with confirmation

- GIVEN an existing event in the list
- WHEN the user clicks delete once
- THEN a confirmation state is shown (second click required)
- AND clicking again permanently removes the event

### Requirement: Event Data Model

The system SHALL store events with the following fields: id (UUID), name (string), date (YYYY-MM-DD), time (optional HH:mm), recurrence (none|weekly|monthly|yearly), comment (optional string), tags (array of tag IDs).

#### Scenario: Event with all fields

- GIVEN a user creates an event with name, date, time, recurrence, comment, and tags
- WHEN the event is saved
- THEN all fields are persisted to local storage

#### Scenario: Event with minimal fields

- GIVEN a user creates an event with only name and date
- WHEN the event is saved
- THEN recurrence defaults to "none" and optional fields are omitted

### Requirement: Tag-based Filtering

The system SHALL allow filtering the event list by user-defined tags.

#### Scenario: Filter by single tag

- GIVEN events with various tags assigned
- WHEN the user selects a tag filter
- THEN only events containing that tag are displayed
- AND events remain sorted by days remaining

#### Scenario: Show all (no filter)

- GIVEN a tag filter is active
- WHEN the user clicks "All"
- THEN all events are displayed regardless of tags
