/*
Base main file for widget explorer.
Called from base html.
No more main file needs to be creted (except the one for start page) and this file should not be modified.
*/
require.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'vendor/jquery/jquery',
        "jquery-i18n": 'lib/jquery-i18n-properties/jquery.i18n.properties',
        jqueryui: 'vendor/jquery/jquery-ui',
        modernizr: 'vendor/modernizr/modernizr',
        underscore: 'vendor/underscore/underscore',
        template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
        hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
        backbone: 'vendor/backbone/backbone',
        validator: 'vendor/validator/validator',
        text: 'vendor/require/text',
        marionette: 'vendor/backbone/backbone.marionette',
        'foundation.core': 'vendor/foundation/js/foundation/foundation',
        //highcharts: 'vendor/highcharts/highcharts',
        highcharts: 'vendor/highcharts/highstock',
        highchartsmore: 'vendor/highcharts/highcharts-more',
        jqueryTabs: 'vendor/jquery/tabs/jquery-ui-tabs',
        'jqueryVerticalTabs': 'widgets/tabContainer/lib/vertical-tabs',
        'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
        jqueryDatepicker: 'vendor/jquery/jquery-ui-datepicker',
        'select2': 'vendor/jquery/select2/select2.full',
        //marionette: 'vendor/backbone/backbone.marionette',
        'backbone.modal': "vendor/backbone/backbone.modal",
        'backbone.marionette.modals': "vendor/backbone/backbone.marionette.modals",
        mockjax: 'vendor/jquery/jquery.mockjax',
        progressbar: 'vendor/progressbar/progressbar.min',
        isInViewport: 'vendor/jquery/isInViewport/isInViewport',
        jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
        'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
        'MutationObserver': 'vendor/MutationObserver.js/MutationObserver',

        //from ConfirmationDialog
        URI: 'vendor/uri/URI',
        "jquery.idle-timer": 'vendor/jquery/jquery.idle-timer',
        'jquery.shapeshift': 'vendor/jquery/jquery.shapeshift',
        'jquery.toastmessage': 'vendor/jquery/jquery.toastmessage',
        'toastr': 'vendor/jquery/toastr/toastr',
        jcarousel: 'vendor/jquery/jcarousel/jquery.jcarousel',
        foundation: 'vendor/foundation/foundation',
        'backbone.localStorage': 'vendor/backbone/backbone.localStorage',
        'backbone.picky': 'vendor/backbone/backbone.picky',
        'backbone.syphon': 'vendor/backbone/backbone.syphon',
        d3: 'vendor/d3/d3',
        gridLocale: 'vendor/jquery/jqGrid/i18n/grid.locale-en',
        'jquery.resize': 'vendor/jquery/jquery.resize',

        /* Foundation */
        'foundation.abide': 'vendor/foundation/js/foundation/foundation.abide',
        'foundation.accordion': 'vendor/foundation/js/foundation/foundation.accordion',
        'foundation.alert': 'vendor/foundation/js/foundation/foundation.alert',
        'foundation.clearing': 'vendor/foundation/js/foundation/foundation.clearing',
        'foundation.dropdown': 'vendor/foundation/js/foundation/foundation.dropdown',
        'foundation.interchange': 'vendor/foundation/js/foundation/foundation.interchange',
        'foundation.joyride': 'vendor/foundation/js/foundation/foundation.joyride',
        'foundation.magellan': 'vendor/foundation/js/foundation/foundation.magellan',
        'foundation.offcanvas': 'vendor/foundation/js/foundation/foundation.offcanvas',
        'foundation.orbit': 'vendor/foundation/js/foundation/foundation.orbit',
        'foundation.reveal': 'vendor/foundation/js/foundation/foundation.reveal',
        'foundation.tab': 'vendor/foundation/js/foundation/foundation.tab',
        'foundation.tooltip': 'vendor/foundation/js/foundation/foundation.tooltip',
        'foundation.topbar': 'vendor/foundation/js/foundation/foundation.topbar',

        /*layout*/
        'goldenLayout': 'vendor/jquery/goldenLayout/goldenlayout',
         infiniteScroll: 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
         tagit: 'widgets/search/lib/tag-it',
         'slick': 'vendor/jquery/slick/slick',
         /*chedule recurrence*/
         'sidr': 'vendor/jquery/sidr/jquery.sidr.min',
         'uuid': 'vendor/uuid/uuid',
         'leaflet'               : 'vendor/leaflet/leaflet-src',
        'leaflet_canvas_layer'  : 'vendor/leaflet/leaflet_canvas_layer',
        'canvasv5'              : 'vendor/polyfills/canvasv5.js/canvasv5',
        'jstree': 'vendor/jquery/jstree/jstree'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        template: {
            exports: 'template'
        },
        hogan: {
            deps: [ 'template' ],
            exports: 'Hogan'
        },
        backbone: {
            deps: [ 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'backbone.modal': {
            deps: ['backbone'],
            exports: 'Backbone.Modal'
        },
        'backbone.marionette.modals': {
            deps: ['backbone', 'marionette'],
            exports: 'Backbone.Marionette.Modals'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'jquery-i18n': {
            deps: ['jquery'],
            exports: 'jQuery.i18n'
        },
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        'jqueryTabs': {
            deps: ['jquery'],
            exports: 'tabs'
        },
        'jqueryVerticalTabs': {
            deps: ['jqueryTabs']
        },
        'jquery.tooltipster': {
            deps: ['jquery'],
            exports: 'tooltipster'
        },
        'highcharts': {
            deps: ['jquery'],
            exports: 'highcharts'
        },
        'highchartsmore': {
            deps: ['highcharts', 'jquery'],
            exports: 'highchartsmore'
        },
        jqueryDatepicker: {
            deps: ['jquery'],
            exports: 'jqueryDatepicker'
        },
        'select2': {
            deps: ['jquery'],
            exports: 'select2'
        },
        //from ConfirmationDialog
        'URI': {
            exports: 'URI'
         },

        'jquery.shapeshift': {
            deps: ['jqueryui'],
            exports: 'shapeshift'
        },
        jcarousel: {
            deps: ['jquery'],
            exports: 'jcarousel'
        },
        'toastr': {
            deps: ['jquery'],
            exports: 'toastr'
        },
        'jquery.resize': {
            deps: ['jquery'],
            exports: 'resize'
        },

        'backbone.localStorage': {
            deps: [ 'backbone'],
            exports: 'Backbone.LocalStorage'
        },
        'backbone.picky': ['backbone'],
        'backbone.syphon': {
            deps: [ 'backbone'],
            exports: 'Backbone.Syphon'
        },


        jqGrid: {
            deps: ['jquery','gridLocale'],
            exports: 'jqGrid'
        },
        'jquery.contextMenu': {
            deps: ['jquery'],
            exports: '$.contextMenu'
        },

        /* Foundation */
        'foundation.abide': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.accordion': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.alert': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.clearing': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.dropdown': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.interchange': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.joyride': {
            deps: [
                'foundation.core',
                'foundation.cookie'
            ]
        },
        'foundation.magellan': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.offcanvas': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.orbit': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.reveal': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.tab': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.tooltip': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.topbar': {
            deps: [
                'foundation.core'
            ]
        },
        tagit: {
            deps: ['jquery','jqueryui'],
            exports: 'tagit'
        },
        infiniteScroll: {
            deps: ['jquery'],
            exports: 'infiniteScroll'
        },
        'goldenLayout': {
            deps: ['jquery'],
            exports: 'goldenLayout'
        },
        'slick': {
            deps: ['jquery'],
            exports: 'slick'
        },
        'sidr': {
            deps: ['jquery'],
            exports: 'sidr'
        },
        'MutationObserver': {
            exports: 'MutationObserver'
        },
        'leaflet_canvas_layer' : {
            deps: ['leaflet']
        }
    }

});


define([
    'jquery',
    'foundation.core',
    'underscore'
], function ($, foundation) {

    $(document).foundation();
    //Renders a Tab Container widget from a configuration object
   require(['explorer/widgets/js/tabs'], function(TestTabContainerView){
        new TestTabContainerView({
            el: $('#main_content')
        });
    });
});
