define([], function () {

  var Configuration = function(context) {
     
    this.getValues = function(section) {
     
       return{
        
                            "heading": "Node "+section,
                            "section_id": "node_"+section,
                            "elements": [
                                    {
                                       "element_multiple_error": true,
                                       "id": "node_name"+section,
                                       "class": "tab-widget",
                                       "label": context.getMessage("log_node_name"),
                                       "required": true,
                                       "field-help":{
                                          "content" : context.getMessage("log_node_name_field_help")
                                       },
                                       "name": "node_name"+section,
                                       "pattern-error": [                                            
                                            {
                                                "pattern": "hasnotspace",
                                                "error": "Must not include a space."
                                            },
                                            {
                                               "pattern": "length", 
                                               "min_length":"1",                                                                                             
                                               "max_length":"32",
                                               "error": "Max length cannot excced 32 characters"

                                            }
                                        ],
                                        "error": true,
                                       "inlineButtons": [{
                                    "id": "removeNode"+section,
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "addMoreNode"+section,
                                    "value": context.getMessage('remove_node')
                                    }]
                                    },
                                    {
                                        "element_ip": true,
                                        "id": "node"+section+"_ip",
                                        "name": "node"+section+"_ip",
                                        "label": context.getMessage('ip_address'),
                                        "placeholder": "IPv4 or IPv6",
                                        "required": true,
                                        "field-help":{
                                          "content" : context.getMessage("log_node_ipaddress_field_help")
                                        },
                                        "error": "Please enter a valid IP address"
                                    },
                                    {
                                        "element_description": true,
                                        "id": "node_"+section+"ip_type",
                                        "name": "node"+section+"_ip_type",
                                        "class":"log-collector-type",
                                        "label": ""
                                    },
                                    {
                                       "element_text": true,
                                       "id": "node_username"+section,
                                       "class": "tab-widget",
                                       "label": context.getMessage("log_node_user_name"),
                                       "required": true,
                                       "field-help":{
                                          "content" : context.getMessage("log_node_user_name_field_help")
                                       },
                                       "name": "node_username"+section
                                    },
                                    {
                                        "element_password": true,
                                        "id": "node"+section+"_password",
                                        "name": "node"+section+"_password",
                                        "label": context.getMessage('password'),
                                        "error": false,
                                        "required": true,
                                        "notshowvalid": true,
                                        "field-help":{
                                          "content" : context.getMessage("log_node_password_field_help")
                                        },
                                        "inlineButtons": [{
                                    "id": "addMoreNode"+section,
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "addMoreNode"+section,
                                    "value": context.getMessage('add_node')
                                    }]
                                    }
                            ]
                          
                      
       };
    };
  };   
    return Configuration;
});