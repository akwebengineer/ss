# Help

The help widget is a reusable graphical interface that allows users to show the help on the page. The help can be added to a container programmatically (widget) or as a component (React).


## Widget
The help is added to a container by creating an *instance* of the help widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the help will be built. For example, to add a help in the testContainer container:

```javascript
	var config = {
        "content": "Tooltip that shows how to access view help from the Help Widget",
        "ua-help-text": "More..",
        "ua-help-identifier": "alias_for_ua_event_binding"
    };
    new HelpWidget({
        "container": testContainer,
        "view": config
    }).build();
```

Any update required after the help is built can be done using the methods exposed by the widget.

More details can be found at [Help Widget](public/assets/js/widgets/help/helpWidget.md)


## React
The help can be rendered using the Help *component* and configured using a set of properties. For example, to include the help, add the component:

```javascript
<Help>
    Tooltip that shows how to access view help from the Help Widget
    <HelpLink id="alias_for_ua_event_binding">More...</HelpLink>
</Help>
```

and then render and update its state using standard React methods.

More details can be found at [Help React Component](public/assets/js/widgets/help/react/help.md)