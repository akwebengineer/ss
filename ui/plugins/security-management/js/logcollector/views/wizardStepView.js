/**
 *  A view superclass for create Alert/Report wizard form
 *
 *  @module LogCollector
 *  @author Aslama Developers <aslama@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
    'backbone'
], function (Backbone
             ) {

    var wizardStepView = Backbone.View.extend({
        initialize: function(options) {
            this.context = this.options.context;
            this.activity = this.options.activity;
            //this.page = options.page;
            this.model = this.options.model;

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
                if( ele.type!="submit" && ele.type != "password" && ele.id != "use_node_1_pasword_status") {
                    if (ele.type !="radio" && ele.type != "checkbox") {
                        if(ele.type === 'select-one') {
                            if($(ele).val()) {
                                self.formData[ele.id] = $(ele).find("option:selected").text().replace(reg, '').trim();
                            }
                        }else if(ele.type === 'select-multiple' && $(ele).val() != null) {
                            self.formData[ele.id] = $(ele).val().toString();
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
                label:  title_tag,
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
                    value: value
                });
            }

            return summary;
        }
        
    });

    return wizardStepView;
});