define([
  'backbone',
  'widgets/form/formWidget',
  'widgets/tree/treeWidget',
  '../models/serviceModel.js'
    ],function(Backbone, FormWidget, TreeWidget, ServiceModel){

    var ServiceTooltipView = Backbone.View.extend({
        events: {
            'click #tree-view-close': "close"
        },

        initialize: function(options){
            this.context = options.parentView.context;
            this.parentView = options.parentView;
            this.objectId = options.ObjId;
            this.objectTitle = options.ObjName;
            this.model = new ServiceModel();
            this.model.set("id", this.objectId);
        },

        close: function(event) {
            if (event) {
                event.preventDefault();
                this.parentView.tooltipOverlay.destroy();
            }
        },

        url: function(node) {
            var self = this;
            if (node.id == '#') {
                return '/api/juniper/sd/service-management/services/' + self.objectId;
            }
            self.currentNodeId = node.id;
            return node.data.href;
        },

        dataFilter: function(data) {
            var self = this;
            data = JSON.parse(data);
            var hasChildren, label;
            if (data.service["is-group"]) {
                label = "<b>" + data.service.name + "</b>: Service Group";
            } else {
                label = "<b>" + data.service.name + "</b>";
            }
            var nodes = {
                data: data.service,
                id: self.currentNodeId == '#'?data.service.id: self.currentNodeId,
                text: label
            };

            if (data.service.members) {
                nodes.children = [];
                for (var i = 0, j = data.service.members.member.length; i < j; i++) {
                    var serviceMemeber = data.service.members.member[i];
                    hasChildren = serviceMemeber["is-group"];
                    if(serviceMemeber["is-group"]){
                        label = "<b>" + serviceMemeber.name + "</b>: "+ self.context.getMessage('tooltip_service_group');
                    }else{
                        label = "<b>" + serviceMemeber.name + "</b>";
                    }
                    nodes.children[i] = {
                        data: _.clone(serviceMemeber), // Hold server data in separate property
                        text: label,     // The value to display in the tree
                        children: hasChildren                          // Set to true if there are children that need to be fetched on expand
                    };
                }
            }
            return JSON.stringify(nodes);
        },

        onLoad: function(){
            var self = this;
            console.log("tree loaded");
            var node = self.treeWidget.getNode('#');
            self.treeWidget.expandNode(node.children);
        },

        onExpand: function(node){
            console.log("node expanded " + node.id);
        },

        onCollapse: function(node){
            console.log("node collapsed " + node.id);
        },

        render: function(){
            var self = this;
            var treeContainer = "service-tree";
            var formElements = {
                    "title": this.objectTitle,
                    "on_overlay": true,
                    "form_id": "tree-view-form",
                    "form_name": "tree-view-form",
                    "sections": [{
                        "elements": [{
                            "element_description": true,
                            "id": treeContainer,
                            "name": treeContainer
                        }]
                    }],
                    "buttonsAlignedRight": true,
                    "buttons": [
                        {
                            "id": "tree-view-close",
                            "name": "close",
                            "value": this.context.getMessage('close')
                        }
                    ]
            };

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();

            this.currentNodeId = '#';
            this.treeWidget = new TreeWidget({
                container: this.$el.find("#" + treeContainer),
                showCheckboxes: false,
                search: true,
                url: $.proxy(this.url, this),
                dataFilter: $.proxy(this.dataFilter, this),
                ajaxOptions: {
                    headers: {
                        'Accept': "application/vnd.juniper.sd.service-management.service+json;version=1;q=0.01",
                        "ContentType": "application/vnd.juniper.sd.service-management.service+json;version=1;charset=UTF-8"
                    }
                },
                onLoad: $.proxy(this.onLoad, this),
                onExpand: $.proxy(this.onExpand, this),
                onCollapse: $.proxy(this.onExpand, this)
            }).build();
            return this;
        },
    });
    return ServiceTooltipView;
});