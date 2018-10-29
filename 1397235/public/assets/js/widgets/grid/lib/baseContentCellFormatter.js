/**
 * A module that provides the cell formatter and unformat callbacks required to render a base cell content
 *
 * @module BaseContentCellFormatter
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n'
], function (render_template, i18n) {

    /**
     * BaseContentCellFormatter constructor
     *
     * @constructor
     * @class BaseContentCellFormatter - Formats the cell content
     *
     * @param {Object} conf
     * @param {Object} gridConfigurationHelper - GridConfigurationHelper instance
     * @param {Object} templates - grid templates
     * @returns {Object} Current BaseContentCellFormatter's object: this
     */
    var BaseContentCellFormatter = function (conf, gridConfigurationHelper, templates) {
        var self = this,
            defaultEmptyColumnTemplates,
            columnsHash = gridConfigurationHelper.buildColumnConfigurationHashByName();

        /**
         * Get emptyCell templates for all columns
         * return a hash that contains the emptyCell template for all columns 
         */
        this.getEmptyColumnTemplates = function(){
            _.isUndefined(defaultEmptyColumnTemplates) && (defaultEmptyColumnTemplates = generateColumnEmptyTemplate());
            return defaultEmptyColumnTemplates;
        };

        /**
         * Generate a hash table for all default empty templates
         * @inner
         * return a hash that contains the emptyCell template for all columns 
         */
        var generateColumnEmptyTemplate = function(){
            var columnEmptyTemplates = {},
                defaultEmptyCellData = {
                    text: " &mdash; "
                };
                
            /**
             * Get emptyCell text and tooltip
             * @param {Object} config: the current emptyCell config
             * @param {Object} emptyCellData
             * @inner
             */
            var getEmptyCellData = function(config, emptyCellData){
                var text = emptyCellData.text,
                    tooltip = emptyCellData.tooltip;

                if (config == false || (config && config.label == false)){
                    text = "";
                }else if (_.isObject(config)){
                    !_.isBoolean(config.label) && !_.isUndefined(config.label) && (text = config.label);
                    tooltip = _.isBoolean(config.tooltip) && config.tooltip ? i18n.getMessage('grid_empty_cell_tooltip') : config.tooltip;
                }
                return {text: text, tooltip: tooltip};
            };

            var newCellData = getEmptyCellData(conf.emptyCell, defaultEmptyCellData);
            conf.columns.forEach(function(columnConf){
                var columnEmptyData = getEmptyCellData(columnConf.emptyCell, newCellData);
                                   
                columnEmptyTemplates[columnConf.name] = render_template(templates.emptyCell, columnEmptyData);
            });
            
            return columnEmptyTemplates;
        }

        /**
         * Generate empty cell template 
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         * @returns {strings} HTML template 
         */
        this.generateEmptyTemplate = function(cellvalue, options, rowObject){
            var content = cellvalue;

            defaultEmptyColumnTemplates = self.getEmptyColumnTemplates();
            
            if (conf.tree){
                var hasParentRowData = conf.tree.hasParentRowData || false; //TODO: Need to support hasParentRowData in the later story
                if (gridConfigurationHelper.isEmptyValue(cellvalue) && (gridConfigurationHelper.isTreeLeaf(rowObject) || hasParentRowData)){
                    content = defaultEmptyColumnTemplates[options.colModel.name];
                }else if (_.isUndefined(cellvalue)){
                    content = "";
                }
            } else if (gridConfigurationHelper.hasOnlyEmptyValueArray(cellvalue) || gridConfigurationHelper.isEmptyValue(cellvalue)){
                content = defaultEmptyColumnTemplates[options.colModel.name];
            }
            return content;
        };

        /*
         * Custom function to update the content of a cell
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         * return the HTML template string 
         * @inner
         */
        var formatBaseContent = function (cellvalue, options, rowObject) {
            var content = cellvalue;
            if (_.isFunction(columnsHash[options.colModel.name].formatter)) {
                content = columnsHash[options.colModel.name].formatter(cellvalue, options, rowObject);
            }else{
                content = self.generateEmptyTemplate(cellvalue, options, rowObject);
            }
            return content;
        };

        /*
         * Custom function to restore the value of the cell before it was formatted by formatter function
         * @param {Object} cellvalue: data is from jqGrid formatter callback
         * @param {Object} options: data is from jqGrid formatter callback
         * @param {Object} rowObject: data is from jqGrid formatter callback
         * return the HTML template string 
         * @inner
         */
        var unformatBaseContent = function (cellvalue, options, rowObject) {
            var content = cellvalue,
                isEmptyCell = self.isEmptyCell($(rowObject));

            if (_.isFunction(columnsHash[options.colModel.name].formatter) && _.isFunction(columnsHash[options.colModel.name].unformat)) {
                content = columnsHash[options.colModel.name].unformat(cellvalue, options, rowObject);
            }else if (gridConfigurationHelper.isEmptyValue(cellvalue) || isEmptyCell){
                content = "";
            }
            return content;
        };

        /*
         * Check if the current cell is an emptyCell
         * @param {jQuery Object} $cell
         * return true/false
         */
        this.isEmptyCell = function ($cell) {
            return $cell.find("[data-empty-cell]").length > 0 ? true : false;
        };

        /*
         * Check if the current column should enable emptyCell or not
         * @param {columnConf} 
         * @param {isFormatter} if the function should return formatter func
         * return emptyCell formatter, unformat, or undefined (if emptyCell is false)
         */
        this.enableEmptyCell = function (columnConf, isFormatter) {
            var emptyCellFunc;

            var checkEmptyCellConf = function(config){
                    return _.isUndefined(config) || _.isObject(config) || config == true;
                },
                isEmptyConfEnabled = function(){
                    var isGridEmptyCellEnabled = checkEmptyCellConf(conf.emptyCell),
                        isColEmptyCellEnabled = checkEmptyCellConf(columnConf["emptyCell"]);
                    return isGridEmptyCellEnabled && isColEmptyCellEnabled;
                }(); 
                

            if (isFormatter){
                if (_.isFunction(columnConf.formatter) || isEmptyConfEnabled){
                    emptyCellFunc = formatBaseContent;
                }
            }else{
                if (_.isFunction(columnConf.unformat) || isEmptyConfEnabled){
                    emptyCellFunc = unformatBaseContent;
                }
            }
            
            return emptyCellFunc;
        }; 
    };

    return BaseContentCellFormatter;
});