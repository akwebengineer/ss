# Tree Topology Widget

-------------------------------------------------------------------------------------------------------------------------------------------------------
## Introduction
The Tree Topology widget is a reusable graphical user interface that allows users to render a visual topology in the selected container.

-------------------------------------------------------------------------------------------------------------------------------------------------------
## API
The Tree Topology widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.


-------------------------------------------------------------------------------------------------------------------------------------------------------


### Configuration
______________________________________________________________________________________________________________________________________________________
The configuration object that is passed to the widget has 10 properties as shown below -
```
conf: {    
    container: "< DOM element to which the topology needs to be appended >",
    data: "< JSON data >",    
    icons: "< object containing key & values that point to paths to all icons used in the topology implementation defined by each node / link's type attribute >",
    collapseChildrenThreshold: "< Number of children for nodes beyond which the children will be grouped and collapsed by default on initial render >",    
    viewerDimensions: "< object that contains the dimensions of topology in the form of height and width>",
    legend: "< content represented by a string or Slipstream view >",
    showArrowHead: "< boolean indicating whether arrow heads should be displayed on the connections or not >",
    allowChildrenCollapse: "< boolean indicating whether clicking a parent node will collapse / expand its children. Cannot be used in combination with collapseChildrenThreshold>",
    allowZoomAndPan: "< boolean indicating whether the topology instance allows user to pan and zoom >",
    maxLabelSize: "< truncate labels with an ellipsis if maxLabelSize is exceeded >",
    nodeSpacing: "< object that contains vertical and horizontal spacing between nodes in pixels>",
    tooltip: "< object that contains a callback function to set content for tooltip >",
    subNode: "< object that contains a callback function to assess if the subNode badge can be toggled >"
}
```

#### container

-> Required parameter

-> Accepted Types: Object

-> Accepted Value: DOM element

#### data
-> Required Parameter

-> Accepted Types: Object

-> Accepted Values: JSON in the specified format

-> The widget internally creates relevant data store on the provided data and exposes data management interfaces on the topology instance. For ex) topology.addNode(), topology.removeNode().

**JSON**

***type = tree***

JSON data should be provided in the following format
Example:
```
data: {
    "name": "File 1",
    "id": "Node100",
    "children": [
        {
            "name": "File 1-1",
            "id": "9da54794-9816-488f-9cb1-37c2b169bf70",
            "icon": "file_suspected",
            "type": "fs-topo-node",
            "children": [],
            "link": {
                "type": "fs-topo-link",
                "icon": "started_default"
            }
        },
        {
            "name": "File 1-2",
            "id": "ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1",
            "icon": "file_malicious",
            "type": "fs-topo-node",
            "children": [],
            "link": {
                "type": "fs-topo-link",
                "icon": "started_default"
            }
        }
    ],
    "icon": "file_default",
    "type": "fs-topo-node",
    "link": {
        "type": "fs-topo-link",
        "icon": ""
    }
}
```

**name**

-> Optional Value

-> Accepted Types: String

-> Accepted Values: Label  that needs to be displayed for a given node

**id**

-> Required Value

-> Accepted Types: String

-> Accepted Values: Unique ID that corresponds to each node.
    
**size**

-> Optional Value

-> Accepted Values: small, medium, large

-> Default Value: medium

small : Node is rendered as 15px X 15px icon
medium: Node is rendered as 30px X 30px icon
large : Node is rendered as 45px X 45px icon

**type**

-> Optional Value

-> Accepted Types: String

-> Accepted Values:
String that identifies the type of the node. This value MUST match a value in "icons" object of the configuration. This value is added as an attribute called "data-type". There are two basic uses to this -
1. Cross reference the value against config.icons and add the icon to node
2. Allows custom styling by using CSS Attibute selectors

**addOn**

-> Optional Value

-> Accepted Values: Object with name, size, type and position (top or bottom).
addOn is an attribute which when defined adds a helper element. This is typically used to provide an extension of a node. One such scenario is to extend a node with an addOn such that the addOn element can be used as a drop target for dragging and dropping a DOM element (which is not part of the Tree Topology).
NOTE: If a node has 'addOn' attribute defined, the node is not considered as a drop target. Its add-on element becomes the drop target. 

