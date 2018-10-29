/**
 *
 */
define([
        '../views/serviceObjectTreeView.js',
        '../widgets/serviceListBuilder.js'
],function( ServiceTooltipView, ListBuilder ){
    describe("ServiceObjectTreeView Unit Test", function(){
        var context, activity;
        var view = null;
        var intent, model = null;
        var parentView = null;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            contextStub = sinon.stub(activity, 'getContext', function(){
                return new Slipstream.SDK.ActivityContext();
            });
            parentView = new ListBuilder({
            	activity:activity,
                context: activity.getContext()
            });
        });

        after(function(){
            contextStub.restore();
        });

        beforeEach(function(){
            view = new ServiceTooltipView({
                context: parentView.context,
                activity : activity,
                parentView: parentView
            });
        });

        it("View should exist", function(){
            view.should.exist;
        });

        it("View.form should exist", function(){
            view.render();
            view.form.should.exist;
        });

        it("Test close function", function(){
            view.render();
            parentView.tooltipOverlay = {
                destroy: function() {}
            };
            var destroySpy = sinon.spy(view.parentView.tooltipOverlay, 'destroy');
            view.close(new $.Event());
            destroySpy.calledOnce.should.be.true;
            destroySpy.restore();
        });
        

        it("Test url function with null id", function(){
            view.objectId = 360705;
            var node = {
                id : "#"
            };
            var ret = view.url(node);
            ret.should.be.equal("/api/juniper/sd/service-management/services/360705");
        });

        it("Test url function with id", function(){
            var node = {
                data:{
                    href:"/api/juniper/sd/service-management/services/360711"
                },
                id : "360711"
            };
            var ret = view.url(node);
            ret.should.be.equal("/api/juniper/sd/service-management/services/360711");
        });

        it("Test dataFilter function with service group data", function(){
            var data = '{"service":{"id":393483,"protocols":{"protocol":[]},"domain-name":"Global","domain-id":2,"name":"test","is-group":true,"description":"","members":{"member":[{"id":393472,"name":"aaaa","description":"","is-group":false,"uri":"","href":""},{"id":393486,"name":"aa","description":"","is-group":true,"uri":"","href":""}],"uri":"","total":0},"uri":"","href":""}}';
            var ret = view.dataFilter(data);
            ret.should.be.equal('{"data":{"id":393483,"protocols":{"protocol":[]},"domain-name":"Global","domain-id":2,"name":"test","is-group":true,"description":"","members":{"member":[{"id":393472,"name":"aaaa","description":"","is-group":false,"uri":"","href":""},{"id":393486,"name":"aa","description":"","is-group":true,"uri":"","href":""}],"uri":"","total":0},"uri":"","href":""},"text":"<b>test</b>: Service Group","children":[{"data":{"id":393472,"name":"aaaa","description":"","is-group":false,"uri":"","href":""},"text":"<b>aaaa</b>","children":false},{"data":{"id":393486,"name":"aa","description":"","is-group":true,"uri":"","href":""},"text":"<b>aa</b>: [tooltip_service_group]","children":true}]}');
        });

        it("Test dataFilter function with service data", function(){
            var data = '{"service":{"id":459008,"protocols":{"protocol":[{"protocol-number":1,"name":"ai","protocol-type":"PROTOCOL_OTHER"}]},"domain-name":"Global","domain-id":2,"name":"test","is-group":false,"description":"","members":{"member":[],"uri":"","total":0},"uri":"","href":""}}';
            var ret = view.dataFilter(data);
            ret.should.be.equal('{"data":{"id":459008,"protocols":{"protocol":[{"protocol-number":1,"name":"ai","protocol-type":"PROTOCOL_OTHER"}]},"domain-name":"Global","domain-id":2,"name":"test","is-group":false,"description":"","members":{"member":[],"uri":"","total":0},"uri":"","href":""},"text":"<b>test</b>","children":[]}');
        });

        it("Test onLoad function", function(){
            view.render();
            var logSpy = sinon.spy(console,"log");
            var expandNodeSpy = sinon.spy(view.treeWidget,"expandNode");
            view.onLoad();
            assert(logSpy.calledWith('tree loaded'));
            expandNodeSpy.calledOnce.should.be.true;
            logSpy.restore();
            expandNodeSpy.restore();
        });

        it("Test onExpand function", function(){
            var node = {
                id : "360711"
            };
            var logSpy = sinon.spy(console,"log");
            view.onExpand(node);
            assert(logSpy.calledWith('node expanded 360711'));
            logSpy.restore();
        });

        it("Test onCollapse function", function(){
            var node = {
                id : "360711"
            };
            var logSpy = sinon.spy(console,"log");
            view.onCollapse(node);
            assert(logSpy.calledWith('node collapsed 360711'));
            logSpy.restore();
        });
    });
})