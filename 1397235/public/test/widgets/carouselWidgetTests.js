define([
    'widgets/carousel/carouselWidget',
    'widgets/carousel/tests/view/cardsView'
], function(CarouselWidget, CardsView){

		describe('CarouselWidget - Unit tests:', function() {

            var $el = $('#test_widget'),
                containerId = 0,
                cards = [{
                    id:"card1",
                    content: new CardsView.view1()
                },{
                    id:"card2",
                    content: new CardsView.view3()
                }];

            var createContainer = function () {
                var $container = $("<div id = carousel-container-id" + containerId++ + "></div>");
                $el.append($container);
                return $container;
            };

            describe('Widget Interface', function() {
                before(function(){
                    this.$carouselContainer = createContainer();
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "items": cards,
                        "height": "100px"
                    });
                    this.carouselWidgetObj.build();
                });
                after(function(){
                    this.carouselWidgetObj.destroy();
                });
                it('should exist', function() {
                    this.carouselWidgetObj.should.exist;
                });
                it('build() should exist', function() {
                    assert.isFunction(this.carouselWidgetObj.build, 'The carousel widget must have a function named build.');
                });
                it('destroy() should exist', function() {
                    assert.isFunction(this.carouselWidgetObj.destroy, 'The carousel widget must have a function named destroy.');
                });
            });

            describe('Widget Incorrect Configuration', function() {
                before(function(){
                    this.$carouselContainer = createContainer();
                });
                it('should have configuration', function() {
                    this.carouselWidgetObj = new CarouselWidget("test");
                    assert.throws(this.carouselWidgetObj.build, Error, 'The configuration object for the carousel widget is missing');
                });
                it('should exist container parameter', function() {
                    this.carouselWidgetObj = new CarouselWidget({
                        "items": cards,
                        "height": "100px"
                    });
                    assert.throws(this.carouselWidgetObj.build, Error, 'The configuration for the carousel widget must include the container parameter');
                });
                it('should exist items parameter', function() {
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "height": "100px"
                    });
                    assert.throws(this.carouselWidgetObj.build, Error, 'The configuration for the carousel widget must include the items parameter');
                });
                it('should exist at least one item parameter', function() {
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "items": [],
                        "height": "100px"
                    });
                    assert.throws(this.carouselWidgetObj.build, Error, 'The configuration for the carousel widget must contain at least 1 item');
                });
                it('should be built before using destroy method', function() {
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "items": cards,
                        "height": "100px"
                    });
                    assert.throws(this.carouselWidgetObj.destroy, Error, 'The carousel widget was not built');
                });
            });

            describe('Template', function() {
                before(function(){
                    this.$carouselContainer = createContainer();
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "items": cards,
                        "height": "100px"
                    }).build();
                });
                after(function(){
                   this. carouselWidgetObj.destroy();
                });
                it('should contain the carousel-widget class for carousel container', function() {
                    this.$carouselContainer.hasClass('carousel-widget').should.be.true;
                });
                it('should contain the slick-initialized class after the the slick library is used to build the carousel widget', function() {
                    this.$carouselContainer.hasClass('slick-initialized').should.be.true;
                });
                it('should contain a carousel with slides', function() {
                    assert.equal(this.$carouselContainer.find('.carousel-item').length, cards.length, "the carousel has been created and the containers with carousel-item class have been added");
                });
            });

            describe('Template with Multiple cards (4) that exceeds the breakpoint', function() {
                before(function(){
                    this.$carouselContainer = createContainer();
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "items": [{
                            id:"card1",
                            content: new CardsView.view1()
                        },{
                            id:"card2",
                            content: new CardsView.view3()
                        },{
                            id:"card3",
                            content: new CardsView.view3()
                        },{
                            id:"card4",
                            content: new CardsView.view3()
                        },{
                            id:"card5",
                            content: new CardsView.view3()
                         }],
                        "height": "100px"
                    }).build();
                });
                after(function(){
                    this.carouselWidgetObj.destroy();
                });
                it('should contain the carousel-widget class for carousel container', function() {
                    this.$carouselContainer.hasClass('carousel-widget').should.be.true;
                });
                it('should contain the slick-initialized class after the the slick library is used to build the carousel widget', function() {
                    this.$carouselContainer.hasClass('slick-initialized').should.be.true;
                });
                it('should contain a carousel with slides', function() {
                    assert.equal(this.$carouselContainer.find('.carousel-item').length, 5, "the carousel has been created and the containers with carousel-item class have been added");
                });
            });

            describe('Template with responsive breakpoint', function() {
                before(function(){
                    this.$carouselContainer = createContainer();
                    this.carouselWidgetObj = new CarouselWidget({
                        "container": this.$carouselContainer[0],
                        "items": cards,
                        "height": "100px",
                        "responsive": {
                            breakpoint: 1230,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        }
                    }).build();
                });
                after(function(){
                    this.carouselWidgetObj.destroy();
                });
                it('should contain the carousel-widget class for carousel container', function() {
                    this.$carouselContainer.hasClass('carousel-widget').should.be.true;
                });
                it('should contain the slick-initialized class after the the slick library is used to build the carousel widget', function() {
                    this.$carouselContainer.hasClass('slick-initialized').should.be.true;
                });
                it('should contain a carousel with slides', function() {
                    assert.equal(this.$carouselContainer.find('.carousel-item').length, cards.length, "the carousel has been created and the containers with carousel-item class have been added");
                });
            });

        });
	});
