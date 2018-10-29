/**
 * A view that uses the Form Widget to render a form from a configuration object for the Application view
 *
 * @module ApplicationView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
//    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/formConfiguration',
    'widgets/listBuilder/listBuilderWidget'
], function(Backbone, FormWidget, formConfiguration, ListBuilderWidget){
    var ApplicationView = Backbone.View.extend({

        events: {
            'click #source_address_save': 'addPolicy',
            'click #source_address_cancel': 'closePolicy'
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConfiguration.Application,
                "container": this.el
            });
            this.form.build();
            this.getModelData();
            return this;
        },

        getModelData:function (){
            var self = this;
            this.model.fetch({success: function(collection) {
                var applications = [];
                collection.models.forEach(function(model){
                    applications.push({
                        'label': model.get('name'),
                        'value': model.get('name')
                    });
                });
                self.addListBuilder('application',applications);
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

        getViewData: function (){
            var viewData = {};
            if (this.form && this.form.isValidInput()){
                var values = this.form.getValues();
                for (var i=0; i<values.length; i++){
                    viewData[values[i].name] = values[i].value;
                }
                viewData['application'] = this.getListBuilderSelectedItems('application');
            }
            return viewData;
        },

        getListBuilderSelectedItems: function(id){
            var listValues = [];
            var data = this.listBuilder.getSelectedItems();
            for (var i=0; i<data.length; i++){
                listValues.push(data[i].value);
            }
            return listValues;
        },

        isValidTabInput: function(){
            return this.form.isValidInput();
        }

    });

    return ApplicationView;
});