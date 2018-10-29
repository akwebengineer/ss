# Toggle Button

The toggle button is a reusable graphical user interface that renders a button with on and off states. It is configurable; for example, it could be rendered with a default state (on/off), or it could be disabled. The toggle button can be added to a container programmatically (widget) or as a component (React). 


## Widget
The toggle button is added to a container by creating an *instance* of the toggle button widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the toggle button will be built. For example, to add the toggle button in the testContainer container:

```javascript
    new ToggleButtonWidget({
      "container": testContainer,
      "id": "togglebutton_1",
      "name": "togglebutton_1",
      "on": false
    }).build();
```

Any update required after the toggle button is built can be done using the methods exposed by the widget.

More details can be found at [ToggleButton Widget](public/assets/js/widgets/toggleButton/toggleButtonWidget.md)


## React
The toggle button can be rendered using the ToggleButton *component* and configured using a set of properties. For example, to include the toggle button, add the component:

```javascript
    <ToggleButton
        id="togglebutton_1_r"
        name="togglebutton_1_r"
        on={true}
        disabled={true}
    />
```
and then render and update its state using standard React methods. 

More details can be found at [ToggleButton React Component](public/assets/js/widgets/toggleButton/react/toggleButton.md)