/**
 *  History View
 *  
 *  @module EventViewer
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/history.html', 
	'../conf/configs.js', 'widgets/grid/gridWidget'], function(Backbone, render_template, HistoryTemplate, Configs, GridWidget){
	var HistoryView = Backbone.View.extend({

		initialize:function(options){
			console.log(options);
			var me=this;
			me.options = options;
		},

		render: function(){
			console.log('History view rendered');
			var me=this,
				configs = new Configs(me.options.context);
			//
			me.$el.append(render_template(HistoryTemplate));
			//
			new GridWidget({
				"container": this.$el.find('.ev-history-view'),
				"elements": configs.getHistoryGridConfig()
			}).build();
			//
			return this;
		}
		//
	});

	return HistoryView;
});