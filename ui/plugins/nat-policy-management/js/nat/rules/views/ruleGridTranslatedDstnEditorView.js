/**
 * Translated Packet Destination editor view that extends from base cellEditor
 *
 * @module translatedDstnEditorView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'backbone.syphon',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    '../conf/translatedDstnEditorFormConfiguration.js',
    '../../nat-pools/models/natPoolsModel.js',
    '../../../../../object-manager/js/objects/models/addressCollection.js',
    '../models/vrsPerPolicyCollection.js',
    '../constants/natRuleGridConstants.js',
    'widgets/dropDown/dropDownWidget',
    '../../widgets/AddressDropDown.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (Backbone, FormWidget, Syphon, BaseGridCellEditor, TranslatedDstnEditorFormConfiguration, NatPoolModel,
    AddressesCollection, RoutingCollection, PolicyManagementConstants,DropDownWidget, AddressDropDownWidget, NATPolicyManagementConstants) {
    var RuleGridTranslatedDstnEditorView = BaseGridCellEditor.extend({

        events: {
            'click #btnOk': 'updateModelData',
            'click #linkCancel': 'closeOverlay',
            'click #destinationpool-link':"addDestinationPool",
            'click #translatedaddress-link' :"addTranslatedAddress"
        },

        initialize: function () {
            this.context = this.options.context;
            this.model = this.options.model;
            this.poolModel = new NatPoolModel();
            this.addresses = new AddressesCollection();
            this.routingInstancecollection = new RoutingCollection({url: '/api/juniper/sd/policy-management/nat/policies/' + this.options.policyObj.id+ '/virtual-routers'});
            this.TranslatedDstnEditorFormConfiguration = new TranslatedDstnEditorFormConfiguration(this.context);
        },

        render : function(){
            var self = this;
            var natType = self.rowData['nat-type'];

            this.form = new FormWidget({
                "elements": this.TranslatedDstnEditorFormConfiguration.getElements(natType),
                "container": this.el
            });

            this.form.build();
            
            this.mappedPortTypeDropDown =this.createDropDown('nat_rulesgrid_editor_transPktDstn_mapped_portType',
                [{"text":"Any","id":"0"},{"text": "Port","id": "1"},{"text": "Range","id": "2"}], this.mappedPortypeChangeHandler);
            this.routingInstanceDropDown =this.createDropDown('nat_rulesgrid_editor_transPktDstn_routing_instance');
            this.addressDropDown =this.createAddressDropDown('nat_rulesgrid_editor_transPktDstn_address',this.transAddrChangeHandler);
            this.poolDropDown =this.createPoolDropDown('nat_rulesgrid_editor_transPktDstn_pool',this.dstPoolChangeHandler);
            
            var destinationPool = this.$el.find('#nat_rulesgrid_editor_transPktDstn_pool');
            destinationPool.parent().after( "<a id='destinationpool-link' style='margin:15px'>"+ "Add New" +"</a>" );

            var translatedAddress = this.$el.find('#nat_rulesgrid_editor_transPktDstn_address');
            translatedAddress.parent().after( "<a id='translatedaddress-link' style='margin:15px'>"+ "Add New" +"</a>" );
           // this.populateTranslatedAddressDropDown();

            this.populateRoutingInstanceDropDown();

            this.$el.find('input[type=radio][name=translation_type]').click(function() {
                self.translationTypeChangeHandler(this.value, this);
            });
            this.translationTypeChangeHandler("NO_TRANSLATION");

            this.$el.find('#nat_rulesgrid_editor_transPktDstn_mapped_portType').change(function() {
              self.mappedPortypeChangeHandler(this.value);
            });

            this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_end').bind('isEndPortGreater', function(e, isValid) {
                  self.checkEndPortGreaterValidation(isValid, self);
            });

            this.setDefaults();

            return this;
        },
        createDropDown: function(container,data,onchange){
            var self = this;
            this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
            return new DropDownWidget({
              "container": this.$el.find("."+container),
              "data": JSON.stringify(data),
              "placeholder": this.context.getMessage('select_option'),
              "enableSearch": true,
              "onChange": function(event) {
                  if (onchange) {onchange($(this).val(),self);}
               }
            }).build();
        },
        createAddressDropDown : function(container,onchange) {
            var self = this,
               urlFilter1={
                  property:'addressType',
                  modifier:'eq',
                  value:['IPADDRESS']
                },
                urlFilter2={
                  property:'addressType',
                  modifier:'eq',
                  value:['NETWORK']
                },
                urlFilters = [urlFilter1,urlFilter2];
               var addressDropDownWidget = new AddressDropDownWidget({
                  "container": container,
                  "THIS":self,
                  "urlFilters":urlFilters,
                  "onchange":onchange,
                  "formatRemoteResult": self.formatRemoteResult,
                  "formatRemoteResultSelection": function (data) {
                       if(data.name)
                        self.addrSelectedObj = data;
                      return data.name;
                   } 
              });
              return addressDropDownWidget.build();
        },
        formatRemoteResult: function (data) {
            var GROUP = 'GROUP';
            var name = data.name;
            if(data['definition-type']!="PREDEFINED" && data.name) {
                name = data['address-type'].toLowerCase()!=GROUP.toLowerCase()?data.name+ '(' + data['ip-address'] + ')':data.name;
            }  
            return name;
        },
        createPoolDropDown : function(container,onchange) {
            var self = this;
            this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
               return new DropDownWidget({
                  "container": this.$el.find("."+container),
                  "enableSearch": true,
                  "remoteData": {
                      headers: {
                          "accept" : NATPolicyManagementConstants.NAT_POOLS_ACCEPT_HEADER
                      },
                      "url": self.getPoolsURL(),
                      "numberOfRows": 500,
                      "jsonRoot": "nat-pools.nat-pool",
                      "jsonRecords": function(data) {
                          return data['nat-pools']['total'];
                      },
                      "success": function(data){console.log("call succeeded");},
                      "error": function(){console.log("error while fetching data");}
                  },
                  "templateResult": this.formatPoolsRemoteResult,
                  "templateSelection": this.formatRemoteResultSelection,
                  "onChange": function(event) {
                      if (onchange) {onchange($(this).val(),self);}
                   }
              }).build();
        },
        getPoolsURL : function() {
            var baseURL = NATPolicyManagementConstants.NAT_POOLS_URL;
            return baseURL+"?filter=(poolType eq 1)";
        },
        formatPoolsRemoteResult: function (data) {
          var markup = data.name;
          return markup;
        },
        formatRemoteResultSelection: function (data) {
          return data.name;
        },
        setDefaults : function() {
            var self = this;
            var transPktModel = this.model.get('translated-packet');
            if(transPktModel) {
              var translationType = transPktModel['translated-traffic-match-type'];
              if(translationType !== "NO_TRANSLATION")
              {
                  this.$el.find("input[type=radio][name=translation_type][value="+translationType+"]").trigger('click');
                  if(translationType === "PREFIX") {
                      var portRange = this.model.get('translated-packet')['mapped-port'];
                      if(portRange !== undefined && portRange !== "") {
                          if(portRange.toString().indexOf("-") != -1) {
                              var portArray = portRange.toString().split("-");
                              if(portArray.length>0){
                                  this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_start').val(portArray[0]);        
                                  this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_end').val(portArray[1]); 
                                  this.mappedPortTypeDropDown.setValue("2");       
                              }
                          } 
                          else {
                              this.$el.find('#nat_rulesgrid_editor_transPktDstn_port').val(portRange);
                              this.mappedPortTypeDropDown.setValue("1");    
                          } 
                      }
                      else {
                          this.mappedPortTypeDropDown.setValue("0");  
                      }
                      var addr = self.model.get('translated-packet')['translated-address'];
                      self.addressDropDown.setValue({id:addr.id,text:addr.name});
                      self.addrSelectedObj = addr;
                  }
                  else if(translationType === "POOL") {
                      var overflowPool = self.model.get('translated-packet')['pool-addresses'];
                      self.poolDropDown.setValue({id:overflowPool.id,text:overflowPool.name});
                      self.poolSelectedObj = overflowPool;
                      self.populateDstPoolObject(overflowPool.id);
                  }
              }
            }          
        },

        translationTypeChangeHandler : function (value,scope) {
            switch(value) {
                case "NO_TRANSLATION" :
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_pool_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_address_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_routinginstance_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_mapped_portType_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_port_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_form').hide();
                    break;
                case "POOL" :
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_pool_form').show();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_address_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_routinginstance_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_mapped_portType_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_port_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_form').hide();
                    break;
                case "PREFIX" :
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_pool_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_address_form').show();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_routinginstance_form').show();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_mapped_portType_form').show();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_port_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_form').hide();
                    break;
                case "INET" :
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_pool_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_address_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_routinginstance_form').show();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_mapped_portType_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_port_form').hide();
                    this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_form').hide();
                    break;
            }
            if(scope)
                scope.checked = true;
        },

        mappedPortypeChangeHandler : function(value, scope) {
            var THIS = scope || this;
            switch(value) {
                case "0":
                    THIS.$el.find('#nat_rulesgrid_editor_transPktDstn_port_form').hide();
                    THIS.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_form').hide();
                    break;
                case "1":
                    THIS.$el.find('#nat_rulesgrid_editor_transPktDstn_port_form').show();
                    THIS.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_form').hide();
                    break;
                case "2":
                    THIS.$el.find('#nat_rulesgrid_editor_transPktDstn_port_form').hide();
                    THIS.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_form').show();
                    break;
            }
        },

        dstPoolChangeHandler : function(value,scope) {
            var THIS = scope || this;
            if(value !== undefined && value !== "")
            {
                THIS.populateDstPoolObject(value);
                THIS.$el.find("#nat_rulesgrid_editor_transPktDstn_pool").parent().removeClass('error').siblings().removeClass('error');
            }   
        },

        transAddrChangeHandler : function(value,scope) {
            if(!scope) {
                return;
            }
            var THIS = scope;
            if(value !== undefined && value !== "")
            {
                THIS.$el.find("#nat_rulesgrid_editor_transPktDstn_address").parent().removeClass('error').siblings().removeClass('error');
            }   
        },

        checkEndPortGreaterValidation : function(isValid,self) {
            var endPort = self.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_end'), 
              endPortValue = endPort.val(), 
              startPort = self.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_start'),
              startPortValue = startPort.val(), 
              error = endPort.siblings('.error');
              if (startPortValue >= endPortValue){
                  var portRangeError = self.context.getMessage('natpool_port_range_error');
                  endPort.parent().addClass("error").siblings().addClass("error");
                  error.show().text(portRangeError);
              }
        },

        populateDstPoolObject : function(poolId) {
            var self = this;
             this.poolModel.set('id',poolId);
             this.poolModel.fetch({
                    success: function (record, response, options) {
                        self.poolSelectedObj = record;
                        $("#nat_rulesgrid_editor_transPktDstn_pool_address").children().html(record.get('pool-address').name);
                        $("#nat_rulesgrid_editor_transPktDstn_pool_port").children().html(record.get('port-range'));
                    },
                    error: function (collection, response, options) {
                        console.log('NAT Pool Model not fetched');
                    }
                });
        },

        addDestinationPool : function() {
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                {
                    mime_type: 'vnd.juniper.net.nat.natpools'
                }
            );
            intent.putExtras({natPoolType: 'DESTINATION'});
            this.context.startActivityForResult(intent, $.proxy(this.afterDestinationPoolCreate, this));
        },

        afterDestinationPoolCreate : function(resultCode,data) {
            this.poolDropDown.setValue({id:data.id,text:data.name});
            this.poolSelectedObj = data;
            this.populateDstPoolObject(data.id);
        },

        addTranslatedAddress : function() {
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                {
                    mime_type: 'vnd.juniper.net.addresses'
                }
            );
            intent.putExtras({addressTypes: ['host','network'],addressObject: 'ipaddress'});
            this.context.startActivityForResult(intent, $.proxy(this.afterTranslatedAddressCreate, this));
        },

        afterTranslatedAddressCreate : function(resultCode,data) {
            this.addressDropDown.setValue({id:data.id,text:data.name});
            this.addrSelectedObj = data;
        },

        populateRoutingInstanceDropDown : function() {
            var self = this, optionList=[{"id":"","text":""}];
            this.routingInstancecollection.fetch({
                    success: function (collection, response, options) {
                        if(response['virtual-routers']['virtual-router'].length > 0) {
                             optionList.push({"text":"None","id":"None"});
                        }
                        response['virtual-routers']['virtual-router'].forEach(function(object) {
                            if(object !== undefined && object !== null)
                                optionList.push({"text":object,"id":object});
                        });
                        self.routingInstanceDropDown.addData(optionList);
                        if(self.model.get('translated-packet') && self.model.get('translated-packet')['routing-instance-name'] !== "") {
                                var routingName = self.model.get('translated-packet')['routing-instance-name'];
                                var routingId = $("#nat_rulesgrid_editor_transPktDstn_routing_instance option:contains("+routingName+")").attr('value');
                                self.routingInstanceDropDown.setValue(routingId);
                        }  
                    },
                    error: function (collection, response, options) {
                        console.log('NAT Pool collection not fetched');
                    }
            });
        },

        getValuesFromEditor: function () {
           
        },

        updateDataOnGridAndCache: function (e) {
            
        },

        saveEditorValuesToCache: function (updatedValuesForAPICall) {
            
        },

        validateForm : function(values) {
            var self = this;
            if(values['translation_type'] == "POOL") {
                if(!self.poolSelectedObj || !self.poolSelectedObj.id) {
                    self.$el.find("#nat_rulesgrid_editor_transPktDstn_pool").parent().addClass("error").siblings().addClass("error");
                    return false;
                }
                else {
                    self.$el.find("#nat_rulesgrid_editor_transPktDstn_pool").parent().removeClass('error').siblings().removeClass('error');
                }
            }
            if(values['translation_type'] == "PREFIX") {
                if(!self.addrSelectedObj || !self.addrSelectedObj.id) {
                    self.$el.find("#nat_rulesgrid_editor_transPktDstn_address").parent().addClass("error").siblings().addClass("error");
                    return false;
                }
                else {
                    self.$el.find("#nat_rulesgrid_editor_transPktDstn_address").parent().removeClass('error').siblings().removeClass('error');
                }
                if(self.mappedPortTypeDropDown.getValue() == "1") {
                    var portField = this.$el.find('#nat_rulesgrid_editor_transPktDstn_port');
                    if(portField.is(":visible") && portField.parent().hasClass("error")) {
                        return false;
                    }  
                }
                if(self.mappedPortTypeDropDown.getValue() == "2") {
                    var portStart = this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_start');
                    var portEnd = this.$el.find('#nat_rulesgrid_editor_transPktDstn_portrange_end');
                    if(portStart.is(":visible") && portStart.parent().hasClass("error")) {
                        return false;
                    } 
                    if(portEnd.is(":visible") && portEnd.parent().hasClass("error")) {
                        return false;
                    }     
                }
            }
            return true;    
        },

        updateModelData: function (e) {
           
            var self = this;
            var data = {};
            var backendData = {};
            var gridData = {};
            var values = Syphon.serialize(this);

               var isFormValid = self.validateForm(values);

               if(!isFormValid) {
                    return;
               }
                var transTrafficMatchType = values['translation_type'];
               
                var  poolAddresses, translatedAddress, poolObj, routingName = "", mappedPort;
                if(transTrafficMatchType == "POOL") {
                   var poolAddrName = self.poolSelectedObj.get('name')?self.poolSelectedObj.get('name'):self.poolSelectedObj.name; 
                   poolAddresses = {
                       'id': self.poolSelectedObj.id,
                       'name':poolAddrName
                   };
                }
                else if(transTrafficMatchType == "PREFIX") {
                   var addrName = self.addrSelectedObj.name;
                   translatedAddress = {
                        'id': self.addrSelectedObj.id,
                        'name': addrName
                   };
                   if(self.routingInstanceDropDown.getValue() !== "" && self.routingInstanceDropDown.getValue() !== "None")
                       routingName = self.$el.find('#nat_rulesgrid_editor_transPktDstn_routing_instance :selected').text();
                   if(self.mappedPortTypeDropDown.getValue() == "1")
                        mappedPort = values['nat_rulesgrid_editor_transPktDstn_port'];
                   else if(self.mappedPortTypeDropDown.getValue() == "2") {
                        mappedPort = values['nat_rulesgrid_editor_transPktDstn_portrange_start']+"-"+ values['nat_rulesgrid_editor_transPktDstn_portrange_end'];
                   }
                }
                else if (transTrafficMatchType == "INET") {
                    if(self.routingInstanceDropDown.getValue() !== "" && self.routingInstanceDropDown.getValue() !== "None")
                       routingName = self.$el.find('#nat_rulesgrid_editor_transPktDstn_routing_instance :selected').text();
                     mappedPort = null;
                     poolAddresses = null;
                     translatedAddress = null;
                }
                self.model.set({
                    'translated-packet': {
                        'translated-traffic-match-type': transTrafficMatchType,
                        'persistent-nat-setting' : null,
                        'mapped-port': mappedPort,
                        'poxy-arp-entries':null,
                        'pool-addresses': poolAddresses,
                        'proxy-arp-enabled':false,
                        'egress-interface':{ 'egress-interface': []},
                        'translated-address': translatedAddress,
                        'routing-instance-name': routingName
                    }
                });

               this.editCompleted(e,this.model);
        },

        setCellViewValues: function (list) {
            // to get the values from the grid cell in this view
            this.rowData = list.originalRowData;
            this.model = this.options.ruleCollection.get(list.originalRowData[PolicyManagementConstants.JSON_ID]);
        }

    });

    return RuleGridTranslatedDstnEditorView;
});