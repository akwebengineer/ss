/**
 * The List Builder test page.
 * @copyright Juniper Networks, Inc. 2014
 * @author Miriam Hadfield <mhadfield@juniper.net>
 */

require.config({
    baseUrl: '/assets/js/',
    paths: {
        "text": "vendor/require/text"
    }
});

require(['text!conf/requireConf.json'], function(requireConfig) {
    require.config(JSON.parse(requireConfig));
    require([
        'jquery',
        'foundation.core',
        'underscore'
    ], function ($, foundation) {

        $(document).foundation();
        // Renders a list builder from the elements configuration file
        require(['widgets/listBuilder/tests/appListBuilder'], function (ListBuilderView) {
            new ListBuilderView({
                el: $('#main_content')
            });
        });
    });
});