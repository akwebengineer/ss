/** 
 * A module that implements a view for the
 * dashboard.
 *
 * @module DashboardView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/dashboard/dashboard'
], function(Backbone, Dashboard) {
    var DashboardView = Backbone.View.extend({

        initialize: function(options) {
            var self = this;

            if (options.onDone) {
                this.closeCallback = options.onDone;
            }
            this.context = this.options.context;
            this.dashboard = this.options.dashboard;

            this.dashboard.build({
                maxConcurrentRequests: this.options.maxConcurrentRequests,
                dashboard_title: '',
                onDone: _.bind(function() {
                    self.closeCallback();
                }, this)
            });

            this.el = this.dashboard.el;
            this.$el = $(this.el);

            return this;
        },

        close: function() {
            this.dashboard.destroy();
        }
    });

    return DashboardView;
});
