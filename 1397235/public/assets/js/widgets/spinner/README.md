# Spinner

The spinner widget is a reusable graphical interface that allows users to show the spinner while loading a page or file. The spinner can be added to a container programmatically (widget) or as a component (React).


## Widget
The spinner is added to a container by creating an *instance* of the spinner widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the spinner will be built. For example, to add a spinner in the testContainer container:

```javascript
    new SpinnerWidget({
        "container": testContainer,
        "statusText": 'Current stage of operation...'
    }).build();
```

Any update required after the spinner is built can be done using the methods exposed by the widget.

More details can be found at [Spinner Widget](public/assets/js/widgets/spinner/spinnerWidget.md)


## React
The spinner can be rendered using the Spinner *component* and configured using a set of properties. For example, to include the spinner, add the component:

```javascript
    <Spinner
        statusText='Current stage of operation...'
    />
```

and then render and update its state using standard React methods.

More details can be found at [Spinner React Component](public/assets/js/widgets/spinner/react/spinner.md)