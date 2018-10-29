# Topology Widget

## Introduction
The Topology widget is a reusable graphical user interface that allows users to render a visual topology in the selected container

## API
The Topology Widget is an object factory which returns an instance of the requested topology type.

## Usage
TopologyWidget.getInstance() accepts two parameters.

**conf**

-> Required parameter

-> Accepted Types: object

-> Accepted Values: Configuration Object in the format specific to each "type", as documented in specific topology types below

**type**

-> Optional parameter

-> Accepted Types: String

-> Accepted Values: "tree", "graph"

### Topology Types
The following section describes each individual topology type

**Graph Topology**
Graph topology is the default type. If 'type' is not provided, 'graph' visualization type is rendered.
More on the configuration object, methods and events can be found here: [Graph Topology](https://ssd-git.juniper.net/spog/slipstream/blob/master/public/assets/js/widgets/topology/graphEditorTopology.md)

Example:
```
var graphTopology = TopologyWidget.getInstance(conf);
graphTopology.build();
```

**Tree Topology**
Tree topology renders topology in hierarchical column layout. 
More on the configuration object, methods and events can be found here: [Tree Topology](https://ssd-git.juniper.net/spog/slipstream/blob/master/public/assets/js/widgets/topology/treeTopology.md) 

Example:
```
var treeTopology = TopologyWidget.getInstance(conf, "tree");
treeTopology.build();
```

**Chord Topology**
Chord topology represents inter-relationships between data.
More on the configuration object, methods and events can be found here: [Chord Topology](https://ssd-git.juniper.net/spog/slipstream/blob/master/public/assets/js/widgets/topology/chordTopology.md) 

Example:
```
var chordTopology = TopologyWidget.getInstance(conf, "chord");
chordTopology.build();
```