/**
 * A view superclass for create UTM Web-filtering Profile wizard form
 *
 * @module webFilteringStepView.js
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    '../views/utmUtility.js'
], function (Backbone, UTMUtility) {

    var WebFilteringStepView = Backbone.View.extend({

        initialize: function(options) {
            this.context = options.context;
            this.model = options.model;
            _.extend(this, UTMUtility);

            return this;
        },

        /**
         * Get summary for a step view in the wizard
         */
        getFormSummary: function(summary){
            var sections = this.formWidget.conf.elements.sections;

            for (var i=0; i<sections.length; i++) {
                for (var j=0; j<sections[i].elements.length; j++) {
                    var summaryData = this.getSummaryData(sections[i].elements[j]);
                    if (summaryData) {
                        summary.push(summaryData);
                    }
                }
            }

            return summary;
        },

        /**
         * Get label and value of each input element defined in the form configuration for summary
         */
        getSummaryData: function(element) {
            var value = this.model.get(element.name);

            // If it is a dropdown, use label for summary
            if (element.element_dropdown) {
                for (var i=0; i<element.values.length; i++) {
                    if (value === element.values[i].value) {
                        value = element.values[i].label;
                        break;
                    }
                }
            }

            if (value && element.label) {
                return {
                    label: element.label,
                    value: this.htmlEncode(value)
                };
            }

            return undefined;
        }
    });

    return WebFilteringStepView;
});