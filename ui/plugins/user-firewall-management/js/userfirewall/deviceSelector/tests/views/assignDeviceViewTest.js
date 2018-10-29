/**
 * UT for Access Profile Assign Device form View
 *
 * @module assignDeviceViewTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/assignDeviceView.js',
    '../../models/useFwDeviceListBuilderModel.js'
], function (View, Model ) {

    var view,  getMessage, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();


    describe('Assign Device Form view UT', function () {

        before(function () {

            activity.context = context;
            view = new View({
                wizardView: {addRemoteNameValidation: function () {
                }},
                context: context

            });
            view.model = new Model();
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Assign Device Form view object is created properly', function () {
            view.should.exist;
        });
        describe('Assign Device Form view UT', function () {
            var addDeviceListBuilder;
            before(function () {
                addDeviceListBuilder = sinon.stub(view, 'addDeviceListBuilder');
            });
            after(function () {
                addDeviceListBuilder.restore();
            });
            it('Checks render', function () {
                view.render();
                addDeviceListBuilder.called.should.be.equal(true);
            });
            it('Checks render', function () {
                view.wizardView.formMode = view.wizardView.MODE_EDIT;
                view.render();
                addDeviceListBuilder.called.should.be.equal(true);
            });
        });

        describe('Assign Device Form view UT', function () {

            it('Checks getTitle', function () {
                view.getTitle().should.be.equal('user_firewall_assign_device');
                getMessage.called.should.be.equal(true);
            });

        });

        describe('Assign Device Form view UT', function () {

            it('Checks addDeviceListBuilder', function () {
                view.addDeviceListBuilder();
            });

        });

        describe('Assign Device Form view UT', function () {

            it('Checks getSummary', function () {
                view.model.set({'device-list': {'device-lite':[{name: "test"}]}});
                var resp = view.getSummary();
                resp[0].label.should.be.equal('user_firewall_assign_device');
                resp[0].value.should.be.equal(' ');
                resp[1].label.should.be.equal('devices');
                resp[1].value.should.be.equal('test');

            });
            it('Checks getSummary', function () {
                view.model.set({'device-list': {'device-lite':[{name: "test"},{name:"test1"}]}});
                var resp = view.getSummary();
                resp[0].label.should.be.equal('user_firewall_assign_device');
                resp[0].value.should.be.equal(' ');
                resp[1].label.should.be.equal('devices');
                resp[1].value.should.be.equal('test (+1)');
            });
        });

        describe('Assign Device Form view UT with in validForm', function () {
            var getSelectedItems;
            before(function () {
                getSelectedItems = sinon.stub(view.listBuilder, 'getSelectedItems')
            });

            after(function () {
                getSelectedItems.restore();
            });

            it('Checks beforePageChange with isFetchSelectedDevicesCompleted= false', function () {
                view.beforePageChange().should.be.equal(false);
                getSelectedItems.called.should.be.equal(true);
            });

            it('Checks beforePageChange with isFetchSelectedDevicesCompleted= true', function () {
                view.isFetchSelectedDevicesCompleted = true;
                view.beforePageChange().should.be.equal(true);
            });

        });

        describe('Assign Device Form view UT', function () {
            var gotoPage;
            before(function () {
                view.wizardView = {
                    wizard: {
                        gotoPage: function(){

                        }
                    }
                };
                gotoPage = sinon.stub(view.wizardView.wizard, 'gotoPage')
            });

            after(function () {
                gotoPage.restore();
            });

            it('Checks deviceGetSelectedItemsCallBack', function () {
                view.deviceGetSelectedItemsCallBack(3, {devices:{device:[]}});
                gotoPage.calledWith(3).should.be.equal(true);
            });

        });
    });
});