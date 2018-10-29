/**
 * A object for some common methods in Log Collector features.
 *
 * @module Log Collector
 * @author Aslam a <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['../utils/logConstants.js'
], function (LogConstants) {

    var LogUtils  = {

        logCollectorType : function (cellvalue){

            switch (cellvalue) {
                case LogConstants.LogTypes.COMBINED_NODE:
                    cellvalue = LogConstants.LogTypesDisplay.COMBINED_NODE;
                    break;
                case LogConstants.LogTypes.STORAGE_NODE:
                    cellvalue = LogConstants.LogTypesDisplay.STORAGE_NODE;
                    break;
                case LogConstants.LogTypes.MASTER_NODE:
                    cellvalue = LogConstants.LogTypesDisplay.MASTER_NODE;
                    break;
                case LogConstants.LogTypes.QUERY_NODE:
                    cellvalue = LogConstants.LogTypesDisplay.QUERY_NODE;
                    break;
                case LogConstants.LogTypes.LOG_RECEIVER:
                    cellvalue = LogConstants.LogTypesDisplay.LOG_RECEIVER;
                    break;
                case LogConstants.LogTypes.MASTER_DATA:
                    cellvalue = LogConstants.LogTypesDisplay.MASTER_DATA;
                    break;
                case undefined:
                    cellvalue = "";
                    break;
            }
            return cellvalue;
        },

        logTime : function (cellvalue){

             if(cellvalue != undefined ){
                  var date = new Date(cellvalue);
                  if(!isNaN(date.valueOf()))
                  {
                   return date.toString()
                  }else{
                    return cellvalue;
                  }
                }
             return LogConstants.NotAvailable.EMPTY;
        }



    }
    return LogUtils;
});
