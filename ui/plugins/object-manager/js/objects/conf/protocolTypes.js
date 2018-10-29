/**
 * A list of services to be used in application protocol form 
 */
define([
], function () {
    var protocolTypes = [{
        "text": "TCP",
        "id": "PROTOCOL_TCP"
    }, {
        "text": "UDP",
        "id": "PROTOCOL_UDP"
    }, {
        "text": "ICMP",
        "id": "PROTOCOL_ICMP"
    }, {
        "text": "SUN-RPC",
        "id": "PROTOCOL_SUN_RPC"
    }, {
        "text": "MS-RPC",
        "id": "PROTOCOL_MS_RPC"
    }, {
        "text": "ICMPv6",
        "id": "PROTOCOL_ICMPV6"
    }, {
        "text": "Other",
        "id": "PROTOCOL_OTHER"
    }];
    return protocolTypes;
});