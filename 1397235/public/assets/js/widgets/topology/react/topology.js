/**
 * A module that builds a Topology React component.
 *
 * @module Topology
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/topology/topologyWidget'
], function (React, ReactDOM, PropTypes, TopologyWidget) {

    class Topology extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            this.$el = $(this.el);
            const { type } = this.props;
            this.topologyWidget = TopologyWidget.getInstance(_.extend({
                    container: this.el
                }, this.props
            ), type).build();

            this.$el.bind("slipstream.topology.node:click", (e, data) => {
                this.props.onNodeClick(e, data);
            });
            this.$el.bind("slipstream.topology.node:mouseOver", (e, data) => {
                this.props.onNodeMouseOver(e, data);
            });
            this.$el.bind("slipstream.topology.node:mouseOut", (e, data) => {
                this.props.onNodeMouseOut(e, data);
            });

            this.$el.bind("slipstream.topology.link:click", (e, data) => {
                this.props.onLinkClick(e, data);
            });
            this.$el.bind("slipstream.topology.link:mouseOver", (e, data) => {
                this.props.onLinkMouseOver(e, data);
            });
            this.$el.bind("slipstream.topology.link:mouseOut", (e, data) => {
                this.props.onLinkMouseOut(e, data);
            });
        }

        componentDidUpdate(prevProps) {
            if (this.props.data !== prevProps.data) {
                _.extend(prevProps.data, this.props.data);
                this.topologyWidget._updateConfiguration(prevProps);
            }
        }

        componentWillUnmount() {
            this.topologyWidget.destroy();
        }

        render() {
            return (
                <div ref={el => this.el = el}>
                    {this.props.children}
                </div>
            );
        }

    }

    Topology.propTypes = {
        data: PropTypes.object,
        icons: PropTypes.object,
        viewerDimensions: PropTypes.object,
        showArrowHead: PropTypes.bool,
        allowZoomAndPan: PropTypes.bool,
        legend: PropTypes.string,
        tooltip: PropTypes.object,
        onNodeClick: PropTypes.func,
        onNodeMouseOver: PropTypes.func,
        onNodeMouseOut: PropTypes.func,
        onLinkClick: PropTypes.func,
        onLinkMouseOver: PropTypes.func,
        onLinkMouseOut: PropTypes.func
    };

    Topology.defaultProps = {
        onNodeClick: ()=>{},
        onNodeMouseOver: ()=>{},
        onNodeMouseOut: ()=>{},
        onLinkClick: ()=>{},
        onLinkMouseOver: ()=>{},
        onLinkMouseOut: ()=>{}
    };

    return Topology;
});