/**
 *  A view implementing email form workflow for Create Alert Wizard
 *
 * @module emailAlertView unit tests
 * @author shinig
 * @copyright Juniper Networks, Inc. 2016
 */

define([
	"../../../../event-viewer/js/eventviewer/views/emailAlertView.js",
	"../../../../event-viewer/js/eventviewer/models/alertDefinitionModel.js",
	'../../../../sd-common/js/common/widgets/recipients/recipientsWidget.js',
	'../../../../event-viewer/js/eventviewer/models/alertDefinitionModel.js',
	'../../../../sd-common/js/common/widgets/recipients/models/spaceUsersCollection.js',
    '../../../../sd-common/js/common/widgets/recipients/models/usersModel.js'
	], function(EmailAlertView, AlertDefinitionModel, RecipientsWidget, AlertDefinitionModel, UsersCollection, UsersModel) {

	var activity = new Slipstream.SDK.Activity(), context,
        view, model;

	describe("Alert Wizard Add E-Mail Information view unit tests", function() {
        describe("Alert Wizard initialization", function() {
            before(function(){
                model = new AlertDefinitionModel();
                context = new Slipstream.SDK.ActivityContext();
                view = new EmailAlertView({
                    activity: activity,
                    context: context,
                    model: model,
                    setTitle : false,
                    showSubject: false
                });

                $.mockjax({
                    url: "/api/space/user-management/users",
                    type: 'GET',
                    responseText: {"users":{"user": [{"@key":"1032","name":"super","primaryEmail":"super@juniper.net","firstName":"Open","lastName":"Space","roleType":"ALL_ACCESS"}]}}
                });
            });

            after(function () {

            });

            it("model exists ?", function() {
                model.should.exist;
            });

            it("Add E-Mail View exists ?", function() {
                view.should.exist;
            });

            it("Add Email View rendered ?", function() {
                view.render();
                view.formWidget.should.exist;
            });

            it("Add Email View rendered on click of Back button", function() {
                var dataObj = {
                   "additional-emails" : "super@juniper.net",
                   "custom-message" : "Generates Alert for Firewall"
                };
                model.set(dataObj);
                view.render();
                view.formWidget.should.exist;
            });


            describe("Check Add Email Information View has Valid Input beforePageChange", function() {

                var isValidInput, setEmailInfo;
                beforeEach(function() {
                    isValidInput = sinon.stub(view.formWidget, "isValidInput", function() { return true;})
                    setEmailInfo = sinon.stub(view, "setEmailInfo", function() {return true; })
                });

                afterEach(function(){
                    isValidInput.restore();
                    setEmailInfo.restore();
                });

                it("Check is the form valid", function() {
                    view.beforePageChange();
                    isValidInput.called.should.be.equal(true);
                    setEmailInfo.called.should.be.equal(false);
                });

            });

            describe("Check Add Email view isn't have Valid Input beforePageChange", function() {

                var isValidInput;
                beforeEach(function() {
                    isValidInput = sinon.stub(view.formWidget, "isValidInput", function() { return false;})
                });

                afterEach(function(){
                    isValidInput.restore();
                });

                it("Check is the form valid", function() {
                    view.beforePageChange();
                    isValidInput.called.should.be.equal(true);
                });

            });

            it("Return Title of the view - getTitle", function() {
                view.getTitle();
            });

            describe("Get Summary of Add Email view - getSummary", function() {

                var generateSummary;
                beforeEach(function() {
                    generateSummary = sinon.stub(view, "generateSummary", function() { return true;})
                });

                afterEach(function(){
                    generateSummary.restore();
                });

                it("Get form summary", function() {
                    view.getSummary();
                    generateSummary.called.should.be.equal(true);
                });

            });

            describe("Generate Summary for Add Email Information view - generateSummary", function() {
                var getFormData;

                beforeEach(function() {
                    getFormData = sinon.stub(view, "getFormData", function() { return true;});
                });

                afterEach(function(){
                    getFormData.restore();
                });

                it("Generate form summary", function() {
                    view.generateSummary();
                    getFormData.called.should.be.equal(true);
                });

            });

            it("Get formatted data from the form - getFormData", function() {
                view.getFormData();
            });


            it("Calling setEmailInfo to return json object", function() {
                var jsonDataObj = {
                    "additional-emails" : "super@juniper.net",
                    "custom-message" : "Generates Alert for Firewall"
                };

                view.setEmailInfo(jsonDataObj);
            });


        });

        describe("RecipientsWidget initialization", function(){
            var recipientsWidget, model, activity,
                event = {
                     type: 'click',
                     preventDefault: function () {}
                };

            before(function(){
                activity = new Slipstream.SDK.Activity();
                model = new AlertDefinitionModel();
                var attributes = {
                    'additional-emails' : "super@juniper.net",
                    'email-subject' : "Test Alert",
                    'comments' : "Generated alert"
                };
                model.set(attributes);
                recipientsWidget = new RecipientsWidget({
                    context : new Slipstream.SDK.ActivityContext(),
                    model : model,
                    onOverlay: true,
                    activity : activity
                });
            });

            it("RecipientsWidget should exists ?", function() {
                recipientsWidget.should.exist;
            });

            it("RecipientsWidget rendered ?", function() {
               var stub = sinon.stub(recipientsWidget, 'addDynamicFormConfig');
               recipientsWidget.render();
               stub.called.should.be.equal(true);
               stub.restore();
            });

            it("Check addDynamicFormConfig is called from RecipientsWidget", function(){
                var formConfiguration = {};
                recipientsWidget.addDynamicFormConfig(formConfiguration);
            });

            it("Save Recipient when form is valid from RecipientsWidget - saveRecipient ", function(){

                var additionalEmails = model.get('additional-emails'),
                    emailSubject = model.get('email-subject'),
                    comments    = model.get('comments');

                var isValidInput    = sinon.stub(recipientsWidget.formWidget, "isValidInput", function() { return true;}),
                    getValues       = sinon.stub(recipientsWidget, 'getValues', function() { return true;}),
                    cancelRecipient = sinon.stub(recipientsWidget, "cancelRecipient", function() { return true;});

                recipientsWidget.options.activity = {displayRecipientsDetails: function(additionalEmails, emailSubject, comments){console.log("displayRecipientsDetails called");}};
                sinon.spy(recipientsWidget.options.activity, "displayRecipientsDetails");

                recipientsWidget.saveRecipient(event);
                getValues.called.should.be.equal(false);
                isValidInput.calledOnce.should.be.equal(true);
                recipientsWidget.options.activity.displayRecipientsDetails.calledOnce.should.be.equal(false);
                cancelRecipient.calledOnce.should.be.equal(false);

                getValues.restore();
                isValidInput.restore();
                cancelRecipient.restore();
            });

            it("Return when form is invalid from RecipientsWidget - saveRecipient ", function(){
                var isValidInput    = sinon.stub(recipientsWidget.formWidget, "isValidInput", function() { return false;});

                recipientsWidget.saveRecipient(event);
                isValidInput.calledOnce.should.be.equal(true);

                isValidInput.restore();
            });

            it("call cancelRecipient from RecipientsWidget", function() {
                recipientsWidget.options.activity.overlayWidgetObj = {destroy: function(){console.log('destroyed');}}
                sinon.spy(recipientsWidget.options.activity.overlayWidgetObj, "destroy");
                recipientsWidget.cancelRecipient(event);
                recipientsWidget.options.activity.overlayWidgetObj.destroy.calledOnce.should.be.equal(true);
            });

            it("getUsers - success handler", function() {
                recipientsWidget.getUsers();

            });

            it("createEmailDropDownWidget", function() {
                var usersCollection = new UsersCollection(),
                    users = new UsersModel ({"firstName" : "Open",
                                             "lastName" : "Space",
                                             "name" : "super",
                                             "primaryEmail" : "super@juniper.net",
                                             "roleType" : "ALL_ACCESS"});
                usersCollection.add(users);
                var getUsers = sinon.stub(recipientsWidget, 'getUsers', function() { return usersCollection;});


                recipientsWidget.createEmailDropDownWidget();
                getUsers.called.should.be.equal(true);

                getUsers.restore();

            });


            it("Get the values from Recipient widget - getValues", function() {
                recipientsWidget.getValues();

            });

        });


	});
});