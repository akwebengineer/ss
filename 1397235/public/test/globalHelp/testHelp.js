/**
 * A test file that implements test cases for the Global Help Handler.
 * elements.
 *
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    'conf/global_config.sample',
    "Slipstream",
    "/installed_plugins/_help/js/conf/help_config.js",
    "/installed_plugins/_help/js/views/openHelpView.js"
], function (globalConfig, SlipStream, helpConfig, OpenHelpView) {

    describe('Open Help - Unit Tests:', function () {

        // Test case to check if the help view exits
        describe('Test for existence of help view', function () {

            var HelpActivity = (function (HelpView) {
                var HelpActivity = function () {
                    this.onStart = function () {
                        new OpenHelpView({activity : this,
                            context: this.getContext()}).render();
                    }
                };

                HelpActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
                HelpActivity.prototype.constructor = HelpActivity;
                return HelpActivity;
            })();

            var activity_context = new Slipstream.SDK.ActivityContext('', '');
            var HelpView = new OpenHelpView(activity_context);
            it('should exist', function () {
                HelpActivity.should.exist;
            });

            it('should exist', function () {
                HelpView.should.exist;
            });

            after(function () {
                HelpView.remove();
                $('.context-menu-list').last().remove(); // remove the context menu build during render
            });

        });

        // Test case to check if getting started file exists
        /*describe('Test for existence of getting started file', function () {
            it('Test for existence of getting started file', function () {
                $.ajax({
                    type: 'GET',
                    url: globalConfig.global_help.actions[0].trgtUrl,
                    success: function (response) {
                        assert(true);
                    },
                    fail: function (response) {
                        assert(false);
                    }
                });
            });
        });*/

        //Test case to check if the help activity is present
        describe('Test for help activity', function () {

            var activityStarted = "no";

            beforeEach(function (done) {
                Slipstream.vent.on("activity:afterStart", function (activity) {
                    console.log("help activity started");
                    activityStarted = "yes";
                    done();
                });

                Slipstream.vent.on("module:load:success", function (module) {
                    module.onCreate = function () {
                        console.log("help activity created");
                    }
                });

                var activity_context = new Slipstream.SDK.ActivityContext('','');
                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_VIEW, {
                    uri: new Slipstream.SDK.URI("globalhelp://")
                });

                //Start help activity.
                activity_context.startActivity(intent);
            });

            it('help activity should exist', function () {
                console.log("help activity started:" + activityStarted);
                assert(activityStarted === "yes");
            });

            after(function (done) {
                Slipstream.vent.off("activity:afterStart");
                Slipstream.vent.off("module:load:success");
                $('.context-menu-list').last().remove(); // remove the context menu build during render
                done();
            });
        });

        // Test case to check the help content

        /*describe('Getting started panel content and navigation events', function () {

            var helpView;
            var firstSectionDisplayed = "";
            var secondSectionDisplayed = "";
            var tocSectionDisplayed = "";

            Slipstream.SDK.Preferences.save('ui:preferences:helpDialogStateGS', 'maximized');
            Slipstream.SDK.Preferences.save('ui:preferences:helpDialogStateAbout', 'closed');

            before(function () {
                helpView = new OpenHelpView({
                    activity: {
                        helpConfig: helpConfig
                    },
                    context: {
                        getMessage: function (key) {
                            var config =  {
                                global_help_nav_prev: "Prev",
                                global_help_nav_next: "Next",
                                global_help_nav_back: "Back to Start",
                                global_help_getting_started_label: "Getting Started",
                                global_help_about_label: "About"
                            };
                            return config[key];
                        }
                    }
                });
                helpView.render();
            });

            it('help view should exist', function () {
                assert.isDefined(helpView, 'view has been defined');
            });

            it('help view nav should be present but not visible on the landing page', function () {
                assert.equal($('.section-nav').length, 1, "Nav section should be present");
                assert.equal($('.section-nav').css('display') !== 'block', true, "Nav section should not be visible");
                tocSectionDisplayed = $(".toc:first").html();
            });

            it('clicking on first topic in table of content should take user to first topic', function () {
                $('.toc li:first').trigger('click');
                assert.equal($('.section-nav').length, 1, "Nav section should be present");
                assert.equal($('.section-nav').css('display') === 'block', true, "Nav section should be visible");
                firstSectionDisplayed = $(".section-body:visible").html();
            });

            it('clicking on Next nav should take user back to the second topic', function () {
                $('.section-nav .rightLink span.nxtStp').trigger('click');
                assert.equal($('.section-nav').length, 1, "Nav section should be present");
                assert.equal($('.section-nav').css('display') === 'block', true, "Nav section should be visible");
                secondSectionDisplayed = $(".section-body:visible").html();
            });

            it('clicking on Prev nav from second section should take user back to the first topic', function () {
                $('.section-nav .rightLink span.prvStp').trigger('click');
                assert.equal($('.section-nav').length, 1, "Nav section should be present");
                assert.equal($('.section-nav').css('display') === 'block', true, "Nav section should be visible");
                assert.equal(firstSectionDisplayed, $(".section-body:visible").html(), "Click on previous should render the previous content");
            });

            it('clicking on Back nav from first section should take user back to the landing page', function () {
                $('.section-nav .leftLink').trigger('click');
                assert.equal($('.section-nav').length, 1, "Nav section should be present");
                assert.equal($('.section-nav').css('display') !== 'block', true, "Nav section should not be visible");
                assert.equal(tocSectionDisplayed, $(".toc:first").html(), "Click on previous should render the landing page content");
            });

            after(function () {
                helpView.remove();
                $('.context-menu-list').last().remove();
            });

        });*/

    });
});