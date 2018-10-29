define([
	'widgets/form/formWidget',
	'../conf/ruleChangeFormConfig.js'
], function (FormWidget, FormConfig) {

	var RuleChangeView = Backbone.View.extend({
        render: function () {
        	var me = this,
        		formWidget = new FormWidget({
					container: me.el,
                	elements: new FormConfig(me.context).getValues()
            	}).build();

            return me;
        }
    });

    return RuleChangeView;
});
