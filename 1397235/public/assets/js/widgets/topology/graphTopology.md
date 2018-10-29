# Graph Topology Widget

-------------------------------------------------------------------------------------------------------------------------------------------------------
## Introduction
The Graph Topology widget is a reusable graphical user interface that allows users to render nodes and links in the selected container.

-------------------------------------------------------------------------------------------------------------------------------------------------------
## API
The Graph Topology widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.

-------------------------------------------------------------------------------------------------------------------------------------------------------


### Configuration
______________________________________________________________________________________________________________________________________________________
The configuration object that is passed to the widget -
```
conf: {    
    container: "< DOM element to which the topology needs to be appended >",
    data: "< JSON data >",    
    icons: "< object containing key & values that point to paths of all icons used in the topology implementation defined by each node / link's type attribute >",      
    viewerDimensions: "< object that contains the dimensions of topology in the form of height and width>",
    legend: "< content represented by a string or Slipstream view >",
    showArrowHead: "< boolean indicating whether arrow heads should be displayed on the connections or not >",    
    allowZoomAndPan: "< boolean indicating whether the topology instance allows user to pan and zoom >",        
    tooltip: "< object that contains a callback function to set content for tooltip >"
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

-> The widget internally creates relevant data store on the provided data and exposes data management interfaces on the topology instance. For example, topology.add(), topology.remove().

**JSON**
JSON data should be provided in the following format - an array of nodes and links.

Example:
```
data = {
        nodes: [
            {name: "node1", id: "123_node", type: "vpn", size: "medium"},
            {name: "node2", id: "456_node", type: "internet_breakout", size: "medium"},
            {name: "node3", id: "457_node", type: "hub", size: "medium"}
        ],
        links: [
            {source: "123_node", target: "456_node", id: "445_link", name: "445_link", bidirectional: true, type: "bidirectional_link"},
            {source: "123_node", target: "457_node", id: "449_link", name: "449_link", type: "contacted_default"},
            {source: "123_node", target: "457_node", id: "449_lisnk", name: "449_link", type: "contacted_default"}
        ]
    };
```

**nodes**
An array of node objects with the following attributes -

- *name*

-> Optional Value

-> Accepted Types: String

-> Accepted Values: Label that needs to be displayed for a given node

- *id*

-> Required Value

-> Accepted Types: String

-> Accepted Values: Unique ID that corresponds to each node.
    
- *size*

-> Optional Value

-> Accepted Values: small, medium, large

-> Default Value: medium

small : Node is rendered as 15px X 15px icon
medium: Node is rendered as 30px X 30px icon
large : Node is rendered as 45px X 45px icon

- *type*

-> Required Value

-> Accepted Types: String

-> Accepted Values:
String that identifies the type of the node. This value MUST match a value in "icons" object of the configuration. This value is added as an attribute called "data-type". There are two basic uses to this -
1. Cross reference the value against config.icons and add the icon to node
2. Allows custom styling by using CSS Attribute selectors

**links**
An array of link objects with the following attributes -

- *source*

-> Required Value

-> Accepted Types: String

-> Accepted Values: Node which needs to be the source identified by its id.

- *target*

-> Required Value

-> Accepted Types: String

-> Accepted Values: Node which needs to be the target identified by its id.

- *id*

-> Required Value

-> Accepted Types: String

-> Accepted Values: Unique ID that corresponds to each link.

- *name*

-> Optional Value

-> Accepted Types: String

-> Accepted Values: Label that needs to be displayed for a given link.

- *bidirectional*

-> Optional Value

-> Accepted Types: Boolean

-> Accepted Values: If bidirectional is set to true, the link displays an arrow pointing to both its source node and target node. If set to false or not provided, an arrow is displayed pointing to its target node. Note: If the global configuration 'showArrowHead' is set to false, the 'bidirectional' flag is ignored.

- *type*

-> Optional Value

-> Accepted Types: String

-> Accepted Values:
String that identifies the type of the link. This value is added as an attribute called "data-type". This allows custom styling by using CSS Attribute selectors.

Examples for custom styling a link:

1. type = contacted_default  (link is orange dashed line):
```
.link[data-type=contacted_default] {
    stroke: #FFAD5A !important;
    stroke-linecap: square;
    stroke-dasharray: 1,5;
}
.link-arrow[data-type=contacted_default] {
    fill: orange !important;
    stroke: orange !important;
    stroke-dasharray: 0,0;    
}
```

2. type = fs-topo-link-error (link is red solid line):
```
.link[data-type=fs-topo-link-error] {
    stroke: #FF5A5A !important;
    stroke-width: 1.5px !important;
}
.link-arrow[data-type=fs-topo-link-error] {
    fill: red !important; 
    stroke: red !important;
}
```

#### icons

-> Required parameter

-> Accepted Types: object

-> Accepted Values: Object that contains paths to icons with properties that correspond to icon property of nodes and links in the json data provided to the widget.

Example:
```
icons: {
       "site": "img/icon_site.svg",
       "vpn": "img/icon_VPN.svg",
       "internet_breakout": "img/icon_internet_breakout.svg"      
     };
