# Overlay

Overlay is a reusable graphical user interface that renders content in a layer on top of a page. It provides a way for the user of an application to access additional information without leaving the current page or loading a new page. It is modal which disables the original page beneath the overlay and requires acknowledgement from the user. User needs to take an action or cancel the overlay until he or she can continue interacting with the original page. It is configurable; for example, it could be rendered with or without a title, bottom bar, and the content is defined by the user of the component. The overlay can be added to a container programmatically (widget) or as a component (React).


## Widget
The overlay is added to a container by creating an *instance* of the overlay widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the overlay will be built. For example, to add the overlay in the testContainer container:

```javascript
    new OverlayWidget({
        type: "large",
        title: "Overlay Title",
        view: new ContentView(), //content of the overlay
        okButton: true
    }).build();
```

Any update required after the overlay is built can be done using the methods exposed by the widget.

More details can be found at [Overlay Widget](public/assets/js/widgets/overlay/overlayWidget.md)


## React
The overlay can be rendered using the Overlay *component* and configured using a set of properties. For example, to include the overlay, add the component:

```javascript
    <Overlay
        type="large"
        title="Overlay Title"
        okButton={true}
    >
        <div>Container that represents any content and could include other React components</div>
    </Overlay>
```
and then render and update its state using standard React methods. 

More details can be found at [Overlay React Component](public/assets/js/widgets/overlay/react/overlay.md)