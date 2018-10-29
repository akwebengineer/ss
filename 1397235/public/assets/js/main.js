/**
 * Require JS main module for inclusion in landing page
 *
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

require.config({
    baseUrl: '/assets/js/',
    paths: {
        "text": "vendor/require/text"
    },
    config: {
        "es6": {
            "modules": undefined
        }
    }
});
require(['text!conf/requireConf.json'], function(requireConfig) {
    require.config(JSON.parse(requireConfig));

    require(['Slipstream', 'lib/module_loader/module_loader'], function (Slipstream) {
        Slipstream.boot();
    });

    require([
        'jquery',
        'modernizr',
        "jqSvgdom",//jquery-svg polyfill
        'foundation.accordion',
        'foundation.dropdown'
    ], function ($, Modernizr) {
        $(document).foundation();
        require(['jquery.toastmessage'], function() {});
    });
});