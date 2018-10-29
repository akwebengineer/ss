/**
 * Utility Class for Common usage
 * This class will be used across SM
 * @module gridUtility
 * @author Vinamra<vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['widgets/confirmationDialog/confirmationDialogWidget',
        '../models/objectReferenceCollection.js',
        'text!../../../ui-common/js/templates/deleteMessageDetail.html'], 
        function (ConfirmationDialog, ObjectReferenceCollection, referenceResultTemplate) {

    var GridUtility = function() {
        this.FILTER_KEY_SHOW_UNUSED = "showUnused";
        /*
         * Select all - fetch IDs for given task url
         * callbacks will be passed as arguments
         */
        this.getRowIds = function(setIdsSuccess, setIdsError, tokens, parameters, baseUrl) {
            if(baseUrl){
              var requestData = {};
              if (parameters){
                if(!_.isEmpty(parameters["_search"])) {
                    requestData._search = parameters["_search"];
                }
                if(!_.isEmpty(parameters["filter"])) {
                    requestData.filter = parameters["filter"];
                }
              }
              var urlArr = baseUrl.split('?'),
                  selectAllUrl = urlArr[0] + '/select-all';
              if(urlArr.length === 2){
                selectAllUrl = selectAllUrl + '?' + urlArr[1];
              }
              $.ajax({
                type: 'GET',
                url: selectAllUrl,
                headers: {
                  "Accept": 'application/vnd.juniper.sd.select-all-ids+json;version=1;q=0.01'
                },
                data: requestData,
                success: function(data) {
                  var ids = [], domainIds = [];
                  if (data && data['select-ids'] && data['select-ids']['select-id']) {
                    ids = _.pluck(data['select-ids']['select-id'], "id");
                    domainIds = _.pluck(data['select-ids']['select-id'], "domain-id");
                  }
                  // grid widget does not accept the second param for now.
                  setIdsSuccess(ids, domainIds);
                },
                error: function() {
                  setIdsError("Getting all row ids in the grid FAILED.");
                }
              });
            }else{
              setIdsError("Getting all row ids in the grid FAILED, no URL is defined.");
            }
        };

        this.showDeleteReferenceError = function(response,context) {
            var self = this;
            var objectName = response.message.split("#")[0];

            var onFetch = function (collection, response, options) {
                if (response && response['response'] && response['response']['results'] 
                    && response['response']['results']['result'] ) {
                    // For the object(s) being used by others, it can not be deleted
                    var objects = response['response']['results']['result'];
                    var refObjArr = self.parseReferenceResult(objects);

                    var data = {
                        delete_detail: refObjArr,
                        delete_text: context.getMessage('delete_error_being_used', [objectName]),
                        delete_info: context.getMessage('delete_error_not_must', [objectName])
                    };
                    var errorMsg = Slipstream.SDK.Renderer.render(referenceResultTemplate, data);

                    self.showDeleteErrMsg(errorMsg,context);
                } else {
                    console.log("failed to query reference object");
                }
            };

            var objectReferenceCollection = new ObjectReferenceCollection();
            objectReferenceCollection.fetch({
                url: objectReferenceCollection.url(response.failedObjectId),
                success: onFetch,
                error: function(collection, response, options) {
                    console.log('reference not fetched');
                }
            });
        };

        this.createValidationConfirmationDialog = function(option,context) {
            var self =this;
            this.validationConfirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                question: option.question,
                yesButtonLabel: context.getMessage('ok'),
                yesButtonTrigger: 'yesEventTriggered',
                xIcon: false
            });

            this.bindValidationConfirmationDialogEvents(option);
            this.validationConfirmationDialogWidget.build();
        };

        this.bindValidationConfirmationDialogEvents = function(option) {
            this.validationConfirmationDialogWidget.vent.on('yesEventTriggered', function() {
                if (option.yesEvent) {
                    option.yesEvent();
                }
            });
        };

        this.showDeleteErrMsg = function(errMsg,context) {
            var self = this;
            var conf = {
                title: context.getMessage('delete_fail_title'),
                question: errMsg,
                yesEvent: function() {
                    self.validationConfirmationDialogWidget.destroy();
                }
            };
            self.createValidationConfirmationDialog(conf,context);
        };

        this.getDeleteErrorMsg = function(failedObjectId, selectedRows, context) {
            var self = this,
                isErrorItemFound = false,
                errorMsg ='',
                errorObjName = '',
                deletedNameArray = [],
                undeletedNameArray = [],
                deletedNameStr = '',
                undeletedNameStr = '';

            if (selectedRows.length == 1){
                // when user delete 1 item,  error message is generic.
                errorMsg = context.getMessage('delete_one_fail_error');
            }else if (selectedRows.length <= 10){
                // when user fail to delete less than or equal to 10 items, error message will show more details.
                for (var i=0; i<selectedRows.length; i++) {
                    if (failedObjectId != selectedRows[i].id)
                    {
                        if(!isErrorItemFound)
                        {
                            deletedNameArray.push(selectedRows[i].name);
                        } else {
                            undeletedNameArray.push(selectedRows[i].name);
                        }
                    } else {
                        isErrorItemFound = true;
                        errorObjName = selectedRows[i].name;
                    }
                }

                deletedNameStr = deletedNameArray.join(', ');
                undeletedNameStr = undeletedNameArray.join(', ');

                if(0 === deletedNameArray.length)
                {
                    // if first item deleted failed
                    errorMsg = context.getMessage('delete_error_msg_first_failed', [errorObjName,undeletedNameStr]);
                } else if (0 === undeletedNameArray.length){
                    // if last item deleted failed
                    errorMsg = context.getMessage('delete_error_msg_last_failed', [deletedNameStr,errorObjName]);
                } else if (1 == deletedNameArray.length) {
                    errorMsg = context.getMessage('delete_error_msg_single', [deletedNameStr,errorObjName,undeletedNameStr]);
                }else {
                    errorMsg = context.getMessage('delete_error_msg_multiple', [deletedNameStr,errorObjName,undeletedNameStr]);
                }
            } else {
                // when user delete more than 10 items,  error message is generic.
                errorMsg = context.getMessage('delete_large_data_fail', [failedObjectId]);
            }

            return errorMsg;
        };

        /**
         * parse the object reference from ajax responce and format it. Below is an output example 
         *
         * Firewall Policy: Test, Ac
         * Address Group: 0Group2 
         */
        this.parseReferenceResult = function(resultObjects) {
            var refArr = [],
                typeNameArr = [],
                j = 0,
                objName;

            if($.isArray(resultObjects)){
                for(var i = 0; i < resultObjects.length; i++){
                    var typeName = resultObjects[i].typeName;
                    objName = resultObjects[i].objectName;
                    var curIndex = $.inArray(typeName, typeNameArr);

                    // Fix css issue for object name in link
                    if(objName.match(/\<a.*(?=>)(.|\n)*?<\/a>/g))
                    {
                        objName = objName.replace(/\<a/, "<a style='color: #3366cc;'");
                    }

                    // If the type hasn't been added
                    if(curIndex === -1){
                        refArr[j] = {};
                        refArr[j]["type_name"] = typeName;
                        refArr[j]["object_name"] = objName;

                        typeNameArr.push(typeName);
                        j++;
                    } else {
                        refArr[curIndex]["object_name"] += ',' + objName;
                    }
                }
            }else{
                objName = resultObjects.objectName;
                if(objName.match(/\<a.*(?=>)(.|\n)*?<\/a>/g))
                {
                    objName = objName.replace(/\<a/, "<a style='color: #3366cc;'");
                }

                refArr[j] = {};
                refArr[j]["type_name"] = resultObjects.typeName;
                refArr[j]["object_name"] = objName;
            }

            return refArr;
        };

        /**
         * Add column to store definition-type info to all grids (not defined in conf file)
         */
        this.addColumnForPredefinedIdentifier = function(conf) {
            var item = {
                "id": "definition-type",
                "label": "",
                "name": "definition-type",
                "hidden": true
            };

            conf.columns = conf.columns || [];
            //definition-type column is alreay present in grid then no need to add it.
            var result = $.grep(conf.columns, function(e){ return e.name == "definition-type"; });
            if (result.length === 0) {
               conf.columns.push(item);
            }
            return conf; // ?
        };

        this.createNewIntent = function(originalIntent, action) {
            var intent = $.extend(new Slipstream.SDK.Intent(), originalIntent);
            intent.action = action;

            // Fix mime_type, sometimes the value is set directly on data instead of data.mime_type
            // TODO - determine why that happens
            if (! intent.data.mime_type) {
                var mimeType = intent.data;
                intent.data = {mime_type: mimeType};
            }

            return intent;
        };

        this.addContextMenuItem = function(conf, item) {
            conf.contextMenu = conf.contextMenu || {};
            conf.contextMenu.custom = conf.contextMenu.custom || [];

            conf.contextMenu.custom.push(item);
        };

        /**
         * Get filter value from extras
         * extras value is an object {" filter": "(name eq 'test')"}
         */
        this.getSearchParamsFromExtras = function(extras) {
             // the links in response has space ahead
            var paramsInExtras = undefined;
            if (!$.isEmptyObject(extras)) {
                var filter = extras[" filter"] || extras["filter"];
                if (!_.isEmpty(filter)) {
                    paramsInExtras = filter.split("'")[1];
                }
            }
            return paramsInExtras;
        };

        /**
         * return a function which could reformat tokens "showUnused" as "showUnused eq 'true'"
         */
        this.getOnBeforeSearchFunction = function() {
            var self = this;
            var fn = function(tokens) {
                return tokens.map(function(token) {
                    if (_.isEqual(token, self.FILTER_KEY_SHOW_UNUSED)) {
                        token = self.FILTER_KEY_SHOW_UNUSED + " eq 'true'";
                    }
                    return token;
                });
            };
            return fn;
        }
    };

    return GridUtility;
});