# Donut Chart Widget
## Introduction
A donut chart is a graph that displays data as percentages of the whole, with categories represented by individual slices.
It is functionally similar to a pie chart and each ring represents a data series.

A donut chart in Slipstream can be implemented using the framework's donut chart widget.
In Slipstream, only a single series is supported on a donut chart.

## API
The donut chart widget exposes 4 functions: a constructor, a build method that creates the chart, an update method that updates the chart and a destroy method that cleans up the resources set by itself.

```
function DonutChartWidget(conf) {…}
```

Used to create a new donut chart.
where conf is of the format:

```
{
    container: <reference to the DOM element where the chart needs to be rendered>,
    options: <object containing donut chart options>
}
```

options is of the format:


```
{
    donut: <donut chart object with following parameters needed to draw the donut chart>
        name: <name of the chart>
        data: <array of data points for the chart>
        showInLegend: <show or hide the legend box, true or false; if not specified, true is assumed and the legend is displayed>
    colors: <colors array, optional; the widget has a default colors array but this option can be used to override it and specify custom colors>
    maxLegendLabelSize: <number used to truncate labels with an ellipsis if maxLegendLabelSize is exceeded, default is 16>
    showPercentInLegend: <true or false; if set to true, percentage is displayed in the legend, default is false>
    actionEvents: <define custom events that will be triggered when a defined action is completed>
}
```

data should be specified in following format:

```
     An array of arrays with two values. 
     The first one is the category name and the second one is the count/value for that category.
     Eg. data:  [
                    ['Critical', 4440],
                    ['Major'   , 3000],
                    ['Minor'   , 2000],
                    ['Warning' , 1700],
                    ['Info'    , 300]
                ]

```

colors are optional and in following format:

```
     An array of colors. 
     
     colors: ['green', 'purple', 'pink', 'orange', 'yellow']
     or 
     colors: ['#ff3333', '#ff9933', '#f9d854', '#aa4ace', '#05a4ff']

```
When colors are specified, it is the responsibility of the plugin to provided the correct number of colors based on the number of categories on the chart.
If insufficient number of colors are provided in the array eg. there are 10 entries in the data array, 
but only 8 colors are specified in the colors array, the widget will repeat the array colors. 

##### actionEvents
Defines custom events that donut chart widget will trigger when an action is performed. The available custom events are:

**donutClickEvent**
Triggers when user clicks on a donut chart slice.
```
    donutClickEvent: {
        "handler": [function(e, data) {}]
    }

    where data is an object that contains:
    {
        "seriesName": //the name of the series that was clicked,
        "category": //the category that was clicked,
        "value": // the value that was clicked
    }
```

##### Text string displayed in the center of the chart
The total count of all the data values will be displayed in the center of the donut chart.


##### Legend
Hover-over individual legend items highlights the corresponding slice on the chart.
Selecting/deselecing an individual item on the legend adds/removes the corresponding slice on the chart and updates the total count displayed at the center.


##### Tooltip
A tooltip is displayed on hover-over each slice on the chart. It displayed both the count and percentage value.


##### Chart Size

```
<div id="donutchart-threat-count" style="width:350px; height:300px;"></div>
```
As shown in the example above, the chart will inherit the size (width and height) specified in the container's div.


```
function build() {…}
```

Used to render the donut chart.

```
function update(data[]) {…}
```

Used to update the donut chart with new data.

```
function destroy() {…}
```

Used to destroy the donut and clean up resources.

## Usage
Steps to add a donut chart:
1. Instantiate the donut chart widget and provide the configuration object
2. Call the build method

##### Example 1:

The following configuration object renders a donut chart with
- chart with 5 slices
- a legend
- tooltips for each slice on hover
- total count displayed at the center of the chart
- since color is not specified, default widget colors will be used

```
var conf = {
                container: donutChartElement,
                options: options
            }

var options = {
                donut: {
                    name: "Threat Count",
                    data: [
                        ['Critical', 4440],
                        ['Major', 3000],
                        ['Minor', 2000],
                        ['Warning', 1700],
                        ['Info', 300]
                    ]
                }
            };
```

##### Example 2:

The following configuration object renders a donut chart with
- chart with 5 slices
- a legend
- percentage value displayed in the legend
- tooltips for each slice on hover
- total count displayed at the center of the chart
- allows upto 20 characters in the legend label
- custom colors

```
var conf = {
                container: donutChartElement,
                options: options
            }

var options = {
                donut: {
                    name: "Threat Count",
                    data: [
                        ['Critical', 4440],
                        ['Major', 3000],
                        ['Minor', 2000],
                        ['Warning', 1700],
                        ['Info', 300]
                    ],
                    showInLegend: true
                },
                maxLegendLabelSize: 20,
                showPercentInLegend: true,
                colors: ['green', 'purple', 'pink', 'orange', 'yellow']
            };
```

##### Example 3:

The following configuration object renders a donut chart with
- chart with 5 slices
- no legend
- tooltips for each slice on hover
- total count displayed at the center of the chart
- since color is not specified, default widget colors will be used

```
var conf = {
                container: donutChartElement,
                options: options
            }

var options = {
                donut: {
                    name: "Threat Count",
                    data: [
                        ['Critical', 4440],
                        ['Major', 3000],
                        ['Minor', 2000],
                        ['Warning', 1700],
                        ['Info', 300]
                    ],
                    showInLegend: false
                }
            };
```
#### Example with actionEvents:
```
var actionEvents: {
    donutClickEvent: {
        "handler": [function(e, data) {
            // In this example, if user clicks the ‘Critical’ slice under Threat Count, then console output will be 'Series Name: Threat Count, Category: Critical, Value: 4440'
            console.log('Series Name: ' + data.seriesName + ', Category: ' + data.category + ', Value: ' + data.value);
        }]
    }
}
var options = {
                donut: {
                    name: "Threat Count",
                    data: [
                        ['Critical', 4440],
                        ['High', 3000],
                        ['Major', 2000],
                        ['Minor', 1700],
                        ['Low', 300]
                    ],
                    showInLegend: true
                },
                actionEvents: actionEvents
            };
```