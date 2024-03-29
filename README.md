# Slicer Button

## Description
A button in Power BI that allows one to apply multiple slicers in a specified, predetermined way simply by clicking on it. A particularly powerful use case is making this button a transparent overlay over a [Card](https://docs.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-card) visual. This essentially turns the Card visual into a clickable slicer without any of the potential limitations of a bookmark, which is the main alternative to accomplish this.

Additional context for this custom visual can be found in the [Turn your cards into slicers with the Slicer Button custom visual](https://community.powerbi.com/t5/Community-Blog/Turn-your-cards-into-slicers-with-the-Slicer-Button-custom/ba-p/2676449) blog post.

![Slicer Button](https://user-images.githubusercontent.com/21995128/184308888-21f7c780-ed5b-4e72-9e7b-3f6b8596ad95.gif)

## Features
- Supports Power BI Desktop February 2022 and later
- Slice number and text data type columns
- Slice up to two columns at the same time (utilizes AND logic)
- Slice based on specified comma-delimited **inclusion** list
- Format selection color and transparency
- Other common button formatting features

## Setup
- Make sure to use Power BI Service or Power BI Desktop February 2022 or later
- Click on the latest release (right-hand side of this repository) and download the **slicerButtonv#.#.#.pviz** file from the Assets section

<img width="192" alt="image" src="https://user-images.githubusercontent.com/21995128/176463324-e24979ce-39e6-478c-80f9-c22f4b4cf3b8.png">

- In Power BI, follow the steps in the [Import a custom visual](https://docs.microsoft.com/en-us/power-bi/developer/visuals/import-visual#import-a-visual-file-from-your-local-computer-into-power-bi) article to import the Slicer Button visual into your report
- Watch the tutorial videos below or follow the instructions displayed on the visual to begin using the Slicer Button

<img width="133" alt="Start Instructions" src="https://user-images.githubusercontent.com/21995128/176464710-a7c62a17-5ba4-466c-bd01-b4e144168133.png">

## Tutorials
- [Basic Usage](https://www.youtube.com/watch?v=8x2QoE8M2yA&ab_channel=MattKocak)
- [Slicing Based on Two Columns](https://www.youtube.com/watch?v=Mu9kRZot1d0&ab_channel=MattKocak)
- [Slicing Dates and Complex Logic](https://www.youtube.com/watch?v=_mTS2_dPBZ8&ab_channel=MattKocak)

## Support
Submit bugs, feature requests, and questions as [new issues](https://github.com/mattkocak/powerbi-visuals-slicerbutton/issues/new/choose) in this repository. Use the correct template for the submission (bug report, feature request, etc).

## Contribute
This is an open source project and encourages contributions. To do this, please follow the [contributing guidelines](https://github.com/mattkocak/powerbi-visuals-slicerbutton/blob/main/CONTRIBUTING.md) for this repo and submit all pull requests to the **dev** branch.
