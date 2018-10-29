define([
    'marionette',
    'lib/template_renderer/template_renderer',
    'widgets/shortWizard/shortWizard',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/shortWizard/tests/conf/customSummarySample',
    'widgets/shortWizard/tests/view/formView',
    'widgets/form/tests/models/zonePoliciesModel',
    'backbone'
], function (Marionette, template_renderer, ShortWizard, Overlay, FormWidget, GridWidget, customSummarySample, FormView, ZonePoliciesModel, Backbone) {
    Marionette.Renderer.render = template_renderer;

    MyIntroPageView = Backbone.View.extend({
        getTitle: function () {
            return 'My Intro Page Title';
        },
        getDescription: function () {
            return 'My Intro Page description.';
        },
        render: function () {
            this.$el.html('<h3>This is is the intro page content</h3><p>This wizard will succeed on every other attempt.</p>');
            return this;
        }
    });

    MyObjView = Backbone.View.extend({
        render: function () {
            this.$el.html(this.options.name);
            return this;
        },
        getTitle: function () {
            return this.options.name;
        },
        getDescription: function () {
            return this.options.name + ' should completely fill out form.';
        },
        beforePageChange: function (currentStep, requestedStep) {
            console.log('beforePageChange called, current step is ' + currentStep + ', requested step is ' + requestedStep);
            return true;
        }
    });

    MyCustomView = Backbone.View.extend({
        initialize: function (pages) {
            console.log(pages);
        },
        render: function () {
            this.formWidget = new FormWidget({
                "elements": customSummarySample.elements,
                "container": this.$el
            });
            this.formWidget.build();

            this.grid = new GridWidget({
                container: this.$el,
                elements: customSummarySample.smallGrid
            });
            this.grid.build();
            return this;
        }
    });

    CustomDoneStatusFooter = Backbone.View.extend({
        render: function () {
            this.grid = new GridWidget({
                container: this.$el,
                elements: customSummarySample.smallGrid
            });
            this.grid.build();
            return this;
        }
    });

    myIntroPage = {title: "Intro", view: new MyIntroPageView(), intro: true};
    myPage0 = {
        title: "Page0:ThisPageTitleIsLong",
//        intro: true,
        view: new FormView({
            'model': new ZonePoliciesModel.zone.model(),
            'zone': new ZonePoliciesModel.zone.collection(),
            'address': new ZonePoliciesModel.address.collection(),
            'application': new ZonePoliciesModel.application.collection()
        })
    };
    myPage1 = {title: "Page 1", view: new MyObjView({name: "myWizardPage1"})};
    myPage2 = {title: "Page 2", view: new MyObjView({name: "myWizardPage2"})};
    myPage3 = {title: "Page 3", view: new MyObjView({name: "myWizardPage3"})};
    myPage4 = {title: "Page 4", view: new MyObjView({name: "myWizardPage4"})};

    var attempts = 0;

    OverlayView = Backbone.View.extend({
        render: function () {
            var wizardContext = this;

            myIntroPage.view.beforePageChange = function(currentPage, requestedPage){
                //Hide custom button 1 on page 1
                $("#custom1", wizardContext.$el).hide();
                return true;
            };

            myPage0.view.beforePageChange = function(currentPage, requestedPage){
                if (requestedPage !== 0) {
                    // Hide custom button 2 on page 0
                    $("#custom2", wizardContext.$el).hide();
                }
                return true;
            };

            myPage1.view.beforePageChange = function (currentPage, requestedPage) {
                console.log('Stay in the current page for 2 sec');
                console.log('beforePageChange called, current step is ' + currentPage + ', requested step is ' + requestedPage);
                setTimeout(function () {
                    console.log('trigger nextPage API');
                    wizard.nextPage(true);
                }, 2000);

                return false;
            };

            var wizard = new ShortWizard({
                title: "Quickstart Setup Wizard",
                showSummary: MyCustomView,  // Optional, defaults to true
                titleHelp: {
                    "content": "Tooltip for the title of ShortWizard",
                    "ua-help-identifier": "alias_for_title_ua_event_binding",
                    "ua-help-text": "More..."
                },
                pages: [myIntroPage, myPage0, myPage1, myPage2, myPage3, myPage4],
//                pages: [myPage0, myPage1, myPage2, myPage3, myPage4],
                container: this.$el,
//                height: 600,
                summaryTitle: "My Custom Summary Title",
                summaryEncode: true,                
                customButtons: [
                    {
                        "id": "custom1",
                        "name": "CustomBtn1",
                        "value": "Custom 1",
                        "cssClass": "short-wiz-custom",
                        "isInactive": true
                    },
                    {
                        "id": "custom2",
                        "name": "CustomBtn2",
                        "value": "Custom 2",
                        "isInactive": true
                    }                    
                ],
                save: function (options) {
                    attempts++;

                    // Simulate network activity
                    setTimeout(function () {
                        if (attempts % 2 === 0) {
                            options.success('The setup wizard was successful');
                            return;
                        }

                        options.error('The setup wizard failed');
                    }, 2000);
                },
                onDone: function () {
                    console.log('Wizard completed normally');
                },
                onCancel: function () {
                    wizardContext.options.overlayObj.overlay && wizardContext.options.overlayObj.overlay.destroy();
                    console.log('Wizard was cancelled');
                },
                onClickRelatedLinks: function () {
                    console.log('onClickRelatedLinks');
                },
                relatedActivities: [
                    {
                        "label": "Activity 1",
                        "data": "/firewall-policies",
                        "dataType": ""
                    },
                    {
                        "label": "Activity 2",
                        "data": "/firewall-policies",
                        "dataType": ""
                    },
                    {
                        "label": "Activity 3",
                        "data": "/firewall-policies",
                        "dataType": ""
                    }
                ],
                customSuccessStatusFooter: new CustomDoneStatusFooter(),
                customErrorStatusFooter: new CustomDoneStatusFooter()

            });
            wizard.build();

            return this;
        }
    });

    return OverlayView;

});

