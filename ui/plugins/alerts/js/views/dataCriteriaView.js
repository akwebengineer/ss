/**
 *  Data Criteria View for create/modify alert definition
 *
 *  @module AlertDefinition
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/dataCriteriaTemplate.html'],
function( Backbone, render_template, DataCriteriaTemplate){

	var DataCriteriaView = Backbone.View.extend({

		initialize:function(options){
			console.log(options);
		
			this.options = options;
			this.activity = options.activity;
			this.context = options.context;
			this.render();
		},

		render: function(){
			console.log('Data Criteria template is rendered');
			var me=this;

            var dataCriteriaHtml = render_template(DataCriteriaTemplate);
            me.$el.append(dataCriteriaHtml);
            
            return this;
		}

	});

	return DataCriteriaView;
});