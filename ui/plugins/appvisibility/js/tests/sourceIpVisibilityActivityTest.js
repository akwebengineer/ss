define([    
    '../sourceIpVisibilityActivity.js'
   
], function (SourceIpVisibilityActivity) {
    describe ('sourceIpVisibilityActivity UT', function() {
        
        var sourceIpVisibilityActivity, context = new Slipstream.SDK.ActivityContext(),
            policy = {id: 123}, CUID = '';       
        var opt ={     
            filters:{
                time :{
                    startTime : '',
                    endTime : ''
                }
            },
            context: context,
            cuid: CUID,
            extras:{},       
            actionEvents:{}
        };
        sourceIpVisibilityActivity = new SourceIpVisibilityActivity(opt);
        sourceIpVisibilityActivity.context ={
            getMessage : function(){
                    return "sourceip"
                },
            getHelpKey : function(){
                return "sourceip"
            }      
        };           

    describe('sourceIpVisibilityActivity test', function () {              

        it('Landing Page Title', function () {            
            var state, spy;
            spy = sinon.spy(sourceIpVisibilityActivity,'getContext');
            state = sourceIpVisibilityActivity.landingPageTitle();
            spy.called.should.be.equal(true);
            spy.restore();            
            assert(typeof state === "string");               
        });

        it('landingPageHelpTitle', function () {            
            var state;
            state = sourceIpVisibilityActivity.landingPageHelpTitle();
            assert(typeof state === "object");
               
        });

        it('graphTitle', function () {             
            var state;
            state = sourceIpVisibilityActivity.graphTitle();
            assert(typeof state === "string");
               
        });
    });
  });

});

