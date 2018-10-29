# Accordion Widget


## Introduction
The Accordion widget is a reusable graphical user interface that allows users to render sections composed by Slipstream views or strings. A section is composed by title, description (optional) and content.


## API
The Accordion widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any configuration required by the widget is passed by its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container:  <(required) DOM object that defines where the widget will be rendered>
    sections: <(required) Array of objects that defines the sections that will be rendered and that are part of an accordion. It should be an array with objects with the following parameters:>
     - title: (required) title of the section and represented by a Slipstream view object data type or a string.
     - description: (optional) description of the section and represented by a Slipstream view object data type or a string. It is available only when the section is collapsed.
     - content: (required) content of the section and represented by a Slipstream view, a string or an array. It is available only when the section is expanded.
     - state: (optional) defines the state icon to be showed on the right side of the title of the accordion. It has the icon and the tooltip properties. The icon defines the class that has the icon svg. The tooltip defines the content of the tooltip that will be showed when the icon is hovered. It overwrites the state parameter defined for all the sections in the accordion.
     - id: (optional) id of the section and represented by a string primitive data type. The id should be unique in the accordion configuration. It should be added if the content is a view and the state of the tooltip icon needs to be updated programmatically (updateState method).
     state: <(optional) defines the state icon to be showed on the right side of the title of the accordion. It has the icon and the tooltip properties. The icon defines the class that has the icon svg. The tooltip defines the content of the tooltip that will be showed when the icon is hovered. It applies to all the sections of the accordion>.
     collapsible: <(optional) defines if the current expanded section should be automatically collapsed when a new section is expanded (true, default value) or it should be kept opened (false)>.
}
```

For example, a accordion widget could be instantiated with the following configuration:

```
    var accordionWidget = new AccordionWidget({
         "container": this.$accordionContainer[0],
         "sections": sectionsArray,
         "state": {
                      icon: "unconfigured",
                      tooltip: "Update configuration of this section"
                  }
    });
```

where the sectionsArray variable for the sections parameter is an array of objects. For example:

```
var sectionsArray =  [{
        id: "userIdentity",
        title: "User Identity Details",
        description: "Hostname, username and password are available in this section",
        content: new AccordionItemView.view1()
    },{
        id: "dropdownCheckbox",
        title: "Dropdown and Checkbox",
        description: "Dropdown, checkboxes and radio buttons are available in this section",
        content: new AccordionItemView.view2(),
        state: {
            tooltip: "Update configuration of the date and time section"
        }
}];
```

### container
The container parameter represents the DOM element that will contain the accordion widget.

### sections
The sections parameter represents the sections that are part of a accordion. It should be an array with objects with the following parameters:
- title: <required> title of the section and represented by a Slipstream view object data type  [Slipstream view](docs/Views.md) or a string. The title of a nested accordion section can be optional when it is not the first level of the accordion and its content is either a Slipstream view or a string. In this case, the content of the section will be rendered but not section title (and carat) will be available; therefore, the section can not be collapsed unless its parent is collapsed.
- description: <optional> content of the section and represented by a Slipstream view object data type  [Slipstream view](docs/Views.md) or a string. It is available only when the section is collapsed.
- content: <required> content of the section and represented by a Slipstream view [Slipstream view](docs/Views.md), a string or an array. A content defined as array allows to have nested sections, and each object of the array has the elements described in this section. It is available only when the section is expanded.
In the case of a Slipstream view, the view is expected to implement updateState and updateDescription methods. The methods will be invoked by the accordion widget to automatically update the content of the title state icon and the description of the section any time the user expands or collapse a section. If the methods are not available, the title status and description will stay unchanged.
- state <optional>: defines the state icon to be showed on the right side of the title of the accordion. It has the icon and the tooltip properties. The icon defines the class that has the reference to an icon. The tooltip defines the content of the tooltip that will be showed when the icon is hovered. It overwrites the state parameter defined for all the sections in the accordion.
- id: id of the section and represented by a string data type. The id should be unique in the accordion configuration. It should be added if the content is a view and the state of the tooltip icon needs to be updated programmatically (updateState method).

For example, an accordion with a simple level can be defined as follow:

```
var sectionsArray =  [{
        id: "userIdentity",
        title: "User Identity Details",
        description: "Hostname, username and password are available in this section",
        content: new AccordionItemView.view1()
    },{
        id: "dropdownCheckbox",
        title: "Dropdown and Checkbox",
        description: "Dropdown, checkboxes and radio buttons are available in this section",
        content: new AccordionItemView.view2(),
        state: {
            tooltip: "Update configuration of the date and time section"
        }
}];
```

An accordion with multiple level (or a nested accordion) can be defined as follow:

```
var sectionsArray =  [{
        id: "section4_n",
        title: this.getAccordionTitle("cluster", "Level 1: SRX 250 Cluster at 3 levels (UX recommended)"),
        description: "Multiple type of inputs are available in this section",
        content: [
            {
                id: "section4_1",
                content: this.views.dropdownCheckbox.view,
                state: false
            },
            {
                id: "section4_2",
                title: "Level 2: WAN Configuration",
                content: [
                    {
                        id: "section4_2_1",
                        title: "Level 3: Link WAN_0",
                        // content: this.views.userIdentity.view
                        content: [
                            {
                                id: "section4_2_1_1",
                                content: this.views.userIdentity.view
                            },
                            {
                                id: "section4_2_1_2",
                                title: "Level 3: Overlay Tunnel 1",
                                content: this.views.simpleInput.view
                            }
                        ]
                    }
                ],
            },
            {
                id: "section4_3",
                title: "Level 2: LAN Configuration",
                description: "Multiple type of inputs are available in this section",
                content: this.views.multipleInputs.view
            },
        ]
    },{
        id: "dropdownCheckbox",
        title: "Dropdown and Checkbox",
        description: "Dropdown, checkboxes and radio buttons are available in this section",
        content: new AccordionItemView.view2(),
        state: {
            tooltip: "Update configuration of the date and time section"
        }
}];
```

### state
It defines the state icon to be showed on the right side of the title of the accordion. It has the icon and the tooltip properties. The icon defines the class that has the icon svg. The tooltip defines the content of the tooltip that will be showed when the icon is hovered. It applies to all the sections of the accordion. If it is set to false, then section state will not be shown.

For example:

```
    var accordionWidget = new AccordionWidget({
         ...
         "state": {
                      icon: "unconfigured",
                      tooltip: "Update configuration of this section"
                  }
    });
