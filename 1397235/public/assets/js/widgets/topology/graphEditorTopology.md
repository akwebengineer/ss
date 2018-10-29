# Graph Topology Widget

-------------------------------------------------------------------------------------------------------------------------------------------------------
## Introduction
The Graph Topology widget is a reusable graphical user interface that allows users to render nodes and links in the selected container. It also provides interaction features such as creating connections between nodes, moving existing connections between source and target nodes, and drag and drop ability from an external palette to create nodes.

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
    layout: "< object representing the layout>",    
    allowZoomAndPan: "< boolean indicating whether the topology instance allows user to pan and zoom >",           
    linkTypeReducer: "< callback function which reduces multiple link types to a single type >",
    linkOverlay: "< callback function which returns a overlay view>",
    edit: "< boolean indicating whether the topology is editable >",
    tooltip: "< object that contains a callback function to set content for tooltip >",
    connection: "< object that specifies the connection type>",
    customNodeView: "< callback function which returns a user provided view or string>",
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
            {source: "123_node", target: "456_node", id: "445_link", name: "445_link", type: "bidirectional_link"},
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
2. Allows custom styling by using CSS class selectors

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

- *type*

-> Optional Value

-> Accepted Types: String

-> Accepted Values:
String that identifies the type of the link. This value is added as a class. This allows custom styling by using CSS selectors.

Examples for custom styling a link:

1. type = contacted_default  (link is orange dashed line):
```
.link.contacted_default {
    stroke: #78BB4C !important;
    stroke-linecap: square;
    stroke-dasharray: 1,5;
}
```

