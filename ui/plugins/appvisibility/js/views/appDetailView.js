define([
	'backbone',
	'widgets/form/formWidget',
	'../conf/appDetailFormConfiguration.js'],
	function(Backbone, FormWidget, FormConfig){
	var AppDetailView = Backbone.View.extend({

		events: {
            'click #detail-view-close': "cancel"
        },

		initialize: function(options){
			var me=this;
			me.context = options.context;
			me.activity = options.activity;
		},
		render: function() {
			var me = this;
			formWidget = new FormWidget({
                container: me.el,
                elements: new FormConfig(me.context).getValues(),
                values: me.model.attributes
            }).build();
			return me;
		},
		cancel: function(event) {
				if(event){
				    event.preventDefault();
	                this.activity.overlayWidgetObj.destroy();
            	}
        }

	});
	return AppDetailView;
});