/**
 * A view that uses the carousel widget to render a carousel from a configuration object
 * The configuration file contains the views/slide to render
 *
 * @module TabContainer View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'widgets/carousel/carouselWidget',
    'widgets/carousel/tests/view/cardsView',
    'text!widgets/carousel/tests/templates/carouselExample.html'
], function(Backbone, render_template, CarouselWidget, CardsView,example){
    var CarouselView = Backbone.View.extend({

        initialize: function () {
            this.addContent(this.$el, example);
            this.multipleItems = [{
                id:"card1",
                content: new CardsView.view1()
            },{
                id:"card2",
                content: new CardsView.view3()
            },{
                id:"card3",
                content: new CardsView.view2()
            },{
                id:"card4",
                content: new CardsView.view4()
            },{
                id:"card5",
                content: new CardsView.view9()
            },{
                id:"card6",
                content: new CardsView.view10()
            },{
                id:"card7",
                content: new CardsView.view5()
            },{
                id:"card8",
                content: new CardsView.view7()
            },{
                id:"card9",
                content: new CardsView.view6()
            },{
                id:"card10",
                content: new CardsView.view8()
            }];
            this.fourItems = [{
                id:"card1",
                content: new CardsView.view1()
            },{
                id:"card2",
                content: new CardsView.view3()
            },{
                id:"card3",
                content: new CardsView.view2()
            },{
                id:"card4",
                content: new CardsView.view4()
            }];
            this.threeItems = [{
                id:"card1",
                content: new CardsView.view1()
            },{
                id:"card2",
                content: new CardsView.view3()
            },{
                id:"card3",
                content: new CardsView.view2()
            }];
            this.twoItems = [{
                id:"card1",
                content: new CardsView.view1()
            },{
                id:"card2",
                content: new CardsView.view3()
            }];
            this.oneItem = [{
                id:"card1",
                content: new CardsView.view1()
            }];
            !this.options.pluginView && this.render();
        },

        render: function () {
            new CarouselWidget({
                "container":  this.$el.find('.multiple-items'),
                "items": this.multipleItems
            }).build();
            new CarouselWidget({
                "container":  this.$el.find('.four-items'),
                "items": this.fourItems
            }).build();
            new CarouselWidget({
                "container":  this.$el.find('.three-items'),
                "items": this.threeItems
            }).build();
            new CarouselWidget({
                "container":  this.$el.find('.two-items'),
                "items": this.twoItems,
                "height": "120px"
            }).build();
            new CarouselWidget({
                "container":  this.$el.find('.one-item'),
                "items": this.oneItem
            }).build();
            return this;
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));
            
        }

    });

    return CarouselView;
});