# ActionBar Widget


## Introduction
The actionBar widget is a reusable graphical user interface that renders a action bar with icons, buttons, menus that can be used to trigger an action in the content page or overlay.


## API
The actionBar widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any configuration required by the widget is passed to its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container:  <(required) DOM object, defines where the widget will be rendered>
    subTitle:  <(optional) Object or string, defines the subtitle of the action bar>
    actions:  <(required) Array of Objects, defines the actions to be rendered>
    events: <(optional) Object, defines handlers that will be invoked when the click event on an action is triggered
    rbac: <(optional) Object, defines the access permission of the actions defined in the actionBar widget
    layout: <(optional) String, defines type of layout that will be used to render the actionBar
}    
```

For example, a actionBar widget could be instantiated with the following configuration:

```
  var actionBarWidget = new ActionBarWidget({
    "container": actionBarContainer,
    "actions": [{
            "button_type": true,
            "label": "Download JIMS",
            "key": "downloadJims",
            "secondary": true
        },
        {
            "separator_type": true
        },
        {
            "icon_type": true,
            "label": "Expand",
            "icon": {
                "default": "icon_expand_all",
                "hover": "icon_expand_all_hover",
                "disabled": "icon_expand_all_disable"
            },
            "key": "expand_all"
        },
        {
            "separator_type": true
        },
        {
            "menu_type": true,
            "icon": {
                "default": "icon_row_menu_wrapper",
                "hover": "icon_row_menu_hover_wrapper",
                "disabled": "icon_row_menu_hover"
            },
            "key": "rowMore",
            "items": [
                {
                    "label": "Edit",
                    "key": "rowMoreEdit",
                    "capabilities": ['create']
                },
                {
                    "label": "Duplicate",
                    "key": "rowMoreDuplicate",
                    "capabilities": ['create']
                },
                {
                    "separator": true
                },
                {
                    "label": "Add Above",
                    "key": "rowMoreAddAbove",
                    "capabilities": ['update']
                },
                {
                    "label": "Add Below",
                    "key": "rowMoreAddBelow",
                    // "disabledStatus": true //default status is false
                }
            ]
        }],
    "events": {
        "downloadJims": {
          "handler": downloadCallback
        }
    }
  });
  actionBarWidget.build();
```


### container
It represents the DOM element that will contain the actionBar widget. 


### subTitle
It defines the subtitle of the action bar. Its data type is a string or an Object. If it is a string, the subtitle value is provided with this html string; in the case of an Object, in addition to the subtitle, a help icon can be included. The subtitle object has the properties: content, help. content is an html that represents the subtitle. help is an Object that defines the help icon and has the properties: content (html string for the content of the tooltip), ua-help-text (text for the help link) and ua-help-identifier (identifier that associates the link to an external help).
For example, the actionBar configuration can be defined as:

```
    new ActionBarWidget({
        "container": actionBarContainer,
        "subTitle": {
            "content": "Subtitle for an Action Bar with a long long long long long long long long long long long long long long long long description",
            "help": {
                "content": "Tooltip for the subtitle of the Action Bar widget",
                "ua-help-text": "More..",
                "ua-help-identifier": "alias_for_ua_event_binding"
            }
        },
        "actions": actionBarActions,
        ...
    }).build();
```


### actions
It defines the buttons, icons and menu to be showed in the action bar. It is defined as an array of objects. Each object represents a button, an icon, a menu or a separator of actions. It has the following parameters:


#### button
- button_type: boolean, if it is set to true, then the action will be added as a button. 
- label: string, the text that will be shown as the value of the button
- key: string, the key that will be used when the button is added as is used as a reference when an event to the click of a button is triggered
- disabledStatus: boolean, defines the state of the button: disabled (disabledStatus: true) will disable the button so any click events will be ignored. enabled (disabledStatus: false) allows click on the button and it is the default state.
- secondary: boolean, when it is set to true, it states that the button should show as a secondary button. false will show the button as a primary button.
- capabilities: array, defines the access permission key that needs to be enabled so that the action is available.

For example, the actionBar configuration can be defined as:

```
var actionBarConfiguration = {
    "container": actionBarContainer,
    "actions": [{
            "button_type": true,
            "label": "Publish",
            "key": "publishGrid",
            "disabledStatus": true
        },
        {
            "button_type": true,
            "label": "Download JIMS",
            "key": "downloadJims",
            "capabilities": ["update"]
            "secondary": true
        },
        ...
  ]
  ...
  };
