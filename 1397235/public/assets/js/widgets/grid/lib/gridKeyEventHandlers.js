/**
 * Keyboard event handlers for the Grid.
 *
 * @module gridKeyEventHandlers
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
], /** @lends GridKeyEventHandlers */
function () {

    /**
     *
     * @constructor
     * @class GridKeyEventHandlers - Attaches interaction event handlers on grid.
     *
     * @param {Object} conf - User configuration object
     * @returns {Object} Current GridKeyEventHandlers object: this
     */
    var GridKeyEventHandlers = function (conf) {

        var checkboxEntryPointIndex,
            checkboxEntryPointRowId,
            checkboxEntryPageNum;

        /**
         * Exposed method for adding listeners on grid.
         * @param {Object} containers - containers hash for the grid
         * @param {Function} getSelectedRows - callback that provides the number of selected rows and the row data.
         * @param {Function} getSearchTokens - callback that provides search tokens currently applied to the grid.
         * @param {Function} toggleRowSelection - grid custom method to toggle row selections.
         * @param {Function} getAllRowsInTree - grid custom method to return all the tree grid rows
         */
        this.addListeners = function (containers, getSelectedRows, getSearchTokens, toggleRowSelection, getAllRowsInTree) {
            //Attach handlers for Simple, Grouped, Nested grids & Tree grids (without preselection). SPOG-3241 needs to be completed before tree grid preselection can be concluded using SPOG-3586. Use case that still needs to be implemented described on: GNATS 1383490
            var isPreselectionTreeGrid = conf.elements.tree && conf.elements.tree.preselection;
            if (conf.elements.multiselect && !isPreselectionTreeGrid) {
                attachEventHandlers(containers, getSelectedRows, getSearchTokens, toggleRowSelection, getAllRowsInTree);
            }
        };

        /**
         * Attaches key event handlers to provided gridTable.
         * Selects row on shift & up/down arrow key, shift & click for multiselecting rows.
         * @param {Object} containers - containers hash for the grid
         * @param {Function} getSelectedRows - callback that provides the number of selected rows and the row data.
         * @param {Function} getSearchTokens - callback that provides search tokens currently applied to the grid.
         * @param {Function} toggleRowSelection - grid custom method to toggle row selections.
         * @param {Function} getAllRowsInTree - grid custom method to return all the tree grid rows
         * @inner
         */
        var attachEventHandlers = function (containers, getSelectedRows, getSearchTokens, toggleRowSelection, getAllRowsInTree) {
            var checkBoxElement = (conf.elements.tree) ? ".cbox_tree" : ".cbox";
            var isTreeWithPreselection = conf.elements.tree && conf.elements.tree.preselection;
            var prevDir = "";
            var lastSelected = "";
            containers.$gridTable.on("keydown", checkBoxElement, function (e) {

                var isUp = (e.keyCode == $.ui.keyCode.UP);
                var isDown = (e.keyCode == $.ui.keyCode.DOWN);
                var isShift = e.shiftKey;
                var isShiftAndUpDown = ( isUp || isDown ) && isShift;
                var isRowSelected = getSelectedRows(containers.$gridTable).numberOfSelectedRows > 0; // Whether any of the rows is selected
                //Shift + Up/Down arrow key selects rows
                if ( isShiftAndUpDown && isRowSelected ) { // If shift + UP/DOWN is pressed and any of the row is selected, shift selection starts from the focussed row
                    e.preventDefault(); //Fix for firefox: To prevent row text selection. http://stackoverflow.com/questions/1527751/disable-text-selection-while-pressing-shift
                    var $focussedRow = $(e.target).closest('tr'),
                        $nextRow,
                        direction = "",
                        currentRowId = getLastSelectedRowId($focussedRow),
                        $currentRow = containers.$gridTable.find("#" + currentRowId),
                        currentRowIndex = containers.$gridTable.jqGrid('getInd',currentRowId),
                        $previousSelectedTreeRow;

                    // In case of preselection, when a parent is selected, children get automatically selected,
                    // and so Up/DOWN selection must start from the last selected element, prevDir needs to be
                    // cleared in order get the right next row
                    if(lastSelected != "" && lastSelected.id != $focussedRow.id) {
                        prevDir = "";
                    }

                    // In case of preselection, set the entry point index and entry point rowId when user presses shift.
                    if (isTreeWithPreselection && !checkboxEntryPointIndex) {
                        checkboxEntryPointRowId = $focussedRow.prop('id');
                        checkboxEntryPointIndex = containers.$gridTable.jqGrid('getInd', checkboxEntryPointRowId);
                    }

                    /**
                     * Returns a row which is suitable for selection. Skips group header rows.
                     * @param {Object} $row - starting row from which traversal should init.
                     * @param {string} direction - direction can be prev or next.
                     * @returns {Object} row which can be selected in simple grids.
                     */
                    function findRow($row, direction) {
                        $row = $row[direction]();
                        if (conf.elements.tree) {
                            return $row;
                        } else {
                            if (!conf.elements.grouping) {
                                return $row;
                            } else {
                                if ($row.hasClass('jqgroup')) { //jqgroup - jQuery class for group headers
                                    var $skippedRow = $row[direction]();
                                    return findRow($skippedRow, direction);
                                } else {
                                    return $row;
                                }
                            }
                        }
                    }

                    /**
                     * Returns the next row to be toggled
                     * @param $row - {Object} currently focussed row
                     * @param dir - direction of shift selection
                     * @returns {Object} row which can be selected
                     */
                    function getNextRow($row, dir) {
                        direction = dir;
                        if(direction == prevDir || prevDir == "") {  // Direction of selection is same as previous one or no previous direction exists
                            if(!isTreeWithPreselection) // When simple grid / no preselection tree grid, the next row would be the row above or below the focussed row
                                $nextRow = findRow($row, direction);
                            else {
                                // When preselection tree grid, the next row could be the row above (in case of UP) or below (in case of DOWN) the focussed row when a leaf was selected last,
                                // OR
                                // a row above the focussed row (in case of UP) or below the last selected row (in case of DOWN) when the parent was selected preselecting children
                                if(currentRowIndex > checkboxEntryPointIndex && direction == "next") {
                                    $nextRow = findRow($currentRow, direction);
                                    $previousSelectedTreeRow = $currentRow;
                                }
                                else {
                                    $nextRow = findRow($row, direction);
                                    $previousSelectedTreeRow = $row;
                                }
                            }
                        } else {
                            // When simple grid / no preselection tree grid, if the direction of selection changes from the last one,
                            // the row to be toggled is the last row selected
                            $nextRow = $row;
                        }
                        return $nextRow;
                    }

                    // Retrieves the next row based on the UP/DOWN key press
                    if (isUp) {
                        $nextRow = getNextRow($focussedRow, "prev");
                    } else if (isDown) {
                        $nextRow = getNextRow($focussedRow, "next");
                    }

                    if ($nextRow && $nextRow.length) {
                        var shouldClick = true;
                        if(isTreeWithPreselection) {
                            var allTreeRowIds = getAllRowsInTree();
                            // In case of preselection tree grid, Check whether the next row to be toggled is calculated to be a parent of the last toggled row, if yes, then only the focus needs to be transferred else click
                            if($previousSelectedTreeRow && allTreeRowIds[$previousSelectedTreeRow.prop("id")].parent == $nextRow.prop("id")) {
                                shouldClick = false;
                            }
                        }
                        var $checkbox = $nextRow.find(checkBoxElement);
                        if(shouldClick) {
                            if(direction == "prev")
                                $checkbox.data("isUpDownDirection", "UP");
                            else
                                $checkbox.data("isUpDownDirection", "DOWN");
                            $checkbox.trigger('click'); //The direction of shift+UP/DOWN selection is sent to the shift selection, to make sure the range is correct for shift selection if a shift selection is followed by shift+UP/DOWN selection
                            $checkbox.removeData("isUpDownDirection");
                        } else {
                            $checkbox.focus(); // When the parent has intermediate state/selected state and the next row is that parent, then do not click that row, instead just transfer focus,
                            // Above line does not set the Shift Click Parameters when focussed, so in future , in order to support Shift Selection, ShiftClickParameters need to be set after focus
                        }
                        prevDir = direction;
                        lastSelected = $nextRow;
                    }
                } else if(!isRowSelected) {
                    prevDir = "";
                    lastSelected = "";
                }
            });

            //Clear entry point index and entry point rowId when shift key is released.
            containers.$gridTable.on("keyup", checkBoxElement, function (e) {
                if(!e.shiftKey) {
                    checkboxEntryPointIndex = null;
                    checkboxEntryPointRowId = null;
                }
            });
            /**
             * Shift + checkbox click selects rows
             * Local and loadonce support keyEvent automatically
             * If onSelectRowRange is defined in conf, the key + selection will be supported
             * @inner
             */
            var hasSelectRowRangeFunction = conf.elements.onSelectRowRange && _.isFunction(conf.elements.onSelectRowRange);
            var hasData = _.isArray(conf.elements.data) && typeof conf.elements.getData == "undefined";
            var hasUrl = conf.elements.url && !conf.elements.scroll;
            // Support for group grid and tree grid will be provided as a part of SPOG-2874
            if ((hasSelectRowRangeFunction) || (hasData) || (hasUrl)){
                var lastClickedRowIndexNumber = null,       //Firstly checked calculated Row number
                    lastClickedRowId = "",                  //Firstly checked row's id
                    currentDirection = "",
                    previousDirection = "",
                    isFirstTimeShift = true,
                    wasFirstTimeShift = false,
                    wasUpDownShiftSelection = false;        // In order to ensure the next selection to be considered as a fresh new selection without any previous state or not

                // If Pagination supported and page change occurs, then reset the shift click parameters, to start a fresh
                $(containers.$gridTable).on("SlipstreamGrid.resetShiftClickParameters:grid", function(e) {
                    previousDirection = "";
                    currentDirection = "";
                    lastClickedRowIndexNumber = null;
                    lastClickedRowId = "";
                    isFirstTimeShift = true;
                    wasFirstTimeShift = false;
                    wasUpDownShiftSelection = false;
                });
                $(containers.$gridTable).on("click", checkBoxElement, function (e) {
                    // Shift Click is not supported for Tree Grid Preselection case
                    if(!($(this).data('isPreselectingChildren'))) {
                        var currRow = $(e.target),
                            gridTable = $(e.delegateTarget),
                            $row = currRow.closest('tr'),
                            justClickedRowIndexNumber = $row.data("rowIndexNumber"),
                            selectedRowsObj = getSelectedRows(containers.$gridTable),
                            upDownShiftDirection = $(this).data('isUpDownDirection');
                        if (!isFirstTimeShift && selectedRowsObj.selectedRows.length == 0) {
                            previousDirection = "";
                            currentDirection = "";
                            lastClickedRowIndexNumber = null;
                            lastClickedRowId = "";
                            isFirstTimeShift = true;
                            wasFirstTimeShift = false;
                            wasUpDownShiftSelection = false;
                        }

                        // Click without up/down should reset up/down parameters
                        if(!(e.keyCode == $.ui.keyCode.UP) && !(e.keyCode == $.ui.keyCode.DOWN)) {
                            prevDir = "";
                            lastSelected = "";
                        }
                        // If a row different from the previously selected row is selected without Shift, then change the initial parameters to be the new selected row
                        // or
                        // If Shift + UP/DOWN selection was made then initialize the parameters with the selection
                        if (upDownShiftDirection || (lastClickedRowIndexNumber != justClickedRowIndexNumber && !e.shiftKey)) {
                            lastClickedRowIndexNumber = justClickedRowIndexNumber;
                            lastClickedRowId = $row.prop("id");
                            isFirstTimeShift = false;
                            previousDirection = "";
                            currentDirection = "";
                            if(wasFirstTimeShift) {
                                wasFirstTimeShift = false;
                            }
                            if(upDownShiftDirection) {
                                previousDirection = upDownShiftDirection;
                                wasUpDownShiftSelection = true;
                            }
                        } else if (e.shiftKey) {

                            // If shift selection is done at first without doing any other selection before, then selection from the top till the selected row
                            if (isFirstTimeShift) {
                                lastClickedRowIndexNumber = 1;
                                lastClickedRowId = gridTable.jqGrid("getGridParam", "firstRowId");
                            }
                            var $focussedRow = $(e.target).closest('tr'),
                                clickedRowId = $focussedRow.prop('id'), //Currently checked row's id
                                clickedRowIndexNumber = $focussedRow.data("rowIndexNumber"), //Currently checked calculated Row number
                                clickedRowIndex = gridTable.jqGrid('getInd', clickedRowId), //Currently checked row number from library
                                lastClickedRowIndex = (lastClickedRowId != "") ? gridTable.jqGrid('getInd', lastClickedRowId) : null, //Firstly checked row number from library
                                rowIdsInDOM = gridTable.getDataIDs(),
                                startRow = {},
                                endRow = {},
                                scrollStateRowsInDom,
                                isNonScrollState = "",
                                selectionCount = containers.$selectedHeader;

                            // If previous selection was Shift+UP/DOWN then, use that direction else use the current direction
                            if(!wasUpDownShiftSelection)
                                previousDirection = currentDirection;
                            else
                                wasUpDownShiftSelection = false;

                            // Based on the last selection and the current selection, determining direction of the shift selection
                            if (lastClickedRowIndexNumber != null) {
                                if (lastClickedRowIndexNumber > clickedRowIndexNumber) {
                                    currentDirection = "UP";
                                    startRow.indexNumber = clickedRowIndexNumber; // if lastClickedRowIndexNumber > clickedRowIndexNumber then the lower index number becomes this & vice versa
                                    endRow.indexNumber = lastClickedRowIndexNumber; // if lastClickedRowIndexNumber > clickedRowIndexNumber then the bigger index number becomes this & vice versa
                                    startRow.index = clickedRowIndex; // if lastClickedRowIndexNumber > clickedRowIndexNumber then the lower library index number becomes this & vice versa
                                    endRow.index = lastClickedRowIndex; // if lastClickedRowIndexNumber > clickedRowIndexNumber then the bigger library index number becomes this & vice versa
                                } else {
                                    currentDirection = "DOWN";
                                    startRow.indexNumber = lastClickedRowIndexNumber;
                                    endRow.indexNumber = clickedRowIndexNumber;
                                    startRow.index = lastClickedRowIndex;
                                    endRow.index = clickedRowIndex;
                                }
                            }

                            /**
                             * Loops over provided row ids and sets selection.
                             * @param {Array} allRowIds - row ids which need to be selected.
                             * @inner
                             */
                            var setSelectedRowsinGrid = function (allRowIds) {
                                var selectedRowIds;
                                if (!isNonScrollState) {
                                    // Toggling the dom selected rows
                                    toggleRowSelection(scrollStateRowsInDom);
                                    if (isFirstTimeShift) {
                                        //First Time Shift ignore last
                                        selectedRowIds = rowIdsSlicer(allRowIds, 0, allRowIds.length - 1);
                                        wasFirstTimeShift = true;
                                        isFirstTimeShift = false;
                                    } else {
                                        selectedRowIds = getRowIdsSetBasedOnDirection(currentDirection, previousDirection, allRowIds, 1, allRowIds.length);
                                    }
                                }
                                else {
                                    selectedRowIds = allRowIds;
                                }
                                toggleRowSelection(selectedRowIds);
                                if (selectionCount && selectionCount.hasClass('selection-count-disabled')) {
                                    selectionCount.removeClass('selection-count-disabled');
                                }
                            };

                            if (lastClickedRowIndexNumber != null) {
                                // If the last Clicked Row is present in DOM, then its all the rows in the range exist in the DOM else no
                                if (!_.isBoolean(lastClickedRowIndex)) {
                                    var rowIdstoSelect;
                                    //If rowIds are already available in the DOM, select the range and don't call callback.
                                    if (isFirstTimeShift) {
                                        //First Time Shift ignore last
                                        rowIdstoSelect = rowIdsInDOM.slice(startRow.index - 1, endRow.index - 1);
                                        wasFirstTimeShift = true;
                                        isFirstTimeShift = false;
                                    } else {
                                        rowIdstoSelect = getRowIdsSetBasedOnDirection(currentDirection, previousDirection, rowIdsInDOM, startRow.index, endRow.index);
                                    }
                                    isNonScrollState = true;
                                    setSelectedRowsinGrid(rowIdstoSelect);
                                } else {
                                    if (currentDirection == "DOWN") {
                                        scrollStateRowsInDom = rowIdsSlicer(rowIdsInDOM, 0, endRow.index - 1);
                                    } else if (currentDirection == "UP") {
                                        scrollStateRowsInDom = rowIdsSlicer(rowIdsInDOM, startRow.index, rowIdsInDOM.length);
                                    }
                                    isNonScrollState = false;
                                    // Toggling the dom rows to avoid delay due to callback
                                    toggleRowSelection(scrollStateRowsInDom);
                                    selectionCount && selectionCount.addClass('selection-count-disabled');
                                    setRowIdsInRange(conf.elements.onSelectRowRange, getSearchTokens(), gridTable.getGridParam("postData"), setSelectedRowsinGrid, startRow.indexNumber, endRow.indexNumber - startRow.indexNumber);
                                }
                            }
                            lastClickedRowIndexNumber = clickedRowIndexNumber;
                            lastClickedRowId = clickedRowId;
                            prevDir = (currentDirection == "DOWN") ? "next" : "prev"; //needs to be set in order to ensure correct up/down selection if after this up/down selection happens,
                            // need to also set lastSelected parameter if shift selection supports preselction in future
                        } else {
                            // Case of when the last selected row is now again selected
                            previousDirection = "";
                            currentDirection = "";
                            lastClickedRowIndexNumber = null;
                            lastClickedRowId = "";
                        }
                    }
                });
            };

            /**
             * Slices the row id array based on the shift direction
             * @param {String} currentDirection - DOWN/UP tells whether the current shift selection has down direction or up direction
             * @param {String} previousDirection - DOWN/UP tells whether the previous shift selection was in down direction or up direction
             * @param {Array} rowIdsArray - array of row ids
             * @param {Number} startIndex - Start index number for slicing
             * @param {Number} endIndex - End index number for slicing
             * @return sliced array
             */
            var getRowIdsSetBasedOnDirection = function(currentDirection, previousDirection, rowIdsArray, startIndex, endIndex) {
                var selectedRowIds;
                if(currentDirection == "DOWN") {
                    if((previousDirection == "") || (previousDirection == currentDirection)) {
                        //first time or same direction ignore first and last
                        selectedRowIds = rowIdsSlicer(rowIdsArray, startIndex, endIndex-1);
                    } else {
                        //Different direction ignore last
                        selectedRowIds = rowIdsSlicer(rowIdsArray, startIndex-1, endIndex-1);
                    }
                } else if(currentDirection == "UP") {
                    if((previousDirection == "") || (previousDirection == currentDirection)) {
                        //first time or same direction ignore first and last
                        selectedRowIds = rowIdsSlicer(rowIdsArray, startIndex, endIndex-1);
                    } else {
                        //Different direction ignore first
                        selectedRowIds = rowIdsSlicer(rowIdsArray, startIndex, endIndex);
                    }
                }
                return selectedRowIds;
            };

            /**
             * Slices the row id array from start index to end index
             * @param {Array} rowIdsArray - array of row ids
             * @param {Number} start - Start index number for slicing
             * @param {Number} end - End index number for slicing
             * @return sliced array
             */
            var rowIdsSlicer = function(rowIdsArray, start, end) {
                return rowIdsArray.slice(start, end);
            };

            /**
             * Sets all the row ids from start to start+limit by using a defer promise which allows to sync the response of a callback with all the row ids
             * @param {Object} getAllRowIds - callback that will be used to retrieve row ids
             * @param {Object} tokens - search tokens currently applied to the grid
             * @param {Object} gridParameters - grid parameters applied to the current grid request
             * @param {Object} getAllRowIdsDone - callback after getAllRowIds is done
             * @param {Integer} start - start index
             * @param {Integer} limit - number of rows after start index. end index can be calculated by start+limit
             * @inner
             */
            var setRowIdsInRange = function (getAllRowIds, tokens, gridParameters, getAllRowIdsDone, start, limit) {
                var getAllRowIdsPromise = function () {
                    var deferred = $.Deferred();
                    getAllRowIds(
                        function (allRowIds) {
                            deferred.resolve(allRowIds);
                        },
                        function (errorMessage) {
                            deferred.reject(errorMessage);
                        },
                        tokens,
                        gridParameters,
                        start,
                        limit
                    );
                    return deferred.promise();
                };
                var promise = getAllRowIdsPromise();
                $.when(promise)
                    .done(function (allRowIds) {
                        getAllRowIdsDone && getAllRowIdsDone(allRowIds);
                    })
                    .fail(function (errorMessage) {
                        console.log(errorMessage);
                    });
            };

            /**
             * Returns a rowId suitable for row selection.
             * If tree grid and preselection enabled, return last selectedRowId in DOM.
             * If simple grid, return lastSelectedRowId internal grid parameter.
             * @param {Object} $row - starting row from which the next selectable rowId is traversed and returned.
             * @returns {String} - rowId used for selection.
             * @inner
             */
            function getLastSelectedRowId($row) {
                var rowId = $row.prop('id');
                if (isTreeWithPreselection) {
                    var isCheckBoxChecked = $row.find(checkBoxElement).is(':checked');
                    if (isCheckBoxChecked) {
                        var $nextRow = $row.next();
                        if (!$nextRow.length) {
                            return rowId;
                        }
                        return getLastSelectedRowId($nextRow);
                    } else {
                        var prevRowId = $row.prev().prop('id');
                        return prevRowId ? prevRowId : rowId;
                    }
                } else {
                    var selectedRowsObj = getSelectedRows(containers.$gridTable);
                    if (selectedRowsObj.selectedRows.length > 0) { //return lastSelectedRowId only if there are row selections.
                        return selectedRowsObj.lastSelectedRowId;
                    }
                    return rowId;
                }
            }

        };
    };

    return GridKeyEventHandlers;
});