define([
	'widgets/form/formWidget',
	'../conf/policyCompareDialogConfig.js'
], function (FormWidget, FormConfig) {

	var PolicyCompareDialog = Backbone.View.extend({
    	initialize: function(options) {
    		var me = this;
			me.options = options;
    	},

        render: function () {
        	var me = this,
        		formWidget = new FormWidget({
					container: me.el,
                	elements: new FormConfig(me.context).getValues()
            	}).build();

            return me;
        }
    });

    return PolicyCompareDialog;
});
