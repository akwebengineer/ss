/**
 *  A configuration object for Event Viewer
 *  
 *  @module EventViewer
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([
'../../../../ui-common/js/common/restApiConstants.js',
  "../../../../ui-common/js/common/utils/filterUtil.js",
  "../service/eventViewerService.js"
], function (RestApiConstants, FilterUtil, EventViewerService) {

    var Configuration = function(context) {
        var AVAILABLE_HEIGHT = 350,
            TOLERANCE = 100,
            filterUtil =  new FilterUtil();

        this.service = new EventViewerService({});

        this.getECMStatusDescription = function(statusCode){
            return context.getMessage(statusCode);
        };
        //
        this.getCustomTimeFormElements = function(){
            return {
                "form_id": "custom_time_form",
                "form_name": "custom_time_form",
                "title":"",
                "sections": [
                    {
                       "elements": [
                        {
                            "element_timeWidget": true,
                            "id": "custom_time_Widget",
                            "name": "custom_time_Widget",
                            "label": "",
                            "placeholder": "",
                            "error": "Please enter a valid time"
                        }]
                    }
                ]
            };
        };

        this.getSummaryInsightEventsList = function(){
            var me = this, key = 'event-type';
            return { "list" : 
            [{
                "eventtype" : "Total Count",
                "query" : []
            },{
                "eventtype" : context.getMessage('ev_summary_insight_virus_instances'),
                "query" : [me.formFilterString(key, 'AV_VIRUS_DETECTED_MT'), me.formFilterString(key, 'AV_VIRUS_DETECTED'), me.formFilterString(key, 'AV_VIRUS_DETECTED_MT_LS'), me.formFilterString(key, 'AV_VIRUS_DETECTED_LS')]
            },{
                "eventtype" : context.getMessage('ev_summary_insight_attacks'),
                "query" : [me.formFilterString(key, 'IDP_ATTACK_LOG_EVENT'), me.formFilterString(key, 'IDP_ATTACK_LOG_EVENT_LS')]
            },{
                "eventtype" : context.getMessage('ev_summary_insight_interface_down'),
                "query" : [me.formFilterString(key, 'SNMP_TRAP_LINK_DOWN')]
            },{
                "eventtype" : context.getMessage('ev_summary_insight_cpu_spikes'),
                "query" : [me.formFilterString(key, 'RTPERF_CPU_THRESHOLD_EXCEEDED')]
            },{
                "eventtype" : context.getMessage('ev_summary_insight_reboots'),
                "query" : [me.formFilterString(key, 'UI_REBOOT_EVENT')]
            },{
                "eventtype" : context.getMessage('ev_summary_insight_sessions'),
                "query" : [me.formFilterString(key, 'RT_FLOW_SESSION_INIT'), me.formFilterString(key, 'RT_FLOW_SESSION_INIT_LS')] 
            }
            ]}
        };

        this.getSavedFiltersContextMenuConfigs = function(){
            return{
                "elements":{
                    "callback":function(key, options){
                        $(this).trigger('seci.eventviewer.' + key);
                    },
                    "trigger":'left',
                    "position": function(opt, x, y){
                        opt.$menu.position({ my: "left top", at: "left bottom", of: this, offset: "0 0"});
                    },
                    "items":[{
                        "label":"Select a Saved Filters",
                        "key":"selectsavedfilters"
                    }]
                },
                "container":'.saved-filters'       
            }
        };
        //
        this.formatFilterString = function(cellValue, options, rowObject){
            var humanReadableString = filterUtil.formatFilterStringToHumanReadableString(cellValue, context);
            return "<div class='tooltip' title='" + humanReadableString + "' data-raw-filter-string='" + cellValue + "'>" + humanReadableString + "</div>";
        };
        //
        this.unFormatFilterString = function(cellvalue, options, rowObject){
            return $($(rowObject).html()).data("raw-filter-string");
        };
        //
        this.formatAggregation = function(cellValue, options, rowObject){
            return "<div data-raw-aggregation='" + cellValue + "'>" + context.getMessage(filterUtil.getUIKey(cellValue)) + "</div>";
        };
        //
        this.unFormatAggregation = function(cellvalue, options, rowObject){
            return $($(rowObject).html()).data("raw-aggregation");
        };
        //

        this.formatAggregation = function(cellValue, options, rowObject){
            return "<div data-raw-aggregation='" + cellValue + "'>" + context.getMessage(filterUtil.getUIKey(cellValue)) + "</div>";
        };
        //
        this.unFormatAggregation = function(cellvalue, options, rowObject){
            return $($(rowObject).html()).data("raw-aggregation");
        };
        //

        this.getSavedFiltersGridConfig = function(){
            var me = this;
            var addToolTip = function (cellvalue, options, rowObject){
                return '<span class="cellLink tooltip" data-tooltip="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</span>';
            };

            return{
                "tableId":"sd_saved_filters_grid_list",
                "numberOfRows":50,
                "scroll": "true",
                "height": "auto",
                "url": '/api/juniper/seci/filter-management/filters/all-filters?skip-empty=true',
                "type": 'GET',
                "singleselect": "true",
                "onSelectAll": false,
                "beforeSendRequest": function (url) {
                  return (url + '&tag=' + me.filterTag);
                },
                "sorting": [
                    {
                    "column": "filter-name",
                    "order": "asc"
                    }
                ],
                "ajaxOptions": {
                    headers: {
                        "Accept": 'application/vnd.juniper.seci.filter-management.event-filter-refs+json;version=1;q=0.01'
                    }
                },
                "jsonRoot": "event-filters.event-filter",
                "jsonRecords": function(data) {
                    if(data != undefined){
                        return data['event-filters'][RestApiConstants.TOTAL_PROPERTY];
                    }
                },
                "filter": {
                   searchUrl : true
                },
                "contextMenu": {},
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('ev_filter_delete_title'),
                        question: context.getMessage('ev_filter_delete_msg')
                    }
                },
                "columns": [{
                    "id": "id",
                    "name": "id",
                    "hidden": true
                },{
                    "index":"filter-name",
                    "name":"filter-name",
                    "label":context.getMessage('ev_filter_name'),
                    "width": 150
                },{
                    "index":"filter-string",
                    "name":"filter-string",
                    "label":context.getMessage('ev_filter_by'),
                    "sortable": false,
                    "width": 250,
                    "formatter": this.formatFilterString,
                    "unformat": this.unFormatFilterString
                },{
                    "index":"created-by-user-name",
                    "name":"created-by-user-name",
                    "label":context.getMessage('ev_created_by'),
                    "sortable": false,
                    "width": 100
                },{
                    "index":"aggregation",
                    "name":"aggregation",
                    "label":context.getMessage('ev_group_by'),
                     "width": 150,
                    "formatter": this.formatAggregation,
                    "unformat": this.unFormatAggregation,
                },{
                    "index":"filter-description",
                    "name":"filter-description",
                    "label":context.getMessage('ev_filter_desc'),
                    "formatter":addToolTip,
                    "width": 150
                },{
                    "index":"last-modified-time",
                    "name":"last-modified-time",
                    "label":context.getMessage('ev_last_modified'),
                    "formatter":this.getDateTimeFormat,
                    "sortable": false,
                    "width": 150
                },{
                    "index":"start-time",
                    "name":"start-time",                   
                    "hidden": true,
                    "label":""
                },{
                    "index":"end-time",
                    "name":"end-time",                   
                    "hidden": true,
                    "label":""
                },{
                   "index":"formatted-filter.filter",
                   "name":"formatted-filter.filter",
                   "hidden": true,
                   "label":""
               }]
            }
        };

        // Method to get the Date and Time format for Show Saved Filters
        this.getDateTimeFormat =  function(cellValue, options, rowObject) {
            return cellValue ? Slipstream.SDK.DateFormatter.format(new Date(cellValue), "llll") : "";
        };
        // Method to get the Days, Hours and Minutes for Save Filters
        this.millisToDaysHoursMinutes = function(ms) {
            return filterUtil.millisToDaysHoursMinutes(ms);
        };
       //
        this.preciseTimeSpan= function(duration_unit, duration) {
            return filterUtil.preciseTimeSpan(duration_unit, duration);
        };
        //
        this.getHistoryGridConfig = function(){
            return {
                "title": context.getMessage('ev_history_manager'),
                "title-help": {
                    "content": context.getMessage('ev_history_manager_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId":"ev_history_grid",
                "numberOfRows":50,
                "scroll": "true",
                "height": '300px',                   
                "sortorder": "asc",
                "sortname": "generated-time",
                "multiselect": false,
                "repeatItems": "false",  
                "url": '/api/juniper/seci/alert-management/alerts',
                "type": 'GET',
                "jsonId": "id",
                "singleselect": "true",
                "ajaxOptions": {
                    headers: {
                        "Accept": 'application/vnd.juniper.seci.alert-management.seci-alerts+json;version=1'
                    }
                },
                "jsonRoot": "alerts.alert",
                "jsonRecords": function(data) {
                    return data['alerts'][RestApiConstants.TOTAL_PROPERTY];
                },
                "columns": [{
                    "index":"Time",
                    "name":"Time",
                    "label":context.getMessage('ev_time'),
                    "width":"200px"
                }, {
                    "index":"aggpoint",
                    "name":"aggpoint",
                    "label":context.getMessage('ev_aggregation_point'),
                    "width":"200px"
                }, {
                    "index":"filterstring",
                    "name":"filterstring",
                    "label":context.getMessage('ev_filter_string'),
                    "width":"300px"
                }, {
                    "index":"reqtime",
                    "name":"reqtime",
                    "label":context.getMessage('ev_requested_time'),
                    "width":"150px"
                }] 
            }
        };
        //
        this.getCategoryMimeType = function(category){
          switch(category){
              case 'ALL EVENTS':
                  return 'vnd.juniper.net.eventlogs.alleventcategories';
                  break;
              case 'FIREWALL':
                  return 'vnd.juniper.net.eventlogs.firewall';
                  break;
              case 'WEB-FILTERING':
                  return "vnd.juniper.net.eventlogs.webfiltering";
                  break;
              case 'VPN':
                  return "vnd.juniper.net.eventlogs.vpn";
                  break;
              case 'CONTENT-FILTERING':
                  return "vnd.juniper.net.eventlogs.contentfiltering";
                  break;
              case 'ANTI-SPAM':
                  return "vnd.juniper.net.eventlogs.antispam";
                  break;
              case 'ANTI-VIRUS':
                  return "vnd.juniper.net.eventlogs.antivirus";
                  break;
              case 'IPS':
                  return "vnd.juniper.net.eventlogs.ips";
                  break;
          }
        };
        //
        this.getIPSSeveritiesColorCodes = function(){
            return {
                "CRITICAL": "#FE573A",
                "HIGH": "#FDAE4C",
                "MEDIUM": "#FAE387",
                "INFO": "#F6F55F",
                "LOW": "#A4D1FB",
            };
        };
        //
        this.getCategoryFilterString = function(category){
          switch(category){
              case 'ALL EVENTS':
                  return 'all';
                  break;
              case 'FIREWALL':
                  return 'firewall';
                  break;
              case 'WEB-FILTERING':
                  return "webfilter";
                  break;
              case 'VPN':
                  return ["vpn", "vpn_cp"];
                  break;
              case 'CONTENT-FILTERING':
                  return "contentfilter";
                  break;
              case 'ANTI-SPAM':
                  return "antispam";
                  break;
              case 'ANTI-VIRUS':
                  return "antivirus";
                  break;
              case 'IPS':
                  return "ips";
                  break;
          }
        };
        //
        this.getCategoryThreatString = function(category){
          switch(category){
            case 'IPS':
                return ["IDP_ATTACK_LOG_EVENT", "IDP_ATTACK_LOG_EVENT_LS"];
                break;
            case 'ANTI-VIRUS':
                return ["AV_VIRUS_DETECTED_MT", "AV_VIRUS_DETECTED"];
                break;
            case 'ANTI-SPAM':
                return ["ANTISPAM_SPAM_DETECTED_MT", "ANTISPAM_SPAM_DETECTED"];
                break;
            case 'ALL EVENTS':
                return ["ANTISPAM_SPAM_DETECTED_MT", "ANTISPAM_SPAM_DETECTED", "AV_VIRUS_DETECTED_MT", "AV_VIRUS_DETECTED", "IDP_ATTACK_LOG_EVENT", "IDP_ATTACK_LOG_EVENT_LS", "IDP_APPDDOS_APP_ATTACK_EVENT", "IDP_APPDDOS_APP_ATTACK_EVENT_LS", "IDP_APPDDOS_APP_STATE_EVENT", "IDP_APPDDOS_APP_STATE_EVENT_LS", "LOGIN_FAILED", "LOGIN_FAILED_LIMIT"];
                break;
          }
        };
        //
        this.getTimeRangeToDisplay = function(timeRange){
          var displayTime="",
              startDate = new Date(timeRange.startTime),
              endDate = new Date(timeRange.endTime);
          //
          if(startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth() && startDate.getYear() === endDate.getYear()){//same date
              displayTime = Slipstream.SDK.DateFormatter.format(timeRange.startTime, "MM-DD-YYYY");
              displayTime = displayTime + "," + " From " + Slipstream.SDK.DateFormatter.format(timeRange.startTime, "HH:mm:ss A")
              displayTime = displayTime + " to " + Slipstream.SDK.DateFormatter.format(timeRange.endTime, "HH:mm:ss A")
          }else{
              displayTime = "From " + Slipstream.SDK.DateFormatter.format(timeRange.startTime, "MM-DD-YYYY HH:mm:ss A") + " to " + Slipstream.SDK.DateFormatter.format(timeRange.endTime, "MM-DD-YYYY HH:mm:ss A");
          };
          //
          return displayTime;
        };
        //
        this.getRequestTime = function(start, end){
            return this.getRequestFormatTimeString(start) + "/" + this.getRequestFormatTimeString(end);
        };
        //
        this.getRequestFormatTimeString = function(date){
            return Slipstream.SDK.DateFormatter.format(date, "YYYY-MM-DDTHH:mm:ss.000Z");
        };
        //
        this.presentTime = new Date();
        //this.presentTime = new Date(this.presentTime.setSeconds(0));
        this.last30MinsTime = new Date(this.presentTime - 7200000/4);
        //this.last30MinsTime = new Date(this.last30MinsTime.setSeconds(0));
        //
        this.logsToView = "50";       //50 by default

        //initially default of last 2 hours will be set
        this.postData = {
            "request":{
                "time-interval": this.getRequestFormatTimeString(this.last30MinsTime) + "/" + this.getRequestFormatTimeString(this.presentTime),
                "size": this.logsToView,
                "resolve-addresses": this.resolveIP,
                "case-sensitive": false
            }            
        };
        
        this.filterData = {
            "filter-id": 0,
            "filter-string": 0
        };
        //
        this.getAggPostData = function(aggPoint, time){
            var aggPostData = {
                "request": {
                    "aggregation":"COUNT",
                    "aggregation-attributes": aggPoint, 
                    "time-interval": time,
                    "size": "10",
                    "order":"ascending",
                    "resolve-addresses":this.resolveIP,
                    "resolve-event-name":false
                }
            };
            return aggPostData;
        };
        //
        this.getEventCategoryDisplayName = function(eventCat){
            switch(eventCat){
              case 'FIREWALL':
                  return context.getMessage("ev_category_firewall");
                  break;
              case 'WEB-FILTERING':
                  return context.getMessage("ev_category_web_filter");
                  break;
              case 'VPN':
                  return context.getMessage("ev_category_vpn");
                  break;
              case 'CONTENT-FILTERING':
                  return context.getMessage("ev_category_content_filtering");
                  break;
              case 'ANTI-SPAM':
                  return context.getMessage("ev_category_anti_spam");
                  break;
              case 'ANTI-VIRUS':
                  return context.getMessage("ev_category_anti_virus");
                  break;
              case 'IPS':
                  return context.getMessage("ev_category_ips");
                  break;
            }
        };
        
        // return columns to be hidden for each category
        this.getCategoryBasedColumns = function(){
          var me = this,
          colsMap = {
            "ALL EVENTS" : [],

            "FIREWALL" : [filterUtil.LC_KEY.THREAT_SEVERITY, filterUtil.LC_KEY.EVENT_CATEGORY, filterUtil.LC_KEY.ATTACK_NAME, filterUtil.LC_KEY.NAME, filterUtil.LC_KEY.REASON, filterUtil.LC_KEY.URL, filterUtil.LC_KEY.OBJECT_NAME, filterUtil.LC_KEY.PATH_NAME, filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME, filterUtil.LC_KEY.PROFILE_NAME],

            "VPN" : [filterUtil.LC_KEY.THREAT_SEVERITY, filterUtil.LC_KEY.EVENT_CATEGORY, filterUtil.LC_KEY.ATTACK_NAME, filterUtil.LC_KEY.NAME, filterUtil.LC_KEY.SOURCE_ADDRESS, filterUtil.LC_KEY.DESTINATION_ADDRESS, filterUtil.LC_KEY.SOURCE_PORT, filterUtil.LC_KEY.NAT_DESTINATION_PORT, filterUtil.LC_KEY.APPLICATION, filterUtil.LC_KEY.USER_NAME, 
                filterUtil.LC_KEY.SERVICE_NAME, filterUtil.LC_KEY.PROTOCOL_ID, filterUtil.LC_KEY.POLICY_NAME, filterUtil.LC_KEY.SOURCE_ZONE_NAME, filterUtil.LC_KEY.DESTINATION_ZONE_NAME, filterUtil.LC_KEY.NESTED_APPLICATION, filterUtil.LC_KEY.ROLES, filterUtil.LC_KEY.REASON, filterUtil.LC_KEY.NAT_SOURCE_PORT, filterUtil.LC_KEY.NAT_DESTINATION_PORT, filterUtil.LC_KEY.NAT_SOURCE_ADDRESS, 
                filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS, filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME, filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME, filterUtil.LC_KEY.URL, filterUtil.LC_KEY.PATH_NAME, filterUtil.LC_KEY.SESSION_ID_32, filterUtil.LC_KEY.OBJECT_NAME, filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME, filterUtil.LC_KEY.PROFILE_NAME, filterUtil.LC_KEY.ACTION, "source-country-code2", "destination-country-code2"],

            "WEB-FILTERING" : [filterUtil.LC_KEY.THREAT_SEVERITY, filterUtil.LC_KEY.EVENT_CATEGORY, filterUtil.LC_KEY.ATTACK_NAME, filterUtil.LC_KEY.APPLICATION, filterUtil.LC_KEY.USER_NAME, filterUtil.LC_KEY.SERVICE_NAME, filterUtil.LC_KEY.PROTOCOL_ID, filterUtil.LC_KEY.POLICY_NAME, filterUtil.LC_KEY.DESTINATION_ZONE_NAME, filterUtil.LC_KEY.NESTED_APPLICATION,
                filterUtil.LC_KEY.NAT_SOURCE_PORT, filterUtil.LC_KEY.NAT_DESTINATION_PORT, filterUtil.LC_KEY.NAT_SOURCE_ADDRESS, filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS, filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME, filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME, filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME, filterUtil.LC_KEY.SESSION_ID_32, filterUtil.LC_KEY.RULE_NAME],

            "CONTENT-FILTERING" : [filterUtil.LC_KEY.THREAT_SEVERITY, filterUtil.LC_KEY.EVENT_CATEGORY, filterUtil.LC_KEY.ATTACK_NAME, filterUtil.LC_KEY.APPLICATION, filterUtil.LC_KEY.USER_NAME, filterUtil.LC_KEY.SERVICE_NAME, filterUtil.LC_KEY.PROTOCOL_ID, filterUtil.LC_KEY.POLICY_NAME, filterUtil.LC_KEY.DESTINATION_ZONE_NAME, filterUtil.LC_KEY.NESTED_APPLICATION, filterUtil.LC_KEY.PATH_NAME,
                filterUtil.LC_KEY.NAT_SOURCE_PORT, filterUtil.LC_KEY.NAT_DESTINATION_PORT, filterUtil.LC_KEY.NAT_SOURCE_ADDRESS, filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS, filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME, filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME, filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME, filterUtil.LC_KEY.SESSION_ID_32, filterUtil.LC_KEY.RULE_NAME, filterUtil.LC_KEY.OBJECT_NAME],

            "ANTI-SPAM" : [filterUtil.LC_KEY.THREAT_SEVERITY, filterUtil.LC_KEY.EVENT_CATEGORY, filterUtil.LC_KEY.ATTACK_NAME, filterUtil.LC_KEY.APPLICATION, filterUtil.LC_KEY.USER_NAME, filterUtil.LC_KEY.SERVICE_NAME, filterUtil.LC_KEY.PROTOCOL_ID, filterUtil.LC_KEY.POLICY_NAME, filterUtil.LC_KEY.DESTINATION_ZONE_NAME, filterUtil.LC_KEY.NESTED_APPLICATION, filterUtil.LC_KEY.PATH_NAME,
                filterUtil.LC_KEY.NAT_SOURCE_PORT, filterUtil.LC_KEY.NAT_DESTINATION_PORT, filterUtil.LC_KEY.NAT_SOURCE_ADDRESS, filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS, filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME, filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME, filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME, filterUtil.LC_KEY.SESSION_ID_32, filterUtil.LC_KEY.RULE_NAME, filterUtil.LC_KEY.OBJECT_NAME],

            "ANTI-VIRUS" : [filterUtil.LC_KEY.THREAT_SEVERITY, filterUtil.LC_KEY.EVENT_CATEGORY, filterUtil.LC_KEY.APPLICATION, filterUtil.LC_KEY.USER_NAME, filterUtil.LC_KEY.SERVICE_NAME, filterUtil.LC_KEY.PROTOCOL_ID, filterUtil.LC_KEY.POLICY_NAME, filterUtil.LC_KEY.DESTINATION_ZONE_NAME, filterUtil.LC_KEY.NESTED_APPLICATION, filterUtil.LC_KEY.NAT_SOURCE_PORT,
                filterUtil.LC_KEY.NAT_DESTINATION_PORT, filterUtil.LC_KEY.NAT_SOURCE_ADDRESS, filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS, filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME, filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME, filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME, filterUtil.LC_KEY.SESSION_ID_32, filterUtil.LC_KEY.RULE_NAME, filterUtil.LC_KEY.OBJECT_NAME, filterUtil.LC_KEY.PATH_NAME],

            "IPS" : [filterUtil.LC_KEY.EVENT_CATEGORY, filterUtil.LC_KEY.NAME, filterUtil.LC_KEY.USER_NAME, filterUtil.LC_KEY.ROLES, filterUtil.LC_KEY.REASON, filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME, filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME, filterUtil.LC_KEY.URL, filterUtil.LC_KEY.PATH_NAME, filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME, filterUtil.LC_KEY.SESSION_ID_32, filterUtil.LC_KEY.OBJECT_NAME, filterUtil.LC_KEY.PROFILE_NAME]
          };
          return colsMap[me.category];
        };
        //
        this.getOperatorString = function(operator){
            switch(operator){
              case '=':
                  return 'EQUALS';
                  break;
              case '!=':
                  return 'NOT_EQUALS';
                  break;
              case 'EQUALS':
                  return 'EQUALS';
                  break;
              case 'NOT_EQUALS':
                  return 'NOT_EQUALS';
                  break;
            }
        };
        //
        this.formFilterString = function(key, value, operator){
            operStr = "EQUALS";
            if(operator){
              operStr = this.getOperatorString(operator);
            }
            return {
                "filter" : {
                    "key": key,
                    "operator": operStr,
                    "value": value
                }
            };
        };
        //
        this.replaceEquals = function(filterStr){
            var str = filterStr;
            if(filterStr.indexOf(" equals ") != -1){
                str = filterStr.replace(" equals ", " = ");
            }
            if(filterStr.indexOf(" Equals ") != -1){
                str = filterStr.replace(" Equals ", " = ");
            }
            if(filterStr.indexOf(" EQUALS ") != -1){
                str = filterStr.replace(" EQUALS ", " = ");
            }
            if(filterStr.indexOf(" not_equals ") != -1){
                str = filterStr.replace(" not_equals ", " != ");
            }
            if(filterStr.indexOf(" Not_Equals ") != -1){
                str = filterStr.replace(" Not_Equals ", " != ");
            }
            if(filterStr.indexOf(" NOT_EQUALS ") != -1){
                str = filterStr.replace(" NOT_EQUALS ", " != ");
            }
            return str;
        };
        //
        this.getFilterTokens = function(filterString){
            var orFilterList, andFilterList, filterTokens = [], tmpTokens = [];
            andFilterList = filterString.split("AND");
            for(var i = 0; i < andFilterList.length; i++){
                orFilterList = andFilterList[i].split("OR");
                tmpTokens = [];
                for(var j = 0; j < orFilterList.length; j++){
                    orFilterList[j] = this.trimValues(orFilterList[j]);
                    orFilterList[j] = this.replaceEquals(orFilterList[j]);
                    tmpTokens.push(orFilterList[j]);
                    if(j != orFilterList.length - 1){
                        tmpTokens.push("OR");
                    }
                }
                for(var k = 0; k < tmpTokens.length; k++){
                    tmpTokens[k] = this.trimValues(tmpTokens[k]);
                    tmpTokens[k] = this.replaceEquals(tmpTokens[k]);
                    filterTokens.push(tmpTokens[k]);
                }
                if(i != andFilterList.length - 1){
                    filterTokens.push("AND");
                }
            }
            return filterTokens;
        };
        //
        this.getAndOrFilters = function(filterObj){
            var ANDfilters, ORfilters;
            if(filterObj.and && filterObj.and.length > 0 && filterObj.and.length <=2 && (filterObj.and[0].and || filterObj.and[0].or)){
                if(filterObj.and.length == 1){
                    ANDfilters = filterObj.and[0].and;
                    ORfilters = filterObj.and[0].or
                } else {
                    ANDfilters = filterObj.and[0].and || filterObj.and[1].and;
                    ORfilters = filterObj.and[1].or || filterObj.and[0].or;
                }
            } else if(filterObj.or && filterObj.or.length > 0 && filterObj.or.length <=2 && (filterObj.or[0].and || filterObj.or[0].or)){
                if(filterObj.or.length == 1){
                    ANDfilters = filterObj.or[0].and;
                    ORfilters = filterObj.or[0].or
                } else {
                    ANDfilters = filterObj.or[0].and || filterObj.or[1].and;
                    ORfilters = filterObj.or[1].or || filterObj.or[0].or;
                }
            } else {
                ANDfilters = filterObj.and;
                ORfilters = filterObj.or;
            }

            if(filterObj.and && !ANDfilters && !ORfilters && filterObj.and.length > 0){ //single OR filter or single AND filter
                ANDfilters = filterObj.and;
                ORfilters = filterObj.or;
            }
            if(filterObj.or && !ORfilters && !ANDfilters && filterObj.or.length > 0){
                ORfilters = filterObj.or;
            }
            return [ANDfilters, ORfilters];
        };
        //
        this.getFilterList = function(filterObj, getTokensToAdd, otherFilters){
            var i, filterStr, filterList = [], andFilterList = [], orFilterList = [], otherFilterList = [], ANDfiltersLen, ORfiltersLen, ANDfilters, ORfilters;

            if(filterObj.and && filterObj.and.length > 0 && filterObj.and.length <=2 && (filterObj.and[0].and || filterObj.and[0].or)){
                if(filterObj.and.length == 1){
                    ANDfilters = filterObj.and[0].and;
                    ORfilters = filterObj.and[0].or
                } else {
                    ANDfilters = filterObj.and[0].and || filterObj.and[1].and;
                    ORfilters = filterObj.and[1].or || filterObj.and[0].or;
                }
            } else if(filterObj.or && filterObj.or.length > 0 && filterObj.or.length <=2 && (filterObj.or[0].and || filterObj.or[0].or)){
                if(filterObj.or.length == 1){
                    ANDfilters = filterObj.or[0].and;
                    ORfilters = filterObj.or[0].or
                } else {
                    ANDfilters = filterObj.or[0].and || filterObj.or[1].and;
                    ORfilters = filterObj.or[1].or || filterObj.or[0].or;
                }
            } else {
                ANDfilters = filterObj.and;
                ORfilters = filterObj.or;
            }

            if(filterObj.and && !ANDfilters && !ORfilters && filterObj.and.length > 0){ //single OR filter or single AND filter
                ANDfilters = filterObj.and;
                ORfilters = filterObj.or;
            }
            if(filterObj.or && !ORfilters && !ANDfilters && filterObj.or.length > 0){
                ORfilters = filterObj.or;
            }

            if(filterObj.filter || (filterObj.and && filterObj.and[0] && filterObj.and[0].and && filterObj.and[0].filter) || (filterObj.and && filterObj.and[1] && filterObj.and[1].and && filterObj.and[1].filter)){
                var criteria = filterObj.filter;
                if(filterObj.and && filterObj.and[0].and && filterObj.and[0].filter){
                    criteria = filterObj.and[0].filter;
                }
                if(filterObj.and && filterObj.and[1].and && filterObj.and[1].filter){
                    criteria = filterObj.and[1].filter
                }
                var filter = {
                    "filter" : criteria
                }
                ANDfilters = filter;
            }
                    
            if(ANDfilters)
                ANDfiltersLen = ANDfilters.length;
            if(ORfilters)
                ORfiltersLen = ORfilters.length;

            if(ANDfiltersLen){
                for(i = 0; i < ANDfiltersLen; i++){
                    if(ANDfilters[i].filter){
                        if(i != 0){
                            filterList.push("AND");
                        }
                        operator = this.getOpertorForString(ANDfilters[i].filter.operator);
                        filterStr = ANDfilters[i].filter.key + operator + ANDfilters[i].filter.value;
                        andFilterList.push(this.formFilterString(ANDfilters[i].filter.key, ANDfilters[i].filter.value, operator));
                        filterList.push(filterStr);
                    }
                }
            }
          
            if(ORfiltersLen){
                for(i = 0; i < ORfiltersLen; i++){
                    if(ORfilters[i].filter){
                        if(i != 0){
                            filterList.push("OR");
                        }
                        operator = this.getOpertorForString(ORfilters[i].filter.operator);
                        filterStr = ORfilters[i].filter.key + operator + ORfilters[i].filter.value;
                        orFilterList.push(this.formFilterString(ORfilters[i].filter.key, ORfilters[i].filter.value, operator));
                        if(filterList.length > 0 && i == 0){
                            filterList.push("OR");
                        }
                        filterList.push(filterStr);
                    }
                }
            }
            if(getTokensToAdd){
                return filterList;
            } else {
                if(otherFilters){
                    var extraAndFilters = otherFilters[0], extraOrFilters = otherFilters[1];
                    if(extraAndFilters){
                        for(i = 0; i < extraAndFilters.length; i++){
                            andFilterList.push(extraAndFilters[i]);
                        }
                    }
                  
                    if(extraOrFilters){
                        for(i = 0; i < extraOrFilters.length; i++){
                            orFilterList.push(extraOrFilters[i]);
                        }
                    }
                }
                return this.getFilterStructure(otherFilterList, andFilterList, orFilterList);
            }
        };
        //
        this.getOpertorForString = function(string){
            switch(string){
              case 'EQUALS':
                  return '=';
                  break;
              case 'NOT_EQUALS':
                  return '!=';
                  break;
              case '=':
                  return '=';
                  break;
              case '!=':
                  return '!=';
                  break;
            }
        };

        //returns the final filter structure as expected by the backend
        this.getFilterStructure = function(filterList, andFilterList, orFilterList){
            if(filterList.length > 0 && andFilterList.length > 0){
              var len = filterList.length, i;
              for(i = 0; i < len; i++){
                andFilterList.push(filterList[i]);
              }
            }
      
            if(filterList.length > 0 || andFilterList.length > 0 || orFilterList.length > 0){
              if(andFilterList.length > 0){
                if(orFilterList.length > 0){
                    var filters = {
                        "and" : [{
                            "and" : andFilterList
                        },{
                            "or" : orFilterList
                        }]
                    }
                } else {
                    var filters = {
                        "and" : andFilterList
                    }
                }
              } else {
                if(orFilterList.length > 0){
                    if(filterList.length < 1){
                        var filters = {
                            "and" : [{
                                "or" : orFilterList
                            }]
                        }
                    } else {
                        var filters = {
                            "and" : [{
                                "and" : filterList
                            },{
                                "or" : orFilterList
                            }]
                        }
                    }
                } else {
                    var filters = {
                        "and" : filterList
                    }
                }
              }
            }
            return filters;
        };

        this.trimValues = function(val){
            if(val){
                if(val.charAt(0) == " " || val.charAt(val.length - 1) == " ") {
                    val = val.replace(/^\s+|\s+$/g, "");
                }
                if(val.charAt(0) == "," || val.charAt(val.length - 1) == ","){
                    val = val.replace(/(^,)|(,$)/g, "");
                }
            }
            return val;
        };

        //resolves SD address object names to IP address
        this.getResolvedIP = function(sdObjName, callback){
            var resolvedIPAddr = sdObjName,
            onSuccess = function(model, respData){
                var resp = respData.addresses.address;
                if(resp.length > 0){
                    resolvedIPAddr = resp[0]['ip-address'];
                }
                callback(resolvedIPAddr);
            };
            this.service.getAddressObject(sdObjName, onSuccess);
        };
        //
        this.getOpertor = function(filterStr){
            operIndex = filterStr.indexOf(" ") + 1;
            operator = filterStr.substring(operIndex, operIndex + filterStr.substr(operIndex).indexOf(" "));
            return operator;
        };
        //returns the selected filter criteria as an array of filter objects
        this.getFilters = function(filtersArr){
          var orFilterList = [], andFilterList = [], operatorToken;
          if(filtersArr.length > 0){
            var filterArray = filtersArr, noOfFilters = filterArray.length, i, j, filterCriteria, operator;
            for(i = 0; i < noOfFilters; i++){
                if(filterArray[i].indexOf(" ") != -1){
                  operator = this.getOpertor(filterArray[i]);
                }

                if(filterArray[i].indexOf(operator) != -1){        
                    filterStr = filterArray[i].split(" " + operator + " ");
                    key = filterStr[0];
                    key = this.trimValues(key);

                    val = filterStr[1];
                    val = this.trimValues(val);
                    
                    if(val){
                       if(val.indexOf(",") != -1){
                            val = val.split(",");     //multiple values
                            for(j = 0; j < val.length; j++){
                                val[j] = this.trimValues(val[j]);
                            }
                        } 
                    }
                    
                    if(i == 0){
                        var firstFilterCriteria = this.formFilterString(key, val, operator);
                        if(noOfFilters == 1){
                            andFilterList.push(firstFilterCriteria);
                        }
                    } else if(i == 2){
                        if(operatorToken == "OR"){
                            orFilterList.push(firstFilterCriteria);
                            if(val){
                                orFilterList.push(this.formFilterString(key, val, operator));
                            }
                        } else {
                            andFilterList.push(firstFilterCriteria);
                            if(val){
                                andFilterList.push(this.formFilterString(key, val, operator));
                            }
                        }
                    } else {
                        if(operatorToken == "OR"){
                            if(val){
                                orFilterList.push(this.formFilterString(key, val, operator));
                            }
                        } else {
                            if(val){
                                andFilterList.push(this.formFilterString(key, val, operator));
                            }
                        }
                    }
                } else {
                    operatorToken = filterArray[i];
                }
            }
          }
          return [andFilterList, orFilterList];
        },
        //returns the selected filter criteria as a string
        this.getFilterString = function(filtersArr){
            var filterStr = filtersArr.toString();
                filterStr = filterStr.replace(new RegExp(",OR,", 'g'), " OR ");
                filterStr = filterStr.replace(new RegExp(",AND,", 'g'), " AND ");
            return filterStr;
        },
        //
        this.showCountryFlags = function(cellValue, options, rowObject){
            var countryCode2 = cellValue, countryName, returnVal = "";
            if(options.colModel.index == "src-country-code2"){
              countryName = rowObject[filterUtil.LC_KEY.SOURCE_COUNTRY_NAME];
            } else {
              countryName = rowObject[filterUtil.LC_KEY.DESTINATION_COUNTRY_NAME];
            }
            if(countryCode2)
              returnVal = "<div class='f16 flag " + countryCode2.toLowerCase() + "'>      " + countryName + "</div>";
            else if(countryName)
              returnVal = countryName
            return returnVal;
        };
        //
        this.timeZone = 'Local';
        //
        this.unFormatTime = function(cellvalue, options, rowObject){
            cellvalue = $($(rowObject).html()).data("raw-timestamp");
            return cellvalue;
        };
        //
        this.unFormatIP = function(cellvalue, options, rowObject){
            cellvalue = $($(rowObject).html()).data("ip-address");
            return cellvalue;
        };
        //
        this.getTime = function(cellValue){
                    var me = this, d = new Date(cellValue), time, ms, sec, index;
          if(me.timeZone.toUpperCase() == 'UTC'){
            time = d.toUTCString();
            ms = d.getUTCMilliseconds();
            sec = d.getUTCSeconds();
          } else {
            time = d.toLocaleString();
            ms = d.getMilliseconds();
            sec = d.getSeconds();
          }
          index = time.lastIndexOf(sec);
          if(new String(sec).length < 2){
            index = index + 1;     
          } else {
            index = index + 2;
          }
          time = time.substr(0, index) + "." + ms + time.substr(index);
          return "<div data-raw-timestamp='" + cellValue + "'>" + time + "</div>";
        };
        //
        this.resolveIP = false;          //flag set to resolve IPs in event viewer grid. Disabled by default
        //
        this.resolveIPAddr = function(cellValue, options, rowObject){
          var me = this, returnVal = cellValue || "";
          if(me.resolveIP){
            var hostName = rowObject[options.colModel.index + "-hostname"] || "";
            returnVal = "<div data-ip-address='" + returnVal + "'>" + hostName + "</div>";
          }
          return returnVal;
        };
        //
        this.getGridConfig = function(filterMenu, operatorList, postData) {
            var me = this,
                setShowHideColumnSelection,
                setCustomMenuStatusSplit,
                setItemStatus,
                setPostData;
                //gridHeight = $("#slipstream_ui .right-pane").height() - AVAILABLE_HEIGHT - TOLERANCE;
            //
            /*
            if(gridHeight < 0){
                gridHeight = 400;//as a fall back default to 400px..
            }*/           
            //
            setShowHideColumnSelection = function (columnSelection){
                var me = this, columnsToBeHidden = me.getCategoryBasedColumns(), 
                    len = columnsToBeHidden.length, i, col;
                for(i = 0; i < len; i++){
                    col = columnsToBeHidden[i];
                    columnSelection[col] = false;
                }
                return columnSelection;
            };

            setCustomMenuStatusSplit = function (key, isItemDisabled, selectedRows) {
                return isItemDisabled;
            };

            setItemStatus = function (key, isItemDisabled, selectedRows){
              if(selectedRows.length < 1)
                isItemDisabled = true;
              return isItemDisabled;
            };

            setPostData = function(data){
                var req, reqBody, size = me.postData.request.size, order = "descending",
                    fromPage = data.page, fromRec = (fromPage - 1) * parseInt(size), 
                    filterTokens = data.filterTokens, filters, filterList = [], sort,
                    andFilterList = [], orFilterList = [], otherFilters, sortOrder = data.sord,
                    sortBy = {
                      "sort" : data.sidx
                    }, 
                    paging = {
                      "from" : fromRec
                    };

                if(sortOrder == "asc"){
                    order = "ascending";
                }

                sort = {
                    "order" : order
                };

                reqBody = $.extend({}, me.postData.request, paging);
                reqBody = $.extend({}, reqBody, sortBy);
                reqBody = $.extend({}, reqBody, sort);

                if(filterTokens){
                    otherFilters = me.getFilters(filterTokens);         //otherFilters = [andFilterList, orFilterList]
                    andFilterList = otherFilters[0];
                    orFilterList = otherFilters[1];
                }
                
                if(me.postData.request.filters && (andFilterList.length > 0 || orFilterList.length > 0)){
                    var filters = {
                        "filters" : me.getFilterList(me.postData.request.filters, false, otherFilters)
                    }
                    reqBody = $.extend({}, reqBody, filters);
                }

                if((andFilterList.length > 0 || orFilterList.length > 0) > 0 && !me.postData.request.filters){
                    var filters = {
                        "filters" : me.getFilterStructure([], andFilterList, orFilterList)
                    }
                    reqBody = $.extend({}, reqBody, filters);
                }
                
                req = {
                  "request": reqBody
                }

                me.request = req.request;
                return req;
            };

            return {
                "tableId":"ev_detail_view_grid",
                "numberOfRows":50,
                "scroll": "true",
                "height": "auto",
                "showWidthAsPercentage": false,
                "multiselect": false,
                "onSelectAll": false,
                
                "ajaxOptions": {
                  headers: {
                      "Content-Type": "application/json"
                  }
                },

                "url": '/api/juniper/ecm/log-scoop/logs',
                "urlMethod": 'POST',
                "postData": setPostData,

                "jsonRoot": "response.result",
                "singleselect": true,
                "jsonRecords": function(data) {
                    return data['response']['header'] && data['response']['header']['total-count'];
                },

                "sorting": [{
                  "column": "timestamp",
                  "order": "desc"
                }],

                "filter": {
                  searchUrl: true,
                  advancedSearch : {
                    "filterMenu": filterMenu,
                    "logicMenu": operatorList,
                    "save": [{
                        "label":"Save Filter",
                        "key":"createFilter"
                    },{
                        "label":"Create Alert",
                        "key":"createAlertWizard"
                    },{
                        "label":"Create Report",
                        "key":"createReportWizard"
                    }]
                  },
                  showFilter: {
                    "customItems" : [{
                      "label":"Show Saved Filters",
                      "key":"savedFilters"
                    }, {
                       "label":"Clear Settings",
                       "key":"clearFilters"
                    }
                    ]
                  },
                  optionMenu: {
                    "showHideColumnsItem": {
                      "setColumnSelection": setShowHideColumnSelection.bind(me)
                    },
                    "customItems" : [{
                      "label": "Export to CSV",
                      "key": "exportCSVMenu"
                    },
                    {
                        "label":"Settings",
                        "key":"settingsWizard"
                    }],
                    "statusCallback": setCustomMenuStatusSplit
                  }
                },

                "contextMenu": {
                    "custom":[{
                            "label":"Show raw log",
                            "key":"showRawLogs"
                        },{
                            "label":"Show event details",
                            "key":"showEventDetails"
                        },{
                            "label":"Show exact match",
                            "key":"showExactMatch"
                        },{
                            "label":"Filter on cell data",
                            "key":"filterOnCellData"
                        },{
                            "label":"Exclude cell data",
                            "key":"excludeCellData"
                        },{
                            "label":"Show firewall policy",
                            "key":"showPolicyFirewall"
                        },{
                            "label":"Show NAT source policy",
                            "key":"showPolicyNATSource"
                        },{
                            "label":"Show NAT destination policy",
                            "key":"showPolicyNATDestination"
                        }, {
                            "label":"Create Exempt Rule",
                            "key":"createExemptRule"
                        }]
                },

                "contextMenuStatusCallback": function (selectedRows, updateStatusSuccess, updateStatusError) {
                    var selectedRowsObj = selectedRows.selectedRows,
                        statusShowPolicyFirewall = false,
                        statusShowPolicyNATSource = false,
                        statusShowPolicyNATDestination = false,
                        statusShowExemptRule = false;
                    if(selectedRowsObj.length===1) {
                        if(selectedRowsObj[0][filterUtil.LC_KEY.EVENT_CATEGORY].toLowerCase() === "firewall" && selectedRowsObj[0][filterUtil.LC_KEY.POLICY_NAME] !== "" && selectedRowsObj[0][filterUtil.LC_KEY.POLICY_NAME] !== 'None') statusShowPolicyFirewall = true;
                        if(selectedRowsObj[0][filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME] !== "" && selectedRowsObj[0][filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME] !== 'None' && selectedRowsObj[0][filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME] !== 'N/A') statusShowPolicyNATSource = true;
                        if(selectedRowsObj[0][filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME] !== "" && selectedRowsObj[0][filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME] !== 'None' && selectedRowsObj[0][filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME] !== 'N/A') statusShowPolicyNATDestination = true;
                        if(selectedRowsObj[0][filterUtil.LC_KEY.EVENT_CATEGORY].toLowerCase() === "ips") statusShowExemptRule=true;
                    }
                    updateStatusSuccess({
                        "showPolicyFirewall": statusShowPolicyFirewall,
                        "showPolicyNATSource": statusShowPolicyNATSource,
                        "showPolicyNATDestination": statusShowPolicyNATDestination,
                        "createExemptRule": statusShowExemptRule
                    });
                },

                "contextMenuItemStatus": setItemStatus,

                "columns": [
                {
                    "index":"timestamp",
                    "name":"timestamp",
                    "label":context.getMessage('ev_time'),
                    "width":"175px",
                    "formatter":this.getTime.bind(me),
                    "unformat":this.unFormatTime.bind(me)
                },
                {
                    "index":filterUtil.LC_KEY.EVENT_TYPE,
                    "name":filterUtil.LC_KEY.EVENT_TYPE,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.EVENT_TYPE)),
                    "width":"250px"
                },
                
                {
                    "index":"src-country-code2",
                    "name":"src-country-code2",
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.SOURCE_COUNTRY_NAME)),
                    "width":"120px",
                    "formatter": this.showCountryFlags
                },
                {
                    "index":filterUtil.LC_KEY.SOURCE_ADDRESS,
                    "name":filterUtil.LC_KEY.SOURCE_ADDRESS,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.SOURCE_ADDRESS)),
                    "width":"120px",
                    "formatter": this.resolveIPAddr.bind(me),
                    "unformat": this.unFormatIP.bind(me)
                },
                {
                    "index":filterUtil.LC_KEY.DESTINATION_ADDRESS,
                    "name":filterUtil.LC_KEY.DESTINATION_ADDRESS,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.DESTINATION_ADDRESS)),
                    "width":"120px",
                    "formatter": this.resolveIPAddr.bind(me),
                    "unformat": this.unFormatIP.bind(me)
                },
                {
                    "index":filterUtil.LC_KEY.SOURCE_PORT,
                    "name":filterUtil.LC_KEY.SOURCE_PORT,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.SOURCE_PORT)),
                    "width":"120px"
                },
                {
                    "index":filterUtil.LC_KEY.DESTINATION_PORT,
                    "name":filterUtil.LC_KEY.DESTINATION_PORT,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.DESTINATION_PORT)),
                    "width":"120px"
                },
                {
                    "index":"event-name-desc",
                    "name":"event-name-desc",
                    "label":context.getMessage('ev_event_name_description'),
                    "width":"170px"
                },
                {
                    "index":filterUtil.LC_KEY.ATTACK_NAME,
                    "name":filterUtil.LC_KEY.ATTACK_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.ATTACK_NAME)),
                    "width":"150px"
                },
                {
                    "index":filterUtil.LC_KEY.THREAT_SEVERITY,
                    "name":filterUtil.LC_KEY.THREAT_SEVERITY,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.THREAT_SEVERITY)),
                    "width":"150px"
                },
                {
                    "index":filterUtil.LC_KEY.POLICY_NAME,
                    "name":filterUtil.LC_KEY.POLICY_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.POLICY_NAME)),
                    "width":"150px"
                },
                {
                    "index":filterUtil.LC_KEY.NAME,
                    "name":filterUtil.LC_KEY.NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.NAME)),
                    "width":"200px"
                },
                {
                    "index":filterUtil.LC_KEY.EVENT_CATEGORY,
                    "name":filterUtil.LC_KEY.EVENT_CATEGORY,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.EVENT_CATEGORY)),
                    "width":"120px"
                },
                {
                    "index":"dst-country-code2",
                    "name":"dst-country-code2",
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.DESTINATION_COUNTRY_NAME)),
                    "width":"150px",
                    "formatter": this.showCountryFlags
                },
                {
                    "index":filterUtil.LC_KEY.USER_NAME,
                    "name":filterUtil.LC_KEY.USER_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.USER_NAME)),
                    "width":"150px"
                },
                {
                    "index":filterUtil.LC_KEY.ACTION,
                    "name":filterUtil.LC_KEY.ACTION,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.ACTION)),
                    "width":"150px"
                },
                {
                    "index":filterUtil.LC_KEY.HOST,
                    "name":filterUtil.LC_KEY.HOST,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.HOST)),
                    "width":"120px"
                },

                {
                    "index":filterUtil.LC_KEY.SYSLOG_HOST_NAME,
                    "name":filterUtil.LC_KEY.SYSLOG_HOST_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.SYSLOG_HOST_NAME)),
                    "width":"120px"
                },
                {
                    "index":filterUtil.LC_KEY.SERVICE_NAME,
                    "name":filterUtil.LC_KEY.SERVICE_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.SERVICE_NAME)),
                    "width":"120px"
                },
                {
                    "index":filterUtil.LC_KEY.APPLICATION,
                    "name":filterUtil.LC_KEY.APPLICATION,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.APPLICATION)),
                    "width":"120px"
                },
                {
                    "index":filterUtil.LC_KEY.NESTED_APPLICATION,
                    "name":filterUtil.LC_KEY.NESTED_APPLICATION,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.NESTED_APPLICATION)),
                    "width":"120px"
                },
                {
                    "index":filterUtil.LC_KEY.SOURCE_ZONE_NAME,
                    "name":filterUtil.LC_KEY.SOURCE_ZONE_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.SOURCE_ZONE_NAME)),
                    "width":"120px"
                },
                {
                    "index":filterUtil.LC_KEY.DESTINATION_ZONE_NAME,
                    "name":filterUtil.LC_KEY.DESTINATION_ZONE_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.DESTINATION_ZONE_NAME)),
                    "width":"120px"
                },
                {
                    "index":filterUtil.LC_KEY.PROTOCOL_ID,
                    "name":filterUtil.LC_KEY.PROTOCOL_ID,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.PROTOCOL_ID)),
                    "width":"80px"
                },
                {
                    "index":filterUtil.LC_KEY.URL,
                    "name":filterUtil.LC_KEY.URL,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.URL)),
                    "width":"250px"
                },
                {
                    "index":filterUtil.LC_KEY.ROLES,
                    "name":filterUtil.LC_KEY.ROLES,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.ROLES)),
                    "width":"100px"
                },
                {
                    "index":filterUtil.LC_KEY.REASON,
                    "name":filterUtil.LC_KEY.REASON,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.REASON)),
                    "width":"100px"
                },
                {
                    "index":filterUtil.LC_KEY.NAT_SOURCE_PORT,
                    "name":filterUtil.LC_KEY.NAT_SOURCE_PORT,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.NAT_SOURCE_PORT)),
                    "width":"180px"
                },
                {
                    "index":filterUtil.LC_KEY.NAT_DESTINATION_PORT,
                    "name":filterUtil.LC_KEY.NAT_DESTINATION_PORT,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.NAT_DESTINATION_PORT)),
                    "width":"180px"
                },
                {
                    "index":filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME,
                    "name":filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME)),
                    "width":"180px"
                },
                {
                    "index":filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME,
                    "name":filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME)),
                    "width":"180px"
                },
                {
                    "index":filterUtil.LC_KEY.NAT_SOURCE_ADDRESS,
                    "name":filterUtil.LC_KEY.NAT_SOURCE_ADDRESS,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.NAT_SOURCE_ADDRESS)),
                    "width":"150px",
                    "formatter": this.resolveIPAddr.bind(me),
                    "unformat": this.unFormatIP.bind(me)
                },
                {
                    "index":filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS,
                    "name":filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS)),
                    "width":"150px",
                    "formatter": this.resolveIPAddr.bind(me),
                    "unformat": this.unFormatIP.bind(me)
                },
                {
                    "index":filterUtil.LC_KEY.SESSION_ID_32,
                    "name":filterUtil.LC_KEY.SESSION_ID_32,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.SESSION_ID_32)),
                    "width":"130px"
                },
                {
                    "index":filterUtil.LC_KEY.OBJECT_NAME,
                    "name":filterUtil.LC_KEY.OBJECT_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.OBJECT_NAME)),
                    "width":"150px"
                },
                {
                    "index":filterUtil.LC_KEY.PATH_NAME,
                    "name":filterUtil.LC_KEY.PATH_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.PATH_NAME)),
                    "width":"350px"
                },{
                    "index":filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME,
                    "name":filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME)),
                    "width":"150px"
                },{
                    "index":filterUtil.LC_KEY.RULE_NAME,
                    "name":filterUtil.LC_KEY.RULE_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.RULE_NAME)),
                    "width":"150px"
                },{
                    "index":filterUtil.LC_KEY.PROFILE_NAME,
                    "name":filterUtil.LC_KEY.PROFILE_NAME,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.PROFILE_NAME)),
                    "width":"150px"
                },                
                /*{
                    "index":filterUtil.LC_KEY.THREAT_SEVERITY,
                    "name":filterUtil.LC_KEY.THREAT_SEVERITY,
                    "label":context.getMessage(filterUtil.getUIKey(filterUtil.LC_KEY.THREAT_SEVERITY)),
                    "width":"150px"
                },*/
                {
                    "index":"id",
                    "name":"id",
                    "label":"",
                    "width":"175px",
                    "hidden": true
                },{
                    "index":"payload",
                    "name":"payload",
                    "label":"",
                    "width":"175px",
                    "hidden": true                        
                },{
                    "index":"index",
                    "name":"index",
                    "label":"",
                    "width":"175px",
                    "hidden": true
                },{
                    "index":"source-address-hostname",
                    "name":"source-address-hostname",
                    "label":"",
                    "width":"150px",
                    "hidden": true
                },{
                    "index":"destination-address-hostname",
                    "name":"destination-address-hostname",
                    "label":"",
                    "width":"150px",
                    "hidden": true
                },{
                    "index":"nat-source-address-hostname",
                    "name":"nat-source-address-hostname",
                    "label":"",
                    "width":"150px",
                    "hidden": true
                },{
                    "index":"nat-destination-address-hostname",
                    "name":"nat-destination-address-hostname",
                    "label":"",
                    "width":"150px",
                    "hidden": true
                },{
                    "index":"device-id",
                    "name":"device-id",
                    "label":"",
                    "hidden": true
                }] 
                }
            }
        };

    return Configuration;
});
