define( [
          'text!../templates/usageLevelPercentage.html',
          'lib/template_renderer/template_renderer'
        ],
    function( UsagePercentageTemplate, RenderTemplate ) {

      var DevicesGridColumnConfig = function( context ) {

        var formatDeviceName = function( cellValue, options, rowObject ){

          if(!cellValue){
            return "";
          }
          
          if(isLsys(rowObject)){
//            $("#lsys_child_" + cellValue).click(function(e) {
//              
//              $searchContainer = context.module.view.$el.find('.search-container');
////              var addToken = { "searchValue": rowObject["root-device-name"] + "_root", "columnName": "name" };
//              var addToken = { "searchValue": rowObject["root-device-name"], "columnName": "name" };
//              $searchContainer.trigger("slipstream-add-token", addToken);            
//              
//            });
            return "<span data-tooltip='" + cellValue + "'>" + cellValue + "<font color='3366cc'> " + rowObject["root-device-name"] + "_root</font>" + "</span>";
          } else if(isRootLsysDevice(rowObject)){
//            $("#lsys_child_" + cellValue).click(function(e) {
//              
//              $searchContainer = context.module.view.$el.find('.search-container');
//              var addToken = { "searchValue": rowObject["root-device-name"], "columnName": "root-device-name" };
//              $searchContainer.trigger("slipstream-add-token", addToken);            
//              
//            });
            return "<span data-tooltip='" + cellValue + "'>" + cellValue + "<font color='3366cc'> " + rowObject["lsys-count"] + " LSYS(s)</font>" + "</span>";
          }
          
          return '<span data-tooltip="' + cellValue + '">' + cellValue + '</span>';
          
        };   
        
        var isLsys = function( rowObject ){

          var isLsys = false;
          if(rowObject["device-type"] == "LSYS"){
            isLsys = true;
          }
          return isLsys;
          
        };
        
        var isRootLsysDevice = function( rowObject ){
          
          var isLsysRoot = false;
          if (rowObject["device-family"] && rowObject["device-family"] != "" && rowObject["device-family"] == "junos-es"
              && rowObject["software-release"] && rowObject["software-release"] != "" && !isLsys(rowObject)) {
            
            var softwareRelease = rowObject["software-release"];
            var deviceReleaseStrArray = softwareRelease.split("R");

            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("W");
            }
            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("I");
            }
            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("X");
            }

            if (deviceReleaseStrArray.length > 1) {
              var majorRelease = deviceReleaseStrArray[0];
              if (majorRelease == 11.2 || majorRelease > 11.2) {
                var dplatform = rowObject["platform"];
                if (dplatform && dplatform != "") {
                  dplatform = dplatform.toLowerCase();
                  if (dplatform == "srx5800" || dplatform == "srx5600" || dplatform == "srx3600" || dplatform == "srx3400")
                    isLsysRoot = true;
                  else if (dplatform == "srx1400" && majorRelease != 11.2)
                    isLsysRoot = true;
                }
              }
            }
          }
          return isLsysRoot;
          
        };
        
        this.formatConnectionStatusColumn = function( cellValue, options, rowObject ) {
          
          if(!cellValue){
            return "";
          }
          
          return '<img id="device_connection_status_' + cellValue + '" width="12px" height="14px" src="/installed_plugins/sd-device-management/images/transparent.png"/> <span>' + cellValue + '</span>';
        };
        
      this.formatLinkConnectionStatusColumn = function( cellValue, options, rowObject ) {
          if(!cellValue || ( !rowObject["device-type"] && rowObject["device-type"] == "LSYS")){
            return "N/A";
          }
          else{
            return '<img id="device_connection_status_' + cellValue + '" width="12px" height="14px" src="/installed_plugins/sd-device-management/images/transparent.png"/> <span>' + cellValue + '</span>';
          }
          };        


        var unformatConnectionStatusColumn = function( cellValue, options, rowObject ) {
         if(!cellValue){
          return "";
         }
            return cellValue.trim();
          };
        
        var formatManagedStatusColumn = function( cellValue, options, rowObject ) {
          
          if(!cellValue){
            return "";
          }
          
          return '<img id="device_managed_status_' + cellValue + '" width="12px" height="14px" src="/installed_plugins/sd-device-management/images/transparent.png"/> <span>' + context.getMessage( cellValue ) + '</span>';
          
        };
        
        var unformatManagedStatusColumn = function( cellValue, options, rowObject ) {
          return cellValue ? cellValue.trim() :"";
        };
        
        this.setStorageTooltipData = function (rowData, rawData, setTooltipDataCallback){          
           var resource="storage";
           tooltipData(rowData, rawData, setTooltipDataCallback,resource);            
        };

        this.setCPUTooltipData = function (rowData, rawData, setTooltipDataCallback){          
           var resource="cpu";
           tooltipData(rowData, rawData, setTooltipDataCallback,resource);            
        }; 

        this.setMemoryTooltipData = function (rowData, rawData, setTooltipDataCallback){          
           var resource="memory";
           tooltipData(rowData, rawData, setTooltipDataCallback,resource);            
        }; 

        this.formatData = function( cellValue, options, rowObject ) {          
          // To return dummy array so that we are able to use collapse content property of slipstream 
          // that requires an array of more than 1 elements
          var valueList = [cellValue,cellValue]; 
          return valueList;
          
        };

        this.formatCellData = function (cell, cellValue, options, rowObject) {
          var self= this,
          utilizationSummary =  [{                
                "utilization-summary": cellValue[0]
              }
            ];      
               
          $(cell[0]).find('.cellContentValue .cellItem').html(formatAsGauge(utilizationSummary[0]));
          $(cell[0]).find('.moreTooltipWrapper .moreTooltip ').html("...");            
            if($(cell[1]).find('.cellContentWrapper .cellContentValue')[0]){
              $(cell[1]).find('.cellContentWrapper .cellContentValue')[0].innerHTML = formatAsGauge(utilizationSummary[0]);
            }                     
                  
          return cell;
        };


        this.formatAssignedServices = function( cellValue, options, rowObject ) {
                

          var valueList = [];
          if(!cellValue || cellValue["assigned-service"].length == 0){
            return "N/A";
          } 
          
          if(!cellValue["assigned-service"].length){
            var service = cellValue["assigned-service"];
            cellValue["assigned-service"] = []
            cellValue["assigned-service"].push(service);
          }
          
          cellValue["assigned-service"].forEach( function( assignedService ) {
            var service = assignedService["name"];
            if(assignedService["version"]){
              service = service + "(v" + assignedService["version"] + ")";
            }
            valueList.push(service);
          } );
          
          return valueList;
        };

        var serviceTypeWithIcon = function(service){
            var serviceName = service.name;
            if(service["version"]){
              serviceName = serviceName + "(v" + service["version"] + ")";
            }
            var serviceType = service["service-type"].toLowerCase();
            var icon_tooltip = "Firewall";
            if (serviceType == 'dcnatpolicy') {
              icon_tooltip = 'NAT';
            } else if (serviceType == 'ipspolicy') {
              icon_tooltip = 'IPS';
            } else if (serviceType == 'ipsecvpn') {
              icon_tooltip = "IPSec VPN";
            }
            return '<span><img id="services_' + service["service-type"] + '" width="14px" height="14px" src="/installed_plugins/sd-device-management/images/transparent.png" class="tooltip" title="' + icon_tooltip  + '"/> <span>'+serviceName+'</span></span>'
        };

        var formatAsGauge = function(service){
            var serviceName = service.name;
            if(service["version"]){
              serviceName = serviceName + "(v" + service["version"] + ")";
            }
            var cellValue =service['utilization-summary'];
             var fullBoxWidth = 10;
          //var deviceStatus = rowObject['connection-status'];
          var deviceStatus = "up";
          var splitWidth, box1 = '', box2 = '', box3 = '', box4 = '', box5 = '';
          var boxGap = '<div class="usage-level-default usage-level-boxgap"></div>';

          box1 = box2 = box3 = box4 = box5 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-zero usage-level-zero-fill', "0" : fullBoxWidth });
          
          if(cellValue > 0 && cellValue <= 20){
            if(deviceStatus = "up")
              box1 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-low-fill', "0" : fullBoxWidth });
            else
              box1 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-low-down-fill', "0" : fullBoxWidth });
          } else if(cellValue > 20 && cellValue <= 40){
            if(deviceStatus == "up")
              box1 = box2 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-low-fill', "0" : fullBoxWidth });
            else
              box1 = box2 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-low-down-fill', "0" : fullBoxWidth });
          } else if(cellValue > 40 && cellValue <= 60){
            if(deviceStatus == "up")
              box1 = box2 = box3 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-low-fill', "0" : fullBoxWidth });
            else
              box1 = box2 = box3 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-low-down-fill', "0" : fullBoxWidth });
          } else if(cellValue > 60 && cellValue <= 80){
            if(deviceStatus == "up")
              box1 = box2 = box3 = box4 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-medium-fill', "0" : fullBoxWidth });
            else
              box1 = box2 = box3 = box4 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-medium-down-fill', "0" : fullBoxWidth });
          } if(cellValue > 80 && cellValue <= 100){
            if(deviceStatus = "up")
              box1 = box2 = box3 = box4 = box5 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-high-fill', "0" : fullBoxWidth });
            else
              box1 = box2 = box3 = box4 = box5 = RenderTemplate(UsagePercentageTemplate, {"1" : 'usage-level-high-down-fill', "0" : fullBoxWidth });
          }
          
          return '<span data-tooltip="' + cellValue + '%">' +  box1 + boxGap + box2 + boxGap + box3 + boxGap + box4 + boxGap + box5+ '</span>';


            
            //return '<span><img id="services_' + service["service-type"] + '" width="14px" height="14px" src="/installed_plugins/sd-device-management/images/transparent.png" class="tooltip" title="' + icon_tooltip  + '"/> <span>'+serviceName+'</span></span>'
        };

        this.formatAssignedServicesCell = function (cell, cellValue, options, rowObject) {
          if(rowObject["assigned-services"] && rowObject["assigned-services"]['assigned-service'] && rowObject["assigned-services"]['assigned-service'].length > 0){
            $(cell[0]).find('.cellContentValue .cellItem').html(serviceTypeWithIcon(rowObject["assigned-services"]['assigned-service'][0]));
            rowObject["assigned-services"]['assigned-service'].forEach( function( assignedService, index ) {
              if($(cell[1]).find('.cellContentWrapper .cellContentValue')[index]){
                $(cell[1]).find('.cellContentWrapper .cellContentValue')[index].innerHTML = serviceTypeWithIcon(assignedService);
              }
            });
            
          }
          return cell;
        };      
        
        
        this.formatPendingServices = function( cellValue, options, rowObject ) {
          
          var valueList = [];
          if(!cellValue || cellValue["published-service"].length == 0){
            return "N/A";
          } 
          
          if(!cellValue["published-service"].length){
            var service = cellValue["published-service"];
            cellValue["published-service"] = []
            cellValue["published-service"].push(service);
          }
          
          cellValue["published-service"].forEach( function( publishedService ) {
            var service = publishedService["name"];
            if(publishedService["version"]){
              service = service + "(v" + publishedService["version"] + ")";
            }
            valueList.push(service);
          } );
          
          return valueList;
        }; 
        
        this.formatPendingServicesCell = function (cell, cellValue, options, rowObject) {
          if(rowObject["pending-services"] && rowObject["pending-services"]['published-service'] && rowObject["pending-services"]['published-service'].length > 0){
            $(cell[0]).find('.cellContentValue .cellItem').html(serviceTypeWithIcon(rowObject["pending-services"]['published-service'][0]));
              if(!$.isArray(cellValue)){
                  cellValue = [cellValue];
              }
            rowObject["pending-services"]['published-service'].forEach( function( publishedService, index ) {
                var cellValueIndex = cellValue.indexOf(publishedService["name"]);
              if(cellValueIndex !== -1 && publishedService['publish-state'] === "DELETED"){
                $(cell[0]).find('.cellContentValue').addClass('lineThrough');
                $($(cell[1]).find('.cellContentWrapper .cellContentValue')[cellValueIndex]).addClass('lineThrough');
              }
              if($(cell[1]).find('.cellContentWrapper .cellContentValue')[index]){
                $(cell[1]).find('.cellContentWrapper .cellContentValue')[index].innerHTML = serviceTypeWithIcon(publishedService);
              }
              
            });
            
          }
          return cell;
        };
        
        this.formatInstalledServices = function( cellValue, options, rowObject ) {
          
          var valueList = [];
          if(!cellValue || cellValue["installed-service"].length == 0){
            return "N/A";
          } 
          
          if(!cellValue["installed-service"].length){
            var service = cellValue["installed-service"];
            cellValue["installed-service"] = []
            cellValue["installed-service"].push(service);
          }
          
          cellValue["installed-service"].forEach( function( installedService ) {
            var service = installedService["name"];
            if(installedService["version"]){
              service = service + "(v" + installedService["version"] + ")";
            }
            valueList.push(service);
          } );
          
          return valueList;
        };

        this.formatInstalledServicesCell = function (cell, cellValue, options, rowObject) {
          if(rowObject["installed-services"] && rowObject["installed-services"]['installed-service'] && rowObject["installed-services"]['installed-service'].length > 0){
            $(cell[0]).find('.cellContentValue .cellItem').html(serviceTypeWithIcon(rowObject["installed-services"]['installed-service'][0]));
            rowObject["installed-services"]['installed-service'].forEach( function( installedService, index ) {
              if($(cell[1]).find('.cellContentWrapper .cellContentValue')[index]){
                $(cell[1]).find('.cellContentWrapper .cellContentValue')[index].innerHTML = serviceTypeWithIcon(installedService);
              }
            });
            
          }
          return cell;
        };
        
        var formatPhysicalInterfaceView = function( cellvalue, options, rowObject ) {
          return "<a id='physical_interface'><font color='3366cc'>View</font></a>";
        };
        
        var formatLogicalInterfaceView = function( cellvalue, options, rowObject ) {
          return "<a id='logical_interface'><font color='3366cc'>View</font></a>";
        };
        
        var formatEnumValues = function( cellvalue, options, rowObject ) {
          
          if(!cellvalue){
            return "";
          }
          
          var value = context.getMessage( cellvalue );
          if(value.indexOf('security-management.') != -1){
            return cellvalue;
          }
          return value;
          
        };
        
        var formatConfigStatusColumn = function( cellValue, options, rowObject ) {
          
          if(!cellValue){
            return "";
          }

          var img = "transparent.png";
          if ( cellValue == "In Sync" || cellValue == "In RMA" )
          {
            img = 'icon_device_managed_status_in_sync.svg';
          }
          else if ( cellValue == "Sync Failed" || cellValue == "Out Of Sync" || cellValue == "Reactivate Failed" )
          {
            img = 'icon_device_managed_status_sync_failed.svg';
          }
          return '<img id="device_managed_status_' + cellValue + '" width="12px" height="14px" src="/installed_plugins/sd-device-management/images/' + img + '"/> <span>' + cellValue + '</span>';
          
        };

        var tooltipData = function(rowData, rawData, setTooltipDataCallback,resource){
          var deviceId = rowData['device-id'];
          $.ajax({
                type: 'GET',
                url: '/api/juniper/sd/device-management/per-component-monitor-data/?device-id='+deviceId+'&resource='+resource,
                headers: {
                 'accept': 'application/vnd.juniper.sd.device-management.per-component-monitor-data+json;version=2;q=0.02'
               },
               success: function(data, status) {
                 console.log(' Devices Found');
                  var arr = data['monitor-data']['component-utilization-summaries'];

                    arr.sort(function (a,b){
                          if(a['utilization-summary'] < b['utilization-summary']){
                                  return 1;
                          }
                           if(a['utilization-summary'] > b['utilization-summary']){
                                  return -1;
                          }
                          return 0;
                                
                  });
                  
                      setTooltipDataCallback(arr, {                       
                          "key": "component-name",
                          "label": {
                            "unformat": "component-name",
                            "formatter": function(currentData){                        

                            var html="",boxLayout,parentClass = "<div class='sd-device-management' style='width:200px;'>";
                            var boxGap = "<div class='usage-level-default usage-level-boxgap'></div>";
                            var boxLowFill = "<div class='usage-level-default usage-level-low-fill' style='width:10px;'></div>";
                            var boxMediumFill = "<div class='usage-level-default usage-level-medium-fill' style='width:10px;'></div>";
                            var boxHighFill = "<div class='usage-level-default usage-level-high-fill' style='width:10px;'></div>";
                            var boxEmpty = "<div class='usage-level-default usage-level-zero usage-level-zero-fill' style='width:10px;'></div>";

                            if(currentData["utilization-summary"] > 0 && currentData["utilization-summary"] <=20){                       
                              boxLayout = boxLowFill +boxGap + boxEmpty+boxGap +boxEmpty+boxGap +boxEmpty+boxGap +boxEmpty ;

                            }else if(currentData["utilization-summary"] > 20 && currentData["utilization-summary"] <=40){
                              
                              boxLayout = boxLowFill +boxGap + boxLowFill+boxGap +boxEmpty+boxGap +boxEmpty+boxGap +boxEmpty ;

                            }else if(currentData["utilization-summary"] > 40 && currentData["utilization-summary"] <=60){

                             boxLayout = boxLowFill +boxGap + boxLowFill+boxGap +boxLowFill+boxGap +boxEmpty+boxGap +boxEmpty ;

                            }else if(currentData["utilization-summary"] > 60 && currentData["utilization-summary"] <=80){

                              boxLayout = boxMediumFill +boxGap + boxMediumFill+boxGap +boxMediumFill+boxGap +boxMediumFill+boxGap +boxEmpty ;

                            }else if(currentData["utilization-summary"] > 80 && currentData["utilization-summary"] <=100){

                              boxLayout = boxHighFill +boxGap + boxHighFill+boxGap +boxHighFill+boxGap +boxHighFill+boxGap +boxHighFill ;
                            } 
                            else{                              
                              boxLayout = boxEmpty +boxGap + boxEmpty+boxGap +boxEmpty+boxGap +boxEmpty+boxGap +boxEmpty ;
                            }                         
                            html = parentClass + "<div style='width:55%;float:left;'>" + currentData["component-name"] + "</div> " + "<div style='width:45%;float:right;'>" + boxLayout +  "  " + currentData["utilization-summary"] + "  %" + "</div></div>";                      
                          
                          return html ;                   
                          }
                        }
                          
                      });

               },
               error: function() {
                   console.log('No Devices Found');
               }
            });

        };       
       
        
        var formatMatchingSchema = function (cellValue, options, rowObject) {
          if(!cellValue){
            return "";
          }
          return '<span data-tooltip="' + cellValue + '">' + cellValue + '</span>';
        };
        
        var formatNAT = function (cellValue, options, rowObject) {
        	if(cellValue == undefined || cellValue == null) {
        		return "";
        	} 
        	
        	if(cellValue == "true" || cellValue == true) {
        		return "External";
        	} else {
        		return "Internal"
        	}
        	
        };
        
        var formatDate = function (cellValue, options, rowObject) {
          
          if(!cellValue){
            return "";
          }
          
          var date = new Date( cellValue );
          var formatedDate = date.toString( );
          var index = formatedDate.indexOf( "GMT" );
          var count = formatedDate.lastIndexOf( "(" ) - index;
          if ( index != undefined && count != undefined && count >= 0 )
          {
            var gmt = formatedDate.substr( index, count );
            formatedDate = formatedDate.replace( gmt, "" );
          }

          return '<span data-tooltip="' + formatedDate + '">' + formatedDate + '</span>';
        };

        this.getValues = function( ) {

          return [
            {
              "index": "id",
              "name": "id",
              "hidden": true
            },
            {
              "index": "device-id",
              "name": "device-id",
              "hidden": true
            },
            {
              "index": "name",
              "name": "name",
              "label": context.getMessage( 'devices_grid_column_name' ),
              "width": 180,
              "formatter": formatDeviceName,
              "searchCell": true
            },
            {
              "index": "device-ip",
              "name": "device-ip",
              "label": context.getMessage( 'devices_grid_column_device_ip' ),
              "width": 200,
              "searchCell": true
            },
            {
              "index": "software-release",
              "name": "software-release",
              "label": context.getMessage( 'devices_grid_column_software_release' ),
              "width": 180,
              "searchCell": true
            },
            {
              "index": "matching-schema",
              "name": "matching-schema",
              "formatter":formatMatchingSchema,
              "label": context.getMessage( 'devices_grid_column_matching_schema' ),
              "sortable":false,
              "width": 180
            },
//            {
//              "index": "physical-interface",
//              "name": "physical-interface",
//              "label": context.getMessage( 'devices_grid_column_physical_interface' ),
//              "formatter":formatPhysicalInterfaceView                
//            },
//            {
//              "index": "logical-interface",
//              "name": "logical-interface",
//              "label": context.getMessage( 'devices_grid_column_logical_interface' ),
//              "formatter":formatLogicalInterfaceView                
//            },
//            {
//              "index": "number-of-sessions",
//              "name": "number-of-sessions",
//              "label": context.getMessage( 'devices_grid_column_number_of_sessions' ),
//              "width": 145,
//              "searchCell":{
//                "type": "number"
//              }
//            },
            {
              "index": "cpu",
              "name": "cpu",
              "label": context.getMessage( 'devices_grid_column_cpu' ),
              "width": 70,
              "collapseContent":{
               "formatData": this.formatData,
               "formatCell": this.formatCellData,
               "moreTooltip": this.setCPUTooltipData 
              },
              //"formatter":formatAsGauge,
              "searchCell":{
                "type": "number"
              }
            },
            {
              "index": "storage",
              "name": "storage",
              "label": context.getMessage( 'devices_grid_column_storage' ),
              "width": 70,
              "collapseContent":{
               "formatData": this.formatData,
               "formatCell": this.formatCellData,
               "moreTooltip": this.setStorageTooltipData
              },
              //"formatter":formatAsGauge,
              "searchCell":{
                "type": "number"
              }
            },
            {
              "index": "authentication-status",
              "name": "authentication-status",
              "label": context.getMessage( 'devices_grid_column_authentication_status' ),
              "formatter":formatEnumValues,
              "width": 180,
              "searchCell": {
                "type": 'dropdown',
                "values": [
                           {
                             "label" : context.getMessage( 'CREDENTIAL' ),
                             "value" : context.getMessage( 'CREDENTIAL' )
                           },
                           {
                             "label" : context.getMessage( 'RSA_KEY' ),
                             "value" : context.getMessage( 'RSA_KEY' )
                           },
                           {
                             "label" : context.getMessage( 'KEY_CONFLICT' ),
                             "value" : context.getMessage( 'KEY_CONFLICT' )
                           },
                           {
                             "label" : context.getMessage( 'CREDENTIAL_UNVERIFIED' ),
                             "value" : context.getMessage( 'CREDENTIAL_UNVERIFIED' )
                           },
                           {
                             "label" : context.getMessage( 'RSA_KEY_UNVERIFIED' ),
                             "value" : context.getMessage( 'RSA_KEY_UNVERIFIED' )
                           },
                           {
                             "label" : context.getMessage( 'KEY_CONFLICT_UNVERIFIED' ),
                             "value" : context.getMessage( 'KEY_CONFLICT_UNVERIFIED' )
                           },
                           {
                             "label" : context.getMessage( 'FINGER_PRINT_CONFLICT' ),
                             "value" : context.getMessage( 'FINGER_PRINT_CONFLICT' )
                           },
                           {
                             "label" : context.getMessage( 'NA' ),
                             "value" : context.getMessage( 'NA' )
                           }
                          ]
              }
            },
            {
              "index": "connection-status",
              "name": "connection-status",
              "label": context.getMessage( 'devices_grid_column_connection_status' ),
              "formatter": this.formatConnectionStatusColumn,
              "unformat": unformatConnectionStatusColumn,
              "width": 135,
              "searchCell": {
                "type": 'dropdown',
                "values": [
                           {
                             "label" : "up",
                             "value" : "up"
                           },
                           {
                             "label" : "down",
                             "value" : "down"
                           },
                           {
                             "label" : "NA",
                             "value" : "NA"
                           }
                          ]
              }
            },
            {
              "index": "management-status",
              "name": "management-status",
              "label": context.getMessage( 'devices_grid_column_management_status' ),
              "width": 150,
              "formatter": formatManagedStatusColumn,
              "unformat": unformatManagedStatusColumn,
              "searchCell": {
                "type": 'dropdown',
                "values": [
                           {
                             "label" : context.getMessage( 'MANAGED' ),
                             "value" : "Managed"
                           },
                           {
                             "label" : context.getMessage( 'MANAGED_INSYNC' ),
                             "value" : "In Sync"
                           },
                           {
                             "label" : context.getMessage( 'SD_CHANGED' ),
                             "value" : "SD Changed"
                           },
                           {
                             "label" : context.getMessage( 'DEVICE_CHANGED' ),
                             "value" : "Device Changed"
                           },
                           {
                             "label" : context.getMessage( 'SD_CHANGED_DEVICE_CHANGED' ),
                             "value" : "SD Changed, Device Changed"
                           }
                          ]
              }
            },
            {
              "index": "platform",
              "name": "platform",
              "label": context.getMessage( 'devices_grid_column_platform' ),
              "width": 150,
              "searchCell": true
            },
            {
              "index": "configuration-status",
              "name": "configuration-status",
              "label": context.getMessage( 'devices_grid_column_configurationstate' ),
              "width": 140,
              "formatter": formatConfigStatusColumn,
              "unformat": unformatConnectionStatusColumn,
              "searchCell": {
                "type": 'dropdown',
                "values": [
                           {
                             "label" : "Connecting",
                             "value" : "Connecting"
                           },
                           {
                             "label" : "Undefined",
                             "value" : "Undefined"
                           },
                           {
                             "label" : "Unknown",
                             "value" : "Unknown"
                           },
                           {
                             "label" : "In Sync",
                             "value" : "In Sync"
                           },
                           {
                             "label" : "None",
                             "value" : "None"
                           },
                           {
                             "label" : "Out Of Sync",
                             "value" : "Out Of Sync"
                           },
                           {
                             "label" : "Sync Failed",
                             "value" : "Sync Failed"
                           },
                           {
                             "label" : "Synchronizing",
                             "value" : "Synchronizing"
                           },
                           {
                             "label" : "Space Changed",
                             "value" : "Space Changed"
                           },
                           {
                             "label" : "Device Changed",
                             "value" : "Device Changed"
                           },
                           {
                             "label" : "Space & Device Changed",
                             "value" : "Space & Device Changed"
                           },
                           {
                             "label" : "In RMA",
                             "value" : "In RMA"
                           },
                           {
                             "label" : "Reactivating",
                             "value" : "Reactivating"
                           },
                           {
                             "label" : "Reactivate Failed",
                             "value" : "Reactivate Failed"
                           }
//                           ,
//                           {
//                             "label" : "Unmanaged",
//                             "value" : "Unmanaged"
//                           },
//                           {
//                             "label" : "Waiting for Deployment",
//                             "value" : "Waiting for Deployment"
//                           },
//                           {
//                             "label" : "Modeled",
//                             "value" : "Modeled"
//                           }
                          ]
              }
            },
            {
              "index": "ram",
              "name": "ram",
              "label": context.getMessage( 'devices_grid_column_ram' ),
              "width": 70,
              "collapseContent":{
               "formatData": this.formatData,
               "formatCell": this.formatCellData,
               "moreTooltip": this.setMemoryTooltipData
              },
              //"formatter":formatAsGauge,
              "searchCell":{
                "type": "number"
              }
            },
            {
              "index": "device-family",
              "name": "device-family",
              "label": context.getMessage( 'devices_grid_column_device_family' ),
              "width": 150,
              "searchCell": true
            },
//            {
//              "index": "cc-status",
//              "name": "cc-status",
//              "label": context.getMessage( 'devices_grid_column_cc_status' ),
//              "width": 200,
//              "searchCell": true
//            },
            {
              "index": "serial-number",
              "name": "serial-number",
              "label": context.getMessage( 'devices_grid_column_serial_number' ),
              "width": 110,
              "searchCell": true
            },
//            {
//              "index": "alarms",
//              "name": "alarms",
//              "label": context.getMessage( 'devices_grid_column_alarms' ),
//              "width": 150,
//              "searchCell": true
//            },
            {
              "index": "fab-link-status",
              "name": "fab-link-status",
              "label": context.getMessage( 'devices_grid_column_fab_link_status' ),
              "formatter": this.formatLinkConnectionStatusColumn,
              "unformat": unformatConnectionStatusColumn,
              "width": 150,
              "sortable":false,
              "searchCell": {
                "type": 'dropdown',
                "values": [
                           {
                             "label" : "up",
                             "value" : "up"
                           },
                           {
                             "label" : "down",
                             "value" : "down"
                           }
                          ]
              }
            },
            {
              "index": "ctrl-link-status",
              "name": "ctrl-link-status",
              "label": context.getMessage( 'devices_grid_column_control_link_status' ),
              "formatter": this.formatLinkConnectionStatusColumn,
              "unformat": unformatConnectionStatusColumn,
              "width": 150,
              "sortable":false,
              "searchCell": {
                "type": 'dropdown',
                "values": [
                           {
                             "label" : "up",
                             "value" : "up"
                           },
                           {
                             "label" : "down",
                             "value" : "down"
                           }
                          ]
              }
            },
            {
              "index": "assigned-services",
              "name": "assigned-services",
              "collapseContent":{
               "formatData": this.formatAssignedServices,
               "formatCell": this.formatAssignedServicesCell
              },
              "label": context.getMessage( 'devices_grid_column_assigned_services' ),
              "width": 150,
              "sortable":false,
              "searchCell": true
            },
            {
              "index": "pending-services",
              "name": "pending-services",
              "collapseContent":{
                "formatData": this.formatPendingServices,
                "formatCell": this.formatPendingServicesCell
               },
              "label": context.getMessage( 'devices_grid_column_pendingservices' ),
              "width": 150,
              "sortable":false,
              "searchCell": true
            },
            {
              "index": "installed-services",
              "name": "installed-services",
              "collapseContent":{
                "formatData": this.formatInstalledServices,
                "formatCell": this.formatInstalledServicesCell
               },
              "label": context.getMessage( 'devices_grid_column_installed_services' ),
              "width": 150,
              "sortable":false,
              "searchCell": true
            },
            {
              "index": "domain-name",
              "name": "domain-name",
              "label": context.getMessage( 'devices_grid_column_domain_name' ),
              "width": 150,
              "sortable":false,
              "searchCell": true
            },
            {
              "index": "last-rebooted-time",
              "name": "last-rebooted-time",
              "formatter": formatDate,
              "label": context.getMessage( 'devices_grid_column_last_reboot_time' ),
              "width": 160,
              "searchCell":{
                "type": "date"
              }
            },
            {
              "index": "connection-type",
              "name": "connection-type",
              "label": context.getMessage( 'devices_grid_column_connection_type' ),
              "width": 160,
              "searchCell": true
            },
            {
              "index": "use-nat",
              "name": "use-nat",
              "label": context.getMessage( 'devices_grid_column_device_network' ),
              "width": 160,
              "sortable":false,
              "formatter": formatNAT
            },
            {
              "index": "domain-id",
              "name": "domain-id",
              "label": false,
              "hidden": true
            },
            {
              "index": "cluster",
              "name": "cluster",
              "hidden": true
            },
            {
              "index": "root-device-name",
              "name": "root-device-name",
              "hidden": true
            },
            {
              "index": "device-type",
              "name": "device-type",
              "hidden": true
            },
            {
              "index": "redundancy-group-status",
              "name": "redundancy-group-status",
              "hidden": true
            }
          ];
        };
      };

      return DevicesGridColumnConfig;

    } );
