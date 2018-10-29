/**
 * The Map Widget test page.
 * @copyright Juniper Networks, Inc. 2015
 * @author Dennis Park <dpark@juniper.net>
 */

require.config({
    baseUrl: '/assets/js/',
    paths: {
        "text": "vendor/require/text"
    },
    urlArgs: 'debug=true'
});

require(['text!conf/requireConf.json'], function(requireConfig) {
    require.config(JSON.parse(requireConfig));
    require([
        'jquery',
        'foundation.core',
        'underscore',
    ], function ($, foundation) {
        $(document).foundation();
        require(['widgets/map/tests/appMap'],
            function (MapView) {
                new MapView({
                    el: '#main_content'
                });
            });
    });
});
