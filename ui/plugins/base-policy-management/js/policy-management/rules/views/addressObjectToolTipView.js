define([
  'backbone',
  'widgets/tree/treeWidget',
  '../../../../../object-manager/js/objects/models/addressModel.js'
    ],function(Backbone, TreeWidget, AddressModel){

    var AddressTooltipView = Backbone.View.extend({

        initialize: function(options){
            this.objectId = options.ObjId;
            this.renderTooltip = options.callback;
            this.model = new AddressModel();
            this.model.set("id", this.objectId);
        },

        render: function(){
            var me = this;

            //require this injection because app needs to use it own css
            this.$el.addClass("security-management");
            this.$el.append("<div id = 'rulegrid-addressToolTip' class='rulegrid-addressToolTip'></div>");
            var tooltipContainer = this.$el.find("#rulegrid-addressToolTip");

            this.treeWidget = new TreeWidget({
                container: tooltipContainer,
                showCheckboxes: false,
                search: true,
                url: function(node) {
                  if (node.id == '#') {
                      return '/api/juniper/sd/address-management/addresses/' + me.objectId;
                  }

                  return node.data['href'];
                },
                dataFilter: function(data) {
                  data = JSON.parse(data);


                  var hasChildren, label,
                      anyAddrArr = ["ANY", "ANY_IPV4", "ANY_IPV6"];
                  if(data.address["ip-address"]){
                    label = "<b>" + data.address.name + "</b>: " + data.address["ip-address"];
                  }else{
                    if (data.address['address-type'] === "DNS") {
                      label = "<b>" + data.address.name + "</b>: DNS address";
                    } else {
                      label = "<b>" + data.address.name + "</b>: Address Group";
                      console.log("address type: " + data.address['address-type']);
                       if(_.indexOf(anyAddrArr,data.address['address-type']) > -1) {
                        label = "<b>" + data.address.name + "</b>: "+data.address.name+" Type";
                       } 
                    }
                  }
                  var nodes = {
                      data: data.address,
                      id: data.address.id,
                      text: label
                  };

                  if (data.address.members) {
                      nodes.children = [];
                      for (var i = 0, j = data.address.members.member.length; i < j; i++) {
                        var addressMemeber = data.address.members.member[i],
                        hasChildren = (addressMemeber["address-type"] === "GROUP") ? true : false;
                        if(addressMemeber["ip-address"]){
                            label = "<b>" + addressMemeber.name + "</b>: " + addressMemeber["ip-address"];
                        }else{
                            if (data.address['address-type'] === "DNS") {
                              label = "<b>" + data.address.name + "</b>: DNS address";
                            } else {
                              label = "<b>" + addressMemeber.name + "</b>: Address Group";
                              console.log("address type: " + data.address['address-type']);
                              if(_.indexOf(anyAddrArr,data.address['address-type']) > -1) {
                                label = "<b>" + data.address.name + "</b>: "+data.address.name+" Type";
                              }  
                            }
                        }
                        nodes.children[i] = {
                            data: _.clone(addressMemeber), // Hold server data in separate property
                            id: addressMemeber.id,         // Will be generated if not provided
                            text: label,     // The value to display in the tree
                            children: hasChildren                          // Set to true if there are children that need to be fetched on expand
                        }
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
//                    console.log("tree loaded");
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
//            this.model.fetch(
//                success: function(model, response, options){
//                    var address = response["address"],
//                    addressType = address["address-type"],
//                    addressName = address["name"],
//                    members = address["members"],
//                    hasGroup = false, elements = "", count=0;
//                    elements = "<div><span style:'font:bold'>" + addressName + "</span></div><dl>";
//                    members.forEach(function(object){
//                        if(count === 3){
//                            return;
//                        }
//                        if(object["address-type"] == "GROUP" && !hasGroup{
//                            hasGroup = true;
//                        }
//                        elements += "<dt>" + object.name + "</dt>";
//                        count++
//                    });
//                    if(hasGroup){
//                        elements += "</dl>"
//                    }
//                },
//                error: function(model, response, options){
//                }
//            );
            return this;
        },


    });
    return AddressTooltipView;
});