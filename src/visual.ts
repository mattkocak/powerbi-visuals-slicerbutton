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
import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import "./../style/visual.less"
import * as d3 from "d3";
import { Utility } from "./utility";

export class SlicerButton implements IVisual {
    private readonly FILTER_DELIMINATOR: string = ",";

    private target: HTMLElement;
    private visualHost: IVisualHost;
    private clicked: Boolean;
    private visualSettings: VisualSettings;
    private basicFilters: Array<models.IBasicFilter>;
    private isLandingPageOn: boolean;
    private LandingPageRemoved: boolean;
    private LandingPage: d3.Selection<any, any, any, any>;
    private utility: Utility;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.visualHost = options.host;
        this.clicked = false;
        this.utility = new Utility();
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

            this.basicFilters = this.utility.getFilters(options, this.visualSettings);

            if (this.basicFilters.length > 0) {
                this.setFilterEvent();
            }
        } else if (options.type === VisualUpdateType.Data) {
            // If the update is of type data, we need to re-construct our filter setup
            this.target.removeEventListener("click", this.applyFilter);

            // Update the selection fill color in case a change was made to this property
            if(this.clicked) {
                this.target.style.backgroundColor = this.visualSettings.slicer.selectionFill;
                this.target.style.opacity = (1 - this.visualSettings.slicer.transparency / 100).toString();
            }
            
            // Set the filter events or remove applied filters if the update removed columns
            this.basicFilters = this.utility.getFilters(options, this.visualSettings);

            if (this.basicFilters.length > 0) {
                this.setFilterEvent();
            } else if (this.clicked) {
                this.visualHost.applyJsonFilter(null, "general", "filter", FilterAction.merge);
                this.clicked = false;
                this.target.style.backgroundColor = "#FFFFFF";
                this.target.style.opacity = "0";
            }
        }

        this.handleLandingPage(options);
    }

    public destroy() {
        this.visualHost.applyJsonFilter(null, "general", "filter", FilterAction.merge);
    }

    private handleLandingPage(options: VisualUpdateOptions) {
        if(!options.dataViews || !options.dataViews[0].metadata.columns.length) {
            if(!this.isLandingPageOn) {
                this.isLandingPageOn = true;
                const SampleLandingPage: Element = this.utility.createSampleLandingPage();
                this.target.appendChild(SampleLandingPage);
                this.LandingPage = d3.select(SampleLandingPage);
            } else if (this.isLandingPageOn && this.LandingPageRemoved) {
                this.LandingPageRemoved = false;
                this.target.appendChild(this.LandingPage.node());
            }
        } else if(this.isLandingPageOn && !this.LandingPageRemoved) {
            this.LandingPageRemoved = true;
            this.LandingPage.remove();
        }
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