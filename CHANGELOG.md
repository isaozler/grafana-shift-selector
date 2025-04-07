# Changelog

## 2.0.0 Major Updade
**Codebase**
- Full refactor of the codebase (react 19)
- Zustand Store management
- Unit & e2e test

**UI/UX**
- All the data-linking settings are moved to the plugin panels
- Data mapping by database columns through the panels in combination with the native query builder of Grafana, enabling a more straightforward setup

**Fixes**
- Infinite loop in newer versions of Grafana
- Date input cropping
- "Next day" issues with day overlapping shifts
- and some other minor enhancements/bug fixes

## 0.1.6

- Release workfile updated for updated Grafana signing flow
- Fixes for [issue #28](https://github.com/isaozler/grafana-shift-selector/issues/33)
  - With Grafana version 10, the plug-in was failing to retrieve and set the shifts and options correctly due to changes in the fetch API
- Fix for [issue #26](https://github.com/isaozler/grafana-shift-selector/issues/26)
  - The useEffect was triggered without checking if the warning wasn't already set.
- Packages updated
- Static data bug fix
- Grafana version upgrade (11.0.0)

## 0.1.5

- Fixes for [issue #28](https://github.com/isaozler/grafana-shift-selector/issues/28)
  - Passing the refresh param after shift change.

## 0.1.3 - 0.1.4

- Fixes for [issue #16](https://github.com/isaozler/grafana-shift-selector/issues/16)
  - Custom interval for detached reload checks to preserve other dashboard panels
- Grafana Review fixes
  - Fixed blocked panel updates to avoid memory leaks
  - Remaining deprecated window.location.search

## 0.1.2

- Fixes for [issue #16](https://github.com/isaozler/grafana-shift-selector/issues/16)
  - Fixed groupUUID field. Gets auto-selected if not provided.
  - Breaking refresh rate fixed. Added custom refresh rate input to force dashboard refresh at preferred rate.
- Added progressbar to visualise the refresh rate
- Deprecated location service replaced

## 0.1.1

- Fixed review bugs
  - Grafana css classes removed
  - Multiple shift-selector-panels blocked in dashboard mode, to prevent infinite loops
- Added extra options
  - Ability to hide date range buttons
- UI bug fixes
  - Icon overlapping labels
  - Production date height shift

## 0.1.0

- Realtime bugs fixed
- Localisation for labels added
- Refactored
- Panel properties optimised

## 0.0.3

Realtime Shift feature and, extra panel options added to customize the panel. Like changing labels and display types.

## 0.0.2

Ability to add static shifts

## 0.0.1

Initial release.
