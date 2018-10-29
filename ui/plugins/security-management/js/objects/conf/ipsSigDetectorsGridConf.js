/**
 * A configuration object with the parameters required to build
 * a grid for detectors
 *
 * @module ipsSignatureDetectorsGridConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {
    var Configuration = function(context, contextArr, anomalyArr,detectors) {
        var detectorsArr = [];
        var finalDetectors = [];
        var getDetectorsDataByContext = function(){
            var self = this;
            if(detectors != undefined){
                finalDetectors = detectors;
                var k = 1;
                detectors.forEach(function(object) {
                    detectorsArr.push(object);
                    var n = object.lastIndexOf("-");
                    var data = {"platform":object.substr(0,n),"version":object.substr(n+1)};
                    $(self).addRowData(k++, data);
                });
            } else {
                if(contextArr.length == 0 && anomalyArr.length == 0){
                    contextArr.push('stream');
                }            
                var postContextData = {
                    "ips-detectors-context-request":{
                        "contexts": {
                            "context":contextArr
                        }
                    }            
                };            
                $.ajax({
                    url: '/api/juniper/sd/ips-signature-management/ips-signature-detectors',
                    type: 'post',
                    dataType: 'json',
                    headers: {
                       'content-type': 'application/vnd.juniper.sd.ips-signature-management.ips-detectors-context-request+json;version=1;charset=UTF-8',
                       'accept': 'application/vnd.juniper.sd.ips-signature-management.ips-detectors+json;version=1;q=0.01'
                    },
                    data: JSON.stringify(postContextData),
                    success: function(data, status) {
                        var k = 1;
                        if(data['ips-detectors'] && data['ips-detectors']['ips-detector']) {
                            data['ips-detectors']['ips-detector'].forEach(function(object) {
                                detectorsArr.push(object);
                                var n = object.lastIndexOf("-");
                                var data = {"platform":object.substr(0,n),"version":object.substr(n+1)};
                                $(self).addRowData(k++, data);
                            });
                            //$(self).addRow(arr, 'last');
                        }
                        getDetectorsDataByAnomaly(self);
                    },
                    error: function() {
                        console.log("IPS Detectors by Context fetch is failed");
                    }
                });
            }
        };

        var getDetectorsDataByAnomaly = function(gridContext){
            var self = gridContext;
            var postAnomalyData = {
                "ips-detectors-anomaly-request":{
                    "anomalies": {
                        "anomaly":anomalyArr
                    }
                }            
            };            
            $.ajax({
                url: '/api/juniper/sd/ips-signature-management/ips-signature-detectors',
                type: 'post',
                dataType: 'json',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.ips-signature-management.ips-detectors-anomaly-request+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.ips-signature-management.ips-detectors+json;version=1;q=0.01'
                },
                data: JSON.stringify(postAnomalyData),
                success: function(data, status) {
                    var k = detectorsArr.length + 1;
                    if(data['ips-detectors'] && data['ips-detectors']['ips-detector']) {
                        data['ips-detectors']['ips-detector'].forEach(function(object) {
                            if(detectorsArr.indexOf(object) == -1) {
                                var n = object.lastIndexOf("-");
                                var data = {"platform":object.substr(0,n),"version":object.substr(n+1)};
                                $(self).addRowData(k++, data);
                            }
                        });
                    }
                },
                error: function() {
                    console.log("IPS Detectors by Anomaly fetch is failed");
                }
            });
            finalDetectors = detectorsArr;
        };

        this.getDetectors = function(){
            return finalDetectors;
        };

        this.getValues = function() {
            return {
                "tableId": "ips-signature_detectors_list",
                "height": "260px",
                "scroll":"true",
                "getData": getDetectorsDataByContext,
                "columns": [
                    {
                        "index": "platform",
                        "name": "platform",
                        "label": context.getMessage('signature_database_detectors_grid_platform'),
                        "width": 270
                    },
                    {
                        "index": "version",
                        "name": "version",
                        "label": context.getMessage('signature_database_detectors_grid_version'),
                        "width": 270
                    }
                ]
            };
        };
    };

    return Configuration;
});