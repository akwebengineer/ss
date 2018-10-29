# Default User Preferences
Slipstream ships with certain default preferences that affect how the application behaves.

## Navigation Preferences
This defines the preferences related to navigation which defines what page loads after user login. It is stored under preferences.nav and follows the following format -

```javascript
    nav:{
        autoRoute: "<routeString>" || "last",
        last: "<Last Accessed Route>"        
    }

```    

###nav.autoRoute
Defines what route needs to be loaded as the landing page when user logs in. Absence of this config option or null value or empty string will use the application's default route. Other options are "< routeString >" and "last".

**routeString** option enables app to allow users to save the plugin URL of their choice as the landing page after login. This should be a string containing the route fragment. 
For example: "/fw-policy-management/firewall-policies"

**last** options tells Slipstream navigation to use the URL in nav.last as the landing page.

###nav.last
Users' last visited page is automatically saved to nav.last

### Examples

```javascript

// save a custom URL to the nav preference and set it as default autoRoute
Slipstream.SDK.Preferences.save('nav:autoRoute', "/fw-policy-management/firewall-policies");

// save the nav preference to use last accessed page
Slipstream.SDK.Preferences.save('nav:autoRoute', "last");

// save the nav preference to use the default page for the app
Slipstream.SDK.Preferences.save('nav:autoRoute', "");
  

```