    /**
     * Advanced Security editor view
     *
     * @module AdvancedSecurityEditorView
     * @author
     * @copyright Juniper Networks, Inc. 2015
     */

    define([
        'backbone',
        '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
        'widgets/form/formWidget',
        'widgets/dropDown/dropDownWidget',
        '../conf/fwRulesAdvanceSecurityEditorConfiguration.js',
        '../../../../../security-management/js/utm/models/utmPolicyModel.js',
        '../../../../../security-management/js/secIntel/models/secIntelPolicyCollection.js',
        '../../../../../security-management/js/secIntel/models/secIntelPolicyModel.js',
        '../../../../../vpn-management/js/vpn/models/ipsecVpnCollection.js',
        '../../threat-policies/models/threatPolicyCollection.js',
        '../../threat-policies/constants/threatManagementPolicyConstants.js',
        '../constants/fwRuleGridConstants.js'
    ], function (Backbone, BaseGridCellEditor, FormWidget, DropDownWidget, AdvSecurityEditorFormConfiguration, UTMPolicyModel, SecIntelPolicyCollection, SecIntelPolicyModel,
                 IpsecVpnCollection, ThreatPolicyCollection, ThreatPolicyConstants, PolicyManagementConstants) {
        var AdvancedSecurityEditorView = BaseGridCellEditor.extend({

            events: {
                'click #btnOk': 'updateModelData',
                'click #show_utm_overlay': 'showUTMOverlay',
                'click #show_secintel_overlay': 'showSecIntelOverlay',
                'click #source_identity_overlay': 'showSourceIdentityOverlay',
                'click #linkCancel': 'closeOverlay'
            },

            initialize: function () {
                this.context = this.options.context;
                this.model = this.options.model;

                this.formConfiguration = new AdvSecurityEditorFormConfiguration(this.context).advancedSecurity();

                this.secIntelPolicyCollection = new SecIntelPolicyCollection();
                this.vpnCollection = new IpsecVpnCollection();
                // threat policy collection
                this.threatpolicyCollection = new ThreatPolicyCollection();
            },

            render: function () {
                var self = this;
                self.form = new FormWidget({
                    "elements": self.formConfiguration,
                    "container": self.el
                });

                self.form.build();

                var utmUrlParams = {
                  acceptHeader : PolicyManagementConstants.UTM_ACCEPT_HEADER,
                  url : PolicyManagementConstants.UTM_URL,
                  jsonRoot : "utm-policies.utm-policy",
                  jsonRecordParam : "utm-policies",
                  templateResult : this.formatRemoteResult,
                  templateSelection:this.formatUTMRemoteResultSelection
                };

                var utmEditor = self.$el.find('#utm').parent();
                $(utmEditor).empty();
                var $span =  $(utmEditor).append('<select class="utmcelldropdown" style="width: 100%"></select>');
                
                self.utmDropdown = self.createRemoteDropDown('utmcelldropdown',null,utmUrlParams);

                var secIntelEditor = self.$el.find('#secIntel').parent();
                $(secIntelEditor).empty();
                var $span =  $(secIntelEditor).append('<select class="secintelcelldropdown" style="width: 100%"></select>');
                self.secIntelDropdown = new DropDownWidget({
                    "container": $span.find('.secintelcelldropdown'),
                    "data": [{"id": "None", "text":self.context.getMessage("none")}],
                    "enableSearch": true
                }).build();

                var sslUrlParams = {
                  acceptHeader : PolicyManagementConstants.SSLPROXY_ACCEPT_HEADER,
                  url : PolicyManagementConstants.SSLPROXY_URL,
                  jsonRoot : "ssl-forward-proxy-profiles.ssl-forward-proxy-profile",
                  jsonRecordParam : "ssl-forward-proxy-profiles",
                  templateResult : this.formatRemoteResult,
                  templateSelection:this.formatSSLRemoteResultSelection
                };

                var sslProxiesEditor = self.$el.find('#ssl_proxy').parent();
                $(sslProxiesEditor).empty();
                var $span =  $(sslProxiesEditor).append('<select class="sslproxiescelldropdown" style="width: 100%"></select>');
                self.sslProxiesDropdown = self.createRemoteDropDown('sslproxiescelldropdown',null,sslUrlParams);

                var appFwUrlParams = {
                  acceptHeader : PolicyManagementConstants.APPFW_ACCEPT_HEADER,
                  url : PolicyManagementConstants.APPFW_URL,
                  jsonRoot : "app-fw-policies.app-fw-policy",
                  jsonRecordParam : "app-fw-policies",
                  templateResult : this.formatRemoteResult,
                  templateSelection:this.formatAppFwRemoteResultSelection
                };

                var appFirewallEditor = self.$el.find('#app_firewall').parent();
                $(appFirewallEditor).empty();
                var $span =  $(appFirewallEditor).append('<select class="appfWcelldropdown" style="width: 100%"></select>');
                self.appFirewallDropdown = self.createRemoteDropDown('appfWcelldropdown',null,appFwUrlParams);

                var ipsEditor = self.$el.find('#ips').parent();
                $(ipsEditor).empty();
                var $span =  $(ipsEditor).append('<select class="ipscelldropdown" style="width: 100%"></select>');
                self.ipsDropdown = new DropDownWidget({
                    "container": $span.find('.ipscelldropdown'),
                    "data": []
                }).build();

                 self.ipsDropdown.addData([
                     {"id": "Off", "text":self.context.getMessage("off")},
                     {"id": "On", "text":self.context.getMessage("on")}
                 ]);

                // add threat policies
                var threatPolicyParams = {
                    acceptHeader : ThreatPolicyConstants.TMP_ACCEPT_HEADER,
                    url : ThreatPolicyConstants.TMP_FETCH_URL,
                    jsonRoot : ThreatPolicyConstants.TMP_JSON_ROOT,
                    jsonRecordParam : "threat-policies",
                    templateResult : this.formatRemoteResult,
                    templateSelection:this.formatTMPRemoteResultSelection
                };

                // create dropdown and populate values
                var threatPoliciesEditor = self.$el.find('#threatPolicy').parent();
                $(threatPoliciesEditor).empty();
                var $span =  $(threatPoliciesEditor).append('<select class="tmppoliciescelldropdown" style="width: 100%"></select>');
                self.tmpPoliciesDropdown = self.createRemoteDropDown('tmppoliciescelldropdown',null,threatPolicyParams);


//                self.getSecIntelPolicies();
                self.setDefaults();
                return self;
            },

            setDefaults: function(){
                var self = this;
                 //set the IPS value based on value in model
                 self.ipsDropdown.setValue(self.model.get("ips-enabled") === false ? "Off" : "On" );
                 //if the UTM policy is passed from the grid select that by default
                 if (self.model.get('utm-policy')) {
                    var utmId = self.model.get('utm-policy').id;
                    if (utmId){
                        self.utmDropdown.setValue({id:utmId,text:this.model.get('utm-policy').name});
                        self.utmPolicySelected = this.model.get('utm-policy');
                    }
                 }
                 var sslProxyProfile = self.model.get('ssl-forward-proxy-profile');
                 if (sslProxyProfile && sslProxyProfile.id) {
                    self.sslProxiesDropdown.setValue({id:sslProxyProfile.id,text:sslProxyProfile.name});
                    self.sslProxySelected = sslProxyProfile;
                 }

                 if(self.model.get('app-fw-policy')){
                    var appFirewall = self.model.get('app-fw-policy');
                    if (appFirewall && appFirewall.id) {
                        self.appFirewallDropdown.setValue({id:appFirewall.id,text:appFirewall.name});
                        self.appFwSelected = appFirewall;
                    }
                 }

                // set selection
                var threatPolicy = self.model.get('threat-policy');
                if (threatPolicy && threatPolicy.id) {
                    self.tmpPoliciesDropdown.setValue({id:threatPolicy.id,text:threatPolicy.name});
                    self.tmpPolicySelected = threatPolicy;
                }
            },

            createRemoteDropDown : function(container,onchange,urlParameters) {
              var self = this;
              return new DropDownWidget({
                        "container": self.$el.find("."+container),
                        "enableSearch": true,
                        "allowClearSelection": true,
                        "placeholder": self.context.getMessage('select_option'),
                        "remoteData": {
                            headers: {
                                "accept" : urlParameters.acceptHeader
                            },
                            "url": urlParameters.url,
                            "numberOfRows": 500,
                            "jsonRoot": urlParameters.jsonRoot,
                            "jsonRecords": function(data) {
                                return data[urlParameters.jsonRecordParam]['total']
                            },
                            "success": function(data){},
                            "error": function(){console.log("error while fetching data")}
                        },
                        "templateResult": urlParameters.templateResult,
                        "templateSelection": $.proxy(urlParameters.templateSelection,self),
                        "onChange": function(event) {
                            if (onchange) {onchange($(this).val(),self);}
                         }
              }).build();
            }, 

            formatRemoteResult : function(data) {
              return data.name;
            }, 

            formatUTMRemoteResultSelection: function (data) {
              if(data.name)
                this.utmPolicySelected = data;
              return data.name;
            },

            formatSSLRemoteResultSelection: function (data) {
              if(data.name)
                this.sslProxySelected = data;
              return data.name;
            },

            formatAppFwRemoteResultSelection: function (data) {
              if(data.name)
                this.appFwSelected = data;
              return data.name;
            },

            /**
             * Format threat management policy selection
             * @param data
             * @returns {data.name|*}
             */
            formatTMPRemoteResultSelection: function (data) {
                if(data.name)
                    this.threatPolicySelected = data;
                return data.name;
            },


            //Get the SecIntel policies for the SecIntel selection
//            getSecIntelPolicies: function () {
//                var self = this;
//
//                self.secIntelPolicyCollection.fetch({
//                    success: function (collection, response, options) {
//                        var secIntelPolicy = response['secintel-policies']['secintel-policy'];
////                        if (!$.isEmptyObject(secIntelPolicy)){
//                            var selectData = [];
//                            if (secIntelPolicy.length !== 0) {
//                                secIntelPolicy.forEach(function (object) {
//                                    selectData.push({id:object.id, text:object.name});
//                                });
//                            }
////                            else {
////                                selectData.push({id:secIntelPolicy.id, text:secIntelPolicy.name});
////                            }
//                            self.secIntelDropdown.addData(selectData);
//
//                            //if the SecIntel policy is passed from the grid select that by default
//                            if (self.model.get('sec-intel-policy')) {
//                                var secIntelId = self.model.get('sec-intel-policy').id;
//                                if (secIntelId) {
//                                    self.secIntelDropdown.setValue(secIntelId)
//                                }
//                            }
////                        }
//                    },
//                    error: function (collection, response, options) {
//                        console.log('SecIntel policy collection not fetched');
//                    }
//                });
//            },

            //Create the data that needs to be displayed in the grid column and also the data that needs to be sent to the backend
            updateModelData : function(e) {
                var self = this;
                var data = {};
                var backendData = {}; //data to be passed to backend for save

                //by default IPS is disabled
                var ipsPolicy =  self.ipsDropdown.getValue(); //self.$el.find("#ips option:selected").val();


                //get the UTM policy ID If NONE is selected them pass empty data
//                var utmPolicyId =  self.$el.find("#utm option:selected").val(),utmPolicy={};
                var utmPolicyId =  self.utmDropdown.getValue(),utmPolicy={};

                if (utmPolicyId){
                    utmPolicy = self.utmPolicySelected;
                } 

                //get the SecIntel policy ID If NONE is selected them pass empty data
//                var secIntelPolicyId =  self.$el.find("#secIntel option:selected").val(),secIntelPolicy={};
/*
                var secIntelPolicyId =  self.secIntelDropdown.getValue(),secIntelPolicy={};
                if (secIntelPolicyId != "None"){
                    secIntelPolicy = _.find(self.secIntelPolicyCollection.models, function(item){
                        return item.get('id') === parseInt(secIntelPolicyId);
                    });

                } 
*/
                //get the ssl forward proxy value from UI
                //get the SecIntel policy ID If NONE is selected them pass empty data
//                var sslProxyId =  self.$el.find("#ssl_proxy option:selected").val(),sslProxy={};
                var sslProxyId =  self.sslProxiesDropdown.getValue(),sslProxy={};
                if (sslProxyId){
                    sslProxy = self.sslProxySelected;
                } 

                //get the ssl forward proxy value from UI
                //get the SecIntel policy ID If NONE is selected them pass empty data
                var appFirewallId = self.appFirewallDropdown.getValue(), appFirewall={};
                if (appFirewallId){
                    appFirewall = self.appFwSelected;
                }

                // add threat management policy to model
                var threatPolicyId =  self.tmpPoliciesDropdown.getValue(),threatPolicy={};
                if (threatPolicyId){
                    threatPolicy = self.threatPolicySelected;
                }

                self.model.set({
                    'ips-enabled': ipsPolicy === "Off" ? false : true,
                    'utm-policy': utmPolicy,
                    //'sec-intel-policy': secIntelPolicy.attributes,
                    'ssl-forward-proxy-profile' : sslProxy,
                    'app-fw-policy' : appFirewall,
                    'threat-policy': threatPolicy
                });

               this.editCompleted(e,this.model);
            },

            showUTMOverlay : function(e){
                var self = this;

                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                    "mime_type": "vnd.juniper.net.utm-policy"
                }),
                action;

                self.context.startActivityForResult(intent, function(resultCode, data) {

                    // set new utm as selected by default
                    if (resultCode === "RESULT_OK" && data) {
                        self.utmDropdown.setValue({id:data.id,text:data.name});
                        self.utmPolicySelected = data;
                    }
                });

                return self;
            },

              //Do not delete need later
//            showSecIntelOverlay : function(e){
//                var self = this;
//                console.log("secintel overlay");
//
//                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
//                    "mime_type": "vnd.juniper.net.secintel-policies"
//                }),
//                action;
//
//                self.context.startActivityForResult(intent, function(resultCode, data) {
//
//                    // add to collection
//                    var secIntelPolicyModel = new SecIntelPolicyModel(data);
//                    self.secIntelPolicyCollection.add(secIntelPolicyModel);
//
//                    // set new secintel as selected by default
//                    if (resultCode === "RESULT_OK" && data) {
//                        self.secIntelDropdown.addData([{id:data.id, text:data.name}]);
//                        self.secIntelDropdown.setValue(data.id)
//                    }
//                });
//
//                return self;
//            },

            setCellViewValues: function (rowData) {
                // to get the values from the grid cell in this view
                this.model = this.options.ruleCollection.get(rowData.originalRowData[PolicyManagementConstants.JSON_ID]);
            }

        });

        return AdvancedSecurityEditorView;
    });