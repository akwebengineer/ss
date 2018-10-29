/**
 * A module that measures the password strength
 *
 * @module PasswordStrength
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(['pwstrength', 'widgets/form/formTemplates', 'lib/template_renderer/template_renderer'],  /** @lends PasswordStrength */
    function(pwstrength, FormTemplates, render_template) {

    /**
     * PasswordStrength constructor
     *
     * @constructor
     * @class PasswordStrength - Measures the password strength
     *
     * @param {Object} $form - jQuery object with the form built by the form widget
     *
     * @returns {Object} Current PasswordStrength's object: this
     */
    var PasswordStrength = function($form){

        var $password,
        pwstrengthConf,
        formTemplate = new FormTemplates();
        
       
        /**
         * Creates the password-strength meter by passing the configuration to pwstrength library.  
         * If password-strength configuration object is empty, the default options from pwstrength library will be used.
         *
         * @param {String} password_id - id of the password element for which strength has to be computed
         * @param {Object} options - pwstrength configuration
         * @param {Object} $elements - jQuery object of element_password for which password-strength has to be created.
         *
         */
        this.createPasswordStrengthBar = function(password_id, options, $elements) {
            var passwordStrengthTemplate = render_template(formTemplate.getPartialTemplates().passwordStrength);
            var passwordStrengthSelector = $(passwordStrengthTemplate);
            pwstrengthConf = options;
            $password = $elements.find("#"+password_id);
            var $verdict_location= passwordStrengthSelector.filter('.verdict-location');
            var $password_strength_location= passwordStrengthSelector.filter('.password-strength-location');
            $password.parent().append($password_strength_location)
            .append($verdict_location);
            
            if(_.isObject(pwstrengthConf)){
                $password.pwstrength(pwstrengthConf);
            }

            else if(_.isBoolean(pwstrengthConf)) {
                $password.pwstrength();
            }

            var $meter = $elements.find('.meter');
            var separator = passwordStrengthSelector.filter('.separator');
            $meter.append(separator);
        };

         
    };
       
    return PasswordStrength;

});