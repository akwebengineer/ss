/** 
 * A module that manages views in the framework's main content pane
 *
 * @module 
 * @name Slipstream/ViewManager
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["text!modules/templates/default_content.tpl", 
        "text!modules/templates/content_header.tpl",
        "text!modules/templates/content_right_header.tpl",
        "./view_adapter",
        'widgets/overlay/overlaySingletonLayout',
        'widgets/help/helpWidget'], /** @lends ViewManager */ function(defaultView, contentHeaderTemplate, rightHeaderContentTemplate, ViewAdapter, OverlayManager, HelpWidget) {
	Slipstream.module("ViewManager", function(ViewManager, Slipstream, Backbone, Marionette, $, _) {
        var prev_plugin_name = '';
        var ContentTitleView = Marionette.ItemView.extend({
            template: contentHeaderTemplate,
            render: function() {
                var html = Marionette.Renderer.render(this.getTemplate(), this.options);
                this.$el.html(html);    
            }
        });
        
        var RightHeaderContentView = Marionette.ItemView.extend({
            template: rightHeaderContentTemplate,
            render: function() {
                var html = Marionette.Renderer.render(this.getTemplate(), this.options);
                this.$el.html(html);
            }
        });
        
		var API = {
            /** 
             * Render a view into the framework's main UI region.
             *
             * @method
             * @param {Slipstream.View} view - the view to be rendered.
             * @param {Object} options - A set of options related to rendering of the content view (optional)
             * @param {Object} options.title - The (optional) title that will be rendered in the content pane header.
             * @param {String} options.title.content - The help content associated with the title.
             * @param {Object} options.title.help - The (optional) help content associated with the title.
             * @param {Object} options.title.help.content - A string containing help text associated with the view title.
             * @param {Object} options.title.help.ua-help-text - (optional) The text that will be used in a link to an external help page.
             * @param {Object} options.title.help.ua-help-identifer - (optional) The help identifer used to create the link to an external help page.
             * @param {String} options.title.titlebar - (optional) The title to be used in the UI title bar.
             * @param {String} plugin_name - The current plugin name
             */
            renderView: function(view, options, plugin_name) {
                var SlipstreamContentHeader;

                if (Slipstream.contentTitleRegion) {
                    // get div which contains both title-region and right-header region
                    SlipstreamContentHeader = $(Slipstream.contentTitleRegion.el).parent();
                     // remove any existing title
                    Slipstream.contentTitleRegion.close();

                    if (Slipstream.contentTitleRegion && options && options.title) {

                        if(!$(SlipstreamContentHeader).is(':visible')){
                            $(SlipstreamContentHeader).show();
                        }
                        
                        Slipstream.contentTitleRegion.show(new ContentTitleView(options));
                        
                        // remove existing right header
                        if(Slipstream.rightHeaderContentRegion) {
                            Slipstream.rightHeaderContentRegion.close();
                        }

                        // Optionally add a title help tooltip
                        if (options['title']['help']) {
                            new HelpWidget({
                                "container": Slipstream.contentTitleRegion.$el.find('.slipstream-page-title'),
                                "view": options.title.help
                            }).build();
                        }

                        // Modify height once contentTitleRegion is added to DOM, so that correct height of main region can be calculated.
                        Slipstream.vent.trigger("page:header:modified");
                    }
                    else {
                        // hide entire content-header if title option is not there.
                        $(SlipstreamContentHeader).hide();
                    }
                }

                var titlebar_title = (options && options.title && options.title.titlebar) || "";

                Slipstream.commands.execute("ui:title:set", titlebar_title);

                var viewAdapter = new ViewAdapter({
                    view: view
                });
                
                Slipstream.rightHeaderContentRegion && Slipstream.rightHeaderContentRegion.$el && Slipstream.rightHeaderContentRegion.$el.removeClass(prev_plugin_name);
                
                Slipstream.mainRegion.show(viewAdapter);

                Slipstream.mainRegion.$el.parent().removeClass(prev_plugin_name).addClass(plugin_name);
                prev_plugin_name = plugin_name;
            }
		};
        
        /**
         * Set the view in framework's right header region.
         *
         * @param {Slipstream.View} | {String} - the view object or string to be rendered into the framework's 
         * right header region.
         * @param {String} plugin_name - The current plugin name
         *
         */
        var setRightHeader = function (view, plugin_name) {
            // Set the right header view only if title-header is available
            if($(Slipstream.rightHeaderContentRegion.el).parent().is(':visible')) {
                if(_.isObject(view)) {
                    
                    var viewAdapter = new ViewAdapter({
                        view: view
                    });

                    Slipstream.rightHeaderContentRegion.show(viewAdapter);
                    Slipstream.rightHeaderContentRegion.$el.addClass(plugin_name);
                } 
                else {
                    var options = {view: view};
                    Slipstream.rightHeaderContentRegion.show(new RightHeaderContentView(options));
                }
                // If right header view is increasing the page header height (going to next line), then subtract that from main region to avoid scrollbar.
                Slipstream.vent.trigger("page:header:modified");   
            }
        };  

        /** 
         * Event handler for right header view
         * 
         * @event rightHeader:content:set
         * @property {Slipstream.View} | {String} view - the view object or string to be rendered into the framework's right header region.
         * @property {String} plugin_name - The current plugin name
         */
        Slipstream.vent.on("rightHeader:content:set", function(view, plugin_name) {
                setRightHeader(view, plugin_name);
        });

        /** 
         * View rendering event
         * 
         * @event view:render
         * @type {Object}
         * @property {Object} view - The view to be rendered
         * @property {Object} options - A set of options related to rendering of the content view (optional)
         * @property {Object} options.contentTitle - The (optional) title that will be rendered in the content pane header.
         * @property {String} plugin_name - The current plugin name
         */
        Slipstream.vent.on('view:render', function(view, options, plugin_name) {
            API.renderView(view, options, plugin_name);
            // Setup the tracking on content impressions for the content sections in the main content pane.
            Slipstream.commands.execute("analytics_provider:trackContentImpressionsWithinNode", Slipstream.mainRegion.$el[0])
        });

        Slipstream.vent.on("ui:nav:url", function() {
            // Close all open overlays on navigation
            OverlayManager.getInstance().modals.closeAll();    
        });

        /**
         * Get the content pane DOM element
         */
        var getContentPane = function() {
            return $(Slipstream.mainRegion.el);
        };

        Slipstream.reqres.setHandler("ui:getContentPane", getContentPane);
	});

	return Slipstream.ViewManager;
});