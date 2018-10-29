/**
 ** Grid config to get the top inbound/outbound IP addresses.
 *
 *  @module ThreatMap
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2016
 * */

define(['../utils/threatMapConstants.js'],
function (Constants) {

    var Configuration = function(title, context, requestObj, tableId, customButtonLabel, view) {

        var setPostData = function(data) {
            requestObj.request['size'] = view.noOfRecords > 5 ? view.noOfRecords : Constants.Records.Count;
            var req, reqBody, size = requestObj.request.size,
                fromPage = data.page, fromRec = (fromPage - 1) * parseInt(Constants.Records.Count),
                order = "descending",
                paging = {
                  "from" : fromRec
                },
                sort = {
                    "order" : order
                };
            requestObj.request['slot'] = fromPage;
            reqBody = $.extend({}, requestObj.request);
            reqBody = $.extend({}, reqBody, paging);
            reqBody = $.extend({}, reqBody, sort);

            req = {
              "request": reqBody
            }
            return req;
        };

        this.getValues = function(){
            return{
                "tableId":tableId,
                "title": title,
                "scroll": "true",
                "numberOfRows": 1000000,
                "multiselect": true,
                "onSelectAll": false,
                "showWidthAsPercentage": false,
//                "height": "auto",
                "height": "155px",
                "ajaxOptions": {
                  headers: {
                      "Content-Type": "application/json"
                  }
                },
                "url": '/api/juniper/ecm/log-scoop/aggregate',
                "urlMethod": 'POST',
                "postData": setPostData,
                "contextMenu": {},
                "actionButtons":{
                    "defaultButtons":{},
                    "customButtons":[{
                        "button_type": true,
                        "label": customButtonLabel,
                        "key": "blockIPAddress",
                        "disabledStatus" : true,
                        "secondary": true
                    }]
                },
                "jsonRoot": "response.result",
                "jsonRecords": function(data) {
                    return data['response']['header'] && data['response']['header']['result-count'];
                },
                "sorting": [{
                  "column": "value",
                  "order": "desc"
                }],
                "columns": [{
                    "index": "key",
                    "name": "key",
                    "label": context.getMessage('threatmap_tooltip_grid_ip_address_label'),
                    "width": 140,
                    "sortable": false
                },{
                    "index": "value",
                    "name": "value",
                    "label": context.getMessage('threatmap_tooltip_grid_no_events_label'),
                    "width": 140,
                    "sortable": false
                }],
                "footer" : false
            }
        }
    };
    return Configuration;
});