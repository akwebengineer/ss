/**
 * Created by wasima on 7/17/15.
 */

/**
 * A module that works with ips-sigs.
 *
 * @module IP Signature Activity
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../../ui-common/js/gridActivity.js',
    './conf/ipsSigGridConfiguration.js',
    './models/ipsSigModel.js',
    './views/ipsSigFormView.js',
    './views/ipsSigStaticGroupFormView.js',
    './views/ipsSigDynamicGroupFormView.js',        
    './models/ipsSigCollection.js',
    '../../../ui-common/js/models/cloneable.js',
    './views/ipsSigDetailFormView.js',
    './views/ipsSigAdvancedSearchFormView.js',
    './views/ipsSigStaticGroupDetailFormView.js',
    './views/ipsSigDynamicGroupDetailFormView.js'
], function(GridActivity, GridConfiguration, Model, View, StaticGroupView, DynamicGroupView, Collection,Cloneable, ViewDetails, AdvancedSearchFormView,ViewGroupDetails,DynamicGroupDetails) {

    /**
     * Constructs a IP SignatureActivity.
     */
    var IPSSignatureActivity = function() {
        this.capabilities = {
            "create": {
                view: View,
                rbacCapabilities: ["createIDPSig"]
            },
            "edit": {
                view: View,
                rbacCapabilities: ["modifyIDPSig"]
            },
            "clone":{
                view: View,
                rbacCapabilities: ["createIDPSig"]
            },
            "createStaticGroup":{
                view: StaticGroupView,
                rbacCapabilities: ["createIDPSig"]
            },
            "createDynamicGroup":{
                view: DynamicGroupView,
                rbacCapabilities: ["createIDPSig"]
            },            
            "delete":{
                rbacCapabilities: ["deleteIDPSig"]
            },
            "showDetailView": {
                view: ViewDetails         
            }
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
        this.collection = new Collection(); 
        this.actionEvents = {
            "createIpsSigEvent":"createIpsSigEvent",
            "createIpsSigStaticGroupEvent":"createIpsSigStaticGroupEvent",
            "createIpsSigDynamicGroupEvent":"createIpsSigDynamicGroupEvent"
        };
        this.bindEvents = function() {
            //Calling super.bindEvents;
            GridActivity.prototype.bindEvents.call(this);
            
            if (this.capabilities.createStaticGroup) {
                this.bindCreateStaticGroupEvent();
            }
            if (this.capabilities.createDynamicGroup) {
                this.bindCreateDynamicGroupEvent();
            }       
            //TODO item. Once framework provides support, we need to move events on options Menu.
            this.bindViewAdvancedFilterEvent(); 
        };
        this.onShowDetailViewIntent = function() {
            var self = this;
            var extras = this.getIntent().getExtras();
            var id = extras.id;
            var model = new this.model();

            var onFetch = function(model, response, options) {
                if(response['ips-signature']['sig-type'] == "static"){
                    self.capabilities.showDetailView.view = ViewGroupDetails;      
                }else if(response['ips-signature']['sig-type'] == "dynamic"){
                    self.capabilities.showDetailView.view = DynamicGroupDetails;      
                }
                var view = new self.capabilities.showDetailView.view({
                               activity: self,model: model});
                if (!self.capabilities.showDetailView.size) {
                _.extend(self.capabilities.showDetailView, {"size": "medium"});
                }
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
         /**
         * Called when the create static group context menu on CreateStaticGroupEventitem is clicked
         */
        this.onCreateIpsSigEvent = function() {
              var options = this.getIntent().getExtras(),
                  model = new this.model();

              model.formMode = "CREATE";

              var view= new View({ activity: this, model: model });
              this.buildOverlay(view, options);
        };         
        this.onCreateStaticGroupEvent = function() {
            var options = this.getIntent().getExtras(),
                model = new this.model();

            if(this.view.gridWidget.getSelectedRows().length > 0) {
                model.selectedRows = this.view.gridWidget.getSelectedRows();
                model.type='staticgroup';
            }
            model.formMode = "CREATE";

            var view= new StaticGroupView({activity: this,model: model});
            options.size = "xlarge";
            this.buildOverlay(view, options);
        };
        this.onCreateDynamicGroupEvent = function() {
            var options = this.getIntent().getExtras(),
                model = new this.model();

            model.formMode = "CREATE";

            var view= new DynamicGroupView({activity: this,model: model});
            this.buildOverlay(view, options);
        };
        this.onViewAdvancedFilterEvent = function() {
            var options = this.getIntent().getExtras(),
            view= new AdvancedSearchFormView({activity: this});
            this.buildOverlay(view, options);
        };          
        this.bindCreateEvent = function() {
             /*this.addContextMenuItem(this.view.conf, {
                 label: this.getContext().getMessage('ips_sig_create_title'),
                 key: 'createIpsSigEvent'
             });*/
            this.events.createIpsSigEvent = {
                name: "createAction",
                capabilities: ['createIDPSig']
            };
            this.view.$el.bind(this.events.createIpsSigEvent.name, $.proxy(this.onCreateIpsSigEvent, this));
        };
        this.bindCreateStaticGroupEvent = function() {
          /*  this.addContextMenuItem(this.view.conf, {
                label: 'Create Static Group',
                key: 'createIpsSigStaticGroupEvent'
            });*/
            this.events.createIpsSigStaticGroupEvent = {
                name: "createStaticGroupAction",
                capabilities: ['createIDPSig']
            };
            this.view.$el.bind(this.events.createIpsSigStaticGroupEvent.name, $.proxy(this.onCreateStaticGroupEvent, this));
        };
        this.bindCreateDynamicGroupEvent = function() {
           /* this.addContextMenuItem(this.view.conf, {
                label: 'Create Dynamic Group',
                key: 'createIpsSigDynamicGroupEvent'
            });*/
            this.events.createIpsSigDynamicGroupEvent = {
                name: "createDynamicGroupAction",
                capabilities: ['createIDPSig']
            };
            this.view.$el.bind(this.events.createIpsSigDynamicGroupEvent.name, $.proxy(this.onCreateDynamicGroupEvent, this));
        };
        this.bindViewAdvancedFilterEvent = function() {
            this.events.viewAdvancedFilterEvent = "viewAdvancedFilterAction";
            this.view.$el.bind(this.events.viewAdvancedFilterEvent, $.proxy(this.onViewAdvancedFilterEvent, this));
        };

        this.bindViewEvent = function() {
            this.addContextMenuItem(this.view.conf, {
                label: "View Details",
                key: 'createIPSSigViewEvent'
            });
            this.events.createIPSSigViewEvent = "createViewAction";
            this.view.$el.bind(this.events.createIPSSigViewEvent, $.proxy(this.onViewEvent, this));
        };
        this.onEditEvent = function(e, row) {
            var self = this;
            var intent = this.createNewIntent(this.getIntent(), Slipstream.SDK.Intent.action.ACTION_EDIT);
            var id = row.originalRow.id;
            if(row.originalRow["definition-type"] != "PREDEFINED"){

                intent.putExtras({id: id,type:row.originalData['sig-type']});

                // Start activity using the EDIT action and then update the result in the grid
                this.getContext().startActivityForResult(intent, function(resultCode, data) {
                    if (resultCode == Slipstream.SDK.BaseActivity.RESULT_OK) {
                        // Update result in grid
                        self.view.gridWidget.editRow(row.originalRow, data);
                    } else if (resultCode == Slipstream.SDK.BaseActivity.RESULT_CANCELLED) {
                        // Create a new object with specific data
                        if (data && data.action === Slipstream.SDK.Intent.action.ACTION_CREATE) {
                            var intent_create = createNewIntent(self.getIntent(), Slipstream.SDK.Intent.action.ACTION_CREATE);
                            intent_create.extras.model = data.model;

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
             }
        };

        this.onEditIntent = function() {
            var self = this;
            var extras = this.getIntent().getExtras();
            var id = extras.id;
            var type = extras.type;
            var model = new this.model();
            model.formMode ="EDIT";

            //IPS Sig View is used for type = 'signature', 'anomaly' or 'chain'
            if(type == "static") {
                self.capabilities.edit.view = StaticGroupView;
                self.capabilities.edit.size = "xlarge";
            } else if(type == "dynamic") {
                self.capabilities.edit.view = DynamicGroupView;
            }

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
            self.capabilities.clone.view = View;

            intent.putExtras({id: id,type:selectedRows.selectedRows[0]['sig-type']});

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

            if(type === "Static Group") {
                self.capabilities.clone.view = StaticGroupView;
                self.capabilities.clone.size = "xlarge";
            } else if(type === "Dynamic Group") {
                self.capabilities.clone.view = DynamicGroupView;
            }   
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
    };


    IPSSignatureActivity.prototype = new GridActivity();    

    return IPSSignatureActivity;
});
