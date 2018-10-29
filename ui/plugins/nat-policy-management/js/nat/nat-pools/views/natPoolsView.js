/**
 * A module that works with nat-pools.
 *
 * @module NatPoolFormView
 * @author Damodhar <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/


define(
    [
        'backbone',
        'backbone.syphon',
        'widgets/form/formWidget',
        'widgets/form/formValidator',
        '../../../../../ui-common/js/views/apiResourceView.js',
        '../conf/natPoolsCreateFormConfiguration.js',
        '../models/natPoolsCollection.js',
        '../../../../../object-manager/js/objects/models/addressCollection.js',
        '../../../../../sd-common/js/devices/models/routingInstanceCollection.js',
        'widgets/dropDown/dropDownWidget',
        '../../widgets/AddressDropDown.js',
        '../../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js',
        '../../../../../ui-common/js/common/utils/validationUtility.js',
        '../../../../../sd-common/js/common/deviceNameFormatter.js'
    ],function(Backbone, Syphon, FormWidget, FormValidator, ResourceView, NatPoolConfiguration,
        Collection,AddressCollection,RoutingInstanceCollection,DropDownWidget,AddressDropDown,
         NATManagementConstants, ValidationUtility, DeviceNameFormatter) {
        var SOURCE = 0,
        DESTINATION = 1,
        DESTINATION_STRING='DESTINATION',
        SOURCE_STRING='SOURCE',
        NO_TRANSLATION = 'NO_TRANSLATION',
        PORT_RANGE = 'PORT_RANGE',
        OVERLOAD = 'OVERLOAD',
        NONE = 'NONE',
        PAIRED='PAIRED',
        NONPAIRED='NONPAIRED',
        INTERFACE='INTERFACE',
        POOL='POOL',
        ANY='ANY',
        RANGE='RANGE',
        MODE_CREATE_SOURCE='MODE_CREATE_SOURCE',
        MODE_CREATE_DESTINATION='MODE_CREATE_DESTINATION',
        GROUP='GROUP';
       
        var NatPoolFormView = ResourceView.extend({

            events: {
                'click #natpool-save': "submit",
                'click #natpool-cancel': "cancel",
                'click #natpool-address-link':"addAddress"
            },

            /**
             * The constructor for the nat pool form view using overlay.
             *
             * @param {Object} options - The options containing the Slipstream's context
             */
            initialize: function(options) {

                ResourceView.prototype.initialize.call(this, options);

                 _.extend(this, ValidationUtility);

                this.activity = options.activity;
                this.context = options.activity.getContext();
                this.validator = new FormValidator();
                this.collection = new Collection();
                this.addresses = new AddressCollection();
                this.successMessageKey = 'natpool_create_success';
                this.editMessageKey = 'natpool_edit_success';
                this.fetchErrorKey = 'natpool_fetch_error';
                this.fetchCloneErrorKey = 'natpool_fetch_clone_error';
                this.map = {};
            },

            /**
             * Renders the form view in a overlay.
             *
             * returns this object
             */
            render: function() {
                var self = this,
                    formConfiguration = new NatPoolConfiguration(this.context),
                    formElements = formConfiguration.getValues();
                var options = this.activity.getIntent().getExtras();
                this.addDynamicFormConfig(formElements,options);
                this.form = new FormWidget(
                    {
                        "container": this.el,
                        "elements": formElements,
                        "values": this.model.attributes
                    }
                );
             
                this.form.build();

                this.addSubsidiaryFunctions(formElements);
                
                var natPoolAddress = this.$el.find('#natpool-address');
         
                natPoolAddress.parent().after( "<a id='natpool-address-link' style='margin:15px'>"+ "Add New" +"</a>" );

                this.$el.find('#natpool-port-range-end').bind('isEndPortGreater', function(e, isValid) {
                  self.checkEndPortGreaterValidation(isValid, self);
                });
                this.$el.find('#natpool-port').bind('isPortRangeValueAllowed', function(e, isValid) {
                  self.checkPortRangeValueAllowed(isValid, self);
                });
            
                this.$el.find('#natpool-host').on('change keyup paste',function() {
                  self.hostAddressChangehandler(this.value,self);
                });      
                if(this.$el.find('#natpool-host').val().length>0){
                  self.hostAddressChangehandler(this.value,self);
                }
                
                this.addressDropDown=this.createAddressScrollDropDown('natpool-address',this.addressChangeHandler);
                var deviceUrlParams = {
                  acceptHeader : NATManagementConstants.DEVICES_ACCEPT_HEADER,
                  url : NATManagementConstants.DEVICES_URL,
                  jsonRoot : "devices.device",
                  jsonRecordParam : "devices",
                  templateResult : this.formatDeviceRemoteResult,
                  templateSelection:this.formatDeviceRemoteResultSelection
                };
                this.deviceDropDown=this.createRemoteDropDown('natpool-device',this.populateRoutingInstanceDropDown,deviceUrlParams,true);
                this.routingDropDown=this.createDropDown('natpool-routing',[],this.rIChangeHandler);   

                var poolUrlParams = {
                  acceptHeader : NATManagementConstants.NAT_POOLS_ACCEPT_HEADER,
                  url : NATManagementConstants.NAT_POOLS_URL+"?filter=(poolType eq 0 and name ne '"+this.model.get('name')+"')",
                  jsonRoot : "nat-pools.nat-pool",
                  jsonRecordParam : "nat-pools",
                  templateResult : this.formatRemoteResult,
                  templateSelection:this.formatPoolRemoteResultSelection
                };
                this.overflowDropDown=this.createRemoteDropDown('natpool-overflow',null,poolUrlParams,false);
             
                this.poolTypeDropDown =this.createDropDown('natpool-type',
                      [{"text":"SOURCE","id":"0"},{"text": "DESTINATION","id": "1"}],this.natPoolTypeChangeHandler);
                this.translationDropDown=this.createDropDown('natpool-translation',
                      [{"text":"No Translation","id":"NO_TRANSLATION"},
                      {"text": "Port/Range","id": "PORT_RANGE"},{"text": "Overload","id": "OVERLOAD"}],this.natPoolTranslationChangeHandler);
                this.poolingDropDown =this.createDropDown('natpool-pooling',
                      [{"text":"None","id":"NONE"},{"text": "Paired","id": "PAIRED"},
                      {"text": "Non-Paired","id": "NONPAIRED"}]);
                this.overflowTypeDropDown= this.createDropDown('natpool-overflow-type',
                      [{"text":"None","id":"NONE"},{"text": "Interface","id": "INTERFACE"},
                      {"text": "Pool","id": "POOL"}],this.natPoolOverflowTypeChangeHandler);
                this.portRangeDropDown= this.createDropDown(
                      'natpool-port-range',
                      [{"text":"Any","id":"ANY"},{"text": "Port","id": "PORT"},{"text": "Range","id": "RANGE"}],this.natPoolPortRangeChangeHandler);
                
                this.natPoolTranslationChangeHandler(NO_TRANSLATION);
                this.natPoolPortRangeChangeHandler(ANY);
                this.natPoolOverflowTypeChangeHandler(NONE);

                this.natPoolTypeChangeHandler(SOURCE);
                this.$el.find('.natpool-routing').prop('disabled',true);
              
                this.handleModifyMode();

                 //  create source and destination nat pool 
                if (options) {
                    if (options.natPoolType && options.natPoolType.toLowerCase() === SOURCE_STRING.toLowerCase()) {
                          this.natPoolTypeChangeHandler(SOURCE);
                          this.poolTypeDropDown.setValue(SOURCE);
                          this.$el.find('#natpool-type').parent().parent().hide();
                          this.$el.find('#natpool-host').parent().parent().hide();
                          this.$el.find('#natpool-overflow-type').parent().parent().hide();
                          this.$el.find('#natpool-routing-form').hide();
                    }
                    if (options.natPoolType && options.natPoolType.toLowerCase() === DESTINATION_STRING.toLowerCase()) {
                          this.natPoolTypeChangeHandler(DESTINATION);
                          this.poolTypeDropDown.setValue(DESTINATION);
                          this.$el.find('#natpool-type').parent().parent().hide();
                          this.$el.find('#natpool-routing-form').hide();
                    }
                }
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
            createRemoteDropDown : function(container,onchange,urlParameters,clearSelection) {
              var self = this;
              this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
              return new DropDownWidget({
                        "container": self.$el.find("."+container),
                        "enableSearch": true,
                        "allowClearSelection": clearSelection,
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
            createAddressScrollDropDown : function(container,onchange) {
              var self = this,
               urlFilter1={
                  property:'addressType',
                  modifier:'eq',
                  value:['IPADDRESS']
                },
                urlFilter2={
                  property:'addressType',
                  modifier:'eq',
                  value:['RANGE']
                },
                urlFilter3={
                  property:'addressType',
                  modifier:'eq',
                  value:['NETWORK']
                },
                urlFilter4={
                  property:'addressType',
                  modifier:'eq',
                  value:['GROUP']
                },
                urlFilters = [urlFilter1,urlFilter2,urlFilter3,urlFilter4];
               var addressDropDownWidget = new AddressDropDown({
                  "container": container,
                  "THIS":self,
                  "urlFilters":urlFilters,
                  "onchange":onchange,
                  "formatRemoteResult": self.formatAddressRemoteResult,
                  "formatRemoteResultSelection": function (data) {
                       if(data.name)
                        self.addrSelectedObj = data;
                      return data.name;
                   } 
              });
              return addressDropDownWidget.build();
            },
            formatAddressRemoteResult: function (data) {
              var GROUP = 'GROUP';
              var name = data.name;
              if(data['definition-type']!="PREDEFINED" && data.name) {
                 name = data['address-type'].toLowerCase()!=GROUP.toLowerCase()?data.name+ '(' + data['ip-address'] + ')':data.name;
              }  
              return name;
            },
            formatRemoteResult : function(data) {
              return data.name;
            },
            formatDeviceRemoteResult : function(data){
              var deviceNameFormatter = new DeviceNameFormatter();
              return deviceNameFormatter.formatDeviceName(data);
            },
            formatDeviceRemoteResultSelection: function (data) {
              if(data.name)
                this.deviceSelectedObj = data;
              return data.name;
            },
            formatPoolRemoteResultSelection: function (data) {
              if(data.name)
                this.poolSelectedObj = data;
              return data.name;
            },

            /**
             * @private
             *
             * This is a helper api which holds all the logic of the modify flow.
             *
             * @return none
             * */
            handleModifyMode: function() {
                  var poolType=this.model.get('pool-type');
                  if(poolType != undefined && poolType != null) {
                    this.poolTypeDropDown.setValue(poolType);
                    this.natPoolTypeChangeHandler(poolType);
                  }
                  if(this.model.get('pool-address')) {
                    this.addressDropDown.setValue({id:this.model.get('pool-address').id,text:this.model.get('pool-address').name}); 
                    this.addrSelectedObj = this.model.get('pool-address');
                  }  
                  if(this.model.get('address-pooling')) 
                    this.poolingDropDown.setValue(this.model.get('address-pooling'));
                  if(this.model.get('device')) {
                    this.deviceDropDown.setValue({id:this.model.get('device').id,text:this.model.get('device').name});
                    this.deviceSelectedObj = this.model.get('device');
                  } 
                  var translationType=this.model.get('disable-port-translation');
                  if(this.formMode === this.MODE_EDIT || this.formMode === this.MODE_CLONE)
                      this.$el.find('.natpool-type').prop('disabled',true);
                  switch(translationType){
                    case true: 
                            this.translationDropDown.setValue(NO_TRANSLATION);
                            var overflowPoolType =this.model.get('over-flow-pool-type');
                            this.overflowTypeDropDown.setValue(overflowPoolType);
                            this.natPoolOverflowTypeChangeHandler(overflowPoolType);
                            if(this.model.get('overflow-pool-address')) {
                              this.overflowDropDown.setValue({id:this.model.get('overflow-pool-address').id,text:this.model.get('overflow-pool-address').name});
                              this.poolSelectedObj = this.model.get('overflow-pool-address');
                            }
                            this.$el.find('#natpool-address-sharing').prop('checked', this.model.get('address-shared'));
                            break;    
                    case false:
                            var overloadingFactor = this.model.get('port-overloading-factor');
                            if(overloadingFactor!=-1){
                                this.$el.find('#natpool-overload').val(overloadingFactor); 
                                this.translationDropDown.setValue(OVERLOAD);
                            }else{
                                this.translationDropDown.setValue(PORT_RANGE);
                                var portRange = this.model.get('port-range');
                                if(typeof portRange != 'undefined' && portRange != ""){      
                                    var portArray = portRange.toString().split("-");
                                    if(portArray.length>1){
                                        this.portRangeDropDown.setValue("RANGE");
                                        this.$el.find('#natpool-port-range-start').val(portArray[0]);        
                                        this.$el.find('#natpool-port-range-end').val(portArray[1]);        
                                    }
                                    else if(portArray.length == 1) {
                                        this.portRangeDropDown.setValue("PORT");
                                        this.$el.find('#natpool-port-single').val(portArray[0]);  
                                    }
                                }
                            }
                            break;
                }
            },
      
            populateRoutingInstanceDropDown: function (value,scope) {
                var self = scope||this;
                if(!value) {
                  self.routingDropDown.setValue("");
                  self.$el.find('.natpool-routing').prop('disabled',true);
                  self.deviceSelectedObj = null;
                  return;
                }  
                var optionList=[{"id":"","text":""}];
                self.$el.find('.natpool-routing').prop('disabled',false);
                self.routing = new RoutingInstanceCollection({id:value});
                self.routing.fetch({
                    success: function (collection, response, options) {
                       if(response['routing-instances'] !== undefined && response['routing-instances']['routing-instance'] !== undefined) {
                          routing = response['routing-instances']['routing-instance'];
                          routing=$.isArray(routing)?routing:[routing];
                          $.each(routing,function(index,object) {
                              optionList.push({"text":object.name,"id":object.id});
                          });
                          self.routingDropDown.addData(optionList,true);
                            if(self.model.get('routing-instance-name')) {
                              var routingId = $("#natpool-routing option:contains("+self.model.get('routing-instance-name')+")").attr('value');
                              self.routingDropDown.setValue(routingId);
                            }  
                      }
                    },
                    error: function (collection, response, options) {
                        self.routingDropDown.addData([],true);
                        console.log('Routing Instance collection not fetched');
                    }
                });
            },
            rIChangeHandler : function(value,scope) {
              if(!scope) {
                return;
               }
              var THIS = scope;
              var routing = THIS.$el.find('#natpool-routing');
              if(value)
                routing.parent().removeClass("error").siblings().removeClass("error");
            },

            natPoolTypeChangeHandler: function(value,scope) {
                var THIS = scope || this;
                if (value == SOURCE) {
                    THIS.$el.find('#natpool-port-form').hide();
                    THIS.$el.find('#natpool-adavanced-form').show();
                    THIS.addressDropDown.setValue("");
                } else if(value == DESTINATION) {
                    THIS.$el.find('#natpool-port-form').show();
                    THIS.$el.find('#natpool-adavanced-form').hide().find(':input').removeAttr('required',true);
                    THIS.addressDropDown.setValue("");
                }
            },
            natPoolTranslationChangeHandler: function(value,scope) {
              var THIS = scope || this;
              switch(value) {
                case NO_TRANSLATION:
                     THIS.$el.find('.natpool-no-translation-conf').show();
                     THIS.$el.find('.natpool-port-range-conf').hide();
                     THIS.$el.find('.natpool-overload-conf').hide(); 
                     var selectedOverFlowType = THIS.$el.find("#natpool-overflow").children('option:selected').val();
                     THIS.natPoolOverflowTypeChangeHandler(selectedOverFlowType);
                break;
                case PORT_RANGE:
                     THIS.$el.find('.natpool-no-translation-conf').hide();
                     THIS.$el.find('.natpool-port-range-conf').show();
                     THIS.$el.find('.natpool-overload-conf').hide();
                     var selectedPortRange = THIS.portRangeDropDown.getValue();
                     THIS.natPoolPortRangeChangeHandler(selectedPortRange);
                break;
                case OVERLOAD:
                     THIS.$el.find('.natpool-no-translation-conf').hide();
                     THIS.$el.find('.natpool-port-range-conf').hide();
                     THIS.$el.find('.natpool-overload-conf').show(); 
                break;
              }
              THIS.checkTranslationValueAllowed(true, THIS);
            },
            addressChangeHandler : function(value,scope) {
               if(!scope) {
                return;
               }
               var THIS = scope;
               if(value) {
                THIS.$el.find('#natpool-address').parent().removeClass("error").siblings().removeClass("error");
               }
               var portField = THIS.$el.find('#natpool-port');
               var isValidField = (portField && portField.attr('data-invalid') == "")?false:true;
               THIS.checkPortRangeValueAllowed(isValidField, THIS);
            },
            natPoolPortRangeChangeHandler: function(value,scope) {
                 var THIS = scope || this;
                 if (value == ANY) {
                    THIS.$el.find('.natpool-port-range-params-conf').hide();
                    THIS.$el.find('.natpool-port-single-conf').hide();
                  } else if(value == RANGE) {
                    THIS.$el.find('.natpool-port-range-params-conf').show();
                    THIS.$el.find('.natpool-port-single-conf').hide();
                 } else {
                    THIS.$el.find('.natpool-port-range-params-conf').hide();
                    THIS.$el.find('.natpool-port-single-conf').show();
                 } 
            },
             natPoolOverflowTypeChangeHandler: function(value,scope) {
                 var THIS = scope || this;
                 if (value == POOL) {
                    THIS.$el.find('.natpool-overflow-conf').show().find(':input').attr('required',true);
                  }
                  else{
                    THIS.$el.find('.natpool-overflow-conf').hide().find(':input').removeAttr('required');
                  }
            },

           addAddress: function() {
                // Form for address creation
                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                    {
                        mime_type: 'vnd.juniper.net.addresses'
                    }
                );
                intent.putExtras({addressTypes: ['host','range','network','other']});
                if(this.$el.find('#natpool-type select').val()==DESTINATION){
                      intent.putExtras({addressObject: 'ipaddress'});
                }
                this.context.startActivityForResult(intent, $.proxy(this.afterAddrCreate, this));
            },

            afterAddrCreate : function(resultCode,data) {
                if(data) {
                  this.addressDropDown.setValue({id:data.id,text:data.name});
                  this.addrSelectedObj = data;
                }  
            },
            /**
             * @private
             *
             * Change the title of the form based on the context.
             *
             * @param (object) formConfiguration - form items configuration
             * */
            addDynamicFormConfig: function(formConfiguration,options) {
                var dynamicProperties = {};
                if(options){
                   if (options.natPoolType && options.natPoolType.toLowerCase() === SOURCE_STRING.toLowerCase()) {
                        this.formMode =MODE_CREATE_SOURCE;
                   } 
                   if (options.natPoolType && options.natPoolType.toLowerCase() === DESTINATION_STRING.toLowerCase()) {
                        this.formMode =MODE_CREATE_DESTINATION;
                   } 
                }    
                ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
                switch (this.formMode) {
                    case this.MODE_EDIT:
                        dynamicProperties.title = this.context.getMessage('natpool_edit');
                        break;
                    case this.MODE_CREATE:
                        dynamicProperties.title = this.context.getMessage('natpool_create');
                        break;
                    case this.MODE_CLONE:
                        dynamicProperties.title = this.context.getMessage('natpool_clone');
                        break;
                    case MODE_CREATE_SOURCE:
                        dynamicProperties.title = this.context.getMessage('natpool_create_source');
                        break;    
                    case MODE_CREATE_DESTINATION:
                        dynamicProperties.title = this.context.getMessage('natpool_create_destination');
                        break;        
                }
                _.extend(formConfiguration, dynamicProperties);
            },

            // View event handlers

            /**
             * Called when OK button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            submit: function(event) {
                event.preventDefault();
                this.bindModelEvents();
                
                

                var hiddenRequiredFields = this.$el.find("#sd_natpool_form").find("div[style='display: none;'][class*='row']").find("input[required]");
                this.resetRequiredField(hiddenRequiredFields, false);

                this.checkPoolAddressPresent();
                this.checkTranslationValueAllowed(true,this);
                this.checkRIForDevicePresent();
                this.checkOverflowPresent();
                
                // Work around until form.isValidInput() can support to check fields that don't have the "required" property
                if (this.checkFieldStatus()) {
                    console.log('form is invalid');
                    // Reset required fields so that they can be checked again.
                    this.resetRequiredField(hiddenRequiredFields, true);
                    return;
                }

                // Check is form valid
                if (! this.form.isValidInput() || !this.isTextareaValid()) {
                    console.log('form is invalid');
                    // Reset required fields so that they can be checked again. 
                    this.resetRequiredField(hiddenRequiredFields, true);
                    return;
                }

                var properties = {},
                addressSelectedID = this.addrSelectedObj.id?this.addrSelectedObj.id:this.addrSelectedObj.get('id'),
                deviceSelectedID = this.deviceDropDown.getValue(),
                poolSelectedID =this.overflowDropDown.getValue(),
                poolType=this.poolTypeDropDown.getValue();
                properties['port-range'] ="";
                //basic form items
                properties['name'] = this.$el.find('#natpool-name').val();
                properties['description'] = this.$el.find('#natpool-description').val();
                properties['pool-type'] = poolType;
                properties['pool-address'] = { 
                  id: addressSelectedID, 
                  name: this.addrSelectedObj.name?this.addrSelectedObj.name:this.addrSelectedObj.get('name')
                }; 

                if(deviceSelectedID){
                    properties['device'] = {id:deviceSelectedID, name: this.deviceSelectedObj.name};
                    properties['routing-instance-name']= this.$el.find('#natpool-routing :selected').text();
                }
                else {
                    properties['device'] = {};
                    properties['routing-instance-name']= "";
                }
                
                if(poolType==DESTINATION){
                    properties['port-range'] = this.$el.find('#natpool-port').val();
                }else{
                    //advance form items
                    properties['host-address-base'] = this.$el.find('#natpool-host').val();
                    properties['address-pooling'] = this.poolingDropDown.getValue();
                    var translationType =this.translationDropDown.getValue();
                    properties['disable-port-translation'] = (translationType==NO_TRANSLATION);
                    properties['port-overloading-factor'] = -1;                    
                    properties['port-range'] ="";
                    
                    switch(translationType){
                        case NO_TRANSLATION:
                                            properties['address-shared'] = this.$el.find('#natpool-address-sharing').is(":checked");
                                            properties['over-flow-pool-type'] = this.overflowTypeDropDown.getValue();
                                            if(poolSelectedID)
                                              properties['overflow-pool-address'] = { id: poolSelectedID, name: this.poolSelectedObj.name};     
                                            break;
                        case PORT_RANGE:
                                            if(this.portRangeDropDown.getValue()=='RANGE'){
                                                properties['port-range'] = this.$el.find('#natpool-port-range-start').val()+"-"+this.$el.find('#natpool-port-range-end').val();
                                            }
                                            else if(this.portRangeDropDown.getValue()=='PORT') {
                                                properties['port-range'] = this.$el.find('#natpool-port-single').val();
                                            }
                                            break;
                        case OVERLOAD:                    
                                            properties['port-overloading-factor'] = this.$el.find('#natpool-overloading').val();
                                            break;
                    }
                }
                this.bindModelEvents();
                this.model.set(properties);
                this.model.save();
            },
            checkFieldStatus: function() {
            // Work around: Check those fields that are not required
            var start_port = this.$el.find("#natpool-port-range-start");
            var end_port = this.$el.find("#natpool-port-range-end");
            var overflow_pool= this.$el.find("#natpool-overflow");
            var port= this.$el.find("#natpool-port");
            var host=this.$el.find('#natpool-host');
            var translation = this.$el.find('#natpool-translation');
            var address = this.$el.find('#natpool-address');
            var routing = this.$el.find('#natpool-routing');

            if(address.is(":visible") && address.parent().hasClass("error")) {
                return true;
            }
            if(routing.parent().hasClass("error")) {
                return true;
            }
            if (start_port.is(":visible") && start_port.parent().hasClass("error")) {
                return true;
            }
            if (end_port.is(":visible") && end_port.parent().hasClass("error")) {
                return true;
            }
            if (overflow_pool.is(":visible") && overflow_pool.parent().hasClass("error")) {
                return true;
            }
            if (port.is(":visible") && port.parent().hasClass("error")) {
                return true;
            }
            if (host.is(":visible") && host.parent().hasClass("error")) {
                return true;
            }
            if (translation.isVisibleNode() && translation.parent().hasClass("error")) {
                return true;
            }
            return false;
        },
        hostAddressChangehandler: function(value,self){
              if(value!="" &&  !self.$el.find('.natpool-pooling-conf').hasClass('error')){
                self.$el.find('.natpool-pooling-conf').hide();
              }else{
                self.$el.find('.natpool-pooling-conf').show();
              }

        },
        checkPortRangeValueAllowed: function(isValid, self){
              var addressID= self.addressDropDown.getValue(),
                  addressObj = self.addrSelectedObj,
                  port = self.$el.find('#natpool-port'),
                  error = port.siblings('.error');
                if(!isValid) {
                  port.parent().addClass("error").siblings().addClass("error");
                  error.show().text(self.context.getMessage('natpool_create_pool_dst_port_error'));
                  return;
                }
                 var addressType=addressObj ? addressObj['address-type']:null;
                 if(port.val() && port.val() != "" && addressType != null && addressType != "IPADDRESS") {
                     port.parent().addClass("error").siblings().addClass("error");
                     error.show().text(self.context.getMessage('natpool_pool_port__allow_error'));
                 } else {
                     port.parent().removeClass('error').siblings().removeClass('error');
                 }

        },
        checkTranslationValueAllowed: function(isValid, self){
             var addressID= self.$el.find('#natpool-address :selected').val(),
                 addressObj = self.addrSelectedObj,
                 host=self.$el.find('#natpool-host'),
                 hostVal= self.$el.find('#natpool-host').val(),    
                 translation = self.$el.find('#natpool-translation'),
                 translationVal=self.$el.find('#natpool-translation :selected').val(),
                 errorTranslation = translation.siblings('.error'),
                 errorHost = host.siblings('.error');

             if(translationVal== OVERLOAD){
              if( addressObj!= undefined &&  (addressObj['address-type']=='NETWORK' || addressObj['address-type']=='RANGE')){
                  translation.parent().addClass("error").siblings().addClass("error");
                  errorTranslation.show().text(self.context.getMessage('natpool_pool_translation__allow_error'));
              }
              if( hostVal != undefined && hostVal!=""){
                  host.parent().addClass("error").siblings().addClass("error");
                  errorHost.show().text(self.context.getMessage('natpool_pool_overflow__allow_error'));
                }
            }
            else {
              translation.parent().removeClass("error").siblings().removeClass("error");
              host.parent().removeClass("error").siblings().removeClass("error");
            }
        },
        checkEndPortGreaterValidation: function(isValid,self){
              var endPort = self.$el.find('#natpool-port-range-end'), 
              endPortValue = endPort.val(), 
              startPort = self.$el.find('#natpool-port-range-start'),
              startPortValue = startPort.val(), 
              error = endPort.siblings('.error');
              if (startPortValue >= endPortValue){
                  var portRangeError = self.context.getMessage('natpool_port_range_error');
                  endPort.parent().addClass("error").siblings().addClass("error");
                  error.show().text(portRangeError);
              }
        },

        checkPoolAddressPresent : function() {
             var addressID= this.addressDropDown.getValue(),
                 address = this.$el.find('#natpool-address'),
                 error = address.siblings('.error');

             if((addressID == undefined || addressID == "") ) {
                 address.parent().addClass("error").siblings().addClass("error");
             }
             else {
                 address.parent().removeClass("error").siblings().removeClass("error");
             }
        },

        checkOverflowPresent : function() {
          var overflowType = this.overflowTypeDropDown.getValue(),
              overflowID = this.overflowDropDown.getValue(),
              overflow = this.$el.find('#natpool-overflow'),
              error = overflow.siblings('.error');

          if(overflowType === "POOL") {    
            if((overflowID == undefined || overflowID == "")) {
              overflow.parent().addClass("error").siblings().addClass("error");
              return;
            }
          }
          overflow.parent().removeClass("error").siblings().removeClass("error");  
        },

        checkRIForDevicePresent : function() {
             var routingID= this.routingDropDown.getValue(),
                 routing = this.$el.find('#natpool-routing');
                 error = routing.siblings('.error');
             if(this.deviceDropDown.getValue() != undefined && this.deviceDropDown.getValue()!="") {
                 if((routingID == undefined || routingID == "") ) {
                     routing.parent().addClass("error").siblings().addClass("error");
                 }
                 else {
                     routing.parent().removeClass("error").siblings().removeClass("error");
                 }
             }
             else {
                routing.parent().removeClass("error").siblings().removeClass("error");
             }
        },
            /**
             * Called when Cancel button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            cancel: function(event) {
                event.preventDefault();
                this.activity.overlay.destroy();
            },
            resetRequiredField: function(requiredFields, isRequried) {
                requiredFields.each(
                    function(){
                        $(this).attr("required", isRequried);
                    }
                );
            }
        });
        return NatPoolFormView;
    }
);
