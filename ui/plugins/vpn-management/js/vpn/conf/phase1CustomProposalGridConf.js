define([
], function(){
    
    var Phase1CustomProposalGridConf = function(context){       
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
            return {
                "title": context.getMessage('vpn_proposal_grid_title'),
                "title-help": {
                    "content": context.getMessage('vpn_proposal_grid_title_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "getData": function(){return "";},
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
                        "index": "dh-group",
                        "name": "dh-group",
                        "label": context.getMessage('vpn_proposal_grid_column_dh-group'),
                        "createdDefaultValue": "group2",
                        "editCell":{
                            "type": "dropdown",
                            "values":[{
                                "label": "Group 1",
                                "value": "group1"
                            },{
                                "label": "Group 2",
                                "value": "group2"
                            },{
                                "label": "Group 5",
                                "value": "group5"
                            },{
                                "label": "Group 14",
                                "value": "group14"
                            },{
                                "label": "Group 19",
                                "value": "group19"
                            },{
                                "label": "Group 20",
                                "value": "group20"
                            },{
                                "label": "Group 24",
                                "value": "group24"
                            }]
                        }
                    },
                    {
                        "index": "authentication-algorithm",
                        "name": "authentication-algorithm",
                        "label": context.getMessage('vpn_proposal_grid_column_authentication'),
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
                                "label": "SHA-256",
                                "value": "sha2_256"
                            },{
                                "label": "SHA-384",
                                "value": "sha3_384"
                            }]
                        }
                    },
                    {
                        "index": "encryption-algorithm",
                        "name": "encryption-algorithm",
                        "label": context.getMessage('vpn_proposal_grid_column_encryption'),
                        "createdDefaultValue": "aes_cbc_128",
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
                    }
                ]

            }
        }        
    };
    return Phase1CustomProposalGridConf;
});