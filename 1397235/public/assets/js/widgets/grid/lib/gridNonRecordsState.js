/**
 * A module that renders grid empty state
 *
 * @module GridNonRecordsState
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/conf/i18nGridConfiguration'

], function (render_template, i18nGridConfiguration) {
    var GridNonRecordsState = function (conf, actionBuilder) {

        var gridConfElements = conf.gridConf.elements,
            containers = conf.containers,
            gridContainer = conf.gridContainer,
            noResultsContainerTemplate = conf.noResultsContainerTemplate.noResultContainer,
            noUsersDefaultContainerTemplate = conf.noResultsContainerTemplate.defaultMessageGridContainer,
            getSearchTokens = conf.getSearchTokens,
            getNumberOfRows = conf.getNumberOfRows,
            gridContext = conf.gridContext,
            gridActionEvents = conf.gridConf.actionEvents,
            defaultSetting = {
                gridHeaderHeight: 33,
                horizontalScrollbarHeight: 12,
                headerOffset: 16 + 2 //vertical scrollBar width + border
            };

        var errorMessages = {
            'noGridData': i18nGridConfiguration.emptyGrid.noGridData,
            'error': i18nGridConfiguration.emptyGrid.error
        };

        /**
         * Provides the message to be displayed in empty state based on the user configuration / default configuration
         * @return { Object | string } Returns String from the configuration or html element from a view
         */
        var getDisplayMessage = function () {
            var displayMessage,
                configuredMessage;
            if (getSearchTokens.call(gridContext) && getSearchTokens.call(gridContext).length) {
                if (gridConfElements.filter && gridConfElements.filter.noSearchResultMessage) {
                    displayMessage = _.isFunction(gridConfElements.filter.noSearchResultMessage) ? gridConfElements.filter.noSearchResultMessage() : gridConfElements.filter.noSearchResultMessage;
                }
            } else {
                if (_.isFunction(gridConfElements.noResultMessage)) {
                    var messageCallback = gridConfElements.noResultMessage();
                    displayMessage = _.isFunction(messageCallback.render) ? messageCallback.render().$el : messageCallback;
                } else if (_.isObject(gridConfElements.noResultMessage)) {
                    displayMessage = $(render_template(noUsersDefaultContainerTemplate, gridConfElements.noResultMessage));
                } else {
                    displayMessage = gridConfElements.noResultMessage;
                }
            }

            return displayMessage || errorMessages.noGridData; // default message

        };

        /**
         * Called when a fetch error occured
         */
        this.displayErrorMessage = function () {
            this.displayNoResultMessage(undefined, true);
        };


        /**
         * Shows the container when no results are found
         * @param {Object} data
         * @param {Boolean} error - if it contains error
         * @param {Boolean} forceDisplayNoResultMsg - force grid widget to show no result message
         * @param {Object} $gridTable - showing no result message in this table (Optional).
         */
        this.displayNoResultMessage = function (data, error, forceDisplayNoResultMsg, $gridTable) {
            var displayMessage = getDisplayMessage();

            if (error) {
                displayMessage = errorMessages.error;
            }

            containers.$gridViewContainer = $gridTable ? $($gridTable.parents('.ui-jqgrid-view')[ 0 ]) : gridContainer.find('.ui-jqgrid-view');
            containers.$gridContentContainer = $gridTable ? $($gridTable.parents('.ui-jqgrid-bdiv')[ 0 ]) : gridContainer.find('.ui-jqgrid-bdiv');
            containers.$gridContentFooter || (containers.$gridContentFooter = gridContainer.find('.gridTableFooter'));

            var isLocalData = containers.$gridViewContainer.find('.gridTable').jqGrid('getGridParam', 'datatype') == 'local' ? true : false, //Check if datatype is local
                $noResultContainer = containers.$gridViewContainer.siblings('.noResultContainer'),
                hasResultContainer = _.isElement($noResultContainer[ 0 ]),
                gridHasNoData = data && !isLocalData && gridConfElements.jsonRecords && gridConfElements.jsonRecords(data) == 0 && !_.isUndefined(data.records) && parseInt(data.records) <= 0 ? true : false; //Only trigger jsonRecords when datatype is not local

            //todo: simplify this condition to use only getNumberOfRows to cover all the cases. Test throughly for regression. PR-1229183
            //When the data is not local and the grid or subGrid does NOT contain any data, then show no result message
            if (forceDisplayNoResultMsg || gridHasNoData || (getNumberOfRows.call(gridContext) <= 0)) {
                var gridViewContainerHeightOffset = 60; // Allow room for gridSectionSeperator and horizontal scrollbar.
                var noResultContainerHeight = 0;
                containers.$gridContentContainer.hide();
                containers.$gridViewContainer.addClass('grid-nodata');
                containers.$gridViewContainer.find('.ui-jqgrid-hdiv').addClass('grid-header-nodata');

                //Only append the container when there is no $noResultContainer
                if (!hasResultContainer) {
                    $noResultContainer = $(render_template(noResultsContainerTemplate));
                    containers.$gridViewContainer.parent().append($noResultContainer);
                    hasResultContainer = true;
                }
                else {
                    $noResultContainer.height("auto");
                }
                if (gridConfElements.filter && gridConfElements.filter.advancedSearch && !forceDisplayNoResultMsg) {
                    $noResultContainer.addClass("autoTool");
                }
                $noResultContainer.empty().append(displayMessage);
                $noResultContainer.show();
                noResultContainerHeight = $noResultContainer.height();
                containers.$gridViewContainer.height(noResultContainerHeight + gridViewContainerHeightOffset);
                !forceDisplayNoResultMsg && containers.$gridContentFooter.hide();
            } else {
                containers.$gridViewContainer.css('height', 'auto')
                containers.$gridViewContainer.find('.ui-jqgrid-hdiv').removeClass('grid-header-nodata');
                containers.$gridViewContainer.removeClass("grid-nodata");
                containers.$gridContentFooter.show();
                containers.$gridContentContainer.show();
                hasResultContainer && $noResultContainer.removeClass("autoTool").hide();
            }

            //Only update the height when the height is fixed
            if (gridConfElements.height && hasResultContainer) {
                var gridHeight = _.isNumber(gridConfElements.height) ? gridConfElements.height.toString() : gridConfElements.height;
                //When the grid height is fixed height
                if (!(gridHeight.search("%") !== - 1 || gridHeight == 'auto')) {
                    //Set the height of $noResultContainer as same as ui-jqgrid-bdiv.
                    $noResultContainer.css('height', gridHeight);

                    //gridViewContainer includes both ui-jqgrid-bdiv and ui-jqgrid-hdiv height
                    gridHeight = parseInt(gridHeight, 10) + defaultSetting.gridHeaderHeight;

                    //When the header is longer than the viewContainer, we need to add scrollbar offset
                    var headerOffset = containers.$header && (containers.$header.width() - containers.$gridViewContainer.width());

                    if (headerOffset > defaultSetting.headerOffset) {
                        containers.$gridViewContainer.height(gridHeight + defaultSetting.horizontalScrollbarHeight);
                    } else {
                        containers.$gridViewContainer.height(gridHeight);
                        containers.$gridContentContainer.addClass("hideHorizontalScroll");
                    }
                }
            }
            if (gridConfElements.noResultMessage && gridConfElements.noResultMessage.buttons && gridActionEvents) {
                var customButtons = {};
                gridConfElements.noResultMessage.buttons.forEach(function (button) {
                    button[ "button_type" ] = true;
                    customButtons[ button.key ] = button;
                });
                actionBuilder.bindEvents(customButtons, gridContainer);
            }
        };
    };

    return GridNonRecordsState;

});