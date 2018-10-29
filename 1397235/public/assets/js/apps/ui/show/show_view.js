/** 
 * A module that implements a view representing the framework's UI
 *
 * @module 
 * @name Slipstream/UI/Show
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define(["text!./templates/full_chrome.tpl",
        "text!./templates/content_only.tpl", 
        "text!./templates/default_content.tpl",
        "text!./templates/fatal_error.tpl",
        "text!./templates/busy_template.tpl",
        "text!./templates/global_search.tpl",
        "text!build-info.json",
        "conf/global_config",
        "modules/view_adapter",
        "jquery.tooltipster",
        "jqueryui",
        "lib/i18n/i18n", 
        "sdk/URI", 
        "widgets/spinner/spinnerWidget", 
        "widgets/contextMenu/contextMenuWidget",
        "widgets/tooltip/tooltipWidget",
        'sidr'], 
    function(chromeTemplate, contentOnlyTemplate, defaultTemplate, errorTemplate, busyTemplate, globalSearchTemplate, build_info, global_config, ViewAdapter, TooltipWidget, jqueryui, i18n, URI, SpinnerWidget, ContextMenuWidget, TooltipWidget, sidr) {
        Slipstream.module("UI.Show", function(Show, Slipstream, Backbone, Marionette, $, _) {
            var uiSelector = "#slipstream_ui";
            var leftNavMinWidth = 200; // pixels
            var page_header_current_height = 0 // pixels
            
            // global config NLS context
            var global_conf_nls_context = {
                ctx_root: "/assets/js/conf",
                ctx_name: "__global_conf__"
            };

            var global_search = false;

            /**
             * Set the browser's document title
             *
             * @param {String} title - The title to be set as the document title.
             */
            function setDocumentTitle(title) {
                var docTitle = "";

                if (global_config && global_config.product_name) {
                    docTitle = Slipstream.reqres.request("nls:retrieve", {
                                   msg: global_config.product_name,
                                   namespace: global_conf_nls_context.ctx_name
                               });
                }

                if (title) {
                    docTitle = (docTitle ? docTitle + " - " : "") + title;
                } 

                document.title = docTitle;
            }

            /**
             * Set the UI title
             * 
             * @param {String} title - The title string to be set
             */
            function setTitle(title) {
                // Remove any HTML tags from the title before rendering them in the utility nav or document title.
                var cleansed_title = title && title.replace(/(<([^>]+)>)|(&lt;([^>]+)&gt;)/ig, "").trim();

                // Set the browser's document title
                setDocumentTitle(cleansed_title);

                // Set the title in the utility nav
                var logo_section_selector = uiSelector + " .slipstream-logo-section";
                $(logo_section_selector + " .slipstream-title-bar-title").html(cleansed_title || "");
                
                var product_logo = $(logo_section_selector + " .slipstream-product-logo");
                cleansed_title ? product_logo.hide() : product_logo.show();
            }

            /**
             * Set the logo in the UI toolbar
             * 
             * @param {Object} view - The view representing the toolbar logo.
             */
            function setLogo(view) {
                var logo_container = $(".slipstream-product-logo");

                // remove any existing logo elements
                logo_container.empty();

                // render the new logo view and insert it into the logo container
                var viewAdapter = new ViewAdapter({view: view});
                viewAdapter.render();
                logo_container.append($(view.el));
            }

            /**
             * Display the tooltip for the left navigation menu control
             */
            function displayNavMenuControlTooltip() {
                var tooltipAnchor = $("#leftnav-maincontent-wrapper .right-pane .menu-control");

                tooltipAnchor.tooltipster({
                    position: "right",
                    trigger: "custom",
                    minWidth: 150,           
                    theme: 'tooltipster-shadow',   
                    content: i18n.getMessage("nav_menu_collapse_helper"),  
                    timer: 5000
                }).tooltipster('show');
            }

            /**
             * Modify Main region's height
             *
             */
            function modifyHeight() {
                var $uiSelectorContainer = $(uiSelector);
                var page_header_height = $uiSelectorContainer.find('.page-header').height();
                    
                // If page_header's height is changed, then modify the height of main_region
                if(page_header_height !== page_header_current_height) {
                    page_header_current_height = page_header_height;
                    var $main_region_selector = $uiSelectorContainer.find('#main_content'),
                        right_pane_height = $uiSelectorContainer.find('.right-pane').height();

                    $main_region_selector.outerHeight(right_pane_height - page_header_height);
                }
            }

            Slipstream.vent.on("search_provider:discovered", function(provider) {
                 global_search = true;
            });

            Slipstream.commands.execute("nls:loadBundle", global_conf_nls_context);

            if (global_config && global_config.product_name) {
                document.title = 
                    Slipstream.reqres.request("nls:retrieve", {
                        msg: global_config.product_name,
                        namespace: global_conf_nls_context.ctx_name
                    });
            }

            Slipstream.commands.setHandler("ui:setSecondaryNavigationVisibility", function(makeVisible, force, generateNavHint) {
                if (!makeVisible) {
                    // Ignore close requests if the nav is already closed or the user has explicilty pinned open the left nav 
                    var leftNavPinnedByUser = Slipstream.reqres.request("ui:preferences:get", "ui:nav:left:expandedByUser");
                    var leftNavPinned = Slipstream.reqres.request("ui:preferences:get", "ui:nav:left:expanded");

                    /**
                     * Ignore the close request if the panel is already closed or if the user has the panel pinned
                     * and the close is not being 'forced'.  A close request may be forced if the panel has been
                     * pinned open but there are no secondary navigation elements to be shown for the selected
                     * primary nav element.
                     */
                    if (!$.sidr('status').opened || (!force && leftNavPinned && leftNavPinnedByUser)) {
                        return;
                    }  
                }
                   
                var secondaryNavRegion =  $('#secondary-nav-region-wrapper');

                if (secondaryNavRegion.length) {
                     $.sidr(makeVisible ? "open" : "close", 'secondary-nav-region-wrapper');
                }

                if (!makeVisible && generateNavHint) {
                    var haveDisplayedNavMenuControlTooltip = Slipstream.reqres.request("ui:preferences:get", "ui:nav:menuControl:tooltip:displayed");

                    if (!haveDisplayedNavMenuControlTooltip) {    
                        displayNavMenuControlTooltip(); 
                        Slipstream.vent.trigger("ui:preferences:change", "ui:nav:menuControl:tooltip:displayed", true);
                    }
                }
            })

            Slipstream.reqres.setHandler("ui:getSecondaryNavigationVisibility", function() {
                return $.sidr('status').opened != false;
            });

            // Handle requests to set the UI title
            Slipstream.commands.setHandler("ui:title:set", function(title) {
                setTitle(title);
            });

            // Handle requests to set the UI logo
            Slipstream.commands.setHandler("ui:logo:set", function(view) {
                setLogo(view);
            });

            // solves browser scrollbar issue
            Slipstream.vent.on("page:header:modified", modifyHeight); 
        
            Slipstream.commands.setHandler("nav:secondary:activate", function(hasSecondary) {
                if (hasSecondary) {
                     $(".menu-control").removeClass("disabled");
                }
                else {
                    $(".menu-control").addClass("disabled"); 
                }
            })

            /**
             * Construct a FullView of the UI
             *
             * @constructor
             * @class FullView
             * @classdesc A view representing the full framework UI
             */
            Show.FullView = Marionette.ItemView.extend({
                el: uiSelector,
                initialize: function() {
                    this.build_number = undefined;
                    this.recentSearchesPane;
                    this.recentSearchesContainer;

                    try {
                        this.build_number = $.parseJSON(build_info).build_number;
                    }
                    catch (err) {
                        console.log("Failed to parse build info file:", err);
                    }
                },

                events: {
                    "click .search-button": "handleDoSearch",
                    "click #slipstream-global-search": "showRecentSearches"
                },
                template: chromeTemplate,

                showRecentSearches: function(e) {
                    if (this.global_search_field .val() != "") {
                        return;
                    }

                    var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_SEARCH_LIST_RECENT, {uri:new URI("search://")});
                    var self = this;

                    Slipstream.vent.trigger("activity:start", intent, {
                        callback: function(result, data) {
                            if (result == Slipstream.SDK.BaseActivity.RESULT_OK) {
                                if (data.length == 0) {
                                    return;
                                }

                                var recentSearchElements = data.reverse().map(function(query) {
                                    return {
                                        label: query,
                                        key: query + _.uniqueId("@")
                                    }    
                                });

                                // destroy existing recent searches pane
                                self.recentSearchesPane && self.recentSearchesPane.destroy();

                                self.recentSearchesPane = new ContextMenuWidget({
                                    elements: {
                                        callback: function(key, opt) {
                                            var rawKey = key.slice(0, key.lastIndexOf("@"));
                                            self.global_search_field.val(rawKey);
                                            self.global_search_field.focus();
                                            self.doSearch();
                                        },
                                        determinePosition: function(menu) {
                                            menu.position({my: "left top", at: "left bottom", of: self.global_search_field})
                                                 .css('width', self.global_search_field.outerWidth());
                                        },
                                        items: [
                                            {
                                                title: i18n.getMessage("global_search_recent_searches_title"), 
                                                className: "slipstream-recentSearchesTitle"
                                            }
                                        ].concat(recentSearchElements)
                                    },
                                    container: "#slipstream-global-search",
                                    trigger: "none"
                                });

                                self.recentSearchesPane.build();
                                self.recentSearchesPane.open();
                            }
                        }
                    });
                },

                handleDoSearch: function(e) {
                     e.preventDefault();
                     this.doSearch();
                },

                doSearch:function() {
                    var self = this;
                    var query_string = self.global_search_field.val();
                    
                    if (query_string != "") {
                        var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_SEARCH, {uri:new URI("search://")});
                        intent.putExtras({'query': query_string, 'origin': 'AppView'});
                        Slipstream.vent.trigger("activity:start", intent);
                    }
                },

                /**
                 * Render the UI
                 *
                 * @inner
                 */
                render: function() {
                    var logo_link = "#", logo_tooltip_text, logo_src, logo_width, logo_height;
                    var  global_help_id = null;
                    if (global_config && global_config.logo) {
                        logo_link = global_config.logo.link;

                        if (global_config.logo.tooltip) {
                            logo_tooltip_text = Slipstream.reqres.request("nls:retrieve", {
                                msg: global_config.logo.tooltip,
                                namespace: global_conf_nls_context.ctx_name
                            });
                        }

                        if (global_config.logo.img) {
                            if (global_config.logo.img.src) {
                                logo_src = global_config.logo.img.src;
                            }
                            
                            if (global_config.logo.img.height) {
                                logo_height = global_config.logo.img.height;
                            }
                            if (global_config.logo.img.width) {
                                logo_width = global_config.logo.img.width;
                            }
                        } 
                    }

                    if (global_config && global_config.global_help_id) {
                        global_help_id = global_config.global_help_id;
                    }

                    // Set initial left nav expanded state
                    var leftNavPinned = Slipstream.reqres.request("ui:preferences:get", "ui:nav:left:expanded");

                    if (leftNavPinned == undefined) { // expanded state has never been set
                        Slipstream.vent.trigger("ui:preferences:change", "ui:nav:left:expanded", true);
                    }
                    
                    var html = Marionette.Renderer.render(this.getTemplate(), {
                        search: i18n.getMessage("chrome_header_search"),
                        advanced: i18n.getMessage("chrome_header_advanced"),
                        globalSearch: global_search,
                        global_search_placeholder: i18n.getMessage("global_search_placeholder"),
                        logo_link: logo_link,
                        logo_src: logo_src,
                        logo_width: logo_width,
                        logo_height: logo_height,
                        global_help_id: global_help_id
                    },{
                        globalSearchContainer: globalSearchTemplate
                    });

                    this.$el.html(html);

                    this.recentSearchesContainer = this.$el.find(".recentSearches");

                    setDocumentTitle();

                    if (logo_tooltip_text) {
                        this.$el.find(".slipstream-logo-section .slipstream-product-logo-image").tooltipster({
                            position: "bottom-left",
                            minWidth: 150,           
                            theme: 'tooltipster-shadow',   
                            content: logo_tooltip_text,
                            delay: 250                  
                        });    
                    }

                    // render build number info (temporary)
                    //this.$el.find(".top_help").tooltipster({
                    //    position: "bottom-left",
                    //    minWidth: 150,           
                    //    theme: 'tooltipster-shadow',   
                    //    content: "build: " + this.build_number,
                    //    delay: 250                  
                    //});

                    var self = this;

                    this.global_search_field = $(this.$el).find(".search-section input[type='search']");

                    var secondary_nav_wrapper = $('#secondary-nav-region-wrapper');
                    var left_nav_width = Slipstream.reqres.request("ui:preferences:get", "ui:nav:left:width");

                    secondary_nav_wrapper.css('width', (left_nav_width || leftNavMinWidth) + "px");                    

                    secondary_nav_wrapper.resizable({
                        handles: "e",
                        minWidth: leftNavMinWidth,
                        ghost: true,
                        stop: function(evt, ui) {
                            var wrapper = $('#leftnav-maincontent-wrapper');
                            var secondaryNavRegion = $('#secondary-nav-region');                          
                            var left_nav_width = ui.element.outerWidth();

                            wrapper.css('left', left_nav_width + 'px');   
                            wrapper.css('width', 'calc(100% - ' + left_nav_width + 'px)');                            
                            // Broadcast an event indicating that the left nav width has changed
                            Slipstream.vent.trigger("ui:preferences:change", "ui:nav:left:width", left_nav_width);
                        }
                    });

                    /**
                     * Register a click handler on the menu slider before the sidr handler
                     * so that click events on the sidr can be prevented when the menu control
                     * is disabled.
                     */
                    $(".menu-control-anchor").on("click", function(e) {
                        if ($.sidr('status').opened) { // currently open, so toggling it closed
                            if ($(".menu-control").hasClass("unpinned")) {
                                Slipstream.vent.trigger("ui:preferences:change", "ui:nav:left:expanded", true);
                                Slipstream.vent.trigger("ui:preferences:change", "ui:nav:left:expandedByUser", true);
                                self.$el.find(".menu-control").removeClass("unpinned");    
                                self.$el.find(".menu-control").addClass("pinned");

                                e.preventDefault();
                                e.stopImmediatePropagation();
                            }
                            else {
                                Slipstream.vent.trigger("ui:preferences:change", "ui:nav:left:expanded", false);
                            }    
                        }
                        else {
                            Slipstream.vent.trigger("ui:preferences:change", "ui:nav:left:expanded", true) 
                        }

                        if ($(".menu-control").hasClass("disabled")) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }
                    });

                    // Set up slider for left navigation
                    $(".menu-control-anchor").sidr({
                        name: 'secondary-nav-region-wrapper',
                        body: '#leftnav-maincontent-wrapper',
                        onOpen: function() {
                            var $sidr = self.$el.find(".sidr");
                            var sidrWidth = $sidr.outerWidth();      

                            if (Slipstream.reqres.request("ui:preferences:get", "ui:nav:left:expanded")) {
                                 self.$el.find(".menu-control").removeClass("unpinned");    
                                 self.$el.find(".menu-control").addClass("pinned");    
                            }
                            else {
                                 self.$el.find(".menu-control").removeClass("pinned");    
                                 self.$el.find(".menu-control").addClass("unpinned");     
                            }                      
                                                
                            $('#leftnav-maincontent-wrapper').css('left',  (sidrWidth)  + 'px');
                            $('#leftnav-maincontent-wrapper').css('width', 'calc(100% - ' + (sidrWidth)  + 'px)');
                        }
                    });

                    Slipstream.vent.on("nav:action:initiated", function(navModel) {
                         var hasSecondaryNav = navModel ? navModel.get("children") : true;
 
                         /**
                          * Display the secondary nav iff the primary nav element has children.  If it has no
                          * children then force the secondary nav closed even if the user has pinned it.
                          */
                         Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", hasSecondaryNav, !hasSecondaryNav);
                    });

                    Slipstream.vent.on("nav:mouseout", function() {
                        if (!Slipstream.reqres.request("ui:preferences:get", "ui:nav:left:expanded")) {
                            Slipstream.commands.execute("ui:setSecondaryNavigationVisibility", false);
                        }
                    });
                }
            });

            /**
             * Construct a view of the UI containing only the content region.
             *
             * @constructor
             * @class ContentOnlyView
             * @classdesc A view representing only the UI's content region
             */
            Show.ContentOnlyView = Marionette.ItemView.extend({
            	el: uiSelector,
            	template: contentOnlyTemplate
            });

            /**
             * Construct a default view of the UI
             *
             * @constructor
             * @class DefaultView
             * @classdesc A default view of the UI containing only
             * a simple 'welcome' message in the content region.
             */
            Show.DefaultView = Marionette.ItemView.extend({
                template: defaultTemplate,
 
                /**
                 * Render the default view of the UI
                 * @inner
                 */
                render: function() {
                    var html = Marionette.Renderer.render(this.getTemplate(), {
                        title: i18n.getMessage("welcome_page_title"),
                        subtitle: i18n.getMessage("welcome_page_subtitle")
                    });
                    this.$el.html(html);
                }
            });

            /**
             * Construct an error view
             *
             * @constructor
             * @class ErrorView
             * @classdesc An error view to be shown for fatal errors.
             */
            Show.ErrorView = Marionette.ItemView.extend({
                template: errorTemplate,
 
                serializeData: function() {
                    return {
                        heading: i18n.getMessage("oops"),
                        error_msg: i18n.getMessage("cant_display_page"),
                    };
                }
            });

            /**
             * Construct a 404 view
             *
             * @constructor
             * @class View404
             * @classdesc An error view to be shown for 404 errors.
             */
            Show.Error404View = Marionette.ItemView.extend({
                initialize: function(options) {
                    this.url_path = options.url_path;
                },
                template: errorTemplate,
 
                serializeData: function() {
                    return {
                        heading: i18n.getMessage("page_not_found_heading"),
                        error_msg: i18n.getMessage({
                            msg: "page_not_found",
                            sub_values: [this.url_path]
                        })
                    };
                }
            });

            /**
             * Construct a privileges error view
             *
             * @constructor
             * @class PrivilegesView
             * @classdesc An error view to be shown for privileges errors.
             */
            Show.PrivilegesErrorView = Marionette.ItemView.extend({
                template: errorTemplate,
 
                serializeData: function() {
                    return {
                        heading: i18n.getMessage("insufficient_privileges_heading"),
                        error_msg: i18n.getMessage("insufficient_activity_privileges")
                    };
                }
            });

            /**
             * Construct a busy view
             *
             * @constructor
             * @class BusyView
             * @classdesc A busy view to be shown in the main content area
             */
            Show.BusyView = Marionette.ItemView.extend({
                template: busyTemplate,
                initialize: function() {
                    this.spinner = undefined;
                    this.$background_el = undefined;
                },
                render: function() {
                    var right_pane = $("#slipstream_ui #leftnav-maincontent-wrapper");
                    var $pane_el = right_pane.length ? right_pane : $("#slipstream_ui");
                    var html = Marionette.Renderer.render(this.getTemplate());
                    this.$background_el = $(html);
                    this.$background_el.css({top: $pane_el.scrollTop()});
                    $pane_el.append(this.$background_el);
                    
                    // add the busy indicator
                    this.spinner = new SpinnerWidget({
                        container: this.$background_el,
                        statusText: " ",
                    }).build();
                },
                remove: function() {
                    if (this.spinner) {
                        this.spinner.destroy();
                    }

                    if (this.$background_el) {
                        this.$background_el.remove();
                    }
                    this.initialize();
                }
            });
        });

        return {
        	FullView: Slipstream.UI.Show.FullView,
        	ContentOnlyView: Slipstream.UI.Show.ContentOnlyView,
            DefaultView: Slipstream.UI.Show.DefaultView,
            ErrorView: Slipstream.UI.Show.ErrorView,
            PrivilegesErrorView: Slipstream.UI.Show.PrivilegesErrorView,
            Error404View: Slipstream.UI.Show.Error404View,
            BusyView: Slipstream.UI.Show.BusyView
        };
});
