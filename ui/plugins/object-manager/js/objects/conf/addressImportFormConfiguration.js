/**
 * A configuration object with the parameters required to build 
 * a form for import addresses
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
                "title": context.getMessage('import_csv_file_title'),
                "form_id": "address-import-form",
                "form_name": "address-import-form",
                "title-help": {
                    "content": context.getMessage('import_csv_file_title_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_CSV_FILE_IMPORT_EXPORTING")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "address-import",
                        "heading_text": context.getMessage('address_import_note'),
                        "elements": [
                            {
                                "element_file": true,
                                "id": "address-import-area",
                                "name": "address-import-area",
                                "label": context.getMessage('import_csv_file_label'),
                                "required": true,
                                "post_validation": "validateFileName",
                                "placeholder": "",
                                "fileupload_button_label": context.getMessage('browse'),
                                "error": context.getMessage('import_csv_file_error')
                            },
                            {
                                "element_description": true,
                                "id": "address-import-sample",
                                "name": "address-import-sample",
                                "label": ""
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "address-import-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "address-import-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
