/**
 * A configuration object with the parameters required to build 
 * a form for import variables
 *
 * @module variableImportFormConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(context) {

        this.getValues = function() {
            return {
                "title": context.getMessage('import_csv_file_title'),
                "form_id": "variable-import-form",
                "form_name": "variable-import-form",
                "title-help": {
                    "content": context.getMessage('import_csv_file_title_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("POLICY_OBJECT_CSV_FILE_IMPORT_EXPORTING")
                },
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "variable-import",
                        "heading_text": context.getMessage('variable_import_note'),
                        "elements": [
                            {
                                "element_file": true,
                                "id": "variable-import-area",
                                "name": "variable-import-area",
                                "label": context.getMessage('import_csv_file_label'),
                                "required": true,
                                "placeholder": "",
                                "post_validation": "validateFileName",
                                "fileupload_button_label": context.getMessage('browse'),
                                "error": context.getMessage('import_csv_file_error')
                            },
                            {
                                "element_description": true,
                                "id": "variable-import-sample",
                                "name": "variable-import-sample",
                                "label": ""
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "variable-import-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "variable-import-save",
                        "name": "save",
                        "value": context.getMessage('ok')
                    }
                ]
            };
        };
    };

    return Configuration;
});
