
require.config(configObj);
console.log("**here**");

require([ 'chai' ], function (chai) {

	// Chai
	var should = chai.should();
	window.expect = chai.expect;
	window.assert = chai.assert;

	/*globals mocha */
	mocha.setup({
		ui: 'bdd',
		timeout: 10000
	});

	require([
		'Slipstream'
	], function (Slipstream) {
		Slipstream.vent.on("framework:booted", function () {
			require([
				//Tooltipster library can't render svg tooltip properly in the unit test.
				// 'vendor/jquery/jquery.svgdom',
				'/test/pluginTests.js',
				'/test/app/utilityToolbarTests.js',
				'/test/i18n/tests.js',
				'/test/view_manager/tests.js',
				'/test/globalSearch/tests.js',
				'/test/rbacResolver/tests.js',
                '/test/widgets/dashboardWidgetTests.js',
				'/test/widgets/barChartWidgetTests.js',
				'/test/widgets/donutChartWidgetTests.js',
				'/test/widgets/timeSeriesChartWidgetTests.js',
				'/test/widgets/lineChartWidgetTests.js',
				'/test/widgets/timeRangeWidgetTests.js',
				'/test/widgets/timeWidgetTests.js',
				'/test/widgets/timeUtilTests.js',
				'/test/widgets/timeZoneWidgetTests.js',
				'/test/widgets/overlayWidgetTests.js',
				'/test/widgets/searchWidgetTests.js',
				'/test/widgets/shortWizardWidgetTests.js',
				'/test/widgets/formWidgetTests.js',
				'/test/widgets/listBuilderWidgetTests.js',
				'/test/widgets/datepickerWidgetTests.js',
				'/test/widgets/queryBuilderWidgetTests.js',
				'/test/widgets/ipCidrWidgetTests.js',
				'/test/widgets/gridWidgetTests.js',
				'/test/widgets/mapWidgetTests.js',
				'/test/widgets/confirmationDialogWidgetTests.js',
				'/test/widgets/dropDownWidgetTests.js',
				'/test/widgets/scheduleRecurrenceWidgetTest.js',
				'/test/widgets/tabContainerWidgetTest.js',
				'/test/widgets/carouselWidgetTests.js',
				'/test/widgets/layoutWidgetTests.js',
				'/test/widgets/accordionWidgetTests.js',
				'/test/widgets/toggleButtonWidgetTests.js',
				'/test/widgets/listBuilderNewWidgetTests.js',
				'/test/widgets/sliderWidgetTests.js',
				'/test/widgets/topologyWidgetTests.js',
				'/test/widgets/tooltipWidgetTests.js',
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
				'/test/navigation/tests.js',
				//"/test/navigation/breadcrumbs/tests.js",
				"/test/activity_mediation/tests.js",
				"/test/globalHelp/testHelp.js",
				"/test/toolbar/tests.js",
				"/test/ui/tests.js",
				"/test/pluginProcessing/tests.js"
			], function () {
                if (window.mochaPhantomJS) {
                    mochaPhantomJS.run();
                }
                else {
                    console.log("***running mocha***");
                    mocha.run();
                }
			});
		});
		Slipstream.boot();
	});
});
