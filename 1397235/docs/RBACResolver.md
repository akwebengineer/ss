#  Slipstream.SDK.RBACResolver

Defines the interface between an RBAC client and an [RBAC provider](RBACProvider.md).

The *Slipstream.SDK.RBACResolver* function is the constructor for RBACResolver objects.

## Syntax

```javascript
    new Slipstream.SDK.RBACResolver()
```

## RBACResolver Instances
All RBACResolver instances inherit from RBACResolver.prototype.

### Properties

### Methods

- #### SDK.RBACResolver.prototype.verifyAccess
Verify that the currently authenticated user has a set of capabilities.

    #### Returns
    *true* if the currently authenticated user has all of the capabilities specified in the *capabilities* parameter, *false* otherwise.
    
    #### Parameters

    - **capabilities** - An array of capabilities to be verified.  
    ***String*** The array contains strings that represent the names of capabilities as defined by the underlying network management platform.
    ***Array*** The array of multiple sets of capability names with a logical 'or' operator between each set

  
## Example
  
```javascript

   var resolver = new Slipstream.SDK.RBACResolver();

   //An array of capability names
   var capabilities = ["VPN.read", "VPN.write"];
   var can_read_and_write_VPN = resolver.verifyAccess(capabilities);

   //An array of multiple sets of capability names
   var cross_platform_capabilities = [['space_cap1', 'space_cap2'], ['csp_cap1', 'csp_cap2']];
   var can_access_cross_platforms = resolver.verifyAccess(cross_platform_capabilities);
   
```
