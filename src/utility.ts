"use strict";

import powerbi from "powerbi-visuals-api";
import * as models from 'powerbi-models';
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbi.DataView;
import DataViewCategoricalColumn = powerbi.DataViewCategoricalColumn;
import IFilterColumnTarget = models.IFilterColumnTarget;
import { VisualSettings } from "./settings";

export class Utility {
    private readonly FILTER_DELIMINATOR: string = ",";

    public createSampleLandingPage() {
        const landingPage: HTMLElement = document.createElement("div");

        const title: HTMLElement = document.createElement("h5");
        title.appendChild(
            document.createTextNode("Start Instructions")
        );
        title.style.margin = "0";

        const list: HTMLElement = document.createElement("ul");
        list.style.padding = "0 0 0 20px";
        list.style.margin = "8px 0"

        const itemOne: HTMLElement = document.createElement("li");
        itemOne.appendChild(
            document.createTextNode("Add the column(s) that you would like to slice to the Category field")
        );
        itemOne.style.listStyle = "outside";
        itemOne.style.marginBottom = "4px";

        const itemTwo: HTMLElement = document.createElement("li");
        itemTwo.appendChild(
            document.createTextNode("In the Slicer > Values field(s), enter the values that you would like to INCLUDE upon clicking the visual. Do this as a comma-separated list (without spaces between items)")
        );
        itemTwo.style.listStyle = "outside";
        itemTwo.style.marginBottom = "4px";

        const itemThree: HTMLElement = document.createElement("li");
        itemThree.appendChild(
            document.createTextNode("Optionally, drag this visual over another visual (ex. a Card) and change the Background > Transparency to 100%")
        );
        itemThree.style.listStyle = "outside";

        list.appendChild(itemOne);
        list.appendChild(itemTwo);
        list.appendChild(itemThree);

        landingPage.appendChild(title);
        landingPage.appendChild(list);

        return landingPage;
    }

    public getFilters(options: VisualUpdateOptions, visualSettings: VisualSettings) {
        let dataView: DataView = options.dataViews[0];
        let basicFilters: Array<models.IBasicFilter> = [];
        
        if (!dataView.categorical) {
            return basicFilters;
        }

        let categoryCount: number = dataView.categorical.categories.length;

        /* An array of the values to be sliced as specified by the user */
        let slicerText: Array<string> = [visualSettings.slicer.values1, visualSettings.slicer.values2];

        /* The following loop allows for slicing based on multiple columns (we are currently 
            restricted to 2 in capabilities.json) */
        for (let i = 0; i < categoryCount; i++) {
            let category: DataViewCategoricalColumn = dataView.categorical.categories[i];

            let target: IFilterColumnTarget = {
                table: category.source.queryName.substr(0, category.source.queryName.indexOf('.')),
                column: category.source.displayName
            }

            let values: Array<any>;

            if (dataView.categorical.categories[i].source.type.numeric) {
                values = slicerText[i].split(this.FILTER_DELIMINATOR).map(Number);
            } else {
                values = slicerText[i].split(this.FILTER_DELIMINATOR);
            }

            let basicFilter: models.IBasicFilter = {
                $schema: "http://powerbi.com/product/schema#basic",
                target: target,
                operator: "In",
                values: values,
                filterType: models.FilterType.Basic,
                requireSingleSelection: true
            }

            basicFilters.push(basicFilter);
        }

        return basicFilters;
    }
}