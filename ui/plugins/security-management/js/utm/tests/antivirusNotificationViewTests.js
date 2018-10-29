/**
 * AntiVirus Notification View Unit Test
 */
define([
    '../models/antiVirusModel.js',
    '../views/antiVirusNotificationView.js'
],function (
    atVirusModel,
    atVirusNotificationView
) {
    describe('AntiVirus Notification View Unit Test', function(){
        var activity, context, view=null, model=null;
        activity = new Slipstream.SDK.Activity();
        context = new Slipstream.SDK.ActivityContext();
        
        describe('Render Notification View', function(){
            var formElems;
            before(function(){
                model = new atVirusModel();
                view = new atVirusNotificationView({
                    activity: activity,
                    model: model,
                    context: context
                });
                view.render();
                formElems = view.$el;
            });
        
            after(function(){
                model=null;
                view=null;
            });
            it('Get title of notification view', function(){
                var title = view.getTitle();
                title.should.equal('[utm_antivirus_notification_heading]');
            });
        
            it('Form should exist', function(){
                view.form.should.exist;
                // view.$el.attr('class').should.equal('security-management');
                formElems.find('#checkbox_fallback_deny').prop('checked').should.equal(false);
                formElems.find('#checkbox_fallback_non_deny').prop('checked').should.equal(false);
                formElems.find('#checkbox_virus_detection').prop('checked').should.equal(false);
            });
        
        });
        
        describe('Check Box Should Display the Corresponding DIV', function(){
            var formElems;
            before(function(){
                model = new atVirusModel();
                view = new atVirusNotificationView({
                    activity: activity,
                    model: model,
                    context: context
                });
                view.render();
                formElems = view.$el;
            });
            after(function(){
                model=null;
                view=null;
            });

            it('Fallback deny', function(){
                formElems.find('#checkbox_fallback_deny').click();
                view.fallbackDenyChange();
                formElems.find(".fallback-deny-settings").css('display').should.equal('block');
                
            });
            it('Fallback non deny', function(){
                formElems.find('#checkbox_fallback_non_deny').click();
                view.fallbackNonDenyChange();
                formElems.find(".fallback-non-deny-settings").css('display').should.equal('block');
            });
            it('Virus detection', function(){
                formElems.find('#checkbox_virus_detection').click();
                view.virusDetectionChange();
                formElems.find(".virus-detected-settings").css('display').should.equal('block');
            });
        });

        describe('Before Page Change', function(){
            var formElems;
            before(function(){
                model = new atVirusModel();
                view = new atVirusNotificationView({
                    activity: activity,
                    model: model,
                    context: context
                });
                view.render();
                formElems = view.$el;
            });

            it('With invalid input', function(){
                var boolReturn, stubIsValidInput;
                stubIsValidInput = sinon.stub(view.form, 'isValidInput', function(){
                    return false;
                });
                boolReturn = view.beforePageChange();
                boolReturn.should.equal(false);
                stubIsValidInput.restore();
            });

            it('With valid input and save data into model', function(){
                var boolReturn;
                // Fallback deny section
                formElems.find('#checkbox_fallback_deny').prop('checked', true);
                formElems.find('#checkbox_allow_mail').prop('checked', true);
                formElems.find('#checkbox_display_hostname').prop('checked', true);
                formElems.find('#dropdown_fallback_notify_type').val('MESSAGE');
                formElems.find('#fallback_deny_subject').val('Block Subject');
                formElems.find('#fallback_deny_message').val('Block Message');
                formElems.find('#fallback_deny_mail').val('administrator@example.com');

                // Fallback non-deny section
                formElems.find('#checkbox_fallback_non_deny').prop('checked', true);
                formElems.find('#fallback_non_deny_subject').val('Non-block Subject');
                formElems.find('#fallback_non_deny_message').val('Non-block Message');

                // Virus detected section
                formElems.find('#checkbox_virus_detection').prop('checked', true);
                formElems.find('#dropdown_virus_notify_type').val('PROTOCOL');
                formElems.find('#virus_detected_subject').val('Virus Detection Subject');
                formElems.find('#virus_detected_message').val('Virus Detection Message');
                boolReturn = view.beforePageChange();
                boolReturn.should.equal(true);
                view=null;
            });

            it('Re-render the view with data from model correctly', function(){
                view = new atVirusNotificationView({
                    activity: activity,
                    model: model,
                    context: context
                });
                view.render();
                var formElems = view.$el;

                // Fallback deny section
                formElems.find('#checkbox_fallback_deny').prop('checked').should.equal(true);
                formElems.find('#checkbox_allow_mail').prop('checked').should.equal(true);
                formElems.find('#checkbox_display_hostname').prop('checked').should.equal(true);
                formElems.find('#dropdown_fallback_notify_type').val().should.equal('MESSAGE');
                formElems.find('#fallback_deny_subject').val().should.equal('Block Subject');
                formElems.find('#fallback_deny_message').val().should.equal('Block Message');
                formElems.find('#fallback_deny_mail').val().should.equal('administrator@example.com');

                // Fallback non-deny section
                formElems.find('#checkbox_fallback_non_deny').prop('checked').should.equal(true);
                formElems.find('#fallback_non_deny_subject').val().should.equal('Non-block Subject');
                formElems.find('#fallback_non_deny_message').val().should.equal('Non-block Message');

                // Virus detected section
                formElems.find('#checkbox_virus_detection').prop('checked').should.equal(true);
                formElems.find('#dropdown_virus_notify_type').val().should.equal('PROTOCOL');
                formElems.find('#virus_detected_subject').val().should.equal('Virus Detection Subject');
                formElems.find('#virus_detected_message').val().should.equal('Virus Detection Message');
            });

            it('Get summary while all checkbox checked', function(){
                var summary = view.getSummary();
                summary[1].value.should.equal('[enabled]');
                summary[2].value.should.equal('[enabled]');
                summary[3].value.should.equal('[enabled]');
                model=null;
                view=null;
            });

            it('Get summary while all checkbox unchecked', function(){
                model = new atVirusModel();
                view = new atVirusNotificationView({
                    activity: activity,
                    model: model,
                    context: context
                });
                view.render();
                var summary = view.getSummary();
                summary[1].value.should.equal('[disabled]');
                summary[2].value.should.equal('[disabled]');
                summary[3].value.should.equal('[disabled]');
            });
        });

    });
});