/**
 * A object for some common validation methods.
 *
 * @module ValidationUtility
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    /**
     * Used to validate description textarea, it must be a string excluding '&', '<', '>'
     */
    var doValidateDescription = function(context, comp, maxLength) {
        var textValue = comp.val(),
            descriptionPattern = /^[^&<>]*$/;

        comp.invalidMsg = '';

        if (textValue)
        {
            if (!descriptionPattern.test(textValue)) {
                comp.invalidMsg = context.getMessage('description_illegal_error', [maxLength]);
                return;
            } 

            doValidateLength(context, comp, maxLength);
        }
        return;
    };

    /**
     * Used to validate length for textarea, it's a temporary workaround.
     */
    var doValidateLength = function(context, comp, maxLength) {
        var textValue = comp.val();
        // Initialize the message
        comp.invalidMsg = '';
        if(maxLength) {
            if(comp.val().length > maxLength)  comp.invalidMsg = context.getMessage('maximum_length_error', [maxLength]);
        }
        return;
    };

    /**
     * Used to validate DNS name for text input, it's a temporary workaround.
     */
    var doValidateDnsName = function(context, comp, maxLength) {
        var textValue = comp.val();

        if (!textValue) {
            return true;
        }
        // Check max length if it is needed
        if (maxLength) {
            if(comp.val().length > maxLength) return false;
        }
        // Check DNS pattern
        var re = /(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;
        if (!re.test(textValue)) {
            return false;
        }

        return true;
    };

    var ValidationUtility  = {

        /**
         * Used to add some subsidiary functions.
         * For example: bind some common validation to components
         */
        addSubsidiaryFunctions: function(elements) {
            var sections = elements.sections;

            for (var i=0; i<sections.length; i++) {
                for (var j=0; j<sections[i].elements.length; j++) {
                    var element = sections[i].elements[j],
                        comp = this.$el.find('#'+element.id);
                    // Bind validations
                    if (element.post_validation && element.post_validation == "lengthValidator"){
                        comp.bind('lengthValidator',$.proxy(this.validateLength, this, comp, element.max_length, element.error));
                    } else if (element.post_validation && element.post_validation == "dnsNameValidator") {
                        comp.bind('dnsNameValidator',$.proxy(this.validateDnsName, this, comp, element.max_length, element.error));
                    } else if (element.post_validation && element.post_validation == "descriptionValidator"){
                        comp.bind('descriptionValidator',$.proxy(this.validateDescription, this, comp, element.max_length));
                    }
                }
            }
        },

        /**
         * Used to validate description area, it's a temporary workaround. It must be a string excluding '&', '<', '>' and '\n'.
         */
        validateDescription: function(comp, maxLength){
            doValidateDescription(this.context, comp, maxLength);
            this.showErrorInfo(comp);
        },

        /**
         * Used to validate lengh for textarea, it's a temporary workaround.
         */
        validateLength: function(comp, maxLength, error){
            if (comp.attr("data-invalid") === undefined) {
                doValidateLength(this.context, comp, maxLength);
                if (comp.invalidMsg) {
                    this.showErrorInfo(comp);
                }
            } else {
                // Show the predefined error
                comp.invalidMsg = error;
                this.showErrorInfo(comp);
            }
        },

        /**
         * Used to validate lengh for textarea, it's a temporary workaround.
         */
        validateDnsName: function(comp, maxLength, error){
            if (comp.attr("data-invalid") === undefined) {
                if (!doValidateDnsName(this.context, comp, maxLength)) {
                    comp.invalidMsg = error;
                    this.showErrorInfo(comp);
                }
            } else {
                // Show the predefined error
                comp.invalidMsg = error;
                this.showErrorInfo(comp);
            }
        },

        /**
         * Used to show error information for textarea, it's a temporary workaround.
         */
        showErrorInfoForTextarea: function(comp) {
            var self = this;
            var errorTarget = comp[0].id + '-error';
            var errorObj = $('#' + errorTarget);
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

        /**
         * Used to show error information for input, it's a temporary workaround.
         */
        showErrorInfoForInput: function(comp) {
            comp.attr("data-invalid", "").parent().addClass('error');
            comp.parent().prev().addClass('error');
            comp.parent().find("small[class*='error']").html(comp.invalidMsg);
        },

        /**
         * Used to show error information for input&textarea, it's a temporary workaround.
         */
        showErrorInfo: function(comp) {
            if(comp && comp[0]){
                if(comp[0].type === 'textarea'){
                    this.showErrorInfoForTextarea(comp);
                }else if(comp[0].type === 'text'){
                    this.showErrorInfoForInput(comp);
                }
            }
        },

        /**
         * Used to check if textarea in this form is valid.
         */
        isTextareaValid: function(){
            if(this.$el.find('textarea').parent().filter( ".error" ).length > 0){
                return false;
            }else{
                return true;
            }
        },

        /**
         * Use the function to workaround,
         * for some fields (not required) with post_validation cannot be checked by formWidget.isValidInput()
         */
        isFormValid: function(form_id) {
            if (form_id) {
                var inputFields = this.$el.find("#"+form_id).find("div:visible").find("input[data-invalid]");

                if (inputFields.length > 0) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Used to validate Email ID's by using pattern
         * @param  {[string]} emailID
         */
        isValidEmail: function(emailID) {
            var pattern =  /^[a-zA-Z0-9][a-zA-Z0-9_\.\-]+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/i;
            if(emailID) {
                if(!pattern.test(emailID)) {

                    return false;
                }
            }
            return true;
        } //
    };

    return ValidationUtility;
});