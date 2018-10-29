#  Writing Navigation Schemas

A Slipstream navigation schema defines the possible navigational paths in the UI navigation hierarchy.  The schema is a JSON object and returned from a requireJS module called *schema.js* in the framework's *public/assets/js/conf/navigation* directory.   A set of corresponding message bundles is placed in *public/assets/js/conf/navigation/nls* and is used to localize the navigation elements.  For example,

```javascript
define(function () {
    return [
        {
            "name": "nav.monitors",
            "icon": "icon_monitors",
            "children": [
                {
                    "name": "nav.log_and_events",
                    "children": [
                        {
                            "name": "nav.someElement"
                        },
                    ]
                }
    
            ]
        }
    ]
});
```
The values of the *name* attributes refer to keys in the supplied message bundles.  For example, a US English message bundle for this schema would be placed in the *nls/en_us/messages.properties* file and would contain the following properties:

```
nav.monitors = Monitors
nav.log_and_events = Logs and Events
nav.someElement = Some Element
```
### Schema Imports
Schema files can import other schema files in order to partition the schema definition into more manageable units.  Imports are specified by returning a non-array object from the schema.js module and using the *imports* attribute in this object.  Schema elements are then specified in the *elements* attribute of the schema object:

```javascript
define(function () {
    return {
        imports: [
            "import1",
            "import2"
        ],
        elements: [
            {
                "default": true,
                "name": "nav.dashboard",
                "icon": "icon_dashboard"
            }
        ]
    }
});
```
The paths to the schema import files are relative to the */public/assets/js/conf/* directory.

Note:  Imports cannot be nested - the *imports* attribute is only valid in the base schema file.

Schema imports are always additive i.e. they never remove or replace an element in the base schema.  Imports are only used to add new elements to the base schema and are imported in the order specified in the *imports* attribute.   For example, 

**base schema**

```javascript
define(function () {
    return {
        imports: [
            "import1",
            "import2"
        ],
        elements: [
             {
                "name": "nav.logs",
                "children": [
                    {
                        "name" : "nav.events"
                    }
                ]
             }
        ]
    }
});
```
**import1**

```javascript
define(function () {
    return {
        elements: [
             {
                "name": "nav.logs",
                "children": [
                    {
                        "name" : "nav.jobs"
                    }
                ]
             }
        ]
    }
});
```

**import2**

```javascript
define(function () {
    return {
        elements: [
             {
                "name": "nav.logs",
                "children": [
                    {
                        "name" : "nav.security"
                    }
                ]
             }
        ]
    }
});
```
results in this schema

```javascript
 {
      "name": "nav.logs",
      "children": [
           {
                "name" : "nav.events"
           },
           {
                "name" : "nav.jobs"
           },
           {
                "name" : "nav.security"
           }
      ]
 }
```