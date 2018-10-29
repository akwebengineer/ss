/**
 * A module that launches create active directory wizard - Settings Page.
 *
 * @module activeDirectorySettingsView
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/


define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/activeDirectorySettingsFormConf.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js',
    '../conf/domainSettingsGridConf.js',
    'widgets/overlay/overlayWidget',
    './activeDirectoryDomainSettingFormView.js'
], function (
    Backbone,
    Syphon,
    FormWidget,
    GridWidget,
    FormConf,
    ValidationUtility,
    DomainSettingsGridConf,
    OverlayWidget,
    DomainSettingFormView
    ) {

    var FormView = Backbone.View.extend({
        /**
         * Initialize Backbone view
         * @param options
         */
        initialize: function(options) {

            this.context = this.options.context;
            this.model = this.options.model;
            this.wizardView = this.options.wizardView;



        },
        updateDomainSettingCollection: function(){
            this.domainCollection = new Backbone.Collection();
           var domains = this.model.get('domains');
            if(domains && domains.domain.length > 0){
                for(var i =0; i<domains.domain.length; i++){
                    this.domainCollection.add(new Backbone.Model(domains.domain[i]));
                }
            }

        },
        /**
         * build form widget and grid widget 
         * @returns {LdapServerGridView}
         */

          render: function () {
            var self = this, container, formConfiguration = new FormConf(this.context, this.formMode),
                formElements = formConfiguration.getValues(),
                gridConfiguration = new DomainSettingsGridConf(self.context),
                elements = gridConfiguration.getValues(),
                domains = [];
            
            // add form
            this.formWidget = new FormWidget({
                "container": this.el,
                elements: formElements
            }).build();
            this.updateDomainSettingCollection();
            container = self.$el.find('#active_directory_domain_settings').empty();
            
            self.gridWidget = new GridWidget({
                container: container,
                actionEvents : {createEvent: "addEvent", updateEvent: "editEvent",deleteEvent: "deleteAction"},
                elements: elements
            }).build();
            
            container.find(".grid-widget").addClass("elementinput-ldap-server-grid");
            
            self.bindGridEvents();
            domains = self.model.get('domains');
            if(domains && domains.domain.length>0){
                self.addGridData(domains.domain);
            }

            
            return self;
        },
        /**
         * bind add and edit event to the Domain settings grid
         */
        bindGridEvents: function () {
            var self = this;
            self.$el.bind( "addEvent", $.proxy(self.onAddDomainSettings, self));
            self.$el.bind( "editEvent", $.proxy(self.onEditDomainSettings, self));
            self.$el.bind( "deleteAction", $.proxy(self.onDeleteDomainSettings, self));

        },
        /**
         * add Domain settings event handler
         */
        onAddDomainSettings: function(){
            this.buildDomainSettingsOverlay();
        },
        /**
         * edit Domain settings event handler
         */
        onEditDomainSettings: function(e, row){
            this.buildDomainSettingsOverlay(row);
        },
        /**
         * edit Domain settings event handler
         */
        onDeleteDomainSettings: function(e, row){
            for(var i = 0; i< row.deletedRows.length; i++){
                this.domainCollection.remove(this.domainCollection.where({'domain-name':row.deletedRows[i]['domain-name']}));
            }
        },
        /**
         * buit overlay for add/edit Domain settings view
         * @param row
         */
        buildDomainSettingsOverlay: function(row){
            this.overlay = new OverlayWidget({
                view : new DomainSettingFormView({activity:this, rowData:row}),
                type : 'large',
                showScrollbar : true
            }).build();
            this.updateOverlayClass();

        },
        /**
         * update overlay container with ctx_name class
         */
        updateOverlayClass: function(){
            var self=this,
                overlayContainers = self.overlay.getOverlayContainer(),
                overlayContainer = $(overlayContainers[1] || overlayContainers[0]);
            if(!overlayContainer.hasClass(self.context["ctx_name"])){
                overlayContainer.addClass(self.context["ctx_name"]);
            }
        },
        /**
         * fetch grid data
         * @returns {grid visible rows}
         */
        getAllVisibleRows: function(){
            return this.gridWidget.getAllVisibleRows();
        },
        addGridData: function(data){
            for(var i = 0;i< data.length; i++){
                this.gridWidget.addRow(data[i])
            }
        },
        /**
         * Returns summary info
         * @returns {Array}
         */
        getSummary: function () {
            var summary = [], self = this, domain = self.model.get("domains")['domain'];
            if(domain && domain.length > 0){
                summary.push({
                    label: self.context.getMessage('grid_column_domain'),
                    value: ' '
                });
                summary.push({
                    label: self.context.getMessage('domains'),
                    value: domain[0]['domain-name'] + (domain.length>1 ? " (+"+(domain.length -1) +")" : "")
                });

            }

            return summary;

        },
        getTitle: function () {
            return this.context.getMessage('grid_column_domain');
        },

        /**
         * Sets the data in model before page changes. Blokc navigation of the form is invalid
         * @param currentStep
         * @param requestedStep
         * @returns {boolean}
         */
        beforePageChange: function (currentStep, requestedStep) {

            var self = this;
            self.model.set(self.getPageData());
            if (currentStep > requestedStep) {
                return true; // always allow to go back
            } else if(self.domainCollection.models.length === 0){
                self.formWidget.showFormError(self.context.getMessage('active_directory_domain_settings_validation_msg'));
                return false;
            }

            return true;
        },

        /**
         * Returns the page data which need to be set in the model before moving to the next page
         */
        getPageData: function () {
            var data = {'domains':{'domain':[]}};
            
            for(var i =0; i<this.domainCollection.models.length; i++){
                data.domains.domain.push(this.domainCollection.models[i].attributes);
            }
            
            return data;

        },


    });

    return FormView;
});