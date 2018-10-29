define([
    '../blockModuleActivity.js',
    '../blockModule.js'
], function (Activity, BlockModule) {

    var blockActivity;

    describe('block Config Activity UT', function () {
        var stub1, stub2;
        before(function () {
            blockActivity = new Activity();
            stub1 = sinon.stub(BlockModule, 'start');
            stub2 = sinon.stub(BlockModule, 'stop');
        });

        after(function () {
            stub1.restore();
            stub2.restore();
        });

        it('Checks if the activity object is created properly', function () {
            blockActivity.should.exist;
            blockActivity.should.be.instanceof(Slipstream.SDK.Activity);
        });

        it('Checks if the on start calls the Block Manager start workflow properly', function () {
            blockActivity.getExtras = blockActivity.getExtras || function () {
            };


            var stub = sinon.stub(blockActivity, 'getExtras', function () {
                return 'dummyData';
            });
            blockActivity.onStart();
            stub1.called.should.be.equal(true);
            stub2.called.should.be.equal(true);

            stub1.args[0][0].input.should.be.equal('dummyData');
        });

    });
});