/**
 * Aggregation builder for filterString
 *
 * @module FilterManagement
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone'],
function( Backbone){

	var AggregationBuilder = function(){
        var me = this;

        // Map Aggregation for Alert Definition
        me.mapAggregation = function (key) {
            var me = this,
                aggregationMap = {"NestedAppName"  : "nested_application",
                                "Appname" : "application-name",
                                "Url" : "url",
                                "SourceIP" : "source-address",
                                "DestinationIP" : "destination-address",
                                "Servicename" : "service-name",
                                "Eventname" : "event-type",
                                "Rulename" : "rule-name",
                                "ServiceName" : "service-name",
                                "Attackname" : "attack-name",
                                "AttackSeverity" : "severity",
                                "Username" : "username",
                                "Roles" : "roles",
                                "Name" : "name",
                                "Category" : "category",
                                "EventCategory" : "event-category",
                                "Categoryname" : "category_name",
                                "Sourcename" : "source_name",
                                "Sourceport" : "source-port",
                                "Action" : "action",
                                "SourceZone": "source-zone-name",
                                "DestinationZone" : "destination-zone-name",
                                "SourcePort" : "source-port",
                                "LogSource" : "host",
                                "DestinationPort" : "destination-port",
                                "PolicyName" : "policy-name",
                                "Reason" : "reason",
                                "NATSourceIP": "nat-source-address",
                                "NATDestinationIP": "nat-destination-address",
                                "NATSourcePort" : "nat-source-port",
                                "NATDestinationPort" : "nat-destination-port",
                                "NATSourceRule" : "src_nat_rule_name",
                                "RuleName" : "rule",
                                "ProfileName" : "profile",
                                "AttackName" :  "attack",
                                "UTMCategoryOrVirusName" : "utmcategory",
                                "LogicalSystemName": "lsysname",
                                "ObjectName" : "objname",
                                "FeedName": "feed",
                                "ActionDetail" : "actiondetail",
                                "SubCategoryName" : "subcategoryname",
                                "HostName" : "syslog-hostname",
                                "TrafficSessionID" : "session-id-32",
                                "ProtocolID" : "protocol-id",
                                "AttackSeverity" : "severity-label",
                                "NATDestinationRule" : "dst_nat_rule_name"
                                };

            if(aggregationMap[key] ) {
                   return  aggregationMap[key];
            } else {
                return key;
            }
        };

        // Map Aggregation for Filters
        me.mapFilterAggregation = function (key) {
            var me = this,
                aggregationMap = {
                    "nested_application" : "NestedAppName",
                    "application-name" : "Appname",
                    "url" : "Url",
                    "source-address" : "SourceIP",
                    "destination-address" : "DestinationIP",
                    "service-name" : "Servicename",
                    "event-type" : "Eventname",
                    "rule-name" : "Rulename",
                    "attack-name" : "Attackname",
                    "severity" : "AttackSeverity",
                    "roles" : "Roles",
                    "event-category" : "EventCategory",
                    "category" : "CategoryName",
                    "action" : "Action",
                    "source-zone-name" : "Sourcezone",
                    "destination-zone-name" : "Destinationzone",
                    "source-port" : "SourcePort",
                    "host" : "LogSource",
                    "destination-port" : "DestinationPort",
                    "policy-name" : "Policyname",
                    "reason" : "Reason",
                    "nat-source-address" : "NATSourceIP",
                    "nat-destination-address" : "NATDestinationIP",
                    "nat-source-port" : "NATSourcePort",
                    "nat-destination-port" : "NATDestinationPort",
                    "profile" : "ProfileName",
                    "lsysname" : "LogicalSystemname",
                    "objname" : "ObjectName",
                    "feed" : "FeedName",
                    "actiondetail" : "ActionDetail",
                    "subcategoryname" : "SubCategoryName",
                    "syslog-hostname" : "HostName",
                    "session-id-32" : "TrafficSessionID",
                    "severity-label" : "AttackSeverity",
                    "log-id" : "LogId",
                    "event-name" : "Eventname",
                    "log-source-ipv6" : "LogSourceIpv6",
                    "protocol" : "Protocol",
                    "time" : "Time",
                    "rule-name-nat-src" : "RulenameNatsrc",
                    "rule-name-nat-dst" : "RulenameNatdst",
                    "domain-id" : "DomainID",
                    "device-id" : "DeviceID",
                    "vpn-name" : "VPNName",
                    "remote-address" : "Remoteaddress",
                    "local-address" : "Localaddress",
                    "gate-way-name" : "Gatewayname",
                    "local-ikeid" : "Localikeid",
                    "tunnel-id" : "Tunnelid",
                    "peer-ikeid" : "Peerikeid",
                    "and" : "AND",
                    "or" : "OR",
                    "and" : "and",
                    "or" : "or",
                    "destination-interface" : "DestinationInterface",
                    "source-interface" : "SourceInterface",
                    "icmp_type" : "ICMP_Type",
                    "interface-name" : "InterfaceName",
                    "ruleset-name" : "RuleSetName",
                    "argument1" : "Argument1",
                    "message" : "Message",
                    "destination-ipv6" : "DestinationIpv6",
                    "sourceIpv6" : "SourceIpv6",
                    "client-bytes-sent" : "ClientBytesSent",
                    "client-packets-sent" : "ClientPacketsSent",
                    "server-bytes-rcvd" : "ServerBytesRcvd",
                    "server-packets-rcvd" : "ServerPacketsRcvd",
                    "error-message" : "ErrorMessage",
                    "path-name" : "PathName"
                };

            if(aggregationMap[key] ) {
                   return  aggregationMap[key];
            } else {
                return key;
            }
        }



    };
       //
       return AggregationBuilder;
});