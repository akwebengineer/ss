/**
 * Module that implements the vpn endpoint initiator/recipient view.
 *
 * @module InitiatorRecipientView
 * @author balasaritha<balasaritha@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/initiatorRecipientFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       InitiatorRecipientFormConfiguration
) {

    var InitiatorRecipientView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.options = options;

        },

        events: {
            'click #btnOk': "saveInitiatorRecipient",
            'click #linkCancel': "closeInitiatorRecipient"
        },

        render: function(){
            var self = this;
            self.activity = self.options.activity;
            self.UUID = self.options.activity.UUID;

            var formConfiguration = new InitiatorRecipientFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "") {
                 this.$el.find('#is-hub').val(this.passedRowData["cellData"][0]);
            }

            return this;
        },

        getSelectedValues: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];

            // pass the selected row of data to view
            this.passedRowData = rowData;
        },

        saveInitiatorRecipient: function(e){
            var data = this.getSelectedValues();
            var newData = {
                "cellData": "",
                "apiData": "",
                "dataType": "INITIATOR_RECIPIENT"
            };
            newData.cellData = data;
            newData.apiData = (data === "Initiator" ? false : true);

            this.options.save(this.options.columnName, newData);
            this.closeInitiatorRecipient(e);
            this.activity.grid.removeEditModeOnRow();
            this.activity.grid.reloadGrid();

        },
        closeInitiatorRecipient: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return InitiatorRecipientView;
});
