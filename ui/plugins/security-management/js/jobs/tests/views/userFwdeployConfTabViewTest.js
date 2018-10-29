/**
 * UT forUser Fw Deploy conf tab View
 *
 * @module userFwdeployConfTabView
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
        '../../views/userFwdeployConfTabView.js'
    ],
    function (View) {

        describe('Check user Fw deploy Conf Tab View UT', function () {
            var view, context;
            before(function () {
                context = new Slipstream.SDK.ActivityContext();
                view = new View({context:context});
            });

            it('Checks if the View exist', function () {
                view.should.exist;
            });

            it('Checks if the Tab exist', function () {
                view.updateTabs();

                view.tabs[0].id.should.be.equal('cliConfiguration');
                view.tabs[0].name.should.be.equal('CLI');

                view.tabs[1].id.should.be.equal('xmlConfiguration');
                view.tabs[1].name.should.be.equal('XML');

            });
        });
    });