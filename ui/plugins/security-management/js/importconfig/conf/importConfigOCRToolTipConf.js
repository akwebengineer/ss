/**
 * @author: nareshu
 *  Provides configuration required by the tool tip form for OCR grid.
 *
 *
 */
define([], function () {

    var formConfiguration = {};

    formConfiguration.ocr = {
        "title": "Object Conflict",
        "form_id": "create_policy",
        "form_name": "create_policy",
        "on_overlay": true,
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "title": "{{title}}",
        "sections": [
           
            {
                "section_id": "section_tooltipInfo",
                "elements": [
                    {
                        "element_label": true,
                        "id": "tooltipInfo",
                        "name": "tooltipInfo",
                        "class": "tooltipInfo"
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "show_tooltip_ok",
                "name": "ok",
                "value": "Close"
            }
        ]
    };

return formConfiguration;

});