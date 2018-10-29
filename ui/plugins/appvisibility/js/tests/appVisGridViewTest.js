define(['../../../appvisibility/js/views/gridView.js'], function (GridView) {    
    describe ('appVisGridView UT', function() {  
        
        var appVisGridView, CUID = '', persistence,
            activity = new Slipstream.SDK.Activity(),
            context = new Slipstream.SDK.ActivityContext(),
            options = {},
            policy = {
                id: 123
            };
            context.startActivityForResult = function(){};
            activity["context"] = context;
            activity.activityName = "baseVisibilityActivity";
            options = {     
                "activity": activity,
                filters: {
                    time : {
                        startTime : '',
                        endTime : ''
                    }
                },
                context: context,
                cuid: CUID,
                extras:{},       
                actionEvents:{},
                activity: activity
            };
        appVisGridView = new GridView(options);    

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
            state = appVisGridView.render();           
            assert(typeof state === "object");
        });

        it('buildInSightView', function () {  
            var state;
            state = appVisGridView.buildInSightView();           
            assert(typeof state === "object");
        });

        it('bindGridEvents', function () { 
            var spy,spy1;
            spy = sinon.spy(appVisGridView.$el,'off');
            spy1 = sinon.spy(appVisGridView.$el,'on');
            appVisGridView.bindGridEvents();   
            spy.called.should.be.equal(true);
            spy1.called.should.be.equal(true);
            spy.restore();
            spy1.restore();         
        });

         it('bindGridEvents has jumped', function () { 
            
            appVisGridView.options.filters = {
              time : {
                        startTime : '',
                        endTime : ''
                    },  
              filterBy : {
                 searchBy :"user" 
              }  
            };
            var spy,spy1;
            spy = sinon.spy(appVisGridView.$el,'off');
            spy1 = sinon.spy(appVisGridView.$el,'on');
            appVisGridView.bindGridEvents();   
            spy.called.should.be.equal(true);
            spy1.called.should.be.equal(true);
            spy.restore();
            spy1.restore();         
        });

        it('onBlockApplication', function () {  
            var e ={}, 
            row = {
                selectedRows :{
                    length :0                       
                }
            };
            appVisGridView.onBlockApplication(e, row);
            expect(appVisGridView).to.exist;
            expect(appVisGridView.overlayWidgetObj).to.not.exist;                  
             
        });

        it('onBlockApplication', function () {  
            var e = {}, 
            row = {
                selectedRows : [{
                    'name' : []                        
                }]
            };     
            appVisGridView.onBlockApplication(e, row);           
            expect(appVisGridView).to.exist;
            expect(appVisGridView.overlayWidgetObj).to.exist;
        });      

        it('buildGridView', function () {  
            var state;
            state = appVisGridView.buildGridView();            
            assert(typeof state === "object");
        });

        it('jumpToAppOrUsers', function() {
            var jumpEvent = {
                target : {
                    "data-cell" : "HTTP"
                }
            };
            appVisGridView.options.activity.activityName = "SourceIpVisibilityActivity";

            appVisGridView.jumpToAppOrUsers(jumpEvent);
        });

        it('jumpToAppOrUsers', function() {
            var jumpEvent = {
                target : {
                    "data-cell" : "HTTP"
                }
            };
            appVisGridView.options.activity.activityName = "UserVisibilityActivity";

            appVisGridView.jumpToAppOrUsers(jumpEvent);
        });

        it('onUserJumpedBlockApplication', function() {
            var e= {},stub1;
            stub1 = sinon.stub(appVisGridView,'internalBlock');
            appVisGridView.onUserJumpedBlockApplication(e);
            stub1.called.should.be.equal(true);
            stub1.restore();          
        });

        it('internalBlock', function() {
            var input= {selectedUsers : "sd"},stub1;
            appVisGridView.internalBlock(input);
        });
         
            
        it('onShowDetailViewEvent', function(){
            var e = {}, 
            row = {
                selectedRows : [{
                    'app-id' : 5                       
                }]
            }; 
            appVisGridView.onShowDetailViewEvent(e, row);
        });

        it('jump to EV on session count', function(){
            appVisGridView.jumpToEVonSessionCount({});
        });
    });  
});
 