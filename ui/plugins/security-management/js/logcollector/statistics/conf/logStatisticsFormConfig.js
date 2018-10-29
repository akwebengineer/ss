/**
 * Logging Statistics Form Configuration Elements
 *
 * @module Log Statistics Definition
 * @author Aslam <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "statistics_troubleshooting",
                    "form_name": "statistics_troubleshooting",
                    "sections": [
                    {
                        "elements": [
  
                        {
                            "element_text": true,
                            "id": "statistics_troubleshootings_list",
                            "class": "statistics_troubleshooting_list",
                            "name": "statistics_troubleshooting_list",
                            "placeholder": context.getMessage('Loading ...')
                        },
                        {
                            "element_description": true,
                            "id": "download_data",
                            "name": "download_data",
                            "class" : "download_troubleshooting_dump"
                        },
                        // {
                                       
                        //     "element_description": true,
                        //     "id": "download_diagnostic_dump",
                        //     "name": "download_diagnostic_dump",
                        //     "value": "<div><a href='#' id='generate-dump'>Generate Diagnostic Dump</a></div>"
                                         
                        // }

                        ]
                    }]

                };

            };

        };

        return Configuration;
    }
);
