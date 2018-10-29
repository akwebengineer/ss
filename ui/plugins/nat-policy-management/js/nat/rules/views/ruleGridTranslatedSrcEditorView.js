/**
 * Translated Packet Source editor view that extends from base cellEditor
 *
 * @module TranslatedPktSrcEditorView
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    'widgets/form/formWidget',
    '../conf/natRulesTransPktSrcFormConfiguration.js',
    '../../nat-pools/models/natPoolsModel.js',
    '../constants/natRuleGridConstants.js',
    'widgets/dropDown/dropDownWidget',
    '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js',
    '../models/interfacesPerPolicyCollection.js'
], function (Backbone, Syphon, BaseGridCellEditor, FormWidget, TranslationEditorFormConfiguration,NatPoolModel, PolicyManagementConstants,DropDownWidget, 
                NATPolicyManagementConstants, InterfaceCollection) {

    var idChk = 'nat_rulegrid_edit_proxyArp_chkBox',
        idCombo = 'nat_rulegrid_edit_proxyArp_combo',
        idChkCombo = 'nat_rulegrid_edit_proxyArp_chkCombo',
        idChkComboContainer = 'nat_rulegrid_edit_proxyArp_chkComboContainer';

    var TranslatedPktSrcEditorView = BaseGridCellEditor.extend({

        events: {
            'click #btnOk': 'updateModelData',
            'click #linkCancel': 'closeOverlay',
            'click #nat_rulegrid_edit_source_pool_link':"addSourcePool"
        },

        initialize: function () {
            this.context = this.options.context;
            this.model = this.options.model;
            this.poolModel = new NatPoolModel();
            this.interfacecollection = new InterfaceCollection({url: NATPolicyManagementConstants.POLICY_URL + this.options.policyObj.id+ '/interfaces'});

            this.translationEditorFormConfiguration = new TranslationEditorFormConfiguration(this.context);
            this.map = {};
        },
        render : function(){
            var self = this,
                policyType = self.options.policyObj['policy-type'];

            this.form = new FormWidget({
                "elements": this.translationEditorFormConfiguration.getElements(policyType),
                "container": this.el
            });

            this.form.build();

            this.populateInterfaceDropDown();

            var sourcePool = this.$el.find('#nat_rulegrid_edit_source_pool');
            sourcePool.parent().after( "<a id='nat_rulegrid_edit_source_pool_link' style='margin:15px'>"+ "Add New" +"</a>" );
            var container = this.$el.find('#nat_rulegrid_edit_proxyArp_container');
            $(container.parent()).attr('id',"nat_rulegrid_edit_proxyArp_container");
            container.parent().empty();

            self.$el.find("#nat-rule-edit-pool-form").hide();
            self.$el.find("#nat-rule-edit-persistent-form").hide();
            self.$el.find(".nat-rulesgrid-persistent-conf").hide();
            
            self.$el.find("input[type=radio][name=translation_type][value=INTERFACE]").click(function() {
                self.$el.find("#nat-rule-edit-persistent-form").show();
                self.$el.find("#nat-rule-edit-pool-form").hide();
                this.checked = true;
                if(self.$el.find('input[name=persistent_Chkbox]').prop("checked")) {
                    self.$el.find(".nat-rulesgrid-address-mapping-conf").hide();
                }
            });
            self.$el.find("input[type=radio][name=translation_type][value=NO_TRANSLATION]").click(function() {
                self.$el.find("#nat-rule-edit-persistent-form").hide();
                self.$el.find("#nat-rule-edit-persistent-form-enable").hide();
                self.$el.find("#nat-rule-edit-pool-form").hide();
                this.checked = true;
            });
            self.$el.find("input[type=radio][name=translation_type][value=POOL]").click(function() {
                self.$el.find("#nat-rule-edit-persistent-form").show();
                self.$el.find("#nat-rule-edit-pool-form").show();
                this.checked = true;
                // If proxy ARP is disabled at the policy level, then we will hide Proxy ARP section
                if(self.options.policyObj['proxy-arp-managed'] === true) {
                if(self.$el.find('input[name=persistent_Chkbox]').prop("checked")) {
                    self.$el.find(".nat-rulesgrid-address-mapping-conf").show();
                }
                  self.$el.find("input[name=proxyARP_Chkbox]").show();
                  self.$el.find("input[name=proxyARP_Chkbox]").change(function(d) {
                    if(this.checked) {
                       self.$el.find(".nat_rulegrid_proxyArp_conf").show();
                    }
                    else {
                        self.$el.find(".nat_rulegrid_proxyArp_conf").hide();
                    }
                  });
                  
               } else {
                  self.$el.find(".proxyARP_Chkbox_conf").hide();
                  self.$el.find("input[name=nat_rulegrid_edit_proxyArp_label]").hide();
                  self.$el.find(".nat_rulegrid_proxyArp_conf").hide();
                }
            });
            self.$el.find("input[type=checkbox][name=persistent_Chkbox]").change(function(d) {
                if(this.checked) {
                   self.$el.find(".nat-rulesgrid-persistent-conf").show();
                   if(self.$el.find("input[type=radio][name=translation_type][value=INTERFACE]").prop('checked')) {
                        self.$el.find(".nat-rulesgrid-address-mapping-conf").hide();
                   }     
                   else if(self.$el.find("input[type=radio][name=translation_type][value=POOL]").prop('checked')) { 
                        self.$el.find(".nat-rulesgrid-address-mapping-conf").show();
                   } 
                }
                else {
                    self.$el.find(".nat-rulesgrid-persistent-conf").hide();
                    self.$el.find("#inactivity_timeout").parent().removeClass('error').siblings().removeClass('error');
                    self.$el.find("#max_session_number").parent().removeClass('error').siblings().removeClass('error');
                }
            });
         
            self.$el.find('#nat_rulegrid_edit_source_pool').change(function() {
              if(self.options.policyObj['proxy-arp-managed'] === true) {
                self.sourcePoolChangeHandler(this.value); }
            });                      
            this.persistentNatTypeDropDown =this.createDropDown('persistent_nat_type',
                      [{"text": this.context.getMessage("nat_rulesgrid_edit_translation_type_any_remote_host"),
                        "id": "ANY_REMOTE_HOST","selected": "true"},{
                        "text": this.context.getMessage("nat_rulesgrid_edit_translation_type_target_host"),"id": "TARGET_HOST"},{
                        "text": this.context.getMessage("nat_rulesgrid_edit_translation_type_target_host_port"),
                        "id": "TARGET_HOST_PORT"}], this.onPersistentNatTypeHandler);
            this.sourcePoolDropDown =this.createPoolDropDown('nat_rulegrid_edit_source_pool',this.sourcePoolChangeHandler);
            this.mergePool = false;
            self.setDefaults();
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
                  "templateResult": this.formatRemoteResult,
                  "templateSelection": this.formatRemoteResultSelection,
                  "onChange": function(event) {
                      if (onchange) {onchange($(this).val(),self);}
                   }
              }).build();
        },
        getPoolsURL : function() {
            var baseURL = NATPolicyManagementConstants.NAT_POOLS_URL;
            return baseURL+"?filter=(poolType eq 0)";
        },
        formatRemoteResult: function (data) {
          var markup = data.name;
          return markup;
        },

        formatRemoteResultSelection: function (data) {
            return data.name;
        },

        onPersistentNatTypeHandler : function(value,scope) {
            var THIS = scope || this;
            if(value == "TARGET_HOST") {
                THIS.$el.find("input[name=addressmapping_Chkbox]").attr('disabled',true);
                THIS.$el.find("input[name=addressmapping_Chkbox]").attr('checked',false);
            }
            else {
                THIS.$el.find("input[name=addressmapping_Chkbox]").attr('disabled',false);
            }
        },
        setDefaults : function() {
            var self = this;
            var transPktModel = this.model.get('translated-packet');
            if(transPktModel) {
              var translationType = transPktModel['translated-traffic-match-type'];
              if(translationType != "NO_TRANSLATION")
              {
                  this.$el.find("input[type=radio][name=translation_type][value="+translationType+"]").trigger('click');
                  var transPersistentType = transPktModel['persistent-nat-setting'];

                  if(transPersistentType && transPersistentType['persistent-nat-type'] !== undefined &&
                      transPersistentType['persistent-nat-type'] !== "" && transPersistentType['persistent-nat-type'] !== "NONE") {
                     this.$el.find("input[name=persistent_Chkbox]").attr("checked",true).trigger("change"); 
                      this.persistentNatTypeDropDown.setValue(transPersistentType['persistent-nat-type']);
                      this.$el.find('#addressmapping_Chkbox').prop('checked',transPktModel['persistent-nat-setting']['address-mapping']);
                         
                      self.$el.find("#inactivity_timeout").val(transPktModel['persistent-nat-setting']['inactivity-timeout']);
                      self.$el.find("#max_session_number").val(transPktModel['persistent-nat-setting']['max_session_number']);

                  }
                  else {
                      this.$el.find('input[name=persistent_Chkbox]').attr("checked", false);
                  }

                  if(translationType == "POOL" && self.options.policyObj['proxy-arp-managed'] === true) {
                      var pool = transPktModel['pool-addresses'];
                      this.mergePool = true;
                      this.sourcePoolDropDown.setValue({id:pool.id,text:pool.name});
                      this.$el.find('#proxyARP_Chkbox').prop('checked',transPktModel['proxy-arp-enabled']).trigger("change"); 
                  }
               }
            }   
        },

        sourcePoolChangeHandler : function(value,scope) {
            var THIS = scope || this;
            if(value != undefined && value != "")
            {
                THIS.populateSourcePoolObject(value);
                THIS.$el.find("#nat_rulegrid_edit_source_pool").parent().removeClass('error').siblings().removeClass('error');
                THIS.fetchArpEntries(value,THIS.mergePool);
                THIS.mergePool = false;
            }    
        },
        populateInterfaceDropDown : function() {
            var self = this, optionList=[{"id":"","text":""}];
            this.interfacecollection.fetch({
                    success: function (collection, response, options) {
                        response['interfaces']['interface'].forEach(function(object) {
                            if(object != undefined && object != null)
                                optionList.push({"text":object,"id":object});
                        });
                        self.interfaceOptionList = optionList;
                    },
                    error: function (collection, response, options) {
                        console.log('Interface collection not fetched');
                    }
            });
        },
        populateSourcePoolObject : function(poolId) {
             var self = this;
             this.poolModel.set('id',poolId);
             this.poolModel.fetch({
                    success: function (record, response, options) {
                        self.poolSelectedObj = record;
                        $("#nat_rulegrid_edit_pool_address").children().html(record.get('pool-address').name);
                        $("#nat_rulegrid_edit_host_address_base").children().html(record.get('host-address-base'));
                        
                        var portTranslation = "Enabled";
                        if( record.get('disable-port-translation'))
                            portTranslation = "Disabled";
                        $("#nat_rulegrid_edit_port_translation").children().html(portTranslation);
                        if(record.get('overflow-pool-address')) {
                            $("#nat_rulegrid_edit_overflow_pool_type").children().html(record.get('over-flow-pool-type'));
                            if(record.get('over-flow-pool-type') == "POOL") {
                                $("#nat_rulegrid_edit_overflow_pool_name").children().html(record.get('overflow-pool-address')["name"]); 
                            }
                            else
                                $("#nat_rulegrid_edit_overflow_pool_name").children().html(""); 
                        }
                        else {
                            $("#nat_rulegrid_edit_overflow_pool_type").children().html("");
                            $("#nat_rulegrid_edit_overflow_pool_name").children().html("");
                        }    
                    },
                    error: function (collection, response, options) {
                        console.log('NAT Pool Model not fetched');
                    }
                });
        },
        reconfigureArpField : function(entries) {
            var container = this.$el.find('#nat_rulegrid_edit_proxyArp_container');
             var inputs = container.find('input');
           
             
             var removeField;    
             if(inputs.length > 0) {
                container.empty();
                this.map = {};
             }  
             container.width('100%');
           
            var arpEntry,ifValue, addrLabelText;
            var count = 0;
            for(var i =0; i< entries.length; i++) {
              arpEntry = entries[i];
              if(arpEntry['state'] !== 'DELETED'){
                ifValue = arpEntry['intf-value'];
                if(ifValue === undefined || ifValue === null || ifValue === ''){
                  ifValue = arpEntry['recommended-intf-value'];
                }
                 addrLabelText = arpEntry['range-ip'];
                 this.map[count] = { address: arpEntry['address'], recommendedValue: arpEntry['recommended-intf-value'] };

                 container.append("<div id='"+idChkCombo+count+"' class='chkBoxCombo'></div>");
                 var chkComboContainer = this.$el.find('#'+idChkCombo+count);
                 chkComboContainer.append ( "<div class='optionselection' style='width: 50%;float:left'><input id='"+idChk + count + "' type='checkbox' value='" + 'enable' + "' /><label for='"+idChk + count + "'>" + addrLabelText + "</label></div>" );
                 chkComboContainer.append ( "<div class='elementinput left' style='float:left'><span id='"+idCombo+count+"'></span></div></div>");
                 this.$el.find("input[type=checkbox][id="+idChk + count+"]").attr('checked',arpEntry['is-overridden']); 
                 var comboBox = this.createDropDown(idCombo+count,this.interfaceOptionList);
                 this.$el.find("."+idCombo+count).select2('enable',arpEntry['is-overridden']);
                 this.addCheckBoxListener(count);
                 if(ifValue != undefined || ifValue != "")
                    comboBox.setValue(ifValue);
                 count++; 
              }
            }
        },
        addCheckBoxListener : function(count) {
          var self = this;
          this.$el.find("input[type=checkbox][id="+idChk + count+"]").change(function(d) {
              if(this.checked) {
                /* enable the interface dropdown */
                if(self.$el.find("."+idCombo+count).attr('disabled')) {
                  self.$el.find("."+idCombo+count).removeAttr('disabled');
                }
              }
              else {
                if(self.map[count])
                  self.$el.find("."+idCombo+count).select2("val",self.map[count].recommendedValue);
                self.$el.find("."+idCombo+count).select2('enable',false);
              }
          }); 
        },
        fetchArpEntries : function(value,merge) {
           var policyId = this.model.get('policy-id'),
               ruleId = this.model.get('id');
            this.options.ruleCollection.fetchArpEntries(value,policyId,ruleId,$.proxy(this.onFetchArpEntriesSuccess,this),this.onFetchArpEntriesError,merge);
           
        },
        onFetchArpEntriesSuccess : function(data,merge) {
            var entries = data['arp-entries']['arp-entry'];
            if(entries) {
                if(!merge) {
                  this.reconfigureArpField(entries);
                }else {
                  var modelProxyArpEntries = this.model.get('translated-packet')['poxy-arp-entries']?this.model.get('translated-packet')['poxy-arp-entries']['arp-entry']:null;
                  var oldEntries = modelProxyArpEntries?modelProxyArpEntries:entries;
                  var newEntries = entries,
                      newArpEntry, oldArpEntry;
                  var expand = false;
                  for(var x=0;x<newEntries.length;x++){
                    newArpEntry = newEntries[x];
                    for(var y=0;y<oldEntries.length;y++){
                      oldArpEntry = oldEntries[y];
                      if(newArpEntry.address.id === oldArpEntry.address.id){
                        newArpEntry['intf-value'] = oldArpEntry['intf-value'];
                        newArpEntry['is-overridden'] = oldArpEntry['is-overridden'];
                        if(newArpEntry['recommended-intf-value'] !== null){
                          expand = true;
                        }
                        if(oldArpEntry['is-overridden'] === false && oldArpEntry['intf-value'] !== newArpEntry['recommended-intf-value']) {
                             /*Recommended arp entry has changed so since user has not overridden we need to update the value from recommended*/
                           newArpEntry['intf-value'] = newArpEntry['recommended-intf-value'];
                        }
                      }
                    }
                  }
                  this.reconfigureArpField(newEntries);
                  if(expand){
                  this.$el.find(".nat_rulegrid_proxyArp_conf").show();
                  }
                  return;
                }
            }
            else {
                this.reconfigureArpField(null);
            }            
        }, 
        onFetchArpEntriesError : function() {

        },
        addSourcePool : function() {
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                    {
                        mime_type: 'vnd.juniper.net.nat.natpools'
                    }
                );
                intent.putExtras({natPoolType: 'SOURCE'});
               
                this.context.startActivityForResult(intent, $.proxy(this.afterSourcePoolCreate, this));
        },
        afterSourcePoolCreate : function(resultCode,data) {
            this.mergePool = false;
            this.sourcePoolDropDown.setValue({id:data.id,text:data.name});
        },

        validateForm : function(values) {
            var self = this;
            if(values['translation_type'] == "INTERFACE" || values['translation_type'] == "POOL") {
                 if(values['persistent_Chkbox']) {
                    var inactivityTimeout = this.$el.find("#inactivity_timeout");
                    var maxSessionNumber = this.$el.find("#max_session_number");
                    if(inactivityTimeout.is(":visible") && inactivityTimeout.parent().hasClass("error")) {
                        return false;
                    }
                    if(maxSessionNumber.is(":visible") && maxSessionNumber.parent().hasClass("error")) {
                        return false;
                    }
                 }
                 if(values['translation_type'] == "POOL") {
                    if(!self.poolSelectedObj) {
                         self.$el.find("#nat_rulegrid_edit_source_pool").parent().addClass("error").siblings().addClass("error");
                         return false;
                    }
                    else {
                         self.$el.find("#nat_rulegrid_edit_source_pool").parent().removeClass('error').siblings().removeClass('error');
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
                var persistentNatSetting;
                if(transTrafficMatchType != "NO_TRANSLATION") {
                    if(values['persistent_Chkbox']) {
                        var addrMapp = false;
                        if(transTrafficMatchType == "POOL" && self.persistentNatTypeDropDown.getValue() != "TARGET_HOST")
                            addrMapp = values['addressmapping_Chkbox'];
                        persistentNatSetting = {
                            'persistent-nat-type': self.persistentNatTypeDropDown.getValue(),
                            'address-mapping': addrMapp,
                            'inactivity-timeout': values['inactivity_timeout'],
                            'max_session_number': values['max_session_number']
                        };
                    }
                }
                var proxyArpChkBox, poolAddresses, poolObj, proxyArpEntries= [];
                if(transTrafficMatchType == "POOL") {
                   proxyArpChkBox  = values['proxyARP_Chkbox'];
                   poolObj = self.poolSelectedObj;
                   poolAddresses = {
                       'id': poolObj.get('id'),
                       'name':poolObj.get('name'),
                       'domain-id':poolObj.get('domain-id'),
                       'domain-name':poolObj.get('domain-name')
                   };
                   var proxyArpcontainer = self.$el.find('#nat_rulegrid_edit_proxyArp_container');
                   var inputs = proxyArpcontainer.find('input'),
                       arpEntry;
                   if(inputs.length > 0 && proxyArpChkBox) {
                    for(var i=0;i<inputs.length;i++) {
                       
                       arpEntry = {
                        "is-overridden":self.$el.find('#'+idChk + i).prop('checked'),
                        "intf-value": $('#'+idCombo+i+' :selected').val(),
                        "recommended-intf-value":self.map[i].recommendedValue,
                        "range-ip": self.$el.find("label[for='"+idChk + i+"']").text(),
                        "address": self.map[i].address
                       }; 
                       proxyArpEntries.push(arpEntry);
                    }
                   }
                }
                self.model.set({
                    'translated-packet': {
                        'translated-traffic-match-type': transTrafficMatchType,
                        'persistent-nat-setting' : persistentNatSetting,
                        'mapped-port': "",
                        'pool-addresses': poolAddresses,
                        'proxy-arp-enabled':proxyArpChkBox,
                        'poxy-arp-entries': {
                            'arp-entry': proxyArpEntries
                        },
                        'egress-interface':{ 'egress-interface': []}
                    }
                });

               this.editCompleted(e,this.model);
        },


        saveEditorValuesToCache: function (updatedValuesForAPICall) {
        },

        setCellViewValues: function (list) {
            // to get the values from the grid cell in this view
            this.rowData = list.originalRowData;
            this.model = this.options.ruleCollection.get(list.originalRowData[PolicyManagementConstants.JSON_ID]);
        }

    });

    return TranslatedPktSrcEditorView;
});