/**
 * A configuration object with the parameters required to build 
 * a grid for Anti-Spam Policies
 *
 * @module antispamGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(RestApiConstants, GridConfigurationConstants) {

    var urlFormatter = function (cellValue, options, rowObject){
        if (typeof cellValue === 'undefined')  return '';
        return '<span data-tooltip=tooltip>'+_.escape(cellValue)+'</span>';
    };

    var Configuration = function(context) {

        this.formatActionObject = function (cellValue, options, rowObject) {
            if (cellValue === 'TAG_SUBJECT')  return context.getMessage('utm_antispam_grid_action_tag_subject');
            if (cellValue === 'TAG_HEADER')  return context.getMessage('utm_antispam_grid_action_tag_header');
            if (cellValue === 'BLOCK_EMAIL')  return context.getMessage('utm_antispam_grid_action_block_email');
            if (cellValue === 'NONE')  return context.getMessage('utm_antispam_grid_action_none');
            if (typeof cellValue === 'undefined')  return '';
        };
        this.getValues = function() {

            return {
                "title": context.getMessage('utm_antispam_grid_title'),
                "title-help": {
                    "content": context.getMessage('utm_antispam_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("UTM_ANTISPAM_PROFILE_CREATING")
                },
                "tableId": "antispam-profiles",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "auto",
                "sorting": [
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "id",
                "url": "/api/juniper/sd/utm-management/anti-spam-profiles",
                "jsonRoot": "anti-spam-profiles.anti-spam-profile",
                "jsonRecords": function(data) {
                    return data['anti-spam-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.utm-management.anti-spam-profile-refs+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('utm_antispam_grid_edit'),
                    "delete": context.getMessage('utm_antispam_grid_delete')
                },
                "filter": {
                    searchUrl: true,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                cellTooltip: function (cellData, renderTooltip){
                    renderTooltip(_.escape(cellData.$cell.context.innerText));
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name')
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "sortable": false,
                        "label": context.getMessage('grid_column_domain')
                    },
                    {
                        "index": "black-list",
                        "name": "black-list",
                        "sortable": false,
                        "label": context.getMessage('utm_antispam_grid_column_blacklist')
                    },
                    {
                        "index": "default-action",
                        "name": "default-action",
                        "sortable": false,
                        "label": context.getMessage('utm_antispam_grid_column_action'),
                        "formatter": this.formatActionObject
                    },
                    {
                        "index": "tag-string",
                        "name": "tag-string",
                        "sortable": false,
                        "formatter":urlFormatter,
                        "label": context.getMessage('utm_antispam_grid_column_custom_tag')
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "sortable": false,
                        "formatter":urlFormatter,
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "label": context.getMessage('grid_column_description')
                    }
                ]
            }
        }
    };

    return Configuration;
});
