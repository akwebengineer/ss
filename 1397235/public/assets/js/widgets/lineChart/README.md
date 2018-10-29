# LineChart

LineChart is a reuasable graphical user interface that allows users to render a line chart. A line chart can be added to a container programmatically (widget) or as a component (React).


## Widget
The lineChart widget is added to a container by creating an *instance* of the lineChart widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the lineChart will be built. For example, to add a lineChart in the testContainer container:

```javascript
    var conf = {
        container: testContainer,
        options: options
    }

    var lineChart = new LineChartWidget(conf);
    lineChart.build();
```

Any update required after the lineChart is built can be done using the methods exposed by the widget.

More details can be found at [LineChart Widget](public/assets/js/widgets/lineChart/lineChartWidget.md)


## React
The lineChart can be rendered using the lineChart *component* and configured using a set of properties. For example, to include the lineChart, add the component:

```javascript
    <LineChart
        options={this.state.options}
    />
```
and then render and update the state using standard React methods.

More details can be found at [LineChart React Component](public/assets/js/widgets/lineChart/react/lineChart.md)