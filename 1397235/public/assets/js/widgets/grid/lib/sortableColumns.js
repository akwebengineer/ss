/**
 * A module that add sortable columns to the grid
 *
 * @module sortableColumns
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(['lib/template_renderer/template_renderer',
        'lib/i18n/i18n'
        ], function(render_template, i18n){
    var SortableColumns = function(conf, gridConfigurationHelper, templates) {

        /**
         * sortableColumns constructor
         *
         * @constructor
         * @class sortableColumns - Add sortable columns to the grid
         *
         * @param {Object} conf - User configuration object
         * @param {Class} gridConfigurationHelper - Grid gridConfigurationHelper Class
         * @returns {Object} Current sortableColumns's object: this
         */
        
        var sortableContainer,
            isTreeGrid = conf.elements.tree? true: false,
            isGroupGrid = conf.elements.grouping? true: false,
            hasSubgrid = conf.elements.subGrid?true:false,
            isSimpleGrid = !(isTreeGrid || isGroupGrid || hasSubgrid) ? true: false,
            groupHash,
            groupColumnState,
            containers;

        /**
         * Initialize sortable columns functionality.
         *
         * @param {Object} containers 
         */
        this.init = function(gridContainers){
            containers = gridContainers;
            applyOrderableClasseToColHeader();
            sortableContainer = containers.$header.find('.ui-jqgrid-labels');
            if (isSimpleGrid){
                sortableContainer && sortableContainer.hasClass('ui-sortable') && sortableContainer.sortable( "destroy" );
                addSortable();
            }else if(isTreeGrid){
                addSortable();
            }
        };

        /**
         * Set group hash in the class, so we can use later
         * @param {Object} groupColumn - instance of the GroupColumn class
         */
        this.setGroupHash = function(groupColumn){
            groupHash = groupColumn.getGroupsWithColumnName();
            groupColumnState = groupColumn.getGroupColumnState();
        };

        /**
         * Apply orderable class to the associated column header while reorderable is true
         */
        var applyOrderableClasseToColHeader = function () {
            var trHead = containers.$header.find("thead:first tr"),
                colModel = gridConfigurationHelper.getGridColumns(containers.$gridTable),
                tableId = containers.$gridTable.attr('id');

            for (var iCol = 0; iCol < colModel.length; iCol++) {
                if (colModel[iCol]['name']){
                    if (isSimpleGrid || isTreeGrid){
                        var headerId = tableId + "_" + gridConfigurationHelper.escapeSpecialChar(colModel[iCol]['name']),
                            $headerColumn = trHead.find("#" + headerId);
                        !$headerColumn.hasClass("slipstreamgrid_frozen_col") && $headerColumn.find('div').addClass('orderable');
                    }
                }
            }
        };

        /**
         * Initialize sortable columns functionality.
         *
         */
        var addSortable = function(){
            addSortableClass();
            bindSortableColumns();
        };


        /**
         * Add sortable feature to the column
         * @inner
         */
        var bindSortableColumns = function(){
            var $gridTable = containers.$gridTable,
                gridTable = $gridTable[0],
                events,
                tid= gridTable.p.id+"_",
                currentGroup, currentColumnName, 
                reservedColumnIds = getReservedColumns($gridTable),
                isGrouped = _.isEmpty(groupHash),
                groupColumnHash = gridConfigurationHelper.buildColumnConfigurationHashByName(conf.elements.columns, "group"),
                groupColumnHeaderHash = {};

            /**
             * Get the valid droppable column target
             * @param {String} currentGroupName
             * @param {Object} $col
             * @param {Object} $placeholder
             * @param {Boolean} is previous or next column. 
             * @inner
             */
            var getValidDroppableColumnTarget = function(currentGroupName, $col, $placeholder, isPrev){

                /**
                 * Get the next/prev column
                */
                var getColumnTarget = function($c){
                    if (isPrev){
                        $c = $c.prev();
                    }else{
                        $c = $c.next();
                    }
                    return $c;
                };

                var $column = getColumnTarget($col), 
                    colName;
                
                if ($column.hasClass('ui-sortable-placeholder')){
                    $column = getColumnTarget($column);
                }
                if ($column.hasClass('groupColumn')){
                    colName = gridConfigurationHelper.getHeaderColumnName(tid, $column.attr('id'));
                    if (groupColumnHash[colName]['group'] == currentGroupName){
                        if (isPrev){
                            $column.before($placeholder.detach());
                        }else{
                            $column.after($placeholder.detach());
                        }
                        getValidDroppableColumnTarget(colName, $column, $placeholder, isPrev);
                        return $column;
                    }
                }
                return $col;
            };


            /**
             * update group column header style
             * @param {Object} ui - ui object from sortable lib
             * @param {jQuery object} $draggingColumn - current column header
             * @param {Boolean} isStopCallback - if it is trigged by the stop callback
             * @inner
             */
            var updateGroupColumnHeaderStyle = function(ui, $draggingColumn, isStopCallback){
                if (isGrouped && $draggingColumn.hasClass('groupColumn')){
                    var $placeholder = $(ui.placeholder),
                        totalWidth = $draggingColumn.width(),
                        isGroupCollapsed = groupColumnState[currentGroup].collapsed;

                    $.each(groupHash[currentGroup].columns, function(ind, colName){
                        if (colName != currentColumnName){
                            if (!groupColumnHeaderHash[colName]){
                                var columnName = gridConfigurationHelper.escapeSpecialChar(tid + colName);
                                groupColumnHeaderHash[colName] = sortableContainer.find('#'+ columnName);
                            }
                            var $col = groupColumnHeaderHash[colName];
                            if (isStopCallback){
                                !isGroupCollapsed && $col.show();
                            }else{
                                $col.hide();
                                !isGroupCollapsed && (totalWidth += $col.width());
                            }
                        }
                    });
                    if (isStopCallback){
                        currentGroup = null;
                    }else{
                        $placeholder.width(totalWidth);
                        $(ui.helper).find('.icon_container').addClass('icon_access');
                    }
                }
            };

            /**
             * In order to support same visual effect and behavior as jqGrid lib
             * part of sortable column configuration is from jqGrid sortableColumns function 
             */
            var sortable_opts = {
                tolerance : "pointer",
                axis : "x",
                scrollSensitivity: "1",
                items: '>th:not(:has('+ reservedColumnIds + '),:hidden,.slipstreamgrid_frozen_col)',
                helper: function (event, sortedElement) {
                    var content;
                    if (isGrouped && sortedElement.hasClass('groupColumn')){
                        currentColumnName = gridConfigurationHelper.getHeaderColumnName(tid, sortedElement.attr('id'));
                        currentGroup = groupColumnHash[currentColumnName]['group'];
                        content = render_template(templates.gridDraggableElement, {content: i18n.getMessage({msg: 'Moving_columns', sub_values: [groupHash[currentGroup].columns.length]})});
                    }else {
                        content = sortedElement;
                    }

                    return content;
                },
                placeholder: {
                    element: function(item) {
                        var el = $(document.createElement(item[0].nodeName))
                        .addClass(item[0].className+" ui-sortable-placeholder ui-state-highlight")
                        .removeClass("ui-sortable-helper")[0];
                        return el;
                    },
                    update: function(self, p) {
                        p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10));
                        p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10));
                    }
                },
                start : function(event,ui){
                    //After reordering stops, only Firefox triggers click event, which causes column sorting. Thus, have to turn off the click event temporarily in order to prevent it.
                    var $draggingColumn = $(ui.item),
                        tmp_element = $draggingColumn.clone(true);
                    
                    events = tmp_element[0].events || jQuery.data(tmp_element[0], "events") || jQuery._data(tmp_element[0], "events");
                    events && events.click && $draggingColumn.off('click');
                    updateGroupColumnHeaderStyle(ui, $draggingColumn);
                },
                change: function(event,ui){
                    var $draggingColumn = $(ui.item),
                        $placeholder = $(ui.placeholder),
                        $prevCol = $placeholder.prev(),
                        $nextCol = $placeholder.next();

                    if (isVisibleGroupColumn($prevCol) && isVisibleGroupColumn($nextCol)){
                        var prevColName = gridConfigurationHelper.getHeaderColumnName(tid, $prevCol.attr('id')),
                            nextColName = gridConfigurationHelper.getHeaderColumnName(tid, $nextCol.attr('id'));
                        if (groupColumnHash[prevColName]['group'] == groupColumnHash[nextColName]['group']){
                            if($nextCol.hasClass('slipstreamgrid_frozen_col')){
                                if (ui.originalPosition.left < ui.position.left){
                                    $prevCol.before($placeholder.detach());
                                }else{
                                    $nextCol.after($placeholder.detach());
                                }
                            }else{
                                if (ui.originalPosition.left < ui.position.left){
                                    $nextCol = getValidDroppableColumnTarget(groupColumnHash[nextColName]['group'], $nextCol, $placeholder);
                                    $nextCol.after($placeholder.detach()); 
                                }else{
                                    $prevCol = getValidDroppableColumnTarget(groupColumnHash[prevColName]['group'], $prevCol, $placeholder, true);
                                    $prevCol.before($placeholder.detach());
                                }
                            }
                        }
                    }
                },
                stop : function(event,ui){
                    var $draggingColumn = $(ui.item); 

                    //After reordering stops, have to add back original click event. 
                    events && events.click && setTimeout(function(){$draggingColumn.on('click', events['click'][0]['handler']);}, 500); 
                    updateGroupColumnHeaderStyle(ui, $draggingColumn, true);
                },
                update: function(event, ui) {
                    var $draggingColumn = $(ui.item),
                        th = $(">th", sortableContainer),
                        cmMap = {},
                        colModel = gridTable.p.colModel,
                        $column = $draggingColumn;

                    $.each(colModel, function(i) { cmMap[this.name]=i; });

                    var permutation = [];
                    th.each(function() {
                        var id = gridConfigurationHelper.getHeaderColumnName(tid, $(">div", this).get(0).id),
                            hasGroup = groupColumnHash[id] && groupColumnHash[id]['group'] ? true : false;
                        if (cmMap.hasOwnProperty(id)) {
                            if (!(hasGroup && currentGroup == groupColumnHash[id]['group'])){
                                permutation.push(cmMap[id]);
                            }else if(hasGroup && (currentColumnName == id)){
                                $.each(groupHash[currentGroup].columns, function(ind, colName){
                                    if (colName != currentColumnName){
                                        var $col = groupColumnHeaderHash[colName];
                                        if (cmMap[colName] < cmMap[currentColumnName]){
                                            $column.before($col.detach());
                                        }else{
                                            $column.after($col.detach());
                                            $column = $col;
                                        }
                                    }
                                    permutation.push(cmMap[colName]);
                                });
                            }
                        }
                    });
                    $gridTable.jqGrid("remapColumns",permutation, true, true);
                    if ($.isFunction(gridTable.p.sortable.update)) {
                        gridTable.p.sortable.update(permutation);
                    }
                    setTimeout(function(){gridTable.p.disableClick=false;}, 50);
                    $gridTable.trigger("slipstreamGrid.updateConf:columns");
                }
            };

            sortableContainer && sortableContainer.sortable(sortable_opts);
        };

        /**
         * Check if the column is visible grouped column
         * @param {Object} $col
         * @inner
         */
        var isVisibleGroupColumn = function($col){
            var isValid = $col.is(':visible') && $col.hasClass('groupColumn') ? true : false;
            return isValid;
        };

        /**
         * Get Reserved Column Header
         * @param {Object} gridTable
         * @inner
         */
        var getReservedColumns = function($gridTable){
            var tableId = $gridTable.attr('id'),
                reservedColumns = ['cb', 'slipstreamgrid_more', 'slipstreamgrid_leftAction', 'slipstreamgrid_select'],
                columnIds = '';
            
            reservedColumns.forEach(function(val, index) {
                index !== 0 && (columnIds += ',');
                columnIds += '#jqgh_'+tableId+'_'+ val;
            });

            return columnIds;
        };

        /**
         * Add class to the frozen columns
         * @inner
         */
        var addSortableClass = function(){
            var tableId = containers.$gridTable.attr('id'),
                colModel = conf.elements.columns,
                th = containers.$header.find('th'),
                hashedTH = {},
                allColumnsFrozen = false,
                prevFrozenGroup;

            var addHeaderFrozenClass = function(ind){
                var colId = tableId+'_' + colModel[ind].name,
                    $column = hashedTH[colId];
                !$column.hasClass('slipstreamgrid_frozen_col') && $column.addClass('slipstreamgrid_frozen_col');            
            };

            th.each(function() {
                hashedTH[this.id] = $(this);
            });

            for(var i = 0; i < colModel.length; i++){
                if(colModel[i].frozen){
                    addHeaderFrozenClass(i);
                    if (i === (colModel.length -1)){
                        allColumnsFrozen = true;
                    }
                    if (colModel[i].group){
                        prevFrozenGroup = colModel[i].group
                    }
                }else if(colModel[i].group && prevFrozenGroup && prevFrozenGroup == colModel[i].group){
                    addHeaderFrozenClass(i);
                }else{
                    prevFrozenGroup = '';
                    break;
                }
            }
            if (!allColumnsFrozen){
                for(i = colModel.length - 1; i > 0; i--){
                    if(colModel[i].frozen){
                        addHeaderFrozenClass(i);
                        if (colModel[i].group){
                            prevFrozenGroup = colModel[i].group
                        }
                    }else if(colModel[i].group && prevFrozenGroup && prevFrozenGroup == colModel[i].group){
                        addHeaderFrozenClass(i);
                    }else{
                        prevFrozenGroup = '';
                        break;
                    }
                }
            }
        };
    }

    return SortableColumns;
});


           
