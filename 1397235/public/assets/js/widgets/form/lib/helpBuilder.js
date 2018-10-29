/**
 * A module that builds the helpWidget used in the form widget
 *
 * @module TooltipBuilder
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'widgets/help/helpWidget'
],  /** @lends HelpBuilder */
    function(HelpWidget) {

    /**
     * HelpBuilder constructor
     *
     * @constructor
     * @class HelpBuilder - Builds the helpWidget used in the form widget
     *
     * @returns {Object} Current HelpBuilder's object: this
     */
    var HelpBuilder = function(formContainer, conf){

        /**
         * Builds the HelpBuilder
         * @returns {Object} Current instance
         */

        /**
         * Adds help to title and content of the Form widget
         */
        this.addHelpIcons = function (){
            //Builds info help for the title of Form
            if (conf.elements['title-help']){
                new HelpWidget({
                    "container": formContainer.find('.slipstream-content-title').eq(0),
                    "view":  conf.elements['title-help']
                }).build();
            }

            new HelpWidget({
                "container": formContainer.find('.form-content:first'),
                "size": "small"
            }).build();
        };

        /**
         * Adds help to the elements from form rows or sections
         * @param {Object} $elements - DOM object of the elements that should have help
         */
        this.addElementsHelp = function ($elements){
            new HelpWidget({
                "container": $elements,
                "size": "small"
            }).build();
        };
    };
    return HelpBuilder;
});