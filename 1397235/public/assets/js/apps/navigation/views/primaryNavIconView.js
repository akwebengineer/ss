/** 
 * A module that implements a view representing the first level navigational
 * elements.
 *
 * @module 
 * @name Slipstream/PrimaryNavigationApp/List/View
 * @author Andrew Chasin <achasin@juniper.net>
 * @author Dennis Park <dpark@juniper.net> 
 * @copyright Juniper Networks, Inc. 2014
 */
define([
        "text!./templates/primary/container.tpl",
        "text!./templates/primary/itemIcon.tpl"
    ],
    /** @lends PrimaryNavigation */ function(containerTpl, itemTpl) {
        Slipstream.module("Navigation.Primary", function(Primary, Slipstream, Backbone, Marionette, $, _) {
            /**
             * Construct a PrimaryNavigation view.
             * @constructor 
             * @class PrimaryNavigation
             */
            Primary.ItemView = Marionette.ItemView.extend({
                template: itemTpl,
                tagName: "dd",
                modelEvents: {
                    "selected": "setActive",
                    "deselected": "setInactive",
                },
                events: {
                    "click": "navigate",
                    "mouseenter": "hoverOver",
                    "mouseleave": "hoverOut",
                },

                /**
                 * Load the activity associated with the navigational element
                 * @inner
                 */
                loadActivity: function(intent) {
                  if (intent) {
                      Slipstream.vent.trigger("activity:start", intent);
                  }
                },

                hoverOver: function(e) {
                    // e.stopPropagation();
                    var $navWrapper = $('.primary-nav-wrapper'),
                        $elem = $(e.target).find('.prim-menu-icon');
                    
                    $('.primary-nav-wrapper').addClass('primary-nav-expand');
                    $('#primary-nav-region').find('.'+$elem.attr('data-menu-item')).parent().addClass('hover');
                },
                hoverOut: function(e) {
                    // e.stopPropagation();
                    var $navRegionLinks = $('#primary-nav-region dd');
                    // $primaryNavWrapper.removeClass('primary-nav-expand');             
                    $navRegionLinks.removeClass('hover');                    
                },
                /**
                 * Perform a navigation action on the navigational element
                 * @inner
                 */
                navigate: function(e) {
                    e.preventDefault();
                    var self = this;

                    Slipstream.vent.trigger("nav:action:initiated", self.model);

                    if (!this.model.selected) {
                        var doNavigate = function() {
                            Slipstream.vent.trigger("nav:primary:selected", self.model);
                            self.loadActivity(self.model.get("intent"));
                            self.model.select();
                        };
                        Slipstream.commands.execute('navigation:request',{success: doNavigate, fail:function(){}});                  
                    }

                    $('.primary-nav-wrapper').removeClass('primary-nav-expand');      
                },

                /**
                 * Set this view as the active primary nav view.
                 */
                setActive: function(e) {
                    this.$el.addClass("active");    
                },

                setInactive: function(e) {
                    this.$el.removeClass("active");
                },

                /**
                 * Callback to be executed when the navigational element is rendered.
                 * @inner
                 */
                onRender: function() {
                    if(this.model.toJSON().defclass === "active"){
                        this.$el.addClass("active");
                    }
                    if (this.model.selected) {
                        this.$el.addClass("active");
                    }

                    (function setEventHandlers() {
                        var $primaryNavWrapper = $('.primary-nav-wrapper');
                        $primaryNavWrapper.on('mouseenter', function(e) {
                            e.stopPropagation();
                            $('.primary-nav-wrapper').addClass('primary-nav-expand');
                        });
                        $primaryNavWrapper.on('mouseleave', function(e) {
                            e.stopPropagation();
                            $primaryNavWrapper.removeClass('primary-nav-expand');
                        });
                    })();                  
                }
            });
 
            /**
             * Construct a PrimaryNavigations view.
             * @constructor 
             * @class PrimaryNavigations
             */
            Primary.View = Marionette.CompositeView.extend({
                template: containerTpl,
                itemView: Primary.ItemView,
                itemViewContainer: "dl",
            });
        });

        return Slipstream.Navigation.Primary.View;
    });