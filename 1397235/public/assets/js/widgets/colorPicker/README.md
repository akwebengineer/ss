# Color Picker Widget

The colorPicker widget is a reusable graphical user interface that renders a colorPicker input with a palette dialog for a color selection. It is configurable. The color picker can be added to a container programmatically or as a component.


## Programmatic -new ColorPickerWidget(conf)-
The color picker is added to a container by creating an *instance* of the color picker widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the color picker will be built. For example, to add the color picker in the testContainer container:

```javascript
    new ColorPickerWidget({
      "container": $colorPickerContainer,
      "value": "b988b9"
    }).build();
```

Any update required after the color picker is built can be done using the methods exposed by the widget.

More details can be found at [Programmatic ColorPicker](public/assets/js/widgets/colorPicker/colorPickerWidget.md)


## Component Based -React: <ColorPicker>-
The colorPicker can be added to a container/page using the ColorPicker component with the configuration options as properties of the component. Currently, there is support for *React* components only; therefore, a ColorPicker component should be rendered on the container using React. For example, to include the color picker, add the component:

```javascript
    <ColorPicker
       value = {this.state.value}
       onChange={this.handleChange}
   />
```

Any update needed after the color picker is rendered can be done using the update of states and properties of a React component.

More details can be found at [ColorPicker React Component](public/assets/js/widgets/colorPicker/react/colorPicker.md)