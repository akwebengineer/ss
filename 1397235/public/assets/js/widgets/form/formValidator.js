/**
 * A module that register events for form validation.
 * The form that requires validation needs to follow the form Widget format.
 * The validation uses classes defined for the form like ".form-pattern" and other classes
 * that are styled by Foundation like ".error".
 *
 * @module FormValidator
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/form/lib/formValidatorLib',
    'widgets/form/lib/libraryWrapper',
    'widgets/form/lib/remoteValidator',
    'widgets/form/lib/visibilitySelector'
], /** @lends FormValidator */
    function(FormValidatorLib, ValidatorLibrary, RemoteValidator, VisibilitySelector){

    /**
     * FormValidator constructor
     *
     * @constructor
     * @class FormValidator
     *
     * @param {Object} formConfigurationById - configuration of the form by element id
     *
     */
    var FormValidator = function(formConfigurationById){

        var formValidatorLib, visibilitySelector;

        /**
         * initializes the form validator and to be used only by the form widget
         * @param {Object} visibilitySelectorInstance - instance of the VisibilitySelector
         */
        this._init = function (visibilitySelectorInstance) {
            visibilitySelector = visibilitySelectorInstance;
        };

        /**
         * validates a form
         * @param {Object} form - form that needs validation
         * @param {elements} elements - configuration used to generate the form
         * @returns {Object} form with validation initialized
         */
        this.validateForm =  function (form, elements) {
            if (elements) addValidationData(form, elements);
            formValidatorLib = new FormValidatorLib(form, formConfigurationById);
            //since the FormValidator can be invoked directly, the VisibilitySelector instance might not be available; therefore, it will need to be created
            if (_.isUndefined(visibilitySelector)) {
                var $form = form.find('form.form-pattern');
                visibilitySelector = new VisibilitySelector($form, formConfigurationById);
            }
            formValidatorLib.init(visibilitySelector);
            return form;
        };

        /**
         * check if all elements of a form have valid inputs but it ignores hidden sections
         * @param {Object} form - DOM Object that represents the form that needs validation
         * @param {boolean} skipRequiredElements - if it is set to true, it will skip the required elements; the default value is false
         * @returns {boolean} true is the form validation is valid, false if one of the elements fails the validation
         */
        this.isValidInput = function (form, skipRequiredElements){
            var $form = $(form),
                skipRequired = _.isBoolean(skipRequiredElements) ? skipRequiredElements : false,
                getElementsArray = function (elementType) {
                    return $form.find(elementType+"[required]").closest('.elementinput').toArray();
                },
                isFormInputsValid = function () {
                    return _.isUndefined($form.attr('data-invalid'));
                };
            $form.trigger("validateForm", {"skipRequired": skipRequired});
            var isValid =  isFormInputsValid();
            if (!skipRequired) { //check if any required field has error and it's not hidden
                var isRequiredValid = true,
                    requiredFields = getElementsArray("input"),
                    requiredSelects = getElementsArray("select"),
                    requiredTextArea = getElementsArray("textarea");
                requiredFields = requiredFields.concat(requiredSelects).concat(requiredTextArea);

                for (var i=0; i<requiredFields.length; i++){
                    var $requiredField = $(requiredFields[i]);
                    var isHidden = $requiredField.closest('.section_content').hasClass('hide');
                    if ($requiredField.hasClass('error') && !isHidden){
                        isRequiredValid = false;
                        break;
                    }
                }
                if (isRequiredValid) { //trigger validation without required fields since the individual required field validation passed
                    $form.trigger("validateForm", {"skipRequired": true});
                    isValid =  isFormInputsValid();
                }
            }
            return isValid;
        };

        /**
         * check if all elements of a form have valid remote inputs
         * @param {Object} form - DOM Object that represents the form that needs validation
         * @param {boolean} skipRequiredElements - if it is set to true, it will skip the required elements; the default value is false
         * @returns {boolean} true is the form validation is valid, false if one of the elements fails the validation
         */
        this.isValidRemoteInput = function (form, skipRequiredElements){
            var $form = $(form),
                skipRequired = _.isBoolean(skipRequiredElements) ? skipRequiredElements : false,
                isFormInputsValid = function () {
                    return _.isUndefined($form.attr('data-invalid-remote'));
                };
            $form.trigger("validateForm", {"skipRequired": skipRequired, "isRemote": true});
            var isValid =  isFormInputsValid();
            return isValid;
        };
        /**
         * check if one element of a form has a valid value
         * @param {string} pattern - Pattern that will be validated
         * @param {Object} el - element that needs validation
         * @param {Object} remote - configuration required to test if the element is valid.
         * It's an asynchronous call to a REST API and the configuration object consists of:
         * url: it represents the REST API to be called; in case the url needs to be composed by the input data, a callback function can be defined instead of the string.
         * type:  the type of request to make ("POST","GET","PUT","DELETE")
         * response: a callback function that can be used to reformat the API response to comply with the expected return value of 'true' or 'false'.
         * @returns {boolean} true is the element validation is valid, false if the elements fails the validation. In case of remote validation, the response will be asynchronus.
         * A custom event with a name composed by the "remote_" and the id of the element will be triggered with the true/false data if the value was valid or invalid.
         */
        this.isValidValue = function (pattern,el,remote){
            var isValid = true;
            if (pattern)
                isValid = validateOnLocal(pattern,el);
            else if (remote){
                validateOnRemote(remote,el);
            }
            return isValid;
        };

        /**
         * check if one element of a form has a valid value using client side validation
         * @param {string} pattern - Pattern that will be validated
         * @param {Object} el - element that needs validation
         * @returns {boolean} true is the element validation is valid, false if the elements fails the validation
         */
        var validateOnLocal = function (pattern,el){
            var validatorLibrary = new ValidatorLibrary();
            var isValidValue = validatorLibrary.validate_data_type(pattern,el);
            if(validatorLibrary.isRegexPattern()){
                isValidValue = new RegExp(pattern).test(el.value);
            }
            return isValidValue;
        };

        /**
         * check if one element of a form has a valid value using remote validation
         * @param {string} pattern - Pattern that will be validated
         * @param {Object} el - element that needs validation
         * @returns {boolean} true is the element validation is valid, false if the elements fails the validation
         */
        var validateOnRemote = function (remote,el){
            new RemoteValidator().validateDataOnRemote(remote,el);
        };

        /**
         * adds data to an element if the object is available in the elements configuration object
         * @param {Object} form - form that needs validation
         * @param {elements} elements - configuration used to generate the form
         * @returns {boolean} true is the element validation is valid, false if the elements fails the validation
         */
        var addValidationData = function(form, elements){
            var sections = elements.sections,
                $form = $(form),
                i, j, sectionElements, element;
            for (i=0; sections && i<sections.length; i++){
                sectionElements = sections[i].elements ||[];
                for (j=0; j < sectionElements.length; j++){
                    element = sectionElements[j];
                    if (element.remote){
                        var $elem = $form.find('#'+element.id);
                        $elem.data('remote',element.remote); //TODO: Refactor information added to data() to be included in the template rather than looping to find the element and adding data()
                        $elem.data('validationError',element.error); //TODO: Refactor information added to data() to be included in the template rather than looping to find the element and adding data()
                        $elem.data('remotedata', "");
                    } else if(element.callbackValidation){
                        var $elem = $form.find('#'+element.id);
                        $elem.data('callbackValidation',element.callbackValidation);
                        $elem.data('callbackDefaultError',element.error);
                        if(element.hasOwnProperty("element_checkbox") || element.hasOwnProperty("element_radio")) {
                            for(var k=0; k<element.values.length; k++) {
                                var $elem_value = $form.find('#'+element.values[k].id);
                                $elem_value.data('callbackValidation',element.callbackValidation);
                                $elem_value.data('callbackDefaultError',element.error);
                            }
                        }
                    }
                }
            }
        };

        /**
         * Shows & highlights the inline error next to the integrated widget in form
         * @param {Object} el - element that needs to show error message
         */
        this.showFormInlineError = function (el){
            formValidatorLib.addErrorMessage(el);
        };

        /**
         * Hides the inline error next to the integrated widget in form
         * @param {Object} el - element that needs to hide error message
         */
        this.hideFormInlineError = function (el){
            formValidatorLib.removeErrorMessage(el);
        };

    };

    return FormValidator;
});