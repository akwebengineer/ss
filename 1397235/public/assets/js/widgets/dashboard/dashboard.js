/** 
 * The main container for dashboard widgets.
 * It manages thumbnails in the 'thumbnail container' and
 * dashlets in the 'dashlet container'.
 * @module Dashboard
 * @author Sujatha <sujatha@juniper.net>
 * @author Kiran <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014-2016
 */
define([
    'jquery',
    'jquery.shapeshift',
    'jcarousel',
    'widgets/dashboard/models/dashboardTitleModel',
    'widgets/dashboard/models/dashboardThumbnailModel',
    'widgets/dashboard/models/dashboardDashletModel',
    'widgets/dashboard/models/dashboardThumbnailCollection',
    'widgets/dashboard/models/dashboardDashletCollection',
    'widgets/dashboard/views/dashboardLayout',
    'widgets/dashboard/views/dashboardTitleView',
    'widgets/dashboard/views/dashboardThumbnailsView',
    'widgets/dashboard/views/dashboardDashletsView',
    'widgets/dashboard/views/dashboardWidgetView',
    'widgets/dashboard/views/tabbedDashletsContainerView',
    'widgets/dashboard/views/dashletView',
    'widgets/dashboard/dashboardRefreshModule',
    'widgets/dashboard/dashboardPersistenceModule',
    'widgets/dashboard/dashboardUtil',
    'text!widgets/dashboard/templates/dashboardZeroState.html',
    'text!widgets/dashboard/templates/thumbnailZeroState.html',
    'widgets/dashboard/conf/categoriesConfiguration',
    'lib/template_renderer/template_renderer',
    'foundation.core',
    'modernizr',
    'lib/utils',
    'MutationObserver',
    'lib/i18n/i18n'
], /** @lends Dashboard */ function(
    $,
    shapeshift,
    jcarousel,
    DashboardTitleModel,
    DashboardThumbnailModel,
    DashboardDashletModel,
    DashboardThumbnailCollection,
    DashboardDashletCollection,
    DashboardLayout,
    DashboardTitleView,
    DashboardThumbnailsView,
    DashboardDashletsView,
    DashboardWidgetView,
    TabbedDashletsContainerView,
    DashboardDashletView,
    DashboardRefreshModule,
    DashboardPersistenceModule,
    DashboardUtil,
    DashboardZeroStateTpl,
    ThumbnailZeroStateTpl,
    categoriesConfiguration,
    render_template,
    foundation,
    Modernizr,
    Utils,
    MO,
    i18n) {
    /**
     * Dashboard constructor
     *
     * @constructor
     * @class Dashboard
     */
    var Dashboard = function(config) {
        var vent = new Backbone.Wreqr.EventAggregator(),
            reqres = new Backbone.Wreqr.RequestResponse(),
            self = this,
            minContainerHeight = 120,
            minColWidth = 400,
            maxColWidth = 1200,
            dashboardWidgets = {},
            dashboardCategoriesRegistry = {
                'category_all': { // All Widgets fall under this category drop-down
                    'id': 'category_all',
                    'text':  i18n.getMessage('category_all')} //All Widgets
            },
            allThumbnails = [],
            defaultContainers = {},
            dashletsContainerRegistry = {},
            defaultDashletsRegistry = {},
            loadedContainers = [],
            containersToRearrange = [],
            eventsBound = false,
            dashletsContainersCreated = false,
            dashletsContainerActiveId = null;

        // create an observer instance
        var observer = new MutationObserver(function(mutations) {
            setupDashboardInteractions();
            setupDefaultDashboard();
            setupDashletsContainer();
        });
         
        // configuration of the observer:
        var observerConfig = { attributes: true, childList: true, characterData: true };

        var messageResolver = new Slipstream.SDK.MessageResolver();
        var navigateAwaySubscription = messageResolver.subscribe('topics://navigateAway/', 'navigateAway', function (event_data) {
            for (var prop in dashletsContainerRegistry) {
                dashletsContainerRegistry[prop].dashboardDashletsView.children.each(function (childView) {
                    console.log('closing ' + childView.model.get('title'));
                    childView.closeView();
                });
                dashletsContainerRegistry[prop].dashboardDashletCollection.reset();
            }
        });

        var tabbedDashletsContainerView;

        var dashboardThumbnailCollection = new DashboardThumbnailCollection();

        var dashboardThumbnailsView = new DashboardThumbnailsView({
            collection: dashboardThumbnailCollection,
            vent: vent
        });

        var dashboardLayout = new DashboardLayout({});

        var dashboardRefreshModule = new DashboardRefreshModule({           
            vent: vent,
            reqres: reqres
        });

        var dashboardPersistenceModule = new DashboardPersistenceModule({            
            vent: vent,
            reqres: reqres
        });

        var dashboardUtil =  new DashboardUtil({});
                
        bindDashletsContainerEvents();

        this.el = dashboardLayout.$el;

        var dashboardTitleModel = new DashboardTitleModel({});

        var dashboardTitleView = new DashboardTitleView({
            model: dashboardTitleModel,
            vent: vent
        });

        if (config) {
            if (config.container) {
                this.container = config.container;
                this.target = document.querySelector(config.container);
            } else {
                this.target = dashboardLayout.el;
            }
        } else {
            this.target = dashboardLayout.el;
        }

        /**
         * Add a default container to the dashboard during first time load
         *
         * @param {Object} dashboardContainer - default container passed by the plugin
         */
        this.addDefaultDashboardContainer = function(dashboardContainer) {
            defaultContainers[dashboardContainer.id] = dashboardContainer;
        };

        this.addDashboardWidget = function(dashboardWidget) {
            // if plugin provides the sid string for the widget, then use it as the thumbnailId. Otherwise generate a unique string using the widget's ctx_root, ctx_name and title
            var thumbnailId = 'thumbnail_' + ((dashboardWidget.sid && typeof(dashboardWidget.sid) === "string") ? dashboardWidget.sid : Utils.hash_code(dashboardWidget.context.ctx_root + dashboardWidget.context.ctx_name + dashboardWidget.title));
            dashboardWidgets[thumbnailId] = dashboardWidget;
        };

        /**
         * Build the dashboard
         *
         * @return {Object} this Dashboard object
         */
        this.build = function(conf) {
            this.onDone = conf.onDone;
            dashboardTitleModel.set('dashboard_title', conf.dashboard_title);
            dashboardTitleModel.set('dashboardRefreshState', 'refreshed');
            if (conf.overview_help_key) {
                dashboardTitleModel.set('overview_help_key', conf.overview_help_key);
            }

            dashboardLayout.render();

            dashboardTitleView.setElement($('.dashboardTitleContainer', dashboardLayout.$el)).render();
            dashboardThumbnailsView.setElement($('.dashboardThumbnailContainer', dashboardLayout.$el)).render();

            //create a TabbedDashletsContainerView wrapper for dashlets. 
            tabbedDashletsContainerView = new TabbedDashletsContainerView({             
                vent: vent,
                reqres: reqres
            });
            tabbedDashletsContainerView.setElement($('.dashboardDashletContainerWrapper', dashboardLayout.$el)).render();                   

            // Setup dashboard categories
            _.extend(dashboardCategoriesRegistry, categoriesConfiguration);
            // Add 'thumbnails' array to each object
            _(dashboardCategoriesRegistry).each(function(elem, key) {
                elem.thumbnails = [];
            });

            for (thumbnailId in dashboardWidgets) {
                var dashboardWidgetView = new DashboardWidgetView(dashboardWidgets[thumbnailId]);
                dashboardWidgetView.setThumbnailId(thumbnailId);
                // Verify whether the user has access before adding the thumbnail
                if (dashboardWidgetView.isAccessible() == true) {
                    addThumbnail(dashboardWidgetView);
                    // check if this is a default dashlet
                    var defaultDashletContainerIdsArr = dashboardWidgetView.getDefaultDashletContainerIds();
                    if (defaultDashletContainerIdsArr.length) {
                        // update the defaultDashletsRegistry with containerId and thumbnailId
                        for (var idx in defaultDashletContainerIdsArr) {
                            if (!defaultDashletsRegistry[defaultDashletContainerIdsArr[idx]]) {
                                defaultDashletsRegistry[defaultDashletContainerIdsArr[idx]] = {"dashlets": []};
                            }
                            defaultDashletsRegistry[defaultDashletContainerIdsArr[idx]].dashlets.push(thumbnailId);
                        }
                    }

                    // Add thumbnail to the 'All Widgets' category
                    addThumbnailToAllWidgetsCategory(thumbnailId);

                    // Add thumbnail to other categories, as specified in plugin.json
                    var categoryIdsArr = dashboardWidgetView.getCategoryIds();
                    addThumbnailToCategoriesRegistry(thumbnailId, categoryIdsArr);
                }
            }

            dashboardTitleModel.set('categories', normalizeCategories());

            // Start observing DOM node for changes, to detect when the dashboardLayout has
            // been attached to the DOM to trigger setting up dashboard interactions
            // This is required by shapeshift because it has an implementation
            // where it does a search for items(':visible') to detect children and fails
            // if it finds nothing
            observer.observe(this.target, observerConfig);

            // in case a container was passed in, append the rendered html to that
            if (this.container) {
                $(this.container).append(this.el);
            }            
            
            return this;
        };


        /**
         * Close the dashboard
         */
        this.destroy = function() {
            dashletsContainerActiveId = null;
            dashletsContainersCreated = false;
            loadedContainers = [];
            if (navigateAwaySubscription) {
                messageResolver.unsubscribe(navigateAwaySubscription);
                navigateAwaySubscription = null;
            }

            dashboardThumbnailCollection.reset();
            dashboardLayout.close();

            /* Note: This is only required if we use Foundation tooltips instead of the 
               tooltip widget

            // Remove tooltips that we added to the DOM as we're responsible for those
            $(".tooltip", $("body")).remove();
            */

            if (this.onDone) {
                this.onDone();
            }
            dashboardPersistenceModule.resetState();
        };

        /**
         * Dashboard's Internal method to add containers to the dashboard
         * @param {object} containers - containers to be rendered.
         * @private
         */
        this._setupDashboardContainers = function (containers) {
            // check if any containers are defined
            if (containers && containers.length) {
                tabbedDashletsContainerView.addContainers(containers);
            }
        };

        /**
         * Dashboards Internal method to add dashlets to dashlet containers.
         * @param {object} dashletModel - dashlet model to be rendered.
         * @param {String} dashletsContainerId - dashletsContainers id.
         * @private
         */
        this._addDashletToContainer = function (dashletModel, dashletsContainerId) {
            var dashletsContainer = dashletsContainerRegistry[dashletsContainerId];
            if (!(dashletsContainer && dashletsContainer.dashboardDashletCollection)) { // If dashletsContainerId is not registered, create and register.
                var dashletCollection = new DashboardDashletCollection();
                var dashboardDashletsView = new DashboardDashletsView({
                    collection: dashletCollection,
                    vent: vent,
                    reqres: reqres
                });

                dashletsContainerRegistry[dashletsContainerId] = {
                    dashboardDashletsView: dashboardDashletsView,
                    dashboardDashletCollection: dashletCollection
                };
            }
            addDashlet(dashletModel, dashletsContainerId);
        };

        /**
         * Dashboards Internal method to get dashboard categories object.
         * @return {Object} Categories registry
         * @private
         */
        this._getCategories = function () {
            return dashboardCategoriesRegistry;
        }

        /**
         * Internal method to get filtered thumbnails, based on the category filter selected and search text.
         *
         * @param {String} category - Selected category
         * @param {String} searchText - Search Text
         *
         * @returns {Array} thumbnails - filtered thumbnails
         * @private
         */
        this._filterThumbnails = function (category, searchText) {
            var thumnailsModelsArray = getFilteredThumbnails(category, searchText);
            return thumnailsModelsArray.map(function (thumbnail) {
                return thumbnail.toJSON();
            });
        };

        /**
         * Dashboards Internal method to get number of dashlets in a container.
         * @param {String} dashletsContainerId - dashletsContainers id.
         * @private
         */
        this._getNumDashletsInContainer = function (dashletsContainerId) {
            var dashletsContainer = dashletsContainerRegistry[dashletsContainerId];
            return ((dashletsContainer && dashletsContainer.dashboardDashletCollection) ? dashletsContainer.dashboardDashletCollection.length : 0);
        }

        /**
         * Internal method to update selected category from the dropdown
         *
         * @param {String} category - category ID
         */
        this._updateSelectedCategory = function (category) {
            updateSelectedCategory(category);
        }

        /**
         * Add a thumbnail to the thumbnail container
         *
         * @param {Object} dashboardWidgetView - A single dashboard widget with
         *                         all information required to render
         *                         it in the thumbnail container
         */
        function addThumbnail(dashboardWidgetView) {
            var mdl = new DashboardThumbnailModel({
                thumbnailId: dashboardWidgetView.getThumbnailId(),
                title: dashboardWidgetView.getTitle(),
                details: dashboardWidgetView.getDetails(),
                categoryIds: dashboardWidgetView.getCategoryIds(),
                view: dashboardWidgetView.getImage(),
                context: dashboardWidgetView.getContext()
            });
            dashboardThumbnailCollection.add(mdl);
            allThumbnails.push(mdl);
        };

        function addDashlet(dashletModel, dashletsContainerActiveId) {                      

            // Check if valid thumbnailId exists in dashboardWidgets.
            // If an invalid thumbnailId is sent, return without trying to add the dashlet
            // This will allow other dashlets to continue loading
            if (!dashboardWidgets[dashletModel.thumbnailId]) return;

            var mdl = new DashboardDashletModel({
                dashletId: dashletModel.dashletId,
                size: dashletModel.size,
                colspan: dashboardUtil.getColspan(dashletModel.size),
                style: dashboardUtil.getStyle(dashletModel.size),
                title: dashletModel.title,
                context: dashletModel.context,
                details: dashletModel.details,
                view: dashboardWidgets[dashletModel.thumbnailId].view,
                customEditView: dashboardWidgets[dashletModel.thumbnailId].customEditView,
                footer: Slipstream.SDK.DateFormatter.format(new Date(), {format: "long", options: {seconds: true}}),
                thumbnailId: dashletModel.thumbnailId,
                index: dashletModel.index,
                customInitData: dashletModel.customInitData,
                filters: dashletModel.filters
            });
            dashletsContainerRegistry[dashletsContainerActiveId].dashboardDashletCollection.add(mdl, {at: dashletModel.index});
        };

        /**
         * Add a thumbnail to the 'All Widgets' category
         *
         * @param {String} thumbnailId - Thumbnail ID
         */
        function addThumbnailToAllWidgetsCategory(thumbnailId) {
            dashboardCategoriesRegistry['category_all'].thumbnails.push(thumbnailId);
        }

        /**
         * Add a thumbnail to the dashboard categories registry
         *
         * @param {String} thumbnailId - Thumbnail ID
         * @param {Array} categoryIdsArr - Category ids, if the widget is associated with a category, otherwise an empty array
         */
        function addThumbnailToCategoriesRegistry(thumbnailId, categoryIdsArr) {
            if (categoryIdsArr.length) {
                for (var idx in categoryIdsArr) {
                    //check if this id exists in dashboardCategoriesRegistry
                    if (dashboardCategoriesRegistry[categoryIdsArr[idx]] && categoryIdsArr[idx] != 'category_all') {
                        dashboardCategoriesRegistry[categoryIdsArr[idx]].thumbnails.push(thumbnailId);
                    }
                }
            }
        }

        /**
         * Convert dashboardCategoriesRegistry to the following array format:
         * Example: categoriesList = [{'id': 'category_all', 'text': 'All Widgets'},
         *                            {'id': 'category_devices', 'text': 'Devices'}]
         *
         * @returns {Array} categoriesList
         */
        function normalizeCategories() {
            var categoriesRegistry = $.extend(true, {}, dashboardCategoriesRegistry);

            var categoriesList = [];
            _(categoriesRegistry).each(function(elem, key) {
                if (elem.thumbnails.length > 0) {
                    categoriesList.push({
                        id: elem.id,
                        text: elem.text
                    })
                }
            });
            return categoriesList;
        }

        /**
         * Update selected category from the dropdown
         *
         * @param {String} category - category ID
         */
        function updateSelectedCategory(category) {
            dashboardTitleModel.set('selectedCategory', category);
            dashboardPersistenceModule.saveDashboardGlobalPrefs(dashboardTitleModel.attributes);
        }

        /**
         * Get filtered thumbnails, based on the category filter selected and search text.
         *
         * @param {String} category - Selected category
         * @param {String} searchText - Search Text
         *
         * @returns {Array} thumbnails - filtered thumbnails
         */
        function getFilteredThumbnails(category, searchText) {
            var thumbnails = allThumbnails;
            //Category filter
            if (category && category != "category_all") {
                thumbnails = thumbnails.filter(function (thumbnail) {
                    var categories = thumbnail.get("categoryIds");
                    return (_.indexOf(categories, category) > -1);
                });
            }
            //Title filter
            if (searchText) {
                thumbnails = thumbnails.filter(function (thumbnail) {
                    return thumbnail.get("title").toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1;
                });
            }
            return thumbnails;
        }
        
        function toggleZeroDashletsState() {
            var dashletsContainer = $('.dashboardDashletContainer[data-dashletsContainerId='+dashletsContainerActiveId+']');
            if (dashletsContainer.find('.dashboardDashlet').length == 0 ) {
                if (!isZeroStateVisible()) {
                    dashletsContainer.addClass('dotted-container');
                    dashletsContainer.append(render_template(DashboardZeroStateTpl, {
                        "dashboard_zero_state_message": i18n.getMessage('dashboard_zero_state_message')
                    }));
                }
            } else {
                if (isZeroStateVisible()) {
                    dashletsContainer.removeClass('dotted-container');
                    dashletsContainer.find('.zero-state').remove();
                }
            }
        };

        /**
         * Set up event handlers for coordinating updates with
         * the various dashboard sub-views.
         */
        function bindEvents() {
            var self = this;
            vent.bind("dashlets:getData:done", function () {
                dashboardPersistenceModule.setDashletsLoaded(true); // After the dashlets were added to the dashboard (to prevent needless write backs)
            });
            // Bind to events sent by buttons in Title View
            vent.bind("thumbnails:show", function(saveGlobalPref) {
                var saveGlobalPref = typeof saveGlobalPref !== 'undefined' ?  saveGlobalPref : true;
                if (saveGlobalPref == true) {
                    // user clicked on the open button, add animation while opening the palette
                    $('.jcarousel-wrapper', dashboardLayout.$el).slideToggle(300, "linear");
                }
                $('.dashboardTitleContainer', dashboardLayout.$el).removeClass('thumbnailContainerClosed');
                $('.jcarousel-wrapper', dashboardLayout.$el).show();
                $('.jcarousel', dashboardLayout.$el).jcarousel('reload');
                dashboardTitleModel.set('thumbnailContainerState', 'opened');
                if(saveGlobalPref)
                dashboardPersistenceModule.saveDashboardGlobalPrefs(dashboardTitleModel.attributes);
            });
            vent.bind("thumbnails:hide", function(saveGlobalPref) {
                var saveGlobalPref = typeof saveGlobalPref !== 'undefined' ?  saveGlobalPref : true;
                $('.dashboardTitleContainer', dashboardLayout.$el).addClass('thumbnailContainerClosed');
                $('.jcarousel-wrapper', dashboardLayout.$el).hide();
                dashboardTitleModel.set('thumbnailContainerState', 'closed');
                if(saveGlobalPref)
                dashboardPersistenceModule.saveDashboardGlobalPrefs(dashboardTitleModel.attributes);
            });
            vent.bind("thumbnails:refresh", function(category, searchText) {
                updateSelectedCategory(category);
                var filteredThumbnails = getFilteredThumbnails(category, searchText);
                $('.dashboardThumbnailContainer' , dashboardLayout.$el).empty();
                dashboardThumbnailCollection.reset(filteredThumbnails);
                dashboardThumbnailsView.setElement($('.dashboardThumbnailContainer', dashboardLayout.$el)).render();
                shapeshiftThumbnails();
                $('.jcarousel', dashboardLayout.$el).jcarousel('reload');
                $('.jcarousel', dashboardLayout.$el).jcarousel('scroll', 0);
            });
            vent.bind("dashlet:removed", function(model) {                
                var dashlets = dashletsContainerRegistry[dashletsContainerActiveId];

                dashlets.dashboardDashletCollection.remove(model);
                $('.dashboardDashletContainer[data-dashletsContainerId='+dashletsContainerActiveId+']', dashboardLayout.$el).trigger("ss-rearrange");
                toggleZeroDashletsState();
                dashboardPersistenceModule.saveDashlets();
            });
            vent.bind("dashlets:fetch:success", function(dashletModels){                   
                var globalPrefs = dashboardPersistenceModule.fetchDashboardGlobalPrefs();
                dashboardTitleModel.set('thumbnailContainerState', globalPrefs['thumbnailContainerState']);
                dashboardTitleView.refreshThumbnails(globalPrefs['selectedCategory']);
                var paletteState =  dashboardTitleModel.get('thumbnailContainerState');
                if (paletteState === 'opened'){
                    this.trigger('thumbnails:show', false);
                } else {
                    this.trigger('thumbnails:hide', false);
                }
                if (!dashletModels) return; 
                for(var idx in dashletModels) {
                    if (dashletModels[idx].thumbnailId) {
                        var dashboardWidgetView = new DashboardWidgetView(dashboardWidgets[dashletModels[idx].thumbnailId]);
                        if (dashboardWidgetView.isAccessible() == true) {
                            addDashlet(dashletModels[idx], dashletsContainerActiveId);
                        }
                    }
                }

                if (dashletModels.length === 0) {
                    shapeshiftDashlets(minColWidth);
                } else {
                    shapeshiftDashlets(null);
                }
            });            
            vent.bind("dashlets:fetch:error", function(){
                console.log('Could not retrieve dashlets from the database');
            });
            vent.bind("dashlets:close:confirmationNotRequired", function(arg) {
                dashboardPersistenceModule.saveDashboardGlobalPrefs({
                    'doNotShowConfirmClose': true
                });
            });
            reqres.setHandler("dashlets:close:confirmationNotRequired", function() {
                return dashboardPersistenceModule.fetchDashboardGlobalPrefs()['doNotShowConfirmClose'];
            });
            reqres.setHandler("dashlets:dashletsContainerActiveId", function() {                
                return dashletsContainerActiveId;
            });
            eventsBound = true;
        };

        /**
         * Set up event handlers for registering dashletContainers.
         * 
         */
        function bindDashletsContainerEvents() {
            vent.bind("dashlets:dashletsContainerContent:register", function(dashletsContainerId, dashletContainer){
                console.log("dashlets:dashletsContainerContent:register dashboard.js");
                dashletsContainerRegistry[dashletsContainerId] = dashletContainer;
                //register dashlets at dashboardRefreshModule & dashboardPersistenceModule      

                vent.trigger('dashlets:dashboardModule:register', dashletsContainerId, dashletContainer.dashboardDashletsView);
            });
            //tabContainer widget offers tab click event only for initial load. 'dashlets:dashletsContainerContent:switch' listens for it to setupDashletsContainer only once. 
            vent.bind("dashlets:dashletsContainerContent:switch", function(activeId){
                dashletsContainerActiveId = activeId;
                if (loadedContainers.indexOf(dashletsContainerActiveId) == -1) {
                    setupDashletsContainer();
                    loadedContainers.push(dashletsContainerActiveId);
                    vent.trigger('dashlets:refresh', "getData");
                }
            });
            //'dashlets:dashletsContainerContent:id:switch' ensures dashletsContainerActiveId is not stale during subsequent tab containment switches.
            vent.bind("dashlets:dashletsContainerContent:id:switch", function(activeId){
                dashletsContainerActiveId = activeId;
                toggleZeroDashletsState();
                if (containersToRearrange.indexOf(dashletsContainerActiveId) > -1) {
                    var dashlets = $('.dashboardDashletContainer[data-dashletsContainerId=' + dashletsContainerActiveId + ']');
                    dashlets.trigger("ss-rearrange");
                    containersToRearrange = _.without(containersToRearrange, dashletsContainerActiveId);
                }
            });
            vent.bind("dashlets:dashletsContainerContent:labelchange", function(activeId, label){                
                dashboardPersistenceModule.saveContainerLabel(activeId, label);
            });
            vent.bind("dashlets:dashletsContainerContent:deleteContainer", function(id){
                //Update thumbnail count in palette.
                var dashlets = dashletsContainerRegistry[id];
                dashlets.dashboardDashletCollection.each(function(dashlet) {
                    vent.trigger('dashlet:removed:deleteContainer', dashlet);
                });

                //Update PersistenceModule and loadedContainers array.
                dashboardPersistenceModule.deleteContainer(id);
                loadedContainers = _.without(loadedContainers, id)
            });
            vent.bind("dashlets:dashletsContainerContent:setupDashletsContainer", function(){
                loadedContainers.indexOf(dashletsContainerActiveId) == -1 && setupDashletsContainer();
            });
            reqres.setHandler("dashlets:dashletsContainers:fromDashboardWidget:getids", function() {
                return tabbedDashletsContainerView.getTabOrder();
            });
            reqres.setHandler("dashlets:dashletsContainers:loadedContainers:get", function() {
                return loadedContainers;
            });
        };

        /**
         * Unbind all events
         */
        function unbindEvents() {
            vent.unbind();
        };

        /**
         * Sets up shapeshift and jCarousel helpers
         *
         */
         function setupDashboardInteractions() {
            var thumbnails = $('.dashboardThumbnailContainer', dashboardLayout.$el);
            var carousel = $('.jcarousel', dashboardLayout.$el);
            var carouselCtrlPrev = $('.jcarousel-prev', dashboardLayout.$el);
            var carouselCtrlNext = $('.jcarousel-next', dashboardLayout.$el);

            shapeshiftThumbnails();

            carousel.jcarousel({
                // Turn off wrapping
                wrap: '',
                // Use CSS3 transitions if available
                transitions: Modernizr.csstransitions ? {
                    transforms:   Modernizr.csstransforms,
                    transforms3d: Modernizr.csstransforms3d,
                    easing:       'ease'
                } : false
            });

            // Find the number of thumbnails that are fully visible on the screen
            var carousels = carousel.jcarousel('fullyvisible'),
                numVisibleThumbnails = carousels ? carousels.length : 0;

            // Set default number of thumbnails to move on previous button
            carouselCtrlPrev.jcarouselControl({
                target: '-='+numVisibleThumbnails
            });

            // Set default number of thumbnails to move on next button
            carouselCtrlNext.jcarouselControl({
                target: '+='+numVisibleThumbnails
            });

            carousel.jcarousel('reload');

            // stop observing for DOM changes
            observer.disconnect();

            /* Note: This is necessary only if you use Foundation tooltips instead of tooltip widget
            // reinitialize foundation for tooltips
            $(document).foundation();
            */
        };

        /**
         * Set up a default dashboard during first time load
         * This is based on the default containers and dashlets specified by the plugins
         *
         */
        function setupDefaultDashboard() {
            // check if plugins have defined any default containers in their plugin.json files
            if (defaultContainers && !_.isEmpty(defaultContainers)) {
                // save default containers and dashlets
                dashboardPersistenceModule.saveDefaultDashboard(defaultContainers, defaultDashletsRegistry, dashboardWidgets);
            }
        };

        function setupDashletsContainer() {
            var dashlets = $('.dashboardDashletContainer[data-dashletsContainerId='+dashletsContainerActiveId+']'); 
            console.log("Transforming dashlets for dashletsContainerActiveId "+dashletsContainerActiveId);           
            setupDashletsInteractions(dashlets);
            if(!eventsBound) bindEvents();

            dashboardPersistenceModule.fetchDashletsCollection(dashletsContainerActiveId);
            if(!dashletsContainersCreated) {
                var containers = reqres.request("dashlets:dashletsContainers:fromPersistence:getids");
                containers = (containers.length) ? containers : [{id: "default", label: i18n.getMessage('dashboard_tabcontainer_default_title')}];
                tabbedDashletsContainerView.addContainers(containers);
                dashletsContainersCreated = true;
                tabbedDashletsContainerView.setActiveContainer(containers, containers[0]['id']); //Set first container as active. TODO: use for personalization story - Activate users last visited container.
                tabbedDashletsContainerView.initTabDrop(); //Initialize tabs to be droppable targets for dashlets.
            }
        }

        function setupDashletsInteractions(dashlets) {
            var carousel = $('.jcarousel', dashboardLayout.$el);
            dashlets.on("ss-added", function(e, selected) {
                var $selected = $(selected);
                var current = $selected.attr('id');
                var droppedPosition = $selected.index();

                // Shapeshift considers the zero-state div as a child with index 0. When the first dashlet is dropped into an empty container, we remove the zero-state from the DOM.
                // At that time, we need to adjust the dropped position from 1 to 0 for the first dropped dashlet.
                if (isZeroStateVisible()) {
                    droppedPosition --;
                }

                //If user has added a dashlet by moving it from another tab.
                if($selected.data().dragOverTabs) {
                    moveDashletToContainer($selected, dashletsContainerActiveId);
                    $selected.data('dragOverTabs', false); //reset flag.
                    return;
                }

                // Manually render a new view and add to the dashboardContainer
                var id = _.uniqueId();
                var dashletMdl = {
                    dashletId: "dashlet_" + id,
                    size: dashboardWidgets[current].size,
                    title: dashboardWidgets[current].title,
                    context: dashboardWidgets[current].context,
                    details: dashboardWidgets[current].details,
                    customEditView: dashboardWidgets[current].customEditView,
                    thumbnailId: current,
                    index: droppedPosition,
                    customInitData: Utils.clone(dashboardWidgets[current].customInitData),
                    filters: dashboardWidgets[current].filters
                };
                addDashlet(dashletMdl, dashletsContainerActiveId);

                var dashletCollection =  dashletsContainerRegistry[dashletsContainerActiveId].dashboardDashletCollection;
                vent.trigger('dashlets:refresh:individual', "getData", dashletCollection.findWhere({dashletId: dashletMdl.dashletId}));
            });

            dashlets.on("ss-drop-complete", function(e) {
                shapeshiftDashlets(null);
                dashlets.trigger("ss-rearrange");
                carousel.jcarousel('reload');
            });

            dashlets.on("ss-removed", function(e, selected) {
                containersToRearrange.push(dashlets.data('dashletscontainerid'));
            });

            dashlets.on("ss-rearranged", function(e, selected) {
                var $selected = $(selected);
                var droppedPosition = $selected.index();
                dashboardPersistenceModule.saveDashlets();
            });

            shapeshiftDashlets(maxColWidth);
        };

        /**
         * Move dashlet from source container to destination container.
         * @param {Object} $element - moved container.
         * @param {String} containerId - id of the container.
         */
        function moveDashletToContainer($element, containerId) {
            var dashletId = $element.find('.dashboardDashlet').attr('id'),
                dashletModel,
                droppedPosition = $element.index();

            //Find dashlet model which is being moved.
            //Remove dashlet model from sourceContainer and add it to currentContainer.
            for (var prop in dashletsContainerRegistry) {
                var dashletCollection = dashletsContainerRegistry[prop].dashboardDashletCollection,
                    model = dashletCollection.findWhere({dashletId: dashletId});
                if (model) {
                    dashletModel = model;

                    //close view
                    var collectionView = dashletsContainerRegistry[prop].dashboardDashletsView;
                    var view = collectionView.children.findByModel(model);
                    view.closeView();

                    //remove model
                    dashletCollection.remove(model);
                    break;
                }
            }

            dashletModel.unset('innerView'); //For dashlet view to rebuild within its new container.
            dashletsContainerRegistry[containerId].dashboardDashletCollection.add(dashletModel, {at: droppedPosition});
            vent.trigger('dashlets:refresh:individual', "getData", dashletModel);
        };

        function isZeroStateVisible() {
            return $('.dashboardDashletContainer[data-dashletsContainerId='+dashletsContainerActiveId+']').find('.zero-state').length;
        }

        function setContainer(container) {
            this.el = $(container);
        };

        function getContainer(){
            return this.el;
        };

        function shapeshiftDashlets(columnWidth) {
            var dashlets = $('.dashboardDashletContainer[data-dashletsContainerId='+dashletsContainerActiveId+']');                
            var dashletsShapeshiftConfig = {
                    // If "autoHeight" is turned on, minHeight will never allow the container height to go below this number.
                    minHeight: minContainerHeight,

                    // Align / justify the grid.
                    align: 'left',

                    // Allow dragging only when mousedown occurs on the specified element
                    handle: '.dashboardDashletHeader',

                    // The number of pixels horizontally between each column
                    gutterX: 20,

                    // The number of pixels vertically between each element.
                    gutterY: 20,

                    // Must be set to the highest colspan child element
                    minColumns: 3,

                    // The speed at which the children will animate into place.
                    animationSpeed: 100,

                    // If there are too many elements on a page then it can get very laggy during animation. If the number of children exceed this threshold then they will not animate when changing positions.
                    animationThreshold: 25
            };

            toggleZeroDashletsState();

            if (columnWidth) {
                dashletsShapeshiftConfig.colWidth = columnWidth;
            }

            dashlets.shapeshift(dashletsShapeshiftConfig);
        }

        function shapeshiftThumbnails() {
            var thumbnails = $('.dashboardThumbnailContainer', dashboardLayout.$el),
                thumbnailZeroState = thumbnails.siblings('.thumbnail-zero-state');

            if(thumbnails.children().length == 0) {
                thumbnails.height(0); //Ensure shapeshift does not inject undesired height.
                if(thumbnailZeroState.length == 0) {
                    thumbnails.after(render_template(ThumbnailZeroStateTpl, {
                        "thumbnail_zero_state_message": i18n.getMessage('thumbnail_zero_state_message')
                    }));
                } else {
                    thumbnailZeroState.show();
                }
                return;
            }
            thumbnails.siblings('.thumbnail-zero-state').hide();
            thumbnails.shapeshift({
                // Set minimum height
                minHeight: minContainerHeight,

                // The number of pixels horizontally between each column
                gutterX: 20,

                // The number of pixels vertically between each element.
                gutterY: 20,

                // Do not allow dashlets to be dropped into the thumbnail container
                enableCrossDrop: false,

                // Create a clone whrn a thumbnail is dragged into the dashlet container
                dragClone: true
            });
        }
    }

    return Dashboard;
});
