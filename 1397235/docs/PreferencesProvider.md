#  Slipstream.SDK.PreferencesProvider

Defines the interface between a Preferences provider and the Slipstream framework.  A PreferencesProvider is the interface between the Slipstream framework and a preference service that reads and writes against preferences data store.


The *Slipstream.SDK.PreferencesProvider* function is the constructor for PreferencesProvider objects.

## Syntax

```javascript
    new Slipstream.SDK.PreferencesProvider()
```

## Description

A Slipstream Preferences provider is implemented as a Javascript AMD module in [requireJS](http://requirejs.org/docs/api.html) format.  The module must return a no-argument Javascript constructor that extends from *Slipstream.SDK.PreferencesProvider*.  The framework will use this constructor to instantiate the provider.

```javascript
define(function() {
    function PreferencesProvider() {
       ...
    }
     
    // Inherit from the Slipstream PreferencesProvider class
    PreferencesProvider.prototype = Object.create(Slipstream.SDK.PreferencesProvider.prototype);
    
    // Return the constructor as the value of this module
    return PreferencesProvider;
});
```

### Provider Lifecycle

An PreferencesProvider has a well-defined lifecycle that takes it through a series of states including *create*,  *start*, and *destroy*.

        ┌─────────────────────┐
        │   Launch Provider   │
        └─────────────────────┘
                   ↓ 
        ┌─────────────────────┐
        │      onCreate()     │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │      onStart()      │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │  Provider active    │  
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │      init()         │  
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │     onDestroy()     │
        └─────────────────────┘
                   ↓
        ┌─────────────────────┐
        │ Provider Terminated │
        └─────────────────────┘

Each state of a Preferences provider has a corresponding lifecycle method in an PreferencesProvider object: *onCreate()*, *onStart()*, *onDestroy()*.

When a Preferences provider is first created, its *onCreate()* method is called.  By default this method is a no-op but providers can override it to perform any operations necessary prior to the provider being started. Once the *onCreate()* method returns, the provider's onStart() method is immediately invoked.

When a provider is no longer needed (eg. its associated plugin is removed from the system) it may be destroyed. Before a provider is destroyed its *onDestroy()* method is called. This allows the provider an opportunity to perform any cleanup operations prior to it being destroyed.
  
**Note**: The destroy state and it's corresponding *onDestroy()* method are not currently used by Slipstream but are reserved for future use.

## PreferencesProvider Instances
All PreferencesProvider instances inherit from PreferencesProvider.prototype.

### Properties

### Methods

The methods in the PreferencesProvider prototype is a no-op and should be overridden by objects implementing an PreferencesProvider.

- #### SDK.PreferencesProvider.prototype.save
Save a set of preferences.

    #### Parameters
    
    - **prefs**
          
       An object representing the set of preferences to be saved.          

    - **options**
      
      An object containing a set of save options.  Valid options are:

        **storage** - 'user' | 'session'.  The default is 'user'.

        **success** - A function to be called if the preferences are saved successfully.
        
        **error** - A function to be called if the preferences fail to save correctly.  The function gets passed a string describing the error condition.

- #### SDK.PreferencesProvider.prototype.fetch
Fetch the set of preferences.

    #### Parameters
    
    - **options**
      
      An object containing a set of fetch options.  Valid options are:

        **storage** - 'user' | 'session'.  The default is 'user'.

        **success** - A function to be called if the preferences are fetched successfully.
        
        **error** - A function to be called if the preferences fail to save correctly.  The function gets passed a string describing the error condition.

- #### SDK.PreferencesProvider.prototype.delete
Deletes preferences.

    #### Parameters
    
    - **options**
      
      An object containing a set of delete options.  Valid options are:

        **storage** - 'user' | 'session'.  The default is 'user'.

        **success** - A function to be called if the preferences are deleted successfully.
        
        **error** - A function to be called if the preferences fail to save correctly.  The function gets passed a string describing the error condition.

### Declaring a PreferencesProvider 

A plugin must declare the Preferences provider that it exposes via its plugin.json file.  Only a single Preferences provider can exist in an instance of the Slipstream framework.  If multiple provider definitions exist, then Slipstream will use the last definition found during plugin discovery.

A sample plugin.json with the relevant PreferencesProvider settings is shown below.

plugin.json:

```json
{
   ...
   
   providers: [
      {
          "uri": "preferences://",
          "module": "preferencesProvider"
      }
   ]
   
   ...
}
```
When a plugin is loaded and the configuration includes a Preferences provider, the module identified will be instantiated and the *onCreate()* and *onStart()* functions called.
  
## Example
  
```javascript
define(function() {
    function PreferencesProvider() {
        Slipstream.SDK.PreferencesProvider.call(this);
            ...
         }
    }

   PreferencesProvider.prototype = Object.create(Slipstream.SDK.PreferencesProvider.prototype);
   PreferencesProvider.prototype.constructor = PreferencesProvider;

   return PreferencesProvider;
});
```