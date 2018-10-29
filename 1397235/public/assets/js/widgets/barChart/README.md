# BarChart

BarChart is a reuasable graphical user interface that allows users to render a bar chart. A bar chart can be added to a container programmatically (widget) or as a component (React).


## Widget
The barChart widget is added to a container by creating an *instance* of the barChart widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the barChart will be built. For example, to add a barChart in the testContainer container:

```javascript
    var conf = {
        container: testContainer,
        options: options
    }

    var barChart = new BarChartWidget(conf);
    barChart.build();
```

Any update required after the barChart is built can be done using the methods exposed by the widget.

More details can be found at [BarChart Widget](public/assets/js/widgets/barChart/barChartWidget.md)


## React
The barChart can be rendered using the barChart *component* and configured using a set of properties. For example, to include the barChart, add the component:

```javascript
    <BarChart
        options={this.state.options}
    />
```
and then render and update the state using standard React methods.

More details can be found at [BarChart React Component](public/assets/js/widgets/barChart/react/barChart.md)