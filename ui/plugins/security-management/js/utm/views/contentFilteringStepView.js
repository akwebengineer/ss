/**
 * A view superclass for content filtering profile create wizard step views
 *
 * @module ContentFilteringStepView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'lib/validator/extendedValidator',
    'text!../../../../sd-common/js/templates/utmReference.html',
    '../views/utmUtility.js',
    '../views/contentFilteringUtility.js'
], function (Backbone, validator, referenceTpl, UTMUtility, ContentFilteringUtility) {
    var reference_url = 'http://www.juniper.net/techpubs/en_US/junos12.1/topics/concept/utm-content-filtering-overview.html';

    var ContentFilteringStepView = Backbone.View.extend({

        initialize: function() {
            this.context = this.options.context;
            this.model = this.options.model;
            _.extend(ContentFilteringUtility, UTMUtility);
            _.extend(this, ContentFilteringUtility);
            return this;
        },

        addReferenceLink: function(target) {
            var data = {'reference': {
                'href': reference_url,
                'text': this.context.getMessage('utm_content_filtering_reference_text')
            }}
            target.parent().parent().parent().append(Slipstream.SDK.Renderer.render(referenceTpl, data));
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

        generateSummary: function(title_tag, description_tag) {
            var summary = [];
            var self = this;

            summary.push({
                label: self.context.getMessage(title_tag),
                value: ' '
            });
            this.getFormData();

            var formLabelHashmap = this.formLabel;
            var formDataHashmap = this.formData;

            for(var key in formDataHashmap){
                var value = '',
                    label = '',
                    length = 0;

                label = formLabelHashmap[key];
                value = formDataHashmap[key];
                if(value){
                    length = value.split(/\s*,\s*/).length;
                }

                summary.push({
                    label: label,
                    value: self.context.getMessage(description_tag, [length])
                });
            }

            return summary;
        }
    });

    return ContentFilteringStepView;
});