/**
 * The variable view to create a specific variable
 * 
 * @module VariableView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/overlay/overlayWidget',
    'widgets/dropDown/dropDownWidget',
    '../conf/variableFormConfiguration.js',
    '../conf/variableFormAddressGridConfiguration.js',
    '../conf/variableFormZoneGridConfiguration.js',
    '../models/variableCollection.js',
    '../models/addressCollection.js',
    '../views/variableObjectView.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../../../../ui-common/js/common/dropdownCommonConstants.js',
    '../../../../ui-common/js/common/utils/validationUtility.js'
], function (Backbone,
             Syphon,
             FormWidget,
             GridWidget,
             OverlayWidget,
             DropDownWidget,
             VariableForm,
             AddressGridConf,
             ZoneGridConf,
             Collection,
             AddressCollection,
             VariableObjectView,
             ResourceView,
             DropdownCommonConstants,
             ValidationUtility) {
    // form mode
    var MODE_CREATE = 'create';
    var MODE_EDIT = 'edit';
    var MODE_CLONE = 'clone';
    // variable type
    var ADDRESS_OBJECT = "address";
    var ZONE_OBJECT = "zone";
    // variable address type
    var POLYMORPHIC = 'POLYMORPHIC';

    var VariableView = ResourceView.extend({
        events: {
            'click #variable-save': "submit",
            'click #variable-cancel': "cancel",
            'click #variable-type-address': "showObjectType",
            'click #variable-type-zone': "showObjectType",
            'click #variable-add-address': "addNewAddress"
        },
        submit: function(event) {
            event.preventDefault();
            // Check if form is valid
            if (! this.form.isValidInput() || !this.isTextareaValid()) {
                console.log('form is invalid');
                return;
            }

            // Workaround until the form widget supports the grid widget as well as its validation
            var variableType = ADDRESS_OBJECT;
            if (this.gridWidget.getAllVisibleRows().length === 0) {
                if (this.$el.find("#variable-type-zone").is(':checked')) {
                    variableType = ZONE_OBJECT;
                }
                this.form.showFormError(this.context.getMessage("variable_create_grid_empty_error", [variableType]));
                return;
            }

            var properties = Syphon.serialize(this);
            properties = this.beforeSave(properties);
            this.bindModelEvents();
            this.model.set(properties);
            this.model.save();
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);

            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('variable_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('variable_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('variable_clone');
                    break;
            }

            _.extend(formConfiguration, dynamicProperties);
        },
        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            _.extend(this, ValidationUtility);

            this.collection = new Collection();
            this.successMessageKey = 'variable_create_success';
            this.editMessageKey = 'variable_edit_success';
            this.fetchErrorKey = 'variable_fetch_error';
            this.fetchCloneErrorKey = 'variable_fetch_clone_error';

            // initialize object type
            this.objectType = ADDRESS_OBJECT;

            // Store protocol values
            this.variableAddressData = new Backbone.Collection();
            this.variableZoneData = new Backbone.Collection();
            this.variableGridData = this.variableAddressData ;
        },
        render: function() {
            var self = this;
            var formConfiguration = new VariableForm(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.form.build();

            this.addSubsidiaryFunctions(formElements);

            this.$el.addClass(this.context['ctx_name']);

            // Use overlay to show address selection instead of direct input
            this.$el.find("#variable-default-address").attr("readonly", "");
            // Workaround until GridWidget is integrated with form widget
            this.addressGridWidget = this.addGridWidget('variable-address-grid', new AddressGridConf(this.context));

            this.zoneGridWidget = this.addGridWidget('variable-zone-grid', new ZoneGridConf(this.context));

            this.addDropdown('variable-default-address');

            this.modifyForm();
            this.showObjectType();

            return this;
        },
        addDropdown: function(id) {
            var gridContainer = this.$el.find('#' + id),
                addressCollection = new AddressCollection();

            this.dropdown = new DropDownWidget({
                "container": gridContainer,
                "enableSearch": true,
                "remoteData": {
                    headers: {
                        'accept': addressCollection.requestHeaders.accept
                    },
                    "url": addressCollection.url({
                        property: 'addressType',
                        modifier: 'ne',
                        value: POLYMORPHIC}),
                    "numberOfRows": DropdownCommonConstants.ADDRESS_PAGE_SIZE,
                    "jsonRoot": addressCollection.jsonRoot,
                    "jsonRecords": function(data) {
                        return data.addresses.total;
                    },
                    "success": function(data){console.log("call succeeded");},
                    "error": function(){console.log("error while fetching data");}
                },
                "templateResult": this.formatRemoteResult,
                "templateSelection": this.formatRemoteResultSelection
            }).build();
            this.$el.find("#"+id).hide();
            this.$el.find(".dropdown-widget").find(".select2").addClass("elementinput").removeAttr("style");
        },
        formatRemoteResult: function (data) {
            var markup = data.name;
            return markup;
        },

        formatRemoteResultSelection: function (data) {
            return data.name;
        },
        addNewAddress: function() {
            var self = this;
            // Access address view
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                "mime_type": "vnd.juniper.net.addresses"
            });

            this.context.startActivityForResult(intent, function(resultCode, data) {
                if (resultCode == Slipstream.SDK.BaseActivity.RESULT_OK)
                    self.dropdown.setValue({id: data.id, text: data.name});
            });
        },
        addGridWidget: function(id, gridConf, tableId) {
            var gridContainer = this.$el.find('#' + id);
            this.$el.find('#' + id).after("<div id='"+id+"'></div>");
            gridContainer.remove();
            gridContainer = this.$el.find('#' + id);

            var elements = gridConf.getValues();
            if (tableId) {
                elements.tableId = tableId;
            }

            var option = {
                container: gridContainer,
                elements: elements
            };
            if (gridConf.getEvents) {
                option.actionEvents = gridConf.getEvents();
            }

            var gridWidget = new GridWidget(option);
            gridWidget.build();

            this.$el.find(".grid-widget").addClass("elementinput-long");
            if (gridConf.getEvents) {
                this.bindGridEvents(gridConf.getEvents());
            }

            return gridWidget;
        },
        showObjectType: function() {
            if (this.$el.find("#variable-type-address").is(':checked')) {
                this.$el.find("#variable-address-form").show();
                this.$el.find("#variable-zone-form").hide();

                this.gridContainer = this.addressGridContainer;
                this.objectType = ADDRESS_OBJECT;
                this.gridWidget = this.addressGridWidget;
                this.variableGridData = this.variableAddressData;

                this.resetRequiredField(this.$el.find("#variable-default-address"), true);
                this.resetRequiredField(this.$el.find("#variable-default-zone"), false);
            } else if (this.$el.find("#variable-type-zone").is(':checked')) {
                this.$el.find("#variable-address-form").hide();
                this.$el.find("#variable-zone-form").show();

                this.gridContainer = this.zoneGridContainer;
                this.objectType = ZONE_OBJECT;
                this.gridWidget = this.zoneGridWidget;
                this.variableGridData = this.variableZoneData;

                this.resetRequiredField(this.$el.find("#variable-default-address"), false);
                this.resetRequiredField(this.$el.find("#variable-default-zone"), true);
            }
        },
        bindGridEvents: function(definedEvents) {
            // create button for context-value
            if (definedEvents.createEvent) {
                this.$el.bind(definedEvents.createEvent, $.proxy(this.createAction, this));
            }
            // edit button for context-value
            if (definedEvents.updateEvent) {
                this.$el.bind(definedEvents.updateEvent, $.proxy(this.updateAction, this));
            }
            // delete button for context-value
            if (definedEvents.deleteEvent) {
                this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteAction, this));
            }
        },
        createAction: function() {
            var variableObjectView = new VariableObjectView({parentView: this, formMode: MODE_CREATE});
            this.overlay = new OverlayWidget({
                view: variableObjectView,
                type: 'large',
                showScrollbar: true,
                xIconEl: false
            });
            this.overlay.build();

            return this;
        },
        updateAction: function(e, row) {
            var variableObjectView = new VariableObjectView({
                parentView: this,
                formMode: MODE_EDIT,
                originalRow: row.originalRow
            });

            this.overlay = new OverlayWidget({
                view: variableObjectView,
                type: 'large',
                showScrollbar: true,
                xIconEl: false
            });
            this.overlay.build();

            return this;
        },
        deleteAction: function(e, row) {
            // Remove selected items
            for (var i=0; i<row.deletedRows.length; i++) {
                var deviceId = row.deletedRows[i]["device-id-string"];
                this.variableGridData.remove(this.variableGridData.findWhere({"device-id-string": deviceId}));
            }

            return this;
        },
        resetRequiredField: function(requiredFields, isRequried) {
            requiredFields.each(
                function(){
                    $(this).attr("required", isRequried);
                }
            );
        },
        beforeSave: function(properties) {
            var variableObject = {};
            variableObject.name = properties.name;
            variableObject.description = properties.description;
            variableObject.type = properties["variable-object-type"].toUpperCase();
            // Set variable value list
            var gridData = this.variableGridData.toJSON();
            var variableValueList = [];
            for (var i=0; i<gridData.length; i++) {
                for (var j=0; j<gridData[i]["context-value"].length; j++) {
                    var variableValue = {};

                    variableValue.device = gridData[i]["context-value"][j];

                    if (this.objectType == ADDRESS_OBJECT) {
                        variableValue["variable-value-detail"] = {
                            "variable-value": gridData[i]["variable-address"].id,
                            "name": gridData[i]["variable-address"].name
                        };
                    } else if (this.objectType == ZONE_OBJECT) {
                        variableValue["variable-value-detail"] = {
                            "variable-value": gridData[i]["variable-zone"],
                            "name": gridData[i]["variable-zone"]
                        };
                    }

                    variableValueList.push(variableValue);
                }

            }
            variableObject["variable-values-list"] = {
                "variable-values": variableValueList
            };
            // Set variable default value
            if (this.objectType == ADDRESS_OBJECT) {
                variableObject["default-value-detail"] = {
                    "default-value": this.dropdown.getValue()
                };
            } else if (this.objectType == ZONE_OBJECT) {
                variableObject["default-value-detail"] = {
                    "default-value": properties["variable-default-zone"]
                };
            }

            return variableObject;
        },

        /**
         * Update components' value and status when edit or clone variables
         */
        modifyForm: function() {
            var variableType;
            if (this.model.get("type")) {
                variableType = this.model.get("type").toLowerCase();
                if (variableType === ADDRESS_OBJECT) {
                    this.$el.find("input[id=variable-type-address]").attr("checked", true);
                    var dataId = this.getAddressId(this.model.get("default-value-detail")["default-value"]);
                    this.dropdown.setValue({id: dataId, text: this.model.get("default-name")});
                } else if (variableType === ZONE_OBJECT) {
                    this.$el.find("input[id=variable-type-zone]").attr("checked", true);
                    this.$el.find("#variable-default-zone").val(this.model.get("default-name"));
                }
                this.$el.find("input[id=variable-type-zone]").parent().hide();
                this.$el.find("input[id=variable-type-address]").parent().hide();
                this.$el.find("input[id=variable-type-zone]").parent().parent().append(variableType.toUpperCase());
            }

            if (this.model.get("variable-values-list")) {
                this.loadGridData(this.model.get("variable-values-list"), variableType);
            }
        },

        /**
         * Build and load grid data
         * @param {Object} data
         * data : {
         *    "variable-values": []
         * }
         * or
         * data : {
         *    "variable-values": {}
         * }
         * variable-values could be an Array or Object.
         * If the elements of Array have same variable-value-detail to other's, merge them into one model (device and deviceId)
         * if the elements have different variable-value-detail, create differnent model for them
         * 
         * @param {String} variableType - ADDRESS_OBJECT or ZONE_OBJECT
         */
        loadGridData: function(data, variableType) {
            var variableValues = data["variable-values"];
            var deviceArray = [], valueObj = {};
            if ($.isArray(variableValues)) {
                var valueArray = [],
                    modelsArray = [];

                variableValues.forEach(function(item){
                    var gridModel = new Backbone.Model();
                    gridModel.set("context-value", [item.device]);
                    gridModel.set("variable-value", item["variable-value-detail"]);
                    valueArray.push(item["variable-value-detail"]["variable-value"]);
                    modelsArray.push(gridModel);
                });

                for (var i = modelsArray.length -1; i > 0; i--) {
                    var index = valueArray.indexOf(valueArray[i]);
                    if (index < i) { // have other variables with same address/zone value, merge them
                        modelsArray[index].get("context-value").push(modelsArray[i].get("context-value")[0]);
                        modelsArray.splice(i, 1);
                    }
                }
                if (variableType === ADDRESS_OBJECT) {
                    this.gridWidget = this.addressGridWidget;
                    for (var i = 0, len = modelsArray.length; i < len; i ++) {
                        var gridModel = modelsArray[i];
                        gridModel.set("device-id-string", this.getDeviceIds(gridModel.get("context-value")));
                        var valueObj = gridModel.get("variable-value");
                        valueObj.id = this.getAddressId(valueObj["variable-value"]);
                        gridModel.set("variable-address", valueObj);
                        this.gridWidget.addRow(gridModel.toJSON(), "last");
                        this.variableAddressData.add(gridModel);
                    }
                    this.variableGridData = this.variableAddressData;
                } else if (variableType === ZONE_OBJECT) {
                    this.gridWidget = this.zoneGridWidget;
                    for (var i = 0, len = modelsArray.length; i < len; i ++) {
                        var gridModel = modelsArray[i];
                        gridModel.set("device-id-string", this.getDeviceIds(gridModel.get("context-value")));
                        var valueObj = gridModel.get("variable-value");
                        gridModel.set("variable-zone", valueObj.name);
                        this.gridWidget.addRow(gridModel.toJSON(), "last");
                        this.variableZoneData.add(gridModel);
                    }
                    this.variableGridData = this.variableZoneData;
                }
            } else if (!_.isEmpty(variableValues)) {
                var gridModel = new Backbone.Model();
                var variableDetail = variableValues["variable-value-detail"];

                gridModel.set("context-value", [variableValues.device]);
                gridModel.set("id", variableValues.id);
                gridModel.set("device-id-string", variableValues.device.name);
                if (variableType === ADDRESS_OBJECT) {
                    var valueObj = {};
                    valueObj.id = this.getAddressId(variableDetail["variable-value"]);
                    valueObj.name = variableDetail["name"];
                    gridModel.set("variable-address", valueObj);
                    this.variableAddressData.add(gridModel);
                    this.gridWidget = this.addressGridWidget;
                    this.variableGridData = this.variableAddressData;
                } else if (variableType === ZONE_OBJECT) {
                    gridModel.set("variable-zone", variableDetail["name"]);
                    this.variableZoneData.add(gridModel);
                    this.gridWidget = this.zoneGridWidget;
                    this.variableGridData = this.variableZoneData;
                }
                this.gridWidget.addRow(gridModel.toJSON(), "last");
            }
        },

        /**
         * Get address Id from address MOID (net.juniper.jnap.sm.om.AddressMO:26)
         */
        getAddressId : function(value) {
            var index = value.indexOf(":") + 1;
            return value.substring(index, value.length);
        },

        /**
         * Concat several device names into string
         */
        getDeviceIds: function(deviceArray) {
            var idArray = [];
            deviceArray.forEach(function(item) {
                idArray.push(item.moid);
            });
            return idArray.join();
        }
    });

    return VariableView;
});
