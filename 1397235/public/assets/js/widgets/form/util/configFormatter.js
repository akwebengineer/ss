/**
 * A module that inserts values for drop downs, radio buttons or checkboxes elements to
 * a form configuration object.
 *
 * @module ConfigFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
], /** @lends ConfigFormatter */
    function () {

    /**
     * Construct a form configuration formatter for use in the form widget
     * @constructor
     * @class ConfigFormatter
     */
    var ConfigFormatter = function (formElements) {

        /**
         * Sets the focus on the first input element if it was not set in the configuration of the Form widget
         * And Updates Form configuration based on user provided Pattern value as String or Regex object
         * @param {Object} sections - JSON with sections part of configuration of the Form widget
         */
        var setAutoFocusElement = function (sections) {
            var noInputElements = ['element_ipCidrWidget', 'element_datePickerWidget', 'element_timeWidget', 'element_timeZoneWidget', 'element_checkbox', 'element_radio', 'element_dropdown', 'element_file'];
            for (var i = 0; i < sections.length; i++) {
                var elements = sections[i].elements;
                for (var j = 0; elements && j < elements.length; j++) {
                    var element = elements[j];
                    for (var key in element) {
                        if (key.slice(0, 8) == 'element_' && noInputElements.indexOf(key) < 0) {
                            element['onfocus'] = 'true';
                            return;
                        }
                    }
                }
            }
        };

        /**
         * Inserts index for multiple validation patterns in order to use the index as the order of validation
         * @param {Object} element- element object under sections that contains element_multiple_error === true
         */
        var updatePatternValueAndIndex = function (element) {
            var pattern = element['pattern-error'];
            for (var idx in pattern) {
                pattern[idx].index = 1 + parseInt(idx);
                if (pattern[idx].pattern && pattern[idx].pattern instanceof RegExp) {
                    pattern[idx]["regexObj"] = true;
                }
            }
        };


        /**
         * insert values to a form configuration object from a collection
         * @param {string} id - id of the element to be inserted
         * @param {Object} collection - collection with the values to be inserted
         * @returns {Object} element in the configuration object that matches the id
         */
        this.insertValuesFromCollection = function (id, collection) {
            var sections = formElements.sections;
            for (var i = 0; i < sections.length; i++) {
                var elements = sections[i].elements;
                for (var j = 0; j < elements && elements.length; j++) {
                    if (elements[j].id === id) {
                        elements[j].values = JSON.parse(JSON.stringify(collection.models));
                        return elements[j];
                    }
                }
            }
            return null;
        };

        /**
         * insert values to a form configuration object from a JSON object
         * @param {string} id of the element to be inserted
         * @param {Object} JSON with the values to be inserted
         * @returns {Object} element in the configuration object that matches the id
         */
        this.insertValuesFromJson = function (elementId, json) {
            var sections = formElements.sections;
            for (var i = 0; i < sections.length; i++) {
                var elements = sections[i].elements;
                for (var j = 0; j < elements && elements.length; j++) {
                    if (elements[j].id === elementId) {
                        elements[j].values = JSON.parse(json);
                        return elements[j];
                    }
                }
            }
            return null;
        };

        /**
         * insert values to a form configuration object from a JSON object
         * @param {string} sectionId - sectionId of the element to be inserted
         * @param {Object} sectionConf - JSON with the values to be inserted
         * @param {boolean} insertBefore - if it is set to true, it will insert the section before the sectionId otherwise it will insert it at the specified sectionId
         * @returns {Array} sections of the form elements configuration
         */
        this.insertElementsFromJson = function (sectionId, sectionConf, insertBefore) {
            var sections = formElements.sections;
            try {
                sectionConf = JSON.parse(sectionConf);
            } catch (e) {
                console.log("not JSON parsing performed");
            }

            if (_.isBoolean(insertBefore) && insertBefore) {
                sections.splice(sectionId, 0, sectionConf);
            } else {
                sections[sectionId] = sectionConf;
            }
            return sections;
        };

        /**
         * sets the focus on the first input element if it was not set in the configuration of the Form widget
         * @param {Object} confElements- JSON with the configuration of the Form widget
         * @returns {Object} form configuration grouped by id
         */
        this.formatConfigElements = function (confElements) {
            var sections = confElements.sections,
                isAutoFocusSet = false,
                configurationById = {};
            for (var i = 0; i < sections.length; i++) {
                var elements = sections[i].elements;
                if (elements) {
                    for (var j = 0; j < elements.length; j++) {
                        var element = elements[j],
                            isCheckboxRadioButton = element.element_checkbox || element.element_radio,
                            isDropDown = element.element_dropdown;
                        for (var key in element) {
                            if (key == 'onfocus' && !isAutoFocusSet) {
                                isAutoFocusSet = true;
                            }
                            if (key == 'pattern' && (element[key] instanceof RegExp)) {
                                element["regexObj"] = true;
                            }
                            if (key == 'pattern-error') {
                                updatePatternValueAndIndex(element);
                            }
                        }
                        if (typeof(element.id) == 'undefined')
                            element.id = _.uniqueId("slipstream_form_widget_element");

                        //adds a hashTable for the values of dropDown, radioButton and checkBox that are available as an Array
                        if ((isCheckboxRadioButton || isDropDown) && (element.values || element.data)) {
                            var values = element.values || element.data;
                            if (typeof(values) == 'string') {
                                values = JSON.parse(values);
                            }
                            element.valuesHash = {};
                            values.forEach(function (value) {
                                element.valuesHash[value.id || value.value] = value; //value.value provides compatibility for the values property (to be deprecated)
                            });
                        }

                        configurationById[element.id] = element;
                    }
                }
            }
            if (!isAutoFocusSet) {
                setAutoFocusElement(sections);
            }
            return configurationById;
        };
    };

    return ConfigFormatter;
});