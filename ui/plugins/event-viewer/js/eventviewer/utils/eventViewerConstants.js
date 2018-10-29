/**
 * Constants for EV module
 * @author adharmendran@juniper.net
 */
define([

], function() {
    var EventViewerConstants = {
        "ECM_ERROR_CODES":{
            "ERROR_CODE_100": 100,//All fine
            "ERROR_CODE_102": 102,//ECM down
            "ERROR_CODE_103": 103,//LC not configured
            "ERROR_CODE_226": 226,
            "ERROR_CODE_227": 227,
            "ERROR_CODE_228": 228,
            "ERROR_CODE_229": 229,
            "ERROR_CODE_230": 230,
            "ERROR_CODE_231": 231,
            "ERROR_CODE_232": 232,
            "ERROR_CODE_233": 233,
            "ERROR_CODE_234": 234,
            "ERROR_CODE_235": 235,
            "ERROR_CODE_236": 236,
            "ERROR_CODE_237": 237,
            "ERROR_CODE_238": 238
        },

        "EVENT_VIEWER_CATEGORIES":{
            "ev_category_all_events" : "ALL EVENTS",
            "ev_category_firewall" : "FIREWALL",
            "ev_category_web_filter" : "WEB-FILTERING",
            "ev_category_vpn" : "VPN",
            "ev_category_content_filtering" : "CONTENT-FILTERING",
            "ev_category_anti_spam" : "ANTI-SPAM",
            "ev_category_anti_virus" : "ANTI-VIRUS",
            "ev_category_ips" : "IPS"
        }
    };
    return EventViewerConstants;
});
