/**
 * Intent action definition, these actions are specific used in security management.
 *
 * @module intentActions
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define(function() {
    var intentActions = {
            /**
             * Delete specific resources.
             */
            ACTION_DELETE: "sd.intent.action.ACTION_DELETE",
            /**
             * Delete specific unused resources.
             */
            ACTION_DELETE_UNUSED: "sd.intent.action.ACTION_DELETE_UNUSED",
            /**
             * Download specific resources.
             */
            ACTION_DOWNLOAD: "sd.intent.action.ACTION_DOWNLOAD",
            /**
             * Upload attack bundle.
             */
            ACTION_UPLOAD: "sd.intent.action.ACTION_UPLOAD",
            /**
             * Download configuration.
             */
            ACTION_DOWNLOAD_CONFIGURATION: "sd.intent.action.ACTION_DOWNLOAD_CONFIGURATION",
            /**
             * Download history.
             */
            ACTION_DOWNLOAD_HISTORY: "sd.intent.action.ACTION_DOWNLOAD_HISTORY",
            /**
             * Install specific resources.
             */
            ACTION_INSTALL: "sd.intent.action.ACTION_INSTALL",
            /**
             * Show duplicate groups.
             */
            ACTION_SHOW_DUPLICATES: "sd.intent.action.ACTION_SHOW_DUPLICATES",
            /**
             * Replace specific resources.
             */
            ACTION_REPLACE: "sd.intent.action.ACTION_REPLACE",
            ACTION_COMPARE_POLICY: "sd.intent.action.ACTION_COMPARE_POLICY",
            /**
             * assign objects to a special domain.
             */
            ACTION_ASSIGN_TO_DOMAIN: "sd.intent.action.ACTION_ASSIGN_TO_DOMAIN",
            /**
             * Show detail view.
             */
            ACTION_SHOW_DETAIL_VIEW: "sd.intent.action.ACTION_SHOW_DETAIL_VIEW",
            /**
             * Import Device Change Action
             */
            ACTION_IMPORT_DEVICECHANGE: "sd.intent.action.ACTION_IMPORT_DEVICECHANGE",
            /**
             * Import Device Change Action
             */
            ACTION_VIEW_DEVICECHANGE: "sd.intent.action.ACTION_VIEW_DEVICECHANGE",

            /**
             * Rollback.
             */
            ACTION_ROLLBACK: "sd.intent.action.ACTION_ROLLBACK",

            /**
         * Import from zip file.
         */
            ACTION_IMPORT_ZIP: "sd.intent.action.ACTION_IMPORT_ZIP",

           /**
            * Show list intent inside custom container
            *
            */
           ACTION_LIST_CUSTOM_CONTAINER: "sd.intent.action.ACTION_LIST_CUSTOM_CONTAINER"


    };

    return intentActions;
});