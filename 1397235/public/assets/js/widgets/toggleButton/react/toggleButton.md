# Toggle Button React Component


## Introduction
Toggle button is a reusable graphical user interface that renders a button with on and off states. It is configurable; for example, it could be rendered with a default state (on/off), or it could be disabled.
Toggle button can be added to a container programmatically or as a component. The current document describes how to add a toggle button as a React component. To add a toggle button programmatically, refer to [ToggleButton Widget](public/assets/js/widgets/toggleButton/toggleButtonWidget.md)


## API
The toggle button React component gets its configuration from the ToggleButton properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The toggle button React component has the following properties:

```javascript
 <ToggleButton
    id = <(required) string, defines the id of the toggle button component>
    name = <(required) string, defines the name of the toggle button component>
    on = <(required) boolean, if it is set to true, the toggle button is considered "on"; otherwise it considered is off.]
    disabled = <(optional) boolean, if it is set to true, the toggle button will have user interaction disabled; otherwise, it will be enabled.>
    inlineLabel = <(optional) boolean or Object, defines the string that will be shown next to the toggle button. It describes the on and off states.>
     onChange = <(optional) function, callback that is invoked when the toggle button value (on) is changed.>
/>
```

For example, a toggle button component could be rendered with the following element:

```javascript
   <ToggleButton
        id="togglebutton_2_r"
        name="togglebutton_2_r"
        on={true}
        inlineLabel={{
            "on": "Active",
            "off": "Inactive"
        }}
  />
```

### id
It defines the id that the input element in the toggle button component will be assigned to. It is a string and it has to be unique in the page/DOM.

### name
It defines the name that the input element in the toggle button component will be assigned to. It is a string data type.

### on
It defines the state of the toggle button component. If it is set to true, the button is on and if it is set to falsey (false, undefined, etc.) then the button represents the state off.

### disabled
It disables the toggle button component, so its value can't be updated from on to off or vise versa once it is rendered.

### inlineLabel
It defines the inline label that will be shown next to the toggle button. It is an optional property and can set as a boolean or as an Object. If it is defined as a boolean, true will enable the inline label with "On" and "Off" text. If it is set to false, then the inline label will not be shown. If the value is set as an Object, then it should include the "on" and "off" properties. These properties will be used to replace the default "On" and "Off". For example:

```javascript
    <ToggleButton
        id="togglebutton_1_r"
        name="togglebutton_1_r"
        on={true}
        disabled={true}
    />
```

### onChange
It defines the callback that will be invoked the value of the toggle button component is updated; i.e. when the toggle is switched from on to off and vice versa.


## Usage
To include a toggle button component, define it with at least the id and name and then render it using React standard methods. For example:

```javascript
    <ToggleButton
        id="togglebutton_1_r"
        name="togglebutton_1_r"
    />
```

The following example shows how the toggle button component can be used in the context of a React application:

```javascript
    class ToggleButtonApp extends React.Component {
       constructor(props) {
           super(props);
           this.state = {
               isOn: false,
               isDisabled: false
           };
           this.handleClick = this.handleClick.bind(this);
           self.toggleButtonAppInstance = this;
       }
       handleClick(e, value) {
           console.log(value);
       }
       render() {
           return (
               <ToggleButton
                   id="togglebutton_3_r"
                   name="togglebutton_3_r"
                   on={this.state.isOn}
                   disabled={this.state.isDisabled}
                   inlineLabel={true}
                   onChange={this.handleClick}
               />
           );
       }
    };
    ReactDOM.render(<ToggleButtonApp/>, pageContainer); //where pageContainer represents where the ToggleButton will be rendered
```