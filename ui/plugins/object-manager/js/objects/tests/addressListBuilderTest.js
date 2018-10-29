/**
 * Address List Builder Unit Test
 * Created by honglijin on 8/29/16.
 */
define([
    '../widgets/addressListBuilder.js'
], function (AddressListBuilder) {
    describe('Address List Builder Unit Test', function () {
        var activity, context, addressListBuilder;
        before(function () {
            activity = new Slipstream.SDK.Activity();
            context = new Slipstream.SDK.ActivityContext();
        });
        beforeEach(function () {
            addressListBuilder = new AddressListBuilder({
                context: context
            });
        });
        afterEach(function () {
            addressListBuilder = null;
        });
        it('initialize, should build a new listBuilderModel', function () {
            addressListBuilder.listBuilderModel.should.be.exist;
            addressListBuilder.listBuilderModel.attributes.should.be.empty;
        });
        it('excludeAddressByType, should return a list of wrapped object', function () {
            var typeArr, filterArr;
            typeArr = ['HOST', 'NETWORK', 'GROUP'];
            filterArr = addressListBuilder.excludeAddressByType(typeArr);
            filterArr[0].property.should.equal('addressType');
            filterArr[0].value.should.equal('HOST');
        });
        it('excludeAddressByName, should return a list of object', function () {
            var nameArr, filterArr;
            nameArr = ['test', 'aaa', 'bbb', 'ccc'];
            filterArr = addressListBuilder.excludeAddressByName(nameArr);
            filterArr.should.be.lengthOf(4);
            filterArr[0].property.should.equal('name');
            filterArr[0].value.should.equal('test');
        });
        it('getInitialFilterParameter, should return a filter url string', function () {
            var filterUrl;
            addressListBuilder.conf.excludedTypes = ['IPADDRESS'];
            addressListBuilder.conf.excludedNames = ['test'];
            filterUrl = addressListBuilder.getInitialFilterParameter();
            filterUrl.should.equal('(addressType ne \'IPADDRESS\' and name ne \'test\')');
        });
        it('addExcludedTypes - Host, should push "IPADDRESS" and "DNS" into excludeTypeArr', function () {
            var value, excludeTypeArr;
            value = 'HOST';
            excludeTypeArr = [];
            addressListBuilder.addExcludedTypes(value, excludeTypeArr);
            excludeTypeArr.should.not.be.empty;
            excludeTypeArr[0].should.equal('IPADDRESS');
            excludeTypeArr[1].should.equal('DNS');
        });
        it('addExcludedTypes - NETWORK & others, should push the corresponding value into excludeTypeArr', function () {
            var value, excludeTypeArr;
            value = 'NETWORK';
            excludeTypeArr = [];
            addressListBuilder.addExcludedTypes(value, excludeTypeArr);
            excludeTypeArr.should.not.be.empty;
            excludeTypeArr[0].should.equal('NETWORK');
        });
        it('addExcludedTypes - default, should split value and push them into excludeTypeArr', function () {
            var value, excludeTypeArr;
            value = 'foo,bar,baz';
            excludeTypeArr = [];
            addressListBuilder.addExcludedTypes(value, excludeTypeArr);
            excludeTypeArr.should.not.be.empty;
            excludeTypeArr[0].should.equal('foo');
            excludeTypeArr[1].should.equal('bar');
            excludeTypeArr[2].should.equal('baz');
        });
        it('handleFilter, should exclude value form filters and add excludedNames', function () {
            var filters, value, filterUrl;
            filters = [
                {
                    'value': 'HOST'
                },
                {
                    'value': 'NETWORK'
                },
                {
                    'value': 'RANGE'
                }
            ];
            value = 'HOST';
            addressListBuilder.conf.excludedNames = ['test'];
            filterUrl = addressListBuilder.handleFilter(filters, value);
            filterUrl.should.include('NETWORK');
            filterUrl.should.include('RANGE');
            filterUrl.should.include('test');
        });
        it('addDynamicFormConfig, value is [\'HOST\'], currentPara should exclude HOST', function () {
            var elements, currentPara, value;
            addressListBuilder.conf.excludedTypes = ['POLYMORPHIC', 'DYNAMIC_ADDRESS_GROUP', 'ANY', 'ANY_IPV4', 'ANY_IPV6'];
            currentPara = {
                'filter': '(addressType ne \'POLYMORPHIC\' and addressType ne \'DYNAMIC_ADDRESS_GROUP\' and addressType ne \'ANY\' and addressType ne \'ANY_IPV4\' and addressType ne \'ANY_IPV6\')'
            };
            value = ['HOST'];
            elements = addressListBuilder.addDynamicFormConfig(addressListBuilder.elements);
            elements.search.url(currentPara, value);
            currentPara.filter.should.include('NETWORK');
            currentPara.filter.should.include('RANGE');
            currentPara.filter.should.include('WILDCARD');
        });
        it('addDynamicFormConfig, value is [ ], currentPara should exclude none', function () {
            var elements, currentPara, value;
            addressListBuilder.conf.excludedTypes = ['POLYMORPHIC', 'DYNAMIC_ADDRESS_GROUP', 'ANY', 'ANY_IPV4', 'ANY_IPV6'];
            currentPara = {
                'filter': '(addressType ne \'NETWORK\' and addressType ne \'RANGE\' and addressType ne \'WILDCARD\' and addressType ne \'GROUP\' and addressType ne \'POLYMORPHIC\' and addressType ne \'DYNAMIC_ADDRESS_GROUP\' and addressType ne \'ANY\' and addressType ne \'ANY_IPV4\' and addressType ne \'ANY_IPV6\')'
            };
            value = [];
            elements = addressListBuilder.addDynamicFormConfig(addressListBuilder.elements);
            elements.search.url(currentPara, value);
            currentPara.filter.should.not.include('HOST');
            currentPara.filter.should.not.include('NETWORK');
            currentPara.filter.should.not.include('RANGE');
            currentPara.filter.should.not.include('WILDCARD');
        });
        it('addDynamicFormConfig, value is "test", currentPara should extend _search prop', function () {
            var elements, currentPara, value;
            currentPara = {};
            value = 'test';
            elements = addressListBuilder.addDynamicFormConfig(addressListBuilder.elements);
            elements.search.url(currentPara, value);
            currentPara['_search'].should.be.exist;
        });
        it('addDynamicFormConfig, value is "", currentPara should delete _search prop', function () {
            var elements, currentPara, value;
            currentPara = {
                '_search': 'test'
            };
            value = '';
            elements = addressListBuilder.addDynamicFormConfig(addressListBuilder.elements);
            elements.search.url(currentPara, value);
            currentPara.should.be.empty;
        });
        it('resetFilter, setFilter method should called with correct arguments', function () {
            var stubGetAvailableUrlParameter, spySetFilter;
            stubGetAvailableUrlParameter = sinon.stub(addressListBuilder, 'getAvailableUrlParameter', function () {
                return {};
            });
            spySetFilter = sinon.spy(addressListBuilder, 'setFilter');
            addressListBuilder.conf.excludedTypes = ['IPADDRESS'];
            addressListBuilder.conf.excludedNames = ['test'];
            addressListBuilder.resetFilter();
            spySetFilter.called.should.be.true;
            spySetFilter.args[0][0][0].value.should.equal('IPADDRESS');
            spySetFilter.args[0][0][1].value.should.equal('test');
            stubGetAvailableUrlParameter.restore();
            spySetFilter.restore();
        });
        it('rowTooltip, address-type is "NETWORK", renderFunc method should called with correct arguments', function () {
            var rowData, response, renderFunc, stubFetchById, spyConsole;
            rowData = {
                'id': 294973,
                'name': 'abody'
            };
            renderFunc = function(data){
                console.log(data);
            };
            response = {
                'address': {
                    'address-type': 'NETWORK',
                    'host-name': '',
                    'ip-address': '10.10.20.32/31',
                    'name': 'abody'
                }
            };
            spyConsole = sinon.spy(console, 'log');
            stubFetchById = sinon.stub(addressListBuilder.listBuilderModel, 'fetchById', function(id, callback){
                callback(null, response);
            });
            addressListBuilder.rowTooltip(rowData, renderFunc);
            spyConsole.called.should.be.true;
            spyConsole.args[0][0][0]['title'].should.equal('abody');
            spyConsole.args[0][0][1]['label'].should.equal('10.10.20.32/31');
            stubFetchById.restore();
            spyConsole.restore();
        });
        it('rowTooltip, address-type is "GROUP", renderFunc method should called with correct arguments', function () {
            var rowData, response, renderFunc, stubFetchById, spyConsole;
            $('#main-content').append('<a id="1-tooltip-more-link">more</a>>');
            rowData = {
                'id': 426008,
                'name': 'foo'
            };
            renderFunc = function(data){
                console.log(data);
            };
            response = {
                'address': {
                    'address-type': 'GROUP',
                    'name': 'foo',
                    'members': {
                        'member': [
                            {
                                'address-type': 'NETWORK',
                                'host-name': '',
                                'ip-address': '10.10.20.32/31',
                                'name': 'abody'
                            },
                            {
                                'address-type': 'GROUP',
                                'name': 'bar'
                            },
                            {
                                'address-type': 'NETWORK',
                                'host-name': '',
                                'ip-address': '10.10.20.32/31',
                                'name': 'abody'
                            },
                            {
                                'address-type': 'NETWORK',
                                'host-name': '',
                                'ip-address': '10.10.20.32/31',
                                'name': 'abody'
                            },
                            {
                                'address-type': 'NETWORK',
                                'host-name': '',
                                'ip-address': '10.10.20.32/31',
                                'name': 'abody'
                            },
                            {
                                'address-type': 'NETWORK',
                                'host-name': '',
                                'ip-address': '10.10.20.32/31',
                                'name': 'abody'
                            }
                        ]
                    }
                }
            };
            spyConsole = sinon.spy(console, 'log');
            stubFetchById = sinon.stub(addressListBuilder.listBuilderModel, 'fetchById', function(id, callback){
                callback(null, response);
            });
            addressListBuilder.conf.id = 1;
            addressListBuilder.rowTooltip(rowData, renderFunc);
            spyConsole.called.should.be.true;
            spyConsole.args[0][0][0]['title'].should.equal('foo');
            spyConsole.args[0][0][1]['label'].should.equal('abody: 10.10.20.32/31');
            spyConsole.args[0][0].length.should.equal(7);
            stubFetchById.restore();
            spyConsole.restore();
            $('#main-content').html('');
        });
        it('moreLinkAction, should build tooltipOverlay', function () {
            var link, id, name;
            $('#main-content').append('<a id="1-tooltip-more-link">more</a>>');
            link = $('#1-tooltip-more-link');
            id = 123;
            name = 'test';
            addressListBuilder.moreLinkAction(link, id, name);
            addressListBuilder.tooltipOverlay.should.be.exist;
            $('#main-content').html('');
        });
    });
});