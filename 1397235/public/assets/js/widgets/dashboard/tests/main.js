/**
 * The List Builder test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
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

require(['text!conf/requireConf.json', 'text!/assets/images/icon-inline-sprite.svg'], function(requireConfig, sprite) {
    require.config(JSON.parse(requireConfig));
    require([
        'jquery',
        "jqSvgdom",//jquery-svg polyfill
        'foundation.core',
        'Slipstream'
    ], function ($, foundation, jqSvgdom, Slipstream) {

        $(document).foundation();
        $("body").append(sprite);
        Slipstream.boot();
        //Slipstream.vent.on("ui:afterShow", function() {
        require(['widgets/dashboard/tests/appDashboard'], function (DashboardView) {
            new DashboardView({
                el: $('#dashboard_test_content')
            });
        });
        //});
    });
});
