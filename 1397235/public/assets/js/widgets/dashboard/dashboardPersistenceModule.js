/** 
 * A module for managing persistence of the dashboard
 *
 * @module DashboardPersistenceModule
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
	'widgets/dashboard/models/dashboardPersistenceModel',
	'widgets/dashboard/models/dashboardDashletModel',
	'widgets/dashboard/models/dashboardDashletCollection',
	'widgets/dashboard/dashboardUtil',
	'lib/utils',
	'lib/i18n/i18n'], /** @lends DashboardPersistenceModule */
function(
	DashboardPersistenceModel,
	DashboardDashletModel,
	DashboardDashletCollection,
	DashboardUtil,
	Utils,
	i18n) {
	/**
     * DashboardPersistenceModule constructor
     *
     * @constructor
     * @class DashboardPersistenceModule 
     */
	var DashboardPersistenceModule = function(options) {
		var dashlets_loaded = false;

		var vent = options.vent,
			reqres = options.reqres,			
			dashletsRegistry = {},
			dashboardPersistenceModel = new DashboardPersistenceModel(),
			containers = {},
			dashboardUtil =  new DashboardUtil({}),
			globalDashboardPrefs = {};

		var defaultGlobalPrefs = dashboardPersistenceModel.get('dashboard').globalPrefs;
		updateDashboardGlobalPrefsCache(defaultGlobalPrefs);

		/**
		 * Wrapper function for callback that dashlets call on success/error of getCustomInitCallback
		 * @param {string} id - The dashlet id that was passed when the dashlet's
		 *						getCustomInitData function was called.
		 */
		var NotificationWrapper = function(id) {
			var deferred = $.Deferred();
			var promise = deferred.promise();

			/**
			 * Callback function for dashlets to call on success/error of getCustomInitData
			 * @param {Object} err - Optional error object for the dashlet to pass
			 *						 in case there was an error in getCustomInitData.
			 */
			var done = function(data, err) {
					deferred.resolve(id, data, err);
			};

			return {
				done: done,
				promise: promise
			};
		};

		this.bindEvents = function() {
			var self = this;
			vent.on('dashlet:added', function(dashletModel) {
				var innerView = dashletModel.get('innerView');
				var dashletId = dashletModel.get('dashletId');
				var customInitData = null;

				if (innerView.getCustomInitData && typeof innerView.getCustomInitData == 'function') {
					// if there is a callback defined, take that value

					var notificationObject = new NotificationWrapper(dashletId);
					var done = notificationObject.done;
					var promise = notificationObject.promise;

					innerView.getCustomInitData(done);

					$.when(promise)
					.done(function(id, data, err) {
						// received callback
						if (err) {
							console.log('Dashlet id', dashlet, 'returned with error on getCustomInitData', err.toString());
						}
						if (data) {
							customInitData = data;
						}
						dashletModel.set('customInitData', customInitData);
						self.saveDashlets();
					});
				} else {
					self.saveDashlets();
				}
			});

			vent.on('dashlet:updated', function(dashletModel) {
				var innerView = dashletModel.get('innerView');
				var dashletId = dashletModel.get('dashletId');
				var customInitData = null;

				if (innerView.getCustomInitData && typeof innerView.getCustomInitData == 'function') {
					// if there is a callback defined, take that value

					var notificationObject = new NotificationWrapper(dashletId);
					var done = notificationObject.done;
					var promise = notificationObject.promise;

					innerView.getCustomInitData(done);

					$.when(promise)
					.done(function(id, data, err) {
						// received callback
						if (err) {
							console.log('Dashlet id', dashlet, 'returned with error on getCustomInitData', err.toString());
						}
						if (data) {
							customInitData = data;
						}
						dashletModel.set('customInitData', customInitData);
						self.saveDashlets();
					});
				} else {
					self.saveDashlets();
				}
			});

            vent.bind("dashlets:dashboardModule:register", function(dashletsContainerId, dashletContainerDashletsView) {                
                dashletsRegistry[dashletsContainerId] = dashletContainerDashletsView;
                console.log("dashlets:dashboardModule:register - dashboardPersistenceModule "+dashletsContainerId);
            });

            reqres.setHandler("dashlets:dashletsContainers:fromPersistence:getids", function() {
            	var containerIds = [];
            	for (var prop in containers) {
            		containerIds.push({
            			index: containers[prop]['index'],
            			id: prop,
            			label: containers[prop]['label']
            		});
            	}
                
                return _.sortBy(containerIds, function(obj) { return obj.index; });                
            });

		};


		/**
		 * Retrieve dashboard container order
		 */
		var fetchContainerOrder = function(id) {
			var containers = reqres.request("dashlets:dashletsContainers:fromDashboardWidget:getids");
			return id ? containers.indexOf(id) : containers;
		};

		/**
		 * Retrieve dashboard global prefs from cache
		 */
		this.fetchDashboardGlobalPrefs = function() {
			return globalDashboardPrefs;
		};

		/**
		 * Save dashboard global prefs in cache and DB
		 * @param {Object} prefs - JSON of key-value pair to be stored as dashboard global preference
		 */
		this.saveDashboardGlobalPrefs = function(prefs) {
			updateDashboardGlobalPrefsCache(prefs);
			this.saveDashlets();
		};

		/**
		 * Save container label
		 */
		this.saveContainerLabel = function (activeId, containerLabel) {			
			if(containers[activeId]) {
				containers[activeId]['label'] = containerLabel;				
			} else {
				containers[activeId]  = {
					index: fetchContainerOrder(activeId),
					label: containerLabel,
					dashlets: []
				}
			}
			this.saveDashlets();
		};

		/**
		 * Delete container
		 */
		this.deleteContainer = function (id) {
			if(containers[id]) {
				delete containers[id];
				delete dashletsRegistry[id];
			}
			this.saveDashlets();
		};

		function updateDashboardGlobalPrefsCache(prefs) {
			if (prefs && prefs != {} ) {
				for (var key in prefs) {
					// update the global prefs cache.
					globalDashboardPrefs[key] = prefs[key];
				}
			}
		};

		function updateContainersCache(dashboard) {
			containers = dashboard['containers'];			
		};

		/**
		 * Save the plugin default containers and dashlets to the database, if this is the first time dashboard is being loaded by the user.
		 */
		this.saveDefaultDashboard = function(defaultContainers, defaultDashletsRegistry, dashboardWidgets) {
		    var dashboard = Slipstream.reqres.request("ui:preferences:get", "ui:dashboard");

		    // if ui:dashboard is empty, we assume this is the first time dashboard is being loaded by the user.
		    // use the default containers and dashlets provided by the plugins
		    if (!dashboard) {

		        containers = defaultContainers;
		        var containerstoSave = {};

		        for (var index in containers) {
		            var currentContainer = containers[index]['id'];
		            if (currentContainer && !_.isEmpty(currentContainer)) {
		                var dashletsIndex = 0;
		                var dashletsCollection = new DashboardDashletCollection();

		                // check if this default container has dashlets specified under the defaultDashletsRegistry
		                if (defaultDashletsRegistry[currentContainer]) {

		                    // add each dashlet in the defaultDashletsRegistry to the collection
		                    for (dashletsIndex in defaultDashletsRegistry[currentContainer].dashlets) {
		                        var current = defaultDashletsRegistry[currentContainer].dashlets[dashletsIndex];
		                        var droppedPosition = dashletsIndex;
		                        var id = _.uniqueId();

		                        var mdl = new DashboardDashletModel({
		                            dashletId: "dashlet_" + id,
		                            size: dashboardWidgets[current].size,
		                            colspan: dashboardUtil.getColspan(dashboardWidgets[current].size),
									style: dashboardUtil.getStyle(dashboardWidgets[current].size),
		                            title: dashboardWidgets[current].title,
		                            context: dashboardWidgets[current].context,
		                            details: dashboardWidgets[current].details,
		                            view: dashboardWidgets[current].view,
		                            customEditView: dashboardWidgets[current].customEditView,
		                            footer: Slipstream.SDK.DateFormatter.format(new Date(), {format: "long", options: {seconds: true}}),
		                            thumbnailId: current,
		                            index: droppedPosition,
		                            customInitData: Utils.clone(dashboardWidgets[current].customInitData),
		                            filters: dashboardWidgets[current].filters
		                        });

		                        dashletsCollection.add(new DashboardDashletModel(mdl.attributes));
		                    }
		                }

		                containerstoSave[containers[index]['id']] = {
		                    index: index,
		                    label: (containers[index]['label'] && containers[index]['label'].length > 0) ? containers[index]['label'] : i18n.getMessage('tabcontainer_untitled'),
		                    dashlets: dashletsCollection.models
		                };
		            }
		        }

		        var dashboardModel = {
		            'containers': containerstoSave,
		            'globalPrefs': this.fetchDashboardGlobalPrefs()
		        };

		        dashboardPersistenceModel.set('dashboard', dashboardModel);
		        Slipstream.vent.trigger("ui:preferences:change", "ui:dashboard", dashboardPersistenceModel.toJSON().dashboard);
		    }
		};

		/**
		 * Save the dashlet models in the database
		 */
		this.saveDashlets = function() {
			var containerstoSave = _.extend({}, containers);
			var loadedContainers = reqres.request("dashlets:dashletsContainers:loadedContainers:get");

			for (var containerId in dashletsRegistry) {
				//Extract dashlet information from collection only if its already rendered.
				if(loadedContainers.indexOf(containerId) == -1 ) {
					continue;
				}
				var dashletsCollection = new DashboardDashletCollection();				
				var dashlets = dashletsRegistry[containerId];
				dashlets.children.each(function(view) {
					dashletsCollection.add(new DashboardDashletModel({
						// When a new dashlet is first added, view.$el.index() is set to -1, so use the model index to find the dropped position index
						// Otherwise when dashlets are rearranged, use view.$el.index() to find the dropped position index
						index: ((view.$el.index() == -1) ? view.model.get('index') : view.$el.index()),
						size: view.model.get('size'),
						colspan: view.model.get('colspan'),
						style: view.model.get('style'),
	                    title: view.model.get('title'),
	                    details: view.model.get('details'),
	                    context: view.model.get('context'),
	                    thumbnailId: view.model.get('thumbnailId'),
	                    dashletId: view.model.get('dashletId'),
	                    customInitData: view.model.get('customInitData'),
	                    filters: view.model.get('filters')
					}),
					{
						at: view.$el.index()
					});
				});
				
				containerstoSave[containerId] = {
					index: fetchContainerOrder(containerId),
					label: containers[containerId] ? containers[containerId]['label'] : i18n.getMessage('dashboard_tabcontainer_default_title'),
					dashlets: dashletsCollection.models
				};
			}					

			var dashboardModel = {				
				'containers': containerstoSave,
				'globalPrefs': this.fetchDashboardGlobalPrefs()
			};

			if (dashlets_loaded) {
				dashboardPersistenceModel.set('dashboard', dashboardModel);
				Slipstream.vent.trigger("ui:preferences:change", "ui:dashboard", dashboardPersistenceModel.toJSON().dashboard);
			}
		};

		/**
		 * Retrieve the dashlet models from the database
		 */
		this.fetchDashletsCollection = function(containerId) {
			var dashboard = Slipstream.reqres.request("ui:preferences:get", "ui:dashboard");

			if (dashboard) {
				updateDashboardGlobalPrefsCache(dashboard['globalPrefs']);
				//If old redis schema, migrate it. TODO: Refactor as migration code. 
				if (dashboard['dashletModels']) {
					dashboard['containers'] = {
							default: {
								index: 0,
								label: i18n.getMessage('tabcontainer_untitled'),
								dashlets: dashboard['dashletModels']
							}
					}
				}
				updateContainersCache(dashboard);
				if (dashboard['containers']) {
					vent.trigger('dashlets:fetch:success', containerId && dashboard['containers'][containerId] ? dashboard['containers'][containerId]['dashlets'] : []);					
				} 
				else {
					// no preferences found.  Set default state of thumbnail container.
					vent.trigger('thumbnails:hide');
					this.setDashletsLoaded(true);		// this might seem factor-out'able but it is not.  Timing is important here.
				}
			} else {
				this.setDashletsLoaded(true);
			}
		};

		/**
		 * Reset the dashlets_loaded flag
		 */
		this.resetState = function() {
			dashlets_loaded = false;
		};
		this.setDashletsLoaded = function(state) {
			dashlets_loaded = state;
		};

		function getActiveDashlets() {
            return dashletsRegistry[reqres.request("dashlets:dashletsContainerActiveId")];
        }

		this.bindEvents();
	};

	return DashboardPersistenceModule;

});
