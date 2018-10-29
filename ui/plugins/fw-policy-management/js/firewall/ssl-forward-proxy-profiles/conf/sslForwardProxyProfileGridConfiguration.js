/**
 * A configuration object with the parameters required to build 
 * a grid for sslForwardProxyProfile
 *
 * @module sslForwardProxyProfileGridConfiguration
 * @author nadeem@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../../ui-common/js/common/restApiConstants.js',
'../constants/sslFpConstants.js',
'../../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (RestApiConstants, SslFpConstants, GridConfigurationConstants) {

    var Configuration = function(context) {

    var formatEnableDisableTypeObject = function(cellValue, options, rowObject) {
          if(cellValue){
              return  context.getMessage("enabled");
          }
          return context.getMessage("disabled");
     },
     formatIgnoreTypeObject = function(cellValue, options, rowObject) {
        if(cellValue){
           return  context.getMessage("ssl_forward_proxy_policy_ignore");
        }
        return context.getMessage("ssl_forward_proxy_policy_dont_ignore");
     },
        formatEnableDisableTypeSessionResumption = function(cellValue, options, rowObject) {
            if(!cellValue){
                return  context.getMessage("enabled");
            }
            return context.getMessage("disabled");
        },
   /**
     *  format address object before display of the address 
     *  @params cell 
     *  @paramscellValue
     *  @paramsoptions
     *  @paramsrowObject
     *  returns address names string
     */
     formatMultipleValueObject = function (cell, cellValue, options, rowObject) {
        if (rowObject || cellValue ) {
            var formattedCell = '';
            $(cell).each(function (i, ele) {
              formattedCell += $(ele)[0].outerHTML;
            });
            cell = formattedCell;
        }
      return cell;
    },
    formatTextFirstLetterCapital = function(cell, cellValue, options, rowObject){
        if(!cell){
            return "None";
        } else{
            return cell.substr(0, 1).toUpperCase() + cell.substr(1);
        }
    };

    this.getValues = function() {

            return {
                "title": context.getMessage('sslForwardProxyProfile_grid_title'),
                "title-help": {
                    "content": context.getMessage('sslForwardProxyProfile_grid_tooltip'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_SSL_PROXY_CREATING")
                },
                "tableId": "sslForwardProxyProfiles_root_certificates",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": GridConfigurationConstants.TABLE_HEIGHT,
                "sorting": [
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "onSelectAll": false,
                "repeatItems": "false",
                "multiselect": "true",
                "scroll": true,
                "url": SslFpConstants.SSL_FP_FETCH_URL,
                "jsonRoot": SslFpConstants.SSL_FP_JSON_ROOT,
                "jsonId": "id",
                "jsonRecords": function(data) {
                    return data['ssl-forward-proxy-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": SslFpConstants.SSL_FP_FETCH_ACCEPT_HEADER
                    }
                },
                "filter-help": {
                    "content": context.getMessage("ssl_forward_proxy_policy_search"),
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                },
                "filter": {
                    searchUrl: true
                },
                "contextMenu": {
                    "edit": context.getMessage('sslForwardProxyProfile_grid_edit'),
                    "delete": context.getMessage('sslForwardProxyProfile_grid_delete'),
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("sslForwardProxyProfile_grid_confDialogue_delete_title"),
                        question: context.getMessage("sslForwardProxyProfile_grid_confDialogue_delete_question")
                    }
                },
                "columns": [
                    {
                        "id": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 186
                    },
                    {
                        "index": "preferred-cipher",
                        "name": "preferred-cipher",
                        "label": context.getMessage('sslForwardProxyProfile_grid_column_preferredCipher'),
                        "width": 120,
                        "sortable": false,
                        "formatter": formatTextFirstLetterCapital
                    },
                    {
                        "index": "custom-ciphers.custom-cipher",
                        "name": "custom-ciphers.custom-cipher",
                        "label": context.getMessage('sslForwardProxyProfile_grid_column_customCiphers'),
                        "width": 186,
                        "sortable": false,
                        "collapseContent": {
                            "name": "",
                            "formatCell": formatMultipleValueObject,
                            "overlaySize": "large"
                        }
                    },
                    {
                        "index": "is-flow-tracing",
                        "name": "is-flow-tracing",
                        "label": context.getMessage('sslForwardProxyProfile_grid_column_flowTracing'),
                        "width": 100,
                        "sortable": false,
                        "formatter": formatEnableDisableTypeObject
                    },
                    {
                        "index": "exempted-addresses.address-reference",
                        "name": "exempted-addresses.address-reference",
                        "label": context.getMessage('sslForwardProxyProfile_grid_column_exempetedAddress'),
                        "width": 186,
                        "sortable": false,
                        "collapseContent": {
                            "name": "name",
                            "formatCell": formatMultipleValueObject,
                            "overlaySize": "large"
                        }
                    },
                    {
                        "index": "ignore-server-auth-failure",
                        "name": "ignore-server-auth-failure",
                        "label": context.getMessage('sslForwardProxyProfile_grid_column_serverAuthFailure'),
                        "width": 130,
                        "sortable": false,
                        "formatter": formatIgnoreTypeObject
                    },
                    {
                        "index": "disable-session-resumption",
                        "name": "disable-session-resumption",
                        "label": context.getMessage('sslForwardProxyProfile_grid_column_sessionResumption'),
                        "width": 140,
                        "sortable": false,
                        "formatter": formatEnableDisableTypeSessionResumption
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "sortable": false,
                        "label": context.getMessage('grid_column_domain'),
                        "width": 186
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "sortable": false,
                        "label": context.getMessage('grid_column_description'),
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "width": 186
                    }
                ]
            }
        }
    };

    return Configuration;
});
