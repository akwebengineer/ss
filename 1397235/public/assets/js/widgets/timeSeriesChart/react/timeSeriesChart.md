# TimeSeriesChart React Component

## Introduction
The time-series chart is a graph with multiple time lines shown in the main chart area and a focus area below to allow selection of time range for viewing a certain subset of the available data.

A time-series chart can be added to a container programmatically or as a component. The current document describes how to add a time-series chart as a React component. To add a time-series chart programmatically, refer to [TimeSeriesChart Widget](public/assets/js/widgets/timeSeriesChart/timeSeriesChartWidget.md)

## API
The TimeSeriesChart React component gets its configuration from properties. Once the component is rendered, it could be modified by updates on its state and properties.

## Properties
The TimeSeriesChart React component has the following properties:

```javascript
 <TimeSeriesChart
    options= < (required) JSON object >
/>
```

For example, an area-spline timeSeriesChart component with three series could be rendered with the following element:

```javascript
<TimeSeriesChart
    options = {
        type: 'areaspline',
        data: [{
            name: 'GOOG',
            color: '#fff444',
            points: [[1147651200000,0], [1147737600010,100], [1147824000020,0], [1147910400030,60], [1147996800040,100], [1148256000070, 50]]
        }, {
            name: 'MSFT',
            color: '#ffbb44',
            points: [[1147651200000,0], [1147737600012,105], [1147824000022,0], [1147910400032,62], [1147996800044,104], [1148256000075, 0]]
        }, {
            name: 'APPL',
            color: '#f33155',
            points: [[1147651200000,0], [1147737600025,65], [1147824000000,0], [1147910400060,60], [1147996800075, 25], [1148256000090,50]]
        }]
    }
/>
```

### options
Options object contains all the time-series chart options.
Options is of the format:

```javascript
{
    data: < (required) array of data points for the series>
    title: < (optional) chart title used when timeSeriesChart is specified in a standalone page rather than a dashboard dashlet>
    type: < (optional) chart type string; if not specified, area type is assumed>
    yAxisTitle: < (optional) yAxis title>
    yAxisThreshold: {   //optional
      value: <value for threshold>,
      color: <color to be used for threshold line>
    },
    timeRangeSelectorEnabled: < (optional) true/false to display time range selector used to zoom in and out on parts of the data. enabled by default>
    presetTimeRangesEnabled:  < (optional) true/false to display preconfigured time ranges like year, month, week etc. disabled by default>
    maxLegendLabelSize: <number used to truncate labels with an ellipsis if maxLegendLabelSize is exceeded, default is 16>
    actionEvents: <define custom events that will be triggered when a defined action is completed>
}
```

#### actionEvents
Defines custom events that timeSeries chart widget will trigger when an action is performed. The available custom events are:

**timeSeriesClickEvent**
Triggers when user clicks on a timeSeries point.
```javascript
    timeSeriesClickEvent: {
        "handler": [function(e, data) {}]
    }

    where data is an object that contains:
    {
        "seriesName": //the name of the series that was clicked,
        "xValue": //the x value that was clicked,
        "yValue": // the y value that was clicked
    }
```


## Usage
The following example shows how the timeSeriesChart component can be used in the context of a React application:

```javascript
class TimeSeriesChartApp extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        options:{
                            title: 'Time Series Area Spline React Component',
                            yAxisTitle: 'yAxis-Title',
                            maxLegendLabelSize: 20,
                            //'line', 'area', 'areaspline' are supported
                            type: 'areaspline',
                            data: [{
                                name: 'GOOG',
                                color: '#fff444',
                                points: [[1147651200000,0], [1147737600010,100], [1147824000020,0], [1147910400030,60], [1147996800040,100], [1148256000070, 50]]
                            }, {
                                name: 'MSFT',
                                color: '#ffbb44',
                                points: [[1147651200000,0], [1147737600012,105], [1147824000022,0], [1147910400032,62], [1147996800044,104], [1148256000075, 0]]
                            }, {
                                name: 'APPL',
                                color: '#f33155',
                                points: [[1147651200000,0], [1147737600025,65], [1147824000000,0], [1147910400060,60], [1147996800075, 25], [1148256000090,50]]
                            }]
                        }
                    };
                }

                render() {
                    return (
                        <TimeSeriesChart
                            options={this.state.options}
                        />
                    );
                }
            };

            //render React components
            //testContainer represents where the timeSeriesChart will be rendered
            ReactDOM.render(<TimeSeriesChartApp />, testContainer);
            return this;
```

