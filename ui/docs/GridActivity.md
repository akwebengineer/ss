

## GridActivity

The GridActivity was created to simplify the creation of an inventory landing page.  The GridActivity provides it's own view and some default configuration values.  

The minimum behavior provided by the GridActivity is to list all resources of a given type.  Simply subclass GridActivity and "require" your grid configuration with specifics such as columns to render and any special formatting.  Example usage is provided below.

As you add capabilities to your Activity you must also update your plugin's plugin.json so the framework can resolve a request to your activity.  In general, you will want to create an activity entry with a URL path in plugin.json only for the VIEW action and place the other actions in a separate activity entry that does not define a URL path.

### Table of Contents
**[Capabilities](#capabilities)**  
**[List](#list)**  
**[Create](#create)**  
**[Edit](#edit)**  
**[Clone](#clone)**  
**[Find Usage](#find-usage)**  


## Capabilities

By default, the GridActivity will list resources in a grid. The optionally supported capabilities include:  

* create: Enables the create button on the grid.  
* findUsage: Enables performing a global search against a selected item.

The capabilities object uses the capability as a property name, and an options object as the value.

```
    capabilities = {
        capabilityName: optionsObject,
        anotherCapabilityName: anotherOptionsObject,
        ...
    }
```

### Supported Capabilities  

#### List  

A built in capability that does not need to be defined in the capabilities object. Expectations for your Grid configuration object is that it will take an activity context in the constructor and that it has a getValues method.  The capability can be explicitly defined if your landing page grid needs to handle additional events.  For example, if your grid includes links and you need to listen for click events, you can provide an alternate view.

Usage - default gridView

Activity
```javascript
define([
    './gridActivity.js',
    './conf/gridConfiguration.js'
], function(GridActivity, GridConfiguration) {

    var SampleActivity = function() {
        GridActivity.call(this);
        this.gridConf = GridConfiguration;
    };

    SampleActivity.prototype = Object.create(GridActivity.prototype);
    SampleActivity.prototype.constructor = SampleActivity;

    return SampleActivity;
});
```
Usage - when you need more functionality in your view

Activity
```javascript
define([
    './gridActivity.js',
    './conf/gridConfiguration.js',
    './view/myView.js'
], function(GridActivity, GridConfiguration, MyView) {

    var SampleActivity = function() {
        GridActivity.call(this);

        this.capabilities = {
            list: {
                view: MyView
            }
        }

        this.gridConf = GridConfiguration;
    };

    SampleActivity.prototype = Object.create(GridActivity.prototype);
    SampleActivity.prototype.constructor = SampleActivity;

    return SampleActivity;
});
```


Grid Configuration Pattern
```javascript
define([
], function () {

    // Constructor should assume context will be passed in
    var Configuration = function(context) {

        // Only required method is getValues
        // It should return localized strings
        this.getValues = function() {

            return {
                "title": context.getMessage('nls_key_for_title'),
                "title-help": {
                    "content": context.getMessage('nls_key_for_help'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                ...
            };
        };
    };

    return Configuration;
});

```

#### Create

The create capability is used to allow creating a resource.  The GridActivity will handle the event binding and provide a default behavior of starting the same activity with the ACTION_CREATE intent action and using the result as input to the grid.  The create capability has one required option: view, and one optional option: size.  The view option should be set to the view that is used to render your create process. This view will have an activity property which should be used to set a result and finish the activity.  The size option defines the overlay size.  If not provided, it will default to 'large'.

Options

```javascript
{
    view: ViewClass,
    size: 'large'
}
```

* view: A view class, do not instantiate it.  The GridActivity will do this for you. This is a required option.

Usage  

Activity
```javascript
define([
    './gridActivity.js',
    './conf/gridConfiguration.js',
    './views/View.js'
], function(GridActivity, GridConfiguration, View) {

    var SampleActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "create": {
                "view": View,
                "size": 'wide'
            }
        };

        this.gridConf = GridConfiguration;
    };

    SampleActivity.prototype = Object.create(GridActivity.prototype);
    SampleActivity.prototype.constructor = SampleActivity;

    return SampleActivity;
});
```

View
```javascript
define([
    'backbone'
], function (Backbone) {

    var SampleView = Backbone.View.extend({

        // At some point, a result should be set and the activity finished.
        // The result should be the same model that populates a grid row
        doSomething: function() {
            this.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, {key: value});
            this.activity.finish();
        },

        initialize: function(options) {
            this.activity = options.activity;
        },

        render: function() {
            this.doSomething();

            return this;
        }

    });

    return SampleView;
});

```

#### Edit

The edit capability is used to allow editing of a resource.  The GridActivity will handle the event binding and provide a default behavior of starting the same activity with the ACTION_EDIT intent action and using the result as input to update the grid row when done editing.  The edit capability shares the same options as the create capability.  You can provide the same view that is used for create if both actions are to be similar, or a separate view, if create uses a wizard and edit uses a form, for example.

Options

```javascript
{
    view: ViewClass,
    size: 'large'
}
```

* view: A view class, do not instantiate it.  The GridActivity will do this for you. This is a required option.

Usage  

Activity
```javascript
define([
    './gridActivity.js',
    './conf/gridConfiguration.js',
    './models/Model.js',
    './views/View.js'
], function(GridActivity, GridConfiguration, View, Model) {

    var SampleActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "edit": {
                "view": View,
                "size": 'wide'
            }
        };

        this.gridConf = GridConfiguration;
        this.model = Model;
    };

    SampleActivity.prototype = Object.create(GridActivity.prototype);
    SampleActivity.prototype.constructor = SampleActivity;

    return SampleActivity;
});
```

View  

Follows the same pattern as create.

#### Clone

The clone capability is used to allow cloning of a resource.  The GridActivity will handle the event binding and provide a default behavior of starting the same activity with the ACTION_CLONE intent action and using the result as input to the grid.  The clone capability accepts the same options as create. Cloning introduces the requirement of defining a backbone Collection instance that can be used to fetch resource names when generating the cloned name.

Options

```javascript
{
    view: ViewClass,
    size: 'large'
}
```

* view: A view class, do not instantiate it.  The GridActivity will do this for you. This is a required option.

Usage  

Activity
```javascript
define([
    './gridActivity.js',
    './conf/gridConfiguration.js',
    './models/Collection.js',
    './views/View.js'
], function(GridActivity, GridConfiguration, View, Collection) {

    var SampleActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "clone": {
                "view": View,
                "size": 'wide'
            }
        };

        this.gridConf = GridConfiguration;
        this.collection = new Collection();
    };

    SampleActivity.prototype = Object.create(GridActivity.prototype);
    SampleActivity.prototype.constructor = SampleActivity;

    return SampleActivity;
});
```

View

Follows the same pattern as create.

#### Find Usage

The findUsage capability is used for any resource where you want to enable global search.  The findUsage capability has one option: key.  It is optional, if not provided the search will be performed against the "name" property of the selected row.

Note: This will currently activate only the context menu accessed by right clicking on a grid row.  Support to automatically add to the "More" menu is coming.

Options
```
{
    key: "name"
}
```

* key: The name of the property that contains the value a search should be performed against.  This is optional.  The default value is "name".

Usage  

```javascript
define([
    './gridActivity.js',
    './conf/gridConfiguration.js'
], function(GridActivity, GridConfiguration) {

    var SampleActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "findUsage": {}
        };

        this.gridConf = GridConfiguration;
    };

    SampleActivity.prototype = Object.create(GridActivity.prototype);
    SampleActivity.prototype.constructor = SampleActivity;

    return SampleActivity;
});
```
