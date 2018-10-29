/**
 * Module that implements the devicetemplateActivity
 *
 * @module devicetemplateActivity
 * @author Vivek Kumar <vkumar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../ui-common/js/gridActivity.js',
    './conf/deviceTemplatesGridConf.js',
    './views/deviceTemplatesView.js',
    './models/deviceTemplatesModel.js',
    './common/constant/deviceTemplatesConstant.js',
    './models/deviceTemplatesCollection.js',
    './views/deviceTemplatesDetailedView.js',
    'widgets/confirmationDialog/confirmationDialogWidget',
    '../../../../ui-common/js/models/cloneable.js'
], function(
    GridActivity, DeviceTemplatesGridConf, DeviceTemplatesView, DeviceTemplateModel,DeviceConstant,DeviceTemplatesCollection,DeviceTemplatesDetailedView,ConfirmationDialog,Cloneable) {
    /**
     * Construct a DeviceTemplatesActivity
     */


  var DevicetemplateActivity = function() {
        GridActivity.call(this);
        this.capabilities = {
            "create": {
                view: DeviceTemplatesView,
                rbacCapabilities: ["CreateTemplate"]
            },
            "edit": {
                view: DeviceTemplatesView,
                rbacCapabilities: ["ModifyTemplate"]
            },
            "clone": {
                view: DeviceTemplatesView,
                rbacCapabilities: ["CreateTemplate"]
            },
            "delete": {
                rbacCapabilities: ["DeleteTemplate"]
            },
            "showDetailView": {
                view: DeviceTemplatesDetailedView
            }
        };

        this.gridConf = DeviceTemplatesGridConf;
        this.model = DeviceTemplateModel;
        this.collection = new DeviceTemplatesCollection();
        
        /* This API is overriden for Delete call in the landing grid*/
        this.onDelete = function(idArr, onDeleteSuccess, onDeleteError) {
            var self = this;
            this.responseCount=0;
            this.requestCount=idArr.length;
            this.isFailed =false;
            idArr.forEach(function(id) {
                var dataObj = {
                    'delete-config-template-with-versions-request': 
                    {
                        'template-id-with-ver': {
                            "template-id-with-ver":id+':1'
                        }
                    }
                };

                //console.log("Deleting the template");
                $.ajax({
                    type: 'DELETE',
                    url:  DeviceConstant.TEMPLATE_DELETE_FINAL_URL,
                    data: JSON.stringify(dataObj),
                    headers: {
                        "Content-Type": DeviceConstant.TEMPLATE_DELETE_FINAL_CONTENT_TYPE
                    },
                    dataType: "json",
                   success:function(){
                     self.notifyMessage(onDeleteSuccess,onDeleteError);
                   },
                   error:function(){
                     self.isFailed=true;
                     self.notifyMessage(onDeleteSuccess,onDeleteError);
                   }
                  });
            });    
        };
        this.notifyMessage = function(onDeleteSuccess,onDeleteError) {
            this.responseCount++;
            if(this.responseCount===this.requestCount){   
                if(!this.isFailed){
                    onDeleteSuccess();
                }else{
                    onDeleteError();
                }
            }
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
                if(model.get("config-type")==="CONFIG_TEMPLATE"){
                    self.createConfirmationDialog({
                        title:self.getContext().getMessage("device_templates_grid_edit"),
                        question:self.getContext().getMessage("device_templates_edit_error_msg"),
                        yesButtonLabel:self.getContext().getMessage("device_templates_error_msg_ok_button")
                        });
                    return;
                }
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
        this.onCloneIntent = function() {
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
                if(model.get("config-type")==="CONFIG_TEMPLATE"){
                        self.createConfirmationDialog({
                            title:self.getContext().getMessage("device_templates_grid_clone"),
                            question:self.getContext().getMessage("device_templates_clone_error_msg"),
                            yesButtonLabel:self.getContext().getMessage("device_templates_error_msg_ok_button")
                            });
                        return;
                }
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
        /**
         * Create a confirmation dialog with basic settings
         * Need to specify title, question, and event handle functions in "option"
         */
        this.createConfirmationDialog= function(option) {
            var self=this;
            this.confirmationDialogWidget = new ConfirmationDialog({
                title: option.title,
                kind:'warning',
                question: option.question,
                yesButtonLabel: option.yesButtonLabel,
                yesButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                }
            });
            this.confirmationDialogWidget.build();
        };
    };
    DevicetemplateActivity.prototype = Object.create(GridActivity.prototype);
    DevicetemplateActivity.prototype.constructor = DevicetemplateActivity;

    return DevicetemplateActivity;
});