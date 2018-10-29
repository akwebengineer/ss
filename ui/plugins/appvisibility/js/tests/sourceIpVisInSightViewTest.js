/*global describe, define, Slipstream, it, beforeEach, $, before, sinon, console, afterEach, after*/

define([    
    '../views/sourceipvisibility/sourceIpVisInSightView.js'
   
], function (SourceIpVisInSightView) {
    describe ('SourceIpVisInSightView UT', function() {
        
        var sourceIpVisInSightView, context = new Slipstream.SDK.ActivityContext(),
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
        sourceIpVisInSightView = new SourceIpVisInSightView(opt);


        describe('SourceIpVisInSightView test', function () {                

            it('buildTopRisksView', function () {  
                
                var state;
                state = sourceIpVisInSightView.buildTopRisksView();
                assert(state === null);
                assert(typeof state === "object");
                   
            });

            it('buildTopCatView', function () {  
                
                var state;
                state = sourceIpVisInSightView.buildTopCatView();
                assert(state === null);
                assert(typeof state === "object");
                   
            });

            it('buildTopCharView', function () {  
                
                var state;
                state = sourceIpVisInSightView.buildTopCharView();
                assert(state === null);
                assert(typeof state === "object");
                   
            });

            it('buildTopUsersView', function () { 
                
                var state;
                var stub = sinon.stub(sourceIpVisInSightView, 'buildTopNView');
                state = sourceIpVisInSightView.buildTopUsersView();
                stub.called.should.be.equal(true);
                stub.restore();          
                  
            });      
        });
      
    });

});