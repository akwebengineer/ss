/**
 * A tooltip view to show source and destination portsets for NAT Rule
 *
 * @module PortSetTooltipView
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'backbone',
  '../../port-sets/models/portSetsModel.js'
    ],function(Backbone, PortSetModel){

    var PortSetTooltipView = Backbone.View.extend({

        initialize: function(options){
            this.objectId = options.ObjId;
            this.renderTooltip = options.callback;
            this.model = new PortSetModel();
            this.model.set("id", this.objectId);
        },

        render: function(){
            var me = this;

            this.model.fetch({
                    success: function (record, response, options) {
                        if(!record){
                          return;
                        }
                        var label = "<span><b>" + record.get('name') + "</b>: "+ record.get('ports') + "</span>";
                        me.renderTooltip(label);                   
                    },
                    error: function (collection, response, options) {
                        console.log('Port Set Model not fetched');
                    }
            });
        }    

    });
    return PortSetTooltipView;
});