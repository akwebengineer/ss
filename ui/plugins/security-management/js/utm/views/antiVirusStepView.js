/**
 * A view superclass for create UTM Anti-Virus Profile wizard form
 *
 * @module antiVirusStepView.js
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    './utmUtility.js'
], function (Backbone, UTMUtility) {
    
    var antiVirusStepView = Backbone.View.extend({

        initialize: function() {
            this.context = this.options.context;
            this.model = this.options.model;

            _.extend(this, UTMUtility);

            return this;
        },

        getFormData: function() {
            var self = this,
                reg = /[\f\n\r\t]/g; // Match characters such as form feed character, line break, tab character.
            this.formData = {};
            this.formLabel = {};
            this.$el.find('form label').each( function(i, ele) {
                self.formLabel[ele.getAttribute('for')] = this.textContent.replace(reg, '').trim();
            });

            this.$el.find('form :input').each( function(i, ele) {
                if( ele.type!="submit" ) {
                    if (ele.type !="radio" && ele.type != "checkbox") {
                        if(ele.type === 'select-one') {
                            // For dropdown list, get the select option text as value
                            if($(ele).val()) {
                                self.formData[ele.id] = $(ele).find("option:selected").text().replace(reg, '').trim();
                            }
                        }else {
                            self.formData[ele.id] = $(ele).val();
                        }
                    } else if (ele.checked) {
                        self.formData[ele.id] = $(ele).val();
                    }
                }
            });
            return this.formData;
        },

        generateSummary: function(title_tag) {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage(title_tag),
                value: ' '
            });
            this.getFormData();

            var formLabelHashmap = this.formLabel;
            var formDataHashmap = this.formData;

            for(key in formDataHashmap){
                var value = '',
                    label = '';

                label = formLabelHashmap[key];
                value = formDataHashmap[key];

                summary.push({
                    label: label,
                    value: this.htmlEncode(value)
                });
            }

            return summary;
        }
    });

    return antiVirusStepView;
});