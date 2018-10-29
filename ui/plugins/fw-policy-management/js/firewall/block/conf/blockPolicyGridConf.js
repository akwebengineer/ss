/**
 * A configuration object with the parameters required to build a Grid widget for Change list on firewall policies
 *
 */

define([
    '../../policies/constants/fwPolicyManagementConstants.js',
    '../../policies/conf/firewallPolicyGridConfiguration.js'
], function (FWPolicyManagementConstants, FwGridConf) {

    var fwBlockPolicyGridConfiguration = function (context, collection, policyManagementConstants, showRulesColumn) {
        this.initialize(context, collection, policyManagementConstants);
        this.showRulesColumn = showRulesColumn;
    };

    _.extend(fwBlockPolicyGridConfiguration.prototype, FwGridConf.prototype, {

        tableId: 'block_policies_grid',

        // title string and help not required
        gridTitleHelp : undefined,
        gridTitleString: undefined,

        // selection not required
        multiselect: undefined,
        tableHeight: '500px',

        /**
         * Handles formatting of name cell
         * @param cellValue
         * @param options
         * @param rowObject
         * @returns {*}
         */
        formatNameCell : function (cellValue, options, rowObject) {
            var me = this,policy=me.getPolicyRecord(rowObject.id);
            if (me.isGroupNode(rowObject)) {
                return "";
            }
            /**
             * rowObject.id,
             "cellValue": policy.get('name'),
             "id":"ruleLink",
             "launchWizard":false
             */
            return '<a id="blockAppLink" class="cellLink" data-policy-obj="' + rowObject.id +'" >' +
                policy.get("name") +'</a>';
        },
        /**
         * Handles formatting of changed rules
         */
        formatChangesRuleCell: function (cellValue, options, rowObject) {
            var me = this, policy, colStrArr = [], changeList, len, ruleText;
            if (me.isGroupNode(rowObject)) {
                return "";
            }

            // get policy object
            policy = me.getPolicyRecord(rowObject.id);


            // get chnage list
            changeList = policy.get('change-list');

            if (!changeList || !changeList['rule-change-list']) {
                // In case no rule change list avaiable, return
                return "";
            }

            changeList = changeList['rule-change-list'];

            // Add added rules
            len = changeList['added-rules']['added-rule'].length;
            if (len > 0) {
                ruleText = len > 1 ? ' Rules Added' : ' Rule Added';
                colStrArr.push(len + ruleText);
            }

            // Add modified rules count
            len = changeList['modified-rules']['modified-rule'].length;
            if (len > 0) {
                ruleText = len > 1 ? ' Rules Modified' : ' Rule Modified';
                colStrArr.push(len + ruleText);
            }

            // Add deleted rules count
            len = changeList['deleted-rules']['deleted-rule'].length;
            if (len > 0) {
                ruleText = len > 1 ? ' Rules Deleted' : ' Rule Deleted';
                colStrArr.push(len + ruleText);
            }

            if (!colStrArr.length) {
                colStrArr.push('-');
            }

            return '<a id="blockAppLink" class="cellLink" data-policy-obj="' + rowObject.id + '" >' +
                colStrArr.join(', ') + '</a>';
        },

        /**
         * Overrides colum configurations
         * @returns {*[]}
         */
        getColumnConfiguration : function() {
            var me = this, context = this.context, columns;
            columns = [
                {
                    "index": "id",
                    "name": "id",
                    "hidden": true,
                    "width": 50
                },
                {
                    "index": "icons",
                    "name":  "icons",
                    "label": "",
                    "width": 30,
                    "formatter": $.proxy(me.formatIconsCell, me),
                    "fixed": true

                },
                {
                    "index": "sequenceNumber",
                    "name": "sequence-number",
                    "classes": "rule-grid-group-object",
                    "label": context.getMessage("rulesGrid_column_serialNumber"),
                    "width": 20,
                    "formatter": $.proxy(me.formatSequenceNumberCell, me),
                    "sortable":false
                },
                {
                    "index": "name",
                    "name": "name",
                    "hideHeader": true,
                    "label": context.getMessage("grid_column_name"),
                    "width": 150,
                    "searchCell": false,
                    "formatter": $.proxy(me.formatNameCell, me),
                    "sortable": false
                },
                {
                    "index": "rules",
                    "name": "rules",
                    "label": context.getMessage("rulesGrid_column_rulesChanges"),
                    "width": 200,
                    hidden: !me.showRulesColumn,
                    "searchCell": false,
                    "formatter": $.proxy(me.formatChangesRuleCell, me),
                    "sortable": false
                },
                {
                    "index":"devices",
                    "name" : "device-count",
                    "label": context.getMessage("grid_column_devices"),
                    "width": 100,
                    "formatter" : $.proxy(me.formatDeviceCountCell,me),
                    "searchCell": false,
                    "sortable":false
                },
                {
                    "index": "domain",
                    "name": "domain-name",
                    "label": context.getMessage('grid_column_domain'),
                    "width": 80,
                    "formatter" : $.proxy(me.formatDomainNameCell,me),
                    "sortable":false

                }
            ];
            return columns;
        }
    });

    return fwBlockPolicyGridConfiguration;
});
