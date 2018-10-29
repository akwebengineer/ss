define([
        '../../../../security-management/js/utm/views/contentFilteringFileExtensionFormView.js',
        '../../../../security-management/js/utm/models/contentFilteringModel.js'
], function(CfExtensionView, CfModel) {

    describe("contentFilteringFileExtensionFormView unit-tests", function() {
        var view = null, wizardView = null, intent, model = null, getMessage = null;
        var context = new Slipstream.SDK.ActivityContext();
        var activity = new Slipstream.SDK.Activity();

        //executes once
        before(function () {
            intent = sinon.stub(activity, 'getIntent', function() {
                 return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });

            model = new CfModel();

            var viewParams = {
                context: context,
                activity: activity,
                model: model,
                title:''
            };
            view = new CfExtensionView(viewParams);

            getMessage = sinon.stub(context, "getMessage", function(msg) {return msg; })
            view.wizardView = {addRemoteNameValidation: function(){console.log('Remote name check');}}
        });

        after(function () {
            getMessage.restore();
            intent.restore();
        });

        it("view should exist", function() {
            view.should.exist;
        });

        it("view can be rendered successfully", function() {
            view.render();
            view.formWidget.should.exist;
        });

        it("view getTitle function works fine", function() {
            var title = view.getTitle();
            title.should.be.equal('utm_content_filtering_file_extensions:');
        });

        it("view getSummary function works fine", function() {
            view.render();
            $('#main-content').empty();
            $('#main-content').append(view.$el);

            var summary = view.getSummary();
            summary[0].label.should.be.equal('utm_content_filtering_file_extensions');
        });

        it("view beforePageChange works fine", function() {
            view.render();

            var ret = view.beforePageChange();
            ret.should.be.equal(true);
        });

        it("view beforePageChange works fine when form is invalid", function() {
            view.render();
            var logSpy = sinon.spy(console, "log");
            var isValidInput = sinon.stub(view.formWidget, 'isValidInput', function() {
                return 0;
            });
            view.beforePageChange();
            assert(logSpy.calledWith('form is invalid'));
            isValidInput.restore();
            logSpy.restore();
        });
    });
});