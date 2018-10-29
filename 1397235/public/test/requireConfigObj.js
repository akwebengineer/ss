var configObj = {
  baseUrl: '/assets/js/',
  paths: {
    'URI'                       : 'vendor/uri/URI',
    'jquery'                    : 'vendor/jquery/jquery',
    'jqueryui'                  : 'vendor/jquery/jquery-ui',
    'jqueryDatepicker'          : 'vendor/jquery/jquery-ui-datepicker',
    'jcarousel'                 : 'vendor/jquery/jcarousel/jquery.jcarousel',
    'jquery.idle-timer'         : 'vendor/jquery/jquery.idle-timer',
    'jquery.shapeshift'         : 'vendor/jquery/jquery.shapeshift',
    'jquery-deparam'            : 'vendor/jquery/jquery-deparam/jquery-deparam',
    'jquery-i18n'               : 'lib/jquery-i18n-properties/jquery.i18n.properties',
    'jquery.contextMenu'        : 'vendor/jquery/jqContextMenu/jquery.contextMenu',
    'jqueryNumberStepperGlobalize': 'vendor/jquery/jqSpinner/globalize',
    'jquery.toastmessage'       : 'vendor/jquery/jquery.toastmessage',
    'underscore'                : 'vendor/underscore/underscore',
    'template'                  : 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
    'hogan'                     : 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
    'backbone'                  : 'vendor/backbone/backbone',
    'backbone.localStorage'     : 'vendor/backbone/backbone.localStorage',
    'backbone.picky'            : 'vendor/backbone/backbone.picky',
    'backbone.syphon'           : 'vendor/backbone/backbone.syphon',
    'marionette'                : 'vendor/backbone/backbone.marionette',
    'backbone.modal'            : 'vendor/backbone/backbone.modal',
    'backbone.marionette.modals': 'vendor/backbone/backbone.marionette.modals',
    'elasticlunr'               : 'vendor/elasticlunr/elasticlunr',
    'mocha'                     : 'vendor/mocha/mocha',
    'chai'                      : 'vendor/chai/chai',
    'text'                      : 'vendor/require/text',
    'link'                      : 'vendor/require/link',
    'modernizr'                 : 'vendor/modernizr/modernizr',
    'd3'                        : 'vendor/d3/d3',
    'dagre'                     : 'vendor/dagre/dagre.min',
    'jsPlumb'                   : 'vendor/jsPlumb/jsplumb.min',
    'validator'                 : 'vendor/validator/validator',
    'jqGrid'                    : 'vendor/jquery/jqGrid/jquery.jqGrid',
    'highcharts'                : 'vendor/highcharts/highstock',
    'highchartsmore'            : 'vendor/highcharts/highcharts-more',
    'toastr'                    : 'vendor/jquery/toastr/toastr',
    'select2'                   : 'vendor/jquery/select2/select2.full',
    'MutationObserver'          : 'vendor/MutationObserver.js/MutationObserver',
    'leaflet'                   : 'vendor/leaflet/leaflet-0.7.3',
    'mockjax'                   : 'vendor/jquery/jquery.mockjax',
    'moment'                    : 'vendor/moment/moment-with-locales.min',
    "moment-tz"                 : "vendor/moment/moment-timezone-with-data.min",
    'progressbar'               : 'vendor/progressbar/progressbar.min',
    'jstree'                    : 'vendor/jquery/jstree/jstree',
    'gridLocale'                : 'vendor/jquery/jqGrid/i18n/grid.locale-en',
    'leaflet_canvas_layer'      : 'vendor/leaflet/leaflet_canvas_layer',
    'jqueryTabs'                : 'vendor/jquery/tabs/jquery-ui-tabs',
    'jqueryVerticalTabs'        : 'widgets/tabContainer/lib/vertical-tabs',
    'tagit'                     : 'widgets/search/lib/tag-it',
    'uuid'                      : 'vendor/uuid/uuid',
    'sidr'                      : 'vendor/jquery/sidr/jquery.sidr.min',
    'isInViewport'              : 'vendor/jquery/isInViewport/isInViewport',
    'infiniteScroll'            : 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
    'canvasv5'                  : 'vendor/polyfills/canvasv5.js/canvasv5',
    'slick'                     : 'vendor/jquery/slick/slick',
    'goldenLayout'              : 'vendor/jquery/goldenLayout/goldenlayout',
    'jquery.resize'             : 'vendor/jquery/jquery.resize',
    'pwstrength'                : 'vendor/pwstrength/pwstrength-foundation',
    'nouislider'                : 'vendor/jquery/nouislider/nouislider',
    'masonry'                   : "vendor/jquery/masonry/masonry.pkgd",
    'jQueryBridget'             : "vendor/jquery/masonry/jquery-bridget" ,
    /* Foundation */
    'foundation'              : 'vendor/foundation/js/foundation.min',
    'foundation.core'           : 'vendor/foundation/js/foundation',
    'foundation.abide'          : 'vendor/foundation/js/foundation/foundation.abide',
    'foundation.accordion'      : 'vendor/foundation/js/foundation/foundation.accordion',
    'foundation.alert'          : 'vendor/foundation/js/foundation/foundation.alert',
    'foundation.clearing'       : 'vendor/foundation/js/foundation/foundation.clearing',
    'foundation.dropdown'       : 'vendor/foundation/js/foundation/foundation.dropdown',
    'foundation.interchange'    : 'vendor/foundation/js/foundation/foundation.interchange',
    'foundation.joyride'        : 'vendor/foundation/js/foundation/foundation.joyride',
    'foundation.magellan'       : 'vendor/foundation/js/foundation/foundation.magellan',
    'foundation.offcanvas'      : 'vendor/foundation/js/foundation/foundation.offcanvas',
    'foundation.orbit'          : 'vendor/foundation/js/foundation/foundation.orbit',
    'foundation.reveal'         : 'vendor/foundation/js/foundation/foundation.reveal',
    'foundation.tab'            : 'vendor/foundation/js/foundation/foundation.tab',
//    'foundation.tooltip'        : 'vendor/foundation/js/foundation/foundation.tooltip',
    'foundation.topbar'         : 'vendor/foundation/js/foundation/foundation.topbar',
    'jquery.tooltipster'        : 'vendor/jquery/jqTooltipster/jquery.tooltipster',
    'pegjs'                     : 'vendor/pegjs/peg-0.10.0',
    'jqAutoComplete'            : 'vendor/jquery/autoComplete/jquery.autocomplete',
    'editable'                  : 'vendor/editable/editable',
    'colorpicker'               : 'vendor/jquery/colorpicker/colorpicker',
    'jqSvgdom'                  : 'vendor/jquery/jquery.svgdom'
  },
  shim: {
    'modernizr' : {
        exports: 'Modernizr'
    },
    'URI': {
      exports: 'URI'
    },
    'underscore': {
      exports: '_'
    },
    'jquery': {
      exports: '$'
    },
    'jquery-i18n': {
        deps: ['jquery'],
        exports: 'jQuery.i18n'
    },
    'toastr': {
        deps: ['jquery'],
        exports: 'toastr'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.picky': {
        deps: ['backbone'],
        exports: 'Backbone.Picky'
    },
    'marionette' : {
      deps: ['backbone'],
      exports: 'Marionette'
    },
    'backbone.modal': {
          deps: [ 'backbone'],
          exports: 'Backbone.Modal'
      },
      'backbone.marionette.modals': {
          deps: [ 'backbone','marionette'],
          exports: 'Backbone.Marionette.Modals'
      },
    'hogan': {
        deps: [ 'template' ],
        exports: 'Hogan'
    },
    'd3': {
        exports: 'd3'
    },
    'backbone.syphon': {
        deps: [ 'backbone'],
        exports: 'Backbone.Syphon'
    },
    'leaflet_canvas_layer': {
      deps: ['leaflet']
    },
    'jquery.shapeshift': {
        deps: ['jqueryui'],
        exports: 'shapeshift'
    },
    'jcarousel': {
        deps: ['jquery'],
        exports: 'jcarousel'
    },
    'jquery-deparam': {
        deps: ['jquery'],
        exports: 'jquery-deparam'
    },
    'jqueryDatepicker':{
        deps: ['jquery'],
        exports: 'jqueryDatepicker'
    },
    jqGrid: {
        deps: ['jquery', 'gridLocale'],
        exports: 'jqGrid'
    },
    'jquery.contextMenu': {
        deps: ['jquery'],
        exports: '$.contextMenu'
    },
    'highcharts':{
        deps: ['jquery'],
        exports: 'highcharts'
    },
    'highchartsmore': {
          deps: ['highcharts', 'jquery'],
          exports: 'highchartsmore'
    },
    'jsPlumb': {
      exports: 'jsPlumb'
    },
    'jquery.tooltipster': {
         deps: ['jquery'],
         exports: 'tooltipster'
    },
    'select2': {
         deps: ['jquery'],
         exports: 'select2'
    },
    'jstree': {
         deps: ['jquery'],
         exports: 'jstree'
    },
    'jqueryTabs': {
        deps: ['jquery'],
        exports: 'tabs'
    },
    'jqueryVerticalTabs': {
        deps: ['jqueryTabs']
    },
    tagit: {
      deps: ['jquery','jqueryui'],
      exports: 'tagit'
    },
    infiniteScroll: {
      deps: ['jquery'],
      exports: 'infiniteScroll'
    },
    'slick': {
      deps: ['jquery'],
      exports: 'slick'
    },
    'pwstrength': {
        'deps': ['jquery'],
        'exports': 'pwstrength'
    },
    'goldenLayout': {
      deps: ['jquery'],
      exports: 'goldenLayout'
    },
    'jquery.resize': {
      deps: ['jquery'],
      exports: 'resize'
    },
    "jqueryNumberStepperGlobalize": {
      "deps": [
          "jquery",
          "jqueryui"
      ],
      "exports": "jqueryNumberStepperGlobalize"
    },
    /* Foundation */
    'foundation.core': {
        deps: [
            'jquery',
            'modernizr'
        ],
        exports: 'Foundation'
    },
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
    'MutationObserver': {
        exports: 'MutationObserver'
    },
    'jqueryTabs': {
            deps: ['jquery'],
            exports: 'tabs'
    },
    'jqueryVerticalTabs': {
        deps: ['jqueryTabs']
    },
    tagit: {
        deps: ['jquery','jqueryui'],
        exports: 'tagit'
    },
    'isInViewport': {
      deps: ['jquery']
    },
    'masonry': {
      deps: ['jquery', 'jQueryBridget'],
      exports: 'masonry'
    },
    "colorpicker": {
      "deps": [
          "jquery",
          "jqueryui"
      ],
      "exports": "colorpicker"
    },
      "jqSvgdom": {
          "deps": [
              "jquery"
          ],
          "exports": "jqSvgdom"
      }
  },
  urlArgs: 'bust=' + (new Date()).getTime()
};
