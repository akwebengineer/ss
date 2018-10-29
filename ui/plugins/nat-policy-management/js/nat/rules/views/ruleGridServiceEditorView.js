/**
 * NAT Service editor view that extends from service editor view & is used to select services & add new services.
 *
 * @module ServiceEditorView
 * @author swathin@juniper.net <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridServiceEditorView.js',
], function (ServiceEditorView) {
    var NATServiceEditorView = ServiceEditorView.extend({

    	 updateModel: function (e) {
            
            var self = this;

            self.valuesForAPICall = [];

            if (this.$el.find('#radio_include_any').is(":checked")) {
                self.getAnyObject(self.listBuilder.listBuilderModel.urlRoot, e);
            } else {
                this.listBuilder.getSelectedItems(function(response) {
                    var selectedItems = response.services.service;

                    if (!$.isEmptyObject(selectedItems)) {

                        if (!$.isArray(selectedItems)){
                            selectedItems = [selectedItems];
                        }
                        for (var index = 0; index < selectedItems.length; index++) {
                            var apiCallObject = self.formatDataForAPICall(selectedItems[index]);
                            self.valuesForAPICall.push(apiCallObject);
                        }                   
                    }
                    
                	self.setService(self.valuesForAPICall);  
                    self.editCompleted(e,self.model);
                     
                });
            }   
        }

    	});

    return NATServiceEditorView;
});