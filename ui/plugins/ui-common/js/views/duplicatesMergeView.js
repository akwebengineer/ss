/**
 * The overlay for merging duplicated group
 * 
 * @module DuplicatesMergeView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/dropDown/dropDownWidget',
    'widgets/overlay/overlayWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../../ui-common/js/models/objectReferenceCollection.js',
    '../../../ui-common/js/common/widgets/progressBarForm.js',
    '../conf/duplicatesMergeFormConfiguration.js',
    'text!../templates/duplicatesMergeResultTemplate.html'
], function (Backbone, Syphon, FormWidget, DropDownWidget, OverlayWidget, ConfirmationDialog, ObjectReferenceCollection, progressBarForm, FormConf, MergeResultTemplate) {

    var DuplicatesMergeView = Backbone.View.extend({

        events: {
            'click #duplicate-groups-merge-save': "submit",
            'click #duplicate-groups-merge-cancel': "cancel"
        },

        cancel: function(event) {
            event.preventDefault();
            this.parentView.overlay.destroy();
        },

        submit: function(event) {

            event.preventDefault();

            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }
            this.parentView.overlay.destroy();
            this.validateMergeObject();
        },

        mergeDuplicateObjects: function() {
            var self = this,
                properties = Syphon.serialize(this);
            this.mergeModel.clear();
            // set request body
            this.mergeModel.set({
                "merge-request":{
                    "hash-key": this.hashKey,
                    "name": properties['duplicate-groups-merge-name'][0],
                    "description": properties['description'],
                    "is-group-merge":"false",
                    "ids": this.selectedRowIds
                }
            });

            this.mergeModel.save( null, {
                success: function(model, response) {
                    self.progressBarOverlay.destroy();
                    var count = response.merges['merge-response'][0]['merged-object-count'];
                    self.parentView.notify('success', self.context.getMessage('duplicate_groups_merge_complete_text', [count]));

                    // Reload duplicated groups
                    self.parentView.gridWidget.reloadGrid({resetSelection: true});
                    self.parentView.isMergeDone = true;
                },
                error: function(model, response) {
                    var result = response ? response.responseText : "";
                    if (typeof result === "string" && result.match("Failed to acquire lock")) {
                        var msg = self.context.getMessage("replace_merge_fail_obj_locked", [self.context.getMessage("action_merge")]);
                        self.parentView.notify("error", msg);
                    } 
                    console.log("merge error:" + response);
                    self.progressBarOverlay.destroy();
                }
            });
            this.showProgressBar();
        },

        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.selectedRows = options.data.selectedRows;
            this.selectedRowIds = options.data.selectedRowIds
            this.mergeModel = options.mergeModel;
            this.objectType = options.objectType;
            this.hashKey = null;
            this.selectedRowNamesAndDescriptions = [];
            this.objectReferenceCollection = new ObjectReferenceCollection();
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);
            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();
            this.$el.addClass("security-management");
            this.showNameDropDownWidget();
            return this;
        },

        addDynamicFormConfig: function(formElements) {
            var objectType = this.context.getMessage(this.objectType);
            formElements.title = this.context.getMessage("duplicate_groups_merge_title", [objectType]);
        },

        showNameDropDownWidget: function() {
            var self = this;
            var dropDownContainer = this.$el.find('#duplicate-groups-merge-name');
            var optionList = this.getDropDownData();
            // Config for Multi-select Drop Down Widget
            this.dropDown = new DropDownWidget({
                "container": dropDownContainer,
                "data": JSON.stringify(optionList),
                "placeholder": this.context.getMessage('duplicate_groups_merge_name_placeholder'),
                "multipleSelection": {
                    maximumSelectionLength: 1,
                    createTags: true,
                    allowClearSelection: true
                },
                "onChange": function(event) {
                    var descriptionArea = self.$el.find('#duplicate-groups-merge-description');
                    // Set value for description area
                    if($(this).val() && $(this).val().length > 0){
                        var name = $(this).val()[0];
                        $.each(self.selectedRowNamesAndDescriptions, function(index, param) {
                            if(param.name === name){
                                descriptionArea.val(param.description);
                            }
                        });
                    }else{
                        descriptionArea.val('');
                    }
                }
            });
            this.dropDown.build();
            // Workaroud: Hide the previous dropdown in the form widget and adjust the width
            dropDownContainer.hide();
            this.$el.find(".dropdown-widget").find(".select2").addClass("elementinput").removeAttr("style");
        },

        getDropDownData: function() {
            var self = this,
                optionList = [],
                items = this.selectedRows;
            if (items && $.isArray(items)) {
                items.forEach(function(item) {
                    var name = $(item.displayName).text(),
                        description = item.description;
                    self.selectedRowNamesAndDescriptions.push({'name': name, 'description': description});
                    optionList.push({
                        'id': name,
                        'text': name
                    });
                    if(! self.hashKey){
                        self.hashKey = item['hash-key'];
                    }
                });
            }
            return optionList;
        },

        showProgressBar: function() {
            this.progressBar = new progressBarForm({
                statusText: this.context.getMessage('duplicate_groups_merge_progress_bar_overlay_text'),
                title: this.context.getMessage('duplicate_groups_merge_progress_bar_overlay_title')
            });

            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                showScrollbar: false
            });
            this.progressBarOverlay.build();
        },

        showMergeResult: function(response) {
            var mergedObjectCount = response[0]['merged-object-count'],
                replacedObjectDetail = response[0]['replacement-count-map'],
                note_info = response[0]['status-text'],
                resultMessage = '';
            var data = {
                merge_text: this.context.getMessage('duplicate_groups_merge_text'),
                merge_detail: this.context.getMessage('duplicate_groups_merge_detail', [mergedObjectCount]),
                replace_text: this.context.getMessage('duplicate_groups_replace_text'),
                note_label: this.context.getMessage('note'),
                note_info: note_info
            };
            var reference = [];
            // Current it's returned as a String, for example:  "{Address Group=2, Variable Address=2}"
            // So we need to split it
            if(replacedObjectDetail && replacedObjectDetail.length > 2){
                replacedObjectDetail = replacedObjectDetail.substring(1, replacedObjectDetail.length -1);
                var replaceObjectArr = replacedObjectDetail.split(', ');
                for(var i = 0; i < replaceObjectArr.length; i++){
                    var referArr = replaceObjectArr[i].split('='),
                        referName = referArr[0],
                        referCount = referArr[1];
                    reference.push(referName + '(' + referCount + ')');
                }
                data['replace_exist'] = true;
                data['reference'] = reference.join(', ');
            }
            resultMessage = Slipstream.SDK.Renderer.render(MergeResultTemplate, data);
            var confirmationDialogconf = {
                title: this.context.getMessage('duplicate_groups_merge_result_title'),
                question: resultMessage
            };
            this.createResultConfirmationDialog(confirmationDialogconf);
        },

        validateMergeObject: function() {
            var self = this;
            var urlquery = self.selectedRowIds.join(' OR ');
            var onFetch = function (collection, response, options) {
                var objects = response['response']['results']['result'];
                // There are some reference, show confirmation dialog
                if(objects){
                    var typeNameArr = [];
                    if($.isArray(objects)){
                        for(var i = 0; i < objects.length; i++){
                            var typeName = objects[i].typeName;
                            // If the type hasn't been added
                            if($.inArray(typeName, typeNameArr) === -1){
                                typeNameArr.push(typeName);
                            }
                        }
                    }else{
                        typeNameArr.push(objects.typeName);
                    }
                    var objectTypeText = self.context.getMessage('duplicate_groups_merge_object_type_' + self.objectType),
                        referObjectsText = typeNameArr.join(', ');
                    var confirmMessage = self.context.getMessage('duplicate_groups_merge_validation_text', [objectTypeText, referObjectsText])
                            + '<br/>' + self.context.getMessage('duplicate_groups_merge_validation_question');
                    var conf = {
                        title: self.context.getMessage('duplicate_groups_merge_validation_title'),
                        question: confirmMessage,
                        yesEvent: function() {
                            self.validationConfirmationDialogWidget.destroy();
                            self.mergeDuplicateObjects();
                        }
                    };
                    self.createValidationConfirmationDialog(conf);
                }else{
                    self.mergeDuplicateObjects();
                }
            };
            var onError = function(collection, response, options) {
                console.log('reference not fetched');
            };
            self.objectReferenceCollection.fetch({
                url: self.objectReferenceCollection.url(urlquery),
                success: onFetch,
                error: onError
            });
        },

        createResultConfirmationDialog: function(option) {
            var self = this;

            this.resultconfirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: this.context.getMessage( 'ok'),
                yesButtonCallback: function() {
                    self.resultconfirmationDialogWidget.destroy();
                },
                yesButtonTrigger: 'yesEventTriggered',
                xIcon: false
            });

            this.resultconfirmationDialogWidget.build();
        },

        createValidationConfirmationDialog: function(option) {
            var self = this;

            this.validationConfirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: self.context.getMessage('ok'),
                noButtonLabel: self.context.getMessage('no'),
                noButtonCallback: function() {
                    self.validationConfirmationDialogWidget.destroy();
                },
                yesButtonTrigger: 'yesEventTriggered',
                xIcon: false
            });

            this.bindValidationConfirmationDialogEvents(option);
            this.validationConfirmationDialogWidget.build();
        },

        bindValidationConfirmationDialogEvents: function(option) {
            this.validationConfirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (option.yesEvent) {
                    option.yesEvent();
                }
            });
        }
    });

    return DuplicatesMergeView;
});
