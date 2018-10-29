/**
 * A view to show the tree widget
 *
 * @module TreeView
 * @author Brian Duncan <bduncan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/tree/conf/configurationSample',
    'widgets/tree/treeWidget',
    'widgets/tree/tests/server',
    'text!widgets/tree/tests/templates/treeExample.html',
    'lib/template_renderer/template_renderer'
], function(Backbone, treeConf, TreeWidget, MockServer,example, render_template) {



    var TreeView = Backbone.View.extend({
        events :{
            'click .tree-remote-search' : 'search',
            'click .tree-remote-reset': 'clearSearch',
            'click .tree-new-search' : 'newSearch',
            'click .tree-new-reset': 'newClearSearch',
            'click .tree-local-search' : 'localSearch',
            'click .tree-local-reset': 'clearLocalSearch',
        },
        initialize: function(){
            !this.options.pluginView && this.render();
        },
        render: function() {
            this.addContent(this.$el, example);
            this.buildTrees();

            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));

        },

        buildTrees: function() {
            this.buildLocalTree();
            this.buildRemoteTree();
            this.newTree();
        },

        buildLocalTree: function() {
            this.localTree = new TreeWidget(_.extend(
                treeConf.local,
                {
                    container: this.$el.find('#tree-local').get()[0],
                    showCheckboxes: true
                }
            )).build();
        },

        buildRemoteTree: function() {
            MockServer.start();

            this.remoteTree = new TreeWidget(_.extend(
                treeConf.remote,
                {
                    container: this.$el.find('#tree-remote').get()[0],
                    showCheckboxes: true
                }
            )).build();
        },
        newTree: function() {
            this.newTree = new TreeWidget(_.extend(
                treeConf.local,
                {
                    container: this.$el.find('#tree-new').get()[0],
                    showCheckboxes: false
                }
            )).build();
        },

        search: function() {
            this.remoteTree.filter('orpheus');
        },

        clearSearch: function() {
            this.remoteTree.removeFilter();
        },
        newSearch: function() {
            this.newTree.filter('orpheus');
        },

        newClearSearch: function() {
            this.newTree.removeFilter();
        },

        localSearch: function() {
            this.localTree.filter('orpheus');
        },

        clearLocalSearch: function() {
            this.localTree.removeFilter();
        }

    });

    return TreeView;
});