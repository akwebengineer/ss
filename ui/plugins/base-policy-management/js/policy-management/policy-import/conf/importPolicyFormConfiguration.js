/**
 * A configuration object with the parameters required to build 
 * a form for upload file
 *
 * @module addressImportFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage('import_zip_file_title'),
                "form_id": "policy-import-form",
                "form_name": "policy-import-form",
                "title-help": {
                    "content": context.getMessage('import_zip_file_title_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_ZIP_FILE_IMPORT_EXPORTING")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "policy-zip-import",
                        "heading_text": context.getMessage('policy_zip_import_note'),
                        "elements": [
                            {
                                "element_file": true,
                                "id": "policy-zip-import-area",
                                "name": "policy-zip-import-area",
                                "label": context.getMessage('import_zip_file_label'),
                                "required": true,
                                "post_validation": "validateFileName",
                                "placeholder": "",
                                "fileupload_button_label": context.getMessage('browse'),
                                "error": context.getMessage('import_zip_file_error')
                            }
                            // {
                            //     "element_description": true,
                            //     "id": "poilcy-zip-import-sample",
                            //     "name": "policy-zip-import-sample",
                            //     "label": ""
                            // }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "policy-zip-import-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "policy-zip-import-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
