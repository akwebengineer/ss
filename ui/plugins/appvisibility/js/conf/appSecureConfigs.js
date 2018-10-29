/**
 *  A configuration object for App Visibility
 *  
 *  @module Configuration
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
], function () {

    var Configuration = function(context) {
        var me=this;
        this.getErrorDescription = function(errorCode){
            return context.getMessage(errorCode);
        };
        //converts bytes to closest unit
        this.convertBytesToClosestUnit = function(volumeInBytes){
            var i = -1;
            var byteUnits = [' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
            do {
                volumeInBytes = volumeInBytes / 1024;
                i++;
            } while (volumeInBytes > 1024);
            return volumeInBytes.toFixed(2).toLocaleString() + byteUnits[i];
        };
        //

        this.getColorCodes = function(){
            return {
                "risk-level":{
                    "critical":{
                        "color":"#B72841",
                        "display":"Critical",
                        "text-color": "#FFFFFF"
                    },
                    "high":{
                        "color": "#FF3333",
                        "display": "High",
                        "text-color": "#FFFFFF"
                    },
                    "unsafe":{
                        "color":"#FF9933",
                        "display": "Un Safe",
                        "text-color": "#000000"
                    },
                    "moderate":{
                        "color": "#FEC240",
                        "display": "Moderate",
                        "text-color": "#000000"
                    },
                    "low":{
                        "color":"#FFEA81",
                        "display":"Low",
                        "text-color": "#000000"
                    },
                    "unknown":{
                        "color": "#bce3e5",
                        "display": "Unknown",
                        "text-color": "#000000"
                    },
                    "null":{
                        "color": "#bce3e5",
                        "display": "NULL",
                        "text-color": "#000000"
                    }
                },
                "category":{
                    "behavioral":{
                        "color":"#54479B",
                        "display":"Behavioral",
                        "text-color": "#FFFFFF"
                    },
                    "gaming": {
                        "color": "#814798",
                        "display": "Gaming",
                        "text-color": "#FFFFFF"
                    },
                    "infrastructure": {
                        "color": "#A763A5",
                        "display": "Infrastructure",
                        "text-color": "#FFFFFF"
                    },
                    "p2p": {
                        "color": "#c7a0ca",
                        "display": "P2P",
                        "text-color": "#000000"
                    },
                    "remote-access":{
                        "color": "#ebd0e4",
                        "display": "Remote Access",
                        "text-color": "#000000"
                    },
                    "social networking":{
                        "color": "#567cbe",
                        "display": "Social Networking",
                        "text-color": "#000000"
                    },
                    "web":{
                        "color": "#6198d0",
                        "display": "Web",
                        "text-color": "#FFFFFF"
                    },
                    "multimedia":{
                        "color": "#95c1e7",
                        "display": "MultiMedia",
                        "text-color": "#000000"
                    },
                    "messaging":{
                        "color": "#F48B38",
                        "display": "Messaging",
                        "text-color": "#000000"
                    },
                    "unknown":{
                        "color": "#bce3e5",
                        "display": "Unknown",
                        "text-color": "#000000"
                    },
                    "null":{
                        "color": "#bce3e5",
                        "display": "NULL",
                        "text-color": "#000000"
                    }
                },
                "characteristics":{
                    "bandwidth consumer": {
                        "color": "#54479b",
                        "display": "Bandwidth Consumer",
                        "text-color": "#FFFFFF"
                    },
                    "loss of productivity": {
                        "color": "#814598",
                        "display": "Loss Of Productivity",
                        "text-color": "#000000"
                    },
                    "supports file transfer": {
                        "color": "#a763a5",
                        "display": "Supports File Transfer",
                        "text-color": "#FFFFFF"
                    },
                    "can leak information": {
                        "color": "#c7a0ca",
                        "display": "Can Leak Information",
                        "text-color": "#FFFFFF"
                    },
                    "known vulnerabilities": {
                        "color": "#ebd0e4",
                        "display": "Known Vulnerabilities",
                        "text-color": "#FFFFFF"
                    },
                    "prone to misuse": {
                        "color": "#567cbe",
                        "display": "Prone to misuse",
                        "text-color": "#FFFFFF"
                    },
                    "evasive":{
                        "color": "#6198d0",
                        "display": "Evasive",
                        "text-color": "#FFFFFF"
                    },
                    "unknown":{
                        "color": "#bce3e5",
                        "display": "Un known",
                        "text-color": "#000000"
                    },
                    "null":{
                        "color": "#bce3e5",
                        "display": "NULL",
                        "text-color": "#000000"
                    }
                }
            };
        };
        //
        this.getColorCodeByData = function(){
            return{"data": [{
                    "id": 0,
                    "text": "Risk"
                },{
                    "id": 1,
                    "text": "Categories"
                }/*, {
                    "id": 2,
                    "text": "Characteristic"
                }*/]
            }
        };
        this.getConfigsForTopAppsByCharacteristics = function(groupBy){
            var yAxisTitle;
            //
            groupBy = groupBy || "0";
            yAxisTitle = groupBy === "0" ? context.getMessage("app_secure_top_apps_by_characteristic_y_axis_title_count") : context.getMessage("app_secure_top_apps_by_characteristic_y_axis_title_volume");
            //
            return{
                //title: context.getMessage("app_secure_top_apps_by_characteristic_title"),
                type: 'bar',
                //width:650,
                height:300
                //xAxisTitle: context.getMessage("app_secure_top_apps_by_characteristic_x_axis_title"),
                //yAxisTitle: yAxisTitle
                //categories: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5', '192.168.1.6', '192.168.1.7', '192.168.1.8', '192.168.1.9', '192.168.1.10'],
                //tooltip: ['hostname-1', 'hostname-2', 'hostname-3', 'hostname-4', 'hostname-5', 'hostname-6', 'hostname-7', 'hostname-8', 'hostname-9' ,'hostname-10'],
                //data: [88, 81, 75, 73, 72, 63, 39, 32, 21, 1]                   
            }
        };
        //
        this.getConfigsForTopAppsByCategory = function(groupBy){
            var yAxisTitle;
            //
            groupBy = groupBy || "0";
            yAxisTitle = groupBy === "0" ? context.getMessage("app_secure_top_apps_by_characteristic_y_axis_title_count") : context.getMessage("app_secure_top_apps_by_characteristic_y_axis_title_volume");
            //
            return{
                //title: context.getMessage("app_secure_top_apps_by_category_title"),
                type: 'bar',
                //width:650,
                height:300
                //xAxisTitle: context.getMessage('app_secure_top_apps_by_category_x_axis_title'),
                //yAxisTitle: yAxisTitle
            }
        };
        //
        this.getGroupByFilterData = function(){
            return{"data": [{
                    "id": 0,
                    "text": "Bandwidth"
                },{
                    "id": 1,
                    "text": "Number of Sessions"
                }/*, {
                    "id": 2,
                    "text": "Number of Blocks"
                }, {
                    "id": 3,
                    "text": "Number of Users"
                }*/]
            }
        };
        //
        this.getTimeSpanData = function(){
            var timeSpanData=[],
                currentTime = new Date().getTime();
            //
            timeSpanData =[{
                            "id": "0",
                            "text": context.getMessage("app_vis_last_15_min")
                        }, {
                            "id": "1",
                            "text": context.getMessage("app_vis_last_30_min")
                        }, {
                            "id": "2",
                            "text": context.getMessage("app_vis_last_45_min")
                        }, {
                            "id": "3",
                            "text": context.getMessage("app_vis_last_1_hr")
                        }, {
                            "id": "4",
                            "text": context.getMessage("app_vis_last_4_hr")
                        }, {
                            "id": "5",
                            "text": context.getMessage("app_vis_last_8_hr")
                        }, {
                            "id": "6",
                            "text": context.getMessage("app_vis_last_12_hr")
                        }, {
                            "id": "7",
                            "text": context.getMessage("app_vis_last_1_d")
                        }, {
                            "id": "8",
                            "text": context.getMessage("app_vis_custom")
                        }]

            return timeSpanData;
        }
        //
        this.getSelectedGroupBy = function(selectedVal){
            var me=this,
                returnObj;
            switch(selectedVal){
                case "0":
                    returnObj = {
                        "url": "/volume"
                    };
                    break;
                case "1":
                    returnObj = {
                        "url": "/session-count"
                    };
                    break;
                case "2":
                    returnObj = {
                        "url": "/deny"
                    };
                    break;
                case "3":
                    returnObj = {
                        "url": "/user"
                    };
                    break;
                default:
                    returnObj = {
                        "url": "/session-count"
                    };
                    break;
            }
            return returnObj;
        };
        //
        /**
        *returns the time stamp based on the selection.
        *If nothing selected, passes 15 minutes as default time
        */
        this.getSelectedTime = function(selectedVal){
            //
            var me=this,
                time={"startTime":0, "endTime":0},
                selectedTimeOption = selectedVal;
            //
            time.endTime = new Date().setSeconds(0);
            time.isCustom = false;
            //
            switch(selectedTimeOption){
                case "0":
                    time.startTime = time.endTime - (15 * 60000);
                    break;
                case "1":
                    time.startTime = time.endTime - (30 * 60000);
                    break;
                case "2":
                    time.startTime = time.endTime - (45 * 60000);
                    break;
                case "3"://1 hour
                    time.startTime = time.endTime - (60 * 1 * 60000);
                    break;
                case "4"://4 hours
                    time.startTime = time.endTime - (60 * 4 * 60000);
                    break;
                case "5"://8 hours
                    time.startTime = time.endTime - (60 * 8 * 60000);
                    break;
                case "6"://12 hours
                    time.startTime = time.endTime - (60 * 12 * 60000);
                    break;
                case "7"://24 hours
                    time.startTime = time.endTime - (60 * 24 * 60000);
                    break;
                case "8"://custom
                    time.startTime = time.endTime;
                    time.isCustom = true;
                    break;
                default:
                    time.startTime = time.endTime - (15 * 60000);
            }
            return time;
        };

        this.showRiskLevel = function(cellValue) {
            return "<div class='risk-level " + (cellValue !== "" ? cellValue : "unknown") + "'></div>";
        };

        this.formatObject = function(cellValue, options, rowObject) {
            var userString = cellValue, len, value = rowObject.name;
            if(cellValue !== undefined){
                len = cellValue.length;
                if(len){
                    userString = cellValue[0].name +  (len > 1 ? " + " + (len-1) : "");
                } else {
                    userString = cellValue.name;
                }
            }
            return me.hasUserJumped ? userString : '<a class="app-vis-jump-to-link" data-cell="'+value+'">'+userString+'</a>';           
        };

        var formatName = function (cellvalue, options, rowObject){
            return '<div class="tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</div>';
        };
        //
        var formatAppCharacteristics = function (cellvalue, options, rowObject){
            return '<div class="tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</div>';
        };
        //
        var formatSessionCount = function(cellvalue, options, rowObject){
            var rowObjectName = rowObject.name,
                rowObjectNameType = rowObject["name-type"];
            return '<a class="appVis-grid-sessionJump" data-nametype="' + rowObjectNameType + '" data-cell="' + rowObjectName + '">' + cellvalue + '</a>';
        };
        //
        this.getDeviceConfig = function(selectedDevicesIDs){
            var getAvailableDevices,
                getSelectedDevices;
            //
            //selectedDevicesIDs = "134479,131080";
            selectedDevicesIDs = selectedDevicesIDs || "";
            //
            getAvailableDevices = function(){
                var self = this;
                $.ajax({
                    "url": "/api/juniper/sd/device-management/devices",
                    //url: '../../../appvisibility/js/conf/devices.json',
                    beforeSend:function(xhr){
                        xhr.setRequestHeader("Accept", "application/vnd.juniper.sd.device-management.devices-extended+json;q=0.01;version=2");
                    },
                    complete: function(data, status){
                        if(data.responseJSON.devices.device){
                            var data = data.responseJSON.devices.device,
                                availableDevicesArray=[];
                            data.forEach(function(element){
                                if(selectedDevicesIDs !== "" && selectedDevicesIDs.indexOf(element.id) < 0){
                                    availableDevicesArray.push(element);
                                }
                            });
                            $(self).addRowData('id', availableDevicesArray);
                        }
                    }
                });
            };            
            //
            getSelectedDevices = function(){
                var self = this;
                $.ajax({
                    "url": "/api/juniper/sd/device-management/devices",
                    //url: '../../../appvisibility/js/conf/devices.json',
                    beforeSend:function(xhr){
                        xhr.setRequestHeader("Accept", "application/vnd.juniper.sd.device-management.devices-extended+json;q=0.01;version=2");
                    },
                    complete: function(data, status){
                        if(data.responseJSON.devices.device){
                            var data = data.responseJSON.devices.device,
                                selectedDevicesArray=[];
                            data.forEach(function(element){
                                if(selectedDevicesIDs === "" || selectedDevicesIDs.indexOf(element.id) > -1){
                                    selectedDevicesArray.push(element);
                                }
                            });
                            $(self).addRowData('id', selectedDevicesArray);
                        }
                    }
                });
            };
            //
            return {
                "availableElements": {
                    //app vis back end is not supporting /available-devices
                    //"url": "/api/juniper/sd/device-management/devices",
                    //"url": "../../../appvisibility/js/conf/devices.json",
                    //"jsonRoot": "devices.device",
                    //"totalRecords": "devices.total",
                    "getData": getAvailableDevices
                },
                "selectedElements": {
                    //app vis back end is not supporting /selected-devices
                    "getData": getSelectedDevices
                },
                /*
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.device-management.devices-extended+json;q=0.01;version=2'
                    }
                },*/
                "search": {
                    "columns": "name"
                },                
                "sorting": [{
                    "column": "name",
                    "order": "asc"
                }],
                "loadonce": true,
                "pageSize": 10,
                "id": "Visibility-devices",
                "jsonId": "id",
                "height": '150px',
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
                    "index": "device-ip",
                    "name": "device-ip",
                    "label": "Device IP",
                    "width": 100
                }]
            };
        };
        this.getUserVisGridConfig = function(time, selectedDeviceIDs, hasUserJumped,clearAllTokens) {
            var url = "/api/juniper/appvisibility/application-statistics/source?source-param=userName&start-time=" + time.startTime + "&end-time=" + time.endTime;
            url = url + (selectedDeviceIDs !== "" ? "&device-ids=" + selectedDeviceIDs : "");
            me.hasUserJumped = hasUserJumped;            
            return {
                //define getData as a closure to get me as a reference!
                "tableId":"user_visibility_grid",
                "numberOfRows":50,
                "sortorder": "desc",
                "sortname": "",
                "scroll": "true",
                "height": 'auto',        
                "multiselect": me.hasUserJumped  ,
                "repeatItems": "false",  
                "url": url,
                "type": 'GET',
                "jsonId": "user-id",
                "singleselect": !(me.hasUserJumped) ,
                "onSelectAll":false,
                "ajaxOptions": {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                },
                "jsonRoot": "response.result",
                "jsonRecords": function(data) {
                    return data['response']['total-records'];
                },
                "filter": {
                    searchUrl: function (value, url){
                        
                       return url + "?filterx=" + value + "&start-time=" + time.startTime +"&end-time=" + time.endTime;
                   },
                   onClearAllTokens:function(){
                        console.log("cleared the tokens");
                        clearAllTokens();
                   } 
                },
                "sorting": [{
                    "column":"volume",
                    "order": "desc"
                }],
                
                "contextMenu":{
                    //"quickView": "Detail View"
                },
                "actionButtons":{
                    "customButtons":[{
                        "button_type": true,
                        "label": "Block User",
                        "key": "blockUserEvent",
                        "disabledStatus" : true                       
                    }]
                },
                "columns": [{
                    "index":"user-id",
                    "name":"user-id",
                    "label": "user-id",
                    "hidden": true
                },{
                    "index":"name-type",
                    "name":"name-type",
                    "label": "name-type",
                    "hidden": true                    
                },{
                    "index":"name",
                    "name":"name",
                    "formatter": formatName,
                    "unformat": function (cellValue, options, rowObject) {
                        return cellValue;
                    },
                    "label":context.getMessage("user_vis_grid_column_name"),
                    "width":"200px"
                }, {
                    "index":"volume",
                    "name":"volume",
                    "label":context.getMessage("app_vis_grid_column_volume"),
                    "width":"100px",
                    "formatter":this.convertBytesToClosestUnit
                },{
                    "index":"session-count",
                    "name":"session-count",
                    "label":context.getMessage("app_vis_grid_column_total_sessions"),
                    "width":"125px",
                    "formatter": formatSessionCount,
                    "unformat": function (cellValue, options, rowObject) {
                        return cellValue;
                    }
                }, {
                    "index":"applications",
                    "name":"applications",
                    "formatter": this.formatObject,
                    "label":context.getMessage("app_vis_grid_column_applications"),
                    "sortable": false,
                    "width":"125px"
                }] 
            }
        };
        this.getIpVisGridConfig = function(time, selectedDeviceIDs, hasUserJumped) {
           var url = "/api/juniper/appvisibility/application-statistics/source?source-param=sourceIp&start-time=" + time.startTime + "&end-time=" + time.endTime;
            url = url + (selectedDeviceIDs !== "" ? "&device-ids=" + selectedDeviceIDs : "");
            me.hasUserJumped = hasUserJumped;
            return {
                //define getData as a closure to get me as a reference!
                "tableId":"src_ip_visibility_grid",
                "numberOfRows":50,
                "sortorder": "desc",
                "sortname": "",
                "scroll": "true",
                "height": 'auto',        
                "multiselect": me.hasUserJumped,
                "repeatItems": "false",  
                "url": url,
                "type": 'GET',
                "jsonId": "user-id",
                "singleselect": !(me.hasUserJumped),
                "onSelectAll":false,
                "ajaxOptions": {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                },
                "jsonRoot": "response.result",
                "jsonRecords": function(data) {
                    return data['response']['total-records'];
                },
                "filter": {
                    searchUrl: function (value, url){                       
                       return url + "?filterx=" + value + "&start-time=" + time.startTime +"&end-time=" + time.endTime;
                   }                  
                },
                "sorting": [{
                    "column":"volume",
                    "order": "desc"
                }],
                
                "contextMenu":{
                    //"quickView": "Detail View"
                },
                "actionButtons":{
                    "customButtons":[{
                        "button_type": true,
                        "label": context.getMessage("block_ip_button"),
                        "key": "blockIPEvent",
                        "disabledStatus" : true                       
                    }]
                },
                "columns": [{
                    "index":"name",
                    "name":"name",
                    "formatter": formatName,
                    "unformat": function (cellValue, options, rowObject) {
                        return cellValue;
                    },
                    "label":context.getMessage("source_ip_vis_grid_column_name"),
                    "width":"200px"
                }, {
                    "index":"volume",
                    "name":"volume",
                    "label":context.getMessage("app_vis_grid_column_volume"),
                    "width":"100px",
                    "formatter":this.convertBytesToClosestUnit
                },{
                    "index":"session-count",
                    "name":"session-count",
                    "label":context.getMessage("app_vis_grid_column_total_sessions"),
                    "width":"125px",
                    "formatter": formatSessionCount,
                    "unformat": function (cellValue, options, rowObject) {
                        return cellValue;
                    }
                }, {
                    "index":"applications",
                    "name":"applications",
                    "formatter": this.formatObject,
                    "label":context.getMessage("app_vis_grid_column_applications"),
                    "sortable": false,
                    "width":"125px"
                }] 
            }

        };
        //        
        this.getGridConfig = function(time, selectedDeviceIDs, hasUserJumped,clearAllTokens) {
            var url = '/api/juniper/appvisibility/application-statistics?start-time=' + time.startTime + '&end-time=' + time.endTime;
            url = url + (selectedDeviceIDs !== "" ? "&device-ids=" + selectedDeviceIDs : "");           
            me.hasUserJumped = hasUserJumped;
            return {
                //define getData as a closure to get me as a reference!
                "tableId":"app_visibility_grid",
                "numberOfRows":50,
                "sortorder": "desc",
                "sortname": "",
                "scroll": "true",
                "height": 'auto',        
                "multiselect": me.hasUserJumped,
                "repeatItems": "false",  
                "url": url,
                "type": 'GET',
                "jsonId": "name",
                "singleselect": !(me.hasUserJumped),
                "onSelectAll":false,
                "ajaxOptions": {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                },
                "jsonRoot": "response.result",
                "jsonRecords": function(data) {
                    return data['response']['total-records'];
                },
                "filter": {
                    searchUrl: function (value, url){
                        
                       return url + "?filterx=" + value + "&start-time=" + time.startTime +"&end-time=" + time.endTime;
                   },
                   onClearAllTokens:function(){
                        console.log("cleared the tokens");
                        clearAllTokens();
                   } 
                },
                "sorting": [{
                    "column":"volume",
                    "order": "desc"
                }],
                "contextMenu":{
                    "quickView": "Detail View"
                },
                "actionButtons":{
                    "customButtons":[{
                        "button_type": true,
                        "label": "Block Application",
                        "key": "blockApplicationEvent",
                        "disabledStatus" : true                       
                    }]
                },
                "columns": [{
                    "index":"app-id",
                    "name":"app-id",
                    "label": "app-id",
                    "hidden": true
                }, {
                    "index":"name",
                    "name":"name",
                    "formatter": formatName,
                    "unformat": function (cellValue, options, rowObject) {
                        return cellValue;
                    },
                    "label":context.getMessage("app_vis_grid_column_name"),
                    "width":"200px"
                },{
                    "index":"risk-level",
                    "name":"risk-level",
                    "label":context.getMessage("app_vis_grid_column_risk"),
                    "width":"75px",
                    "formatter": this.showRiskLevel
                },{
                    "index":"users",
                    "name":"users",
                    "label":context.getMessage("app_vis_grid_column_users"),
                    "width":"100px",
                    "formatter": this.formatObject,
                    "sortable": false
                },{
                    "index":"volume",
                    "name":"volume",
                    "label":context.getMessage("app_vis_grid_column_volume"),
                    "width":"100px",
                    "formatter":this.convertBytesToClosestUnit
                },{
                    "index":"session-count",
                    "name":"session-count",
                    "label":context.getMessage("app_vis_grid_column_total_sessions"),
                    "width":"125px",
                    "formatter": formatSessionCount,
                    "unformat": function (cellValue, options, rowObject) {
                        return cellValue;
                    }
                },{
                    "index":"number-of-blocks",
                    "name":"number-of-blocks",
                    "label":context.getMessage("app_vis_grid_column_total_rejects"),
                    "width":"125px"
                },{
                    "index":"category",
                    "name":"category",
                    "label":context.getMessage("app_vis_grid_column_category"),
                    "width":"125px"
                },{
                    "index":"sub-category",
                    "name":"sub-category",
                    "label":context.getMessage("app_vis_grid_column_sub_cat"),
                    "width":"125px"
                }, {
                    "index":"characteristics",
                    "name":"characteristics",
                    "formatter": formatAppCharacteristics,
                    "label":context.getMessage("app_vis_grid_column_char"),
                    "width":"175px"
                }] 
            }
        };

    }
    return Configuration;
});