```

#### legend

-> Optional Parameter

-> Accepted Type: String | Object

-> Accepted Values: String or [Slipstream view](docs/Views.md)

-> Default Value: null
    
#### showArrowHead

-> Optional Parameter

-> Accepted Type: Boolean

-> Accepted Value: Boolean indicating whether arrow heads should be displayed on the connections or not.

-> Default Value: false

#### allowZoomAndPan

-> Optional Parameter

-> Accepted Type: Boolean

-> Accepted Value: Boolean value indicating whether the topology instance allows user to pan and zoom.

-> Default Value: true

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

    - elementType:  The type of element being hovered which can either be a node or a link
    - elementObj: If elementType is node, this parameter will be a d3 object of the node being hovered.
                  If elementType is link, this parameter will be a d3 object of target node
    - renderTooltip: It is a callback that should be invoked to provide the view to be showed in the tooltip.

    The callback function has to invoke the renderTooltip function and pass a string to render in tooltip widget. No tooltip will be displayed if renderTooltip function is not invoked or no parameter is provided to renderTooltip function.

Example:

```
var tooltipCallback = function (elementType, elementObj, renderTooltip){
    var tooltip_data;
    if (elementType == 'node') {
        tooltip_data = "<span> Name: " + elementObj.name + "<br/><span> <span> Type: "+ elementObj.type + "</span>";
    }

    renderTooltip(tooltip_data);
};

var tooltipObj = {
    "onHover": tooltipCallback
};

var topologyConf = {
    data: {*},
    icons: {*},    
    container: $el,    
    tooltip: tooltipObj
};

var instance = Topology.getInstance(topologyConf).build();

```

-> The object can also have additional configuration parameters supported by framework's tooltip widget like position, offsetX, offsetY [Tooltip](public/assets/js/widgets/tooltip/tooltip.md). If the configuration parameters are provided, it will override the default configuration for tooltip set by the framework.

Example:

```
var tooltipCallback = function (elementType, elementObj, renderTooltip){
    var tooltip_data;
    if (elementType == 'node') {
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
    container: $el,    
    tooltip: tooltipObj
};

var instance = Topology.getInstance(topologyConf).build();

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

#### add
Adds node / nodes, link / links to the topology.

- *object* - Array of nodes / links object or a single node / link object to be added. Nodes and links can also be mixed in an array.

```
var objects = [{..},{..}];
topology.add(objects);

var object = {..};
topology.add(object);
```

#### update
Updates a node / link.

- *object* - The updated node / link object. As id is used to identify the desired node / link for update, it is expected that the provided object has a matching id already available in the original data.

```
var object = {id:2324,..};
topology.update(object);
```

#### remove
Removes a node / link identified by its id.

- *id* - A string identifying the node / link which must be removed.

```
topology.remove(id);
```

#### filter
Returns filtered data based on filter attributes defined in an object.

- *object* - An object with filter attributes.
 
The filter attributes apply across node and link types. If 'type' attribute is provided with accepted strings "node" or "link", the filter query is restricted to either "node" or "link".

```
var filterObject = {"type":"node", "attributes":{"name":"node1"}}
topology.filter(filterObject);

var filterObject = {"type":"link"}
topology.filter(filterObject);
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

Event Data: The object from conf.data that corresponds to the node that was clicked.


#### slipstream.topology.node:mouseOver

Emitted when a node icon is hovered over.

Event Data: The node data model that corresponds to the node that was hovered on.


#### slipstream.topology.node:mouseOut

Emitted when a node icon is hovered out of.

Event Data: The node data model that corresponds to the node that was hovered out of.


#### slipstream.topology.link:click

Emitted when a link is clicked.

Event Data: The node data model with the link that corresponds to the link that was clicked.


#### slipstream.topology.link:mouseOver

Emitted when a link is hovered over.

Event Data: The node data model with the link that corresponds to the link that was hovered on.


#### slipstream.topology.link:mouseOut

Emitted when a link icon is hovered out of. (A link icon is added at the center of a link if link.type matches a value in conf.icons)

Event Data: The node data model with the link that corresponds to the link icon that was hovered out of.