```
"addOn": {
            "name": "Site_addOn",
            "size": "large",
            "type": "attachment_point",
            "position": "top"
        }
```

- *name* - A string identifying the addOn element.

    -> Optional Value
    
    -> Accepted Types: String
    
    -> Accepted Values: Label that needs to be displayed for the addOn element.

- *size* - A string identifying the addOn elements size.

    -> Optional Value
    
    -> Accepted Values: small, medium, large
    
    -> Default Value: medium

    small : addOn element is rendered as 15px X 15px icon
    medium: addOn element is rendered as 30px X 30px icon
    large : addOn element is rendered as 45px X 45px icon
    
- *type* - A string identifying the addOn elements type.

    -> Optional Value
    
    -> Accepted Types: String
    
    -> Accepted Values:
        String that identifies the type of the addOn element. This value MUST match a value in "icons" object of the configuration. This value is added as an attribute called "data-type". There are two basic uses to this -
        1. Cross reference the value against config.icons and add the icon to node
        2. Allows custom styling by using CSS Attibute selectors

- *position* - A string identifying the addOn elements position.

    -> Optional Value
    
    -> Accepted Values: top, bottom
    
    -> Default Value: top

    top : addOn element is rendered on top of its related node.
    bottom: addOn element is rendered below its related node.

**children**

-> Required Value

-> Accepted Types: Array

-> Accpeted Values: An array of objects where each object corresponds to a node. An empty array can be passed when there are no children.

Example:
```
{
    ...,
    ...,
    children: [{
        name: "Node B",
        id: "QAWE456799",
        size: "small",        
        type: "app-node",
        children: [],
        link: {
            type: "link-down"      
        }
    },{
        name: "Node C",
        id: "QAWE4098668",
        size: "small",        
        type: "app-node",
        children: [],
        link: {
            type: "link-up"            
        }
    }],
    ...,
    ...,
    ...
}
```

**link**

-> Optional Value

-> Accepted Types: object

-> Accepted Values: Object that represents metadata of the link connecting the current node's parent to the current node.

**type**

-> Optional Value

-> Accepted Types: String

-> Accepted Values:
String that identifies the type of the connection from the current node's parent to the current node. This value is added as an attribute called "data-type". There are two basic uses to this -
1. If this value matches a value in "icons" object of the configuration, the icon is added at the center of the link.
2. Allows custom styling by using CSS Attibute selectors

Examples for custom styling a link:


1. type = fs-topo-link-warn  (link is orange dashed line):
```
.link[data-type=contacted_default] {
    stroke: #FFAD5A !important;
    stroke-linecap: square;
    stroke-dasharray: 1,5;
}
.link-arrow[data-type=contacted_default] {
    fill: orange !important;
    stroke-dasharray: 0,0;    
}
```

2. type = fs-topo-link-error (link is red solid line):
```
.link[data-type=dropped_default] {
    stroke: #FF5A5A !important;
    stroke-width: 1.5px !important;
}
.link-arrow[data-type=dropped_default] {
    fill: red !important;    
}
```

3. type = vpn_custom (customize subNode badge)
```
.node[data-type=vpn-custom] .badge-text { //number displayed inside the badge is in white
    fill: white !important;
}
.node[data-type=vpn-custom] .node-badge { //node badge is filled with red color
    fill: red !important;
}
.node[data-type=vpn-custom] .node-badge.selected { //different color when node badge is selected
    fill: #FF5A5A !important;
}
```

**subNodes**

-> Optional parameter

-> Accepted Types: array

-> Accepted Values: An array of objects where each object corresponds to a subNode.

A node can contain one or more subNodes. To indicate that a node has subNodes, a badge is displayed on the node with a number indicating how many subNodes are configured. When topology is rendered, subNodes are initially hidden. When the badge is clicked, the subNodes expand and are displayed below the node with the badge. The links of the subNodes are connected directly to the parent of the node with the badge. These subNodes can be hidden by clicking once again on the badge.

subNodes cannot be added to root nodes.
subNodes cannot have children.
When adding subNodes, it is recommended to use a lower value (eg. 50) for verticalGap under nopeSpacing. This will ensure subNodes are displayed closer together.

