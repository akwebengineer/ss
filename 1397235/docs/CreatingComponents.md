#  Slipstream Components

Slipstream provides the infrastructure to incorporate components in its Slipstream views.

# Component Programming Interface

### Introduction
A component is a section of a user interface that can be reused across the framework. It is part of a plugin.
This document describes the general guidelines for defining and using component programmatic interfaces.


### File system structure
A component is used from a plugin under the shared/components folder. When a component is defined, it should follow the following file system structure:

```
   <component_name>/
      component.json
      README.md
        js/models/
          … all model/collections files …
        js/views/
          … all view files …
        templates/
          … all HTML templates …
```

component.json defines all of the metadata for the component including the location of the Component loader. This Component loader should follow the programming interface as explained in the Programming interface section.

### Programming interface
A component should expose a configuration object with all properties required to render the component.
The configuration object should include a reference to the container from where the component will be rendered.
When a plugin needs to render a component (for example: *ComponentName* component), the component will be used in the following way:

```javascript
var conf = {
        container: domElement //dom element or identifier (class or id) where the component will be rendered
        ... other configuration parameters
    }
var newComponent = new ComponentName(conf);
newComponent.build();
```

All components should include:
- **container** attribute: references a container or an identifier (class or id) where the component will be rendered
- **build** method: renders the content of the component in the defined container (*container*) and returns the component instance. (required method)
- **destroy** method: removes views from DOM and unbinds event bindings and returns the component instance. (required method).

The container could be a reference to a regular HTML tag or a component defined tag. For example, a component defined tag would be:

```
//component defined tag in the html
<card-component></card-component>

//reference to the container attached to the current view; for example, the view container: this.$el
var container = this.$el.find("card-component")[0];
```

### Styles and Images
The component should be self contained. All the styles and images required by the container should be scoped in the container and should not propagate to existing Slipstream style classes and images.


### Document
The component should include a README.md file that describes the usage of the component, the required configuration and the available methods.

## Usage
A component could be defined using libraries like Polymer or Riot. In the case of Polymer, the style,  template and registration of the component in the library will be:

```
<dom-module id="test-polymer-spinner">
    <template>
        <style>
           :host {
               --counter-color: #96a5aa;
           }
           .spinnerLabel {
               font-size: 14px;
               color: var(--counter-color);
            }
        </style>
        <div class="indeterminateSpinnerContainer">
            <div class="spinnerText spinnerLabel">{{spinner-binding}}</div>
            <div class='icon_spinner'></div>
        </div>
    </template>
    <script>
    Polymer({
        "is": "test-polymer-spinner",
        "properties": {
            "spinner-binding": {
                "type": String,
                "value": "Default value"
            }
        }
    });
    </script>
</dom-module>
```

To consume this component, the following html should be added:

```
    <test-polymer-spinner spinner-binding="Spinner Component using Polymer!"></test-polymer-spinner>

```