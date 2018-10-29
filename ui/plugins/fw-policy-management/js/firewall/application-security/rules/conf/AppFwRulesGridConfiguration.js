/**
 * A configuration object with the parameters required to build a Grid widget for application firewall rules
 */


define(['../../../../../../base-policy-management/js/policy-management/rules/conf/baseRulesGridConfiguration.js',
    'text!../../templates/actionTemplate.html'],
    function (BaseRuleGridConfiguration,actionTemplate) {
        var AppFwRuleGridConf = function (context, ruleCollection, policyManagementConstants) {
            this.initialize(context, ruleCollection, policyManagementConstants);
        }

        _.extend(AppFwRuleGridConf.prototype, BaseRuleGridConfiguration.prototype, {

            //defined by each grid
            tableId: 'appfwRuleGrid',

            //defined to get the i18n title for grid
            gridTitleString: 'appfw_policyRulesGrid_title',

            tableHeight: 450,

            editRow: {},

          isRowEditable: function(rowId){
            var me=this, recordCollection = me.ruleCollection,
                rule = recordCollection.get(rowId);
            if(rule.get("is-leaf") === false)
              return false;
            return true;
          },


          // Latest structure for flat rules
            getColumnConfiguration: function (policyName) {
                var me = this,
                    context = me.context,
                    ruleCollection = me.ruleCollection;

                return [
                    {
                        "index": me.policyManagementConstants.JSON_ID,
                        "name": me.policyManagementConstants.JSON_ID,
                        "hidden": true,
                        "width": 50
                    },
                    {
                        "index": "disabled",
                        "name": "disabled",
                        "hidden": true,
                        "showInactive": "true"
                    }, 
                    {
                          "index": "icons",
                          "name":  "icons",
                          "label": "",
                          "width": 30,
                          "sortable": false,
                          "formatter": $.proxy(me.formatIconsCell, me),
                          "fixed": true,
                          'resizable': false
                    },
                    {
                        "index": "serial-number",
                        "name": "serial-number",
                        "classes": "rule-grid-group-object",
                        "label": context.getMessage("appfw_policyRulesGrid_column_serialNumber"),
                        "width": 50,
                        "sortable": false,
                        "formatter": $.proxy(me.formatSerialNumberCell, me),
                        "fixed": true,
                        'resizable': false
                    },
                    {

                        "name": "name",
                        "label": context.getMessage("appfw_grid_column_name"),
                        "width": 300,
                        "hideHeader": "true",
                        required: true,
                        "sortable": false,
                        "formatter": $.proxy(me.formatNameCell, me),
                        "unformat": function (cellValue, options, rowObject) {
                            return cellValue;
                        },
                        "searchCell": true
                    },


                    {
                        "index": "appSigs",
                        "name": "app-sigs.reference",
                        "label": context.getMessage("appfw_policyRulesGrid_column_applicationSignature"),
                        "width": 300,
                        "sortable": false,
                        "collapseContent": {
                            "name": "name",
                            "formatCell": function (cell, cellvalue, options, rowObject) {
                                if (rowObject && cellvalue && rowObject['app-sigs'] === true) {
                                    var formattedCell = '';
                                    $(cell).each(function (i, ele) {
                                        formattedCell += $(ele).addClass('lineThrough')[0].outerHTML
                                    });
                                    cell = formattedCell;
                                }
                                return cell;
                            },
                            "overlaySize": "large"
                        },
                        "searchCell": true
                    },
                    {
                        "index": "appFwEncryption",
                        "name": "encryption",
                        "label": context.getMessage("appfw_policyRulesGrid_column_encryption"),
                        "width": 150,
                        "sortable": false,
                        formatter: $.proxy(function (val, cell) {
                            var me = this,
                            recordCollection = me.ruleCollection,
                            rule = recordCollection.get(cell.rowId);
                            // for rule group do not display encryption value
                            if(rule.get('rule-type') && rule.get('rule-type') === "RULEGROUP"){
                                return "";
                            }else if (val && val  !== 'ANY') {
                                return context.getMessage(val.toLowerCase());
                            }
                            return context.getMessage('editor_anyCheckbox_text');
                        }, me),
                        "searchCell": {
                          "type": 'dropdown',
                          "values":[{
                              "label": context.getMessage('yes'),
                              "value": "yes"
                          },{
                              "label": context.getMessage('no'),
                              "value": "no"
                          }]
                        }
                    },
                    {
                        "index": "appFwRuleAction",
                        "name": "action",
                        "label": context.getMessage("appfw_policyRulesGrid_column_action"),
                        "width": 150,
                        "sortable": false,
                        formatter: $.proxy(function (val, cell) {
                            var me = this,
                            recordCollection = me.ruleCollection,
                            rule = recordCollection.get(cell.rowId);
                            // for rule group do not display encryption value
                            if(rule.get('rule-type') && rule.get('rule-type') === "RULEGROUP"){
                                return "";
                            }else if (val) {
                                var formattedValue = val.toUpperCase(),
                                imgSrc = '/installed_plugins/base-policy-management/images/',
                                img;

                                if (formattedValue === "PERMIT") {
                                    formattedValue = "Permit";
                                    img = 'icon_permit14X14';
                                } else if (formattedValue === "DENY") {
                                    formattedValue = "Deny";
                                    img = 'icon_deny14X14';
                                } else if (formattedValue === "REJECT") {
                                    formattedValue = "Reject";
                                    img = 'icon_reject14X14';
                                } else {
                                    if (!formattedValue)
                                      formattedValue = "";
                                }

                                //setting icons for the actions
                                if (!$.isEmptyObject(formattedValue)) {
                                    var imgIcon = img;

                                    return Slipstream.SDK.Renderer.render(actionTemplate, {"cell-value": formattedValue, "icon": imgIcon, "text": formattedValue});
                                }
                                 
                            }
                            return '-';
                        }, me),
                        "searchCell": {
                          "type": 'dropdown',
                          "values":[{
                              "label": context.getMessage('appfw_grid_column_default_action_permit'),
                              "value": "permit"
                          },{
                              "label": context.getMessage('appfw_grid_column_default_action_deny'),
                              "value": "deny"
                          },{
                              "label": context.getMessage('appfw_grid_column_default_action_reject'),
                              "value": "reject"
                          }]
                        }
                    },
                    {
                        "index": "appFwBlockMessage",
                        "name": "block-message",
                        "label": context.getMessage("app_secure_block_message"),
                        "width": 120,
                        "sortable": false,
                        formatter: $.proxy(function (val, cell) {
                            var me = this,
                            recordCollection = me.ruleCollection,
                            rule = recordCollection.get(cell.rowId);
                            // for rule group do not display encryption value
                            if(rule.get('rule-type') && rule.get('rule-type') === "RULEGROUP"){
                                return "";
                            }else if (val === true) {
                                return context.getMessage('yes');
                            }
                            return context.getMessage('no');
                        }, me),
                        "searchCell": {
                          "type": 'dropdown',
                          "values":[{
                              "label": context.getMessage('yes'),
                              "value": "yes"
                          },{
                              "label": context.getMessage('no'),
                              "value": "no"
                          }]
                        }
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage("appfw_rule_description"),
                        "width": 200,
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "sortable": false
                    }
                ]
            }
        });

        return AppFwRuleGridConf;
    });
