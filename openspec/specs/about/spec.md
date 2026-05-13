# About Page Specification

## Purpose

Public-facing information about the project including its mission, privacy stance, and support options.

## Requirements

### Requirement: Project Description

The system SHALL display information about what problem Daysy solves and how it works.

#### Scenario: About content is visible

- GIVEN the user navigates to /about
- WHEN the page renders
- THEN sections are displayed for: problem statement, free usage, privacy, open source

### Requirement: Privacy Information

The system SHALL clearly communicate that no data leaves the browser.

#### Scenario: Privacy section content

- GIVEN the about page is rendered
- WHEN the user reads the privacy section
- THEN it states: no tracking, no analytics, no cookies, no server, all data local

### Requirement: Support Links

The system SHALL display links to support the project via GitHub, Patreon, Ko-fi, and Buy Me a Coffee.

#### Scenario: Support links are functional

- GIVEN the about page is rendered
- WHEN the user clicks a support link
- THEN it opens the correct external URL in a new tab
- AND links point to: github.com/Zenedith, patreon.com/Zenedith, ko-fi.com/Zenedith, buymeacoffee.com/Zenedith

### Requirement: Open Source Reference

The system SHALL link to the source code repository.

#### Scenario: GitHub repository link

- GIVEN the about page is rendered
- WHEN the user clicks the GitHub link
- THEN it opens https://github.com/daysy-mobulum/web in a new tab
