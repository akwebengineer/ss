# Component's Programming Interface

## Introduction
A Slipstream component is a section of a user interface that can be reused across the framework. It can be used in plugins or in the implementation of other components.
This document describes the general guidelines for defining and using component programmatic interfaces.


## Components

### File system structure
Each component is located in a folder inside *public/assets/js/widgets/<widget_directory_name>/<component_library_name>* folder; for example if a component is implemented using React library, then the path will be: *public/assets/js/widgets/<widget_directory_name>/react*. In this case, a React component will have the following file system structure:

```
   <widget_directory_name>/react/
      component_name.js //component main file
      component_name.md
        conf/
          … all configuration files …
        models/
          … all model/collections files …
        views/
          … all view files …
        templates/
          … all HTML templates …
        tests/
           … all test files/directories …
```

### Programming interface
A component should have all the properties required to render the component. It could also include some callbacks that communicate updates in the component user interaction or some internal updates in the component that need to be communicated to the user of the component; for example, if a component is clicked, then the onClick callback will be invoked, or if a component property has been updated then onChange callback will be invoked. A component callback should be named as on<event_name>; for example, onClick, onChange, onRefresh, onLoad, etc.

 The component could be part of a plugin or as a part of another component. For example, when a plugin or another component needs to render a component (for example: *ComponentName* component), the component will be used in the following way:

```javascript
    <ComponentName
        prop1 = value1
        prop2 = value2
        prop3 = value3
        onClick = onClickCallback
        onChange = onChangeCallback
        ...
    />
```

A component can have nested elements that are either other components or HTML elements that could be used as part of the data required to render a component.

Once the component element and its properties are specified in a page/plugin or another component, then it can be rendered and updated using standard component methods.

### Styles and Images
The location of the style/css of a component should be the *public/assets/css/widgets* folder and named component_name.scss.
To avoid collisions with other styles defined in the framework, a name space should be added for any style defined in component_name.scss using the format: <component-name>-component. In the case of a component that wraps up an existing widget, then the style comes from the widget.

```
.component_name{
    ...styles for component_name
}
```

To include component_name.scss in the framework, import it at *public/assets/css/app.scss* with:

```
@import "components/component_name";
```

Images/assets for a component can be added at *public/assets/images*.


### Testing and documentation

#### Documentation

1. A description about the usage of the component and other related documentation should be included under component_name.md file (where component_name stands for the name of the component). For example, the path of the component document for a React component should be: *public/assets/js/widgets/<widget_directory_name>/react*
2. The first line of the documentation should be the title of page and should be in the form `#Component_name Component` (where component_name stands for the name of the component).
3. The next level of heading like "Introduction", "Properties", "Usage", etc, should be included with `##` (2 hashes) in front of it.
4. For every successive level of heading increase the number of hashes `#` by one.

A component documentation should have the following format:

```
# <Component Name> Component

## Introduction
<introduction details>

## API
<API details as a paragraph>

## Properties
<properties details as a list>

## Usage
<usage details as a paragraph>

```


---
#### Testing
TBD