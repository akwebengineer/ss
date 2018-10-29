/**
 * Form configuration for Create snapshot
 * a form for import addresses
 *
 * @module CreatSnapshotFormConfiguration
 * @author  <dkumara@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([], function() {

    var Configuration = function(context, parms) {
        var DESCRIPTION_MAX_LENGTH = 1024;

        this.getValues = function() {
            return {
                "title": context.getMessage('snapshot_policy'),
                "form_id": "snappolicy-form",
                "form_name": "snappolicy-form",
                "showScrollbar": false,
                "on_overlay": true,
                "sections": [{
                    "section_id": "snappolicy",
                    "elements": [{
                        "element_description": true,
                        "id": "snappolicy-name",
                        "class": "snappolicy-name",
                        "label": context.getMessage('snapshot_policy_name'),
                        "value": parms.selectedRow.name
                    }, {
                        "element_textarea": true,
                        "id": "snappolicy-comment",
                        "name": "snappolicy-comment",
                        "label": context.getMessage('snapshot_comment'),
                        "max_length": DESCRIPTION_MAX_LENGTH,
                        "post_validation": "descriptionValidator"
                    }]
                }],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "snappolicy-cancel",
                    "value": context.getMessage('cancel')
                },
                "buttons": [{
                    "id": "snappolicy-save",
                    "name": "save",
                    "value": context.getMessage('snapshot_create')
                }]
            };
        };
    };

    return Configuration;
});