# PBIFilterButton

## Description
A button that allows one to apply filters in a specified, predetermined way simply by clicking on it. The power of this button is that it allows one to filter specific columns without affecting the filters already applied to other columns, which is how a Bookmark behaves.

## Status
Currently at a minimum viable product stage. At this point, one can only filter based on one column and the interface for specifying the filter contents is a measure with a comma-separated list of "included values". Error checking is not in place.

## Features to Implement
- Only applies correct click event when refreshing visual. Fix this
- Error checking for measure formatting
- Error checking for types of column being filtered vs filter array
- Filter based on multiple columns
- Filter based on multiple logic (include, exclude, etc.)
- Improved interface to specify filters (not formatted measure)
- Applied filter isn't reflected in the filter pane. Fix this (may need to switch filter method from applyJsonFilter to Selection Manager)
- Improved/streamlined button formatting options
