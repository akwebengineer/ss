/**
 * A view superclass for resource create and modify forms
 *
 * @module APIResourceView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'lib/validator/extendedValidator'
], function (Backbone,
       validator
    ) {

    var CreateWizardStepView = Backbone.View.extend({

        initialize: function() {
            this.context = this.options.context;
            this.model = this.options.model;
            return this;
        },
        getFormData: function(){
            this.formData = {};
            this.formLabel = {};
            var self = this;
            this.$el.find('form label').each( function(i, ele) {
                self.formLabel[ele.getAttribute('for')] = this.textContent;
            });

            this.$el.find('form :input').each( function(i, ele) {
                if( ele.type!="submit" ){
                    if (ele.type !="radio" && ele.type != "checkbox"){
                        self.formData[ele.id] = $(ele).val();
                    } else if (ele.checked){
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

            for(key in formDataHashmap){
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
        },

        bindBlur: function(nameArr) {
            var self = this;
            $.each(nameArr, function(index, value) {
                var target = '#' + value;
                self.$el.find(target).on('blur', function(){
                    self.onBlur($(this));
                });
            });
        },

        onBlur: function(comp) {
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
         * Used to bind custom validation to components.
         */
        bindValidation: function(nameArr, limit, max) {
            var self = this;
            $.each(nameArr, function(index, value) {
                var comp = self.$el.find('#' + value);
                comp.bind('customValidator', $.proxy(self.doValidateValue, self, comp, limit, max))
                    .bind('lengthValidator', $.proxy(self.doValidateLength, self, comp, limit));
            });
        },

        /**
         * Used to show business error info for textarea currently.
         */
        showErrorInfo: function(comp) {
            var self = this;
            var errorTarget = comp[0].id + '-error';
            var errorObj = self.$el.find('#' + errorTarget);
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

        doValidateLength: function(comp, limit, max){
            var self = this;
            self.validateLength(comp, limit);
            self.showErrorInfo(comp);
        },

        /**
         * Used to validate lengh for textarea, it's a temporary workaround.
         */
        validateLength: function(comp, limit){
            var self = this;
            var textValue = comp.val();
            // Initialize the message
            comp.invalidMsg = '';
            if(comp.val().length > limit)  comp.invalidMsg = self.context.getMessage('maximum_length_error', [limit]);
            return;
        },

        doValidateValue: function(comp, limit, max){
            var self = this;
            self.validateValue(comp, limit, max);
            self.showErrorInfo(comp);
        },

        /**
         * Used to validate value according to some business rules.
         */
        validateValue: function(comp, limit, max) {
            var self = this;
            var textValue = comp.val(),
                valueArr,
                count = 0,
                value,
                i = 0,
                mimePattern = /^([a-zA-Z]|_)([a-zA-Z]|[0-9]|_|-)*\/(([a-zA-Z]|_)([a-zA-Z]|[0-9]|_|-)*)*$/;
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
                            if (value.length > limit) {
                                comp.invalidMsg = self.context.getMessage('utm_content_filtering_length_error_for_each_value', [limit]);
                                return;
                            }
                            // Validation for file extension and block command
                            if (comp.attr('id') === 'block-file-extension-list'
                                    || comp.attr('id') === 'block-command-list'
                                    || comp.attr('id') === 'permit-command-list') {
                                if (validator.hasSpace(value)) {
                                  comp.invalidMsg = self.context.getMessage('utm_content_filtering_space_error');
                                  return;
                                }
                            }

                            if (comp.attr('id') === 'block-mime-exception-list' || comp.attr('id') === 'block-mime-list') {
                                if (!mimePattern.test(value)) {
                                  comp.invalidMsg = self.context.getMessage('utm_content_filtering_mime_error', [value]);
                                  return;
                                }
                            }
                        }
                    }
                    if (count > max) {
                        comp.invalidMsg = self.context.getMessage('utm_content_filtering_total_count_error', [max,comp.parent().prev().find('label').text()]);
                        return;
                    }
                }
            }
        },

        /**
         * Used to check if textarea in this form is valid.
         */
        validateTextarea: function(){
            if(this.$el.find('textarea').parent().filter( ".error" ).length > 0){
                return false;
            }else{
                return true;
            }
        }
    });

    return CreateWizardStepView;
});
