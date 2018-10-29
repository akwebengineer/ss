define([
    '../models/contentFilteringModel.js',
    '../views/contentFilteringDetailView.js'
], function(
    cfModel,
    cfDetailView
) {
    describe("contentFilteringDetailView unit-tests", function() {
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

           model = new cfModel();

           view = new cfDetailView({
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

        it("view.getFormConfig should works fine, 'notification-type' is PROTOCOL", function() {
            var cfObj = {
                    "name": "cdName",
                    "definition-type": "CUSTOM",
                    "permit-command-list": {
                        "permit-command": [
                            "head"
                        ]
                    },
                    "block-content-type-list": {
                        "block-content-type": [
                            "ACTIVEX",
                            "EXE",
                            "JAVA_APPLET",
                            "HTTP_COOKIE",
                            "ZIP"
                        ]
                    },
                    "block-file-extension-list": {
                        "block-file-extension": [
                            "exe",
                            "pdf"
                        ]
                    },
                    "notification-options": {
                        "custom-notification-message": "ppp",
                        "notification-type": "PROTOCOL",
                        "notify-mail-sender": true
                    },
                    "block-command-list": {
                        "block-command": [
                            "get"
                        ]
                    },
                    "block-mime-list": {
                        "block-mime": [
                            "video/quick"
                        ]
                    },
                    "block-mime-exception-list": {
                        "block-mime-exception": [
                            "image/that"
                        ]
                    }
                };
            model.set(cfObj);
            var ret = view.getFormConfig();
            ret.sections[1].elements[1].value.should.be.equal('[utm_content_filtering_notification_type_protocol]');
        });

        it("view.getFormConfig should works fine, 'notification-type' is MESSAGE", function() {
            var cfObj = {
                    "name": "cdName",
                    "definition-type": "CUSTOM",
                    "block-content-type-list": {
                        "block-content-type": [
                            "ACTIVEX",
                            "EXE",
                            "JAVA_APPLET",
                            "HTTP_COOKIE",
                            "ZIP"
                        ]
                    },
                    "block-file-extension-list": {
                        "block-file-extension": [
                            "exe",
                            "pdf"
                        ]
                    },
                    "notification-options": {
                        "custom-notification-message": "ppp",
                        "notification-type": "MESSAGE",
                        "notify-mail-sender": true
                    },
                    "block-mime-list": {
                        "block-mime": [
                            "video/quick"
                        ]
                    },
                    "block-mime-exception-list": {
                        "block-mime-exception": [
                            "image/that"
                        ]
                    }
                };
            model.set(cfObj);
            var ret = view.getFormConfig();
            ret.sections[1].elements[1].value.should.be.equal('[utm_content_filtering_notification_type_message]');
        });

        it("view.getFormConfig should works fine, 'notification-type' is DEFAULT", function() {
            var cfObj = {
                    "name": "cdName",
                    "definition-type": "CUSTOM",
                    "block-content-type-list": {
                        "block-content-type": [
                            "ACTIVEX",
                            "EXE",
                            "JAVA_APPLET",
                            "HTTP_COOKIE",
                            "ZIP",
                            "GGG"
                        ]
                    },
                    "block-file-extension-list": {
                        "block-file-extension": [
                            "exe",
                            "pdf"
                        ]
                    },
                    "block-command-list": {
                        "block-command": ""
                    },
                    "notification-options": {
                        "custom-notification-message": "ppp",
                        "notification-type": "DEFAULT",
                        "notify-mail-sender": true
                    },
                    "block-mime-list": {
                        "block-mime": [
                            "video/quick"
                        ]
                    },
                    "block-mime-exception-list": {
                        "block-mime-exception": [
                            "image/that"
                        ]
                    }
                };
            model.set(cfObj);
            var ret = view.getFormConfig();
            ret.sections[1].elements[1].value.should.be.equal('');
        });
    });
});