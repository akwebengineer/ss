
define(['../../../appvisibility/js/views/sourceipvisibility/sourceIpVisGridView.js'], function (SourceIpVisGridView) {    
    describe ('sourceIpVisGridView UT', function() {  
        
        var sourceIpVisInSightView, persistence,
            policy = {
                id: 123
            }, 
            CUID = '',      
            opt ={     
            filters:{
                time :{
                    startTime : '',
                    endTime : ''
                }
            },
            context: new Slipstream.SDK.ActivityContext(),
            cuid: CUID,
            extras:{},       
            actionEvents:{},
            activity: new Slipstream.SDK.Activity()
        };
        sourceIpVisGridView = new SourceIpVisGridView(opt);   

        //executes before every it()
        beforeEach(function(){
            persistence = sinon.stub(Slipstream.SDK.Preferences, 'fetch', function () {
                return '';
            });
        });

        //executes after every it()
        afterEach(function(){
            persistence.restore();
        });   

        it('render', function () {            
            var state;
            state = sourceIpVisGridView.render();           
            assert(typeof state === "object");
               
        });

        it('buildInSightView', function () {  
            var state;
            state = sourceIpVisGridView.buildInSightView();           
            assert(typeof state === "object");
               
        });

        it('bindGridEvents', function () { 
            var spy,spy1;
            spy = sinon.spy(sourceIpVisGridView.$el,'off');
            spy1 = sinon.spy(sourceIpVisGridView.$el,'on');
            sourceIpVisGridView.bindGridEvents();   
            spy.called.should.be.equal(true);
            spy1.called.should.be.equal(true);
            spy.restore();
            spy1.restore();         
        });

        it('onBlockIP', function () {  
            var e ={}, 
            row = {
                    selectedRows :{
                         length :0                       
                    }
                  };

            sourceIpVisGridView.onBlockIP(e, row);
            expect(sourceIpVisGridView).to.exist;
            expect(sourceIpVisGridView.overlayWidgetObj).to.not.exist;                  
             
        });

        it('onBlockIP', function () {  
            var e ={}, 
            row = {
                    selectedRows :[{
                        'name' :[]                        
                    }]
                  };     
            sourceIpVisGridView.onBlockIP(e, row);           
            expect(sourceIpVisGridView).to.exist;
            expect(sourceIpVisGridView.overlayWidgetObj).to.exist;
        });      

        it('buildGridView', function () {  
            var state;
            state = sourceIpVisGridView.buildGridView();            
            assert(typeof state === "object");
        });

        it('jumpToAppOrUsers', function() {
            var jumpEvent = {
                target : {
                    "data-cell" : "HTTP"
                }
            };
            sourceIpVisGridView.jumpToAppOrUsers(jumpEvent);
        });

        it('jump to EV on session count', function(){
            sourceIpVisGridView.jumpToEVonSessionCount({});
        });
            
    });  
   
});
 