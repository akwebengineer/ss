/**
 * Created by vinutht on 5/14/15.
 */

/**
 * A module that works with app-sigs.
 *
 * @module Application Signature Activity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/appsigGridConfiguration.js',
    './models/appsigModel.js',
    './views/appsigFormView.js',
    './views/appsigFormViewGroup.js',
    './views/appSigFormDetailedView.js',
    './models/appsigCollection.js',
    '../../../ui-common/js/models/cloneable.js'
],  function(GridActivity, GridConfiguration, Model, View ,ViewGroup, ViewDetails,Collection,Cloneable) {
    /**
     * Constructs a ApplicationSignatureActivity.
     */

    var ApplicationSignatureActivity = function() {
        this.capabilities = {
            "create": {
                view: ViewGroup,
                rbacCapabilities:['createAppSig']
            },
            "edit": {
                view: ViewGroup,
                rbacCapabilities:['modifyAppSig']
            },
            "clone":{
                view: ViewGroup,
                rbacCapabilities:['createAppSig']
            },
            "creategroup":{
                view: ViewGroup,
                rbacCapabilities:['createAppSig']
            },
            "delete":{
             rbacCapabilities:['deleteAppSig']
            },
            "findUsage": {},
            "showDetailView":{
             "view":ViewDetails,
             "size":"medium"
            }
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection();
        this.actionEvents = {
               /* "createAppSigEvent":"createAppSigEvent",*/
                "createAppSigGroupEvent":"createAppSigGroupEvent"
        };

        this.bindEvents = function() {
            GridActivity.prototype.bindEvents.call(this);
            if(this.capabilities.creategroup){
                 this.bindCreateGroupEvent();
            }
        };
         /**
         * Called when the create group context menu ionCreateGroupEventtem is clicked
         */
        this.onCreateGroupEvent = function() {
              var self = this,model,
              options = this.getIntent().getExtras();model = new this.collection.model();

              if(this.view.gridWidget.getSelectedRows().length > 0) {
                model.selectedRows = this.view.gridWidget.getSelectedRows();
                }
              model.formMode = "CREATE";

              var view= new ViewGroup({activity: this,model: model});
              this.buildOverlay(view, options);
        };

         this.onCreateEvent = function() {
            var self = this;
            this.onCreateGroupEvent();
        };

        this.bindCreateGroupEvent = function() {
            this.addContextMenuItem(this.view.conf, {
                label: this.getContext().getMessage('action_create_group'),
                key: 'createAppSigGroupEvent'
            });
            this.events.createAppSigGroupEvent = "createGroupAction";
            this.view.$el.bind(this.events.createAppSigGroupEvent, $.proxy(this.onCreateGroupEvent, this));
        };
         /**
         * Called when edit is clicked
         */
        this.onEditEvent = function(e, row) {
            var self = this;
            var intent = this.createNewIntent(this.getIntent(), Slipstream.SDK.Intent.action.ACTION_EDIT);
            var id = row.originalRow.id;

            intent.putExtras({id: id,type:row.originalRow.type});

            // Start activity using the EDIT action and then update the result in the grid
            this.getContext().startActivityForResult(intent, function(resultCode, data) {
                if (resultCode == Slipstream.SDK.BaseActivity.RESULT_OK) {
                    // Update result in grid
                    self.view.gridWidget.editRow(row.originalRow, data);
                } else if (resultCode == Slipstream.SDK.BaseActivity.RESULT_CANCELLED) {
                    // Create a new object with specific data
                    if (data && data.action === Slipstream.SDK.Intent.action.ACTION_CREATE) {
                        var intent_create = self.createNewIntent(self.getIntent(), Slipstream.SDK.Intent.action.ACTION_CREATE);
                         intent_create.extras.model = data.model;
                         intent_create.extras.model.formMode = "CREATE";
                         intent_create.extras.model.type = "group";

                        // Start activity using the CREATE action and then add the result to the grid
                        self.getContext().startActivityForResult(intent_create, function(resultCode, data) {
                            delete self.getIntent().extras.model;
                            if (resultCode == Slipstream.SDK.BaseActivity.RESULT_OK) {
                                // Add result to grid
                                //self.view.gridWidget.addRow(data);
                            }
                        });
                    }
                }
            });
        };
        this.onEditIntent = function() {
            var self = this;
            var extras = this.getIntent().getExtras();
            var id = extras.id;
            var type = extras.type;
            var model = new this.model();
            model.formMode ="EDIT";

            var view = new self.capabilities.edit.view({
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

       this.onCloneEvent = function(e, selectedRows) {
            var self = this;
            var intent = this.createNewIntent(this.getIntent(), Slipstream.SDK.Intent.action.ACTION_CLONE);
            // TODO - Update when grid allows limiting action to single row
            var id = selectedRows.selectedRows[0].id;
                        self.capabilities.clone.view = ViewGroup;

            intent.putExtras({id: id,type:selectedRows.selectedRows[0].type});

            // Start activity using CLONE intent
            this.getContext().startActivityForResult(intent, $.proxy(function(resultCode, data) {
                 if (resultCode == Slipstream.SDK.BaseActivity.RESULT_OK) {
                         // Add result to grid
                         //this.view.gridWidget.addRow(data);
                 }
            }, this));
        };

        this.onCloneIntent = function() {
            var self = this;
            var extras = this.getIntent().getExtras();
            var id = extras.id;
            var type = extras.type;

            var model = new this.collection.model();
            this.collection.add(model);

            // Add clonable
            _.extend(model.constructor.prototype, Cloneable);

            model.formMode ="CLONE";

            var view = new self.capabilities.clone.view({
                activity: self,
                model: model
            });

            var onFetch = function() {
                clonePromise = model.cloneMe();

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
        this.onShowDetailViewEvent = function(e, row) {
           var self = this,view,
               id = row.selectedRowIds[0],
               options = this.getIntent().getExtras(),model = new this.collection.model();
               model.selectedRows = row.selectedRows[0];
               model.formMode ="VIEW";
               self.model = model;

               if (!self.capabilities.showDetailView.size) {
                  _.extend(self.capabilities.showDetailView, {"size": "medium"});
               }
               if(row.selectedRows[0].type == "Application group") {
                   model.formMode ="VIEWGROUP";
               }
               view = new self.capabilities.showDetailView.view({activity: self});

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
           this.isDisabledClone = function(eventName, selectedRows) {
                // Check if it is single row selection
            if(selectedRows.length === 1 && selectedRows[0] && (selectedRows[0].type.toLowerCase() === "application group" || selectedRows[0].type.toLowerCase() === "group")){
                return false;
            }
           return true;
           };
   };
    ApplicationSignatureActivity.prototype = new GridActivity();

    return ApplicationSignatureActivity;
});

