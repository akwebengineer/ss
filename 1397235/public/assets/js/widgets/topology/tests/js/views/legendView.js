/** TEST Module that defines the legend view for topology example
* @copyright Juniper Networks, Inc. 2017
*/

define([
	'backbone',
    'text!../../templates/fsTopoLegendTemplate.html'
], function(Backbone, legendTemplate) {
    'use strict';
    var LegendView = Backbone.View.extend({
        render: function(){
            this.$el.append(legendTemplate);
            return this.$el.html();
        }
    });
    return LegendView;
});