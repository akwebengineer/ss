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
                    "form_id": "publish_policy_conf_form",
                    "form_name": "publish_policy_conf_form",
                    "on_overlay": true,
                    "scroll": false,
                    "title-help": {
                        "content": context.getMessage("device_view_configuration_title_tooltip"),
                        "ua-help-text":context.getMessage("more_link"),
                        "ua-help-identifier": context.getHelpKey("SECURITY_DIRECTOR_DEVICE_CHANGE_VIEWING")
                    },
                    "err_div_id": "errorDivPublishWarning",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": context.getMessage("fw_policy_create"),
                    "err_timeout": "1000",
                    "valid_timeout": "5000",
                    "title": options.title,
                    "sections": [
                        {
                            "elements": [
                                {
                                    "element_discription": true,
                                    "id": "deviceWarningMsg",
                                    "class": "deviceWarningMsg",
                                    "name": "deviceWarningMsg",
                                    "placeholder": context.getMessage('loading')
                                },
                                {
                                    "element_text": true,
                                    "id": "configuration-tab-view",
                                    "class": "hide configurationtabview",
                                    "name": "configuration-tab-view",
                                    "placeholder": context.getMessage('loading')
                                }                           
                            ]
                        }
                    ],
                    "buttonsAlignedRight": true,
                    "buttons": [
                        {
                            "id": "deviceConfOk",
                            "name": "deviceConfOk",
                            "value": "OK"
                        }
                    ]
                };
            };
            /** 
             *  xml view configuration 
             */
            this.getXmlConf = function() {
              
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
                            "placeholder": context.getMessage('loading')
                        }]
                    }]
                };    

            };
            /**
             *  cli view configuration 
             */
            this.getCliConf = function() {
               
                return {
                    "on_overlay": false,
                    "height":900,
                    "width":700,
                    "sections": [{
                        "elements":[{
                                "element_text": true,
                                "id": "configuration-tab-cli-view",
                                "class": "configurationtabcliview",
                                "name": "configuration-tab-cli-view",
                                "placeholder": context.getMessage('loading')
                        }]
                    }]
                }; 

            };

        };

        return Configuration;
    }

);
