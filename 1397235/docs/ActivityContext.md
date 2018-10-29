#  Slipstream.SDK.ActivityContext

Provides a runtime context for activities.  Plugins should never need to instantiate an *ActivityContext* object.  Context objects are created by the framework and associated with a running activity.

## Syntax

```javascript
    new Slipstream.SDK.ActivityContext(ctx_name, ctx_root)
```

### Parameters

- **ctx_name**
The name of the context.  Slipstream sets this to the name of the plugin associated with the activity.

- **ctx_root**
The fully qualified path to the root directory of the plugin associated with the activity.

## ActivityContext Instances

### Properties

- #### ctx_name
The name of the context.  Slipstream sets this to the name of the plugin associated with the activity.

- #### ctx_root
The fully qualified path to the root directory of the plugin associated with the activity.

### Methods

- #### SDK.ActivityContext.prototype.getMessage(key, sub_values)
Retrieve a localized message by key.

  #### Parameters

  - **key**
The key to the message to be retrieved

  - **sub_values** (optional)
An array of substitution values that should be interpolated into the retrieved message string.

  #### Returns
  The localized message string with the *sub_values* interpolated.
  
  ```javascript
  var my_key = "A message with not {0} but {1} substitution values";
  var msg = this.context.getMessage("my_key", ["one", "two"]);
  console.log(msg);
  
  > "A message with not one but two substitution values"
  ```

- #### SDK.ActivityContext.prototype.startActivity(intent, windowSpec)
Start an activity

  #### Parameters

  - **intent**
  The intent used to define the activity to be started.
  
  - **windowSpec** (optional)
  If a *windowSpec* is provided, the activity will be started in a new window.  This object
  can contain the following attributes:
  
      - **name** The name of the new window
      - **features** (optional) The features of the new window.  This is identical to the *strWindowFeatures* argument of the Javascript [window.open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) function.
      
- #### SDK.ActivityContext.prototype.startActivityForResult(intent, callback)
Start an activity with the expectation of getting a result

  #### Parameters

  - **intent**
  The intent used to define the activity to be started.

  - **callback**
  A callback that will be called when the started activity finishes.  Callback signature is function(resultCode, data) {}.

- #### SDK.ActivityContext.prototype.lookupActivity(intent)
Lookup an activity

  #### Parameters

    - **intent**
The intent used to define the activity to be looked up.

  #### Returns
  *true* if an activity matching the intent is found, *false* otherwise.

- #### SDK.ActivityContext.prototype.loadComponent(componentNames, callback)
Load a set of shared components

  #### Parameters

    - **componentNames**
Either a String or an Array of Strings.  Each string is the name of a shared component that should be loaded.
    - **callback**
A function to be called when all of the specified components have been successfully loaded.  The function has the following signature:

   ```javascript
    function (c1, c2, c3, ...) {
    }
    ```
where c1, c2, ..., cn are the component instances that were successfully loaded.
