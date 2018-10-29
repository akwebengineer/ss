/**
 * Test file for Block Module.
 * @module
 * @name BlockModuleTest
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(["../blockModule.js",
    '../views/blockApplicationView.js'], function (BlockModule, BlockView) {

    describe('Block module UT', function () {
        var initStub, renderStub, overlayBuildStub, progressBarStub, clearStub;

        before(function () {
            initStub = sinon.stub(BlockView.prototype, 'initialize');
            renderStub = sinon.stub(Backbone.Modal.prototype, 'render');
            overlayBuildStub = sinon.stub(BlockView.prototype, 'render');
            progressBarStub = sinon.stub(BlockView.prototype, 'displayProgressBar');
            clearStub = sinon.stub(BlockView.prototype, 'remove');
        });

        after(function () {
            initStub.restore();
            renderStub.restore();
            overlayBuildStub.restore();
            progressBarStub.restore();
            clearStub.restore();
        });

        it('Checks if on start of module, block view application is initialized or not', function () {

            BlockModule.start({
                "input": {},
                "activity": {
                    context: {
                        getMessage: function (key) {
                            return key;
                        }
                    }
                }
            });

            initStub.called.should.be.equal(true);
            renderStub.called.should.be.equal(true);
            overlayBuildStub.called.should.be.equal(true);
            progressBarStub.called.should.be.equal(true);

        });

        it('Checks if on stop of module, block view application is cleaned or not', function () {

            BlockModule.stop();
            clearStub.called.should.be.equal(true);
        });

    });


});