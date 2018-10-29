/**
 * A view that uses the Topology component to render a tree / graph / chord visual using React.
 *
 * @module Topology Component View
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/topology/react/topology',
    'widgets/topology/tests/conf/topologyConfiguration',
    'text!widgets/topology/tests/templates/fsTopoLegendTemplate.html',
    'text!widgets/topology/tests/templates/forceDirectedLegendTemplate.html',
    'text!widgets/topology/tests/templates/chordViewLegendTemplate.html',
    'widgets/topology/lib/flat/flatDataStore',
    'widgets/topology/lib/tree/treeDataStore'
], function (React, ReactDOM, Topology, topologyConfiguration, legendTemplateTree, legendTemplateForce, legendTemplateChord, FlatDataStore, TreeDataStore) {

    class GraphTopologyComponentView extends React.Component {
        constructor(props) {
            super(props);
            var topologyIcons,
                legendTemplate;
            if(props.type == "graph") {
                this.dataStore = new FlatDataStore(topologyConfiguration.networkTopologyData);
                topologyIcons = topologyConfiguration.forceDirectedTopologyIcons;
            }
            else if(props.type == "chord") {
                this.dataStore = new FlatDataStore(topologyConfiguration.forceDirectedTopologyData);
                topologyIcons = topologyConfiguration.forceDirectedTopologyIcons;
            } else {
                this.dataStore = new TreeDataStore(topologyConfiguration.fileTopologyData);
                topologyIcons = topologyConfiguration.fileTopologyIcons;
            }

            if(props.type == "tree") {
                legendTemplate = legendTemplateTree;
            } else if (props.type == "graph") {
                legendTemplate = legendTemplateForce;
            } else if (props.type == "chord") {
                legendTemplate = legendTemplateChord;
            }

            this.state = {
                data: this.dataStore.get(),
                icons: topologyIcons,
                container: this.el,
                viewerDimensions: {
                    width: window.innerWidth - 100,
                    height: window.innerHeight - 100
                },
                showArrowHead: true,
                allowZoomAndPan: true,
                legend: legendTemplate,
                tooltip:  {
                    "onHover": this.tooltipCb
                },
                edit: true,
                appSelectedNode: '',
                appData:'',
                appQueryId: '',
                appQueryFilter: '',
                type: props.type
            };

            this.handleNodeClick = this.handleNodeClick.bind(this);
            this.handleLinkClick = this.handleLinkClick.bind(this);
            this.updateNode = this.updateNode.bind(this);
            this.getData = this.getData.bind(this);
            this.addNode = this.addNode.bind(this);
            this.deleteNode = this.deleteNode.bind(this);

            //App handlers
            this.handleChangeSelectedNode = this.handleChangeSelectedNode.bind(this);
            this.handleChangeAppQueryId = this.handleChangeAppQueryId.bind(this);
            this.handleChangeAppQueryFilter = this.handleChangeAppQueryFilter.bind(this);
        }

        handleChangeSelectedNode (event) {
            this.setState({appSelectedNode: event.target.value})
        }

        handleChangeAppQueryId (event) {
            this.setState({appQueryId: event.target.value})
        }

        handleChangeAppQueryFilter (event) {
            this.setState({appQueryFilter: event.target.value})
        }

        handleNodeClick(e, node) {
            console.info("Node " + node.id + " was clicked");
            this.setState({appSelectedNode: JSON.stringify(node)})
        }

        handleNodeMouseOver(e, node) {
            //An optional method for apps to handle node mouse over.
        }

        handleNodeMouseOut(e, node) {
            //An optional method to handle node mouse out.
        }

        handleLinkClick(e, link) {
            console.info("Link " + link.id + " was clicked");
            this.setState({appSelectedNode: JSON.stringify(link)})
        }

        handleLinkMouseOver(e, link) {
            //An optional method for apps to handle link mouse over.
        }

        handleLinkMouseOut(e, link) {
            //An optional method for apps to handle link mouse out.
        }

        updateNode() {
            if(!this.state.appSelectedNode) return;
            console.info("updateNode called from ForceDirectedView");
            this.dataStore.put(JSON.parse(this.state.appSelectedNode));
            this.setState({data: this.dataStore.get()})
        }

        getData () {
            var idToQuery = this.state.appQueryId;
            var filterToQuery = this.state.appQueryFilter;
            if(idToQuery) {
                this.setState({appSelectedNode: JSON.stringify(this.dataStore.get(idToQuery))})
            } else if (filterToQuery) {
                var results = this.dataStore.filter(JSON.parse(filterToQuery));
                this.setState({appSelectedNode: JSON.stringify(results)})
            }else {
                this.setState({appData: JSON.stringify(this.dataStore.get())})
            }
        }

        addNode () {
            if(!this.state.appSelectedNode) return;
            console.info("addNode called from ForceDirectedView");
            var node = JSON.parse(this.state.appSelectedNode);
            if(this.state.type == "chord" || this.state.type == "graph") {
                this.dataStore.add(node);
            } else if (this.state.type == "tree") {
                this.dataStore.add(node.id, node.children);
            }
            this.setState({data: this.dataStore.get()})
        }

        deleteNode () {
            if(!this.state.appSelectedNode) return;
            console.info("deleteNode called from ForceDirectedView");
            var node =  JSON.parse(this.state.appSelectedNode);
            this.dataStore.remove(node.id);
            this.setState({data: this.dataStore.get()})
        }

        tooltipCb (elementType, elementObj, renderTooltip) {
            if (elementType == 'NODE') {
                var tooltip_data;
                tooltip_data = "<span style='color:steelblue'> Name: " + elementObj.name + "<br/><span> <span style='color: lightsteelblue'> Type: " + elementObj.type + "</span>";
                renderTooltip(tooltip_data);
            }
        }

        render() {
            return (
                <div>
                    <div className="topology_data_controls">
                        <textarea value={this.state.appData}/>
                        <button onClick={this.getData}>Get Data</button>
                        <span style={{display: 'inline-block'}}>
                          <input type="text" value={this.state.appQueryId}  onChange={this.handleChangeAppQueryId} placeholder="id"/>
                          <input type="text" value={this.state.appQueryFilter}  onChange={this.handleChangeAppQueryFilter} placeholder="filter"/>
                        </span>
                        <textarea value={this.state.appSelectedNode} onChange={this.handleChangeSelectedNode}/>
                        <button onClick={this.updateNode}>Update</button>
                        <button onClick={this.addNode}>Add</button>
                        <button onClick={this.deleteNode}>Remove</button>
                    </div>

                    <Topology
                        data={this.state.data}
                        icons={this.state.icons}
                        viewerDimensions={this.state.viewerDimensions}
                        showArrowHead={this.state.showArrowHead}
                        allowZoomAndPan={this.state.allowZoomAndPan}
                        legend={this.state.legend}
                        tooltip={this.state.tooltip}
                        onNodeClick={this.handleNodeClick}
                        onNodeMouseOver={this.handleNodeMouseOver}
                        onNodeMouseOut={this.handleNodeMouseOut}
                        onLinkClick={this.handleLinkClick}
                        onLinkMouseOver={this.handleLinkMouseOver}
                        onLinkMouseOut={this.handleLinkMouseOut}
                        type={this.state.type}
                        edit={this.state.edit}
                    />
                </div>


            );
        }
    };

    return GraphTopologyComponentView;
});