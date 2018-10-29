/**
 * View to create a Protocol
 * 
 * @module ServiceProtocolView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/serviceFormProtocolFormConfiguration.js',
    '../conf/protocolTypes.js',
    '../../../../ui-common/js/common/utils/validationUtility.js'
], function (Backbone, Syphon, FormWidget, ProtocolForm, protocolTypes, ValidationUtility) {
    // protocol type
    var PROTOCOL_TCP = "PROTOCOL_TCP";
    var PROTOCOL_UDP = "PROTOCOL_UDP";
    var PROTOCOL_ICMP = "PROTOCOL_ICMP";
    var PROTOCOL_SUN_RPC = "PROTOCOL_SUN_RPC";
    var PROTOCOL_MS_RPC = "PROTOCOL_MS_RPC";
    var PROTOCOL_ICMPV6 = "PROTOCOL_ICMPV6";
    var PROTOCOL_OTHER = "PROTOCOL_OTHER";
    // predefined protocol number
    var PROTOCOL_NUMBER_TCP = 6;
    var PROTOCOL_NUMBER_UDP = 17;
    var PROTOCOL_NUMBER_ICMP = 1;
    var PROTOCOL_NUMBER_ICMPV6 = 58;
    // protocol form mode
    var MODE_CREATE = 'create';
    var MODE_EDIT = 'edit';
    // inactivity timeout type
    var TIMEOUT_TYPE_MINUTE = "Minutes";
    var TIMEOUT_TYPE_SECOND = "Seconds";
    // the maximum of inactivity timeout
    var TIMEOUT_MAX_SECOND = 129600;
    var TIMEOUT_MAX_MINUTE = 2160;
    // protocol type for SUN-RPC and MS-RPC
    var RPC_PROTOCOL_TCP = "TCP";
    var RPC_PROTOCOL_UDP = "UDP";
    // alg values of SUN-RPC and MS-RPC
    var ALG_SUN_RPC = "sun-rpc";
    var ALG_MS_RPC = "ms-rpc";
    // the limit of source port
    var PORT_MIN = 0;
    var PORT_MAX = 65535;

    var ProtocolView = Backbone.View.extend({
        events: {
            'click #application-protocol-save': "submit",
            'click #application-protocol-cancel': "cancel",
            'click #check-inactivity-timeout': 'showTimeoutInput',
            'click #check-rpc-alg': 'showDestinationPortInput',
            'change #application-protocol-type': 'showAdvancedInput',
            'change #inactivity-time-type': 'convertInactivityTimeout'
        },
        submit: function(event) {
            event.preventDefault();
            // Ignore required fields that are hidden
            // Work around until form can support to ignore specific input fields
            var hiddenRequiredFields = this.$el.find("#application-protocol-create-form").find("div[style='display: none;'][class*='row']").find("input[required]");
            this.resetRequiredField(hiddenRequiredFields, false);

            // Check is form valid
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                // Reset required fields so that they can be checked again when protocol type is changed
                this.resetRequiredField(hiddenRequiredFields, true);

                return;
            }

            // Work around until form.isValidInput() can support to check fields that don't have the "required" property
            if (this.checkFieldStatus()) {
                console.log('form is invalid');
                // Reset required fields so that they can be checked again when protocol type is changed
                this.resetRequiredField(hiddenRequiredFields, true);

                return;
            }
            // Edit input data
            this.processRawData();

            console.log('ready to save');

            var properties = Syphon.serialize(this);

            this.beforeSave(properties);

            if (this.formMode == MODE_EDIT) {
                var index = this.parentView.protocolData.indexOf(this.model);
                this.parentView.protocolData.remove(this.model);
                this.parentView.protocolData.add(properties, {at: index});
                // update the column of detail in grid
                properties.detail = "update";
                this.model.id = this.rowId;
                this.parentView.gridWidget.editRow(this.model, properties);
            } else {
                this.parentView.protocolData.add(properties);
                this.parentView.gridWidget.addRow(properties);
            }
            this.parentView.overlay.destroy();
        },
        checkFieldStatus: function() {
            // Work around: Check those fields that are not required
            var dst_port = this.$el.find("#application-protocol-destination-port");
            var inactivity_timeout = this.$el.find("#inactivity-timeout");
            var src_port = this.$el.find("#application-protocol-source-port");

            if (dst_port.is(":visible") && dst_port.parent().hasClass("error")) {
                return true;
            }
            if (inactivity_timeout.is(":visible") && inactivity_timeout.parent().hasClass("error")) {
                return true;
            }
            if (src_port.is(":visible") && src_port.parent().hasClass("error")) {
                return true;
            }

            return false;
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};

            if (this.formMode == MODE_EDIT) {
                dynamicProperties.title = this.context.getMessage('application_protocol_form_edit');
            } else {
                dynamicProperties.title = this.context.getMessage('application_protocol_form_create');
            }

            _.extend(formConfiguration, dynamicProperties);
        },
        cancel: function(event) {
            event.preventDefault();
            this.parentView.overlay.destroy();
        },
        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.formMode = options.formMode;

            _.extend(this, ValidationUtility);

            if (this.formMode == MODE_EDIT) {
                var name = this.parentView.gridWidget.getSelectedRows()[0].name;
                this.model = this.parentView.protocolData.findWhere({"name": name});
                this.rowId = options.id;
            } else {
                this.model = new Backbone.Model();
            }

            this.model.set('enable-timeout', !this.model.get('disable-timeout'));
        },
        render: function() {
            var self = this;

            var formConfiguration = new ProtocolForm(this.context);

            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();

            this.addSubsidiaryFunctions(formElements);

            this.$el.addClass(this.context['ctx_name']);

            this.afterBuild();

            return this;
        },
        afterBuild: function() {
            this.$el.find(".elementlabel").addClass("label-long");
            this.initComponent();
            this.bindValidation();
        },
        initComponent: function() {
            // set the protocol type dropdown
            this.$el.find("#application-protocol-type").val(this.model.get("protocol-type") || PROTOCOL_TCP);

            // set the alg dropdown
            this.$el.find("#application-protocol-alg").val(this.model.get("alg"));

            // set the inactivity timeout checkbox
            if (this.model.get("disable-timeout") === false) {
                this.$el.find("#check-inactivity-timeout").attr("checked", true);
            } else {
                this.$el.find("#check-inactivity-timeout").attr("checked", false);
            }

            // set the enable alg checkbox
            if (this.model.get("alg") == ALG_SUN_RPC || this.model.get("alg") == ALG_MS_RPC) {
                this.$el.find("#check-rpc-alg").attr("checked", true);
            } else {
                this.$el.find("#check-rpc-alg").attr("checked", false);
            }

            // set the protcol type radio for SUN-RPC and MS-RPC
            if (this.model.get("sunrpc-protocol-type") === RPC_PROTOCOL_UDP) {
                this.$el.find("#sunrpc-protocol-udp").attr("checked", true);
                this.$el.find("#sunrpc-protocol-tcp").removeAttr("checked");
            } else {
                this.$el.find("#sunrpc-protocol-tcp").attr("checked", true);
                this.$el.find("#sunrpc-protocol-udp").removeAttr("checked");
            }
            if (this.model.get("msrpc-protocol-type") === RPC_PROTOCOL_UDP) {
                this.$el.find("#msrpc-protocol-udp").attr("checked", true);
                this.$el.find("#msrpc-protocol-tcp").removeAttr("checked");
            } else {
                this.$el.find("#msrpc-protocol-tcp").attr("checked", true);
                this.$el.find("#msrpc-protocol-udp").removeAttr("checked");
            }

            this.showTimeoutInput();
            this.showAdvancedInput();
        },
        bindValidation: function() {
            // bind custom validation for protocol name and inactivity timeout inputs
            // Work around it until the framework adds direct support for supplying a validation callback function
            this.$el.find('#application-protocol-name').bind('validateProtocolName', $.proxy(this.validateProtocolName, this));
            this.$el.find('#inactivity-timeout').bind('validateProtocolInactivityTimeout', $.proxy(this.validateProtocolInactivityTimeout, this));
            this.$el.find('#application-protocol-source-port').bind('validatePortRange', $.proxy(this.validatePortRange, this, "application-protocol-source-port"));
            this.$el.find('#application-protocol-destination-port').bind('validatePortRange', $.proxy(this.validatePortRange, this, "application-protocol-destination-port"));
        },
        validateProtocolName: function() {
            // Work around it until the framework adds direct support for supplying a validation callback function
            this.$el.find('#application-protocol-name').attr("data-validation", "multiple");
            this.$el.find('#application-protocol-name').attr("data-validation_pattern", this.context.getMessage('application_protocol_form_name_error'));
            this.$el.find('#application-protocol-name').attr("data-validation_validtext", this.context.getMessage('name_require_error'));

            var name = this.$el.find('#application-protocol-name').val();
            var duplicateError = this.context.getMessage('application_protocol_form_name_duplicate_error');
            // Check if the protocol name is duplicate
            if (this.formMode == MODE_EDIT) {
                if (this.model.get("name") !== name && this.parentView.protocolData.findWhere({"name": name})) {
                    this.showErrorMessage('application-protocol-name', duplicateError);
                }
            } else {
                if (this.parentView.protocolData.findWhere({"name": name})) {
                    this.showErrorMessage('application-protocol-name', duplicateError);
                }
            }
        },
        validateProtocolInactivityTimeout: function() {
            // Work around it until the framework adds direct support for supplying a validation callback function
            this.$el.find('label[for=inactivity-timeout]').parent().removeClass('error');
            this.$el.find('#inactivity-timeout').parent().removeClass('error');
            var secondError = this.context.getMessage('maximum_value_error', [TIMEOUT_MAX_SECOND]);
            var minuteError = this.context.getMessage('maximum_value_error', [TIMEOUT_MAX_MINUTE]);

            this.$el.find('#inactivity-timeout').attr("data-validation", "validtext");
            // Change the validation pattern according to different selected type
            var inactivityTimeoutType = this.$el.find("#inactivity-time-type").children('option:selected').val();
            var timeout = this.$el.find('#inactivity-timeout').val();
            var isNumber = /^\d+(\.\d+)?$/;
            if (inactivityTimeoutType == TIMEOUT_TYPE_MINUTE) {
                if ((timeout && !isNumber.test(timeout)) || parseInt(timeout, 10) > TIMEOUT_MAX_MINUTE) {
                    this.showErrorMessage('inactivity-timeout', minuteError);
                    this.$el.find('#inactivity-timeout').parent().find("small[class*='error']").addClass('elementinput');
                }
            } else {
                if ((timeout && !isNumber.test(timeout)) || parseInt(timeout, 10) > TIMEOUT_MAX_SECOND) {
                    this.showErrorMessage('inactivity-timeout', secondError);
                    this.$el.find('#inactivity-timeout').parent().find("small[class*='error']").addClass('elementinput');
                }
            }
        },
        isValidPortRange: function(v) {
            if(!v) {
                return true;
            }

            if (v.indexOf("-") > 0) {
                var port = v.split("-");

                if(port.length !== 2) {
                    return false;
                }

                if (!port[0] || !port[1]) {
                    return false;
                }

                var portFrom = parseInt(port[0], 10);
                var portTo = parseInt(port[1], 10);
                if(portFrom >= portTo) {
                  return false;
                }

                if((portFrom >= PORT_MIN && portFrom <= PORT_MAX) && (portTo >= PORT_MIN && portTo <= PORT_MAX)) {
                  return true;
                }

            } else {
                if(parseInt(v, 10) >= PORT_MIN && parseInt(v, 10) <= PORT_MAX) {
                  return true;
                }
            }

            return false;
        },
        validatePortRange: function(id) {
            // Work around it until the framework adds direct support for supplying a validation callback function
            // So that we don't need to show error manually
            var comp = this.$el.find('#'+id);
            var portError = this.context.getMessage('application_protocol_form_port_error');

            if (comp.attr("data-invalid") === undefined) {
                if (!this.isValidPortRange(comp.val())) {
                    this.showErrorMessage(id, portError);
                }
            } else {
                this.showErrorMessage(id, portError);
            }
        },
        showErrorMessage: function(id, message) {
            this.$el.find('#'+id).attr("data-invalid", "").parent().addClass('error');
            this.$el.find('label[for='+id+']').parent().addClass('error');
            this.$el.find('#'+id).parent().find("small[class*='error']").html(message);
        },
        convertInactivityTimeout: function() {
            var inactivityTimeoutType = $("#inactivity-time-type").children('option:selected').val();
            var timeout = $('#inactivity-timeout').val();
            if (inactivityTimeoutType == TIMEOUT_TYPE_MINUTE) {
                $('#inactivity-timeout').val(Math.round(timeout / 60));
            } else {
                $('#inactivity-timeout').val(timeout * 60);
            }
            this.validateProtocolInactivityTimeout();
        },
        showTimeoutInput: function() {
            if(this.$el.find("#check-inactivity-timeout").is(':checked')) {
                this.$el.find(".inactivity-timeout-settings").show();
              // Put the two items in one row
              // Will be updated until Formwidget can support the case directly
              this.$el.find("#inactivity-timeout").parent().removeClass("elementinput");
              this.$el.find("#inactivity-timeout").parent().addClass("elementinput-in-one-row");
              this.$el.find("#inactivity-time-type").parent().removeClass("elementinput");
              this.$el.find("#inactivity-time-type").parent().addClass("elementinput-in-one-row unit-element-without-lable");
            } else {
              this.$el.find(".inactivity-timeout-settings").hide();
            }
        },
        showDestinationPortInput: function() {
            if(this.$el.find("#check-rpc-alg").is(':checked')) {
                this.$el.find(".destination-port-settings").show();
                this.resetRequiredField(this.$el.find("#application-protocol-destination-port"), true);
            } else {
                this.$el.find(".destination-port-settings").hide();
                this.resetRequiredField(this.$el.find("#application-protocol-destination-port"), false);
            }
        },
        showAdvancedInput: function() {
            var selectedType = this.$el.find("#application-protocol-type").children('option:selected').val();
            switch(selectedType) {
                case PROTOCOL_TCP:
                case PROTOCOL_UDP:
                    // set section title
                    this.$el.find("#advanced-settings").find("h5").html(this.context.getMessage('application_protocol_form_advanced_settings'));
                    // show or hide Disable Inactivity Timeout and Inactivity Timeout
                    this.showTimeoutInput();
                    // show ALG, Source Port and Destination Port
                    // hide ICMP Type, ICMP Code, Enable ALG, RPC Number, UUID, Protocol Type, Protocol Number
                    this.$el.find(".icmp-protocol-settings").hide();
                    this.$el.find(".sun-rpc-protocol-settings").hide();
                    this.$el.find(".ms-rpc-protocol-settings").hide();
                    this.$el.find(".other-protocol-settings").hide();
                    this.$el.find(".tcp-protocol-settings").show();
                    break;

                case PROTOCOL_ICMP:
                case PROTOCOL_ICMPV6:
                    // set section title
                    this.$el.find("#advanced-settings").find("h5").html(this.findProtcol(selectedType));
                    // show or hide Disable Inactivity Timeout and Inactivity Timeout
                    this.showTimeoutInput();
                    // show ICMP Type, ICMP Code
                    // hide ALG, Source Port, Enable ALG, RPC Number, UUID, Protocol Type, Protocol Number and Destination Port
                    this.$el.find(".tcp-protocol-settings").hide();
                    this.$el.find(".sun-rpc-protocol-settings").hide();
                    this.$el.find(".ms-rpc-protocol-settings").hide();
                    this.$el.find(".other-protocol-settings").hide();
                    this.$el.find(".icmp-protocol-settings").show();
                    break;

                case PROTOCOL_SUN_RPC:
                    // set section title
                    this.$el.find("#advanced-settings").find("h5").html(this.findProtcol(selectedType));
                    // show or hide Disable Inactivity Timeout and Inactivity Timeout
                    this.showTimeoutInput();
                    // show Enable ALG, RPC Number, Protocol Type
                    // hide ALG, Source Port, ICMP Type, ICMP Code, UUID, Protocol Number and Destination Port
                    this.$el.find(".tcp-protocol-settings").hide();
                    this.$el.find(".icmp-protocol-settings").hide();
                    this.$el.find(".ms-rpc-protocol-settings").hide();
                    this.$el.find(".other-protocol-settings").hide();
                    this.$el.find(".sun-rpc-protocol-settings").show();
                    this.showDestinationPortInput();
                    break;

                case PROTOCOL_MS_RPC:
                    // set section title
                    this.$el.find("#advanced-settings").find("h5").html(this.findProtcol(selectedType));
                    // show or hide Disable Inactivity Timeout and Inactivity Timeout
                    this.showTimeoutInput();
                    // show Enable ALG, UUID, Protocol Type
                    // hide ALG, Source Port, ICMP Type, ICMP Code, RPC Number, Protocol Number and Destination Port
                    this.$el.find(".tcp-protocol-settings").hide();
                    this.$el.find(".icmp-protocol-settings").hide();
                    this.$el.find(".sun-rpc-protocol-settings").hide();
                    this.$el.find(".other-protocol-settings").hide();
                    this.$el.find(".ms-rpc-protocol-settings").show();
                    this.showDestinationPortInput();
                    break;

                case PROTOCOL_OTHER:
                    // set section title
                    this.$el.find("#advanced-settings").find("h5").html(this.context.getMessage('application_protocol_form_advanced_settings'));
                    // show or hide Disable Inactivity Timeout and Inactivity Timeout
                    this.showTimeoutInput();
                    // show ALG, Source Port, Protocol Number and Destination Port
                    // hide Enable ALG, ICMP Type, ICMP Code, RPC Number, UUID, Protocol Number
                    this.$el.find(".tcp-protocol-settings").hide();
                    this.$el.find(".icmp-protocol-settings").hide();
                    this.$el.find(".sun-rpc-protocol-settings").hide();
                    this.$el.find(".ms-rpc-protocol-settings").hide();
                    this.$el.find(".other-protocol-settings").show();
                    break;

                default:
                    // As default, show TCP/UDP advanced input fields
                    // set section title
                    this.$el.find("#advanced-settings").find("h5").html(this.context.getMessage('application_protocol_form_advanced_settings'));
                    // show or hide Disable Inactivity Timeout and Inactivity Timeout
                    this.showTimeoutInput();
                    // show ALG, Source Port and Destination Port
                    // hide ICMP Type, ICMP Code, Enable ALG, RPC Number, UUID, Protocol Type, Protocol Number
                    this.$el.find(".icmp-protocol-settings").hide();
                    this.$el.find(".sun-rpc-protocol-settings").hide();
                    this.$el.find(".ms-rpc-protocol-settings").hide();
                    this.$el.find(".other-protocol-settings").hide();
                    this.$el.find(".tcp-protocol-settings").show();
            }
        },
        findProtcol: function(type) {
            for (var i = 0; i < protocolTypes.length; i++) {
                if (protocolTypes[i].id ==  type) {
                    return protocolTypes[i].text;
                }
            }

            return type;
        },
        resetRequiredField: function(requiredFields, isRequried) {
            requiredFields.each(
                function(){
                    $(this).attr("required", isRequried);
                }
            );
        },
        processRawData: function() {
            // Remove fields that are useless so that these fields won't be validated and won't be submitted
            this.$el.find("#application-protocol-create-form").find("div[style='display: none;'][class*='row']").remove();
            // Convert inactivity timeout value from minutes to seconds
            var inactivityTimeoutType = this.$el.find("#inactivity-time-type").children('option:selected').val();
            if (inactivityTimeoutType == TIMEOUT_TYPE_MINUTE) {
                var minutes = this.$el.find("#inactivity-timeout").val();
                this.$el.find("#inactivity-timeout").val(parseInt(minutes, 10) * 60);
                this.$el.find("#inactivity-time-type").val(TIMEOUT_TYPE_SECOND);
            }
        },
        beforeSave: function(properties) {
            // Set the predefined "protocol-number" for some selected types
            var selectedType = $("#application-protocol-type").children('option:selected').val();

            //In UI we use inactivity-timeout while model has disable-timeout so inverse of UI
            //value is saved in model.
            properties['disable-timeout'] = !properties['enable-timeout'];

            switch(selectedType) {
                case PROTOCOL_TCP:
                    properties["protocol-number"] = PROTOCOL_NUMBER_TCP;
                    break;

                case PROTOCOL_UDP:
                    properties["protocol-number"] = PROTOCOL_NUMBER_UDP;
                    break;

                case PROTOCOL_ICMP:
                    properties["protocol-number"] = PROTOCOL_NUMBER_ICMP;
                    break;

                case PROTOCOL_ICMPV6:
                    properties["protocol-number"] = PROTOCOL_NUMBER_ICMPV6;
                    break;

                case PROTOCOL_SUN_RPC:
                    if($("#sunrpc-protocol-tcp").is(':checked')) {
                        properties["protocol-number"] = PROTOCOL_NUMBER_TCP;
                    } else {
                        properties["protocol-number"] = PROTOCOL_NUMBER_UDP;
                    }

                    if (properties["enable-alg"]) {
                        properties.alg = ALG_SUN_RPC;
                    }

                    if (properties["sunrpc-protocol-tcp"]) {
                        properties["sunrpc-protocol-type"] = properties["sunrpc-protocol-tcp"];
                    }
                    break;

                case PROTOCOL_MS_RPC:
                    if($("#msrpc-protocol-tcp").is(':checked')) {
                        properties["protocol-number"] = PROTOCOL_NUMBER_TCP;
                    } else {
                        properties["protocol-number"] = PROTOCOL_NUMBER_UDP;
                    }

                    if (properties["enable-alg"]) {
                        properties.alg = ALG_MS_RPC;
                    }

                    if (properties["msrpc-protocol-tcp"]) {
                        properties["msrpc-protocol-type"] = properties["msrpc-protocol-tcp"];
                    }
                    break;

                default:
            }

            return properties;
        }
    });
    return ProtocolView;
});
