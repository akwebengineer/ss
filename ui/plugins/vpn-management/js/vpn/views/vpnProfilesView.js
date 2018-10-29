/*
Author :Mamata
*/
function VPNProfilesView() {
   this.el = document.createElement("div");

   this.render = function() {
      var text = document.createTextNode("Hello World!");
      this.el.appendChild(text);
   }

   this.close = function() {
      // optional cleanup here
   }
}
define([
    'backbone',
    'widgets/grid/gridWidget',
    '../conf/vpnProfilesGridConf.js',
    '../models/vpnProfileModel.js',
    '../views/vpnProfileView.js',
    '../utils.js'
], function (Backbone,
	GridWidget,
    gridConf,
    VPNProfileModel,
    VPNProfileView,
    Utils
) {
    var VPNProfilesView = Backbone.View.extend({
        initialize: function () {
            this.context = this.options.context;

            this.gridEvents = {
                createEvent: 'createVP',
                updateEvent: 'updateVP',
                viewEvent: 'viewVP',
                findUsageEvent: 'findUsageVP',
                deleteEvent: 'deleteVP'
            };

            this.$el.bind(this.gridEvents.createEvent, $.proxy(this.onCreate, this))
                .bind(this.gridEvents.updateEvent, $.proxy(this.onUpdate, this))
                .bind(this.gridEvents.viewEvent, $.proxy(this.onView, this))
                .bind(this.gridEvents.findUsageEvent, $.proxy(this.onFindUsage, this))
                .bind(this.gridEvents.deleteEvent, $.proxy(this.onDelete, this));
        },

        render: function () {
            var self = this;

			// handle localization for vpnProfiles grid
            gridConf.title = self.context.getMessage('vpn_profiles_grid_title');
            gridConf['title-help'].content = self.context.getMessage('vpn_profiles_grid_tooltip');
            $.each(gridConf.columns, function(i, column) {
                var columnTitle = (gridConf.columns[i].name).replace(/\s/g, '');
                column.label = self.context.getMessage('vpn_profiles_grid_column_name_' + columnTitle);
            });

            // instantiate extranetDevices grid and render it
            this.grid = new GridWidget({
                container: this.el,
                elements: gridConf,
                actionEvents: this.gridEvents
            }).build();

            return this;
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
            Utils.showNotification("error", responseText.title + ': ' + responseText.message);
            this.grid.reloadGrid();
        },
        /**
         * Called by grid for create event.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onCreate: function(event) {
        	console.log("On create event");

            this.model = new VPNProfileModel();
            // this.model.on('sync', this.onSync, this)
            //           .off('error');    // ovrylay view will have its own error handler

            // this.createView = new VPNProfileView({
            //     context: this.context,
            //     operation: 'create',
            //     model: this.model
            // });
             //  make a create intent
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                mime_type: 'vnd.juniper.net.vpn.vpn-profiles.create'
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
         * returns none
         */
        onUpdate: function(event, context) {
        	console.log("On update event");
        },

        /**
         * Called by grid for view event.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onView: function(event) {
            console.log("On view event");
        },

        /**
         * Called by grid for findUsage event.
         * 
         * @param {Object} event - The event object
         * @param {Object} context - The object containing selected row for find-usage 
         * returns none
         */
        onFindUsage: function(event, context) {
            console.log('onFindUsage() called for ' + JSON.stringify(context.selectedRows));
            var searchString =  context.selectedRows[0]['name'];

            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_SEARCH, {
                uri: new Slipstream.SDK.URI("search://")
            });
            intent.putExtras({ query: searchString });

            this.context.startActivity(intent);
        },

        /**
         * Called by grid for delete event.
         * 
         * @param {Object} event - The event object
         * returns none
         */
        onDelete: function(event, context) {
            context.deletedRows.forEach(function(deletedRow) {
                this.model = new VPNProfileModel({ id: deletedRow.id });
                this.model.on('sync', this.onSync, this)
                          .on('error', this.onError, this);

                this.model.destroy();
            }, this);
        }
   });
return VPNProfilesView;
});
