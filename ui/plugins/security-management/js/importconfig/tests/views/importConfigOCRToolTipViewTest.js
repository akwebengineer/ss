define([
    '../../views/importConfigOCRToolTipView.js'
], function (View) {

    describe('Import Config OCR Tooltip View UT', function () {
        var view;
        describe('Basic functionality', function () {
            before(function () {
                view = new View({});
            });

            it('Checks if the object is created successfully', function () {
                view.should.exist;
            });

            it('Checks if the render is called properly', function () {
                view.render();
                view.form.should.exist;
            });

            it('Closes the tooltip properly', function () {

                var stub, overlay = {
                    destroy: function () {
                    }
                };
                view.activity = {
                    toolTipOverlay: overlay
                };

                stub = sinon.stub(view.activity.toolTipOverlay, 'destroy');

                view.$el.bind('dummyEvent', $.proxy(view.closeToolTip, view));
                view.$el.trigger('dummyEvent');

                stub.called.should.be.equal(true);
                stub.restore();
            });
        });

    });

});
