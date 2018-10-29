/**
 * Detail View of a service
 *
 * @module ServiceDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js',
    '../conf/serviceDetailProtocolGridConfiguration.js',
    '../conf/serviceDetailServiceGridConfiguration.js',
    'widgets/grid/gridWidget'
], function (Backbone, DetailView, protocolGrid, serviceGrid, GridWidget) {

    var ServiceDetailView = DetailView.extend({

        getFormConfig: function() {
            var conf = {},
                eleArr = [],
                values = this.model.attributes;

            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });
            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });

            if (values['is-group'])
            {
                eleArr.push({
                    'label': this.context.getMessage('application_memebers'),
                    "id": "application-members",
                    "class": "grid-widget"
                });
            } else {
                eleArr.push({
                    'label': this.context.getMessage('application_protocols'),
                    "id": "application-protocols",
                    "class": "grid-widget"
                });
            }

            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);

            this.fetchErrorKey = 'application_fetch_error';
            this.objectTypeText = this.context.getMessage('service_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);

            this.$el.addClass(this.context['ctx_name']);

            var isGorup = this.model.attributes['is-group'];
            if (isGorup ) 
            {
                // Workaround until GridWidget is integrated with form widget
                this.addGridWidget('application-members', new serviceGrid(this.context));
            } else {
                // Workaround until GridWidget is integrated with form widget
                this.addGridWidget('application-protocols', new protocolGrid(this.context));
            }

            return this;
        },
        
        addGridWidget: function(id, gridConf) {

            var gridContainer = this.$el.find('#' + id);

            this.$el.find('#' + id).after("<div id='"+id+"'></div>");
            gridContainer.remove();
            gridContainer = this.$el.find('#' + id);

            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridConf.getValues()
            });
            this.gridWidget.build();

            if (id == "application-protocols")
            {
                var protocols = this.model.get('protocols');
                if (protocols && protocols.protocol) {
                    protocols.protocol = [].concat(protocols.protocol);
                    protocols.protocol = protocols.protocol.map(function(item) {
                        item.name = String(item.name);
                        return item;
                    });
                    this.gridWidget.addRow(protocols.protocol, 'last');
                }
            } else {
                var members = this.model.get('members');
                if (members && members.member) {
                    members.member = [].concat(members.member);
                    members.member = members.member.map(function(item) {
                        item.name = String(item.name);
                        return item;
                    });
                    this.gridWidget.addRow(members.member, 'last');
                }
            }
        }

    });

    return ServiceDetailView;
});