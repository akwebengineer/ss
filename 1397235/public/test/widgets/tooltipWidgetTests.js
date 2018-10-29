define([
    'widgets/tooltip/tooltipWidget'
], function(TooltipWidget){

        describe('TooltipWidget - Unit tests:', function() {

            var $el = $('#test_widget'),
                containerId = 0;

            var createContainer = function () {
                var $container = $("<div id = tooltip-target-id></div>");
                $el.append($container);
                return $container;
            };

            var cleanUp = function (thisObj) {
                thisObj.tooltipWidgetObj.destroy();
                thisObj.$tooltipContainer.remove();
            };

            var tooltipConfiguration = {
                "minWidth": 60,
                "maxWidth": 100,
                "position": 'bottom-right',
                "interactive": true,
                "trigger": 'click',
                "animation": false,
                "contentAsHTML": true,
                "contentCloning": false
            };

            describe('Widget Interface', function() {
                before(function(){
                    this.$tooltipContainer = createContainer();
                    var view = "Simple tooltip";

                    this.tooltipWidgetObj = new TooltipWidget({
                        "elements": tooltipConfiguration,
                        "container": this.$tooltipContainer,
                        "view": view
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('should exist', function() {
                    this.tooltipWidgetObj.should.exist;
                });
                it('build() should exist', function() {
                    assert.isFunction(this.tooltipWidgetObj.build, 'The tooltip widget must have a function named build.');
                });
                it('destroy() should exist', function() {
                    assert.isFunction(this.tooltipWidgetObj.destroy, 'The tooltip widget must have a function named destroy.');
                });
            });

            describe('tooltip widget with trigger click option', function() {
               
               before(function(){
                    tooltipConfiguration.functionReady = function(origin, tooltip){
                        isTooltipVisible = true;
                    }
                    this.$tooltipContainer = createContainer();
                    var view = "Simple tooltip";

                    this.tooltipWidgetObj = new TooltipWidget({
                        "elements": tooltipConfiguration,
                        "container": this.$tooltipContainer[0],
                        "view": view
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
    
                it('should show tooltip on click', function(done) {
                   this.$tooltipContainer.first().click();
                    setTimeout(function(){
                        isTooltipVisible.should.be.true;
                        done();
                    },600);
                });
                it('should remove tooltip on click', function() {
                    assert.equal($('.tooltipster-content').length, 1, 'The tooltip elemnet is displayed');
                    $('.tooltipster-content .close_icon').click();
                    assert.equal($('.tooltipster-content').length, 0, 'The tooltip elemnet is removed');
                });
            });

        });
    });