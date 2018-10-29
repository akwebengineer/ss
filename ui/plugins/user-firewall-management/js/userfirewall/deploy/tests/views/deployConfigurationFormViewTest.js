/**
 * UT for deploy configuration Form View
 *
 * @module deploy
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/deployConfigurationFormView.js'
], function (DeployConfigurationFormView ) {

    var view, getMessage, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();


    describe('Deploy Configuration Form View UT', function () {

        before(function () {
            activity.context = context;
            view = new DeployConfigurationFormView({
                               activity: activity,
                               context: context,
                               objId : '1234',
                               objType: 'ACTIVE_DIRECTORY'
                           });
            getMessage = sinon.stub(context, 'getMessage');
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Deploy Configuration Form view object is created properly', function () {
            view.should.exist;
        });
        describe('Check Render of Deploy Configuration Form view', function () {
            var constructTabContainerAndUpdateCliXml;
            before(function () {
                constructTabContainerAndUpdateCliXml = sinon.stub(view, 'constructTabContainerAndUpdateCliXml');
            });

            after(function () {
                constructTabContainerAndUpdateCliXml.restore();
            });
            it('Checks Render 0', function () {
                view.render();
                constructTabContainerAndUpdateCliXml.called.should.be.equal(true);
            });
        });

         describe('Check Get Configuration Legend of Deploy Configuration Form view', function () {
            var resp;
            it('Checks Get Configuration Legend 0 ', function () {
                resp = view.getConfigurationLegend();
                resp.should.be.equal("<label class=\"preview-legend\">\n\t<span class=\"preview-legend-green\">\n\t\t&nbsp;\n    </span>\n    <span class=\"preview-legend-added-label\">\n\t\t\n    </span>\n    <span class=\"preview-legend-red\">\n    \t&nbsp;\n    </span>\n    <span class=\"preview-legend-deleted-label\">\n\t\t\n    </span>\n    <span class=\"preview-legend-black\">\n    \t&nbsp;\n    </span>\n    <span class=\"preview-legend-modified-label\">\n\t\t\n    </span>\n    <span class=\"preview-legend-blue\">\n        &nbsp;\n    </span>\n    <span class=\"preview-legend-label\">\n\t\t\n    </span>\n</label>");
            });
        });

         describe('Check constructTabContainerAndUpdateCliXml of Deploy Configuration Form view', function () {
            var resp,destroyProgressBar;
                        before(function () {
                            destroyProgressBar = sinon.stub(view, 'destroyProgressBar');
                        });
                        after(function () {
                            destroyProgressBar.restore();
                        });
            it('Checks constructTabContainerAndUpdateCliXml 0', function () {
                view.constructTabContainerAndUpdateCliXml();
                destroyProgressBar.called.should.be.equal(false);
            });
        });

         describe('Check Close Overlay of Deploy Configuration Form view', function () {
            it('Checks close overlay 0', function () {
                view.activity.progressBar = {destroy: function(){console.log('destroyed');}}
                 view.activity.overlay = {destroy: function(){console.log('destroyed');}}
                 var destroy = sinon.stub(view.activity.overlay, "destroy");
                view.closeOverlay({
                    preventDefault: function () {
                    },
                    isPropagationStopped: function () {
                    }
                });
                destroy.calledOnce.should.be.equal(true);
                destroy.restore();
            });
        });

        describe('Check Close of Deploy Configuration Form view', function () {
        it('Checks close 0', function () {
             view.activity.progressBar = {destroy: function(){console.log('destroyed');}}
            var destroyProgressBar = sinon.stub(view, "destroyProgressBar");
            view.close();
            destroyProgressBar.calledOnce.should.be.equal(true);
            destroyProgressBar.restore();
        });
    });

    });
});