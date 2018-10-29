/**
 * Overlay widget Test Application is a sample applcation that utilizes the overlay widget.
 *
 * @module OverlayTestApplication
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(['backbone',
    'widgets/overlay/overlayWidget',
    'widgets/overlay/tests/views/wideView',
    'widgets/overlay/tests/views/testView',
    'widgets/overlay/tests/views/fixedHeightView',
    'widgets/overlay/tests/views/zonePoliciesView',
    'widgets/overlay/tests/models/zonePoliciesModel',
    'widgets/shortWizard/tests/appShortWizard',
    'widgets/form/tests/view/formTabFormGridOverlayView',
    'text!widgets/overlay/tests/templates/overlayExample.html',
], function (Backbone, OverlayWidget, WideView, TestView, FixedHeightView, FormOverlayView, ZonePoliciesModel, PageOverlayView, FormTabFormGridOverlayView, example) {
    var OverlayView = Backbone.View.extend({
        events: {
            'click #nestedOverlay': 'nestedOverlay',
            'click #open': 'open',
            'change #formTestCaseLink': 'formTestCaseLink',
            'click #overlayWithFixedContainerTestCaseLink': 'overlayWithFixedContainerTestCaseLink',
            'change #formTestCaseLinkMin': 'formTestCaseLinkMin',
            'change #fullpageFormTestCaseLinkMin': 'fullpageFormTestCaseLinkMin',
            'change #fullpageFormTestCaseLink': 'fullpageFormTestCaseLink',
            'change #mediumFormWizardRadio': 'mediumFormWizardRadio',
            'change #largeFormWizardRadio': 'largeFormWizardRadio',
            'change #xlargeFormWizardRadio': 'xlargeFormWizardRadio',
            'change #fullpageFormWizardRadio': 'fullpageFormWizardRadio',
            'click #formTabGridFullPageOverlayLink': 'formTabGridFullpageOverlay'
        },
        initialize: function () {
            this.$el.append(example);
        },
        nestedOverlay: function () {
            var overlayViewObj = new WideView({});
            var conf = {
                view: overlayViewObj,
                cancelButton: false,
                okButton: false,
                showScrollbar: true,
                type: 'wide'
            };
            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        },
        open: function () {
            var overlaySize = $("input[name=overlaySize]:checked");
            var contentSize = $("input[name=contentSize]:checked");
            var contentHasTitle = $("#contentTitle");
            var contentHasButtons = $("#contentButtons");
            var contentHasInputField = $("#contentField");
            var overlayHasButtons = $("#overlayButtons");


            var overlayViewObj = new TestView({
                contentSize: contentSize.val(),
                buttonsOnContent: contentHasButtons.is(":checked"),
                titleOnContent: contentHasTitle.is(":checked"),
                numberFieldOnContent: contentHasInputField.is(":checked")
            });

            var conf = {
                view: overlayViewObj,
                cancelButton: overlayHasButtons.is(":checked"),
                okButton: overlayHasButtons.is(":checked"),
                showScrollbar: true,
                type: overlaySize.val(),
                title: overlayViewObj.title,
                titleHelp: {
                    "content": "Tooltip for the title of Overlay",
                    "ua-help-identifier": "alias_for_title_ua_event_binding",
                    "ua-help-text": "More..."
                },
                class: 'test_overlay_widget',  // Represents the Plugin class which is a wrapper for the overlay used in order to change the border or button colors
                beforeSubmit: function () {
                    console.log("-- beforeSubmit is executed");
                    var valid = true;

                    if (contentHasInputField.is(":checked")) {
                        var numberVal = this.$el.find('#field_number').val();
                        valid = numberVal && !isNaN(parseFloat(numberVal)) && isFinite(numberVal);
                        if (valid) {
                            console.log("No Error, submit method will be executed next");
                        } else {
                            console.log("Validation failed, submit method will not be executed");
                        }
                    }

                    return valid;
                },
                submit: function () {
                    console.log("-- submit is executed");
                },
                beforeCancel: function () {
                    console.log("-- beforeCancel is executed");
                },
                cancel: function () {
                    console.log("-- cancel is executed");
                }
            };
            conf = this.updateConfiguration(conf);

            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        },

        updateConfiguration: function (conf) {
            var overlayHasHtmlTitle = $("#overlayHtmlTitle");
            var overlayHasNoTitle = $("#overlayNoTitle")
            var overlayHasTitleTooltip = $("#overlayTitleTooltip");
            var overlayHasBorder = $("#overlayCustomBorder");
            var overlayHasButtonColor = $("#overlayCustomButton");
            if (overlayHasNoTitle.is(":checked")) {
                delete conf.title;
            } else if (overlayHasHtmlTitle.is(":checked")) {
                conf.title = "<span class='errorImg'></span> Overlay Title";
            }
            if (!overlayHasTitleTooltip.is(":checked")) {
                delete conf.titleHelp;
            }
            if (overlayHasBorder.is(":checked")) {
                conf.class = conf.class + " overlayCustomBorder ";
            }
            if (overlayHasButtonColor.is(":checked")) {
                conf.class = conf.class + " overlayCustomButton ";
            }
            return conf;
        },
        formTestCaseLink: function () {
            var overlayViewObj = new FormOverlayView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'isMin': false,
                'type': 'medium'
            });
        },
        formTestCaseLinkMin: function () {
            var overlayViewObj = new FormOverlayView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'isMin': true,
                'type': 'medium'
            });
        },
        fullpageFormTestCaseLink: function () {
            var overlayViewObj = new FormOverlayView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'isMin': false,
                'type': 'fullpage'
            });
        },
        fullpageFormTestCaseLinkMin: function () {
            var overlayViewObj = new FormOverlayView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'isMin': true,
                'type': 'fullpage'
            });
        },
        overlayWithFixedContainerTestCaseLink: function () {
            var overlayViewObj = new FixedHeightView({});
            var conf = {
                view: overlayViewObj,
                cancelButton: false,
                okButton: false,
                showScrollbar: true,
                title: null,
                type: 'small'
            };
            this.overlayWidgetObj = new OverlayWidget(conf);
            this.overlayWidgetObj.build();
        },
        mediumFormWizardRadio: function () {
            var shortWizardView = new PageOverlayView({
                "type": "medium"
            });
        },
        largeFormWizardRadio: function () {
            var shortWizardView = new PageOverlayView({
                "type": "large"
            });
        },
        xlargeFormWizardRadio: function () {
            var shortWizardView = new PageOverlayView({
                "type": "xlarge"
            });
        },
        fullpageFormWizardRadio: function () {
            var shortWizardView = new PageOverlayView({
                "type": "fullpage"
            });
        },
        formTabGridFullpageOverlay: function () {
            new FormTabFormGridOverlayView({
                "type": "fullpage"
            });
        }
    });
    return OverlayView;
});
