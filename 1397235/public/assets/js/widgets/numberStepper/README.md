# Number Stepper Widget

The Number Stepper widget is a reusable graphical user interface that renders a Step up/Step down button set in number fields. It is configurable; for example, it could be rendered with default values/min/max, or it could be disabled. The number stepper can be added to a container programmatically or as a component.


## Programmatic -new NumberStepperWidget(conf)-
The number stepper is added to a container by creating an *instance* of the number stepper widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the number stepper will be built. For example, to add the number stepper in the testContainer container:

```javascript
    new NumberStepperWidget({
      "container": testContainer,
      "name": "number-stepper",
      "id": "number-stepper",
      "min_value": -10,
      "max_value": 10,
      "disabled": true
    }).build();
```

Any update required after the number stepper is built can be done using the methods exposed by the widget.

More details can be found at [Programmatic NumberStepper](public/assets/js/widgets/numberStepper/numberStepperWidget.md)


## Component Based -React: <NumberStepper>-
The number stepper can be added to a container/page using the NumberStepper component with the configuration options as properties of the component. Currently, there is support for *React* components only; therefore, a NumberStepper component should be rendered on the container using React. For example, to include the number stepper, add the component:

```javascript
    <NumberStepper
        id = "number-stepper"
        name = "number-stepper"
        min_value = {-10}
        max_value = {10}
        disabled = {true}
    />
```

Any update needed after the number stepper is rendered can be done using the update of states and properties of a React component.

More details can be found at [NumberStepper React Component](public/assets/js/widgets/numberStepper/react/numberStepper.md)