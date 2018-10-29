/**
 * Address Create View Unit Test
 * Created by honglijin on 8/11/16.
 */
define([
    '../models/addressModel.js',
    '../views/addressCreateView.js'
],function (
    AddressCreateModel,
    AddressCreateView
) {
    describe('Address Create View Unit Test', function () {

        describe('ACTION MODE - CREATE', function () {
            var activity, stubContext, stubIntent, view=null, model=null;
            before(function () {
                activity = new Slipstream.SDK.Activity();
                stubContext = sinon.stub(activity, 'getContext', function () {
                    return new Slipstream.SDK.ActivityContext();
                });
                stubIntent = sinon.stub(activity, 'getIntent', function () {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                });
                model = new AddressCreateModel();
                view = new AddressCreateView({
                    activity: activity,
                    model: model
                });
            });
            after(function () {
                stubContext.restore();
                stubIntent.restore();
            });
            it('Initialize', function () {
                view.formMode.should.equal('CREATE');
                view.context.should.exist;
                view.collection.should.exist;
                view.collection.models.should.be.empty;
                view.successMessageKey.should.equal('address_create_success');
            });
            describe('Render and change address-type', function () {
                var formElems;
                beforeEach(function () {
                    model = new AddressCreateModel();
                    view = new AddressCreateView({
                        activity: activity,
                        model: model
                    });
                    view.render();
                    formElems = view.$el;
                });
                afterEach(function () {
                    model = null;
                    view = null;
                });
                it('render default view should set address-type to "IPADDRESS"', function () {
                    view.form.should.exist;
                    formElems.find('input[type=radio][name=address-object-type]:checked').val().should.equal('IPADDRESS');
                    formElems.find('#address-type').val().should.equal('IPADDRESS');
                });
                
                it('change address-type to GROUP should display the corresponding div', function () {
                    formElems.find('#address-group-radio').click();
                    var groupForm = formElems.find('#address-group-form>div');
                    groupForm.css('display').should.equal('block');
                });
                it('change address-type to DNS should display the corresponding div', function () {
                    formElems.find('#address-type').val('DNS').trigger('change');
                    var row = formElems.find('#address-dns-name').parents('.row:first');
                    row.css('display').should.equal('block');
                    row.siblings().css('display').should.equal('none');
                });
                it('change address-type to RANGE should display the corresponding div', function () {
                    formElems.find('#address-type').val('RANGE').trigger('change');
                    var row = formElems.find('#address-range-start-address').parents('.row:first');
                    row.css('display').should.equal('block');
                    row.siblings().css('display').should.equal('none');
                });
                it('change address-type to NETWORK should display the corresponding div', function () {
                    formElems.find('#address-type').val('NETWORK').trigger('change');
                    var row = formElems.find('#address-network-ip-address').parents('.row:first').parent();
                    row.css('display').should.equal('block');
                });
                it('change address-type to WILDCARD should display the corresponding div', function () {
                    formElems.find('#address-type').val('WILDCARD').trigger('change');
                    var row = formElems.find('#address-wildcard-ip-address').parents('.row:first');
                    row.css('display').should.equal('block');
                });

            });

            describe('Check the methods of the view', function () {
                
                describe('modifyForm method', function () {
                    var view=null, model=null, formElems;
                    
                    beforeEach(function () {
                        model = new AddressCreateModel();
                        view = new AddressCreateView({
                            activity: activity,
                            model: model
                        });
                        view.render();
                        formElems = view.$el;
                    });
                    afterEach(function () {
                        model = null;
                        view = null;
                    });
                    it('Modify form , address type: GROUP, should display the corresponding div', function () {
                        var data = {
                            "address-type": "GROUP",
                            "address-version": "IPV4",
                            "name": "group",
                            "description": "description"
                        };
                        model.set(data);
                        view.modifyForm();
                        var groupForm = formElems.find('#address-group-form>div');
                        groupForm.css('display').should.equal('block');
                    });
                    it('Modify form , address type: DNS, should set the correct value', function () {
                        var data = {
                            "address-type": "DNS",
                            "address-version": "IPV4",
                            "name": "dns",
                            "description": "description",
                            "host-name": "www.example.com"
                        };
                        model.set(data);
                        view.modifyForm();
                        var hostName = formElems.find('#address-dns-name');
                        hostName.val().should.equal('www.example.com');
                    });
                    it('Modify form , address type: RANGE, should set the correct value', function () {
                        var data = {
                            "address-type": "RANGE",
                            "address-version": "IPV4",
                            "name": "range",
                            "description": "description",
                            "ip-address": "1.2.3.4-2.3.4.5",
                            "host-name": ""
                        };
                        model.set(data);
                        view.modifyForm();
                        var rangeStart = formElems.find('#address-range-start-address');
                        var rangeEnd = formElems.find('#address-range-end-address');
                        rangeStart.val().should.equal('1.2.3.4');
                        rangeEnd.val().should.equal('2.3.4.5');
                    });
                    it('Modify form , address type: NETWORK, should set the correct value', function () {
                        var data = {
                            "address-type": "NETWORK",
                            "address-version": "IPV4",
                            "name": "network",
                            "description": "description",
                            "ip-address": "1.2.3.4/30",
                            "host-name": ""
                        };
                        model.set(data);
                        view.modifyForm();
                        var networkIP = formElems.find('#address-network-ip-address');
                        var networkMask = formElems.find('#address-network-mask');
                        var networkSubnet = formElems.find('#address-network-subnet');
                        networkIP.val().should.equal('1.2.3.4');
                        networkMask.val().should.equal('30');
                        networkSubnet.val().should.equal('255.255.255.252');
                    });
                    it('Modify form , address type: WILDCARD, should set the correct value', function () {
                        var data = {
                            "address-type": "WILDCARD",
                            "address-version": "IPV4",
                            "name": "wildcard",
                            "description": "description",
                            "ip-address": "1.2.3.4/0.0.0.255",
                            "host-name": ""
                        };
                        model.set(data);
                        view.modifyForm();
                        var wildcardIP = formElems.find('#address-wildcard-ip-address');
                        var wildcardSubnet = formElems.find('#address-wildcard-subnet');
                        wildcardIP.val().should.equal('1.2.3.4');
                        wildcardSubnet.val().should.equal('0.0.0.255');
                    });
                });

                describe('resolveIp method', function () {
                    var formElems, addressHostIp, addressHostName;
                    beforeEach(function () {
                        model = new AddressCreateModel();
                        view = new AddressCreateView({
                            activity: activity,
                            model: model
                        });
                        view.render();
                        formElems = view.$el;
                        addressHostIp = formElems.find('#address-ip-address');
                        addressHostName = formElems.find('#address-host-name');
                        addressHostName.val('foo');
                    });
                    afterEach(function () {
                        $.mockjax.clear();
                    });
                    it('resolve IP without input should not change the host name', function () {
                        view.resolveIp(addressHostIp, addressHostName);
                        addressHostName.val().should.equal('foo');
                    });
                    
                    it('resolve IP with invalid input should not change the host name', function () {
                        addressHostIp.val('123');
                        addressHostIp.attr('data-invalid', true);
                        view.resolveIp(addressHostIp, addressHostName);
                        addressHostName.val().should.equal('foo');
                    });
                    
                    it('resolve IP with valid input and response error, should clear the host name', function (done) {
                        $.mockjax({
                            url: '/api/juniper/sd/address-management/addresses/dns-lookUp',
                            type: 'POST',
                            status: 500,
                            contentType: 'text/json',
                            dataType: 'json',
                            response: function (settings,done2) {
                                done2();
                                addressHostName.val().should.be.empty;
                                assert(spyConsole.calledWith('error'), 'console.log should involved with \'error\'');
                                spyConsole.restore();
                                done();
                            }
                        });
                        var spyConsole = sinon.spy(console, 'log');
                        addressHostIp.val('10.10.20.32');
                        view.resolveIp(addressHostIp, addressHostName);
                    });
                    it('resolve IP with valid input and response success, should change the host name to "hostName" in response data', function (done) {
                        $.mockjax({
                            url: '/api/juniper/sd/address-management/addresses/dns-lookUp',
                            type: 'POST',
                            status: 200,
                            contentType: 'text/json',
                            dataType: 'json',
                            response: function (settings,done2) {
                                this.responseText = {
                                    "resolve-dns": {
                                        "dns-list":[
                                            {
                                                "hostName": "host",
                                                "ipAddress": "10.10.20.32"
                                            }
                                        ]
                                    }
                                };
                                
                                done2();
                                addressHostName.val().should.equal('host');
                                done();
                            }
                        });
                        addressHostIp.val('10.10.20.32');
                        view.resolveIp(addressHostIp, addressHostName);
                    });
                    it('resolve IP with valid input, response success, show error function is called', function (done) {
                        var spyShowFormError = sinon.spy(view.form, 'showFormError');
                        $.mockjax({
                            url: '/api/juniper/sd/address-management/addresses/dns-lookUp',
                            type: 'POST',
                            status: 200,
                            contentType: 'text/json',
                            dataType: 'json',
                            response: function (settings,done2) {
                                this.responseText = {
                                    "resolve-dns": {
                                        "dns-list":[
                                            {
                                                "hostName": "unresolved",
                                                "ipAddress": "10.10.20.32"
                                            }
                                        ]
                                    }
                                };
                                done2();
                                assert(spyShowFormError.calledWith('[address_dns_lookup_error]'), 'showFormError method should be involved ');
                                spyShowFormError.restore();
                                done();
                            }
                        });
                        addressHostIp.val('10.10.20.32');
                        view.resolveIp(addressHostIp, addressHostName);
                    });
                });

                describe('resolveHostName method', function (done) {
                    var formElems, addressHostIp, addressHostName;
                    beforeEach(function () {
                        model = new AddressCreateModel();
                        view = new AddressCreateView({
                            activity: activity,
                            model: model
                        });
                        view.render();
                        formElems = view.$el;
                        addressHostIp = formElems.find('#address-ip-address');
                        addressHostName = formElems.find('#address-host-name');
                        addressHostIp.val('foo');
                    });
                    afterEach(function () {
                        $.mockjax.clear();
                    });
                    it('resolve host name without input should not change host ip value', function () {
                        view.resolveHostName(addressHostIp, addressHostName);
                        addressHostIp.val().should.equal('foo');
                    });

                    it('resolve host name with invalid input should not change host ip value', function () {
                        addressHostName.val('123');
                        addressHostName.attr('data-invalid', true);
                        view.resolveHostName(addressHostIp, addressHostName);
                        addressHostIp.val().should.equal('foo');
                    });

                    it('resolve host name with valid input and response error, should clear host ip value', function (done) {
                        $.mockjax({
                            url: '/api/juniper/sd/address-management/addresses/dns-lookUp',
                            type: 'POST',
                            status: 404,
                            contentType: 'text/json',
                            dataType: 'json',
                            response: function (settings,done2) {
                                done2();
                                addressHostIp.val().should.be.empty;
                                assert(spyConsole.calledWith('error'), 'console.log should involved with \'error\'');
                                spyConsole.restore();
                                done();
                            }
                        });
                        var spyConsole = sinon.spy(console, 'log');
                        addressHostName.val('host');
                        view.resolveHostName(addressHostIp, addressHostName);
                    });
                    it('resolve host name with valid input and response success, should change the host ip to "ipAddress" in response data', function (done) {
                        $.mockjax({
                            url: '/api/juniper/sd/address-management/addresses/dns-lookUp',
                            type: 'POST',
                            status: 200,
                            contentType: 'text/json',
                            dataType: 'json',
                            response: function (settings,done2) {
                                this.responseText = {
                                    "resolve-dns": {
                                        "dns-list":[
                                            {
                                                "hostName": "host",
                                                "ipAddress": "10.10.20.32"
                                            }
                                        ]
                                    }
                                };

                                done2();
                                addressHostIp.val().should.equal('10.10.20.32');
                                done();
                            }
                        });
                        addressHostName.val('host');
                        view.resolveHostName(addressHostIp, addressHostName);
                    });
                    it('resolve host name with valid input, response success, show error function is called', function (done) {
                        var spyShowFormError = sinon.spy(view.form, 'showFormError');
                        $.mockjax({
                            url: '/api/juniper/sd/address-management/addresses/dns-lookUp',
                            type: 'POST',
                            status: 200,
                            contentType: 'text/json',
                            dataType: 'json',
                            response: function (settings,done2) {
                                this.responseText = {
                                    "resolve-dns": {
                                        "dns-list":[
                                            {
                                                "hostName": "host",
                                                "ipAddress": "unresolved"
                                            }
                                        ]
                                    }
                                };
                                done2();
                                assert(spyShowFormError.calledWith('[address_dns_lookup_error]'), 'showFormError method should be involved ');
                                spyShowFormError.restore();
                                done();
                            }
                        });
                        addressHostName.val('host');
                        view.resolveHostName(addressHostIp, addressHostName);
                    });
                });

                describe('checkEndAddressGreater method', function () {
                    var model, view, formElems, addressRangeStart, addressRangeEnd, error;
                    beforeEach(function () {
                        model = new AddressCreateModel();
                        view = new AddressCreateView({
                            activity: activity,
                            model: model
                        });
                        view.render();
                        formElems = view.$el;
                        addressRangeStart = formElems.find('#address-range-start-address');
                        addressRangeEnd = formElems.find('#address-range-end-address');
                    });
                    after(function () {
                        model = null;
                        view = null;
                    });
                    
                    it('input not valid', function () {
                        addressRangeEnd.trigger('isEndAddressGreater', false);
                    });

                    it('input valid and (end value > start value), expect parent div do not have "error" class', function () {
                        error = addressRangeEnd.siblings('.error');
                        addressRangeStart.val('1.2.3.4');
                        addressRangeEnd.val('2.3.4.5');
                        addressRangeEnd.trigger('isEndAddressGreater', true);
                        expect(addressRangeEnd.parent().is('.error')).to.be.false;
                        error.text().should.equal('[address_range_ip_end_error]');
                    });
                    it('input valid, but (end value < start value), expect parent div have "error" class', function () {
                        error = addressRangeEnd.siblings('.error');
                        addressRangeStart.val('2.3.4.5');
                        addressRangeEnd.val('1.2.3.4');
                        addressRangeEnd.trigger('isEndAddressGreater', true);
                        expect(addressRangeEnd.parent().is('.error')).to.be.true;
                        error.css('display').should.equal('inline');
                        error.text().should.equal('[address_end_address_error]');
                    });
                });

                describe('validateNetWork method', function () {
                    var formElems, addressNetworkIp, addressNetworkMask, addressNetworkSubnet, spyShowMsg;
                    beforeEach(function () {
                        model = new AddressCreateModel();
                        view = new AddressCreateView({
                            activity: activity,
                            model: model
                        });
                        view.render();
                        formElems = view.$el;
                        
                        addressNetworkIp = formElems.find('#address-network-ip-address')[0];
                        addressNetworkMask = formElems.find('#address-network-mask')[0];
                        addressNetworkSubnet = formElems.find('#address-network-subnet')[0];
                        view.showMessage = function (msg) {
                            return msg;
                        };
                        spyShowMsg = sinon.spy(view,'showMessage');
                    });
                    afterEach(function () {
                        model = null;
                        view = null;
                        spyShowMsg.restore();
                    });
                    
                    it('input value is IPv4 and valid, expect showMsg function not called', function () {
                        $(addressNetworkIp).val('1.2.3.4');
                        $(addressNetworkMask).val('30');
                        view.validateNetWork(addressNetworkIp,addressNetworkMask,addressNetworkSubnet,view.showMessage);
                        expect(spyShowMsg.called).to.be.false;
                    });

                    it('input value is IPv4 but not valid, expect showMsg function called', function () {
                        $(addressNetworkIp).val('1.1.1.1');
                        $(addressNetworkMask).val('32');
                        view.validateNetWork(addressNetworkIp,addressNetworkMask,addressNetworkSubnet,view.showMessage);
                        expect(spyShowMsg.calledWith('[address_network_submask_error]')).to.be.true;
                    });

                    it('input value is IPv6 and valid, expect showMsg function not called', function () {
                        $(addressNetworkIp).val('2001:db8:1234::');
                        $(addressNetworkMask).val('48');
                        $(addressNetworkMask).attr('data-validation', 'cidrv6');
                        view.validateNetWork(addressNetworkIp,addressNetworkMask,addressNetworkSubnet,view.showMessage);
                        expect(spyShowMsg.called).to.be.false;
                    });
                });

                describe('getData method', function () {
                    var formElems, model, view;
                    before(function () {
                        var data = {
                            "name": "group",
                            "description": "description",
                            "members": {
                                "member":[
                                    {
                                        "name": "test",
                                        "description": "",
                                        "id": 294973
                                    }
                                ]
                            }
                        };
                        model = new AddressCreateModel();
                        view = new AddressCreateView({
                            activity: activity,
                            model: model
                        });
                        view.model.set(data);
                        view.render();
                        formElems = view.$el;
                    });
                    after(function () {
                        model = null;
                        view = null;
                    });
                    it('get group data and should unwrap the input, and add the selected items\' id to options', function () {
                        view.model.set('address-type', 'GROUP');
                        view.modifyForm();
                        view.listBuilder.renderListBuilder();
                        view.listBuilder.buildCallback();
                        formElems.find('.new-list-builder-widget').parent()[0].nodeName.should.equal('DIV');
                        view.listBuilder.options.selectedItems[0].should.equal(294973);
                    });
                });
            });
            describe('Submit', function () {
                var model, view, formElems, name, description, addressType, event, spyConsole, stubIsValidInput;
                beforeEach(function () {
                    model = new AddressCreateModel();
                    view = new AddressCreateView({
                        activity: activity,
                        model: model
                    });
                    view.render();
                    $('#main-content').append(view.$el);
                    formElems = view.$el;
                    name = formElems.find('#address-name');
                    description = formElems.find('#address-description');
                    addressType = formElems.find('#address-type');
                    event = $.Event();
                    spyConsole = sinon.spy(console, 'log');
                    stubIsValidInput = sinon.stub(view.form, 'isValidInput', function () {
                        return true;
                    });
                });
                afterEach(function () {
                    model = null;
                    view = null;
                    $('#main-content').html('');
                    spyConsole.restore();
                    stubIsValidInput.restore();
                });
                
                it('form is invalid should console.log(\'form is invalid\')', function () {
                    stubIsValidInput.restore();
                    view.submit(event);
                    spyConsole.calledWith('form is invalid').should.be.true;
                });

                it('address type: IPADDRESS, values should set correctly to model', function () {
                    var addressIP, addressHostName;
                    addressType.val('IPADDRESS');
                    addressIP = formElems.find('#address-ip-address');
                    addressHostName = formElems.find('#address-host-name');
                    name.val('testIP');
                    description.val('testIP description');
                    addressIP.val('1.1.1.1');
                    addressHostName.val('host');
                    view.submit(event);
                    view.model.get('name').should.equal('testIP');
                    view.model.get('description').should.equal('testIP description');
                    view.model.get('address-type').should.equal('IPADDRESS');
                    view.model.get('address-version').should.equal('IPV4');
                    view.model.get('ip-address').should.equal('1.1.1.1');
                    view.model.get('host-name').should.equal('host');
                });

                it('address type: DNS, values should set correctly to model', function () {
                    var addressDnsName;
                    addressType.val('DNS');
                    addressDnsName = formElems.find('#address-dns-name');
                    name.val('testDNS');
                    description.val('testDNS description');
                    addressDnsName.val('www.example.com');
                    view.submit(event);
                    view.model.get('name').should.equal('testDNS');
                    view.model.get('description').should.equal('testDNS description');
                    view.model.get('address-type').should.equal('DNS');
                    view.model.get('address-version').should.equal('IPV4');
                    view.model.get('ip-address').should.equal('');
                    view.model.get('host-name').should.equal('www.example.com');
                });

                it('address type: RANGE, values should set correctly to model', function () {
                    var addressRangeStart, addressRangeEnd;
                    addressType.val('RANGE');
                    addressRangeStart = formElems.find('#address-range-start-address');
                    addressRangeEnd = formElems.find('#address-range-end-address');
                    name.val('testRange');
                    description.val('testRange description');
                    addressRangeStart.val('1.2.3.4');
                    addressRangeEnd.val('2.3.4.5');
                    view.submit(event);
                    view.model.get('name').should.equal('testRange');
                    view.model.get('description').should.equal('testRange description');
                    view.model.get('address-type').should.equal('RANGE');
                    view.model.get('address-version').should.equal('IPV4');
                    view.model.get('ip-address').should.equal('1.2.3.4-2.3.4.5');
                    view.model.get('host-name').should.equal('');
                });

                it('address type: NETWORK, values should set correctly to model', function () {
                    var addressNetworkIP, addressNetworkMask;
                    addressType.val('NETWORK');
                    addressNetworkIP = formElems.find('#address-network-ip-address');
                    addressNetworkMask = formElems.find('#address-network-mask');
                    name.val('testNetwork');
                    description.val('testNetwork description');
                    addressNetworkIP.val('1.2.3.4');
                    addressNetworkMask.val('30');
                    view.submit(event);
                    view.model.get('name').should.equal('testNetwork');
                    view.model.get('description').should.equal('testNetwork description');
                    view.model.get('address-type').should.equal('NETWORK');
                    view.model.get('address-version').should.equal('IPV4');
                    view.model.get('ip-address').should.equal('1.2.3.4/30');
                    view.model.get('host-name').should.equal('');
                });

                it('address type: WILDCARD, values should set correctly to model', function () {
                    var addressNetworkIP, addressNetworkMask;
                    addressType.val('WILDCARD');
                    addressNetworkIP = formElems.find('#address-wildcard-ip-address');
                    addressNetworkMask = formElems.find('#address-wildcard-subnet');
                    name.val('testWildcard');
                    description.val('testWildcard description');
                    addressNetworkIP.val('1.2.3.4');
                    addressNetworkMask.val('0.0.0.255');
                    view.submit(event);
                    view.model.get('name').should.equal('testWildcard');
                    view.model.get('description').should.equal('testWildcard description');
                    view.model.get('address-type').should.equal('WILDCARD');
                    view.model.get('address-version').should.equal('IPV4');
                    view.model.get('ip-address').should.equal('1.2.3.4/0.0.0.255');
                    view.model.get('host-name').should.equal('');
                });

                it('address type: GROUP, without select item, should console.log(\'listbuilder has no selections\')', function () {
                    var addressGroupRadio, stubGetSelectedItems;
                    addressGroupRadio = formElems.find('#address-group-radio');
                    addressGroupRadio.prop('checked',true).trigger('change');
                    view.$el.find('#address-radio').prop('checked',false).trigger('change');
                    view.getData();
                    stubGetSelectedItems = sinon.stub(view.listBuilder, 'getSelectedItems', function (callback) {
                        var data = {
                            addresses:{
                                address:[]
                            }
                        };
                        callback(data);
                    });
                    name.val('testGroup');
                    description.val('testGroup description');
                    view.submit(event);
                    spyConsole.calledWith('listbuilder has no selections').should.be.true;
                    stubGetSelectedItems.restore();
                });

                it('address type: GROUP, save success should destory listBuilder', function () {
                    var addressGroupRadio, stubGetSelectedItems, spyModelSave, spyDestroy;
                    addressGroupRadio = formElems.find('#address-group-radio');
                    addressGroupRadio.prop('checked',true).trigger('change');
                    view.$el.find('#address-radio').prop('checked',false).trigger('change');
                    view.getData();
                    stubGetSelectedItems = sinon.stub(view.listBuilder, 'getSelectedItems', function (callback) {
                        var data = {
                            addresses:{
                                address:[
                                    {
                                        "address-type": "WILDCARD",
                                        "description": "",
                                        "hash-key": "1.1.1.1/0.0.0.23",
                                        "host-name": "",
                                        "ip-address": "1.1.1.1/0.0.0.23",
                                        "name": "test"
                                    }
                                ]
                            }
                        };
                        callback(data);
                    });
                    spyModelSave = sinon.stub(view.model, 'save');
                    spyDestroy = sinon.spy(view.listBuilder, 'destroy');
                    name.val('testGroup');
                    description.val('testGroup description');
                    view.submit(event);
                    spyModelSave.args[0][1].success();

                    view.model.get('name').should.equal('testGroup');
                    view.model.get('description').should.equal('testGroup description');
                    view.model.get('address-type').should.equal('GROUP');
                    spyDestroy.called.should.be.true;
                    stubGetSelectedItems.restore();
                    spyModelSave.restore();
                    spyDestroy.restore();
                });

                it('address type: GROUP, save error', function () {
                    var addressGroupRadio, stubGetSelectedItems, spyModelSave;
                    addressGroupRadio = formElems.find('#address-group-radio');
                    addressGroupRadio.prop('checked',true).trigger('change');
                    view.$el.find('#address-radio').prop('checked',false).trigger('change');
                    view.getData();
                    stubGetSelectedItems = sinon.stub(view.listBuilder, 'getSelectedItems', function (callback) {
                        var data = {
                            addresses:{
                                address:[
                                    {
                                        "address-type": "WILDCARD",
                                        "description": "",
                                        "hash-key": "1.1.1.1/0.0.0.23",
                                        "host-name": "",
                                        "ip-address": "1.1.1.1/0.0.0.23",
                                        "name": "test"
                                    }
                                ]
                            }
                        };
                        callback(data);
                    });
                    spyModelSave = sinon.stub(view.model, 'save');
                    name.val('testGroup');
                    description.val('testGroup description');
                    view.submit(event);
                    spyModelSave.args[0][1].error();

                    view.model.get('name').should.equal('testGroup');
                    view.model.get('description').should.equal('testGroup description');
                    view.model.get('address-type').should.equal('GROUP');

                    stubGetSelectedItems.restore();
                    spyModelSave.restore();
                });
            });
        });

        describe('ACTION MODE - EDIT', function(){
            var activity, stubContext, stubIntent, view=null, model=null, formElems;
            before(function () {
                activity = new Slipstream.SDK.Activity();
                stubContext = sinon.stub(activity, 'getContext', function () {
                    return new Slipstream.SDK.ActivityContext();
                });
                stubIntent = sinon.stub(activity, 'getIntent', function () {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
                });
            });
            after(function () {
                stubContext.restore();
                stubIntent.restore();
            });
            beforeEach(function () {
                model = new AddressCreateModel();
                view = new AddressCreateView({
                    activity: activity,
                    model: model
                });
                view.render();
                formElems = view.$el;
            });
            afterEach(function () {
                model = null;
                view = null;
            });

            it('Render view should not display address-type radio buttons', function () {
                view.form.conf.elements.title.should.equal('[address_edit]');
                formElems.find('label[for=address-object]').parents('.row:first').css('display').should.equal('none');
            });

            it('Modify the name and should change the name value', function () {
                view.model.set('name', 'test');
                view.getData();
                view.listBuilder.options.excludedNames[0].should.equal('test');
            })
            
        });

        describe('ACTION MODE - CLONE', function(){
            var activity, stubContext, stubIntent, view=null, model=null;
            before(function () {
                activity = new Slipstream.SDK.Activity();
                stubContext = sinon.stub(activity, 'getContext', function () {
                    return new Slipstream.SDK.ActivityContext();
                });
                stubIntent = sinon.stub(activity, 'getIntent', function () {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
                });
                model = new AddressCreateModel();
                view = new AddressCreateView({
                    activity: activity,
                    model: model
                });
            });
            after(function () {
                stubContext.restore();
                stubIntent.restore();
            });
            it('Render view', function () {
                var formElems;
                view.render();
                formElems = view.$el;
                view.form.conf.elements.title.should.equal('[address_clone]');
                formElems.find('label[for=address-object]').parents('.row:first').css('display').should.equal('none');
            })
        });

        describe('For NAT pool create form, should display the corresponding div and set the address-type radio value correctly', function () {
            var activity, stubContext, view=null, model=null;
            before(function () {
                activity = new Slipstream.SDK.Activity();
                stubContext = sinon.stub(activity, 'getContext', function () {
                    return new Slipstream.SDK.ActivityContext();
                });
                activity.intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
            after(function () {
                stubContext.restore();
            });
            afterEach(function () {
                model = null;
                view = null;
            });
            it('IPADDRESS', function () {
                activity.intent.extras = {
                    "addressObject": "IPADDRESS"
                };
                model = new AddressCreateModel();
                view = new AddressCreateView({
                    activity: activity,
                    model: model
                });
                view.render();
                formElems = view.$el;
                formElems.find('input[type=radio][id=address-radio]').prop('checked').should.isOk;
                formElems.find('label[for=address-object]').parents('.row:first').css('display').should.equal('none');
            });
            it('GROUP', function () {
                activity.intent.extras = {
                    "addressObject": "GROUP"
                };
                model = new AddressCreateModel();
                view = new AddressCreateView({
                    activity: activity,
                    model: model
                });
                view.render();
                formElems = view.$el;
                formElems.find('input[type=radio][id=address-group-radio]').prop('checked').should.isOk;
                formElems.find('label[for=address-object]').parents('.row:first').css('display').should.equal('none');
            });
        });
    });
});