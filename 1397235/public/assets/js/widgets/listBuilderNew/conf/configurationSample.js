/**
 * A sample configuration object that shows the parameters required to build a List Builder widget
 *
 * @module configurationSample
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/listBuilderNew/tests/dataSample/testingSample',
    'widgets/listBuilderNew/tests/models/zoneModel'
    ], function (testingSample, ZoneModel) {

    var configurationSample = {};

    var availableZoneCollection = {
            page1:  new ZoneModel.zone.availableCollection(),
            page2:  new ZoneModel.zone.availableCollection2()
        },
        selectedZoneCollection = new ZoneModel.zone.selectedCollection(),
        filteredZoneCollection = {
            page1:  new ZoneModel.zone.filteredCollection()
        },
        createLink = function (cellvalue, options, rowObject){
            return '<a class="cellLink" data-cell="'+cellvalue+'">'+cellvalue+'</a>';
         },
        getDataFunc = function (postdata){
            var self = this;
            $.ajax({
                url: "/api/get-data2",
                data: postdata,
                dataType:"json",
                complete: function(data,status){
                    var data = data.responseJSON['addresses']['address'];
                    $(self).addRowData('id',data);
                }
            });
        },
        onSelectAllAvailable = function(done){
            console.log(testingSample.selectAllAvailable);
            done({ids:testingSample.selectAllAvailable});
        },
        loadAvailableCollection = function(renderData, pageData, searchToken, pageSize){
            console.log('add available data collection');
            console.log(pageData);
            console.log(searchToken);
            console.log(pageSize);

            var hasSearch = searchToken && searchToken.length > 0,
                pageCollection = (hasSearch) ? filteredZoneCollection : availableZoneCollection,
                pageRequest = pageData.length > 1 ? 2 : 1;

            pageCollection["page" + pageRequest].fetch({
                success: function (collection) {
                    var data = collection.models[0].get("zone");
                    if (hasSearch){
                        renderData(data, {
                            numberOfPage: pageRequest,
                            totalPages: 1,
                            totalRecords: 3
                        });
                    }else {
                        var pages = [];
                        if (pageRequest == 2){
                            pages.push(data.splice(0,10));
                        }
                        pages.push(data);
                        pages.forEach(function(pageData, index){
                            renderData(pageData, {
                                numberOfPage: index + 1,
                                totalPages: 2,
                                totalRecords: 13
                            });
                        });
                    }
                },
                failure: function () {
                    console.log("The available data couldn't be loaded.");
                }
            });
            
        },
        loadSelectedCollection = function(renderData, pageData, searchToken, pageSize){
            console.log('add selected data collection');
            console.log(pageData);
            console.log(searchToken);
            console.log(pageSize);

            var hasSearch = searchToken && searchToken.length > 0,
                zoneCollection = (hasSearch) ? filteredZoneCollection.page1 : selectedZoneCollection;
            zoneCollection.fetch({    
                success: function (collection) {
                    var options = {
                        numberOfPage: 1,
                        totalPages: 1,
                        totalRecords: 10
                    };
                    if (hasSearch){
                        options.totalRecords = 3;
                    }
                    renderData(collection.models[0].get("zone"), options);
                },
                failure: function () {
                    console.log("The selected data couldn't be loaded.");
                }
            });
        },
        filterParameter = "(addressType ne 'IPADDRESS' and addressType ne 'DNS' and addressType ne 'NETWORK' and addressType ne 'WILDCARD' and addressType ne 'POLYMORPHIC' and addressType ne 'DYNAMIC_ADDRESS_GROUP’)";
         
    configurationSample.firstListBuilder =  {
        "availableElements": {
            "url": "/api/get-data",
            "jsonRoot": "addresses.address",
            "totalRecords": "addresses.@total",
            "title": "Test Title1",
            "urlParameters": {filter: filterParameter},
            "onSelectAll": onSelectAllAvailable
        },
        "selectedElements": {
            "url": '/api/get-data2',
            "jsonRoot": "addresses.address",
            "totalRecords": "addresses.@total",
            "title": "Test Title2",
            "urlParameters": {filter: filterParameter},
            "hideSearchOptionMenu": true,
            "onSelectAll": onSelectAllAvailable
        },
        "pageSize": 10,
        "sorting": [
            {
            "column": "name",
            "order": "asc"
            }
        ],
        "jsonId": "id",
        "height": '115',
        "id": "test",  
        "search": {
            "url": function (currentPara, value){
                if (_.isArray(value)){
                    return _.extend(currentPara, {searchKey:value.join(' '), searchAll:true, _search: 'aol', test: false});
                }else{
                    return _.extend(currentPara, {searchKey:value, searchAll:true, _search: value});
                }
            },
            "optionMenu": [{
                "label":"IP Address",
                "value":"IPADDRESS",
                "key":"IPADDRESS",
                "type": "checkbox",
                "selected": true
            },{
                "label":"DNS",
                "value":"DNS",
                "key":"DNS",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Network",
                "value":"NETWORK",
                "key":"NETWORK",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Wildcard",
                "value":"WILDCARD",
                "key":"WILDCARD",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Polymorphic",
                "value":"POLYMORPHIC",
                "key":"POLYMORPHIC",
                "type": "checkbox",
                "selected": true
            }]
        },
        // "ajaxOptions": {
        //     "headers": {
        //         "Accept": 'application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01'
        //     }
        // },
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 200,
            "formatter":createLink
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 150
        }]
    };
    configurationSample.secondListBuilder =  {
        "availableElements": {
            "url": "/api/get-data",
            "jsonRoot": "addresses.address",
            "totalRecords": "addresses.@total"
        },
        "pageSize": 20,
        "id": "test2",
        "jsonId": "id",
        "height": '115',
        "loadonce": true, //only load remotely once
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 200
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 150
        }]
    };
    configurationSample.thirdListBuilder =  {
        "availableElements": {
            "data": testingSample.addresses.addresses.address
        },
        "selectedElements": {
            "data": testingSample.addresses2.addresses.address
        },
        "id": "test3",
        "jsonId": "id",
        "pageSize": 1000, //For local data, the page size should be the max number of rows
        "showWidthAsPercentage": true,
        "search": {
            "columns": "name",
            "optionMenu": [{
                "label":"2",
                "value":"2",
                "key":"search1",
                "type": "radio"
            },{
                "label":"SAP",
                "value":"SAP",
                "key":"search2",
                "type": "radio"
            }]
        },
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 200
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 80
        }]
    };
    configurationSample.fourthListBuilder =  {
        "availableElements": {
            "getData": getDataFunc,
            "jsonRoot": "addresses.address",
            "totalRecords": "addresses.@total"
        },
        "pageSize": 20,
        "id": "test4",
        "jsonId": "id",
        "showWidthAsPercentage": true,
        "loadonce": true, //only load remotely once
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 200
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 180
        }]
    };
    configurationSample.collectionData =  {
        "availableElements": {
            "totalRecords": 13,
            "title": "Test Title1",
            "onSelectAll": onSelectAllAvailable,
            "getPageData": loadAvailableCollection
        },
        "selectedElements": {
            "totalRecords": 23,
            "title": "Test Title2",
            // "hideSearchOptionMenu": true,
            "onSelectAll": onSelectAllAvailable,
            "getPageData": loadSelectedCollection
        },
        "pageSize": 10,
        "sorting": [
            {
            "column": "name",
            "order": "asc"
            }
        ],
        "search":{
            "optionMenu": [{
                "label":"IP Address",
                "value":"IPADDRESS",
                "key":"IPADDRESS",
                "type": "checkbox",
                "selected": true
            },{
                "label":"DNS",
                "value":"DNS",
                "key":"DNS",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Network",
                "value":"NETWORK",
                "key":"NETWORK",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Wildcard",
                "value":"WILDCARD",
                "key":"WILDCARD",
                "type": "checkbox",
                "selected": true
            },{
                "label":"Polymorphic",
                "value":"POLYMORPHIC",
                "key":"POLYMORPHIC",
                "type": "checkbox",
                "selected": true
            }]
        },
        "jsonId": "name",
        "height": '115',
        "id": "testCollection",  
        "columns": [
        {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 200
        }, {
            "index": "interfaces",
            "name": "interfaces",
            "label": "Interfaces",
            "width": 150
        }]
    };


    return configurationSample;

});
