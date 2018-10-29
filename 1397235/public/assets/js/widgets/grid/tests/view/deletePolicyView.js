/**
 * A view that uses the formWidget to show a custom view with the list of deleted rows and a toggle button to force deletion
 * The configuration file contains the title, description, grid, toggle button and buttons of the form
 *
 * @module Application Elements Form View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/grid/tests/conf/formConfiguration',
    'widgets/form/tests/conf/gridConfiguration',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/conf/configurationSampleLocalData',
], function (Backbone, formConfiguration, gridConfiguration, FormWidget, OverlayWidget, DataSample, configurationSample, configurationSampleLocal) {
    var FormView = Backbone.View.extend({

        events: {
            'click #delete_row_save': 'deletePolicy',
            'click #delete_row_cancel': 'closePolicy'
        },

        initialize: function () {
            this.overlay = new OverlayWidget({
                view: this,
                type: 'medium'
            });
            this.overlay.build();
        },

        render: function () {
            var gridDeleteRowsConfiguration = {
                "height": "80%",
                "jsonId": "name",
                "columns": [
                    {
                        "name": "name",
                        "label": "Name"
                    }
                ],
                "data": this.options.selectedRows.selectedRows
            };

            formConfiguration.DeleteRows.sections[0].elements[1].elements = gridDeleteRowsConfiguration;
            this.form = new FormWidget({
                "elements": formConfiguration.DeleteRows,
                "container": this.el,
                "values": {
                    "ruleNumber": this.options.selectedRows.numberOfSelectedRows
                }
            });
            this.form.build();
            return this;
        },

        deletePolicy: function (e) {
            var data = {};
            if (this.form.isValidInput(this.form.conf.container.find('form'))) {
                this.options.deleteRow();
                this.closePolicy(e);
            }
        },

        closePolicy: function (e) {
            this.overlay.destroy();
//            this.options.reloadGrid();  //optional, reload the grid
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return FormView;
});