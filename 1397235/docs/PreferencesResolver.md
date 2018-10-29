#  Slipstream.SDK.PreferencesResolver

Defines the interface between an Preferences client and a [Preferences provider](PreferencesProvider.md).

The *Slipstream.SDK.PreferencesResolver* function is the constructor for PreferencesResolver objects.

## Syntax

```javascript
    new Slipstream.SDK.PreferencesResolver()
```

## PreferencesResolver Instances
All PreferencesResolver instances inherit from PreferencesResolver.prototype.

### Properties

### Methods

- #### SDK.PreferencesResolver.prototype.save
Save a set of preferences.

    #### Returns
    Response from the save operation.
    
    #### Parameters
        
    - **prefs**
          
       An object representing the set of preferences to be saved.          

    - **options**
      
      An object containing a set of save options.  Valid options are:

        **storage** - 'user' | 'session'.  The default is 'user'.

        **success** - A function to be called if the preferences are saved successfully.
        
        **error** - A function to be called if the preferences fail to save correctly.  The function gets passed a string describing the error condition.

- #### SDK.PreferencesResolver.prototype.fetch
Fetch the set of preferences.

    #### Returns
    Response from the fetch operation.

    #### Parameters
    
    - **options**
      
      An object containing a set of fetch options.  Valid options are:

        **storage** - 'user' | 'session'.  The default is 'user'.

        **success** - A function to be called if the preferences are fetched successfully.
        
        **error** - A function to be called if the preferences fail to fetch correctly.  The function gets passed a string describing the error condition.

- #### SDK.PreferencesResolver.prototype.delete
Deletes preferences.

    #### Returns
    Response from the delete operation.

    #### Parameters
    
    - **options**
      
      An object containing a set of delete options.  Valid options are:

        **storage** - 'user' | 'session'.  The default is 'user'.

        **success** - A function to be called if the preferences are deleted successfully.
        
        **error** - A function to be called if the preferences fail to delete correctly.  The function gets passed a string describing the error condition.

## Example
  
```javascript

var preferences_resolver = new Slipstream.SDK.PreferencesResolver();

//Fetch Preferences
preferences_resolver.fetch({
    storage: "user",
    success: function(prefs) {
        deferred.resolve(prefs);
    },
    error: function(errMsg) {
        deferred.reject(errMsg);
    }
})

//Save Preferences
preferences_resolver.save(preferences, {
    storage: "user",
    error: function(errMsg) {
        console.log(errMsg);
    },
    complete: function() {                   
        savePreferences(preferencesCache);          
    }
});
   
```
