/**
 * Source Identity editor view that extends from base cellEditor & is used to select Source Identities & add new Source Identity.
 *
 * @module SourceIdentityEditorView
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone.syphon',
    'widgets/overlay/overlayWidget',
    '../../../../../base-policy-management/js/policy-management/rules/views/multiSelectCellEditorNewListBuilderView.js',
    '../conf/fwRuleSourceIdentityEditorConf.js',
    './sourceIdentityListBuilder.js',
    './fwRuleSourceIdentityFormView.js',
    '../models/sourceIdentityModel.js',
    '../../../../../base-policy-management/js/policy-management/rules/util/ruleGridConstants.js'
], function (Syphon, OverlayWidget, MultiSelectCellEditorView, CellEditorFormConfiguration, SourceIdentityListBuilder, SourceIdentityFormView, SourceIdentityModel, RuleGridConstants) {
    var SourceIdentityEditorView = MultiSelectCellEditorView.extend({
        events: {
            "click #add-new-button": "addNewSrcId"
        },

        initialize: function () {
            this.context = this.options.context;
            this.policyObj = this.options.policyObj;

            this.sourceIdentityModel = new SourceIdentityModel();

            this.cellEditorFormConfiguration = new CellEditorFormConfiguration(this.context);

            this.options.editorListBuilder = {
                'policyObj': this.policyObj,
                'listBuilderObject': SourceIdentityListBuilder.extend({showDefaultObjects: true})
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
                    'title': this.context.getMessage('fw_rules_editor_sourceIdentity_title'),
                    'heading_text': this.context.getMessage('fw_rules_editor_sourceIdentity_description'),
                    'listBuilderLabel': this.context.getMessage('fw_rules_editor_sourceIdentity_list_label'),
                }
            };
            MultiSelectCellEditorView.prototype.initialize.apply(this);
        },
        updateFormValuesForEditor: function () {
            this._cellViewValues = this.model.get("sourceidentities")["sourceidentity"];

            // MultiSelectCellEditorView.prototype.updateFormValuesForEditor.apply(this);

            var addNewButtonElement = this.$el.find('#' + this.editorFormElements.addNewButtonElementID);
            addNewButtonElement.attr('value', this.context.getMessage('editor_addNewButton') + ' ' + this.editorFormConfig.title);
            addNewButtonElement.addClass("editorAddNewButton-align-right");
            var currentListLabelElement = this.$el.find('label[for=' + this.editorFormElements.listBuilderElementID + ']');
            currentListLabelElement.text(this.editorFormMsgBundle && this.editorFormMsgBundle.listBuilderLabel);
        },

        formatDataForAPICall: function (selectedValueData) {
            // get the necessary values that need to be sent to backend API for saving to cache
            var apiCallObject = selectedValueData["name"];
            
            return apiCallObject;
        },

        updateModel: function (e) {
            var self = this;

            self.valuesForAPICall = [];

                this.listBuilder.getSelectedItems(function(response) {
                    var selectedItems = response.SrcIdentityList.srcIdentities;
                    if (!$.isArray(selectedItems)){
                        selectedItems = [selectedItems];
                    }
                    if (selectedItems && selectedItems.length > 0) {
                        for (var index = 0; index < selectedItems.length; index++) {
                            var apiCallObject = self.formatDataForAPICall(selectedItems[index]);
                            self.valuesForAPICall.push(apiCallObject);
                        }
                        if (self.valuesForAPICall.length > 0) {
                            self.setSourceIdentity(self.valuesForAPICall);
                        }
                    } else {
                        self.setSourceIdentity("");
                    }

                    MultiSelectCellEditorView.prototype.updateModel.apply(self,[e]);
                });
        },


        getSelectedIds : function(){

            var idArr = [],
                sourceIdsArr = this.getSourceIdentities();
            
            if(sourceIdsArr == undefined || sourceIdsArr == null) return idArr;    
            var len  = sourceIdsArr.length;

            if (len) {
               for (var i=0; i<len; i++) {
                  idArr.push(sourceIdsArr[i]);
               }
            } else {
               idArr.push(sourceIdsArr);
            }

            return idArr;
        },        

        addNewSrcId: function(e) {
            var sourceIdentityFormView = new SourceIdentityFormView({
                'policyObj': this.policyObj,
                'save': _.bind(this.updateSourceIdentity, this),
                'close': _.bind(this.closeSourceIdentityFormOverlay, this),
                'context': this.context,
                'model': this.sourceIdentityModel
            });
            this.sourceIdentityFormOverlay = new OverlayWidget({
                view: sourceIdentityFormView,
                type: 'small',
                showScrollbar: true
            });

            this.sourceIdentityFormOverlay.build();            
        },

        updateSourceIdentity: function(e) {
            var data = new Object({name: this.sourceIdentityModel.get("srcIdentity").name});
            this.updateNewValueInList(Slipstream.SDK.BaseActivity.RESULT_OK, data);
            this.closeSourceIdentityFormOverlay(e);
        },

        getSourceIdentities :function(){
            return this.model.get("sourceidentities")["sourceidentity"];
        },

        setSourceIdentity :function(sourceIdsArr){
            this.model.set("sourceidentities",{"sourceidentity": sourceIdsArr});
        },

        closeSourceIdentityFormOverlay : function (e) {
            if (this.sourceIdentityFormOverlay) 
                this.sourceIdentityFormOverlay.destroy();
            e && e.preventDefault();
        },

    });

    return SourceIdentityEditorView;
});