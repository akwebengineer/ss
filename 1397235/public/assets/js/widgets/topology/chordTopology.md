# Chord Topology Widget

-------------------------------------------------------------------------------------------------------------------------------------------------------
## Introduction
The Chord Topology widget is a reusable graphical user interface that allows users to represent inter-relationship between data, especially links.

-------------------------------------------------------------------------------------------------------------------------------------------------------
## API
The Chord Topology widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.

-------------------------------------------------------------------------------------------------------------------------------------------------------


### Configuration
______________________________________________________________________________________________________________________________________________________
The configuration object that is passed to the widget -
```
conf: {    
    container: "< DOM element to which the topology needs to be appended >",
    data: "< JSON data >",    
    viewerDimensions: "< object that contains the dimensions of topology in the form of height and width>",
    legend: "< content represented by a string or Slipstream view >",        
    allowZoomAndPan: "< boolean indicating whether the topology instance allows user to pan and zoom >",        
    tooltip: "< object that contains a callback function to set content for tooltip >",
    linkTypeReducer: "< callback function which reduces multiple link types to a single type >",
    chordContext: "< String that indicates the context in which chords should be drawn>"
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
            {name: "node1", id: "123_node", type: "vpn"},
            {name: "node2", id: "456_node", type: "internet_breakout"},
            {name: "node3", id: "457_node", type: "hub"}
        ],
        links: [
            {source: "123_node", target: "456_node", id: "445_link", name: "445_link", type: "bidirectional_link", weight:10},
            {source: "123_node", target: "457_node", id: "449_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "123_node", target: "457_node", id: "449_lisnk", name: "449_link", type: "contacted_default", weight:0}
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
    
- *type*

-> Required Value

-> Accepted Types: String

-> Accepted Values:
String that identifies the type of the node.

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

- *weight*

-> Optional Value

-> Accepted Types: Integer

-> Accepted Values: An arbitrary number representing its relationship with its peers. For example, it could denote the traffic volume between its source and target nodes.

- *type*

-> Optional Value

-> Accepted Types: String

-> Accepted Values:
String that identifies the type of the link. Since a chord is made up of multiple links, user provided callback 'linkTypeReducer' is invoked to retrieve a desired link type. The reduced link type is attached as "data-type" attribute to the chord. This allows custom styling of the chord using CSS Attribute selectors.

Examples for custom styling a chord:

1. type = critical  (chord is red):
```
.chord[data-type=critical]{
    fill: #b72841 !important;
}
```

2. type = major (chord is orange):
```
.chord[data-type=major]{
    fill: #ff9a00 !important;
}
```

#### legend

-> Optional Parameter

-> Accepted Type: String | Object

-> Accepted Values: String or [Slipstream view](docs/Views.md)

-> Default Value: null

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

#### linkTypeReducer
A chord diagram is made up of chords. Each chord is made up of links. Since multiple links make up a chord, 'linkTypeReducer' user provided callback function is invoked with links that make up a chord. The return value is expected to be a string which is deduced by the link 'types'. The returned string is then attached as a 'data-type' attribute to the chord.

-> Optional Parameter

-> Accepted Type: Function

-> Accepted Value: The return value must be a string.

-> Default Value: true

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

#### chordContext
Chords by default are drawn based on source -> target and target -> source link counts. The numerical value "count" is used to visualize chord taper at source and destination end points. This context can be swapped to visualize the "weight" attribute available on each link. If chord context is set to "weight", the chords are drawn based on weight numerical value. One scenario where using weight comes handy is to visualize traffic volume between source and target rather than the number of links between source to target or vice versa.

-> Optional Parameter

-> Accepted Type: String

-> Accepted Value: "count", "weight"

-> Default Value: "count"

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

#### setChordContext
This interface is offered to supplement 'chordContext' configuration parameter in re-visualizing chords based on a different context. The main advantage of this interface is to avoid redraw when toggling between chord context.

- *weight* - Sets chord context based on 'weight' attribute defined on each link.

Example:
```
topology.setChordContext("weight");
```

- *count* - Sets chord context based on the number of links from source -> target and target -> source.

Example:
```
topology.setChordContext("count");
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
Returns filtered node / link identified by its type and other attributes. 

- *object* - An object with filter attributes.
 
It is required that 'type' attribute is provided which has a value - string identifying the type: "node" / "link".

```
var filterObject = {"type":"node", "name":"node1"}
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

Emitted when a node is clicked.

Event Data: The object from conf.data that corresponds to the node that was clicked.


#### slipstream.topology.node:mouseOver

Emitted when a node is hovered over.

Event Data: The node data model that corresponds to the node that was hovered on.


#### slipstream.topology.node:mouseOut

Emitted when a node is hovered out of.

Event Data: The node data model that corresponds to the node that was hovered out of.


#### slipstream.topology.link:click

Emitted when a chord is clicked. 

Event Data: Since a chord is made up of multiple links, links from 'links' data model which make up the chord is provided as an array.


#### slipstream.topology.link:mouseOver

Emitted when a chord is hovered over.

Event Data: Since a chord is made up of multiple links, links from 'links' data model which make up the chord is provided as an array.


#### slipstream.topology.link:mouseOut

Emitted when a chord is hovered out of.

Event Data: Since a chord is made up of multiple links, links from 'links' data model which make up the chord is provided as an array.
