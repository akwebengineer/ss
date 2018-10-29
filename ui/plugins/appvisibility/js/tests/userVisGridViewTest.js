define(['../../../appvisibility/js/views/uservisibility/userVisGridView.js'], function (UserVisGridView) {    
    describe ('userVisGridView UT', function() {  
        
        var userVisGridView, CUID = '', persistence, opt = {},
            activity = new Slipstream.SDK.Activity(),
            context = new Slipstream.SDK.ActivityContext(),
            policy = {
                id: 123
            };
            context.startActivityForResult = function(){};
            activity["context"] = context;
        opt = {
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
        userVisGridView = new UserVisGridView(opt);      

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
            state = userVisGridView.render();           
            assert(typeof state === "object");
        });

        it('buildInSightView', function () {  
            var state;
            state = userVisGridView.buildInSightView();           
            assert(typeof state === "object");
        });

        it('bindGridEvents', function () { 
            var spy,spy1;
            spy = sinon.spy(userVisGridView.$el,'off');
            spy1 = sinon.spy(userVisGridView.$el,'on');
            userVisGridView.bindGridEvents();   
            spy.called.should.be.equal(true);
            spy1.called.should.be.equal(true);
            spy.restore();
            spy1.restore();         
        });

        it('bindGridEvents has jumped', function () { 
            
            userVisGridView.options.filters = {
              time : {
                        startTime : '',
                        endTime : ''
                    },  
              filterBy : {
                 searchBy :"user" 
              }  
            };
            var spy,spy1;
            spy = sinon.spy(userVisGridView.$el,'off');
            spy1 = sinon.spy(userVisGridView.$el,'on');
            userVisGridView.bindGridEvents();   
            spy.called.should.be.equal(true);
            spy1.called.should.be.equal(true);
            spy.restore();
            spy1.restore();         
        });

        it('onUserJumpedBlockUsers ', function() {
            var e= {},stub1;
            stub1 = sinon.stub(userVisGridView,'handleBlock');
            userVisGridView.onUserJumpedBlockUsers(e);
            stub1.called.should.be.equal(true);
            stub1.restore();          
        });

        it('handleBlock', function() {
            var input= {selectedUsers : "sd"},stub1;
            userVisGridView.handleBlock(input);
        });

        it('onBlockUser', function () {  
            var e ={}, 
            row = {
                selectedRows : {
                     length : 0                       
                }
            };
            userVisGridView.onBlockUser(e, row);
            expect(userVisGridView).to.exist;
            expect(userVisGridView.overlayWidgetObj).to.not.exist;                  
        });

        it('onBlockUser', function () {  
            var e = {}, 
            row = {
                selectedRows : [{
                    'name' : []                        
                }]
            };     
            userVisGridView.onBlockUser(e, row);           
            expect(userVisGridView).to.exist;
            expect(userVisGridView.overlayWidgetObj).to.exist;
        });      

        it('buildGridView', function () {  
            var state;
            state = userVisGridView.buildGridView();            
            assert(typeof state === "object");
        });

        it('jumpToAppOrUsers', function() {
            var jumpEvent = {
                target : {
                    "data-cell" : "HTTP"
                }
            };
            userVisGridView.jumpToAppOrUsers(jumpEvent);
        });

        it('jump to EV on session count', function(){
            userVisGridView.jumpToEVonSessionCount({});
        });
            
    });  
});
 