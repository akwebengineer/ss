/**
 * A module that reformat configuration into the configuration of grid widget
 *
 * @module FormatConf
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(['lib/i18n/i18n',
        'lib/template_renderer/template_renderer',
        'text!widgets/listBuilderNew/templates/noResultTemplate.html'
    ],  /** @lends FormatConf */
    function(i18n, render_template, noResultTemplate) {

    /**
     * FormatConf constructor
     *
     * @constructor
     * @class FormatConf - reformat configuration
     *
     * @returns {Object} Current FormatConf's object: this
     */
    var FormatConf = function(conf, searchObj){

        /**
         * Builds the SearchOptions
         * @returns {Object} Current "this" of the class
         */

        var self = this;

        /**
         * return the reformatted conf
         * @param {Boolean} isSelectedPanel - if this is selected grid
         * @param {Object} elements - all UI elements in ListBuilder
         * @param {Boolean} isCollectionBased - if this is collection based grid
         */
        this.getConf = function (isSelectedPanel, elements, isCollectionBased) {
            return reformatConf(isSelectedPanel, elements, isCollectionBased);
        };

        /**
         * Update columns config to match grid widget
         * @param {Array} columns conf
         * @inner
         */
        var updateColumnConf = function(columns){
            if (conf.search && conf.search.columns){
                var searchColumns = _.isString(conf.search.columns)? [conf.search.columns]: conf.search.columns;

                for (var i = 0; i < columns.length; i++){
                    for(var j = 0; j < searchColumns.length; j++){
                        if(searchColumns[j] === columns[i]['name']){
                            columns[i].searchCell = true;
                        }
                    }
                }
            }

            return columns;
        };

        /**
         * return column configuration data
         * @param {Object} Object with hash of column name with column details values
         * @param {Array} Array with config path
         */
        var getColumnConfiguration = function (columnsConfig, paths) {
            var columnDetails;

            $.each(columnsConfig, function (index, column) {
                var currentConf = column,
                    count = 0;
                for (var i = 0; i < paths.length; i++){
                    if (currentConf[paths[i]]){
                        currentConf = currentConf[paths[i]];
                        count += 1;
                    }else{
                        break;
                    }
                }
                if (count === paths.length){
                    columnDetails = column;
                }
            });
            return columnDetails;
        };

        /**
         * Generate no result template
         * @param {Boolean} isSelectedPanel - if this is selected grid
         */
        var generateNoResultTemplate = function (isSelectedPanel) {
            var text = isSelectedPanel ? i18n.getMessage('listBuilder_no_selected_data'):i18n.getMessage('listBuilder_no_available_data'),
                content = render_template(noResultTemplate, {text: text});
            return content;
        };

        /**
         * getPageData Callback
         * @param {Boolean} isSelectedPanel - if this is selected grid
         */
        var getPageDataCallback = function(isSelectedPanel){
            return function (renderData, pageData, searchToken, pageSize){
                if (isSelectedPanel){
                    conf.selectedElements.getPageData(renderData, pageData, searchObj.selectedSearchValue, pageSize);
                }else{
                    conf.availableElements.getPageData(renderData, pageData, searchObj.availableSearchValue, pageSize);
                }
            };
        };
        /**
         * Generate grid widget configuration 
         * @param {Boolean} isSelectedPanel - if this is selected grid
         * @param {Object} elements - all UI elements in ListBuilder
         * @param {Boolean} isCollectionBased - if this is collection based grid
         * @inner
         */
        var reformatConf = function(isSelectedPanel, elements, isCollectionBased){
            var isLoadLocally = (conf.availableElements && !_.isUndefined(conf.availableElements.data)),
                updatedColumns = updateColumnConf(conf.columns),
                hasColumnFiter = (conf.search && conf.search.columns)? true: false,
                id = conf.id? conf.id : _.uniqueId(),
                filterConf = {
                    searchUrl: true,
                    columnFilter: ((conf.loadonce || conf.availableElements.data ) && hasColumnFiter)? true:false,
                    readOnlySearch: {
                        logicOperator: "or"
                    }
                },
                gridConf = {
                    footer: false,
                    height: conf.height && _.isString(conf.height) ? conf.height.replace('px', ''): "200",
                    sorting: conf.sorting,
                    jsonId: conf.jsonId,
                    numberOfRows: conf.pageSize,
                    columns: updatedColumns,
                    multiselect: true,
                    contextMenu: true,
                    tableId: isSelectedPanel? "slipstream_listbuilder_grid2_" + id : "slipstream_listbuilder_grid1_" + id,
                    scroll: !(isLoadLocally && conf.loadonce)? true: false,
                    ajaxOptions: conf.ajaxOptions,
                    noResultMessage: generateNoResultTemplate(isSelectedPanel),
                    _loadonce: conf.loadonce ? true : false,
                    filter: filterConf,
                    rowHoverMenu: {
                        "customButtons": [{
                            "icon_type": true,
                            "key": "selectOnHover",
                            "icon": {
                                "default": {
                                    icon_url: "#icon_arrow_right",
                                    icon_class: "selecion_arrow icon_arrow_right-dims"
                                }
                            }
                        }]
                    },
                    showWidthAsPercentage: _.isBoolean(conf.showWidthAsPercentage) ? conf.showWidthAsPercentage : false
                };

            /**
             * Extend configuration based on different settings
             * @param {Boolean} isSelectedPanel - if this is selected grid
             * @inner
             */
            var extendConf = function(isSelectedPanel){
                var element = isSelectedPanel? "selected": "available",
                    elementConf = conf[ element+ "Elements"];
                    
                /**
                 * Defines a function that returns the number of records that an API response could have
                 * @param {Object} data
                 * @inner
                 */
                var jsonRecordsFunc = function(data){
                    var total,
                        recordsRoot = elementConf.totalRecords.split('.'),
                        rRootLength = recordsRoot.length;
                    if (rRootLength > 0){
                        total = data;
                        for(var i = 0; i<rRootLength; i++){
                            if (total[recordsRoot[i]]){
                                total = total[recordsRoot[i]];
                            }else{
                                total = 0;
                            }
                        }
                    }
                    return total;
                },

                /**
                 * Defines a callback that will be called to overwrite the final URL request sent to the server for GET method
                 * @param {Object} the originalUrl object with all the parameters that will be sent in the URL request
                 * @inner
                 */
                reformatUrlFunc = function(originalUrl){
                    var isSelectedPanel = (this.tableId.search("slipstream_listbuilder_grid1") !== -1)? false: true;

                    if ((originalUrl["_search"] === "slipstream_available") || (originalUrl["_search"] === "slipstream_selected")){   
                        var postData = (originalUrl["_search"] === "slipstream_available")? searchObj.customAvailableGridPostData: searchObj.customSelectedGridPostData;
                        delete originalUrl["_search"];
                        if (_.isArray(postData)){
                            originalUrl = conf.search.url(originalUrl, postData);
                        }else{
                            _.extend(originalUrl, postData);
                        }
                    }else{
                        originalUrl["_search"] = isSelectedPanel ? searchObj.selectedSearchValue : searchObj.availableSearchValue;
                        _.extend(originalUrl, elementConf.urlParameters);
                    }
                    _.isEmpty(originalUrl['_search']) && delete originalUrl['_search'];
                    if (isSelectedPanel){
                         searchObj.gridSelectedPostData = {};
                        $.extend(true, searchObj.gridSelectedPostData, originalUrl);
                    }else{
                        searchObj.gridAvailablePostData = {};
                        $.extend(true, searchObj.gridAvailablePostData, originalUrl);
                    }
                    
                    return originalUrl
                },

                /**
                 * Defines a callback that will be invoked when a user click on the select all checkbox of the grid
                 * @param {Function} setIdsSuccess is a callback that needs to be invoked with an array of all the row ids available in the grid
                 * @inner
                 */
                onSelectAllFunc = function(setIdsSuccess){
                    /**
                     * Trigger triggerOnSelectAllSelectedDone 
                     * @param {Object} data
                     * @inner
                     */
                    var triggerOnSelectAllSelectedDone  = function(data) {
                        elements.panel2.trigger('onSelectAllCompleted', data);
                        setIdsSuccess(data['ids']);
                    },

                    /**
                     * Trigger triggerOnSelectAllAvailableDone 
                     * @param {Object} data
                     * @inner
                     */
                    triggerOnSelectAllAvailableDone  = function(data) {
                        elements.panel1.trigger('onSelectAllCompleted', data);
                        setIdsSuccess(data['ids']);
                    };
                    
                    elements.buttonContainer.find('.arrow').addClass("arrow_disable");
                    if (isSelectedPanel && elementConf.onSelectAll){
                        elementConf.onSelectAll(triggerOnSelectAllSelectedDone);
                    }else if (elementConf.onSelectAll){
                        elementConf.onSelectAll(triggerOnSelectAllAvailableDone);
                    }
                };

                if (elementConf.data){
                    _.extend(gridConf, {
                        data: elementConf.data,
                        _loadonce: true
                    });
                }else{
                    _.extend(gridConf, {
                        jsonRoot: elementConf.jsonRoot,
                        url: elementConf.url,
                        getData: elementConf.getData,
                        jsonRecords: jsonRecordsFunc,
                        postData: elementConf.urlParameters
                    });
                    if (!conf.loadonce){                       
                        _.extend(gridConf, {
                            onSelectAll: onSelectAllFunc,
                            reformatUrl: conf.search && conf.search.url? reformatUrlFunc : undefined,
                            onSelectRowRange: elementConf.onSelectRowRange || undefined
                        });
                    }
                }        
            };

            if (isSelectedPanel){
                if (conf.selectedElements){
                    extendConf(true);
                }
            }else{
                extendConf();
            }

            if (isCollectionBased){
                _.extend(gridConf, {getPageData: getPageDataCallback(isSelectedPanel)});
            }

            return gridConf;
        };

      

    };

    return FormatConf;
});