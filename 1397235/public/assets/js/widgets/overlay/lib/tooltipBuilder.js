/**
 * A module that builds the tooltip used in the overlay widget
 *
 * @module TooltipBuilder
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
    'lib/template_renderer/template_renderer',
    'text!widgets/overlay/templates/helpTooltip.html',
    'widgets/tooltip/tooltipWidget'
],  /** @lends TooltipBuilder */
    function(render_template, TooltipTemplate, TooltipWidget) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the overlay widget
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function(conf){

        /**
         * Adds tooltip to the title of the Overlay widget
         * @param {Object} $containerElement - the container is used for the tooltip
         */
        this.addHeaderTooltip = function ($containerElement){
            /**
             * Builds a view for tooltip
             * @param {Object} help - object that will have configuration parameter for help
             */
            var getTooltip = function (help){
                var tooltipTemplate  = render_template(TooltipTemplate,{
                    'help-content':help['content'],
                    'ua-help-text':help['ua-help-text'],
                    'ua-help-identifier':help['ua-help-identifier']
                });
                return tooltipTemplate;
            };

            //Builds tooltip for the title of overlay
            var tooltip = getTooltip(conf['titleHelp']);
            
            new TooltipWidget({
                "container": $containerElement,
                "view": tooltip
            }).build();
        };
    };
    return TooltipBuilder;
});