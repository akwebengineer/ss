define([
    '../../views/basePolicyLockTooltipView.js'
], function (View) {

    describe('Base Policy Tooltip View UT', function () {
        var view, policyId = 123, userId = 'fakeId';

        describe('Object Creation', function () {

            after(function () {

            });

            it('Checks if the view object is created properly', function () {

                view = new View({
                    context: new Slipstream.SDK.ActivityContext(),
                    policyId: policyId,
                    lockInfo: {
                        'object-lock': {
                            'user-id': userId
                        }
                    }
                });

                view.should.exist;
                view.should.be.instanceof(Backbone.View);
                view.policyId.should.be.equal(policyId);

                view.gridEl = view.$el.append($('<div/>'));
            });

            it('Checks the rendering of view', function() {

                view.render();
                _.isEmpty(view.$el.html()).should.be.equal(false);
            });

            it('Checks unlock policy event', function() {

                view.gridEl.bind('unlockPolicyEvent', function(event, data, policyId) {
                    policyId.should.be.equal(view.policyId);
                });

                view.unlockPolicy();

            });
        });
    });
});