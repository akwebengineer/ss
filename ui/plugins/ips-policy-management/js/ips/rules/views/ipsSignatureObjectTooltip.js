/**
 * A tooltip view to show IPS Signature editor for IPS Rule
 *
 * @module IpsTooltipView
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
  'backbone',
  'widgets/tree/treeWidget',
  '../../../../../security-management/js/objects/models/ipsSigModel.js',
  '../../../../../security-management/js/objects/conf/ipsSig.js',
  '../../../../../ips-policy-management/js/ips/rules/constants/ipsRuleGridConstants.js'
    ],function(Backbone, TreeWidget, IpsSigModel,IPSSigJSON, IpsSigConstants){

    var IpsTooltipView = Backbone.View.extend({

        ipsSigTypeMap : {
          "static" : "Static Group",
          "dynamic" : "Dynamic Group",
          "anomaly" : "Protocol Anomaly",
          "signature" : "Signature",
          "chain" : "Compound Attack"
        },
        initialize: function(options){
            this.objectId = options.ObjId;
            this.renderTooltip = options.callback;
            this.model = new IpsSigModel();
            this.ipsSigJson = new IPSSigJSON();
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
                      return IpsSigConstants.IPS_SIG_URL +'/' + me.objectId;
                  }
                  return node.data['href'];
                },
                dataFilter: function(data) {
                  data = JSON.parse(data);

                  var ipsSigData = data['ips-signature'],
                      ipsSigflatValues = me.ipsSigJson.toFlatValues(ipsSigData);
                  if(!ipsSigData){
                    return;
                  }
                  var sigType = ipsSigData['sig-type'],
                      label = "<b>" + ipsSigData.name + "</b>: " + me.ipsSigTypeMap[sigType];
                  var nodes = {
                      data: ipsSigData,
                      id: ipsSigData.id,
                      text: label
                  };

                  if(sigType === "anomaly") {
                    me.updateChildrenForAnomaly(nodes,ipsSigflatValues);                   
                  }
                  else if(sigType === "chain") {
                    me.updateChildrenForChain(nodes,ipsSigflatValues);
                  }
                  else if(sigType === "static"){
                    me.updateChildrenForGroups(nodes,ipsSigflatValues);
                  }
                  return JSON.stringify(nodes);
                },
                ajaxOptions: {
                  headers: {
                      'Accept': IpsSigConstants.IPS_SIG_ACCEPT_HEADER,
                      "ContentType": IpsSigConstants.IPS_SIG_CONTENT_HEADER
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
        updateChildrenForAnomaly : function(nodes,ipsSigflatValues) {
          nodes.children = [];
          var me = this,
              member = ipsSigflatValues['anomaly-grid'],
              label = "<b>" + member.number + "</b>: " + member.anomaly;
          nodes.children[0] = me.getMemberNode(member,label,false);
        },
        updateChildrenForChain : function(nodes,ipsSigflatValues) {
            nodes.children = [];
            var me = this,
                members = ipsSigflatValues['anomaly-grid-array'],
                count = 0, i = 0,j, label;
            for (i = 0, j = members.length; i < j; i++, count++) {
                label = "<b>" + members[i].number + "</b>: " + members[i].anomaly;
                nodes.children[count] = me.getMemberNode(members[i],label,false);
            }
            members = ipsSigflatValues['grid-array'];
            for (i = 0, j = members.length; i < j; i++, count++) {
                label = "<b>" + members[i].number + "</b>: " + members[i].context;
                nodes.children[count] = me.getMemberNode(members[i],label,false);
            }
            var member = ipsSigflatValues['overlay-grid'];
            if(member) {
                label = "<b>" + member.number + "</b>: " + member.context;
                nodes.children[count] = me.getMemberNode(member,label,false);
            }  
        },
        updateChildrenForGroups : function(nodes,ipsSigflatValues) {
          nodes.children = [];
          var me = this,
              members = ipsSigflatValues['members'],
              i = 0, j,
              hasChildren, label;
          for (i = 0, j = members.length; i < j; i++) {
            var ipsMember = members[i];
            hasChildren = (ipsMember["sig-type"] === "static") ? true : false;
            label = "<b>" + ipsMember.name + "</b>: " + me.ipsSigTypeMap[ipsMember['sig-type']];
            nodes.children[i] = me.getMemberNode(ipsMember,label,hasChildren);
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
    return IpsTooltipView;
});