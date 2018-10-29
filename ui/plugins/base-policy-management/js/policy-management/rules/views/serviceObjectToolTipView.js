define([
  'backbone',
  'widgets/tree/treeWidget',
  '../../../../../object-manager/js/objects/models/serviceModel.js',
  '../../../../../object-manager/js/objects/conf/protocolTypes.js'
    ],function(Backbone, TreeWidget, ServiceModel, ProtocolTypes){

    var ServiceTooltipView = Backbone.View.extend({

        initialize: function(options){
            this.objectId = options.ObjId;
            this.renderTooltip = options.callback;
            this.model = new ServiceModel();
            this.model.set("id", this.objectId);
        },

        render: function(){
            var me = this;

            this.treeWidget = new TreeWidget({
                container: me.$el,
                showCheckboxes: false,
                search: true,
                url: function(node) {
                  if (node.id == '#') {
                      return '/api/juniper/sd/service-management/services/' + me.objectId;
                  }

                  return node.data['href'];
                },
                dataFilter: function(data) {
                  data = JSON.parse(data);


                  var hasChildren, label;
                  if(data.service["is-group"]){
                    label = "<b>" + data.service.name + "</b>: Service Group";
                    if (data.service.name === "Any")
                      label = "<b>" + data.service.name + "</b>: Any Type";          
                  }else{
                      //label = "<b>" + data.service.name + "</b>: " + data.service["ip-address"];
                      // label = "<b>" + data.service.name;

                    if (data.service.name === "Any") {
                      label = "<b>" + data.service.name + "</b>: Any Type";  
                    } else {
                      var protocol = data.service.protocols.protocol;
                      var type = protocol[0]["protocol-type"];
                      var port = protocol[0]["dst-port"] || "";

                      for (var index=0; index < ProtocolTypes.length; index++) {
                          if (ProtocolTypes[index].value === type) {
                              type = ProtocolTypes[index].label;
                          }
                      }

                      var serviceName = "<b>" + data.service.name + ": </b>";
                      label = (protocol.length > 1) ? serviceName + type + "/" + port + " (+)": serviceName + type + "/" + port;
                    }
                  }
                  var nodes = {
                      data: data.service,
                      id: data.service.id,
                      text: label
                  };

                  if (data.service.members) {
                      nodes.children = [];
                      for (var i = 0, j = data.service.members.member.length; i < j; i++) {
                        var serviceMemeber = data.service.members.member[i],
                        //hasChildren = (serviceMemeber["service-type"] === "GROUP") ? true : false;
                        hasChildren = (serviceMemeber["is-group"]) ? true : false;
                        if(serviceMemeber["is-group"]){
                            label = "<b>" + serviceMemeber.name + "</b>: Service Group";
                            if (data.service.name === "Any")
                              label = "<b>" + data.service.name + "</b>: Any Type";                           
                        }else{
                              //label = "<b>" + serviceMemeber.name + "</b>: " + serviceMemeber["ip-address"];
                              label = "<b>" + serviceMemeber.name;
                        }
                        nodes.children[i] = {
                            data: _.clone(serviceMemeber), // Hold server data in separate property
                            id: serviceMemeber.id,         // Will be generated if not provided
                            text: label,     // The value to display in the tree
                            children: hasChildren                          // Set to true if there are children that need to be fetched on expand
                        }
                      }
                  }

                  return JSON.stringify(nodes);
                },
                ajaxOptions: {
                  headers: {
                      'Accept': "application/vnd.juniper.sd.service-management.service+json;version=1;q=0.01",
                      "ContentType": "application/vnd.juniper.sd.service-management.service+json;version=1;charset=UTF-8"
                  }
                },
                onLoad: function(){
                    console.log("tree loaded");
                   var node = me.treeWidget.getNode('#');
                   me.treeWidget.expandNode(node.children);

                    me.renderTooltip(me.$el);
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
    return ServiceTooltipView;
});