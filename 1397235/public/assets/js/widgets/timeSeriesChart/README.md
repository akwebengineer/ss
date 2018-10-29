# TimeSeriesChart

TImeSeriesChart is a reuasable graphical user interface that allows users to render a time series chart. A time series chart can be added to a container programmatically (widget) or as a component (React).


## Widget
The timeSeriesChart widget is added to a container by creating an *instance* of the timeSeriesChart widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the timeSeriesChart will be built. For example, to add a timeSeriesChart in the testContainer container:

```javascript
    var conf = {
        container: testContainer,
        options: options
    }

    var timeSeriesChart = new TimeSeriesChartWidget(conf);
    timeSeriesChart.build();
```

Any update required after the timeSeriesChart is built can be done using the methods exposed by the widget.

More details can be found at [TimeSeriesChart Widget](public/assets/js/widgets/timeSeriesChart/timeSeriesChartWidget.md)


## React
The timeSeriesChart can be rendered using the timeSeriesChart *component* and configured using a set of properties. For example, to include the timeSeriesChart, add the component:

```javascript
    <TimeSeriesChart
        options={this.state.options}
    />
```
and then render and update the state using standard React methods.

More details can be found at [TimeSeriesChart React Component](public/assets/js/widgets/timeSeriesChart/react/timeSeriesChart.md)