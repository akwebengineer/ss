    /**
     * Advanced Security editor view
     *
     * @module AdvancedSecurityEditorView
     * @author
     * @copyright Juniper Networks, Inc. 2015
     */

    define([
        'widgets/dropDown/dropDownWidget',
        './fwRuleGridAdvSecurityEditorView.js',
        '../conf/fwRuleWizardAdvanceSecurityConfig.js',
        '../constants/fwRuleGridConstants.js'
    ], function (DropDownWidget, RuleGridAdvSecurityView, AdvSecurityFormConfiguration, PolicyManagementConstants) {

        var WizardAdvancedSecurityEditorView = RuleGridAdvSecurityView.extend({
            
            events : $.extend(RuleGridAdvSecurityView.prototype.events, {
//                'change select': 'onSelection'
                }
            ),
            
            initialize: function () {
                
                RuleGridAdvSecurityView.prototype.initialize.call(this,this.options);
                this.formConfiguration = new AdvSecurityFormConfiguration(this.context).advancedSecurity();
            },
            actionDropdownOnChange:function(dropDown){
                var self = this, targetValue = self.actionDropdown.getValue();
                if (targetValue != "TUNNEL") {
                    self.$el.find('#wizard_vpn_section').hide();
                } else {
                    self.$el.find('#wizard_vpn_section').show();
                }
                if (targetValue != "PERMIT" && targetValue != "TUNNEL") {

//                    self.$el.find('.appfWcelldropdown').select2("val","");
//                    self.$el.find('.sslproxiescelldropdown').select2("val","");
//                    self.$el.find('.utmcelldropdown').select2("val","");
//                    self.$el.find('.tmppoliciescelldropdown').select2("val","");
                    self.ipsDropdown.setValue("Off");
                    self.sslProxiesDropdown.setValue({id:"",text:""});
                    self.utmDropdown.setValue("None");
                    self.tmpPoliciesDropdown.setValue({id:"",text:""});
                    self.appFirewallDropdown.setValue("None");
                    //self.secIntelDropdown.setValue("None");
                    self.disableAdvancedSecurity(true);
                } else {
                    self.disableAdvancedSecurity(false);
                }
            },
            render: function() {
                 RuleGridAdvSecurityView.prototype.render.call(this);
                var self = this,
                actionEditor = self.$el.find('#wizard_action').parent();
                $(actionEditor).empty();
                var $span =  $(actionEditor).append('<select class="wizardaction" style="width: 100%"></select>');
                self.actionDropdown = new DropDownWidget({
                    "container": $span.find('.wizardaction'),
                    "data": self.getActionDropDownData(),

                    "onChange": $.proxy(self.actionDropdownOnChange, self)
                }).build();

                var vpnTunnelUrlParams = {
                  acceptHeader : PolicyManagementConstants.POLICY_VPN_ACCEPT_HEADER,
                  url : PolicyManagementConstants.POLICY_URL + self.options.policyObj.id + PolicyManagementConstants.VPN_TUNNELS,
                  jsonRoot : "VpnTunnelList.vpn-tunnel-refs",
                  jsonRecordParam : "VpnTunnelList",
                  templateResult : this.formatVpnRemoteResult,
                  templateSelection:this.formatVpnRemoteResultSelection
                };

               // var vpnContainer = self.$el.find('.wizardvpnTunnel');
                self.vpnTunnelDropDown = self.createRemoteDropDown('wizardvpnTunnel',self.onVpnChange,vpnTunnelUrlParams);
                /*new DropDownWidget({
                    "container": vpnContainer,
                    "data": [],
                    "placeholder":  self.context.getMessage("select_vpn"),
                    "enableSearch": true,
                    "onChange": function(){
                        if (this.value) {
                            self.$el.find('.vpn_tunnel_class').removeClass("error");
                            self.model.set({"vpn-tunnel-refs" : self.vpnTunnelCollection.findWhere({name: this.value}).toJSON()});
                        }
                    }
                }).build();*/

                self.setWizardDefaults();
               // self.getVpnTunnels();
                self.bindDropdownEvents();
                return self;
            },

            getActionDropDownData: function() {

                var actionDropdownData =  [{
                    "id": "PERMIT",
                    "text": this.context.getMessage("rulesGrid_column_action_permit")
                },{
                    "id": "DENY",
                    "text": this.context.getMessage("rulesGrid_column_action_deny")
                },{
                    "id": "REJECT",
                    "text": this.context.getMessage("rulesGrid_column_action_reject")
                }];

                if (this.options.policyObj && this.options.policyObj["policy-type"] === "DEVICE") {
                    actionDropdownData.push({
                        "id": "TUNNEL",
                        "text": this.context.getMessage("permit_and_tunnel")
                    });
                }
                return actionDropdownData;
            },

            bindDropdownEvents : function(){
                var self = this;
                self.utmDropdown.conf.$container.on("change",function(){
                    if(this.value){
                        self.setAction();
                    }
                });
/*
                self.secIntelDropdown.conf.$container.on("change",function(){
                    if(this.value != "None"){
                        self.setAction();
                    }
                });
*/
                self.sslProxiesDropdown.conf.$container.on("change",function(){
                    if(this.value){
                        self.setAction();
                    }
                });

                self.ipsDropdown.conf.$container.on("change",function(){
                    if(this.value != "Off"){
                        self.setAction();
                    }
                });

                self.tmpPoliciesDropdown.conf.$container.on("change",function(){
                    if(this.value){
                        self.setAction();
                    }
                });
            },

            setAction: function(){
                var self=this, origAction = self.actionDropdown.getValue();
                if (origAction != "PERMIT" && origAction != "TUNNEL"){
                    self.actionDropdown.setValue("PERMIT");
                }
            },

            setWizardDefaults : function() {
                var self =this;
                var action = self.model.get("action");
                self.actionDropdown.setValue(action);
                
                if (action != "TUNNEL") {
                    this.$el.find('#wizard_vpn_section').hide();
                }

                if (action != "PERMIT" && action != "TUNNEL") {
                    this.disableAdvancedSecurity(true);
                }

                if(self.model.get("vpn-tunnel-refs")){
                    var vpnTunnelInModel = self.model.get("vpn-tunnel-refs");
                    self.vpnTunnelDropDown.setValue({id:vpnTunnelInModel.id,text:vpnTunnelInModel.name});
                }
            },

            disableAdvancedSecurity: function(disabled) {
                
                this.$el.find('.appfWcelldropdown').prop("disabled", disabled);
//                this.$el.find('.appfWcelldropdown').select2('enable',!disabled);
//                this.$el.find('.sslproxiescelldropdown').select2('enable',!disabled);
//                this.$el.find('.utmcelldropdown').select2('enable',!disabled);
                this.$el.find('.ipscelldropdown').prop("disabled", disabled);
                this.$el.find('.tmppoliciescelldropdown').prop("disabled", disabled);

                this.$el.find('.sslproxiescelldropdown').prop("disabled", disabled);
                this.$el.find('.utmcelldropdown').prop("disabled", disabled);
                this.$el.find('#show_utm_overlay').prop("disabled", disabled);
            },

            beforePageChange : function(currentStep, requestedStep) {
                if (this.actionDropdown.getValue() === "TUNNEL" && !this.vpnTunnelDropDown.getValue()) {
                    this.$el.find('.vpn_tunnel_class').addClass("error");
                    return false;
                } 
                this.$el.find('.vpn_tunnel_class').removeClass("error");

                this.updateModelData();
                this.model.set("action", this.actionDropdown.getValue());
                return true;
            },

            editCompleted :function(e, model){
                this.closeOverlay(e);
            },

            closeOverlay: function (e) {
                this.model.set("action", this.$el.find('#wizard_action').val());
            },

            onSelection: function (e) {
                var targetId = e.currentTarget.id;
                var targetValue = e.currentTarget.value;

                if (targetId === "utm" || targetId === "ips" || targetId === "secIntel" ||
                    targetId === "ssl_proxy" || targetId === "threatPolicy") {
                    if (targetValue != "" && targetValue != "Off") {
                        var origAction = this.$el.find("#wizard_action").val();
                        if (origAction != "PERMIT" && origAction != "TUNNEL") {
                            this.$el.find("#wizard_action").val("PERMIT");
                            this.$el.find('#wizard_action_desc').show();
                            this.$el.find('#wizard_vpn_section').hide();
                        }
                    } 
                } else if (targetId === "wizard_action") {

                    if (targetValue != "PERMIT" && targetValue != "TUNNEL") {
                        this.$el.find("#utm").val("");
                        this.$el.find("#ips").val("Off");
                        //this.$el.find("#secIntel").val("");
                    }

                    if (targetValue != "TUNNEL") {
                        this.$el.find('#wizard_vpn_section').hide();
                    } else {
                        this.$el.find('#wizard_vpn_section').show();
                    }
                } else if (targetId === "vpn_tunnel") {
                    this.model.set({"vpn-tunnel-refs" : this.vpnTunnelCollection.findWhere({name: targetValue}).toJSON()});
                }
            },

           /* /**
             * Get the policy VPN tunnels
             
            getVpnTunnels: function () {
                var self = this;

                this.vpnTunnelCollection.fetch({
                    success: function (collection, response, options) {
                        var vpnTunnels = response['VpnTunnelList']['vpn-tunnel-refs'];

                        if (vpnTunnels) {
                            if (vpnTunnels.length !== 0) {
                                var selectData = [];
                                for (var i=0; i < vpnTunnels.length; i++) {
                                    var vpnTunnel = vpnTunnels[i].name;
                                    selectData.push({id:vpnTunnel, text:vpnTunnel});
                                }
                                self.vpnTunnelDropDown.addData(selectData);
                                if(self.model.get("vpn-tunnel-refs")){
                                    var vpnTunnelInModel = self.model.get("vpn-tunnel-refs");
                                    self.vpnTunnelDropDown.setValue(vpnTunnelInModel.name);
                                }
                            }
                        }
                    },
                    error: function (collection, response, options) {
                        console.log('Firewall VPN Tunnel collection not fetched');
                    }
                });
            },*/ 

            formatVpnRemoteResult: function(data) {
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

                if (vpn == undefined) {
                    $myCustomHtml = $("<div class='iconImg'><span>Select VPN...</span></div>");
                } else {
                    if (sd_managed == false) {
                        $myCustomHtml = $("<div class='iconImg'><span><img width=14px height=14px src='" + imageDir + "/icon_tunnel_device.svg'/> " + vpn + "</span></div>");
                    } else {
                        $myCustomHtml = $("<div class='iconImg'><span><img width=14px height=14px src='" + imageDir + "/icon_tunnel_SD_managed.svg'/> " + vpn + " (" + vpn_name + ")</span></div>");
                    }
                }
                return $myCustomHtml;
            },

            formatVpnRemoteResultSelection : function (data) {
              if(data.name) {
                this.utmPolicySelected = data;
                this.$el.find('.vpn_tunnel_class').removeClass("error");
                this.model.set({"vpn-tunnel-refs" : data });
              }  
              //return data.name;
              return this.formatVpnRemoteResult(data);
            },

            getSummary: function() {
                var summary = [];
                var self = this;

                summary.push({
                    label: self.context.getMessage('advanced_security'),
                    value: ' '
                });

                summary.push({
                        label: self.context.getMessage('fw_rules_editor_adv_security_app_firewall'),
                        value: this.model.get("app-fw-policy") ? this.model.get("app-fw-policy")["name"] : ""
                });

                summary.push({
                        label: self.context.getMessage('fw_rules_editor_adv_security_ssl_forward_proxy'),
                        value: this.model.get("ssl-forward-proxy-profile") ? this.model.get("ssl-forward-proxy-profile")["name"] : ""
                });

                summary.push({
                        label: self.context.getMessage('utm'),
                        value: this.model.get("utm-policy") ? this.model.get("utm-policy")["name"] : ""
                });

                summary.push({
                        label: self.context.getMessage('ips'),
                        value: this.model.get("ips-enabled") ? self.context.getMessage('on') : self.context.getMessage('off')
                });

                summary.push({
                    label: self.context.getMessage('threat-policy'),
                    value: this.model.get("threat-policy") ? this.model.get("threat-policy")["name"] : ""
                });
/*
                summary.push({
                        label: self.context.getMessage('sec_intel'),
                        value: this.model.get("secintel-policy") ? this.model.get("secintel-policy")["name"] : ""
                });
*/
                summary.push({
                        label: self.context.getMessage('action'),
                        value: this.model.get("action")
                });

                if (this.model.get("action") === "TUNNEL") {
                    summary.push({
                        label: self.context.getMessage('tunnel'),
                        value: this.model.get("vpn-tunnel-refs").name
                    });
                }
               
                return summary;
            },

            getTitle: function () {
                return this.context.getMessage("advanced_security");
            }
        });

        return WizardAdvancedSecurityEditorView;
    });