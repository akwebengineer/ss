/**
 * A sample configuration object that shows the parameters required to build a Grid widget with drag and drop
 *
 * @module configurationSampleDragNDrop
 * @author Eva Wang<iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define(['widgets/grid/conf/searchConfiguration'], function (searchConfiguration) {

    var configurationSample = {};

    var rowafterDropCallback = function(data){
        console.log('Grid 1 after row drops');
        console.log(data); 

        return true;
    };

    var rowafterDropCallback2 = function(data){
        console.log('Grid 2 after row drops');
        console.log(data); 

        return false;
        //return {isValid: false, errorMessage: 'The row can not be reordered.'};
    };

    var rowHoverDropCallback = function(data){
        console.log('row hoverDrop callback');
        console.log(data); 

        return true;
    };

    var rowBeforeDrag = function(data){
        console.log('row starts dragging');
        console.log(data);

        return true;
    };
    var rowBeforeDrag2 = function(data){
        console.log('Grid3 row starts dragging');
        console.log(data);

        return false;
    };

    var defaultAfterDrop = function(data){
        console.log('default cell level afterDrop callback');
        console.log(data);

        // return false;
        // return true;
        return {isValid: false, errorMessage: 'afterDrop callback returns error object.'};
    };

    var destinationAddressDropCallback = function(data){
        console.log('destination-address afterDrop callback');
        console.log(data);

        return true;
        // return {isValid: false, errorMessage: 'The item is duplicated.'};
    };

    var fromZoneDropCallback = function(data){
        console.log('from-zone afterDrop callback: bypass default behavior');
        console.log(data);

        return false;
    };

    var toZoneDropCallback = function(data){
        console.log('to-zone afterDrop callback');
        console.log(data);
        
        return true;
    };

    var defaultBeforeDrag = function(data){
        console.log('default cell level beforeDrag callback');
        console.log(data);
    
        data.helper.attr("data-grid-demo", "this is payload data.");

        // return false;
        // return true;
        return {isValid: false, errorMessage: 'beforeDrag callback returns error object.'};
    };

    var destinationAddressBeforeDrag = function(data){
        console.log('destination-address beforeDrag callback');
        console.log(data);

        data.helper.attr("data-grid-demo", "this is payload data 2.");
        return true;
    };

    var fromZoneBeforeDrag = function(data){
        console.log('from-zone beforeDrag callback: bypass default behavior');
        console.log(data);

        return false;
    };

    var toZoneBeforeDrag = function(data){
        console.log('to-zone beforeDrag callback');
        console.log(data);

        return true;
    };

    var defaultHoverDrop = function(data){
        console.log('default cell level hover callback');
        console.log(data);

        // return false;
        return true;
    };

    var sourceAddressHoverDrop = function(data){
        console.log('source-address hover callback');
        console.log(data);

        return false;
    };

    var enabledRowInteraction = function (rowId, rowData) {
        var rowIds = ["185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante", "PAGE2_185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", "PAGE2_189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"];
        if (~rowIds.indexOf(rowId)) {
            console.log(rowData);
            return false;
        }
        return true;
    };

    configurationSample.dragNDropGrid1 = {
        "title": "Firewall Policies",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget<br/>1. Keyword 'NoData' in search will show the use case when API response not available<br/>2. Keyword 'PSP' in search will show filtered data.<br/>Additional information available on the <b>link</b> below",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "url": "/api/get-data", //option 1 to be used with jsonRoot
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
        "height": '300px',
        "multiselect": true,
        "enabledRowInteraction": enabledRowInteraction,
        "scroll": true,
        "editRow": {
           "showInline": true
        },
        "jsonRecords": function(data) {
            return data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
//            return data['policy'][0]['junos:total'];
        },
        "filter": {
            searchUrl: true,
            advancedSearch: {
               "queryBuilder" : true,
                "filterMenu": searchConfiguration.filterMenu,
                "logicMenu": searchConfiguration.logicMenu,
                "save": [{
                    "label": "Save Filter",
                    "key": "saveFilter"
                }, {
                    "label": "Create Monitor",
                    "key": "createMonitor"
                }, {
                    "label": "Create Alert",
                    "key": "createAlert"
                }]
            }
        },
        "dragNDrop":{
            moveCell:{
                beforeDrag: defaultBeforeDrag,
                hoverDrop: defaultHoverDrop,
                afterDrop: defaultAfterDrop
            },
            moveRow: {
                beforeDrag: rowBeforeDrag,
                hoverDrop: rowHoverDropCallback,
                afterDrop: rowafterDropCallback,
                position: 'junos:position'
            }
        },
        "contextMenu": {
            "edit": "Edit Row"
        },
        "numberOfRows": 10,
        "jsonId": "name",
        "tableId":"test1",
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "width": 300,
                "editCell":{
                    "type": "input",
                    "post_validation": "postValidation",
                    "pattern": "^[a-zA-Z0-9_\-]+$",
                    "error": "Enter alphanumeric characters, dashes or underscores"
                }
            }, {
                "index": "inactive",
                "name": "inactive",
                "label": "Inactive",
                "internal": false,
                "hidden": true,
                "frozen": true,
                "showInactive": true
            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 260,
                "collapseContent":true,
                "createdDefaultValue":"any",
                "dragNDrop":{
                    isDraggable: true,
                    isDroppable: true,
                    groupId: 'address',
                    callbacks: {
                        hoverDrop: sourceAddressHoverDrop
                    }
                }
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent":true,
                "width": 260,
                "createdDefaultValue":"any",
                "dragNDrop":{
                    isDraggable: true,
                    isDroppable: true,
                    groupId: 'address',
                    callbacks: {
                        beforeDrag: destinationAddressBeforeDrag,
                        afterDrop: destinationAddressDropCallback
                    }
                }
            }, {
                "index": "FromZone",
                "name": "from-zone-name",
                "label": "From Zone",
                "collapseContent":true,
                "width": 260,
                "createdDefaultValue":"any",
                "dragNDrop":{
                    isDraggable: true,
                    isDroppable: true,
                    groupId: 'zone',
                    callbacks: {
                        beforeDrag: fromZoneBeforeDrag,
                        afterDrop: fromZoneDropCallback
                    }
                }
            }, {
                "index": "ToZone",
                "name": "to-zone-name",
                "label": "To Zone",
                "collapseContent":true,
                "width": 260,
                "createdDefaultValue":"any",
                "dragNDrop":{
                    isDraggable: true,
                    isDroppable: true,
                    groupId: 'zone',
                    callbacks: {
                        beforeDrag: toZoneBeforeDrag,
                        afterDrop: toZoneDropCallback
                    }
                }
            }, {
                "index": "date",
                "name": "date",
                "label": "Date",
                "width": 200,
                "searchCell":{
                    "type": "date"
                }
            }
        ]
    };

    configurationSample.dragNDropGrid2 = {
        "title": "Addresses",
        "url": "/api/get-data", //option 1 to be used with jsonRoot
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
        "height": '300px',
        "multiselect": true,
        "scroll": true,
        "jsonRecords": function(data) {
            return data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
        },
        "dragNDrop":{
            connectWith: {
                selector: "#test1",
                groupId: 'address'
            },
            moveRow: {
                beforeDrag: rowBeforeDrag,
                hoverDrop: rowHoverDropCallback,
                afterDrop: rowafterDropCallback2,
                position: 'junos:position'
            }
        },
        "numberOfRows":10,
        "jsonId": "name",
        "tableId":"test2",
         "contextMenu": {
            "edit": "Edit Row"
        },
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "editCell":{
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error":"Spaces are not allowed"
                }
            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "collapseContent":true,
                "createdDefaultValue":"any"
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent":true,
                "createdDefaultValue":"any"
            }, {
                "index": "date",
                "name": "date",
                "label": "Date",
                "searchCell":{
                    "type": "date"
                }
            }
        ]
    };

    configurationSample.dragNDropGrid3 = {
        "title": "Zones",
        "url": "/api/get-data-zone", //option 1 to be used with jsonRoot
        "jsonRoot": "zone-sets.zone-set",
        "height": '300px',
        "multiselect": true,
        "scroll": true,
        "jsonRecords": function(data) {
            return data['zone-sets']['total'];
        },
        "dragNDrop":{
            connectWith: {
                selector: "#test1",
                groupId: 'zone'
            },
            moveRow: {
                beforeDrag: rowBeforeDrag2
            }
        },
        "numberOfRows":10,
        "jsonId": "name",
        "tableId":"test3",
         "contextMenu": {
            "edit": "Edit Row"
        },
        "columns": [
            {
                "index": "name",
                "name": "name",
                "label": "Name"
            }, {
                "index": "zones",
                "name": "zones",
                "label": "Zones",
                "collapseContent":true
            }, {
                "index": "domain",
                "name": "domain-name",
                "label": "Domain"
            }

        ]
    };


return configurationSample;

});
