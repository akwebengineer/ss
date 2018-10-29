/*jshint sub:true*/ //to ignore  is better written in dot notation warning
/**
 * An activity that implements the legacy inventory landing page (ILP)
 *
 * @module GridActivity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    './sse/smSSEEventSubscriber.js',
    'backbone',
    './views/gridView.js',
    'widgets/overlay/overlayWidget',
    'widgets/confirmationDialog/confirmationDialogWidget',
    './models/cloneable.js',
    './common/intentActions.js',
    './views/duplicatesView.js',
    './common/widgets/progressBarForm.js',
    './views/assignToDomainView.js',
    './conf/assignToDomainFeatureRelatedConf.js',
    './util/gridUtility.js',
    './models/objectReferenceCollection.js',
    'text!../../ui-common/js/templates/deleteMessageDetail.html'
], function(SmSSEEventSubscriber,Backbone, GridView, OverlayWidget, ConfirmationDialog, 
        Cloneable, IntentActions, DuplicatesView, progressBarForm, AssignToDomainView,
        AssignToDomainFeatureRelatedConf, GridUtility, ObjectReferenceCollection, referenceResultTemplate) {

    var DEFAULT_SEARCH_KEY = 'name',
        SEARCH_KEY_ID = 'id',
        EDIT_KEY = 'edit',
        DELETE_KEY = 'delete',
        CLONE_KEY = 'cloneEvent',
        REPLACE_KEY = 'replaceEvent',
        FIND_USAGE_KEY = 'findUsageEvent',
        ASSIGN_TO_DOMAIN_KEY = 'assignToDomainEvent',
        SHOW_DETAIL_VIEW_KEY = 'quickView',
        CLEAR_ALL_KEY = 'clearAll',
        PREDEFINED_TYPE = 'PREDEFINED';

    var gridUtility = new GridUtility();

    var createNewIntent = gridUtility.createNewIntent;
    var addContextMenuItem = gridUtility.addContextMenuItem;

    /**
     * Constructs a GridActivity.
     */
    var GridActivity = function() {

        this.gridConf = null;
        this.events = {};
        this.capabilities = {};

        /**
         * creating a public references for addContextMenuItem, createNewIntent
         * to make these private functions accessible to the custom event handlers in 
         * individual module gridActivity.
         */
        this.addContextMenuItem = addContextMenuItem;
        this.createNewIntent = createNewIntent;
    };

    GridActivity.prototype = new Slipstream.SDK.Activity();

    GridActivity.prototype.isEditButton = function(key) {
      return key === EDIT_KEY;
    };

    GridActivity.prototype.isDeleteButton = function(key) {
      return key === DELETE_KEY;
    };

  // return true if the context item should be disabled; return false if the context item should be enabled
    GridActivity.prototype.setItemStatus = function (key, isItemDisabled, selectedRows){
      if (this.isEditButton(key)) {
        return isItemDisabled || this.isDisabledEdit(key, selectedRows);
      } else if (this.isDeleteButton(key)) {
        return isItemDisabled || this.isDisabledDelete(key, selectedRows);
      } else if (key == SHOW_DETAIL_VIEW_KEY) {
        return isItemDisabled || this.isDisabledShowDetailView(key, selectedRows);
      } else if (key == CLEAR_ALL_KEY) {
        return isItemDisabled || _.isEmpty(selectedRows);
      }

      return isItemDisabled;
    };

    // Enable/disable the action buttons
    GridActivity.prototype.setButtonStatus = function (selectedRows, updateStatusSuccess, updateStatusError){
        var  enableEdit, enableDelete;
        selectedRows = selectedRows.selectedRows;

        enableEdit = !this.isDisabledEditButton(selectedRows);
        enableDelete = !this.isDisabledDeleteButton(selectedRows);

        updateStatusSuccess({
            "edit": enableEdit,
            "delete": enableDelete
        });
    };

  /**
     * This method is moved from this.bindEvents to GridActivity.prototype.bindEvent 
     * to make it extendable by the module's gridActivity. So the only generic capabilities stay here and 
     * new capabilities specific to the module can be handled in module's gridActivity. 
     *
     */
    GridActivity.prototype.bindEvents = function() {
        if (this.capabilities.create) {
            this.bindCreateEvent();
        }

        if (this.capabilities.findUsage) {
            this.bindFindUsageEvent();
        }

        if (this.capabilities.edit) {
            this.bindEditEvent();
        }

        if (this.capabilities.clone) {
            this.bindCloneEvent();
        }

        if (this.capabilities["delete"]) {
            this.bindDeleteEvent();
        }

        if (this.capabilities.import) {
            this.bindImportEvent();
        }

        if (this.capabilities.export) {
            this.bindExportEvent();
        }
        if (this.capabilities.replace) {
            this.bindReplaceEvent();
        }

        if (this.capabilities.showUnused) {
            this.bindShowUnusedEvent();
        }

        if (this.capabilities.showDuplicates) {
            this.bindShowDuplicatesEvent();
        }

        if (this.capabilities.deleteUnused) {
            this.bindDeleteUnusedEvent();
        }

        if (this.capabilities.assignToDomain) {
            this.bindAssignToDomainEvent();
        }

        if (this.capabilities.showDetailView) {
            this.bindShowDetailViewEvent();
        }

        if (this.capabilities.clearAllSelections) {
            this.bindClearAllSelectionsEvent();
        }
    };

    GridActivity.prototype.isPredefinedObject = function(selectedRows) {
        for (var i=0; i<selectedRows.length; i++) {
            if (PREDEFINED_TYPE == selectedRows[i]['definition-type'])
            {
                return true;
            }
        }

        return false;
    };

    GridActivity.prototype.isDifferentDomain = function(selectedRows) {
        for (var i=0; i<selectedRows.length; i++) {
            var domainID = selectedRows[i]['domain-id'];
            if (domainID && Juniper.sm.DomainProvider.isNotCurrentDomain(parseInt(domainID))) {
                return true;
            }
        }

        return false;
    };

    GridActivity.prototype.setContextMenuItemStatus = function(conf) {
       // Set status for items in context menu
       conf.contextMenuItemStatus = conf.contextMenuItemStatus || $.proxy(this.setItemStatus, this.contextMenuScope || this);

       // Set status for edit&delete buttons
       conf.actionButtons = conf.actionButtons || {};
       conf.actionButtons.customButtons = conf.actionButtons.customButtons || [];
       conf.actionButtons.actionStatusCallback = conf.actionButtons.actionStatusCallback || $.proxy(this.setButtonStatus, this.menuButtonScope || this);
    };

    GridActivity.prototype.addSelectAllCallback = function(conf) {
        var me = this;
        // If onSelectAll is not defined, add the common callback
        if(conf.onSelectAll === undefined){
            conf.onSelectAll = function (setIdsSuccess, setIdsError, tokens, parameters) {
                me.getRowIds(setIdsSuccess, setIdsError, tokens, parameters, conf.url);
            };
        }
    };

    GridActivity.prototype.getRowIds = function(setIdsSuccess, setIdsError, tokens, parameters, baseUrl) {
        gridUtility.getRowIds(setIdsSuccess, setIdsError, tokens, parameters, baseUrl);
    };

    GridActivity.prototype.onCreate = function() {
        console.log("Created GridActivity");
    };

    GridActivity.prototype.onStart = function() {
        console.log("Started GridActivity for:"+this.getIntent().action);
        switch(this.getIntent().action) {

            case Slipstream.SDK.Intent.action.ACTION_CREATE:
                this.onCreateIntent();
                break;

            case Slipstream.SDK.Intent.action.ACTION_EDIT:
                this.onEditIntent();
                break;

            case Slipstream.SDK.Intent.action.ACTION_CLONE:
                this.onCloneIntent();
                break;

            case Slipstream.SDK.Intent.action.ACTION_SELECT:
                this.onSelectIntent();
                break;

            case Slipstream.SDK.Intent.action.ACTION_IMPORT:
                this.onImportIntent();
                break;

            case Slipstream.SDK.Intent.action.ACTION_EXPORT:
                this.onExportIntent();
                break;

            case IntentActions.ACTION_REPLACE:
                this.onReplaceIntent();
                break;

            case IntentActions.ACTION_SHOW_DUPLICATES:
                this.onShowDuplicatesIntent();
                break;

            case IntentActions.ACTION_ASSIGN_TO_DOMAIN:
                this.onAssignToDomainIntent();
                break;

            case IntentActions.ACTION_SHOW_DETAIL_VIEW:
                this.onShowDetailViewIntent();
                break;

            case IntentActions.ACTION_DELETE:
                this.onDeleteIntent();
                break;

            case IntentActions.ACTION_DELETE_UNUSED:
                this.onDeleteUnusedIntent();
                break;
          case IntentActions.ACTION_LIST_CUSTOM_CONTAINER:
              //Delay is introduced so that container div is correctly rendered (appended to) DOM.
              //If this is not done we see issues in the grid sizing. It does not occupy complete width of container.
              _.delay(_.bind(this.onListIntentWithCustomContainer, this), 100);
                break;
            //case Slipstream.SDK.Intent.action.ACTION_LIST: also handled in default
            default:
                this.onListIntent();
        }
    };

    /**
     * Returns the configuration values for the landing page grid.
     * Override if grid configuration does not follow general convention.
     */
    GridActivity.prototype.getConfigValues = function() {
        return new this.gridConf(this.getContext(), this.intent).getValues();
    };
     /**
     * [subscribeNotifications this is to register notification for Grid ILP,
     *     those how have getView() overridden* they need to call subscribeNotifications() to get registered for notification* 
     *     it has an default configuration for notification,
     *     get the grid url from grid configuration and in the call back it triggers reloadGrid with autoRefresh
     *     if the user wants to have there custom URI, custom Call back and custom AutoRefresh,
     *     then need to have getNotificationConfig method in there Grid Configuration, with uri, autoRefresh and callback mandatorily]
     *
     * @return {[boject]} [SmSSEEventSubscriber]
     */
    GridActivity.prototype.subscribeNotifications = function () {
        //Subscribe to the SSE event
        var self = this, configFunc = new self.gridConf(self.context).getNotificationConfig, notificationSubscriptionConfig, sseEventHandler;
        
            notificationSubscriptionConfig = $.extend({
                'uri' : this.getNotificationUrl(),
                'autoRefresh' : true,
                'callback' : function () {
                    console.info("Notification callback");
                    if(notificationSubscriptionConfig.autoRefresh){
                        this.gridWidget.reloadGrid();
                    }else {
                        this.gridWidget.manualRefreshContainer.show();
                    }
                }
            }, configFunc ? configFunc() : {});
            
        sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self.view);
        this.smSSEEventSubscriber = new SmSSEEventSubscriber();
        this.sseEventSubscriptions = this.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);

        return this.sseEventSubscriptions;
    };

    /**
     * [unSubscribeNotification]
     */
     GridActivity.prototype.unSubscribeNotification = function(){
        // unsubscribe Notification for job details
         if (this.smSSEEventSubscriber) {
             this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
         }
    };

    GridActivity.prototype.getNotificationUrl = function() {
        var self = this;
        return [self.getConfigValues().url]; 
    };

    /**
     * 
     */
    GridActivity.prototype.decorateGridConf = function(conf) {
        conf["height"] = "auto";

        /**
         * We want to display the show_unused filter as "showUnused" on page, but RESTAPI 
         * only accepts filter param with such format: "showUnused eq 'true'".
         * So we configure function 'onBeforeSearch' to reformat the "showUnused" token to meet API requirement.
         * Those grids who have configured onBeforeSearch in their configuration files (like VPN)
         * should implement this logic themselves if needed.
         */
        var onBeforeSearch = gridUtility.getOnBeforeSearchFunction();
        conf.filter = conf.filter ? conf.filter : {};
        conf.filter.onBeforeSearch = conf.filter.onBeforeSearch ? conf.filter.onBeforeSearch : onBeforeSearch;

        gridUtility.addColumnForPredefinedIdentifier(conf);
    };

    /**
     * Gets the generic grid view for the landing page and request supported events to be connected
     */
    GridActivity.prototype.getView = function() {
        var me=this;
        var conf = this.getConfigValues();
        this.decorateGridConf(conf);

        var View = (this.capabilities.list && this.capabilities.list.view) ?
                this.capabilities.list.view : GridView;

        var searchParams = gridUtility.getSearchParamsFromExtras(this.getIntent().getExtras());
        searchParams = searchParams ? [searchParams] : undefined;

        this.view = new View({
            conf: conf, 
            activity: this,
            search: searchParams,
            actionEvents: this.events
        });

        this.bindEvents();

        this.setContextMenuItemStatus(this.view.conf);
        this.addSelectAllCallback(this.view.conf);
        this.subscribeNotifications();
        if(!this.view.$el.hasClass(this.getContext()["ctx_name"])){
            this.view.$el.addClass(this.getContext()["ctx_name"]);
        }
        return this.view;
    };

    GridActivity.prototype.buildOverlay = function(view, options) {
        var self=this;
        this.overlay = new OverlayWidget({
            view: view,
            type: options.size || 'large',
            showScrollbar: true
        });

        this.overlay.build();
        if(!this.overlay.getOverlayContainer().hasClass(this.getContext()["ctx_name"])){
            this.overlay.getOverlayContainer().addClass(this.getContext()["ctx_name"]);
        }
    };

    /**
     * Create confirmation dialog based on param option.
     *
     * @param {Object} option - required.
     *
     * option object
     * title: title
     * question: question
     * onYesEvent: function invoked after clicking Yes button.
     * onNoEvent: function invoked after clicking No button
     * kind: string to indicate the kind of dialog box
     */
    GridActivity.prototype.createConfirmationDialog = function(option) {
        var self = this;
        _.extend(option, {
            yesButtonLabel: self.context.getMessage('yes'),
            noButtonLabel: self.context.getMessage('no'),
            yesButtonCallback: function() {
                /**
                 * When we try to create a new overlay in yesEvent handler, and invoke destroy here,
                 * the new created overlay will be destroyed as well. Guess the destroy method is looking for overlay by css calss.
                 * To avoid that issue, we recommend others to destroy this dialog in their yesEvent handler ( before the new overlay creation).
                 */
                //self.confirmationDialogWidget.destroy();
            },
            noButtonCallback: function() {
                self.confirmationDialogWidget.destroy();
            },
            yesButtonTrigger: 'yesEventTriggered',
            noButtonTrigger: 'noEventTriggered'
        });
        this.confirmationDialogWidget = new ConfirmationDialog(option);

        this.bindConfirmationEvents(option);
        this.confirmationDialogWidget.build();
    };

    /**
     * Bind event handler for confirmation dialog
     */
    GridActivity.prototype.bindConfirmationEvents = function(option) {
        var self = this;
        this.confirmationDialogWidget.vent.on('yesEventTriggered', function() {
            if (option.onYesEvent) {
                option.onYesEvent();
            }
        });
        this.confirmationDialogWidget.vent.on('noEventTriggered', function() {
            if (option.onNoEvent) {
                option.onNoEvent();
            }
        });
    };

    GridActivity.prototype.closeConfirmationDialog = function() {
        this.confirmationDialogWidget.destroy();
    };

    GridActivity.prototype.onListIntent = function() {
        this.setContentView(this.getView());
    };

    GridActivity.prototype.onListIntentWithCustomContainer = function() {
      var me = this, view = me.getView(),
      extras = me.getIntent().getExtras(), divId = '#'+extras['containerDiv'],
        customGridConf = extras['gridConfig'], customGridColumnConf = extras['colConfig'];
      _.extend(view.conf, customGridConf);
      var mergeColumns = function (destArr, sourceArr) {
        for(var i in destArr){
          for (var j in sourceArr)
            if (sourceArr[j].name === destArr[i].name) {
              _.extend(destArr[i], sourceArr[j]);
            }
        }
      };
      mergeColumns(view.conf.columns, customGridColumnConf);
      view.render();
      $( $.find(divId)).append(view.$el);
      $.find(divId)[0].__view = view;
    };

    GridActivity.prototype.onSelectIntent = function() {
        var options = this.getIntent().getExtras();
        var view = new this.capabilities.select.view({
            activity: this
        });
        this.overlay = new OverlayWidget({
            view: view,
            type: options.size || this.capabilities.select.size || 'medium',
            showScrollbar: true
        });
        this.overlay.build();
    };

    GridActivity.prototype.onReplaceIntent = function() {
        var options = this.getIntent().getExtras();

        var view = new this.capabilities.replace.view({
            activity: this,
            extras: options
        });
        this.overlay = new OverlayWidget({
            view: view,
            type: options.size || this.capabilities.replace.size || 'medium',
            showScrollbar: true
        });
        this.overlay.build();
    };

    GridActivity.prototype.getDuplicatesView = function(options) {
        var duplicatesgridConf = new options.gridConf(this.getContext()),
            mergeModel = new options.mergeModel(),
            mergeRbac = options.mergeRbac,
            deleteRbac = options.deleteRbac;

        this.duplicatesView = new DuplicatesView({
            activity: this,
            gridConf: duplicatesgridConf,
            mergeModel: mergeModel,
            mergeRbac: mergeRbac,
            deleteRbac: deleteRbac
        });
        return this.duplicatesView;
    };

    GridActivity.prototype.onShowDuplicatesIntent = function() {
        var options = this.getIntent().getExtras();
        var gridConfiguration = this.capabilities.showDuplicates.gridconfiguration,
            mergeModel = this.capabilities.showDuplicates.mergeModel,
            mergeRbac = this.capabilities.showDuplicates.mergeRbacCapabilities,
            deleteRbac = this.capabilities.showDuplicates.deleteRbacCapabilities;

            this.overlay = new OverlayWidget({
                view : this.getDuplicatesView({
                    'gridConf' : gridConfiguration,
                    'mergeModel' : mergeModel,
                    'mergeRbac' : mergeRbac,
                    'deleteRbac' : deleteRbac
                }),
                type: options.size || this.capabilities.showDuplicates.size || 'large',
                showScrollbar: true
            });
            this.overlay.build();
    };

    GridActivity.prototype.onAssignToDomainIntent = function() {
        var options = this.getIntent().getExtras();
        var assignToDomainView = new AssignToDomainView({
            activity: this,
            data: options
        });

        this.overlay = new OverlayWidget({
            view: assignToDomainView,
            type: options.size || this.capabilities.assignToDomain.size || 'medium',
            showScrollbar: true
        });
        this.overlay.build();
    };

    GridActivity.prototype.onCreateIntent = function() {
        var self = this,
        extras = this.getIntent().getExtras(),
        model = extras.model || this.getNewModelInstance(),
        viewClass = extras.view || this.capabilities.create.view;

        var view = new viewClass({
            activity: this,
            model: model
        });

        this.buildOverlay(view, this.capabilities.create);
    };

    GridActivity.prototype.getNewModelInstance = function() {
        return new this.model();
    };

    GridActivity.prototype.onEditIntent = function() {
        var self = this,
        extras = this.getIntent().getExtras(),
        viewClass = extras.view || this.capabilities.edit.view,
        id = extras.id;

        var model = this.getNewModelInstance();
        var view = new viewClass({
            activity: self,
            model: model
        });

        var onFetch = function() {
            self.buildOverlay(view, self.capabilities.edit);
        };

        var onError = function() {
            console.log('failed fetch');
            view.notify('error', self.getContext().getMessage(view.fetchErrorKey));
        };

        model.set('id', id);
        model.fetch({
            success: onFetch,
            error: onError
        });
    };

    GridActivity.prototype.onShowDetailViewIntent = function() {
        var self = this;
        var extras = this.getIntent().getExtras();
        var id = extras.id;

        var model = this.getNewModelInstance();

        var view = new self.capabilities.showDetailView.view({
            activity: self,
            model: model
        });
        if (!self.capabilities.showDetailView.size) {
            _.extend(self.capabilities.showDetailView, {"size": "medium"});
        }

        var onFetch = function() {
            self.buildOverlay(view, self.capabilities.showDetailView);
        };

        var onError = function() {
            console.log('failed fetch');
            view.notify('error', self.getContext().getMessage(view.fetchErrorKey));
        };

        model.set('id', id);
        model.fetch({
            success: onFetch,
            error: onError
        });
    };

    GridActivity.prototype.onCloneIntent = function() {
        var self = this,
        extras = this.getIntent().getExtras(),
        viewClass = extras.view || this.capabilities.clone.view,
        id = extras.id,
        model = new this.collection.model();

        this.collection.add(model);

        // Add clonable
        _.extend(model.constructor.prototype, Cloneable);

        var view = new viewClass({
            activity: self,
            model: model
        });

        var onFetch = function() {
            var clonePromise = model.cloneMe();

            $.when(clonePromise).done(function(cloneArgs) {
                self.buildOverlay(view, self.capabilities.clone);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                view.notify('error', self.getContext().getMessage(view.fetchCloneErrorKey));
            });
        };

        var onError = function() {
            console.log('failed fetch');
            view.notify('error', self.getContext().getMessage(view.fetchErrorKey));
        };

        model.set('id', id);
        model.fetch({
            success: onFetch,
            error: onError
        });
    };

    GridActivity.prototype.onImportIntent = function() {
        var options = this.getIntent().getExtras();
        var view = new this.capabilities.import.view({
            activity: this
        });
        this.overlay = new OverlayWidget({
            view: view,
            type: options.size || this.capabilities.import.size || 'medium',
            showScrollbar: true
        });
        this.overlay.build();
    };

    GridActivity.prototype.onExportIntent = function() {
        var extras = this.getIntent().getExtras();
        var view = new this.capabilities.export.view({
            activity: this,
            extras: extras
        });
    };

    GridActivity.prototype.getSelectedRows = function() {
        var extras = this.getIntent().getExtras();
        return extras.selectedRows;
    };

    GridActivity.prototype.onDeleteIntent = function() {
        var idArr = [],
        extras = this.getIntent().getExtras(),
        isSelectAll = extras.isSelectAll ? true : false,
        allRowIds = extras.allRowIds,
        selectedRows = this.getSelectedRows(),
        onDeleteSuccess = extras.onDeleteSuccess,
        onDeleteError = extras.onDeleteError;

        if (isSelectAll)
        {
            this.onDelete(allRowIds, onDeleteSuccess, onDeleteError);
        } else {
            idArr = _.pluck(selectedRows, 'id');
            this.onDelete(idArr, onDeleteSuccess, onDeleteError);
        }

    };

    GridActivity.prototype.getDeleteIDListObject = function (idArr) {
        return {'id-list': {'ids': idArr}};
    };

    GridActivity.prototype.onDelete = function(idArr, onDeleteSuccess, onDeleteError) {
        var self = this;
        self.beforeDeleteCallback();
        var dataObj = self.getDeleteIDListObject(idArr);
        $.ajax({
            type: 'POST',
            url: self.getDeleteObjectsUrl(),
            data: JSON.stringify(dataObj),
            headers: {
                "Content-Type": self.getDeleteObjectContentType(),
                "Accept": self.getDeleteObjectAcceptType()
            },
            dataType: "json",
            success: onDeleteSuccess,
            error: onDeleteError
        });
    };

  //Override this method in case some actions need to be done before delete starts
    GridActivity.prototype.beforeDeleteCallback = function(){};

    GridActivity.prototype.getDeleteObjectsUrl = function() {
        return new this.model().urlRoot + "/delete";
    };

    GridActivity.prototype.getDeleteObjectContentType = function() {
        return 'application/vnd.juniper.sd.bulk-delete+json;version=1;charset=UTF-8';
    };

    GridActivity.prototype.getDeleteObjectAcceptType = function() {
        return undefined;
    };

    GridActivity.prototype.deleteRow = function(selectedRows, success, error) {
        var selectedObjs = selectedRows.selectedRows;
        var selectedRowIds = selectedRows.selectedRowIds;
        var isSelectAll = selectedRows.allRowIds ? true : false;
        var allRowIds = selectedRows.allRowIds;
        this.startDeleteActivity(selectedObjs,isSelectAll,allRowIds, selectedRowIds);
    };

    GridActivity.prototype.onDeleteUnusedIntent = function() {
        var self = this;

        var confirmDialogConf = {
            title: this.getContext().getMessage('action_delete_unused_confirm_title'),
            question: this.getContext().getMessage('action_delete_unused_confirm_question'),
            onYesEvent: $.proxy(self.deleteUnused, self),
            xIcon: false,
            kind: 'warning'
        };
        this.createConfirmationDialog(confirmDialogConf);
    };

    GridActivity.prototype.deleteUnused = function() {
        var self = this;
        var extras = this.getIntent().getExtras();

        this.closeConfirmationDialog();

        self.progressBar = new progressBarForm({
            statusText: self.context.getMessage("action_delete_unused_progress_text"),
            title: self.context.getMessage("action_delete_unused_progress_title"),
            hasPercentRate: false
        });

        self.progressBarOverlay = new OverlayWidget({
            view: self.progressBar,
            type: 'small',
            showScrollbar: false
        });
        self.progressBarOverlay.build();

        var onDeleteUnusedSuccess = function() {
            extras.onDeleteUnusedSuccess();
            self.progressBarOverlay.destroy();
        };
        var onDeleteUnusedError = function() {
            extras.onDeleteUnusedError();
            self.progressBarOverlay.destroy();
        };

        var model = new self.model();
        $.ajax({
            type: 'DELETE',
            url: model.urlRoot + "/delete-unused",
            dataType: "json",
            success: onDeleteUnusedSuccess,
            error: onDeleteUnusedError
        });
    };

    GridActivity.prototype.bindCreateEvent = function() {
        this.events.createEvent = {name: "createAction"};
        if (this.capabilities.create.rbacCapabilities) {
            _.extend(this.events.createEvent, {
                capabilities: this.capabilities.create.rbacCapabilities
            });
        }
        this.view.$el.bind(this.events.createEvent.name, $.proxy(this.onCreateEvent, this));
    };

    GridActivity.prototype.bindFindUsageEvent = function() {
        this.events.findUsageEvent = {name: "findUsageAction"};
        if (this.capabilities.findUsage.rbacCapabilities) {
            _.extend(this.events.findUsageEvent, {
                capabilities: this.capabilities.findUsage.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_find_usage'),
            key: FIND_USAGE_KEY,
            isDisabled: $.proxy(this.isDisabledFindUsage, this.contextMenuScope || this)
        });

        this.view.$el.bind(this.events.findUsageEvent.name, $.proxy(this.onFindUsageEvent, this));
    };

    GridActivity.prototype.bindReplaceEvent = function() {
        this.events.replaceEvent = {name: "replaceAction"};
        if (this.capabilities.replace.rbacCapabilities) {
            _.extend(this.events.replaceEvent, {
                capabilities: this.capabilities.replace.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_replace'),
            key: REPLACE_KEY,
            isDisabled: $.proxy(this.isDisabledReplace, this.contextMenuScope || this)
        });
        this.view.$el.bind(this.events.replaceEvent.name, $.proxy(this.onReplaceEvent, this));
    };

    GridActivity.prototype.bindShowDuplicatesEvent = function() {
        this.events.showDuplicatesEvent = {name: "showDuplicatesAction"};
        if (this.capabilities.showDuplicates.rbacCapabilities) {
            _.extend(this.events.showDuplicatesEvent, {
                capabilities: this.capabilities.showDuplicates.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_show_duplicates'),
            key: 'showDuplicatesEvent'
        });
        this.view.$el.bind(this.events.showDuplicatesEvent.name, $.proxy(this.onShowDuplicatesEvent, this));
    };

    GridActivity.prototype.bindEditEvent = function() {
        this.events.updateEvent = {name: "editAction"};
        if (this.capabilities.edit.rbacCapabilities) {
            _.extend(this.events.updateEvent, {
                capabilities: this.capabilities.edit.rbacCapabilities
            });
        }
        this.view.$el.bind(this.events.updateEvent.name, $.proxy(this.onEditEvent, this));
    };

    GridActivity.prototype.bindShowDetailViewEvent = function() {
        this.events.quickViewEvent = {name: "showDetailViewAction"};
        if (this.capabilities.showDetailView.rbacCapabilities) {
            _.extend(this.events.quickViewEvent, {
                capabilities: this.capabilities.showDetailView.rbacCapabilities
            });
        }
        this.view.conf.contextMenu = this.view.conf.contextMenu || {};
        this.view.conf.contextMenu[SHOW_DETAIL_VIEW_KEY] = this.getContext().getMessage('action_detail_view');
        this.view.$el.bind(this.events.quickViewEvent.name, $.proxy(this.onShowDetailViewEvent, this));
    };

    GridActivity.prototype.bindClearAllSelectionsEvent = function() {
        this.events.clearAllEvent = {name: CLEAR_ALL_KEY};
        if (this.capabilities.clearAllSelections.rbacCapabilities) {
            _.extend(this.events.clearAllEvent, {
                capabilities: this.capabilities.clearAllSelections.rbacCapabilities
            });
        }
        this.view.conf.contextMenu = this.view.conf.contextMenu || {};
        this.view.conf.contextMenu[CLEAR_ALL_KEY] = this.getContext().getMessage('action_clear_all_selections');
        this.view.$el.bind(this.events.clearAllEvent.name, $.proxy(this.onClearAllSelectionsEvent, this));
    };

    GridActivity.prototype.bindCloneEvent = function() {
        this.events.cloneEvent = {name: "cloneAction"};
        if (this.capabilities.clone.rbacCapabilities) {
            _.extend(this.events.cloneEvent, {
                capabilities: this.capabilities.clone.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_clone'),
            key: CLONE_KEY,
            isDisabled: $.proxy(this.isDisabledClone, this.contextMenuScope || this)
        });

        this.view.$el.bind(this.events.cloneEvent.name, $.proxy(this.onCloneEvent, this));
    };

    GridActivity.prototype.bindImportEvent = function() {
        this.events.importEvent = {name: "importAction"};
        if (this.capabilities.import.rbacCapabilities) {
            _.extend(this.events.importEvent, {
                capabilities: this.capabilities.import.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_import_csv'),
            key: 'importEvent'
        });

        this.view.$el.bind(this.events.importEvent.name, $.proxy(this.onImportEvent, this));
    };

    GridActivity.prototype.bindExportEvent = function() {
        this.events.exportEvent = {name: "exportAction"};
        if (this.capabilities.export.rbacCapabilities) {
            _.extend(this.events.exportEvent, {
                capabilities: this.capabilities.export.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_export_csv'),
            key: 'exportEvent'
        });

        this.view.$el.bind(this.events.exportEvent.name, $.proxy(this.onExportEvent, this));
    };

    GridActivity.prototype.bindDeleteEvent = function() {
        this.events.deleteEvent = {name: "deleteAction"};
        if (this.capabilities["delete"].rbacCapabilities) {
            _.extend(this.events.deleteEvent, {
                capabilities: this.capabilities["delete"].rbacCapabilities
            });
        }
        this.view.$el.bind(this.events.deleteEvent.name, $.proxy(this.onDeleteEvent, this));
        this.view.conf.deleteRow  = {
            "onDelete": $.proxy(this.deleteRow, this)
        };
    };

    GridActivity.prototype.bindShowUnusedEvent = function() {
        this.events.showUnusedEvent = {name: "showUnusedAction"};
        if (this.capabilities.showUnused.rbacCapabilities) {
            _.extend(this.events.showUnusedEvent, {
                capabilities: this.capabilities.showUnused.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_show_unused'),
            key: 'showUnusedEvent'
        });
        this.view.$el.bind(this.events.showUnusedEvent.name, $.proxy(this.onShowUnusedEvent, this));
    };

    GridActivity.prototype.bindDeleteUnusedEvent = function() {
        this.events.deleteUnusedEvent = {name: "deleteUnusedAction"};
        if (this.capabilities.deleteUnused.rbacCapabilities) {
            _.extend(this.events.deleteUnusedEvent, {
                capabilities: this.capabilities.deleteUnused.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_delete_unused'),
            key: 'deleteUnusedEvent'
        });
        this.view.$el.bind(this.events.deleteUnusedEvent.name, $.proxy(this.onDeleteUnusedEvent, this));
    };

    GridActivity.prototype.bindAssignToDomainEvent = function() {
        var dataConf = new AssignToDomainFeatureRelatedConf(this.context),
            typeText = '',
            mimeType = this.intent.data.mime_type ? this.intent.data.mime_type : this.intent.data,
            dataObject = dataConf.getDataForAssignToDomain(mimeType);
        if(dataObject){
            typeText = dataObject.objectTypeText;
        }
        this.events.assignToDomainEvent = {name: "assignToDomainAction"};
        if (this.capabilities.assignToDomain.rbacCapabilities) {
            _.extend(this.events.assignToDomainEvent, {
                capabilities: this.capabilities.assignToDomain.rbacCapabilities
            });
        }
        addContextMenuItem(this.view.conf, {
            label: this.getContext().getMessage('action_assign_to_domain', [typeText]),
            key: ASSIGN_TO_DOMAIN_KEY,
            isDisabled: $.proxy(this.isDisabledAssignToDomain, this.contextMenuScope || this)
        });
        this.view.$el.bind(this.events.assignToDomainEvent.name, {'featureRelatedConf': dataObject}, $.proxy(this.onAssignToDomainEvent, this));
    };

    // Control the items in context menu
    GridActivity.prototype.isDisabledFindUsage = function(eventName, selectedRows) {
        // Check if it is single row selection
        if (!selectedRows || selectedRows.length != 1) {
            return true;
        }

        return false;
    };

    GridActivity.prototype.isDisabledEdit = function(eventName, selectedRows) {
        // Check if it is single row selection
        if (!selectedRows || selectedRows.length != 1) {
            return true;
        }

        // check whether default object is included in selected items
        if (this.isPredefinedObject(selectedRows)) {
            return true;
        }

        // If objects are in a different domain, they cannot be edited
        if (this.isDifferentDomain(selectedRows)) {
            return true;
        }

        return false;
    };

    GridActivity.prototype.isDisabledClone = function(eventName, selectedRows) {
        // Check if it is single row selection
        if (!selectedRows || selectedRows.length !=1 ) {
            return true;
        }

        return false;
    };

    GridActivity.prototype.isDisabledReplace = function(eventName, selectedRows) {
        // If no objects are selected, "replace" is disabled
        if (!selectedRows || selectedRows.length < 1)
        {
            return true;
        }

        // check whether default object is included in selected items
        if (this.isPredefinedObject(selectedRows)) {
            return true;
        }

        // If objects are in a different domain, they cannot be replaced
        if (this.isDifferentDomain(selectedRows)) {
            return true;
        }

        return false;
    };

    GridActivity.prototype.isDisabledAssignToDomain = function(eventName, selectedRows) {
        // Check if it is atleast single row selection
        if (!selectedRows || selectedRows.length < 1){
            return true;
        }

        // check whether default object is included in selected items
        if (this.isPredefinedObject(selectedRows)) {
            return true;
        }

        // If objects are in a different domain, they cannot be assigned to domain
        if (this.isDifferentDomain(selectedRows)) {
            return true;
        }

        return false;
    };

    GridActivity.prototype.isDisabledShowDetailView = function(eventName, selectedRows) {
        if (!selectedRows || selectedRows.length != 1)
        {
            return true;
        }

        return false;
    };

    GridActivity.prototype.isDisabledDelete = function(eventName, selectedRows) {
        // check whether default object is included in selected items
        if (this.isPredefinedObject(selectedRows)) {
            return true;
        }

        // If objects are in a different domain, they cannot be deleted
        if (this.isDifferentDomain(selectedRows)) {
            return true;
        }

        return false;
    };

    GridActivity.prototype.isDisabledEditButton = function(selectedRows) {
        // Check if it is single row selection
        if (!selectedRows || selectedRows.length != 1) {
            return true;
        }

        // check whether default object is included in selected items
        if (this.isPredefinedObject(selectedRows)) {
            return true;
        }

        // If objects are in a different domain, they cannot be edited
        if (this.isDifferentDomain(selectedRows)) {
            return true;
        }

        return false;
    };

    GridActivity.prototype.isDisabledDeleteButton = function(selectedRows) {
        // If no objects are selected, "delete" is disabled
        if (!selectedRows || selectedRows.length < 1)
        {
            return true;
        }

        // check whether default object is included in selected items
        if (this.isPredefinedObject(selectedRows)) {
            return true;
        }

        // If objects are in a different domain, they cannot be deleted
        if (this.isDifferentDomain(selectedRows)) {
            return true;
        }

        return false;
    };

    GridActivity.prototype.onEditResult = function(resultCode, data) {
        var self = this;
        if (resultCode == Slipstream.SDK.BaseActivity.RESULT_CANCELLED) {
            // Create a new object with specific data if edit failed
            if (data && data.action === Slipstream.SDK.Intent.action.ACTION_CREATE) {
                var intent_create = createNewIntent(self.getIntent(), data.action);
                intent_create.extras.model = data.model;

                // Start activity using the CREATE action and then add the result to the grid
                self.getContext().startActivityForResult(intent_create, function(resultCode, data) {
                    delete self.getIntent().extras.model;
                });
            }
        }
    };
 
    /**
     * Called when the create button is clicked
     */
    GridActivity.prototype.onCreateEvent = function() {
        var self = this;
        var intent = createNewIntent(this.getIntent(), Slipstream.SDK.Intent.action.ACTION_CREATE);

        // Start activity using the CREATE action and then add the result to the grid
        this.getContext().startActivity(intent);
    };

    /**
     * Called when edit is selected from menu
     */
    GridActivity.prototype.onEditEvent = function(e, row) {
        var self = this;
        var intent = createNewIntent(this.getIntent(), Slipstream.SDK.Intent.action.ACTION_EDIT);
        var id = row.originalRow.id;

        intent.putExtras({id: id});

        // Start activity using the EDIT action and then update the result in the grid
        this.getContext().startActivityForResult(intent, $.proxy(this.onEditResult, this));
    };

    GridActivity.prototype.onCloneEvent = function(e, selectedRows) {
        var self = this;
        var intent = createNewIntent(this.getIntent(), Slipstream.SDK.Intent.action.ACTION_CLONE);
        // TODO - Update when grid allows limiting action to single row
        var id = selectedRows.selectedRows[0].id;

        intent.putExtras({id: id});

        // Start activity using CLONE intent
        this.getContext().startActivity(intent);
    };

    GridActivity.prototype.onImportEvent = function() {
        var self = this;
        var intent = createNewIntent(this.getIntent(), Slipstream.SDK.Intent.action.ACTION_IMPORT);

        this.getContext().startActivity(intent);
    };

    GridActivity.prototype.onExportEvent = function(e, selectedObj) {
        var self = this, idArr = [];
        var intent = createNewIntent(this.getIntent(), Slipstream.SDK.Intent.action.ACTION_EXPORT);
        intent.putExtras({idArr: selectedObj.selectedRowIds});

        this.getContext().startActivity(intent);
    };

    /**
     * Action event when findUsage capability is enabled
     */
    GridActivity.prototype.onFindUsageEvent = function(e, selectedRows) {
        var key = this.capabilities.findUsage.key || DEFAULT_SEARCH_KEY;
        // TODO - Update when grid allows limiting action to single row
        var searchString =  selectedRows.selectedRows[0][key] + ' AND referenceIds:(' + selectedRows.selectedRows[0][SEARCH_KEY_ID] + ')';

        var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_SEARCH, {
            uri: new Slipstream.SDK.URI("search://")
        });
        intent.putExtras({query: searchString});

        this.getContext().startActivity(intent);
    };

    GridActivity.prototype.startDeleteActivity = function(selectedRows, isSelectAll, allRowIds, selectedRowIds) {
        var self = this;

        var intent = createNewIntent(this.getIntent(), IntentActions.ACTION_DELETE);
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
        intent.putExtras(extras);
        this.view.gridWidget.toggleRowSelection(selectedRowIds);
        this.getContext().startActivity(intent);
    };

    GridActivity.prototype.onDeleteSuccess = function(data){
        var self=this;
        self.view.notify('success', self.getContext().getMessage("delete_success"));
    };

    GridActivity.prototype.onDeleteError = function(XMLHttpRequest, textStatus, errorThrown, selectedRowIds, selectedRows) {
        if (XMLHttpRequest && selectedRows) {
            this.view.gridWidget.toggleRowSelection(selectedRowIds);
            var response = JSON.parse(XMLHttpRequest.responseText);
            if (response && "USED_DELETE" == response.title) {
                gridUtility.showDeleteReferenceError(response, this.context);
            } else {
                var errorMsg = gridUtility.getDeleteErrorMsg(response.failedObjectId, selectedRows, this.context);
                gridUtility.showDeleteErrMsg(errorMsg, this.context);
            }
        }
        this.view.gridWidget.reloadGrid();
        console.log("failed delete");
    };

    GridActivity.prototype.onDeleteEvent = function(e, selectedObj) {
        var selectedRows = selectedObj.deletedRows;
        var isSelectAll = selectedObj.isSelectAll;
        var allRowIds = selectedObj.selectedRows.allRowIds;
        this.startDeleteActivity(selectedRows,isSelectAll,allRowIds);
    };

    GridActivity.prototype.onShowUnusedEvent = function() {
        this.view.gridWidget.search(gridUtility.FILTER_KEY_SHOW_UNUSED, false);
    };

    GridActivity.prototype.onReplaceEvent = function(e, selectedObj) {
        var intent = createNewIntent(this.getIntent(), IntentActions.ACTION_REPLACE);
        intent.putExtras({selectedRows: selectedObj.selectedRows});

        this.getContext().startActivity(intent);
    };

    GridActivity.prototype.onShowDuplicatesEvent = function() {
        var self = this;
        var intent = createNewIntent(this.getIntent(), IntentActions.ACTION_SHOW_DUPLICATES);

        this.getContext().startActivity(intent);
    };

    GridActivity.prototype.onDeleteUnusedEvent = function() {
        var self = this;
        var intent = createNewIntent(this.getIntent(), IntentActions.ACTION_DELETE_UNUSED);
        intent.putExtras({
            onDeleteUnusedSuccess: function() {
                self.view.gridWidget.reloadGrid();
                self.view.notify("success", self.context.getMessage("action_delete_unused_succeed"));
            },

            onDeleteUnusedError: function() {
                self.view.notify("error", self.context.getMessage("action_delete_unused_failed"));
            }
        });

        this.getContext().startActivity(intent);
    };

    GridActivity.prototype.onAssignToDomainEvent = function(e, selectedRows) {
        var self = this;
        var intent = createNewIntent(this.getIntent(), IntentActions.ACTION_ASSIGN_TO_DOMAIN);
        intent.putExtras({'selectedRows': selectedRows, 'featureRelatedConf': e.data.featureRelatedConf});

        this.getContext().startActivity(intent);
    };

    GridActivity.prototype.onShowDetailViewEvent = function(e, row) {
        var intent = createNewIntent(this.getIntent(), IntentActions.ACTION_SHOW_DETAIL_VIEW);
        var id = row.selectedRowIds[0];

        intent.putExtras({id: id});
        this.getContext().startActivity(intent);
    };

    /**
     * just like a callback. Selections have been cleared by gridwidget before trigger this event.
     * App dev can do something after clearall here.
     */
    GridActivity.prototype.onClearAllSelectionsEvent = function(){
        console.log("clear al selections");
    };

    return GridActivity;
});
