define(["../../../../event-viewer/js/eventviewer/views/showEventDetailsView.js",
    "../../../../event-viewer/js/eventviewer/views/showRawLogView.js"], 
    function(ShowEventDetails, ShowRawLogs) {

    var activity = new Slipstream.SDK.Activity();

    describe("Context Menu handler unit tests", function() {
        //executes once
        before(function(){
            console.log("Context Menu handler unit tests: before");
        });

        //executes once
        after(function(){
            console.log("Context Menu handler unit tests: after");
        });

        //executes before every it()
        beforeEach(function(){
            console.log("Context Menu handler unit tests: beforeEach");
        });

        //executes after every it()
        afterEach(function(){
            console.log("Context Menu handler unit tests: afterEach");
        });
        
        it("Show event details", function(done){
            $.mockjax({
                url: "/api/juniper/sd/address-management/addresses",
                dataType: 'json',
                proxy: "/installed_plugins/event-viewer/js/eventviewer/tests/data/resolveAddressData.json",
                status: 200,
                responseText: {},
                response : function(settings, Done){
                    Done();
                    done();
                }
            });
           
            var selectedRow = {
                "action":"",
                "application":"HTTP",
                "attack-name":"",
                "destination-address":"2.2.2.2",
                "destination-address-hostname":"",
                "destination-port":"80",
                "destination-zone-name":"external",
                "device-id":"-1",
                "dst-country-code2":"<div class='f16 flag us'>      United States</div>",
                "dst-country-name":"United States",
                "dst-nat-rule-name":"None",
                "event-category":"firewall",
                "event-name-desc":"Application Tracking Session Closed",
                "event-type":"APPTRACK_SESSION_CLOSE",
                "host":"10.207.99.53",
                "id":"AVQJAJnPsihtpEdIFuPx",
                "index":"junoslogs-2016.04.12-05",
                "logical-system-name":"",
                "name":"",
                "nat-destination-address":"2.2.2.2",
                "nat-destination-address-hostname":"",
                "nat-destination-port":"80",
                "nat-source-address":"1.1.1.1",
                "nat-source-address-hostname":"",
                "nat-source-port":"33333",
                "nested-application":"MOBILE-DEVICE-USERAGENT",
                "object-name":"",
                "policy-name":"permit-rest",
                "profile-name":"",
                "protocol-id":"6",
                "reason":"TCP FIN",
                "roles":"N/A",
                "rule-name":"",
                "service-name":"junos-http",
                "session-id-32":"160208014",
                "source-address":"1.1.1.1",
                "source-address-hostname":"",
                "source-port":"36623",
                "source-zone-name":"corpnet",
                "src-country-code2":"",
                "src-country-name":"",
                "src-nat-rule-name":"most-traffic",
                "syslog-hostname":"jpsyd-egress-fw1-ha0",
                "threat-severity":"",
                "timestamp":"2016-04-12T05:45:13.753Z",
                "url":"",
                "username":"super"
            };
            eventDetailView = new ShowEventDetails({
                context: new Slipstream.SDK.ActivityContext("event-viewer"),
                data: selectedRow
            });
            eventDetailView.render();
        });
        //
        it("Show raw logs", function(){
            var message = '<14>1 2013-12-20T15:27:13.440 srx210h-11.40 RT_IDP - IDP_ATTACK_LOG_EVENT [junos@2636.1.1.1.2.36 epoch-time="1387553232" ' 
                + 'message-type="ANOMALY" source-address="1.1.1.1" source-port="0" destination-address="2.1.1.1" destination-port="0" protocol-name="ICMP" ' 
                + 'service-name="ICMP" application-name="ICMP" rule-name="1" rulebase-name="IPS" policy-name="Test" repeat-count="0" action="IGNORE" ' 
                + 'threat-severity="LOW" attack-name="ICMP:EXPLOIT:DIFF-CSUM-IN-RESND" nat-source-address="0.0.0.0" nat-source-port="0" nat-destination-address="0.0.0.0" ' 
                + 'nat-destination-port="0" elapsed-time="0" inbound-bytes="0" outbound-bytes="0" inbound-packets="0" outbound-packets="0" source-zone-name="trust" ' 
                + 'source-interface-name="fe-0/0/2.0" destination-zone-name="untrust" destination-interface-name="fe-0/0/3.0" packet-log-id="0" message="-"] ';
            showRawLogView = new ShowRawLogs({
                context: new Slipstream.SDK.ActivityContext(), 
                message: message
            });
            showRawLogView.render();
        });
    });
});