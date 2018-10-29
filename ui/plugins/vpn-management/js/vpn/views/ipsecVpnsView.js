/**
 * Module that implements the IPSEC VPNs View.
 *
 * @module IpsecVpnsView
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'marionette',
    'widgets/grid/gridWidget',
    '../conf/ipsecVpnsGridConf.js',
    '../models/ipsecVpnModel.js',
    '../utils.js'
], function (
    Marionette,
    GridWidget,
    IpsecVpnsGridConf,
    IpsecVpnModel,
    Utils
) {
    var IpsecVpnsView = Marionette.ItemView.extend({
        /**
         * The constructor for the ipsec vpns management view using a grid.
         * 
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {
            this.context = options.context;

            this.gridEvents = {
                createEvent: 'createIpsecVpn',
                updateEvent: 'updateIpsecVpn',
                deleteEvent: 'deleteIpsecVpn',
                viewEvent: 'viewIpsecVpn'
            };

            this.$el.bind(this.gridEvents.createEvent, $.proxy(this.onCreate, this))
                .bind(this.gridEvents.updateEvent, $.proxy(this.onUpdate, this))
                .bind(this.gridEvents.deleteEvent, $.proxy(this.onDelete, this))
                .bind(this.gridEvents.viewEvent, $.proxy(this.onView, this));
        },

        /**
         * Renders the management view using a grid.
         * 
         * returns this object
         */
        render: function() {
            this.gridConf = new IpsecVpnsGridConf(this.context);

            // instantiate IpsecVpns grid and render it
            this.grid = new GridWidget({
                container: this.el,
                elements: this.gridConf.getConfiguration(),
                actionEvents: this.gridEvents
            }).build();

            return this;
        },



        // Grid event handlers

        /**
         * Called by grid for create event.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onCreate: function(event) {
           //  make a create intent
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                mime_type: 'vnd.juniper.net.vpn.vpns.create'
            });

            // start the create activity now
            this.context.startActivity(intent);
        },

        /**
         * Called by grid for update event.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onUpdate: function(event, context) {
            console.log('onUpdate() called for ' + JSON.stringify(context.originalRow));
        },

        /**
         * Called by grid for delete event.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onDelete: function(event, context) {
            context.deletedRows.forEach(function(deletedRow) {
                this.model = new IpsecVpnModel({ 
                    id: deletedRow.id,
                    name: deletedRow.name
                });
                this.model.on('sync', this.onSync, this)
                          .on('destroy', this.onDestroy, this)
                          .on('error', this.onError, this);

                this.model.destroy();
            }, this);
        },

        /**
         * Called by grid for view event.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onView: function(event, context) {
            console.log('onView() called for ' + JSON.stringify(context.selectedRows));
        },



        // Model event handlers

        /**
         * Called when triggered after a successful ReST call (GET, PUT, DELETE).
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onSync: function(model, response, options) {
            console.log('succeeded: ' + JSON.stringify(model.toJSON()));
            //this.grid.reloadGrid();
        },

        /**
         * Called after a successful model destroy (DELETE).
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onDestroy: function(model, response, options) {
            console.log('destroyed: ' + JSON.stringify(model.toJSON()));
            Utils.showNotification("success", model.get('name') + " " + this.context.getMessage('ipsec_vpns_delete_successful'));
            this.grid.reloadGrid();
        },


        /**
         * Called when triggered after a failed ReST call (GET, PUT, DELETE).
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onError: function(model, response) {
            console.log('failed: ' + JSON.stringify(model.toJSON()));
            var responseText = JSON.parse(response.responseText);
            Utils.showNotification("error", responseText.title + ': ' + responseText.message);
            this.grid.reloadGrid();
        }
    });

    return IpsecVpnsView;
});