2. type = fs-topo-link-error (link is red solid line):
```
.link.fs-topo-link-error {
    stroke: #FF5A5A !important;
    stroke-width: 1.5px !important;
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

#### layout
Defines the layout type. Layout can be 'hierarchical', 'spring', 'absolute'

-> Optional Parameter

-> Accepted Type: String

-> Accepted Values: Object with type:'hierarchical'/'spring'/'absolute'

-> Default Value: "hierarchical"

**hierarchical**
To render a hierarchical layout, define an object specifying its type and necessary parameters.

Example:
```javascript
{
    type: "hierarchical",
    parameters: {
        orientation: "LR",
        nodeSpacing: {
            value: 180
        }
    }
}
``` 

***orientation***

-> Optional Parameter

-> Accepted Type: String

-> Accepted Values: "TB", "BT", "LR", "RL"

***TB*** 
Top to Bottom : Root nodes are positioned at the top. 

***BT*** 
Bottom to Top : Root nodes are positioned at the bottom. 

***LR*** 
Left to Right : Root nodes are positioned at the left. 

***RL*** 
Right to Left : Root nodes are positioned at the right.

-> Default Value: "TB"

***nodeSpacing***

Object that specifies the horizontal and vertical spacing between nodes.

-> Optional Parameter

-> Accepted Type: Object

Example
``
layout: {
    type: "hierarchical",
    parameters: {
        orientation:
        nodeSpacing: {value:180}
    }
}
``


**spring**
To render a spring layout, define an object specifying its type. A spring layout unlike hierarchical layout does not reflect hierarchy between nodes. It rather positions nodes in an arbitrary fashion. A comparable choice to spring layout is D3.js force directed graph layout. 

Example:
```javascript
{
    type: "spring"
}
``` 

**absolute**
To render a absolutely positioned layout, define an object specifying its type. For this layout, it is mandatory that nodes are provided with 'position' attribute. To retrieve initial positions of nodes, the 'getPositions' method can be used to retrieve positions for 'hierarchical' or 'spring' layout.

Example:
```javascript
{
    type: "absolute"
}
``` 

```javascript
data = {
    nodes: [
        {name: "Internet", id: "123_node", type: "internet_breakout", position: {left: 500, top: 50}},
        {name: "Firewall Cluster", id: "456_node", type: "firewall", position: {left: 540, top: 190}}],
    links: [{},{}]
}
```

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

#### linkTypeReducer
A connection is made up of links between a source and a target. Each connection represents links between the source and the target. Since multiple links make up a connection, 'linkTypeReducer' user provided callback function is invoked with links that make up a connection. The return value is expected to be a string which is deduced by the link 'types'. The returned string is then attached as a class to the connection.

-> Optional Parameter

-> Accepted Type: Function

-> Accepted Value: The return value must be a string.

linkTypeReducer callback is provided with the following parameter:

- *links* - An array of links

Example:
```
linkTypeReducer: function (links) {
      var returnType = "ok",
          critical = _.find(links, function(link){ return link.type == "critical" });
      if(critical) {
        returnType = "critical"
      }
      return returnType;
}
```

#### linkOverlay
By default, the number of links between a source and a target is displayed on a overlay midway between a connection. If the default overlay needs to be customized, 'linkOverlay' user provided callback function can be used to return a string.

-> Optional Parameter

-> Accepted Type: Function

-> Accepted Value: The return value must be string.

linkOverlay callback is provided with the following parameter:

- *links* - An array of links

Example:
```
linkOverlay: function (links) {
    if(links.length > 0 && links[0].type == "dropped_default") {
        return '<div style="background-image: url(img/icon_link_down.svg);"></div>'
    } else if(links.length > 0 && links[0].type == "bidirectional_link") {
        return '<div style="background-color: #78bb4c;">' + links.length + ' </div>'
    }
    return '<div>' + links.length + '</div>';
},
```

#### edit

-> Optional Parameter

-> Accepted Type: Boolean

-> Accepted Value: Boolean indicating whether users can create or update nodes and connections visually.

-> Default Value: false

#### tooltip
    
-> Optional parameter

-> Accepted Type: Object

-> Accepted Value: Object that provides 'onHover' callback.

    If this parameter is assigned to an object which has 'onHover' callback, it will show a tooltip on hovering over a node or link overlay. The content for the tooltip should be provided from the assigned callback function. It provides the elementType, elementObj and renderTooltip parameters.

    - elementType:  The type of element being hovered which can either be a node or a link
    - elementObj: If elementType is node, this parameter will be the node object.
                  If elementType is link, this parameter will be an arary of links which make up the connection.
    - renderTooltip: It is a callback that should be invoked to provide the view to be showed in the tooltip.

    The callback function has to invoke the renderTooltip function and pass a string to render in tooltip widget. No tooltip will be displayed if renderTooltip function is not invoked or no parameter is provided to renderTooltip function.

Example:

```
var tooltipCallback = function (elementType, elementObj, renderTooltip){
    var tooltip_data;
    if (elementType == 'NODE') {
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
    container: el,    
    tooltip: tooltipObj
};

var instance = Topology.getInstance(topologyConf).build();

```

-> The object can also have additional configuration parameters supported by framework's tooltip widget like position, offsetX, offsetY [Tooltip](public/assets/js/widgets/tooltip/tooltip.md). If the configuration parameters are provided, it will override the default configuration for tooltip set by the framework.

Example:

```
var tooltipCallback = function (elementType, elementObj, renderTooltip){
    var tooltip_data;
    if (elementType == 'NODE') {
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

#### connection
    
-> Optional parameter

-> Accepted Type: Object

-> Accepted Value: Object that provides connection specifications.

example:
```javascript
connection: {
    type: "Straight"
}
```

**type**
If type is "Straight", the default curves on connections are replaced with straight lines. Straight connections can be used when there are uni-directional flow between source and target.

#### customNodeView
customNodeView user provided callback offers a way for consumers to provide node views as a Slipstream view or HTML string. 

-> Optional Parameter

-> Accepted Type: Function

-> Accepted Values: String or [Slipstream view](docs/Views.md)

Example:
```javascript
customNodeView: function () {
    return function MyView() {
        this.render = function(node) {
            var data = $.extend({}, node, {
                image: conf.icons[node.type],
                statusImage : "img/icon_link_up.svg"
            });
            this.el = render_template(nodeCustomTemplate, data);
            return this;
        };
        this.update = function(node) {
            $node = $(this.el);
            $node.find('.customlabel').text(node.name);
        };
        this.close = function() {
            //clean up
        };
    }
}
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

#### getPositions
Returns node positions based on provided options. The positions can be applied on the node by using the 'update' method.

**hierarchical**
For hierarchical type, the returned nodes are decorated with 'position' object attribute with 'top' and 'left' positions. It is up to applications to use the positions by updating nodes 'position' attribute using the 'update' widget method.

```javascript
var positions = topology.getPositions({
                  type: "hierarchical",
                  parameters: {
                      orientation: "TB" //"BT", "LR", "RL"
                  }
                });

_.each(positions, function (node) {
        topology.update(node);
    });
```

**spring**
For spring type, the returned nodes are decorated with 'position' object attribute with 'top' and 'left' positions. It is up to applications to use the positions by updating nodes 'position' attribute using the 'update' widget method.

```javascript
var positions = topology.getPositions({
                  type: "spring"                 
                });

_.each(positions, function (node) {
        topology.update(node);
    });
```

**absolute**
For absolute type, nodes are returned. 

```javascript
var positions = topology.getPositions({
                  type: "absolute"                 
                });

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

Event Data: Array of links that corresponds to the link that was clicked.


#### slipstream.topology.link:mouseOver

Emitted when a link is hovered over.

Event Data: Array of links that corresponds to the link that was clicked.


#### slipstream.topology.link:mouseOut

Emitted when a link icon is hovered out of.

Event Data: Array of links that corresponds to the link that was clicked.

#### slipstream.topology.link:add

Emitted when a link is added.

Event Data: Link data indicating source and target.

**link**
Link data model

Example:
```javascript
 container.on("slipstream.topology.link:add", function (evt, link) {
    _.extend(link,{"id": _.uniqueId("link"), name: "new link"});
    self.topology.add(link);
});
```

#### slipstream.topology.link:remove

Emitted when a connection (which is made up of links) is removed.

Event Data: Array of links

**links**
An array of links

Example:
```javascript
container.on("slipstream.topology.link:remove", function (evt, links) {
    links.links.forEach(function(ele) {
        self.topology.remove(ele.id);
    });
});
```

#### slipstream.topology.link:move

Emitted when a connection (which is made up of links) is moved to a different source or target.

Event Data: Array of links

**links**
An array of links

Example:
```javascript
container.on("slipstream.topology.link:move", function (evt, links) {
    links.links.forEach(function(ele) {
        self.topology.update(ele);
    });
});
```

#### slipstream.topology.over

Emitted when an external element is over the visualization. 
 
Event Data: The element which is over the visualization.        

**dragElement**
The element which is dragged over the visualization.

Example:
```
container.on("slipstream.topology.over", function (evt, dragElement) {
  //dragElement - The element which is dragged over the visualization.
  $(dragElement).css({border: '3px #98fb98 dashed'}).animate({
      borderWidth: 0
  }, 500);
});
```

#### slipstream.topology.drop

Emitted when an external element is dropped on a drop target.
 
Event Data: The element which is dropped on the visualization.

**dropElement**
The element which was dragged and now dropped.
    
Example:
```
container.on("slipstream.topology.drop", function (evt, dropElement) {
  //dropElement - element which was dragged and now dropped
  var icon = dropElement.getAttribute('title'),
      node = {name: icon, id: _.uniqueId("node"), type: icon, size: "medium"};
  self.topology.add(node);
});
```

#### slipstream.topology.node:dragStop

Emitted after a node is dragged to a new position. 
 
Event Data: Node which was dragged and the new position

**node**
Dragged node.

**dragPosition**
Position object for the dragged node with top and left attributes. This new position can be used to update the node data.

Example:
```
container.on("slipstream.topology.node:dragStop", function (evt, node, dragPosition) {
    //node - node object which was dragged
    //dragPosition - element drag stop position
    _.extend(node.position, dragPosition);
    self.topology.update(node);
});
```