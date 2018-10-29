/**
 * A module that builds the tooltip used in the grid widget
 *
 * @module TooltipBuilder
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/gridTemplates',
    'widgets/grid/lib/moreTooltipFilter',    
    'widgets/tooltip/tooltipWidget',
    'widgets/grid/conf/tooltipConfiguration',
    'widgets/grid/conf/i18nGridConfiguration'

],  /** @lends TooltipBuilder */
    function(render_template, GridTemplates, MoreTooltipFilter, TooltipWidget, tooltipConfiguration, i18nGridConfiguration) {

    /**
     * TooltipBuilder constructor
     *
     * @constructor
     * @class TooltipBuilder - Builds the tooltips used in the grid widget
     *
     * @param {Object} gridContainer
     * @param {Object} conf
     * @param {Class} gridConfigurationHelper - Grid gridConfigurationHelper Class
     *
     * @returns {Object} Current TooltipBuilder's object: this
     */
    var TooltipBuilder = function(gridContainer, conf, gridConfigurationHelper){

        /**
         * Builds the TooltipBuilder
         * @returns {Object} Current instance
         */

        var templates = new GridTemplates().getTemplates(),
            gridConfModel = conf.elements.columns,
            gridTable = gridContainer.find('.gridTable');

        /**
         * Adds tooltips to the action area and titles of the Grid widget
         */
        this.addHeaderTooltips = function (){
            var getTooltipView = function (help){
                var tooltipView  = render_template(templates.helpTooltip,{
                    'help-content':help['content'],
                    'ua-help-text':help['ua-help-text'],
                    'ua-help-identifier':help['ua-help-identifier']
                });
                return $(tooltipView);
            };

            //infotip for the action area
            new TooltipWidget({
                "container": gridContainer.find('.sub-header')
            }).build();

            //infotip for the title
            if (conf.elements['title-help']){
                new TooltipWidget({
                    "elements": tooltipConfiguration.filter,
                    "container": gridContainer.find('.grid-title-help'),
                    "view": getTooltipView(conf.elements['title-help'])
                }).build();
            }

            //infotip for the right filter area
            if (conf.elements['filter-help']){
                new TooltipWidget({
                    "elements": tooltipConfiguration.filter,
                    "container": gridContainer.find('.filter-container'),
                    "view": getTooltipView(conf.elements['filter-help'])
                }).build();
            }

            //infotip for the header of the grid
            var gridColModel = gridTable.jqGrid("getGridParam", "colModel"), //grid model
                gridHeaders = gridTable[0].grid.headers, //grid header
                column, index;
            for (var i=0; i<gridConfModel.length; i++){ //original grid configuration
                column = gridConfModel[i];
                index = column.index; //index property for a column of the grid configuration
                var headerIndex;
                if (index){
                    for (var j=0; j<gridColModel.length; j++){
                        var colName = gridColModel[j];
                        if(colName['index'] === index){ //identify the column number
                            headerIndex = j;
                            break;
                        }
                    }
                    var gridHeader = gridHeaders[headerIndex]; //get the header properties by id
                    if (column['header-help']){
                        var headerContainer = gridHeader.el;
                        new TooltipWidget({
                            "elements": tooltipConfiguration.header,
                            "container": gridContainer.find(headerContainer),
                            "view": getTooltipView(column['header-help'])
                        }).build();
                    } else {
                        gridHeader.el.title = "";
                    }
                }
            }
        };

        /**
         * Adds tooltips to the title of a group column
         * @param {Object} $container - jQuery DOM Object of the title of a group column where the tooltip will be built
         * @param {Object} columnTitles - data of the group columns that will be used as the content of the tooltip
         */
        this.addGroupColumnTitleTooltip = function ($container, columnTitles) {
            var tooltipView = render_template(templates.groupColumnTitleTooltip, {
                "firstColumn": columnTitles[0],
                "lastColumns": columnTitles.slice(1)
            });
            new TooltipWidget({
                "elements": tooltipConfiguration.groupColumn,
                "container": $container,
                "view": tooltipView
            }).build();
        };

        /**
         * Adds tooltips to the rows of the Grid widget
         * @param {Object} $rowTable - table with elements that will be have tooltips added
         * @param {Object} originalRowData - original grid data as it was received from the API response
         */
        this.addContentTooltips = function ($rowTable, originalRowData){
            //standard content tooltip
            contentTooltip($rowTable);

            //more pill tooltip
            moreTooltip($rowTable, originalRowData);


            //adds tooltip for data-tooltip
            if (conf.cellTooltip) {
                cellTooltip($rowTable);
            }

        };

        /**
         * Adds tooltips to the row of the Grid widget
         * @param {Object} $rowTable - table with elements that will be have tooltips added
         * @param {Object} originalRowData - original grid data as it was received from the API response
         * @param {String} rowId - id of the row that requires a tooltip
         */
        this.addRowTooltips = function ($rowTable, originalRowData, tooltipRowId){
            var $tooltipRow = $rowTable.find('#' + tooltipRowId);

            //adds content tooltip from the title property (standard tooltip)
            contentTooltip($tooltipRow);

            //adds more pill tooltip
            moreTooltip($rowTable, originalRowData, $tooltipRow);

            //adds tooltip for data-tooltip
            if (conf.cellTooltip) {
                cellTooltip($rowTable, $tooltipRow);
            }
        };

        /**
         * Adds a tooltip to the grid's manual refresh control
         * @param {String} tooltipText - the text of the tooltip to be added.
         * @param {Object} refreshControl - The object representing the refresh control.
         */
        this.addRefreshTooltip = function(tooltipText, refreshControl) {
             new TooltipWidget({
                    "elements": {
                        "interactive": false,
                        "position": "right"
                    },
                    "container": refreshControl,
                    "view": tooltipText
             }).build();
        };

        /**
         * Temporarily disables a tooltip from being able to open
         * @param {jQuery Object} $tooltipContainer - the container that has initialized tooltipster
         */
        this.disableTooltip = function($tooltipContainer){
            $tooltipContainer.find(".tooltipsted").tooltipster('disable');
        };

        /**
         * If a tooltip was disabled, restores its previous functionality.
         * @param {jQuery Object} $tooltipContainer - the container that has initialized tooltipster
         */
        this.enableTooltip = function($tooltipContainer){
            $tooltipContainer.find(".tooltipsted").tooltipster('enable');
        };

        var moreTooltip = function ($rowTable, originalRowData, $tooltipRow) {
            var columnConfigurationHash = gridConfigurationHelper.buildColumnConfigurationHashByName();

            var moreTemplate = templates.moreTooltip;
            var $moreContent = $(render_template(moreTemplate));
            var $filterInput,
                $filterIcon,
                $clearIcon,
                tableId = $rowTable.attr('id');

            var tooltipFilterTimeout = 500;

            tooltipConfiguration.moreCellContent.functionBefore = function ($moreContainer, resume) {
                var moreData = $moreContainer.data();
                var rowId = moreData.rowid,
                    columnName = moreData.column,
                    currentTableId = moreData.tableId;

                if ($rowTable.attr('id') != currentTableId){
                    $rowTable = $moreContainer.closest('table');

                    var gridConf = $rowTable.jqGrid('getGridParam');
                    columnConfigurationHash = gridConfigurationHelper.buildColumnConfigurationHashByName(gridConf.colModel);
                }
                var $row = $rowTable.find("#"+rowId);
                var rowData = $rowTable.jqGrid('getRowData',rowId);
                var rawData = conf.elements.tree ? originalRowData[rowId] : $row.data('jqgrid.record_data');
                var tooltipFilter = new MoreTooltipFilter();
                var setTooltipData = function (data, dataConf){
                    var moreData=[];
                    data.forEach(function(item){
                        var getItemLabel = function (callback) {
                            if(dataConf) {
                                if (_.isObject(dataConf.label)) {
                                    if (_.isFunction(dataConf.label[callback])) {
                                        return dataConf.label[callback](item);
                                    } else if (_.isString(dataConf.label[callback])) {
                                        return item[dataConf.label[callback]];
                                    }
                                } else if (_.isString(dataConf.label)) {
                                    return item[dataConf.label];
                                }
                            }
                            return item;
                        };
                        moreData.push({
                            key: dataConf ? item[dataConf.key] : item,
                            label: {
                                formatter: getItemLabel("formatter"),
                                unformat: getItemLabel("unformat")
                            }
                        });
                    });
                    var searchFilter;
                    var showTooltip = function(tooltipData) {
                        $moreContent = $(render_template(moreTemplate,{items: tooltipData}));
                        $filterInput = $moreContent.find("input.filter");
                        $filterIcon = $moreContent.find(".filter-icon");
                        $clearIcon = $moreContent.find(".clear-icon");
                        if(searchFilter) {
                            $filterIcon.hide();
                            $clearIcon.show();
                        }
                        else {
                            $filterIcon.show();
                            $clearIcon.hide();
                        }

                        $moreContent.off('click.fndtn.moreItem').on('click.fndtn.moreItem', '.more-item', function (e) {
                            var $item = $(this);
                            var item = {
                                key: $item.data().id,
                                label: $item.text()
                            };
                            if(dataConf && dataConf.clickHandler)
                                dataConf.clickHandler(item);
                            else
                                console.log(item + " selected");
                        });
                        resume();
                        !_.isUndefined($moreContainer.data('tooltipster-ns')) && $moreContainer.tooltipster('content', $moreContent);
                        bindFilters();
                    };


                    var bindFilters = function() {
                        $clearIcon.on('click', function(e){
                            searchFilter = ""                         ;
                            $filterInput.val("");
                            showTooltip(moreData);
                        });

                        $filterInput.on('keydown', function(e){
                            setTimeout(function(){
                                searchFilter = $filterInput.val();
                                var filteredTooltip = tooltipFilter.filter({data: moreData, filterString: searchFilter}); //TODO: Add remote filter callback in config
                                showTooltip(filteredTooltip);
                            }, tooltipFilterTimeout);
                        }).focus().val(searchFilter);
                    };

                    showTooltip(moreData);
                };

                //if not callback for collapseContent or groupContent, then the default data in the cell is rendered
                if (columnConfigurationHash[columnName].collapseContent && columnConfigurationHash[columnName].collapseContent.moreTooltip) {
                    columnConfigurationHash[columnName].collapseContent.moreTooltip(rowData, rawData, setTooltipData);
                } else if (columnConfigurationHash[columnName].groupContent) {
                    if (columnConfigurationHash[columnName].groupContent.moreTooltip) {
                        columnConfigurationHash[columnName].groupContent.moreTooltip(rowData, rawData, setTooltipData);
                    } else {
                        //sets tooltip data of the group
                        var groupId = this.data("groupid"),
                        getGroupContentValue =  function(item){
                            return item.group + ": " + item.value;
                        };
                        setTooltipData(rowData[columnName][groupId],{
                            "key": "group",
                            "label": {
                                "formatter":getGroupContentValue,
                                "unformat": getGroupContentValue
                            }
                        });
                    }
                } else {
                    setTooltipData(rowData[columnName]);
                }
            };

            var $tooltipContainer = $tooltipRow || $rowTable;
            viewTooltip($tooltipContainer, ".moreTooltip", tooltipConfiguration.moreCellContent, $moreContent);
        };

        var cellTooltip = function ($rowTable, $tooltipRow) {
            var tableId = $rowTable.attr("id");
            var $tooltipContainer = $tooltipRow || $rowTable;

            tooltipConfiguration.dataTooltipContent.functionBefore = function ($tooltipContainer, resume){
                var $td = $tooltipContainer.closest('td');
                if ($td.length) {
                    var $row = $td.closest('tr');
                    var rowId = $row.attr('id');
                    var columnName = $td.attr("aria-describedby").substring(tableId.length+1);
                    var cellData = {
                        "columnName": columnName,
                        "rowId": rowId,
                        "cellId": $tooltipContainer.data('tooltip'),
                        "$cell": $td,
                        "rowData": $rowTable.jqGrid('getRowData', rowId),
                        "rawData": $row.data('jqgrid.record_data')
                    };
                    var renderTooltip = function (view, position){
                        resume();
                        !_.isUndefined($tooltipContainer.data('tooltipster-ns')) && $tooltipContainer.tooltipster('content', $('<span>').append(view));
                    };
                    conf.cellTooltip(cellData, renderTooltip);
                }
            };

            viewTooltip($tooltipContainer, "[data-tooltip]", tooltipConfiguration.dataTooltipContent, "Loading...");
        };

        /**
         * Adds an event listener for building tooltips on demand using the content provided in the container
         * @param {Object} $container - table or row that has cells with the tooltip class that should have a tooltip built
         * @inner
         */
        var contentTooltip = function ($container) {
            $container.on("mouseover", ".tooltip", function (event) {
                var $tooltipContainer = $(this.parentElement),
                    $targetElement = $(this);
                if (!$targetElement.hasClass("tooltipstered")) {
                    var tooltipInstance = new TooltipWidget({
                        "elements": tooltipConfiguration.allCells,
                        "container": $tooltipContainer
                    });
                    tooltipInstance.build();
                    $targetElement.trigger("mouseenter"); //force to open the tooltip for the first time, next time, the tooltip widget will take over an open tooltip on hover
                }
            });
        };

        /**
         * Adds an event listener for building tooltips on demand using the content provided in a view
         * @param {Object} $container - table or row that has cells with the tooltip class that should have a tooltip built
         * @param {Object} tooltipConfiguration - configuration of the tooltip
         * @inner
         */
        var viewTooltip = function ($container, target, configuration, view) {
            target += ":not(.tooltipstered)";
            $container.on("mouseover", target, function(event){
                var $tooltipContainer = $(this),
                    tableId = $tooltipContainer.closest('table').attr('id');
                $tooltipContainer.data('tableId', tableId);;
                new TooltipWidget({
                    "elements": configuration,
                    "container": $tooltipContainer,
                    "view": view
                }).build();
                showHideTooltip($tooltipContainer, configuration);
            });
        };

        /**
         * Shows or hides a tooltip the first time it is built
         * @param {Object} $container - table or row that has cells with the tooltip class that should have a tooltip built
         * @param {Object} configuration - configuration of the tooltip
         * @inner
         */
        var showHideTooltip = function ($tooltipContainer, configuration) {
            //shows the tooltip the first time it's built
            if (configuration.delay) { //case after the tooltip delay time has elapsed
                var tooltipIsJustBuilt = true;
                var showTimer = setInterval(function(){
                    $tooltipContainer.data('tooltipster-ns') && $tooltipContainer.data('tooltipster-ns').length > 0  && $tooltipContainer.tooltipster("show");
                    clearInterval(showTimer);
                }, configuration.delay);
                    //removes the request to show the tooltip once the mouse is out
                    $tooltipContainer.on("mouseout.tooltipWidgetBuilt", function (event) {
                        if (tooltipIsJustBuilt) {
                            $tooltipContainer.tooltipster("hide");
                            clearInterval(showTimer);
                            $(this).off("mouseout.tooltipWidgetBuilt");
                            tooltipIsJustBuilt = false;
                        }
                    });
            } else { //show immediately
                $tooltipContainer.tooltipster("show");
            }
        };

        /**
         * Adds a tooltip to the cell multiselect footer information icon
         * @param {Object} infoIcon - The object representing the information icon.
         */
        this.multiselectCellFooterTooltip = function(infoIcon) {
            
            var $multiselectCellFooterTooltip = render_template(templates.multiselectCellFooterTooltip, i18nGridConfiguration.multiselectCellFooterTooltip);
            var tooltipShowTime = 4000;
            tooltipConfiguration.multiselectCellFooter.functionReady = function(origin, tooltip) {
                //close tooltip on close button click
                $(tooltip).on( 'click', '.close', function(){
                    origin.tooltipster('hide');
                });

                // TODO: use AnimationDelay option here after upgrading tooltipster library. (SPOG-1567)
                //close tooltip automatically after delay of 4 seconds, if it not already in 'dying' state.
                 var timer = setInterval(function(){
                    if(multiselectCellTooltip && !$(tooltip).hasClass('tooltipster-dying')) {
                        origin.tooltipster('hide');
                        clearInterval(timer);
                    }
                }, tooltipShowTime);

            };

            var multiselectCellTooltip = new TooltipWidget({
                "elements": tooltipConfiguration.multiselectCellFooter,
                "container": infoIcon,
                "view": $multiselectCellFooterTooltip
            });

            multiselectCellTooltip.build();
        };

        /**
         * Adds a tooltip to the selection button in grid header
         * @param {Object} selectionIcon - The DOM object representing the selection icon.
         * @param {Function} getCurrentSelections - get current selected rows object with dom elements, selectedRowIds, selectedRows and other parameters.
         */
        this.showSelectionTooltip = function($selectionIcon, getCurrentSelections) {

            var tooltip_text=' ';

            _.extend(tooltipConfiguration.selectionTooltip, conf.elements.showSelection);
            
            tooltipConfiguration.selectionTooltip.functionBefore = function($container, resume){
                
                var selections = getCurrentSelections();
                var setTooltipData = function(view){
                    resume();  

                    if(!_.isUndefined(view)) {
                        if (_.isObject(view) && _.isFunction(view.render)) {
                            view.render();
                            view = view.el;
                        }
                        !_.isUndefined($container.data('tooltipster-ns')) && $container.tooltipster('content', $('<span>').append(view));
                    }
                };

                if(conf.elements.showSelection.setTooltipContent && typeof(conf.elements.showSelection.setTooltipContent) === 'function') {
                  conf.elements.showSelection.setTooltipContent(selections, setTooltipData);
                }                     
            };
            
            var selectionTooltip = new TooltipWidget({
                "elements": tooltipConfiguration.selectionTooltip,
                "container": $selectionIcon,
                "view": tooltip_text
            });

            selectionTooltip.build();
        }

    };

    return TooltipBuilder;
});