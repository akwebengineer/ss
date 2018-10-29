/** 
 * A module that implements a Slipstream Activity for
 * viewing the dashboard.
 * 
 * @module DashboardLaunchActivity
 * @author Kiran Kashalkar
 * @author Sujatha Subbarao
 * @copyright Juniper Networks, Inc. 2015
 */
define([
	"./views/dashboardView.js",
	'widgets/dashboard/dashboard',
	"./conf/dashboardConf.js"
	], function(DashboardView, Dashboard, DashboardConf) {


    var BBView = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template);
            return this;
        }
    });

	/**
	 * Constructs a DashboardLaunchActivity.
	 */
	var DashboardLaunchActivity = function() {
        var dashboardResolver = new Slipstream.SDK.DashboardResolver();
        var dashlets = dashboardResolver.getDashlets();
        var dashboard;

		this.onStart = function() {
			console.log("DashboardLaunchActivity started");

			var self = this;
			var num_loaded_dashlets = 0;

			function render_dashboard() {
			    var view = new DashboardView({
			        onDone:  _.bind(function() {
			            console.log('Dashboard activity done');
			        }, self),
			        context: self.getContext(),
			        dashboard: dashboard,
			        maxConcurrentRequests: DashboardConf.maxConcurrentRequests
			    });

				self.setContentView(view);
			}

			/**
	         * Load dashboard widget
	         *
	         * @param {Object} - The widget to be loaded
	         */
	        var load_dashboard_widget = function(widget) {
	            console.log("loading dashboard widget", JSON.stringify(widget));
	            require([widget.module, widget.customEditView, widget.filterConf], function(module, customEditView, filterConf) {
	                var separator = '/';
                    var img_path_prefix = 'img';
                    num_loaded_dashlets++;

                    Slipstream.commands.execute("nls:loadBundle", widget.context);
	                var filters = filterConf ? new filterConf().getValues() : undefined;
	                var dashboardWidget = {
	                    title: widget.title,
	                    size: widget.size,
	                    details: widget.details,
	                    image: new BBView({
	                        template: '<div><img src="' + widget.context.ctx_root + separator + img_path_prefix + separator +  widget.thumbnail + '"></div>'
	                    }),
	                    view: module,
	                    customEditView: customEditView,
	                    context: widget.context,
	                    customInitData: widget.customInitData,
	                    filters: filters
	                };

	                dashboard.addDashboardWidget(dashboardWidget);

                    if (num_loaded_dashlets == dashlets.length) {
                        render_dashboard();
		            }

	            },
	            function(err) {
	                console.log("Can't load dashboard widget", widget.module);
	                console.log("Failed module: ", err.requireModules ? err.requireModules[0] : "Unknown");
	                console.log("Stack trace:", err.stack);
	                num_loaded_dashlets++;

	                if (num_loaded_dashlets == dashlets.length) {
		                render_dashboard();
		            }
	            });

	        }
	        dashlets.forEach(function(dashlet) {
	            load_dashboard_widget(dashlet);
	        });

		};

		this.onCreate = function() {
			dashboard = new Dashboard();
			console.log("DashboardLaunchActivity created");

			console.log("Parameters sent to DashboardLaunchActivity were", JSON.stringify(this.getExtras()));
		};

		this.onDestroy = function() {
			console.log("DashboardLaunchActivity being destroyed");
		};
	};

	DashboardLaunchActivity.prototype = new Slipstream.SDK.Activity();
	
	return DashboardLaunchActivity;
});
