# Slicer Button

## Description
A button that allows one to apply a filter in a specified, predetermined way simply by clicking on it. The power of this button is that it allows one to filter a specific column without affecting the filters already applied to other columns, which is how Bookmarks behave.

## Status
Currently at a minimum viable product stage. At this point, one can filter based on a column, but only with a basic filter. The interface for specifying the filter contents is a comma-delimited list in the format pane. Error checking is not in place.

## Features to Implement
- Allow filter to work with all column types
- ~~Only applies correct click event after refreshing visual. Fix this~~
- Error checking for measure formatting (not needed, will migrate selection to a format field)
- Error checking for types of columns being filtered vs filter array
- Filter based on multiple logic (include, exclude, etc.)
- ~~Improved interface to specify filters (not formatted measure, will migrate selection to a format field)~~
- ~~Applied filter isn't reflected in the filter pane. Fix this (this is not be possible)~~
- Improved/streamlined button formatting options
- ~~Allow "selected" state to persist when navigating back to report~~
- Add landing page