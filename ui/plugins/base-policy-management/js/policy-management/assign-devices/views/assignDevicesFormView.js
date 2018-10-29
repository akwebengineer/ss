/**
 * The launch assign device page
 *
 * @module AssignDeviceView
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
  'backbone',
  'backbone.syphon',
  'widgets/form/formWidget',
  '../conf/assignDevicesFormConfiguration.js',
  '../widgets/assignDevicesListBuilder.js',
  '../models/assignDevicesModel.js',
  '../../../../../ui-common/js/views/apiResourceView.js',
  'widgets/dropDown/dropDownWidget',
  '../../../../../sd-common/js/common/deviceNameFormatter.js',
  '../../../../../ui-common/js/common/utils/SmProgressBar.js'
], function (Backbone, Syphon, FormWidget, AssignDevicesFormConfiguration, DevicesListBuilder,
             AssignDevicesModel,ResourceView,DropDownWidget,DeviceNameFormatter,SmProgressBar) {
  var GROUP = 'GROUP';
  var AssignDevicesView = ResourceView.extend({
    events: {
      'click #btnPolicyOk': 'assignDevices',
      'click #linkPolicyCancel': 'closeOverlay',
      'click #showDevicesWithoutPolicy' : 'showDevicesWithoutPolicy'
    },
    initialize: function (options) {
      ResourceView.prototype.initialize.call(this, options);
      this.activity=options.activity;
      this.policyModel=options.model;
      this.policyManagementConstants = options.policyManagementConstants;
      this.isDevicePolicy = (this.policyModel.get('policy-type') == "DEVICE");
      this.context=options.activity.getContext();
      this.model= new AssignDevicesModel({
        assignDevicesURLRoot: this.policyManagementConstants.getAssignDevicesURLRoot(this.policyModel.get("id")),
        assignDevicesContentType: this.policyManagementConstants.POLICY_ASSIGN_DEV_CONTENT_HEADER
      });
      this.initialSelectedDevices = [];
      this.successMessageKey='assign_devices_assigned_success';
      this.fetchErrorKey='assign_devices_fetch_error';
    },

    render: function () {

      var assignDevicesFormConf= new AssignDevicesFormConfiguration(this.context);
      var formElements = assignDevicesFormConf.getValues(this.isDevicePolicy);
      this.form = new FormWidget({
        elements: formElements,
        container: this.el,
        values: this.policyModel.attributes,
        isValidInput : function() {
          return true;
        }
      });
      this.form.build();

      if(this.isDevicePolicy) {
        this.$el.find(".assignDevicesGroupForm").hide();
        this.$el.find("#assign_devices_group_form").children().hide();
        this.deviceDropDown=this.createScrollDropDown('assignDeviceDropDown');
      } else {
        this.$el.find(".assignDevicesDeviceForm").hide();
        this.getSelectedDevicesData();
      }
      this.$el.addClass("security-management");
      this.$el.find("#name").prop('disabled',true);
      this.$el.find("#name").removeAttr('error',true);
      return this;
    },

    addListBuilder: function (selectedItems) {
      var self = this;
      var id = "assignDeviceListBuilder";
      var listContainer = this.$el.find('#' + id);
      listContainer.attr("readonly", "");

      self.listBuilder = new DevicesListBuilder({
          context: self.context,
          container: listContainer,
          selectedItems: selectedItems,
          policyModel:self.policyModel,
          policyManagementConstants: self.policyManagementConstants
      });

      self.listBuilder.build(function() {
          listContainer.find('.new-list-builder-widget').unwrap();
      });
    },

    createScrollDropDown : function(container,data,onchange) {
      var self = this, policyManagementConstants = self.policyManagementConstants;
      var policyId = (self.policyModel === null) ? 0 : self.policyModel.get("id");
      this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
       return new DropDownWidget({
         "container": this.$el.find("."+container),
         "enableSearch": true,
         "allowClearSelection": true,
         "placeholder": self.context.getMessage('select_option'),
         "remoteData": {
              headers: {
                  "accept" : policyManagementConstants.ASSIGN_DEVICES_AVAILABLE_ACCEPT,
                  "Content-Type": policyManagementConstants.ASSIGN_DEVICES_AVAILABLE_ACCEPT
              },
              "url": policyManagementConstants.getAssignDevicesAvailableDevicesUrl(policyId),
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

    showDevicesWithoutPolicy : function() {
       var self = this;
       var currentPara = self.listBuilder.getAvailableUrlParameter();
       if(self.$el.find("#showDevicesWithoutPolicy").is(':checked')) {
           _.extend(currentPara, {"hide-assigned-devices": true});
       } else {
           _.extend(currentPara, {"hide-assigned-devices": false});
       }
       self.listBuilder.searchAvailableItems(currentPara);
    },

    getSelectedDevicesData: function() {
       var self = this, policyManagementConstants = self.policyManagementConstants;
       $.ajax({
            url: policyManagementConstants.getAssignedDevicesIdsUrl(self.policyModel.get("id")),
            type: 'get',
            dataType: 'json',
            headers: {
              'accept':policyManagementConstants.ASSIGN_DEVICES_ASSIGNED_DEVICES_IDS_ACCEPT
            },
            success: function(data, status) {
              if (data && data["id-list"] && data["id-list"].ids) {
                self.initialSelectedDevices = data["id-list"].ids;
              }
              self.addListBuilder();
            },
            error: function() {
                console.log('devices for policy not fetched');
            },
            async: false
        });
    },

    assignDevices: function (e) {
      e.preventDefault();
      var self=this;
      var saveSelectedItems = function(selectedIds) {
        selectedIds =  selectedIds? selectedIds : [];

        var preSelectedIds = self.initialSelectedDevices? self.initialSelectedDevices : [],
            addDeviceIds = _.difference(selectedIds, preSelectedIds),
            deleteDeviceIds = _.difference(preSelectedIds, selectedIds),
            addDeviceArr = [],
            deletedIdsArr = [];

        addDeviceIds.forEach(function (id) {
          addDeviceArr.push({
            id: id
          });
        });
        deleteDeviceIds.forEach(function (id) {
          deletedIdsArr.push({
            id: id
          });
        });

        if(addDeviceArr.length > 0 || deletedIdsArr.length > 0) {
          self.progressBar =  new SmProgressBar({
            "container": self.getOverlayContainer(),
            "hasPercentRate": false,
            "isSpinner" : true
          });
          self.progressBar.build();
          properties["add-list"]= {"device": addDeviceArr};
          properties["delete-list"]={"device":deletedIdsArr};
          self.model.save(properties, {
            success: function (model, response, options) {
              console.log("Assign devices success");
              self.notify("success", self.context.getMessage("action_assign_device_success"));
              self.closeOverlay();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              console.log("Assign devices failed");
              self.notify("error", self.context.getMessage("action_assign_device_failed"));
              self.closeOverlay();
            }
          });
        } else {
          self.closeOverlay();
        }
      };

      var properties =  {};

      if(self.isDevicePolicy) {
        var value = self.deviceDropDown.getValue();
        var selectedItems = value? [value] : [];
        saveSelectedItems(selectedItems);
      } else {
        var listBuilder = self.listBuilder;
        listBuilder.listBuilderModel.getSelectedAllIds(function(response) {
          var ids = listBuilder.getAllIds(response);
          saveSelectedItems(ids);
        });
      }
    },

    closeOverlay: function (event) {
      if(this.progressBar) {
        this.progressBar.destroy();
      }
      if(this.listBuilder) {
        this.listBuilder.destroy();
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
    }
  });

  return AssignDevicesView;
});