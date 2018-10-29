/**
 * Service editor view that extends from base cellEditor & is used to select protocols & add new protocols.
 *
 * @module ProtocolEditorView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../base-policy-management/js/policy-management/rules/views/multiSelectCellEditorNewListBuilderView.js',
    '../conf/protocolEditorFormConfiguration.js',
    '../../../../../security-management/js/objects/widgets/protocolListBuilder.js'
], function (CellEditorView, ProtocolEditorFormConfiguration, ProtocolListBuilder) {
    var ProtocolEditorView = CellEditorView.extend({

        initialize: function () {
            this.context = this.options.context;

            this.cellEditorFormConfiguration = new ProtocolEditorFormConfiguration(this.context);

            this.options.editorListBuilder = {
                'listBuilderObject': ProtocolListBuilder.extend({showDefaultObjects: true})
            };
            this.options.editorForm = {
                'editorFormConfig': this.cellEditorFormConfiguration.getConfig(),
                'editorFormElements': {
                    'listBuilderElementID': 'list-builder-element',
                    'cancelButtonID': 'cancel',
                    'okButtonID': 'save'
                },
                'editorFormMsgBundle': {
                    'title': this.context.getMessage('fw_rules_editor_protocol_title'),
                    'heading_text': this.context.getMessage('fw_rules_editor_protocol_description')
                }
            };

            CellEditorView.prototype.initialize.apply(this);
        },

        getSelectedIds : function(){
            var nameArr = [],
                protocolsArr = this.model.get("original-packet")["protocol"]["protocol-data"];
            if(protocolsArr == undefined || protocolsArr == null)
                return nameArr;

            var len  = protocolsArr.length ;
            if(len){
                for(var i=0;i<len;i++){
                    nameArr.push({"name":protocolsArr[i].name,"id":protocolsArr[i].value});
                }
            }else{
                if(protocolsArr.name != undefined && protocolsArr.name != "")
                    nameArr.push({"name":protocolsArr.name,"id":protocolsArr.value});
            }

            return nameArr;
        },
        validateProtocols : function() {
            var selectedItems = this.listBuilder.getSelectedItems();
            if(selectedItems && $.isArray(selectedItems) && selectedItems.length > 4) {
                this.form.showFormError(this.context.getMessage('nat_rules_editor_protocols_count_error'));
                return false;
            }
            return true;
        },

        updateModel: function (e) {
          if(!this.validateProtocols())
             return false;  
          this.getValuesFromEditor();
          CellEditorView.prototype.updateModel.apply(this,[e]);

        },

        getValuesFromEditor: function () {

            var self=this,selectedValuesObject = {};
            self.valuesForAPICall = [];

            var updatedValuesForEditor;
                var selectedItems = this.listBuilder.getSelectedItems();
                if (selectedItems) {
                    if (!$.isArray(selectedItems)){
                        selectedItems = [selectedItems];
                    }
                    for (var index = 0; index < selectedItems.length; index++) {
                        var apiCallObject = self.formatDataForAPICall(selectedItems[index]);
                        self.valuesForAPICall.push(apiCallObject);
                    }    
                }  
            var _originalPacket = _.omit(this.model.get("original-packet"));
            _originalPacket["protocol"] =  {
              "protocol-data" : self.valuesForAPICall
            };
            this.model.set("original-packet" , _originalPacket);

            return selectedValuesObject;
        },

        formatDataForAPICall: function (selectedValueData) {
            var apiCallObject =
            {
                "name": selectedValueData["name"],
                "value":selectedValueData["id"]
            };
            return apiCallObject;
        }
    });

    return ProtocolEditorView;
});