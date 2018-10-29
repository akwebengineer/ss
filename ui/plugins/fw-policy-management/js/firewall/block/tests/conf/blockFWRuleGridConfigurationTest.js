define(["../../conf/blockFWRuleGridConfiguration.js"], function(RuleGridConf){
        describe("Check rule grid configuration unit test", function(){
            var conf, context;
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                conf = new RuleGridConf(context);
            });

            it('Checks if the configuration exist', function () {
                conf.should.exist;
            });

            it('Checks if showNavigationControls flag is set to true', function () {
                assert.isTrue(conf.showNavigationControls, "showNavigationControl flag is set to true from block workflow");
            });  
        });
});