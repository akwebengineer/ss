/**
 * A module that provides the cell formatter and unformat callbacks required to render a cell using the groupContent style
 *
 * @module CollapseContentEditCellFormatter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([
        'lib/template_renderer/template_renderer',
    ], /* @lends CollapseContentEditCellFormatter */
    function (render_template) {

        /**
         * CollapseContentEditCellFormatter constructor
         *
         * @constructor
         * @class CollapseContentEditCellFormatter - Formats the cells that are of the groupContent type
         *
         * @param {Object} gridConfigurationHelper - GridConfigurationHelper instance
         * @param {Object} dropdownEditBuilder - DropdownEditBuilder instance
         * @param {Object} templates - grid templates
         * @param {Object} rowMaxElementConf - row configuration with the max numbers of elements that can be seen in a cell when the row is expanded or collapsed
         * @param {Object} lookupLabelContentTable - key/label hash table for the collapseContent cells with data of the Object type
         * @returns {Object} Current CollapseContentEditCellFormatter's object: this
         */
        var CollapseContentEditCellFormatter = function (gridConfigurationHelper, dropdownEditBuilder, templates, rowMaxElementConf, lookupLabelContentTable) {

            var columnConfByName;

            /**
             * Initializes the CollapseContentEditCellFormatter class
             */
            this.init = function (conf) {
                columnConfByName = gridConfigurationHelper.buildColumnConfigurationHashByName(conf.columns);
            };

            /**
             * Gets the formatter required to edit a collapseContent cell depending on the editCell property defined in its column configuration
             * @param {Object} originalColumn - column configuration, as defined in the grid widget configuration (elements.columns)
             */
            this.getEditFormatter = function (originalColumn) {
                var editObj = {
                    "editable": true,
                    "edittype": "custom"
                };
                var isKeyValueCell = originalColumn["collapseContent"].keyValueCell ? true : false;
                if (originalColumn['editCell'] && !isKeyValueCell) { //cells with custom edition are only available for array cell
                    editObj["editoptions"] = {
                        custom_element: getCustomEditionCell,
                        custom_value: getCustomEditionValue
                    };
                } else {
                    editObj["editoptions"] = {
                        custom_element: isKeyValueCell ? cellObjectTextarea : cellTextarea,
                        custom_value: isKeyValueCell ? cellObjectTextValue : cellTextValue
                    };
                }
                if (originalColumn.editCell && originalColumn.editCell.type == "dropdown") {
                    dropdownEditBuilder.setDropdownHash(originalColumn.name); //initializes dropdown cell
                }
                return editObj;
            };

            /*
             * Defines the html element that will be used to edit a cell and that is available only for collapseContent columns with editCell property
             * @inner
             */
            var getCustomEditionCell = function (cellvalue, options) {
                var columnConf = columnConfByName[options.name],
                    editCell = columnConf.editCell,
                    editMoreCellValue, cell;

                //removes possible empty entries introduced by the formatter
                if (_.isArray(cellvalue)) {
                    cellvalue = cellvalue.filter(function (value) {
                        return value != '';
                    });
                }

                switch (editCell.type) {
                    case 'dropdown':
                        cell = dropdownEditBuilder.setDropdown(cellvalue, options.name, this);
                        break;
                    default:
                        editMoreCellValue = {
                            "element_text": true,
                            "values": cellvalue
                        };
                        cell = render_template(templates.editMoreCell, editMoreCellValue);
                        break;
                }

                return cell;
            };

            /*
             * Defines the value that will be returned after a cell is edited.
             * @inner
             */
            var getCustomEditionValue = function ($elem, operation, value) {
                var editCellType;
                if ($elem.hasClass("dropdown-widget-integration-wrapper")) {
                    editCellType = "dropdown";
                }
                if (operation === 'get') {
                    if ($elem.length) {
                        var cellvalue = [];
                        switch (editCellType) {
                            case 'dropdown':
                                cellvalue = dropdownEditBuilder.getDropdown($elem);
                                break;
                            default: //input is the default cell type
                                $elem.find(".edit_more_input").each(function () {
                                    cellvalue.push($(this).find("input").val());
                                });
                                break;
                        }
                        return cellvalue;
                    }
                } else if (operation === 'set') {
                    $('textarea', $elem).val(value);
                }
                return $elem;
            };

            /*
             * Defines the html element that will be used to edit a cell with the default textarea edit type
             */
            var cellTextarea = function (cellvalue, options) {
                var $textarea = $("<textarea readonly>");
                var value = cellvalue,
                    breaks = rowMaxElementConf.edit;
                if (cellvalue instanceof Array) {
                    value = cellvalue[0];
                    var cellvalueLength = cellvalue.length;
                    if ((cellvalueLength - 1) < breaks) breaks = cellvalueLength - 1;
                    for (var i = 1; i < cellvalueLength; i++) {
                        if (cellvalue[i] != "")
                            value += "\n" + cellvalue[i];
                    }
                } else {
                    breaks = 1;
                }
                $textarea.attr('rows', breaks).val(value).addClass('cellOverlayView');
                return $textarea[0];
            };

            /*
             * Defines the value that will be returned after a cell is edited.
             */
            var cellTextValue = function (elem, operation, value) {
                if (operation === 'get') {
                    if (_.isElement(elem[0])) {
                        return elem.val().trim().split('\n');
                    } else {
                        return "";
                    }
                } else if (operation === 'set') {
                    $('textarea', elem).val(value);
                }
            };

            /*
             * Defines the html element that will be used to edit a cell with the default textarea edit type
             */
            var cellObjectTextarea = function (cellvalue, options) {
                var $textarea = $("<textarea readonly>");
                var label,
                    value = '',
                    breaks = rowMaxElementConf.edit;
                if (cellvalue instanceof Object) {
                    var keyLabelTable = lookupLabelContentTable[options.name],
                        cellvalueSize = _.size(cellvalue);
                    if (cellvalueSize < breaks) breaks = cellvalueSize;
                    for (var key in cellvalue) {
                        cellvalueSize--;
                        label = keyLabelTable && keyLabelTable[key] ? keyLabelTable[key] : key;
                        value += label + ": " + cellvalue[key];
                        if (cellvalueSize)
                            value += "\n";
                    }
                } else {
                    value = cellvalue;
                    breaks = 1;
                }
                $textarea.attr('rows', breaks).val(value).addClass('cellOverlayView');

                return $textarea[0];
            };

            /*
             * Defines the value that will be returned after a cell is edited.
             */
            var cellObjectTextValue = function (elem, operation, value) {
                var cellObject = {},
                    keyValue;
                if (operation === 'get') {
                    if (_.isElement(elem[0])) {
                        var valueObj = elem.val().trim().split('\n');
                        for (var i = 0; i < valueObj.length; i++) {
                            keyValue = valueObj[i].split(": ");
                            cellObject[keyValue[0]] = keyValue [1];
                        }
                        return cellObject;
                    } else {
                        return "";
                    }
                } else if (operation === 'set') {
                    $('textarea', elem).val(value);
                }
            };

        };

        return CollapseContentEditCellFormatter;
    });