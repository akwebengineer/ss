define([
  'backbone',
  'widgets/form/formWidget',
  'widgets/tree/treeWidget',
  '../models/addressModel.js'
    ],function(Backbone, FormWidget, TreeWidget, AddressModel){

    var AddressTooltipView = Backbone.View.extend({
        events: {
            'click #tree-view-close': "close"
        },

        initialize: function(options){
            this.context = options.parentView.context;
            this.parentView = options.parentView;
            this.objectId = options.ObjId;
            this.objectTitle = options.ObjName;
            this.model = new AddressModel();
            this.model.set("id", this.objectId);
        },

        close: function(event) {
            if (event) {
                event.preventDefault();
                this.parentView.tooltipOverlay.destroy();
            }
        },

        render: function(){
            var self = this;
            var treeContainer = "address-tree";
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
                container: this.$el.find("#"+treeContainer),
                showCheckboxes: false,
                search: true,
                url: function(node) {
                  if (node.id == '#') {
                      return '/api/juniper/sd/address-management/addresses/' + self.objectId;
                  }

                  self.currentNodeId = node.id;
                  return node.data.href;
                },
                dataFilter: function(data) {
                  data = JSON.parse(data);


                  var hasChildren, label;
                  if(data.address["ip-address"]){
                    label = "<b>" + data.address.name + "</b>: " + data.address["ip-address"];
                  }else{
                    label = "<b>" + data.address.name + "</b>: "+ self.context.getMessage('tooltip_address_group');
                  }
                  var nodes = {
                      data: data.address,
                      id: self.currentNodeId == '#'?data.address.id: self.currentNodeId,
                      text: label
                  };

                  if (data.address.members) {
                      nodes.children = [];
                      for (var i = 0, j = data.address.members.member.length; i < j; i++) {
                        var addressMemeber = data.address.members.member[i];
                        hasChildren = (addressMemeber["address-type"] === "GROUP") ? true : false;
                        if(addressMemeber["ip-address"]){
                            label = "<b>" + addressMemeber.name + "</b>: " + addressMemeber["ip-address"];
                        }else{
                            label = "<b>" + addressMemeber.name + "</b>: Address Group";
                        }
                        nodes.children[i] = {
                            data: _.clone(addressMemeber), // Hold server data in separate property
                            text: label,     // The value to display in the tree
                            children: hasChildren                          // Set to true if there are children that need to be fetched on expand
                        };
                      }
                  }

                  return JSON.stringify(nodes);
                },
                ajaxOptions: {
                  headers: {
                      'Accept': "application/vnd.juniper.sd.address-management.address+json;version=1",
                      "ContentType": "application/vnd.juniper.sd.address-management.address+json;version=1;charset=UTF-8"
                  }
                },
                onLoad: function(){
                    var node = self.treeWidget.getNode('#');
                    self.treeWidget.expandNode(node.children);
                },

                onExpand: function(node){
                    console.log("node expanded " + node.id);
                },
                onCollapse: function(node){
                    console.log("node collapsed " + node.id);
                }
            }).build();

            return this;
        },


    });
    return AddressTooltipView;
});