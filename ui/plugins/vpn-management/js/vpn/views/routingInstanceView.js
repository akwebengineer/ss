/**
 * Module that implements the selected devices routing instance view.
 *
 * @module RoutingInstanceView
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/routingInstanceFormConf.js',
    '../models/deviceInterfacesCollection.js'
], function (
       Backbone,
       Syphon,
       FormWidget,
       RoutingInstanceFormConfiguration,
       DeviceInterfacesCollection
) {

    var RoutingInstanceView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
        },

        events: {
            'click #btnOk': "saveRoutingInstance",
            'click #linkCancel': "closeRoutingInstance"
        },

        render: function(){
            var self = this;
            var formConfiguration = new RoutingInstanceFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            this.getRoutingInstanceData();

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "") {
                var availableInstance = this.$el.find('#routingInstance-id')[0].options;

                for (r = 0; r< availableInstance.length; r++) {
                    if(availableInstance[r].label == this.passedRowData["cellData"][0]) {
                        this.$el.find('#routingInstance-id').val(this.passedRowData["cellData"][0]);
                        break;
                    } else {
                        this.$el.find('#routingInstance-id').val(this.$el.find('#routingInstance-id')[0].value);
                    }
                }
            }

            return this;
        },

        getRoutingInstanceData: function(name) {
            var self = this;
            var deviceId = self.rowId;
            if(self.options.fromModify) {
                deviceId = self.deviceId;
            }
            $.ajax({
                url: '/api/juniper/sd/device-management/devices/' + deviceId + '/routing-instances',
                type: 'get',
                dataType: 'json',
                headers: {
                   'content-type': 'application/vnd.juniper.sd.device-management.routing-instances+json;version=1;charset=UTF-8',
                   'accept': 'application/vnd.juniper.sd.device-management.routing-instances+json;version="1";q="0.01"'
                },
                success: function(data, status) {
                    data['routing-instances']['routing-instance'].forEach(function(object) {
                        self.$el.find('#routingInstance-id').append( new Option(object.name,object.name));
                    });

                    /*var obj = data['routing-instances'];
                    for (var prop in obj) {
                        if (prop === "routing-instance") {
                           self.$el.find('#routingInstance-id').append( new Option(obj[prop].name, obj[prop].name));
                        }
                    }*/
                },
                error: function() {
                    console.log('routing instance not fetched');
                },
                async: false
            });
        },

        getSelectedRoutingInstance: function() {
            var data = this.formWidget.getValues();
            return data[0].value;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
            this.rowId = rowData.originalRowData["id"];
            this.deviceId = (rowData.originalRowData["device-moid"].split(":"))[1];

            // pass the selected row of data to view
             this.passedRowData = rowData;
        },

        saveRoutingInstance: function(e){
            var data = this.getSelectedRoutingInstance();
            var newData = {
                "cellData": data,
                "apiData": data,
                "dataType": "ROUTINGINSTANCE"
            };
            this.options.save(this.options.columnName, newData);
            this.closeRoutingInstance(e);
        },

        closeRoutingInstance: function (e){
            this.options.close(this.options.columnName,e);
        }
    });

    return RoutingInstanceView;
});
