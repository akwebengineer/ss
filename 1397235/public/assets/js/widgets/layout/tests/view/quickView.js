/**
 * A view that uses the formWidget to a produce a form from a configuration file
 * The configuration file contains the title, labels, element types, validation types and buttons of the form
 *
 * @module Quick View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/grid/tests/conf/formConfiguration',
    'widgets/form/formWidget'
], function(Backbone, formConf, FormWidget){
    var FormView = Backbone.View.extend({

        render: function () {
            delete formConf.QuickView["on_overlay"];
            var rowData = this.options.rowData;
            this.form = new FormWidget({
                "elements": formConf.QuickView,
                "container": this.el,
                "values": rowData
            });
            this.form.build();
            return this;
        }

    });

    return FormView;
});