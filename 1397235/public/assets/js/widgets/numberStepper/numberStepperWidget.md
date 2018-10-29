# Number Stepper Widget


## Introduction
The Number Stepper widget is a reusable graphical user interface that renders a Step up/Step down button set in number fields. It is configurable; for example, it could be rendered with default values/min/max, or it could be disabled.
The Number Stepper can be added to a container programmatically or as a component. The current document describes how to add a number stepper programmatically. To add a number stepper as a React component, refer to [NumberStepper React Component] (public/assets/js/widgets/numberStepper/react/numberStepper.md).

## API
The number stepper widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any configuration required by the widget is passed to its constructor.


## Configuration
The configuration object has the following properties:

```javascript
{
    container:  <(required) Object denoted by the jQuery element where the widget needs to be rendered>
    id: <(required)(string) gives id to the input field inside the container where the widget is going to render>
    name: <(string) gives name to the input field inside the container where the widget is going to render>
    placeholder: <(string) gives placeholder to the input field inside the container where the widget is going to render>
    value: <(String/Number) sets the default value of the input field>
    max_value: <Number String, This option indicates the maximum allowed value. By default its value is null which means there is no maximum enforced.>
    min_value: <Number String, This option indicates the minimum allowed value. By default its value is null which means there is no minimum enforced.>  
    disabled: <Boolean, This option will disable the number field if set to true. Enable otherwise. By default, the value if set to false.>
    disableAutocomplete: <(boolean) disables the auto complete of input field if set true, by default false>
}
```

### container
The container property represents the jquery object that will contain the number stepper widget.

### id
It represents the id of the input field.

### name
It represents the name of the input field.

### placeholder
It is a short hint that describes the expected value of an input field

### value
It represents the value that the field will render. It can be bind to a data model.
It should be represented as **"{{model_attribute}}"**, where propertyName is the name of the property that can be found in the conf.values object.

### max_value
This option indicates the maximum allowed value. By default its value is null which means there is no maximum enforced.
This value can be a float string in case of decimal number format.
Eg. if 10 , then the number field will give error if the value goes above 10.

### min_value
This option indicates the minimum allowed value. By default its value is null which means there is no minimum enforced.
This value can be a float string in case of decimal number format.
Eg. if -10 , then the number field will give error if the value goes below -10.

### disabled
This option will disable the number field if set to true. Enable otherwise. By default, the value if set to false.

### disableAutocomplete
This option will disable the number field auto complete if set to true. Enable otherwise. By default, the value if set to false.

## Methods

###build
Adds the number stepper widget with the required options in the specified container. For example:

```
    numberStepperWidget.build();
```

### destroy
Removes the number stepper widget from the container.

```
    numberStepperWidget.destroy();
```

### disable
Disables the number field.

```
    numberStepperWidget.disable();
```

### enable
Enables the number field.

```
    numberStepperWidget.enable();
```

### getValue
Returns the value of the number field.

```
    numberStepperWidget.getValue();
```

### setValue
Sets the value of the number field.

```
    numberStepperWidget.setValue();
```

## Events

###slipstreamNumberStepper:onChange
The event gets triggered when the numberStepper value gets changed. It provides an object with the updatedValue property. updatedValue represents the new value of the number stepper. For example:

```
    $numberStepperContainer.bind("slipstreamNumberStepper:onChange", function (e, val) {
        console.log(val.updatedValue));
    });
```

## Usage
To include a number stepper widget, define at least the container. For example:

```
    new NumberStepperWidget({
        "container": $container,
        "id": "number-stepper",
        "name": "number-stepper",
        "min_value": -10,
        "max_value": 10,
        "disabled": true
    }).build();
```