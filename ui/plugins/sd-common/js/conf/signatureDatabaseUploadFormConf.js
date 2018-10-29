/**
 * A configuration object with the parameters required to build
 * a form for signature database upload form
 *
 * @module signatureDatabaseUploadFormConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {

            return {
                "form_id": "signature-database-upload-form",
                "form_name": "signature-database-upload-form",
                "title": context.getMessage('upload'),
                "on_overlay": true,
                "title-help": {
                    "content": context.getMessage('signature_database_upload_intro'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("SIGNATURE_DATABASE_FILE_SYSTEM_UPLOADING")
                },
                "sections": [
                    {
                         "elements": [
                            {
                                "element_file": true,
                                "id": "signature-database-upload-box",
                                "name": "signature-database-upload-box",
                                "label": context.getMessage('signature_database_upload_box_label'),
                                "placeholder": context.getMessage('signature_database_upload_box_placeholder'),
                                "fileupload_button_label": context.getMessage('browse'),
                                "field-help": {
                                    "content": context.getMessage('signature_database_upload_box_tooltip')
                                },
                                "required": true,
                                "error": context.getMessage('signature_database_upload_box_error')
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "signature-database-upload-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "signature-database-upload-upload",
                        "name": "upload",
                        "value": context.getMessage('upload')
                    }
                ]
            };
        };
    };

    return Configuration;
});