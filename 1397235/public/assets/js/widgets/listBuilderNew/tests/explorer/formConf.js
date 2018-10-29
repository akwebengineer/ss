/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "List Builder Demo",
        "form_id": "listBuilderDemo",
        "form_name": "listBuilderDemo",
        "title-help": {
            "content": "Configure list builder options for demo",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading": "Instantiate list builder with options below",
                "heading_text": "Fill in options to see the list builder ",
                "section_id": "section_id_1",
                
                "elements": [
                   {
                        "element_textarea": true,
                        "id": "rowTooltip",
                        "name": "rowTooltip",
                        "label": "rowTooltip",
                        "rows": 7,
                        "value": "{{rowTooltipFunc}}",
                        "disabled":true,
                        "field-help": {
                            "content": "Defines a callback that will return an array of tooltip objects. It provides the rowData and renderTooltip parameters. renderTooltip is a callback that should be invoked to provide the view to be showed in the cell tooltip. It expects an array of tooltip labels, title or link, which will dynamically render in the tooltip widget",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                    },
                    {
                        "element_dropdown": true,
                        "id": "availableElements",
                        "name": "availableElements",
                        "label": "availableElements",
                        "required": true,
                        "values": [ //to be deprecated, use data instead
                            
                            
                            {
                                "label": "Data Sample 1",
                                "value": "d1"
                                
                            },
                            {
                                "label": "Data Sample 2",
                                "value": "d2"
                                
                            },
                            {
                                "label": "Data Sample 3",
                                "value": "d3"
                                
                            },
                            {
                                "label": "Data Sample 4",
                                "value": "d4"
                                
                            },
                            {
                                "label": "Data Sample 5",
                                "value": "d5"
                                
                            },
                            {
                                "label": "Data Sample 6",
                                "value": "d6"
                                
                            },
                            {
                                "label": "Data Sample 7",
                                "value": "d7"
                                
                            },
                            {
                                "label": "Data Sample 8",
                                "value": "d8"
                                
                            },
                            {
                                "label": "Data Sample 9",
                                "value": "d9"
                                
                            }
                        ],
                        "field-help": {
                            "content": "Defines the parameters of the available column",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "error": "Please make a selection"
                    }, 
                    {
                        "element_dropdown": true,
                        "id": "selectedElements",
                        "name": "selectedElements",
                        "label": "selectedElements",
                        "required": true,
                        "values": [ //to be deprecated, use data instead
                            
                            {
                                "label": "No data",
                                "value": "d0"
                            },
                            {
                                "label": "Data Sample 1",
                                "value": "d1"
                                
                            },
                            {
                                "label": "Data Sample 2",
                                "value": "d2"
                                
                            },
                            {
                                "label": "Data Sample 3",
                                "value": "d3"
                                
                            },
                            {
                                "label": "Data Sample 4",
                                "value": "d4"
                                
                            },
                            {
                                "label": "Data Sample 5",
                                "value": "d5"
                                
                            },
                            {
                                "label": "Data Sample 6",
                                "value": "d6"
                                
                            },
                            {
                                "label": "Data Sample 7",
                                "value": "d7"
                                
                            },
                            {
                                "label": "Data Sample 8",
                                "value": "d8"
                                
                            },
                            {
                                "label": "Data Sample 9",
                                "value": "d9"
                                
                            }
                        ],
                        "field-help": {
                            "content": "Defines the parameters of the selected column",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "error": "Please make a selection"
                    },
                    {
                        "element_text": true,
                        "id": "pageSize",
                        "name": "pageSize",
                        "label": "pageSize",
                        "field-help": {
                            "content": "Defines the number of elements that will be requested from the API to show the next set of elements for virtual scrolling (pagination).",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "10",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "listId",
                        "name": "listId",
                        "label": "id",
                        "field-help": {
                            "content": "Adds an id to the list builder.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "test",   
                        "pattern": ".*"
                    },
                    {
                        "element_text": true,
                        "id": "height",
                        "name": "height",
                        "label": "height",
                        "field-help": {
                            "content": "Defines the height of the list builder. The height needs to be set in pixels.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "115px",   
                        "pattern": ".*"
                    },
                    {
                        "element_checkbox": true,
                        "id": "loadOnce",
                        "label": "loadonce",
                        "required": false,
                        "values": [
                            {
                                "id": "loadOnce_Checkbox",
                                "name": "loadOnce_Checkbox",
                                "label": "",
                                "value": "enable",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": " If this flag is set to true, the list builder loads the data from the server only once (using the appropriate datatype). After the first request, the datatype parameter is automatically changed to local and all further manipulations are done on the client side. The functions of the pager (if present) are disabled.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "onChangeSelected",
                        "label": "onChangeSelected",
                        "required": false,
                        "values": [
                            {
                                "id": "onChangeSelected_Checkbox",
                                "name": "onChangeSelected_Checkbox",
                                "label": "",
                                "value": "enable",
                                "checked": false
                            }
                        ],
                        "field-help": {
                            "content": " After selecting/unselecting the list builder, this event will get trigger",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                        
                    },
                    {
                        "element_checkbox": true,
                        "id": "columns",
                        "label": "columns",
                        "required": false,
                        "values": [
                            {
                                "id": "uri_Checkbox",
                                "name": "columnuri_Checkbox",
                                "label": "@uri",
                                "value": "uri",
                                "checked": false,
                                "visibility":["uri_option","uri_label","uri_width"]
                            },
                            {
                                "id": "href_Checkbox",
                                "name": "columnhref_Checkbox",
                                "label": "@href",
                                "value": "href",
                                "checked": false,
                                "visibility":["href_option","href_label","href_width"]
                            },
                            {
                                "id": "name_Checkbox",
                                "name": "columnname_Checkbox",
                                "label": "name",
                                "value": "name",
                                "checked": true,
                                "visibility":["name_option","name_label","name_width"]
                            },
                            {
                                "id": "hash-key_Checkbox",
                                "name": "columnhash-key_Checkbox",
                                "label": "hash-key",
                                "value": "hash-key",
                                "checked": false,
                                "visibility":["hash-key_option","hash-key_label","hash-key_width"]
                            },
                            {
                                "id": "address-type_Checkbox",
                                "name": "columnaddress-type_Checkbox",
                                "label": "address-type",
                                "value": "address-type",
                                "checked": false,
                                "visibility":["address-type_option","address-type_label","address-type_width"]
                            },
                            {
                                "id": "ip-address_Checkbox",
                                "name": "columnip-address_Checkbox",
                                "label": "ip-address",
                                "value": "ip-address",
                                "checked": false,
                                "visibility":["ip-address_option","ip-address_label","ip-address_width"]
                            },
                            {
                                "id": "description_Checkbox",
                                "name": "columndescription_Checkbox",
                                "label": "description",
                                "value": "description",
                                "checked": false,
                                "visibility":["description_option","description_label","description_width"]
                            },
                            {
                                "id": "definition-type_Checkbox",
                                "name": "columndefinition-type_Checkbox",
                                "label": "definition-type",
                                "value": "definition-type",
                                "checked": false,
                                "visibility":["definition-type_option","definition-type_label","definition-type_width"]
                            },
                            {
                                "id": "id_Checkbox",
                                "name": "columnid_Checkbox",
                                "label": "id",
                                "value": "id",
                                "checked": false,
                                "visibility":["id_option","id_label","id_width"]
                            },
                            {
                                "id": "domain-id_Checkbox",
                                "name": "columndomain-id_Checkbox",
                                "label": "domain-id",
                                "value": "domain-id",
                                "checked": false,
                                "visibility":["domain-id_option","domain-id_label","domain-id_width"]
                            },
                            {
                                "id": "domain-name_Checkbox",
                                "name": "columndomain-name_Checkbox",
                                "label": "domain-name",
                                "value": "domain-name",
                                "checked": true,
                                "visibility":["domain-name_option","domain-name_label","domain-name_width"]
                            }
                        ],
                        "field-help": {
                            "content": " Contains the data required to render the header of the table and column features. It's a required parameter and should contain an array with objects that represent each of the columns of the list builder.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    } ,
                    //uri hidden elements
                    {
                        "element_text": true,
                        "id": "uri_label",
                        "name": "uri_label",
                        "label": "@uri Label",
                        "value": "uri",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "uri_width",
                        "name": "uri_width",
                        "label": "@uri width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "uri_option",
                        "label": "@uri option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "uri_option_hidden_Checkbox",
                                "name": "uri_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "uri_option_addFormatter_Checkbox",
                                "name": "uri_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // href hidden elements
                    {
                        "element_text": true,
                        "id": "href_label",
                        "name": "href_label",
                        "label": "@href Label",
                        "value": "href",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "href_width",
                        "name": "href_width",
                        "label": "@href width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "href_option",
                        "label": "@href option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "href_option_hidden_Checkbox",
                                "name": "href_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "href_option_addFormatter_Checkbox",
                                "name": "href_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // name hidden elements
                    {
                        "element_text": true,
                        "id": "name_label",
                        "name": "name_label",
                        "label": "name Label",
                        "value": "name",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "name_width",
                        "name": "name_width",
                        "label": "name width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "name_option",
                        "label": "name option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "name_option_hidden_Checkbox",
                                "name": "name_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "name_option_addFormatter_Checkbox",
                                "name": "name_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // hash-key hidden elements
                    {
                        "element_text": true,
                        "id": "hash-key_label",
                        "name": "hash-key_label",
                        "label": "hash-key Label",
                        "value": "hash-key",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "hash-key_width",
                        "name": "hash-key_width",
                        "label": "hash-key width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "hash-key_option",
                        "label": "hash-key option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "hash-key_option_hidden_Checkbox",
                                "name": "hash-key_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "hash-key_option_addFormatter_Checkbox",
                                "name": "hash-key_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // address-type hidden elements
                    {
                        "element_text": true,
                        "id": "address-type_label",
                        "name": "address-type_label",
                        "label": "address-type Label",
                        "value": "address-type",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "address-type_width",
                        "name": "address-type_width",
                        "label": "address-type width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "address-type_option",
                        "label": "address-type option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "address-type_option_hidden_Checkbox",
                                "name": "address-type_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "address-type_option_addFormatter_Checkbox",
                                "name": "address-type_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // ip-address hidden elements
                    {
                        "element_text": true,
                        "id": "ip-address_label",
                        "name": "ip-address_label",
                        "label": "ip-address Label",
                        "value": "ip-address",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "ip-address_width",
                        "name": "ip-address_width",
                        "label": "ip-address width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "ip-address_option",
                        "label": "ip-address option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "ip-address_option_hidden_Checkbox",
                                "name": "ip-address_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "ip-address_option_addFormatter_Checkbox",
                                "name": "ip-address_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // description hidden elements
                    {
                        "element_text": true,
                        "id": "description_label",
                        "name": "description_label",
                        "label": "description Label",
                        "value": "description",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "description_width",
                        "name": "description_width",
                        "label": "description width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "description_option",
                        "label": "description option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "description_option_hidden_Checkbox",
                                "name": "description_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "description_option_addFormatter_Checkbox",
                                "name": "description_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // definition-type hidden elements
                    {
                        "element_text": true,
                        "id": "definition-type_label",
                        "name": "definition-type_label",
                        "label": "definition-type Label",
                        "value": "definition-type",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "definition-type_width",
                        "name": "definition-type_width",
                        "label": "definition-type width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "definition-type_option",
                        "label": "definition-type option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "definition-type_option_hidden_Checkbox",
                                "name": "definition-type_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "definition-type_option_addFormatter_Checkbox",
                                "name": "definition-type_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // id hidden elements
                    {
                        "element_text": true,
                        "id": "id_label",
                        "name": "id_label",
                        "label": "id Label",
                        "value": "id",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "id_width",
                        "name": "id_width",
                        "label": "id width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "id_option",
                        "label": "id option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "id_option_hidden_Checkbox",
                                "name": "id_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "id_option_addFormatter_Checkbox",
                                "name": "id_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // domain-id hidden elements
                    {
                        "element_text": true,
                        "id": "domain-id_label",
                        "name": "domain-id_label",
                        "label": "domain-id Label",
                        "value": "domain-id",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "domain-id_width",
                        "name": "domain-id_width",
                        "label": "domain-id width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "domain-id_option",
                        "label": "domain-id option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "domain-id_option_hidden_Checkbox",
                                "name": "domain-id_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "domain-id_option_addFormatter_Checkbox",
                                "name": "domain-id_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    },
                    // domain-name hidden elements
                    {
                        "element_text": true,
                        "id": "domain-name_label",
                        "name": "domain-name_label",
                        "label": "domain-name Label",
                        "value": "domain-name",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_text": true,
                        "id": "domain-name_width",
                        "name": "domain-name_width",
                        "label": "domain-name width",
                        "value": "150",   
                        "pattern": ".*",
                        "hidden": true
                    },
                    {
                        "element_checkbox": true,
                        "id": "domain-name_option",
                        "label": "domain-name option",
                        "required": false,
                        "hidden":true,
                        "values": [
                            {
                                "id": "domain-name_option_hidden_Checkbox",
                                "name": "domain-name_option_hidden_Checkbox",
                                "label": "hidden",
                                "value": "hidden",
                                "checked": false
                            },
                            {
                                "id": "domain-name_option_addFormatter_Checkbox",
                                "name": "domain-name_option_addFormatter_Checkbox",
                                "label": "addFormatter",
                                "value": "addFormatter",
                                "checked": false
                            }
                        ] 
                    }
                ]
            },
            {
                "heading": "Add sorting",
                "heading_text": "Defines the sorting of the list builder. The sorting parameter (sortby) will be appended to the list builder url and it will be requested to the server. If virtual scrolling is enabled, each url request will include the sortby parameter. ",
                "section_id": "section_id_2",
                "section_class": "section_class",
                "toggle_section":{
                    "label": "Select to show the form elements for sorting",
                    "status": "hide" 
                },
                "elements": [
                    {
                        "element_dropdown": true,
                        "id": "sort_col",
                        "name": "sort_col",
                        "label": "column",
                        "class":"itemCopy",
                        "values": [ 

                            {
                                "label": "@uri",
                                "value": "uri",
                            },
                            {
                                "label": "@href",
                                "value": "href",
                            },
                            {
                                "label": "name",
                                "value": "name",
                            },
                            {
                                "label": "hash-key",
                                "value": "hash-key",
                            },
                            {
                                "label": "address-type",
                                "value": "address-type",
                            },
                            {
                                "label": "ip-address",
                                "value": "ip-address",
                            },
                            {
                                "label": "description",
                                "value": "description",
                            },
                            {
                                "label": "definition-type",
                                "value": "definition-type",
                            },
                            {
                                "label": "id",
                                "value": "id",
                            },
                            {
                                "label": "domain-id",
                                "value": "domain-id",
                            },
                            {
                                "label": "domain-name",
                                "value": "domain-name",
                            }
                        ]
                    },
                    {
                        "element_radio": true,
                        "id": "order",
                        "label": "order", 
                        "class":"itemCopy",                       
                        "values": [
                            {
                                "id": "asc",
                                "name": "order_radio",
                                "label": "Ascending",
                                "value": "asc",
                                "checked": true
                                
                            },
                            {
                                "id": "desc",
                                "name": "order_radio",
                                "label": "Descending",
                                "value": "desc"
                            }
                            
                        ] 
                    }
                ]
            }
            
        ],

        "buttonsClass":"buttons_row",
        "buttons": [
             // add buttons
             {
                "id": "generate",
                "name": "generate",
                "value": "Generate",
                "isInactive": true
            },
            {
                "id": "get_available",
                "name": "get_available",
                "value": "getAvailableItems"
            },
            {
                "id": "get_selected",
                "name": "get_selected",
                "value": "getSelectedItems"
            },
            {
                "id": "add_available",
                "name": "add_available",
                "value": "addAvailableItems"
            },
            {
                "id": "add_selected",
                "name": "add_selected",
                "value": "addSelectedItems"
            },
            {
                "id": "remove_available",
                "name": "remove_available",
                "value": "removeAvailableItems"
            },
            {
                "id": "remove_selected",
                "name": "remove_selected",
                "value": "removeSelectedItems"
            },
            {
                "id": "search_available",
                "name": "search_available",
                "value": "searchAvailableItems"
            },
            {
                "id": "search_selected",
                "name": "search_selected",
                "value": "searchSelectedItems"
            }
        ]
        
    };

    configurationSample.values = {
        "rowTooltipFunc": 'function (rowData, renderTooltip){\n\
            var moreData = [];\
            moreData.push({title:rowData["domain-name"]});\
            moreData.push({label:rowData.name});\n\
            renderTooltip(moreData);  \n\
        }'
    };

    return configurationSample;

});