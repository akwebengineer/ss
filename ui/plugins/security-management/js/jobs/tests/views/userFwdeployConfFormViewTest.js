/**
 * UT for user Fw deploy Conf Form View Test
 *
 * @module userFwdeployConfFormViewTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
        '../../views/userFwdeployConfFormView.js'
    ],
    function (View) {

        describe('Check user Fw deploy Conf Form View UT', function () {
            var view, context, activity = new Slipstream.SDK.Activity();;
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                activity.context = context
                view = new View({
                    activity: activity,
                    context:context
                });
            });

            it('Checks if the View exist', function () {
                view.should.exist;
            });

            it('Checks render', function () {
                var initializeRequiredContainers = sinon.stub(view, 'initializeRequiredContainers');
                var constructTabContainerAndUpdateCliXml = sinon.stub(view, 'constructTabContainerAndUpdateCliXml');
                view.render();
                initializeRequiredContainers.called.should.be.equal(true);
                constructTabContainerAndUpdateCliXml.called.should.be.equal(true);
                initializeRequiredContainers.restore();
                constructTabContainerAndUpdateCliXml.restore();
            });

            it('Checks getConfigurationLegend', function () {
                var render = sinon.stub(Slipstream.SDK.Renderer, 'render');
                view.getConfigurationLegend();
                render.called.should.be.equal(true);
                render.restore();

            });
            it('Checks close', function () {
                var destroyProgressBar = sinon.stub(view, 'destroyProgressBar');
                view.close();
                destroyProgressBar.called.should.be.equal(true);
                destroyProgressBar.restore()
            });
            it('Checks constructTabContainerAndUpdateCliXml', function (done) {
               // debugger;
                view.tabContainer = $("<div class='configurationtabview'></div>");//view.$el.find('.configurationtabview').empty();
                var destroyProgressBar = sinon.stub(view, 'destroyProgressBar');
                var show = sinon.stub(view.tabContainer, 'show');
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/access-profile-management/job/undefined/config-preview?cli=true&feature=undefined',
                    "type": 'GET',
                    responseText: "test",
                    status: 200,
                    response: function (settings,done2) {
//                        debugger;
                        done2();

                        destroyProgressBar.restore();
                        show.restore();
                        done();
                    }
                });
//                debugger;
                view.constructTabContainerAndUpdateCliXml();

            });

            it('Checks closeOverlay', function () {
                view.activity = {
                    overlay: {
                        destroy: function(){}
                    }
                };
                var destroy = sinon.stub(view.activity.overlay, 'destroy');
                view.closeOverlay({preventDefault:function(){},isPropagationStopped:function(){}});
                destroy.called.should.be.equal(true);
                destroy.restore()
            });

        });
    });