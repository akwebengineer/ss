define([
    '../../views/importConfigSummaryReportView.js'
], function (View) {

    describe('Import Config Summary Report View UT', function () {
        var view;
        before(function () {
            var options = {
                dataObject: {
                    uuid: 'UUID'
                }
            };
            view = new View(options);
        });
        describe('Basic functionality', function () {

            it('Checks if the object is created successfully', function () {
                view.should.exist;
                view.uuid.should.be.equal('UUID');
            });

            it('Checks if the title is created properly', function () {
                var title = view.getTitle();
                title.should.be.equal('');
            });

            it('Checks if the render called the summary report creation properly', function () {
                var stub = sinon.stub(view, 'getSummaryReport');
                view.render();
                stub.called.should.be.equal(true);
                stub.restore();
            });

            it('Get summary report calls the summary report properly: Success', function (done) {
                var data = 'fakeData';
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/import/summary-report?*',
                    "type": 'GET',
                    responseText: data,
                    status: 200,
                    response: function (settings,done2) {
                        done2();
                        view.$el.html().should.be.equal(data);
                        done();
                    }
                });
                view.getSummaryReport();
            });

            it('Get summary report calls the summary report properly: Error', function (done) {
                $.mockjax.clear();
                $.mockjax({
                    "url": '/api/juniper/sd/policy-management/import/summary-report?*',
                    "type": 'GET',
                    responseText: null,
                    status: 404,
                    response: function (settings, done2) {
                        done2();
                        // nothing to test here.. no functionality defined
                        done();
                    }
                });
                view.getSummaryReport();
            });
        });

    });

});
