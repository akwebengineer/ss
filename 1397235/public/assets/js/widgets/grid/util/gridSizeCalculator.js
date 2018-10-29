/**
 * A module that calculates the column width and height of the grid when the grid is rendered or tbrowser
 *
 * @module GridSizeCalculator
 * @author Miriam Hadfield <mhadfield@juniper.net>
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

        var containers, containersWidth, isAutoWidth,
            gridContainerHeight = 0,
            VERTICAL_SCROLLBAR_WIDTH = 16,
            VERTICAL_OFFSET_GRIDS = 20,
            percentageHeight = (_.isString(gridConfiguration.height) && ~gridConfiguration.height.indexOf("%")) ? parseInt(gridConfiguration.height.replace("%", "")) / 100 : 0,
            isAutoHeightGrid = gridConfiguration.height && gridConfiguration.height == 'auto' ? true : percentageHeight ? true : false,
            self = this;

        this.init = function (gridContainerWrapper, gridContainer) {
            containers = {
                $gridContainerWrapper: gridContainerWrapper,
                $gridContainer: gridContainer
            };
        };

        /**
         * Adjust the maximum height of the grid to the available height of container. It is available the grids that have the auto height property and that are not nested grids.
         * The calculation starts by getting the height of the grid container if it is available. In case it is available, then it uses the vertical offset between the grid content and the grid container to know the size og the elements above the grid content. It takes off the grid footer height.
         * If the grid container height is not available, then it uses the viewport to calculate how height the grid container is.
         * @param {boolean} resetContentContainer - set to true when the grid width needs to have the grid table resized
         * @param {boolean} resetGridContainer - set to true when the grid width needs to have the grid container resized
         */
        this.calculateGridHeight = function (resetContentContainer, resetGridContainer) {
            var gridContainerWrapperMaxHeight = ~containers.$gridContainerWrapper.css("max-height").indexOf("px") ? containers.$gridContainerWrapper.css("max-height").slice(0, -2) : 0,
                gridContainerWrapperHeight;

            if (percentageHeight) {
                gridContainerWrapperHeight = percentageHeight * (gridContainerWrapperMaxHeight || containers.$gridContainerWrapper.height());
                gridContainerWrapperHeight -= VERTICAL_OFFSET_GRIDS; //offset between containers
            } else if (gridContainerWrapperMaxHeight) { //when a grid with auto height needs to be rendered in a container that has a maximum height but there could be some other containers on the top, then the available height needs to be readjusted
                var gridHeightOffset = containers.$gridContainer.offset().top - containers.$gridContainerWrapper.offset().top;
                gridContainerWrapperMaxHeight -= gridHeightOffset;
            }

            if (isAutoHeightGrid) {
                containers.$gridContainer.addClass("slipstream-widget-auto-height");

                if (_.isUndefined(containers.$gridContentContainer) || resetContentContainer) {
                    !containers.$gridHeaderContainer && (containers.$gridHeaderContainer = containers.$gridContainer.find('.ui-jqgrid-hdiv').eq(0)); //nested grid produces more than one .ui-jqgrid-bdiv;
                    !containers.$gridEndContainer && (containers.$gridEndContainer = containers.$gridContainer.find('.grid-widget-end'));

                    //cache common containers
                    cacheContainers();

                    var gridFooterHeight = containers.$gridTableFooter ? containers.$gridTableFooter.outerHeight(true) : 0;
                    var gridContainerDefaultHeight = percentageHeight ? gridContainerWrapperHeight : gridContainerWrapperMaxHeight;
                    var gridContentHeight = containers.$gridContentContainer.height();

                    if (resetGridContainer)
                        gridContainerHeight = 0;

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
                        maxHeight = availableGridContentHeight;
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
                        } else if (resetContentContainer) {
                            maxHeight = getGridContentMaxHeight(gridContainerHeight);
                        }
                    }

                    if (gridContainerDefaultHeight == 0) {
                        maxHeight -= 20; //provides an offset bottom-margin for the grid footer
                    }

                    if (maxHeight > 30) {
                        containers.$gridContentContainer.css({
                            "height": "auto",
                            "max-height": maxHeight
                        });
                        // console.log("auto height set to " + maxHeight);
                    }

                    if (gridContainerHeight == 0) //sets the grid container height if it is not available from the grid max-height css property
                        gridContainerHeight = containers.$gridContainer.height();

                    if (!containers.$gridContentContainer.attr("forceScrollbar")){
                        if (containers.$gridTable.height() < maxHeight) { //removes y-scroll introduced by the height set by the library in the grid table
                            containers.$gridContentContainer.addClass('defaultHeight');
                        } else {
                            containers.$gridContentContainer.removeClass('defaultHeight');
                        }
                    }
                }
            }
        };


        /**
         * Resizes the grid content height by assigning a maximum height depending if the grid has a token area or not
         * @param {boolean} isFilteredGrid - if it is set to true, it indicates that the grid has a token area shown; otherwise, it will be hidden. The presence of the token area causes that the grid content have a smaller area to render.
         */
        this.resizeGridHeight = function (isFilteredGrid) {
            if (isFilteredGrid) {
                self.calculateGridHeight(true);
            } else {
                self.calculateGridHeight();
            }
        };

        /*
         * Get maximum height of the grid. maxHeight = max-height(gridContentContainer) + height(grid's subHeader) + height(grid's footer) + height(grid's header)
         * This function is being used to calculate the max-height of context-menus being used in grid widget, but it can also be used for other cases where grid's max-height is required. The function won't return anything if the max-height for grid contentContainer is not set.
         * @param {Boolean} isRawHeight - If this parameter is true, the function will return the raw max-height of grid. i.e. max-height(gridContentContainer) + height(grid's footer). If false, it will return the actual max-height of container based on above formula. Default is set to false.
         * @returns {Number} - max height of the grid 
         */
        this.getGridMaxHeight = function(isRawHeight) {
            cacheContainers();
            isRawHeight = _.isUndefined(isRawHeight) ? false : isRawHeight;
            var gridContentMaxHeight = containers.$gridContentContainer ? containers.$gridContentContainer.css('max-height') : "";
            var maxHeight;
            var gridFooterHeight = containers.$gridTableFooter ? containers.$gridTableFooter.height() : 0;
            if(gridContentMaxHeight != "" && gridContentMaxHeight != 'none') {
                if(isRawHeight){
                    maxHeight = parseInt(gridContentMaxHeight,10) + gridFooterHeight;
                } else {
                    var gridSubHeaderHeight = containers.$subHeaderContainer ? containers.$subHeaderContainer.height() : 0;
                    var gridSearchContainerHeight = containers.$searchContainer ? containers.$searchContainer.height() : 0;
                    var gridHeaderHeight = containers.$gridHeaderContainer ? containers.$gridHeaderContainer.height() : 0;
                    maxHeight = parseInt(gridContentMaxHeight,10) + gridSubHeaderHeight + gridFooterHeight + gridHeaderHeight + gridSearchContainerHeight;
                }
            }
            return maxHeight;
        };

        /**
         * Adjusts the width of the grid columns
         * @param {boolean} autoWidth - set to true when the grid width needs to resized according to the available grid with and according to the percentage assigned to it.
         */
        this.adjustColumnWidth = function (autoWidth) {
            containers = _.extend(containers, {
                $headerRows: containers.$gridContainer.find('.ui-jqgrid-labels th'),
                $firstRow: containers.$gridContainer.find('.jqgfirstrow td'), //jqGrid only formats the first row
                $subHeaderContainer: containers.$gridContainer.find('.sub-header')
            });

            //cache common containers
            cacheContainers();

            containersWidth = {
                jqGrid: containers.$gridLibraryWrapper.width()
            };

            isAutoWidth = autoWidth;
            isAutoWidth && containers.$gridContainer && containers.$gridContainer.addClass("slipstream-widget-auto-width");

            var observer = new MutationObserver(function (mutations) {
                if (containersWidth.jqGrid === 0) {
                    containersWidth.jqGrid = containers.$gridTable.width();
                }
                var gridContWidth = containers.$gridContainer.find(".ui-jqgrid").width();
                if (gridContWidth !== containersWidth.jqGrid) {
                    if ((isAutoWidth && gridContWidth !== 0)) {
                        containersWidth.jqGrid = gridContWidth;
                    }
                    containers.$gridContainer.trigger('slipstreamGrid.resized:width');
                    observer.disconnect();
                }

                if (isAutoWidth) {
                    !isAutoHeightGrid && updateLastColWidth(VERTICAL_SCROLLBAR_WIDTH);
                    containers.$gridContentContainer && containers.$gridContentContainer.addClass("hideHorizontalScroll");
                }else{
                    var actionContainerMinWidth = containers.$gridContainer.find('.action-filter-wrapper').width() + 10; //TODO: Calculate width including margin and remove 10px offset
                    var allContainersMaxWidth = containers.$gridTable.width() + VERTICAL_SCROLLBAR_WIDTH;  //gives vertical scrollbar width
                    containers.$subHeaderContainer.css('min-width', actionContainerMinWidth);
                    allContainersMaxWidth && (containers.$subHeaderContainer.css('max-width', allContainersMaxWidth));
                    if (containers.$gridTableFooter.length > 0) {
                        containers.$gridTableFooter.css('min-width', actionContainerMinWidth);
                        allContainersMaxWidth && (containers.$gridTableFooter.css('max-width', allContainersMaxWidth));
                    }
                }                
            });

            observer.observe(containers.$gridContainer[0], {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            bindResizeGrid();
        };

        /**
         * Caches common containers
         * @inner
         */
        var cacheContainers = function () {
            !containers.$gridTable && (containers.$gridTable = containers.$gridContainer.find('.gridTable'));
            !containers.$gridContentContainer && (containers.$gridContentContainer = containers.$gridContainer.find('.ui-jqgrid-bdiv').eq(0)); //nested grid produces more than one .ui-jqgrid-bdiv
            !containers.$tokenContainer && (containers.$tokenContainer = containers.$gridContainer.find('.search-save-container'));
            !containers.$gridTableFooter && (containers.$gridTableFooter = containers.$gridContainer.find('.gridTableFooter'));
            !containers.$gridLibraryWrapper && (containers.$gridLibraryWrapper = containers.$gridContainer.find('.ui-jqgrid').eq(0));
            !containers.$gridTableWrapper && (containers.$gridTableWrapper = containers.$gridContainer.find('.ui-jqgrid-view').eq(0));
            !containers.$searchContainer && (containers.$searchContainer = containers.$gridContainer.find('.search-container'));
            !containers.$headerLabels && (containers.$headerLabels = containers.$gridContainer.find('.ui-jqgrid-labels'));
        };

        /**
         * Resizes the grid with according to the grid container width and updates the grid filter container to be aligned to the right of the grid.
         * @param {Boolean} isColumnWidthResized - resize the width of grid container or the width of certain column header
         * @inner
         */
        var resizeGrid = function (isColumnWidthResized) {
            if (isAutoWidth) {
                if (isColumnWidthResized){ //Resize the width of the certain column header
                    var reduceWidth = containersWidth.jqGrid - containers.$headerLabels.width();
                    (reduceWidth > 0) && updateLastColWidth(reduceWidth);
                }else{ //Resize the gridContainer
                    containers.$gridTable.setGridWidth(containersWidth.jqGrid, true); //Resized to the new width as per browser window
                    gridConfiguration.subGrid && adjustNestedGridHeader(containers);
                }
            } else {
                var gridTableWidth = containers.$gridTable.width(),
                    gridTableHeight = containers.$gridTable.height(),
                    gridContainerWidth = containers.$gridContainer.width(),
                    gridContentContainerHeight = containers.$gridContentContainer.height(),
                    hasVerticalScrollBar = gridTableHeight > gridContentContainerHeight,
                    hasHorizontalScrollBar = gridTableWidth > gridContainerWidth,
                    noHorizontalScrollBar = gridTableWidth < gridContainerWidth;
                if (noHorizontalScrollBar) { //no horizontal scrollbar
                    if (containers.$gridContentContainer.hasClass("defaultHeight")) {//When it is autoHeight and the content height is less than the container.
                        gridTableWidth += 2; //adds the width of the table borders
                    } else if (hasVerticalScrollBar){ //When the content is bigger than the container no matter it is autoHeight or fixedHeight
                        gridTableWidth += VERTICAL_SCROLLBAR_WIDTH; //adds the width of the vertical scroll
                        containers.$gridContentContainer.addClass("hideHorizontalScroll");
                    }
                    containers.$gridTableWrapper.attr("style", "width: " + gridTableWidth + "px");//counting for scrollbar
                    containers.$gridLibraryWrapper.attr("style", "width: " + gridTableWidth + "px !important");//required to make the last column resizable in all available area instead of small chunks
                } else if (hasHorizontalScrollBar) { //horizontal scrollbar
                    containers.$gridLibraryWrapper.attr("style", "width: inherit");//sets default width since on horizontal scrollbar the last column can be resized only in small chunks
                } else { //no horizontal scrollbar (gridTableWidth == gridContainerWidth)
                    //When there is no horizontal scrollBar and with vertical scrollBar
                    hasVerticalScrollBar && containers.$gridContentContainer.addClass("hideHorizontalScroll");
                }
                //sets all containers to the grid table width so they are aligned on the right
                containers.$subHeaderContainer && containers.$subHeaderContainer.css('max-width', gridTableWidth);
                containers.$tokenContainer && containers.$tokenContainer.css('max-width', gridTableWidth);
                containers.$gridTableFooter && containers.$gridTableFooter.css('max-width', gridTableWidth);
            }
            containers.$gridContainer.trigger("slipstreamGrid.resized:heightWidth");
        };

        /**
         * Update the last column width when the new header width is smaller than the original header width
         * @param {Integer} reduceWidth - the reduced width of the header
         * @inner
         */
        var updateLastColWidth = function(reduceWidth){
            var $lastHeaderColumn = containers.$headerLabels.find("th:visible").last(),
                origLastColWidth = $lastHeaderColumn.width(),
                updatedLastColWidth = origLastColWidth + reduceWidth;
            $lastHeaderColumn.width(updatedLastColWidth);
            containers.$gridTable.find('.jqgfirstrow td:visible').last().width(updatedLastColWidth);
        };

        /**
         * Adds event handler the window resize and the slipstream-resize-grid events. The resize event is triggered when the browser is resized, and the slipstream-resize-grid could be triggered when some grid columns are hidden from the "Show Hide Column" submenu.
         * @inner
         */
        var bindResizeGrid = function () {
            var resetGridWidth = function () {
                    var resizedWidth = containers.$gridLibraryWrapper.width();
                    (resizedWidth) && (containersWidth.jqGrid = resizedWidth);
                    resizeGrid();
                    containers.$gridContainer.trigger("slipstreamGrid.resized:gridWidth"); //grid width was resized
                },
                bindResizeToContainer = function ($container) {
                    $container.css("position", "relative"); //required by resize library and not appended automatically because container is not available in the DOM earlier
                    $container.resize(function () {
                        resetGridWidth();
                        self.calculateGridHeight(true, true);
                    });
                };
            $(window).unbind('resize.slipstreamGrid').bind('resize.slipstreamGrid', function (evt) {
                resetGridWidth();
                self.calculateGridHeight(true, true);
                containers.$gridContainer.trigger("slipstreamGrid.resized:heightWidth");
            });
            containers.$gridContainer.bind("slipstreamGrid.resized:width", function (e, isColumnWidthResized) {
                resizeGrid(isColumnWidthResized);
            });
            bindResizeToContainer(containers.$gridContainer); //resizing required for height/width changes in the grid container
            isAutoHeightGrid && bindResizeToContainer(containers.$gridContainerWrapper);//resizing required for height changes in the grid table like filtering
        };

        /**
         * Overwrites the width of the title for a nested grid
         * @param {Object} containers - DOM elements for the grid
         * @inner
         */
        var adjustNestedGridHeader = function (containers) {
            var getVisibleColumns = function (columns) {
                return columns.filter(function (column) {
                    if ($(column).css('display') !== 'none')
                        return column;
                });
            };

            if (containers && containers.$gridTable && containers.$gridTable.find('.ui-jqgrid-bdiv .jqgfirstrow').length) {
                !containers.$subGridHeaderContainer && (containers.$subGridHeaderContainer = containers.$gridTable.find('.ui-jqgrid-bdiv .jqgfirstrow').eq(0));
                var headers = getVisibleColumns(containers.$headerRows.get().reverse()),
                    columns = getVisibleColumns(containers.$subGridHeaderContainer.find('td').get().reverse()),
                    leftOffsetHeader = 0;
                for (var i = 0; i < headers.length - 1; i++) {
                    $(headers[i]).width($(columns[i]).width());
                }
                for (var i = headers.length - 1; i < columns.length; i++) {
                    leftOffsetHeader += $(columns[i]).width();
                }
                $(headers[headers.length - 1]).width(leftOffsetHeader);

                //readjusts subgrid width with parent grid width
                var subGridContainers = containers.$gridContainer.find("table[id$='_slipstreamSubGrid']");
                for (var j = 0; j < subGridContainers.length; j++) {
                    subGridContainers.eq(j).setGridWidth(containersWidth.jqGrid - VERTICAL_SCROLLBAR_WIDTH, true);
                }
            }
        };

    };

    return GridSizeCalculator;

});