/**
 * Module that implements the Extranet Devices View.
 *
 * @module ExtranetDevicesView
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'marionette',
    'widgets/grid/gridWidget',
    '../conf/extranetDevicesGridConf.js',
    '../models/extranetDeviceModel.js',
    '../views/extranetDeviceView.js'
], function (
    Marionette,
    GridWidget,
    ExtranetDevicesGridConf,
    ExtranetDeviceModel,
    ExtranetDeviceView
) {
    var ExtranetDevicesView = Marionette.ItemView.extend({
        /**
         * The constructor for the extranet devices management view using a grid.
         * 
         * @param {Object} options - The options containing the Slipstream's context
         */
        initialize: function(options) {
            this.context = options.context;

            this.gridEvents = {
                createEvent : {
                     capabilities : ['createExtranetDeviceCap'],
                     name: "createED"
                 },
                updateEvent: {
                      capabilities : ['modifyExtranetDeviceCap'],
                      name: "updateED"
                  },
                deleteEvent: {
                      capabilities : ['deleteExtranetDeviceCap'],
                      name: "deleteED"
                  }
            };

            this.$el.bind(this.gridEvents.createEvent.name, $.proxy(this.onCreate, this))
                .bind(this.gridEvents.updateEvent.name, $.proxy(this.onUpdate, this))
                .bind(this.gridEvents.deleteEvent.name, $.proxy(this.onDelete, this))
        },

        /**
         * Renders the management view using a grid.
         * 
         * returns this object
         */
        render: function() {
            // instantiate extranetDevices grid and render it
            this.grid = new GridWidget({
                container: this.el,
                elements: ExtranetDevicesGridConf.getConfiguration(this.context),
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
                mime_type: 'vnd.juniper.net.vpn.extranet-device.create'
            });

            // start the create activity and upon success add new row to the grid
            var self = this;
            this.context.startActivityForResult(intent, function(result, model) {
                if (result == Slipstream.SDK.BaseActivity.RESULT_OK) {
                    self.grid.addRow(model.toJSON()[model.jsonRoot]);
                }
            });
        },

        /**
         * Called by grid for update event.
         * 
         * @param {Object} event - The event object
         * @param {Object} context - The object containing selected row for update 
         * returns none
         */
        onUpdate: function(event, context) {
            this.model = new ExtranetDeviceModel({ id: context.originalRow.id });
            this.model.on('error', this.onError, this)
                      .off('onSync');   // for below fetch, we have a custom sync/success handler

            var self = this;
            this.model.fetch({ 
                success: function(model, response) {
                    console.log('fetched: ' + JSON.stringify(model.toJSON()));

                    //  make an edit intent
                    var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT, {
                        mime_type: 'vnd.juniper.net.vpn.extranet-device.edit'
                    });
                    intent.putExtras({ model: model });

                    // start the edit activity and upon success update row to the grid
                    self.context.startActivityForResult(intent, function(result, model) {
                        if (result == Slipstream.SDK.BaseActivity.RESULT_OK) {
                            self.grid.editRow(context.originalRow, model.toJSON()[model.jsonRoot]);
                        }
                    });
                }
            });
        },

        /**
         * Called by grid for delete event.
         * 
         * @param {Object} event - The event object
         * @param {Object} context - The object containing selected rows for delete 
         * returns none
         */
        onDelete: function(event, context) {
            context.deletedRows.forEach(function(deletedRow) {
                this.model = new ExtranetDeviceModel({ id: deletedRow.id });
                this.model.on('sync', this.onSync, this)
                          .on('error', this.onError, this);

                this.model.destroy();
            }, this);
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
            //Utils.showNotification("error", responseText.title + ': ' + responseText.message);
            this.grid.reloadGrid();
        }
    });

    return ExtranetDevicesView;
});
