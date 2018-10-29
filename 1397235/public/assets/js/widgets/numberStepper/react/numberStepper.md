# Number Stepper React Component


## Introduction
The Number Stepper widget is a reusable graphical user interface that renders a Step up/Step down button set in number fields. It is configurable; for example, it could be rendered with default values/min/max, or it could be disabled.
The Number Stepper can be added to a container programmatically or as a component. The current document describes how to add a number stepper as a React component. To add a number stepper programmatically, refer to [NumberStepper Widget] (public/assets/js/widgets/numberStepper/numberStepperWidget.md).


## API
The Number Stepper React component gets its configuration from the NumberStepper properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The Number Stepper React component has the following properties:

```javascript
 <NumberStepper
    "id" = <(required) (string) gives id to the input field inside the container where the widget is going to render>
    "name" = <(string) gives name to the input field inside the container where the widget is going to render>
    "placeholder" = <(string) gives placeholder to the input field inside the container where the widget is going to render>
    "value" = <(String/Number) sets the default value of the input field>
    "max_value" = <Number String, This option indicates the maximum allowed value. By default its value is null which means there is no maximum enforced.>
    "min_value" = <Number String, This option indicates the minimum allowed value. By default its value is null which means there is no minimum enforced.>  
    "disabled" = <Boolean, This option will disable the number field if set to true. Enable otherwise. By default, the value if set to false.>
    "disableAutocomplete" = <(boolean) disables the auto complete of input field if set true, by default false>
/>
```

For example, a number stepper component could be rendered with the following element:

```javascript
   <NumberStepper
       id = "number-stepper"
       name = "number-stepper"
       min_value = {-10}
       max_value = {10}
       disabled = {true}
   />
```

### id
It represents the id of the input field.

### name
It represents the name of the input field.

### placeholder
It is a short hint that describes the expected value of an input field

### value
It represents the value that the field will render. It can be bind to a data model.
It should be represented as **"{{model_attribute}}"**, where propertyName is the name of the property that can be found in the conf.values object.

### min_value
This option indicates the minimum allowed value. By default there is no minimum enforced.
This value can be a float string in case of decimal number format.
Eg. if -10 , then the number field will give error if the value goes below -10.

### max_value
This option indicates the maximum allowed value. By default there is no maximum enforced.
This value can be a float string in case of decimal number format.
Eg. if 10 , then the number field will give error if the value goes above 10.

### disabled
This option will disable the number field if set to true. Enable otherwise. By default, the value if set to false.

### disableAutocomplete
This option will disable the number field auto complete if set to true. Enable otherwise. By default, the value if set to false.

## Usage
To include a number stepper component, define it with or without any properties and then render it using React. For example:

```javascript
    ReactDOM.render(
        <NumberStepper/>,
        container //where input field is rendered with NumberStepper
    );
```

The component above will handle the rendering of the number stepper. To handle updates on states or properties by the user of the component, then the NumberStepper could be added as part of another component as follows:

```javascript
    class NumberStepperApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isDisabled: false,
                value: undefined
            };
            self.numberStepperAppInstance = this;
        }

        render() {
            return (
                <NumberStepper
                    id = "number-stepper"
                    name = "number-stepper"
                    value = {this.state.value}
                    disabled={this.state.isDisabled}
                />
            );
        }
    };
    ReactDOM.render(<NumberStepperApp/>, container);
```