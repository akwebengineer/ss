/**
 * A view that uses the Tab Container Widget to render multiple dashlet containers.
 * 
 *
 * @module TabbedDashletsContainerView
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/dashboard/views/dashletsContainerContentView',
    'lib/template_renderer/template_renderer'], /** @lends TabbedDashletsContainerView */ 
    function(Backbone, TabContainerWidget, DashletsContainerContentView, render_template){

    /**
     * Construct a TabbedDashletsContainerView
     * @constructor
     * @class TabbedDashletsContainerView
     */
    var TabbedDashletsContainerView = Backbone.View.extend({

        /**
        * Initialize the view with passed in options.
        * @inner
        */
        initialize: function (options) {
            _.extend(this, options);
            this.actionEvents = {
                tabClickEvent: "tabSelect",
                tabSwitchEvent: "tabSwitch",
                tabNameEditEvent: "tabNameEdit",
                tabAddEvent: "tabAdd"
            };            
            this.vent = options.vent;
            this.reqres = options.reqres;            
        },

        /**
        * Render the container view.
        * @inner
        */
        render: function () {
            var removeTabConfirmationCb = $.proxy(function(doNotShowAgain, tabId) {
                this.vent.trigger('dashlets:dashletsContainerContent:switch',  this.tabsWidget.getActiveTab());
                this.vent.trigger('dashlets:dashletsContainerContent:setupDashletsContainer');
                this.vent.trigger('dashlets:dashletsContainerContent:deleteContainer', tabId);                
            }, this);

            this.tabsWidget = new TabContainerWidget({
                "container": this.el,
                "tabs": [],
                "toggle": true,
                "height": "auto",
                "controls": {
                    add: "true",
                    edit: "true",
                    remove: {
                        confirmDialogConfig: {
                            yesButtonCallback: removeTabConfirmationCb
                        }
                    }
                },
                actionEvents: this.actionEvents
            });
            this.tabsWidget.build();
            this.bindTabEvents();
            return this;
        },

        /**
        *   
        * Bind to events for triggering event when active containment switches.
        */
        bindTabEvents: function () {        
            this.$el
                .bind(this.actionEvents.tabClickEvent, $.proxy(function (e, obj){
                    if(obj.tabView &&  obj.tabView.containerId)
                    this.vent.trigger('dashlets:dashletsContainerContent:switch', obj.tabView.containerId);
                }, this));

            this.$el
                .bind(this.actionEvents.tabSwitchEvent, $.proxy(function (e, obj){
                    this.vent.trigger('dashlets:dashletsContainerContent:id:switch', obj.id);                    
                }, this));

            this.$el
                .bind(this.actionEvents.tabNameEditEvent, $.proxy(function (e, obj){                    
                    this.vent.trigger('dashlets:dashletsContainerContent:labelchange', obj.id, obj.name);                    
                }, this));

            this.$el
                .bind(this.actionEvents.tabAddEvent, $.proxy(function(e, obj){
                    var $tabContent = $(obj.content);
                    $tabContent.replaceWith(new DashletsContainerContentView({
                        vent: this.vent,
                        reqres: this.reqres
                    }, {containerId: obj.id}).render().el);
                    this.vent.trigger('dashlets:dashletsContainerContent:switch', obj.id);
                    this.vent.trigger('dashlets:dashletsContainerContent:labelchange', obj.id, obj.name);

                    var tab = this.tabsWidget._getActiveTabElement();
                    this.transformTabToDropZone(tab);
                }, this));
        },

        /**
         * Transform tabs into drop zones.
         */
        initTabDrop: function () {
            var tabs = this.tabsWidget._getTabElements();
            for (var index = 0; index <= tabs.length; index++) {
                this.transformTabToDropZone(tabs[index]);
            }
        },

        /**
         * Transform a tab into drop zone.
         * @param {Object} tab - tab object.
         */
        transformTabToDropZone: function (tab) {
            var self = this;
            $(tab).droppable({
                accept: ".dashlet",
                tolerance: 'pointer',
                over: function (evt, el) {
                    var tabId = $(this).find('a').data('tabid');
                    self.tabsWidget.setActiveTab(tabId);
                    self.vent.trigger('dashlets:dashletsContainerContent:id:switch', tabId);

                    //set custom data to indicate that dashlet is being moved over tabs.
                    el.draggable.data('dragOverTabs', true);
                    $.ui.ddmanager.prepareOffsets($.ui.draggable(this), evt); //defining offset with relation to tab so that the over element is visible with the mouse pointer.
                }
            })
        },

        /**
        * Add tab container method. 
        * @param {String} containerId - id of the container
        * @param {String} containerLabel - label of the container
        */
        addTabContainer: function (containerId, containerLabel) {
            var tab = {
                id: containerId,
                name: containerLabel,
                content: new DashletsContainerContentView({
                    vent: this.vent,
                    reqres: this.reqres
                }, {containerId: containerId})
            };
            this.tabsWidget.addTab(tab);
        },

        /**
        * Creates containers
        * @param {Array} containers - Array of objects with id & label
        */
        addContainers: function (containers) {
            for (var index = 0; index < containers.length; index++) {
                this.addTabContainer(containers[index]['id'], _.escape(containers[index]['label']));
            }
        },

        /**
         * Sets a container to active state.
         * @param {Array} containers - Array of objects with id & label
         * @param {String} containerId - id of the container
         */
        setActiveContainer: function (containers, containerId) {
            this.tabsWidget.setActiveTab(containerId);
        },

        /**
        * Returns sorted container ids   
        */
        getTabOrder: function () {
            var tabs = this.tabsWidget.getAllTabs();
            return _.map(tabs, function(obj){ return obj.id; });            
        }
    });

    return TabbedDashletsContainerView;
});