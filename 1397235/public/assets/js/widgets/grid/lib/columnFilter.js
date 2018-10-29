/**
 * A module that formats a column for the selection of a row in the tree grid. The column is located in the same location as the on in the simple grid. User interaction is consistent with the grid selection model.
 *
 * @module ColumnFilter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/gridTemplates',
    'widgets/contextMenu/contextMenuWidget',
    'widgets/grid/view/dateSearchView',
    'widgets/grid/view/numberSearchView',
    'widgets/dropDown/dropDownWidget',
],  /** @lends ColumnFilter */
    function(render_template, GridTemplates, ContextMenuWidget, DateSearchView, NumberSearchView, DropDownWidget) {

    /**
     * ColumnFilter constructor
     *
     * @constructor
     * @class ColumnFilter - Formats a column in the tree grid to provide row column selection.
     * @param {Class} gridConfigurationHelper - Grid gridConfigurationHelper Class
     * @param {Class} searchUtility - SearchUtility class instance
     * @param {Object} gridSizeCalculator - gridSizeCalculator instance
     * @returns {Object} Current ColumnFilter's object: this
     */
    var ColumnFilter = function(gridConfigurationHelper, searchUtility, gridSizeCalculator){

        /**
         * Builds the ColumnFilter
         * @returns {Object} Current "this" of the class
         */

        var $gridContainer, $searchContainer, containers,
            headerLabelId = _.uniqueId("slipstream_grid_widget_header_label_container"),
            templates = new GridTemplates().getTemplates();

        /*
         * Defines the html element that will be used to select a row.
         * @param {Object} $container -  jQuery Object that represents the grid container
         * @inner
         */
        this.setGridContainer =  function (gridContainers) {
            containers = gridContainers;
            $gridContainer = containers.$gridWidget;
            $searchContainer = $gridContainer.find('.search-container');
        };

        var triggerAddTokensEvent = function (value, column){
            var addToken = { "searchValue": value };
            column && (addToken.columnName = column.index || column.name);
            column && (addToken.origName = column.name || '');
            $searchContainer.trigger("slipstream-add-token", addToken);
        };

        var triggerRemoveTokensEvent = function (column, value){
            $searchContainer.trigger("slipstream-remove-token",{
                "columnName": column.index || column.name,
                "searchValue": value
            });
        };

        var triggerRemoveColumnTokenNoReloadEvent = function (column){
            $searchContainer.trigger("slipstream-remove-column-token-no-reload",{
                "columnName": column.index || column.name
            });
        };

        var triggerReplaceColumnToken = function (column, searchValue){
            $searchContainer.trigger("slipstream-replace-column",{
                "columnName": column.index || column.name,
                "searchValue": searchValue
            });
        };

        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} column - column that requires input search
         * @inner
         */
        this.getInputSearch =  function (column) {
            return {
                dataEvents: [{
                    type: 'keypress',
                    fn: function(e) {
                        if (e.keyCode === 13 ){ //on Enter (13), the token is added
                            triggerAddTokensEvent(e.target.value, column);
                            this.value = ""; //clear value since it is already added in the token area
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    }
                }]
            }
        };

        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} column - column that requires input search
         * @param {Object} searchCell - searchCell conf
         * @inner
         */
        this.getDropdownSearch = function (column, searchCell) {
            if (_.isUndefined(searchCell.checkbox) || searchCell.checkbox === true) {
                return getContextMenuWidgetFilter(column, searchCell);
            }
            else {
                return getDropdownWidgetFilter(column, searchCell);
            }
        };

        /**
         * Provides the dataInit callback required to build a dropdown menu with checkboxes using the ContextMenu widget
         * @param {Object} column - column that requires dropdown search
         * @param {Object} searchCell - searchCell conf
         * @inner
         */
        var getContextMenuWidgetFilter = function (column, searchCell) {
            var columnName = column.index || column.name,
                tokenKey = columnName + ' = ',
                dropDownData;

            $searchContainer.bind('slipstream-token-removed', function (e, token) {
                //Todo: filterOption remove token handler using the same code, hence this code can be refactored to a common area
                if (token) {
                    var tokenConfigKey;
                    var advanceSearchFilterMenuHash = searchUtility.getAdvanceSearchFilterMenuHash();
                    if(_.isUndefined(advanceSearchFilterMenuHash)){
                        tokenConfigKey = tokenKey;
                    } else {
                        tokenConfigKey = advanceSearchFilterMenuHash[columnName] + " = ";
                    }

                    if (~token.lastIndexOf(tokenConfigKey)) {
                        var tokenValueArr = token.slice(tokenConfigKey.length).split(',');
                        tokenValueArr.forEach(function (tokenValue) {
                            dropDownData && (dropDownData[tokenValue] = false); //fix for advanced filter
                        });
                    }
                } else {
                    for (var key in dropDownData){
                        dropDownData[key] = false;
                    }
                }
            });

            var dropDownItems = [];
                searchCell['values'].forEach(function(option){
                dropDownItems.push({
                    "key": option.label,
                    "value": option.value,
                    "label": option.label,
                    "type": "checkbox",
                    "events": {
                        "change": function(e){
                            var label= option.label;
                            if (this.checked){
                                triggerAddTokensEvent(label, column);
                            } else {
                                triggerRemoveTokensEvent(column, label);
                            }
                        }
                    }
                });
            });

            var dropDownEvents = {
                show: function(opt, contextMenuCallbacks) {
                    dropDownData = $(this).data();

                    /**
                     * Calculates max-height to be set for context-menu.
                     * If grid content's max-height is set, then max-height of context menu for the column filters will be equal to grid's max-height, substracting the height of grid's header and search container if available.
                     * If it is not set, then context-menu's max-height will be set to 80% of the parent container.
                     */
                    var calcMaxHeight = function() {

                        var gridMaxHeight = gridSizeCalculator.getGridMaxHeight(true);
                        var height;
                        if(!_.isUndefined(gridMaxHeight)) {
                            height = parseInt(gridMaxHeight, 10);
                        } else {
                            height = '80%';
                        }
                        return height;
                    };

                    contextMenuCallbacks.configureMaxHeight(calcMaxHeight());

                    //TODO: Declare a function in contextMenu widget and use that function here to set input values
                    if(!_.isEmpty(dropDownData) )
                        $.contextMenu.setInputValues(opt, dropDownData); // import states from data store
                },
                hide: function(opt) {
                    //TODO: Declare a function in contextMenu widget and use that function here to get input values
                    $.contextMenu.getInputValues(opt, dropDownData); // export states to data store
                }
            };

            //provides a unique id that could be identified by the context menu widget
            var getDropDownId = function (dropDownId) {
                dropDownId = "#" + gridConfigurationHelper.escapeSpecialChar(dropDownId);
                var dropDownMenuId = "." + headerLabelId + " ~ .ui-search-toolbar " + dropDownId;
                $gridContainer.find('.ui-jqgrid-labels').addClass(headerLabelId);
                return dropDownMenuId;
            };

            return {
                dataInit: function (element) {
                    element.readOnly = true;
                    element.className = "hasDropdown";

                    var dropdownSearch = new ContextMenuWidget({
                        "elements": {
                            "items": dropDownItems,
                            "events": dropDownEvents,
                            "position": function(opt, x, y){
                                opt.$menu.position({ my: "left top", at: "left bottom", of: this, offset: "0 0"});
                            }
                        },
                        "container": getDropDownId(element.id),
                        "trigger": 'left',
                        "dynamic": true,
                        "autoHide": true
                    });
                    dropdownSearch.build();
                }
            }
        };

        /**
         * Provides the dataInit callback required to build a dropdown menu using the Dropdown widget
         * @param {Object} column - column that requires dropdown search
         * @param {Object} searchCell - searchCell conf
         * @inner
         */
        var getDropdownWidgetFilter = function (column, searchCell) {
            var onDropdownChange = function () {
                    var value = dropdownWidgetFilter.getValue(),
                        key = column.index || column.name;
                    triggerReplaceColumnToken(column, [key + "= " + value]);
                },
                dropdownWidgetConfig = _.extend({
                    onChange: onDropdownChange,
                    height: "small"
                }, searchCell),
                dropdownWidgetFilter;
            return {
                dataInit: function (element) {
                    // "element" is <input> element which is provided to dataInit callback.
                    // dropdownWidget cannot use the element as a container because it needs a select element
                    // So, this hack is to work around it
                    var $elem = $(templates.columnFilterDropdownWrapper);
                    $(element).parent().append($elem);
                    $(element).remove();
                    $.extend(dropdownWidgetConfig, {"container": $elem});
                    dropdownWidgetFilter = new DropDownWidget(dropdownWidgetConfig).build();
                }
            }
        };

        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} conf - Grid configuration object
         * @inner
         */
        this.getDateSearch =  function (column) {
            return {
                dataInit: function (element) {
                    element.className = "hasDate detailView";
                },
                dataEvents: [{
                    type: 'click',
                    fn: function() {
                        new  DateSearchView({
                            'column': column,
                            'replaceTokens': triggerReplaceColumnToken
                        });
                    }
                }]
            }
        };

        /**
         * Builds the selection column configuration to be used in the tree grid.
         * @param {Object} conf - Grid configuration object
         * @inner
         */
        this.getNumberSearch =  function (column) {
            return {
                dataInit: function (element) {
                    element.className = "hasNumber detailView";
                },
                dataEvents: [{
                    type: 'click',
                    fn: function() {
                        new  NumberSearchView({
                            'column': column,
                            'replaceTokens': triggerReplaceColumnToken
                        });
                    }
                }]
            }
        };

    };

    return ColumnFilter;
});