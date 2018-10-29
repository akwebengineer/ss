/** 
 * A module for managing manual refresh of the dashboard
 *
 * @module DashboardRefreshModule
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Sujatha Subbarao <sujatha@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([], /** @lends DashboardRefreshModule */
function() {
    /**
     * DashboardRefreshModule constructor
     *
     * @constructor
     * @class DashboardRefreshModule
     * @param {Object} options - Options object for refresh module consisting of:
     *                             vent - the vent to trigger and listen for events on
     *                             dashlets - a handlet to the array of dashlets objects
     *                                        in the dashletContainer
     */
    var DashboardRefreshModule = function(options) {
        var vent = options.vent,
            reqres = options.reqres,            
            dashletsRegistry = {},
            totalDashletsToRefresh = 0,
            successCount = 0,
            errorCount = 0;

        bindEvents();

        /**
         * Wrapper function for callback that dashlets call on success/error of refresh
         * @param {string} id - The dashlet id that was passed when the dashlet's
         *                        refresh function was called.
         */
        var NotificationWrapper = function(id) {
            var deferred = $.Deferred();
            var promise = deferred.promise();

            /**
             * Callback function for dashlets to call on success/error of refresh
             * @param {Object} err - Optional error object for the dashlet to pass
             *                         in case there was an error in refreshing.
             */
            var done = function(err) {
                if (err != null) {
                    console.log('Dashlet id', id, 'returned with error on refresh', err.toString());
                    deferred.reject(id);
                } else {
                    deferred.resolve(id);
                }
            };

            return {
                done: done,
                promise: promise
            };
        };

        /**
         * Refresh the dashlet's inner view (implemented by plugin developer)
         * @param {String} action - Desired action: refresh or getData
         * @param {Object} DashletView - The dashletView in dashboard to be refreshed
         * @param {Boolean} dashletUpdated - Specifies if dashlet model needs to be updated.
         */
        function refreshDashlet(action, dashletView, dashletUpdated) {
            action = action || "refresh";
            var dashletId = dashletView.model.get('dashletId');
            var innerView = dashletView.model.get('innerView');
            
            vent.trigger('dashlet:refresh', dashletId);
            if (innerView[action] &&  _.isFunction(innerView[action])) {
                var notificationObject = new NotificationWrapper(dashletId);
                var done = notificationObject.done;
                var promise = notificationObject.promise;

                var proposedModel;
                if (dashletUpdated) {
                    proposedModel = dashletView.model.clone();
                    proposedModel.unset('index');
                    proposedModel.unset('colspan');
                    proposedModel.unset('footer');
                    proposedModel.unset('view');
                    proposedModel.unset('dashletId');
                    proposedModel.unset('thumbnailId');
                    proposedModel.unset('innerView');
                    proposedModel.unset('context');
                }

                innerView[action](done, proposedModel);

                $.when(promise)
                .done(function(id) {
                    // successfully refreshed view
                    vent.trigger('dashlet:refresh:success', id);
                    successCount++;
                    if (successCount + errorCount == totalDashletsToRefresh) {
                        vent.trigger('dashlets:'+action+':done');
                    }
                })
                .fail(function(id) {
                    // error refreshing view
                    vent.trigger('dashlet:refresh:error', id);
                    errorCount++;
                    if (successCount + errorCount == totalDashletsToRefresh) {
                        vent.trigger('dashlets:'+action+':done');
                    }
                });
            } else {
                vent.trigger('dashlet:refresh:nonexistant', dashletId);
            }
        };

        /**
         * Setup event handlers for responding to different refresh events on dashboard
         * Events are:
         * dashlets:refresh for all dashlets to be refreshed
         * dashlets:refresh:individual for a single dashlet to be refreshed
         *
         */
        function bindEvents() {
            vent.on('dashlets:refresh', function(action) {
                totalDashletsToRefresh = 0;
                successCount = 0;
                errorCount = 0;
                var dashlets = getActiveDashlets();

                dashlets.children.each(function(childView) {
                    if (childView.model.get('innerView')[action] && _.isFunction(childView.model.get('innerView')[action])) {
                        totalDashletsToRefresh++;
                    }
                });
                
                if (totalDashletsToRefresh == 0) {
                    vent.trigger('dashlets:'+action+':done');
                };
                
                dashlets.children.each(function(childView) {
                    refreshDashlet(action, childView);
                });
            });

            vent.on('dashlets:refresh:individual', function(action, model) {
                var dashlets = getActiveDashlets();
                var childView = dashlets.children.findByModel(model);
                refreshDashlet(action, childView);
            });
            vent.on('dashlets:refresh:individual:updated', function(model) {
                var dashlets = getActiveDashlets();
                var childView = dashlets.children.findByModel(model);
                refreshDashlet("refresh", childView, true);
            });
            vent.bind("dashlets:dashboardModule:register", function(dashletsContainerId, dashletContainerDashletsView) {
                dashletsRegistry[dashletsContainerId] = dashletContainerDashletsView;
                console.log("dashlets:dashboardModule:register - dashboardRefreshModule "+dashletsContainerId);
            });
        };

        function getActiveDashlets() {
            return dashletsRegistry[reqres.request("dashlets:dashletsContainerActiveId")];
        }
        
    }

    return DashboardRefreshModule;

});
