/**
 * Configuration for firewall policy version management
 *
 * @module manageVersionGridConfiguration
 * @author <dkumara@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
'../../../../../ui-common/js/common/restApiConstants.js'
], function(RestApiConstants) {

    var wrapText = function(text, maxlength) {
       var resultText = [""];
        var len = text.length;    
        if (maxlength >= len) {
            return text;
        }
        else {
            var totalStrCount = parseInt(len / maxlength);
            if (len % maxlength !== 0) {
                totalStrCount++ ;
            }

            for (var i = 0; i < totalStrCount; i++) {
                if (i == totalStrCount - 1) {
                    resultText.push(text);
                }
                else {
                    var strPiece = text.substring(0, maxlength - 1);
                    resultText.push(strPiece);
                    resultText.push("<br>");
                    text = text.substring(maxlength - 1, text.length);
                }
            }
        }
        return resultText.join("");
    };

    var formatName = function(cellValue, options, rowObject) {
        if(cellValue !== undefined){
            return wrapText(cellValue, 45);
        } else {
            return '';
        }
    };
    var Configuration = function(context, policyManagementConstants,policyId) {

        this.formatTypeObject = function(cellValue, options, rowObject) {
            if (cellValue === 0) {
                return "Current";
            } else {
                return cellValue;
            }

        };

        // Method to get the Date and Time format
        this.getDateTimeFormat =  function(cellValue, options, rowObject) {
            if(cellValue) {
              return Slipstream.SDK.DateFormatter.format(cellValue, "ddd MMM DD,YYYY h:mm A");
            }
          return "";
        };  

        this.getValues = function() {

            return {

                "tableId": "manageversion_grid",
                "height": "300px",
                "repeatItems": "true",
                "multiselect": "true",
                "footer":false,
                "scroll": true,
                "numberOfRows" :70,
                "url": policyManagementConstants.getManageVersionURLRoot(policyId),
                "jsonRoot": "version-meta-datas.version-meta-data",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    // Add a version 0 explicitly which will be shown as current.
                    var contains = false;
                    for (var i = 0; i < data['version-meta-datas']['version-meta-data'].length; i++) {
                        if (data['version-meta-datas']['version-meta-data'][i]['snapshot-version'] === 0) {
                            contains = true;
                            break;
                        }

                    }
                    if (!contains) {
                        data['version-meta-datas']['version-meta-data'].unshift({
                            'snapshot-version': 0
                        });
                    }
                    // Since a version 0 is added "data['version-meta-datas'][RestApiConstants.TOTAL_PROPERTY]" will not return the
                    // exact size, so returning the total length.
                    return  data['version-meta-datas']['version-meta-data'].length;
                },
                "ajaxOptions": {
                    "headers": {
                        "accept": policyManagementConstants.POLICY_CREATE_SNAPSHOT_ACCEPT_HEADER
                    }
                },
                "contextMenu" : {

                },
                "actionButtons": {
                    "customButtons": [{
                        "button_type": true,
                        "label": context.getMessage('manage_create_snapshot'),
                        "key": "createsnapshotVersion"
                    }, {
                        "button_type": true,
                        "label": context.getMessage('manage_compare'), 
                        "key": "compareVersion"
                    }, {
                        "button_type": true,
                        "label": context.getMessage('manage_rollback'),
                        "key": "managerollback"
                    },
                    {
                        "button_type": true,
                        "label": context.getMessage('action_delete'),
                        "key": "deleteVersion"
                    }]
                },

                "columns": [{
                        "index": "snapshot-version",
                        "name": "snapshot-version",
                        "label": context.getMessage('manage_version'),
                        "width": 50,
                        "formatter": this.formatTypeObject,
                        "sortable":false
                    }, {
                        "index": "created-time",
                        "name": "created-time",
                        "label": context.getMessage('manage_snapshot_date'),
                        "formatter":this.getDateTimeFormat,
                        "width": 100,
                        "sortable":false
                    }, {
                        "index": "created-by-user-name",
                        "name": "created-by-user-name",
                        "label": context.getMessage('manage_user_name'),
                        "width": 75,
                        "sortable":false
                    }, {
                        "index": "comments",
                        "name": "comments",
                        "label": context.getMessage('manage_comment'),
                        "width": 250,
                        "sortable":false,
                        "formatter": formatName
                    }, {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('manage_id'),
                        "width": 150,
                        "hidden": true,
                        "sortable":false
                    }, {
                        "index": "service-id",
                        "name": "service-id",
                        "label": context.getMessage('manage_service-id'),
                        "width": 150,
                        "hidden": true,
                        "sortable":false
                    }


                ]
            };
        };
    };

    return Configuration;

});
