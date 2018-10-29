/**
 * Test file for Block Manager.
 * @module
 * @name BlockManagerTest
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(["../blockManager.js", "../blockModule.js"], function (BlockManager, BlockModule) {

    describe('Block manager UT', function () {
        var blockManager, stub1, stub2;
        before(function () {
            blockManager = new BlockManager();
            stub1 = sinon.stub(BlockModule, 'start');
            stub2 = sinon.stub(BlockModule, 'stop');
        });

        after(function () {
            stub1.restore();
            stub2.restore();
        });

        it('Checks if the instance exist', function () {
            blockManager.should.exist;
        });

        it('Checks if the block module workflow is handled properly', function () {
            var options = {
                input: 'Dummy Input',
                activity: 'dummy activity'
            };
            blockManager.startBlockWorkFlow(options);

            stub1.called.should.be.equal(true);
            stub2.called.should.be.equal(true);

            stub1.args[0][0].activity.should.be.equal(options.activity);
            stub1.args[0][0].input.should.be.equal(options.input);

        });

    });


});