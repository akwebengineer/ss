/**
 * A view superclass for event viewer
 *
 * @module BaseEventViewerView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone', '../conf/configs.js', 'widgets/spinner/spinnerWidget', '../service/eventViewerService.js', 
        '../conf/timeRangeConstants.js', "../../../../ui-common/js/common/utils/filterUtil.js"],

    function (Backbone, Configs, SpinnerWidget, EventViewerService, TimeRangeConstants, FilterUtil) {

    var BaseEventViewerView = Backbone.View.extend({
        //
        /**
        builds the spinner and returns it. Use the returned spinner to destroy() it later
        */
        displaySpinner: function(container, message){
            var spinner = new SpinnerWidget({
                                "container": container,
                                "statusText": message
                            }).build();
            return spinner;
        },
        destroySpinner:function(spinner){
            spinner.destroy();
        },
        //        
        /*
        showHistoryOverLay: function(){
            var me = this
                historyView = new HistoryView({context: me.context}),
                conf = {
                    view: historyView,
                    cancelButton: true,
                    okButton: true,
                    showScrollbar: true,
                    type: 'wide'
                }; 
            //
            me.overlayWidgetObj = new OverlayWidget(conf);
            me.overlayWidgetObj.build();                
            //
        },

        //
        registerMenuEventListeners:function(){
            //
            var me=this;
            //
            me.eventViewerContainer.unbind('seci.eventviewer.selectsavedfilters').bind('seci.eventviewer.selectsavedfilters', function(){
                me.showSavedFiltersOverLay(me.eventCategory, me.context);
            });
            //
        },
        //
        addSavedFiltersContextMenu:function(){
            new ContextMenuWidget(new Configs().getSavedFiltersContextMenuConfigs()).build();
        },*/
        //
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.configs = new Configs(this.context);
            this.service = new EventViewerService({
                "configs": this.configs
            });
            this.options = options;
            this.filterManagement = {};
            this.selectedTimeRange = TimeRangeConstants.TWO_HOURS;//by default two hours
            this.filterUtil = new FilterUtil();
            this.dontPersistAdvancedSearch = false;//by default persist
        },
        //
        render: function() {
            this.firstRender = true;
            //
            return this;
        },

        cleanUpResources: function(){
            console.log("sub class will override this");
        }
       
    });

    return BaseEventViewerView;
});