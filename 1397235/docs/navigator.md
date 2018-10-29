#  Slipstream.SDK.Navigator

Navigator provides methods that let plugins add nodes and leaf nodes to breadcrumb on the fly. 

## Syntax

```javascript
    new Slipstream.SDK.Navigator()
```

### Parameters

Navigator is a no argument constructor.

## Description

When an activity needs to update the app navigation on the fly with information that are not pre-configured, but are known only at the time of resolving the activity, Navigation provides utility methods that allow plugins to update on demand.

## Navigator Instances
All Navigator instances inherit from Navigator.prototype.

### Methods

- #### update(navObj)

   Allows plugins to update breadcrumb with dynamically provided leaf node data.
   navObj must contain the intent and internationalized data for the leafNode that needs to be added to the breadcrumb

   Example:
   ```javascript
   
   render: function() {    
        this.$el.append(< some template rendered >);

        var navObj = {
            intent: this.options.getIntent(),
            leafNode: 'Internationalized_Dynamically_Added_LeafNode'
        }

        var navigator = new Slipstream.SDK.Navigator();
        
        navigator.update(navObj);
   
        return this;
    }
```
