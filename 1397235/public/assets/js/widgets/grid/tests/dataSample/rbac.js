/**
 * A rbac sample object 
 *
 * @module rbacSample
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {

    var rbacSample = {
        createEvent: true,
        updateEvent: true,
        deleteEvent: false,
        copyEvent: true,
        pasteEvent: false,
        statusEvent: false,
        quickViewEvent: false,
        resetHitEvent: false,
        disableHitEvent: true,
        printGrid: false,
        subMenu: true,
        subMenu3: false,
        testPublishGrid: false,
        customLinkAction: false,
        // dropdownKey: false,
        testCloseGrid: false,
        addRecord: false,
        addUser1: true,
        testCloneHover: false,
        deleteOnRowHover: true
    };

    return rbacSample;

});