```


#### icon
- icon_type: boolean, if it is set to true, then the action will be added as an icon. 
- label: string, the text that will be shown as a tooltip when an icon is hovered.
- key: string, the key that will be used when the icon is added as is used as a reference when an event to the click of an icon is triggered.
- disabledStatus: boolean, defines the state of the icon: disabled (disabledStatus: true) will disable the icon so any click events will be ignored. enabled (disabledStatus: false) allows click on the icon and it is the default state.
- icon: Object/string, represents the icon that will be shown when the icon_type is enabled. It has the properties: default, hover and disabled. They represent the icon path and CSS class that contains the icon asset and properties.
*default*
It can be an Object or a string. If "default" is an Object (recommended option), then icon_url, icon_class and icon_color properties are available. "icon_url", required, is the path to the asset; the icon should be a SVG and not have a fill color so it is *themable*. icon_class, required, is the class that will be applied to the SVG and should include the dimensions of the SVG. icon_color, optional, represents the CSS class with the fill color of the icon.If it is absent, then the default Slipstream icon color will be used ($action-icon-color). If "default" is a String, then the class should include the icon that will be shown and it will be applied as a background of the icon container. This type of icon can not be themable.
*hover*
It is a string with the class name that will be used when an icon is hovered. If default.icon_url was used, then it should define the fill color of the icon on hover, if the "hover" property is absent, then the default Slipstream hover color will be applied ($action-icon-hover). If default was a string, then hover should include the background icon that should be shown on hover.
*disabled*
It is a string with the class name that will be used when an icon is disabled. If default.icon_url was used, then it should define the fill color of the icon on disable, if the "disabled" property is absent, then the default Slipstream disabled color will be applied ($action-icon-disabled). If default was a string, then disabled should include the background icon that should be shown if the icon is disabled.
- capabilities: array, defines the access permission key that needs to be enabled so that the action is available.

For example, the actionBar configuration can be defined as:

```
var actionBarConfiguration = {
    "container": actionBarContainer,
    "actions": [{
            "icon_type": true,
            "label": "Expand",
            "icon": {
                "default": "icon_expand_all",
                "hover": "icon_expand_all_hover",
                "disabled": "icon_expand_all_disable"
            },
            "key": "expandAll",
            "capabilities": ['view']
        },
        ...
  ]
  ...
  };
