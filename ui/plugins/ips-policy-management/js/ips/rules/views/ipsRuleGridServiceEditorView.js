/**
 * service editor view that will be used for selecting the services for IPS
 *
 * @module IPSRuleGridServiceEditorView
 * @author Damodhar M <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */


define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/dropDown/dropDownWidget',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    '../../../../../base-policy-management/js/policy-management/rules/conf/ruleGridServiceEditorConfiguration.js',
    '../../../../../object-manager/js/objects/models/serviceCollection.js',
    '../constants/ipsRuleGridConstants.js'
],function(Backbone, FormWidget, DropDownWidget, BaseCellEditor, Configuration,ServiceCollection,PolicyManagementConstants){

    var IPSRuleGridServiceEditorView = BaseCellEditor.extend({

        events: {
            'click #btnServiceOk': 'updateModelData',
            'click #linkCancel': 'closeOverlay',
            'click #default_service': 'defaultServiceHandler'
        },

        initialize: function(){
            this.context = this.options.context;
            this.model = this.options.model;
            this.serviceCollection = new ServiceCollection({
                urlRoot: PolicyManagementConstants.POLICY_URL +  "/services",
                acceptHeader: PolicyManagementConstants.RULE_ACCEPT_HEADER
                });
            this.formConfiguration = new Configuration(this.context).getConfig();
            this.formConfiguration.title = this.context.getMessage("fw_rules_editor_service_title") + " " + this.context.getMessage("ruleGrid_editor");;
            this.formConfiguration.heading_text = "";
            this.formConfiguration['title-help'] ={
                    "content": this.context.getMessage("rules_editor_serv_edit_title_info_tip"),
                    "ua-help-text": this.context.getMessage("more_link"),
                    "ua-help-identifier": this.context.getHelpKey("IPS_POLICY_CREATING")
                };
        },
        render :function(){
            var self = this, rule = this.model;
            this.form = new FormWidget({
                "elements": self.formConfiguration,
                "container": self.el
            });

            this.form.build();

            var serviceEditor = this.$el.find('#service_editor').parent();
            $(serviceEditor).empty();
            var $span =  $(serviceEditor).append('<select class="serviceeditor"  style="width: 100%"></select>');
            var widgetConf = {
                "container": $span.find('.serviceeditor'),
                "data": [],
                "enableSearch": true
            };

            if (rule.get('global-rule') === true) {
                widgetConf.multipleSelection = { allowClearSelection: true };
            }
            widgetConf.placeholder = "Select an option";
            this.serviceDropDown = new DropDownWidget(widgetConf).build();

            this.loadservicesAndSetDropdownValue(rule);
            this.$el.find('#add-new-button').unbind('click').bind('click', $.proxy(this.createNewValueInListBuilder, this));
            this.$el.find('#default_service').unbind('click').bind('click', $.proxy(this.defaultServiceHandler, this));
            this.actionOnDefaultService(rule);

            return this;
        },

        //Below method check if service is Default or not .If service is Default then list of all available services will be hidden
        actionOnDefaultService: function(rule){
            var self = this,service = rule.get("application");
            if(!$.isEmptyObject(service)){
              if(service['name'] == 'Default'){
                 self.$el.find('#default_service').attr("checked", true);
                 self.hideDropdown(true);
              }
            }
        },

        createNewValueInListBuilder: function (e) {
            // launch the 'create object value' screens from objects
                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                    {
                        mime_type: 'vnd.juniper.net.services'
                    }
                );
                this.context.startActivityForResult(intent, $.proxy(this.updateNewValueInList, this));
           
        },

        updateNewValueInList: function (resultCode, data) {
            var self = this;

            // Based on result inject the newly created value in list builder
            if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {
                    // Add the newly created object in list of selected items.
                    //Need to reload services and pass service id 
                   self.loadservicesAndSetDropdownValue("",data.id);

            }
        },
        loadservicesAndSetDropdownValue: function (rule,serviceId) {
            var self = this;

            //self.serviceCollection.setGlobalRule(self.model.get('global-rule'));

            self.serviceCollection.fetch({
                success :function(collection, response, options){
                    var serviceEditor = self.serviceDropDown;

                    /*//get services from model
                    var servicesArr = self.getServices();
                    if (servicesArr) { 
                        servicesArr.forEach(function (service) {
                            serviceNamesArr.push(service.name);
                        });
                    }*/
                    // append the rest of the services from backend on to the option list for services
                    var services = response.services.service,
                        selectData = [];
                    if(services.length > 0){
                            services.forEach(function (service){
                                var serviceName=service.name+'('+service['domain-name']+')';   
                                selectData.push({"id":service.id,"text":serviceName});
                            });
                    }/*else{
                        for (var i=0; i < services.length; i++) {
                            var service = services[i].name;
                            selectData.push({id:service,text:service});
                        }
                    }*/
                    serviceEditor.addData(selectData);
                    serviceEditor.setValue([]);
                    //If selected rule has any service then set that value to dropdown 
                    if(!$.isEmptyObject(rule)){
                        var service = rule.get("application");
                            if(!$.isEmptyObject(service)){
                              if(service['name'] != 'Default'){
                                 serviceEditor.setValue(service['id']);
                            }
                        }
                     }
                     //If new service is added then set that value to dropdown
                     if(serviceId != undefined){
                        serviceEditor.setValue(serviceId);
                     }   
                },
                error: function() {
                    console.log('service collection not fetched');
                }
            });
        },

        hideDropdown: function (hide) {
            if (hide) {
                $(this.$el.find(".service-dropdown")).css('visibility','hidden');
            } else {
                this.$el.find(".service-dropdown").css('visibility', 'visible');
            }
        },

        defaultServiceHandler: function () {
            if (this.$el.find('#default_service').is(":checked")) {
                this.hideDropdown(true);
            } else {
                this.hideDropdown(false);
            }
        },

        updateModelData : function(e) {
           // "services":{"service-reference":[{"href":"/api/juniper/sd/service-management/services/164590",
           //"id":164590,"domain-id":2,"domain-name":"Global","name":"ace_5500"},{"href":"/api/juniper/sd/service-management/services/165337","id":165337,"domain-id":2,"domain-name":"Global","name":"AD-4029"}]}}]}}}
            var self = this,
                selectedServiceID = this.serviceDropDown.getValue(),
                selectedServiceName = this.$el.find('.serviceeditor').select2('data'),
                servicesArr=[];
           
            //If default service is selected then then pass service as "Default"
            if (this.$el.find('#default_service').is(":checked")) {
                serviceObj = {"name":"Default", "id":0,"domain-id":3};
            } else {
                    // If service is not selected from dropdown then show error
                    if ($.isEmptyObject(selectedServiceName[0])) {
                            self.form.showFormError(self.context.getMessage("ips_rules_editor_service_empty_error"));
                            return;
                    }
                    else{
                        serviceObj = {"name":selectedServiceName[0].text.split('(')[0], "id": selectedServiceID,"domain-id":3};
                    }
            }
            this.model.set( {
                "application" : serviceObj
            });
            this.editCompleted(e,this.model);
        },

        setCellViewValues: function (rowData) {
            // to get the values from the grid cell in this view
            this.model = this.options.ruleCollection.get(rowData.originalRowData[PolicyManagementConstants.JSON_ID]);
        }

    });
    return IPSRuleGridServiceEditorView;

});