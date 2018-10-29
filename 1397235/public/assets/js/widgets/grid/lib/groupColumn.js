/**
 * A module that sorts columns in its groups by providing utility methods that will be used to enable features related to groups in the columns. It also sets the style classed in the columns with groups to highlight the columns that are grouped.
 *
 * @module GroupColumn
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([], /** @lends GroupColumn */
function () {

    /**
     * GroupColumn constructor
     *
     * @constructor
     * @class GroupColumn - Sort columns in groups
     *
     * @param {Object} gridConfigurationHelper - object of the DateFormatter function
     * @returns {Object} Current GroupColumn's object: this
     */
    var GroupColumn = function (gridConfigurationHelper) {

        /**
         * Builds the GroupColumn
         * @returns {Object} Current "this" of the class
         */

        var self = this,
            groupColumnHash, groupWithColumnName, groupColumnStateHash;

        /**
         * Initializes the GroupColumn class
         */
        this.init = function () {
            setGroupColumnHash();
            if (groupColumnHash)  {//sets only if valid group columns exist
                setGroupsWithColumnName();
                groupColumnStateHash = {};
            }
        };

        /**
         * Sets a hash table with the group id of columns as a key and the column configuration as a value
         * @inner
         */
        var setGroupColumnHash = function () {
            var groupedColumns = gridConfigurationHelper.getColumnsWithProperty("group"),
                groupedColumn, groupId;

            if (groupedColumns) {
                groupColumnHash = {};

                //creates a group hash table by groupIds
                for (var i = 0; i < groupedColumns.length; i++) {
                    groupedColumn = groupedColumns[i];
                    groupId = groupedColumn.group;
                    if (_.isUndefined(groupColumnHash[groupId])) {
                        groupColumnHash[groupId] = [groupedColumns[i]];
                    } else if (i > 0 && groupedColumns[i].sequenceId - 1 == groupedColumns[i - 1].sequenceId) {
                        groupColumnHash[groupId].push(groupedColumn);
                    } else {
                        console.log("column with a group was not defined in a sequence");
                    }
                }

                //removes groupIds  that only have one element
                for (var key in groupColumnHash) {
                    if (groupColumnHash[key].length == 1) {
                        delete groupColumnHash[key];
                    }
                }
            }
        };

        /**
         * Provides a hash table that includes all the columns with the group option, and it uses the group id of columns as a key and the column configuration as a value
         * @returns {Object} groupColumnHash - hash table with the group id of columns as a key and the column configuration as a value
         */
        this.getGroupsWithColumns = function () {
            return groupColumnHash;
        };

        /**
         * Sets a hash table that includes all the columns with the group option, and it uses the group id of columns as a key and all the column names as a value
         * @returns {Object} setGroupsWithColumnName - hash table with the group id of columns as a key and the column names , first columns and last columns as a value
         */
        var setGroupsWithColumnName = function () {
            var group, columns;
            groupWithColumnName = {};
            for (var groupId in groupColumnHash) {
                group = groupColumnHash[groupId];
                columns = _.pluck(group, "name");
                groupWithColumnName[groupId] = {
                    "columns": columns, //all columns
                    "firstLastColumns": [group[0].name, group[_.size(group) - 1].name],//only the first one and the last one
                    "lastColumns": columns.slice(1) //all columns minus the first one
                };
            }
            return groupWithColumnName;
        };

        /**
         * Provides a hash table that includes all the columns with the group option, and it uses the group id of columns as a key and all the column names as a value
         * @returns {Object} groupColumnHash - hash table with the group id of columns as a key and the column names as a value
         */
        this.getGroupsWithColumnName = function () {
            return groupWithColumnName;
        };

        /**
         * Sets the initial state of a group column with respect to the first column in a group
         * @param {string} groupId - id of the group
         * @param {string} columnId - id of the first column in the group as defined by jqGrid
         * @param {string} columnName - name of the first column in the group
         */
        var initializeGroupColumnState = function (groupId, columnId, columnName) {
            groupColumnStateHash[groupId] = {
                "columnId": columnId,
                "firstColumn": columnName,
                "collapsed": false
            };
        };

        /**
         * Provides a hash table that indicates if the group of columns are collapsed or expanded
         * @param {Object} groupColumnHash - hash table with the group id of columns as a key and an Object as a value. The Object includes the id of the first column in the group (aria-describedby attribute), the column name of the first column in the group and if the group is collapsed or not.
         */
        this.getGroupColumnState = function () {
            return groupColumnStateHash;
        };

        /**
         * Updates style of a group column by updating the cell style in that column and specifically for the first column of the group
         * @param {Object} $container - jQuery DOM Object that contains the cells of the group column
         * @param {string} columnId - id of the column, assigned on the aria-describedby attribute
         * @param {boolean} collapsed - true if the all the columns in group are collapsed or false otherwise
         * @inner
         */
        var updateGroupColumnStyle = function ($container, columnId, collapsed) {
            var columnCells = gridConfigurationHelper.getCellsFromAriaDescribedBy($container, columnId);
            if (_.isUndefined(collapsed)) {
                columnCells.toggleClass("collapsed-group-column");
            } else {
                if (collapsed) {
                    columnCells.addClass("collapsed-group-column");
                } else {
                    columnCells.removeClass("collapsed-group-column");
                }
            }
        };

        /**
         * Updates style of a set of group columns by updating the cell style in that columns
         * @param {Object} $container - jQuery DOM Object that contains the cells of the group columns to be updated
         */
        this.updateGroupColumnsStyle = function ($container) {
            for (var groupId in groupColumnStateHash) {
                var groupColumnState = groupColumnStateHash[groupId];
                updateGroupColumnStyle($container, groupColumnState.columnId, groupColumnState.collapsed);
            }
        };

        /**
         * Sets the style and interaction on the title of the columns that have the group option
         * @param {Object} containers - hash table with references to the grid jQuery DOM Objects
         * @param {Function} showHideGridColumnCallback - callback function from the GridWidget class used to show or hide a group column
         * @param {Object} tooltipBuilder - instance of the TooltipBuilder class
         */
        this.setGroupColumnTitle = function (containers, showHideGridColumn, tooltipBuilder) {
            var groupWithColumnName = self.getGroupsWithColumnName(),
                tableId = containers.$gridWidget.find(".gridTable").attr("id"),
                columnIdPrefix = tableId + "_",
                columnId, group, $columnHeader, $groupControl;
            var showHideColumns = function (groupId, isExpanded) { //show or hide a group of columns where if isExpanded is set on true, it implies that columns needs to hide (
                    var lastColumns = groupWithColumnName[groupId].lastColumns,
                        lastColumnsLength = lastColumns.length - 1,
                        lastColumn;
                    for (var i = 0; i <= lastColumnsLength; i++) {
                        lastColumn = lastColumns[i];
                        showHideGridColumn(lastColumn, !isExpanded, i == lastColumnsLength); //triggers resize only on last column
                    }
                },
                getColumnLabel = function (column) {//gets the label for a column that has a custom value defined in its formatter/unformat callbacks
                    var columnLabel = column.label || column.name;
                    if (_.isObject(column.label)) {
                        columnLabel = _.isFunction(columnLabel.unformat) ? columnLabel.unformat(column.name, column) : column.name
                    }
                    return columnLabel;
                },
                bindGroupControlEvents = function ($container) { //binds event related to the expand/collapse group controls
                    $container.bind("click", ".group-icon", function (e) {
                        e.stopPropagation(); //required to stop default events triggered by jqGrid like sorting
                        var $groupControl = $(this),
                            groupId = $groupControl.attr("data-group-id"),
                            isExpanded = !_.isUndefined($groupControl.attr("data-group-expanded")),
                            $firstColumn = groupWithColumnName[groupId].$firstColumn;
                        $firstColumn.find("[data-group-collapsed]").toggleClass("hide"); //switch expand/collapse controls
                        showHideColumns(groupId, isExpanded);
                        groupColumnStateHash[groupId].collapsed = !groupColumnStateHash[groupId].collapsed;//toggles collpased/expanded state
                        updateGroupColumnStyle(containers.$gridTable, $firstColumn.attr("id")); //style on/off cells on collapsed column group
                    });
                };
            for (var groupId in groupWithColumnName) {
                group = groupWithColumnName[groupId];
                group.columns.forEach(function (columnName) {
                    columnId = columnIdPrefix + gridConfigurationHelper.escapeSpecialChar(columnName);
                    $columnHeader = containers.$header.find("#" + columnId);
                    //only first and last column will have expand/collapse columns
                    $groupControl = $columnHeader.addClass("groupColumn").find(".group-control");
                    bindGroupControlEvents($groupControl);
                    if (_.isUndefined(group.$firstColumn)) { //sets first column: caches it, sets state and adds tooltip
                        group.$firstColumn = $columnHeader;
                        initializeGroupColumnState(groupId, columnId, columnName);
                        //adds tooltip for the column title of the first column in the group of columns
                        var columnTitles = _.map(groupColumnHash[[groupId]], getColumnLabel);
                        tooltipBuilder.addGroupColumnTitleTooltip($columnHeader.find(".group-count"), columnTitles);
                    }
                });
            }
        };

    };

    return GroupColumn;
});