# Topology React Component


## Introduction
Topology is a reusable graphical user interface that allows users to render nodes and links. Topology can be a tree, graph or a chord type. It can be added to a container programmatically or as a component. This document describes how to add a Topology as a React component. To add a Topology programmatically, refer to [Topology Widget](public/assets/js/widgets/topology/topology.md)

1. For detailed information on Tree component property configuration, read [Tree Topology Widget](public/assets/js/widgets/topology/treeTopology.md)
2. For detailed information on Graph component property configuration, read [Graph Topology Widget](public/assets/js/widgets/topology/graphEditorTopology.md)
3. For detailed information on Chord component property configuration, read [Chord Topology Widget](public/assets/js/widgets/topology/chordTopology.md)


## API
The Topology React component gets its configuration from properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The Topology React component has the following properties:

```javascript
<Topology
    data= "< (required) JSON object >"
    icons= "< (required) Object containing key values that point to paths of all icons used in the topology implementation defined by each node / link's type attribute >"
    viewerDimensions= " < (optional) Object that contains the dimensions of topology in the form of height and width>"
    showArrowHead= "< (optional) boolean indicating whether arrow heads should be displayed on the links or not >"
    allowZoomAndPan= "< (optional) boolean indicating whether the topology instance allows user to pan and zoom >"
    legend="< (optional) A legend to represent nodes and links>" 
    tooltip= "< (optional)  Object that contains a callback function to set content for tooltip >"
    onNodeClick= "<(optional) Callback to invoke when a node is clicked.>"
    onNodeMouseOver= "<(optional) Callback to invoke when a node is moused over.>"
    onNodeMouseOut= "<(optional) Callback to invoke when a node is moused out.>"
    onLinkClick= "<(optional) Callback to invoke when a link is clicked.>"
    onLinkMouseOver= "<(optional) Callback to invoke when a link is moused over.>"
    onLinkMouseOut= "<(optional) Callback to invoke when a link is moused out.>"
    type = "<(optional) A string identifying the type of topology>"
/>
```

For example, a Tree Topology component could be rendered with the following element:

```javascript
<Topology
   data={this.dataStore.get()}
   icons={this.state.icons}
   viewerDimensions={this.state.viewerDimensions}
   showArrowHead={this.state.showArrowHead}
   allowZoomAndPan={this.state.allowZoomAndPan}
   type="tree"
/>
```
Note - If type property is not specified, the default topology is 'graph'.

### data

#### tree

Data should be provided in the following nested format.

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

To help with data management, a data store utility 'TreeDataStore' can be used. For instance, the data store utility can be used in redux reducers to query and update nodes / links.

Example:
```
dataStore = new TreeDataStore(data);

1. Get data
var data = this.dataStore.get()

2. Add node / link
this.dataStore.add(node);
this.dataStore.add(link);

3. Remove node / link
this.dataStore.remove(node.id);
this.dataStore.remove(link.id);

4. Update node / link
this.dataStore.put(node);
this.dataStore.put(link);

5. Filter
var filterObject = {"type":"node", "attributes":{"name":"File 1"}}
this.dataStore.filter(filterObject);

```

#### graph, chord

Data should be provided in the following format - an array of nodes and links.

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

To help with data management, a data store utility 'FlatDataStore' can be used. For instance, the data store utility can be used in redux reducers to query and update nodes / links.

Example:
```
dataStore = new FlatDataStore(data);

1. Get data
var data = this.dataStore.get()

2. Add node / link
this.dataStore.add(node);
this.dataStore.add(link);

3. Remove node / link
this.dataStore.remove(node.id);
this.dataStore.remove(link.id);

4. Update node / link
this.dataStore.put(node);
this.dataStore.put(link);

5. Filter 
var filterObject = {"type":"node", "attributes":{"name":"node1"}}
this.dataStore.filter(filterObject);

``` 

### icons
Object that contains paths to icons with properties that correspond to icon property of nodes and links in the json data provided to the React component.

Example:
``` javascript
icons: {
       "site": "img/icon_site.svg",
       "vpn": "img/icon_VPN.svg",
       "internet_breakout": "img/icon_internet_breakout.svg"      
     };
```

### viewerDimensions
Object that provides fixed height and width for the topology.

``` javascript
    viewerDimensions: {
        height: 1024,
        width: 768
    }
```

### showArrowHead
Boolean value to indicate whether links should be connected with directional / bi-directional arrows. 

### allowZoomAndPan
Boolean value indicating whether the topology can allow user to pan and zoom.

### legend
Legend can be a String or [Slipstream view](docs/Views.md)

### tooltip
Object that provides 'onHover' callback.

Example:
``` javascript
<Topology
    ...
    tooltip={"onHover": this.tooltipCb}   
/>  
```

### onNodeClick
The provided function handler will be invoked when a node is clicked.

### onNodeMouseOver
The provided function handler will be invoked when a node is moused over.

### onNodeMouseOut
The provided function handler will be invoked when a node is moused out. 

### onLinkClick
The provided function handler will be invoked when a link is clicked.

### onLinkMouseOver
The provided function handler will be invoked when a link is moused over.

### onLinkMouseOut
The provided function handler will be invoked when a link is moused out. 

##Usage
To use the Graph Topology component -

```javascript
<Topology
    data={this.dataStore.get()}
    icons={this.state.icons}       
/>
```

The following example shows how the Graph Topology component can be used in the context of a React application:

```javascript
  class GraphTopologyComponentView extends React.Component {
        constructor(props) {
            super(props);
            this.dataStore = new FlatDataStore(data); //FlatDataStore is a helper utility which provides data management interfaces. DataStore usage is optional.
            this.state = {
                data: this.dataStore.get(),
                icons: icons,
                container: this.el,
                viewerDimensions: {
                    width: window.innerWidth - 100,
                    height: window.innerHeight - 100
                }                   
            };
                
            this.handleNodeClick = this.handleNodeClick.bind(this);               
            this.updateNode = this.updateNode.bind(this);                
            this.addNode = this.addNode.bind(this);
            this.deleteNode = this.deleteNode.bind(this);
        }
          

        handleNodeClick(e, node) {
            console.info("Node " + node.id + " was clicked");               
        }
        

        handleLinkClick(e, link) {
            console.info("Link " + link.id + " was clicked");               
        }
          
        updateNode() {                
            this.dataStore.put(node);
            this.setState({data: this.dataStore.get()})
        }
            
        addNode () {                
            this.dataStore.add(node);
            this.setState({data: this.dataStore.get()})
        }

        deleteNode () {                
            this.dataStore.remove(node.id);
            this.setState({data: this.dataStore.get()})
        }
            
        render() {
            return (
                <div>                            
                    <Topology
                        data={this.dataStore.get()}
                        icons={this.state.icons}
                        viewerDimensions={this.state.viewerDimensions}                                                                              
                        onNodeClick={this.handleNodeClick}
                        onNodeMouseOver={this.handleNodeMouseOver}
                        onNodeMouseOut={this.handleNodeMouseOut}
                        onLinkClick={this.handleLinkClick}
                        onLinkMouseOver={this.handleLinkMouseOver}
                        onLinkMouseOut={this.handleLinkMouseOut}
                    />
                </div>
            );
        }
    };

    ReactDOM.render(React.createElement(GraphTopologyComponentView, null) , document.getElementById('topology_demo'));
```