```


#### menu
- menu_type: boolean, if it is set to true, then the action will be added as a menu. 
- label: string. A menu can be shown as a button or an icon. A menu will be a button if the icon property is absent. The value of the button will be the label property. If an icon was assigned to the menu, then the label will be shown as a tooltip when the menu icon is hovered.
- key: string, the key that will be used when the menu is added as is used as a reference when the menu needs to be enabled or disabled or when access permission is checked.
- disabledStatus: boolean, defines the state of the menu: disabled (disabledStatus: true) will disable the menu so any click events will be ignored. enabled (disabledStatus: false) allows click on the icon and it is the default state.
- hover: boolean, defines whether the context menu should open on hover or not. When this property is set to true, the menu shows up on hover and hides when mouse is moved out of the menu. Default value is false. *label* should not be defined in the configuration when this property is defined as tooltip doesn't show when *hover* is defined. This is a product limitation.
- icon: Object/string, represents the icon that will be shown when the menu_type is enabled. It has the properties: default, hover and disabled. They represent the icon path and CSS class that contains the icon asset and properties.
*default*
It can be an Object or a string. If "default" is an Object (recommended option), then icon_url, icon_class and icon_color properties are available. "icon_url", required, is the path to the asset; the icon should be a SVG and not have a fill color so it is *themable*. icon_class, required, is the class that will be applied to the SVG and should include the SVG dimensions. icon_color, optional, represents the CSS class with the fill color of the icon.If it is absent, then the default Slipstream icon color will be used ($action-icon-color). If "default" is a String, then the class should include the icon that will be shown and it will be applied as a background of the icon container. This type of icon can not be themable.
*hover*
It is a string with the class name that will be used when an icon is hovered. If default.icon_url was used, then it should define the fill color of the icon on hover, if the "hover" property is absent, then the default Slipstream hover color will be applied ($action-icon-hover). If default was a string, then hover should include the background icon that should be shown on hover.
*disabled*
It is a string with the class name that will be used when an icon is disabled. If default.icon_url was used, then it should define the fill color of the icon on disable, if the "disabled" property is absent, then the default Slipstream disabled color will be applied ($action-icon-disabled). If default was a string, then disabled should include the background icon that should be shown if the icon is disabled.
- items: Array of Objects, where each Object represents the item that will be shown in the menu. Each Object could be a menu item or a separator of items. For a menu item, the available properties are:label, key, disabledStatus and capabilities. For a separator, the available property is separator_type.
- capabilities: array, defines the access permission key that needs to be enabled so that the action is available.

For example, the actionBar configuration can be defined as:

```
var actionBarConfiguration = {
		"container": actionBarContainer,
		"actions": [{
				"menu_type": true,
				"icon": {
				    "default": "icon_filter_menu",
				    "hover": "icon_filter_menu_hover",
				    "disabled": "icon_edit_disable"
				},
				"key": "barMore",
				"items": [
				    {
				        "label": "Edit",
				        "key": "barMoreEdit"
				    },
				    {
				        "label": "Duplicate",
				        "key": "barMoreDuplicate",
				        "disabledStatus": true
				    },
				    {
				        "label": "Disable",
				        "key": "barMoreDisable",
				        "capabilities": ['disable']
				    },
				    {
				        "separator": true
				    },
				    {
				        "title": "Checkbox",
				        "className": "checkboxTitle1"
				    },
				    {
				        "key": "column1",
				        "label": "Column 1",
				        "type": "checkbox",
				        "selected": true,
				        "value": '1',
				        "events": checkboxChangeEvent
				    },
				    {
				        "key": "column2",
				        "label": "Column 2",
				        "type": "checkbox",
				        "selected": true,
				        "events": checkboxChangeEvent
				    },
				    {
				        "separator": true
				    },
				    {
				        "title": "Radio Button"
				    },
				    {
				        "key": "radio1",
				        "label": "Radio 1",
				        "type": "radio",
				        "groupId": 'radio',
				        "value": '1'
				    },
				    {
				        "key": "radio2",
				        "label": "Radio 2",
				        "type": "radio",
				        "groupId": 'radio',
				        "value": '2'
				    },
				    {
				        "key": "radio2",
				        "label": "Radio 2",
				        "type": "radio",
				        "groupId": 'radio',
				        "value": '2'
				    }],
				events: {
				    show: function (opt) {
				        console.log("Menu opened");
				    },
				    hide: function (opt) {
				        console.log("Menu closed");
				    }
				}
        	},
			{
				"menu_type": true,
				"label": "More Menu"
				"disabledStatus": true, 
				"items": [
				    {
				        "label": "Edit",
				        "key": "rowMoreEdit",
				        "capabilities": ['create']
				    },
				    {
				        "label": "Duplicate",
				        "key": "rowMoreDuplicate",
				        "capabilities": ['create']
				    },
				    {
				        "separator": true
				    },
				    {
				        "label": "Add Above",
				        "key": "rowMoreAddAbove",
				        "capabilities": ['update']
				    },
				    {
				        "label": "Add Below",
				        "key": "rowMoreAddBelow",
				        "disabledStatus": true 
				    }
				]
			},
        ...
  		]
  ...
  };
```

A menu action is built using the contextMenu widget; therefore, all options available in the configuration of its elements property can be included in action configuration. More details of the elements options can be found at [ActionBar widget](public/assets/js/widgets/actionBar/actionBar) and [ContextMenu widget](public/assets/js/widgets/contextMenu/contextMenu.md).


#### search
- search_type: boolean, if it is set to true, then the search feature will be added.
- key: string, the key that will be used when the search is added as is used as a reference when the search needs to be enabled or disabled.
- searchOnEnter: boolean. By default searchOnEnter is true, so the search event gets triggered after clicking "Enter". Otherwise, the event is triggered every time after entering a new character.

For example, the actionBar configuration can be defined as:

```
var actionBarConfiguration = {
    "container": actionBarContainer,
    "actions": [
                    ...
                    {
                        "search_type": true,
                        "key": "searchAction",
                        "searchOnEnter": false 
                    },
                    ...
                  ]
                ...
    };
```


#### separator
- separator_type: boolean, if it is set to true, then the action will be show a separation between actions. Parameters like label, key and other do not apply when the separator is enabled.

For example, the actionBar configuration can be defined as:

```
var actionBarConfiguration = {
    "container": actionBarContainer,
    "actions": [
					...
					{
					    "separator_type": true
					},
					...
				  ]
				...
	};      
