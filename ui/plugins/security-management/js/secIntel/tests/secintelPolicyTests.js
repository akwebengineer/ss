define([
   '../../../../security-management/js/secIntel/models/secIntelPolicyModel.js',
   '../../../../security-management/js/secIntel/views/secintelPolicyView.js'
], function(
   secIntelPolicyModel,
   secIntelPolicyView
) {



 describe("Security Intelligence Policies unit-tests", function() {
     var activity, stub;
     before(function() {
         activity = new Slipstream.SDK.Activity();

         stub = sinon.stub(activity, 'getContext', function() {

             return new Slipstream.SDK.ActivityContext();
         });
     });

     after(function() {
         stub.restore();
     });


     describe("Model tests", function() {

         describe("secIntelPolicyModel instantiation", function() {

             var model = new secIntelPolicyModel();

             it("model should exist", function() {

                 model.should.exist;

             });

         });

     });

     describe("View tests", function() {

         describe("secintelPolicyView create", function() {

             var view = null, intent, model = null;

             before(function(){

                 intent = sinon.stub(activity, 'getIntent', function() {

                     return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                 });

                 model = new secIntelPolicyModel();

             });


             after(function() {

                 intent.restore();

             });


             beforeEach(function() {

                 $.mockjax.clear();

                 view = new secIntelPolicyView({

                     activity: activity,

                     model: model

                 });

             });


             afterEach(function() {

             });


             it("view should exist", function() {

                 view.should.exist;

             });


             it("view.formMode should be CREATE", function() {

                 view.formMode.should.be.equal('CREATE');

             });

             it("view.formWidget should exist", function() {
                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'WebAppSecure')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/profileMock.json"
                 });

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'CommandAndControl')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/commandMock.json"
                 });

                 view.render();
                 $('#main-content').append(view.$el);
                 view.form.should.exist;

             });

             it.skip("global white list can be shown", function() {
                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'WebAppSecure')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/profileMock.json"
                 });

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'CommandAndControl')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/commandMock.json"
                 });

                 view.render();
                 $('#main-content').empty();
                 $('#main-content').append(view.$el);

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/custom-address-lists",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/addressMock.json"
                 });

                 $('#secintel-policy-global-white-list').click();
                 view.isCustomAddressListOverlayExisted.should.be.equal(true);

                 $('#secintel-custom-address-list-close').click();

             });

             it.skip("global black list can be shown", function() {
                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'WebAppSecure')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/profileMock.json"
                 });

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'CommandAndControl')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/commandMock.json"
                 });

                 view.render();
                 $('#main-content').empty();
                 $('#main-content').append(view.$el);

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/custom-address-lists",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/addressMock.json"
                 });

                 $('#secintel-policy-global-black-list').click();
                 view.isCustomAddressListOverlayExisted.should.be.equal(true);

                 $('#secintel-custom-address-list-close').click();

             });

             //Here does not mock ajax to get address list data, it is used to simulate ajax fetch data error
             it("custom address list fetch data error", function() {
                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'WebAppSecure')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/profileMock.json"
                 });

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'CommandAndControl')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/commandMock.json"
                 });

                 view.render();
                 $('#main-content').empty();
                 $('#main-content').append(view.$el);

                 $('#secintel-policy-global-black-list').click();
                 $('#secintel-custom-address-list-close').click();

             });

             //Here does not mock ajax to get dropdown list data, it is used to simulate ajax fetch data error
             it("secintel profile fetch data error", function() {
                 view.render();
                 $('#main-content').empty();
                 $('#main-content').append(view.$el);

             });

             it.skip("overlay should be destroyed when cancel button clicked", function() {
                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'WebAppSecure')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/profileMock.json"
                 });

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'CommandAndControl')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/commandMock.json"
                 });

                 view.render();

                 $('#main-content').append(view.$el);

                 // Imitate overlay.destory
                 view.activity.overlay = {destroy: function(){console.log('destroyed');}}

                 sinon.spy(view.activity.overlay, "destroy");

                 $('#secintel-policy-cancel').click();

                 view.activity.overlay.destroy.calledOnce.should.be.equal(true);

             });

             it.skip("Data should be saved correctly when ok button clicked(using mockjax)", function(done) {

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'WebAppSecure')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/profileSingleMock.json"
                 });

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'CommandAndControl')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/commandMock.json"
                 });

                 view.render();
                 $('#main-content').empty();
                 $('#main-content').append(view.$el);

                 setTimeout(setValue, 1000);

                 function setValue () {

                     $('#secintel-policy-name').val('my-secintel-policy').trigger('change');

                     $('#secintel-policy-description').val('created from ui').trigger('change');

                     $('#secintel-policy-profile-commandandcontrol').val('425987').trigger('change');

                     $('#secintel-policy-profile-webappsecure').val('425984').trigger('change');

                     $.mockjax({

                         url: "/api/juniper/sd/secintel-management/secintel-policies",

                         type: 'POST',

                         status: 200,

                         contentType: 'text/json',

                         dataType: 'json',

                         response: function(settings, done2) {

                             this.responseText = settings.data;

                             var policy = $.parseJSON(settings.data);

                             policy['secintel-policy'].name.should.be.equal('my-secintel-policy');

                             policy['secintel-policy'].description.should.be.equal('created from ui');

                             policy['secintel-policy']['secintel-profiles']['secintel-profile'][0].id.should.be.equal('425987');

                             policy['secintel-policy']['secintel-profiles']['secintel-profile'][1].id.should.be.equal('425984');

                             done2();

                             done();

                         }

                     });

                     $('#secintel-policy-save').click();
                 }

             });

             it.skip("Error message can be removed when configuration corrected", function(done) {

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'WebAppSecure')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/profileSingleMock.json"
                 });

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'CommandAndControl')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/commandMock.json"
                 });

                 view.render();

                 $('#main-content').empty();

                 $('#main-content').append(view.$el);

                 $('#secintel-policy-name').val('my-secintel-policy').trigger('change');

                 $('#secintel-policy-description').val('created from ui').trigger('change');

                 $('#secintel-policy-profile-commandandcontrol').val('').trigger('change');

                 $('#secintel-policy-profile-webappsecure').val('').trigger('change');

                 $('#secintel-policy-save').click();

                 setTimeout(setValue, 1000);

                 function setValue () {
                     $.mockjax({

                         url: "/api/juniper/sd/secintel-management/secintel-policies",

                         type: 'POST',

                         status: 200,

                         contentType: 'text/json',

                         dataType: 'json',

                         response: function(settings, done2) {
                             this.responseText = settings.data;

                             var policy = $.parseJSON(settings.data);

                             policy['secintel-policy'].name.should.be.equal('my-secintel-policy');

                             policy['secintel-policy'].description.should.be.equal('created from ui');

                             policy['secintel-policy']['secintel-profiles']['secintel-profile'][0].id.should.be.equal('425987');

                             policy['secintel-policy']['secintel-profiles']['secintel-profile'][1].id.should.be.equal('425984');

                             done2();
    
                             done();
                         }
                     });

                     $('#secintel-policy-profile-commandandcontrol').val('425987').trigger('change');

                     $('#secintel-policy-profile-webappsecure').val('425984').trigger('change');

                     $('#secintel-policy-save').click();
                 }
             });

             it("Error info should be shown if form is invalid when ok button clicked", function() {

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'WebAppSecure')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/profileMock.json"
                 });

                 $.mockjax({
                     url: "/api/juniper/sd/secintel-management/secintel-profiles?filter=(category eq 'CommandAndControl')",
                     proxy: "installed_plugins/security-management/js/secIntel/tests/commandMock.json"
                 });

                 view.render();

                 $('#main-content').append(view.$el);

                 if(console.log.restore) {
                     console.log.restore();
                 }
                 var logSpy = sinon.spy(console, "log"),
                     isValidInput= sinon.stub(view.form, 'isValidInput', function(){return false;});

                 $('#secintel-policy-name').val('').trigger('change');

                 view.submit({preventDefault: function(){}});


                 assert(logSpy.calledWith('form is invalid'));
                 isValidInput.restore();
                 logSpy.restore();

             });

         });

     });

 });

});