/**
 *  File for Run Report View
 *
 *  @module Reports
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2016
 * */
define(['backbone',
        'widgets/form/formWidget',
	    '../conf/runReportConfig.js'
	    ],
function( Backbone, FormWidget, Configs) {

	var RunReportView = Backbone.View.extend({

  		initialize:function(options){
			console.log(options);
			var me = this;
			me.activity = this.options.activity;
			me.context = this.options.context;
		},

		render: function(){
			console.log('Run Report view rendered');
			var me = this;
			me.configs = new Configs(this.context);
			var formElements = me.configs.getValues();

            me.formWidget = new FormWidget({
                container: this.el,
                elements: formElements
            });
            me.formWidget.build();

			return this;
		}
	});

	return RunReportView;
});