define([
    '../models/webFilteringModel.js',
    '../views/webFilteringDetailView.js'
], function(
    wfModel,
    wfDetailView
) {
    describe("webFilteringDetailView unit-tests", function() {
        var activity, stub, view = null, intent, model = null;
        var context = new Slipstream.SDK.ActivityContext();
        before(function() {

           activity = new Slipstream.SDK.Activity();

           stub = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
           });

           activity.overlay = {
                    destroy: function() {}
           };

           intent = sinon.stub(activity, 'getIntent', function() {
               return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
           });

           model = new wfModel();

           view = new wfDetailView({
           context: context,
               activity: activity,
               model: model
           });

           getMessage = sinon.stub(context, "getMessage", function(msg) {return msg;})

        });

        after(function() {
           stub.restore();
           intent.restore();
           getMessage.restore();
        });

        it("view should exist", function() {
            view.should.exist;
        });

        it("view rendred, view.form should exist", function() {
           view.render();
           view.form.should.exist;
        });

        it("view.getFormConfig should works fine", function() {
            var wfObj = {
                "name": "sss", 
                "description": "fgj", 
                "id": 425984,
                "safe-search": true, 
                "custom-block-message": "this is a test", 
                "quarantine-custom-message": "this is a tt2", 
                "url-category-action-list": {
                    "url-category-action": [ 
                        {
                            "action": "QUARANTINE", 
                            "reputation-action": { }, 
                            "url-category-list": {
                                "id": 65629, 
                                "domain-id": 1,
                                "name": "Enhanced_Abused_Drugs"
                            }
                        }
                    ]
                }, 
                "site-reputation-actions": {
                    "moderately-safe": "PERMIT", 
                    "harmful": "QUARANTINE", 
                    "suspicious": "QUARANTINE", 
                    "very-safe": "PERMIT", 
                    "fairly-safe": "LOG_AND_PERMIT"
                }, 
                "default-action": "LOG_AND_PERMIT", 
                "fallback-default-action": "BLOCK", 
                "profile-type": "JUNIPER_ENHANCED", 
                "timeout": 200,
                "account": "count",
                "server" : "muffin",
                "port" : 200,
                "sockets" : 256,
                "custom-quarantine-message" : "test message"
            };
            model.set(wfObj);
            var ret = view.getFormConfig();
            ret.sections[0].elements[2].value.should.be.equal('[utm_web_filtering_engine_type_juniper_enhanced]');
        });

        it("view.getFormConfig should works fine，'profile-type' is 'SURF_CONTROL'", function() {
            model.set("profile-type","SURF_CONTROL");
            var ret = view.getFormConfig();
            ret.sections[0].elements[2].value.should.be.equal('[utm_web_filtering_engine_type_surf_control]');
        });

       it("view.getFormConfig should works fine，'profile-type' is 'WEBSENSE'", function() {
           model.set("profile-type","WEBSENSE");
           model.set("fallback-default-action","DEFAULTs");
           var ret = view.getFormConfig();
           ret.sections[0].elements[2].value.should.be.equal('[utm_web_filtering_engine_type_websense_redirect]');
           view.render();
       });

       it("view.getURLCategoriesGrid works fine", function() {
           var ret = view.getURLCategoriesGrid();
           expect(ret.columns).to.have.lengthOf(3);
       });
    });
});