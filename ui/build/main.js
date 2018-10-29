/**
 * Require JS main module for inclusion in landing page
 *
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @author Dennis Park <dpark@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

require.config({
    paths: {
        URI: 'empty:',
        'jquery': 'empty:',
        'jqueryui': 'empty:',
        "jqueryDatepicker": 'empty:',
        "jquery-i18n": 'empty:',
        "jquery.idle-timer": 'empty:',
        'jquery.shapeshift': 'empty:',
        'jquery.toastmessage': 'empty:',
        'jstree': 'empty:',
        'toastr': 'empty:',
        'select2': 'empty:',
        jcarousel: 'empty:',
        modernizr: 'empty:',
        foundation: 'empty:',
        underscore: 'empty:',
        template: 'empty:',
        hogan: 'empty:',
        backbone: 'empty:',
        'backbone.localStorage': 'empty:',
        'backbone.picky': 'empty:',
        "backbone.modal": 'empty:',
        "backbone.marionette.modals": 'empty:',
        'backbone.syphon': 'empty:',
        'marionette': 'empty:',
        validator: 'empty:',
        text: '../../slipstream/public/assets/js/vendor/require/text',
        d3: 'empty:',
        highcharts: 'empty:',
        highchartsmore: 'empty:',
        gridLocale: 'empty:',
        jqGrid: 'empty:',
        'jquery.contextMenu': 'empty:',
        'jquery.tooltipster': 'empty:',
        'MutationObserver': 'empty:',
        jqueryTabs: 'empty:',
        jqueryVerticalTabs: 'empty:',
        'mockjax': 'empty:',
        'leaflet': 'empty:',
        'progressbar': 'empty:',
        'moment': 'empty:',
        'leaflet_canvas_layer': 'empty:',
        'uuid': 'empty:',
        tagit: 'empty:',
        'sidr': 'empty:',
        isInViewport: 'empty:',
        'infiniteScroll': 'empty:',
        'canvasv5' : 'empty:',

        /* Foundation */
        'foundation.core': 'empty:',
        'foundation.abide': 'empty:',
        'foundation.accordion': 'empty:',
        'foundation.alert': 'empty:',
        'foundation.clearing': 'empty:',
        'foundation.dropdown': 'empty:',
        'foundation.interchange': 'empty:',
        'foundation.joyride': 'empty:',
        'foundation.magellan': 'empty:',
        'foundation.offcanvas': 'empty:',
        'foundation.orbit': 'empty:',
        'foundation.reveal': 'empty:',
        'foundation.tab': 'empty:',
        'foundation.tooltip': 'empty:',
        'foundation.topbar': 'empty:',
        'slipstream.installed_plugins' : '.',
        'widgets' : 'empty:',
        'lib' : 'empty:',
        //'slipstream.installed_plugins/event-viewer': 'empty:',
        //'slipstream.installed_plugins/reports': 'empty:',
        //'slipstream.installed_plugins/sd-common': 'empty:'


    },
    shim: {

    },
    exclude: [
    ],
    include: [
//        'sd-common/js/sse/smSSEEventSubscriber'
    ]
});
