/**
 * Module that implements the local and remote IP for tunnel selector view.
 *
 * @module trafficSelectorView
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'backbone.syphon',
    'widgets/grid/gridWidget',
    'widgets/form/formWidget',
    '../conf/trafficSelectorFormConf.js',
    '../conf/trafficSelectorFormGrid.js'
], function (
       Backbone,
       Syphon,
       GridWidget,
       FormWidget,
       TrafficSelectorFormConfiguration,
       TrafficSelectorFormGrid
) {

    var trafficSelectorView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.tsListCollection = new Backbone.Collection();
        },

        events: {
            'click #btnOk': "saveTrafficSelectorSettings",
            'click #linkCancel': "closeTrafficSelectorSettings",
             'click #gridAddRow': "addRow"
        },

        render: function(){
            var self = this;
            var formConfiguration = new TrafficSelectorFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: {}
            });
            this.formWidget.build();

            this.addGridWidget('traffic-selector-grid', new TrafficSelectorFormGrid(this.context));
            this.$el.find('#traffic-selector-grid').width("500px");

            if(this.passedRowData["cellData"][0] != undefined && this.passedRowData["cellData"][0] != "") {
                    var gridValues = this.passedRowData["cellData"];
                    for (var s = 0; s < gridValues.length; s++) {
                        var record = gridValues[s].split(",");
                        var name = record[0].substr(6, record[0].length);
                        var localIP = record[1].substr(8, record[1].length);
                        var remoteIP = record[2].substr(9, record[2].length);
                        self.gridWidget.addRow({"name": name,"local-ip": localIP, "remote-ip": remoteIP});
                    }
            }

            return this;
        },

        addGridWidget: function(id, gridConf) {
            var self = this,
                elements = gridConf.getValues(),
                gridContainer = self.$el.find('#' + id);

            this.$el.find('#' + id).after("<div id='"+id+"'></div>");
            gridContainer.remove();
            gridContainer = this.$el.find('#' + id);

            elements.jsonRecords = function(data) {
                data = data || [];
                return data.length;
            };

            var conf = {
                    container: gridContainer,
                    elements: elements,
                    actionEvents: gridConf.getEvents(),
                    cellTooltip: self.cellTooltip
                };
            self.gridWidget = new GridWidget(conf);

            $.when(self.gridWidget.build()).done(function() {
                gridContainer.find(".grid-widget").addClass("elementinput-long-traffic-selector-grid");
                self.bindGridEvents(gridConf.getEvents());
            });
        },

        /* Makes the grid selected rowData available to this view
         * @param {Object} rowData from selected grid row
         */

        setCellViewValues: function(rowData) {
            this.passedRowData = rowData;
        },

        saveTrafficSelectorSettings: function(e){
            var gridValues = this.gridWidget.getAllVisibleRows();
            var listValues = [];
            if(gridValues.length == 0) {
                this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_form_ts_empty_error"));
                return false;
            }

            for (var s = 0; s < gridValues.length; s++) {
                listValues.push("Name: "+gridValues[s]["name"]+", Local: "+gridValues[s]["local-ip"]+", Remote: "+gridValues[s]["remote-ip"]);
            }
            this.options.save(this.options.columnName, listValues);
            this.closeTrafficSelectorSettings(e);
        },

        closeTrafficSelectorSettings: function (e){
            this.options.close(this.options.columnName,e);
        },

        bindGridEvents: function(definedEvents) {
            /*// edit button for url
            if (definedEvents.updateEvent) {
                this.$el.bind(definedEvents.updateEvent, $.proxy(this.updateAction, this));
            }*/
            // delete button for url
            if (definedEvents.deleteEvent) {
                this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteAction, this));
            }
        },
        addRow: function(event) {
            var self = this,
                nameField = this.$el.find('#name'),
                localField = this.$el.find('#local-ip'),
                remoteField = this.$el.find('#remote-ip');

            if ($.trim(nameField.val()).length !== 0 && $.trim(localField.val()).length !== 0 && $.trim(remoteField.val()).length !== 0) {

                var nameRegex = new RegExp("^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$");

                var ipv4Expr = new RegExp("^("
                                    + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])"
                                    + "|"
                                    + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))"
                                    + ")$");

                if(!nameRegex.test(nameField.val()) || !ipv4Expr.test(localField.val()) || !ipv4Expr.test(remoteField.val())) {
                     this.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_form_entry_error"));
                     return false;
                }

                var gridRecords = self.gridWidget.getAllVisibleRows();

                if(gridRecords.length > 0) {
                    var duplicateFlag = self.findDuplicates(gridRecords, nameField.val());

                    if(duplicateFlag) {
                        self.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_form_name_duplicate_error"));
                        return false;
                    } else {
                        self.gridWidget.addRow({"name": nameField.val(), "local-ip": localField.val(), "remote-ip": remoteField.val()});
                    }
                } else {
                    self.gridWidget.addRow({"name": nameField.val(), "local-ip": localField.val(), "remote-ip": remoteField.val()});
                }

                nameField.val("");
                localField.val("");
                remoteField.val("");

            } else {
                self.formWidget.showFormError(this.context.getMessage("ipsec_vpns_tunnels_form_fields_error"));
            }

        },
        findDuplicates : function(gridRecords, enteredName) {
            var flag = false;
            for (var p = 0; p < gridRecords.length; p++) {
                var tsName = gridRecords[p].name;
                if(tsName == enteredName) {
                    return true;
                }
            }
            return flag;
        },
        /*updateAction: function(e, row) {
            var model = this.tsListCollection.get(row.originalData.name);
            model.set({id: row.updatedRow.name});
            row.originalData.name = row.updatedRow.name;
        },*/
        deleteAction : function(e, row) {
            for (var i=0; i<row.deletedRows.length; i++) {
                var name = row.deletedRows[i].name;
                this.tsListCollection.remove(this.tsListCollection.findWhere({"trafficSelectorName": name}));
            }
        }
    });

    return trafficSelectorView;
});
