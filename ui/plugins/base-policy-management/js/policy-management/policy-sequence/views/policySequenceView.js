/**
 * The overlay for policy sequence
 * 
 * @module PolicySequence
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/policySequenceFormConfiguration.js',
    '../conf/policySequenceGridConfiguration.js',
    '../../../../../ui-common/js/views/apiResourceView.js'
], function (Backbone, FormWidget, GridWidget, FormConf, GridConf,ResourceView) {

    var PolicySequenceOverlayView = ResourceView.extend({

        events: {
            'click #policy-sequence-overlay-close': "closeHandler",
            'click #policy-sequence-overlay-ok': "okHandler"
        },

        closeHandler: function(event) {
            event.preventDefault();
            this.collection.reset();
            this.parentView.overlay.destroy();
        },

        okHandler: function(event) {
            var self = this;
            if(!this.isValidForm()){
                return;
            }
            if(self.formMode === self.MODE_CREATE || self.formMode === self.MODE_PROMOTE_TO_GROUP) { 
                self.policyRecord.id = 0;
            }
            var seqNo = self.latestPolSequence,
                policyOrder = self.policyRecord['policy-order'];
         
            this.parentView.setPolicySequenceOrder(seqNo,policyOrder);
            this.collection.reset();
            event.preventDefault();
            this.parentView.overlay.destroy();
        },

        /*
        *   Returns the policy order required for the given sequence number
        */
        getCorrectedPolicyOrder : function(seqNo) {
            var self = this;
            var polOrderRec = self.collection.findWhere({'sequence-number':parseInt(seqNo)});
            var policyOrder = self.policyRecord['policy-order'];
            var firstSeq = parseInt(self.collection.at(0).get('sequence-number'));
            if(polOrderRec) {
                if(parseInt(policyOrder) <= parseInt(polOrderRec.get('policy-order'))) {
                    var nextRec = self.collection.findWhere({'sequence-number':parseInt(seqNo)+1});
                    policyOrder = (nextRec && !nextRec.isGlobalPolicy() && self.sameDomainId(nextRec))?nextRec.get('policy-order'):null;
                } else {    
                    policyOrder = polOrderRec.get('policy-order');
                }    
            }
            else {
                if(self.policyRecord["policy-position"] === "POST" && 
                   seqNo && seqNo <= firstSeq) {
                    policyOrder = self.collection.at(0).get('policy-order');
                }
                else {
                    policyOrder = null;
                }
            }
            return policyOrder;        
        },
        /*
         * Returns true if the policy record has the same domain id as that of current policy
         */
        sameDomainId : function(polRecord) {
            return (polRecord.get('domain-id') == this.policyRecord['domain-id']);
        },
        isValidForm : function() {
            var policyGridError = this.$el.find(".grid-widget .ui-jqgrid .error");
            if(policyGridError && policyGridError.length>0) {
                return false;
            }
            return true;
        },

        isValidSequenceNumber : function(seqNo){
            return (this.isValidMinSequence(seqNo,false) && this.isValidMaxSequence(seqNo,false));
        },

        /*
          Checks if the sequence number is greater than or equal to minimum seq number.
          hardBind is a boolean, if true, checks for greater than minimum seq number.
        */
        isValidMinSequence : function(currentSequenceNo,hardBind) {
            var collection = this.collection,
                globalPolicySeq = collection.getGlobalPolicySeqNo();
            
            var minSeqNo = 1;
            if(this.policyRecord["policy-position"] === "POST") {
                minSeqNo = parseInt(collection.at(0).get('sequence-number'));
            } 
            if(globalPolicySeq == 1) {
                minSeqNo = globalPolicySeq + 1;
            } 
            currentSequenceNo = parseInt(currentSequenceNo);
            if(hardBind) {
                currentSequenceNo = currentSequenceNo-1;
            }
            if(currentSequenceNo < minSeqNo){
                return false;
            }
            if(!this.isDomainValid(currentSequenceNo,collection)) {
               return false;
            }
            return true;
        },

        /*
          Checks if the sequence number is less than or equal to max seq number.
          hardBind is a boolean, if true, checks for less than max seq number.
        */
        isValidMaxSequence : function(currentSequenceNo,hardBind) {
           var collection = this.collection,
               totalCount = this.collection.length,
               globalPolicySeq = collection.getGlobalPolicySeqNo();

           var maxSeqNo = totalCount;
           if(this.policyRecord["policy-position"] === "POST") {
               maxSeqNo = parseInt(collection.at(totalCount-1).get('sequence-number'));
           } 
           if(globalPolicySeq != -1 && globalPolicySeq != 1) {
               maxSeqNo = globalPolicySeq - 1;
           } 
           currentSequenceNo = parseInt(currentSequenceNo);  
           if(hardBind) {
                currentSequenceNo = currentSequenceNo+1;
           }         
           if(currentSequenceNo > maxSeqNo){
               return false;
           } 
           if(!this.isDomainValid(currentSequenceNo,collection)) {
               return false;
           }
           return true;
        },

        /*
         * Policy can't have a sequence number of a record whose domain-id varies from the current policy
         * This method validates the domain-id check
         */   
        isDomainValid : function(seqNo,collection) {
            var currentRecord = collection.findWhere({'sequence-number' : seqNo});
            if(currentRecord && !this.sameDomainId(currentRecord)) {
                return false;
            }
            return true;
        }, 

        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.policyRecord = options.policyRecord;
            this.params = options.params;
            this.collection = options.collection;
            this.collection.comparator = function(model) {
                return model.get('sequence-number');
            };
            this.formMode = options.formMode;
            this.actionEvents = {
                movePolicyUpEvent:"movePolicyUpEvent",
                movePolicyDownEvent:"movePolicyDownEvent"
            };
            this.bindModelEvents();
            this.bindGridEvents();
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConf(this.context);
            var formElements = formConfiguration.getValues();

            formElements.title = formElements.title + ' - ' + this.policyRecord.name;
            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();
            this.addGridWidget();
            return this;
        },

        addGridWidget: function() {
            var gridContainer = this.$el.find('#policy-sequence-overlay-form').children().eq(1),
                gridConf = null,self=this;
            gridContainer.empty();
          
            gridConf = new GridConf(this.context,this.policyRecord);

            var gridElements = gridConf.getValues();
            var urlFilter;
            if(this.policyRecord)
            {
                if(this.policyRecord["policy-position"] == "PRE") {
                    urlFilter = "policyOrder lt 0";
                }
                else {
                    urlFilter = "policyOrder gt 0";
                }
            }

            var onFetch = function(collection, response, options) {
               console.log("succeeded");
               self.collection.trigger('fetchComplete', collection, response, options);
            };

            var filterSearchSortOptions = {FILTER : urlFilter};

            this.collection.fetch({
                url :self.collection.url(), 
                success: onFetch,
                filterSearchSortOptions:filterSearchSortOptions
            });

            gridElements.ajaxOptions = {
                headers: {
                    "Accept": this.params.policyAcceptHeader
                }
            };

            gridElements.actionButtons.actionStatusCallback = $.proxy(this.setCustomActionStatus,this);

            this.gridElements = gridElements;
            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridElements,
                actionEvents:this.actionEvents
            });
            $.when(self.gridWidget.build()).done(function(response) {
                self.gridWidgetObject = response;
            });
        },

        /* 
         * Custom action status for the disabling/enabling of custom buttons
         */
        setCustomActionStatus : function(selectedRows, updateStatusSuccess, updateStatusError) {
            var isMoveUpEnabled, isMoveDownEnabled;
            if(selectedRows.numberOfSelectedRows != 1) {
               isMoveUpEnabled = false;
               isMoveDownEnabled = false;
            } else {
               var currentSequenceNo = parseInt(selectedRows.selectedRows[0]['sequence-number']);     
               isMoveUpEnabled = this.isValidMinSequence(currentSequenceNo,true);
               isMoveDownEnabled = this.isValidMaxSequence(currentSequenceNo,true);
            }
            updateStatusSuccess({
                "movePolicyUpEvent": isMoveUpEnabled,
                "movePolicyDownEvent": isMoveDownEnabled
            });
        },

        bindModelEvents : function() {
          var self = this;
          self.collection.unbind('fetchComplete');
          self.collection.bind('fetchComplete', function (collection, response, options) {
            self.reOrderCollection();
          });
        },

        /*
         * Re-orders the collection based on the new sequence number and policy order and puts the record
         * in the correct place for rendering in the grid.
         */
        reOrderCollection : function() {
            var self = this,
                collection = self.collection,
                totalCount = collection.length;
            var lastRec = totalCount>0 ? collection.at(totalCount-1):null;
            var currentPolicyOrder = self.policyRecord["policy-order"],
                recordToRemove = collection.get(self.policyRecord['id']),
                seqNo = totalCount+1,
                firstSeq;

            if(totalCount > 0) {
                firstSeq = collection.at(0).get('sequence-number');
                seqNo = parseInt(lastRec.get('sequence-number'))+1;
            }
            var indexOfLastDomain = self.getIndexOfLastDomain();

            //Handling Create Policy - edit policy sequence for the first time
            if((!currentPolicyOrder) && 
               (!recordToRemove) && 
               (self.formMode !== self.MODE_EDIT || self.policyRecord["isPolicyPositionChanged"])) {
                
                //If policy position is 'Post', then policy should be inserted in the last position of its domain-id.
                if(self.policyRecord['policy-position'] === "POST" && 
                   indexOfLastDomain != -1) {
                    seqNo = collection.at(indexOfLastDomain).get('sequence-number');
                    self.policyRecord['sequence-number']=seqNo;                    
                    collection.add(self.policyRecord,{at:indexOfLastDomain});
                    self.resetPolicySequence(firstSeq);
                } else {
                    self.policyRecord['sequence-number']=seqNo;
                    collection.push(self.policyRecord);
                }
                self.latestPolSequence = seqNo;    
            }

            //Handling Edit Policy - edit policy sequence and Create Policy - edit policy sequence
            if(currentPolicyOrder || recordToRemove) {
                var polRecordOrder = collection.findWhere({'policy-order':currentPolicyOrder}),
                    indexToInsert = totalCount - 1;
                if(recordToRemove) {
                    collection.remove(recordToRemove);
                    self.resetPolicySequence(firstSeq);
                }
                if(polRecordOrder) {
                    indexToInsert = polRecordOrder.get('sequence-number') - firstSeq;
                    collection.add(self.policyRecord,{at:indexToInsert});
                }
                else {
                    indexOfLastDomain = self.getIndexOfLastDomain();
                    if(self.policyRecord['policy-position'] === "POST" && indexOfLastDomain != -1) {
                        collection.add(self.policyRecord,{at:indexOfLastDomain});
                        indexToInsert = indexOfLastDomain;
                    } else {
                        collection.push(self.policyRecord);
                    }    
                }
                self.resetPolicySequence(firstSeq);
                self.latestPolSequence = collection.at(indexToInsert).get('sequence-number');
            }
            self.refreshPolicyGrid(1,1);
            collection.resetCollection = true;
        },

        /*
         * Returns the index of the last domain policy which matches with the current policy.
         * If not applicable, returns -1.
         * If last domain policy is the last policy in the collection, returns -1.
         */
        getIndexOfLastDomain : function() {
           var self = this,
               noDomainDifference=0,
               collection = self.collection,
               totalCount = collection.length,
               lastRec = totalCount>0 ? collection.at(totalCount-1):null;
            for(var i=0;i<totalCount;i++) {
                if(!self.sameDomainId(collection.at(i))) {
                    break;
                }
            }
            noDomainDifference = ((i == totalCount)?1:0);
            if(noDomainDifference && lastRec && lastRec.isGlobalPolicy()) {
                i = totalCount-1;
                return i;
            }
            if(!noDomainDifference) {
                return i;
            } 
            return -1;           
        },

        /*
         * Resets the sequence numbers of all the records in the collection in order.
         */
        resetPolicySequence : function(firstSeq) {
            var length = this.collection.length;
            for (var i=0;i<length;i++) {
                this.collection.at(i).set('sequence-number',firstSeq+i);
            }
        },

        /*
         * Refreshes the policy sequence grid with the updated collection and 
         * renders the rows in disabled or enabled mode.
         */
        refreshPolicyGrid : function(page,totalPages) {
            var self = this,
                gridTable = $('#'+self.gridElements.tableId),
                policies = _.pluck(self.collection.toJSON(), 'policy'),
                gridWidgetObject = self.gridWidgetObject,
                totalCount = policies.length;

            var firstSequence = totalCount > 0? policies[0]['sequence-number']: 1;
            var indexOfRecord = self.latestPolSequence - firstSequence;

            gridTable.jqGrid('clearGridData');
            gridWidgetObject.addPageRows(policies, {
              numberOfPage: page,
              totalPages: totalPages,
              totalRecords: totalCount
            });
            var ids = gridTable.jqGrid('getDataIDs');
            for(var i = 0;i<totalCount;i++) {
                if(i !== indexOfRecord) {
                    gridTable.find("#" + ids[i]).attr("class", "rowDisabled");
                    gridTable.find("#" + ids[i]).find(":input").attr("disabled", true);
                }
                else {
                    gridWidgetObject.addEditModeOnRow(ids[i]);
                    gridWidgetObject.toggleRowSelection(ids[i],'selected');
                }
            }
        },
        bindGridEvents: function () {
            var self = this;
               this.$el
                .bind(this.actionEvents.movePolicyUpEvent, function(eventName, selectedItems){
                    if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
                        return;
                    }
                    var currPolicySequence = parseInt(selectedItems.selectedRows[0]['sequence-number']);
                    var policyPrev = self.collection.findWhere({'sequence-number' : currPolicySequence - 1});
                    var currentPolicy = self.collection.findWhere({'sequence-number':currPolicySequence});
                    if(policyPrev) {
                        policyPrev.set('sequence-number', currPolicySequence);
                        currentPolicy.set('sequence-number',currPolicySequence - 1);
                        currentPolicy.set('policy-order', policyPrev.get('policy-order'));
                        self.policyRecord['sequence-number'] = currPolicySequence - 1;
                        self.policyRecord['policy-order'] = policyPrev.get('policy-order');
                        self.latestPolSequence = currPolicySequence - 1;
                        self.collection.sort();
                        self.refreshPolicyGrid(1,1);
                    }
                })
                .bind(this.actionEvents.movePolicyDownEvent, function(eventName, selectedItems){
                    if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
                        return;
                    }
                    var currPolicySequence = parseInt(selectedItems.selectedRows[0]['sequence-number']);
                    var policyNext = self.collection.findWhere({'sequence-number' : currPolicySequence + 1});
                    var currentPolicy = self.collection.findWhere({'sequence-number':currPolicySequence});
                    var policyNextNext = self.collection.findWhere({'sequence-number' : currPolicySequence + 2});
                    if(policyNext) {
                        policyNext.set('sequence-number', currPolicySequence);
                        currentPolicy.set('sequence-number',currPolicySequence + 1);
                        self.policyRecord['sequence-number'] = currPolicySequence + 1;
                        self.latestPolSequence = currPolicySequence + 1;
                        if(policyNextNext && !policyNextNext.isGlobalPolicy() && 
                           self.sameDomainId(policyNextNext)) {
                            currentPolicy.set('policy-order', policyNextNext.get('policy-order'));
                            self.policyRecord['policy-order'] = policyNextNext.get('policy-order');
                        }
                        else {
                            currentPolicy.set('policy-order', null);
                            self.policyRecord['policy-order'] = null;
                        }    
                        self.collection.sort();
                        self.refreshPolicyGrid(1,1);
                    }
                })
                .bind('postSequenceValidation', function(e, isValid){
                    var element = $(e.target);
                    if(!isValid) {
                        element.siblings().css("display","block");
                        return;
                    }
                    var value = e.target.value;
                    if(!self.isValidSequenceNumber(value)) {
                        element.parent().append("<small class=\"error errorimage\">"+self.context.getMessage('grid_column_seq_error')+"</small>");
                        element.siblings().css("display","block");
                    }
                    else {
                        element.parent().find('.error').remove();
                        //If valid sequence number, then re-arrange the collection after editing.
                        if(value != self.latestPolSequence) {
                            self.policyRecord['sequence-number'] = value;
                            self.policyRecord['policy-order'] = self.getCorrectedPolicyOrder(value);
                            self.reOrderCollection();
                        }
                    }
                });
        }
    });

    return PolicySequenceOverlayView;
});