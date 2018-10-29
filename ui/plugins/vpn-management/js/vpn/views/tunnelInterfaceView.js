/**
 * Module that implements the tunnel interface view.
 *
 * @module TunnelInterfaceView
 * @author Srinivasan Sriramulu <ssriram@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/tunnelInterfaceFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       TunnelInterfaceFormConfiguration
) {

    var tunnelAddressView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.activity = options.activity;
            //this.UUID = this.context.UUID;
        },

        events: {
            'click #btnOk': "saveTunnelAddressSettings",
            'click #linkCancel': "closeTunnelAddressSettings",
            'click #get_next_ip': "getNextIP"
        },

        render: function(){
            var self = this;
            var formConfiguration = new TunnelInterfaceFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.context.allData.tunnels.tunnel[0]["tunnel-address"] //{} it will display data in editable mode
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "")
                      this.$el.find('#tunnel-address-id').val(this.passedRowData["cellData"][0]);

            return this;
        },

        getSelectedTunnelAddress: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];
            this.passedRowData = rowData;
        },
        getNextIP: function (e){
            UUID = this.context.UUID;
            if(this.context.allData.tunnels.tunnel.length>0){
                allTunnelData = this.context.allData.tunnels.tunnel[0];
                tunnelIfName = allTunnelData["tunnel-if-name"];
                Id = this.context.vpnId;//allTunnelData["id"];
                //address = allTunnelData["tunnel-address"];
                //modId = allTunnelData["moid"];
                this.$('#tunnel-address-id').val("");
                requestdata = {
                               "tunnel-ip-request":{
                                   "tunnel-if-name":tunnelIfName,
                                   "vpn-moid":"net.juniper.space.sd.vpnmanager.jpa.IPSecVPNEntity:"+Id,
                                   "endpoint-moid":"",
                                   "address":""
                               }
                           }
                $.ajax({
                        "url": '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/next-available-tunnel-ip?ui-session-id='+UUID,
                        "type": 'POST',
                        "contentType": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.tunnel-ip-request+json;version=1;charset=UTF-8',
                         "headers" :{
                             "accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns.tunnel-ip-response+json;version=1;q=0.01'
                         },
                        //"async": false,
                        "data": JSON.stringify(requestdata),
                        "success": function( responseData, textStatus, jQxhr ) {
                            console.log(responseData);
                            nexAvtIp = responseData["tunnel-ip-response"]["value"];
                            if(nexAvtIp !== 'undefined'){
                                $('#tunnel-address-id').val("");
                                $('#tunnel-address-id').val(nexAvtIp);
                            }

                        },
                        "error": function( jqXhr, textStatus, errorThrown ) {
                            console.log( errorThrown );
                        }
                });

            }


        },

        saveTunnel: function() {

            var saveStatus = false;
            $.ajax({
                url: '/api/juniper/sd/vpn-management/vpn-ui/ipsec-vpns/save-tunnels?ui-session-id=' + this.UUID + '&overwrite-changes=true',
                type: 'get',
                headers: {
                    'accept': 'application/vnd.juniper.sd.vpn-management.ipsec-vpn.save-tunnels-response+json;version=1;q=0.01'

                },
                success: function(data, status) {
                    saveStatus = true;
                },
                async: false,
                error: function(status) {
                    console.log('Unable to clear cache');
                }
            });

            return saveStatus;
        },

        saveTunnelAddressSettings: function(e){
            var data = this.getSelectedTunnelAddress();
            if(data == "" || data == undefined) {
                this.formWidget.showFormError("Please enter all fields");
                return false;
            }
            this.options.save(this.options.columnName,data);
            this.closeTunnelAddressSettings(e);
            this.activity.grid.removeEditModeOnRow();
            this.saveTunnel();
            this.activity.grid.reloadGrid();
        },

        closeTunnelAddressSettings: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return tunnelAddressView;
});
