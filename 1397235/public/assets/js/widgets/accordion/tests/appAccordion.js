/**
 * A view that uses the accordion widget to render an accordion from a configuration object
 * The configuration contains the sections to render
 *
 * @module Accordion View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/accordion/accordionWidget',
    'widgets/accordion/tests/view/accordionItemView',
    'widgets/help/helpWidget',
    'lib/template_renderer/template_renderer',
    'text!widgets/accordion/tests/templates/accordionExample.html',
    'text!widgets/accordion/tests/templates/titleExample.html'
], function (Backbone, AccordionWidget, AccordionItemView, HelpWidget, render_template, accordionExample, titleExample) {
    var AccordionView = Backbone.View.extend({

        events: {
            "click .one-accordion": "openOneAccordionAtTime",
            "click .multiple-accordion": "openMultipleAccordion",
            "click .expand-all": "expandAll",
            "click .collapse-all": "collapseAll",
            "click .cancel-button": "cancelForm",
            "click .save-button": "saveForm",
            "click .deploy-button": "deployForm"
        },

        initialize: function () {
            this.addTemplates();
            this.createViews();
            !this.options.pluginView && this.render();
        },

        render: function () {
            this.accordionConfiguration = {
                "container": this.$accordionContainer,
                "state": {
                    icon: "unconfigured",
                    tooltip: "Global state: Update configuration of this section"
                },
                "sections": this.getTabSectionsConfiguration()
            };
            this.accordion = new AccordionWidget(this.accordionConfiguration).build();
            this.addAccordionTitleHelp();
            return this;
        },

        getSectionState: function (sectionContent) {
            var partialState,
                getState = function (sectionConfig) {
                    var section, sectionId, sectionState, state;
                    if (partialState) { //if previous recursion has identified a state and break, then the function can return the last value found
                        return partialState;
                    }
                    for (sectionId in sectionConfig) {
                        section = sectionConfig[sectionId];
                        if (section.content && _.isFunction(section.content.updateState)) {
                            if (section.isContentRendered) {
                                sectionState = section.content.updateState();
                                if (sectionState.state == "error") {
                                    partialState = {
                                        icon: "critical_alert",
                                        tooltip: "getSectionState: Some errors were found"
                                    };
                                    break;
                                } else if (sectionState.state == "unconfigured") {
                                    partialState = {
                                        icon: "partially_configured",
                                        tooltip: "getSectionState: Section partially configured"
                                    };
                                    break;
                                }
                            } else {
                                partialState = {
                                    icon: "partially_configured",
                                    tooltip: "getSectionState: Section partially configured"
                                };
                                break;
                            }
                        } else {
                            getState(section);
                        }
                    }
                    return partialState;
                };
            var sectionState = getState(sectionContent);
            return sectionState || {
                icon: "configured",
                tooltip: "getSectionState: Section configured"
            };
        },

        getTabSectionsConfiguration : function () {
            return [
                {
                    id: "section1",
                    title: "User Identity Details <span class='user-help'></span>",
                    description: "Hostname, username and password are available in this section",
                    content: this.views.userIdentity.view
                },
                {
                    id: "section2",
                    title: "Dropdown and Checkbox",
                    description: "Dropdown, checkboxes and radio buttons are available in this section",
                    content: this.views.dropdownCheckbox.view,
                    state: {
                        icon: {
                            icon_url: "/assets/images/icon-inline-sprite.svg#icon_arrow_right_title",
                            icon_class: "icon_arrow_right_title-dims"
                        },
                        tooltip: "Configuration state: Update configuration of the date and time section"
                    }
                },
                {
                    id: "section3",
                    title: "Other inputs",
                    description: "Multiple type of inputs are available in this section",
                    content: this.views.otherInputs.view
                },
                {
                    id: "section4_n",
                    title: this.getAccordionTitle("cluster", "Level 1: SRX 250 Cluster at 3 levels (UX recommended)"),
                    onStateContentUpdate: this.getSectionState,
                    content: [
                        {
                            id: "section4_1",
                            content: this.views.dropdownCheckbox1.view,
                        },
                        {
                            id: "section4_2",
                            title: "Level 2: WAN Configuration",
                            onStateContentUpdate: this.getSectionState,
                            content: [
                                {
                                    id: "section4_2_1",
                                    title: "Level 3: Link WAN_0",
                                    onStateContentUpdate: this.getSectionState,
                                    content: [
                                        {
                                            id: "section4_2_1_1",
                                            title: "Level 3: Link WAN_0",
                                            content: this.views.userIdentity2.view
                                        },
                                        {
                                            id: "section4_2_1_2",
                                            title: "Level 3: Overlay Tunnel 1",
                                            description: "Multiple type of inputs are available in this section",
                                            content: this.views.simpleInput.view
                                        }
                                    ]
                                }
                            ],
                        },
                        {
                            id: "section4_3",
                            title: "Level 2: LAN Configuration",
                            content: this.views.multipleInputs.view
                        },
                    ]
                },
                {
                    id: "section5_n",
                    title: this.getAccordionTitle("switch", "Level 1: SRX 250 Cluster at multiple levels"),
                    description: "Multiple type of inputs are available in this section",
                    state: false,
                    content: [
                        {
                            id: "section5_0",
                            content: this.views.simpleInput1.view
                        },
                        {
                            id: "section5_1",
                            title: "Level 2: WAN Configuration - nested",
                            content: [
                                {
                                    id: "section5_1_1",
                                    title: "Level 3: Link WAN_0 - nested",
                                    content: [
                                        {
                                            id: "section5_1_1_2",
                                            title: "Level 4: Overlay Tunnel 1 - nested",
                                            content: [
                                                {
                                                    id: "section5_1_1_2_2",
                                                    title: "Level 5: Section - nested",
                                                    description: "Multiple type of inputs are available in this section",
                                                    content: [
                                                        {
                                                            id: "section5_1_1_2_2_1",
                                                            title: "Level 6: Section with content",
                                                            description: "Multiple type of inputs are available in this section",
                                                            content: this.views.dropdownCheckbox2.view
                                                        },
                                                        {
                                                            id: "section5_1_1_2_2_2",
                                                            title: "Level 6: Section with only content",
                                                            content: "content1",
                                                            state: {
                                                                icon: "undeployed-test",
                                                            },
                                                        },
                                                        {
                                                            id: "section5_1_1_2_2_3",
                                                            content: this.views.simpleInput2.view
                                                        }
                                                    ],
                                                },
                                                {
                                                    id: "section5_1_1_2_1",
                                                    title: "Level 5: Section with content",
                                                    description: "Multiple type of inputs are available in this section",
                                                    content: this.views.dropdownCheckbox3.view
                                                },
                                                {
                                                    id: "section5_1_1_2_3",
                                                    title: "Level 5: Section with only content",
                                                    content: "content1",
                                                    state: {
                                                        icon: "undeployed-test",
                                                    }
                                                }
                                            ],
                                        },
                                        {
                                            id: "section5_1_1_3",
                                            title: "Level 4: Section with only content",
                                            content: "content1",
                                            state: {
                                                icon: "undeployed-test",
                                            },
                                        },
                                        {

                                            id: "section5_1_1_4",
                                            title: "Level 4: Section with summary and content",
                                            description: "summary",
                                            content: "Content of the <b><i>section</i></b>",
                                            state: false
                                        }
                                    ],
                                    state: {
                                        icon: "undeployed-test",
                                    }
                                },
                                {
                                    id: "section5_1_2",
                                    title: "Level 3: Other inputs",
                                    description: "Multiple type of inputs are available in this section",
                                    content: this.views.userIdentity3.view
                                },
                                {
                                    id: "section5_1_3",
                                    title: "Level 3: Section with only content",
                                    content: "content1",
                                    state: {
                                        icon: "undeployed-test",
                                    },
                                },
                                {

                                    id: "section5_1_4",
                                    title: "Level 3: Section with summary and content",
                                    description: "summary",
                                    content: "Content of the <b><i>section</i></b>",
                                    state: false
                                }],
                            state: {
                                icon: "undeployed-test",
                            },
                        },
                        {
                            id: "section5_2",
                            title: "Level 2: Other inputs",
                            description: "Multiple type of inputs are available in this section",
                            content: this.views.userIdentity1.view
                        },
                        {
                            id: "section5_3",
                            title: "Level 2: Section with only content",
                            content: "content1",
                            state: {
                                icon: "undeployed-test",
                            },
                        },
                        {

                            id: "section5_4",
                            title: "Level 2: Section with summary and content",
                            description: "summary",
                            content: "Content of the <b><i>section</i></b>",
                            state: false
                        }
                    ]
                },
                {
                    id: "section6_level1",
                    title: this.getAccordionTitle("firewall", "Level 1: Section with only content"),
                    content: "content1",
                    state: {
                        icon: "undeployed-test",
                    },
                },
                {
                    id: "section7_level1",
                    title: this.getAccordionTitle("router", "Level 1: Section with summary and content"),
                    description: "summary",
                    content: "Content of the <b><i>section</i></b>",
                    state: false
                }
            ]
        },

        openMultipleAccordion: function () {
            this.accordion.destroy();
            this.accordion = new AccordionWidget(_.extend({
                "collapsible": false
            },this.accordionConfiguration)).build();
            this.$el.find(".default-config").removeClass("hide");
            this.$el.find(".new-config").addClass("hide");
        },

        openOneAccordionAtTime: function () {
            this.accordion.destroy();
            this.accordion = new AccordionWidget(this.accordionConfiguration).build();
            this.$el.find(".new-config").removeClass("hide");
            this.$el.find(".default-config").addClass("hide");
        },

        createViews: function () {
            var self = this;
            var getViewConf = function (viewId, inputId) {
                return {
                    "formId": viewId,
                    "inputId": inputId,
                    "updateSaveButton": _.bind(self.updateSaveButton, self)
                };
            };
            var getView = function (view) {
                return {
                    "view": view
                };
            };

            this.views = {
                userIdentity: {
                    "view": new AccordionItemView.view1(getViewConf("form_userIdentity"))
                },
                userIdentity1: {
                    "view": new AccordionItemView.view6(getViewConf("form_userIdentity1"))
                },
                userIdentity2: {
                    "view": new AccordionItemView.view7(getViewConf("form_userIdentity2"))
                },
                userIdentity3: {
                    "view": new AccordionItemView.view8(getViewConf("form_userIdentity3"))
                },
                dropdownCheckbox: {
                    "view": new AccordionItemView.view2(getViewConf("form_dropdownCheckbox"))
                },
                dropdownCheckbox1: {
                    "view": new AccordionItemView.view9(getViewConf("form_dropdownCheckbox1"))
                },
                dropdownCheckbox2: {
                    "view": new AccordionItemView.view10(getViewConf("form_dropdownCheckbox2"))
                },
                dropdownCheckbox3: {
                    "view": new AccordionItemView.view11(getViewConf("form_dropdownCheckbox3"))
                },
                otherInputs: {
                    "view": new AccordionItemView.view3(getViewConf("form_otherInputs"))
                },
                simpleInput: {
                    "view": new AccordionItemView.view4(getViewConf("form_simpleInput"))
                },
                multipleInputs: {
                    "view": new AccordionItemView.view5(getViewConf("form_multipleInputs"))
                },
                "simpleInput1": getView(new AccordionItemView.dynamic(getViewConf("form_simpleInput1", "1"))),
                "simpleInput2": getView(new AccordionItemView.dynamic(getViewConf("form_simpleInput2", "2")))
            };
        },

        addAccordionTitleHelp: function () {
            new HelpWidget({
                "container": this.$el.find(".user-help"),
                "view": {
                    "content": "Tooltip that shows how to access view help from the Help Widget",
                    // "ua-help-text": "More..",
                    "ua-help-identifier": "alias_for_ua_event_binding"
                }
            }).build();
        },

        getAccordionTitle: function (icon, title) {
            return render_template(titleExample, {
                section_icon: icon,
                section_title: title
            });
        },

        updateSaveButton: function (event, data) {
            var self = this;
            var enableSaveButton = function () {
                    self.$saveButton.removeAttr("disabled");
                },
                disableSaveButton = function () {
                    self.$saveButton.attr("disabled", true);
                },
                currentViewId = data.formId.replace("form_", ""),
                viewObj;

            this.views[currentViewId].isValidInput = data.isValidInput;

            if (data.isValidInput) {
                enableSaveButton();
                for (var viewId in self.views) { //checks if other sections of the accordion have an invalid input that will make the save button disabled
                    viewObj = this.views[viewId];
                    if (viewId != currentViewId && !_.isUndefined(viewObj.isValidInput)) { //if the accordion hasn't been opened, then the content is not available and not validation has been triggered (viewObj.isValidInput won't be available)
                        if (!viewObj.isValidInput) {
                            disableSaveButton();
                            return;
                        }
                    }
                }
            } else {
                disableSaveButton();
            }
        },

        expandAll: function () {
            this.accordion.expandAll();
        },

        collapseAll: function () {
            this.accordion.collapseAll();
        },

        saveForm: function () {
            var isSaveCompleted = true;
            for (var viewId in this.views) {
                var view = this.views[viewId].view,
                    values = view.getValues();
                if (viewId == "userIdentity") {
                    if (values) {
                        //persist data and update state
                        this.accordion.updateState(viewId, {
                            icon: "partially_configured",
                            tooltip: "5 partially configured"
                        });
                    } else {
                        isSaveCompleted = false;
                        this.accordion.updateState(viewId, {
                            icon: "critical_alert",
                            tooltip: "3 undeployed changes. Please, deploy to push updates to the device"
                        });
                    }
                } else {
                    if (values) {
                        //persist data and update state
                        this.accordion.updateState(viewId, {
                            icon: "undeployed",
                            tooltip: "3 undeployed changes. Please, deploy to push updates to the device"
                        });
                    } else {
                        isSaveCompleted = false;
                        this.accordion.updateState(viewId, {
                            icon: "critical_alert"
                        });
                    }
                }
            }
//            if (isSaveCompleted) {
//                this.$el.find('.accordion-buttons .save-button').hide();
//            } else {
//                this.$el.find('.accordion-buttons .deploy-button').show();
//            }
        },

        deployForm: function () {
            for (var viewId in this.views) {
                this.accordion.updateState(viewId, {
                    icon: "configured"
                });
            }
        },

        addTemplates: function () {
            this.$el.append(accordionExample);
            this.$accordionContainer = this.$el.find("#accordion-demo");
            this.$saveButton = this.$el.find(".save-button");
        }

    });

    return AccordionView;
});