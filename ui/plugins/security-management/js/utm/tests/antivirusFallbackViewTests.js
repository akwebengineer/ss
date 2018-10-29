/**
 * AntiVirus Fallback View Unit Test
 */
define([
    '../models/antiVirusModel.js',
    '../views/antiVirusFallbackView.js'
], function (atVirusModel, atVirusFallbackView) {
    describe('AntiVirus Fallback View Unit Tests', function () {
        var activity, context, view = null, model = null;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            context = new Slipstream.SDK.ActivityContext();
            
        });
        beforeEach(function () {
            model = new atVirusModel();
            view = new atVirusFallbackView({
                activity: activity,
                model: model,
                context: context
            });
        });
        afterEach(function () {
            model=null;
            view=null;
        });
        it('Fallback view should exist', function () {
            view.should.exist;
        });
        it('Render fallback view, form should exist', function () {
            view.render();
            view.form.should.exist;
        });
        it('Get title of fallback view, should return title', function () {
            var title;
            title = view.getTitle();
            title.should.equal('[utm_antivirus_fallback_heading]');
        });

        describe('Engine Type: JUNIPER_EXPRESS / SOPHOS', function(){
            var formElems;
            beforeEach(function () {
                model = new atVirusModel();
                view = new atVirusFallbackView({
                    activity: activity,
                    model: model,
                    context: context
                });
                view.render();
                formElems = view.$el;
            });
            afterEach(function(){
                view=null;
                model=null;
            });
            it('Engine type is not KASPERSKY, should remove ".kaspersky-type-specific-settings"', function () {
                formElems.find('.kaspersky-type-specific-settings').length.should.equal(0);
            });
            it('Before change page with valid input, should set model correctly and return true', function () {
                var rtBool, fbOpts, scOpts;
                formElems.find('#dropdown_content_size').val('LOG_AND_PERMIT');
                formElems.find('#anti_virus_content_size_limit').val('1024');
                formElems.find('#dropdown_engine_error').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_default_action').val('LOG_AND_PERMIT');
                rtBool = view.beforePageChange();
                console.log(view.model.attributes);
                fbOpts = view.model.get('fallback-options');
                scOpts = view.model.get('scan-options');
                scOpts['content-size-limit'].should.equal('1024');
                fbOpts['content-size'].should.equal('LOG_AND_PERMIT');
                fbOpts['fallback-option']['engine-error'].should.equal('LOG_AND_PERMIT');
                fbOpts['fallback-option']['default-action'].should.equal('LOG_AND_PERMIT');
                rtBool.should.be.true;
            });
            it('Before change page with invalid input, should return false and console.log("form is invalid")', function () {
                var rtBool, stubValid, spyConsole;
                stubValid = sinon.stub(view.form, 'isValidInput', function () {
                    return false;
                });
                spyConsole = sinon.spy(console, 'log');
                rtBool = view.beforePageChange();
                spyConsole.calledWith('form is invalid').should.be.true;
                rtBool.should.be.false;
                stubValid.restore();
                spyConsole.restore();
            });
            it('Get summary of fallback view, should equal to the input values', function () {
                var summary;
                formElems.find('#dropdown_content_size').val('LOG_AND_PERMIT');
                formElems.find('#anti_virus_content_size_limit').val('1024');
                formElems.find('#dropdown_engine_error').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_default_action').val('LOG_AND_PERMIT');
                summary = view.getSummary();
                summary[1].value.should.equal('[utm_antivirus_log_and_permit]');
                summary[2].value.should.equal('1024');
                summary[3].value.should.equal('[utm_antivirus_log_and_permit]');
                summary[4].value.should.equal('[utm_antivirus_log_and_permit]');
            });
        });
        
        describe('Engine Type: KASPERSKY', function(){
            var formElems;
            beforeEach(function(){
                model = new atVirusModel();
                model.set('profile-type', 'KASPERSKY');
                view = new atVirusFallbackView({
                    activity: activity,
                    model: model,
                    context: context
                });
                view.render();
                formElems = view.$el;
            });
            afterEach(function(){
                view=null;
                model=null;
            });
            
            it('Before change page with valid input, should set model correctly and return true', function () {
                var rtBool, fbOpts, scOpts;
                formElems.find('#dropdown_content_size').val('LOG_AND_PERMIT');
                formElems.find('#anti_virus_content_size_limit').val('2048');
                formElems.find('#dropdown_engine_error').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_password').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_corrupt').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_decompress').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_default_action').val('LOG_AND_PERMIT');
                formElems.find('#anti_virus_file_extension').val('aaa,bbb');
                formElems.find('#anti_virus_file_extension').trigger('blur');
                rtBool = view.beforePageChange();
                fbOpts = view.model.get('fallback-options');
                scOpts = view.model.get('scan-options');

                fbOpts['content-size'].should.equal('LOG_AND_PERMIT');
                fbOpts['corrupt-file'].should.equal('LOG_AND_PERMIT');
                fbOpts['decompress-layer'].should.equal('LOG_AND_PERMIT');
                fbOpts['password-file'].should.equal('LOG_AND_PERMIT');
                fbOpts['fallback-option']['default-action'].should.equal('LOG_AND_PERMIT');
                fbOpts['fallback-option']['engine-error'].should.equal('LOG_AND_PERMIT');
                scOpts['content-size-limit'].should.equal('2048');
                scOpts['scan-file-extension'].should.equal('aaa, bbb');
                rtBool.should.equal(true);
            });
            
            it('Get summary of fallback view', function () {
                var summary;
                formElems.find('#dropdown_content_size').val('LOG_AND_PERMIT');
                formElems.find('#anti_virus_content_size_limit').val('2048');
                formElems.find('#dropdown_engine_error').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_password').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_corrupt').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_decompress').val('LOG_AND_PERMIT');
                formElems.find('#dropdown_default_action').val('LOG_AND_PERMIT');
                formElems.find('#anti_virus_file_extension').val('aaa,bbb');
                formElems.find('#anti_virus_file_extension').trigger('blur');
                summary = view.getSummary();
                summary[1].value.should.equal('[utm_antivirus_log_and_permit]');
                summary[2].value.should.equal('2048');
                summary[3].value.should.equal('[utm_antivirus_log_and_permit]');
                summary[4].value.should.equal('[utm_antivirus_log_and_permit]');
                summary[5].value.should.equal('[utm_antivirus_log_and_permit]');
                summary[6].value.should.equal('[utm_antivirus_log_and_permit]');
                summary[7].value.should.equal('[utm_antivirus_log_and_permit]');
                summary[8].value.should.equal('aaa, bbb');
            });
            
            it('Re-render the view should set input values correctly', function () {
                formElems.find('#dropdown_content_size').val('LOG_AND_PERMIT');
                formElems.find('#anti_virus_content_size_limit').val('2048');
                view.beforePageChange();
                view.render();
                formElems.find('#dropdown_content_size').val().should.equal('LOG_AND_PERMIT');
                formElems.find('#anti_virus_content_size_limit').val().should.equal('2048');
            });
        });
    });
});