/**
 * A module that switches column when row is hovered
 *
 * @module columnSwitchOnHover
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([], function(){
    var ColumnSwitchOnHover = function(conf, gridFormatter, gridConfigurationHelper) {
        /**
         * columnSwitchOnHover constructor
         *
         * @constructor
         * @class columnSwitchOnHover - switches column when row is hovered
         *
         * @param {Object} conf - User configuration object
         * @param {Class} gridFormatter
         * @param {Class} gridConfigurationHelper
         * @returns {Object} Current columnSwitchOnHover's object: this
         */
        var switchCheckboxColName;
        /**
         * Initialize columnSwitchOnHover
         * @param {Object} $gridTable
         * @param {Object} gridContainer
         */
        this.init = function($gridTable, gridContainer){
            if (_.isObject(gridFormatter.getSwitchColumnConfig())){
                this.updateSwitchedColumnStyle($gridTable, gridContainer);
                this.bindSwitchColHoverRow($gridTable);
            }
        };

        /**
         * Bind row hover event
         *
         * @param {Object} $gridTable 
         */
        this.bindSwitchColHoverRow = function($gridTable){  
            $gridTable.bind("slipstreamGrid.row:mouseenter", function (e, row) {
                var $hoveredRow = $(row);
                
                $hoveredRow.find('.slipstreamgrid_switch_row_selection').show();
                $hoveredRow.find('.slipstreamgrid_switch_col').hide();
            })
            .bind("slipstreamGrid.row:mouseleave", function (e, row) {
                var $hoveredRow = $(row),
                    $checkboxCol = $hoveredRow.find('.slipstreamgrid_switch_row_selection');
                    
                if (!$checkboxCol.find('input[type="checkbox"]').is(':checked')){
                    $checkboxCol.hide();
                    $hoveredRow.find('.slipstreamgrid_switch_col').show();
                }
            });

        };

        /**
         * Update switched column and checkbox visual affect. 
         * Checkbox has to align to the left so it is align with the text in the switched column
         * @param {Object} $gridTable
         * @param {Object} gridContainer
         * @inner
         */
        this.updateSwitchedColumnStyle = function($gridTable, gridContainer){
            var hasSubGrid = conf.elements.subGrid ? true : false,
                isTreeGrid = conf.elements.tree ? true : false,
                tableId = $gridTable.attr('id'),
                switchColumnConf = gridFormatter.getSwitchColumnConfig();

            var switchColumn = {
                'switchColumnObj' : switchColumnConf[0],  //Switched Column config
                'switchColName' : (tableId + '_' + switchColumnConf[0].name).replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" ),  //Switched Column name
                'checkboxColName': isTreeGrid ? tableId + '_slipstreamgrid_select': tableId + '_cb'  //Checkbox Column name
            };

            switchCheckboxColName = switchColumn.checkboxColName;

            var getCheckboxIndex = function(){
                var $secondRow = $($gridTable.find('.jqgrow')[1]),
                    tds = $secondRow.find('td');

                for (var i =0; i< tds.length; i++){
                    var $td = $(tds[i]);
                    if ($td.attr("aria-describedby") === switchColumn.checkboxColName){
                        return i;
                    }
                }   
            };

            var checkboxInd = getCheckboxIndex(),
                $checkboxCol = $gridTable.find(".jqgfirstrow td:eq(" + checkboxInd + ")");

            $gridTable.find('.slipstreamgrid_switch_col').show();
            $checkboxCol.hide();   

            if (!hasSubGrid){
                if (switchColumn.switchColumnObj.width){
                    var $switchColHeader = gridContainer.find("#" + switchColumn.switchColName),
                        width = $switchColHeader && $switchColHeader.width();

                    //Make checkbox column width as same as the switched column
                    gridContainer.find('#' + switchColumn.checkboxColName).css('width', width);   
                    $checkboxCol.css('width', width).show();

                    //SelectAll checkbox has to align to the left so it is align with the text in the switched column
                    gridContainer.find('#' + tableId +"_cb").addClass('slipstreamgrid_switch_row_selection'); 
                }
            }else{
                $checkboxCol.show();
            }
            var allVisiableCheckbox = isTreeGrid ? $gridTable.find('.tree_custom_checkbox'):$gridTable.find('td[aria-describedby="' + tableId + '_cb"]');
            if (allVisiableCheckbox.length > 0){

                //Row selection checkbox has to align to the left so it is align with the text in the switched column
                allVisiableCheckbox.addClass('slipstreamgrid_switch_row_selection');
                for (var i =0; i< allVisiableCheckbox.length; i++){
                    var $checkbox = $(allVisiableCheckbox[i]),
                        $switchColumn = $checkbox.siblings(".slipstreamgrid_switch_col");
                    if ($switchColumn.css('display') != 'none' && !$checkbox.find('input[type="checkbox"]').is(':checked')){
                        $checkbox.hide();
                    }else if($checkbox.find('input[type="checkbox"]').is(':checked')){
                        $switchColumn.hide();
                    }
                }  
            } 
        };

        /**
         * Toggle columns between checkbox and switched column
         * @param {Object} checkboxColumns
         * @param {Object} switchedColumns
         * @param {Boolean} showCheckbox - show checkbox or not
         * @inner
         */
        var toggleColumns = function(checkboxColumns, switchedColumns, showCheckbox){
            if (showCheckbox){
                checkboxColumns.show();
                switchedColumns.hide();
            }else{
                checkboxColumns.hide();
                switchedColumns.show();
            }
        };
        
         /**
         * Toggle columns between checkbox and switched column
         * @param {Object} gridContainer
         * @param {Boolean} isSelectedRow - if the row is selected or not
         * @param {Object} $row (optional) - if only switchCol in the row
         * @param {Boolean} isDynamicUpdated (optional) - only when the function is called dynamically by grid.addPageRows()
         * @inner
         */
        this.toggleSwitchCol = function(gridContainer, isSelectedRow, $row, isDynamicUpdated){
            if (switchCheckboxColName){
                var checkboxColumns,
                    switchedColumns;

                if ($row && $row.length > 0){
                    checkboxColumns = gridConfigurationHelper.getCellDom($row, switchCheckboxColName) || $row.find('.slipstreamgrid_switch_row_selection');
                    checkboxColumns.addClass("slipstreamgrid_switch_row_selection");
                    switchedColumns = $row.find('.slipstreamgrid_switch_col');
                }else{
                    checkboxColumns = gridContainer.find('td.slipstreamgrid_switch_row_selection');
                    switchedColumns = gridContainer.find('.slipstreamgrid_switch_col');
                }

                if (isDynamicUpdated){
                    //Check the checkbox column is selected for each row and then decide to show/hide the checkbox column and switched column
                    for (var i = 0; i < checkboxColumns.length; i++){
                        var checkboxColumn = checkboxColumns.eq(i),
                            switchedColumn = switchedColumns.eq(i);
                        if (checkboxColumn.find('input').prop('checked')){
                            toggleColumns(checkboxColumn, switchedColumn, true);
                        }else{
                            toggleColumns(checkboxColumn, switchedColumn);
                        }
                    }
                }else{
                    if (isSelectedRow){
                        toggleColumns(checkboxColumns, switchedColumns, true);
                    }else if(!$row){
                        toggleColumns(checkboxColumns, switchedColumns);
                    }
                }
            }
        };
    };

    return ColumnSwitchOnHover;
});
