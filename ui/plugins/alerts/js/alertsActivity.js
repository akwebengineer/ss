/**
 * A module that works with Alerts.
 *
 * @module AlertsActivity
 * @author Slipstream Developers <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../ui-common/js/gridActivity.js',
    './conf/alertsGridConfiguration.js',
    './models/alertsModel.js',
    './views/alertDetailView.js',
    'widgets/overlay/overlayWidget',

], function(GridActivity, GridConfiguration, Model, AlertDetailView, OverlayWidget) {
    /**
     * Constructs an AlertsActivity.
     */
    var AlertsActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "delete": {
                rbacCapabilities: ["deleteGeneratedAlert"]
            },
             "showDetailView": {
                view: AlertDetailView
            },
            "clearAllSelections": {}
        };
        this.gridConf = GridConfiguration;
        this.model = Model;

        /**
        * @overridden from gridActivity.
        * Bind the publish event to the grid context menu.
        */
        this.bindEvents = function() {
            GridActivity.prototype.bindEvents.call(this);

            this.events.jumpToEVFromAlerts = "jumpToEVFromAlerts";
            
            this.view.$el.bind(this.events.jumpToEVFromAlerts, $.proxy(this.jumpToEVFromAlerts, this));
        };

        this.getFilterObj = function(respFilter, triggeredAggPoint, triggeredData){
            var andFilters = respFilter.and, orFilters = respFilter.or, filters = [], filterObj,
                filter = {
                    "filter" : {
                        "key" : triggeredAggPoint,
                        "operator" : "EQUALS",
                        "value" : triggeredData
                    }
                };

                if(respFilter.filter && !andFilters && !orFilters){
                    filters.push(respFilter);
                    filters.push(filter);
                    filterObj = {
                        'and' : filters
                    }
                } else {
                    andFilters.push(filter);
                }
                    
                if(andFilters){
                    for(var i = 0; i < andFilters.length; i++){
                        filters.push(andFilters[i]);
                    }
                    filterObj = {
                        'and' : filters
                    }
                }
                    
                if(orFilters){
                    for(var i = 0; i < orFilters.length; i++){
                        filters.push(orFilters[i]);
                    }
                    filterObj = {
                        'or' : filters
                    }
                }

                return filterObj;
        };

        this.jumpToEVFromAlerts = function() {
            var me = this, selectedRow = this.view.gridWidget.getSelectedRows()[0],
                mimeType = 'vnd.juniper.net.eventlogs.alleventcategories',
                selectedID = selectedRow.id, request;

            $.ajax({
                url: '/api/juniper/seci/alert-management/alerts/' + selectedID,
                method:"GET",
                dataType:"json",
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Accept", 'application/vnd.juniper.seci.alert-management.alert+json;version=1;q=0.01');
                },
                complete: function(data, status){
                    var resp = data.responseJSON['alert'],
                    startTime = resp['start-time'],
                    endTime = resp['end-time'], 
                    respFilter = resp['formatted-filter'], 
                    aggregation = resp['aggregation'],
                    triggeredCriteria = resp['source'],
                    triggeredData = triggeredCriteria[aggregation],
                    filterObj = me.getFilterObj(respFilter, aggregation, triggeredData),

                    request = {
                        'timeRange': {
                            'startTime': new Date(startTime),
                            'endTime': new Date(endTime)
                        },
                        'filters': filterObj,
                        'aggregation-attributes': aggregation
                    }
                    // start related activity for the clicked category
                    var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST', { 
                        mime_type: mimeType 
                    });
                    intent.putExtras(request);  // send the request obj containing startTime, endTime and filters
                    me.context.startActivity(intent);
                }
            });
        };
            
    };
    AlertsActivity.prototype = Object.create(GridActivity.prototype);
    AlertsActivity.prototype.constructor = AlertsActivity;

    return AlertsActivity;
});