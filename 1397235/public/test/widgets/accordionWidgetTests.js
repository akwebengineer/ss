define([
    'widgets/accordion/accordionWidget',
    'widgets/accordion/tests/view/accordionItemView'
], function (AccordionWidget, AccordionItemView) {

    describe('AccordionWidget - Unit tests:', function () {

        var $el = $('#test_widget'),
            containerId = 0;

        var createContainer = function () {
            var $container = $("<div id = accordion-container-id" + containerId++ + "></div>");
            $el.append($container);
            return $container;
        };

        describe('Widget Interface', function () {
            before(function () {
                this.$accordionContainer = createContainer();
                this.accordionWidgetObj = new AccordionWidget({
                    "container": this.$accordionContainer[0],
                    "state": {
                        icon: "unconfigured",
                        tooltip: "Update configuration of this section"
                    },
                    "sections": [{
                        id: "userIdentity",
                        title: "User Identity Details",
                        description: "Hostname, username and password are available in this section",
                        content: new AccordionItemView.view1()
                    }, {
                        id: "dropdownCheckbox",
                        title: "Dropdown and Checkbox",
                        description: "Dropdown, checkboxes and radio buttons are available in this section",
                        content: new AccordionItemView.view2(),
                        state: {
                            tooltip: "Update configuration of the date and time section"
                        }
                    }, {
                        id: "otherInputs",
                        title: "Other inputs",
                        description: "Multiple type of inputs are available in this section",
                        content: new AccordionItemView.view3()
                    }, {
                        id: "dateTime2",
                        title: "Date and Time",
                        description: "intro1",
                        content: "content1"
                    }]
                }).build();
            });
            after(function () {
                this.accordionWidgetObj.destroy();
            });
            it('should exist', function () {
                this.accordionWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.accordionWidgetObj.build, 'The accordion widget must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.accordionWidgetObj.destroy, 'The accordion widget must have a function named destroy.');
            });
        });

        describe('Widget Incorrect Configuration', function () {
            before(function () {
                this.$accordionContainer = createContainer();
                this.accordionWidgetObj = new AccordionWidget({
                    "container": this.$accordionContainer[0],
                    "sections": [{
                        id: "userIdentity",
                        title: "User Identity Details",
                        description: "Hostname, username and password are available in this section",
                        content: new AccordionItemView.view1()
                    }]
                });
            });
            after(function () {
                this.$accordionContainer.remove();
            });
            it('should have configuration', function () {
                this.accordionWidgetConfObj = new AccordionWidget("test");
                assert.throws(this.accordionWidgetConfObj.build, Error, 'The configuration object for the accordion widget is missing');
            });
            it('should exist container parameter', function () {
                this.accordionWidgetContainerObj = new AccordionWidget({
                    "sections": [{
                        id: "userIdentity",
                        title: "User Identity Details",
                        description: "Hostname, username and password are available in this section",
                        content: new AccordionItemView.view1()
                    }]
                });
                assert.throws(this.accordionWidgetContainerObj.build, Error, 'The configuration for the accordion widget must include the container parameter');
            });
            it('should exist sections parameter', function () {
                this.accordionWidgetSectionsObj = new AccordionWidget({
                    "container": this.$accordionContainer[0]
                });
                assert.throws(this.accordionWidgetSectionsObj.build, Error, 'The configuration for the accordion widget must include the sections parameter');
            });
            it('should be built before using updateState method', function () {
                assert.throws(this.accordionWidgetObj.updateState, Error, 'The accordion widget was not built');
            });
            it('should be built before using expandAll method', function () {
                assert.throws(this.accordionWidgetObj.expandAll, Error, 'The accordion widget was not built');
            });
            it('should be built before using collapseAll method', function () {
                assert.throws(this.accordionWidgetObj.collapseAll, Error, 'The accordion widget was not built');
            });
            it('should be built before using destroy method', function () {
                assert.throws(this.accordionWidgetObj.destroy, Error, 'The accordion widget was not built');
            });
        });

        describe('Template', function () {
            before(function () {
                this.$accordionContainer = createContainer();
                this.content = [{
                    id: "userIdentity",
                    title: "User Identity Details",
                    description: "Hostname, username and password are available in this section",
                    content: new AccordionItemView.view1()
                }, {
                    id: "dropdownCheckbox",
                    title: "Dropdown and Checkbox",
                    description: "Dropdown, checkboxes and radio buttons are available in this section",
                    content: new AccordionItemView.view2(),
                    state: {
                        tooltip: "Update configuration of the date and time section"
                    }
                }, {
                    id: "otherInputs",
                    title: "Other inputs",
                    description: "Multiple type of inputs are available in this section",
                    content: new AccordionItemView.view3()
                }];
                this.accordionWidgetObj = new AccordionWidget({
                    "container": this.$accordionContainer[0],
                    "state": {
                        icon: "unconfigured",
                        tooltip: "Update configuration of this section"
                    },
                    "sections": this.content
                }).build();
            });
            after(function () {
                this.accordionWidgetObj.destroy();
            });
            it('should contain the accordion-widget class for accordion container', function () {
                this.$accordionContainer.find('>div').hasClass('accordion-widget').should.be.true;
            });
            it('should contain the ui-widget class that indicates the accordion was built using the accordion library', function () {
                this.$accordionContainer.find('.accordion-wrapper').hasClass('ui-widget').should.be.true;
            });
            it('should contain sections', function () {
                assert.equal(this.$accordionContainer.find('.accordion-section').length, this.content.length, "the accordion has been created and the sections with accordion-section class should have been added");
            });
        });

        describe('Nested Section', function () {
            before(function () {
                this.$accordionContainer = createContainer();
                this.content = [{
                    id: "userIdentity",
                    title: "User Identity Details",
                    description: "Hostname, username and password are available in this section",
                    content: new AccordionItemView.view1()
                }, {
                    id: "dropdownCheckbox",
                    title: "Dropdown and Checkbox",
                    description: "Dropdown, checkboxes and radio buttons are available in this section",
                    content: new AccordionItemView.view2(),
                    state: {
                        tooltip: "Update configuration of the date and time section"
                    }
                }, {
                    id: "section4_2",
                    title: "Level 2: WAN Configuration",
                    content: [
                        {
                            id: "section4_2_1_1",
                            title: "Level 3: Link WAN_0",
                            content: new AccordionItemView.view3()
                        },
                        {
                            id: "section4_2_1_2",
                            title: "Level 3: Overlay Tunnel 1",
                            description: "Multiple type of inputs are available in this section",
                            content: new AccordionItemView.view4()
                        }
                    ]
                }];
                this.accordionWidgetObj = new AccordionWidget({
                    "container": this.$accordionContainer[0],
                    "state": {
                        icon: "unconfigured",
                        tooltip: "Update configuration of this section"
                    },
                    "sections": this.content
                }).build();
            });
            after(function () {
                this.accordionWidgetObj.destroy();
            });
            it('should contain sections', function () {
                assert.equal(this.$accordionContainer.find('.accordion-section').length, this.content.length, "the accordion has been created and the sections with accordion-section class should have been added");
            });
            it('should contain a nested section', function () {
                var $nestedSection = this.$accordionContainer.find('.accordion-section[data-accordion-id=section4_2]');
                $nestedSection.hasClass('isNested').should.be.true;
                var $title = $nestedSection.find('.title-status'),
                    $content = $nestedSection.find('.accordion-content');
                assert.equal($content.children().length, 0, "the nested content is not rendered upfront");
                //parent is opened, then nested content is rendered
                $title.trigger('click');
                assert.isTrue($content.children().length > 0, "the nested content is rendered");
                assert.equal($content.find('.accordion-section').length, 2, "the nested content is rendered");
            });
        });

        describe('Expand and Collapse Section', function () {
            before(function () {
                this.$accordionContainer = createContainer();
                this.content = [{
                    id: "userIdentity",
                    title: "User Identity Details",
                    description: "Hostname, username and password are available in this section",
                    content: new AccordionItemView.view1()
                }, {
                    id: "dropdownCheckbox",
                    title: "Dropdown and Checkbox",
                    description: "Dropdown, checkboxes and radio buttons are available in this section",
                    content: new AccordionItemView.view2()
                }, {
                    id: "otherInputs",
                    title: "Other inputs",
                    description: "Multiple type of inputs are available in this section",
                    content: new AccordionItemView.view3()
                }];
                this.accordionWidgetObj = new AccordionWidget({
                    "container": this.$accordionContainer[0],
                    "collapsible": false,
                    "sections": this.content
                }).build();
            });
            after(function () {
                this.accordionWidgetObj.destroy();
            });
            it('should have all sections expanded after the expand method', function () {
                //all sections collapsed after the accordion widget is built
                this.$accordionContainer.find('.title-status').hasClass('ui-state-active').should.be.false;
                this.accordionWidgetObj.expandAll();
                this.$accordionContainer.find('.title-status').hasClass('ui-state-active').should.be.true;
                assert.equal(this.$accordionContainer.find('.title-status.ui-state-active').length, this.content.length, "all sections in the accordion widget should be expanded");
            });
            it('should have all sections collapsed after the collapse method', function () {
                //all
                this.accordionWidgetObj.expandAll();
                this.$accordionContainer.find('.title-status').hasClass('ui-state-active').should.be.true;

                this.accordionWidgetObj.collapseAll();
                this.$accordionContainer.find('.title-status').hasClass('ui-state-active').should.be.false;
            });
        });

        describe('Update State of a Section', function () {
            var hasIconClass = function ($container, iconClass) {
                return $container[0].getAttribute("class").indexOf(iconClass) >= 0;
            };
            before(function () {
                this.$accordionContainer = createContainer();
                this.content = [{
                    id: "userIdentity",
                    title: "User Identity Details",
                    description: "Hostname, username and password are available in this section",
                    content: new AccordionItemView.view1()
                }, {
                    id: "dropdownCheckbox",
                    title: "Dropdown and Checkbox",
                    description: "Dropdown, checkboxes and radio buttons are available in this section",
                    content: new AccordionItemView.view2(),
                    "state": {
                        icon: "unsaved",
                        tooltip: "Update configuration of this section"
                    }
                }, {
                    id: "otherInputs",
                    title: "Other inputs",
                    description: "Multiple type of inputs are available in this section",
                    content: new AccordionItemView.view3()
                }];
                this.state = {
                    icon: "unconfigured",
                    tooltip: "Update configuration of this section"
                };
                this.accordionWidgetObj = new AccordionWidget({
                    "container": this.$accordionContainer[0],
                    "sections": this.content,
                    "state": this.state
                }).build();
            });
            after(function () {
                this.accordionWidgetObj.destroy();
            });
            it('should have the default state when the accordion widget is built', function () {
                var panelId = this.content[0].id,
                    panelStateIcon = this.state.icon,
                    $iconContainer = this.$accordionContainer.find('[data-accordion-id=' + panelId + '] .accordion-status > svg');
                hasIconClass($iconContainer, panelStateIcon).should.be.true;
            });
            it('should have the section state when accordion widget is built', function () {
                var panelId = this.content[1].id,
                    panelStateIcon = this.content[1].state.icon,
                    $iconContainer = this.$accordionContainer.find('[data-accordion-id=' + panelId + '] .accordion-status > svg');
                hasIconClass($iconContainer, panelStateIcon).should.be.true;
            });
            it('should update the section state programmatically', function () {
                var panelId = this.content[2].id,
                    panelStateIcon = this.state.icon,
                    $iconContainer = this.$accordionContainer.find('[data-accordion-id=' + panelId + '] .accordion-status > svg'),
                    newPanelStateIcon = {
                        icon: "configured",
                        tooltip: "Update configuration of this section"
                    };
                hasIconClass($iconContainer, panelStateIcon).should.be.true;

                this.accordionWidgetObj.updateState(panelId, newPanelStateIcon);
                hasIconClass($iconContainer, newPanelStateIcon.icon).should.be.true;
            });
        });

    });

});
