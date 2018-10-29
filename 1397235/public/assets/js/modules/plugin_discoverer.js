/** 
 * A module that implements a plugin discoverer.  This module will publish an event
 * when plugins are added or removed from the system.
 *
 * @module 
 * @name Slipstream/PluginDiscoverer
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(["sdk/URI", "modules/dashboard_mediator", "text!build-info.json", "lib/utils"], function(URI, dashboardMediator, buildInfo, utils) {
	Slipstream.module('PluginDiscoverer', /** @namespace Slipstream.PluginDiscoverer */ function(PluginDiscoverer, Slipstream, Backbone, Marionette, $, _) {
		var discovered_nav = {primary: [], secondary: []};

        var build_info = {};

        if (buildInfo) {
            try {
                build_info = _.extend(build_info, $.parseJSON(buildInfo));
            }
            catch (err) {
                console.log("Couldn't fetch build info, using defaults.");
            }
        }

        var filters;

        /**
         * Helper function to produce fully-qualified paths to plugin resources
         *
         * @param {String} plugin_root - the root directory of the plugin
         */
        var resolve_path = function(plugin_root, plugin_subdir, filename) {
            var path = plugin_root + "/" + plugin_subdir + "/" + filename;

            if (path.charAt(0) != '/') {
                path = "/" + path;
            }

            return path;
        }

        /**
         * Process a plugin definition
         *
         * @memberof Slipstream.PluginDiscoverer
         * @param {Plugin} plugin - An instance of a Plugin model
         * @return The last autoload activity discovered or null if none was discovered.
         */
		var process_plugin = function(plugin) {
			console.log(JSON.stringify(plugin));
            var min_platform_version = plugin.get("min_platform_version");

            if (!build_info.build_version || utils.version_compare(min_platform_version, build_info.build_version) > 0) {
                console.log("Plugin '" + plugin.get("name") + "' not loaded.", "Requires platform version =", 
                            min_platform_version, "; current platform version =", build_info.build_version);
                return;
            }
               
			// broadcast notification of discovered plugin(s)
            Slipstream.vent.trigger("plugin:discovered", plugin);

            var autostarts = discoverActivities(plugin);
            discoverSharedComponents(plugin);
            discoverProviders(plugin);
            discoverUtilityToolbarElements(plugin);
            discoverDashboardWidgets(plugin);

            return autostarts;
        };

        /**
         * Discover a plugin's activities
         *
         * @memberof Slipstream.PluginDiscoverer
         * @param {Plugin} plugin - An instance of a Plugin model
         * @return The last preload activitiy discovered or null if none was discovered.
         */
        var discoverActivities = function(plugin) {
        	var autostarts = [], 
        	    plugin_root = plugin.get("root"),
                plugin_name = plugin.get("name");

            filters = {};

            plugin.get("activities").forEach(function(activity) {
                if (activity.autostart) {
                    autostarts.push(activity);
                }

                activity.paths = [];

                activity.filters.forEach(function(filter) {
                     if (filter.id) {
                         filters[filter.id] = {filter: filter, activity: activity};
                     }
                });
            });

            var navigation_paths = plugin.get("navigation_paths");

            if (navigation_paths) {
                navigation_paths.forEach(function(nav_path) {
                    var filter = filters[nav_path.filter].filter;

                    if (filter.data && filter.data.scheme) {
                        var uri = new Slipstream.SDK.URI();
                        uri.protocol(filter.data.scheme);
                        filter.data.uri = uri;
                    }

                    filters[nav_path.filter].activity.paths.push(nav_path);
                    nav_path.filter = filters[nav_path.filter];

                    Slipstream.vent.trigger("nav:discovered", nav_path);
                });
            }

            plugin.get("activities").forEach(function(activity) {
                var resolved_module_path = resolve_path(plugin_root, "js", activity.module + ".js");
                activity.breadcrumb = typeof activity.breadcrumb == "undefined" || activity.breadcrumb;
                activity.context = new Slipstream.SDK.ActivityContext(plugin_name, "/" + plugin_root);
                activity.plugin_name = plugin_name;
                
                if (activity.url_path) {
	                // normalize url_paths to being with a '/'
	                if (activity.url_path.charAt(0) != '/') {
	                	activity.url_path = "/" + activity.url_path;
	                }
                }  

                var activityModule;
                if (activity.moduleAlias) {
                    var minified_module_path = '../../installed_plugins/'+ activity.plugin_name + '/js/' + activity.plugin_name +'.min';
                    var config = {};
                    config['paths'] = {};
                    config.paths[activity.moduleAlias] = minified_module_path;
                    require.config(config);
                    activityModule = activity.moduleAlias;
                } 
                else {
                    activityModule = resolved_module_path;
                }

                activity.module = activityModule;

                if (activity.auth_required == undefined) {
                    activity.auth_required = true;
                }

                // broadcast notification of discovered activities
                Slipstream.vent.trigger("activity:discovered", activity);
            });

            return autostarts;
        };

        /**
         * Discover a plugin's shared components
         *
         * @memberof Slipstream.PluginDiscoverer
         * @param {Plugin} plugin - An instance of a Plugin model
         */
        var discoverSharedComponents = function(plugin) {
            var plugin_root = plugin.get("root");
            var shared = plugin.get("shared");

            if (shared && shared["components"]) {
                var components = shared["components"];

                components.forEach(function(component) {
                    var loaderPath = resolve_path(plugin_root, "shared/components", component.loader);

                    component.loader = loaderPath;
                    Slipstream.vent.trigger("component:discovered", component);
                });
            }
        }

        /**
         * Discover a plugin's providers
         *
         * @memberof Slipstream.PluginDiscoverer
         * @param {Plugin} plugin - An instance of a Plugin model
         */
        var discoverProviders = function(plugin) {
            var MESSAGE_PROVIDER_SCHEME = "topics",
                SEARCH_PROVIDER_SCHEME = "search",
                AUTH_PROVIDER_SCHEME = "auth",
                RBAC_PROVIDER_SCHEME = "rbac",
                ALARM_PROVIDER_SCHEME = "alarm",
                ALERT_PROVIDER_SCHEME = "alert";
                ANALYTICS_PROVIDER_SCHEME = "analytics";
                PREFERENCES_PROVIDER_SCHEME = "preferences";

            /**
             * Discover a provider
             * 
             * @param {Object} provider - the provider to be discovered
             * @param {String} discover_event - the event to be broadcast announcing the discovery of a provider
             */
            var discoverProvider = function(provider, discover_event) {
                var resolved_module_path = resolve_path(plugin.get("root"), "js", provider.module + ".js");
                var plugin_root = plugin.get("root");
                
                provider.module = resolved_module_path;
                provider.plugin_name = plugin.get("name");
                provider.context = new Slipstream.SDK.ActivityContext(provider.plugin_name, "/" + plugin_root);
                // broadcast notification of discovered provider
                Slipstream.vent.trigger(discover_event, provider);    
            }

            var providers = plugin.get("providers");
 
            if (providers) {
                console.log("found providers");

                providers.forEach(function(provider) {
                    if (provider.uri) {
                        var uri = new URI(provider.uri),
                            provider_discovery_event;

                        provider.uri = uri;

                        switch (uri.scheme()) {
                            case MESSAGE_PROVIDER_SCHEME:
                                provider_discovery_event = "message_provider:discovered";
                                break;
                            case SEARCH_PROVIDER_SCHEME:
                                provider_discovery_event = "search_provider:discovered";
                                break;
                            case AUTH_PROVIDER_SCHEME:
                                provider_discovery_event = "authentication_provider:discovered";
                                break;
                            case RBAC_PROVIDER_SCHEME:
                                provider_discovery_event = "rbac_provider:discovered";
                                break;
                            case ALARM_PROVIDER_SCHEME:
                                provider_discovery_event = "alarm_provider:discovered";
                                break;
                            case ALERT_PROVIDER_SCHEME:
                                provider_discovery_event = "alert_provider:discovered";
                                break;
                            case ANALYTICS_PROVIDER_SCHEME:
                                provider_discovery_event = "analytics_provider:discovered";
                                break;
                            case PREFERENCES_PROVIDER_SCHEME:
                                provider_discovery_event = "preferences_provider:discovered";
                                break;
                        }

                        if (provider_discovery_event) {
                            discoverProvider(provider, provider_discovery_event);
                        }
                    }
                });
            }
        };

        /**
         * Discover a plugin's utility bar elements
         *
         * @memberof Slipstream.PluginDiscoverer
         * @param {Plugin} plugin - An instance of a Plugin model
         */
        var discoverUtilityToolbarElements = function(plugin) {
            var toolbar_elements = plugin.get("utility_toolbar");
            var plugin_root = plugin.get('root');
            var plugin_name = plugin.get('name');

            if (toolbar_elements) {
                console.log("found utility toolbar elements");
                var activity_context =  new Slipstream.SDK.ActivityContext(plugin_name, "/" + plugin_root);

                toolbar_elements.forEach(function(toolbar_element) {

                    if (toolbar_element.activity && toolbar_element.activity.module) {
                        var resolved_module_path = resolve_path(plugin_root, "js", toolbar_element.activity.module + ".js");
                        toolbar_element.activity.module = resolved_module_path;  
                        toolbar_element.activity.context = activity_context;
                    }
                    
                    if (toolbar_element.icon) { // an icon toolbar element
                        toolbar_element.protoModule = "sdk/iconToolbarElement";

                        if (toolbar_element.onselect_activity && toolbar_element.onselect_activity.module) {
                            var resolved_onselect_module_path = resolve_path(plugin_root, "js", toolbar_element.onselect_activity.module + ".js"); 
                            toolbar_element.onselect_activity.module = resolved_onselect_module_path; 
                            toolbar_element.onselect_activity.context = activity_context;
                        }

                        if (toolbar_element.hover && toolbar_element.hover.view) {
                            var resolved_view_path = resolve_path(plugin_root, "js", toolbar_element.hover.view + ".js");
                            toolbar_element.hover.view = resolved_view_path;
                        }
                            
                        var root_icon_path = "/" + plugin_root + "/img",
                            resolved_icon_path = root_icon_path + "/" + toolbar_element.icon;
                            
                        toolbar_element.icon = resolved_icon_path;
                        toolbar_element.root_icon_path = root_icon_path;
                    }
                    else if (toolbar_element.bindsTo) {
                        toolbar_element.protoModule = "sdk/" + toolbar_element.bindsTo + "ToolbarElement";

                        // process toolbar actions, if any exist
                        toolbar_element.actions.forEach(function(action) {
                            if (action.module) {
                                action.module = resolve_path(plugin_root, "js",  action.module + ".js");
                            }
                            else if (action.filter) {
                                action.filter = filters[action.filter].filter;    
                            }
                            action.context = activity_context;
                        });
                    }
                    else {
                        toolbar_element.protoModule = "sdk/viewToolbarElement";    
                    }

                    // broadcast notification of discovered toolbar element
                    Slipstream.vent.trigger("utilityToolbar_element:discovered", toolbar_element);
                });
            }
        };


        /**
         * Discover a plugin's dashboard widgets
         *
         * @memberof Slipstream.PluginDiscoverer
         * @param {Plugin} plugin - An instance of a Plugin model
         */
        var discoverDashboardWidgets = function(plugin) {
            var widgets = plugin.get("dashboard")["widgets"];
            var containers = plugin.get("dashboard")["containers"];

            var plugin_root = plugin.get('root');
            var plugin_name = plugin.get('name');

            if (containers && containers.length > 0) {
                console.log("found containers");
                containers.forEach(function(container) {
                    // broadcast notification of discovered container
                    Slipstream.vent.trigger("dashboard_container:discovered", container);
                });
            }

            if (widgets.length > 0) {
                console.log("found widgets");

                widgets.forEach(function(widget) {
                    //var resolved_module_path = "/" + plugin.get("root") + "/js/views/" + widget.module + ".js";
                    var resolved_module_path = resolve_path(plugin.get("root"), "js/views", widget.module + ".js");
                    if (widget.editView) {
                        var resolved_edit_view_path = resolve_path(plugin.get('root'), 'js/views', widget.editView + '.js');
                    }
                    if (widget.filterConf) {
                        var resolved_filter_conf_path = resolve_path(plugin.get('root'), 'js/conf', widget.filterConf + '.js');
                    }
                    widget.module = resolved_module_path;
                    widget.customEditView = resolved_edit_view_path;
                    widget.filterConf = resolved_filter_conf_path;
                    widget.context = {
                        ctx_name: plugin_name,
                        ctx_root: '/' + plugin_root
                    };
                    // broadcast notification of discovered widget
                    Slipstream.vent.trigger("dashboard_widget:discovered", widget);
                });
            }
        };

        
		var API = {
			/**
			 * Discover the installed set of plugins
			 */
			discover: function() {
                Slipstream.vent.trigger("plugins:beforeDiscovery")
				var discoveringPlugins = Slipstream.request("plugin:entities");

				$.when(discoveringPlugins).done(function(plugins) {
					var autostart_activities = [];
					console.log(JSON.stringify(plugins));

					if (plugins) {
						plugins.each(function(plugin) {
							var autostarts = process_plugin(plugin);

                            autostart_activities = autostart_activities.concat(autostarts);
						});
					} 
					else {
						console.log("no plugins found");
					}
					Slipstream.vent.trigger("plugins:afterDiscovery", autostart_activities);
				});
			},
            /**
             *  Retrieve the set of dynamic navigation elements
             */
			getDynamicNavigationElements: function() {
				return discovered_nav;  
			}
		};

        
        /**
         * A request handler to satisfy requests for the
         * set of dynamically discovered navigational elements.
         *
         * @memberof Slipstream.PluginDiscoverer
         * @return An array of dynamically discovered navigational elements of the form:
         *
         * \{
         *    nav_group : <name of a second level navigational group>
         *    nav_element : <label for the second level navigation elemement>
         *    intent : The Intent used to launch an activity associated with the
         *             navigational element
         * \}
         */
		Slipstream.reqres.setHandler("navigation:dynamic_elements", function() {
            return API.getDynamicNavigationElements();
        });

        Slipstream.on("plugin:discover", function() {
            API.discover();
        })

		PluginDiscoverer.on('start', function(/*io*/) {
			API.discover();
		});
	});

	return Slipstream.PluginDiscoverer;
});
