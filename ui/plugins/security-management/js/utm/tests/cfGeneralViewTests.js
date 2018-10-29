define([
        '../../../../security-management/js/utm/views/contentFilteringGeneralFormView.js',
        '../../../../security-management/js/utm/models/contentFilteringModel.js'
], function(CfGeneralView, CfModel) {

    describe("contentFilteringGeneralFormView unit-tests", function() {
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
            view = new CfGeneralView(viewParams);

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
            view.form.should.exist;
        });

        it("view getTitle function works fine", function() {
            var title = view.getTitle();
            title.should.be.equal('');
        });

        it("view getSummary function works fine, notify-mail-sender is false", function() {
            view.render();
            $('#main-content').empty();
            $('#main-content').append(view.$el);

            $('#utm-contentfiltering-name').val("cfProfileName").trigger('change');
            $('#utm-contentfiltering-description').val("cfProfileDiscription").trigger('change');
            $('#notify-mail-sender').prop('checked', false).trigger('change');
            $('#notification-type').val("PROTOCOL").trigger('change');
            $('#custom-notification-message').val("test").trigger('change');

            var summary = view.getSummary();
            summary[1].value.should.be.equal('cfProfileName');
            summary[2].value.should.be.equal('cfProfileDiscription');
            summary[3].value.should.be.equal('disabled');
        });

        it("view getSummary function works fine, notify-mail-sender is true", function() {
            view.render();
            $('#main-content').empty();
            $('#main-content').append(view.$el);

            $('#utm-contentfiltering-name').val("cfProfileName").trigger('change');
            $('#utm-contentfiltering-description').val("cfProfileDiscription").trigger('change');
            $('#notify-mail-sender').prop('checked', true).trigger('change');
            $('#notification-type').val("PROTOCOL").trigger('change');
            $('#custom-notification-message').val("test").trigger('change');

            var summary = view.getSummary();
            summary[1].value.should.be.equal('cfProfileName');
            summary[2].value.should.be.equal('cfProfileDiscription');
            summary[3].value.should.be.equal('enabled');
        });

        it("Test beforePageChange, current step is larger than request step", function() {
            var ret = view.beforePageChange(2,1);
            ret.should.be.equal(true);
        });

        it("Test beforePageChange, form invalid check", function() {
            var logSpy = sinon.spy(console, "log"),
                isTextareaValid = sinon.stub(view, 'isTextareaValid',function(){
                    return false;
                });

            model.set("name", "");
            view.render();

            var ret = view.beforePageChange(1,2);

            assert(logSpy.calledWith('form is invalid'));
            isTextareaValid.called.should.be.equal(true);
            ret.should.be.equal(false);
            logSpy.restore();
            isTextareaValid.restore();
        });

        it("Test beforePageChange, model set successfully", function() {
            var jsonObj = {
                    "name": "cfProfileName", 
                    "description": "cfProfileDiscription", 
                    "notification-options": {
                        "custom-notification-message": "this is protocol", 
                        "notification-type": "PROTOCOL", 
                        "notify-mail-sender": true
                    }
            };
            model.set(jsonObj);
            view.render();

            var ret = view.beforePageChange(1,2);
            ret.should.be.equal(true);
        });
    });
});