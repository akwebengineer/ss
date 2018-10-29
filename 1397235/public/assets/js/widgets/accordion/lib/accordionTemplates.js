/**
 * A library that provides the templates required by the Accordion widget
 *
 * @module accordionTemplates
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'text!widgets/accordion/templates/accordionContainer.html',
    'text!widgets/accordion/templates/sectionContainer.html',
    'text!widgets/accordion/templates/stateIconContainer.html'
], /** @lends accordionTemplates */
    function(accordionContainer,
             sectionContainer,
             stateIconContainer
             ){

    /*
     * AccordionTemplates constructor
     *
     * @constructor
     * @class AccordionTemplates
     */
    var AccordionTemplates = function () {

        /**
         * Provides partial templates used by the accordion widget to create elements of the accordion.
         */
          this.getTemplates = function () {
              return {
                  "accordionContainer": accordionContainer,
                  "sectionContainer": sectionContainer,
                  "stateIconContainer": stateIconContainer
              }
          };

  };

    return AccordionTemplates;
});
