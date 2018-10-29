/**
 * A module that enables visibility of some form elements based on the value of another form element
 *
 * @module VisibilitySelector
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([],  /** @lends VisibilitySelector */
    function() {

    /**
     * VisibilitySelector constructor
     *
     * @constructor
     * @class VisibilitySelector - Enables visibility of a form element based on the value of another form element
     *
     * @param {Object} $form - jQuery object with the form built by the form widget
     * @param {Object} formConfigurationById - configuration of the form by element id

     * @returns {Object} Current VisibilitySelector's object: this
     */
    var VisibilitySelector = function($form, formConfigurationById){

        var formConfigurationHash = _.extend({},formConfigurationById);

        /**
         * Updates the visibility of an input, radio button or checkbox element and its group as per the visibility property
         */
        this.addVisibleElements = function (formConfigurationById) {
            if (!_.isUndefined(formConfigurationById)) {
                formConfigurationHash = _.extend({}, formConfigurationById);
            }
            var checkBoxAndRadioButtons = $form.find('.optionselection>input'),
                toggleButtons = $form.find('.toggle-button-widget input:first-of-type'),
                inputs = $form.find('.elementinput>input'),
                groups = {},
                group, groupName, radioChecked, i, $input;
            for (i=0; i<checkBoxAndRadioButtons.length; i++) {
                var $element = $(checkBoxAndRadioButtons [i]);
                if ( $element.attr("type") ==  "radio") {
                    groupName = $element.attr("name");
                    group = $form.find('[name='+groupName+']'),
                    radioChecked = group.filter(':checked');
                    if (radioChecked.length) {
                        if (typeof(groups[groupName])=="undefined") {
                            groups[groupName] = $(radioChecked[0]); //only 1 element can be checked
                            this.updateBasedOnRadioButtonAndCheckbox(groups[groupName], group);
                        }
                    } else {
                        this.updateBasedOnRadioButtonAndCheckbox($element, group);
                    }
                } else {
                    this.updateBasedOnRadioButtonAndCheckbox($element);
                }
            }
            for (i=0; i<toggleButtons.length; i++){
                $input = $(toggleButtons[i]);
                updateBasedOnToggleButton($input);
            }
            for (i=0; i<inputs.length; i++){
                $input = $(inputs[i]);
                this.updateBasedOnInput($input);
            }
        };

        /**
         * Updates the visibility of elements that belong to a group (like check box, radio button or drop down) by getting data ready for the updateVisibility method
         * @param {String} parentId - id of the parent element of a check box or radio button input
         * @param {string} id - id of the element
         * @param {Object} $element - jQuery input element
         * @param {boolean} isValid - indicates if the value of the element
         * @inner
         */
        var updateElementVisibility = function (parentId, elementId, $element, isValid) {
            if (formConfigurationHash[parentId] && formConfigurationHash[parentId].valuesHash && formConfigurationHash[parentId].valuesHash[elementId] && formConfigurationHash[parentId].valuesHash[elementId].visibility ) {
                var elementConfiguration = formConfigurationHash[parentId].valuesHash[elementId];
                updateVisibility(elementId, $element, elementConfiguration, isValid);
            }
        };

        /**
         * Updates the visibility of the radio button or checkbox element and its group as per its visibility property
         * @param {Object} $el - jQuery element that was selected
         * @param {Object} group - Group which the radio button or checbox element belongs to
         */
        this.updateBasedOnRadioButtonAndCheckbox = function ($el, group){
            var elementType = $el.attr('type'),
                parentId = $el.attr("name"), //id of the checkbox element that should match the name attribute of the input checkbox as per convention in the Slipstream form
                elementId;

            if (elementType == "radio") {
                for (var i=0; i < group.length; i++) {
                    elementId = group[i].id;
                    updateElementVisibility(parentId, elementId, $(group[i]));
                }
            } else if (elementType == "checkbox") {
                elementId = $el.attr('id');
                updateElementVisibility(parentId, elementId, $el);
            }
        };

        /**
         * Updates the visibility of a dropdown element as per its visibility property
         * @param {string} parentId - id of the dropdown widget
         * @param {string} widgetIdentifier - identifier of the dropdown widget
         * @param {Object} instantiatedWidgets - instantiated widgets hash
         * @returns {function} function to be called everytime an update in the value of the dropdown happens
         */
        this.updateBasedOnDropdown = function (parentId, widgetIdentifier, instantiatedWidgets){
            var $dropDown = $form.find('#'+parentId),
                dropdowDataHash = formConfigurationHash[parentId].valuesHash,
                elementData,
                setDropDownVisibility = function (selectedOptionId) {
                    var selectedElementData;
                    for (var key in dropdowDataHash) {
                        elementData = {
                            "$el": $dropDown,
                            "value": key,
                            "isValidValue": selectedOptionId ? selectedOptionId == key : (dropdowDataHash[key].selected || false)
                        };
                        //resets visibility elements for all drop down items (if not selection) OR all items except the selected one
                        if (_.isUndefined(selectedOptionId) || selectedOptionId != key) {
                            updateElementVisibility(parentId, key, $dropDown, elementData);
                        } else {
                            selectedElementData = elementData;
                        }
                    }
                    //sets visibility elements for the selected drop down item
                    if (selectedElementData) {
                        updateElementVisibility(parentId, selectedOptionId, $dropDown, selectedElementData);
                    }
                };
            setDropDownVisibility();

            return function () {
                var selectedOptionId = instantiatedWidgets[widgetIdentifier].instance.getValue();
                setDropDownVisibility(selectedOptionId);
            }
        };

        /**
         * Provides an array if the input is a string
         * @param {Array/String} value
         * @inner
         */
        var getArray = function (value) {
            if (typeof(value) == "string")
                return [value];
            return value;
        };

        /**
         * Provides a boolean is the input is a boolean otherwise the default undefined of the function is returned
         * @param {Boolean} value
         * @inner
         */
        var getBoolean = function (value) {
            if (_.isBoolean(value))
                return value;
        };

        /**
         * Checks if a form element (input, radio or checkbox) has a valid value
         * @param {Object} $el - jQuery Object of the element to be tested
         * @inner
         */
        var isValidValue = function ($el) {
            switch ($el.attr('type')) {
                case 'checkbox':
                    return $el.is(':checked');
                case 'radio':
                    return $el.is(':checked');
            }
            var hasNotError = $el.next('.error').css('display') == 'none',
                hasValue = $el.val() != "" ;
            return hasNotError && hasValue;
        };

        /**
         * Shows or hides an element depending on its value
         * @param {Object} $el - jQuery Object of the element to be tested
         * @inner
         */
        var indentElement = function ($el) {
            var $row = $el.closest('.row');
            $row.addClass("indent_visibility_element");
        };

        /**
         * Shows or hides an element depending on its value
         * @param {Object} $el - jQuery Object of the element to be tested
         * @param {Boolean} isExpectedValue - indicates if the value should be shown or hidden
         * @inner
         */
        var showHideRowSection = function ($el, isExpectedValue) {
            var showHide = function ($element) {
                if (isExpectedValue) {
                    $element.removeClass("hide");
                } else {
                    $element.addClass("hide");
                }
            };

            if ($el.hasClass("form_section")) {
                showHide($el.find(".section_content > .row"));
                showHide($el)
            } else {
                showHide($el.closest('.row'))
            }
        };

        /**
         * Disables a row depending if the provided value is valid and the disabled property of the visibility object
         * @param {Object} $el - jQuery Object of the element to be tested
         * @param {Boolean} isExpectedValue - indicates if the value is valid
         * @param {Boolean} isDisable - indicates if the form element should be disabled
         * @inner
         */
        var disableRow = function ($el, isExpectedValue, isDisable) {
            if ($el.length) {
                $el.prop('disabled',isExpectedValue && isDisable);
            }
        };

        /**
         * Makes a row required depending on the value and the required property of the visibility object
         * @param {Object} $el - jQuery Object of the element to be tested
         * @param {Boolean} isExpectedValue - indicates if the value is valid
         * @param {Boolean} isRequired - indicates if the form element should be required
         * @inner
         */
        var requireRow = function ($el, isExpectedValue, isRequired) {
            if ($el.length) {
                var isRequiredRow = isExpectedValue && isRequired,
                    $label = $el.closest('.row').find('.elementlabel label');
                if (isRequiredRow) {
                    $label.addClass('required');
                } else {
                    $label.removeClass('required');
                }
                $el.prop('required', isRequiredRow);
            }
        };

        /**
         * Updates the visibility of a toggleButton integrated widget element as per its visibility property
         * @param {Object} $el - jQuery input element
         */
        var updateBasedOnToggleButton = function ($el){
            var id = $el.attr("id"),
                $elParent = $el.closest(".toggle-button-widget"),
                elValue = $elParent.find('input.toggle-button:checked').val(),
                getElementData = function (elementValue) {
                    return {
                        "$el": $elParent,
                        "value": elementValue,
                        "isValidValue": elementValue
                    };
                },
                elementConfiguration;
            if (formConfigurationHash[id] && formConfigurationHash[id].visibility) {
                elementConfiguration = formConfigurationHash[id];
                updateVisibility(id, $el, elementConfiguration, getElementData(elValue));
                $elParent.bind("slipstreamToggleButton:onChange", function (e, val) {
                    updateVisibility(id, $el, elementConfiguration, getElementData(val.updatedValue));
                });
            }
        };

        /**
         * Updates the visibility of an input element as per its visibility property
         * @param {Object} $el - jQuery input element
         */
        this.updateBasedOnInput = function ($el){
            var id = $el.attr("id"),
                elementConfiguration;
            if (formConfigurationHash[id] && formConfigurationHash[id].visibility) {
                elementConfiguration = formConfigurationHash[id];
                updateVisibility(id, $el, elementConfiguration);

            }
        };

        /**
         * Updates the visibility of an input element as per its visibility property
         * @param {string} id - id of the element
         * @param {Object} $el - jQuery input element
         * @param {Object} elementConfiguration - form configuration of the element
         * @param {Object} elementData - optional, data associated to an element composed by the properties: $el (jQuery object of the element), value (value of the element) and isValidValue (boolean to indicate if the value is valid)
         */
        var updateVisibility = function (id, $el, elementConfiguration, elementData){
            var getElementData = function ($el) {
                    return {
                        "$el": $el,
                        "value": $el.val(),
                        "isValidValue": isValidValue($el)
                    }
                },
                getExpectedValue = function (linkedElementsData){
                    var isExpectedValue = true;
                    linkedElementsData.forEach(function(elementData){
                        isExpectedValue = isExpectedValue && elementData.isValidValue;
                    });
                    return isExpectedValue;
                },
                linkedElementsData = [],
                linkedIds, visibilityIds, $visibilityElement, isExpectedValue, disabled, required;

            var visibility = elementConfiguration.visibility;
            elementConfiguration.$el = elementConfiguration.$el || $el;

            if (_.isObject(visibility) && !_.isArray(visibility)) {
                var inputElementData = elementData || getElementData($el),
                    linkedIds = _.isFunction(visibility.linkedIds) ? visibility.linkedIds([inputElementData]) : getArray(visibility.linkedIds);
                linkedElementsData.push(inputElementData);
                if (linkedIds) {
                    linkedIds.forEach(function(linkedId){
                        formConfigurationHash[linkedId].$el = formConfigurationHash[linkedId].$el || $form.find('#'+linkedId);
                        linkedElementsData.push(getElementData(formConfigurationHash[linkedId].$el));
                    });
                }
                isExpectedValue = _.isFunction(visibility.isExpectedValue) ? visibility.isExpectedValue(linkedElementsData) : getExpectedValue(linkedElementsData);
                visibilityIds = _.isFunction(visibility.visibilityIds) ? visibility.visibilityIds(linkedElementsData) : getArray(visibility.visibilityIds);
                disabled = _.isFunction(visibility.disabled) ? visibility.disabled(linkedElementsData) : getBoolean(visibility.disabled);
                required = _.isFunction(visibility.required) ? visibility.required(linkedElementsData) : getBoolean(visibility.required);
            } else {
                isExpectedValue = elementData ? elementData.isValidValue : getElementData($el).isValidValue;
                visibilityIds = getArray(visibility);
            }

            visibilityIds.forEach(function(visibilityId){
                $visibilityElement = $form.find('#'+visibilityId);
                indentElement($visibilityElement);
                if (_.isBoolean(disabled)){ //disabled element
                    disableRow($visibilityElement, isExpectedValue, disabled);
                } else if (_.isBoolean(required)){
                    requireRow($visibilityElement, isExpectedValue, required);
                } else { //hide row with the element
                    showHideRowSection($visibilityElement, isExpectedValue);
                }
            });

        };

    };

    return VisibilitySelector;

});