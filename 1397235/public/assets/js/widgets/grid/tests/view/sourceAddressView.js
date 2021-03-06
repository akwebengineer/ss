/**
 * A view that uses a configuration object to render a form widget for the Source Address view
 *
 * @module SourceAddressView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/tests/conf/formConfiguration',
    'widgets/listBuilder/listBuilderWidget'
], function(Backbone, FormWidget, formConfiguration, ListBuilderWidget){
    var SourceAddressView = Backbone.View.extend({

        events: {
            'click #source_address_save': 'addPolicy',
            'click #source_address_cancel': 'closePolicy'
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.SourceAddress,
                "container": this.el
            });
            this.form.build();
            this.getData();

            return this;
        },

        getData:function (){
            var self = this;
            this.model.fetch({success: function(collection) {
                var addresses = [];
                collection.models.forEach(function(model){
                    var model_address = model.toJSON().address;
                    for (var i=0; i<model_address.length; i++){
                        addresses.push({
                            'label': model_address[i].name,
                            'value': model_address[i].name
                        });
                    }

                    var model_addressSet = model.toJSON()['address-set'];
                    for (var i=0; i<model_addressSet.length; i++){
                        addresses.push({
                            'label': model_addressSet[i].name,
                            'value': model_addressSet[i].name
                        });
                    }
                });
                self.addListBuilder('source_address',addresses);
                self.listBuilder.setSelectedItems(self._cellViewValues);
                self._cellViewValues = null;
            }});
        },

        addListBuilder: function (id,list){
            var listContainer = this.$el.find('#'+id)
            this.listBuilder = new ListBuilderWidget({
                "list": {"availableElements":list},
                "container": listContainer
            });
            this.listBuilder.build();
            listContainer.children().attr('id',id);
            listContainer.find('.list-builder-widget').unwrap()
        },

        addPolicy: function (e){
            if (this.form.isValidInput(this.$el.find('form'))){
                var data = this.getListBuilderSelectedItems();
                this.options.save(this.options.columnName,data);
                this.closePolicy(e);
            }
        },

        getListBuilderSelectedItems: function(){
            var listValues = [];
            var data = this.listBuilder.getSelectedItems();
            for (var i=0; i<data.length; i++){
                listValues.push(data[i].value);
            }
            return listValues;
        },

        setCellViewValues: function(rowData){
            this._cellViewValues = rowData.cellData;
        },

        closePolicy: function (e){
            this.form.destroy();
            this.options.close(this.options.columnName,e);
        }

    });

    return SourceAddressView;
});