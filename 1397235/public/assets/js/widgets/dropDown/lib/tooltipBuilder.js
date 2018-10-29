/**
 * A module that builds the tooltip used in the DropDown widget
 *
 * @module TooltipBuilder
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/tooltip/tooltipWidget'
],  /** @lends TooltipBuilder */
    function(TooltipWidget) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the DropDown widget
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function(conf){
        var tooltipWidget;
        /**
         * Adds tooltips to DropDown widget
         * @param {Object} optionContainer - the list element where the mousemove event is triggered 
         */
        this.addContentTooltips = function (optionContainer){
            var dropdownValue = $(optionContainer).data('value');
            var tooltip_text = ' ';
            var tooltipConfig = {
                "minWidth": 100,
                "maxWidth": 100,
                "position": "left",
                "contentAsHTML": true,
                "style": "grid-widget",
                "animation": false,
                "contentCloning": false
            };

            if(_.isBoolean(conf.dropdownTooltip)) {
                tooltip_text = dropdownValue['tooltip_text'];
            }
            
            else if(_.isObject(conf.dropdownTooltip)) {                
                tooltipConfig.functionBefore = function($moreContainer, resume) {
                
                    var dropdownItemContainer = $moreContainer;
                    var setTooltipData = function (moreData){
                        resume();  
                        if(moreData){
                            !_.isUndefined(dropdownItemContainer.data('tooltipster-ns')) && dropdownItemContainer.tooltipster('content', $('<span>').append(moreData));
                        }
                    };

                    if(conf.dropdownTooltip.functionBefore && typeof(conf.dropdownTooltip.functionBefore) === 'function') {
                      conf.dropdownTooltip.functionBefore(dropdownValue.id, setTooltipData);
                    }                     
                };
            }

           tooltipWidget = new TooltipWidget({
                "elements": tooltipConfig,
                "container": optionContainer,
                "view":  tooltip_text
            });

          tooltipWidget.build();

        };

        /**
         * Destroy the tooltip associated with the dropdown item
         */
        this.destroyTooltip = function () {
          if (tooltipWidget) {
            tooltipWidget.destroy();
            tooltipWidget=null;
          }
        }
    };

    return TooltipBuilder;
});
