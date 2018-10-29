/**
 * EV Settings View
 * @module Event Viewer
 * @author Anupama<athreyas@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', 'lib/template_renderer/template_renderer', 
	'widgets/form/formWidget', '../conf/settingsFormConfig.js'
], function(Backbone, TemplateRenderer, FormWidget, SettingsConfig){
	//
	var SettingsView = Backbone.View.extend({
		initialize:function(options){
			var me = this, selections = options.selections;
			me.configs = new SettingsConfig(options.context);
			me.configs.resolveIPSelection = selections.resolveIPSelection;
			me.configs.logsPlaceHolder = selections.logsPlaceHolder;
			me.configs.utcTimeSelection = selections.utcTimeSelection;
			me.configs.localTimeSelection = selections.localTimeSelection;
			return this;
		},

		getTimeZone : function(){
			var val = $('input[name="timeZone"]:checked').val(), zone = 'Local';
			if(val == "2")
				zone = 'UTC';
			return zone;		
		},

		isResolveIP : function(){
			var resolve = this.$el.find('#resolveIP').is(':checked');
			return resolve;
		},

		getNumberOfLogs : function(){
			return this.configs.logsPlaceHolder;
		},

		render:function(){
			var me = this;

			var formElements = me.configs.getValues(),
                settingsForm = new FormWidget({
                	container: me.el,
                	elements: formElements
              	}).build(); 

			return me;
		}
	});
	//
	return SettingsView;
});