```

### onStateContentUpdate
In nested sections, the state of a section can be hidden when its parent section is collapsed, depending on how many nested sections an accordion widget has, hidden input data issues could represent a problem. onStateContentUpdate allows the user of the widget to expose the state of nested sections up to its parent or higher. In this case, the state of a section needs to be bubble up to its parent sections, then the  onStateContentUpdate callback needs to be implemented for each of the sections that needs to show its children section.
onStateContentUpdate is invoked by the accordion widget when a section is collapsed and passes the sectionContent object. sectionContent has all the sections ids as a key and the content of each of its children section. If a parent section has a Slipstream view as one of his section, then the sectionId/view (key/value) will be included in the object, if one of the section has nested section, then the sectionId/sectionChildrenObj will be passed. sectionChildrenObj will be an Object with sectionId/view or another nested section with sectionId/sectionChildrenObj. onStateContentUpdate is expected to return the final state of a parent section. For example, the implementation of a generic onStateContentUpdate callback could be:

```
var onStateContentUpdateCallback = function (sectionContent) {
    var partialState,
        getState = function (sectionConfig) {
            var section, sectionId, sectionState, state;
            if (partialState) { //if previous recursion has identified a state and break, then the function can return the last value found
                return partialState;
            }
            for (sectionId in sectionConfig) {
                section = sectionConfig[sectionId];
                if (section.content && _.isFunction(section.content.updateState)) {
                    if (section.isContentRendered) {
                        sectionState = section.content.updateState();
                        if (sectionState.state == "error") {
                            partialState = {
                                icon: "critical_alert",
                                tooltip: "Some errors were found"
                            };
                            break;
                        }
                    } else {
                        partialState = {
                            icon: "partially_configured",
                            tooltip: "Section partially configured"
                        };
                        break;
                    }
                } else {
                    getState(section);
                }
            }
            return partialState;
        };
    var sectionState = getState(sectionContent);
    return sectionState || {
        icon: "configured",
        tooltip: "Section configured"
    };
    }
```

where the accordion configuration could be:

```
 var accordionWidget = new AccordionWidget({
         ...
         "onStateContentUpdate": onStateContentUpdateCallback
         ...
    });
```

### collapsible

Optional property that defines if the current expanded section should be automatically collapsed when a new section is expanded (true, default value) or it should be kept opened (false). For example, if the accordion sections should be stay opened when they are visited, then the accordion configuration should be:

```
 var accordionWidget = new AccordionWidget({
         ...
         "collapsible": false
         ...
    });
```


## Methods

###build
Adds the dom elements and events of the Accordion widget in the specified container. For example:

```
    accordionWidget.build();
```

### destroy
Clean up the specified container from the resources created by the Accordion widget.

```
    accordionWidget.destroy();
```

### updateState
Updates the icon state for a section in the accordion widget. It requires the following parameters:
- sectionId: id of the section to be updated
- updatedIconState: Object with icon and tooltip properties. It follows the format of the state property explained in the configuration section

For example:

```
    accordionWidget.updateState("userIdentity",{
        icon: "partially_configured",
        tooltip: "5 partially configured"
    });
```

### expandAll
Expands all sections in the accordion widget only when the accordion configuration is set to collapsible: false. For example:

```
    accordionWidget.expandAll();
```

### collapseAll
Collapses all sections in the accordion widget only when the accordion configuration is set to collapsible: false. For example:

```
    accordionWidget.collapseAll();
```


## Usage
To include an accordion widget, define the container, and the sections (title and content). For example:

```
    new AccordionWidget({
        "container": this.$accordionContainer,
        "state": {
            icon: "unconfigured",
            tooltip: "Update configuration of this section"
        },
        "sections": [{
            id: "userIdentity",
            title: "User Identity Details",
            description: "Hostname, username and password are available in this section",
            content: new UserIdentityView()
        },{
            id: "dropdownCheckbox",
            title: "Dropdown and Checkbox",
            description: "Dropdown, checkboxes and radio buttons are available in this section",
            content: new ControlsView(),
            state: {
                tooltip: "Update configuration of the date and time section"
            }
        },{
            id: "otherInputs",
            title: "Other inputs",
            description: "Multiple type of inputs are available in this section",
            content: new InputsView()
        }]
    }).build();
```