Example with 2 subNodes:
```
     "subNodes": [
                    {
                        "name": "Link A",
                        "id": "1121",
                        "size": "small",
                        "type": "file_malicious",
                        "link": {
                            "type": "sub_node_link"
                        }
                    },
                    {
                        "name": "Link B",
                        "id": "1122",
                        "size": "small",
                        "type": "file_malicious",
                        "link": {
                            "type": "sub_node_link"
                        }
                    }
                ]
```

Example with data configuration that includes 2 subNodes:
In this example, 'Link A' and 'Link B' are subNodes of 'US West'. When the badge on 'US West' node is clicked, links from 'Link A' and 'Link B' will be attached directly to the parent, 'Site 1'.
```
subNodesTopologyData = {
                    "name": "Site 1",
                    "id": "1",
                    "size": "medium",
                    "children": [
                        {
                            "name": "US West",
                            "id": "11",
                            "children": [],
                            "subNodes": [
                                {
                                    "name": "Link A",
                                    "id": "1121",
                                    "size": "small",
                                    "type": "file_malicious",
                                    "link": {
                                        "type": "sub_node_link"
                                    }
                                },
                                {
                                    "name": "Link B",
                                    "id": "1122",
                                    "size": "small",
                                    "type": "file_malicious",
                                    "link": {
                                        "type": "sub_node_link"
                                    }
                                }
                            ],
                            "type": "file_suspected",
                            "link": {
                                "type": "started_default"
                            }
                        }
              }
```

#### dataStore

-> Optional parameter

-> Accepted Types: TreeDataStore

-> Accepted Values: An instance of TreeDataStore. By retaining the instance of the dataStore, data management methods such as get, put, add, remove can be used. Any such operations on the dataStore updates the visualization.

-> If provided, the widget will not create new dataStore instances but will use the provided instance.

<DEPRECATED>

