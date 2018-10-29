/**
 * UT for Domain Controller Grid View
 *
 * @module domainControllerGridViewTest
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/activeDirectoryDomainControllerGridView.js',
    '../../../constants/userFirewallConstants.js'
], function (View, Constants, GridWidgetUtils) {


    describe('Domain Controller  Grid View UT', function () {
        var view, values, context;
        before(function () {
            $('#main-content').append('<div id = "active_directory_domain_controller"></div>')
            context = new Slipstream.SDK.ActivityContext();
            view = new View({
                context: context,
                parentView: {
                    $el: $('#main-content')
                }
            });
        });

        it('Checks if the view is created properly', function () {
            view.should.exist;
            view.parentView.should.exist;
        });

        it('Checks if the grid is created properly', function () {
            view.gridWidget.should.exist;
            var container = view.parentView.$el.find('#active_directory_domain_controller');
            container.find(".grid-widget").hasClass("elementinput-domain-controller-grid").should.be.equal(true);
        });

    });

});