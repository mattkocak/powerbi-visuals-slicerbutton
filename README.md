# PBIFilterButton

## Description
A button that allows one to apply filters in a specified, predetermined way simply by clicking on it. The power of this button is that it allows one to filter specific columns without affecting the filters already applied to other columns, which is how a Bookmark behaves.

## Status
Currently at a minimum viable product stage. At this point, one can filter based on multiple columns, but only with a basic filter. The interface for specifying the filter contents is a measure with a pipe-separated list of "included values". Error checking is not in place.

## Features to Implement
- Allow filter to work with all column types
- Only applies correct click event after refreshing visual. Fix this
- Error checking for measure formatting
- Error checking for types of column being filtered vs filter array
- Filter based on multiple logic (include, exclude, etc.)
- Improved interface to specify filters (not formatted measure)
- Applied filter isn't reflected in the filter pane. Fix this (this may not be possible)
- Improved/streamlined button formatting options
- ~~Allow "selected" state to persist when navigating back to report~~
