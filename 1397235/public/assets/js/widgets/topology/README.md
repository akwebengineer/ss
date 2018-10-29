# Topology

The Topology is a reusable graphical user interface that allows users to render a topology. It can be added to a container programmatically (widget) or as a component (React).


## Widget
The Topology widget is added to a container by creating an *instance* of the Topology widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the Topology widget will be built. For example, to add a Topology widget in the testContainer container:

```javascript
    var graphTopology = TopologyWidget.getInstance({
        ...
        "container": testContainer
        ...
    });
    graphTopology.build();
    
    var treeTopology = TopologyWidget.getInstance({
       ...
       "container": testContainer
       ...
    }, "tree");
    treeTopology.build();
     
    var chordTopology = TopologyWidget.getInstance({
        ...
        "container": testContainer
        ...
    }, "chord");
    chordTopology.build();
```

Any update required after the Topology widget is built can be done using the methods exposed by the widget.

More details can be found at [Topology Widget](public/assets/js/widgets/topology/topology.md)


## React
The topology can be rendered using the Topology component and configured using a set of properties.

```javascript
    <Topology
        data={this.dataStore.get()}
        icons={this.state.icons}
    />
```

More details can be found at [Topology React Component](public/assets/js/widgets/topology/react/topology.md)