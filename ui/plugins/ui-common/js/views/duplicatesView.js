/**
 * View to show duplicate groups
 *
 * @module DuplicatesView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
        'backbone',
        'widgets/form/formWidget',
        'widgets/grid/gridWidget',
        'widgets/overlay/overlayWidget',
        './duplicatesMergeView.js',
        '../conf/duplicatesFormConfiguration.js',
        '../util/gridUtility.js'
], function (Backbone, FormWidget, GridWidget, OverlayWidget, MergeView, FormConf, GridUtility) {

    // return true if the context item should be disabled; return false if the context item should be enabled
    var setItemStatus = function (key, isItemDisabled, selectedRows){
        // Single row selection for"find usage"
        if (key == 'findUsageEvent'){
            if (selectedRows.length !== 1){
                return true;
            }
        }
        // Default objects can't be edit, delete and clone
        if (key== 'delete'){
            // check whether default object is included in selected items
            for (var i=0; i<selectedRows.length; i++) {
                if ('PREDEFINED' == selectedRows[i]['definition-type']){
                    return true;
                }
            }
        }
        // Multiple rows selection for "merge"
        if (key == 'mergeEvent'){
            if (selectedRows.length < 2){
                return true;
            }
            // check whether default object is included in selected items
            for (var i=0; i<selectedRows.length; i++) {
                if ('PREDEFINED' == selectedRows[i]['definition-type']){
                    return true;
                }
            }
        }
        return isItemDisabled;
    };

    var setButtonStatus = function (selectedRows, updateStatusSuccess, updateStatusError){
        var selectedRows = selectedRows.selectedRows,
            enableDelete = true;
        // check whether default object is included in selected items
        for (var i=0; i<selectedRows.length; i++) {
            if ('PREDEFINED' == selectedRows[i]['definition-type']){
                enableDelete = false;
                break;
            }
        }
        updateStatusSuccess({
            "delete": enableDelete
        });
    };

    var deleteRow = function(selectedRows, success, error) {
        var selectedObjs = selectedRows.selectedRows;
        var selectedRowIds = selectedRows.selectedRowIds;
        var isSelectAll = selectedRows.allRowIds ? true : false;
        var allRowIds = selectedRows.allRowIds;
        this.startDeleteActivity(selectedObjs,isSelectAll,allRowIds, selectedRowIds);
    };

    var DuplicatesView = Backbone.View.extend({

        events: {
            'click #duplicate-groups-close': "closeView"
        },

        closeView: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.activity.overlay.destroy();
        },

        close: function() {
            var currentView = this.views ? this.views.contentView.view : this;
            currentView.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
            currentView.activity.finish();

            // If merge or delete operation is done, need to reload the landing page
            if(currentView.isMergeDone || currentView.isDeleteDone) {
                var currentMimeType = currentView.activity.intent.data.mime_type;
                var newIntent = new Slipstream.SDK.Intent("slipstream.intent.action.ACTION_LIST", {
                    mime_type: currentMimeType
                });
                Slipstream.vent.trigger("activity:start", newIntent);
            }
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.gridConf = options.gridConf;
            this.objectType = this.gridConf.objectType;
            this.mergeModel = options.mergeModel;
            this.mergeRbac = options.mergeRbac;
            this.deleteRbac = options.deleteRbac;
            this.actionEvents = {
                deleteEvent: {name: "deleteRecords", capabilities: this.deleteRbac},
                mergeEvent: {name: "mergeRecords", capabilities: this.mergeRbac},
                findUsageEvent:"findUsageForRecord"
            };
            this.selectedGroupHashkey = '';
            this.bindGridEvents();
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();
            this.addGridWidget();
            this.$el.addClass("security-management");

            return this;
        },

        addGridWidget: function() {
            var gridElements = this.gridConf.getValues();
                gridContainer = this.$el.find('#duplicate-groups-list').children().eq(0);
            gridContainer.empty();
            gridElements.contextMenuItemStatus = setItemStatus;
            // Set status for edit&delete buttons
            gridElements.actionButtons = gridElements.actionButtons || {};
            gridElements.actionButtons.customButtons = gridElements.actionButtons.customButtons || [];
            gridElements.actionButtons.actionStatusCallback = gridElements.actionButtons.actionStatusCallback || setButtonStatus;

            gridElements.deleteRow  = {
                    "onDelete": $.proxy(deleteRow,this)
            };

            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements,
                actionEvents:this.actionEvents
            });
            this.gridWidget.build();
        },

        startDeleteActivity: function(selectedRows, isSelectAll, allRowIds, selectedRowIds) {
            var self = this;
            var currentMimeType = self.activity.intent.data.mime_type;
            var newIntent = new Slipstream.SDK.Intent("sd.intent.action.ACTION_DELETE", {
              mime_type: currentMimeType
            });

            var extras = {
                selectedRows: selectedRows,
                onDeleteSuccess: ($.proxy(self.onDeleteSuccess,self)),
                onDeleteError: function(XMLHttpRequest, textStatus, errorThrown) {
                  self.onDeleteError(XMLHttpRequest, textStatus, errorThrown,selectedRowIds, selectedRows);
                }
            };
            if (isSelectAll) {
                _.extend(extras, {
                    isSelectAll: isSelectAll,
                    allRowIds: allRowIds
                });
            }
            newIntent.putExtras(extras);
            this.gridWidget.toggleRowSelection(selectedRowIds);
            Slipstream.vent.trigger("activity:start", newIntent);
        },

        onDeleteSuccess : function(data){
            var self = this;
            this.gridWidget.reloadGrid({resetSelection: true});
            self.notify('success', self.context.getMessage("delete_success"));
        }, 

        onDeleteError : function(XMLHttpRequest, textStatus, errorThrown, selectedRowIds, selectedRows) {
            var self=this,
                gridUtility = new GridUtility();

            if (XMLHttpRequest && selectedRows)
            {
                self.gridWidget.toggleRowSelection(selectedRowIds);
                var response = JSON.parse(XMLHttpRequest.responseText);
                            if (response && "USED_DELETE" == response.title) {
                gridUtility.showDeleteReferenceError(response,self.context);
            } else {
                var errorMsg = gridUtility.getDeleteErrorMsg(response.failedObjectId, selectedRows, self.context);
                gridUtility.showDeleteErrMsg(errorMsg, self.context);
            }
          }
          self.gridWidget.reloadGrid({resetSelection: true});
          console.log("failed delete");
        }, 

        bindGridEvents: function () {
            var self = this;

           this.$el
                .bind(this.actionEvents.mergeEvent.name, function(e, selectedRows){
                    var view = new MergeView({
                        'parentView': self,
                        'data': selectedRows,
                        'mergeModel': self.mergeModel,
                        'objectType': self.objectType
                    });
                    self.showOverlay(view);
                })
                .bind(this.actionEvents.findUsageEvent, function(e, selectedRows){
                    self.activity.overlay.destroy();
                    self.activity.onFindUsageEvent(e, selectedRows);
                })
                .bind("gridOnRowSelection", function(e, selectedRows){
                    var currentRow = selectedRows.currentRow,
                        allSelectedRows = self.gridWidget.getSelectedRows(),
                        lengthOfSelectedRows = allSelectedRows.length,
                        selectInDifferentGroup = false,
                        existingRowIdArr = [];
                    if(currentRow.selected){
                        if(lengthOfSelectedRows === 1){
                            // Save the hash-key of the first selected object
                            self.selectedGroupHashkey = allSelectedRows[0]['hash-key'];
                        }else{
                            // Check if user selects an object in other group
                            for (var i = 0; i < allSelectedRows.length; i++) {
                                var groupHashkey = allSelectedRows[i]['id'];
                                if(currentRow.rowId === allSelectedRows[i]['id']){
                                    if(allSelectedRows[i]['hash-key'] !== self.selectedGroupHashkey){
                                        selectInDifferentGroup = true;
                                        self.selectedGroupHashkey = allSelectedRows[i]['hash-key'];
                                    }
                                }else{
                                    existingRowIdArr.push(allSelectedRows[i].id);
                                }
                            }
                            // If user selects an object in other group, remove the current selected ones.
                            if(selectInDifferentGroup){
                                self.gridWidget.toggleRowSelection(existingRowIdArr);
                            }
                        }
                    }
                });
        },

        showOverlay: function(view, size) {
            this.overlay = new OverlayWidget({
                view: view,
                type: size || 'medium',
                showScrollbar: true
            });
            this.overlay.build();
        },

        /**
         *  Helper method to display a toast/non-persistent notification
         */
        notify: function(type, message) {
            new Slipstream.SDK.Notification()
                .setText(message)
                .setType(type)
                .notify();
        }
    });

    return DuplicatesView;
});