/**
 *  Saved Filters View
 *  
 *  @module EventViewer
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', '../conf/configs.js', 'widgets/form/formWidget', 'widgets/grid/gridWidget',
    '../conf/savedFiltersConfig.js', '../models/recentFiltersCollection.js', '../../../../ui-common/js/common/utils/SmUtil.js',
    'text!../templates/savedFiltersGridInjectorTemplate.html', 'lib/template_renderer/template_renderer'],
	function( Backbone, Configs, FormWidget, GridWidget, FiltersConfig,
	    RecentFiltersCollection, SmUtil, InjectorTemplate, render_template){

	var SavedFiltersView = Backbone.View.extend({

		events: {
            'click #apply-filter': "applyFilter",
            'click .ev-recent-filters': "onRecentFilterClick",
            'click #cancel-filter': "cancel",
            'click .ev-all-filters-checkbox': "allFiltersClick"
        },

        initialize:function(options){
			console.log(options);
			this.activity = this.options.activity;
            this.context = this.options.context;
            this.configs = new Configs(this.context);
            this.category = this.options.eventCategory;
            this.configs = new Configs(this.context);
            this.actionEvents = {
                deleteEvent: "deleteAction"
            };
            this.showAllFilters = false;
           // this.bindGridEvents();
		},

        //
        allFiltersClick : function(){
            var me = this, checkbox = me.$el.find('.ev-all-filters-checkbox');
                
            me.configs.filterTag = this.configs.getCategoryFilterString(this.category);

            if(checkbox.is(':checked')){
                me.showAllFilters = true;
                me.configs.filterTag = "";
            } else {
                me.showAllFilters = false;
            }
            this.filtersGrid.reloadGrid();
        },

		render: function(){
			console.log('Saved filters view rendered');
			var me = this,
                filterObj = {},
                href, linkList ="";

            $.when(me.getRecentFilters()).done(function(collection){
                me.recentFiltersCollection = collection;
                collection.each(function(model, index){
                    href = '#'+ model.get('filter-name');
                    name = model.get('filter-name');
                    filter_id = model.get('id');

                    href = "<a class='ev-recent-filters' href='"+href+"' name = '"+name+"' filter-id = '"+filter_id +"' style='font-size: 12px; color: #33B0F6; text-transform: capitalize; padding-bottom:5px; display:block;'>"+name+"</a>";
                    if(typeof(href != 'undefined')) {
                        linkList += href;
                    }
                });
                me.$el.find('#recent_filters').html(linkList);
            });

            filterObj = {
                "category" : this.category
            };

		    var formConfigs = new FiltersConfig(this.context),
                formElements = formConfigs.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: filterObj
            });
            this.formWidget.build();
            var toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay(160);
            this.$el.find('.ev-saved-filters-section').css('height',  toBePaddedHeight+ 'px');
            this.$el.find('.saved-filters-grid-container').css('height',  toBePaddedHeight+ 'px');

            // Calling Filters Grid
            this.buildSavedFiltersGrid();

            return this;
		},
	   /**
        * Creates Saved Filters grid
        */
        buildSavedFiltersGrid: function () {
            var filterGridContainer = this.$el.find('.saved-filters-grid-container').empty(),
                gridElements, gridHeight =  $(filterGridContainer).height() - 130,
                enableAllFiltersOption = true;

            this.configs.filterTag = this.configs.getCategoryFilterString(this.category);

            if(this.configs.filterTag == "all") {
                this.configs.filterTag = "";
                enableAllFiltersOption = false;
            } else if(this.showAllFilters){
                this.configs.filterTag = "";
            }

            gridElements = this.configs.getSavedFiltersGridConfig();

            if(new SmUtil().checkPermission("deleteFilter")){
                gridElements['height'] = gridHeight + 'px';
                this.filtersGrid = new GridWidget({
                    container: filterGridContainer,
                    actionEvents : {deleteEvent: "deleteAction"},
                    elements: gridElements
                });
            } else {
                this.filtersGrid = new GridWidget({
                    container: filterGridContainer,
                    elements: gridElements
                });
            }

            this.filtersGrid.build();
            this.bindGridEvents();
            //
            gridWidgetHeaderContainer = filterGridContainer.find(".action-filter-container .actions");
            gridWidgetHeaderContainer.prepend(render_template(InjectorTemplate, {
                "show-all-filters": enableAllFiltersOption
            }));
            //
        },
        //
        bindGridEvents: function () {
            this.$el.off("deleteAction").on("deleteAction", $.proxy(this.onDeleteEvent, this));
        },

	   /**
        * Called when Cancel button is clicked on the overlay.
        * @param {Object} event - The event object
        */
        cancel: function(event) {
            event.preventDefault();
            this.options.activity.overlayWidgetObj.destroy();
        },

        applyFilter: function(event) {
            console.log(event.currentTarget);
            event.preventDefault();
            var me = this, selectedFilters = this.filtersGrid.getSelectedRows();

            this.$el.trigger("savedFiltersSelected", selectedFilters);
        },

        /**
         * Return the selected filter from the grid
         * on select
         */
        getSelectedFilters:function(){
            var selectedFilters = this.filtersGrid.getSelectedRows();
            return selectedFilters;
        },
        /**
         * Returns a jquery promise
         **/
        getRecentFilters: function(){
            var me = this,
                onSuccess,
                onFailure,
                def = $.Deferred(),
                filterTag = me.configs.getCategoryFilterString(this.category);
            this.filters = new RecentFiltersCollection();
            if(filterTag == "all") {
                filterTag = "firewall&tag=webfilter&tag=vpn&tag=contentfilter&tag=antispam&tag=antivirus&tag=ips";
            }
            this.filters.url = this.filters.url+'&tag='+filterTag;

            onSuccess = function (collection, response, options) {
                def.resolve(collection, response);
            };

            onFailure = function (collection, response, options) {
                console.log('Filters collection not fetched');
                def.reject();
            };

            me.filters.fetch({
                success: onSuccess,
                error: onFailure
            });

            return def.promise();
        },
        //
        onRecentFilterClick:function(event){
            console.log(event.currentTarget);
            event.preventDefault();
            var me=this;
            var selectedFilterId = parseInt($(event.currentTarget).attr('filter-id'));
            var model = me.recentFiltersCollection.where({"id": selectedFilterId})[0];
            me.$el.trigger("recentFilterSelected", model['attributes']);
        },

       // Delete event
        onDeleteEvent: function(e, selectedObj){
            var filterId ;

            $(selectedObj.deletedRows).each(function (i) {
                filterId = selectedObj.deletedRows[i]['id'];
            });

            $.ajax({
                type: 'DELETE',
                url:"/api/juniper/seci/filter-management/filters/" + filterId ,
                headers: {
                    "Content-Type": 'application/vnd.juniper.seci.filter-management.event-filter+json;version=1;charset=UTF-8'
                },
                dataType: "json",
                success: function (data) {
                     new Slipstream.SDK.Notification().setText("The selected items were successfully deleted.").notify();
                },
                error: function () {
                    console.log("failed delete");
                    new Slipstream.SDK.Notification().setText("Failed to delete selected item.").setType('info').notify();
                }
            });
        }
		
	});

	return SavedFiltersView;
});