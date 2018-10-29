/**
 * Service editor view that extends from base cellEditor & is used to select services & add new services.
 *
 * @module ServiceEditorView
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './multiSelectCellEditorNewListBuilderView.js',
    '../conf/serviceEditorFormConfiguration.js',
    '../../../../../object-manager/js/objects/widgets/serviceListBuilder.js',
    '../util/ruleGridConstants.js'
], function (CellEditorView, CellEditorFormConfiguration, ServiceListBuilder, RuleGridConstants) {
    var ServiceEditorView = CellEditorView.extend({

        initialize: function () {
            this.context = this.options.context;

            this.cellEditorFormConfiguration = new CellEditorFormConfiguration(this.context);

            this.options.editorListBuilder = {
                'listBuilderObject': ServiceListBuilder.extend({showDefaultObjects: true}),
                'addNewObject_mimeType': 'vnd.juniper.net.services'
            };
            this.options.editorForm = {
                'editorFormConfig': this.cellEditorFormConfiguration.getConfig(),
                'editorFormElements': {
                    'addNewButtonElementID': 'add-new-button',
                    'listBuilderElementID': 'list-builder-element',
                    'cancelButtonID': 'cancel',
                    'okButtonID': 'save'
                },
                'editorFormMsgBundle': {
                    'title': this.context.getMessage('fw_rules_editor_service_title'),
                    'heading_text': this.context.getMessage('fw_rules_editor_service_description'),
                    'listBuilderLabel': this.context.getMessage('fw_rules_editor_service_list_label'),
                    //'anyCheckboxText': this.context.getMessage('fw_rules_editor_service_anyCheckbox_text')
                }
            };

            CellEditorView.prototype.initialize.apply(this);
        },

        updateFormValuesForEditor: function () {
            
            var servicesArr = this.getServicesFromModel();
            this._cellViewValues = this.getNameArray(servicesArr);

            this.$el.find('#radio_include').prop('checked', true);
            this.$el.find('#radio_include_any').prop('checked', false);
            
            CellEditorView.prototype.updateFormValuesForEditor.apply(this);
        },

        getNameArray : function(objectArr){
            var nameArr = [];
            if(!objectArr)
                return nameArr;
            var len  = objectArr.length ;
            if (len){
                for (var i=0;i<len;i++){
                    nameArr.push(objectArr[i].name);
                }
            } else {
                nameArr.push(objectArr.name);
            }

            return nameArr;
        },

        getSelectedIds : function(){
            var idArr = [],
                servicesArr = this.getServicesFromModel();

            if(_.isEmpty(servicesArr))
                return idArr;
             var len  = servicesArr.length;

            if (len) {
                for (var i=0; i<len; i++) {
                    if (servicesArr[i].name !== "Any") {
                        idArr.push(servicesArr[i].id);
                    }
                }
            } else {
                if ( servicesArr.name !== "Any") {
                    idArr.push(servicesArr.id);
                }
            }

            return idArr;
        },
        
        updateModel: function (e) {
            
            var self = this;

            self.valuesForAPICall = [];

            if (this.$el.find('#radio_include_any').is(":checked")) {
                self.getAnyObject(self.listBuilder.listBuilderModel.urlRoot, e);
            } else {
                this.listBuilder.getSelectedItems(function(response) {
                    var selectedItems = response.services.service;

                    if ($.isEmptyObject(selectedItems)) {
                        self.form.showFormError(self.context.getMessage("service_empty_error"));
                        return;
                    } else {    
                        if (!$.isArray(selectedItems)){
                            selectedItems = [selectedItems];
                        }
                        for (var index = 0; index < selectedItems.length; index++) {
                            var apiCallObject = self.formatDataForAPICall(selectedItems[index]);
                            self.valuesForAPICall.push(apiCallObject);
                        }
                        self.setService(self.valuesForAPICall);

                        CellEditorView.prototype.updateModel.apply(self, [e]);
                    } 
                });
            }   
        },

        setService: function (valuesForAPICall) {
            this.model.set("services",{"service-reference": valuesForAPICall});
        },

        getServicesFromModel: function() {
            var servicesArr = [];

            var services = this.model.get("services");
            if (services) {
                servicesArr = services["service-reference"];
            }

            return servicesArr;
        },

        formatDataForAPICall: function (selectedValueData) {
            // get the necessary values that need to be sent to backend API for saving to cache
            var apiCallObject =
            {
                "href": selectedValueData["href"],
                "id": selectedValueData["id"],
                "domain-id": selectedValueData["domain-id"],
                "domain-name": selectedValueData["domain-name"],
                "name": selectedValueData["name"],
                "is-group": selectedValueData["is-group"]
            };
            return apiCallObject;
        },

        getAnyObject: function(urlRoot, e) {
            var self = this;

            $.ajax({
                url : urlRoot + RuleGridConstants.AVAIL_SERVICE,
                type:'GET',
                data: RuleGridConstants.ANY_SERVICE_FILTER, 

                beforeSend:function(request){
                    request.setRequestHeader('Accept', RuleGridConstants.SERVICE_ACCEPT);
                },
                success :function(data){
                    self.anyObjectDetails = data.services.service;
                    if (self.anyObjectDetails && self.anyObjectDetails[0]) {   
                        var apiCallObject = self.formatDataForAPICall(self.anyObjectDetails[0]);
                        self.valuesForAPICall.push(apiCallObject);
                        self.setService(self.valuesForAPICall);

                        CellEditorView.prototype.updateModel.apply(self, [e]);
                    }    
                },
                error: function() {
                    console.log('Any service is not fetched successfully');
                }
            });
        }
    });

    return ServiceEditorView;
});