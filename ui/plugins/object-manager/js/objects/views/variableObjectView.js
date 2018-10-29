/**
 * View to create a variable object with specific settings
 * 
 * @module VariableObjectView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/dropDown/dropDownWidget',
    '../../../../sd-common/js/devices/widgets/devicesListBuilder.js',
    '../models/deviceZoneModel.js',
    '../conf/variableObjectFormConfiguration.js',
    '../views/addressSelectionGridView.js'
], function (Backbone,
             Syphon,
             FormWidget,
             OverlayWidget,
             DropDownWidget,
             ListBuilder,
             DeviceZoneModel,
             VariableObjectFormConf,
             VariableAddressSelectionView) {
    // form mode
    var MODE_CREATE = 'create';
    var MODE_EDIT = 'edit';
    // variable type
    var ADDRESS_OBJECT = "address";
    var ZONE_OBJECT = "zone";
    // variable address type
    var POLYMORPHIC = 'POLYMORPHIC';

    var deviceZoneModel = new DeviceZoneModel();

    var VariableObjectView = Backbone.View.extend({
        events: {
            'click #variable-object-save': "submit",
            'click #variable-object-cancel': "cancel",
            'click #address-selection-variable': "selectAddress"
        },
        submit: function(event) {
            event.preventDefault();
            var self = this;

            // Check if form is valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            var saveSelectedItems = function(data) {
                // Workaround until the form widget can support listBuilder as well as its validation
                if($.isEmptyObject(data.devices.device)){
                    console.log('listbuilder has no selections');
                    self.form.showFormError(self.context.getMessage('variable_no_device_error'));
                    return;
                }
                var contextValues = [];
                var deviceId = [];
                var selectedDevices = [].concat(data.devices.device);
                for (var i=0; i<selectedDevices.length; i++) {
                    contextValues.push({
                        moid: selectedDevices[i].moid,
                        name: selectedDevices[i].name
                    });
                    deviceId.push(selectedDevices[i].moid);
                }
                // Check if device(s) have already been selected in grid
                var conflictedDevices = self.getConflictedDevices(contextValues);
                if (conflictedDevices.length > 0) {
                    console.log('Device(s) have been selected');
                    self.form.showFormError(self.context.getMessage('variable_conflict_device_error', [conflictedDevices.join()]));
                    return;
                }

                console.log('ready to save');
                self.saveVariable(contextValues, deviceId);
            };

            this.listBuilder.getSelectedItems(saveSelectedItems);
        },
        saveVariable: function(contextValues, deviceId) {
            this.model.set("context-value", contextValues);
            if (this.parentView.objectType === ZONE_OBJECT) {
                this.model.set("variable-zone", this.dropdown.getValue());
            } else {
                this.model.set("variable-address", {
                    id: this.$el.find("#address-selection-variable").attr("dataId"),
                    name: this.$el.find("#address-selection-variable").val()
                });
            }
            // Use for identifying items in grid
            this.model.set("device-id-string", deviceId.join());

            if (this.formMode == MODE_EDIT) {
                var index = this.parentView.variableGridData.indexOf(this.model);
                this.parentView.variableGridData.remove(this.model);
                this.parentView.variableGridData.add(this.model, {at: index});
                this.originalRow.id = this.originalRow.slipstreamGridWidgetRowId;
                this.parentView.gridWidget.editRow(this.originalRow, this.model.toJSON());
            } else {
                this.parentView.variableGridData.add(this.model);
                this.parentView.gridWidget.addRow(this.model.toJSON(), "last");
            }
            this.listBuilder.destroy();
            this.parentView.overlay.destroy();
        },
        cancel: function(event) {
            event.preventDefault();
            if (this.listBuilder)
                this.listBuilder.destroy();
            this.parentView.overlay.destroy();
        },
        close: function() {
            if (this.currentView && this.currentView.listBuilder) {
                this.currentView.listBuilder.destroy();
            }
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            var variableType;

            if (this.parentView.objectType === ZONE_OBJECT) {
                variableType = this.context.getMessage('variable_zone');
            } else {
                variableType = this.context.getMessage('variable_address');
            }

            if (this.formMode == MODE_EDIT) {
                dynamicProperties.title = this.context.getMessage('variable_object_form_edit', [variableType]);
            } else {
                dynamicProperties.title = this.context.getMessage('variable_object_form_create', [variableType]);
            }

            _.extend(formConfiguration, dynamicProperties);
        },
        getConflictedDevices: function(selectedDevices) {
            var conflictedDevices = [];
            var selectedDevicesByOthers = [];

            if (this.parentView.variableGridData.toJSON().length > 0) {
                var gridItems = this.parentView.variableGridData.toJSON();

                for (var i=0; i<gridItems.length; i++) {
                    if (this.formMode == MODE_EDIT) {
                        if (gridItems[i]["device-id-string"] === this.model.get("device-id-string")) {
                            continue;
                        }
                    }
                    selectedDevicesByOthers = selectedDevicesByOthers.concat(gridItems[i]["context-value"]);
                }

                for (var j=0; j<selectedDevices.length; j++) {
                    for (var k=0; k<selectedDevicesByOthers.length; k++) {
                        if (selectedDevices[j].moid === selectedDevicesByOthers[k].moid) {
                            conflictedDevices.push(selectedDevices[j].name);
                        }
                    }
                }
            }

            return conflictedDevices;
        },
        selectAddress: function(e) {
            // View for setting specific values
            var variableAddressSelectionView = new VariableAddressSelectionView({parentView: this, excludeTypes: [POLYMORPHIC], containerId: e.currentTarget.id});
            this.overlay = new OverlayWidget({
                view: variableAddressSelectionView,
                type: 'large',
                showScrollbar: true,
                xIconEl: false
            });
            this.overlay.build();

            return this;
        },
        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.formMode = options.formMode;

            if (this.formMode == MODE_EDIT) {
                var deviceId = this.parentView.gridWidget.getSelectedRows()[0]["device-id-string"];
                this.model = this.parentView.variableGridData.findWhere({"device-id-string": deviceId});
                this.originalRow = options.originalRow;
            } else {
                this.model = new Backbone.Model();
            }
        },
        refreshDropdown: function(zones) {
            this.$el.find("#zone-selection").empty();
            this.dropdown.setValue("");
            this.$el.find("#zone-selection").append($("<option>").val("").text(""));
            if (zones && zones.length > 0) {
                for (var i=0; i<zones.length; i++) {
                    var option = $("<option>").val(zones[i].name).text(zones[i].name);
                    this.$el.find("#zone-selection").append(option);
                }
            }
        },
        refreshZoneSelection: function(devices, callback) {
            var self = this;

            if (devices && devices.length > 0) {
                var deviceIdList = [];
                for (var i=0; i<devices.length; i++) {
                    var deviceId = devices[i].moid;
                    deviceId = deviceId.substring(deviceId.indexOf(":") + 1);
                    deviceIdList.push(deviceId);
                }
                deviceZoneModel.clear();
                deviceZoneModel.set({
                    "device-id-list": {
                        "ids": deviceIdList
                    }
                });

                deviceZoneModel.save(null, {
                    success: function(model, response) {
                        response = response["zones"].zone;
                        self.refreshDropdown(response);
                        if (callback) {
                            callback();
                        }
                    },
                    error: function(model, response) {
                        console.log("error");
                    }
                });
            } else {
                self.dropdown.setValue("");
                self.$el.find("#zone-selection").empty();
            }
        },
        /**
         * Get device Id from device MOID (net.juniper.jnap.sm.om.jpa.SecurityDeviceEntity:131090)
         */
        getDeviceId : function(value) {
            var index = value.indexOf(":") + 1;
            return value.substring(index, value.length);
        },
        addListBuilder: function(id) {
            var self = this;
            var listContainer = this.$el.find('#' + id);
            listContainer.attr("readonly", "");

            var selectedItems = [];
            if (self.formMode == MODE_EDIT) {
                selectedItems = this.model.get("context-value").map(function(item) {
                    return self.getDeviceId(item.moid);
                });
            }

            self.listBuilder = new ListBuilder({
                context: self.context,
                container: listContainer,
                selectedItems: selectedItems,
                onChange: function() {
                  if (self.parentView.objectType === ZONE_OBJECT) {
                      self.listBuilder.getSelectedItems(function(data) {
                          var devices = data.devices.device || [];
                          devices = [].concat(devices);
                          self.refreshZoneSelection(devices);
                      });
                  }
                }
            });

            self.listBuilder.build(function() {
                listContainer.find('.new-list-builder-widget').unwrap();
            });
        },
        initZoneValue: function() {
            this.dropdown.setValue(this.model.get("variable-zone"));
        },
        initDropdown: function() {
            var self = this;
            var selectedDevices = [];
            // initialize dropdown
            selectedDevices = this.model.get("context-value").map(function(item) {
                return {moid: item.moid};
            });

            this.refreshZoneSelection(selectedDevices, $.proxy(this.initZoneValue, this));
        },
        addDropdown: function(id) {
            this.dropdown = new DropDownWidget({
                "container": this.$el.find("#"+id),
                "enableSearch": true,
                "placeholder": this.context.getMessage('variable_zone_dropdown_placeholder')
            }).build();

            // Workaroud: Hide the previous dropdown in the form widget and adjust the width
            this.$el.find("#"+id).hide();
            this.$el.find(".dropdown-widget").find(".select2").addClass("elementinput").removeAttr("style");
        },
        render: function() {
            var self = this;

            var formConfiguration = new VariableObjectFormConf(this.context);

            var formElements = formConfiguration.getValues(this.parentView.objectType);

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();

            this.$el.addClass(this.context['ctx_name']);

            // Use overlay to show address selection instead of direct input
            this.$el.find("#address-selection-variable").attr("readonly", "");
            // Workaround until ListBuilder is integrated with form widget
            this.addListBuilder('device-selection');

            // Initialize input fields according to different object type
            if (this.parentView.objectType === ZONE_OBJECT) {
                this.addDropdown('zone-selection');
                if (self.formMode == MODE_EDIT) {
                    this.initDropdown();
                }
                this.$el.find("#variable-address-selection").remove();
            } else {
                this.$el.find("#variable-zone-selection").remove();
                if (this.model.get("variable-address")) // for edit
                    this.$el.find("#address-selection-variable").attr("dataId", this.model.get("variable-address").id);
            }

            return this;
        }

    });
    return VariableObjectView;
});
