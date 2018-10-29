/**
 *  A configuration object for Publish Policy Device Configuration View
 *  
 *  @module publish policy Device congifuration form
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function(options) {

                return {
                    "form_id": "import-config-summary-form",
                    "form_name": "import_config_summary_form",
                    "on_overlay": true,
                    "scroll": false,
                    "title-help": {
                        "content": options.title,
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                    "err_div_id": "errorDiv",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": context.getMessage("fw_policy_create"),
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "title": options.title,//context.getMessage("device_view_configuration"),
                    "sections": [
                        {
                            "elements": [
                                {
                                    "element_text": true,
                                    "id": "configuration-tab-view",
                                    "class": "configurationtabview",
                                    "name": "configuration-tab-view",
                                    "placeholder": context.getMessage('loading'),
                                }                           
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "cancel_link": {
                        "id": "linkVieConfCancel",
                        "value": 'Back'
                    }
                };
            };
            //iframe container config
            this.getReportConfig = function(){
              
                return {
                    "on_overlay": false,
                    "height":900,
                    "width":700,
                    "sections": [{
                        "elements":[{
                            "element_text": true,
                            "id": "configuration-tab-xml-view",
                            "class": "configurationtabxmlview",
                            "name": "configuration-tab-xml-view",
                            "placeholder": context.getMessage('loading'),
                        }]
                    }]
                };    

            };


        };

        return Configuration;
    }

);
