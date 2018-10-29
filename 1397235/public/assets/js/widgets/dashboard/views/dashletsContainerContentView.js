/**
 * A view that provides dashboardDashletCollection & dashboardDashletsView as one instance such that any number of dashlet collections 
 * can be created.
 *
 * @module DashletsContainerContentView
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/dashboard/models/dashboardDashletCollection',
    'widgets/dashboard/views/dashboardDashletsView',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'text!widgets/dashboard/templates/dashboardDashletContainer.html'], /** @lends DashletsContainerContentView */ 
    function(Backbone,  DashboardDashletCollection, DashboardDashletsView, render_template, i18n, dashboardDashletContainerTpl){

     /**
     * Construct a DashletsContainerContentView
     * @constructor
     * @class DashletsContainerContentView
     */
    var DashletsContainerContentView = Backbone.View.extend({
        /**
        * Initialize the view with passed in options.
        * @inner
        */
        initialize: function (options, conf) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.containerId = conf.containerId;
        },

        /**
        * Render the view.
        * @inner
        */
        render: function () {
            if (this.$el.find('.dashboardDashletContainer').length==0) {
                this.$el.append(render_template(dashboardDashletContainerTpl, {
                        "containerId": this.containerId
                    }));
                this.initDashlets();
                this.dashboardDashletsView.setElement($('.dashboardDashletContainer', this.$el)).render();            
            }
            return this;
        },

        /**
        * Initialize dashlets with dashboardDashletCollection, dashboardDashletsView.
        * @inner
        */
        initDashlets : function() {            
            this.dashboardDashletCollection = new DashboardDashletCollection();

            this.dashboardDashletsView = new DashboardDashletsView({
                collection: this.dashboardDashletCollection,
                vent: this.vent,
                reqres: this.reqres
            });
          this.vent.trigger('dashlets:dashletsContainerContent:register', this.containerId, this);
        }    
    });

    return DashletsContainerContentView;
});