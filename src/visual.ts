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
import DataView = powerbi.DataView;
import DataViewCategoricalColumn = powerbi.DataViewCategoricalColumn;
import IFilterColumnTarget = models.IFilterColumnTarget;

import "./../style/visual.less"

export class FilterButton implements IVisual {
    private FILTER_DELIMINATOR: string = "|";
    private FILTER_SHOW_ALL_KEYWORD: string = "ALL";

    private target: HTMLElement;
    private visualHost: IVisualHost;
    private clicked: Boolean;
    private hasEvent: Boolean;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.visualHost = options.host;
        this.clicked = false;
        this.hasEvent = false;
    }

    public update(options: VisualUpdateOptions) {
        if (!this.hasEvent) {
            this.setFilterEvent(this.getFilters(options));
            this.hasEvent = true;
        }
    }

    private getFilters(options: VisualUpdateOptions) {
        let dataView: DataView = options.dataViews[0];
        let categoryCount: Number = dataView.categorical.categories.length;
        let basicFilters: Array<models.IBasicFilter> = [];

        for (let i = 0; i < categoryCount; i++) {
            let category: DataViewCategoricalColumn = dataView.categorical.categories[i];

            let target: IFilterColumnTarget = {
                table: category.source.queryName.substr(0, category.source.queryName.indexOf('.')),
                column: category.source.displayName
            }

            let values: Array<any>;

            if (dataView.categorical.values[i].values[0].toString() === this.FILTER_SHOW_ALL_KEYWORD) {
                values= dataView.categorical.categories[i].values;
            } else if (dataView.categorical.categories[i].source.type.numeric) {
                values = 
                    dataView.categorical.values[i].values[0].toString().split(this.FILTER_DELIMINATOR)
                    .map(Number);
            } else {
                values = 
                    dataView.categorical.values[i].values[0].toString().split(this.FILTER_DELIMINATOR);
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

    private setFilterEvent(basicFilters: Array<models.IBasicFilter>) {
        this.target.addEventListener("click", () => {
            if (this.clicked) {
                this.visualHost.applyJsonFilter(basicFilters, "general", "filter", FilterAction.remove);
                this.clicked = false;
                this.target.innerHTML = 
                    ``;
            } else {
                this.visualHost.applyJsonFilter(basicFilters, "general", "filter", FilterAction.merge);
                this.clicked = true;
                this.target.innerHTML = 
                    `<div class="overlay"></div>`;
            }
        });
    }
}