define([
    '../../conf/manageLoggingNodesIntegratedGridConfig.js',
    '../../../../../ui-common/js/common/utils/SmUtil.js'
], function (LNIConf,SmUtil) {

    describe('Manage Logging Nodes Integrated GridConfig UT', function() {

        var conf,arg;
        sm = new SmUtil();
        it('Checks if the config object is created properly', function() {
            conf = new LNIConf(new Slipstream.SDK.ActivityContext());
            conf.should.exist;
        });

        it('Checks if the configurations are returned properly', function() {
            var values = conf.getValues();
            $.isEmptyObject(values).should.be.equal(false);
            values['title'].should.be.equal('[log_director]');
        });

         it('set Custom Action Status', function() {
            var values = conf.getValues(),arg;         
            sm.checkPermission = function(){
                return true
            };
            var selectedRows ={
                                numberOfSelectedRows : 1,
                                selectedRows : {
                                 '0' : {
                                    'special-node-type' : "Log Receiver"
                                 }
                               }
                              };
            var empty = function(){};               
            arg = values.actionButtons.actionStatusCallback(selectedRows,empty,empty);            
            assert(typeof arg === "undefined");
            values['url'].should.be.equal("/api/juniper/ecm/log-collector-nodes/all");
                      
        });

         it('enable Syslog', function() {
            var values = conf.getValues();
            var selectedRows ={
                                numberOfSelectedRows : 0,
                                selectedRows : {
                                 '0' : {
                                    'special-node-type' : "Log Receiver"
                                 }
                               }
                              };                              
             var empty = function(){};                 
            arg = values.actionButtons.actionStatusCallback(selectedRows,empty,empty);
            assert(typeof arg === "undefined");

        }); 

        it('Formatter Not Applicable', function() {
            var values = conf.getValues();           
            arg = values.columns[4].formatter();
            assert(typeof arg === "string");
        }) ;

        it('Formatter display LCType', function() {
            var values = conf.getValues();            
            arg = values.columns[2].formatter();
            assert(typeof arg === "string");
        }) ;

        it('Formatter convert Status', function() {
            var values = conf.getValues();            
            arg = values.columns[5].formatter();
            assert(typeof arg === "string");
        }) ;

        it('json Records', function() {
            var values = conf.getValues();   
            var data = {'log-collector-nodes' : { }}; 
            arg = values.jsonRecords(data);
            assert(typeof arg === "undefined");
            values['jsonRoot'].should.be.equal("log-collector-nodes.log-collector-node");           
        });

        it('Formatter cellvalue', function() {
            var values = conf.getValues();                   
            arg = values.columns[4].formatter("cellvalue");
            assert(typeof arg === "string");            
        });
    });

});