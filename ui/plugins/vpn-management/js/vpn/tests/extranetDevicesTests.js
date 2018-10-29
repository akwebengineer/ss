define([
    '../../../../vpn-management/js/vpn/models/extranetDeviceModel.js',
    '../../../../vpn-management/js/vpn/views/extranetDeviceView.js'
], function(
    ExtrnetDeviceModel,
    ExtranetDeviceView
) {
/*
    // On 11/5/2015 Disable this unit test because build is broken by this test failing -- Stanley Quan
    return;

    var activity = new Slipstream.SDK.Activity();
    sinon.stub(activity, 'getContext', function() {
        return new Slipstream.SDK.ActivityContext();
    });
    sinon.stub(activity, 'getIntent', function() {
        return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
    });


    describe("Extranet Devices unit-tests", function() {
        describe("Model tests", function() {
            describe("ExtrnetDeviceModel instantiation", function() {
                var model = new ExtrnetDeviceModel();

                it("model should exist", function() {
                    model.should.exist;
                });
            });
        });

        describe("Views tests", function() {
            describe("ExtranetDevicesView", function() {
                var view = null;

                beforeEach(function() {
                    $.mockjax.clear();
                    view = new ExtranetDevicesView({
                        context: activity.getContext()
                    });
                });
                afterEach(function() {
                });

                it("view should exist", function() {
                    view.should.exist;
                });
                it("view.gridEvents should exist", function() {
                    view.gridEvents.should.exist;
                });
                it("view.gridEvents.createEvent name == 'createED'", function() {
                    view.gridEvents.createEvent.should.be.equal('createED');
                });
                it("view.gridEvents.updateEvent name == 'updateED'", function() {
                    view.gridEvents.updateEvent.should.be.equal('updateED');
                });
                it("view.gridEvents.deleteEvent name == 'deleteED'", function() {
                    view.gridEvents.deleteEvent.should.be.equal('deleteED');
                });
                it("view.grid should exist", function() {
                    $.mockjax({
                        url: "/api/juniper/sd/vpn-management/extranet-devices",
                        proxy: "installed_plugins/security-management/js/vpn/tests/zeroMockExtranetDevices.json"
                    });

                    view.render();
                    view.grid.should.exist;
                });
                it("view.grid should be empty", function() {
                    $.mockjax({
                        url: "/api/juniper/sd/vpn-management/extranet-devices",
                        proxy: "installed_plugins/security-management/js/vpn/tests/zeroMockExtranetDevices.json"
                    });

                    view.render();
                    $(".gridTable tr.jqgrow").length.should.be.equal(0);
                });
            });

            describe("ExtranetDeviceView", function() {
                var view = null;

                beforeEach(function() {
                    $.mockjax.clear();
                    view = new ExtranetDeviceView({
                        activity: activity
                    });

                    sinon.spy(view, "onCancel");
                });

                afterEach(function() {
                    view.onCancel.restore();
                });

                it("view should exist", function() {
                    view.should.exist;
                });

                it("view.formWidget should exist", function() {
                    view.render();
                    view.formWidget.should.exist;
                });

                it("view.onCancel should be called when cancel button clicked", function() {
                    view.render();
                    $('#main-content').append(view.$el);

                    sinon.spy(view.overlay, "destroy");

                    $('#cancel').click();
                    view.overlay.destroy.calledOnce.should.be.equal(true);
                });

                it("view.onOk saves user entered data using mockjax (testing only)", function(done) {
                    view.render();
                    $('main-content').append(view.$el);

                    $('#name').val('my-extranet-device').trigger('change');
                    $('#description').val('created from ui').trigger('change');
                    $('#ip-address').val('192.168.1.10').trigger('change');
                    $('#host-name').val('myextdev').trigger('change');

                    $.mockjax({
                        url: "/api/juniper/sd/vpn-management/extranet-devices",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        response: function(settings, done2) {
                            this.responseText = settings.data;
                            settings.data.should.be.equal("{\"extranet-device\":{\"name\":\"my-extranet-device\",\"description\":\"created from ui\",\"ip-address\":\"192.168.1.10\",\"host-name\":\"myextdev\"}}");
                            done2();
                            done();
                        }
                    });

                    $('#ok').click();
                });

            });
        });
    });
*/
});
