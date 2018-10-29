# Slipstream Widgets and Components

A Slipstream widget/component is a section of a user interface that can be reused across the framework. It can be part of a plugin or it can be called by other widgets. It can be added to a container programmatically (widget) or as a component (React).


## Widget
A widget is added to a container by creating an *instance* of the widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the widget will be built. Slipstream widgets have a common programming interface; more details of the interface can be found at [Widget Programming Interface](public/assets/js/widgets/Widget_Programming_Interface.md)


## React
A component can be rendered using a *component* element and configured using a set of properties. Slipstream components have a common programming interface; more details of the interface can be found at [Component Programming Interface](public/assets/js/widgets/Component_Programming_Interface.md)