/**
 * A module to set checkbox states between indeterminate, checked, none
 *
 * @module indeterminateCheckbox
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define([],  /** @lends IndeterminateCheckbox */
    function() {

    /**
     * IndeterminateCheckbox constructor
     *
     * @constructor
     * @class IndeterminateCheckbox - set checkbox states between indeterminate, checked, none.
     *
     * @returns {Object} Current IndeterminateCheckbox's object: this
     */
    var IndeterminateCheckbox = function(){

        /**
         * Builds the IndeterminateCheckbox
         * @returns {Object} Current "this" of the class
         */
        var indeterminateStateInTree = {},
            self = this,
            lastSelectedRows, containers, allRowIds, getNumberOfRows;

        /**
         * Initialize the IndeterminateCheckbox class functionality.
         * @param {Object} obj contains lastSelectedRows, containers, allRowIds and getNumberOfRows from the grid widget
         */
        this.init = function(obj){
            lastSelectedRows = obj.lastSelectedRows;
            containers = obj.containers;
            allRowIds = obj.allRowIds;
            getNumberOfRows = obj.getNumberOfRows;
        };

        /**
         * Switch checkbox states
         * @param {Object} $checkbox
         * @param {String} toggleState  indeterminate- toggle state from checked to indeterminate
         *                              checked - toggle state from indeterminate to checked
         *                              Default - remove both states
         */
        this.toggleCheckboxState = function($checkbox, toggleState){
            switch(toggleState) {
                case 'indeterminate':
                    $checkbox.prop('indeterminate', true);
                    break;
                case 'checked':
                    $checkbox.prop('indeterminate', false);
                    break;
                default:
                    $checkbox.prop('checked', false);
                    $checkbox.prop('indeterminate', false);
            }
        };

        /**
         * Reset the indeterminateStateInTree object
         */
        this.resetIndeterminateState = function(){
            indeterminateStateInTree = {};
        };

        /**
         * Set Indeterminate State
         * @param {String} rowId - current row id
         * @param {Boolean} isIndeterminate - setting indeterminate state or remove it from the cashe
         */
        this.setIndeterminateState = function(rowId, isIndeterminate){
            if (isIndeterminate){
                indeterminateStateInTree[rowId] = true;
            }else{
                delete indeterminateStateInTree[rowId];
            }
        };

        /**
         * Get Indeterminate State
         * @param {String} rowId - current row id
         */
        this.getIndeterminateState = function(rowId){
            if (rowId){
                return indeterminateStateInTree[rowId];
            }else{
                return indeterminateStateInTree;
            }
        };

        /**
         * Update Row Parent Checkbox State
         * @param {String} rowParent id
         * @param {Boolean} isSibblingSelected - if any sibbling of the current row are selected
         * @param {Boolean} isParentChecked - if the parentRow is checked
         */
        this.updateParentCheckboxState = function(rowParent, isSibblingSelected, isParentChecked){
            if (isSibblingSelected){
                var parentCheckbox = lastSelectedRows.rowsInDom[rowParent].$checkbox;
                self.setIndeterminateState(rowParent, !isParentChecked);
                self.toggleCheckboxState(parentCheckbox, 'checked');
            }else{
                self.setIndeterminateState(rowParent);
            }
        };

        /**
         * Update Checkbox State
         * @param {Object} selections - selectedRows
         */
        this.updateCheckboxState = function(selections){
            updateSelectAllState(selections);
            updateRowIndeterminateState();
        };

        /**
         * Update Row Checkbox State
         */
        var updateRowIndeterminateState = function(){
            var $rows = lastSelectedRows['rowsInDom'];
            $.each($rows, function(id, obj){
                var $checkbox = obj['$checkbox'];
                if (self.getIndeterminateState(id)){
                    if($checkbox[0].checked){
                        self.toggleCheckboxState($checkbox, 'indeterminate');
                    }else{
                        self.toggleCheckboxState($checkbox, 'checked');
                        self.setIndeterminateState(id);
                    }
                }else{
                    self.toggleCheckboxState($checkbox, 'checked');
                }
            });
        };

        /**
         * Update SelectAll Checkbox State
         * @param {Object} selections - selectedRows
         */
        var updateSelectAllState = function(selections){
            if (selections.numberOfSelectedRows > 0 && selections.numberOfSelectedRows != getNumberOfRows()){
                allRowIds.selectAllIndeterminate = true;
                self.toggleCheckboxState(containers.$selectAllCheckbox, 'indeterminate');
            }else if (selections.numberOfSelectedRows == 0){
                allRowIds.selectAllIndeterminate = false;
                self.toggleCheckboxState(containers.$selectAllCheckbox);
                self.resetIndeterminateState();
            }else if (selections.numberOfSelectedRows == selections.numberOfSelectedRows){
                allRowIds.selectAllIndeterminate = false;
                self.resetIndeterminateState();
                self.toggleCheckboxState(containers.$selectAllCheckbox, 'checked');
            }
        };
    };

    return IndeterminateCheckbox;
});