/**
 * The main Slipstream lite application module
 *
 * @module slipstream
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
(function() {
    /**
     * Get the base URL to be used to load slipstream
     * modules via requirejs.
     *
     * @return The base URL to be used for loading slipstream
     * modules.
     */
    function getBaseURL() {
        var scripts = document.scripts,
            baseUrl = "";

        for (var i = 0; i < scripts.length; i++) {
            /**
             * Get the src property of the slipstream.js <script> element and
             * return it's base URL.
             */
            var match = scripts[i].src.match(/(.*)\/slipstream.js$/);

            if (match) {
                baseUrl = match[1];
                break;
            }
        }

        return baseUrl;
    }

    /**
     * Dynamically load a CSS file
     *
     * @param url - The url of the CSS file to be loaded.
     */
    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    /**
     * Load the inline sprite
     *
     * @param onload - A callback to be executed after the sprite is loaded.  This callback
     * is executed whether the load operation is successful or not.
     */
    function loadSprite(onload) {
        $.ajax({
            url: "/assets/images/icon-inline-sprite.svg",
            dataType: "text"
        }).done(function(data) {
            $("body").append(data);        
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log("Failed to fetch SVG sprite, some icons may not render.");
        }).always(function() {
            if (onload) {
                onload();
            }
        });
    }

    window.slipstream = {
        initialize: function(options) {
            var baseUrl = getBaseURL();

            if (!baseUrl) {
                throw new Error("Can't determine slipstream base URL.  Slipstream must be included using a <script> tag.");
            }

            loadCss(baseUrl + "/../css/slipstream.css");

            require.config({
                baseUrl: baseUrl
            });

            require(["requireConf"], function(requireConf) {
                requireConf.baseUrl = baseUrl;
                require.config(requireConf);
                
                require(["marionette", "svg4everybody"], function(Marionette, svg4everybody) {
                    var Slipstream = new Marionette.Application();

                    Slipstream.on("start", function() {
                        svg4everybody();

                        // load the inline sprite
                        loadSprite(function() {
                            console.log("Slipstream started");
                            // call provided callback when initialization is complete.
                            if (options.onInit && (typeof options.onInit == "function")) {
                                options.onInit();
                            }
                        });
                    });

                    window.Slipstream = Slipstream;

                    require(["modules/i18n", "modules/template_renderer", "sdk/preferences", "modules/view_adapter"], function() {
                        Slipstream.start();
                    });
                });
            })
        }
    }
})();