/**
 * Constants for Log Director.
 * @author aslama@juniper.net
 */
define([], function() {
    var LogConstants = {
    	LogTypes:{
    		COMBINED_NODE : "COLLECTOR_INDEXER",
    		LOG_RECEIVER: "COLLECTOR",
    		STORAGE_NODE: "INDEXER_DATA",
    		MASTER_DATA : "MASTER_DATA",
    		MASTER_NODE : "INDEXER_MASTER",
    		QUERY_NODE: 'INDEXER_QUERY'
    	},

        LogTypesDisplay:{
            COMBINED_NODE : "Log Receiver and Indexer",
            LOG_RECEIVER: 'Log Receiver',
            STORAGE_NODE: "Log Storage",
            MASTER_DATA :'Log Indexer',
            MASTER_NODE : "Cluster Manager",
            QUERY_NODE: "Log Query"
        },

        NotAvailable:{
            NA :"NA",
            EMPTY : "",
            NULL : "-"
        },
        Rules:{
            NODE_SETTING_PERMISSION : "NetworkSettings"
        }
     }
     return LogConstants;
});
