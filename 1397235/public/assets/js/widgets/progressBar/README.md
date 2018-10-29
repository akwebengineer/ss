# Progress Bar

The progress bar widget is a reusable graphical interface that allows users to show the progress bar while loading a page or file. The progress bar can be added to a container programmatically (widget) or as a component (React).


## Widget
The progress bar is added to a container by creating an *instance* of the progress bar widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the progress bar will be built. For example, to add a progress bar in the testContainer container:

```javascript
    new ProgressBarWidget({
        "container": testContainer,
        "statusText": 'Current stage of operation...'
    }).build();
```

Any update required after the progress bar is built can be done using the methods exposed by the widget.

More details can be found at [Progress Bar Widget](public/assets/js/widgets/progressBar/progressBarWidget.md)


## React
The progress bar can be rendered using the ProgressBar *component* and configured using a set of properties. For example, to include the progress bar, add the component:

```javascript
    <ProgressBar
        statusText='Current stage of operation...'
    />
```

and then render and update its state using standard React methods.

More details can be found at [Progress Bar React Component](public/assets/js/widgets/progressBar/react/progressBar.md)