/**
 * Destination address editor view extends from AddressEditorView
 * @module AddressEditorView
 * @author Sandhya B<sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone.syphon',
    './ruleGridAddressEditorView.js',
    'widgets/dropDown/dropDownWidget',
    '../../widgets/AddressDropDown.js',
    '../models/interfacesPerPolicyCollection.js',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
], function (Syphon, AddressEditorView,DropDownWidget, AddressDropDownWidget,InterfaceCollection,NATManagementConstants) {
    var DestinationAddressEditorView = AddressEditorView.extend({
        events: {
                'click #nat_rulesgrid_editor_staticDstnAddress_link':"addAddress"
        },
        initialize: function () {
            this.interfacecollection = new InterfaceCollection({url: NATManagementConstants.POLICY_URL + this.options.policyObj.id+ '/interfaces'});
            AddressEditorView.prototype.initialize.apply(this);
        },
        dynamicRenderElements : function() {
            var natType = this.model.get('nat-type');
            if(natType == "STATIC" || natType == "DESTINATION")
            {
                var self = this;
                this.$el.find("#cellEditor").hide();
                // If proxy ARP is disabled at the policy level, then we will hide Proxy ARP section
                if(self.options.policyObj['proxy-arp-managed'] === false) {
                  this.$el.find(".natrules_dstaddress_proxyArp_class").hide();
                  this.$el.find(".natrules_dstaddress_proxyArp_override_interface_conf").hide();
                }
                this.$el.find(".natrules_dstaddress_proxyArp_conf").hide();
                var dstAddr = this.$el.find('#nat_rulesgrid_editor_staticDstnAddress');
                dstAddr.parent().after( "<a id='nat_rulesgrid_editor_staticDstnAddress_link' style='margin:15px'>"+ "Add New" +"</a>" );
                this.addressDropDown =this.createAddressDropDown('nat_rulesgrid_editor_staticDstnAddress',this.onAddressSelect);
                this.interfaceDropDown = this.createDropDown('natrules_dstnaddress_proxyArp_interface', null, this.onInterfaceSelect);
              //  this.populateAddressDropDown();
                this.populateInterfaceDropDown();

                this.$el.find("input[name=natrules_dstaddress_proxyArp]").change(function(d) {
                    if(this.checked && self.options.policyObj['proxy-arp-managed'] === true) {
                       self.$el.find(".natrules_dstaddress_proxyArp_conf").show();
                       self.$el.find(".natrules_dstaddress_proxyArp_override_interface_conf").show();
                    }
                    else {
                        self.$el.find(".natrules_dstaddress_proxyArp_conf").hide();
                        self.$el.find(".natrules_dstaddress_proxyArp_override_interface_conf").hide();
                    }
                }); 
                this.$el.find("input[type=checkbox][name=natrules_dstaddress_proxyArp_override_interface]").change(function(d) {
                    if(this.checked) {
                      /* enable the interface dropdown */
                      if(self.$el.find('.natrules_dstnaddress_proxyArp_interface').attr('disabled')) {
                        self.$el.find('.natrules_dstnaddress_proxyArp_interface').removeAttr('disabled');
                      }
                    }
                    else {
                      if(self.currentProxyArpEntry)
                        self.interfaceDropDown.setValue(self.currentProxyArpEntry.recommendedIntfValue);  
                      self.$el.find('.natrules_dstnaddress_proxyArp_interface').select2('enable',false);
                      self.$el.find("#natrules_dstnaddress_proxyArp_interface").parent().removeClass('error').siblings().removeClass('error');
                    }
                }); 
                this.mergePool = false;
                this.setDefaults();
            }
            else {
                AddressEditorView.prototype.dynamicRenderElements.apply(this);
            }        
        },
        setDefaults : function() {
            var self = this;
            var originalPktModel = this.model.get('original-packet');
            if(self.getAddresses() && self.getAddresses()[0]){
                self.mergePool = true;
                self.addressDropDown.setValue({id:self.getAddresses()[0].id,text:self.getAddresses()[0].name});
                self.addrSelectedObj = self.getAddresses()[0];
            }

            this.$el.find("input[name=natrules_dstaddress_proxyArp]").attr("checked",originalPktModel['proxy-arp-enabled']).trigger("change"); 
            this.$el.find("input[type=checkbox][name=natrules_dstaddress_proxyArp_override_interface]").attr('checked',originalPktModel['proxy-arp-entry']['is-overridden']).trigger('change'); 
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
                urlFilter3={
                  property:'addressType',
                  modifier:'eq',
                  value:['ANY_IPV4']
                },
                urlFilter4={
                  property:'addressType',
                  modifier:'eq',
                  value:['ANY_IPV6']
                },
                natType = this.model.get('nat-type'),
                urlFilters;
                if(natType == "DESTINATION")
                  urlFilters = [urlFilter1, urlFilter2, urlFilter3, urlFilter4];
                else 
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
        formatRemoteResult: function (data) {
             var GROUP = 'GROUP';
              var name = data.name;
              if(data['definition-type']!="PREDEFINED" && data.name) {
                 name = data['address-type'].toLowerCase()!=GROUP.toLowerCase()?data.name+ '(' + data['ip-address'] + ')':data.name;
              }  
              return name;
        },

        onAddressSelect : function(value,scope) {
          if(!scope) {
            return;
          }
            var THIS = scope;
            if(!value)
              return;
            else {
              THIS.$el.find("#nat_rulesgrid_editor_staticDstnAddress").parent().removeClass('error').siblings().removeClass('error');
            }
           
              THIS.fetchArpEntries(value,THIS.mergePool);
              THIS.mergePool = false;
        },

        onInterfaceSelect : function(value, scope) {
          if(!scope) {
            return;
          }
          if(!value)
              return;
          else {
              var THIS = scope;
              THIS.$el.find("#natrules_dstnaddress_proxyArp_interface").parent().removeClass('error').siblings().removeClass('error');
          }
        },  

        fetchArpEntries : function(value,merge) {
          var policyId = this.model.get('policy-id'),
              ruleId = this.model.get('id');
          this.options.ruleCollection.fetchArpEntries(value,policyId,ruleId,$.proxy(this.onFetchArpEntriesSuccess,this),this.onFetchArpEntriesError,merge);
        },
        onFetchArpEntriesSuccess : function(data,merge) {
            var dataModel = data['arp-entries']['arp-entry'];
            var record, ifValue;
            if(dataModel) {
                for (var i = 0; i < dataModel.length; i++) {
                  record = dataModel[i];
                  if (record['state'] !== 'DELETED') {
                      ifValue = record['intf-value'];
                      if (ifValue === undefined || ifValue === null || ifValue === '') {
                        ifValue = record['recommended-intf-value'];
                      }
                      var proxyArpEntry = {
                        intfValue : ifValue,
                        overridden : record['is-overridden'],
                        rangeIP : record['range-ip'],
                        recommendedIntfValue : record['recommended-intf-value'],
                        address : record['address']
                      };
                    
                      if (merge) {
                        var oldArpEntry = this.model.get('original-packet')['proxy-arp-entry'];
                        proxyArpEntry.intfValue = oldArpEntry['intf-value'];
                        proxyArpEntry.overridden = oldArpEntry['is-overridden'];
                        if (oldArpEntry['is-overridden'] === false && oldArpEntry['intf-value'] !== proxyArpEntry.recommendedIntfValue) {
                          /*Recommended arp entry has changed so since user has not overridden we need to update the value from recommended*/
                          proxyArpEntry.intfValue = proxyArpEntry.recommendedIntfValue;
                        }
                      }
                      this.currentProxyArpEntry = proxyArpEntry; 
                      this.interfaceDropDown.setValue(proxyArpEntry.intfValue);  
                      this.$el.find("input[type=checkbox][name=natrules_dstaddress_proxyArp_override_interface]").attr('checked',proxyArpEntry.overridden).trigger('change');        
                  }
                } 
            }                       
        }, 
        onFetchArpEntriesError : function() {

        },
       populateInterfaceDropDown : function() {
            var self = this, optionList=[{"id":"","text":""}];
            this.interfacecollection.fetch({
                    success: function (collection, response, options) {
                        response['interfaces']['interface'].forEach(function(object) {
                            if(object !== undefined && object !== null)
                                optionList.push({"text":object,"id":object});
                        });
                        self.interfaceDropDown.addData(optionList);
                        var proxyEntry = self.model.get('original-packet')['proxy-arp-entry'];
                        if(proxyEntry && proxyEntry['intf-value'] !== undefined && proxyEntry['intf-value']!=="")
                            self.interfaceDropDown.setValue(proxyEntry['intf-value']);
                    },
                    error: function (collection, response, options) {
                        console.log('Interface collection not fetched');
                    }
            });
        },
        addAddress: function() {
                // Form for address creation
                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                    {
                        mime_type: 'vnd.juniper.net.addresses'
                    }
                );
                intent.putExtras({addressTypes: ['host','network','other'],addressObject: 'ipaddress'});
                
                this.context.startActivityForResult(intent, $.proxy(this.afterAddrCreate, this));
        },
        afterAddrCreate : function(resultCode,data) {
                this.mergePool = false;
                this.addressDropDown.setValue({id:data.id,text:data.name});
                this.addrSelectedObj = data;
        },
        validateDestinationInterfaceFields : function(values) {
          if(!this.addrSelectedObj || !this.addrSelectedObj.id) {
            this.$el.find("#nat_rulesgrid_editor_staticDstnAddress").parent().addClass("error").siblings().addClass("error");
            return false;
          }
          //If Proxy ARP Enabled and overidden is set to true, validate for interface value present
          if(values["natrules_dstaddress_proxyArp"] && values["natrules_dstaddress_proxyArp_override_interface"]) {
            if(!this.interfaceDropDown.getValue()) {
              this.$el.find("#natrules_dstnaddress_proxyArp_interface").parent().addClass("error").siblings().addClass("error");
              return false;
            }
          }
          return true;  
        },
        updateModel : function(e) {
            var natType = this.model.get('nat-type');
            if(natType == "STATIC" || natType == "DESTINATION") {
                 var values = Syphon.serialize(this);
                 var isFormValid = true;//self.validateForm(values);
                  if(!this.validateDestinationInterfaceFields(values)) {
                    return;
                  }
                   
                   var addressArr = [];
                   var addressObj = {
                    "id" : this.addrSelectedObj.id,
                    "name" : this.addrSelectedObj.name
                   };
                   addressArr.push(addressObj);
                   this.setAddress(addressArr);
                   this.setProxyArp(values);

               this.editCompleted(e,this.model);
            }
            else {
                AddressEditorView.prototype.updateModel.apply(this,[e]);
            }
        },
        setProxyArp : function(values) {
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["proxy-arp-enabled"] = values["natrules_dstaddress_proxyArp"];
            if(values["natrules_dstaddress_proxyArp"]) {
                var proxyObj = this.currentProxyArpEntry;
                _originalPacket["proxy-arp-entry"] = {
                    "is-overridden":values["natrules_dstaddress_proxyArp_override_interface"],
                    "intf-value":this.interfaceDropDown.getValue(),
                    "recommended-intf-value":proxyObj?proxyObj.recommendedIntfValue:"",
                    "range-ip":proxyObj?proxyObj.rangeIP:"",
                    "address": proxyObj?proxyObj.address:null
                };
            }
            else {
                _originalPacket["proxy-arp-entry"] = {
                    "is-overridden": false,
                    "intf-value":"",
                    "recommended-intf-value":"",
                    "range-ip":"",
                    "address": null
                };
            }

            this.model.set("original-packet" , _originalPacket);
        },
         getAddresses :function(){

            if(this.model.get('original-packet')['dst-address'])
                return this.model.get('original-packet')['dst-address']["address-reference"];
            return null;
        },

        setAddress :function(addressesArr){
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["dst-address"] = {
               "address-reference" : addressesArr
            };
            this.model.set("original-packet" , _originalPacket);
        },

        getTitle:function() {
            return this.context.getMessage('fw_rules_editor_destinationAddress_title');
        },

        getHeadingText :function(){
            var natType = this.model?this.model.get('nat-type'):"";
            if(natType == "STATIC" || natType == "DESTINATION")
                return this.context.getMessage('nat_rules_editor_static_destinationAddress_description');
            return this.context.getMessage('fw_rules_editor_destinationAddress_description');
        },

        getAddressSelectionHelp: function() {
            return "rule_select_dest_address_help";
        }

    });

    return DestinationAddressEditorView;
});
