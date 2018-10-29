define(["../../../../event-viewer/js/eventviewer/views/detailView.js",  
        "../../../../event-viewer/js/eventviewer/views/settingsFormView.js"], 
    function(DetailView, SettingsForm) {

    var activity = new Slipstream.SDK.Activity();

    describe("Event Viewer detail view unit tests", function() {
        var $el = $("#test_widget");
        var detailView, filter, context, persistence;
        //executes once
        before(function(){
            console.log("Event Viewer detail view unit tests: before");
            
            context = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            }); 
        });

        //executes once
        after(function(){
            console.log("Event Viewer detail view unit tests: after");
            context.restore();
        });

        //executes before every it()
        beforeEach(function(){
            console.log("Event Viewer detail view unit tests: beforeEach");
            var endTime = new Date(),
            filter = {
                "timeRange": {
                    "endTime": endTime,
                    "startTime": new Date(endTime - (7200000/4))
                },
                "aggregation": "none",
                "filters": {
                    "and" : [{
                        "and" : [{
                            "filter": {
                                "key": "event-category",
                                "operator": "EQUALS",
                                "value": "firewall"
                            }
                        }]
                    },{
                        "or" : [{
                            "filter": {
                                "key": "event-type",
                                "operator": "EQUALS",
                                "value": "RT_FLOW_SESSION_CLOSE"
                            }
                        },{
                            "filter": {
                                "key": "event-type",
                                "operator": "EQUALS",
                                "value": "RT_FLOW_SESSION_CREATE"
                            }
                        }]
                    }]
                }
            };
            //
            detailView = new DetailView({
                "activity": activity,
                "eventCategory": "FIREWALL",
                "filter": filter
            });
            //
            persistence = sinon.stub(Slipstream.SDK.Preferences, 'fetch', function () {
                return '';
            });
        });

        //executes after every it()
        afterEach(function(){
            persistence.restore();
            console.log("Event Viewer detail view unit tests: afterEach");
        });

        //
        it("detail view exists ?", function(){
            detailView.should.exist;
        });
        //
        it("detail view rendered ?", function(){
            expect(detailView.$el).to.not.be.null;
        });
        //
        it("grid inside detail view rendered ?", function(){
            var evGrid = detailView.$el.find(".ev-detail-view-body");
            expect(evGrid).to.not.be.null;
        });
        //
        it("Detail View render", function(){
            $.mockjax({
                url: "/api/juniper/ecm/log-scoop/logs",
                dataType: 'json',
                proxy: "/installed_plugins/event-viewer/js/eventviewer/tests/data/eventViewerGridData.json"
            });
            //
            $.mockjax({
                url: "/api/juniper/ecm/log-scoop/aggregate",
                dataType: 'json',
                proxy: "/installed_plugins/event-viewer/js/eventviewer/tests/data/aggregateData.json"
            });
            //
            detailView.render();
            detailView.refreshContentView();
        });
        //
        describe("EV detail view re-render", function(){
            beforeEach(function(){
                console.log("Event Viewer detail view unit tests: beforeEach");
                var endTime = new Date(),
                    filter = {
                        "timeRange": {
                            "endTime": endTime,
                            "startTime": new Date(endTime - (7200000/4))
                        },
                        "aggregation": "source-address",
                        "filters": {
                            "and" : [{
                                "and" : [{
                                    "filter": {
                                        "key": "event-category",
                                        "operator": "EQUALS",
                                        "value": "antispam"
                                    }
                                }]
                            },{
                                "or" : [{
                                    "filter": {
                                        "key": "event-type",
                                        "operator": "EQUALS",
                                        "value": "ANTISPAM_SPAM_DETECTED_MT"
                                    }
                                },{
                                    "filter": {
                                        "key": "event-type",
                                        "operator": "EQUALS",
                                        "value": "ANTISPAM_SPAM_DETECTED_MT_LS"
                                    }
                                }]
                            }]
                        }
                    };
                //
                detailView = new DetailView({
                    "activity": activity,
                    "eventCategory": "ANTI-SPAM",
                    "filter": filter
                });
            });

            it("Detail View re-render", function(){
                $.mockjax({
                    url: "/api/juniper/ecm/log-scoop/logs",
                    dataType: 'json',
                    proxy: "/installed_plugins/event-viewer/js/eventviewer/tests/data/eventViewerGridData.json"
                });
                //
                $.mockjax({
                    url: "/api/juniper/ecm/log-scoop/aggregate",
                    dataType: 'json',
                    proxy: "/installed_plugins/event-viewer/js/eventviewer/tests/data/aggregateData.json"
                });
                //
                var threatsEvent = {
                    currentTarget : {
                        checked : true
                    }
                };
                detailView.filterThreatsClick(threatsEvent);
                detailView.render();
            });
        });
        //
        it("Aggregation list view", function(){
            var keys = ["APPTRACK_SESSION_VOL_UPDATE_LS", "RT_FLOW_SESSION_DENY", "RT_FLOW_SESSION_CLOSE", "AAMW_ACTION_LOG", "RT_FLOW_SESSION_CREATE", 
                "APPTRACK_SESSION_CLOSE", "APPTRACK_SESSION_CLOSE_LS", "APPTRACK_SESSION_CREATE", "APPTRACK_SESSION_CREATE_LS", "SECINTEL_ACTION_LOG"],
                values = [13455, 13454, 6987, 6728, 6728, 6727, 6727, 6727, 6727, 6727];
            detailView.getDetailAggViewList(keys, values);    
        });
        //
        it("Aggregation click event", function(){
            var div = document.createElement('div'), 
                e = {
                    preventDefault: sinon.spy()
                };
            div.innerHTML = '<div class="ev-aggregated-data" title="APPTRACK_SESSION_CLOSE(30)"><a href="#">APPTRACK_SESSION_CLOSE(30)</a></div>';
            detailView.aggListClickEvent(e, div);
        });
        //
        it("Filter threats checkbox", function(){
            //true case
            var threatsEvent = {
                currentTarget : {
                    checked : true
                }
            };
            detailView.filterThreatsClick(threatsEvent);

            //false case
            var threatsEvent = {
                currentTarget : {
                    checked : false
                }
            };
            detailView.filterThreatsClick(threatsEvent);
        });
        //
        it("Event Viewer Settings Page", function(){
            var selections = {
                resolveIPSelection : false,
                utcTimeSelection : false,
                localTimeSelection : true
            };
            settingsView = new SettingsForm({
                "context": new Slipstream.SDK.ActivityContext(), 
                "selections": selections
            });
            settingsView.render();
            settingsView.getTimeZone();
            settingsView.isResolveIP();
            settingsView.getNumberOfLogs();
        });
        //
        describe.skip("Set filter to detail view", function(){
            var buildTimeRange;

            beforeEach(function(){
                buildTimeRange = sinon.stub(detailView, 'setEVTimeRange', function (timeRange) {
                    return '';
                });
            });

            afterEach(function(){
                buildTimeRange.restore();
            });
            //
            it("Set first filter", function(done){
                $.mockjax({
                    url: "/api/juniper/seci/filter-management/filters/1",
                    dataType: 'json',
                    proxy: "/installed_plugins/event-viewer/js/eventviewer/tests/data/filterID1Data.json",
                    status: 200,
                    responseText: {},
                    response : function(settings, Done){
                        Done();
                        done();
                    }
                });
                //
                var filter = {
                    "filter-id": "1",
                    "filter-string": "event-type = RT_FLOW_SESSION_CLOSE,RT_FLOW_SESSION_CREATE,RT_FLOW_SESSION_DENY",
                    "filter-name": "Top Destination IPs"
                };
                detailView.render();
                detailView.setFilter(filter);
                detailView.getFormattedFilter();
            });
            //
            it("Set second filter", function(done){
                $.mockjax({
                    url: "/api/juniper/seci/filter-management/filters/2",
                    dataType: 'json',
                    proxy: "/installed_plugins/event-viewer/js/eventviewer/tests/data/filterID2Data.json",
                    status: 200,
                    responseText: {},
                    response : function(settings, Done){
                        Done();
                        done();
                    }
                });
                //
                var filter = {
                    "filter-id": "2",
                    "filter-string": "event-type = RT_FLOW_SESSION_CLOSE,RT_FLOW_SESSION_CREATE,RT_FLOW_SESSION_DENY",
                    "filter-name": "Top Destination IPs"
                };
                detailView.render();
                detailView.setFilter(filter);
                detailView.getFormattedFilter();
            });
            //
            it("Set third filter", function(done){
                $.mockjax({
                    url: "/api/juniper/seci/filter-management/filters/3",
                    dataType: 'json',
                    proxy: "/installed_plugins/event-viewer/js/eventviewer/tests/data/filterID3Data.json",
                    status: 200,
                    responseText: {},
                    response : function(settings, Done){
                        Done();
                        done();
                    }
                });
                //
                var filter = {
                    "filter-id": "3",
                    "filter-string": "event-type = RT_FLOW_SESSION_CLOSE,RT_FLOW_SESSION_CREATE,RT_FLOW_SESSION_DENY",
                    "filter-name": "Top Destination IPs"
                };
                detailView.render();
                detailView.setFilter(filter);
                detailView.getFormattedFilter();
            });
        });
    });
});