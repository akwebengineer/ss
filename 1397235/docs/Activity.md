#  Slipstream.SDK.Activity

Activities are the building blocks of workflows in Slipstream.  An activity defined in one plugin can discover and leverage activities defined by other plugins in order to create dynamic workflows.

The *Slipstream.SDK.Activity* function is the constructor for Activity objects.

## Syntax

```javascript
    new Slipstream.SDK.Activity()
```

## Description

A Slipstream activity is implemented as a Javascript AMD module in [requireJS](http://requirejs.org/docs/api.html) format.  The module must return a no-argument Javascript constructor that extends from *Slipstream.SDK.Activity*.  The framework will use this constructor to instantiate an activity.

```javascript
define(function() {
    function SomeActivity() {
       ...
    }
     
    // Inherit from the Slipstream Activity class
    SomeActivity.prototype = new Slipstream.SDK.Activity();
    
    // Return the constructor as the value of this module
    return SomeActivity;
});
```

### Activity Lifecycle

An Activity has a well-defined lifecycle that takes it through a series of states including *create*, *execute*, and *destroy*.

         ┌─────────────────────┐
     ┌─> │   Launch Activity   │
     │   └─────────────────────┘
     │              ↓ 
     │   ┌─────────────────────┐
     │ ← │   canInitiate()     │
     │   └─────────────────────┘
     │              ↓ 
     │   ┌─────────────────────┐
     │   │      onCreate()     │
     │   └─────────────────────┘
     │              ↓
     │   ┌─────────────────────┐
     │   │     onStart()       │
     │   └─────────────────────┘
     │              ↓
     │   ┌─────────────────────┐
     │   │  Activity Running   │
     │   └─────────────────────┘
     │              ↓
     │   ┌─────────────────────┐
     │   │     onDestroy()     │
     │   └─────────────────────┘
     │              ↓
     │   ┌─────────────────────┐
     └─  │ Activity Terminated │
         └─────────────────────┘


Each state of an activity has a corresponding lifecycle method in an Activity object: *canInitiate()*, *onCreate()*, *onStart()*, and *onDestroy()*.

When an activity is first launched its *canInitiate()* method is invoked. This method will allow an activity to perform a validity check before starting further execution. If the validation fails the activity won't be created. Upon successful validation, the activity's *onCreate()* method is called.  By default this method is a no-op but activities can override it to perform any operations necessary prior to the activity being started. Once the *onCreate()* method returns, the activity’s onStart() method is immediately invoked. This is the activity’s main method and is where an activity will typically perform model/view/layout creation, event binding and UI rendering.

When an activity is either no longer needed (eg. its associated plugin is removed from the system) or its system resources are required for another activity’s execution, the activity may be destroyed. Before an activity is destroyed its *onDestroy()* method is called. This allows the activity an opportunity to perform any cleanup operations prior to it being destroyed. Once destroyed an activity can come into existence again through the invocation of its *onCreate()*/*onStart()* methods.
  

**Note**: The destroy state and it's corresponding *onDestroy()* method are not currently used by Slipstream but are reserved for future use.

## Activity Instances
All Activity instances inherit from Activity.prototype.

### Properties

#### Activity.prototype.context
Provides the activity's [runtime context](ActivityContext.md).  The context can be used for operations such as starting other activities and reading message strings from the plugin's message bundles.

#### Activity.prototype.intent

Provides the [intent](Intent.md) used to start the activity.

### Methods

#### SDK.Activity.prototype.getCapabilities
Returns the capabilities required for a user to start this activity.

#### Parameters
None

#### SDK.Activity.prototype.canInitiate
The lifecycle callback that is invoked before an Activity is created. Any validation which needs to be done before an activity is initiated should be done here.

  The method in the Activity prototype results in a successful validation by default and should be overridden by objects implementing an activity.

#### Parameters

      - **options**
        
        An options hash for the validation process.  The options hash can contain the following keys:

          **success** - A callback to be called if activity is allowed to start. 

          **fail** - A callback to be called if validation fails and activity should be stopped. 


#### SDK.Activity.prototype.onCreate
The lifecycle callback that is invoked when an Activity is created.  This occurs after instantiation but before the activity is started.  Anything that an activity needs to do before it is started should be done here.  

  The method in the Activity prototype is a no-op and should be overridden by objects implementing an Activity.

#### SDK.Activity.prototype.onStart
The lifecycle callback that is invoked when an Activity is started.  This is where an activity should render its view(s).  

  The method in the Activity prototype is a no-op and should be overridden by objects implementing an Activity.

#### SDK.Activity.prototype.onDestroy
The lifecycle callback that is invoked when an Activity is destroyed.  

   The method in the Activity prototype is a no-op and should be overridden by objects implementing an Activity.

  **Note**: This method is not currently used by Slipstream but is reserved for future use.

#### SDK.Activity.prototype.setResult(resultCode, data)
Used to set the result of an activity.  Used when you intend to provide a result back to a parent activity

 #### Parameters

 - **resultCode**
 Result code of either SDK.Activity.RESULT_OK or SDK.Activity.RESULT_CANCELLED

 - **data**
 An intent containing the result of the activity

#### SDK.Activity.prototype.setContentView(view, options)
Set the view in the Slipstream content pane.

#### Parameters

  - **view**
the [view](Views.md) to be rendered into the framework's content area.  The view will replace an existing view in the content area and the existing view's *close* method will be called.

  - **options**
A set of options related to rendering of the content view 
    - **title**
	     This option is used to describe the content view title.  This object can contain the following attributes:
	  - **content**
	   The title string that will be used for the content view.

	  - **help** (Optional) The help content associated with the title. It is an object with the following attributes:

	       - **content** A string containing help text associated with the title. 

	      - **ua-help-text** (Optional) The text that will be used as a link to an external help page.
	      - **ua-help-identifer** (Optional) The [help identifer](https://ssd-git.juniper.net/spog/slipstream/blob/master/docs/help.md) used to create the link to an external help page.

      - **titlebar** (optional) The title to be used in the UI title bar.


#### SDK.Activity.prototype.getExtras
A proxy method to this.intent.getExtras() function to retrieve parameters passed in by the initiater (activityContext or url_router) into a JavaScript object.

#### SDK.Activity.prototype.finish
Should be called to indicate completion of the activity.  Handles returning a result to the parent activity if required, then calls the onDestroy lifecycle method.

#### SDK.Activity.prototype.setContentHeaderView(view)
Set the view into framework header's right region.
  
#### Parameters

  - **view**
  The view/string to be rendered into framework header's right region.

  This parameter can either be a String or a Slipstream view.
  

#### SDK.Activity.prototype.setLogo(view)
Set the logo in the UI.

Note:  The logo and the titlebar title set by the *setContentView* method are mutually exclusive.  The logo will be removed if a titlebar title is set by *setContentView* until the next call to *setContentView* that does not set a titlebar title.

#### Parameters

- **view**
The Slipstream view to be rendered as the product logo. 

The product logo can be set from any activity, but the logo should typically be set when the UI is first rendered and is therefore best done in an [autostart](Manifest.md) activity.

**Example**

```javascript
define(["text!../img/logo.svg"], function(logo) {
    var SetlogoActivity = function() {
        Slipstream.SDK.Activity.call(this);

        this.onStart = function() {
            var logoViewClass = Backbone.View.extend({
                className: "logo_template",
                render: function() {
                    var template = "<img src='data:image/svg+xml;base64,{{{logo}}}' style='width:144px; height:24px'></img>";
                    this.$el.append(Slipstream.SDK.Renderer.render(template, {
                        logo: btoa(logo)
                    }));
                }
            });

            // Set the logo
            this.setLogo(new logoViewClass());  
        }
    };

    SetlogoActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    SetlogoActivity.prototype.constructor = SetlogoActivity;
    
    return SetlogoActivity;
});
```