/**
 * FW Rule Grid VPN Tunnels editor view
 *
 * @module FWRuleGridVPNTunnelsEditorView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/dropDown/dropDownWidget',
    '../conf/fwRuleGridVPNTunnelsConf.js',
    '../constants/fwRuleGridConstants.js'
], function (Backbone, FormWidget, DropDownWidget, RuleGridVPNTunnelsConf, PolicyManagementConstants) {
    var FWRuleGridVPNTunnelsEditorView = Backbone.View.extend({

        events: {
            'click #btnVPNOk': 'updateModelData',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            this.context = this.options.context;
            this.model = this.options.model;
            //this.vpn = this.options.vpn;

            this.formConfiguration = new RuleGridVPNTunnelsConf(this.context);
        },

        render: function () {
            var self = this;
            self.form = new FormWidget({
                "elements": self.formConfiguration.gridVPNTunnels(),
                "container": self.el
            });

            self.form.build();

            var vpnContainer = self.$el.find('.wizardvpnTunnel');
            self.container = vpnContainer;
            self.vpnTunnelDropdown = new DropDownWidget({
                "container": vpnContainer,
                "enableSearch": true,
                "placeholder": self.context.getMessage("select_vpn"),
                "remoteData": {
                    headers: {
                        "accept" : PolicyManagementConstants.POLICY_VPN_ACCEPT_HEADER
                    },
                    "url": PolicyManagementConstants.POLICY_URL + self.options.policyId + PolicyManagementConstants.VPN_TUNNELS,
                    "numberOfRows": 500,
                    "jsonRoot": 'VpnTunnelList.vpn-tunnel-refs',
                    "jsonRecords": function(data) {
                        return data['VpnTunnelList']['total']
                    },
                    "success": function(data){},
                    "error": function(){console.log("error while fetching data")}
                 },
                 "initSelection": $.proxy(self.templateResultSelection,self),
                 "templateResult": self.templateResult,
                 "templateSelection": $.proxy(self.templateResultSelection,self),
                 "onChange": function(event) {
                     if (this.value) {
                       // console.log("this.value=" + this.value);
                       // var vpn = this.value.split(';')[1];
                       // self.model.set("vpn-tunnel-refs", );
                        self.$el.find('.vpn_tunnel_class').removeClass("error");
                     }
                  }
            }).build();


            // if (self.model.get("vpn-tunnel-refs").name) {
            //     var imageDir = '/installed_plugins/security-management/images';
            //     var vpn = self.model.get("vpn-tunnel-refs").name;
            //     var vpn_name = (self.model.get("vpn-tunnel-refs"))["vpn-name"];
            //     var sd_managed = self.model.get("is-managed");
            //     var $myCustomHtml = $("<span class='iconImg'>" + vpn + "</span>");

            //     if (vpn != undefined) {
            //         if (sd_managed === false) {
            //             $myCustomHtml = $("<div class='iconImg'><span><img width=14px height=14px src='" + imageDir + "/icon_tunnel_device.svg'/> " + vpn + "</span></div>");
            //         } else {
            //             $myCustomHtml = $("<div class='iconImg'><span><img src='" + imageDir + "/icon_tunnel_SD_managed.svg'/> " + vpn + " (" + vpn_name + ")</span></div>");
            //         }
            //     }

            //     $myCustomHtml = "<span><img src='" + imageDir + "/icon_tunnel_SD_managed.svg'/></span>" + vpn;
            //     self.vpnTunnelDropdown.setValue({id:self.model.get("vpn-tunnel-refs").id,text:$myCustomHtml});
            // }

            if (self.model.get("vpn-tunnel-refs").name)
                self.vpnTunnelDropdown.setValue({id:self.model.get("vpn-tunnel-refs").id,text:self.model.get("vpn-tunnel-refs").name});


          //  this.getVpnTunnels();

            return self;
        },

        templateResult: function(data) {
            var imageDir = '/installed_plugins/base-policy-management/images';
            var mySelect = data.id;
            var vpn = undefined;
            var vpn_name = data["vpn-name"];
            var sd_managed = false;
            if (mySelect != undefined) {
                vpn = data.name;
                sd_managed = data["is-managed"];
            }
            var $myCustomHtml = $("<span class='iconImg'>" + vpn + "</span>");

            // $myCustomHtml.hover(function() {
            //     $(this).find(".iconImg").removeClass('.icon_device_vpn').addClass('.icon_device_vpn:hover');
            // }, function() {
            //     $(this).find(".iconImg").removeClass('.icon_device_vpn_hover').addClass('.icon_device_vpn');
            // });

            if (vpn == undefined) {
                $myCustomHtml = $("<div class='iconImg'><span>Select VPN...</span></div>");
            } else {
                if (sd_managed == false) {
                    //$myCustomHtml = $("<div class='icon_deny'><span style='width:16px; display:inline-block;'> " + vpn + "</span></div>");
                    //$myCustomHtml = $("<div class='iconImg'><span><img src='" + imageDir + "/icon_device_vpn_hover.png'/> " + vpn + "</span></div>");
                    $myCustomHtml = $("<div class='iconImg'><span><img width=14px height=14px src='" + imageDir + "/icon_tunnel_device.svg'/> " + vpn + "</span></div>");
                } else {
                    //$myCustomHtml = $("<div class='iconImg'><span style='width:16px; display:inline-block;'> " + vpn + "</span></div>");
                    //$myCustomHtml = $("<div class='iconImg'><span>&nbsp&nbsp&nbsp&nbsp&nbsp " + vpn + "</span></div>");
                    $myCustomHtml = $("<div class='iconImg'><span><img width=14px height=14px src='" + imageDir + "/icon_tunnel_SD_managed.svg'/> " + vpn + " (" + vpn_name + ")</span></div>");
                }
            }


/*
            if (vpn == undefined) {
                $myCustomHtml = $("<div class='iconImg'><span>Select VPN...</span></div>");
            } else {
                if (sd_managed == false) {
                    $(".wizardvpnTunnel").hover(function() {
                            console.log("hover");
                            $myCustomHtml = $("<div class='iconImg colspan=4><span><img src='" + imageDir + "/icon_device_vpn_hover.png'/> " + vpn + "</span></div>");
                        }, function() {
                            console.log("not hover");
                            $myCustomHtml = $("<div class='iconImg' colspan=4><span><img src='" + imageDir + "/icon_device_vpn.png'/> " + vpn + "</span></div>");
                    });
                } else {
                        $myCustomHtml = $("<div class='iconImg'><span>&nbsp&nbsp&nbsp&nbsp&nbsp " + vpn + "</span></div>");
                }
            }

*/
/*************************
       //     if (sd_managed == 'false') {
                //$myCustomHtml = $("<span><img src='" + imageDir + "/icon_new_device.svg' style='width:14px;height:14px;'/> " + vpn + "</span>");
                //$myCustomHtml = $("<span><img src='" + imageDir + "/icon_device_vpn.svg' style='width:14px;height:5px;'/> " + vpn + "</span>");
               $myCustomHtml = $("<span><img src='" + imageDir + "/icon_device_vpn.png'/> " + vpn + "</span>");
        //        $myCustomHtml = $("<div class='icon_permit14X14'/>&nbsp&nbsp" + vpn + "</div>");
   //         }
**************************/

            console.log("data");
            console.log(data);
            console.log("tunnel: " + $myCustomHtml.text());
            return $myCustomHtml;
        },

        templateResultSelection : function(data) {
            if(data.name) {
                this.model.set("vpn-tunnel-refs", data);
            }
            return this.templateResult(data);
        },
        /**
         * Get the policy VPN tunnels
         **/
       /* getVpnTunnels: function () {
            var self = this;

            this.vpnTunnelCollection.fetch({
                success: function (collection, response, options) {
                    var vpnTunnels = response['VpnTunnelList']['vpn-tunnel-refs'];

                    if (vpnTunnels) {
                        if (vpnTunnels.length !== 0) {
                                var selectData = [];
                            for (var i=0; i < vpnTunnels.length; i++) {
                                var vpnTunnel = vpnTunnels[i].name;
                                var sd_managed = vpnTunnels[i]["is-managed"];                    
                                selectData.push({id:sd_managed + ';' + vpnTunnel, text:vpnTunnel});
                            }
                            self.vpnTunnelDropdown.addData(selectData);
                            //self.vpnTunnelDropdown.setValue(self.model.get("vpn-tunnel-refs").name);
                            for (var i=0; i < vpnTunnels.length; i++) {
                                if (vpnTunnel === self.model.get("vpn-tunnel-refs").name)
                                    self.vpnTunnelDropdown.setValue(sd_managed + ";" + vpnTunnel);
                            }
                        }
                    }
                },
                error: function (collection, response, options) {
                    console.log('Firewall VPN Tunnel collection not fetched');
                }
            });
        },*/

        updateModelData : function(e) {

            var selectedVPN = this.vpnTunnelDropdown.getValue();
            if (!selectedVPN) {
                this.$el.find('.vpn_tunnel_class').addClass("error");
                return;
            } 
            this.$el.find('.vpn_tunnel_class').removeClass("error");

            //selectedVPN = selectedVPN.split(';')[1];

           // var vpnTunnel = this.vpnTunnelCollection.findWhere({name: selectedVPN}).toJSON();
            this.model.set("action", "TUNNEL");//set the action in the rule only when the user selects the tunnel
           // this.model.set("vpn-tunnel-refs", vpnTunnel);
            
            this.options.ruleCollection.modifyRule(this.model);
            this.closeOverlay(e);
        }, 

        closeOverlay : function(e) {
            this.options.close(e);
        }

    });

    return FWRuleGridVPNTunnelsEditorView;
});
