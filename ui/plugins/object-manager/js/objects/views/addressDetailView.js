/**
 * Detail View of an address
 *
 * @module AddressDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js',
    '../conf/addressDetailGroupConfiguration.js',
    'widgets/grid/gridWidget'
], function (Backbone, DetailView, groupGrid, GridWidget) {
    var AddressDetailView = DetailView.extend({

        formatTypeObject: function (addressType) {
            if (addressType === 'IPADDRESS')  return this.context.getMessage('address_grid_type_host');
            if (addressType === 'GROUP')  return this.context.getMessage('address_grid_type_group');
            if (addressType === 'RANGE')  return this.context.getMessage('address_grid_type_range');
            if (addressType === 'NETWORK')  return this.context.getMessage('address_grid_type_network');
            if (addressType === 'WILDCARD')  return this.context.getMessage('address_grid_type_wildcard');
            if (addressType === 'DNS')  return this.context.getMessage('address_grid_type_dns');
            if (addressType === 'POLYMORPHIC')  return this.context.getMessage('address_grid_type_polymorphic');
            if (addressType === 'ANY')  return this.context.getMessage('address_grid_type_any');
            if (addressType === 'ANY_IPV4')  return this.context.getMessage('address_grid_type_any_ipv4');
            if (addressType === 'ANY_IPV6')  return this.context.getMessage('address_grid_type_any_ipv6');
            if (addressType === 'ALL_IPV6')  return this.context.getMessage('address_grid_type_all_ipv6');
            if (addressType === 'DYNAMIC_ADDRESS_GROUP')  return this.context.getMessage('address_grid_type_dynamic');
        },

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
            eleArr.push({
                'label': this.context.getMessage('type'),
                'value': this.formatTypeObject(values['address-type'])
            });

            if ("GROUP" == values['address-type'])
            {
                eleArr.push({
                    'label': this.context.getMessage('addresses'),
                    "id": "addresses",
                    "class": "grid-widget"
                });
            }

            if ("IPADDRESS" == values['address-type'])
            {
                eleArr.push({
                    'label': this.context.getMessage('address_detail_ip'),
                    'value': values['ip-address']
                });

                eleArr.push({
                    'label': this.context.getMessage('address_detail_hostname'),
                    'value': values['host-name']
                });
            }

            if ("RANGE" == values['address-type'])
            {
                eleArr.push({
                    'label': this.context.getMessage('address_detail_ip_range'),
                    'value': values['ip-address']
                });
            }

            if ("NETWORK" == values['address-type'])
            {
                eleArr.push({
                    'label': this.context.getMessage('address_detail_network_ip'),
                    'value': values['ip-address']
                });
            }

            if ("WILDCARD" == values['address-type'])
            {
                eleArr.push({
                    'label': this.context.getMessage('address_detail_wildcard'),
                    'value': values['ip-address']
                });
            }

            if ("DNS" == values['address-type'])
            {
                eleArr.push({
                    'label': this.context.getMessage('address_detail_dns'),
                    'value': values['host-name']
                });
            }

            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);
            this.fetchErrorKey = 'address_fetch_error';
            this.objectTypeText = this.context.getMessage('address_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);

            this.$el.addClass(this.context['ctx_name']);

            if ("GROUP" == this.model.attributes['address-type'])
            {
                // Workaround until GridWidget is integrated with form widget
                this.addGridWidget('addresses', new groupGrid(this.context));
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
    });

    return AddressDetailView;
});