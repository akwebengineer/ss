# Tooltip

The tooltip widget is a reusable graphical interface that allows users to show the tooltip for the element, such as a link, or an image. The tooltip can be added to a container programmatically (widget) or as a component (React).


## Widget
The tooltip is added to a container by creating an *instance* of the tooltip widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the tooltip will be built. For example, to add a tooltip in the testContainer container:

```javascript
    new TooltipWidget({
        "container": testContainer
    }).build();
```

Any update required after the tooltip is built can be done using the methods exposed by the widget.

More details can be found at [Tooltip Widget](public/assets/js/widgets/tooltip/tooltipWidget.md)


## React
The tooltip can be rendered using the Tooltip *component* and configured using a set of properties. For example, to include the tooltip, add the component:

```javascript
<span>
    Tooltip with image on hover over the text
    <Tooltip>
        <span>This is my tooltip.</span>
    </Tooltip>
</span>
```

and then render and update its state using standard React methods.

More details can be found at [Tooltip React Component](public/assets/js/widgets/tooltip/react/tooltip.md)