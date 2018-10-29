/**
 * A Filters Grid Config for Log Report Definition
 *
 * @module ReportsDefinition
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['jquery',
		'backbone',
		'../conf/filtersGridFormConfig.js',
        '../../../ui-common/js/common/utils/filterGridConfig.js',
		'widgets/form/formWidget',
		'widgets/grid/gridWidget',
		'../../../ui-common/js/common/utils/SmUtil.js'
	], function($, Backbone, FiltersGridForm, FiltersGridConfig, FormWidget, GridWidget, SmUtil){

	var FiltersGridView = Backbone.View.extend({

		initialize: function(options){
		    console.log('Filters Grid View is initialized');
            console.log(options);
            this.options = options;
            this.context = options.context;
            //self.model = options.model;
        },

		render:function(){
			console.log('Filters Grid View is rendered');

            var me = this,
                formConfig = new FiltersGridForm(me.context),
                formElements = formConfig.getValues();
                gridConfig = new FiltersGridConfig(me.context),
                gridElements = gridConfig.getValues(false);//set isSingleSelect = false

            me.formWidget = new FormWidget({
                "elements": formElements,
                "container": this.el
            });
            me.formWidget.build();
            var toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay(80);
            me.$el.find('.showAllFilters').css('height',  toBePaddedHeight+ 'px');

            var gridContainer = me.$el.find('.showAllFilters').empty(),
                gridHeight =  $(gridContainer).height() - 180;
            gridElements['height'] = gridHeight + 'px';

            me.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements
            });

            this.gridWidget.build();

            return this;
		},

		// Return the selected filter
		getSelectedFilters:function(){
			var selectedFilters = this.gridWidget.getSelectedRows();
			return selectedFilters;
		}
	});

	return FiltersGridView;
});