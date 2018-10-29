/**
 * A tooltip view to show ZoneSet in Ingress/Egress editors for NAT Rule
 *
 * @module zoneSetTooltipView
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
  'backbone',
  'widgets/tree/treeWidget',
  '../../../../../object-manager/js/objects/models/zoneSetModel.js',
  '../constants/natRuleGridConstants.js'
    ],function(Backbone, TreeWidget, ZoneSetModel, NATRuleGridConstants){

    var ZoneSetTooltipView = Backbone.View.extend({

        initialize: function(options){
            this.objectId = options.ObjId;
            this.renderTooltip = options.callback;
            this.model = new ZoneSetModel();
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
                      return NATRuleGridConstants.ZONESET_URL +'/' + me.objectId;
                  }
                  return node.data['href'];
                },
                dataFilter: function(data) {
                  data = JSON.parse(data);

                  var zoneSet = data['zone-set'];
                  if(!zoneSet){
                    return;
                  }
                  var label = "<b>" + zoneSet.name + "</b> ";
                  var nodes = {
                      data: zoneSet,
                      id: zoneSet.id,
                      text: label
                  };

                  me.updateZones(nodes,zoneSet);                   
                  
                  return JSON.stringify(nodes);
                },
                ajaxOptions: {
                  headers: {
                      'Accept': NATRuleGridConstants.ZONESET_ACCEPT_HEADER,
                      "ContentType": NATRuleGridConstants.ZONESET_CONTENT_HEADER
                  }
                },
                onLoad: function(){
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
        updateZones : function(nodes,zoneSet) {
          nodes.children = [];
          var me = this,
              zones = zoneSet['zones'],
              zoneArr = [], label;
          if(zones)
            zoneArr = zones.split(",");
          for(var i = 0; i < zoneArr.length; i++) {
            label = zoneArr[i];
            nodes.children[i] = me.getMemberNode(zoneArr[i],label,false);
          }  
        },
        getMemberNode : function(member,label,hasChildren) {
          return {
            data: _.clone(member), // Hold server data in separate property
            id: member.id,  // Will be generated if not provided       
            text: label,   // The value to display in the tree  
            children: hasChildren // Set to true if there are children that need to be fetched on expand
          };
        }
    });
    return ZoneSetTooltipView;
});