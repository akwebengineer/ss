/**
 * A object for some common methods in UTM features.
 *
 * @module UtmUtility
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'lib/validator/extendedValidator',
    'widgets/confirmationDialog/confirmationDialogWidget'
], function (Backbone, validator, ConfirmationDialog) {

    var COMMAND_MAX_LENGTH = 64,
        COMMAND_MAX_NUMBER = 2048,
        MIME_MAX_LENGTH = 40,
        MIME_MAX_NUMBER = 2048,
        FILE_EXTENSION_MAX_LENGTH = 29,
        FILE_EXTENSION_MAX_NUMBER = 2048,
        DEFINITION_TYPE_CUSTOM = "CUSTOM";

    /**
     * Used to add placeholder effect for dropdown list.
     */
    var showPlaceholder = function(dropdownList){
        var reg = /[\s]/g,
            value = '',
            label = '',
            placeholderIndex = 0;
        value = dropdownList.val();
        // Replace any blank signs
        label = dropdownList.find("option:selected").text().replace(reg, '');
        var selectIndex = dropdownList.get(0).selectedIndex;
        // Placeholder option is selected or the null option is selected.
        if(selectIndex === placeholderIndex || ($.inArray(value, ['', null]) >= 0 && $.inArray(label, ['', null]) >= 0)){
            // If the null option is selected, select placeholder option instead.
            if(selectIndex !== placeholderIndex){
                dropdownList.get(0).selectedIndex = placeholderIndex;
            }
            dropdownList.addClass('select-disabled-with-placeholder');
            // Set other options' color as normal
            dropdownList.children().addClass('select-with-placeholder');
        }else{
            if(selectIndex !== placeholderIndex){
                dropdownList.removeClass('select-disabled-with-placeholder');
            }
        }
    };

    /**
     * Used to validate mime, file extension and command list.
     */
    var doValidateMimeFileExtensionCommandList = function(context, comp, maxLength, maxNumber) {
        var textValue = comp.val(),
            valueArr,
            count = 0,
            value,
            i = 0,
            mimePattern = /^([a-zA-Z]|[0-9])([a-zA-Z]|[0-9]|\_|\-)*\/(([a-zA-Z]|[0-9])([a-zA-Z]|[0-9]|\_|\-|\.|\+)*)*$/,
            dash2Pattern = /^.*(\-){2,}.*$/,
            pluse2Pattern = /^.*(\+){2,}.*$/,
            dot2Pattern = /^.*(\.){2,}.*$/;
 
        // Initialize the message
        comp.invalidMsg = '';

        if (textValue) {
            valueArr = textValue.split(",");
            if (valueArr.length > 0) {
                for (i = 0; i < valueArr.length; i++) {
                    value = $.trim(valueArr[i]);
                    if (value && value.length > 0) {
                        // we have to check the length of each value and add 2 extra (for
                        // space and comma between each value)
                        count = count + value.length + 2;
                        if (value.length > maxLength) {
                            comp.invalidMsg = context.getMessage('utm_content_filtering_length_error_for_each_value', [maxLength]);
                            return;
                        }
                        // Validation for space
                        // For this validation, the class "mime" need be defined in the component
                        if(comp.attr('data-trigger') && (comp.attr('data-trigger') === 'commandListValidator' ||
                           comp.attr('data-trigger') === 'fileExtensionListValidator')) {
                            if (validator.hasSpace(value)) {
                              comp.invalidMsg = context.getMessage('utm_content_filtering_space_error');
                              return;
                            }
                        }

                        // For this validation, the class "mime" need be defined in the component
                        /* "mime" must be two strings split by the slash(/).
                         * (1) The first string beginning with a letter or number and consisting of letters, numbers, underscores and dashes. Dashes cannot be shown continuously in the first string. 
                         * (2) The second string can be null or begin with a letter or number and consisting of letters, numbers, underscores, dashes, dots and pluses. Dashes, dots and pluses can't be shown continuously in the second string.
                         */
                        if (comp.attr('data-trigger') && (comp.attr('data-trigger') === 'mimeListValidator')) {

                            if (!mimePattern.test(value)) {
                                comp.invalidMsg = context.getMessage('utm_content_filtering_mime_error', [value]);
                                return;
                             }

                             if (dash2Pattern.test(value) || pluse2Pattern.test(value) || dot2Pattern.test(value)) {
                                 comp.invalidMsg = context.getMessage('utm_content_filtering_mime_error', [value]);
                                 return;
                             }
                        }
                    }
                }
                if (count > maxNumber) {
                    comp.invalidMsg = context.getMessage('utm_content_filtering_total_count_error', [maxNumber,comp.parent().prev().find('label').text()]);
                    return;
                }
            }
        }
    };

    /**
     * Used to validate lengh for textarea, it's a temporary workaround.
     */
    var doValidateLength = function(context, comp, maxLength) {
        var textValue = comp.val();
        // Initialize the message
        comp.invalidMsg = '';
        if(maxLength) {
            if(comp.val().length > maxLength)  comp.invalidMsg = context.getMessage('maximum_length_error', [maxLength]);
        }
        return;
    };

    /**
     * Used to validate number range, it's a temporary workaround.
     */
    var doValidateRange = function(context, comp, minValue, maxValue) {
        // Initialize the message
        comp.invalidMsg = '';
        // If input value is an integer, then continue to validate its range
        if (comp.attr("data-invalid") === undefined) {
            var value = parseInt(comp.val(), 10);

            if (value < minValue) {
                comp.invalidMsg = context.getMessage('minimum_value_error', [minValue]);
                return false;
            } else if (value > maxValue) {
                comp.invalidMsg = context.getMessage('maximum_value_error', [maxValue]);
                return false;
            }
        } else {
            comp.invalidMsg = context.getMessage('integer_error');
            return false;
        }

        return true;
    };

    /**
     * Used to validate name with only space and tab for text input, it's a temporary workaround.
     */
    var doValidateBlankName = function(context, comp) {
        var textValue = comp.val();
        var re = /^\s*$/;
        if (re.test(textValue)) {
            comp.invalidMsg = context.getMessage('utm_antispam_name_space_error');
            return false;
        }
        return true;
    };

    var UtmUtility  = {
        /**
         * Used to bind callback to blur event.
         */
        bindBlur: function(nameArr, callback) {
            var self = this;
            $.each(nameArr, function(index, value) {
                var target = '#' + value;
                var comps = self.$el.find(target);
                if(comps.length > 0){
                    comps.each(function() {
                        $(this).bind('blur', $.proxy(callback, self, $(this)));
                    });
                }
            });
        },

        /**
         * Used to separate values with a blank before.
         */
        separateValuesWithBlank: function(comp) {
            // reset the value to the component after removing invalid values and extra commas
            var textValue = comp.val(),
                valueArr,
                newArr = [],
                value,
                i = 0;

            if (textValue) {
                valueArr = textValue.split(",");
                if (valueArr.length > 0) {
                    for (i = 0; i < valueArr.length; i++) {
                        value = $.trim(valueArr[i]);
                        if (value && value.length > 0) {
                            newArr.push(value);
                        }
                      }
                      comp.val(newArr.join(', '));
                  }
             }
        },

        /**
         * Used to add some subsidiary functions.
         * For example: bind some common validation to components, add placeholder to dropdown list.
         */
        addSubsidiaryFunctions: function(elements) {
            var sections = elements.sections;

            for (var i=0; i<sections.length; i++) {
                for (var j=0; j<sections[i].elements.length; j++) {
                    var element = sections[i].elements[j],
                        comp = this.$el.find('#'+element.id);
                    // Bind validations
                    if (element.post_validation && element.post_validation == "rangeValidator") {
                        comp.bind('rangeValidator',$.proxy(this.validateRange, this, comp, element.minValue, element.maxValue));
                    }else if (element.post_validation && element.post_validation == "lengthValidator"){
                        comp.bind('lengthValidator',$.proxy(this.validateLength, this, comp, element.max_length, element.error));
                    }else if (element.post_validation && element.post_validation == "blankNameValidator") {
                        comp.bind('blankNameValidator',$.proxy(this.validateBlankName, this, comp, element.error));
                    }else if (element.post_validation && element.post_validation == "mimeListValidator"){
                        comp.bind('mimeListValidator',$.proxy(this.validateMimeList, this, comp));
                    }else if (element.post_validation && element.post_validation == "commandListValidator"){
                        comp.bind('commandListValidator',$.proxy(this.validateCommandList, this, comp));
                    }else if (element.post_validation && element.post_validation == "fileExtensionListValidator"){
                        comp.bind('fileExtensionListValidator',$.proxy(this.validateFileExtensionList, this, comp));
                    }
                    // Add placeholder for dropdown list
                    if(element.element_dropdown && element.placeholder){
                        this.imitatePlaceholderForDropdownList(comp, element.placeholder);
                    }
                }
            }
        },

        /**
         * Used to validate range for number, and show the error information.
         */
        validateRange: function(comp, minValue, maxValue){
            if(!doValidateRange(this.context, comp, minValue, maxValue)) {
                this.showErrorInfo(comp);
            }
        },

        /**
         * Used to bind some special business validation to components, user can get a callback to do own validation
         */
        bindCustomValidation: function(trigger, callback) {
            var self = this;
            // For textarea
            var textareas = this.$el.find('textarea[data-trigger="' + trigger + '"]');
            if(textareas.length > 0){
                textareas.each(function() {
                    $(this).bind(trigger, $.proxy(callback, self, $(this)));
                });
            }
            // For input
            var inputs = this.$el.find('input[data-trigger="' + trigger + '"]');
            if(inputs.length > 0){
                inputs.each(function() {
                    $(this).bind(trigger, $.proxy(callback, self, $(this)));
                });
            }
        },

        /**
         * Used to validate mime list.
         */
        validateMimeList: function(comp){
            doValidateMimeFileExtensionCommandList(this.context, comp, MIME_MAX_LENGTH, MIME_MAX_NUMBER);
            this.showErrorInfo(comp);
        },

        /**
         * Used to validate file extension list.
         */
        validateFileExtensionList: function(comp){
            doValidateMimeFileExtensionCommandList(this.context, comp, FILE_EXTENSION_MAX_LENGTH, FILE_EXTENSION_MAX_NUMBER);
            this.showErrorInfo(comp);
        },

        /**
         * Used to validate command list.
         */
        validateCommandList: function(comp){
            doValidateMimeFileExtensionCommandList(this.context, comp, COMMAND_MAX_LENGTH, COMMAND_MAX_NUMBER);
            this.showErrorInfo(comp);
        },

        /**
         * Used to validate lengh for textarea, it's a temporary workaround.
         */
        validateLength: function(comp, maxLength, error){
            if (comp.attr("data-invalid") === undefined) {
                doValidateLength(this.context, comp, maxLength);
                if (comp.invalidMsg) {
                    this.showErrorInfo(comp);
                }
            } else {
                // Show the predefined error
                comp.invalidMsg = error;
                this.showErrorInfo(comp);
            }
        },

        /**
         * Used to validate whether name only has space and tab, it's a temporary workaround.
         */
        validateBlankName: function(comp, error){
            if (comp.attr("data-invalid") === undefined) {
                if (!doValidateBlankName(this.context, comp)) {
                    this.showErrorInfo(comp);
                }
            } else {
                // Show the predefined error
                if(error !== true){
                    comp.invalidMsg = error;
                    this.showErrorInfo(comp);
                }
            }
        },

        /**
         * Used to check if textarea in this form is valid.
         */
        isTextareaValid: function(){
            if(this.$el.find('textarea').parent().filter( ".error" ).length > 0){
                return false;
            }else{
                return true;
            }
        },

        /**
         * Use the function to workaround,
         * for some fields (not required) with post_validation cannot be checked by formWidget.isValidInput()
         */
        isFormValid: function(form_id) {
            if (form_id) {
                var inputFields = this.$el.find("#"+form_id).find("div:visible").find("input[data-invalid]");

                if (inputFields.length > 0) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Used to imitate placeholder for dropdown list.
         */
        imitatePlaceholderForDropdownList: function(dropdownList, placeholder){
            // TODO This is a temporary workaround, so do not define it in the template
            var placeholderOption = '<option value="" selected disabled class="select-option-hidden-with-placeholder select-with-placeholder">' + placeholder + '</option>';
            dropdownList.prepend(placeholderOption);
            showPlaceholder(dropdownList);
            dropdownList.on('change',function(){
                showPlaceholder(dropdownList);
            });
        },

        /**
         * Used to show error information for textarea, it's a temporary workaround.
         */
        showErrorInfoForTextarea: function(comp) {
            var self = this;
            var errorTarget = comp[0].id + '-error';
            var errorObj = $('#' + errorTarget);
            if(comp.invalidMsg){
                comp.attr('data-invalid', '').parent().addClass('error');
                comp.parent().prev().addClass('error');
                comp.siblings(".inline-help").hide();
                // Since error information is not supported in textarea currently, so I just add it here. It's a temporary workaround.
                if(errorObj.length === 0){
                    var html = '<small class="error errorimage" id="'+ errorTarget + '">' + comp.invalidMsg + '</small>';
                    comp.after(html);
                }else{
                    errorObj.text(comp.invalidMsg);
                }
            }else{
                if(errorObj.length > 0){
                    errorObj.remove();
                    comp.removeAttr('data-invalid').parent().removeClass('error');
                    comp.parent().prev().removeClass('error');
                    comp.siblings(".inline-help").hide();
                }
            }
        },

        /**
         * Used to show error information for input, it's a temporary workaround.
         */
        showErrorInfoForInput: function(comp) {
            comp.attr("data-invalid", "").parent().addClass('error');
            comp.parent().prev().addClass('error');
            comp.parent().find("small[class*='error']").html(comp.invalidMsg);
        },

        /**
         * Used to show error information for input&textarea, it's a temporary workaround.
         */
        showErrorInfo: function(comp) {
            if(comp && comp[0]){
                if(comp[0].type === 'textarea'){
                    this.showErrorInfoForTextarea(comp);
                }else if(comp[0].type === 'text'){
                    this.showErrorInfoForInput(comp);
                }
            }
        },

        /**
         * Create a confirmation dialog with basic settings
         * Need to specify title, question, and event handle functions in "option"
         * If "withoutNoButton" is configured, the no button won't be shown
         */
        createConfirmationDialog: function(option) {
            var self = this;

            var confirmationDialogConf = {
                    title: option.title,
                    question: option.question,
                    yesButtonLabel: self.context.getMessage('yes'),
                    noButtonLabel: self.context.getMessage('no'),
                    yesButtonCallback: function() {
                        self.confirmationDialogWidget.destroy();
                    },
                    noButtonCallback: function() {
                        self.confirmationDialogWidget.destroy();
                    },
                    yesButtonTrigger: 'yesEventTriggered',
                    noButtonTrigger: 'noEventTriggered',
                    xIcon: false
                };
            if(option.withoutNoButton) {
                delete confirmationDialogConf.noButtonCallback;
                delete confirmationDialogConf.noButtonTrigger;
                delete confirmationDialogConf.noButtonLabel;
            }
            if(option.kind){
                confirmationDialogConf.kind = option.kind;
            }
            this.confirmationDialogWidget = new ConfirmationDialog(confirmationDialogConf);

            this.bindEvents(option);
            this.confirmationDialogWidget.build();
        },

        bindEvents: function(option) {
            this.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (option.yesEvent) {
                    option.yesEvent();
                }
            });

            this.confirmationDialogWidget.vent.on('noEventTriggered', function() {
                if (option.noEvent) {
                    option.noEvent();
                }
            });
        },

        /**
         * change definition-type to "CUSTOM" if action is clone, 
         * otherwise, the new cloned profile cannot be edited/deleted
         */
        beforeSave: function() {
            if (this.formMode === this.MODE_CLONE) {
                this.model.set("definition-type", DEFINITION_TYPE_CUSTOM);
            }
        },

        /**
         * 
         * @param {Object} - capabilities, with actionName as key and rbac capabilites array as value
         *       {action1: [capability1], action2: [capability1, capability2]}
         * @return {Object} - rbacHash, with actionName as key and true|false as value
         *      {action1: true, action2: false}
         */
        buildRbacHash: function(capabilities) {
            var rbacHash = {};

            if (Slipstream && Slipstream.SDK && Slipstream.SDK.RBACResolver){
                var rbacResolver = new Slipstream.SDK.RBACResolver();

                $.each( capabilities, function( key, value) {
                    rbacHash[key] = rbacResolver.verifyAccess(value);
                });
            }
            return rbacHash;
        },

        htmlEncode : function(text) {
            return _.escape(text);
        }

    };

    return UtmUtility;
});