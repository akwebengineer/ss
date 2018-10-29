# BarChart React Component

## Introduction
The bar chart is a graph containing rectangular bars with lengths proportional to the values that they represent. The bars are plotted horizontally or vertically to show comparisons among categories. One axis of the chart shows the specific categories being compared, and the other axis represents discrete values.

A bar chart can be added to a container programmatically or as a component. The current document describes how to add a bar chart as a React component. To add a bar chart programmatically, refer to [BarChart Widget](public/assets/js/widgets/barChart/barChartWidget.md)

## API
The BarChart React component gets its configuration from properties. Once the component is rendered, it could be modified by updates on its state and properties.

## Properties
The BarChart React component has the following properties:

```javascript
 <BarChart
    options= < (required) JSON object >
/>
```

For example, a basic barChart component with five bars could be rendered with the following element:

```javascript
<BarChart
    options = {
        type: 'bar',
        xAxisTitle: 'Source IP Addresses',
        yAxisTitle: 'Count',
        color: '#26a7b4',
        categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5'],
        data: [88000000, 81000000, 75000000, 73000000, 7200000],
    }
/>
```

### options
Options object contains all the bar chart options.
Options is of the format:

```javascript
{
    categories: < (required) array of names used for the bars>
    data: < (requires) array of data points for the series>
    type: < (optional) chart type (bar, column, stacked-bar or stacked-column), default is set to bar when type is not specified>
    width: < (optional) chart width, default is set to fit inside a 400px X 300px dashlet when width is not specified>
    height: < (optional) chart height, default is set to fit inside a 400px X 300px dashlet when height is not specified>
    title: < (optional) chart title>
    xAxisTitle: < (optional) xAxis title>
    yAxisTitle: < (optional) yAxis title>
    yAxisThreshold: < (optional) array of threshold values used to draw vertical plot lines common to all bars, not supported on type:column charts>
    yAxisLabelFormat: < (optional) string appended to the yAxis label>
    maxLabelSize: < (optional) maximum number of characters, a label exceeding this size is truncated in the center with ... and full label is displayed only on hover, maxLabelSize excludes the length of ... >
    tooltips: < (optional) tooltips displayed on hover for each bar>
    color: < (optional) used when all bars need to display the same color>
    legend: < (optional) legend box displaying name and color for items appearing on the chart>
    actionEvents: < (optional) define the custom events that will be triggered when one of the defined action is completed>
}
```

#### data
data can be specified in following ways:

```javascript
  1. An array of numerical values.
     In this case, the numerical values will be interpreted as y values,
     and x values will be automatically calculated.
     Eg. data: [0, 1, 2]

  2. An array of arrays with two values.
     In this case, the first value is the x value
     and the second is the y value.
     Eg. data: [[5, 0], [5, 1], [5, 2]]

  3. An array of objects with named values.
     Eg. data: [{ y: 10, color: '#00FF00' },
                { y: 20, color: '#FF00FF' }]

  4. An array of objects with named values, threshold values and threshold colors.
     (Not supported on type:column charts)
     Eg. data: [{ y: 50, threshold: {values: [25], colors: ['#78bb4c', '#f58b39']}},
                { y: 70, threshold: {values: [20, 45], colors: ['#78bb4c', '#f58b39', '#ec1c24']}}]

  5. An array of objects with name, color and an array of y values for stacked bar chart.
      Eg. data: [{ name: 'Major', color: '#ec1c24', y: [40, 35, 25, 20, 10] },
                 { name: 'Minor', color: '#fbae17', y: [30, 25, 20, 20, 25] }]
```

#### actionEvents
Defines custom events that bar chart widget will trigger when an action is performed. The available custom event:

**barClickEvent**
Triggers when user clicks on a bar.
```javascript
var actionEvents = {
        barClickEvent: function(data){
          //if user clicks on category-1 bar, then this will console output category-1 and 10
          console.log('category name ---> ' + data[0] + ' category value ---> ' + data[1]);
        }
    };
```

## Usage
The following example shows how the barChart component can be used in the context of a React application:

```javascript
class BarChartApp extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        options:{
                            type: 'bar',
                            title: 'Bar: Top 5 Source IP Addresses',
                            xAxisTitle: 'Source IP Addresses',
                            yAxisTitle: 'Count',
                            color: '#26a7b4',
                            categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5'],
                            tooltip: ['88,000,000', '81,000,000', '75,000,000', '73,000,000', '72,000,00'],
                            data: [88000000, 81000000, 75000000, 73000000, 7200000],
                            actionEvents: {
                                barClickEvent: function(data){
                                    console.log('category name ' + data[0] + ' category value ' + data[1]);
                                }
                            }
                        }
                    };
                }

                render() {
                    return (
                        <BarChart
                            options={this.state.options}
                        />
                    );
                }
            };

            //render React components
            //testContainer represents where the barChart will be rendered
            ReactDOM.render(<BarChartApp />, testContainer);
            return this;
```

