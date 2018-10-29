define([], function () {

  var Configuration = function(context) {
     
    this.getValues = function() {
     
       return{
                "title" : context.getMessage('syslog_forwarding'),
                "title-help": {
                    "content": context.getMessage("syslog_forwarding_title_help"),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("SYSLOG_FORWARDING")
                },
                "form_id": "general_settings_form",
                "form_name": "general_settings_form",
                "on_overlay": true,
                "sections": [
                          {
                              "elements": [
                                  {
                                    "element_checkbox": true,
                                    "id": "syslog_forwarding",
                                    "label": "Syslog Forwarding",
                                    "field-help":{
                                        "content" : "Enable this option to forward the log messages to a syslog server"
                                    },
                                    "values": [
                                        {
                                            "id": "syslog_forwarding_status",
                                            "name": "syslog_forwarding_status",
                                            "label": context.getMessage('enable'),
                                            "value": "true",
                                            "checked": false
                                        }
                                        ]
                                    },
                                    {
                                        "element_ip": true,
                                        "ip_version": "4",
                                        "id": "destination_ip",
                                        "required": true,
                                        "name": "destination_ip",
                                        "field-help":{
                                            "content" : "Enter the destination IP address for the log messages."
                                         },
                                        "label": context.getMessage('destination_ip'),
                                        "placeholder": "",
                                        "error": "Please enter a valid IP address"
                                    },
                                    {
                                        "element_number": true,
                                        "id": "port_number",
                                        "name": "port_number",
                                        "label": context.getMessage('port_number'),
                                        "max_value":"65535",
                                        "placeholder": "",
                                        "field-help":{
                                            "content" : "Enter the port number of the syslog server."
                                        },
                                        "error": "Please enter a valid Port Number(0 to 65535)",
                                        "required": true
                                    },
                                    {
                                        "element_dropdown": true,
                                        "id": "protocol",
                                        "name": "protocol",
                                        "required": true,
                                        "field-help":{
                                            "content" : "Select the protocol either TCP or UDP, to which the syslog is forwarded."
                                        },
                                        "label": context.getMessage('protocol'),
                                        "values": [
                                            {
                                                "label": "Select an option",
                                                "value": ""
                                            },
                                            {
                                                "label": "TCP",
                                                "value": "tcp"
                                            },
                                            {
                                                "label": "UDP",
                                                "value": "udp"
                                            }
                                        ]
                                    },{},{},{}
                                 
                              ]

                          }
                      ],
                "buttonsAlignedRight": true,
                "buttons": [                   
                    {
                        "id": "general-settings-save",
                        "name": "general-settings-save",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "general-settings-cancel",
                    "value": context.getMessage("cancel")
                }
       };
    };
  };   
    return Configuration;
});