# LineChart React Component

## Introduction
The line chart is represented by a series of datapoints connected with a straight line. Line charts are most often used to visualize data that changes over time.

A line chart can be added to a container programmatically or as a component. The current document describes how to add a line chart as a React component. To add a line chart programmatically, refer to [LineChart Widget](public/assets/js/widgets/lineChart/lineChartWidget.md)

## API
The LineChart React component gets its configuration from properties. Once the component is rendered, it could be modified by updates on its state and properties.

## Properties
The LineChart React component has the following properties:

```javascript
 <LineChart
    options= < (required) JSON object >
/>
```

For example, a basic lineChart component with three categories and two lines could be rendered with the following element:

```javascript
<LineChart
    options = {
        categories: ['Category 1', 'Category 2', 'Category 3'],
        lines: [{
                name: 'Line 1',
                data: [7.0, 6.9, 9.5]
            }, {
                name: 'Line 2',
                data: [2.0, 5.0, 5.7]
        }]
    }
/>
```

### options
Options object contains all the line chart options.
Options is of the format:

```javascript
{
    categories: < (required) array of names used for the xAxis>
    lines: < (required) array of objects for each series>
        name: < (required) name of the series>
        data: < (required) array of data points for the series>
        lineWidth: < (optional) width or thickness of the line, default is 1>
    title: < (optional) chart title>
    xAxisTitle: < (optional) xAxis title>
    yAxisTitle: < (optional) yAxis title>
    maxLabelSize: < (optional) maximum number of characters, a label exceeding this size is truncated and full label is displayed only on hover>
    colors: < (optional) array to specify custom colors and override default colors>
    legend: < (optional) legend box displaying name and color for items appearing on the chart>
        enabled: <boolean, setting to true displays legend on the chart>
        position: <string specifying the legend position 'right' or 'bottom'>
    markers: < (optional) marker symbols displayed for each data point appearing on the line>
        enabled: <boolean, setting to true displays markers on the lines>
        multiple: <boolean, setting to true displays multiple marker symbols on the lines instead of only circles>
    plotLines: < (optional) array of objects for each plot line>
    actionEvents: < (optional) define custom events that will be triggered when a defined action is completed>
}
```

#### actionEvents
Defines custom events that line chart widget will trigger when an action is performed. The available custom events are:

**lineClickEvent**
Triggers when user clicks on a line.
```javascript
    lineClickEvent: {
        "handler": [function(e, data) {}]
    }

    where data is an object that contains:
    {
        "seriesName": //the name of the series that was clicked,
        "category": //the category that was clicked,
        "value": // the value that was clicked
    }
```


## Usage
The following example shows how the lineChart component can be used in the context of a React application:

```javascript
class LineChartApp extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        options:{
                            xAxisTitle: '',
                            yAxisTitle: 'Count',
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            maxLabelSize: 10,
                            legend: {
                                enabled: true,
                                position: 'right'
                            },
                            //line chart data
                            lines: [{
                                    name: 'Device 1',
                                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                                }, {
                                    name: 'Device 2',
                                    data: [2.0, 5.0, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                                }, {
                                    name: 'Device 3',
                                    data: [5.9, 6.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 2.0]
                                }, {
                                    name: 'Device 4',
                                    data: [10, 20, 23, 12, 5, 4, 11, 16, 17, 15, 14, 5]
                                }, {
                                    name: 'Device 5',
                                    data: [7, 7, 7, 7, 17, 7, 7, 7, 14.3, 9.0, 3.9, 2.0]
                                }, {
                                    name: 'Device 6',
                                    data: [5,5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                                }, {
                                    name: 'Device 7',
                                    data: [2, 3, 3.9, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                                }, {
                                    name: 'Device 8',
                                    data: [12, 12, 14, 14, 14, 16, 16, 16, 16, 18, 18, 18]
                                }, {
                                    name: 'Device 9',
                                    data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
                                }, {
                                    name: 'Device 10',
                                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                            }],
                            // line chart events
                            actionEvents: {
                                lineClickEvent: {
                                        "handler": [function(e, data) {
                                        console.log('Series Name: ' + data.seriesName + ', Category: ' + data.category + ', Value: ' + data.value);
                                    }]
                                }
                            }
                        }
                    };
                }

                render() {
                    return (
                        <LineChart
                            options={this.state.options}
                        />
                    );
                }
            };

            //render React components
            //testContainer represents where the lineChart will be rendered
            ReactDOM.render(<LineChartApp />, testContainer);
            return this;
```

