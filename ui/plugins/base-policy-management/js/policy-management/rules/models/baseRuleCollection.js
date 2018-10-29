/**
 * A Backbone Collection to be used by the Rule grids for rules model.
 *
 * @module ruleCollection
 * @author mbetala
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceCollection.js',
  'widgets/overlay/overlayWidget', 
  '../views/pasteRuleMessageFormView.js'
], function (BaseCollection,OverlayWidget,PasteMessageFormView) {

  /**
   * FirewallRules Collection definition.
   */
  var RuleCollection = BaseCollection.extend({

    resetCollection: false,

    /**
     * set by the extending classes
     */
    model: undefined,
    /**RuleCollection.js
     * id of the policy to be working on
     *
     */
    policyID: undefined,
    /**
     * policy object
     */
    policy: undefined,

    /**
     * this is set by extending classes
     */
    policyManagementConstants: undefined,

    /*
    * flag to be set when the collection is modified
    */
    isDirty:false,

    /*flag to check if rules are copied. Used for enabling the paste context menu*/
    hasCopiedRules:false,

    /*Flag to check if policy save is in progress*/
    savePolicyInProgress: false,

    /*Flag to check if policy is read-only*/
    isPolicyReadOnlyFlag : false,

    /*Flag to check if Save comments is enable*/
    isSaveCommentsEnabledFlag :false,


    /**
     *
     * url
     */
    url: function() {
      var me = this;
      return me.policyManagementConstants.POLICY_URL  + this.policyID;
    },

    setCollectionDirty : function(value){
      var fireIsDirtyEvent = value === true && value !== this.isDirty;
      this.isDirty = value;
      if (fireIsDirtyEvent) {
      //fire this only once
        this.trigger('rule-collection-dirty');
      }
    },

    isCollectionDirty: function() {
      return this.isDirty === true;
    },

    isGroupPolicy: function() {
      var me = this, policy = me.policy;
      return policy? policy['policy-type'] === 'GROUP' : false;
    },

    setSavePolicyInProgress : function(value){
      this.savePolicyInProgress = value;
    },

    isSavePolicyInProgress : function(){
      return this.savePolicyInProgress;
    },

    setPolicyReadOnly : function(value){
      this.isPolicyReadOnlyFlag = value;
    },

    isSameDomainPolicy: function () {
      return Juniper.sm.DomainProvider.isCurrentDomain(this.policy['domain-id']);
    },

    isPolicyReadOnly : function(){
      return this.isPolicyReadOnlyFlag || !this.isSameDomainPolicy();
    },

    setSaveCommentsEnabled : function(value){
      return this.isSaveCommentsEnabledFlag;
    },

    isSaveCommentsEnabled : function(){
      return this.isSaveCommentsEnabledFlag;
    },

    initialize: function (cuid, policy,context) {
      var me = this;
      me.policyID = policy.id;
      me.cuid = cuid;
      me.policy=policy;
      me.context=context;
      me.bind('change', function() {
        me.setCollectionDirty(true);
      });
      if(me.hasSaveCommnets()){
        me.fetchSaveCommentSettings();
      }
      BaseCollection.prototype.initialize.call(me, {
        jsonRoot: 'ruleCollection.rules',
        accept: me.policyManagementConstants.RULE_ACCEPT_HEADER,
        contentType: me.policyManagementConstants.RULE_CONTENT_HEADER
      });
    },

    /**
     * sync callback: before any ReST call
     * @param {String} method -  read (for GET)
     * @param {Object} collection -  backbone collection being used for call
     * @options {Object} - internal options being used by Backbone
     */
    sync: function(method, collection, options) {
      var me = this;
      console.log(options);
      var cuidString = "cuid=" + me.cuid;
      if (options.url.indexOf("?") > 0) {
        options.url = options.url + "&" + cuidString;
      } else {
        options.url = options.url + "?" + cuidString;
      }
      return BaseCollection.prototype.sync.apply(this, arguments);
    },


    //fetch method used to fetch multiple pages at a time
    fetch: function (options) {
        options = options || {};
        var me = this, success = options.success, page = options.page,
        numberOfPages = options.page === 1 ? 2 : 3;

        options.reset = options.reset || me.resetCollection || page === 1;
        options.remove = options.reset || me.resetCollection || page === 1;
        options.success = function(collection, response, callOptions) {
            console.log("Fetched data for page " + options.page);
            var baseCount;
            if(page === 1) {
                baseCount = me.policyManagementConstants.DEFAULT_PAGE_SIZE * (page-1);
            } else {
                baseCount = me.policyManagementConstants.DEFAULT_PAGE_SIZE * (page-2);
            }

            var rules = response.ruleCollection.rules,
            firstPageRules = [], secondPageRules = [], data = [];

            $.each(rules, function(i, respRule) {
                var rule = me.get(respRule.id), pageNumberToSet;

                if(page < 3) {
                    pageNumberToSet = page;
                } else {
                    pageNumberToSet = page - 1;
                }
                if(i < me.policyManagementConstants.DEFAULT_PAGE_SIZE){
                    rule.setRulePage(pageNumberToSet);
                }else{
                    rule.setRulePage(pageNumberToSet+1);
                }
                rule.setRowNumber(baseCount + i+1);
            });

            if(numberOfPages >1){
                //split the response rules into multiple arrays based ont he numbers of rules returned
                if(rules.length > me.policyManagementConstants.DEFAULT_PAGE_SIZE){
                    console.log("rules length > " + me.policyManagementConstants.DEFAULT_PAGE_SIZE);
                    firstPageRules = rules.splice(0, me.policyManagementConstants.DEFAULT_PAGE_SIZE);
                    secondPageRules = rules;
                    if(page === 1 ) {
                        data.push({pageNum: page, rules:firstPageRules});
                        data.push({pageNum: page +1 , rules:secondPageRules});
                    } else {
                        if(secondPageRules.length > me.policyManagementConstants.DEFAULT_PAGE_SIZE){
                            secondPageRules = rules.splice(0, me.policyManagementConstants.DEFAULT_PAGE_SIZE);
                            data.push({pageNum: page-1, rules:firstPageRules});
                            data.push({pageNum: page , rules:secondPageRules});
                            data.push({pageNum: page + 1 , rules:rules});
                        } else {
                            data.push({pageNum: page-1, rules:firstPageRules});
                            data.push({pageNum: page , rules:secondPageRules});
                        }
                    }

                }else{
                    firstPageRules = rules;
                    data.push({pageNum: page, rules:firstPageRules});
                }
            }
//            else{
//                // TODO check this condition, for now no scenarios captured
//                data.push({pageNum: page, rules:response.ruleCollection.rules});
//            }

            me.trigger('fetchComplete', data, response.ruleCollection.totalCount, options);
            me.resetCollection = false;
            if (success)  {
              success.apply(me, arguments);
            }
        };

        var rowSeq;

        if(page === 1) {
            rowSeq = (options.page -1) * me.policyManagementConstants.DEFAULT_PAGE_SIZE;
        } else{
            rowSeq = (options.page -2) * me.policyManagementConstants.DEFAULT_PAGE_SIZE;
        }



        options.url = this.url() + me.policyManagementConstants.RULE_DRAFT +  "?paging=(start eq " + rowSeq +", limit eq " + options.rows * numberOfPages+")";
        me.trigger('fetchStart', {}, {}, options);
        return Backbone.Collection.prototype.fetch.call(this, options);
    },

    /**
     * parse callback: after a read (GET) ReST call
     * @param {Object} response - JS object from ReST call
     */
    parse: function(response) {
      // handle wrapped json
      if (this.jsonRoot) {
        var props = this.jsonRoot.split('.');
        return response[props[0]][props[1]];
      }

      return response;
    },

    search: function(value){

    },

    deleteRule: function(ruleIDs) {
      var me = this,
          deletedRules = {
            "modify-rules": {
              "deleted-rules": {
                "deleted-rule": ruleIDs
              }
            }
          };
      me.updateRuleToStore(deletedRules, "deleteAction");
    },

    //expand or collapse the rule group based on user action
    expandCollapseRuleGroup: function(rule, operation){
        var me = this, ruleID = rule.get(me.policyManagementConstants.JSON_ID),
        options = {
            url: me.policyManagementConstants.POLICY_URL + me.policyID +
                me.policyManagementConstants.RULE_DRAFT + "/" + ruleID + "/" + operation,
            success: function (data) {
              me.trigger('refresh-page');
            },
            error: function () {
              console.log("call to expand failed");
            }
        };
        me.sync("create", new me.model(""), options);
    },

    /*
        expand all the rules. called whent he expand all is clicked on the rule grid
    */
    expandAllRules: function(){
        var me = this,
        actionObject = {
        successCounter: 0,
        errorCounter: 0,
        totalNumber: 1,
        action: "expandAllAction"
        }, options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_EXPANDALL,
            success: function (response, status, options) {
              me.trigger('refresh-page',{}, true);
            },
            error: function (model, response, options) {
                ++(actionObject.errorCounter);
            }
        };
        me.sync("create", new me.model(""), options);
    },

    collapseAllRules: function(){
        var me = this,
        actionObject = {
        successCounter: 0,
        errorCounter: 0,
        totalNumber: 1,
        action: "collapseAllAction"
        }, options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_COLLAPSEALL,
            success: function (response, status, options) {
                me.trigger('refresh-page',{}, true);
            },
            error: function (model, response, options) {
                ++(actionObject.errorCounter);
            }
        };
        me.sync("create", new me.model(""), options);
    },

    /*
      Saves the policy that is modified to the database(bulk save)
    */
    savePolicy : function(saveCommnets){
        var me = this,comments;
        me.trigger("before-policy-save");
        var options ={
            url: me.url() + me.policyManagementConstants.DRAFT_SAVE_POLICY,
            success:function(model, response, options){
                //get the validation key if the saveResult is false
              var saveResult = model.saveResult,
                  ruleIdMap = saveResult.resultMap,
                  success = saveResult.success,
                  errorkey = success === false? saveResult.saveMessageFailureInfo.key : "",
                  params = success === false && saveResult.saveMessageFailureInfo.parameters ? saveResult.saveMessageFailureInfo.parameters : "";
              if (success) {
                //set the dirty flag based on save success return
                me.setCollectionDirty(false);
                me.updatePolicyVersion(saveResult.currentVersion);
                me.policy["last-modified-time"]=saveResult.lastModifiedTime;
              }
              me.setSavePolicyInProgress(false);
              me.trigger("after-policy-save", errorkey, params, ruleIdMap);
            },
            error:function(model, response, options){
            //TODO
                //UtilityClass.showErrorDialogue(firewallPolicyObject.name, actionObject.action, response, self);
            }
        };

        if(!$.isEmptyObject(saveCommnets)){
          comments = {
            "save-comments" : {
               comments : saveCommnets
            }
          }
        }else{
          comments = {
            "save-comments" : {}
          }
        }
        me.sync("create", new me.model(comments), options);
    },

    //Updating policy version
    updatePolicyVersion : function(version){
      var self=this;
      var policy=self.policy;
      policy["edit-version"]=version;
    },

    /*
     * construct the request body in the way the backend is expecting
     * This is called to save the data being modified to the cache after each edit
     *
     * options {makeRowEditable - To make the grid row to go to edit mode or not. Defaults to true}
    */
    modifyRule :function(ruleData, modifyOptions){
      var me = this, ruleObject = {
            "modify-rules": {
              "modified-rules": {
                "modified-rule": [ruleData]
              }
            }
          },
          modifyOptions = modifyOptions || {},
          ruleId = ruleData[this.policyManagementConstants.JSON_ID],
          rule = me.get(ruleId),
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "modifyAction"
          },options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_MODIFY,
            success: function (model, response, options) {
              var refreshOptions = (rule.isRuleGroup() || modifyOptions.makeRowEditable === false) ?
                undefined : {editRuleId: ruleId};
              refreshOptions = refreshOptions || {};
              refreshOptions['dnd'] = modifyOptions['dnd'];
              me.setCollectionDirty(true);
              me.trigger('refresh-page', refreshOptions, null, true);

            },
            error: function (model, response, options) {
              ++(actionObject.errorCounter);
            }
          };
      me.sync("create", new me.model(ruleObject), options);
    },

    /**
     * calls the update code on the backend for rule to be updated
     *
     * @param ruleObject
     * @param action
     */
    updateRuleToStore: function (ruleObject, action, editRuleId) {
      var me = this, actionObject = {
        successCounter: 0,
        errorCounter: 0,
        totalNumber: 1,
        action: action
      },options = {
        url: me.url() + me.policyManagementConstants.RULE_DRAFT_MODIFY,
        success: function (model, response, options) {
          me.setCollectionDirty(true);
          /*scrollForward has to be set to true to increment the scroll poso=ition after fetching data which
          will trigger load of additional page to fill the entire viewport*/
          var editRuleIdObj = {};
          if(editRuleId){
            editRuleIdObj = {editRuleId: editRuleId};
          }
          me.trigger('refresh-page',editRuleIdObj, false,false, true); 
        },
        error: function (model, response, options) {
          ++(actionObject.errorCounter);
        }
      };
      me.sync("create", new me.model(ruleObject), options);
    },
    /**
     * gives the id of the rule in case of up or down direction
     * Top and bottom direction do not require the reference rule id
     * @param ruleID
     * @param direction
     * @returns {*}
     */
    getMoveRuleReferenceRuleID: function (rule, direction) {
      var me = this, index = me.indexOf(rule), referenceRule;
      if ((direction === "Up" || direction === "Down") && index !== undefined) {
        direction === "Up"? index-- : index++;
        referenceRule = me.at(index);
        if (referenceRule) {
            //if the parent of the rule that is being moved and the reference rule are not the same then the return
            //value should be the parentID of the reference rule
            if(rule.get("rule-group-id") === referenceRule.get("rule-group-id")){
                return referenceRule.get(me.policyManagementConstants.JSON_ID);
            }else{
                return referenceRule.get("rule-group-id");
            }
        }
      }
    },

    addRuleGroup: function(name, description, selectedIds) {
      var me = this,
          ruleAddInfo = {
            ruleAddInfo: {
              name: name,
              description: description,
              direction: me.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_UP,
              ruleType: "RULEGROUP",
              referenceRuleID: selectedIds[0]
            }
          },
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "createAction"
          }, options= {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_ADD,
            success: function (model, response, options) {
              me.setCollectionDirty(true);
              if (response) {
                var responseRule = model[me.policyManagementConstants.RULE_JSON_ROOT];
                if (responseRule) {
                    var ruleId = responseRule[me.policyManagementConstants.JSON_ID];
                    var ruleType = responseRule["rule-type"];
                    if (ruleType === "RULEGROUP") {
                        me.moveRulesOnStore(selectedIds, ruleId, me.policyManagementConstants.DIRECTION_MAP.MOVE_RULE_BOTTOM);
                    }
                }
              }
            },
            error: function (model, response, options) {
              ++(actionObject.errorCounter);
            }
          };
      me.sync("create", new me.model(ruleAddInfo), options);
    },

    modifyRuleGroup: function(ruleId, name, description) {
        var me = this,
            rule = me.get(ruleId);

        rule.set("name", name);
        rule.set("description", description);
        me.modifyRule(rule);
        me.setCollectionDirty(true);
    },
    moveDroppedRule: function(ruleIds, referenceRuleID, direction) {
      var me = this,
        referenceRule = me.get(referenceRuleID),
        ruleGroupID = referenceRule.get(me.policyManagementConstants.JSON_GROUP_ID),
        actionObject = {
          successCounter: 0,
          errorCounter: 0,
          totalNumber: ruleIds.length,
          action: "moveRuleAction"
        };

      me.moveRulesOnStore(ruleIds, ruleGroupID, direction, referenceRuleID, actionObject);
    },

    moveRule: function(ruleId, direction) {
      var me = this,
          rule = me.get(ruleId),
          ruleGroupID = rule.get(me.policyManagementConstants.JSON_GROUP_ID),
          referenceRuleID = me.getMoveRuleReferenceRuleID(rule, direction),
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "moveRuleAction"
          };

      me.moveRulesOnStore([ruleId], ruleGroupID, direction, referenceRuleID, actionObject);
    },

    /**
     * Move rules to a given group
     *
     * @param selectedItems
     * @param ruleGroupID
     */
    moveRulesOnStore: function(moveRuleIds, ruleGroupID, direction, referenceRuleID, actionObject) {
      if (ruleGroupID === undefined || $.isEmptyObject(moveRuleIds) || !$.isArray(moveRuleIds)) {
        return;
      }
      var me = this,
          ruleMoveInfo = {
            "ruleIds": moveRuleIds,
            "direction": direction,
            "targetRuleGroupID": ruleGroupID,
            "referenceRuleID": referenceRuleID
          },
          options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_MOVE,
            success: function (model, response, options) {
              me.setCollectionDirty(true);
              actionObject = actionObject || {};
              actionObject['dnd'] = {
                highlight : {
                  rows : moveRuleIds
                }
              };
              me.trigger('refresh-page', actionObject);
            },
            error: function (model, response, options) {
//              ++(actionObject.errorCounter);
            }

          };
      me.sync("create", new me.model({"ruleMoveInfo":ruleMoveInfo}), options);
    },
    /**
     * copy rule on store cache
     *
     * @param ruleIds
     */
    copyRules: function(ruleIds) {
      var me = this,
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "copyRuleAction"
          }, ruleIdList = {
            "ruleIdList": {
              "ruleIDs": ruleIds
            }
          },  options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_COPY,
            success: function (model, response, options) {
              me.hasCopiedRules = true;
            },

            error: function (model, response, options) {
              ++(actionObject.errorCounter);
            }
          };
      me.sync("create", new me.model(ruleIdList), options);
    },

    enableDisableRules: function(ruleIds, disable) {
      var me = this,
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "enableDisableRuleAction"
          }, ruleIdList = {
            "ruleIdList": {
              "ruleIDs": ruleIds
            }
          },  options = {
            url: disable === true ?  me.url() + me.policyManagementConstants.RULE_DRAFT_DISABLE :
                me.url() + me.policyManagementConstants.RULE_DRAFT_ENABLE,
            success: function (response, status, options) {
              me.setCollectionDirty(true);
              var ruleDisableResponse = response.ruleIdList,
                  ruleIds = ruleDisableResponse.ruleIDs, rule;
              if ( !(_.isArray(ruleIds)  || _.isNumber(ruleIds) || _.isString(ruleIds))) {
                return;
              }
              ruleIds =  _.isArray(ruleIds)? ruleIds : [ruleIds];

              $.each(ruleIds, function(i, ruleID) {
                rule = me.get(ruleID);
                rule.setRuleDisableState(disable);
              });
              me.trigger('refresh-page', {}, null, true);
            },
            error: function (model, response, options) {
              ++(actionObject.errorCounter);
            }
          };
      me.sync("create", new me.model(ruleIdList), options);
    },

    cloneRule: function(ruleId) {
      var me = this,
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "cloneRuleAction"
          },
          options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT + "/" + ruleId + me.policyManagementConstants.RULE_DRAFT_CLONE,
            success: function (model, response, options) {
                me.setCollectionDirty(true);
                me.highlightRule("afterCreateRule",{ruleIds : [model.ruleCollection.rules[0].id], isRowEditable: true});
            },
            error: function (model, response, options) {
              ++(actionObject.errorCounter);
            }
          };
      me.sync("create", new me.model(""), options);
    },

    pasteRules: function(referenceRuleID, direction) {
      var me = this,
          ruleAddInfo = {
            ruleAddInfo: {
              direction: direction,
              referenceRuleID: referenceRuleID
            }
          },
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "pasteRuleAction"
          }, options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_PASTE,
            success: function (response, status, options) {
                me.processPasteResponse(response);
                var pasteResponse = response['paste-response'], ruleIds = [], ruleId = referenceRuleID;

                if(!$.isEmptyObject(pasteResponse)){
                  ruleIds = pasteResponse["pastedRuleIds"];
                  console.log(ruleIds);
                  if(ruleIds.length !== 0){
                      ruleId = ruleIds[0];
                  }
                }
                me.setCollectionDirty(true);
                me.highlightRule("afterCreateRule",{ruleIds : ruleIds, isRowEditable: false});
            },
            error: function (model, response, options) {
              ++(actionObject.errorCounter);
              me.editLockErrorMsg(model,me);
            }
          };
      me.sync("create", new me.model(ruleAddInfo), options);
    },

    //Display policy edit lock error msg
    editLockErrorMsg: function(model,me){
      if(model) {
        if(model.responseText === me.policyManagementConstants.POLICY_EDIT_LOCK_NOT_AVAILABLE) {
          me.trigger("policy-edit-lock-not-available");
        } else {
          new Slipstream.SDK.Notification()
            .setText(me.context.getMessage(model.responseText))
            .setType('error')
            .notify();
        }
      }
    },

    pasteInPlaceRule: function(ruleName) {
      var me = this, ruleAddInfo;

      if (ruleName) {
        ruleAddInfo = {
          ruleAddInfo: {
            type: ruleName
          }
        };
      } else {
        ruleAddInfo = {
          ruleAddInfo: {}
        };
      }

      var actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "pasteRuleAction"
          }, options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_PASTE,
            success: function (response, status, options) {
              me.processPasteResponse(response);
              me.setCollectionDirty(true);
              me.trigger('refresh-page', {}, null, true);
            },
            error: function (model, response, options) {
              ++(actionObject.errorCounter);
              me.editLockErrorMsg(model,me);
            }
          };

      if (ruleAddInfo)
        me.sync("create", new me.model(ruleAddInfo), options);
    },

    processPasteResponse : function(data){
        var self = this,pasteResponse = data['paste-response'],msgString ="",isZoneMsgRequire=false,infoMsgs=[],errorMsgs=[];


        if(!$.isEmptyObject(pasteResponse)){
          var ruleResponseList = pasteResponse['ruleResponseList'];
          for(var i=0;ruleResponseList.length > i ;i++){
             var ruleResponse = ruleResponseList[i];
             if(!$.isEmptyObject(ruleResponse)){
               var messages =  ruleResponse['messages'];
               for(var j=0;messages.length>j;j++ ){
                  var message = messages[j];
                  if(!$.isEmptyObject(message)){
                       var key = message['key'];
                       var parameters = message['parameters'];
                       if(key == 'ZONES_CHANGED_DURING_PASTE'){                           
                           infoMsgs.push(parameters);
                           isZoneMsgRequire = true;
                       }else if(key == 'NAME_CHANGED_DURING_PASTE'){
                           infoMsgs.push(parameters);
                       }else if(key == 'ERROR_MESSAGE'){
                            errorMsgs.push(parameters);
                       }               
                  }
               }
            }
          }
        }
        if(infoMsgs.length>0){
          msgString=msgString+'<br />'+'<b>'+self.context.getMessage('INFO_MESSAGE')+':'+'</b>'+'<br />'
        }
        for(var k=0;infoMsgs.length>k;k++ ){
            msgString=msgString+'Rule '+infoMsgs[k][0]+' was pasted with name '+infoMsgs[k][1]+'<br />';
        }
        if(errorMsgs.length>0){
          msgString=msgString+'<br />'+'<b>'+self.context.getMessage('ERROR_MESSAGE')+':'+'</b>'+'<br />'
        }
        for(var l=0;errorMsgs.length>l;l++ ){
            msgString=msgString+self.context.getMessage(errorMsgs[l][0]);
        }
        if(msgString.length > 0){
            var overlayGridForm = new PasteMessageFormView({
                context: this.context,
                 params: {
                    parentView: this,
                    message:msgString,
                    isZoneMsgRequire:isZoneMsgRequire
                }
            });            
            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'small',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();        
        }
    },

    cutRules: function(ruleIDs) {
      var me = this,
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "cutRuleAction"
          }, copyRules = {
            "ruleIdList": {
              "ruleIDs": ruleIDs
            }
          }, options = {
            url: me.url() + me.policyManagementConstants.RULE_DRAFT_CUT,
            success: function (response, status, options) {
              me.setCollectionDirty(true);
              me.hasCopiedRules = true;
              me.trigger('refresh-page', {}, null, true);
            },
            error: function (model, response, options) {
              ++(actionObject.errorCounter);
            }
          };
      me.trigger("clearSelection", ruleIDs);
      me.sync("create", new me.model(copyRules), options);
    },

    ungroupRules: function(ruleIds) {
        var me = this,
            actionObject = {
                successCounter: 0,
                errorCounter: 0,
                totalNumber: 1,
                action: "ungroup"
            },
            ruleIdList = {
                "ruleIdList": {
                    "ruleIDs": ruleIds
                }
            },
            options = {
                url: me.url() + me.policyManagementConstants.RULE_DRAFT_UNGROUP,
                success: function (model, response, options) {
                    me.setCollectionDirty(true);
                    me.trigger('refresh-page', {}, null, true);
                },
                error: function (model, response, options) {
                    ++(actionObject.errorCounter);
                }
            };

        me.sync("create", new me.model(ruleIdList), options);
    },

    handleFilter: function(filter){
        var me = this,
        actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "filter"
        },
        options = {
            success: function (model, response, options) {
                me.trigger('load-filtered');
            },
            error: function (model, response, options) {
                ++(actionObject.errorCounter);
            }
        };
        options["url"] = me.url() + me.policyManagementConstants.RULE_DRAFT_FILTER;
        me.sync("create", new me.model(filter), options);
    },

    resetStore: function(callback){
        var me = this,
        actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "restoreStore"
        },
        options = {
            success: function (model, response, options) {
                me.setCollectionDirty(false);
                console.log("store reset");
                if(callback) {
                  callback();
                }
            },
            error: function (model, response, options) {
                ++(actionObject.errorCounter);
                if(callback) {
                  callback();
                }
            }
        };

        options["url"] = me.url() + me.policyManagementConstants.RULE_DRAFT_RESET_STORE;
        me.sync("create", new me.model(), options);
    },

    checkCopiedRules: function() {
        var me = this,
          actionObject = {
            successCounter: 0,
            errorCounter: 0,
            totalNumber: 1,
            action: "checkCopiedRules"
          },
          options = {
            url: me.policyManagementConstants.POLICY_URL + me.policyManagementConstants.RULE_DRAFT_COPIED,
            success: function (model, response, options) {
                me.hasCopiedRules = model["Boolean"];
            },
            error: function (model, response, options) {
              ++(actionObject.errorCounter);
            }
          };
        me.sync("read", new me.model(""), options);
    },

    //get policy object
    getPolicy : function(callback){
      var self=this;
      $.ajax({
          url: self.policyManagementConstants.POLICY_URL + self.policy.id,
          type: 'GET',
          headers: {
          Accept: self.policyManagementConstants.POLICY_ACCEPT_HEADER
          },
          success: function (data) {
            callback(data);
          },
          error: function () {
            callback();
            console.log("call to fetch policy in base rule collection failed");
          }
        });
    },
    //returns ordered list of rule id's. used for navigating the changes
    getOrderedListOfRuleIds: function(onSuccess, onFailure){
      var me=this;
      $.ajax({
          url: me.url() + me.policyManagementConstants.RULE_DRAFT_CHANGED_RULE_IDS + "?cuid=" + me.cuid,
          headers:{
              "accept": me.policyManagementConstants.RULE_DRAFT_CHANGED_RULE_IDS_ACCEPT
          },
          success: onSuccess,
          failure : onFailure
      });
    },
    //Below method checks the Save comments enable or not in application settings

    fetchSaveCommentSettings : function(){
        var self = this;
        $.ajax({
              url: self.policyManagementConstants.POLICY_URL + 'draft/rules/save-comments',
              type: 'GET',
              success: function (data) {
                self.setSaveCommentsEnabled(data);
              },
              error: function () {
                console.log("call to fetch save comment is failed");
              }
          });
    },

    hasSaveCommnets : function(){
      return true;
    },


    /**
     * returns the message based on the edit time of the policy. if collection is dirty or the incoming flag is
     * true than returns "Currently editing Policy"
     * @param isCurrentlyEditingPolicy
     * @returns {*}
     */
    getPolicyEditMessage: function(isCurrentlyEditingPolicy) {
      var retrunValue = "" , self = this, modifiedTime = Math.ceil((Date.parse(new Date())- self.policy["last-modified-time"])/1000);
      if (self.isCollectionDirty() || isCurrentlyEditingPolicy) {
        //currently editing
          retrunValue = self.context.getMessage('ruleGrid_currently_editing_msg');
      }
      //seconds
      else if  (modifiedTime < 60){
          retrunValue = self.context.getMessage('ruleGrid_editing_done_msg');
      } else {
          //minutes
          modifiedTime = Math.ceil(modifiedTime/60);
          if (modifiedTime < 60){
              retrunValue = self.context.getMessage('ruleGrid_edited_minutes_msg', [modifiedTime]);
          } else {
              //hours
              modifiedTime = Math.ceil(modifiedTime / 60);
              if (modifiedTime < 24) {
                  retrunValue = self.context.getMessage('ruleGrid_edited_hours_msg', [modifiedTime]);
              } else {
                  //days
                  retrunValue = self.context.getMessage('ruleGrid_edited_msg', [Math.ceil(modifiedTime/24)]);
              }
          }
      }

      return retrunValue;
    },

    //Show Events generated by Rule - should construct Filter string and launch the task
    showEvents: function(options) {
        var me = this,
            srcZone = options.srcZone,
            destZone = options.destZone,
            filterObj = options.filterObj;

        //Filter creation for zones
        var promises=[];
        promises.push(me.constructZoneFilter(srcZone, "source", filterObj));
        promises.push(me.constructZoneFilter(destZone, "destination", filterObj));

        $.when.apply(null, promises).done(function(){
            //Filter creation for time range
            var currentTime = new Date(),
            startTime = new Date(me.policy['last-modified-time']);
            var request = {
              'timeRange': {
                              'startTime': startTime,
                              'endTime': currentTime
                          },

              'filters': filterObj
            },
            intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST', {
                mime_type: "vnd.juniper.net.eventlogs.alleventcategories"
            });
            intent.putExtras(request);
            me.context.startActivity(intent);
        });
      },

     constructZoneFilter: function(zones, type, filterObj) {
        var me = this;
        var deferred = $.Deferred();
        if(!_.isEmpty(zones)){
            zones = _.isArray(zones) ? zones : [zones];
            //Zone - "Any" needs to be filtered
            zones = _.reject(zones, function(zone){
              var name = zone? zone['name'] : undefined;
              return  _.isEmpty(name)|| name.toLowerCase() === "any";
            });
            var zoneArray = [], zoneSetArray = [], key;
            for (var key in zones) {
              var zoneValue = zones[key];
              //For Zone-Sets expand zones for filters by fetching zones using zones by ID
              if(zoneValue['zone-type'] === "ZONESET") {
                zoneSetArray.push(zoneValue['id']);
              } else {
                zoneArray.push(zoneValue['name']);
              }
            }

            if(zoneSetArray.length != 0){
                $.when(me.fetchZonesByIDs(zoneSetArray))
                .always(function(data, status){
                    if(status === "success" && data['zone-sets'] && data['zone-sets']['zone-set']) {
                        data['zone-sets']['zone-set'].forEach(function(object) {
                            if(!_.isEmpty(object.zones)) {
                              var tempZoneArr = object.zones.split(',');  //Splitting string into array
                              zoneArray = zoneArray.concat(tempZoneArr);
                            }
                        });
                        //Compute unique zones
                        zoneArray = _.uniq(zoneArray);
                    }
                    me.buildZoneFilter(zoneArray, type, filterObj);
                    deferred.resolve();
                });
            } else {
                me.buildZoneFilter(zoneArray, type, filterObj);
                deferred.resolve();
            }
            return deferred.promise();
        }
    },

    fetchZonesByIDs: function(zoneSetIDs) {
        var me = this;
        var filterString = '?filter=(';
        var OR = '+or+';
        for (var i = 0; i < zoneSetIDs.length; i++) {
            if(filterString != '?filter=('){
                filterString = filterString.concat(OR);
            }
            filterString = filterString.concat('id+eq+'+zoneSetIDs[i]);
        };
        filterString = filterString.concat(')');

        //Fetching Zones from ZoneSets
        return $.ajax({
            url: me.policyManagementConstants.ZONE_SETS_URL +filterString,
            type: 'GET',
            headers: {
                'accept': me.policyManagementConstants.ZONE_SETS_ACCEPT
            }
        });
    },

    buildZoneFilter: function(zoneArray, type, filterObj) {
        if(!_.isEmpty(zoneArray)) {
            if(type == "source") {
                key = "source-zone-name";
            } else if(type == "destination") {
                key = "destination-zone-name";
            }

            var zoneObj = {
                filter : {
                    key: key,
                    operator: "EQUALS",
                    value: zoneArray
                }
            };
            filterObj.and.push(zoneObj);
        }
    },

    /*
    * Fetches the rule information based on Id
    * ruleId --- Id of the rule to fetch information(ruleId,rowNumber,pageNumber,totalrows)
    * eventName --- name of the event to be thrown after fetching rule information
    */
    highlightRule: function(eventName, data){
        var me = this, ruleId = data.ruleIds[0];
        $.ajax({
          url: me.url() + me.policyManagementConstants.RULE_DRAFT + "/" + ruleId + me.policyManagementConstants.RULE_PAGE_NUMBER + "?paging=(limit eq " + me.policyManagementConstants.DEFAULT_PAGE_SIZE + ")&cuid=" + me.cuid,
          type: 'GET',
          headers: {
            Accept: me.policyManagementConstants.RULE_ACCEPT_HEADER
          },
          success: function (model, response, options) {
            console.log(model);
            data.rowData = model;
            me.trigger(eventName, data);
          },
          error: function () {
            console.log("call to get page number for new rule failed in fwRuleCollection");
          }
        });
    }
  });

  return RuleCollection;
});

