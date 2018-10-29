require.config({
  baseUrl: 'widgetlib/js',
  paths: {
    URI: 'vendor/uri/URI',
    'jquery': 'vendor/jquery/jquery',
    'jqueryui': 'vendor/jquery/jquery-ui',
    "jqueryDatepicker": 'vendor/jquery/jquery-ui-datepicker',
    "jquery-i18n": 'lib/jquery-i18n-properties/jquery.i18n.properties',
    "jquery.idle-timer": 'vendor/jquery/jquery.idle-timer',
    'jquery.shapeshift': 'vendor/jquery/jquery.shapeshift',
    'jquery.toastmessage': 'vendor/jquery/jquery.toastmessage',
    'jstree': 'vendor/jquery/jstree/jstree',
    'toastr': 'vendor/jquery/toastr/toastr',
    'select2': 'vendor/jquery/select2/select2.full',
    jcarousel: 'vendor/jquery/jcarousel/jquery.jcarousel',
    modernizr: 'vendor/modernizr/modernizr',
    foundation: 'vendor/foundation/foundation',
    underscore: 'vendor/underscore/underscore',
    template: 'vendor/hogan.js/web/builds/2.0.0/template-2.0.0',
    hogan: 'vendor/hogan.js/web/builds/2.0.0/hogan-2.0.0',
    backbone: 'vendor/backbone/backbone',
    'backbone.localStorage': 'vendor/backbone/backbone.localStorage',
    'backbone.picky': 'vendor/backbone/backbone.picky',
    "backbone.modal": "vendor/backbone/backbone.modal",
    "backbone.marionette.modals": "vendor/backbone/backbone.marionette.modals",
    'backbone.syphon': 'vendor/backbone/backbone.syphon',
    marionette: 'vendor/backbone/backbone.marionette',
    validator: 'vendor/validator/validator',
    text: 'vendor/require/text',
    d3: 'vendor/d3/d3',
    highcharts: 'vendor/highcharts/highstock',
    highchartsmore: 'vendor/highcharts/highcharts-more',
    gridLocale: 'vendor/jquery/jqGrid/i18n/grid.locale-en',
    jqGrid: 'vendor/jquery/jqGrid/jquery.jqGrid',
    'jquery.contextMenu': 'vendor/jquery/jqContextMenu/jquery.contextMenu',
    'jquery.tooltipster': 'vendor/jquery/jqTooltipster/jquery.tooltipster',
    'MutationObserver': 'vendor/MutationObserver.js/MutationObserver',
    jqueryTabs: 'vendor/jquery/tabs/jquery-ui-tabs',
    jqueryVerticalTabs: 'vendor/jquery/tabs/vertical-tabs',
    'mockjax': 'vendor/jquery/jquery.mockjax',
    'leaflet': 'vendor/leaflet/leaflet-0.7.3',
    'progressbar': 'vendor/progressbar/progressbar.min',
    'moment': 'vendor/moment/moment-with-locales.min',
    'leaflet_canvas_layer': 'vendor/leaflet/leaflet_canvas_layer',
    'uuid': 'vendor/uuid/uuid',
    tagit: 'widgets/search/lib/tag-it',
    'jquery.resize': 'vendor/jquery/jquery.resize',
    'sidr': 'vendor/jquery/sidr/jquery.sidr.min',
    isInViewport: 'vendor/jquery/isInViewport/isInViewport',
    'infiniteScroll': 'vendor/jquery/jqInfiniteScroll/jquery.infinite.scroll.helper.min',
    'canvasv5' : 'vendor/polyfills/canvasv5.js/canvasv5',
    'pwstrength': 'vendor/pwstrength/pwstrength-foundation',

    /* Foundation */
    'foundation.core': 'vendor/foundation/js/foundation',
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
    'foundation.topbar': 'vendor/foundation/js/foundation/foundation.topbar'

  },
  shim: {
    'URI': {
      exports: 'URI'
    },
    'underscore': {
      exports: '_'
    },
    'template': {
      exports: 'template'
    },
    'hogan': {
      deps: [ 'template' ],
      exports: 'Hogan'
    },
    d3: {
      exports: 'd3'
    },
    'mockjax': {
      deps: ['jquery']
    },
    'jqueryui' : {
      deps: ['jquery']
    },
    'jquery.resize': {
      deps: ['jquery'],
      exports: 'resize'
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
    'jstree': {
      deps: ['jquery'],
      exports: 'jstree'
    },
    'backbone': {
      deps: [ 'underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.localStorage': {
      deps: [ 'backbone'],
      exports: 'Backbone.LocalStorage'
    },
    'backbone.picky': {
      deps: ['backbone'],
      exports: 'Backbone.Picky'
    },
    'backbone.syphon': {
      deps: [ 'backbone'],
      exports: 'Backbone.Syphon'
    },
    'marionette': {
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
    'modernizr': {
      exports: 'Modernizr'
    },
    'jquery-i18n': {
      deps: ['jquery'],
      exports: 'jQuery.i18n'
    },
    'jqueryDatepicker':{
      deps: ['jquery'],
      exports: 'jqueryDatepicker'
    },
    'highcharts': {
      deps: ['jquery'],
      exports: 'highcharts'
    },
    'highchartsmore': {
      deps: ['highcharts', 'jquery'],
      exports: 'highchartsmore'
    },
    jqGrid: {
      deps: ['jquery','jqueryui','gridLocale'],
      exports: 'jqGrid'
    },
    'jquery.contextMenu': {
      deps: ['jquery'],
      exports: '$.contextMenu'
    },
    'select2': {
      deps: ['jquery'],
      exports: 'select2'
    },
    'leaflet_canvas_layer': {
      deps: ['leaflet']
    },
    'sidr': {
      deps: ['jquery'],
      exports: 'sidr'
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
    'jquery.tooltipster': {
      deps: [
        'jquery'
      ],
      exports: 'tooltipster'
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
    infiniteScroll: {
      deps: ['jquery'],
      exports: 'infiniteScroll'

    },
    'pwstrength': {
      deps: ['jquery'],
      exports: 'pwstrength'
    }
  },
  exclude: [
    'conf/global_config',
    'conf/navigation/schema'
  ],
  include: [
    'sdk/userToolbarElement',
    'sdk/dashboardResolver',
    'widgets/barChart/barChartWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    'widgets/contextMenu/contextMenuWidget',
    'widgets/contextMenu/lib/contextMenuFormatter',
    'widgets/dashboard/dashboard',
    'widgets/dashboard/views/dashletEditView',
    'widgets/datepicker/datepickerWidget' ,
    'lib/validator/dateValidator',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget' ,
    'widgets/ipCidr/ipCidrWidget' ,
    'widgets/listBuilder/conf/tooltipConfiguration',
    'widgets/listBuilder/listBuilderWidget',
    'widgets/listBuilderNew/listBuilderWidget',
    'widgets/login/loginWidget',
    'widgets/overlay/overlayWidget',
    'widgets/shortWizard/shortWizard',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/time/timeWidget',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    'widgets/timeZone/timeZoneWidget',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    'widgets/dropDown/dropDownWidget',
    'widgets/tooltip/tooltipWidget',
    'widgets/map/mapWidget',
    'widgets/map/models/CountriesMap',
    'widgets/progressBar/progressBarWidget',
    'widgets/timeRange/timeRangeWidget',
    'widgets/spinner/spinnerWidget',
    'widgets/tree/treeWidget',
    'widgets/grid/lib/gridNonRecordsState',
    'MutationObserver'
  ]
});

require([
  'widgetlib/js/vendor/chai/chai.js',
  'widgetlib/js/vendor/sinon/sinon.js'
], function(chai) {

  console.log("plugins unit testing");
  console.log(document.location.pathname);

  // Chai
  chai.Assertion.includeStack = true;
  var should = chai.should();
  window.expect = chai.expect;
  window.assert = chai.assert;

  // globals mocha
  mocha.setup('bdd');

  slipstream.initialize({
    onInit: function() {
      console.log('slipstream initialized, will now run unit tests');
      console.log(document.URL);
      require([
        'MutationObserver',
        'widgetlib/js/sdk/baseActivity.js',
        'widgetlib/js/sdk/activity.js',
        'widgetlib/js/sdk/activityContext.js',
        'widgetlib/js/sdk/intent.js',
        'widgetlib/js/sdk/renderer.js',
        'widgetlib/js/sdk/notification.js',
        'widgetlib/js/sdk/dateFormatter.js',
        'widgetlib/js/sdk/messageResolver.js',
        'widgetlib/js/sdk/messageProvider.js',
        'widgetlib/js/sdk/searchProvider.js',
        'widgetlib/js/sdk/alertProvider.js',
        'widgetlib/js/sdk/alarmProvider.js',
        'widgetlib/js/sdk/rbacProvider.js',
        'widgetlib/js/sdk/activityContext.js',
        'widgetlib/js/sdk/authenticationProvider.js',
        'widgetlib/js/sdk/dashboardResolver.js',
        'widgetlib/js/sdk/intent.js',
        'widgetlib/js/sdk/utils.js',
        'widgetlib/js/widgets/grid/util/gridSizeCalculator.js',
          'mockjax',
        './masterMocker.js'

      ], function() {
        srcCode = srcCode || [];
        
        require(srcCode, function(){
          if (window.mochaPhantomJS) {
            console.log("mochaPhantomJS");
            mochaPhantomJS.run();
          } else {
            mocha.run(function () {
              if (window.jscoverage_report) {
                jscoverage_report();
              }
            });
          }
        });
      });
    }
  });
});
