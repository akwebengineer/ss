define([
    'widgets/contextMenu/contextMenuWidget',
    'widgets/contextMenu/conf/configurationSample'
], function(ContextMenuWidget, contextMenuConfiguration){

    describe('ContextMenuWidget - Unit tests:', function() {

        var $el = $('#test_widget'),
            containerId = 0;

        var createContainer = function () {
            var $container = $("<div class = contextMenu-container-id" + containerId + ">"+containerId+"</div>");
            containerId++;
            $el.append($container);
            return $container;
        };

        describe('Widget Interface', function() {
            before(function(){
                this.$contextMenuContainer = createContainer();
                var conf = {
                    "container": "."+ this.$contextMenuContainer.attr("class"),
                    "elements": {
                        "items": [{
                            "label":"Edit Rule",
                            "key":"edit"
                        },{
                            "label":"Disable Rule",
                            "key":"disable"
                        }]
                    }
                };
                this.contextMenuObj = new ContextMenuWidget(conf).build();
            });
            after(function(){
                this.contextMenuObj.destroy();
                this.$contextMenuContainer.remove();
            });
            it('should exist', function() {
                this.contextMenuObj.should.exist;
            });
            it('build() should exist', function() {
                assert.isFunction(this.contextMenuObj.build, 'The contextMenu widget must have a function named build.');
            });
            it('destroy() should exist', function() {
                assert.isFunction(this.contextMenuObj.destroy, 'The contextMenu widget must have a function named destroy.');
            });
        });

        describe('Widget Configuration', function() {
            before(function(){
                this.$contextMenuContainer = createContainer();
                var conf = {
                    "container": "."+ this.$contextMenuContainer.attr("class"),
                    "trigger": "hover",
                    "dynamic": true,
                    "elements": {
                        "items": [{
                            "label":"Edit Rule",
                            "key":"edit"
                        },{
                            "label":"Disable Rule",
                            "key":"disable"
                        }]
                    }
                };
                this.contextMenuObj = new ContextMenuWidget(conf).build();
            });
            after(function(){
                this.contextMenuObj.destroy();
                this.$contextMenuContainer.remove();
            });
            it('The context menu shows up on trigger is hover', function(done) {
                var numOfContextMenuBeforeHover = $(".context-menu-list");
                this.$contextMenuContainer.on('contextmenu:visible', function() {
                    var numOfContextMenuAfterHover = $(".context-menu-list");
                    assert.isTrue(numOfContextMenuAfterHover.length == numOfContextMenuBeforeHover.length+1, "One more Context Menu Present");
                    done();
                });
                this.$contextMenuContainer.trigger("mouseover");
            });
        });
    });
});