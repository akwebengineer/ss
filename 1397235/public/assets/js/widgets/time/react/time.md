# Time React Component


## Introduction
The time widget is a reusable graphical user interface that renders an input fields for the time and period elements, for any workflow which needs to show and interact time values.
It contains following HTML input fields:
* a text-input field for display and take time value in __HH:MM__ or __HH:MM:SS__ format.
* a select box with options: __AM__, __PM__ and __24 hour__

The time can be added to a container programmatically or as a component. The current document describes how to add a time as a React component. To add a time programmatically, refer to [Time Widget](public/assets/js/widgets/time/timeWidget.md)


## API
The Time React component gets its configuration from the Time properties. Once the component is rendered, it could be modified by updates on its states and properties.


## Properties
The Time React component has the following properties:

```javascript
 <Time
    value = <(optional) string, includes the time and period elements to define the  value for the Time component>
    disabled = <(optional) boolean, if it is set to true, the time will have user interaction disabled | otherwise, it will be enabled.>
    label = <(optional) boolean, if it is set to false, the predefined label will not show | otherwise, label will show.>
    onChange = <(optional) function, that is invoked when a time period is modified on UI or the state is set>
 />
```

For example, a time component could be rendered with the following tag:

```javascript
   <Time
      value={"10:10:10 AM"}
      disabled = {true}
  />
```

## Time Component Properties

### value
It defines the value assigned for the time field. Time field elements can be set to some value using the setState method.
Different supported formats for the value are - HH:MM[:SS] [AM|PM], like: 10:10 AM, 10:10:10 PM, 10:10:10 or 23:10 or 23:59:59.
Note: If the period is not provided as part of value, by default the '24 hour' is applied for the period.

### disabled
It defines the state of time component, so the time and the period elements are collectively disabled or enabled after it is rendered.
If not provided, by default the component is enabled.

### label
By default the time component provides the label. This can be removed using the property value as false.

### onChange
If provided, the onChange callback will be called whenever the time or period is modified on the UI or state for the 'value' prop is modified. The data to callback will be the updated modified time.

## Usage
To include a time component, render it using React standard methods. For example:

The following example shows how the time component can be used in the context of a React application:

```javascript
    class TimeApp extends React.Component {

            constructor(props) {
                super(props);
                this.state = {
                    disabled: false,
                    value: "10:10:10"
                };
            }

            // Method to enable / disable the component
            disable(value) {
                this.setState({disabled: value});
            }

            // Method to set new time
            setValue() {
                this.setState({value: "11:11:11 PM"});
            }

            // Method to get the current time
            getValue() {
                console.log(this.state.value);
            }

            render() {
                return (
                    <div>
                        <Time
                            disabled={this.state.disabled}
                            value={this.state.value}
                            onChange={(data) => this.setState({value: data})}
                        />
                        <span className="slipstream-primary-button" onClick={() => this.disable(false)}>Enable</span>
                        <span className="slipstream-primary-button" onClick={() => this.disable(true)}>Disable</span>
                        <span className="slipstream-primary-button" onClick={() => this.setValue()}>Set Value</span>
                        <span className="slipstream-primary-button" onClick={() => this.getValue()}>Get Value</span>
                    </div>
                );
            }
        }
    ReactDOM.render(<TimeApp/>, pageContainer); //where pageContainer represents where the time & period elements will be rendered
```