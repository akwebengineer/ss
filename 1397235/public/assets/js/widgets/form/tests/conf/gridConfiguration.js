/**
 * A grid configuration object with the parameters required to build a grid
 *
 * @module 
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'widgets/grid/conf/configurationSample'
], function (configurationSample) {

    var gridSmallGridConfigurationSample = _.extend({}, configurationSample.smallGrid),
        gridConfiguration = {};

    //adjusts the smallGrid configuration from the grid configuration sample to include row inline editing and creation
    gridConfiguration.smallGrid = function () {
        delete gridSmallGridConfigurationSample.title;
        delete gridSmallGridConfigurationSample.singleselect;
        gridSmallGridConfigurationSample.columns[0].editCell = {
            "type": "input",
            "pattern": "length",
            "min_length": "2",
            "max_length": "10",
            "error": "Must be between 2 and 10 characters."
        };
        return {
            "elements": _.extend({
                "height": "40%",
                "jsonId": "id",
                "multiselect": true,
                "createRow": {
                    "showInline": true
                },
                "editRow": {
                    "showInline": true
                },
                "contextMenu": {
                    "edit": "Edit Row",
                    "delete": "Delete Row"
                }
            }, gridSmallGridConfigurationSample),
            "actions" : {
                createEvent: "addEvent",
                updateEvent: "editEvent",
                deleteEvent: "deleteEvent"
            }
        };
    }();

    gridConfiguration.smallGridOnAllPageForm = {
        "elements": _.extend({
            "height": "5%",
            "createRow": {
                "showInline": true
            },
            "editRow": {
                "showInline": true,
            }
        }, gridSmallGridConfigurationSample),
        "actions" : {
            createEvent: "addEvent",
            updateEvent: "editEvent",
            deleteEvent: "deleteEvent"
        }
    };
    gridConfiguration.smallGridOnAllPageForm.elements.multiselect = true;

    gridConfiguration.smallGridOnForm = {
        "elements": _.extend({
            "height": "50%"
        }, gridSmallGridConfigurationSample),
        "actions" : {
            createEvent: "addEvent",
            updateEvent: "editEvent",
            deleteEvent: "deleteEvent"
        }
    };

    gridConfiguration.smallGridOnOverlay = {
        "elements": _.extend({
            "height": "50%",
            "filter": {
                searchUrl: true
            },
            "multiselect": "true",
            "createRow": {
                "showInline": true
            },
            "editRow": {
                "showInline": true,
            }
        }, gridSmallGridConfigurationSample),
        "actions" : {
            createEvent: "addEvent",
            updateEvent: "editEvent",
            deleteEvent: "deleteEvent"
        }
    };

    gridConfiguration.smallGridOnWizardOverlay = {
        "elements": _.extend({
            "singleselect": "true",
            "height": "70%",
            "actionButtons": {
                "customButtons": [
                    {
                        "button_type": true,
                        "label": "Publish",
                        "key": "testPublishGrid"
                    },
                    {
                        "button_type": true,
                        "label": "Save",
                        "key": "testSaveGrid",
                        "secondary": true,
                        "disabledStatus": true //default status is false
                    }
                ]
            }
        }, gridSmallGridConfigurationSample),
        "actions" : {
            createEvent: "addEvent",
            updateEvent: "editEvent",
            deleteEvent: "deleteEvent",
            testPublishGrid: "testPublishGrid",
            testSaveGrid: "testSaveGrid"
        }
    };

    gridConfiguration.smallGridOnTabOverlay = {
        "elements": _.extend({
            "singleselect": "true",
            "height": "90%"
        }, gridSmallGridConfigurationSample),
        "actions" : {
            createEvent: "addEvent",
            updateEvent: "editEvent",
            deleteEvent: "deleteEvent"
        }
    };

    return gridConfiguration;

});
