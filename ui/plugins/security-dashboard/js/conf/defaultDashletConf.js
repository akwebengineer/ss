/**
 * A configuration object used to configure default dashlets
 *
 * @module DefaultDashletConf
 * @author Kyle Huang <kyleh@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    var DashletConf = function (context) {
        var constants = {
            'chartTypes': {
                'barChart': {
                    'id': 'barChart',
                    'size': 'single',
                    'queryParam': 'values'
                },
                'columnChart': {
                    'id': 'columnChart',
                    'size': 'single',
                    'queryParam': 'values'
                },
                'timeSeriesChart': {
                    'id': 'timeSeriesChart',
                    'size': 'double',
                    'queryParam': 'timeline'
                },
                'listChart': {
                    'id': 'listChart',
                    'size': 'single',
                    'queryParam': 'values'
                },
                'map': {
                    'id': 'map',
                    'size': 'large',
                    'queryParam': 'values'
                }
            }
        };

        this.getChartTypes = function () {
            return constants.chartTypes;
        };

        this.getChartSize = function(type) {
            if (constants.chartTypes.hasOwnProperty(type)) {
                return constants.chartTypes[type].size;
            }
            return constants.chartTypes.barChart.size;
        };

        this.getChartId = function (key) {
            if (constants.chartTypes.hasOwnProperty(key)) {
                return constants.chartTypes[key].id;
            }
            return constants.chartTypes.barChart.id;
        };

        this.getChartQueryParam = function (key) {
            if (constants.chartTypes.hasOwnProperty(key)) {
                return constants.chartTypes[key].queryParam;
            }
            return constants.chartTypes.barChart.queryParam;
        };

        this.getColumnConfig = function (keyHeader) {

            var col2 = keyHeader[0] || 'dashlet_list_column_default';
            var col3 = keyHeader[1] || 'dashlet_list_column_count';

            return [
                { 'width': 35,  'label': context.getMessage('dashlet_list_column_rank'),  'name': 'attributes.rank' },
                { 'width': 244, 'label': context.getMessage(col2), 'name': 'attributes.key' },
                { 'width': 115,  'label': context.getMessage(col3), 'name': 'attributes.value' }
            ];
        };

        this.getValues = function() {
            return {
                'defaults': {
                    'chartType': 'barChart',
                    'timeRange': 1 * 60 * 60 * 1000,
                    'params': {
                        'aggregation'       : 'COUNT',
                        'order'             : 'descending',
                        'count'             : 10,
                        'slots'             : 10,
                        'url'               : '/api/juniper/ecm/log-scoop/',
                        'defaultUrlPath'    : 'aggregate',
                        'timeSeriesUrlPath' : 'time-aggregate'
                    }
                },
                'antiVirusThreatMap': {
                    'chartType': 'map',
                    'params':{
                    }
                },
                'topFirewallDeniesBySourceIP': {
                    'chartType': 'timeSeriesChart',
                    'barChartParams' : {
                        'xAxisTitle': 'Source IP Address',
                        'yAxisTitle': 'Count',
                        'getTooltip' : function(model){
                            return 'Source IP Address:  ' + model.get('key') + '<br />Count:  ' + model.get('value');
                        }
                    },
                    'listColumnHeader': ['dashlet_source_ip'],
                    'params': {
                        'mime_type' : 'vnd.juniper.net.eventlogs.firewall',
                        'response-type': 'timeline',
                        'aggregation-attributes': ['source-address'],
                        'filters': {
                            'or': [
                                {
                                    'filter': {
                                       'key': 'event-type',
                                       'operator': 'EQUALS',
                                       'value': 'RT_FLOW_SESSION_DENY'
                                     }
                                },
                                {
                                    'filter': {
                                       'key': 'event-type',
                                       'operator': 'EQUALS',
                                       'value': 'RT_FLOW_SESSION_DENY_LS'
                                     }
                                }/*,
                                {
                                    'filter': {
                                        'key': 'event-category',
                                        'operator': 'EQUALS',
                                        'value': 'firewall'                             //since we are jumping to Firewall category
                                    }
                                }*/
                            ]
                        }
                    }
                },
                'topFirewallEvents': {
                    'barChartParams' : {
                        'xAxisTitle': 'Event',
                        'yAxisTitle': 'Count',
                        'getTooltip' : function(model){
                            return 'Event Name:  ' + model.get('key') + '<br />Count:  ' + model.get('value');
                        }
                    },
                    'listColumnHeader': ['dashlet_event'],
                    'params': {
                        'mime_type' : 'vnd.juniper.net.eventlogs.firewall',
                        'aggregation-attributes': ['event-type'],
                        'filters': {
                            'filter': {
                                'key': 'event-category',
                                'operator': 'EQUALS',
                                'value': 'firewall'
                            }
                        }
                    }
                },
                'topFirewallRules': {
                    'barChartParams' : {
                        'xAxisTitle': 'Policy Name',
                        'yAxisTitle': 'No. of Rules Hit',
                        'getTooltip' : function(model){
                            return 'Policy Name:  ' + model.get('key') + '<br />No. of rules hit:  ' + model.get('value');
                        }
                    },
                    'listColumnHeader': ['dashlet_policy_name'],
                    'params':{
                        'aggregation-attributes': ['policy-name'],
                        'filters': {
                            'filter': {
                                'key': 'event-type',
                                'operator': 'EQUALS',
                                'value': 'RT_FLOW_SESSION_CLOSE'
                            }
                        }
                    }
                },
                'topPoliciesRulesNotHit' : {
                    'barChartParams' : {
                        'xAxisTitle': 'Policy Name',
                        'yAxisTitle': 'No. of Rules Not Hit',
                        'getTooltip' : function(model){
                            var content = 'Policy Name: ' + model.get('key') + '<br />No. of rules not hit:  ' + model.get('value');
                            return content;
                        }
                    },
                    'listColumnHeader': ['dashlet_policy_name'],
                    'params': {
                        'url' :  '/api/juniper/sd/policy-hit-count-manager/policies-with-no-hit-rule-counts',
                        'filters': {
                            'filter': {
                                'key': 'topNCount',
                                'operator': 'EQUALS',
                                'value': '10'
                            }
                        }
                    }
                },
                'topIPSEvents': {
                    'chartType': 'listChart',
                    'barChartParams' : {
                        'xAxisTitle': 'Threat',
                        'yAxisTitle': 'Count',
                        'getTooltip' : function(model){
                            return 'Threat Name:  ' + model.get('key') + '<br />Count:  ' + model.get('value');
                        }
                    },
                    'listColumnHeader': ['dashlet_threat'],
                    'params': {
                        'response-type': 'timeline',
                        'mime_type' : 'vnd.juniper.net.eventlogs.ips',
                        'aggregation-attributes': ['event-type'],
                        'filters': {
                            'filter': {
                                'key': 'event-category',
                                'operator': 'EQUALS',
                                'value': 'ips'
                            }
                        }
                    }
                },
                'deviceThroughputBytes' : {
                    'barChartParams' : {
                        'type': 'stacked-bar',
                        'xAxisTitle': 'Device Name',
                        'yAxisTitle': 'Bytes',
                        'stackedBarLegend' : {
                            'Outgoing': '#c6e2f6',
                            'Incoming': '#567cbe'
                        }
                    },
                    'listColumnHeader': ['dashlet_device_name', 'dashlet_bytes'],
                    'params': {
                        'url'           : '/api/juniper/seci/devicemonitor-management/traffic/top-devices',
                        'rank-by'       : 'total-bytes'
                    }
                },
                'zoneThroughputBytes' : {
                    'barChartParams' : {
                        'type': 'stacked-bar',
                        'xAxisTitle': 'Zone Name',
                        'yAxisTitle': 'Bytes',
                        'stackedBarLegend' : {
                            'Outgoing': '#c6e2f6',
                            'Incoming': '#567cbe'                            
                        }
                    },
                    'listColumnHeader': ['dashlet_zone_name', 'dashlet_bytes'],
                    'params': {
                        'url'           : '/api/juniper/seci/devicemonitor-management/traffic/top-zones',
                        'rank-by'       : 'total-bytes'
                        // ,'sample-values' : 'true'
                    }
                },
                'topApplications': {
                    'barChartParams' : {
                        'xAxisTitle': 'Application Name',
                        'yAxisTitle': 'Session Count',
                        'getTooltip' : function(model){
                            return 'Application Name:  ' + model.get('key') + '<br />Session Count:  ' + model.get('value');
                        }                        
                    },
                    'listColumnHeader': ['dashlet_application_name'],
                    'params': {
                        'aggregation-attributes':['application']
                    }
                },
                'topDestinationIPs': {
                    'chartType': 'listChart',
                    'barChartParams' : {
                        'xAxisTitle': 'Destination IP',
                        'yAxisTitle': 'Count',
                        'getTooltip' : function(model){
                            return 'Destination IP:  ' + model.get('key') + '<br />Count:  ' + model.get('value');
                        }                        
                    },
                    'listColumnHeader': ['dashlet_dest_ip'],
                    'params': {
                        'aggregation-attributes':['destination-address'],
                        'order' : 'ascending'
                    }
                },
                'topSourceIPs': {
                    'chartType': 'listChart',
                    'barChartParams' : {
                        'xAxisTitle': 'Source IP',
                        'yAxisTitle': 'Count',
                        'getTooltip' : function(model){
                            return 'Source IP:  ' + model.get('key') + '<br />Count:  ' + model.get('value');
                        }  
                    },
                    'listColumnHeader': ['dashlet_source_ip'],
                    'params': {
                        'aggregation-attributes':['source-address']
                    }
                },
                'ipsThreatMap': {
                    'chartType': 'map',
                    'params':{
                    }
                },
                'topDroppedPackets': {
                    'barChartParams' : {
                        'type': 'stacked-bar',
                        'xAxisTitle': 'Device Name',
                        'yAxisTitle': 'Dropped Packets',
                        'stackedBarLegend' : {
                            'Outgoing': '#c6e2f6',                            
                            'Incoming': '#567cbe'
                        }
                    },
                    'listColumnHeader': ['dashlet_dropped_packets'],
                    'params':{
                        'url'           : '/api/juniper/seci/devicemonitor-management/traffic/top-devices',
                        'rank-by'       : 'total-dropped-packets'
                    }
                },
                'topDroppedPacketsZones': {
                    'barChartParams' : {
                        'type': 'stacked-bar',
                        'xAxisTitle': 'Zone Name',
                        'yAxisTitle': 'Dropped Packets',
                        'stackedBarLegend' : {
                            'Outgoing': '#c6e2f6',                            
                            'Incoming': '#567cbe'
                        }
                    },
                    'listColumnHeader': ['dashlet_dropped_packets'],
                    'params':{
                        'url'           : '/api/juniper/seci/devicemonitor-management/traffic/top-zones',
                        'rank-by'       : 'total-dropped-packets'
                    }
                },
                'topViruses': {
                    'chartType': 'listChart',
                    'barChartParams' : {
                        'xAxisTitle': 'Virus Name',
                        'yAxisTitle': 'No. of Times Blocked',
                        'getTooltip' : function(model){
                            return 'Virus Name:  ' + model.get('key') + '<br />No. of times blocked:  ' + model.get('value');
                        }                          
                    },
                    'listColumnHeader': ['dashlet_virus_name'],
                    'params':{
                      'aggregation-attributes':['name'],
                      'filters': {
                        'or' : [
                            {
                                'filter': {
                                    'key': 'event-type',
                                    'operator': 'EQUALS',
                                    'value': 'AV_VIRUS_DETECTED_MT'
                                }
                            },
                            {   'filter': {
                                    'key': 'event-type',
                                    'operator': 'EQUALS',
                                    'value': 'AV_VIRUS_DETECTED'
                                }
                            }
                        ]
                      }
                    }
                },
                'deviceThroughputPackets' : {
                    'barChartParams' : {
                        'type': 'stacked-bar',
                        'xAxisTitle': 'Device Name',
                        'yAxisTitle': 'Packets',
                        'stackedBarLegend' : {
                            'Outgoing': '#c6e2f6',
                            'Incoming': '#567cbe'
                        }
                    },
                    'listColumnHeader': ['dashlet_device_name', 'dashlet_packets'],
                    'params': {
                        'url'           : '/api/juniper/seci/devicemonitor-management/traffic/top-devices',
                        'rank-by'       : 'total-packets'
                    }
                },
                'zoneThroughputPackets' : {
                    'barChartParams' : {
                        'type': 'stacked-bar',
                        'xAxisTitle': 'Zone Name',
                        'yAxisTitle': 'Packets',
                        'stackedBarLegend' : {
                            'Outgoing': '#c6e2f6',
                            'Incoming': '#567cbe'
                        }
                    },
                    'listColumnHeader': ['dashlet_zone_name', 'dashlet_packets'],
                    'params': {
                        'url'           : '/api/juniper/seci/devicemonitor-management/traffic/top-zones',
                        'rank-by'       : 'total-packets'
                    }
                },
                'topAlarms': {
                    'barChartParams' : {
                        'xAxisTitle': 'Device',
                        'yAxisTitle': 'Alarm Count',
                        'type': 'stacked-bar',
                        'stackedBarLegend' : {
                            'Critical'  : '#ec1c24',
                            'Major'     : '#f17a21',
                            'Minor'     : '#fbae17',                            
                            'Info'      : '#567cbe'
                        }
                    },
                    'listColumnHeader': ['dashlet_device_name'],
                    'params': {
                        'url'           : '/api/juniper/seci/alarms/top-device-alarms',
                        'moreDetails'   : {
                            'sortBy'   : { 'parameter': 'alarm' , 'order': 'descending'}
                        }
                    }
                },
                'topDeviceSessions' : {
                    'barChartParams' : {
                        'xAxisTitle': 'Device Name',
                        'yAxisTitle': 'Sessions',
                        'getTooltip' : function(model){
                            return model.get('details');
                        }
                    },
                    'listColumnHeader': ['dashlet_device_name', 'dashlet_sessions'],
                    'params': {
                        'url'           : '/api/juniper/seci/devicemonitor-management/sessions/top-devices',
                        'rank-by'       : 'total-sessions',
                        'moreDetails'   : {
                            'sortBy'  : { 'parameter': 'number-of-sessions' , 'order': 'descending'}
                        }
                    }
                },
                'topZoneSessions' : {
                    'barChartParams' : {
                        'type': 'stacked-bar',
                        'xAxisTitle': 'Zone Name',
                        'yAxisTitle': 'Sessions',
                        'stackedBarLegend' : {
                            'Outgoing': '#c6e2f6',
                            'Incoming': '#567cbe'
                        }
                    },
                    'listColumnHeader': ['dashlet_zone_name', 'dashlet_sessions'],
                    'params': {
                        'url'           : '/api/juniper/seci/devicemonitor-management/sessions/top-zones',
                        'rank-by'       : 'total-sessions',
                        'moreDetails'   : {
                            'sortBy'  : { 'parameter': 'number-of-sessions' , 'order': 'descending'}
                        }
                    }
                },
                'topCPU': {
                    'listColumnHeader': ['dashlet_device_name', 'dashlet_percent'],
                    'barChartParams' : {
                        'xAxisTitle': 'Device Name',
                        'yAxisTitle': 'Percent Usage',
                        'yAxisLabelFormat' : '%',
                        'barChartThresholds' : [75],
                        'getColor'  : function(value, threshold){
                            if(value > threshold){ return '#EC1C24'; }
                            if(value < 75){ return '#78BB4C'; }
                            return '#F58B39';
                        },
                        'getTooltip' : function(model, time){
                            var content = 'Device Name: ' + model.get('key') + '<br />' + 'CPU Usage for previous ' + time + ' <br />';
                            var tooltipDetailsArray = model.get('detailsArray');
                            for(var jj = 0; jj < tooltipDetailsArray.length; jj++){
                                content += tooltipDetailsArray[jj]['component-name'] + ' = ' + tooltipDetailsArray[jj]['utilization-summary'] + '% used<br />';
                            }
                            return content;
                        }
                    },
                    'params':{
                        'url'              : '/api/juniper/seci/devicemonitor-management/resource-utilization/top-devices',
                        'resource'         : 'cpu',
                        'component-values' : 'true',
                        'moreDetails'       : {
                                'sortBy': { 'parameter': 'cpu' , 'order': 'descending'}
                        }
                    }
                },
                'topMem': {
                    'listColumnHeader': ['dashlet_device_name', 'dashlet_percent'],
                    'barChartParams' : {
                        'xAxisTitle': 'Device Name',
                        'yAxisTitle': 'Percent Usage',
                        'yAxisLabelFormat' : '%',
                        'barChartThresholds' : [75],
                        'getColor'  : function(value, threshold){
                            if(value > threshold){ return '#EC1C24'; }
                            if(value < 75){ return '#78BB4C'; }
                            return '#F58B39';
                        },
                        'getTooltip' : function(model, time){
                            var content = 'Device Name: ' + model.get('key') + '<br />' + 'Memory Usage for previous ' + time + ' <br />';
                            var tooltipDetailsArray = model.get('detailsArray');
                            if(!tooltipDetailsArray){
                                return;
                            }
                            for(var jj = 0; jj < tooltipDetailsArray.length; jj++){
                                content += tooltipDetailsArray[jj]['component-name'] + ' = ' + tooltipDetailsArray[jj]['utilization-summary'] + '% used<br />';
                            }
                            return content;
                        }
                    },
                    'params':{
                        'url'               : '/api/juniper/seci/devicemonitor-management/resource-utilization/top-devices',
                        'resource'          : 'memory',
                        'component-values'  : 'true',
                        'moreDetails'       : {
                                'sortBy': { 'parameter': 'ram' , 'order': 'descending'}
                        }
                    }
                },
                'topStorage': {
                    'listColumnHeader': ['dashlet_device_name', 'dashlet_percent'],
                    'barChartParams' : {
                        'xAxisTitle': 'Device Name',
                        'yAxisTitle': 'Percent Usage',
                        'yAxisLabelFormat' : '%',
                        'barChartThresholds' : [75],
                        'getColor'  : function(value, threshold){
                            if(value > threshold){ return '#EC1C24'; }
                            if(value < 75){ return '#78BB4C'; }
                            return '#F58B39';
                        },
                        'getTooltip' : function(model, time){
                            var content = 'Device Name: ' + model.get('key') + '<br />' + 'Storage data for previous ' + time + ' <br />';
                            var tooltipDetailsArray = model.get('detailsArray');
                            if(!tooltipDetailsArray){
                                return;
                            }
                            for(var jj = 0; jj < tooltipDetailsArray.length; jj++){
                                content += tooltipDetailsArray[jj]['component-name'] + ' = ' + tooltipDetailsArray[jj]['utilization-summary'] + '% used<br />';
                            }
                            return content;
                        }
                    },
                    'params':{
                        'url'               : '/api/juniper/seci/devicemonitor-management/resource-utilization/top-devices',
                        'resource'          : 'storage',
                        'component-values'  : 'true',
                        'moreDetails'       : {
                                'sortBy': { 'parameter': 'storage' , 'order': 'descending'}
                        }
                    }
                }
            };
        };
    };
    return DashletConf;
});
