/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import * as models from 'powerbi-models';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import FilterAction = powerbi.FilterAction;
import VisualUpdateType = powerbi.VisualUpdateType;
import DataView = powerbi.DataView;
import DataViewCategoricalColumn = powerbi.DataViewCategoricalColumn;
import IFilterColumnTarget = models.IFilterColumnTarget;
import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;

import "./../style/visual.less"

export class FilterButton implements IVisual {
    private readonly FILTER_DELIMINATOR: string = ",";

    private target: HTMLElement;
    private visualHost: IVisualHost;
    private clicked: Boolean;
    private visualSettings: VisualSettings;
    private basicFilters: Array<models.IBasicFilter>;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.visualHost = options.host;
        this.clicked = false;
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    public update(options: VisualUpdateOptions) {
        let dataView: DataView = options.dataViews[0];
        this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);

        if (options.type === VisualUpdateType.All) {
            if (options.jsonFilters.length > 0) {
                this.clicked = true;
                this.target.style.backgroundColor = this.visualSettings.slicer.selectionFill;
                this.target.style.opacity = (1 - this.visualSettings.slicer.transparency / 100).toString();
            }

            this.basicFilters = this.getFilters(options);
            if (this.basicFilters.length > 0) {
                this.setFilterEvent();
            }
        } else if (options.type === VisualUpdateType.Data) {
            this.target.removeEventListener("click", this.applyFilter);
            this.basicFilters = this.getFilters(options);

            // Update the selection fill color in case a change was made to this property
            if(this.clicked) {
                this.target.style.backgroundColor = this.visualSettings.slicer.selectionFill;
                this.target.style.opacity = (1 - this.visualSettings.slicer.transparency / 100).toString();
            }

            if (this.basicFilters.length > 0) {
                this.setFilterEvent();
            } else if (this.clicked) {
                this.visualHost.applyJsonFilter(null, "general", "filter", FilterAction.merge);
                this.clicked = false;
                this.target.style.backgroundColor = "#FFFFFF";
                this.target.style.opacity = "0";
            }
        }
    }

    public destroy() {
        this.visualHost.applyJsonFilter(null, "general", "filter", FilterAction.merge);
    }

    private getFilters(options: VisualUpdateOptions) {
        let dataView: DataView = options.dataViews[0];
        let basicFilters: Array<models.IBasicFilter> = [];

        if (!dataView.categorical.categories) {
            return basicFilters;
        }

        let categoryCount: Number = dataView.categorical.categories.length;

        /* This loop allows for slicing based on multiple columns (although we are currently restricted to 1 in capabilities.json) */
        for (let i = 0; i < categoryCount; i++) {
            let category: DataViewCategoricalColumn = dataView.categorical.categories[i];

            let target: IFilterColumnTarget = {
                table: category.source.queryName.substr(0, category.source.queryName.indexOf('.')),
                column: category.source.displayName
            }

            let values: Array<any>;

            if (dataView.categorical.categories[i].source.type.numeric) {
                values = this.visualSettings.slicer.values.split(this.FILTER_DELIMINATOR).map(Number);
            } else {
                values = this.visualSettings.slicer.values.split(this.FILTER_DELIMINATOR);
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

    private setFilterEvent() {
        this.target.addEventListener("click", this.applyFilter)
    }

    private applyFilter = (e: PointerEvent) => {
        if (this.clicked) {
            this.visualHost.applyJsonFilter(this.basicFilters, "general", "filter", FilterAction.remove);
            this.clicked = false;
            this.target.style.backgroundColor = "#FFFFFF";
            this.target.style.opacity = "0";
        } else {
            this.visualHost.applyJsonFilter(this.basicFilters, "general", "filter", FilterAction.merge);
            this.clicked = true;
            this.target.style.backgroundColor = this.visualSettings.slicer.selectionFill;
            this.target.style.opacity = (1 - this.visualSettings.slicer.transparency / 100).toString();
        }
    }
}