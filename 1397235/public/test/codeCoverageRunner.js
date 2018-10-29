var instrumentLib = {
    // coverage instrument
    'widgets': '../../test/instrument/public/assets/js/widgets',
    'lib': '../../test/instrument/public/assets/js/lib',
    'sdk': '../../test/instrument/public/assets/js/sdk',
    'modules': '../../test/instrument/public/assets/js/modules',
    'apps': '../../test/instrument/public/assets/js/apps'
};

for (var item in instrumentLib) {
    configObj.paths[ item ] = instrumentLib[ item ];
};

require.config(configObj);

require([ 'chai' ], function (chai) {

    // Chai
    var should = chai.should();
    window.expect = chai.expect;
    window.assert = chai.assert;

    /*globals mocha */
    mocha.setup('bdd');

    require([
        'Slipstream'
    ], function (Slipstream) {
        Slipstream.vent.on("framework:booted", function () {
            require([
                /*'/test/url_router/tests.js',*/
                '/test/pluginTests.js',
                '/test/i18n/tests.js',
                '/test/globalSearch/tests.js',
                '/test/rbacResolver/tests.js',
                '/test/widgets/dashboardWidgetTests.js',
                '/test/widgets/timeWidgetTests.js',
                '/test/widgets/timeUtilTests.js',
                '/test/widgets/timeZoneWidgetTests.js',
                '/test/widgets/overlayWidgetTests.js',
                '/test/widgets/shortWizardWidgetTests.js',
                '/test/widgets/formWidgetTests.js',
                '/test/widgets/listBuilderWidgetTests.js',
                '/test/widgets/datepickerWidgetTests.js',
                '/test/widgets/ipCidrWidgetTests.js',
                '/test/widgets/gridWidgetTests.js',
                '/test/widgets/barChartWidgetTests.js',
                '/test/widgets/donutChartWidgetTests.js',
                '/test/widgets/timeSeriesChartWidgetTests.js',
                '/test/widgets/lineChartWidgetTests.js',
                '/test/widgets/timeRangeWidgetTests.js',
                '/test/widgets/mapWidgetTests.js',
                '/test/widgets/confirmationDialogWidgetTests.js',
                '/test/widgets/dropDownWidgetTests.js',
                '/test/widgets/scheduleRecurrenceWidgetTest.js',
                '/test/widgets/tabContainerWidgetTest.js',
                '/test/widgets/carouselWidgetTests.js',
                '/test/widgets/layoutWidgetTests.js',
                '/test/widgets/accordionWidgetTests.js',
                '/test/widgets/toggleButtonWidgetTests.js',
                '/test/widgets/sliderWidgetTests.js',
                '/test/widgets/topologyWidgetTests.js',
                '/test/widgets/listBuilderNewWidgetTests.js',
                '/test/widgets/cardLayoutWidgetTests.js',
                '/test/widgets/spinnerWidgetTests.js',
                '/test/widgets/loginWidgetTests.js',
                '/test/widgets/helpWidgetTests.js',
                '/test/widgets/numberStepperWidgetTests.js',
                '/test/widgets/colorPickerWidgetTests.js',
                '/test/widgets/actionBarWidgetTests.js',
                '/test/widgets/contextMenuWidgetTests.js',
                '/test/preferences/tests.js',
                '/test/notifications/tests.js',
                '/test/utils/tests.js',
                '/test/dateFormatter/tests.js',
                '/test/widgets/treeTests.js',
                '/test/navigateAway/tests.js',
                '/test/analytics/tests.js',
                '/test/view_manager/tests.js',
                '/test/navigation/tests.js',
                "/test/activity_mediation/tests.js",
                "/test/toolbar/tests.js",
                "/test/ui/tests.js",
                "/test/pluginProcessing/tests.js"
            ], function () {
                if (window.mochaPhantomJS) {
                    mochaPhantomJS.run();
                }
                else {
                    mocha.run();
                }
            });
        });
        Slipstream.boot();
    });
});
