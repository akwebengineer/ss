# Widget's Programming Interface

## Introduction
A Slipstream widget is a section of a user interface that can be reused across the framework. It can be part of a plugin or it can be called by other widgets.
This document describes the general guidelines for defining and using widget programmatic interfaces.


## Widgets

### File system structure
Each widget is located in a folder inside *public/assets/js/widgets* folder and follows the following file system structure:

```
   <widget_directory_name>/
      widgetMainFile.js
      widget_name.md
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
A widget should expose a configuration object with all inputs required to render the widget.
The configuration object should include a reference to the container from where the widget will be rendered.
For example, when a plugin or another widget needs to render a widget (for example: *WidgetName* widget), the widget will be used in the following way:

```javascript
var conf = {
        container: domElement //dom element where we will render the widget ($container.append(content))
        ... other configuration parameters
    }
var newWidget = new WidgetName(conf);
newWidget.build();
```

All widgets might include:
- **container** attribute: references a container where the widget will be rendered (optional attribute)
- **build** method: renders the content of the widget in the defined container (*container*) and returns "this". (required method)
- **destroy** method: removes views from DOM and unbinds event bindings and returns "this".(required method).

The following attribute could be included as part of the configuration object:
- **view** attribute: contains the view to be rendered. View definition is TBD.

### Namespace
TBD

### Styles and Images
The location of the style/css of a widget should be the *public/assets/css/widgets* folder and named widget_name.scss.
To avoid collisions with other styles defined in the framework, a name space should be added for any style defined in widget_name.scss

```
.widget_name{
    ...styles for widget_name
}
```

To include widget_name.scss in the framework, import it at *public/assets/css/app.scss* with:

```
@import "widgets/widget_name";
```

Images/assets for a widget can be added at *public/assets/images*.

### Base Widget
A widget can inherit from a baseWidget to use basic functionality like invoking handlers when an action/event is triggered or register multiple handlers for the same action. The following example shows a new widget that inherits from the base widget:

```javascript
define([
    "widgets/baseWidget",
], /** @lends ActionBarWidget*/
function (BaseWidget) {

    var ActionBarWidget = function (conf) {
        BaseWidget.call(this, {
            "events": conf.events
        });
        this.build = function() {
            //build implementation
        };
        this.destroy = function() {
           //destroy implementation
        };
        //other widget implementation
    };

    ActionBarWidget.prototype = Object.create(BaseWidget.prototype);
    ActionBarWidget.prototype.constructor = ActionBarWidget;

    return ActionBarWidget;
});
```

where conf.events could, for example, have the value:
```javascript
conf.events = {
        "downloadJims": {
          "handler": [downloadCallback]
        }
    }
```

and the handler can be implemented as:
```javascript
 var downloadCallback = function (event, actionObj) {
        //implementation
    };
```

Base widget provides the following methods:

#### _invokeHandlers
Invokes handlers by using the hash built from the events configuration (conf.events) and/or the _bindEvents method. It takes the parameters: key, event, and eventData. key is the unique identifier of the action as per the conf.events hash. event is the event generated when the action is triggered. eventData is data associated with the event. For example:

```
this._invokeHandlers(key, event, eventData);
```

#### _bindEvents
Register handlers for the actions provided in its input parameter updatedEventsHash.  updatedEventsHash is an object with a key that represents the action key and the value of the key should be an Object with the handler property. handler is a required property and it represents the callback that will be invoked when the event is triggered. handler should be represented as an array, so multiple callbacks to the same event can be added. For example:

```
    var downloadCallback = function (event, actionObj) {
        //implementation
    };
    this._bindEvents({
        "downloadJims": {
            "handler": [downloadCallback]
        }
    });
```

#### _unbindEvents
Unregister handlers for the actions provided in its input parameter updatedEventsHash. updatedEventsHash is an object with a key that represents the action key and the value of the key should be an Object with the handler property. handler is a required property and it represents the callback that should NOT be invoked when the event is triggered. For example:

```
    var downloadCallback = function (event, actionObj) {
        //implementation
    };
    this._unbindEvents({
        "downloadJims": {
            "handler": [downloadCallback]
        }
    });
```

Methods starting with "_" are internal; i.e., methods are expected to be used only by other widgets and not by the user of a widget.


### Testing and documentation
Documentation

1. A description about the usage of the widget and other related documentation should be included under widget_name.md file (where widget_name stands for the name of the widget).
2. The first line of the documentation should be the title of page and should be in the form `#Widget_name widget` (where widget_name stands for the name of the widget).
3. The next level of heading like "Introduction", "API", "Usage", etc, should be included with `##` (2 hashes) in front of it.
4. For every successive level of heading increase the number of hashes `#` by one.

---
Testing

1. All widgets should include one or more files that exercise the widget's functionality and should be located at the tests directory.
2. The name of the main test js file should be appWidget_name.js
3. The main html file should only have one div in body with id "main_content", any other dom structure that is needed must be made as a template and kept in tests/templates folder and named widget_nameExample.html. Any extra class or style for the dom must also be added as an inner div in the template. The template should be loaded in the appWidget_name.js file.
4. When instantiating the backbone view in test page from main.js file, only pass the el (which will be main_content). No extra property must be passed from main. Any extra property of module needed must be loaded in the js file.

-----
Explorer (steps to make explorer page)

1. Before making explorer page make sure that the widget has test page named appWidget_name.js and a md file in widget_name folder named widget.md
2. Inside /explorer/widgets/conf, update widgetConfiguration.lib and widgetConfiguration.nav. In widgetConfiguration.lib, add an object with id, name and desc, id should same as widget_name. In widgetConfiguration.nav, add id and name, id should be side-widget_name.
3. Inside /explorer/widgets/js, update start.js. Add 2 events, one for click of side-widget_name id and other for click of widget_name id. The url for widget_name click should be of format "/assets/js/explorer/widgets/tabs.html#widget=widget_name&formVal=var1&formExt=bool1", where widget_name is the name of widget (must match the folder name in the widgets folder), var1 is either "arr" or "obj" and bool1 is either true or false. var1 is used to specify the form in which values from the demo form is passed to demo page, "arr" would mean that the values are passed as an array and "obj" would mean the values are pased as name value pair. bool1 specifies if the default form for demo page needs extension of not. 
4. Run "explorer/widgets/start.sh widget_name opt" from terminal, where widget_name is name of the widget (must match the folder name in the widgets folder) and opt is optional parameter. If you plan to extend the form, replace opt by 1 otherwise skip the parameter.
5. At this point a basic skeleton is created for the widget with 1st (documentation) and 3rd (example) tab. To complete the demo page (2nd tab), add elements to formConf.js in widget_name/tests/explorer folder and parse the form result and build the widget in demo.js file in same location. 
6. In case you are extending the form edit formExtend.js in widget_name/tests/explorer. Add any extra event in the place specified with event handlers as seperate functions. Add any thing extra (other than events) in "addMoreCode" function.
7. At any point if you want to change the form i which the form returns values change the url in start.js page. If you want to extend form, change the url and copy skeleton file from explorer/widgets/setup folder.I



### Guidelines
1. Do not include dependencies to other libraries for the exposed interface (*WidgetName*)
2. Do not include html in the views, create templates instead and add it to the *templates* folder of the widget.
3. Do not include reference to id or classes that are located outside of the widget you are defining.
4. Avoid using id internally in your widget, if you need to use it, follow an id name convention; example: nameOfWidget_id. html5 data attribute would be other option.
5. Avoid using inline style, use instead a class and have it included in the style file (*widget_name.scss*).

