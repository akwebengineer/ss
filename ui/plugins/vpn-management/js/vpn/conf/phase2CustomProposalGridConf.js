define([
], function(){
    
    var Phase2CustomProposalGridConf = function(context){       
        this.getValues= function(){
            formatLifeTimeCell = function (cellValue, options, rowObject) {
                cellValue = "";
                if(rowObject['lifetime'] != "0") {
                    cellValue = rowObject['lifetime'];
                } else {
                    return cellValue;
                }
                return cellValue;
            };
            formatLifeSizeCell = function (cellValue, options, rowObject) {
                cellValue = "";
                if(rowObject['life-size'] != "0") {
                    cellValue = rowObject['life-size'];
                } else {
                    return cellValue;
                }
                return cellValue;
            };
            return {
                "title": context.getMessage('vpn_proposal_grid_title'),
                "title-help": {
                    "content": context.getMessage('vpn_proposal_grid_title_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId":"phase2grid",
                "url": function(){return "";},
                "numberOfRows": 4,
                "multiselect": "true",
                "createRow": {
                  "addLast":true,
                  "showInline": true
               },
               "editRow": {
                  "showInline": true
               },
                "contextMenu": {
                    "edit": "Edit"
                },
                "columns" : [
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage("grid_column_id"),
                        "hidden": true,
                        "width": 200
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "editCell":{
                            "type": "input",
                            /*"pattern-error": [
                                {
                                    "pattern": "length",
                                    "max_length":"32",
                                    "error": "Must be less than 32 characters."
                                },
                                {
                                    "pattern": "hasalphanumericdashunderscore",
                                    "error":"Name must not have spaces, special characters"
                                },
                                {
                                    "pattern": "validtext",
                                    "error": "This field is required"
                                }
                            ]*/
                           "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_]{0,31}$",
                           "error": context.getMessage("custom_proposal_name_error")
                        }
                    },
                    {
                        "index": "authentication-algorithm",
                        "name": "authentication-algorithm",
                        "label": context.getMessage('vpn_proposal_grid_column_authentication'),
                        "class": "phase2-authentication",
                        "createdDefaultValue": "sha_1",
                        "editCell":{
                            "type": "dropdown",
                            "values":[{
                                "label": "MD5",
                                "value": "md5"
                            },{
                                "label": "SHA-1",
                                "value": "sha_1"
                            },{
                                "label": "SHA-256(96)",
                                "value": "hmac_sha_256_96"
                            },{
                                "label": "SHA-256(128)",
                                "value": "hmac_sha_256_128"
                            },{
                                "label": "NONE",
                                "value": "NONE"
                            }]
                        }
                    },
                    {
                        "index": "protocol",
                        "name": "protocol",
                        "label": context.getMessage('vpn_proposal_grid_column_protocol'),
                        "createdDefaultValue": "esp",
                        "editCell":{
                            "type": "dropdown",
                            "values":[{
                                "label": "ESP",
                                "value": "esp"
                            },{
                                "label": "AH",
                                "value": "ah"
                            }]
                        }
                    },
                    {
                        "index": "encryption-algorithm",
                        "name": "encryption-algorithm",
                        "label": context.getMessage('vpn_proposal_grid_column_encryption'),
                        "createdDefaultValue": "aes_cbc_128",
                        "class": "phase2-encryption",
                        "editCell":{
                            "type": "dropdown",
                            "values":[{
                                "label": "DES",
                                "value": "des_cbc"
                            },{
                                "label": "3DES",
                                "value": "triple_des_cbc"
                            },{
                                "label": "AES(128)",
                                "value": "aes_cbc_128"
                            },{
                                "label": "AES(192)",
                                "value": "aes_cbc_192"
                            },{
                                "label": "AES(256)",
                                "value": "aes_cbc_256"
                            },{
                                "label": "AES-GCM(128)",
                                "value": "aes_gcm_128"
                            },{
                                "label": "AES-GCM(192)",
                                "value": "aes_gcm_192"
                            },{
                                "label": "AES-GCM(256)",
                                "value": "aes_gcm_256"
                            },{
                                "label": "NONE",
                                 "value": "NONE"
                            }]
                        }
                    },
                    {
                        "index": "lifetime",
                        "name": "lifetime",
                        "label": "<span title='Life time range is from 180 to 86400'>"+context.getMessage('vpn_proposal_grid_column_life-time')+"</span>",
                        "editCell":{
                            "type": "input",
                            "post_validation": "validLifeTime"
                        },
                        "formatter" : formatLifeTimeCell
                        //default:3600
                    },
                    {
                        "index": "life-size",
                        "name": "life-size",
                        "label": "<span title='Life size range is from 64 to 4294967294'>"+context.getMessage('vpn_proposal_grid_column_life-size')+"</span>",
                        "editCell":{
                            "type": "input",
                            "post_validation": "validLifeSize"
                        },
                        "formatter" : formatLifeSizeCell
                    }
                ]

            }
        }
        
    };
    return Phase2CustomProposalGridConf;
});
