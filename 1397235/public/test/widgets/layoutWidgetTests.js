define([
    'widgets/layout/layoutWidget',
    'widgets/carousel/tests/view/cardsView'
], function(LayoutWidget, CardsView){

		describe('LayoutWidget - Unit tests:', function() {

            var $el = $('#test_widget'),
                containerId = 0;

            var createContainer = function () {
                var $container = $("<div id = layout-container-id" + containerId++ + "></div>");
                $el.append($container);
                return $container;
            };

            describe('Widget Interface', function() {
                before(function(){
                    this.$layoutContainer = createContainer();
                    this.layoutWidgetObj = new LayoutWidget({
                        "container": this.$layoutContainer[0],
                        "panels": [{
                            type: 'column',
                            id: 'cards13',
                            content: [{
                                type: 'row',
                                id:"cards1",
                                content:new CardsView.view1(),
                                height: 70,
                                width: 70,
                                isExpandable: false
                            },{
                                id:"cards3",
                                height: 30,
                                width: 100,
                                content: new CardsView.view3(),
                                isClosable: true
                            }]
                        }]
                    }).build();
                });
                after(function(){
                    this.layoutWidgetObj.destroy();
                });
                it('should exist', function() {
                    this.layoutWidgetObj.should.exist;
                });
                it('build() should exist', function() {
                    assert.isFunction(this.layoutWidgetObj.build, 'The layout widget must have a function named build.');
                });
                it('destroy() should exist', function() {
                    assert.isFunction(this.layoutWidgetObj.destroy, 'The layout widget must have a function named destroy.');
                });
            });

            describe('Template', function() {
                before(function(){
                    this.$layoutContainer = createContainer();
                    this.content = [{
                        id:"cards2",
                        content:new CardsView.view2(),
                        height: 70,
                        width: 70
                    },{
                        id:"cards4",
                        height: 30,
                        width: 100,
                        content: new CardsView.view4(),
                        isClosable: true
                    }];
                    this.layoutWidgetObj = new LayoutWidget({
                        "container": this.$layoutContainer[0],
                        "panels": [{
                            type: 'column',
                            id: 'cards24',
                            content: this.content
                        }]
                    }).build();
                });
                after(function(){
                   this.layoutWidgetObj.destroy();
                });
                it('should contain the layout-widget class for layout container', function() {
                    this.$layoutContainer.hasClass('slipstream-layout-widget').should.be.true;
                });
                it('should contain the slick-initialized class after the the slick library is used to build the carousel widget', function() {
                    this.$layoutContainer.find('>div').hasClass('lm_goldenlayout').should.be.true;
                });
                it('should contain panels', function() {
                    assert.equal(this.$layoutContainer.find('.lm_content').length, this.content.length, "the layout has been created and the panels with lm_content class have been added");
                });
            });

            describe("Widget Incorrect Configuration", function() {
                before(function(){
                    this.$layoutContainer = createContainer();
                });
                after(function(){
                    this.$layoutContainer.remove();
                });
                it("should have configuration", function() {
                    this.layoutWidgetObj = new LayoutWidget("test");
                    assert.throws(this.layoutWidgetObj.build, Error, "The configuration object for the layout widget is missing");
                });
                it("should exist panels property", function() {
                    this.layoutWidgetObj = new LayoutWidget({
                        "container": this.$layoutContainer[0]
                    });
                    assert.throws(this.layoutWidgetObj.build, Error, "The configuration for the layout widget must include the panels parameter");
                });
                it("should be built before using updatePanel method", function() {
                    this.layoutWidgetObj = new LayoutWidget({
                        "container": this.$layoutContainer[0],
                        "panels": [{
                            type: 'column',
                            id: 'cards24',
                            content: this.content
                        }]
                    });
                    assert.throws(this.layoutWidgetObj.updatePanel, Error, "The layout widget was not built");
                });
                it("should be built before using destroy method", function() {
                    this.layoutWidgetObj = new LayoutWidget({
                        "container": this.$layoutContainer[0],
                        "panels": [{
                            type: 'column',
                            id: 'cards24',
                            content: this.content
                        }]
                    });
                    assert.throws(this.layoutWidgetObj.destroy, Error, "The layout widget was not built");
                });
            });

            describe('Adding and Removing Panels', function() {
                before(function(){
                    var self = this;
                    this.$layoutContainer = createContainer();
                    var onPanelDestroyed = function () {
                        self.onPanelClosedInvoked = true;
                    };
                    this.content = [{
                        id:"cards2",
                        content:new CardsView.view2(),
                        height: 70,
                        isClosable: false,
                        isExpandable: false
                    },{
                        id:"cards4",
                        height: 30,
                        content: new CardsView.view4(),
                        isClosable: true
                    }];
                    this.layoutWidgetObj = new LayoutWidget({
                        "container": this.$layoutContainer[0],
                        "panels": [{
                            type: 'column',
                            id: 'cards24',
                            content: this.content
                        }],
                        events: {
                            onPanelClosed: onPanelDestroyed
                        }
                    }).build();
                });
                after(function(){
                    this.layoutWidgetObj.destroy();
                });
                it('should contain a header and content for each panel', function() {
                    assert.equal(this.$layoutContainer.find('.lm_header').length, this.content.length, "the layout has been created and the panels with lm_header class have been added");
                    assert.equal(this.$layoutContainer.find('.lm_content').length, this.content.length, "the layout has been created and the panels with lm_content class have been added");
                });
                it('should have a panel that is closable and close it on click', function() {
                    this.onPanelClosedInvoked = false;
                    this.$layoutContainer.find('.lm_header').eq(1).find('.lm_close').trigger("click"); //panel with the isClosable property set to true
                    assert.isTrue(this.onPanelClosedInvoked, "the onPanelDestroyed callback is invoked");
                    assert.equal(this.$layoutContainer.find('.lm_header').length, this.content.length-1, "the layout is showing one less panel content");
                });
                it('should add a panel without providing location', function() {
                    this.layoutWidgetObj.updatePanel({
                        id:"cards4",
                        height: 30,
                        content: new CardsView.view4()
                    });
                    assert.equal(this.$layoutContainer.find('.lm_content').length, this.content.length, "the new layout has been added");
                });
                it('should add a panel with the location id', function() {
                    this.$layoutContainer.find('.lm_header').eq(1).find('.lm_close').trigger("click"); //panel with the isClosable property set to true
                    assert.equal(this.$layoutContainer.find('.lm_content').length, this.content.length-1, "the layout is showing one less panel content");
                    this.layoutWidgetObj.updatePanel({
                        id:"cards4",
                        height: 30,
                        content: new CardsView.view4()
                    }, {
                        parentId: "cards24"
                    });
                    assert.equal(this.$layoutContainer.find('.lm_content').length, this.content.length, "the new layout has been added");
                });
                it('should add a panel without providing location', function() {
                    this.layoutWidgetObj.updatePanel({
                        id:"cards4",
                        height: 30,
                        content: new CardsView.view4()
                    });
                    assert.equal(this.$layoutContainer.find('.lm_content').length, this.content.length, "the layout has been updated");
                });
            });

            describe('Toggle Maximize Panel', function() {
                before(function(){
                    var self = this;
                    this.$layoutContainer = createContainer();
                    this.content = [{
                        id:"cards2",
                        content:new CardsView.view2(),
                        height: 70,
                        isClosable: false,
                        isExpandable: false
                    },{
                        id:"cards4",
                        height: 30,
                        content: new CardsView.view4(),
                        isClosable: true
                    }];
                    this.layoutWidgetObj = new LayoutWidget({
                        "container": this.$layoutContainer[0],
                        "panels": [{
                            type: 'column',
                            id: 'cards24',
                            content: this.content
                        }]
                    }).build();
                });
                after(function(){
                    this.layoutWidgetObj.destroy();
                });
                it('should contain panels in regular size', function() {
                    assert.equal(this.$layoutContainer.find('.lm_maximised').length, 0, "the layout has been created and none panel is maximized");
                });
                it('should contain a panel that is maximized and then set to regular size', function() {
                    this.layoutWidgetObj.toggleMaximizePanel("cards2", true);
                    assert.equal(this.$layoutContainer.find('.lm_maximised').length, 1, "the layout has a panel that is maximized");
                    this.layoutWidgetObj.toggleMaximizePanel("cards2", false);
                    assert.equal(this.$layoutContainer.find('.lm_maximised').length, 0, "the layout has none panel that is maximized");
                });
                it('should contain a panel that is toggle to maximize', function() {
                    assert.equal(this.$layoutContainer.find('.lm_maximised').length, 0, "the layout has none panel that is maximized");
                    this.layoutWidgetObj.toggleMaximizePanel("cards4");
                    assert.equal(this.$layoutContainer.find('.lm_maximised').length, 1, "the layout has a panel that is maximized");
                });
            });

            describe('Destroy Panel', function() {
                before(function(){
                    var self = this;
                    this.$layoutContainer = createContainer();
                    this.content = [{
                        id:"cards2",
                        content:new CardsView.view2(),
                        height: 70,
                        isClosable: false,
                        isExpandable: false
                    },{
                        id:"cards4",
                        height: 30,
                        content: new CardsView.view4(),
                        isClosable: true
                    }];
                    this.layoutWidgetObj = new LayoutWidget({
                        "container": this.$layoutContainer[0],
                        "panels": [{
                            type: 'column',
                            id: 'cards24',
                            content: this.content
                        }]
                    }).build();
                });
                after(function(){
                    this.layoutWidgetObj.destroy();
                });
                it('should contain panels', function() {
                    assert.equal(this.$layoutContainer.find('.lm_content').length, this.content.length, "the layout has been created with panels");
                });
                it('should destroy one of the panels', function() {
                    this.layoutWidgetObj.destroyPanel("cards4")
                    assert.equal(this.$layoutContainer.find('.lm_content').length, this.content.length - 1, "one panel has been destroyed");
                });
            });
        });
	});
