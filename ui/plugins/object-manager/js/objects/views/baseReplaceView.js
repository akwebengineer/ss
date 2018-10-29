/**
 * View to replace addresses
 * 
 * @module AddressReplaceView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/overlay/overlayWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../../../ui-common/js/common/widgets/progressBarForm.js',
    '../../../../ui-common/js/models/objectReferenceCollection.js',
    'text!../../../../sd-common/js/templates/replaceResultTemplate.html'
], function (
    Backbone,
    GridWidget,
    OverlayWidget,
    ConfirmationDialog,
    progressBarForm,
    ObjectReferenceCollection,
    ReplaceResultTemplate) {

    var REPLACE_OBJECT_TYPE_ADDRESS = "address";
    var REPLACE_OBJECT_TYPE_SERVICE = "service";

    var AddressReplaceView = Backbone.View.extend({
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.extras = options.extras;
            this.objectReferenceCollection = new ObjectReferenceCollection();
        },

        addGridWidget: function(id, gridConf, tableId) {
            var gridContainer = this.$el.find('#' + id);
            this.$el.find('#' + id).after("<div id='"+id+"'></div>");
            gridContainer.remove();
            gridContainer = this.$el.find('#' + id);

            var elements = gridConf.getValues();
            if (tableId) {
                elements.tableId = tableId;
            }

            var option = {
                container: gridContainer,
                elements: elements
            };
            if (gridConf.getEvents) {
                option.actionEvents = gridConf.getEvents();
            }

            var gridWidget = new GridWidget(option);
            gridWidget.build();

            this.$el.find(".grid-widget").addClass("elementinput-long");

            return gridWidget;
        },

        showProgressBar: function() {
            this.progressBar = new progressBarForm({
                statusText: this.context.getMessage("replace_progress_bar_text"),
                title: this.context.getMessage("replace_progress_bar_overlay_title")
            });

            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                showScrollbar: false
            });
            this.progressBarOverlay.build();
        },
        showReplaceResult: function(response) {
            var mergedObjectCount = response['merged-object-count'],
                replacedObjectDetail = response['replacement-count-map'],
                note_info = response['status-text'],
                resultMessage = '';

            var data = {
                merge_text: this.context.getMessage('replace_complete_text'),
                merge_detail: this.context.getMessage('replace_object_count', [mergedObjectCount]),
                replace_text: this.context.getMessage('replace_result_text'),
                note_label: this.context.getMessage('note'),
                note_info: note_info
            };

            var reference = [];
            // Currently it's returned as a string, for example:  "{Address Group=2, Variable Address=2}"
            // So we need to split it
            if (replacedObjectDetail && replacedObjectDetail.length > 2){
                replacedObjectDetail = replacedObjectDetail.substring(1, replacedObjectDetail.length-1);
                var replaceObjectArr = replacedObjectDetail.split(', ');

                for (var i=0; i<replaceObjectArr.length; i++){
                    var referArr = replaceObjectArr[i].split('='),
                        referName = referArr[0],
                        referCount = referArr[1];

                        reference.push(referName + '(' + referCount + ')');
                }


                data.replace_exist = true;
                data.reference = reference.join(', ');
            }

            resultMessage = Slipstream.SDK.Renderer.render(ReplaceResultTemplate, data);

            var confirmationDialogconf = {
                title: this.context.getMessage('replace_result_title'),
                question: resultMessage
            };

            this.createResultConfirmationDialog(confirmationDialogconf);
        },
        validateReplaceObject: function() {
            var self = this;
            var urlquery = self.selectedRowIds.join(' OR ');
            var onFetch = function (collection, response, options) {
                var objects = response.response.results.result;
                objects = objects || [];
                objects = [].concat(objects);
                // There are some references, show confirmation dialog
                if (objects.length > 0){
                    var typeNameArr = [];
                    for (var i=0; i<objects.length; i++){
                        var typeName = objects[i].typeName;
                        // If the type hasn't been added
                        if($.inArray(typeName, typeNameArr) === -1){
                            typeNameArr.push(typeName);
                        }
                    }

                    var objectTypeText = "";
                    if (self.objectType === REPLACE_OBJECT_TYPE_ADDRESS) {
                        objectTypeText = self.context.getMessage('replace_object_type_address');
                    } else if (self.objectType === REPLACE_OBJECT_TYPE_SERVICE) {
                        objectTypeText = self.context.getMessage('replace_object_type_service');
                    }

                    var referObjectsText = typeNameArr.join(', ');
                    var confirmMessage = self.context.getMessage('replace_validation_text', [objectTypeText, referObjectsText]);
                    var conf = {
                        title: self.context.getMessage('replace_validation_title'),
                        question: confirmMessage,
                        yesEvent: function() {
                            self.replace();
                        }
                    };

                    self.createValidationConfirmationDialog(conf);
                } else {
                    self.replace();
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
        replace: function() {
            var self = this;
            var replaceWithId = this.$el.find("#"+this.selectionFieldId).attr("dataId");

            this.replaceModel.clear();
            // set request body
            this.replaceModel.set({
                "replace-request":{
                    "replace-with-id": replaceWithId,
                    "to-replace-ids": this.selectedRowIds
                }
            });

            this.replaceModel.save(null, {
                success: function(model, response) {
                    self.progressBarOverlay.destroy();
                    var count = response.replaces['replace-response'][0]["merged-object-count"],
                        message = self.context.getMessage("replace_success_text", [count]);
                    if (count == 1) {
                        message = self.context.getMessage("replace_success_text_single");
                    }
                    self.activity.getView().notify("success", message);
                },
                error: function(model, response) {
                    // response looks like  "Failed to acquire lock : {policy-1=POLICY},{nat-1=NAT}"
                    var result = response ? response.responseText : "";
                    if (typeof result === "string" && result.match("Failed to acquire lock")) {
                        var msg = self.context.getMessage("replace_merge_fail_obj_locked", [self.context.getMessage("action_replace")]);
                        self.activity.getView().notify("error", msg);
                    }
                    console.log("error:" + response);
                    self.progressBarOverlay.destroy();
                }
            });
            this.showProgressBar();
            this.activity.finish();
            this.activity.overlay.destroy();
        },
        createResultConfirmationDialog: function(option) {
            var self = this;

            this.resultconfirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: self.context.getMessage('ok'),
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
                yesButtonCallback: function() {
                    self.validationConfirmationDialogWidget.destroy();
                },
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

    return AddressReplaceView;
});