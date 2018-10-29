/**
 * UT for grid configurations block view form configurations
 *
 * @module BlockViewFormConfTest
 * @author tgarg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define(
    ['../../conf/blockViewFormConf.js'],
    function (Configuration) {

        describe('Check Block View Form Configuration UT', function () {
            var conf, context;
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                conf = new Configuration(context);
            });

            after(function () {
            });

            it('Checks if the configuration exist', function () {
                conf.should.exist;
            });

            describe('Check form properties', function () {
                var values;
                before(function () {
                    values = conf.getValues({
                        help: 'dummy help',
                        title: 'dummy title'
                    });
                });

                it('Checks form defaults', function () {

                    values.form_id.should.be.equal('block_app_policy_form');
                    values.on_overlay.should.be.equal(true);
                    values['title-help'].should.be.equal('dummy help');
                    values.title.should.be.equal('dummy title');

                });


            });

            describe('Check form sections', function () {

                var sections;

                before(function () {
                    sections = conf.getValues({
                        help: 'dummy help',
                        title: 'dummy title'
                    }).sections;
                });


                it('Checks if the section heading is defined', function () {
                    _.isUndefined(sections[0].heading_text).should.be.equal(false);
                });


                it('Checks if the grid element is defined', function () {
                    var policyEl = sections[0].elements[0];
                    policyEl.should.exist;
                    policyEl.element_text.should.be.equal(true);
                    policyEl.id.should.be.equal('app-secure-block-grid');
                    policyEl.class.should.be.equal('app-secure-block-grid fw-policy-management');
                    policyEl.name.should.be.equal('app-secure-block-grid');

                });

                it('Checks if the scheduler element is defined', function () {
                    var schEl = sections[0].elements[1];
                    schEl.should.exist;
                    schEl.element_description.should.be.equal(true);
                    schEl.id.should.be.equal('x_publish_update_schedule');
                    schEl.name.should.be.equal('schedulerLabel');
                    schEl.class.should.be.equal('publish_update_schedule');

                });

            });

            describe('Check form buttons', function () {


                var values;

                before(function () {
                    values = conf.getValues({
                        help: 'dummy help',
                        title: 'dummy title',
                        hasSaveButton: true,
                        hasPublishButton: true
                    });
                });

                it('Check if the button alignment is correct', function () {
                    values.buttonsAlignedRight.should.be.equal(true);

                });

                it('Check if the cancel link is defined correct', function () {
                    values.cancel_link.should.exist;
                    values.cancel_link.id.should.be.equal('cancelBlockApp');
                    values.cancel_link.value.should.exist;
                });

                it('Checks if the button actions are defined properly', function() {
                   var buttons = values.buttons;
                    buttons[0].id.should.be.equal('saveButton');
                    buttons[0].name.should.be.equal('save');
                    buttons[0].value.should.exist;

                    buttons[1].id.should.be.equal('publishButton');
                    buttons[1].name.should.be.equal('Publish');
                    buttons[1].value.should.exist;

                    buttons[2].id.should.be.equal('updateButton');
                    buttons[2].name.should.be.equal('Publish and Update');
                    buttons[2].value.should.exist;
                });

            });

        });
    });