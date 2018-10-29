/**
 * A view to create policy
 *
 * @module BasePolicyView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'backbone',
  'backbone.syphon',
   '../../../../../ui-common/js/views/apiResourceView.js',
   'widgets/form/formWidget',
   'widgets/overlay/overlayWidget',       
   '../../assign-devices/widgets/assignDevicesListBuilder.js',
   '../../assign-devices/models/assignDevicesModel.js',
   '../../policy-sequence/views/policySequenceView.js',
   '../../../../../sd-common/js/common/widgets/errorConfirmationDialogWidget.js',
   'widgets/dropDown/dropDownWidget',
   '../../../../../ui-common/js/common/widgets/progressBarForm.js',
   '../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
   '../../../../../sd-common/js/common/deviceNameFormatter.js',
   '../../../../../ui-common/js/common/utils/validationUtility.js',
  '../../../../../ui-common/js/common/utils/SmProgressBar.js'
 ], function (Backbone, Syphon, ResourceView,FormWidget, OverlayWidget, DevicesListBuilder,
  AssignDevicesModel, PolicySequenceView,ErrorConfirmationDialog,DropDownWidget,
   ProgressBarForm, SmSSEEventSubscriber,DeviceNameFormatter,ValidationUtility,SmProgressBar) {
  var GROUP = 'GROUP';

  var BasePolicyView = ResourceView.extend({
      closeOverlayOnActivityFinish : false,
      events: {
            'click #btnPolicyOk': 'savePolicy',
            'click #linkPolicyCancel': 'closeOverlay',
            'click #policy-sequence-no-select-link': 'selectPolicySequence',
            'click #showDevicesWithoutPolicy' : 'showDevicesWithoutPolicy'
        },

      model : null, //Model of the policy
      collection : null, //Collection of the policy
      devices : null, 
      serviceType:null, //Service type of the policy from self.policyManagementConstants file
      policyManagementConstants : null, //Respective policy constants file
      
      initialize: function (options) {
          ResourceView.prototype.initialize.call(this, options);
          _.extend(this, ValidationUtility);
          this.activity = options.activity;
          this.context = options.activity.getContext();
          this.screenId = options.activity.cuid;
          var mode = this.activity.getIntent().getExtras().mode;
          if(mode === this.MODE_SAVE_AS){
            this.formMode=this.MODE_SAVE_AS;
            this.screenId = this.activity.getIntent().getExtras().cuid;
          } else if (mode === this.MODE_PROMOTE_TO_GROUP){
            this.formMode=this.MODE_PROMOTE_TO_GROUP;
          }
          this.initializeHandler();
      },

      render: function () {
          var self = this;
          var policyFormConf = self.getFormConfiguration();
          var formElements = policyFormConf.getValues();

          this.addDynamicFormConfig(formElements);
          if (this.formMode === this.MODE_CLONE) {
            formElements["title-help"]["content"] = this.context.getMessage("clone_title_tooltip");
            formElements["title-help"]["ua-help-identifier"] = this.context.getHelpKey("POLICY_OBJECT_EDIT_CLONING");
          }

          this.formWidget = new FormWidget({
              elements: formElements,
              container: this.el,
              values: this.model.attributes
          });
          this.formWidget.build();
          this.addSubsidiaryFunctions(formElements);
          this.$el.addClass("security-management");

          if(this.formMode === this.MODE_CREATE) {
            this.addDevicesListBuilder();
            this.policyTypeChangeHandler(GROUP);
            this.deviceDropDown=this.createScrollDropDown('device');
            this.$el.find('input[type=radio][name=policy-type]').click(function() {
                self.policyTypeChangeHandler(this.value);
            });
          }
          this.$el.find('input[type=radio][name=policy-position]').click(function() {
              self.policyPositionChangeHandler(this.value);
          });

          if(this.formMode === this.MODE_EDIT || this.formMode === this.MODE_CLONE ||
              this.formMode === this.MODE_SAVE_AS) {
              this.$el.find("label[for=typeRadio]").parent().parent().hide();
              this.$el.find('#policy_group_form').hide();
              this.$el.find('#policy_group_form').children().hide();
              this.$el.find('#policy_device_form').hide();
              this.$el.find('#policy_device_form').children().hide();
              if(this.model.get("policy-type") === "DEVICE") {
                this.$el.find('#policy_sequence_form').hide();
                this.$el.find('#policy_sequence_form').children().hide();  
              } else {
                var policyPosition = this.model.get("policy-position");
                if(policyPosition === "PRE"){
                    this.$el.find('input:radio[name=policy-position]:nth(0)').attr('checked',true).trigger("click");
                }else{
                    this.$el.find('input:radio[name=policy-position]:nth(1)').attr('checked',true).trigger("click");
                }
              }
              this.populateFormData();
          }
          if(this.formMode === this.MODE_EDIT && this.model.get("policy-type") === "GLOBAL"){
            this.$el.find("#policy-name").attr("readonly", true);
            this.$el.find("#description").attr("readonly", true);
            this.$el.find('#policy_sequence_form').hide();
            this.$el.find('#policy_sequence_form').children().hide(); 
          }
          if(this.formMode === this.MODE_CLONE) {
             this.subscribeNotifications();
          }
          if(this.formMode === this.MODE_PROMOTE_TO_GROUP){
            this.$el.find("label[for=typeRadio]").parent().parent().hide();
            this.$el.find('#policy_group_form').hide();
            this.$el.find('#policy_group_form').children().hide();
            this.$el.find('#policy_device_form').hide();
            this.$el.find('#policy_device_form').children().hide();
          }

          this.renderHandler();
          return this;
        },

        createScrollDropDown : function(container,data,onchange) {
          var self = this;
          var policyUrl = self.policyManagementConstants.POLICY_URL;
          var policyId = (!self.policyModel) ? 0 : self.policyModel.get("id");
          this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
           return new DropDownWidget({
              "container": this.$el.find("."+container),
              "enableSearch": true,
              "allowClearSelection": true,
              "placeholder": self.context.getMessage('select_option'),
              "remoteData": {
                  headers: {
                      "accept" : self.policyManagementConstants.ASSIGN_DEVICES_AVAILABLE_ACCEPT,
                      "Content-Type": self.policyManagementConstants.ASSIGN_DEVICES_AVAILABLE_ACCEPT
                  },
                  "url": self.policyManagementConstants.getAssignDevicesAvailableDevicesUrl(policyId),
                  "numberOfRows": 100,
                  "jsonRoot": "devices.device",
                  "jsonRecords": function(data) {
                      return data['devices']['total'];
                  },
                  "success": function(data){console.log("call succeeded");},
                  "error": function(){console.log("error while fetching data");}
              },
              "templateResult": $.proxy(this.formatRemoteResult,this),
              "templateSelection": $.proxy(this.formatRemoteResultSelection,this),
              "onChange": function(event) {
                  if (onchange) {onchange($(this).val(),self);}
               }
          }).build();
        },

        formatRemoteResult: function (data) {
          var deviceNameFormatter = new DeviceNameFormatter();
          return deviceNameFormatter.formatDeviceName(data);
        },

        formatRemoteResultSelection: function (data) {
          return data.name;
        },

        subscribeNotifications : function () {
            //Subscribe to the SSE event
            var self = this;
            self.smSSEEventSubscriber = new SmSSEEventSubscriber();
            var screenID = self.screenId;
            if (self.screenId[0]!='$') {
                screenID = '$'+self.screenId;
            };
            var sseEventHandler, notificationSubscriptionConfig = {
                'uri' : [ self.policyManagementConstants.TASK_PROGRESS_URL+ screenID ],
                'autoRefresh' : true,
                'callback' : function () {
                    self.getProgressUpdate();
                }
            };
                
            sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
            self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
            return self.sseEventSubscriptions;
        },

        unSubscribeNotifications: function(){
            this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
            this.smSSEEventSubscriber = null;
            this.sseEventSubscriptions = null;
        },

        close: function() {
            if(this.smSSEEventSubscriber){
                this.unSubscribeNotifications();
            }
        },

        getProgressUpdate : function() {
             var self = this;    
             var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;        
             $.ajax({
                url: self.policyManagementConstants.TASK_PROGRESS_URL+ screenID,
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': self.policyManagementConstants.TASK_PROGRESS_ACCEPT
                },               
                success: function(data, status) {  
                    var progress = 0;
                    if(data['task-progress-response']) {
                        progress = data['task-progress-response']['percentage-complete']/100;
                        if(progress >= 1)
                        {
                            self.cloneProgressBar._progressBar.setStatusText('Complete');
                            self.cloneProgressBar._progressBar.hideTimeRemaining();
                            self.cloneProgressBarOverlay.destroy(); 
                            self.destroyOverlay();
                            self.notify('success', self.context.getMessage(self.successMessageKey,
                              [self.cloneProgressBar.conf.policyName]));
                        }
                        else {
                           if(self.cloneProgressBar) {
                            self.cloneProgressBar._progressBar.setStatusText(data['task-progress-response']['current-step']);
                            self.cloneProgressBar._progressBar.setProgressBar(progress);  
                           } 
                        }    
                    } 
                    else 
                        self.cloneProgressBar._progressBar.setProgressBar(progress);          
                },
                error: function() {
                    console.log("Id retrival failed");
                }
            });
        },

        //Override the method to return the form configuration
        getFormConfiguration : function(){},

        //Override the method to add dynamic properties to form
        addDynamicFormConfig : function() {},

        //Override the method to populate data in the form incase of edit or clone mode
        populateData : function() {},

        //Override this method if custom items needs to be taken care during render
        //Skip if no special handling is required
        renderHandler : function() {},

        //Override this method if custom variables needs to be initialized
        //Skip if no special handling is required
        initializeHandler : function(){},

        //Takes care of switching between group and device policy
        policyTypeChangeHandler : function(value){
            if (value === GROUP) {
                this.$el.find('#policy_group_form').show();
                this.$el.find('#policy_group_form').children().show();
                this.$el.find('#policy_sequence_form').show();
                this.$el.find('#policy_sequence_form').children().show();
                this.$el.find('#policy_device_form').hide();
                this.$el.find('#policy_device_form').children().hide();
            } else {
                this.$el.find('#policy_group_form').hide();
                this.$el.find('#policy_group_form').children().hide();
                this.$el.find('#policy_sequence_form').hide();
                this.$el.find('#policy_sequence_form').children().hide();
                this.$el.find('#policy_device_form').show();
                this.$el.find('#policy_device_form').children().show();
            }    
        },

        policyPositionChangeHandler : function(value){
          this.setPolicySequenceOrder(null,null); 
        },

        populateFormData : function(){
          if(this.formMode === this.MODE_CLONE) {
            this.setPolicySequenceOrder(null,null);
          }
          else {
            this.setPolicySequenceOrder(this.model.get('sequence-number'),this.model.get('policy-order'));
          }  
          this.populateData();
        },

        //Adds device list builder to the form
        addDevicesListBuilder: function () {
          var self = this;
          var id = "createPolicyDeviceListBuilder";
          var listContainer = this.$el.find('#' + id);
          listContainer.attr("readonly", "");

          var selectedItems = [];

          self.devicesListBuilder = new DevicesListBuilder({
              context: self.context,
              container: listContainer,
              selectedItems: selectedItems,
              policyModel:null,
              policyManagementConstants:self.policyManagementConstants
          });

          self.devicesListBuilder.build(function() {
              listContainer.find('.new-list-builder-widget').unwrap();
          });
        },

        showDevicesWithoutPolicy : function() {
           var self = this;
           var currentPara = self.devicesListBuilder.getAvailableUrlParameter();
           if(self.$el.find("#showDevicesWithoutPolicy").is(':checked')) {
               _.extend(currentPara, {"hide-assigned-devices": true});
           } else {
               _.extend(currentPara, {"hide-assigned-devices": false});
           }
           self.devicesListBuilder.searchAvailableItems(currentPara);
        },

        //Saves the policy
        savePolicy: function (e) {
            e.preventDefault();
            var self = this;
            if (self.validateForm() && self.isTextareaValid()) {
                this.bindModelEvents();
                var params = self.getFormData();
                params['policy-position'] = params['policy-type']==="DEVICE"? "DEVICE" : params['policy-position'];
                params['policy-order'] = self.policyRecordOrder;
                params['sequence-number'] = self.policyRecordSeq;
                if(self.formMode === self.MODE_CLONE) {
                    self.clonePolicy(params);
                    self.showProgressWindow(params.name);      
                } else if(self.formMode === self.MODE_SAVE_AS) {
                  self.saveAsPolicy(params);
                } else if (self.formMode === self.MODE_PROMOTE_TO_GROUP){
                  self.promoteToGroupPolicy(params);
                }else {
                  self.progressBar =  new SmProgressBar({
                    "container": self.getOverlayContainer(),
                    "hasPercentRate": false,
                    "isSpinner" : true
                  });
                  self.progressBar.build();
                  self.model.save(params, {
                      success: function (model, response, options) {
                          if (self.formMode === self.MODE_CREATE) {
                              self.assignDevices(params,model.id);  
                          } else {
                              self.destroyOverlay();
                          }
                      },
                      error: function(XMLHttpRequest, textStatus, errorThrown) {

                      }
                  });
                }
            }
        },

        saveAsPolicy: function(params) {
            var self = this;
            var policyId = self.activity.getIntent().getExtras().id;
            var dataObj = {
              "policy" : params
            };
            $.ajax({
                url: self.policyManagementConstants.POLICY_URL+policyId+"/draft/save-as?cuid=" + self.screenId,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": self.policyManagementConstants.POLICY_CONTENT_HEADER,
                    "accept": self.policyManagementConstants.POLICY_ACCEPT_HEADER
                },               
                success: function(data, status) {
                    self.destroyOverlay();
                    var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
                        {
                            mime_type: self.policyManagementConstants.POLICY_MIME_TYPE
                        }
                    );
                    self.context.startActivityForResult(intent);
                    self.notify('success', self.context.getMessage("policy_create_success",[params.name]));
                },
                error: function(data) {
                    console.log("Save As failed");
                }
            });
        },

        clonePolicy: function(params) {
            var self = this;
            var screenID = self.screenId;
            if (self.screenId[0]!='$') {
                screenID = ('$'+self.screenId);
            }
            var policyId = self.activity.getIntent().getExtras().id;
            params.id = policyId;
            var dataObj = {
              "policy" : params
            };
            $.ajax({
                url: self.policyManagementConstants.CLONE_POLICY_URL + screenID ,
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": self.policyManagementConstants.POLICY_CONTENT_HEADER,
                    "accept": self.policyManagementConstants.POLICY_ACCEPT_HEADER
                },               
                success: function(data, status) {  
                    
                },
                error: function(data) {
                    console.log("Clone failed");
                }
            });
        },

        showProgressWindow : function(policyName) {
            var self = this;

            this.cloneProgressBar = new ProgressBarForm({
                title: 'Clone Policy',
                policyName:policyName,
                statusText: "Start",
                hasPercentRate: true
            });
           
            this.cloneProgressBarOverlay = new OverlayWidget({
                view: this.cloneProgressBar,
                type: 'small',
                height : "680px",
                showScrollbar: false
            });
            this.cloneProgressBarOverlay.build();

        },
        //Assigns devices to the policy incase user has chosen any device
        assignDevices : function(params,id){
            var self=this;
          var saveSelectedItems = function(selectedIds) {
            selectedIds =  selectedIds? selectedIds : [];

            var addDeviceArr = [],
              deletedIdsArr = [],properties =  {};

            selectedIds.forEach(function (id) {
                        addDeviceArr.push({
                id: id
                        });
                    });

                    if(addDeviceArr.length > 0) {
              var model= new AssignDevicesModel({
                assignDevicesURLRoot:self.policyManagementConstants.getAssignDevicesURLRoot(id),
                assignDevicesContentType:self.policyManagementConstants.POLICY_ASSIGN_DEV_CONTENT_HEADER
              });
                      properties["add-list"]= {"device": addDeviceArr};
                      properties["delete-list"]={};
                      self.bindModelEvents();
                      model.save(properties, {
                          success: function (model, response, options) {
                            console.log("Assign devices success");
                            self.destroyOverlay();  
                          },
                          error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log("Assign devices failed");
                  self.notify("error", self.context.getMessage("action_assign_device_failed"));
                            self.destroyOverlay();
                          }
                      });
                    } else {
                      self.destroyOverlay();  
                    }
            };

          if(params['policy-type'] === "DEVICE") {
            var value = self.deviceDropDown.getValue();
            var selectedItems = value? [value] : [];
            saveSelectedItems(selectedItems);
            } else {
            var listBuilder = self.devicesListBuilder;
            listBuilder.listBuilderModel.getSelectedAllIds(function(response) {
              var ids = listBuilder.getAllIds(response);
              saveSelectedItems(ids);
            });
            }
        },

        //Select Policy Sequence
        selectPolicySequence : function() {
            var self=this,policyRecord = Syphon.serialize(this);

            if(self.formMode ===  self.MODE_EDIT){
              policyRecord.id=self.model.get("id");
              policyRecord["policy-order"] = self.model.get("policy-order");
              if(self.model.get('policy-position') !== policyRecord["policy-position"]){
                policyRecord["isPolicyPositionChanged"]=true;
              }
              policyRecord["domain-id"] = self.model.get("domain-id");
            }
            else {
              policyRecord.id=0;
              policyRecord["domain-id"] = Juniper.sm.DomainProvider.getCurrentDomain();
            }
            policyRecord["sequence-number"] = this.policyRecordSeq;
            policyRecord["policy-order"] = this.policyRecordOrder;

            var params = {
               policyURL : self.policyManagementConstants.POLICY_URL,
               policyAcceptHeader : self.policyManagementConstants.POLICIES_ACCEPT_HEADER
            };

            var policySequenceForm = new PolicySequenceView({
              "parentView": this, 
              "policyRecord": policyRecord, 
              "params": params, 
              "collection":this.collection,
              "formMode":this.formMode
            });
            this.overlay = new OverlayWidget({
                view: policySequenceForm,
                type: 'xlarge',
                showScrollbar: true,
                xIconEl: true
            });
            this.buildOverlay();

            return this;
        },

      buildOverlay: function() {
          this.overlay.build();
      },

        setPolicySequenceOrder : function(policySequence, policyOrder) {
          this.policyRecordSeq = policySequence;
          this.policyRecordOrder = policyOrder;
        },

        //Closes overlay
        closeOverlay: function (event) {
            event.preventDefault();
            this.destroyOverlay();
        },

        destroyOverlay : function(){
          if(this.progressBar) {
            this.progressBar.destroy();
          }
          if(this.devicesListBuilder) {
              this.devicesListBuilder.destroy();
          }
          this.activity.overlay.destroy();
        },

        getOverlayContainer : function (){
          var overlayContainer;
          if ($('#overlay_content .overlay-wrapper').length > 0) {
            overlayContainer = $('#overlay_content .overlay-wrapper');
          } else {
            throw new Error("The overlay widget has to be built first");
          }
          return overlayContainer;
        },

        //Override method to validate the form. Method should return true or false
        validateForm : function(){},

        //Overrride method to get the form data. Return the form data as an object
        getFormData : function(){}

  });
  return BasePolicyView;
});
