/**
 * The main Slipstream application module
 *
 * @module slipstream
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["marionette"], function(Marionette) {
    window.Slipstream = new Marionette.Application({
        boot: function() {
            require(
                [
                    window.location.protocol + "//"+ window.location.host + "/socket.io/socket.io.js",
                    "sdk/baseActivity",
                    "sdk/activity",
                    "sdk/activityContext",
                    "sdk/intent",
                    "sdk/URI",
                    "sdk/renderer",
                    "sdk/messageProvider",
                    "sdk/messageResolver",
                    "sdk/alertProvider",
                    "sdk/alertResolver",
                    "sdk/alarmProvider",
                    "sdk/alarmResolver",
                    "sdk/dashboardResolver",
                    "sdk/searchProvider",
                    "sdk/searchResolver",
                    "sdk/rbacProvider",
                    "sdk/rbacResolver",
                    "sdk/authenticationProvider",
                    "sdk/authenticationResolver",
                    "sdk/preferencesProvider",
                    "sdk/preferencesResolver",
                    "sdk/messageBus",
                    "sdk/preferences",
                    "sdk/notification",
                    "sdk/dateFormatter",
                    "sdk/utils",
                    "sdk/navigator",
                    "sdk/analytics",
                    "sdk/analyticsProvider",
                    "sdk/componentLoader",
                    "sdk/ui",
                    "sdk/iconToolbarElement",
                    "sdk/userToolbarElement",
                    "sdk/toolbarElement",
                    "sdk/viewToolbarElement",
                    "entities/plugin",
                    "entities/utilityToolbar",
                    'lib/help/helpMap',
                    "modules/i18n",
                    "modules/helpMap",
                    "modules/plugin_discoverer",
                    "modules/activity_mediator",
                    "modules/intent_resolver",
                    "modules/provider_loader",
                    "modules/message_provider_mediator",
                    "modules/analytics_provider_mediator",
                    "modules/search_provider_mediator",
                    "modules/authentication_provider_mediator",
                    "modules/rbac_provider_mediator",
                    "modules/notification_mediator",
                    "modules/alarm_provider_mediator",
                    "modules/alert_provider_mediator",
                    "modules/preferences_provider_mediator",
                    "modules/view_manager",
                    "modules/template_renderer",
                    "modules/url_router",
                    "modules/dateFormatter",
                    "modules/component_loader",
                    "apps/ui/app",
                    "apps/navigation/navigation_app",
                    "apps/ui/preferences/preferencesManager"
                ], function(io) {
                    console.log("starting Slipstream");
                    Slipstream.start(io);
                });
        },

        initialize: function() {
            require(
                [
                    "sdk/preferences",
                    "modules/template_renderer",
                    "modules/i18n",
                    "modules/helpMap",
                    "modules/view_adapter"
                ], function() {
                    Slipstream.start();
                });
        }
    });

    var autostart_activities;

    Slipstream.navigate = function(route, options) {
        options || (options = {});
        Backbone.history.navigate(route, options);
    };

    Slipstream.getCurrentRoute = function() {
        return Backbone.history.fragment;
    };

    // Event handlers

    Slipstream.on("start", function() {
        Slipstream.vent.trigger("framework:booted");
        console.log("Slipstream started");
    });

    Slipstream.vent.on("plugins:afterDiscovery", function(autoStarts) {
         autostart_activities = autoStarts;
    });

    Slipstream.vent.on("ui:afterShow", function() {
        autostart_activities.forEach(function(activity) {
            if (activity.filters[0]) {
                var action = activity.filters[0].action;
                var data = {
                    mime_type: activity.filters[0].data.mime_type
                };
                var intent = new Slipstream.SDK.Intent(action, data);

                Slipstream.vent.trigger("activity:start", intent);
            }
        });
    });

    Slipstream.on("initialize:after", function() {
        require(["vendor/svg4everybody/svg4everybody"], function(svg4everybody) {
            // initialize the SVG polyfill
            svg4everybody();

            // Perform post initialization processing
            doPostInitialization();
        });
    });

    /**
     * Perform framework post-initialization processing
     */
    function doPostInitialization() {
        // Set up the main content pane.
        Slipstream.UI.render(true);

        /**
         * Handle the event signaling that all providers have been loaded/started.
         */
        Slipstream.vent.on("provider:afterAllLoaded", function() {
            /**
             * Once the providers are loaded, the user can be authenticated
             * and the RBAC provider initialized.  If successful, the UI can
             * be rendered.
             */

            //Start Analytics Provider before login page load & user authentication.
            Slipstream.commands.execute("provider:start", "analytics");

            function authenticateUser() {
                // Start the authentication provider
                Slipstream.commands.execute("provider:start", "auth");

                var deferred = $.Deferred();
                var auth_resolver = new Slipstream.SDK.AuthenticationResolver();
                auth_resolver.isUserAuthenticated({
                     success: function() {
                        deferred.resolve(auth_resolver.getUserid());
                        initIdleTimeoutHandler(auth_resolver);
                     },
                     fail: function() {
                         auth_resolver.getAuthenticationMode({
                             success: function(authMode){
                                 if(authMode && authMode == 'cert'){
                                     auth_resolver.authenticate('','', {
                                         success: function() {
                                           deferred.resolve(auth_resolver.getUserid());
                                           initIdleTimeoutHandler(auth_resolver);
                                         },
                                         fail: function() {
                                             certLoginFailedCallback( );
                                         }
                                       });
                                 } else {
                                     initFormAuthentication(deferred,auth_resolver );
                                 }
                             },
                             fail : function(){
                                 initFormAuthentication(deferred,auth_resolver );
                             }
                         });
                     }
                });

                return deferred.promise();
            }

            function initializeRBACProvider(userid) {
                // Start the RBAC provider
                Slipstream.commands.execute("provider:start", "rbac");

                var deferred = $.Deferred();
                var rbac_resolver = new Slipstream.SDK.RBACResolver();

                Slipstream.commands.execute("rbac_provider:init", {
                    success: function() {
                        console.log("RBAC provider initialized");
                        deferred.resolve();
                    },
                    fail: function(errorMsg) {
                        console.log("Failed to initialize RBAC provider:", errorMsg);
                        deferred.reject();
                    },
                    userid: userid
                });

                return deferred.promise();
            }

            function initIdleTimeoutHandler(auth_resolver){
                Slipstream.vent.on( "ui:afterShow", function() {
                    var timeout = auth_resolver.getIdleTimeout();
                    if ( timeout != null && timeout != 0 ) {
                        require(
                            [
                                "jquery.idle-timer"
                            ], function() {
                                $( document ).idleTimer({
                                    timeout: timeout * 60 * 1000,
                                    timerSyncId: "slipstream:authTimeoutSync",
                                }).on( "idle.idleTimer",
                                function() {
                                    $(document).idleTimer('destroy');
                                    var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_UNAUTHENTICATE, {
                                        uri: new Slipstream.SDK.URI("auth://")
                                    });
                                    Slipstream.vent.trigger("activity:start", intent);
                                });
                            }
                        );
                    }
                });
            }

            function initFormAuthentication(authDeferredObj, auth_resolver){
              var auth_intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_AUTHENTICATE, {
                uri: new Slipstream.SDK.URI("auth://")
              });

              Slipstream.vent.trigger("activity:start", auth_intent, {
                callback: function(resultCode, data) {
                  if (resultCode == Slipstream.SDK.BaseActivity.RESULT_OK) {
                    authDeferredObj.resolve(auth_resolver.getUserid());
                    initIdleTimeoutHandler(auth_resolver);
                  }
                }
              });
            }

            function certLoginFailedCallback(){
                var auth_intent = new Slipstream.SDK.Intent("slipstream.intent.action.ACTION_AUTHENTICATE_FAILED", {
                    uri: new Slipstream.SDK.URI("auth://")
                  });
                  Slipstream.vent.trigger("activity:start", auth_intent);
            }


            var authenticateUserDeferred = authenticateUser();

            authenticateUserDeferred.then(function(userid) {
                console.log("User", userid, "successfully authenticated");
                return initializeRBACProvider(userid);
            }).done(function() {
                // Start all of the message providers
                Slipstream.commands.execute("provider:start", "topics");

                Slipstream.vent.on("ui:preferences:loaded", function() {
                    // render the full UI
                    Slipstream.UI.render(false);
                });

                //Start Preferences Provider
                Slipstream.commands.execute("provider:start", "preferences");
                Slipstream.UI.PreferencesManager.start();

            }).fail(function() {
                Slipstream.vent.trigger("ui:fatalError");
            })
        })
    }

    return Slipstream;
});