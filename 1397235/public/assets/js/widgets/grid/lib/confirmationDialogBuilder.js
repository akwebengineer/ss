/**
 * A module that builds a confirmation dialog after a user selects an action like delete a row
 *
 * @module ConfirmationDialogBuilder
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'widgets/confirmationDialog/confirmationDialogWidget',
    'widgets/grid/view/selectAllView',
    'widgets/overlay/overlayWidget',
    'widgets/spinner/spinnerWidget',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'widgets/grid/lib/dialogFormatter',
    'widgets/grid/lib/gridTemplates'
], /** @lends ConfirmationDialogBuilder */
    function (ConfirmationDialogWidget, OverlayView, OverlayWidget, SpinnerWidget, render_template, i18n, DialogFormatter, GridTemplates) {

    /**
     * ConfirmationDialogBuilder constructor
     *
     * @constructor
     * @class ConfirmationDialogBuilder - Builds a confirmation dialog
     *
     * @returns {Object} Current ConfirmationDialogBuilder's object: this
     */
    var ConfirmationDialogBuilder = function (conf) { //grid: conf.elements

        var templates = new GridTemplates().getTemplates();

        /**
         * Builds the ConfirmationDialogBuilder
         * @returns {Object} Current "this" of the class
         */

        var confirmationDialogs = function () {
            var confirmationDialog = new DialogFormatter().getConfirmationDialogs();
            if (conf.confirmationDialog)
                confirmationDialog = new DialogFormatter(conf.confirmationDialog).getConfirmationDialogs();
            return confirmationDialog;
        }();

        /**
         * Provides row deletion by a conf.deleteRow callback which could create a view and handle the row deletion or
         * by opening a default Confirmation Dialog to confirm the deletion of rows
         * @param {Object} selectedRows - Object with properties like the number of selected rows, the row data, etc
         * @param {Function} deleteRows - Callback that will be executed when the user confirms row deletion
         * @param {Function} reloadGrid - Callback that will be invoked if the grid requires auto refresh of the grid
         */
        this.deleteRow = function (selectedRows, deleteRows, reloadGrid) {
            if (_.isFunction(conf.deleteRow)) {
                conf.deleteRow(selectedRows, deleteRows, reloadGrid);
            } else {
                buildConfirmationDialog (selectedRows, deleteRows, reloadGrid);
            }
        };

        /**
         * Opens a Confirmation Dialog to confirm the deletion of rows
         * @param {Object} selectedRows - Object with properties like the number of selected rows, the row data, etc
         * @param {Function} deleteRows - Callback that will be executed when the user confirms row deletion
         * @param {Function} reloadGrid - Callback that will be invoked if the grid requires auto refresh of the grid
         */
        var buildConfirmationDialog = function (selectedRows, deleteRows, reloadGrid) {
            var confirmationDialog;

            var closeDialog = function () {
                confirmationDialog.destroy();
            };
            var confirmDeletion = function () {
                if (conf.deleteRow && typeof(conf.deleteRow.onDelete) == 'function') {
                    onDelete(conf.deleteRow.onDelete, selectedRows, deleteRows, reloadGrid);
                } else if (conf.deleteRow && conf.deleteRow.autoRefresh) {
                    deleteRows();
                    reloadGrid();
                } else {
                    deleteRows();
                }
                closeDialog();
            };

            //gets the configuration of the confirmation dialog from the base grid configuration dialog
            var confirmationDialogConfiguration = _.extend({
                "yesButtonCallback": confirmDeletion,
                "noButtonCallback": closeDialog
            }, confirmationDialogs['delete']);

            //overwrites default delete message if it is defined in the grid configuration otherwise, it uses the default grid confirmation (updates it when it's more than one row)
            if (conf.deleteRow && conf.deleteRow.message) {
                confirmationDialogConfiguration.question = conf.deleteRow.message(selectedRows);
            } else if (selectedRows.numberOfSelectedRows > 1) {
                confirmationDialogConfiguration.question = "Delete the " + selectedRows.numberOfSelectedRows + " selected items?";
            }

            confirmationDialog = new ConfirmationDialogWidget(confirmationDialogConfiguration);
            confirmationDialog.build();
        };

        /**
         * Delete rows by using a defer promise which allows to sync the response of a callback with the deletion of the rows on the grid
         * @param {Function} callback that allows users of the grid to perform some operations like calling the REST API that will delete the rows in the backend
         * @param {Object} selectedRows - Object with properties like the number of selected rows, the row data, etc
         * @param {Function} deleteRows - Callback that will be executed when the user confirms row deletion
         * @param {Function} reloadGrid - Callback that will be invoked if the grid requires auto refresh of the grid
         * @inner
         */
        var onDelete = function (deleteRowsCallback, selectedRows, deleteRows, reloadGrid) {
            var getAllRowIdsPromise = function () {
                var deferred = $.Deferred();
                deleteRowsCallback(
                    selectedRows,
                    function () {
                        deferred.resolve();
                    },
                    function (errorMessage) {
                        deferred.reject(errorMessage);
                    }
                );
                return deferred.promise();
            };
            var promise = getAllRowIdsPromise();
            $.when(promise)
                .done(function () {
                    deleteRows();
                    if (conf.deleteRow.autoRefresh) {
                        reloadGrid();
                    }
                })
                .fail(function (errorMessage) {
                    console.log(errorMessage);
                });
        };

        /**
         * Opens an Error Confirmation Dialog
         * @param {String} errorMessage
         */
        this.showErrorMsg = function (errorMessage) {
            var confirmationDialog;

            var cancel = function () {
                confirmationDialog.destroy();
            };

            if (errorMessage) {
                _.extend(confirmationDialogs['error'], {
                    yesButtonCallback: cancel,
                    question: errorMessage
                });
            } else {
                _.extend(confirmationDialogs['error'], {
                    yesButtonCallback: cancel
                });
            }

            confirmationDialog = new ConfirmationDialogWidget(confirmationDialogs['error']);
            confirmationDialog.build();
        };

        /**
         * Show SelectAll Confirmation Dialog
         * @param {Integer} records: the current grid records
         * @param {Function} setAllRow: select all rows and submit API
         * @param {Function} unselectAll: unselect all rows
         * @param {Function} updateSelectStatus: update the action status
         */
        this.showSelectAllMsg = function (records, setAllRow, unselectAll, updateSelectStatus) {
            var overlay,
                overlayConfig,
                confirmationContent = i18n.getMessage({ msg: 'grid_select_all_confirmation_msg', sub_values: [records]}),
                overlayViewObj = new OverlayView({content: confirmationContent});

            var cancel = function () {
                unselectAll(updateSelectStatus);
            };

            var beforeSubmit = function () {
                var activityIndicatorTime = 20,
                    textUpdateTime = 5000,
                    textOrder = 0,
                    spinnerSelectedTimeout,
                    spinnerTextUpdateInterval,
                    spinner,
                    loadText = ["grid_select_all_first_loading_text", "grid_select_all_second_loading_text", "grid_select_all_third_loading_text"],
                    $spinnerContainer = overlay.getOverlayContainer();

                setAllRow();
                $spinnerContainer.append(render_template(templates.loadingBackgroundTemplate));
                spinner = new SpinnerWidget({
                    "container": $spinnerContainer,
                    "statusText": i18n.getMessage(loadText[textOrder])
                });
                spinnerSelectedTimeout = setTimeout(function () {
                    spinner.build();
                }, activityIndicatorTime);

                //Update spinner loading text every 5 secs
                spinnerTextUpdateInterval = setInterval(function () {
                    if (textOrder === (loadText.length - 1)) {
                        textOrder = loadText.length - 1;
                        clearInterval(spinnerTextUpdateInterval);
                    } else {
                        textOrder++;
                    }
                    spinner.setStatusText(i18n.getMessage(loadText[textOrder]));
                }, textUpdateTime);

                return false;
            };

            overlayConfig = _.extend(confirmationDialogs['selectAll'], {
                view: overlayViewObj,
                cancel: cancel,
                beforeSubmit: beforeSubmit
            });
            overlay = new OverlayWidget(overlayConfig);
            overlay.build();
            return overlay;
        };

    };

    return ConfirmationDialogBuilder;
});