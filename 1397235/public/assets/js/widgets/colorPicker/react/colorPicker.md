# Color Picker React Component


## Introduction
The Color Picker Component is a reusable graphical user interface that renders a colorPicker input with a palette dialog for a color selection. It is configurable.
The Color Picker can be added to a container programmatically or as a component. The current document describes how to add a color picker as a React component. To add a color picker programmatically, refer to [ColorPicker Widget] (public/assets/js/widgets/colorPicker/colorPickerWidget.md).


## API
The Color Picker React component gets its configuration from the ColorPicker properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The Color Picker React component has the following properties:

```javascript
 <ColorPicker
     value= <(optional) string, defines the value of the colorPicker which should represent an hexadecimal value>
     onChange= <function called when the value selection of the color picker field is changed>
/>
```

For example, a color picker component could be rendered with the following element:

```
   <ColorPicker
       value = {this.state.value}
       onChange={this.handleChange}
   />
```

### value
It defines the value that will be assigned to the color picker widget.

### onChange
It defined the function that needs to be called with the event object and updated value object. Updated value object looks as follows:

```
{
    "updatedValue": updatedValue
}
```

Sample onChange handler can be written as:

```
handleChange(e, value) {
    this.setState({value: value.updatedValue});
    console.log(value);
}
```

## Usage
To include a color picker component, define it with or without any properties and then render it using React. For example:

```javascript
    ReactDOM.render(
        <ColorPicker/>
        , container
    );
```

The component above will handle the rendering of the color picker. To handle updates on states or properties by the user of the component, then the ColorPicker could be added as part of another component as follows:

```javascript
    class ColorPickerApp extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: "b988b9"
                };
                this.handleChange = this.handleChange.bind(this);
                this.setValue = this.setValue.bind(this);
                this.getValue = this.getValue.bind(this);
            }
    
            handleChange(e, value) {
                this.setState({value: value.updatedValue});
                console.log(value);
            }
    
            setValue() {
                this.setState({"value": "348ccb"});
            }
    
            getValue() {
                console.log(this.state.value);
            }
    
            render() {
                return (
                    <div>
                        <ColorPicker
                            value = {this.state.value}
                            onChange={this.handleChange}
                        />
                        <br/>
                        <span className="set-value-with-non-value-r slipstream-secondary-button" onClick={this.setValue}>Set Value</span>
                        <span className="get-value-with-non-value-r slipstream-primary-button" onClick={this.getValue}>Get Value</span>
                    </div>
                );
            }
        };
    ReactDOM.render(<ColorPickerApp/>, container);
```
