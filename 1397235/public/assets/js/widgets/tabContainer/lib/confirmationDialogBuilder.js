/**
 * A module that builds a confirmation dialog after a user selects an action like remove a tab
 *
 * @module ConfirmationDialogBuilder
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'widgets/confirmationDialog/confirmationDialogWidget',
    'widgets/tabContainer/conf/confirmationDialogConfiguration'
],  /** @lends ConfirmationDialogBuilder */
    function(ConfirmationDialogWidget, confirmationDialogConf) {

    /**
     * ConfirmationDialogBuilder constructor
     *
     * @constructor
     * @class ConfirmationDialogBuilder - Builds a confirmation dialog
     *
     * @returns {Object} Current ConfirmationDialogBuilder's object: this
     */
    var ConfirmationDialogBuilder = function(conf){

        /**
         * Opens a Confirmation Dialog to confirm the deletion of a tab
         * @param {String} tabId - id of the tab
         */
        this.deleteTabWithConfirmDialog = function(removeTabUserCallbackYes, removeTabUserCallbackNo){
            var confirmationDialog;

            /**
             * Executes the provided callback from tabContainerWidget and closes the confirmation dialog.
             * @inner
             */
            var closeDialog = function() {
                if (removeTabUserCallbackNo && typeof(removeTabUserCallbackNo) == 'function') {
                    removeTabUserCallbackNo();
                }
                confirmationDialog.destroy();
            };

            /**
             * Executes the provided callback from tabContainerWidget with doNotShowAgain parameter and closes the confirmation dialog.
             * @inner
             */
            var confirmDeletion = function(doNotShowAgain) {
                if (removeTabUserCallbackYes && typeof(removeTabUserCallbackYes) == 'function') {
                    removeTabUserCallbackYes(doNotShowAgain);
                }
                closeDialog();
            };

            var confirmationDialogConfiguration = _.extend(confirmationDialogConf['delete'], conf.remove.confirmDialogConfig);
            confirmationDialogConfiguration.yesButtonCallback = confirmDeletion;
            confirmationDialogConfiguration.noButtonCallback = closeDialog;

            confirmationDialog = new ConfirmationDialogWidget(confirmationDialogConfiguration);
            confirmationDialog.build();
        };

    };

    return ConfirmationDialogBuilder;
});