#  Analytics Plugins

Slipstream provides infrastructure components for capturing web analytics data.  This data can be used for personalization of the user interface as well as determining how users use the interface (workflow patterns, features used, etc.).

Slipstream implements a process for analyzing this captured data and feeding it back to the UI framework in order to enable personalization of the UI.  This process is extensible via *analytics plugins*.

### Plugin File Layout
A plugin has an on-disk layout of the following form:

```
/plugin_name
  manifest.json
  /js
```

The *manifest.json* file provides metadata about the plugin.  The /js directory contains the Javascript files in nodeJS module format that implement the features of an analyzer.

### Plugin Manifest
Each plugin contains a manifest file in JSON format called *manifest.json*.  This file must exist in the root directory of the plugin's directory structure.  This file provides metadata describing the plugin as well as a declaration of the plugin's *features*.

```javascript
{
	"name": "URL Analytics",
	"description": "A plugin that produces analytics related to page URLs",
	"version": "1.0",
	"min_platform_version": "0.0.1",
	"category": "url",
	"features": [
	    {
	    	"name": "referred",
	    	"api": "topn",
	    	"method": "topURLs"
	    }
	],
	"module": "urlAnalyzer"
}
```

The attributes of the manifest are defined as follows:

**name**
A string containing the name of the plugin. 
       
**description**
A string containing a description of the plugin's purpose.
        
**publisher**
A string containing information about the plugin's publisher.
eg. "Juniper Networks, Inc."
        
**version**
The version number of the plugin in MM.mm.rr format where

**minplatformversion** 
The minimum framework version on which this plugin is defined to run, in MM.mm.rr format, where

MM = major version

mm = minor version

rr = revision

**category** 
Indicates the type of analytics data that the plugin provides.  For example, the category "url" might indicate that the plugin provides data about the URLs accessed by web application users.

**features**
An array of objects, each describing an exposed feature of the plugin.  A feature exposes a type of data in the given *category*.  Each feature object has the following attributes:

- **name** The name of the feature
- **api** The name of the interface through which the feature is exposed.
- **method** The name of the Javascript method in the provided *module* used to implement the feature.

The analytics framework will make a feature's data available via a RESTful interface at a URL of the form

*category/name/api*

For example, the data for the feature defined in the manifest file above would be available via a GET request to URL

*/url/referred/topn*

**module** The name of the nodeJS module that contains the implementation of the plugin's features.  

This module must export a constructor that can be used to initialize the plugin.  The class defined by the constructor must expose a public method called *process* that will be called intermittently by the analytics infrastructure in order to allow the plugin to update its analytics data.  In addition, the class must expose public methods with the names defined in each of its feature definitions.

```javascript
module.exports = function(options) {
    this.topURLs = function(userId, params, callback) {
        ...
    }
   
    this.process = function() {
        ...
    }
}
```
The constructor will be passed an *options* object that contains the following attributes:

**store** A reference to the datastore that the analytics module can use to store its analytics data.

A public method that implements a plugin feature will be passed the following parameters:

**userId** The name of the authorized user under which the request for data is being made.

**params** Any plugin-defined parameters passed during the request.

**callback** A callback function that is to be called when the method has data to return or an error to report.


### Plugin Lifecycle
During initialization of Slipstream's analytics process, the constructor defined by the plugin's main module will be called and RESTful routes for each plugin feature will be defined and exposed by the analytics processor's web server.  The process will then intermittently invoke the *process*  method defined in the plugin's analytics module.  This method can then perform whatever processing is necessary to update the current state of its analytics data, possibly storing it in the datastore provided to it.    As needed, the Web UI framework will fetch the analytics data created by the plugin via the routes defined for its features and use that to personalize the UI.