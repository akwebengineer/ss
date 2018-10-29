/**
 *  A View file required to to show all saved filters
 *
 *  @module alertDefinitions
 *  @author Dharma <adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define(['jquery',
		'backbone', 
		'../../../../ui-common/js/common/utils/filterGridConfig.js',
		'./conf/filterGridFormConfig.js',
		'widgets/grid/gridWidget',
		'widgets/form/formWidget',
		'../../../../ui-common/js/common/utils/SmUtil.js'
	], function($, Backbone, FilterConfig, FilterGridForm, GridWidget, FormWidget, SmUtil){
	
	var FilterPickerWidget = Backbone.View.extend({
		//
		initialize: function(options){
			console.log('initialised');
			this.context = this.options.context;
		},
		//
		render:function(){
			console.log('rendered');
			var me = this,
			    formConfig = new FilterGridForm(),
                formElements = formConfig.getValues();

            me.formWidget = new FormWidget({
                "elements": formElements,
                "container": this.el
            });
            me.formWidget.build();
            var toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay(80);
            me.$el.find('.showAllFilters').css('height',  toBePaddedHeight+ 'px');

            var gridContainer = me.$el.find('.showAllFilters').empty(),
                gridElements = new FilterConfig(me.context).getValues(),
                gridHeight =  $(gridContainer).height() - 180;
            gridElements['height'] = gridHeight + 'px';

            me.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements
            });

            me.gridWidget.build();
            return this;            
		},

		// Return the selected filter
		getSelectedFilters:function(){
			var selectedFilters = this.gridWidget.getSelectedRows();
			return selectedFilters;
		}
	});

	return FilterPickerWidget;
});