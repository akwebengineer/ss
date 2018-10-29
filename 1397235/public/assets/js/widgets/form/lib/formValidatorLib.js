/**
 * A module that the form widget uses to perform client side validation.
 * It uses classes defined for the form like ".form-pattern" and other classes
 * that are styled by Foundation like ".error" and it's based on foundation.abide
 *
 * @module FormValidatorLib
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/form/lib/libraryWrapper',
    'widgets/form/lib/remoteValidator'
], /** @lends FormValidatorLib */
function(LibraryWrapper, RemoteValidator){

    /**
     * FormValidatorLib constructor
     *
     * @constructor
     * @class FormValidatorLib
     * @param {Object} form - The FormValidatorLib's configuration object.
     */
    var FormValidatorLib = function(form){
        var $form = form.hasClass('form-pattern') ? form : form.find('> form.form-pattern'),
            $errorBox = $form.find('.alert-box.error-message'),
            err_timeout = $form.attr('data-err-timeout') || 500,
            valid_timeout = $form.attr('data-valid-timeout') || 500,
            remote_error_timeout = $form.attr('data-remote-timeout') || 1000,
            validationLibraryWrapper = new LibraryWrapper(),
            remoteValidator = new RemoteValidator(),
            visibilitySelector, total_validation_count,
            skipRequired = false;

        /**
         * initialize the library adding events for inputs, textarea, selects and submits
         */
        this.init = function(visibilitySelectorInstance){
            var self = this;
            var validationElements = ".elementinput>input, .elementinput>textarea, .elementinput>select, .optionselection>input, .elementinput .fileupload-text:first, .numberStepper-widget input";
            var $validationElements;

            visibilitySelector = visibilitySelectorInstance;
            $form.attr('form-pattern-validator', '');

            $form
                .off('.validator')
                .on('submit submit.fndtn.validator', function (e) {
                    e.preventDefault();
                    return self.validate($(this).find(validationElements).get(), e);
                })
                .bind("validateForm", function (e, validateEventData){
                    e.stopPropagation();
                    if (validateEventData && _.isBoolean(validateEventData.skipRequired)) {
                        skipRequired = validateEventData.skipRequired;
                    }
                    $validationElements = $form.find(validationElements).get();
                    total_validation_count = $validationElements.length;
                    if(validateEventData && _.isBoolean(validateEventData.isRemote)) {
                        self.validateRemote($validationElements);
                    }
                    else {
                        self.validate($validationElements, e, true);
                    }
                    skipRequired = false;
                })
                .find('input[type="submit"]').on('click', function (e) {
                    self.validate($(form).find(validationElements).get(), e);
                });

            $form
                .find(validationElements)
                .off('.validator')
                .on('blur.fndtn.validator change.fndtn.validator', function (e) {
                    $errorBox.hide();
                    self.validate([this], e);
                })
                .on('keydown.fndtn.validator', function (e) {
                    $errorBox.hide();
                    clearTimeout(self.timer);
                    if(_.isObject($(e.target).data("remote"))) {
                        self.timer = setTimeout(function () {
                            self.validate([this], e);
                        }.bind(this), remote_error_timeout);
                    } else {
                        self.timer = setTimeout(function () {
                            self.validate([this], e);
                        }.bind(this), err_timeout);
                    }
                })
                .keypress(function (e) {
                    if(e.which == 13)
                        self.validate($(form).find(validationElements).get(), e);
                });
        };

        /**
         * validate all elements of the form. once validation is completed,
         * and if the submit button was selected, the form will be focused on the first element
         * that needs validation
         *
         * @param {Object} els - Elements to be validated
         * @param {Object} e - Event
         * @param {boolean} setErrorFocus - Flag indicating if the form needs to be focused on the first element in case of non-submit events
         * @inner
         */
        this.validate = function(els, e, setErrorFocus){
            //adds an attribute "validated" to the form and indicates the form has been validated
            if(typeof $form.attr('validated') === 'undefined')
                $form.attr('validated', '');
            var validations = this.validate_elements(els),
                validation_count = validations.length,
                submit_event = /submit/.test(e.type),
                isSingleValidation = validation_count < total_validation_count,
                isFormVisible = $form.is(":visible");
            for (var i=0; i < validation_count; i++) {
                var $ele = $(els[i]),
                    isInputElement = $ele.is("input"),
                    eleType = $ele.attr('type'),
                    $formSection = $ele.closest(".form_section"),
                    isInHiddenRow = $formSection.find(".section_content").hasClass("hide") || $ele.closest(".row").hasClass("hide"),
                    isActionElement = isInputElement && (eleType === 'submit' || eleType === 'button'),
                    isToggleCheckbox = $ele.hasClass("toggle_section_selector"),
                    isInCollapsedSection = $formSection.find('.progressive_disclosure_content.collapsed').children().length ? true : false,
                    isToBeValidatedInHiddenForm = !isFormVisible && !isInHiddenRow;

                if (!validations[i]) {
                    if ((submit_event || setErrorFocus) && !isActionElement && !isToggleCheckbox)
                        els[i].focus();
                    var isFileElement = $ele.is(":disabled") && $ele.hasClass('fileupload-text');
                    if (!isInHiddenRow && !isToggleCheckbox && !isActionElement && (!$ele.is(":disabled") || isFileElement )&& ($ele.is(":visible") || isInCollapsedSection || isToBeValidatedInHiddenForm)) {
                        $form.trigger('invalid'); //backward compatible
                        $form.trigger("slipstreamForm.validation:form", {
                            "isValid": false,
                            "event": e.originalEvent
                        });
                        $form.attr('data-invalid', 'true');
                        return false;
                    }
                }
            }

            if (submit_event) {
                $form.trigger('valid'); //backward compatible
            }
            $form.removeAttr('data-invalid');

            if (!_.isUndefined($form.attr("data-auto-validation"))) { //validated event is required
                if (isSingleValidation) { //other elements needs to be checked once the single validation passed
                    $form.trigger("validateForm");
                } else {
                    $form.trigger("slipstreamForm.validation:form", {
                        "isValid": $form.find("[data-validation-skipped]").length == 0,
                        "event": e.originalEvent,
                        "singleValidation": isSingleValidation
                    });
                }
            }

            return true;
        };

        /**
         * validate all remote elements of the form once validation is completed,
         * and if the submit button was selected, the form will be focused on the first element
         * that needs validation
         *
         * @param {Object} els - Elements to be validated
         * @inner
         */
        this.validateRemote = function(els){
            var isValid = true,
                isFormVisible = $form.is(":visible");
            for(i=0;i<els.length;i++){
                var $ele = $(els[i]),
                    $formSection = $ele.closest(".form_section"),
                    isInCollapsedSection = $formSection.find('.progressive_disclosure_content.collapsed').children().length ? true : false,
                    isInHiddenRow = $formSection.find(".section_content").hasClass("hide") || $ele.closest(".row").hasClass("hide"),
                    isToBeValidatedInHiddenForm = !isFormVisible && !isInHiddenRow;
                if($ele.data("remote") && ($ele.is(":visible") || (isInCollapsedSection && !isInHiddenRow) || isToBeValidatedInHiddenForm)){
                    if($ele.hasClass("isActiveRemote") && $ele.is(":disabled")) { // Validation in progress
                        isValid = false;
                        break;
                    } else if($ele.is(":disabled") || $ele.siblings(".error").css("display")=="none") {
                        isValid = true;
                    } else if($ele.siblings(".error").css("display") == "block") {
                        isValid = false;
                        break;
                    } else {
                        isValid = true;
                    }
                }
            }

            if(isValid == false) {
                $form.attr('data-invalid-remote', 'true');
            } else {
                $form.removeAttr('data-invalid-remote');
            }
        };

        /**
         * loop through each element of the form the pattern and apply styles
         * @param {Object} els - Elements to be validated
         *  @inner
         */
        this.validate_elements = function (els) {
            var count = els.length,
                elements = [];

            for (var i = count - 1; i >= 0; i--) {
                elements.push(this.getPattern(els[i]));
            }
            return this.check_validation_and_apply_styles(elements);
        };

        /**
         * Apply a regular expression for the user defined pattern or leave it blank if it will use a predefined pattern
         * (type variable)
         * @param {Object} el - Dom element that needs to be validated
         * @inner
         */
        this.getPattern = function (el) {
            var type = el.getAttribute('data-validation'),
                required = typeof el.getAttribute('required') === 'string',
                regexObjPattern = el.getAttribute('data-regexobj-pattern') !== null ? true : false,
                pattern;

            if (regexObjPattern) {
                // Expected to receive the regex Obj from config in form of string type
                var patternString = el.getAttribute('data-regexobj-pattern');
                // Substring the regex semantic operators to create a valid Regex object from string.
                pattern = patternString.substring(1, patternString.length - 1);
            } else {
                pattern = el.getAttribute('data-pattern') || '';
            }

            if (pattern.length > 0) {
                return [el, new RegExp(pattern), required];
            }

            return [el, pattern, required, type];
        };

        var hideErrorMessage = function(el,self, is_checked){
            var $el = $(el);
            if(is_checked) {
                $el.removeAttr('data-invalid').parent().parent().removeClass('error');
                $el.parent().parent().prev().removeClass('error');
                $el.parent().siblings(".inline-help").hide();
            } else {
                self.removeErrorMessage(el);
            }
            self.triggerCustomEvent(el,true);
        };

        var showErrorMessage = function(el,self, is_checked){
            var $el = $(el);
            if(is_checked) {
                $el.removeAttr('data-invalid').parent().parent().addClass('error');
                $el.parent().parent().prev().addClass('error');
                $el.parent().siblings(".inline-help").hide();
            } else {
                self.addErrorMessage(el);
            }
            self.triggerCustomEvent(el,false);
        };

        /**
         * When remote validation passes, but client side validation fails, client validation error message neds to be set before showing it
         * @param {Object} el - Dom element that needs to be validated
         * @param {String} error - error string
         * @param {Boolean} is_checked - true if its a checkbox or radio button
         * @inner
         */
        var updateErrorMessage = function(el, error, is_checked) {
            var $el = $(el);
            if(is_checked) {
                $el.parent().parent().find("small.error").text(error);
            } else  {
                $el.siblings(".error").text(error);
            }
        };

        /**
         * Show or Hide Callback Validation Error
         * @param {Object} self - Object reference
         * @param {Object} el - dom element
         * @param {Object/Boolean} callbackfield - callback
         * @param {Boolean} is_checked - true if a field is a radio or checkbox else false
         * @param {Boolean} required - whether the field is required or not
         * @return Boolean to tell whether its valid or not
         */
        var showHideCallbackError = function(self, el, callbackfield, is_checked, required) {
            var $el = $(el),
                callbackVal,
                allUnchecked;
            if(is_checked) {
                var checkboxValueHash = getCheckedValueHash(el);
                allUnchecked = getAllUncheckedValue(el);
                callbackVal = callbackfield(checkboxValueHash);
            } else {
                callbackVal = callbackfield($el.get(0).value);
            }

            if(_.isObject(callbackVal) && ((!is_checked && !_.isEqual($el.get(0).value,"")) || (is_checked && !allUnchecked)))
            {
                updateErrorMessage(el, callbackVal["error"], is_checked);
                showErrorMessage(el,self, is_checked);
                return false;
            }
            else if(_.isBoolean(callbackVal) && callbackVal) {
                hideErrorMessage(el,self, is_checked);
                return true;
            }
            else {
                if(!skipRequired && required) {
                    updateErrorMessage(el, $el.data('callbackDefaultError'), is_checked);
                    showErrorMessage(el, self, is_checked);
                    return false;
                } else {
                    hideErrorMessage(el,self, is_checked);
                    return true;
                }
            }
        };

        /**
         * Give the mapping of each checkbox value to true/false for checked/unchecked respectively
         * @param {Object} el - dom element
         * @return {Object} checkboxValueHash - Hash of checkbox values
         */
        var getCheckedValueHash = function(el) {
            var name = el.getAttribute('name'),
                group = document.getElementsByName(name),
                count = group.length,
                checkboxValueHash = {};

            for (var i=0; i < count; i++) {
                if(group[i].checked) {
                    checkboxValueHash[group[i].value] = true;

                } else {
                    checkboxValueHash[group[i].value] = false;
                }
            }
            return checkboxValueHash;
        };

        /**
         * Gives true if all checkboxes are unchecked within a group and false otherwise
         * @param {Object} el - dom element
         * @return {Boolean} allUnchecked
         */
        var getAllUncheckedValue = function(el) {
            var name = el.getAttribute('name'),
                group = document.getElementsByName(name),
                count = group.length,
                checkboxValueHash = {},
                numGroupsUnchecked = 0,
                allUnchecked = false;

            for (var i=0; i < count; i++) {
                if (group[i].checked)
                {
                    checkboxValueHash[group[i].value] = true;

                } else {
                    checkboxValueHash[group[i].value] = false;
                    numGroupsUnchecked++;
                }
            }
            if(numGroupsUnchecked == count) {
                allUnchecked = true;
            }
            return allUnchecked;
        };
        /**
         * validate each element using validationLibraryWrapper library.
         * @param {Object} elements - Elements to be validated
         * @inner
         */
        this.check_validation_and_apply_styles = function (elements) {
            var count = elements.length,
                validations = [];

            /**
             * Adds or remove the skipRequired class according to if validation was triggered. The class is counted later to know if the validation in the form included all required fields
             * @param {Object} $el - element jQuery DOM element
             * @param {boolean} required - if the field is a required field
             * @param {boolean} isValidRequiredValue - if the value in the field is valid
             * @inner
             */
            var updateRequiredCount = function($el, required, isValidRequiredValue) {
               if (required) {
                   var $elementinput = $el.closest(".elementinput");
                   if (!$elementinput.hasClass("error")) {
                       if (skipRequired) {
                           !isValidRequiredValue && $elementinput.attr("data-validation-skipped", "");
                       } else {
                           $elementinput.removeAttr("data-validation-skipped");
                       }
                   }
               }
            };

            /**
             * Push True or false to the validations array based on the visibility of error
             * @param {Object} errorField - errorField DOM element
             * @inner
             */
            var pushToValidation = function(errorField) {
                if (!_.isEqual(errorField.css("display"), "none")) {
                    validations && validations.push(false);
                }
                else {
                    validations && validations.push(true); //sets initial validation to match a validation for el. remote validation gets trigger after it.
                }
            };

            for (var i = count - 1; i >= 0; i--) {
                var el = elements[i][0],
                    $el = $(el),
                    required = skipRequired ? false : elements[i][2],
                    value = el.value,
                    type = el.getAttribute('data-validation'),
                    callbackfield = $el.data('callbackValidation'),
                    remote = $el.data('remote'),
                    is_equal = el.getAttribute('data-equalto'),
                    is_checked = el.type === "radio"  ||  el.type === "checkbox",
                    is_password = el.type === "password",
                    valid_length = (required) ? (el.value.length > 0) : true,
                    remotedata = $el.data('remotedata');

                if (is_checked) {
                    var isValid = true;
                    if(_.isFunction(callbackfield)){
                        isValid = showHideCallbackError(this, el, callbackfield, is_checked, required);
                    } else if(required) {
                        isValid = this.valid_checked(el, required);
                    }
                    var group = document.getElementsByName(el.getAttribute('name'));
                    visibilitySelector.updateBasedOnRadioButtonAndCheckbox($el, group);
                    validations.push(isValid);
                    updateRequiredCount($el, elements[i][2], isValid);
                } else if (is_equal && required) {
                    validations.push(this.valid_equal(el, required));
                } else {
                    if (elements[i][1] && elements[i][1].test(value) && valid_length || !required && el.value.length < 1) {
                        if(remote){
                            if(remotedata != el.value){
                                $el.data('remotedata', el.value);
                                bindRemoteValidation($el, this, validations);
                            }
                            else {
                                pushToValidation($el.siblings(".error"));
                            }
                        } else {
                            hideErrorMessage(el,this);
                            validations.push(true);
                        }
                    } else if (/multiple/.test(type)||is_password) {
                        validations.push(this.valid_multiple(el, required));
                    } else if(!(elements[i][1]) && _.isFunction(callbackfield) && !remote) {
                        var callbackValidValue = showHideCallbackError(this, el, callbackfield, is_checked, required);
                        callbackValidValue ? validations.push(true) : validations.push(false);
                    } else if (!(elements[i][1]) &&  validationLibraryWrapper.validate_data_type(type,el)){
                        if(remote){
                            if( remotedata != el.value){
                                $el.data('remotedata', el.value);
                                bindRemoteValidation($el, this, validations);
                            }
                            else {
                                pushToValidation($el.siblings(".error"));
                            }
                        }else{
                            hideErrorMessage(el,this);
                            validations.push(true);
                        }
                    } else if (!(elements[i][1]) && remote){ //calls remote validation and binds "remote_<id>" custom event to act on valid or invalid input value
                        updateErrorMessage(el,$el.data('validationError'));
                        showErrorMessage(el,this);
                        validations.push(false);
                    } else {
                        if(remote) {
                            updateErrorMessage(el,$el.data('validationError'));
                        }
                        showErrorMessage(el,this);
                        validations.push(false);
                    }

                    if (!is_checked){ //visibility for all input cases except radio button and checkbox
                        visibilitySelector.updateBasedOnInput($el);
                    }
                }
            }

            return validations;
        };



        var bindRemoteValidation = function($el, self, validations) {
            var el = $el.get(0);
            if (!_.isEqual($el.siblings(".error").css("display"), "none")) {
                validations && validations.push(false);
            }
            else {
                validations && validations.push(true); //sets initial validation to match a validation for el. remote validation gets trigger after it.
            }
            $el.unbind('remote_' + el.id).bind('remote_' + el.id, function (e, isValid) {
                if (!_.isUndefined($el.data('remote'))) {
                    if (_.isEqual(isValid, true)) {
                        $el.siblings(".error").text('');
                        self.removeErrorMessage(el);
                        self.triggerCustomEvent(el, true);
                    } else {
                        $el.siblings(".error").text($el.data('remote').error);
                        self.addErrorMessage(el);
                        self.triggerCustomEvent(el, false, $el.data('remote').error);
                    }
                }
                $el.trigger('slipstreamForm.validation:remote', isValid);
            });
            remoteValidator.validateDataOnRemote($el.data('remote'), el, self.removeErrorMessage);
        };


        /**
         * validate multiple patterns for the same elements
         * @param {Object} el - Dom element that needs to be validated
         * @param {Boolean} required - Checks whether the field to be validated is a required field or not
         * @inner
         */
        this.valid_multiple = function (el, required) {
            var type = null,
                error = null,
                valid = true,
                errors = {},
                self = this;

            var hideValid = (/true/.test(el.getAttribute('data-hide_valid'))) ? true : false;

            var attrs = _.sortBy(el.attributes, function(elem){
                return elem.name;
            });
            Array.prototype.slice.call(attrs).every(function (item, index, array) {
                if (/data-validation_/.test(item.name)) {
                    type = item.name.substring(item.name.lastIndexOf("_") + 1);
                    errors[type] = item.value;

                    if (!validationLibraryWrapper.validate_data_type(type, el)) {
                        self.addErrorMessage(el);
                        valid = false;
                        error = item.value;
                        return;
                    }
                }

                validateRegexPattern(el);

                function validateRegexPattern(el) {
                    var regexAttrName, regexPatternObj, patternString, regexId;

                    if (/data-validation-regexobj-pattern_/.test(item.name)) {
                        regexAttrName = "data-validation-regexobj-pattern_";
                        regexId = item.name.split(regexAttrName).pop();
                        // Expected to receive the regex Obj from config in form of string type
                        patternString = el.attributes[regexAttrName + regexId].value;
                        // Substring the regex semantic operators to create a valid Regex object from string.
                        regexPatternObj = new RegExp(patternString.substring(1, patternString.length - 1));
                    } else if (/data-validation-regex-pattern_/.test(item.name)) {
                        regexAttrName = "data-validation-regex-pattern_";
                        regexId = item.name.split(regexAttrName).pop();
                        patternString = el.attributes[regexAttrName + regexId].value;
                        regexPatternObj = new RegExp(patternString);
                    } else {
                        return;
                    }

                    if (!regexPatternObj.test(el.value)) {
                        self.addErrorMessage(el);
                        valid = false;
                        error = el.attributes[regexAttrName.slice(0, -9) + "_" + regexId].value;
                        return;
                    }
                }
                return true;
            });

            if (valid) {
                if (!$(el).data('remote')) {
                    self.removeErrorMessage(el);
                    this.triggerCustomEvent(el, true);
                    if (!hideValid) this.showValid(el);
                } else {
                    // Perform remote validation once all client side validations pass
                    var remotedata = $(el).data("remotedata");
                    if(remotedata != el.value){
                        $(el).data('remotedata', el.value);
                        bindRemoteValidation($(el), this);
                    }
                }
            } else {
                $(el).siblings(".inline-help").hide();
                $(el).siblings(".error").text(error);
                self.addErrorMessage(el);
                this.triggerCustomEvent(el, false);
            }

            return valid;
        };

        /**
         * validate that the value of an element is equal to the one of another element
         * @inner
         */
        this.valid_equal = function(el, required) {
            var from  = document.getElementById(el.getAttribute('data-equalto')).value,
                to    = el.value,
                valid = (from === to);

            if (valid) {
                this.removeErrorMessage(el);
                this.triggerCustomEvent(el,true);
            } else {
                this.addErrorMessage(el);
                this.triggerCustomEvent(el,false);
            }

            return valid;
        };

        /**
         * validate that a valid selection of a radio button or a checkbox has happened
         * @param {Object} el - Dom element that needs to be validated
         * @param {string} required - If string is available, the element is a required field
         * @inner
         */
        this.valid_checked = function (el, required) {
            var name = el.getAttribute('name'),
                group = document.getElementsByName(name),
                count = group.length,
                valid = false,
                $el = $(el);
            for (var i=0; i < count; i++) {
                if (group[i].checked) valid = true;
            }
            if (valid) {
                $el.removeAttr('data-invalid').parent().parent().removeClass('error');
                $el.parent().parent().prev().removeClass('error');
                $el.parent().siblings(".inline-help").hide();
                this.triggerCustomEvent(el,true);
            } else {
                $el.attr('data-invalid', '').parent().parent().addClass('error');
                $el.parent().parent().prev().addClass('error');
                $el.parent().siblings(".inline-help").hide();
                this.triggerCustomEvent(el,false);
            }

            return valid;
        };

        /**
         * remove any error message from the form
         * @param {Object} el - Dom element that needs to be validated
         * @inner
         */
        this.removeErrorMessage = function(el){
            $(el).removeAttr('data-invalid').parents(".elementinput").removeClass('error');
            $(el).parents(".elementinput").prev().removeClass('error');
            !skipRequired && $(el).siblings(".inline-help").hide();
        };

        /**
         * add error messages to the form
         * @param {Object} el - Dom element that needs to be validated
         * @inner
         */
        this.addErrorMessage = function(el){
            var elType = el.type;
            if (!(elType=='button'||elType=='submit')){
                $(el).attr('data-invalid', '').parents(".elementinput").addClass('error');
                $(el).parents(".elementinput").prev().addClass('error');
                $(el).siblings(".inline-help").hide();
            }
        };

        /**
         * show "valid" message for a validated input
         * @param {Object} el - Dom element that needs to be validated
         * @inner
         */
        this.showValid = function (el){
            var $validConfirmation = $(el).siblings(".inline-help");
            $validConfirmation.text("Valid");
            $validConfirmation.addClass('valid');
            $validConfirmation.show();
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                $validConfirmation.hide();
            }.bind(this), valid_timeout);
        };

        /**
         * Triggers a custom event using the name provided by the data-trigger attribute
         * Listeners of the custom event should implement a binding event handler. For example: $(el).bind(custom_event,function(){...});
         * @param {Object} el - Dom element that needs validation
         * @param {boolean} enabled - true if the element passed the input validation and false if the validation failed
         * @inner
         */
        this.triggerCustomEvent = function (el, isValid){
            var custom_event = el.getAttribute('data-trigger');
            if (el.getAttribute('data-trigger')) {
                $(el).trigger(custom_event, isValid); //no errors: enabled=true
            }
        };
    };

    return FormValidatorLib;
});
