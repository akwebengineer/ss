# Slipstream Shared Components

Slipstream  *shared components* are encapsulated UI elements that can be shared across plugins and used in the rendering of [views](Views.md).  Unlike *widgets*, it is not necessary for shared components to be a part of the Slipstream framework - they can be stored in and downloaded from a third-party component repository and bundled with plugins.  However, instead of many instances of the same component definition existing in a Slipstream application and, therefore, increasing it's memory footprint, the framework provides support for sharing a single instance of a given component across plugins.

## Including Shared Components in Plugins

Shared components are placed in the shared/components directory of a [plugin](Plugins.md).  Each component is placed in it's own sub-directory:

```
plugin.json
css/
js/
...
shared/
   components/
       spinner/
           ...
       card/
           ...
```

Once the plugin has been developed and all of the requisite shared components have been included, it can be packaged using the [plugin_mgr](Plugins.md) utility.  During the packaging process the plugin's plugin.json file will be re-written to contain additional metadata for use in efficiently resolving references to shared components.

## Using Shared Components in Plugins

A shared component must be loaded before it can be used in a plugin.

To load a shared component, the *loadComponent* method of the [Activity Context](ActivityContext.md) is used.

```javascript
...
context.loadComponent(["card", "spinner"], function(Card, Spinner) {
    var card = new Card(...);
    var spinner =  new Spinner(...);
    ...
});
```  
Only a single instance of a given version of a shared component will be loaded by the *loadComponent* method.  If multiple requests to load the same version of the same component are made, only a single instance of the shared component will be loaded and it will be shared amongst all referencing plugins.

To ensure consistency in the look and feel throughout the UI, references to a shared component will always be resolved to the instance of the component with the highest version.  For example, if plugin A packages version 1.0 of component C and plugin B packages version 1.5 of  component C, then references to component C from plugins A and B will all resolve to version 1.5 of component C.  Component interfaces will be backwards compatible between versions.

Refer to the documentation included with a component for more details on how to use that component.

## Creating Shared Components
Refer to [this document](CreatingComponents.md) for information on creating shared components.

