/**
 * A module that builds a form from a template and configuration objects.
 * The configuration is composed by the elements of the form: conf.elements and
 * the prepopulated values for each elements: conf.values
 *
 * @module FormWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'widgets/form/baseFormWidget',
    'widgets/form/widgetsIntegration'
], /** @lends FormWidget */
    function(BaseFormWidget, widgetsIntegration) {

    /**
     * FormWidget constructor
     *
     * @constructor
     * @class FormWidget - Builds a form from a template and configuration objects.
     *
     * @param {Object} conf - configuration object with three parameters:
     * container: define the container where the widget will be rendered
     * elements: define which elements will be part of the form
     * <values>: define the value of the elements
     */
    var FormWidget = function(conf){

        /**
         * Inherits from BaseFormWidget all required functionality
         */
        BaseFormWidget.call(this, conf, widgetsIntegration);

    };

    FormWidget.prototype = Object.create(BaseFormWidget.prototype);
    FormWidget.prototype.constructor = FormWidget;

    return FormWidget;
});