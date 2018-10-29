/**
 * @author avyaw
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    ], function () {

    var PasteMessageFormConfiguration = function (context) {

        this.getConfig = function() {
            return {
                "title": context.getMessage("paste_op_msg"),
                "form_id": "paste_operation_form",
                "form_name": "paste_operation_form",
                "title-help": {
                    "content": context.getMessage("paste_op_msg"),
                    "ua-help-identifier": "alias_for_title_paste"
                },
                "err_div_id": "errorDiv",
                "err_div_message": context.getMessage("form_error"),
                "err_div_link_text": context.getMessage("paste_operation"),
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,

                "sections": [
                    {
                        "section_id": "section_msg",
                        "section_class": "section_class",
                        "elements": {
                            "element_description": true,
                            "id": "message_editor",
                            "name": "message_editor",
                            "value": "",            
                            "label": ""
                        }
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnPasteOk",
                        "name": "btnPasteOk",
                        "value": context.getMessage('ok')
                    }
                ]
            }
       };

    };
    return PasteMessageFormConfiguration;
});
