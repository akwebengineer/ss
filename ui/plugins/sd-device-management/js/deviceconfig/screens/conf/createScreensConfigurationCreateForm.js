/**
 * Created by ramesha on 11/12/15.
 */
define([],function() {
     var CreateScreensConfiguration = function(context) {

       this.getNamePattern = function(){
            var nameRegex=context.valueObject['name-regex'],pattern,
              nameMinLength=context.valueObject['name-min-length'],
              nameMaxLength=context.valueObject['name-max-length'];
              pattern = nameRegex.substring(0,nameRegex.length-2)+"{"+nameMinLength+","+nameMaxLength+"}"+nameRegex.substring(nameRegex.length-1);
              return pattern;
        }
      this.getDescriptionPattern = function(){
           var descRegex=context.valueObject['description-regex'],pattern,
             descMinLength=context.valueObject['description-min-length'],
             descMaxLength=context.valueObject['description-max-length'];
             pattern = descRegex.substring(0,descRegex.length-2)+"{"+descMinLength+","+descMaxLength+"}"+descRegex.substring(descRegex.length-1);
             return pattern;
       }
        this.getValues = function(configMode) {
          var getScreensHelpKey = function()
           {
               if(configMode.mode == "create"){
                return context.getHelpKey("SECURITY_DEVICES_SCREEN_MODIFYING");
                }
                if(configMode.mode == "edit"){
                return context.getHelpKey("SECURITY_DEVICES_SCREEN_MODIFYING");
                }

           };
            return {
                "title" : "{{add_edit_form_title}}",
                "title-help": {
                        "content": context.getMessage("create_screen_title_help"),
                        "ua-help-text":context.getMessage("more_link"),
                        "ua-help-identifier": getScreensHelpKey
                    },
                "form_id": "sd_device_screen_form",
                "form_name": "sd_device_screen_form",
                "on_overlay": true,
                "sections": [{
                    "heading": context.getMessage("juniper.sd.deviceconfig.screen.form.basic_information"),
                    "section_id": "device_screen_basic_information_id",
                    "section_class": "section_class",
                    "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                    "elements": [{
                          "element_length": true,
                          "name": "name",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.name"),
                          "required": true,
                          "id" :"name",
                          "value": "{{name}}",
                          "pattern": this.getNamePattern,
                          "class":"{{name-hidden}}",
                          "min_length":"{{name-min-length}}",
                          "max_length":"{{name-max-length}}",
                          "error": "Enter a value of length between {{name-min-length}} and {{name-max-length}}",
                          "field-help": {
                               "content": context.getMessage('screen_name_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_textarea": true,
                          "name": "description",
                          "id": "screen-description",
                          "value": "{{description}}",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.description"),
                          "pattern": this.getDescriptionPattern,
                          "class":"{{description-hidden}}",
                          "error": "Enter a value between {{description-min-length}} and {{description-max-length}}",
                          "field-help": {
                               "content": context.getMessage('screen_description_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.alarm_without_drop"),
                          "class":"{{alarm-without-drop-hidden}}",
                          "id": "alarm-without-drop",
                          "values": [{
                              "name": "alarm-without-drop",
                              "label": ""
                           }],
                           "value":"{{alarm-without-drop}}",
                          "field-help": {
                               "content": context.getMessage('screen_alarm_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    }
                    ]
                },
                {
                "heading": context.getMessage("juniper.sd.deviceconfig.screen.form.denial_of_service"),
                "section_id": "device_screen_denial_service_id",
                "section_class": "section_class",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [{
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.land"),
                          "class":"{{tcp/land-hidden}}",
                          "id" : "land",
                          "values": [
                              {
                                  "name": "tcp/land",
                                  "label": ""
                              }
                          ],
                          "value" : "{{land}}",
                          "field-help": {
                               "content": context.getMessage('screen_land_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.tearDrop"),
                          "class":"{{ip/tear-drop-hidden}}",
                          "id" : "tear-drop",
                          "values": [
                              {
                                  "name": "ip/tear-drop",
                                  "label": ""
                              }
                          ] ,
                          "value" : "{{tearDrop}}",
                          "field-help": {
                               "content": context.getMessage('screen_tear_drop_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.fragment"),
                          "class":"{{icmp/fragment-hidden}}",
                          "id" : "fragment",
                          "values": [
                              {
                                  "name": "icmp/fragment",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_fragment_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.pingDeath"),
                          "class":"{{icmp/ping-death-hidden}}",
                          "id" : "ping-death",
                          "values": [
                              {
                                  "name": "icmp/ping-death",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_ping_death_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.large"),
                          "class":"{{icmp/large-hidden}}",
                          "id" : "large",
                          "values": [
                              {
                                  "name": "icmp/large",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_large_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.blockFrag"),
                          "class":"{{ip/block-frag-hidden}}",
                          "id"   : "block-frag",
                          "values": [
                              {
                                  "name": "ip/block-frag",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_block_frag_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.synAckAckProxy"),
                          "class":"{{tcp/syn-ack-ack-proxy-hidden}}",
                          "id"  : "syn-ack-ack-proxy",
                          "values": [
                              {
                                  "name": "tcp/syn-ack-ack-proxy",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_syn_ack_proxy_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_number": true,
                          "id": "syn-ack-ack-proxy_threshold",
                          "name": "tcp/syn-ack-ack-proxy/threshold",
                          "value": "{{tcp/syn-ack-ack-proxy/threshold}}",
                          "class":"{{tcp/syn-ack-ack-proxy/threshold-hidden}}",
                          "label": "",
                          "min_value":"{{tcp/syn-ack-ack-proxy/threshold-min-length}}",
                          "max_value":"{{tcp/syn-ack-ack-proxy/threshold-max-length}}",
                          "error": "Enter a value between {{tcp/syn-ack-ack-proxy/threshold-min-length}} and {{tcp/syn-ack-ack-proxy/threshold-max-length}}"
                    },
                    {
                          "element_checkbox": true,
                          "label": "Winnuke attack Protection",
                          "class":"{{tcp/winnuke-hidden}}",
                          "id": "winnuke",
                          "values": [
                              {
                                  "name": "tcp/winnuke",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_winnuke_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    }
            ]
            },
            {
                "heading": context.getMessage("juniper.sd.deviceconfig.screen.form.anamolies"),
                "section_id": "device_screen_anamolies_id",
                "section_class": "section_class",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.badOption"),
						  "id"  : "bad-option",
                          "class":"{{ip/bad-option-hidden}}",
                          "values": [
                              {
                                  "name": "ip/bad-option",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_bad_option_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.security"),
                          "class":"{{ip/security-option-hidden}}",
						  "id"  : "security-option",
                          "values": [
                              {
                                  "name": "ip/security-option",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_security_option_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.unknownProtocol"),
                          "class":"{{ip/unknown-protocol-hidden}}",
						  "id" : "unknown-protocol",
                          "values": [
                              {
                                  "name": "ip/unknown-protocol",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_unknown_protocol_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.strictSourceRoute"),
                          "class":"{{ip/strict-source-route-option-hidden}}",
                          "id": "strict-source-route-option",
                          "values": [
                              {
                                  "name": "ip/strict-source-route-option",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_strict_source_route_option_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.sourceRoute"),
                          "class":"{{ip/source-route-option-hidden}}",
                          "id": "source-route-option",
                          "values": [
                              {
                                  "name": "ip/source-route-option",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_source_route_option_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.timeStamp"),
                          "id": "timestamp-option",
                          "class":"{{ip/timestamp-option-hidden}}",
                          "values": [
                              {
                                  "name": "ip/timestamp-option",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_timestamp_option_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.stream"),
                          "class":"{{ip/stream-option-hidden}}",
                          "id": "stream-option",
                          "values": [
                              {
                                  "name": "ip/stream-option",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_stream_option_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.looseSource"),
                          "class":"{{ip/loose-source-route-option-hidden}}",
                          "id": "loose-source-route-option",
                          "values": [
                              {
                                  "name": "ip/loose-source-route-option",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_loose_source_route_option_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.recordRoute"),
                          "class":"{{ip/record-route-option-hidden}}",
                          "id": "record-route-option",
                          "values": [
                              {
                                  "name": "ip/record-route-option",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_record_route_option_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                   },
                   {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.synFrag"),
                          "class":"{{tcp/syn-frag-hidden}}",
                          "id": "syn-frag",
                          "values": [
                              {
                                  "name": "tcp/syn-frag",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_syn_frag_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                   },
                   {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.synFin"),
                          "class":"{{tcp/syn-fin-hidden}}",
                          "id": "syn-fin",
                          "values": [
                              {
                                  "name": "tcp/syn-fin",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_syn_fin_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                   },
                   {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.synNoAck"),
                          "class":"{{tcp/fin-no-ack-hidden}}",
                          "id": "fin-no-ack",
                          "values": [
                              {
                                  "name": "tcp/fin-no-ack",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_fin_no_ack_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                   },
                   {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.synNoFlag"),
                          "class":"{{tcp/tcp-no-flag-hidden}}",
                          "id": "tcp-no-flag",
                          "values": [
                              {
                                  "name": "tcp/tcp-no-flag",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                               "content": context.getMessage('screen_tcp_no_flag_field_help'),
                               "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                   }
                ]
            },
            {
                "heading": context.getMessage("juniper.sd.deviceconfig.screen.form.flood_defence"),
                "section_id": "device_screen_flood_defense_id",
                "section_class": "section_class",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                      {
                          "element_number": true,
                          "id": "source-ip-based",
                          "name": "limit-session/source-ip-based",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.limitSource"),
                          "value": "{{source-ip-based}}",
                          "class":"{{limit-session/source-ip-based-hidden}}",
                          "min_value":"{{limit-session/source-ip-based-min-length}}",
                          "max_value":"{{limit-session/source-ip-based-max-length}}",
                          "error": "Enter a value between {{limit-session/source-ip-based-min-length}} and {{limit-session/source-ip-based-max-length}}",
                          "field-help": {
                             "content": context.getMessage('screen_source_ip_based_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_number": true,
                          "name": "limit-session/destination-ip-based",
						  "id": "destination-ip-based",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.limitDestination"),
                          "class":"{{limit-session/destination-ip-based-hidden}}",
                          "value": "{{destination-ip-based}}",
                          "min_value":"{{limit-session/destination-ip-based-min-length}}",
                          "max_value":"{{limit-session/destination-ip-based-max-length}}",
                          "error": "Enter a value between {{limit-session/destination-ip-based-min-length}} and {{limit-session/destination-ip-based-max-length}}",
                          "field-help": {
                             "content": context.getMessage('screen_destination_ip_based_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.icmpFlood"),
                          "class":"{{icmp/flood-hidden}}",
                          "id": "icmp_flood",
                          "values": [
                              {
                                  "name": "icmp/flood",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                             "content": context.getMessage('screen_icmp_flood_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_number": true,
                          "id": "icmp_flood_threshold",
                          "name": "icmp/flood/threshold",
                          "label": "",
                          "class":"{{icmp/flood/threshold-hidden}}",
                          "value": "{{icmp-flood}}",
                          "min_value":"{{icmp/flood/threshold-min-length}}",
                          "max_value":"{{icmp/flood/threshold-max-length}}",
                          "error": "Enter a value between {{icmp/flood/threshold-min-length}} and {{icmp/flood/threshold-max-length}}"
                      },
                      {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.udpFlood"),
                          "class":"{{udp/flood-hidden}}",
                          "id": "udp_flood",
                          "values": [
                              {
                                  "name": "udp/flood",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                             "content": context.getMessage('screen_udp_flood_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_number": true,
                          "id": "udp_flood_threshold",
                          "name": "udp/flood/threshold",
                          "label": "",
                          "class":"{{udp/flood/threshold-hidden}}",
                          "value" : "{{udp-flood}}",
                          "min_value":"{{udp/flood/threshold-min-length}}",
                          "max_value":"{{udp/flood/threshold-max-length}}",
                          "error": "Enter a value between {{udp/flood/threshold-min-length}} and {{udp/flood/threshold-max-length}}"
                       },
                      {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.synFlood"),
                          "class":"{{tcp/syn-flood-hidden}}",
                          "id": "syn-flood",
                          "values": [
                              {
                                  "name": "tcp/syn-flood",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                             "content": context.getMessage('screen_syn_flood_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_number": true,
                          "id": "attack-threshold",
                          "name": "tcp/syn-flood/attack-threshold",
                          "class":"{{tcp/syn-flood/attack-threshold-hidden}}",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.attack"),
                          "value": "{{attack-Threshold}}",
                          "min_value":"{{tcp/syn-flood/attack-threshold-min-length}}",
                          "max_value":"{{tcp/syn-flood/attack-threshold-max-length}}",
                          "error": "Enter a value between {{tcp/syn-flood/attack-threshold-min-length}} and {{tcp/syn-flood/attack-threshold-max-length}}",
                          "field-help": {
                             "content": context.getMessage('screen_attack_flood_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_number": true,
                          "id": "alarm-threshold",
                          "name": "tcp/syn-flood/alarm-threshold",
                          "class":"{{tcp/syn-flood/alarm-threshold-hidden}}",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.alarm"),
                          "value": "{{alarm-Threshold}}",
                          "min_value":"{{tcp/syn-flood/alarm-threshold-min-length}}",
                          "max_value":"{{tcp/syn-flood/alarm-threshold-max-length}}",
                          "error": "Enter a value between {{tcp/syn-flood/alarm-threshold-min-length}} and {{tcp/syn-flood/alarm-threshold-max-length}}",
                          "field-help": {
                             "content": context.getMessage('screen_alarm_flood_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_number": true,
                          "id": "source-threshold",
                          "name": "tcp/syn-flood/source-threshold",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.source"),
                          "class":"{{tcp/syn-flood/source-threshold-hidden}}",
                          "value": "{{source-Threshold}}",
                          "min_value":"{{tcp/syn-flood/source-threshold-min-length}}",
                          "max_value":"{{tcp/syn-flood/source-threshold-max-length}}",
                          "error": "Enter a value between {{tcp/syn-flood/source-threshold-min-length}} and {{tcp/syn-flood/source-threshold-max-length}}",
                          "field-help": {
                             "content": context.getMessage('screen_source_flood_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                     },
                     {
                          "element_number": true,
                          "id": "destination-threshold",
                          "name": "tcp/syn-flood/destination-threshold",
                          "class":"{{tcp/syn-flood/destination-threshold-hidden}}",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.destination"),
                          "value": "{{destination-Threshold}}",
                          "min_value":"{{tcp/syn-flood/destination-threshold-min-length}}",
                          "max_value":"{{tcp/syn-flood/destination-threshold-max-length}}",
                          "error": "Enter a value between {{tcp/syn-flood/destination-threshold-min-length}} and {{tcp/syn-flood/destination-threshold-max-length}}",
                          "field-help": {
                             "content": context.getMessage('screen_destination_flood_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    },
                    {
                          "element_number": true,
                          "id": "timeout",
                          "name": "tcp/syn-flood/timeout",
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.timeout"),
                          "value" :"{{timeout}}",
                          "class":"{{tcp/syn-flood/timeout-hidden}}",
                          "min_value":"{{tcp/syn-flood/timeout-min-length}}",
                          "max_value":"{{tcp/syn-flood/timeout-max-length}}",
                          "error": "Enter a value between {{tcp/syn-flood/timeout-min-length}} and {{tcp/syn-flood/timeout-max-length}}",
                          "field-help": {
                             "content": context.getMessage('screen_timeout_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                    }
                ]
            },
            {
                "heading": context.getMessage("juniper.sd.deviceconfig.screen.form.reconnaissance"),
                "section_id": "devices_screen_reconnaissance_id",
                "section_class": "section_class",
                "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                "elements": [
                      {
                              "element_checkbox": true,
                              "label": context.getMessage("juniper.sd.deviceconfig.screen.form.ipSpoofing"),
                              "class":"{{ip/spoofing-hidden}}",
                              "id": "spoofing",
                              "values": [
                                  {
                                      "name": "ip/spoofing",
                                      "label": ""
                                  }
                              ],
                              "field-help": {
                                 "content": context.getMessage('screen_spoofing_field_help'),
                                 "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                              }
                      },
                      {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.ipSweep"),
                          "class":"{{icmp/ip-sweep-hidden}}",
                          "id": "icmp_ip-sweep",
                          "values": [
                              {
                                  "name": "icmp/ip-sweep",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                             "content": context.getMessage('screen_ip_sweep_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_number": true,
                          "id": "icmp_ip-sweep_threshold",
                          "name": "icmp/ip-sweep/threshold",
                          "label":"",
                          "class":"{{icmp/ip-sweep/threshold-hidden}}",
                          "value" :"{{ipSweepThreshold}}",
                          "min_value":"{{icmp/ip-sweep/threshold-min-length}}",
                          "max_value":"{{icmp/ip-sweep/threshold-max-length}}",
                          "error": "Enter a value between {{icmp/ip-sweep/threshold-min-length}} and {{icmp/ip-sweep/threshold-max-length}}"
                      },
                      {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.tcpSweep"),
                          "class":"{{tcp/tcp-sweep-hidden}}",
                          "id": "tcp-sweep",
                          "values": [
                              {
                                  "name": "tcp/tcp-sweep",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                             "content": context.getMessage('screen_tcp_sweep_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                      },
                      {
                          "element_number": true,
                          "id": "tcp-sweep_threshold",
                          "name": "tcp/tcp-sweep/threshold",
                          "label": "",
                          "class":"{{tcp/tcp-sweep/threshold-hidden}}",
                          "value":"{{tcpSweepThreshold}}",
                          "min_value":"{{tcp/tcp-sweep/threshold-min-length}}",
                          "max_value":"{{tcp/tcp-sweep/threshold-max-length}}",
                          "error": "Enter a value between {{tcp/tcp-sweep/threshold-min-length}} and {{tcp/tcp-sweep/threshold-max-length}}"
                      },
                        {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.udpSweep"),
                          "id": "udp_udp-sweep",
                          "class":"{{udp/udp-sweep-hidden}}",
                          "values": [
                              {
                                  "name": "udp/udp-sweep",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                             "content": context.getMessage('screen_udp_sweep_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                        },
                        {
                          "element_number": true,
                          "id": "udp_udp-sweep_threshold",
                          "name": "udp/udp-sweep/threshold",
                          "label": "",
                          "value": "{{udpSweepThreshold}}",
                          "min_value":"{{udp/udp-sweep/threshold-min-length}}",
                          "class":"{{udp/udp-sweep/threshold-hidden}}",
                          "max_value":"{{udp/udp-sweep/threshold-max-length}}",
                          "error": "Enter a value between {{udp/udp-sweep/threshold-min-length}} and {{udp/udp-sweep/threshold-max-length}}"
                        },
                        {
                          "element_checkbox": true,
                          "label": context.getMessage("juniper.sd.deviceconfig.screen.form.portScan"),
                          "class":"{{tcp/port-scan-hidden}}",
                          "id": "port-scan",
                          "values": [
                              {
                                  "name": "tcp/port-scan",
                                  "label": ""
                              }
                          ],
                          "field-help": {
                             "content": context.getMessage('screen_port_scan_field_help'),
                             "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                          }
                        },
                        {
                          "element_number": true,
                          "id": "port-scan_threshold",
                          "name": "tcp/port-scan/threshold",
                          "class":"{{tcp/port-scan/threshold-hidden}}",
                          "label": "",
                          "value" : "{{portScanThreshold}}",
                          "min_value":"{{tcp/port-scan/threshold-min-length}}",
                          "max_value":"{{tcp/port-scan/threshold-max-length}}",
                          "error": "Enter a value between {{tcp/port-scan/threshold-min-length}} and {{tcp/port-scan/threshold-max-length}}"
                        }
                   ]
            }],
                "buttonsAlignedRight": true,
                "buttonsClass": "buttons_row",
                "cancel_link": {
                    "id": "device-screens-cancel",
                    "value": context.getMessage('cancel_button_label')
                },
                "buttons": [
                {
                    "id": "device-screens-save",
                    "name": "create",
                    "value": context.getMessage('ok_button_label')
                }]
            };
        };
        };
        return CreateScreensConfiguration;
    }
);
