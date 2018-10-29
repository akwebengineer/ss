/**
 * Module that implements the selected preshared key.
 *
 * @module preSharedKeyView
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/preSharedKeyFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       PreSharedKeyFormConfig
) {

    var preSharedKeyView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
        },

        events: {
            'click #btnOk': "saveKey",
            'click #KeyCancel': "closeKey"
        },

        render: function(){
            var self = this;
            var formConfiguration = new PreSharedKeyFormConfig(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "")
                    this.$el.find('#pre-shared-key').val(this.passedRowData["cellData"][0]);


            return this;
        },

        getSelectedKey: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        /* Makes the grid selected rowData available to this view
         * @param {Object} rowData from selected grid row
         */

        setCellViewValues: function(rowData) {
            this.passedRowData = rowData;
        },

        saveKey: function(e){
            var data = this.getSelectedKey();

            var preSharedKeyRegex = new RegExp("^[a-zA-Z0-9!@#$%^&*()][a-zA-Z0-9~`!@#$%^&*()_./+-\\-\\s\/]{0,256}$");

            if(!preSharedKeyRegex.test(data)) {
                 this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_form_preshared_key_empty_error"));
                 return false;
            }

            this.options.save(this.options.columnName,data);
            this.closeKey(e);
        },

        closeKey: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return preSharedKeyView;
});
