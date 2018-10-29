/**
 * Extending Slipstream grid size calculator to work for fixed height
 *
 * @module GridSizeCalculator for fixed height
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'jquery.resize'
], /** @lends GridSizeCalculator */
    function (resize) {

    /**
     * GridSizeCalculator constructor
     *
     * @constructor
     * @class GridSizeCalculator - Calculates column width and height of the grid
     *
     * @param {Object} gridConfiguration - grid configuration
     * @returns {Object} Current GridSizeCalculator's object: this
     */
    var GridSizeCalculator = function (gridConfiguration) {

        var containers,
            gridContainerHeight = gridConfiguration.height || 0,
            self = this;

        this.init = function (gridContainer) {
            containers = {
                $gridContainer: gridContainer
            };
            bindResizeGrid();
        };

        /**
         * Adjust the maximum height of the grid to the available height of container. It is available the grids that have the fixed height property and that are not nested grids.
         * The calculation starts by getting the height of the grid container if it is available. In case it is available, then it uses the vertical offset between the grid content and the grid container to know the size og the elements above the grid content. It takes off the grid footer height.
         * If the grid container height is not available, then it uses the viewport to calculate how height the grid container is.
         */
        this.calculateGridHeight = function () {

            !containers.$gridHeaderContainer && (containers.$gridHeaderContainer = containers.$gridContainer.find('.ui-jqgrid-hdiv'));
            !containers.$gridContentContainer && (containers.$gridContentContainer = containers.$gridContainer.find('.ui-jqgrid-bdiv'));
            !containers.$gridTableFooter && (containers.$gridTableFooter = containers.$gridContainer.find('.gridTableFooter'));
            !containers.$gridEndContainer && (containers.$gridEndContainer = containers.$gridContainer.find('.grid-widget-end'));

            containers.$gridContainer.addClass("slipstream-widget-auto-height");
            containers.$gridContentContainer.attr("style","height:auto");

            var gridFooterHeight = containers.$gridTableFooter ? containers.$gridTableFooter.outerHeight(true) : 0;
            var gridContainerMaxHeight = containers.$gridContainer.css("max-height");
            var gridContainerDefaultHeight = ~gridContainerMaxHeight.indexOf("px") ? gridContainerMaxHeight.slice(0, -2) : 0;
            var gridContentHeight = containers.$gridContentContainer.height();


            var getGridContentMaxHeight = function (gridContainerY) {
                var offsetTopContainer = containers.$gridContainer.offset().top;
                var offsetTopContent = containers.$gridContentContainer.offset().top;
                if (offsetTopContent == 0) {
                    offsetTopContent = containers.$gridHeaderContainer.offset().top + containers.$gridHeaderContainer.height();
                }
                var gridContentY = offsetTopContent - offsetTopContainer;
                var gridContentMaxHeight = gridContainerY - gridContentY - gridFooterHeight;
                return gridContentMaxHeight;
            };

            var maxHeight;
            if (gridContainerDefaultHeight) { //uses the max height if it is defined in the grid container max height
                var availableGridContentHeight = getGridContentMaxHeight(gridContainerDefaultHeight);
                maxHeight = availableGridContentHeight < gridContentHeight ? availableGridContentHeight : gridContentHeight;
            } else { //uses the available view port to calculate the height of the grid
                if (gridContainerHeight == 0) {
                    var viewportY = $(window).height() + $(window).scrollTop();
                    var gridEndY = containers.$gridEndContainer.offset().top;
                    var offset = gridEndY - viewportY;
                    if (offset <= 0) {
                        gridContainerHeight = containers.$gridContainer.height() + Math.abs(offset);
                        maxHeight = getGridContentMaxHeight(gridContainerHeight);
                    } else {
                        maxHeight = gridContentHeight - offset;
                    }
                } else {
                    maxHeight = getGridContentMaxHeight(gridContainerHeight);
                }
            }

            if (gridContainerDefaultHeight == 0)
                maxHeight -= 20; //provides an offset bottom-margin for the grid footer

            containers.$gridContentContainer.css({
                "height": maxHeight, // settinh height equal to max height
                "max-height": maxHeight
            });
            console.log("height set to " + maxHeight);

            if (gridContainerHeight == 0) //sets the grid container height if it is not available from the grid max-height css property
                gridContainerHeight = containers.$gridContainer.height();

            containers.$gridContentContainer.removeClass('defaultHeight');

        };


        /**
         * Adds event handler the window resize and the slipstream-resize-grid events. The resize event is triggered when the browser is resized, and the slipstream-resize-grid could be triggered when some grid columns are hidden from the "Show Hide Column" submenu.
         * @inner
         */
        var bindResizeGrid = function () {
            $(window).unbind('resize').bind('resize', function (evt) {
                self.calculateGridHeight();
            });

            containers.$gridContainer.css("position", "relative"); //required by resize library and not appended automatically because container is not available in the DOM earlier

            containers.$gridContainer.resize(function () {
                self.calculateGridHeight();
            });
        };

    };

    return GridSizeCalculator;
});