```


### events
It contains the handlers that will be invoked when the click event on an action is triggered. It is represented by an Object with a key that represents the action key and the value of the key should be an Object with the handler property. handler is a required property and it is the callback that will be invoked when the action is clicked. The handler callback will be invoked with two parameters: the event object and the action Object which contains the id of the action key. The handler value should be represented as an array, so the same event can be binded to multiple callbacks.

For example, a actionBar widget could be instantiated with the following configuration:

```
  var actionBarConfiguration = {
    "container": actionBarContainer,
    "actions": [{
            "button_type": true,
            "label": "Download JIMS",
            "key": "downloadJims"
        },
       ...
    ],
    "events": {
        "downloadJims": {
          "handler": downloadCallback
        }
    }
  });
  actionBarWidget.build();
```


### rbac
Optional. It provides the access permission for the actions defined in the actionBar widget. It is defined as an Object with a key/value pair. The key represents any action defined in the actions property and value is a boolean where true enables the action and false disables it. If the key of an action is absent, then the action will be enabled by default. If the actionBuilder widget is used in the context of Slipstream framework, then the access permission is done by framework and this property is not required.

For example, a actionBar widget could be instantiated with the following configuration:

```
  var actionBarConfiguration = {
    "container": actionBarContainer,
    "actions": [{
            "button_type": true,
            "label": "Download JIMS",
            "key": "downloadJims",
            "capabilities": ['update']
        },
       ...
    ],
    "rbac": {
        "downloadJims": false //button access is restricted
    }
  });
  actionBarWidget.build();
```


### layout
Optional. It is represented as a string and defines type of layout that will be used to render the actionBar. It could be "grid" or "button". "grid" gives the action bar a grid style and "button" renders the actions next to each other without style updates. The default layout is button.
    
For example, a actionBar widget could be instantiated with the following configuration:

```
  var actionBarConfiguration = {
    "container": actionBarContainer,
    "actions": [
       ...
    ],
    "layout": "grid"//defaults to button layout
  });
  actionBarWidget.build();
```


## Methods


### build
Adds the dom elements and events of the actionBar widget in the specified container. For example:

```
    actionBarWidget.build();
```


### bindEvents
Binds a handler to an action id. The handler will be invoked when action is clicked. The input parameter is an object with a key that represents the action key and the value of the key should be an Object with the handler property. handler is a required property and it represents the callback that will be invoked when the action is clicked. The handler callback will be invoked with two parameters: the event object and the action Object which contains the id of the action key. The handler value should be represented as an array, so the same event can be binded to multiple callbacks. For example:

```
    var downloadCallback = function (event, actionObj) {
        //implementation
    };
    actionBarWidget.bindEvents({
        "downloadJims": {
            "handler": [downloadCallback]
        }
    });
```
The bindEvents method allows to register additional callbacks even if the event was already registered with the events property at the time that the actionBar was instantiated and built. Subsequent calls to bindEvents can add more callbacks to the same event.


### unbindEvents
Unbinds a handler to an action id. The handler will NOT be invoked when action is clicked. The input parameter is an object with a key that represents the action key and the value of the key should be an Object with the handler property. handler is a required property, it's an Array, and it represents the callback(s) that should be unregistered. For example:

```
    var downloadCallback = function (event, actionObj) {
        //implementation
    };
    actionBarWidget.unbindEvents({
        "downloadJims": {
            "handler": [downloadCallback]
        }
    });
```


### updateDisabledStatus
Updates the state of an action to enabled or disabled. It takes updatedEventsHash parameter. updatedEventsHash is an Object with a key/value pair. key represents the action key and the value is a boolean that indicates if the action should be disabled (true) or enabled (false). For example:

```
    actionBarWidget.this.buttonLayoutActionBar.updateDisabledStatus({
       "rowMoreAddBelow": false,
       "barMoreGroup": false,
       "subMenu": false,
       "publishGrid": false, //enables publishGrid action
       "collapseAll": true //disables collapseAll action
    });
```


### destroy
Clean up the specified container from the resources created by the actionBar widget.

```
    actionBarWidget.destroy();
```


## Usage
To include a actionBar widget, define the container, actions and events. For example:

```
    new ActionBarWidget({
        "container": this.$actionBarContainer,
        "actions": [{
                "button_type": true,
                "label": "Download JIMS",
                "key": "downloadJims",
                "secondary": true
            },
            {
                "separator_type": true
            },
            {
                "icon_type": true,
                "label": "Expand",
                "icon": {
                    "default": "icon_expand_all",
                    "hover": "icon_expand_all_hover",
                    "disabled": "icon_expand_all_disable"
                },
                "key": "expand_all"
            }],
        "events": {
            "downloadJims": {
              "handler": [downloadCallback]
            }
        }
    }).build();
```
Optionally, the events can be added as needed using the bindEvents method.