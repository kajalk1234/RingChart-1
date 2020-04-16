module powerbi.extensibility.visual {
    import ISelectionId = powerbi.visuals.ISelectionId;
    import IColorPalette = powerbi.extensibility.IColorPalette;
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;
    let legendValues: string[] = [];
    let legendValuesTorender: string[] = [];
    import ILegend = powerbi.extensibility.utils.chart.legend.ILegend;
    import LegendData = powerbi.extensibility.utils.chart.legend.LegendData;
    import createLegend = powerbi.extensibility.utils.chart.legend.createLegend;
    import position = powerbi.extensibility.utils.chart.legend.position;
    import legend = powerbi.extensibility.utils.chart.legend;
    import LegendPosition = powerbi.extensibility.utils.chart.legend.LegendPosition;
    import LegendIcon = powerbi.extensibility.utils.chart.legend.LegendIcon;
    import TextProperties = powerbi.extensibility.utils.formatting.TextProperties;
    import textMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
    import PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
    import tooltip = powerbi.extensibility.utils.tooltip;
    import ITooltipServiceWrapper = powerbi.extensibility.utils.tooltip.ITooltipServiceWrapper;
    import createTooltipServiceWrapper = powerbi.extensibility.utils.tooltip.createTooltipServiceWrapper;

    export interface TooltipEventArgs<TData> {
        data: TData;
        coordinates: number[];
        elementCoordinates: number[];
        context: HTMLElement;
        isTouchEvent: boolean;
    }

    export module DataViewObjects {
        // Gets the value of the given object/property pair.
        export function getValue<T>(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultValue?: T): T {
            if (!objects) {
                return defaultValue;
            }
            let objectOrMap: DataViewObject = objects[propertyId.objectName];
            let object: DataViewObject = <DataViewObject>objectOrMap;
            return DataViewObject.getValue(object, propertyId.propertyName, defaultValue);
        }

        // Gets an object from objects.
        export function getObject(objects: DataViewObjects, objectName: string, defaultValue?: DataViewObject): DataViewObject {
            if (objects && objects[objectName]) {
                return <DataViewObject>objects[objectName];
            } else {
                return defaultValue;
            }
        }

        // Gets a map of user-defined objects.
        export function getUserDefinedObjects(objects: DataViewObjects, objectName: string): DataViewObjectMap {
            if (objects && objects[objectName]) {
                return <DataViewObjectMap>objects[objectName];
            }
        }

        // Gets the solid color from a fill property.
        export function getFillColor(
            objects: DataViewObjects,
            propertyId: DataViewObjectPropertyIdentifier,
            defaultColor?: string): string {
            let value: Fill;
            value = getValue(objects, propertyId);
            if (!value || !value.solid) {
                return defaultColor;
            }
            return value.solid.color;
        }
    }

    export module DataViewObject {
        export function getValue<T>(object: DataViewObject, propertyName: string, defaultValue?: T): T {
            if (!object) {
                return defaultValue;
            }
            let propertyValue: T = <T>object[propertyName];
            if (propertyValue === undefined) {
                return defaultValue;
            }
            return propertyValue;
        }

        // Gets the solid color from a fill property using only a propertyName
        export function getFillColorByPropertyName(objects: DataViewObjects, propertyName: string, defaultColor?: string): string {
            let value: Fill;
            value = DataViewObject.getValue(objects, propertyName);
            if (!value || !value.solid) {
                return defaultColor;
            }
            return value.solid.color;
        }

    }

    export interface ITooltipDataPoints {
        name: string;
        value: string;
        formatter: string;
    }

    interface IRingChartViewModel {
        legendData: LegendData;
        dataPoints: IRingChartDataPoint[];
        dataPoints2: IRingChartDataPoint[];
        dataMax: number;
        settings: IRingChartSettings;
        primaryMeasureSum: number;
        primaryMeasureSum2: number;
        secondaryMeasureSum: number;
        secondaryMeasureSum2: number;
        primaryKPISum: number;
        secondaryKPISum: number;
        isLegendAvailable: boolean;
        isPrimaryMeasureAvailable: boolean;
    }

    interface IRingChartDataPoint {
        value: PrimitiveValue;
        secondaryValue: PrimitiveValue;
        primaryKPIValue: PrimitiveValue;
        secondaryKPIValue: PrimitiveValue;
        category: string;
        primaryName: string;
        secondaryName: string;
        color: string;
        selectionId: powerbi.visuals.ISelectionId;
        tooltipData: ITooltipDataPoints[];
        selected: boolean;
    }

    interface IRingChartSettings {
        generalView: {
            opacity: number;
        };
    }

    export interface ILegendConfig {
        show: boolean;
        legendName: string;
        primaryMeasure: string;
        displayUnits: number;
        decimalPlaces: number;
    }

    // Interface for Detail Labels
    export interface IDetailLables {
        show: boolean;
        fontSize: number;
        color: string;
        labelDisplayUnits: number;
        labelPrecision: number;
        labelStyle: string;
    }

    export interface ISummaryLabels {
        show: boolean;
        color: string;
        labelDisplayUnits: number;
        labelPrecision: number;
        fontSize: number;
        text: string;
    }

    export interface ISecondarySummaryLabels {
        color: string;
        labelDisplayUnits: number;
        labelPrecision: number;
        fontSize: number;
    }

    export interface IPrimaryIndicator {
        show: boolean;
        signIndicator: boolean;
        threshold: number;
        totalThreshold: number;
        upArrow: string;
        downArrow: string;
    }
    export interface ISecondaryIndicator {
        show: boolean;
        signIndicator: boolean;
        threshold: number;
        totalThreshold: number;
        upArrow: string;
        downArrow: string;
    }

    export interface IRingTitle {
        show: boolean;
        titleText: string;
        fill1: string;
        fontSize: number;
        backgroundColor: string;
        tooltipText: string;
    }

    export interface IAnimation {
        show: boolean;
    }
    export interface IArcPosition {
        position: string;
        patternFill: boolean;
    }
    export interface INodataText {
        textMessage: string;
    }

    export let chartProperties: {
        animation: {
            show: DataViewObjectPropertyIdentifier;
        };
        arcPosition: {
            position: DataViewObjectPropertyIdentifier;
            patternFill: DataViewObjectPropertyIdentifier;
        };
        ringTitle: {
            backgroundColor: DataViewObjectPropertyIdentifier;
            fill1: DataViewObjectPropertyIdentifier;
            fontSize: DataViewObjectPropertyIdentifier;
            show: DataViewObjectPropertyIdentifier;
            titleText: DataViewObjectPropertyIdentifier;
            tooltipText: DataViewObjectPropertyIdentifier;
        };
        indicators: {
            downArrow: DataViewObjectPropertyIdentifier;
            primaryMeasure: DataViewObjectPropertyIdentifier;
            show: DataViewObjectPropertyIdentifier;
            threshold: DataViewObjectPropertyIdentifier;
            totalThreshold: DataViewObjectPropertyIdentifier;
            upArrow: DataViewObjectPropertyIdentifier;
        };
        labels: {
            color: DataViewObjectPropertyIdentifier;
            fontSize: DataViewObjectPropertyIdentifier;
            labelDisplayUnits: DataViewObjectPropertyIdentifier;
            labelPrecision: DataViewObjectPropertyIdentifier;
            labelStyle: DataViewObjectPropertyIdentifier;
            show: DataViewObjectPropertyIdentifier;
        };
        legendSettings: {
            decimalPlaces: DataViewObjectPropertyIdentifier;
            displayUnits: DataViewObjectPropertyIdentifier;
            legendName: DataViewObjectPropertyIdentifier;
            primaryMeasure: DataViewObjectPropertyIdentifier;
            show: DataViewObjectPropertyIdentifier;
        };
        nodatatext: {
            textMessage: DataViewObjectPropertyIdentifier;
        };
        secondarySummaryLabels: {
            color: DataViewObjectPropertyIdentifier;
            fontSize: DataViewObjectPropertyIdentifier;
            labelDisplayUnits: DataViewObjectPropertyIdentifier;
            labelPrecision: DataViewObjectPropertyIdentifier;
        };
        smIndicator: {
            downArrow: DataViewObjectPropertyIdentifier;
            secondaryMeasure: DataViewObjectPropertyIdentifier;
            show: DataViewObjectPropertyIdentifier;
            threshold: DataViewObjectPropertyIdentifier;
            totalThreshold: DataViewObjectPropertyIdentifier;
            upArrow: DataViewObjectPropertyIdentifier;
        };
        summaryLabels: {
            color: DataViewObjectPropertyIdentifier;
            fontSize: DataViewObjectPropertyIdentifier;
            labelDisplayUnits: DataViewObjectPropertyIdentifier;
            labelPrecision: DataViewObjectPropertyIdentifier;
            show: DataViewObjectPropertyIdentifier;
            text: DataViewObjectPropertyIdentifier;
        };
    };
    chartProperties = {
        animation: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'animation', propertyName: 'show' }
        },
        arcPosition: {
            position: <DataViewObjectPropertyIdentifier>{ objectName: 'negativeArcSettings', propertyName: 'arcPosition' },
            patternFill: <DataViewObjectPropertyIdentifier>{ objectName: 'negativeArcSettings', propertyName: 'patternFill' }
        },
        ringTitle: {
            backgroundColor: <DataViewObjectPropertyIdentifier>{ objectName: 'RingTitle', propertyName: 'backgroundColor' },
            fill1: <DataViewObjectPropertyIdentifier>{ objectName: 'RingTitle', propertyName: 'fill1' },
            fontSize: <DataViewObjectPropertyIdentifier>{ objectName: 'RingTitle', propertyName: 'fontSize' },
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'RingTitle', propertyName: 'show' },
            titleText: <DataViewObjectPropertyIdentifier>{ objectName: 'RingTitle', propertyName: 'titleText' },
            tooltipText: <DataViewObjectPropertyIdentifier>{ objectName: 'RingTitle', propertyName: 'tooltipText' }
        },
        indicators: {
            downArrow: <DataViewObjectPropertyIdentifier>{ objectName: 'Indicators', propertyName: 'downArrow' },
            primaryMeasure: <DataViewObjectPropertyIdentifier>{ objectName: 'Indicators', propertyName: 'PrimaryMeasure' },
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'Indicators', propertyName: 'show' },
            threshold: <DataViewObjectPropertyIdentifier>{ objectName: 'Indicators', propertyName: 'Threshold' },
            totalThreshold: <DataViewObjectPropertyIdentifier>{ objectName: 'Indicators', propertyName: 'Total_Threshold' },
            upArrow: <DataViewObjectPropertyIdentifier>{ objectName: 'Indicators', propertyName: 'upArrow' }
        },
        labels:
        {
            color: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'color' },
            fontSize: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'fontSize' },
            labelDisplayUnits: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelDisplayUnits' },
            labelPrecision: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelPrecision' },
            labelStyle: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelStyle' },
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'show' }
        },
        legendSettings: {
            decimalPlaces: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'labelPrecision' },
            displayUnits: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'labelDisplayUnits' },
            legendName: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'titleText' },
            primaryMeasure: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'detailedLegend' },
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'show' }
        },
        nodatatext: {
            textMessage: <DataViewObjectPropertyIdentifier>{ objectName: 'nodatatext', propertyName: 'textMessage' }
        },
        secondarySummaryLabels:
        {
            color: <DataViewObjectPropertyIdentifier>{ objectName: 'secondarySummaryLabels', propertyName: 'color' },
            fontSize: <DataViewObjectPropertyIdentifier>{ objectName: 'secondarySummaryLabels', propertyName: 'fontSize' },
            labelDisplayUnits: <DataViewObjectPropertyIdentifier>{
                objectName: 'secondarySummaryLabels',
                propertyName: 'labelDisplayUnits'
            },
            labelPrecision: <DataViewObjectPropertyIdentifier>{ objectName: 'secondarySummaryLabels', propertyName: 'labelPrecision' }
        },
        smIndicator: {
            downArrow: <DataViewObjectPropertyIdentifier>{ objectName: 'SMIndicator', propertyName: 'downArrow' },
            secondaryMeasure: <DataViewObjectPropertyIdentifier>{ objectName: 'SMIndicator', propertyName: 'SecondaryMeasure' },
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'SMIndicator', propertyName: 'show' },
            threshold: <DataViewObjectPropertyIdentifier>{ objectName: 'SMIndicator', propertyName: 'SMThreshold' },
            totalThreshold: <DataViewObjectPropertyIdentifier>{ objectName: 'SMIndicator', propertyName: 'SMTotalThreshold' },
            upArrow: <DataViewObjectPropertyIdentifier>{ objectName: 'SMIndicator', propertyName: 'upArrow' }
        },
        summaryLabels:
        {
            color: <DataViewObjectPropertyIdentifier>{ objectName: 'summaryLabels', propertyName: 'color' },
            fontSize: <DataViewObjectPropertyIdentifier>{ objectName: 'summaryLabels', propertyName: 'fontSize' },
            labelDisplayUnits: <DataViewObjectPropertyIdentifier>{ objectName: 'summaryLabels', propertyName: 'labelDisplayUnits' },
            labelPrecision: <DataViewObjectPropertyIdentifier>{ objectName: 'summaryLabels', propertyName: 'labelPrecision' },
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'summaryLabels', propertyName: 'show' },
            text: <DataViewObjectPropertyIdentifier>{ objectName: 'summaryLabels', propertyName: 'primaryMeasureSummaryText' }
        }
    };

    const d3: any = (<any>window).d3;

    export class RingChart implements IVisual {
        public groupLegends: d3.Selection<SVGElement>;
        public dataView: DataView;
        private svg: d3.Selection<SVGElement>;
        private host: IVisualHost;
        private selectionManager: ISelectionManager;
        private ringChartContainer: d3.Selection<SVGElement>;
        private ringContainer: d3.Selection<SVGElement>;
        private xAxis: d3.Selection<SVGElement>;
        private ringDataPoints: IRingChartDataPoint[];
        private ringDataPoints2: IRingChartDataPoint[];
        private ringChartSettings: IRingChartSettings;
        private tooltipServiceWrapper: ITooltipServiceWrapper;
        private locale: string;
        private dataViews: DataView;
        private legend: ILegend;
        private legendObjectProperties: DataViewObject;
        private currentViewport: IViewport;
        private rootElement: any;
        private defaultFontFamily: string;
        private labelFontFamily: string;
        private primaryMeasurePercent: boolean;
        private isSMExists: boolean;
        private arcsSelection: any;
        private events: IVisualEventService;

        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.selectionManager = options.host.createSelectionManager();
            this.events = options.host.eventService;
            this.selectionManager.registerOnSelectCallback(() => {
                this.syncSelectionState(this.arcsSelection, <ISelectionId[]>this.selectionManager.getSelectionIds());
            });
            this.rootElement = d3.select(options.element);
            this.tooltipServiceWrapper = createTooltipServiceWrapper(options.host.tooltipService, options.element);
            let svg: d3.Selection<SVGElement>;
            svg = this.svg = d3.select(options.element)
                .style({
                    cursor: 'default'
                })
                .append('svg')
                .classed('ring_ringChart', true);
            this.locale = options.host.locale;
            this.rootElement.append('div')
                .classed('ring_ringTitle', true).style('top', 0);
            let oElement: any;
            oElement = $('div');
            this.legend = createLegend(oElement, false, null, true);
            this.rootElement.select('.ring_legend'); // ring_legend class is added in index.js
            d3.select(options.element)
                .append('div')
                .classed('ring_SummarizedDiv', true);
            this.defaultFontFamily = 'Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif';
            this.labelFontFamily = 'wf_standard-font, helvetica, arial, sans-serif';
            this.primaryMeasurePercent = false;
        }

        public checkIfLegendIsAvailable(dataViews, cat1, isLegendAvailable) {
            let dataView: DataView = dataViews[0];
            if (dataView.categorical.categories[cat1].source.roles.hasOwnProperty('Category')) {
                isLegendAvailable = true;
            }
            return isLegendAvailable;
        }

        public checkIfPrimaryMeasureIsAvailable(dataViews, k, isPrimaryMeasureAvailable) {
            let dataView: DataView = dataViews[0];
            if (dataView.categorical.values[k].source.roles.hasOwnProperty('Y')) {
                isPrimaryMeasureAvailable = true;
            }
            return isPrimaryMeasureAvailable;
        }

        public updateArrayIfPropertyYIsPresent(colName, dataVal, dataPointArray) {
            dataPointArray[0].primaryName = colName;
            dataPointArray[0].value = dataVal;
            dataPointArray[1].primaryName = colName;
            dataPointArray[3] += parseFloat(dataPointArray[2] ? dataPointArray[2].toString() : '0');
            dataPointArray[1].value = dataPointArray[2];
            dataPointArray[2] = dataPointArray[2] < 0 ? Math.abs(<number>dataPointArray[2]) : dataPointArray[2];
            dataPointArray[4] += parseFloat(dataPointArray[2] ? dataPointArray[2].toString() : '0');
            return dataPointArray;
        }

        public updateArrayIfSecondaryMeasureIsPresent(colName, dataVal, dataPointArray) {
            dataPointArray[0].secondaryName = colName;
            dataPointArray[0].secondaryValue = dataVal;
            dataPointArray[1].secondaryName = colName;
            dataPointArray[1].secondaryValue = dataPointArray[2];
            dataPointArray[5] += parseFloat(dataPointArray[2] ? dataPointArray[2].toString() : '0');
            dataPointArray[2] = dataPointArray[2] < 0 ? Math.abs(<number>dataPointArray[2]) : dataPointArray[2];
            dataPointArray[6] += parseFloat(dataPointArray[2] ? dataPointArray[2].toString() : '0');
            this.isSMExists = true;
            return dataPointArray;
        }

        public updateIfPrimaryKPIIsPresent(dataVal, dataPointArray) {
            dataPointArray[0].primaryKPIValue = dataVal;
            dataPointArray[1].primaryKPIValue = dataVal;
            dataPointArray[7] += parseFloat(dataVal ? dataVal.toString() : '0');
            return dataPointArray;
        }

        public updateIfSecondaryKPIIsPresent(dataVal, dataPointArray) {
            dataPointArray[0].secondaryKPIValue = dataVal;
            dataPointArray[1].secondaryKPIValue = dataVal;
            dataPointArray[8] += parseFloat(dataVal ? dataVal.toString() : '0');
            return dataPointArray;
        }

        public updateDataPointArray(dataPointArray, colName, dataVal, dataView, k) {
            if (dataView.categorical.values[k].source.roles.hasOwnProperty('Y')) {
                dataPointArray = this.updateArrayIfPropertyYIsPresent(colName, dataVal, dataPointArray);
            }
            if (dataView.categorical.values[k].source.roles.hasOwnProperty('SecondaryMeasure')) {
                dataPointArray = this.updateArrayIfSecondaryMeasureIsPresent(colName, dataVal, dataPointArray);
            }
            if (dataView.categorical.values[k].source.roles.hasOwnProperty('PrimaryKPI')) {
                dataPointArray = this.updateIfPrimaryKPIIsPresent(dataVal, dataPointArray);
            }
            if (dataView.categorical.values[k].source.roles.hasOwnProperty('SecondaryKPI')) {
                dataPointArray = this.updateIfSecondaryKPIIsPresent(dataVal, dataPointArray);
            }
            let tooltipDataPoint: ITooltipDataPoints = {
                formatter: dataView.categorical.values[k].source.format ? dataView.categorical.values[k].source.format : valueFormatter.DefaultNumericFormat,
                name: colName, value: dataVal !== null ? dataVal.toString() : ''
            };
            dataPointArray[0].tooltipData.push(tooltipDataPoint);
            dataPointArray[1].tooltipData.push(tooltipDataPoint);
            return dataPointArray;
        }

        public visualTransform(options: VisualUpdateOptions, host: IVisualHost): IRingChartViewModel {
            let dataViews: DataView[] = options.dataViews;
            let defaultSettings: IRingChartSettings = { generalView: { opacity: 100 } };
            let viewModel: IRingChartViewModel = {
                dataMax: 0, dataPoints: [], dataPoints2: [],
                isLegendAvailable: false, isPrimaryMeasureAvailable: false,
                legendData: null, primaryKPISum: null, primaryMeasureSum: null,
                primaryMeasureSum2: null, secondaryKPISum: null, secondaryMeasureSum: null,
                secondaryMeasureSum2: null, settings: <IRingChartSettings>{}
            };
            if (!dataViews || !dataViews[0] || !dataViews[0].categorical || !dataViews[0].categorical.categories
                || !dataViews[0].categorical.categories[0].source || !dataViews[0].categorical.values) {
                return viewModel;
            }
            let categorical: DataViewCategorical = dataViews[0].categorical, category: DataViewCategoryColumn = categorical.categories[0];
            let dataValue: DataViewValueColumn = categorical.values[0];
            let ringChartDataPoints: IRingChartDataPoint[] = [], ringChartDataPoints2: IRingChartDataPoint[] = [], dataMax: number;
            let primaryMeasureSum: number = 0, secondaryMeasureSum: number = 0;
            let primaryMeasureSum2: number = 0, secondaryMeasureSum2: number = 0;
            let primarykpiSum: number = 0, secondarykpiSum: number = 0;
            let colorPalette: IColorPalette = host.colorPalette, objects: DataViewObjects = dataViews[0].metadata.objects;
            let ringChartSettings: IRingChartSettings = {
                generalView: {
                    opacity: getValue<number>(objects, 'generalView', 'opacity', defaultSettings.generalView.opacity)
                }
            };
            // logic to check if category and primary measure are available
            let isLegendAvailable: boolean = false, isPrimaryMeasureAvailable: boolean = false;
            for (let cat1: number = 0; cat1 < dataViews[0].categorical.categories.length; cat1++) {
                isLegendAvailable = this.checkIfLegendIsAvailable(dataViews, cat1, isLegendAvailable);
            }
            for (let k: number = 0; k < dataViews[0].categorical.values.length; k++) {
                isPrimaryMeasureAvailable = this.checkIfPrimaryMeasureIsAvailable(dataViews, k, isPrimaryMeasureAvailable);
            }
            let len: number = Math.max(category.values.length, dataValue.values.length);
            for (let i: number = 0; i < len; i++) {
                let defaultColor: Fill = { solid: { color: colorPalette.getColor(category.values[i] === null ? 'Null' : category.values[i].toString()).value } };
                let ringDataPoint: IRingChartDataPoint = {
                    category: '', color: '',
                    primaryKPIValue: '', primaryName: '',
                    secondaryKPIValue: '', secondaryName: '',
                    secondaryValue: '', selectionId: null,
                    tooltipData: [], value: '', selected: false
                };
                let ringDataPoint2: IRingChartDataPoint = {
                    category: '', color: '',
                    primaryKPIValue: '', primaryName: '',
                    secondaryKPIValue: '', secondaryName: '',
                    secondaryValue: '', selectionId: null,
                    tooltipData: [], value: '', selected: false
                };
                let dataPointsRingChart: any = [ringChartDataPoints, ringChartDataPoints2];
                for (let cat1: number = 0; cat1 < dataViews[0].categorical.categories.length; cat1++) {
                    let dataView: DataView = dataViews[0];
                    if (dataView.categorical.categories[cat1].source.roles.hasOwnProperty('Category')) {
                        ringDataPoint.category = dataView.categorical.categories[cat1].values[i] ? (dataView.categorical.categories[cat1].values[i].toString()) : '';
                    }
                    let tooltipDataPoint: ITooltipDataPoints = {
                        formatter: '', name: dataView.categorical.categories[cat1].source.displayName,
                        value: dataView.categorical.categories[cat1].values[i] !== null ? (dataView.categorical.categories[cat1].values[i].toString()) : ''
                    };
                    ringDataPoint.tooltipData.push(tooltipDataPoint);
                    ringDataPoint2.tooltipData.push(tooltipDataPoint);
                }
                for (let k: number = 0; k < dataViews[0].categorical.values.length; k++) {
                    let dataView: DataView = dataViews[0];
                    let values = dataView.categorical.values[k];
                    let dataVal: PrimitiveValue = values.values[i];
                    let dataVal2: PrimitiveValue = values.values[i];
                    let colName: string = values.source.displayName ? values.source.displayName.toString() : '';
                    let dataPointArray: any = [ringDataPoint, ringDataPoint2, dataVal2, primaryMeasureSum, primaryMeasureSum2, secondaryMeasureSum, secondaryMeasureSum2,
                        primarykpiSum, secondarykpiSum];
                    dataPointArray = this.updateDataPointArray(dataPointArray, colName, dataVal, dataView, k);
                    ringDataPoint = dataPointArray[0], ringDataPoint2 = dataPointArray[1], dataVal2 = dataPointArray[2], primaryMeasureSum = dataPointArray[3],
                        primaryMeasureSum2 = dataPointArray[4], secondaryMeasureSum = dataPointArray[5], secondaryMeasureSum2 = dataPointArray[6],
                        primarykpiSum = dataPointArray[7], secondarykpiSum = dataPointArray[8];
                }
                ringDataPoint.color = getCategoricalObjectValue<Fill>(category, i, 'dataPoint', 'fill', defaultColor).solid.color;
                ringDataPoint.selectionId = host.createSelectionIdBuilder().withCategory(category, i).createSelectionId();
                ringDataPoint2.color = getCategoricalObjectValue<Fill>(category, i, 'dataPoint', 'fill', defaultColor).solid.color;
                ringDataPoint2.selectionId = host.createSelectionIdBuilder().withCategory(category, i).createSelectionId();
                ringDataPoint.selected = false;
                ringDataPoint2.selected = false;
                ringChartDataPoints.push(ringDataPoint);
                ringChartDataPoints2.push(ringDataPoint2);
            }
            dataMax = <number>dataValue.maxLocal;
            return {
                dataMax: dataMax, dataPoints: ringChartDataPoints, dataPoints2: ringChartDataPoints2,
                isLegendAvailable: isLegendAvailable, isPrimaryMeasureAvailable: isPrimaryMeasureAvailable,
                legendData: this.getLegendData(dataViews[0], ringChartDataPoints, host), primaryKPISum: primarykpiSum,
                primaryMeasureSum: primaryMeasureSum, primaryMeasureSum2: primaryMeasureSum2,
                secondaryKPISum: secondarykpiSum, secondaryMeasureSum: secondaryMeasureSum,
                secondaryMeasureSum2: secondaryMeasureSum2, settings: ringChartSettings
            };
        }

        public getLegendData(dataView: DataView, ringChartDataPoints: IRingChartDataPoint[], host: IVisualHost): LegendData {

            let legendSettings: ILegendConfig;
            legendSettings = this.getLegendSettings(dataView);

            let legendData: LegendData;
            legendData = {
                dataPoints: [],
                fontSize: 8,
                title: legendSettings.legendName
            };

            if (ringChartDataPoints && ringChartDataPoints[0] && ringChartDataPoints[0].primaryName) {
                legendData.primaryTitle = ringChartDataPoints[0].primaryName;
            }

            if (ringChartDataPoints && ringChartDataPoints[0] && ringChartDataPoints[0].secondaryName) {
                legendData.secondaryTitle = ringChartDataPoints[0].secondaryName;
            }

            for (let i: number = 0; i < ringChartDataPoints.length; ++i) {
                if (dataView && dataView.categorical && dataView.categorical.categories && dataView.categorical.categories[0]) {
                    if (legendData.secondaryTitle) {
                        legendData.dataPoints.push({
                            color: ringChartDataPoints[i].color,
                            icon: powerbi.extensibility.utils.chart.legend.LegendIcon.Box,
                            identity: host.createSelectionIdBuilder().withCategory(
                                (dataView.categorical.categories[0]), i).createSelectionId(),
                            label: ringChartDataPoints[i].category === '' ? '(Blank)' : ringChartDataPoints[i].category,
                            measure: ringChartDataPoints[i].value,
                            secondaryMeasure: ringChartDataPoints[i].secondaryValue,
                            selected: false

                        });
                    } else {
                        legendData.dataPoints.push({
                            color: ringChartDataPoints[i].color,
                            icon: powerbi.extensibility.utils.chart.legend.LegendIcon.Box,
                            identity: host.createSelectionIdBuilder().withCategory(
                                dataView.categorical.categories[0], i).createSelectionId(),
                            label: ringChartDataPoints[i].category,
                            measure: ringChartDataPoints[i].value,
                            selected: false

                        });
                    }
                }
                legendValues[i] = ringChartDataPoints[i].category;
            }

            return legendData;
        }

        public addSelectionAndTootlipOnArcs(radius, options, viewModel, legendHeight, legendWidth, summaryLabelSettings, 
            THIS, innerMultiplier, arcPosition, outerMultiplier) {
            this.drawSummaryDiv(radius, options, viewModel, legendHeight, legendWidth, summaryLabelSettings, this.dataViews);
            let arcs: any = this.svg.selectAll('.ring_arc').data(viewModel.dataPoints);
            this.arcsSelection = this.svg.selectAll('.ring_arc').data(viewModel.dataPoints);
            this.tooltipServiceWrapper.addTooltip(
                d3.selectAll('.ring_arc'),
                (tooltipEvent: TooltipEventArgs<IRingChartDataPoint>) => this.getTooltipData(tooltipEvent.data),
                (tooltipEvent: TooltipEventArgs<IRingChartDataPoint>) => tooltipEvent.data[`data`].selectionId);
            let selectionManager: ISelectionManager = this.selectionManager;
            // This must be an anonymous function instead of a lambda because
            // d3 uses 'this' as the reference to the element that was clicked.
            arcs.on('click', (d: IRingChartDataPoint): void => {
                selectionManager.select(d.selectionId).then((ids: any[]) => {
                    function compareIds(legendData: any): number {
                        if (ids.length) {
                            if (legendData.identity.key === ids[0].key) {
                                return 1;
                            } else {
                                return 0.5;
                            }
                        } else {
                            return 1;
                        }
                    }
                    let legendSelection: any = THIS.rootElement.selectAll('.ring_legend .legendItem');
                    legendSelection.attr('fill-opacity', (d1: any) => {
                        return compareIds(d1);
                    });
                    arcs.attr({
                        'fill-opacity': ids.length > 0 ? 0.5 : 1
                    });
                    d3.select(event.currentTarget).attr({
                        'fill-opacity': 1
                    });
                });
                (<Event>d3.event).stopPropagation();
            });
            this.addLegendSelection();
            $('.ring_legend #legendGroup').on('click.load', '.navArrow', (): any => {
                THIS.addLegendSelection();
            });
            this.rootElement.on('click', () => this.selectionManager.clear().then(
                () => this.rootElement.selectAll('.ring_legend .legendItem').attr('fill-opacity', 1),
                this.rootElement.selectAll('.ring_arc').attr('fill-opacity', 1)
            ));
            // Animation of ring chart arcs
            let animationSettings: IAnimation = this.getAnimation(this.dataViews);
            if (animationSettings.show) {
                let ringArcPath: d3.Selection<SVGElement> = this.svg.selectAll('.ring_arc path');
                ringArcPath.on('mouseover', function (): void {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('d', d3.svg.arc()
                            .innerRadius(radius * innerMultiplier * 1.10)
                            .outerRadius(radius * outerMultiplier * 1.10));
                });
                ringArcPath.on('mouseout', function (d: SVGElement, iterator: number): void {
                    if (viewModel.dataPoints[iterator].value < 0 && arcPosition.position === 'popOut') {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('d', d3.svg.arc()
                                .innerRadius(radius * innerMultiplier * 1.05)
                                .outerRadius(radius * outerMultiplier * 1.05));
                    } else if (viewModel.dataPoints[iterator].value < 0 && arcPosition.position === 'dropIn') {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('d', d3.svg.arc()
                                .innerRadius(radius * innerMultiplier * 0.93)
                                .outerRadius(radius * outerMultiplier * 0.93));
                    } else {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('d', d3.svg.arc()
                                .innerRadius(radius * innerMultiplier)
                                .outerRadius(radius * outerMultiplier));
                    }
                });
            }
            this.syncSelectionState(this.arcsSelection, <ISelectionId[]>this.selectionManager.getSelectionIds());
        }

        public labelSettingsUpdateAndStyle(viewModel, detaillabelprop, ringHeight) {
            let labelsLength: number = viewModel.dataPoints.length;
            for (let i: number = 0; i < labelsLength; i++) {
                let obj1: ClientRect = document.getElementById(`ring_label_${i}`).getBoundingClientRect();
                for (let j: number = i + 1; j <= labelsLength - 1; j++) {
                    let obj2: ClientRect = document.getElementById(`ring_label_${j}`).getBoundingClientRect();
                    let obj3: ClientRect;
                    let condExpr: boolean = !(obj2.left > obj1.right || obj2.right < obj1.left || obj2.top > obj1.bottom || obj2.bottom < obj1.top);
                    if (detaillabelprop.labelStyle !== 'Data' && detaillabelprop.labelStyle !== 'Category' && detaillabelprop.labelStyle !== 'Percent of total') {
                        obj3 = document.getElementById(`ring_secondRowLabel_${i}`).getBoundingClientRect();
                        condExpr = !(obj2.left > obj1.right || obj2.right < obj1.left || obj2.top > obj1.bottom || obj2.bottom < obj1.top)
                            || (!(obj2.left > obj3.right || obj2.right < obj3.left || obj2.top > obj3.bottom || obj2.bottom < obj3.top)
                                && !!document.getElementById(`ring_secondRowLabel_${i}`)
                                && document.getElementById(`ring_secondRowLabel_${i}`).style.display !== 'none');
                    }
                    if (condExpr) {
                        document.getElementById(`ring_label_${j}`).style.display = 'none';
                        document.getElementById(`ring_polyline_${j}`).style.display = 'none';
                        if (document.getElementById(`ring_secondRowLabel_${j}`)) {
                            document.getElementById(`ring_secondRowLabel_${j}`).style.display = 'none';
                        }
                    }
                }
                let legendPos: string = LegendPosition[this.legend.getOrientation()].toLowerCase();
                if (d3.select(`#ring_label_${i}`)[0][0].childNodes.length <= 1) {
                    document.getElementById(`ring_label_${i}`).style.display = 'none';
                    document.getElementById(`ring_polyline_${i}`).style.display = 'none';
                    if (document.getElementById(`ring_secondRowLabel_${i}`)) {
                        document.getElementById(`ring_secondRowLabel_${i}`).style.display = 'none';
                    }
                }
                // code to handle data labels cutting issue in top and bottom positions
                let labelYPos: number = 0;
                let secondLabelYPos: number = 0;
                labelYPos = parseFloat($(`#ring_label_${i}`).attr('y'));
                if (labelYPos && labelYPos < 0) {
                    labelYPos = labelYPos * 0.9;
                    labelYPos = labelYPos - obj1.height + 3; // 0.2em is the dy value. On conversion to px it will be 3px
                    labelYPos = Math.abs(labelYPos);
                } else {
                    labelYPos = (labelYPos * 0.9) + 3; // 0.2em is the dy value. On conversion to px it will be 3px
                }
                secondLabelYPos = Math.abs(parseFloat($(`#ring_secondRowLabel_${i}`).attr('y'))) ?
                    Math.abs(parseFloat($(`#ring_secondRowLabel_${i}`).attr('y'))) + 3 : 0;
                // 0.2em is the dy value. On conversion to px it will be 3px
                let visualHeight: number = ringHeight / 2 * 0.9; // 0.9 is the random value for adjusting labels cropping issue
                if (labelYPos > parseFloat(visualHeight.toString()) || (secondLabelYPos > parseFloat(visualHeight.toString()))
                    && document.getElementById(`ring_secondRowLabel_${i}`)
                    && document.getElementById(`ring_secondRowLabel_${i}`).style.display !== 'none') {
                    document.getElementById(`ring_label_${i}`).style.display = 'none';
                    document.getElementById(`ring_polyline_${i}`).style.display = 'none';
                    if (document.getElementById(`ring_secondRowLabel_${i}`)) {
                        document.getElementById(`ring_secondRowLabel_${i}`).style.display = 'none';
                    }
                }
            }
        }

        public addDetailLabels(THIS, viewModel, detaillabelprop, d, text) {
            let formatter: IValueFormatter = valueFormatter.create({
                format: !!THIS.dataViews.categorical.values[0].source.format ?
                    THIS.dataViews.categorical.values[0].source.format : valueFormatter.DefaultNumericFormat,
                precision: 0
            });
            let summaryvalue: number = viewModel.primaryMeasureSum;
            if (detaillabelprop.labelStyle === 'Data') {
                text = formatter.format((d.data.value));
            } else if (detaillabelprop.labelStyle === 'Category') {
                text = d.data.category;
            } else if (detaillabelprop.labelStyle === 'Percent of total') {
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${percentVal}%`;
            } else if (detaillabelprop.labelStyle === 'Category, percent of total') {
                let cat: string = d.data.category;
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${cat} ${percentVal}%`;
            } else if (detaillabelprop.labelStyle === 'Data value, percent of total') {
                let val: string = formatter.format(d.data.value);
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${val} (${percentVal}%)`;
            } else if (detaillabelprop.labelStyle === 'Both') {
                let val: string = formatter.format(d.data.value);
                text = `${d.data.category} ${val}`;
            } else {
                let val: string = formatter.format(d.data.value);
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${d.data.category} ${val} (${percentVal}%)`;
            }
            return text;
        }

        public detailLabelFormatter(primaryFormatterVal, detaillabelprop, d) {
            if (detaillabelprop.labelDisplayUnits === 0) {
                let alternateFormatter: number = parseInt(d.data.value, 10).toString().length;
                if (alternateFormatter > 9) {
                    primaryFormatterVal = 1e9;
                } else if (alternateFormatter <= 9 && alternateFormatter > 6) {
                    primaryFormatterVal = 1e6;
                } else if (alternateFormatter <= 6 && alternateFormatter >= 4) {
                    primaryFormatterVal = 1e3;
                } else {
                    primaryFormatterVal = 10;
                }
            }
            return primaryFormatterVal;
        }

        public formatLabel(viewModel, detaillabelprop, text, d, formatter) {
            let summaryvalue: number = viewModel.primaryMeasureSum;
            if (detaillabelprop.labelStyle === 'Data') {
                text = formatter.format((d.data.value));
            } else if (detaillabelprop.labelStyle === 'Category') {
                text = d.data.category;
            } else if (detaillabelprop.labelStyle === 'Percent of total') {
                let val: string = (d.data.value / summaryvalue * 100).toFixed(detaillabelprop.labelPrecision).toString();
                text = `${val}%`;
            } else if (detaillabelprop.labelStyle === 'Category, percent of total') {
                let val: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${d.data.category} ${val}%`;
            } else if (detaillabelprop.labelStyle === 'Data value, percent of total') {
                let val1: string = formatter.format(d.data.value);
                let val2: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${val1} (${val2}%)`;
            } else if (detaillabelprop.labelStyle === 'Both') {
                let val: string = formatter.format(d.data.value);
                text = `${d.data.category} ${val}`;
            } else {
                let cat: string = d.data.category;
                let val: string = formatter.format(d.data.value);
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${cat} ${val} (${percentVal}%)`;
            }
            return text;
        }

        public updateFinalText(position, textEnd, pos, widthOfText, ringWidth, finalText, textProperties) {
            if (position === 1) {
                textEnd = pos[0] + widthOfText;
                if (textEnd > ringWidth / 2) {
                    finalText = textMeasurementService.getTailoredTextOrDefault(textProperties, ringWidth / 2 - pos[0]);
                    if (finalText.length < 4) {
                        return '';
                    }
                } else {
                    finalText = textMeasurementService.getTailoredTextOrDefault(textProperties, textEnd);
                }
            } else if (position === -1) {
                textEnd = pos[0] + (-1 * widthOfText);
                if (textEnd < (-1 * ringWidth / 2)) {
                    finalText = textMeasurementService.getTailoredTextOrDefault(textProperties, pos[0] + ringWidth / 2);
                    if (finalText.length < 4) {
                        return '';
                    }
                } else {
                    finalText = textMeasurementService.getTailoredTextOrDefault(textProperties, Math.abs(textEnd));
                }
            }
            return finalText;
        }

        public formatSecondaryRowLabel(viewModel, d, detaillabelprop, text, formatter) {
            let summaryvalue: number = viewModel.primaryMeasureSum;
            if (detaillabelprop.labelStyle === 'Category, percent of total') {
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${percentVal}%`;
            } else if (detaillabelprop.labelStyle === 'Data value, percent of total') {
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `(${percentVal}%)`;
            } else if (detaillabelprop.labelStyle === 'Both') {
                text = `${formatter.format(d.data.value)}`;
            } else {
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${formatter.format(d.data.value)} (${percentVal}%)`;
            }
            return text;
        }

        public specifyRegEXString(detaillabelprop, expString) {
            if (detaillabelprop.labelStyle === 'Category, percent of total' || detaillabelprop.labelStyle === 'Both') {
                expString = '(.*)\\s(.+)';
            } else if (detaillabelprop.labelStyle === 'Data value, percent of total') {
                expString = '(.*)\\s\\((.+)\\)';
            } else {
                expString = '(.*)\\s(.+)\\s\\((.+)\\)';
            }
            return expString;
        }

        public formatSummaryValue(detaillabelprop, summaryvalue, d, text, formatter) {
            if (detaillabelprop.labelStyle === 'Category, percent of total') {
                let catName: string = d.data.category;
                let val: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${catName} ${val}%`;
            } else if (detaillabelprop.labelStyle === 'Data value, percent of total') {
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${formatter.format(d.data.value)} (${percentVal}%)`;
            } else if (detaillabelprop.labelStyle === 'Both') {
                text = `${d.data.category} ${formatter.format(d.data.value)}`;
            } else {
                let percentVal: string = (d.data.value / summaryvalue * 100).toFixed(2).toString();
                text = `${d.data.category} ${formatter.format(d.data.value)} (${percentVal}%)`;
            }
            return text;
        }

        public detailLabelNotEqualsDataCategoryOrPercentOfTotal(detaillabelprop, svg, pie, viewModel, lablesettings, outerArc, THIS, midAngle, dataLabelsArr, ringWidth, i) {
            if (detaillabelprop.labelStyle !== 'Data' 
                && detaillabelprop.labelStyle !== 'Category' 
                && detaillabelprop.labelStyle !== 'Percent of total') {
                let enteringSecondRowtext: any = svg.selectAll('.ring_secondaryLabelName').data(pie(viewModel.dataPoints)).enter();
                let secondarytextGroups: any = enteringSecondRowtext.append('g').attr('class', 'ring_secondaryLabelName');
                let labelcolor2: string = lablesettings.color;
                let labeltextsize2: string = PixelConverter.fromPoint(lablesettings.fontSize);
                let secondRowLabel: any = secondarytextGroups.append('text')
                    .attr('x', (d: any): number => {
                        let pos: any = outerArc.centroid(d);
                        pos[0] = (Math.abs(outerArc.centroid(d)[0]) + 20) * (midAngle(d) < Math.PI ? 1 : -1);
                        return pos[0];
                    })
                    .attr('y', (d: any): number => {
                        let pos: any = outerArc.centroid(d);
                        let text: string = d && d.data && d.data.category ? d.data.category : 'sample';
                        let textProperties: TextProperties = {
                            fontFamily: THIS.defaultFontFamily,
                            fontSize: PixelConverter.fromPoint(detaillabelprop.fontSize),
                            text: text
                        };
                        let heightOfText: number = textMeasurementService.measureSvgTextHeight(textProperties);
                        return pos[1] + heightOfText / 2 + 5;
                    })
                    .attr('dy', '.20em')
                    .attr('id', (d: any, j: number): string => {
                        return `ring_secondRowLabel_${j}`;
                    })
                    .text((d: any): string => {
                        let primaryFormatter: string = valueFormatter.DefaultNumericFormat;
                        if (THIS.dataViews && THIS.dataViews.categorical && THIS.dataViews.categorical.values && THIS.dataViews.categorical.values[0]) {
                            primaryFormatter = THIS.dataViews.categorical.values[0].source.format ?
                                THIS.dataViews.categorical.values[0].source.format : valueFormatter.DefaultNumericFormat;
                        }
                        let primaryFormatterVal: number = 0;
                        primaryFormatterVal = this.detailLabelFormatter(primaryFormatterVal, detaillabelprop, d);
                        let formatter: IValueFormatter = valueFormatter.create({
                            format: primaryFormatter,
                            precision: detaillabelprop.labelPrecision,
                            value: detaillabelprop.labelDisplayUnits === 0 ?
                                primaryFormatterVal : detaillabelprop.labelDisplayUnits
                        });
                        let text: string = '';
                        text = this.formatSecondaryRowLabel(viewModel, d, detaillabelprop, text, formatter);
                        let textProperties: TextProperties = {
                            fontFamily: THIS.defaultFontFamily,
                            fontSize: PixelConverter.fromPoint(detaillabelprop.fontSize),
                            text: text
                        };
                        let widthOfText: number = textMeasurementService.measureSvgTextWidth(textProperties);
                        let pos: any = outerArc.centroid(d);
                        pos[0] = (Math.abs(outerArc.centroid(d)[0]) + 20) * (midAngle(d) < Math.PI ? 1 : -1);
                        // logic to show ellipsis in Data Labels if there is no enough width
                        let position: number = (midAngle(d) < Math.PI ? 1 : -1);
                        let textEnd: number;
                        let finalText: string;
                        finalText = this.updateFinalText(position, textEnd, pos, widthOfText, 
                            ringWidth, finalText, textProperties);
                        return finalText;
                    })                        
                    .style({
                        'text-anchor': (d: any): string => {
                            return (midAngle(d)) < Math.PI ? 'start' : 'end';
                        },
                        'fill': labelcolor2,
                        'font-size': labeltextsize2,
                        'font-family': this.defaultFontFamily
                    })
                    .append('title')
                    .text((d: any): string => {
                        let formatter: IValueFormatter = valueFormatter.create({
                            format: !!THIS.dataViews.categorical.values[0].source.format ?
                                THIS.dataViews.categorical.values[0].source.format : valueFormatter.DefaultNumericFormat,
                            precision: 0
                        });
                        let summaryvalue: number = viewModel.primaryMeasureSum;
                        let text: string;
                        text = this.formatSummaryValue(detaillabelprop, summaryvalue, d, text, formatter);
                        return text;
                    });
                let upperLabelText: string = dataLabelsArr[i] && dataLabelsArr[i].childNodes
                    && dataLabelsArr[i].childNodes[0] && dataLabelsArr[i].childNodes[0].textContent ?
                    dataLabelsArr[i].childNodes[0].textContent : 'no data';
                let expString: string = '';
                expString = this.specifyRegEXString(detaillabelprop, expString);
                let pattern: RegExp = new RegExp(expString, 'gi');
                // checking the pattern of the data label inorder to display or not
                if (!(upperLabelText && upperLabelText.indexOf('...') > -1) && pattern.test(upperLabelText)) {
                    document.getElementById(`ring_secondRowLabel_${i}`).style.display = 'none';
                }
            }
        }

        public updateLabels(label, textGroups, outerArc, midAngle, THIS, detaillabelprop, viewModel, ringWidth, labelcolor, labeltextsize) {
            label = textGroups.append('text')
                .attr('x', (d: any): number => {
                    let pos: any = outerArc.centroid(d);
                    pos[0] = (Math.abs(outerArc.centroid(d)[0]) + 20) * (midAngle(d) < Math.PI ? 1 : -1);
                    return pos[0];
                })
                .attr('y', (d: any): number => {
                    let pos: any = outerArc.centroid(d);
                    return pos[1];
                })
                .attr('dy', '.20em')
                .attr('id', (d: any, i: number): string => {
                    return `ring_label_${i}`;
                })
                .text((d: any): string => {
                    let primaryFormatter: string = valueFormatter.DefaultNumericFormat;
                    if (THIS.dataViews && THIS.dataViews.categorical
                        && THIS.dataViews.categorical.values && THIS.dataViews.categorical.values[0]) {
                        primaryFormatter = THIS.dataViews.categorical.values[0].source.format ?
                            THIS.dataViews.categorical.values[0].source.format : valueFormatter.DefaultNumericFormat;
                    }
                    let primaryFormatterVal: number = 0;
                    primaryFormatterVal = this.detailLabelFormatter(primaryFormatterVal, detaillabelprop, d);
                    let formatter: IValueFormatter = valueFormatter.create({
                        format: primaryFormatter,
                        precision: detaillabelprop.labelPrecision,
                        value: detaillabelprop.labelDisplayUnits === 0 ? primaryFormatterVal : detaillabelprop.labelDisplayUnits
                    });
                    let text: string = '';
                    text = this.formatLabel(viewModel, detaillabelprop, text, d, formatter);
                    let textProperties: TextProperties = {
                        fontFamily: THIS.defaultFontFamily,
                        fontSize: PixelConverter.fromPoint(detaillabelprop.fontSize), // + 'px',
                        text: text
                    };
                    let widthOfText: number = textMeasurementService.measureSvgTextWidth(textProperties);
                    let pos: any = outerArc.centroid(d);
                    pos[0] = (Math.abs(outerArc.centroid(d)[0]) + 20) * (midAngle(d) < Math.PI ? 1 : -1);
                    // logic to show ellipsis in Data Labels if there is no enough width
                    let position: number = (midAngle(d) < Math.PI ? 1 : -1);
                    let textEnd: number;
                    let finalText: string;
                    finalText = this.updateFinalText(position, textEnd, pos, widthOfText, ringWidth, finalText, textProperties);
                    if (finalText.indexOf('...') > -1 && detaillabelprop.labelStyle !== 'Data'
                        && detaillabelprop.labelStyle !== 'Category' && detaillabelprop.labelStyle !== 'Percent of total') {
                        let firstRowLabel: string;
                        if (detaillabelprop.labelStyle === 'Data value, percent of total') {
                            firstRowLabel = formatter.format(d.data.value);
                        } else {
                            firstRowLabel = d.data.category;
                        }
                        textProperties.text = firstRowLabel;
                        let widthOfText1: number = textMeasurementService.measureSvgTextWidth(textProperties);
                        let textEnd1: number = pos[0] + widthOfText1;
                        finalText = this.updateFinalText(position, textEnd1, pos, widthOfText1, ringWidth, finalText, textProperties);
                    }
                    return finalText;
                })
                .style({
                    'text-anchor': (d: any): string => {
                        return (midAngle(d)) < Math.PI ? 'start' : 'end';
                    },
                    'fill': labelcolor,
                    'font-size': labeltextsize,
                    'font-family': this.defaultFontFamily
                })
                .append('title')
                .text((d: any): string => {
                    let text: string;
                    text = THIS.addDetailLabels(THIS, viewModel, detaillabelprop, d, text);
                    return text;
                });
            return label;
        }

        public addPopOutFeature(radius, viewModel, innerMultiplier, outerMultiplier, arcPosition, lablesettings, 
            svg, pie, THIS, detaillabelprop, arc, ringWidth, options, legendWidth, legendHeight, ringHeight, summaryLabelSettings) {
            let outerArc: any = d3.svg.arc()
                .outerRadius(radius * 0.82)
                .innerRadius(radius * 0.82);
            const midAngle = (d: any): any => { return d.startAngle + ((d.endAngle - d.startAngle)) / 2; }
            // pop out feature for negative values
            let donutArc: d3.Selection<SVGElement> = this.svg.selectAll('.ring_arc path');
            donutArc.attr('id', function (d: SVGElement, iterator: number): string {
                if (viewModel.dataPoints[iterator].value < 0 && arcPosition.position === `normal`) {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('d', d3.svg.arc()
                            .innerRadius(radius * innerMultiplier)
                            .outerRadius(radius * outerMultiplier));
                    return 'negativeValue';
                } else if (viewModel.dataPoints[iterator].value < 0 && arcPosition.position === `popOut`) {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('d', d3.svg.arc()
                            .innerRadius(radius * innerMultiplier * 1.05)
                            .outerRadius(radius * outerMultiplier * 1.05));
                    return 'negativeValue';
                } else if (viewModel.dataPoints[iterator].value < 0 && arcPosition.position === `dropIn`) {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('d', d3.svg.arc()
                            .innerRadius(radius * innerMultiplier * 0.93)
                            .outerRadius(radius * outerMultiplier * 0.93));
                    return 'negativeValue';
                } else {
                    return 'positiveValue';
                }
            });
            if (lablesettings.show) {
                let enteringLabels: any = svg.selectAll('.ring_polyline').data(pie(viewModel.dataPoints)).enter();
                let labelGroups: any = enteringLabels.append('g')
                    .attr('class', 'ring_polyline')
                    .style({
                        'fill': 'none',
                        'stroke': 'grey',
                        'stroke-width': '1px',
                        'opacity': '0.4'
                    });
                let line: any = labelGroups.append('polyline')
                    .attr('points', (d: any): any => {
                        let arccentroid: any = arc.centroid(d);
                        let pos: any = outerArc.centroid(d);
                        let pos1: any = outerArc.centroid(d);
                        pos[0] = (Math.abs(outerArc.centroid(d)[0]) + 14) * (midAngle(d) < Math.PI ? 1 : -1);
                        let fpos: number[] = [(arccentroid[0] + pos1[0]) / 2, (arccentroid[1] + pos1[1]) / 2];
                        let fpos1: number[] = [(fpos[0] + outerArc.centroid(d)[0]) / 2, (fpos[1] + outerArc.centroid(d)[1]) / 2];
                        return [fpos1, outerArc.centroid(d), pos];
                    })
                    .attr('id', (d: any, i: number): string => {
                        return `ring_polyline_${i}`;
                    });
                let enteringtext: any = svg.selectAll('.ring_labelName').data(pie(viewModel.dataPoints)).enter();
                let textGroups: any = enteringtext.append('g').attr('class', 'ring_labelName');
                let labelcolor: string = lablesettings.color;
                let labeltextsize: string = PixelConverter.fromPoint(lablesettings.fontSize);
                let label: any;
                label = this.updateLabels(label, textGroups, outerArc, midAngle, THIS, detaillabelprop, viewModel, ringWidth, labelcolor, labeltextsize);
                // Logic to add second row labels
                let dataLabels: d3.Selection<SVGElement> = this.svg.selectAll('.ring_ringChart g.ring_labelName text');
                let dataLabelsArr: any = dataLabels && dataLabels[0] ? dataLabels[0] : [];
                let dataLabelArrLen: number = dataLabelsArr.length;
                for (let i: number = 0; i < dataLabelArrLen; i++) {
                    this.detailLabelNotEqualsDataCategoryOrPercentOfTotal(detaillabelprop, svg, pie, viewModel, lablesettings, outerArc, THIS, midAngle, dataLabelsArr, ringWidth, i);
                }
            }
            if (lablesettings.show) {
                this.labelSettingsUpdateAndStyle(viewModel, detaillabelprop, ringHeight);
            }
            this.addSelectionAndTootlipOnArcs(radius, options, viewModel, legendHeight, legendWidth, summaryLabelSettings, THIS, innerMultiplier,
                arcPosition, outerMultiplier);
            return options;
        }

        public createVisual(ringWidth, lablesettings, ringHeight, viewModel, options, arcPosition, legendHeight, legendWidth, THIS,
            detaillabelprop, summaryLabelSettings) {
            let radius: number = Math.min(ringWidth, ringHeight) / 2;
            let outerMultiplier: number = 0.85;
            let innerMultiplier: number = 0.55;
            if (lablesettings.show) {
                outerMultiplier = 0.75;
                innerMultiplier = 0.45;
            }
            let arc: any = d3.svg.arc()
                .outerRadius(radius * outerMultiplier)
                .innerRadius(radius * innerMultiplier);
            let pie: any = d3.layout.pie()
                .sort(null)
                .value((d: any): any => { return Math.abs(d.value); });
            let svg: d3.Selection<SVGElement> = d3.select('.ring_ringChart').append('svg')
                .attr('width', ringWidth)
                .attr('height', ringHeight)
                .append('g')
                .attr('transform', `translate(${ringWidth / 2},${ringHeight / 2})`);
            let g: any = svg.selectAll('.ring_arc')
                .data(pie(viewModel.dataPoints2))
                .enter().append('g')
                .attr('class', 'ring_arc')
                .attr('id', (d: any, iterator: number): string => {
                    return `path${iterator}`;
                });
            svg.selectAll('g').append('path')
                .attr('d', arc)
                .style('fill', (d: any, iterator: number): string => {
                    if (arcPosition.patternFill && viewModel.dataPoints[iterator].value < 0) {
                        let patternFill: any;
                        patternFill = svg.selectAll(`#path${iterator}`)
                            .append('pattern')
                            .attr('id', `circle${iterator}`)
                            .attr({
                                width: 10,
                                height: 5,
                                patternUnits: 'userSpaceOnUse'
                            })
                            .style({
                                'stroke': d.data.color,
                                'stroke-width': 5
                            });
                        patternFill.append('line').attr({
                            x1: 0,
                            y1: 0,
                            x2: 10,
                            y2: 0,
                            fill: '#FFFFFF'
                        });
                        return `url(#circle${iterator})`;
                    }
                    return d.data.color;
                });
            options = this.addPopOutFeature(radius, viewModel, innerMultiplier, outerMultiplier, arcPosition, lablesettings, svg, pie, THIS, detaillabelprop,
                arc, ringWidth, options, legendWidth, legendHeight, ringHeight, summaryLabelSettings);
            return options;
        }

        public update(options: VisualUpdateOptions): void {
            try {
                this.events.renderingStarted(options);
                this.dataViews = options.dataViews[0];
                let THIS: this = this;
                this.isSMExists = false;
                let viewModel: IRingChartViewModel = this.visualTransform(options, this.host);
                this.ringChartSettings = viewModel.settings;
                this.ringDataPoints = viewModel.dataPoints;
                this.ringDataPoints2 = viewModel.dataPoints2;
                let lablesettings: IDetailLables = this.getDetailLable(this.dataViews);
                this.svg.selectAll('*').remove();
                this.rootElement.select('.ring_ErrorMessage').remove();
                this.rootElement.select('.ring_SummarizedDivContainer').remove();
                this.rootElement.selectAll('.ring_legend #legendGroup .legendItem, .ring_legend #legendGroup .legendTitle').remove();
                this.rootElement.selectAll('.ring_legend #legendGroup .navArrow').remove();
                this.rootElement.selectAll('.ring_ringTitle .ring_ringTitleDiv').remove();
                let noDataMessage: INodataText = this.getNoDataText(this.dataViews);
                let errorMsg: string = noDataMessage.textMessage;
                let arcPosition: IArcPosition = this.getArcPosition(this.dataViews);
                if (!viewModel || !viewModel.isLegendAvailable || !viewModel.isPrimaryMeasureAvailable) {
                    const message: string = 'Please select "Primary Measure" and "Legend" values';
                    this.rootElement.append('div').classed('ring_ErrorMessage', true).text(message).attr('title', message);
                    return;
                } else if (!viewModel.legendData || !viewModel.primaryMeasureSum) {
                    this.rootElement.append('div').classed('ring_ErrorMessage', true).text(errorMsg).attr('title', errorMsg);
                    return;
                }
                this.dataView = options.dataViews[0];
                let detaillabelprop: IDetailLables = this.getDetailLable(this.dataViews);
                let legendSettings: ILegendConfig = this.getLegendSettings(this.dataViews);
                let summaryLabelSettings: ISummaryLabels = this.getSummaryLabels(this.dataViews);
                let ringTitleSettings: IRingTitle = this.getRingTitle(this.dataViews);
                let ringWidth: number = options.viewport.width;
                let ringHeight: number = options.viewport.height;
                let ringTitleHeight: number = 0;
                if (ringTitleSettings.show) {
                    this.rootElement.select('.ring_ringTitle').style({
                        display: 'block', position: 'absolute'
                    });
                    let textProperties: TextProperties = {
                        fontFamily: THIS.defaultFontFamily,
                        fontSize: PixelConverter.fromPoint(ringTitleSettings.fontSize),
                        text: ringTitleSettings.titleText
                    };
                    let finalText: string = textMeasurementService.getTailoredTextOrDefault(textProperties, ringWidth - 70);
                    let titleDiv: d3.Selection<SVGElement> = this.rootElement.select('.ring_ringTitle')
                        .append('div')
                        .classed('ring_ringTitleDiv', true)
                        .style({
                            'background-color': ringTitleSettings.backgroundColor,
                            color: ringTitleSettings.fill1,
                            'font-size': PixelConverter.fromPoint(ringTitleSettings.fontSize)
                        })
                        .text(finalText);
                    if (ringTitleSettings.tooltipText.trim() !== '') {
                        titleDiv
                            .append('span')
                            .text(' (?)')
                            .attr('title', ringTitleSettings.tooltipText);
                    }
                    ringTitleHeight = parseFloat($('.ring_ringTitle').css('height'));
                    ringHeight = ringHeight - ringTitleHeight;
                }
                this.currentViewport = { height: Math.max(0, options.viewport.height - ringTitleHeight), width: Math.max(0, options.viewport.width) };
                let legendWidth: number = 0, legendHeight: number = 0;
                if (legendSettings.show) {
                    this.rootElement.select('.ring_legend').style({ top: `${ringTitleHeight}px` });
                    this.renderLegend(viewModel, this.dataViews);
                    legendWidth = parseFloat($('.ring_legend').attr('width'));
                    legendHeight = parseFloat($('.ring_legend').attr('height'));
                    let legendPos: string = LegendPosition[this.legend.getOrientation()].toLowerCase();
                    if (legendPos === 'top' || legendPos === 'topcenter') {
                        ringHeight = ringHeight - legendHeight <= 0 ? 0 : ringHeight - legendHeight;
                        this.svg.style('margin-top', `${legendHeight + ringTitleHeight}px`);
                    } else if (legendPos === 'bottom' || legendPos === 'bottomcenter') {
                        ringHeight = ringHeight - legendHeight <= 0 ? 0 : ringHeight - legendHeight;
                        this.svg.style('margin-top', `${ringTitleHeight}px`);
                    } else if (legendPos === 'left' || legendPos === 'leftcenter' || legendPos === 'right' || legendPos === 'rightcenter') {
                        ringWidth = ringWidth - legendWidth <= 0 ? 0 : ringWidth - legendWidth;
                        this.svg.style('margin-top', `${ringTitleHeight}px`);
                    } else {
                        this.svg.style('margin-top', `${ringTitleHeight}px`);
                    }
                } else {
                    const x: string = `${ringTitleHeight}px`;
                    this.svg.style({
                        'margin-top': x,
                        'margin-left': 0,
                        'margin-right': 0
                    });
                }
                this.svg.attr({ height: ringHeight, width: ringWidth });
                options = this.createVisual(ringWidth, lablesettings, ringHeight, viewModel, options, 
                    arcPosition, legendHeight, legendWidth, THIS, detaillabelprop, summaryLabelSettings);
                this.events.renderingFinished(options);
            } catch (exception) {
                this.events.renderingFailed(options, exception);
            }
        }

        public positionSummaryDiv(halfViewPortHeight, halfViewPortWidth, innerRadius, ringTitleHeight, 
            position, legendHeight, legendWidth, returnArray) {
            if (!this.legendObjectProperties) {
                returnArray[0] = halfViewPortWidth - (innerRadius / Math.SQRT2);
                returnArray[1] = halfViewPortHeight - (innerRadius / Math.SQRT2) +
                    parseInt(legendHeight.toString(), 10) / 2 + parseInt(ringTitleHeight.toString(), 10) / 2;
            } else if (this.legendObjectProperties.hasOwnProperty('show')
                && (this.legendObjectProperties[position] === 'Top'
                    || this.legendObjectProperties[position] === 'TopCenter')) {
                returnArray[0] = halfViewPortWidth - (innerRadius / Math.SQRT2);
                returnArray[1] = halfViewPortHeight - (innerRadius / Math.SQRT2)
                    + parseInt(legendHeight.toString(), 10) / 2 + parseInt(ringTitleHeight.toString(), 10) / 2;
            } else if (this.legendObjectProperties.hasOwnProperty('show')
                && (this.legendObjectProperties[position] === 'Bottom'
                    || this.legendObjectProperties[position] === 'BottomCenter')) {
                returnArray[0] = halfViewPortWidth - (innerRadius / Math.SQRT2);
                returnArray[1] = halfViewPortHeight - (innerRadius / Math.SQRT2)
                    - parseInt(legendHeight.toString(), 10) / 2 + parseInt(ringTitleHeight.toString(), 10) / 2;
            } else if (this.legendObjectProperties.hasOwnProperty('show')
                && (this.legendObjectProperties[position] === 'Left'
                    || this.legendObjectProperties[position] === 'LeftCenter')) {
                returnArray[0] = halfViewPortWidth - (innerRadius / Math.SQRT2) + parseInt(legendWidth.toString(), 10) / 2;
                returnArray[1] = halfViewPortHeight - (innerRadius / Math.SQRT2) + parseInt(ringTitleHeight.toString(), 10) / 2;
            } else if (this.legendObjectProperties.hasOwnProperty('show')
                && (this.legendObjectProperties[position] === 'Right'
                    || this.legendObjectProperties[position] === 'RightCenter')) {
                returnArray[0] = halfViewPortWidth - (innerRadius / Math.SQRT2) - parseInt(legendWidth.toString(), 10) / 2;
                returnArray[1] = halfViewPortHeight - (innerRadius / Math.SQRT2) + parseInt(ringTitleHeight.toString(), 10) / 2;
            } else {
                returnArray[0] = halfViewPortWidth - (innerRadius / Math.SQRT2);
                returnArray[1] = halfViewPortHeight - (innerRadius / Math.SQRT2) + parseInt(ringTitleHeight.toString(), 10) / 2;
            }
            return returnArray;
        }

        public formatPrimaryVal(viewModel, primaryFormatterVal) {
            let alternateFormatter: number = parseInt(viewModel.primaryMeasureSum.toString(), 10).toString().length;
            if (alternateFormatter > 9) {
                primaryFormatterVal = 1e9;
            } else if (alternateFormatter <= 9 && alternateFormatter > 6) {
                primaryFormatterVal = 1e6;
            } else if (alternateFormatter <= 6 && alternateFormatter >= 4) {
                primaryFormatterVal = 1e3;
            } else {
                primaryFormatterVal = 10;
            }
            return primaryFormatterVal;
        }

        public summaryDivStyling(heightBox, summaryLabelSettings, x, y, widthBox, pmIndicator, viewModel,
            dataViews, primaryFormatter, primaryTooltipFormatter) {
            let boxHeight: string = `${heightBox}px`;
            this.rootElement.select('.ring_SummarizedDiv')
                .append('div').style({
                    color: summaryLabelSettings.color,
                    'font-family': this.defaultFontFamily,
                    'font-size': PixelConverter.fromPoint(summaryLabelSettings.fontSize),
                    height: `${heightBox}px`,
                    left: `${x}px`,
                    overflow: 'hidden',
                    position: 'absolute',
                    top: `${y}px`,
                    width: `${widthBox}px`
                }).classed('ring_SummarizedDivContainer', true);
            this.rootElement.select('.ring_SummarizedDivContainer')
                .append('div')
                .classed('ring_pContainer', true)
                .style({
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(0, -50%)',
                    width: '100%'
                });
            this.rootElement.select('.ring_pContainer')
                .append('p')
                .classed('ring_TotalText', true)
                .text(summaryLabelSettings.text)
                .style({
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                    'text-align': 'center',
                    'vertical-align': 'middle',
                    margin: '0', 'white-space': 'nowrap'
                })
                .attr('title', summaryLabelSettings.text);
            this.rootElement.select('.ring_pContainer')
                .append('p')
                .classed('ring_TotalValue', true)
                .style({
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                    'text-align': 'center',
                    'vertical-align': 'middle',
                    margin: '0', 'white-space': 'nowrap'
                });
            if (pmIndicator.show) {
                let thresholdValue: number = 0;
                if (viewModel.primaryKPISum) {
                    thresholdValue = viewModel.primaryKPISum;
                    if (dataViews && dataViews.categorical && dataViews.categorical.values
                        && dataViews.categorical.values[0] && dataViews.categorical.values[0].source
                        && dataViews.categorical.values[0].source.format
                        && dataViews.categorical.values[0].source.format.toString().indexOf('%') > -1) {
                        this.primaryMeasurePercent = true;
                        thresholdValue = thresholdValue / 100;
                    }
                } else {
                    if (!pmIndicator.signIndicator) {
                        thresholdValue = pmIndicator.totalThreshold;
                        if (dataViews && dataViews.categorical && dataViews.categorical.values
                            && dataViews.categorical.values[0] && dataViews.categorical.values[0].source
                            && dataViews.categorical.values[0].source.format
                            && dataViews.categorical.values[0].source.format.toString().indexOf('%') > -1) {
                            this.primaryMeasurePercent = true;
                            thresholdValue = thresholdValue / 100;
                        }
                    }
                }
                let upColor: string = pmIndicator.upArrow;
                let downColor: string = pmIndicator.downArrow;
                let indicator: string;
                let selectedColor: string;
                if (thresholdValue <= viewModel.primaryMeasureSum) {
                    indicator = '\u25B2'; // unicode for up arrow
                    selectedColor = upColor;
                } else {
                    indicator = '\u25BC'; // unicode for down arrow
                    selectedColor = downColor;
                }
                let element: any = this.rootElement.select('.ring_TotalValue');
                element.append('div')
                    .classed('ring_primaryMeasureSum', true)
                    .text(primaryFormatter.format(viewModel.primaryMeasureSum))
                    .attr('title', primaryTooltipFormatter.format(viewModel.primaryMeasureSum));
                element.append('span')
                    .classed('ring_primaryMeasureIndicator', true)
                    .text(indicator)
                    .style('color', selectedColor);
            } else {
                this.rootElement.select('.ring_TotalValue')
                    .append('div')
                    .classed('ring_primaryMeasureSum', true)
                    .text(primaryFormatter.format(viewModel.primaryMeasureSum))
                    .attr('title', primaryTooltipFormatter.format(viewModel.primaryMeasureSum));
            }
        }

        public updateSummaryDiv(ringTitleSettings, ringTitleHeight, x, y, halfViewPortHeight, halfViewPortWidth,
            innerRadius, summaryLabelSettings, pmIndicator, viewModel, dataViews, primaryFormatter, primaryTooltipFormatter, secondarySummarySettings,
            options, smIndicator, legendHeight, legendWidth) {
            if (ringTitleSettings.show) {
                ringTitleHeight = parseFloat($('.ring_ringTitle').css('height'));
            }
            let position: string = 'position';
            let returnArray: any = [x, y];
            this.positionSummaryDiv(halfViewPortHeight, halfViewPortWidth, innerRadius, ringTitleHeight, position, legendHeight, legendWidth, returnArray);
            x = returnArray[0], y = returnArray[1];
            let widthBox: number = (innerRadius * Math.SQRT2);
            let heightBox: number = (innerRadius * Math.SQRT2);
            if (this.currentViewport.width > 150 && this.currentViewport.height > 100) {
                this.summaryDivStyling(heightBox, summaryLabelSettings, x, y, widthBox, pmIndicator, viewModel,
                    dataViews, primaryFormatter, primaryTooltipFormatter);
            }
            let secondaryFormatter: IValueFormatter;
            if (viewModel && viewModel.secondaryMeasureSum) {
                options = this.secondaryValFormatter(secondarySummarySettings, viewModel, secondaryFormatter, options, dataViews, smIndicator);
            }
            let pContainerDivWidth: number = parseFloat(this.rootElement.select('.ring_pContainer').style('width'));
            let formattedPrimaryMeasureSumTextProperties: TextProperties = {
                fontFamily: 'Segoe UI',
                fontSize: PixelConverter.fromPoint(summaryLabelSettings.fontSize),
                text: primaryFormatter.format(viewModel.primaryMeasureSum)
            };
            let formattedPrimaryMeasureSumTextPropertiesWidth: number = textMeasurementService
                .measureSvgTextWidth(formattedPrimaryMeasureSumTextProperties);
            let formattedSecondaryMeasureSumTextPropertiesWidth: number;
            if (secondaryFormatter) {
                let formattedSecondaryMeasureSumTextProperties: TextProperties = {
                    fontFamily: 'Segoe UI',
                    fontSize: PixelConverter.fromPoint(secondarySummarySettings.fontSize),
                    text: secondaryFormatter.format(viewModel.secondaryMeasureSum)
                };
                formattedSecondaryMeasureSumTextPropertiesWidth = textMeasurementService
                    .measureSvgTextWidth(formattedSecondaryMeasureSumTextProperties);
            }
            let measureArrowProperties: TextProperties = {
                fontFamily: 'Segoe UI',
                fontSize: PixelConverter.fromPoint(summaryLabelSettings.fontSize),
                text: 'ABC'
            };
            let measureArrowWidth: number = textMeasurementService.measureSvgTextWidth(measureArrowProperties);
            let availableWidth: number = pContainerDivWidth - measureArrowWidth;
            if (this.rootElement.select('.ring_primaryMeasureIndicator')[0][0] !== null) {
                if (formattedPrimaryMeasureSumTextPropertiesWidth + parseFloat(this.rootElement.select('.ring_primaryMeasureIndicator').style('width')) * 2
                    > pContainerDivWidth) {
                    let display: string = 'visible';
                    if (availableWidth < 2) {
                        availableWidth = availableWidth === 0 ? 0 : availableWidth;
                        display = 'hidden';
                    }
                    $('.ring_primaryMeasureSum').css('width', `${availableWidth}px`);
                    this.rootElement.select('.ring_primaryMeasureIndicator').style('visibility', display);
                }
            }
            let sMArrowProperties: TextProperties = {
                fontFamily: 'Segoe UI',
                fontSize: PixelConverter.fromPoint(secondarySummarySettings.fontSize),
                text: 'ABC'
            };
            let measureArrowWidth2: number = textMeasurementService.measureSvgTextWidth(sMArrowProperties);
            let availableWidth2: number = pContainerDivWidth - measureArrowWidth2;
            if (this.rootElement.select('.ring_secondaryMeasureIndicator')[0][0] !== null) {
                if (formattedSecondaryMeasureSumTextPropertiesWidth + parseFloat(this.rootElement.select('.ring_secondaryMeasureIndicator').style('width')) * 2
                    > pContainerDivWidth) {
                    let display: string = 'visible';
                    if (availableWidth2 < 2) {
                        availableWidth2 = availableWidth2 === 0 ? 0 : availableWidth2;
                        display = 'hidden';
                    }
                    $('.ring_secondaryMeasureSum').css('width', `${availableWidth2}px`);
                    this.rootElement.select('.ring_secondaryMeasureIndicator').style('visibility', display);
                }
            }
            let pContainerDivHeight: number = parseFloat(this.rootElement.select('.ring_pContainer').style('height'));
            let summarizedDivHeight: number = parseFloat(this.rootElement.select('.ring_SummarizedDivContainer').style('height'));
            if (summarizedDivHeight < pContainerDivHeight) {
                this.rootElement.select('.ring_TotalText').style({ display: 'none' });
                if (summarizedDivHeight < pContainerDivHeight / 1.2) {
                    this.rootElement.select('.ring_SecondaryText').style({ display: 'none' });
                    if (summarizedDivHeight < pContainerDivHeight / 2) {
                        this.rootElement.select('.ring_SecondaryValue').style({ display: 'none' });
                    } else {
                        this.rootElement.select('.ring_SecondaryValue').style({ display: 'block' });
                    }
                } else {
                    this.rootElement.select('.ring_SecondaryText').style({ display: 'block' });
                }
            } else {
                this.rootElement.select('.ring_TotalText').style({ display: 'block' });
            }
            return options;
        }

        public secondaryValFormatter(secondarySummarySettings, viewModel, secondaryFormatter, options, dataViews, smIndicator) {
            let secondaryFormatterVal: number = 0;
            if (secondarySummarySettings.labelDisplayUnits === 0) {
                let alternateFormatter: number = parseInt(viewModel.secondaryMeasureSum.toString(), 10).toString().length;
                if (alternateFormatter > 9) {
                    secondaryFormatterVal = 1e9;
                } else if (alternateFormatter <= 9 && alternateFormatter > 6) {
                    secondaryFormatterVal = 1e6;
                } else if (alternateFormatter <= 6 && alternateFormatter >= 4) {
                    secondaryFormatterVal = 1e3;
                } else {
                    secondaryFormatterVal = 10;
                }
            }
            secondaryFormatter = valueFormatter.create({
                format: options.dataViews[0].categorical.values[1].source.format ?
                    options.dataViews[0].categorical.values[1].source.format : valueFormatter.DefaultNumericFormat,
                precision: secondarySummarySettings.labelPrecision,
                value: secondarySummarySettings.labelDisplayUnits === 0 ?
                    secondaryFormatterVal : secondarySummarySettings.labelDisplayUnits
            });
            let secondaryTooltipFormatter: IValueFormatter = valueFormatter.create({
                format: options.dataViews[0].categorical.values[1].source.format ?
                    options.dataViews[0].categorical.values[1].source.format : valueFormatter.DefaultNumericFormat
            });
            let isSecondaryPercentage: boolean = false;
            if (dataViews && dataViews.categorical && dataViews.categorical.values
                && dataViews.categorical.values[1] && dataViews.categorical.values[1].source
                && dataViews.categorical.values[1].source.format && dataViews.categorical.values[1].source.format.toString().indexOf('%') > -1) {
                isSecondaryPercentage = true;
            }
            let secondaryFontSize: number = secondarySummarySettings.fontSize;
            let secondaryColor: string = secondarySummarySettings.color;
            this.rootElement.select('.ring_pContainer').append('p').classed('ring_SecondaryText', true)
                .text(options.dataViews[0].categorical.values[1].source.displayName)
                .style({
                    color: secondaryColor,
                    'font-size': PixelConverter.fromPoint(secondaryFontSize),
                    margin: '0',
                    overflow: 'hidden',
                    'text-align': 'center',
                    'text-overflow': 'ellipsis',
                    'vertical-align': 'middle',
                    'white-space': 'nowrap'
                }).attr('title', options.dataViews[0].categorical.values[1].source.displayName);
            this.rootElement.select('.ring_pContainer').append('p').classed('ring_SecondaryValue', true)
                .style({
                    color: secondaryColor,
                    'font-size': PixelConverter.fromPoint(secondaryFontSize),
                    margin: '0',
                    overflow: 'hidden',
                    'text-align': 'center',
                    'text-overflow': 'ellipsis',
                    'vertical-align': 'middle',
                    'white-space': 'nowrap'
                });
            if (smIndicator.show) {
                let smThreshold: number = 0;
                if (viewModel.secondaryKPISum) {
                    smThreshold = viewModel.secondaryKPISum;
                } else {
                    if (!smIndicator.signIndicator) {
                        smThreshold = smIndicator.totalThreshold;
                        if (isSecondaryPercentage) {
                            smThreshold = smThreshold / 100;
                        }
                    }
                }
                let upColor: string = smIndicator.upArrow;
                let downColor: string = smIndicator.downArrow;
                let indicator: string;
                let selectedColor: string;
                if (smThreshold <= viewModel.secondaryMeasureSum) {
                    indicator = '\u25B2'; // unicode for up arrow
                    selectedColor = upColor;
                } else {
                    indicator = '\u25BC'; // unicode for down arrow
                    selectedColor = downColor;
                }
                let element: any = this.rootElement.select('.ring_SecondaryValue');
                element.append('div').classed('ring_secondaryMeasureSum', true)
                    .text(secondaryFormatter.format(viewModel.secondaryMeasureSum))
                    .attr('title', secondaryTooltipFormatter.format(viewModel.secondaryMeasureSum));
                element.append('span').classed('ring_secondaryMeasureIndicator', true)
                    .text(indicator).style('color', selectedColor);
            } else {
                this.rootElement.select('.ring_SecondaryValue').append('div')
                    .classed('ring_secondaryMeasureSum', true).text(secondaryFormatter.format(viewModel.secondaryMeasureSum))
                    .attr('title', secondaryTooltipFormatter.format(viewModel.secondaryMeasureSum));
            }
            return options;
        }

        public drawSummaryDiv(
            radius: number, options: VisualUpdateOptions,
            viewModel: IRingChartViewModel, legendHeight: number,
            legendWidth: number, summaryLabelSettings: ISummaryLabels,
            dataViews: DataView): void {
            if (summaryLabelSettings.show) {
                if (viewModel.primaryMeasureSum) {
                    let pmIndicator: IPrimaryIndicator = this.getPrimaryIndicator(dataViews);
                    let smIndicator: ISecondaryIndicator = this.getSecondaryIndicator(dataViews);
                    let ringTitleSettings: IRingTitle = this.getRingTitle(this.dataViews);
                    let secondarySummarySettings: ISecondarySummaryLabels = this.getSecondarySummaryLabels(this.dataViews);
                    this.rootElement.select('.ring_SummarizedDiv').style({ display: 'block' });
                    let sliceWidthRatio: number = 0.50;
                    let innerRadius: number = radius * sliceWidthRatio;
                    let halfViewPortWidth: number = options.viewport.width / 2;
                    let halfViewPortHeight: number = options.viewport.height / 2;
                    let x: number, y: number;
                    let primaryFormatterVal: number = 0;
                    if (summaryLabelSettings.labelDisplayUnits === 0) {
                        primaryFormatterVal = this.formatPrimaryVal(viewModel, primaryFormatterVal);
                    }
                    let primaryFormatter: IValueFormatter = valueFormatter.create({
                        format: options.dataViews[0].categorical.values[0].source.format ?
                            options.dataViews[0].categorical.values[0].source.format : valueFormatter.DefaultNumericFormat,
                        precision: summaryLabelSettings.labelPrecision,
                        value: summaryLabelSettings.labelDisplayUnits === 0 ?
                            primaryFormatterVal : summaryLabelSettings.labelDisplayUnits
                    });
                    let primaryTooltipFormatter: IValueFormatter = valueFormatter.create({
                        format: options.dataViews[0].categorical.values[0].source.format ?
                            options.dataViews[0].categorical.values[0].source.format : valueFormatter.DefaultNumericFormat
                    });
                    let ringTitleHeight: number = 0;
                    options = this.updateSummaryDiv(ringTitleSettings, ringTitleHeight, x, y, halfViewPortHeight, 
                        halfViewPortWidth, innerRadius, summaryLabelSettings, pmIndicator, viewModel, dataViews, primaryFormatter, 
                        primaryTooltipFormatter, secondarySummarySettings, options, smIndicator, legendHeight, legendWidth);
                }
            }
        }

        public syncSelectionState(
            selection: d3.Selection<IRingChartDataPoint>,
            selectionIds: ISelectionId[]
        ): void {
            if (!selection || !selectionIds) {
                return;
            }
            if (!selectionIds.length) {
                selection.attr('fill-opacity', null);
                return;
            }
            const self: this = this;
            selection.each(function (barDataPoint: IRingChartDataPoint): void {
                const isSelected: boolean = self.isSelectionIdInArray(selectionIds, barDataPoint.selectionId);
                d3.select(this).attr(
                    'fill-opacity',
                    isSelected
                        ? 1
                        : 0.5
                );
            });
        }

        public isSelectionIdInArray(selectionIds: ISelectionId[], selectionId: ISelectionId): boolean {
            if (!selectionIds || !selectionId) {
                return false;
            }
            return selectionIds.some((currentSelectionId: ISelectionId) => {
                return currentSelectionId.includes(selectionId);
            });
        }

        public caseLegend(objectEnumeration, legendConfigs) {
            objectEnumeration.push({
                objectName: 'legend',
                displayName: 'Legend',
                selector: null,
                properties: {
                    show: legendConfigs.show,
                    position: LegendPosition[this.legend.getOrientation()],
                    showTitle: powerbi.extensibility.utils.dataview.DataViewObject
                        .getValue(this.legendObjectProperties, powerbi.extensibility.utils.chart.legend.legendProps.showTitle, true),
                    titleText: legendConfigs.legendName,
                    labelColor: powerbi.extensibility.utils.dataview.DataViewObject
                        .getValue(this.legendObjectProperties, powerbi.extensibility.utils.chart.legend.legendProps.labelColor, null),
                    fontSize: powerbi.extensibility.utils.dataview.DataViewObject
                        .getValue(this.legendObjectProperties, powerbi.extensibility.utils.chart.legend.legendProps.fontSize, 8),
                    detailedLegend: legendConfigs.primaryMeasure,
                    labelDisplayUnits: legendConfigs.displayUnits,
                    labelPrecision: legendConfigs.decimalPlaces
                }
            });
            return objectEnumeration;
        }

        public caseDataPoint(objectEnumeration, objectName, ringDataPoint) {
            objectEnumeration.push({
                objectName: objectName,
                displayName: ringDataPoint.category,
                properties: {
                    fill: {
                        solid: {
                            color: ringDataPoint.color
                        }
                    }
                },
                selector: ringDataPoint.selectionId.getSelector()
            });
            return objectEnumeration;
        }

        public caseLabels(objectEnumeration, objectName, detaillabelprop) {
            objectEnumeration.push({
                objectName: objectName,
                properties: {
                    show: detaillabelprop.show,
                    color: detaillabelprop.color,
                    labelDisplayUnits: detaillabelprop.labelDisplayUnits,
                    labelPrecision: detaillabelprop.labelPrecision,
                    fontSize: detaillabelprop.fontSize,
                    labelStyle: detaillabelprop.labelStyle
                },
                selector: null
            });
            return objectEnumeration;
        }

        public caseNegativeArcSettings(objectEnumeration, objectName, arcPosition) {
            objectEnumeration.push({
                objectName: objectName,
                selector: null,
                properties: {
                    arcPosition: arcPosition.position,
                    patternFill: arcPosition.patternFill
                }
            });
            return objectEnumeration;
        }

        public caseSummaryLabels(objectEnumeration, objectName, summaryLabels) {
            objectEnumeration.push({
                objectName: objectName,
                properties: {
                    show: summaryLabels.show,
                    color: summaryLabels.color,
                    labelDisplayUnits: summaryLabels.labelDisplayUnits,
                    labelPrecision: summaryLabels.labelPrecision,
                    fontSize: summaryLabels.fontSize,
                    primaryMeasureSummaryText: summaryLabels.text
                },
                selector: null
            });
            return objectEnumeration;
        }

        public caseSecondaryLabels(objectEnumeration, objectName, secondarySummaryLabels) {
            objectEnumeration.push({
                objectName: objectName,
                properties: {
                    color: secondarySummaryLabels.color,
                    labelDisplayUnits: secondarySummaryLabels.labelDisplayUnits,
                    labelPrecision: secondarySummaryLabels.labelPrecision,
                    fontSize: secondarySummaryLabels.fontSize
                },
                selector: null
            });
            return objectEnumeration;
        }

        public caseRingTitle(objectEnumeration, objectName, ringTitle) {
            objectEnumeration.push({
                objectName: objectName,
                properties: {
                    show: ringTitle.show,
                    titleText: ringTitle.titleText,
                    fill1: ringTitle.fill1,
                    fontSize: ringTitle.fontSize,
                    backgroundColor: ringTitle.backgroundColor,
                    tooltipText: ringTitle.tooltipText
                },
                selector: null
            });
            return objectEnumeration;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName: string = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];
            let legendConfigs: ILegendConfig = this.getLegendSettings(this.dataViews);
            let detaillabelprop: IDetailLables = this.getDetailLable(this.dataViews);
            let summaryLabels: ISummaryLabels = this.getSummaryLabels(this.dataViews);
            let arcPosition: IArcPosition = this.getArcPosition(this.dataViews);
            let secondarySummaryLabels: ISecondarySummaryLabels = this.getSecondarySummaryLabels(this.dataViews);
            let pmIndicator: IPrimaryIndicator = this.getPrimaryIndicator(this.dataViews);
            let smIndicator: ISecondaryIndicator = this.getSecondaryIndicator(this.dataViews);
            let ringTitle: IRingTitle = this.getRingTitle(this.dataViews);
            let animationProps: IAnimation = this.getAnimation(this.dataViews);
            let noDataProps: INodataText = this.getNoDataText(this.dataViews);
            switch (objectName) {
                case 'legend':
                    objectEnumeration = this.caseLegend(objectEnumeration, legendConfigs);
                    break;
                case 'dataPoint':
                    for (const ringDataPoint of this.ringDataPoints) {
                        objectEnumeration = this.caseDataPoint(objectEnumeration, objectName, ringDataPoint);
                    }
                    break;
                case 'labels':
                    objectEnumeration = this.caseLabels(objectEnumeration, objectName, detaillabelprop);
                    break;
                case 'negativeArcSettings':
                    objectEnumeration = this.caseNegativeArcSettings(objectEnumeration, objectName, arcPosition);
                    break;
                case 'summaryLabels':
                    objectEnumeration = this.caseSummaryLabels(objectEnumeration, objectName, summaryLabels);
                    break;
                case 'secondarySummaryLabels':
                    if (this.isSMExists) {
                        objectEnumeration = this.caseSecondaryLabels(objectEnumeration, objectName, secondarySummaryLabels);
                    }
                    break;
                case 'RingTitle':
                    objectEnumeration = this.caseRingTitle(objectEnumeration, objectName, ringTitle);
                    break;
                case 'Indicators':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: pmIndicator.show,
                            PrimaryMeasure: pmIndicator.signIndicator,
                            Threshold: pmIndicator.threshold,
                            Total_Threshold: pmIndicator.totalThreshold,
                            upArrow: pmIndicator.upArrow,
                            downArrow: pmIndicator.downArrow
                        },
                        selector: null
                    });
                    break;
                case 'SMIndicator':
                    if (this.isSMExists) {
                        objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                show: smIndicator.show,
                                SecondaryMeasure: smIndicator.signIndicator,
                                SMThreshold: smIndicator.threshold,
                                SMTotalThreshold: smIndicator.totalThreshold,
                                upArrow: smIndicator.upArrow,
                                downArrow: smIndicator.downArrow
                            },
                            selector: null
                        });
                    }
                    break;
                case 'animation':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            show: animationProps.show
                        },
                        selector: null
                    });
                    break;
                case 'nodatatext':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            textMessage: noDataProps.textMessage
                        },
                        selector: null
                    });
                    break;
                default:
                    break;
            }
            return objectEnumeration;
        }

        private addLegendSelection(): void {
            let currentThis: this = this;
            let legends: any = this.rootElement.selectAll('.ring_legend .legendItem');
            let selectionManager: ISelectionManager = this.selectionManager;
            legends.on('click', (d: any): void => {
                selectionManager.select(d.identity).then((ids: any[]) => {
                    function compareIds(arcData: any): number {
                        if (ids.length) {
                            if (arcData.selectionId.key === ids[0].key) {
                                return 1;
                            } else {
                                return 0.5;
                            }
                        } else {
                            return 1;
                        }
                    }
                    let arcs: any = currentThis.rootElement.selectAll('.ring_arc');
                    arcs.attr('fill-opacity', (d1: any) => {
                        return compareIds(d1);
                    });
                    legends.attr({
                        'fill-opacity': ids.length > 0 ? 0.5 : 1
                    });
                    d3.select(event.currentTarget).attr({
                        'fill-opacity': 1
                    });
                });
                (<Event>d3.event).stopPropagation();
            });
        }

        public legendValueFormatter(legendData, formatterVal, j) {
            let alternateFormatter: number = parseInt(legendData.dataPoints[j].measure, 10).toString().length;
            if (alternateFormatter > 9) {
                formatterVal = 1e9;
            } else if (alternateFormatter <= 9 && alternateFormatter > 6) {
                formatterVal = 1e6;
            } else if (alternateFormatter <= 6 && alternateFormatter >= 4) {
                formatterVal = 1e3;
            } else {
                formatterVal = 10;
            }
            return formatterVal;
        }

        public updateLegend(legendData, legendSettings, primaryFormat, primaryFormatter, legendDataTorender, 
            primaryTooltipFormatter, viewModel, primaryPercentFormatter, secondaryFormat, secondaryFormatter, secondaryTooltipFormatter, dataViews) {
            for (let j: number = 0; j < legendData.dataPoints.length; j++) {
                let primaryData: string, measureTooltip: string;
                let percentData: number, secondaryMeasureData: string;
                let secondaryMeasureTooltipData: string, primaryFormatterVal: number = 0;
                if (legendSettings.displayUnits === 0) {
                    primaryFormatterVal = this.legendValueFormatter(legendData, primaryFormatterVal, j);
                }
                if (legendDataTorender.primaryType === 'Value') {
                    primaryFormatter = valueFormatter.create({
                        format: primaryFormat, precision: legendSettings.decimalPlaces,
                        value: legendSettings.displayUnits === 0 ? primaryFormatterVal : legendSettings.displayUnits
                    });
                    primaryTooltipFormatter = valueFormatter.create({ format: primaryFormat, precision: legendSettings.decimalPlaces });
                    primaryData = primaryFormatter.format(legendData.dataPoints[j].measure);
                    measureTooltip = primaryTooltipFormatter.format(legendData.dataPoints[j].measure);
                } else if (legendDataTorender.primaryType === 'Percentage') {
                    primaryPercentFormatter = valueFormatter.create({ precision: legendSettings.decimalPlaces, value: 0 });
                    percentData = legendData.dataPoints[j].measure / viewModel.primaryMeasureSum * 100;
                    primaryData = `${primaryPercentFormatter.format(percentData)}%`;
                    measureTooltip = primaryData;
                } else if (legendDataTorender.primaryType === 'Both') {
                    primaryFormatter = valueFormatter.create({
                        format: primaryFormat, precision: legendSettings.decimalPlaces,
                        value: legendSettings.displayUnits === 0 ? primaryFormatterVal : legendSettings.displayUnits
                    });
                    primaryPercentFormatter = valueFormatter.create({ precision: legendSettings.decimalPlaces, value: 0 });
                    primaryTooltipFormatter = valueFormatter.create({ format: primaryFormat, precision: legendSettings.decimalPlaces });
                    let formattedPrimaryVal: string = primaryFormatter.format(legendData.dataPoints[j].measure);
                    let formattedPrimaryPercentVal: string = primaryPercentFormatter.format((legendData.dataPoints[j].measure / viewModel.primaryMeasureSum) * 100);
                    primaryData = `${formattedPrimaryVal} ${formattedPrimaryPercentVal}%`;
                    let formattedPriTooltipVal: string = primaryTooltipFormatter.format(legendData.dataPoints[j].measure);
                    let formattedPriTooltipPercentVal: string = primaryPercentFormatter.format(legendData.dataPoints[j].measure / viewModel.primaryMeasureSum * 100);
                    measureTooltip = `${formattedPriTooltipVal} ${formattedPriTooltipPercentVal}%`;
                } else {
                    primaryFormatter = valueFormatter.create({ format: primaryFormat, precision: legendSettings.decimalPlaces });
                    primaryTooltipFormatter = valueFormatter.create({ format: primaryFormat, precision: legendSettings.decimalPlaces });
                    primaryData = primaryFormatter.format(legendData.dataPoints[j].measure);
                    measureTooltip = primaryTooltipFormatter.format(legendData.dataPoints[j].measure);
                }
                if (legendData.secondaryTitle) {
                    let secondaryFormatterVal: number = 0;
                    if (legendSettings.displayUnits === 0) {
                        secondaryFormatterVal = this.legendValueFormatter(legendData, secondaryFormatterVal, j);
                    }
                    secondaryFormatter = valueFormatter.create({
                        format: secondaryFormat, precision: legendSettings.decimalPlaces,
                        value: legendSettings.displayUnits === 0 ? secondaryFormatterVal : legendSettings.displayUnits
                    });
                    secondaryMeasureData = secondaryFormatter.format(legendData.dataPoints[j].secondaryMeasure);
                    secondaryMeasureTooltipData = secondaryTooltipFormatter.format(legendData.dataPoints[j].secondaryMeasure);
                    let primaryIndicatorVal: PrimitiveValue = this.isPrimaryIndicator(
                        legendData.dataPoints[j].measure, dataViews, viewModel.dataPoints[j].primaryKPIValue
                    );
                    primaryIndicatorVal = primaryIndicatorVal !== undefined ? primaryIndicatorVal : '';
                    let secondaryIndicatorVal: PrimitiveValue = this.isSecondaryIndicator(
                        legendData.dataPoints[j].secondaryMeasure, dataViews, viewModel.dataPoints[j].secondaryKPIValue);
                    secondaryIndicatorVal = secondaryIndicatorVal !== undefined ? secondaryIndicatorVal : '';
                    legendDataTorender.dataPoints.push({
                        color: legendData.dataPoints[j].color,
                        icon: powerbi.extensibility.utils.chart.legend.LegendIcon.Box,
                        identity: legendData.dataPoints[j].identity,
                        label: legendData.dataPoints[j].label,
                        measure: primaryData,
                        primaryIndicator: primaryIndicatorVal,
                        primaryTooltip: measureTooltip,
                        secondaryIndicator: secondaryIndicatorVal,
                        secondaryMeasure: secondaryMeasureData,
                        secondaryTooltip: secondaryMeasureTooltipData,
                        selected: false
                    });
                } else {
                    let primaryIndicatorVal: PrimitiveValue = this.isPrimaryIndicator(
                        legendData.dataPoints[j].measure, dataViews, viewModel.dataPoints[j].primaryKPIValue
                    );
                    primaryIndicatorVal = primaryIndicatorVal !== undefined ? primaryIndicatorVal : '';
                    legendDataTorender.dataPoints.push({
                        color: legendData.dataPoints[j].color,
                        icon: powerbi.extensibility.utils.chart.legend.LegendIcon.Box,
                        identity: legendData.dataPoints[j].identity,
                        label: legendData.dataPoints[j].label,
                        measure: primaryData,
                        primaryIndicator: primaryIndicatorVal,
                        primaryTooltip: measureTooltip,
                        selected: false
                    });
                    legendValuesTorender[j] = legendValues[j];
                }
                if (this.legendObjectProperties) {
                    powerbi.extensibility.utils.chart.legend.data.update(legendDataTorender, this.legendObjectProperties);
                    let legendPos: string = powerbi.extensibility.utils.chart.legend.legendProps.position;
                    let position: string = <string>this.legendObjectProperties[legendPos];
                    if (position) {
                        this.legend.changeOrientation(LegendPosition[position]);
                    }
                }
                this.legend.drawLegend(legendDataTorender, _.clone(this.currentViewport));
                powerbi.extensibility.utils.chart.legend.positionChartArea(this.svg, this.legend);
            }
        }

        private renderLegend(viewModel: IRingChartViewModel, dataViews: DataView): void {
            let legendSettings: ILegendConfig = this.getLegendSettings(dataViews);
            let pmIndicatorSettings: IPrimaryIndicator = this.getPrimaryIndicator(dataViews);
            let smIndicatorSettings: ISecondaryIndicator = this.getSecondaryIndicator(dataViews);
            let primaryFormat: string = valueFormatter.DefaultNumericFormat;
            let secondaryFormat: string = valueFormatter.DefaultNumericFormat;
            let primaryFormatter: IValueFormatter;
            let secondaryFormatter: IValueFormatter;
            let primaryTooltipFormatter: IValueFormatter;
            let primaryPercentFormatter: IValueFormatter;
            let secondaryTooltipFormatter: IValueFormatter;
            if (!viewModel || !viewModel.legendData) {
                return;
            }
            if (this.dataView && this.dataView.metadata) {
                this.legendObjectProperties = powerbi.extensibility.utils.dataview.DataViewObjects
                    .getObject(this.dataView.metadata.objects, 'legend', {});
            }
            let legendData: LegendData = viewModel.legendData;
            let legendDataTorender: LegendData = {
                dataPoints: [],
                fontSize: 8,
                title: legendData.title
            };
            legendDataTorender.primaryUpArrowColor = pmIndicatorSettings.upArrow;
            legendDataTorender.primaryDownArrowColor = pmIndicatorSettings.downArrow;
            legendDataTorender.secondaryUpArrowColor = smIndicatorSettings.upArrow;
            legendDataTorender.secondaryDownArrowColor = smIndicatorSettings.downArrow;
            if (legendData.primaryTitle) {
                legendDataTorender.primaryTitle = legendData.primaryTitle;
                primaryFormat = dataViews.categorical.values[0].source.format ?
                    dataViews.categorical.values[0].source.format : valueFormatter.DefaultNumericFormat;
                legendDataTorender.primaryType = legendSettings.primaryMeasure;
            }
            if (legendData.secondaryTitle) {
                legendDataTorender.secondaryTitle = legendData.secondaryTitle;
                secondaryFormat = dataViews.categorical.values[1].source.format ?
                    dataViews.categorical.values[1].source.format : valueFormatter.DefaultNumericFormat;
                secondaryTooltipFormatter = valueFormatter.create({
                    format: secondaryFormat,
                    precision: legendSettings.decimalPlaces
                });
            }
            this.updateLegend(legendData, legendSettings, primaryFormat, primaryFormatter, legendDataTorender, primaryTooltipFormatter,
                viewModel, primaryPercentFormatter, secondaryFormat, secondaryFormatter, secondaryTooltipFormatter, dataViews);
        }

        private isPrimaryIndicator(indicatorValue: any, dataview: DataView, primaryKPI: PrimitiveValue): boolean {
            let isPrimaryIndicator: boolean;
            let isPercentage: boolean;
            let primaryIndicator: IPrimaryIndicator = this.getPrimaryIndicator(dataview);
            for (const val of dataview.categorical.values) {
                if (val.source.roles.hasOwnProperty('Y')) {
                    if (val.source.format && val.source.format.search('%') > 0) {
                        isPercentage = true;
                    }
                    break;
                }
            }
            if (primaryIndicator.show) {
                let thresholdValue: number = 0;
                if (primaryKPI) {
                    thresholdValue = parseFloat(primaryKPI.toString());
                    if (isPercentage) {
                        thresholdValue = thresholdValue / 100;
                    }
                } else {
                    if (primaryIndicator.signIndicator) {
                        thresholdValue = 0;
                    } else {
                        thresholdValue = primaryIndicator.threshold;
                        if (isPercentage) {
                            thresholdValue = thresholdValue / 100;
                        }
                    }
                }
                if (!isPercentage) {
                    indicatorValue = parseInt(indicatorValue, 10);
                }
                if (thresholdValue <= indicatorValue) {
                    isPrimaryIndicator = true;
                } else {
                    isPrimaryIndicator = false;
                }
            }
            return isPrimaryIndicator;
        }

        private isSecondaryIndicator(secondaryIndicator: any, dataview: DataView, secondaryKPI: PrimitiveValue): boolean {
            let isSecondaryIndicator: boolean;
            let isPercentage: boolean;
            let smIndicator: ISecondaryIndicator = this.getSecondaryIndicator(dataview);
            for (const val of dataview.categorical.values) {
                if (val.source.roles.hasOwnProperty('SecondaryMeasure')) {
                    if (val.source.format && val.source.format.search('%') > 0) {
                        isPercentage = true;
                    }
                    break;
                }
            }
            if (smIndicator.show) {
                let thresholdValue: number = 0;
                if (secondaryKPI) {
                    thresholdValue = parseFloat(secondaryKPI.toString());
                    if (isPercentage) {
                        thresholdValue = thresholdValue / 100;
                    }
                } else {
                    if (smIndicator.signIndicator) {
                        thresholdValue = 0;
                    } else {
                        thresholdValue = smIndicator.threshold;
                        if (isPercentage) {
                            thresholdValue = thresholdValue / 100;
                        }
                    }
                }
                if (!isPercentage) {
                    secondaryIndicator = parseInt(secondaryIndicator, 10);
                }
                if (thresholdValue <= secondaryIndicator) {
                    isSecondaryIndicator = true;
                } else {
                    isSecondaryIndicator = false;
                }
            }
            return isSecondaryIndicator;
        }

        private getDefaultLegendSettings(dataView: DataView): ILegendConfig {
            return {
                decimalPlaces: 0,
                displayUnits: 0,
                legendName: dataView.categorical.categories[0].source.displayName,
                primaryMeasure: 'None',
                show: true
            };
        }

        private getLegendSettings(dataView: DataView): ILegendConfig {
            let objects: DataViewObjects = null;
            let legendSetting: ILegendConfig = this.getDefaultLegendSettings(dataView);
            if (!dataView.metadata || !dataView.metadata.objects) {
                return legendSetting;
            }
            objects = dataView.metadata.objects;
            legendSetting.show = DataViewObjects.getValue(objects, chartProperties.legendSettings.show, legendSetting.show);
            legendSetting.legendName = DataViewObjects.getValue(
                objects, chartProperties.legendSettings.legendName, legendSetting.legendName);
            legendSetting.primaryMeasure = DataViewObjects.getValue(
                objects, chartProperties.legendSettings.primaryMeasure, legendSetting.primaryMeasure);
            legendSetting.displayUnits = DataViewObjects.getValue(
                objects, chartProperties.legendSettings.displayUnits, legendSetting.displayUnits);
            legendSetting.decimalPlaces = DataViewObjects.getValue(
                objects, chartProperties.legendSettings.decimalPlaces, legendSetting.decimalPlaces);

            legendSetting.decimalPlaces = legendSetting.decimalPlaces < 0
                ? 0 : legendSetting.decimalPlaces > 4 ? 4 : legendSetting.decimalPlaces;
            return legendSetting;
        }

        private getDefaultDetailLable(): IDetailLables {
            return <IDetailLables>{
                color: 'grey',
                fontSize: 9,
                labelDisplayUnits: 0,
                labelPrecision: 0,
                labelStyle: 'Category',
                show: true
            };
        }

        private getDetailLable(dataView: DataView): IDetailLables {
            let objects: DataViewObjects = null;
            let labelSettings: IDetailLables = this.getDefaultDetailLable();
            if (!dataView.metadata || !dataView.metadata.objects) {
                return this.getDefaultDetailLable();
            }
            objects = dataView.metadata.objects;
            labelSettings.show = DataViewObjects.getValue(objects, chartProperties.labels.show, labelSettings.show);
            labelSettings.color = DataViewObjects.getFillColor(objects, chartProperties.labels.color, labelSettings.color);
            labelSettings.labelDisplayUnits = DataViewObjects.getValue(
                objects, chartProperties.labels.labelDisplayUnits, labelSettings.labelDisplayUnits);
            labelSettings.labelPrecision = DataViewObjects.getValue(
                objects, chartProperties.labels.labelPrecision, labelSettings.labelPrecision);
            labelSettings.labelPrecision = labelSettings.labelPrecision < 0 ?
                0 : (labelSettings.labelPrecision) > 4 ? 4 : (labelSettings.labelPrecision);
            labelSettings.fontSize = DataViewObjects.getValue(objects, chartProperties.labels.fontSize, labelSettings.fontSize);
            labelSettings.labelStyle = DataViewObjects.getValue(objects, chartProperties.labels.labelStyle, labelSettings.labelStyle);
            return labelSettings;
        }

        private getDefaultSummaryLabel(): ISummaryLabels {
            return {
                color: '#777777',
                fontSize: 12,
                labelDisplayUnits: 0,
                labelPrecision: 0,
                show: true,
                text: 'Total'
            };
        }

        private getSummaryLabels(dataView: DataView): ISummaryLabels {
            let objects: DataViewObjects = null;
            let summaryLabelSettings: ISummaryLabels = this.getDefaultSummaryLabel();
            if (!dataView.metadata || !dataView.metadata.objects) {
                return this.getDefaultSummaryLabel();
            }
            objects = dataView.metadata.objects;
            summaryLabelSettings.show = DataViewObjects.getValue(objects, chartProperties.summaryLabels.show, summaryLabelSettings.show);
            summaryLabelSettings.color = DataViewObjects.getFillColor(
                objects, chartProperties.summaryLabels.color, summaryLabelSettings.color);
            summaryLabelSettings.labelDisplayUnits = DataViewObjects.getValue(
                objects, chartProperties.summaryLabels.labelDisplayUnits, summaryLabelSettings.labelDisplayUnits);
            summaryLabelSettings.labelPrecision = DataViewObjects.getValue(
                objects, chartProperties.summaryLabels.labelPrecision, summaryLabelSettings.labelPrecision);
            summaryLabelSettings.labelPrecision = summaryLabelSettings.labelPrecision < 0 ?
                0 : (summaryLabelSettings.labelPrecision) > 4 ? 4 : (summaryLabelSettings.labelPrecision);
            summaryLabelSettings.fontSize = DataViewObjects.getValue(
                objects, chartProperties.summaryLabels.fontSize, summaryLabelSettings.fontSize);
            summaryLabelSettings.text = DataViewObjects.getValue(
                objects, chartProperties.summaryLabels.text, summaryLabelSettings.text);
            return summaryLabelSettings;
        }

        private getDefaultSecondarySummaryLabel(): ISecondarySummaryLabels {
            return {
                color: '#777777',
                fontSize: 12,
                labelDisplayUnits: 0,
                labelPrecision: 0
            };
        }

        private getSecondarySummaryLabels(dataView: DataView): ISecondarySummaryLabels {
            let objects: DataViewObjects = null;
            let secondarySummaryLabelSettings: ISecondarySummaryLabels = this.getDefaultSecondarySummaryLabel();
            if (!dataView.metadata || !dataView.metadata.objects) {
                return this.getDefaultSecondarySummaryLabel();
            }
            objects = dataView.metadata.objects;
            secondarySummaryLabelSettings.color = DataViewObjects.getFillColor(
                objects, chartProperties.secondarySummaryLabels.color, secondarySummaryLabelSettings.color);
            secondarySummaryLabelSettings.labelDisplayUnits = DataViewObjects.getValue(
                objects, chartProperties.secondarySummaryLabels.labelDisplayUnits, secondarySummaryLabelSettings.labelDisplayUnits);
            secondarySummaryLabelSettings.labelPrecision = DataViewObjects.getValue(
                objects, chartProperties.secondarySummaryLabels.labelPrecision, secondarySummaryLabelSettings.labelPrecision);
            secondarySummaryLabelSettings.labelPrecision = secondarySummaryLabelSettings.labelPrecision < 0 ?
                0 : (secondarySummaryLabelSettings.labelPrecision) > 4 ?
                    4 : (secondarySummaryLabelSettings.labelPrecision);
            secondarySummaryLabelSettings.fontSize = DataViewObjects.getValue(
                objects, chartProperties.secondarySummaryLabels.fontSize, secondarySummaryLabelSettings.fontSize);
            return secondarySummaryLabelSettings;
        }

        private getDefaultPrimaryIndicator(): IPrimaryIndicator {
            return {
                downArrow: '#FF0000',
                show: false,
                signIndicator: false,
                threshold: null,
                totalThreshold: null,
                upArrow: '#228B22'
            };
        }

        private getPrimaryIndicator(dataView: DataView): IPrimaryIndicator {
            let objects: DataViewObjects = null;
            let primaryIndicatorSettings: IPrimaryIndicator = this.getDefaultPrimaryIndicator();
            if (!dataView.metadata || !dataView.metadata.objects) {
                return primaryIndicatorSettings;
            }
            objects = dataView.metadata.objects;
            primaryIndicatorSettings.show = DataViewObjects.getValue(
                objects, chartProperties.indicators.show, primaryIndicatorSettings.show);
            primaryIndicatorSettings.signIndicator = DataViewObjects.getValue(
                objects, chartProperties.indicators.primaryMeasure, primaryIndicatorSettings.signIndicator);
            if (!primaryIndicatorSettings.signIndicator) {
                primaryIndicatorSettings.threshold = DataViewObjects.getValue(
                    objects, chartProperties.indicators.threshold, primaryIndicatorSettings.threshold);
                primaryIndicatorSettings.totalThreshold = DataViewObjects.getValue(
                    objects, chartProperties.indicators.totalThreshold, primaryIndicatorSettings.totalThreshold);
            }
            primaryIndicatorSettings.upArrow = DataViewObjects.getFillColor(
                objects, chartProperties.indicators.upArrow, primaryIndicatorSettings.upArrow);
            primaryIndicatorSettings.downArrow = DataViewObjects.getFillColor(
                objects, chartProperties.indicators.downArrow, primaryIndicatorSettings.downArrow);
            return primaryIndicatorSettings;
        }

        private getDefaultSecondaryIndicator(): ISecondaryIndicator {
            return {
                downArrow: '#FF0000',
                show: false,
                signIndicator: false,
                threshold: null,
                totalThreshold: null,
                upArrow: '#228B22'
            };
        }

        private getSecondaryIndicator(dataView: DataView): ISecondaryIndicator {
            let objects: DataViewObjects = null;
            let secIndicatorSettings: ISecondaryIndicator = this.getDefaultSecondaryIndicator();
            if (!dataView.metadata || !dataView.metadata.objects) {
                return secIndicatorSettings;
            }
            objects = dataView.metadata.objects;
            secIndicatorSettings.show = DataViewObjects
                .getValue(objects, chartProperties.smIndicator.show, secIndicatorSettings.show);
            secIndicatorSettings.signIndicator = DataViewObjects
                .getValue(objects, chartProperties.smIndicator.secondaryMeasure, secIndicatorSettings.signIndicator);
            if (!secIndicatorSettings.signIndicator) {
                secIndicatorSettings.threshold = DataViewObjects
                    .getValue(objects, chartProperties.smIndicator.threshold, secIndicatorSettings.threshold);
                secIndicatorSettings.totalThreshold = DataViewObjects
                    .getValue(objects, chartProperties.smIndicator.totalThreshold, secIndicatorSettings.totalThreshold);
            }
            secIndicatorSettings.upArrow = DataViewObjects.getFillColor(
                objects, chartProperties.smIndicator.upArrow, secIndicatorSettings.upArrow);
            secIndicatorSettings.downArrow = DataViewObjects
                .getFillColor(objects, chartProperties.smIndicator.downArrow, secIndicatorSettings.downArrow);
            return secIndicatorSettings;
        }

        private getDefaultRingTitle(dataView: DataView): IRingTitle {
            let titleText: string = '';
            if (dataView && dataView.categorical) {
                if (dataView.categorical.values && dataView.categorical.values[0] && dataView.categorical.values[0].values) {
                    titleText += dataView.categorical.values[0].source.displayName;
                }
                if (dataView.categorical.categories && dataView.categorical.categories[0] && dataView.categorical.categories[0].values) {
                    let displayName: string = dataView.categorical.categories[0].source.displayName;
                    titleText += ` by ${displayName}`;
                }
            }
            return {
                backgroundColor: '#fff',
                fill1: '#333333',
                fontSize: 12,
                show: true,
                titleText: titleText,
                tooltipText: 'Your tooltip text goes here'
            };
        }

        private getRingTitle(dataView: DataView): IRingTitle {
            let objects: DataViewObjects = null;
            let ringTitleSettings: IRingTitle = this.getDefaultRingTitle(dataView);
            if (!dataView.metadata || !dataView.metadata.objects) {
                return ringTitleSettings;
            }
            objects = dataView.metadata.objects;
            ringTitleSettings.show = DataViewObjects.getValue(objects, chartProperties.ringTitle.show, ringTitleSettings.show);
            ringTitleSettings.titleText = DataViewObjects.getValue(
                objects, chartProperties.ringTitle.titleText, ringTitleSettings.titleText);
            ringTitleSettings.fill1 = DataViewObjects.getFillColor(objects, chartProperties.ringTitle.fill1, ringTitleSettings.fill1);
            ringTitleSettings.fontSize = DataViewObjects.getValue(
                objects, chartProperties.ringTitle.fontSize, ringTitleSettings.fontSize);
            ringTitleSettings.backgroundColor = DataViewObjects.getFillColor(
                objects, chartProperties.ringTitle.backgroundColor, ringTitleSettings.backgroundColor);
            ringTitleSettings.tooltipText = DataViewObjects.getValue(
                objects, chartProperties.ringTitle.tooltipText, ringTitleSettings.tooltipText);
            return ringTitleSettings;
        }

        private getDefaultAnimation(): IAnimation {
            return { show: false };
        }

        private getDefaultArcPosition(): IArcPosition {
            return { position: 'normal', patternFill: true };
        }

        private getAnimation(dataView: DataView): IAnimation {
            let objects: DataViewObjects = null;
            let animationSettings: IAnimation = this.getDefaultAnimation();
            if (!dataView.metadata || !dataView.metadata.objects) {
                return animationSettings;
            }
            objects = dataView.metadata.objects;
            animationSettings.show = DataViewObjects.getValue(objects, chartProperties.animation.show, animationSettings.show);
            return animationSettings;
        }

        private getArcPosition(dataView: DataView): IArcPosition {
            let objects: DataViewObjects = null;
            let arcSettings: IArcPosition = this.getDefaultArcPosition();
            if (!dataView.metadata || !dataView.metadata.objects) {
                return arcSettings;
            }
            objects = dataView.metadata.objects;
            arcSettings.position = DataViewObjects.getValue(objects, chartProperties.arcPosition.position, arcSettings.position);
            arcSettings.patternFill = DataViewObjects.getValue(objects, chartProperties.arcPosition.patternFill,
                arcSettings.patternFill);
            return arcSettings;
        }

        private getDefaultNoDataText(): INodataText {
            return { textMessage: 'No data to be displayed' };
        }

        private getNoDataText(dataView: DataView): INodataText {
            let objects: DataViewObjects = null;
            let textMessage: INodataText = this.getDefaultNoDataText();
            if (!dataView.metadata || !dataView.metadata.objects) {
                return textMessage;
            }
            objects = dataView.metadata.objects;
            textMessage.textMessage = DataViewObjects.getValue(objects, chartProperties.nodatatext.textMessage, textMessage.textMessage);
            return textMessage;
        }

        private getDecimalPlacesCount(value: number): number {
            let decimalPlacesCount: number = 0;
            if (value) {
                let valArr: string[] = value.toString().split('.');
                if (valArr[1]) {
                    decimalPlacesCount = valArr[1].length > 4 ? 4 : valArr[1].length;
                }
            }
            return decimalPlacesCount;
        }

        private getTooltipData(value: any): VisualTooltipDataItem[] {
            let tooltipDataPointsFinal: VisualTooltipDataItem[] = [];
            let tooltipDataPoints: ITooltipDataPoints[] = value.data.tooltipData;
            let tooltipDataSize: number = tooltipDataPoints.length;
            for (let i: number = 0; i < tooltipDataSize; i++) {
                let tooltipData: VisualTooltipDataItem = {
                    displayName: '',
                    value: ''
                };
                tooltipData.displayName = tooltipDataPoints[i].name;
                let formattingString: string = tooltipDataPoints[i].formatter
                    ? tooltipDataPoints[i].formatter : valueFormatter.DefaultNumericFormat;
                let formatter: IValueFormatter = valueFormatter.create({
                    format: formattingString
                });                
                if (isNaN(Number(tooltipDataPoints[i].value))) {
                    tooltipData.value = (tooltipDataPoints[i].value === '' ? '(Blank)' : tooltipDataPoints[i].value);
                } else {
                    tooltipData.value = tooltipDataPoints[i].value === '' ? '(Blank)' : formatter.format(parseFloat(tooltipDataPoints[i].value));
                }
                tooltipDataPointsFinal.push(tooltipData);
            }
            return tooltipDataPointsFinal;
        }
    }
}
