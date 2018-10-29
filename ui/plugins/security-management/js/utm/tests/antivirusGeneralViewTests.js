/**
 * Created by honglijin on 7/25/16.
 */
define([
    '../models/antiVirusModel.js',
    '../views/antiVirusGeneralView.js'
], function (
    atVirusModel, atVirusGeneralView
) {
    describe('Antivirus General View Unit Tests',function(){
        var activity, context, view=null, model=null;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            context = new Slipstream.SDK.ActivityContext();
        });
        after(function(){
        });
        beforeEach(function() {
            model = new atVirusModel();
            view = new atVirusGeneralView({
                activity: activity,
                model:model,
                context:context,
                wizardView:{
                    addRemoteNameValidation:function(){console.log('Remote Name Validation.')}
                }
            });
        });
        afterEach(function(){
            view = null;
            model = null;
        });
        
        it('General view should exit', function(){
            view.should.exist;
        });
        
        it('Render general view', function(){
            view.render();
            view.form.should.exist;
        });
        
        it('Get general info without dropdown', function(){
            view.render();
            delete view.form.getInstantiatedWidgets()["dropDown_dropdown_engine_type"];
            view.getGeneralInfo();
        });
        
        it('Get default engine type value (JUNIPER_EXPRESS)', function(){
            view.render();
            view.$el.find('#dropdown_engine_type').val().should.equal("JUNIPER_EXPRESS");
        });

        it('Get modified engine type value (KASPERSKY)', function(){
            model.set('profile-type','KASPERSKY');
            view.render();
            view.$el.find('#dropdown_engine_type').val().should.equal("KASPERSKY");
        });
        
        it('Get the title of general view', function(){
            view.render();
            var title = view.getTitle();
            title.should.equal('[utm_antivirus_general_heading]');
        });

        it('Get the summary of general view', function(){
            var formData = {
                "name":"aaa",
                "description":"bbb",
                "profile-type":"KASPERSKY"
            };
            model.set(formData);
            view.render();
            var summary = view.getSummary();
            summary[1].value.should.equal('aaa');
            summary[2].value.should.equal('bbb');
            summary[3].value.should.equal('[utm_antivirus_profile_type_kaspersky]');
        });
        
        it('Before change page, it should allow to go back to privious step', function(){
            view.render();
            var bool = view.beforePageChange(2,1);
            bool.should.equal(true);
        });

        it('Before change page, it return false with invalid input(name is empty)', function(){
            view.render();
            var isTextareaValid = sinon.stub(view, 'isTextareaValid', function(){return false;});
            view.beforePageChange(1,2).should.equal(false);
            isTextareaValid.called.should.be.equal(true);
            isTextareaValid.restore();
        });

        it('Before change page, it return true with valid input', function(){
            var formData = {
                "name":"aaa",
                "description":"bbb",
                "profile-type":"KASPERSKY"
            };
            model.set(formData);
            view.render();
            var bool = view.beforePageChange(1,2);
            bool.should.equal(true);
        });
        
        it('Change the engine type and confirm YES', function(){
            
            //Spy on the view.createConfirmationDialog method
            var spyCreateConfirmationDialog = sinon.spy(view, 'createConfirmationDialog');
            //init the model view
            model.set('wizard_reset_flag', true);
            view.render();
            view.$el.find("#dropdown_engine_type").val('KASPERSKY');
            //trigger the yes event
            spyCreateConfirmationDialog.thisValues[0].confirmationDialogWidget.vent.trigger('yesEventTriggered');
            
            model.get('wizard_reset_flag').should.equal(false);
            spyCreateConfirmationDialog.restore();
        });
        

        it('Change the engine type and confirm NO', function(){

            //Spy on the view.createConfirmationDialog method
            var spyCreateConfirmationDialog = sinon.spy(view, 'createConfirmationDialog');
            //init the model view
            model.set('wizard_reset_flag', true);
            view.render();
            view.$el.find("#dropdown_engine_type").val('KASPERSKY');
            //trigger the no event
            spyCreateConfirmationDialog.thisValues[0].confirmationDialogWidget.vent.trigger('noEventTriggered');
            
            model.get('wizard_reset_flag').should.equal(true);
            spyCreateConfirmationDialog.restore();
        });
    });
});