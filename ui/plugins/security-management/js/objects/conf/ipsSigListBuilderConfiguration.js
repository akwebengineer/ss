/**
 * A configuration object with the parameters required to build 
 * a list builder for ipssig
 *
 * @module IPSSigConfiguration
 * @author Damodhar M<mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
'../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {

    var Configuration = function(context) {
        this.getValues = function(listBuilderModel) {
            return {
                "availableElements": {
                    "url": listBuilderModel.getAvailableUrl(),
                    "jsonRoot": "ips-signatures.ips-signature",
                    "totalRecords": "ips-signatures." + RestApiConstants.TOTAL_PROPERTY
                },
                "selectedElements": {
                    "url": listBuilderModel.getSelectedUrl(),
                    "jsonRoot": "ips-signatures.ips-signature",
                    "totalRecords": "ips-signatures."+ RestApiConstants.TOTAL_PROPERTY,
                    "hideSearchOptionMenu": true
                },
                "search": {
                    "url": function (currentPara, value){
                        console.log(value);
                        if (_.isArray(value)){
                            return _.extend(currentPara, {searchKey:value.join(' '), searchAll:true});
                        }else{
                            return _.extend(currentPara, {searchKey:value, searchAll:true});
                        }
                    }
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01'
                    }
                },
                "sorting": [{
                    "column": "name",
                    "order": "asc"
                }],
                "pageSize": 50,
                "id": "address",
                "jsonId": "id",
                "height": '200px',
                "columns": [
                {
                    "index": "id",
                    "name": "id",
                    "hidden": true
                }, {
                    "index": "name",
                    "name": "name",
                    "label": "Name",
                    "width": 100
                }, {
                    "index": "domain-name",
                    "name": "domain-name",
                    "label": "Domain",
                    "width": 100
                }]
            };
        };
    };

    return Configuration;
});
