/**
 * A module that builds the tooltip used in the list builder widget
 *
 * @module TooltipBuilder
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'lib/template_renderer/template_renderer',
    'text!widgets/listBuilderNew/templates/tooltip.html',
    'widgets/tooltip/tooltipWidget'
],  /** @lends TooltipBuilder */
    function(render_template, tooltipTemplates, TooltipWidget) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the list builder widget
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function(conf){
        var allRowData = {};
        /**
         * Adds tooltips to the rows of the list builder widget
         * @param {Object} gridTable - table with elements that will be have tooltips added
         * @param {Object} gridWidget - grid widget instance
         */
        this.addContentTooltips = function (gridTable, gridWidget){
       

            var $moreContent = $(render_template(tooltipTemplates));

            generateRowDataHash(gridWidget);

            new TooltipWidget({
                "elements": {
                    "minWidth": 100,
                    "maxWidth": 100,
                    "position": "left",
                    "contentAsHTML": true,
                    "style": "grid-widget",
                    "animation": false,
                    "contentCloning": false,
                    "onlyOne": true,
                    "delay": 500,
                    "functionBefore": function ($moreContainer, resume) {
                        var rowId = $moreContainer[0].id,
                            rowData = allRowData[rowId];

                        var setTooltipData = function (moreData){
                            $moreContent = $(render_template(tooltipTemplates,{items: moreData}));
                            resume();
                            !_.isUndefined($moreContainer.data('tooltipster-ns')) && $moreContainer.tooltipster('content', $moreContent);
                        }
                        conf.rowTooltip && conf.rowTooltip(rowData, setTooltipData);
                    }
                },
                "container": gridTable.find('.slipstreamgrid_row'),
                "view": $moreContent
            }).build();

        };

        var generateRowDataHash = function(gridWidget){
            var rowData = gridWidget.getAllVisibleRows(),
                jsonId = conf.elements.jsonId || 'id';

            for (var i = 0; i < rowData.length; i++){
                allRowData[rowData[i][jsonId]] = rowData[i];
            }
        };
    };

    return TooltipBuilder;
});
