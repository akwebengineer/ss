/**
 *  Time Span View for create/modify alert definition
 *
 *  @module AlertDefinition
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/timeSpanTemplate.html',
	'../../../sd-common/js/common/widgets/filterWidget/filterWidget.js'],
function( Backbone, render_template, TimeSpanTemplate, FilterWidget){

	var TimeSpanView = Backbone.View.extend({

		initialize:function(options){
			console.log(options);
			var me = this;
			me.options = options;
			this.render();
		},

		render: function(){
			console.log('time span template is rendered');
			var me=this;

            var timeSpanHtml = render_template(TimeSpanTemplate);
            me.$el.append(timeSpanHtml);

            var filterContainer = me.$el.find('#filter_bar_container').addClass("elementinput-long");

            me.filterWidget = new FilterWidget({
                "el":  filterContainer,
                "activity": me.options.activity,
                "context": me.options.context
            });

            me.filterWidget.render();

          	return this;
		}

	});

	return TimeSpanView;
});