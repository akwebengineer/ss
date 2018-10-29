/**
 * View to extend default grid to include device and tunnel overlay 
 * 
 * @module IpsecVpnGridExtendView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    '../../../../ui-common/js/views/gridView.js',
    'widgets/grid/gridWidget',
    '../utils.js',
    '../conf/ipsecVpnDevicesGridConf.js',
    '../conf/ipsecVpnTunnelsGridConf.js',
    './modifyVpnDeviceAssociationView.js',
    './modifyVpnTunnelRouteSettingsView.js',
    '../../../../security-management/js/publish/publishActivity.js',
    './modifyIpsecView.js',
    './vpnImportWizardView.js',
    './modifyVpnDeviceEndpointsSettingsView.js',
    './vpnModifyWizardView.js'

], function (OverlayWidget, FormWidget, GridView, GridWidget, Utils, IpsecVpnDevicesGridConfig, IpsecVpnTunnelsGridConfig,
        ModifyVpnDeviceAssociationView, ModifyVpnTunnelRouteSettingsView,
        PublishActivity, ModifyIpsecView, VpnImportView, ModifyVpnDeviceEndpointsSettingsView, modifyVpnWizardView) {

    var IpsecVpnGridExtendView = GridView.extend({

        initialize: function (options) {
           this.context = options.context;
           this.conf = options.conf;
            this.activity = options.activity;
            this.model = options.activity.model;
            this.search = options.search;
           // Add new actions to the actionEvents drop down menu
           this.actionEvents = options.actionEvents;
           this.actionEvents.updateEvent = {
                     capabilities : ['VPN.update'],
                     name: "EditEvent"
               };

           this.actionEvents.importEvent = {
                   capabilities : ['VPN.create'],
                   name: "ImportEvent"
               };
           this.actionEvents.modifyEvent = {
                   capabilities : ['VPN.update'],
                   name: "ModifyEvent"
               };
            this.actionEvents.modifyVpnDeviceAssociationEvent={
                    capabilities : ['VPN.update'],
                    name: "ModifyDeviceAssociationEvent"
                };

           this.actionEvents.modifyVpnTunnelRouteEvent = {
                     capabilities : ['VPN.update'],
                     name: "ModifyTunnelRouteEvent"
                 };
           this.actionEvents.viewEndpointEvent = {
                     capabilities : ['VPN.read'],
                     name: "ViewEndpointEvent"
                 };
           this.actionEvents.viewTunnelEvent ={
                    capabilities : ['VPN.read'],
                    name: "ViewTunnelEvent"
                };
           this.actionEvents.publishEvent = {
                    capabilities : ['PublishVPN'],
                    name: "PublishEvent"
                };
           this.actionEvents.updatePolicyEvent = {
                     capabilities : ['VPN.update'],
                     name: "UpdateEvent"
                 };
           this.actionEvents.deleteEvent = {
                       capabilities : ['VPN.delete'],
                       name: "DeleteEvent"
                   };

            this.bindCustomGridEvents();
        },

        render: function() {
            console.log("Rendering GridView");

            this.gridWidget = new GridWidget({
                container: this.el,
                elements: this.conf,
                search:  this.search,
                actionEvents: ($.isEmptyObject(this.actionEvents)) ? null : this.actionEvents
            }).build();
            return this;
        },


        bindCustomGridEvents: function () {
            var self = this;

            this.$el
                .bind(this.actionEvents.importEvent.name, function(e,row){
                    self.importHandler(e);
               })

                .bind(this.actionEvents.updateEvent.name, function(e,row){
                  self.modifyVPNHandler(row);
               })

               .bind(this.actionEvents.modifyEvent.name, function(e,row){
                    self.modifyHandler(row);
               })

               .bind(this.actionEvents.viewEndpointEvent.name, function(e,row){
                    self.endpointHandler(row);
               })

               .bind(this.actionEvents.viewTunnelEvent.name, function(e,row){
                    self.tunnelHandler(row);
               })

               .bind(this.actionEvents.publishEvent.name, function(e,row){
                    self.publishHandler(row);
               })

               .bind(this.actionEvents.updatePolicyEvent.name, function(e,row){
                    self.updateHandler(row);
               })

               .bind(this.actionEvents.modifyVpnDeviceAssociationEvent.name, function(e, row) {
                    self.modifyVpnDeviceAssociationEventHandler(row);
                })

                .bind(this.actionEvents.modifyVpnTunnelRouteEvent.name, function(e, row) {
                    self.modifyVpnTunnelRouteHandler(row);
               })

               .bind(this.actionEvents.deleteEvent.name, function(e,row){
                    self.deleteVpnHandler(row);
               });
        },

        modifyVPNHandler: function(row) {
                var linkValue = row.originalRow["id"];
                var model = new this.model();
                var UUID = Slipstream.SDK.Utils.url_safe_uuid();
                this.overlay = new OverlayWidget({
                view: new modifyVpnWizardView({
                    activity    : this.options.activity,
                    selectedRow : linkValue,
                    model       : model,
                    UUID        : UUID
                 }),
                type: 'large'
            });
            this.overlay.build();
        },

        importHandler: function(e) {
                this.overlay = new OverlayWidget({
                view: new VpnImportView({activity: this.options.activity}),
                type: 'large'
            });
            this.overlay.build();
        },

        modifyHandler: function(row) {
            var self = this;
            var linkValue = row.selectedRows[0].id;
            var model = new this.model();
            var url_safe_uuid = Slipstream.SDK.Utils.url_safe_uuid();
            var options = {
                activity: self,
                model: model,
                context: self.context,
                selectedRow: linkValue,
                uuid: url_safe_uuid
            };

            self.overlay = new OverlayWidget({
                view: new ModifyIpsecView(options), //{activity: self, model: model}),
                type: "xlarge",
                showScrollbar: false
            });
            self.overlay.build();
        },

        endpointHandler: function(e) {
            var linkValue = e.selectedRows[0].id;

            var self = this;
            var options = {
                activity: self,
                context: self.context,
                selectedRow: linkValue
            };

            this.overlay = new OverlayWidget({
                view: new ModifyVpnDeviceEndpointsSettingsView(options),
                type: "wide",
                okButton: true,
                showScrollbar: true
            });
            this.overlay.build();
        },

        tunnelHandler: function(e) {
           var linkValue = e.selectedRows[0].id;
           var vpnProfileDetails = e.selectedRows[0]["profile.name"];
           var context = this.context;
           var selVPN = e.selectedRows[0];
           var detailconf = new IpsecVpnTunnelsGridConfig(context, linkValue, vpnProfileDetails, selVPN).getValues();

           var detailview = new GridView({
               conf: detailconf,
               activity    : this.options.activity
           });

           this.overlay = new OverlayWidget({
               view: detailview,
               okButton: true,
               showScrollbar: true,
               showBottombar: true,
               title : "",
               type: 'wide'
           });
           this.overlay.build();
        },

        modifyVpnDeviceAssociationEventHandler: function(row) {
            var self = this;
            var UUID = Slipstream.SDK.Utils.url_safe_uuid();
            var linkValue = row.selectedRows[0].id;
            var model = new this.model();
            var options = {
                activity: self,
                model: model,
                context: self.context,
                selectedRow: linkValue,
                UUID: UUID
            };

            self.overlay = new OverlayWidget({
                view: new ModifyVpnDeviceAssociationView(options),
                type: "xlarge",
                showScrollbar: true
            });
            self.overlay.build();
        },

        modifyVpnTunnelRouteHandler: function(row) {
            var self = this;
            var linkValue = row.selectedRows[0].id;
            var model = new this.model();
            var UUID = Slipstream.SDK.Utils.url_safe_uuid();

            var model = new this.model();
            var options = {
                activity: self,
                model: model,
                context: self.context,
                selectedRow: linkValue,
                UUID: UUID
            };
            self.overlay = new OverlayWidget({
                view: new ModifyVpnTunnelRouteSettingsView(options),
                type: "xlarge",
                showScrollbar: true
            });
            self.overlay.build();
        },

        deleteVpnHandler: function(e) {

            var linkValue = e.deletedRows[0].id;
            var name = e.deletedRows[0].name;
            var self = this;
            var model = new this.model();

            model.set('id', linkValue);
            model.on('sync', function(model, response, options) {
                console.log('succeeded: ' + JSON.stringify(model.toJSON()));
                self.gridWidget.reloadGrid();
            }, self)

            .on('destroy', function(model, response, options) {
                console.log('destroyed: ' + JSON.stringify(model.toJSON()));
                Utils.showNotification("success", self.context.getMessage('ipsec_vpns_grid_title') + " " + name + " " + self.context.getMessage('ipsec_vpns_delete_successful'));
                self.gridWidget.reloadGrid();
            }, self)

            .on('error', function(model, response){
                console.log('failed: ' + JSON.stringify(model.toJSON()));
                var responseText = JSON.parse(response.responseText);
                Utils.showNotification("error", responseText.title + ': ' + responseText.message);
                self.gridWidget.reloadGrid();
            }, self);

            model.destroy();
        },

        /**
         *  trigger publish on publish action click
         *  publish policy form view expects activity of ilp 
         *  so in this vpn we pass this.option.activity 
         *  which is actually refers to the vpn ilp grid
         *  Publish activity will take care of publish view in this case
         *  publish trigger logic is common across policies, so maintain same refer PublishActivity
         */
        publishHandler: function(rows) { 
           
            var intent = new Slipstream.SDK.Intent('slipstream.SDK.Intent.action.ACTION_PUBLISH',{
                  mime_type: 'vnd.juniper.net.service.vpn.publish'
              }),selectedVpns = rows.allRowIds === undefined? rows.selectedRowIds: rows.allRowIds;
              intent.putExtras({selectedPolicies: selectedVpns});
                                                                 
              this.context.startActivity(intent);
        },
         /**
         *  trigger update on update action click
         *  update policy form view expects activity of ilp 
         *  so in this vpn we pass this.option.activity 
         *  which is actually refers to the vpn ilp grid
         *  update activity will take care of update view in this case
         *  update trigger logic is common across policies, so maintain same refer PublishActivity
         */
        updateHandler: function(rows) { 
            var intent = new Slipstream.SDK.Intent('slipstream.SDK.Intent.action.ACTION_UPDATE',{
                  mime_type: 'vnd.juniper.net.service.vpn.update'
              }),selectedVpns = rows.allRowIds === undefined? rows.selectedRowIds: rows.allRowIds;
              intent.putExtras({selectedPolicies: selectedVpns});
                                                                 
              this.context.startActivity(intent);

        }

    });


    return IpsecVpnGridExtendView;
});
