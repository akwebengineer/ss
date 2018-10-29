/**
 * A module that builds a drop down to be used in the formatter and unformat callbacks required to render a cell using the dropdown editCell.type  property of a grid column
 *
 * @module DropdownEditBuilder
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
        'lib/template_renderer/template_renderer',
        'widgets/dropDown/dropDownWidget'
    ], /* @lends DropdownEditBuilder */
    function (render_template, DropDownWidget) {

        /**
         * DropdownEditBuilder constructor
         *
         * @constructor
         * @class DropdownEditBuilder - Builds a dropdown for the dropdown editCell.type property of a grid column
         *
         * @param {Object} gridConfigurationHelper - GridConfigurationHelper instance
         * @param {Object} templates - grid templates
         * @returns {Object} Current DropdownEditBuilder's object: this
         */
        var DropdownEditBuilder = function (gridConfigurationHelper, templates) {

            var dropdownColumns = {},
                gridDropdownCellProperties = ["type", "values"],
                columnConfByName,
                $gridTable;

            /**
             * Initializes the DropdownEditBuilder class
             */
            this.init = function (conf) {
                columnConfByName = gridConfigurationHelper.buildColumnConfigurationHashByName(conf.columns);
            };

            /*
             * Defines the event handler for the slipstreamGrid.edit:inlineEditRow event that is triggered when a row goes to inline edit mode
             * @param {Object} $gridTable - jQuery object that represents the grid table (gridTable class)
             * @inner
             */
            var addGridEventListener = function ($gridTable) {
                setDropdownConfiguration();

                //callback to be invoked by the dropdown widget on change event
                var onChangeCallback = function (e) {
                    var $dropdownContainer = $(this).parent(),
                        columnName = $dropdownContainer.attr("data-column-name");
                    if (dropdownColumns[columnName].isSet) {
                        $dropdownContainer.trigger("slipstreamGrid.edit:dropdownChange", {
                            "columnName": columnName,
                            "dropdownId": 1 //widget-identifier
                        });
                    }
                };

                //retrieves the item identifier if it was available in the target or if absent, assign the first item
                var getItemDataIdentifier = function ($target) {
                    var $itemDataIdentifier = $target.find("[data-identifier]").length ? $target.find("[data-identifier]") : $target,
                        itemDataIdentifier = $itemDataIdentifier.data("identifier") || 1;
                    return itemDataIdentifier;
                };

                $gridTable.bind("slipstreamGrid.edit:inlineEditRow", function (evt, editRowData) {
                    for (var name in dropdownColumns) {
                        var dropdownColumn = dropdownColumns[name],
                            $dropdownWrapper, dropdownIdentifier, dropdownColumnItem;
                        dropdownColumns[name].isSet = false; //isSet boolean avoids that onChange event gets triggered when the grid has to set a value in the dropdown widget
                        editRowData[name].$cell.find(".dropdown-widget-integration").each(function () {
                            $dropdownWrapper = $(this);
                            dropdownIdentifier = $dropdownWrapper.data("dropdown-identifier");
                            dropdownColumnItem = dropdownColumns[name]["items"][dropdownIdentifier];
                            dropdownColumnItem.$container = $dropdownWrapper;
                            dropdownColumnItem.instance = new DropDownWidget(_.extend({
                                "container": $dropdownWrapper.find("select"),
                                "height": "small",
                                "onChange": onChangeCallback,
                            }, dropdownColumn.dropdownConfiguration)).build();
                            !_.isUndefined(dropdownColumnItem.cellValue) && dropdownColumnItem.instance.setValue(dropdownColumnItem.cellValue);
                        });

                        // if the current dropdown is the one that was clicked when the inline editing was invoked, then open the dropdown
                        if (editRowData[name] && editRowData[name].$clickedCellTarget) {
                            var itemIdentifier = getItemDataIdentifier(editRowData[name].$clickedCellTarget);
                            dropdownColumns[name]["items"][itemIdentifier] && dropdownColumns[name]["items"][itemIdentifier].instance.toggleState();
                        }
                        dropdownColumn.isSet = true;
                    }
                });
            };

            //initializes dropdown cell
            this.setDropdownHash = function (columnName) {
                dropdownColumns[columnName] = {
                    "items": {}
                };
            };

            /*
             * Sets in the dropdownColumns hash, the configuration for each column that will use a dropdown. It cleans up the configuration from properties only relevant to the grid widget and keeps the one that can be used in the dropdown widget
             * @inner
             */
            var setDropdownConfiguration = function () {
                var dropdownConfiguration;
                for (var name in dropdownColumns) {
                    dropdownConfiguration = $.extend(true, {}, columnConfByName[name].editCell);
                    gridDropdownCellProperties.forEach(function (gridDropdownCellProperty) {
                        delete dropdownConfiguration[gridDropdownCellProperty];
                    });
                    dropdownColumns[name].dropdownConfiguration = dropdownConfiguration;
                }
            };

            /*
             * Defines the html element that will be used to edit a cell with dropdown(s)
             * @param {Array} cellValues - value of the cell that will be represented by dropdown(s)
             * @param {string} columnName - name of the column where the cell belongs to
             * @param {Object} gridTable - DOM object that represents the grid table (gridTable class)
             * @returns {string} html for dropdown(s) cell
             */
            this.setDropdown = function (cellValues, columnName, gridTable) {
                var columnConf = columnConfByName[columnName],
                    editCell = columnConf.editCell,
                    dropdownIdentifier = 1, //sets a default identifier if only one dropdown is required by cell. it starts on 1 instead of 0 to avoid a falsy in the binding of the template
                    dropdownOptions = [],
                    cell, cellValue;
                _.isUndefined($gridTable) && addGridEventListener($(gridTable));

                do {
                    cellValue = cellValues[dropdownIdentifier - 1];
                    dropdownColumns[columnName]["items"][dropdownIdentifier] = {
                        "cellValue": cellValue
                    };
                    dropdownOptions.push({
                        "values": editCell.values,
                        "identifier": dropdownIdentifier++,
                        "columnName": columnName
                    })
                } while (dropdownIdentifier <= cellValues.length);

                cell = render_template(templates.editDropdownCell, {
                    "dropdownOptions": dropdownOptions
                });

                return cell;
            };

            /*
             * Defines the value that will be returned after a cell with dropdown(s) is edited
             * @param {Object} $elem - jQuery Object that represents the cell with the dropdown(s)
             * @returns {Array} value of the cell
             */
            this.getDropdown = function ($elem) {
                if ($elem.length) {
                    var columnName = $elem.attr("name"),
                        cellValue = [],
                        $dropdownWrapper, dropdownIdentifier, dropdownWidgetInstance;
                    $elem.find(".dropdown-widget-integration").each(function () {
                        $dropdownWrapper = $(this);
                        dropdownIdentifier = $dropdownWrapper.data("dropdown-identifier");
                        dropdownWidgetInstance = dropdownColumns[columnName]["items"][dropdownIdentifier].instance;
                        dropdownWidgetInstance && cellValue.push(dropdownWidgetInstance.getValue()); //current support is for single values in the dropdown widget
                    });
                    return cellValue;
                }
                return $elem;
            };

            /*
             * Get instances of the dropdown widget used to build the dropdown for inline editing
             * @returns {Object} All cells with dropdowns with columnName as a key and details of the cell as a value
             */
            this.getDropdownInstancePerColumn = function () {
                var dropdownInstancePerColumn = {};
                _.each(dropdownColumns, function (dropdownColumn, column) {
                    dropdownInstancePerColumn[column] = dropdownColumn.items;
                });
                return dropdownInstancePerColumn;
            }

        };

        return DropdownEditBuilder;
    });