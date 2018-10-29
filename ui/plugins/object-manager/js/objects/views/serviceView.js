/**
 * The service view to create a specific service
 * 
 * @module ServiceView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/overlay/overlayWidget',
    'widgets/grid/lib/tooltipBuilder',
    '../conf/serviceFormConfiguration.js',
    '../conf/serviceFormProtocolGridConfiguration.js',
    '../models/serviceCollection.js',
    '../widgets/serviceListBuilder.js',
    './serviceProtocolView.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../../../../ui-common/js/common/utils/validationUtility.js'
], function (Backbone, Syphon, FormWidget, GridWidget, OverlayWidget, TooltipBuilder, ServiceForm, ProtocolGrid, Collection, ListBuilder, ProtocolView, ResourceView, ValidationUtility) {

    var ServiceView = ResourceView.extend({
        events: {
            'click #application-save': "submit",
            'click #application-cancel': "cancel",
            'click #service-choice': "showServiceOrGroup",
            'click #service-group-choice': "showServiceOrGroup"
        },
        submit: function(event) {
            event.preventDefault();
            // Check is form valid
            if (! this.form.isValidInput() || !this.isTextareaValid()) {
                console.log('form is invalid');
                return;
            }
            // Check if list builder is populated, not needed after listBuilder form integration
            if($("#service-choice").is(':checked')) {
                if (this.gridWidget.getAllVisibleRows().length === 0) {
                    console.log('gridwidget has no items');
                    this.form.showFormError(this.context.getMessage("service_protocol_empty_error"));
                    return;
                }
            }

            console.log('ready to save');

            var properties = Syphon.serialize(this);
            this.saveService(properties);
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);

            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('application_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('application_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('application_clone');
                    break;
            }

            _.extend(formConfiguration, dynamicProperties);
        },
        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            _.extend(this, ValidationUtility);

            this.collection = new Collection();
            this.successMessageKey = 'application_create_success';
            this.editMessageKey = 'application_edit_success';
            this.fetchErrorKey = 'application_fetch_error';
            this.fetchCloneErrorKey = 'application_fetch_clone_error';

            // Store protocol values
            this.protocolData = new Backbone.Collection();
        },
        render: function() {
            var self = this;
            var formConfiguration = new ServiceForm(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.form.build();

            this.addSubsidiaryFunctions(formElements);

            this.$el.addClass(this.context['ctx_name']);

            // Workaround until GridWidget is integrated with form widget
            this.addGridWidget('application-protocols', new ProtocolGrid(this.context));

            if (this.formMode == this.MODE_EDIT || this.formMode == this.MODE_CLONE) {
                this.$el.find("label[for=application-type]").parent().parent().hide();
            }

            if (this.model.get('is-group')) {
                this.$el.find("#service-group-choice").attr("checked", true);
                this.$el.find("#service-choice").removeAttr("checked");
            } else {
                this.$el.find("#service-choice").attr("checked", true);
                this.$el.find("#service-group-choice").removeAttr("checked");
            }

            this.showServiceOrGroup();

            return this;
        },
        addGridWidget: function(id, gridConf) {
            var gridContainer = this.$el.find('#' + id);

            var conf = {
                    container: gridContainer,
                    elements: gridConf.getValues(),
                    actionEvents: gridConf.getEvents(),
                    cellTooltip: this.cellTooltip
                };
            this.gridWidget = new GridWidget(conf);
            this.gridWidget.build();
            this.bindGridEvents(gridConf.getEvents());
            var tooltipBuilder = new TooltipBuilder(gridContainer, conf),
            gridTable = gridContainer.find('.gridTable');
            tooltipBuilder.addContentTooltips(gridTable, {});

            var protocols = this.model.get('protocols');
            if (protocols && protocols.protocol) {
                protocols.protocol = [].concat(protocols.protocol);
                protocols.protocol = protocols.protocol.map(function(item) {
                    // Ensure protocol name is a string
                    item.name = String(item.name);
                    return item;
                });
                this.gridWidget.addRow(protocols.protocol);
                this.protocolData = new Backbone.Collection(protocols.protocol);
            }
        },
        addListBuilder: function(id) {
            var self = this;
            var listContainer = this.$el.find('#' + id);
            listContainer.attr("readonly", "");

            var members = this.model.get('members');
            if (members && members.member) {
                members.member = [].concat(members.member);
                members = members.member.map(function(item) {
                    return item.id;
                });
            } else {
                members = [];
            }

            var listBuilderConf = {
                    context: this.context,
                    container: listContainer,
                    selectedItems: members,
                    id: "service_list",
                    excludedNames: []
                };

            if (this.formMode == this.MODE_EDIT) {
                listBuilderConf.excludedNames.push(this.model.get('name'));
            }
            this.listBuilder = new ListBuilder(listBuilderConf);

            this.listBuilder.build(function() {
                listContainer.find('.new-list-builder-widget').unwrap();
            });
        },
        bindGridEvents: function(definedEvents) {
            // create button for protocol
            if (definedEvents.createEvent) {
                this.$el.bind(definedEvents.createEvent, $.proxy(this.createAction, this));
            }
            // edit button for protocol
            if (definedEvents.updateEvent) {
                this.$el.bind(definedEvents.updateEvent, $.proxy(this.updateAction, this));
            }
            // delete button for protocol
            if (definedEvents.deleteEvent) {
                this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteAction, this));
            }
        },
        createAction: function() {
            // Form for protocol creation
            var protocolForm = new ProtocolView({"parentView": this, "formMode": "create"});
            this.overlay = new OverlayWidget({
                view: protocolForm,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },
        updateAction: function(e, row) {
            // Form for protocol update
            var protocolForm = new ProtocolView({
                "parentView": this,
                "formMode": "edit",
                "id": row.originalRow.slipstreamGridWidgetRowId
            });

            this.overlay = new OverlayWidget({
                view: protocolForm,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },
        deleteAction: function(e, row) {
            // Remove selected protocols
            for (var i=0; i<row.deletedRows.length; i++) {
                var name = row.deletedRows[i].name;
                this.protocolData.remove(this.protocolData.findWhere({"name": name}));
            }

            return this;
        },
        showServiceOrGroup: function() {
            if(this.$el.find("#service-choice").is(':checked')) {
                this.$el.find("#service-form").show();
                this.$el.find("#service-group-form").hide();
            } else if(this.$el.find("#service-group-choice").is(':checked')) {
                // Workaround until ListBuilder is integrated with form widget
                if (!this.listBuilder) {
                    this.addListBuilder('application-services');
                }
                this.$el.find("#service-form").hide();
                this.$el.find("#service-group-form").show();
            }
        },
        saveService: function(properties) {
            var self = this;
            // If it is a service group, then "is-group" is true, otherwise it is false. 
            if($("#service-choice").is(':checked')) {
                properties["is-group"] = false;
                properties.protocols = {protocol: this.protocolData.toJSON()};
                this.bindModelEvents();
                this.model.set(properties);
                this.model.save();
            } else if($("#service-group-choice").is(':checked')) {
                properties["is-group"] = true;

                var saveSelectedItems = function(data) {
                    var members = [];
                    if($.isEmptyObject(data.services.service)){
                        console.log('listbuilder has no selections');
                        self.form.showFormError(self.context.getMessage("service_group_empty_error"));
                        return;
                    }
                    var selectedItems = [].concat(data.services.service);
                    selectedItems.forEach(function (object) {
                      members.push({name: object.name, id: object.id});
                    });
                    properties.members = {};
                    properties.members.member = members;

                    self.bindModelEvents();
                    self.model.set(properties);
                    self.model.save(null, {
                        success: function(model, response) {
                            self.listBuilder.destroy();
                        }
                    });
                };
                this.listBuilder.getSelectedItems(saveSelectedItems);
            }

            return properties;
        },
        cellTooltip: function (cellData, renderTooltip){
            renderTooltip(_.escape(cellData.$cell.context.innerText));
        }
    });

    return ServiceView;
});
