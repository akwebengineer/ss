/**
 * Module that implements the local proxy view.
 *
 * @module LocalProxyView
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/localProxyFormConf.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       LocalProxyFormConfiguration
) {

    var proxyView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
        },

        events: {
            'click #btnOk': "saveProxySettings",
            'click #linkCancel': "closeProxySettings"
        },

        render: function(){
            var self = this;
            var formConfiguration = new LocalProxyFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            if(this.passedRowData["cellData"].length == 2) {
                if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "" &&
                   this.passedRowData["cellData"][1] != undefined && this.passedRowData["cellData"][1] != "") {
                         if(this.passedRowData["cellData"][0].indexOf("Local:") != -1)
                                this.$el.find('#local-proxyid').val(this.passedRowData["cellData"][0].substr(7, this.passedRowData["cellData"][0].length));

                         if(this.passedRowData["cellData"][1].indexOf("Remote:") != -1)
                                this.$el.find('#remote-proxyid').val(this.passedRowData["cellData"][1].substr(8, this.passedRowData["cellData"][1].length));

                }
            } else if(this.passedRowData["cellData"].length == 1 && this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "") {
                   if(this.passedRowData["cellData"][0].indexOf("Local:") != -1)
                        this.$el.find('#local-proxyid').val(this.passedRowData["cellData"][0].substr(7, this.passedRowData["cellData"][0].length));

                   if(this.passedRowData["cellData"][0].indexOf("Remote:") != -1)
                        this.$el.find('#remote-proxyid').val(this.passedRowData["cellData"][0].substr(8, this.passedRowData["cellData"][0].length));
            }

            return this;
        },

        getSelectedProxyInstance: function() {
            var listValues = [];
            var data = this.formWidget.getValues();
            if(data[0].value != undefined && data[0].value != ""){
                listValues.push('Local: '+data[0].value);
            }
            if(data[1].value != undefined && data[1].value != "") {
                 listValues.push('Remote: '+data[1].value);
            }
            return listValues;
        },

        /* Makes the grid selected rowData available to this view
         * @param {Object} rowData from selected grid row
         */

        setCellViewValues: function(rowData) {
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];
            this.passedRowData = rowData;
        },

        saveProxySettings: function(e){
            var data = this.getSelectedProxyInstance();
            var formValues = this.formWidget.getValues();
            var ipv4Expr = new RegExp("^("
                            + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])"
                            + "|"
                            + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))"
                            + ")$");

            if(data.length == 1) {
                if(data[0].indexOf("Local") == 0) {
                    if(!ipv4Expr.test(formValues[0].value)) {
                         this.formWidget.showFormError("Invalid entry. Enter a valid IPv4 address.");
                         return false;
                    }
                } else {
                    if(!ipv4Expr.test(formValues[1].value)) {
                         this.formWidget.showFormError("Invalid entry. Enter a valid IPv4 address.");
                         return false;
                    }
                }

            } else if(data.length == 2) {
                if(!ipv4Expr.test(formValues[0].value) || !ipv4Expr.test(formValues[1].value)) {
                     this.formWidget.showFormError("Invalid entry. Enter a valid IPv4 address.");
                     return false;
                }
            }

            this.options.save(this.options.columnName,data);
            this.closeProxySettings(e);
        },

        closeProxySettings: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return proxyView;
});
