/**
 * Configuration required for password-strength indicator
 *
 * @module PasswordStrength Configuration
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var passwordStrengthConf = {};


   /**
    * Information about pwstrength configuration options: https://github.com/edtownend/jquery.pwstrength.foundation/blob/master/OPTIONS.md
    *
    */
   passwordStrengthConf.ui = {   
                    "showProgressBar": true,
                    "useVerdictCssClass": true,
                    "verdicts": ["Weak", "Weak", "Good", "Good", "Strong"],
                    "viewports": {
                        "progress":'.password-strength-location',
                        "verdict": '.verdict-location'
                 } 
        };

    /**
     * Custom rules can be added in "extra" configuration option. To activate the rule, put the rule in "activated" configuration and mark it as true. 
     * Similarly, mark the rule as false in "activated" configuration to deactivate it.
     * Every rule will return a score. Based on this score the password-strength progressbar will be changed.
     * The score for each rule can also be preconfigured. 
     */
    passwordStrengthConf.rules = {
                    "extra": {

                        oneLowerCase: function(options, word, score) {
                            if(!word.match(/(?=.*[a-z])/)) {
                                return score;
                            }
                            return 0;
                        },

                        oneUpperCase: function(options, word, score){
                            if(!word.match(/(?=.*[A-Z])/)) {
                                return score;
                            }
                            return 0;
                        },

                        oneNumber: function(options, word, score) {
                            if(!word.match(/(?=.*\d)/)) {
                                return score;
                            }
                            return 0;
                        },
                        numberNotLast: function(options, word, score) {
                            if(!word.match(/(.*[^\d]$)/)) {
                                return score;
                            }
                            return 0;

                        },

                        hasThreeSamecharacter: function(options, word, score) {
                            if(word.match(/([a-zA-Z0-3])\1{2,}/)) {
                                return score;
                            }
                            return 0;
                        }
                    },

                    "activated": {
                    	"oneUpperCase": true,
                    	"oneLowerCase": true, 
                        "oneNumber": true,
                        "numberNotLast": true,
                        "wordThreeNumbers": true,
                        "wordOneSpecialChar": true,
                        "wordTwoSpecialChar": true,
                        "wordUpperLowerCombo": true,
                        "wordLetterNumberCombo": true,
                        "wordLetterNumberCharCombo": true,
                        "hasThreeSamecharacter": true,
                    	"wordNotEmail": false,
                    	"wordLength": true,
                    	"wordSequences": false,
                    	"wordTwoCharacterClasses": false,
                    	"wordRepetitions": false,
                    	"wordLowercase": false,
                    	"wordUppercase": false,
                    	"wordOneNumber": false
                           
                    },

                    "scores": {
                        "oneLowerCase": -20,
                        "oneUpperCase": -20,
                        "oneNumber": -20,
                        "numberNotLast": -30,
                        "wordThreeNumbers": 10,
                        "wordOneSpecialChar": 5,
                        "wordTwoSpecialChar": 10,
                        "wordUpperLowerCombo": 5,
                        "wordLetterNumberCombo": 5,
                        "wordLetterNumberCharCombo": 15,
                        "hasThreeSamecharacter": -30

                    },
                    "raisePower": 0
               }

      return passwordStrengthConf;

});