[dataStore usage](https://ssd-git.juniper.net/spog/slipstream/blob/master/public/assets/js/widgets/topology/treeDataStore.md)  

Example: 
```
    dataStoreInstance = new TreeDataStore(topologyConfiguration.fileTopologyData);

    var topologyConf = {
        dataStore: dataStoreInstance
        icons: topologyConfiguration.fileTopologyIcons
        .....
    }    
```

#### icons

-> Required parameter

-> Accepted Types: object

-> Accepted Values: Object that contains paths to icons with properties that correspond to icon property of nodes and links in the json data provided to the widget.

Example:
```
icons: {
    "file_malicious": "img/icon_file_malicious.svg",
    "file_suspected": "img/icon_file_suspected.svg",
    "file_default": "img/icon_file_default.svg",
    "internet_suspected": "img/icon_internet_suspected.svg",
    "dropped_default": "img/icon_dropped_default.svg",
    "started_default": "img/icon_started_default.svg",
    "contacted_default": "img/icon_contacted_default.svg"
}
```

#### collapseChildrenThreshold

-> Optional Parameter

-> Accepted Types: Number

-> Accepted Values: Number of children for nodes beyond which the children will be grouped and collapsed by default on initial render.
NOTE: collapseChildrenThreshold will be ignored when allowChildrenCollapse is set to false.

#### legend

-> Optional Parameter

-> Accepted Type: String | Object

-> Accepted Values: String or [Slipstream view](docs/Views.md)

-> Default Value: null
    
#### showArrowHead

-> Optional Parameter

-> Accepted Type: Boolean

-> Accepted Value: Boolean indicating whether arrow heads should be displayed on the connections or not

-> Default Value: false


#### allowChildrenCollapse

-> Optional Parameter

-> Accepted Type: Boolean

-> Accepted Value: Boolean value indicating whether clicking a parent node will collapse / expand its children

NOTE: collapseChildrenThreshold will be ignored when allowChildrenCollapse is set to false.

-> Default Value: true

#### allowZoomAndPan

-> Optional Parameter

-> Accepted Type: Boolean

-> Accepted Value: Boolean value indicating whether the topology instance allows user to pan and zoom

-> Default Value: true

#### maxLabelSize

-> Optional Parameter

-> Accepted Type: Number

-> Accepted Value: Number which specifies the maximum node name length that should be displayed. When a name exceeds this size, the label is truncated with an ellipsis. When a node label is hovered over, the full name will be displayed. This value is applied to all node labels.

-> Default Value: 16

#### nodeSpacing

-> Optional Parameter

-> Accepted Type: Object

-> Accepted Value: Object that contains vertical and horizontal spacing between nodes in pixels

Example: 
```
    nodeSpacing: {
        horizontalGap: 150,
        verticalGap: 100
    }
```

**horizontalGap**
 Horizontal spacing between nodes in pixels.
 Default Value: 150 (px should not be provided, but only number)

**verticalGap**
 Vertical spacing between nodes in pixels.
 Default Value: 100 (px should not be provided, but only number)


#### viewerDimensions
-> Optional Parameter

-> Accepted Type: Object

-> Accepted Value: Object that provides fixed height and width for the topology instance.

Example:

``` 
    viewerDimensions: {
        height: 1024,
        width: 768
    }
```

**height**
Height of the topology instance.
Default Value: Height of container provided to the widget 

**width**
Width of the topology instance.
Default Value: Width of container provided to the widget 


#### tooltip
    
-> Optional parameter

-> Accepted Type: Object

-> Accepted Value: Object that provides 'onHover' callback.

    If this parameter is assigned to an object which has 'onHover' callback, it will show a tooltip on hovering over a node or link icon. The content for the tooltip should be provided from the assigned callback function. It provides the elementType, elementObj and renderTooltip parameters.

    - elementType:  The type of element being hovered which can either be a NODE, LINK or a NODE-BADGE
    - elementObj: If elementType is NODE, this parameter will be a d3 object of the node being hovered.
                  If elementType is LINK, this parameter will be a d3 object of target node
                  If elementType is NODE-BADGE, this parameter will be a d3 object of node badge
    - renderTooltip: It is a callback that should be invoked to provide the view to be showed in the tooltip.

    The callback function has to invoke the renderTooltip function and pass a string to render in tooltip widget. No tooltip will be displayed if renderTooltip function is not invoked or no parameter is provided to renderTooltip function.

Example:

```
var tooltipCallback = function (elementType, elementObj, renderTooltip){
    var tooltip_data;
    if (elementType == 'LINK') {
        tooltip_data = "<span style='color:blue'> this is <br/> link template </span>";
    }
     
    else if (elementType == 'NODE') {
        tooltip_data = "<span> Name: " + elementObj.name + "<br/><span> <span> Type: "+ elementObj.type + "</span>";
    }

    else if (elementType == 'NODE-BADGE') {
        tooltip_data = "<span> This is a badge for " + elementObj.name + "</span>";
    }

    renderTooltip(tooltip_data);
};

var tooltipObj = {
    "onHover": tooltipCallback
};

var topologyConf = {
    data: {*},
    icons: {*},
    mode: "view",
    container: $el,
    legend: legendTemplate,
    tooltip: tooltipObj
};

var instance = Topology.getInstance(topologyConf, "tree").build();

```

-> The object can also have additional configuration parameters supported by framework's tooltip widget like position, offsetX, offsetY [Tooltip](public/assets/js/widgets/tooltip/tooltip.md). If the configuration parameters are provided, it will override the default configuration for tooltip set by the framework.
-> Note: For a node badge, the parameters position, offsetX and offsetY provided by the configuration will be overridden by the topology widget so that the tooltips can be placed optimally next to the badge.

Example:

```
var tooltipCallback = function (elementType, elementObj, renderTooltip){
    var tooltip_data;
    if(elementType == 'LINK') {
        tooltip_data = "<span style='color:blue'> this is <br/> link template </span>";
    }
     
    else if(elementType == 'NODE') {
        tooltip_data = "<span> Name: " + elementObj.name + "<br/><span> <span> Type: "+ elementObj.type + "</span>";
    } 

    renderTooltip(tooltip_data);
};

var tooltipObj = {
    "minWidth": 200,
    "maxWidth": 300,
    "contentAsHTML": false,
    "interactive": false,
    "onHover": tooltipCallback
};

var topologyConf = {
    data: {*},
    icons: {*},
    mode: "view",
    container: $el,
    legend: legendTemplate,
    tooltip: tooltipObj
};

var instance = Topology.getInstance(topologyConf, "tree").build();

```

Default tooltip configuration set by the framework:

```
var tooltipConfig = {
    "minWidth": 100,
    "maxWidth": 100,
    "position": "top",
    "contentAsHTML": true,
    "animation": false,
    "contentCloning": false
};

```

NOTE: Tooltip created by framework for the topology widget is interactive (content of the tooltip can be clicked and copied) by default. To override this behavior app can set additional configuration parameters like 'contentAsHTML' and 'interactive' to false. If content being passed is HTML or a view, then interactive option will always set to be true by framework's tooltip widget.


#### subNode
    
-> Optional parameter

-> Accepted Type: Object

-> Accepted Value: Object that provides 'badgeOnClick' callback.

    If this parameter is assigned to an object which has 'badgeOnClick' callback, the callback function will be invoked when the badge is clicked. It provides its related node object as parameter.

    - node: node object

    It is expected that the 'badgeOnClick' callback returns either true / false. Returning true allows badge toggle, returning false prevents further interaction.

Example:

```
var subNodeBadgeClick = function (node) {
            //return false if toggle of badge must be disallowed.
            if(node.subNodes && node.subNodes.length > 3) {
                return false;
            }
            return true; //return true by default.
        }

var topologyConf = {
    data: {*},
    icons: {*},
    ...,
    subNode: {
      badgeOnClick: subNodeBadgeClick
    }
};

var instance = Topology.getInstance(topologyConf, "tree").build();

```
-------------------------------------------------------------------------------------------------------------------------------------------------------

### Methods
______________________________________________________________________________________________________________________________________________________
#### build
Adds the dom elements and events of the Topology widget in container provided to the widget.

Example:
```
topology.build();
```

#### destroy
Clean up container provided to the widget from the resources created by the Topology widget.

Example:
```
topology.destroy();
```

#### reload
Re-render the topology in container provided to the widget 

```
topology.reload();
```

#### get
Returns data the topology is visualizing. It takes in an optional parameter - id.

- *id* - A string identifying a node. If this parameter is not provided, the get method returns the entire data.

```
topology.get(id);
```

#### addNode
Adds node / nodes to the topology.

- *id* - A string identifying the node to which nodes must be added as children.

- *nodes* - Array of nodes object or a single node object to be added.

```
var nodes = [{..},{..}];
topology.addNode(id, nodes);

var node = {..};
topology.addNode(id, node);
```

#### updateNode
Updates a node with the provided node object.

- *nodeObject* - The updated node object. As node id is used to identify the desired node for update, it is expected that the provided node object has a matching id already available in the original data.

```
var nodeObject = {id:2324,..};
topology.updateNode(nodeObject);
```

#### removeNode
Removes a node identified by its id.

- *id* - A string identifying the node which must be removed.

```
topology.removeNode(id);
```

-------------------------------------------------------------------------------------------------------------------------------------------------------

### Events

The following jQuery events are emitted on container provided in the configuration (conf.container)
______________________________________________________________________________________________________________________________________________________
#### slipstream.topology.legend:collapse

Emitted when legend icon is clicked when the legend is currently displayed. 

The above interaction hides the legend and emits the event.

Event Data: None

#### slipstream.topology.legend:expand

Emitted when legend icon is clicked when the legend is currently NOT displayed

The above interaction displays the legend and emits the event.

Event Data: None

           
#### slipstream.topology.node:click

Emitted when a node icon is clicked.

The above interaction optionally expands / collapses the clicked node's children, if allowChildrenCollapse = true before emitting the event

Event Data: The object from conf.data that corresponds to the node that was clicked.


#### slipstream.topology.node:mouseOver

Emitted when a node icon is hovered over.

Event Data: The node data model that corresponds to the node that was hovered on.


#### slipstream.topology.node:mouseOut

Emitted when a node icon is hovered out of.

Event Data: The node data model that corresponds to the node that was hovered out of.


#### slipstream.topology.addOn:click

Emitted when an addOn element is clicked.

Event Data: The object from conf.data that corresponds to the addOn element that was clicked.


#### slipstream.topology.link:click

Emitted when a link is clicked.

Event Data: The node data model with the link that corresponds to the link that was clicked.


#### slipstream.topology.link:mouseOver

Emitted when a link is hovered over.

Event Data: The node data model with the link that corresponds to the link that was hovered on.

#### slipstream.topology.link.icon:click

Emitted when a link icon is clicked. (A link icon is added at the center of a link if link.type matches a value in conf.icons)

Event Data: The node data model with the link that corresponds to the link icon that was clicked.

#### slipstream.topology.link.icon:mouseOver

Emitted when a link icon is hovered on. (A link icon is added at the center of a link if link.type matches a value in conf.icons)

Event Data: The node data model with the link that corresponds to the link icon that was hovered on.

#### slipstream.topology.link.icon:mouseOut

Emitted when a link icon is hovered out of. (A link icon is added at the center of a link if link.type matches a value in conf.icons)

Event Data: The node data model with the link that corresponds to the link icon that was hovered out of.


#### slipstream.topology.over

Emitted when an external element is over the visualization. One potential use case is to display drop targets when this event is triggered. 
 
Event Data: The element which is over the visualization, instance of visualization with helper methods are passed as arguments.        

**dragElement**
The element which is dragged over the visualization.

**topologyUi**
Instance of the visualization with addDropTargets, removeDropTargets methods.

- *topologyUi.addDropTargets(dropZones)*:
    Displays drop targets based on provided valid, invalid ids wrapped in an object.
    
    Parameter:   
    ```
    {
        valid: <(optional) Array of node/link ids>
        invalid: <(optional)  Array of node/link ids>   
    }
    ```                 
    
    Example:
    ```
    var dropZones = {
                        valid: ['11link', '12'],
                        invalid: ['13link']
                    };
    topologyUi.addDropTargets(dropZones);
                    
    ```
    
- *topologyUi.removeDropTargets()*:
    Removes drop targets if present.          

    Example:
    ```
    topologyUi.removeDropTargets();
                    
    ```
    
Example:
```
container.on("slipstream.topology.over", function (evt, dragElement, topologyUi) {    
    var dropZones = {
                    valid: ['11link', '12'],
                    invalid: ['13link']
                };
    topologyUi.addDropTargets(dropZones); //Displays drop zones based on provided valid, invalid ids.
});
```

#### slipstream.topology.drop

Emitted when an external element is dropped on a drop target.
 
Event Data: The element which is dropped on the visualization, instance of dropTarget, instance of visualization with helper methods are passed as arguments.

**dropElement**
The element which was dragged and now dropped.

**dropTarget**
Instance of the dropTarget with set, get, getTargetType methods.

- *dropTarget.set(obj)*:
    By invoking this method with the updated data model (of a node/link) as parameter, the drop target's data in the dataStore is updated.
    
    Example:
    ```
    var model = {
                "type":icon,
                "size": "medium"
            };
    dropTarget.set(model);
                    
    ```
   
- *dropTarget.get()*:
    By invoking this method, it returns the data model of the dropTarget (node/link).
    
    Example:
    ```
    var model = dropTarget.get();
                    
    ```

- *dropTarget.getTargetType()*:
    Returns dropTarget type (node/link).
    Example:
    ```
    var dropTargetType = dropTarget.getTargetType(); // returns node/link
                    
    ```
    
**topologyUi**
Instance of the visualization with addDropTargets, removeDropTargets methods.

- *topologyUi.addDropTargets(dropZones)*:
    Displays drop targets based on provided valid, invalid ids wrapped in an object.
    
    Parameter:   
    ```
    {
        valid: <(optional) Array of node/link ids>
        invalid: <(optional)  Array of node/link ids>   
    }
    ```                 
    
    Example:
    ```
    var dropZones = {
                        valid: ['11link', '12'],
                        invalid: ['13link']
                    };
    topologyUi.addDropTargets(dropZones);
                    
    ```
    
- *topologyUi.removeDropTargets()*:
    Removes drop targets if present.          

    Example:
    ```
    topologyUi.removeDropTargets();
                    
    ```
    
Example:
```
container.on("slipstream.topology.drop", function (evt, dropElement, dropTarget, topologyUi) {
    var icon = dropElement.getAttribute('title');
    var updateObject = {
        "type":icon
    };

    dropTarget.set(updateObject);
    topologyUi.removeDropTargets();
});
```