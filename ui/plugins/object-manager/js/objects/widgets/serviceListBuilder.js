/**
 * ListBuilder for services
 *
 * @module ServiceListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/overlay/overlayWidget',
    '../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/serviceListBuilderConfiguration.js',
    '../conf/protocolTypes.js',
    '../models/serviceListBuilderModel.js',
    '../views/serviceObjectTreeView.js'
], function (Backbone, OverlayWidget, ListBuilder, ListBuilderConf, protocolTypes, ListBuilderModel, TreeView) {

    var ServiceListBuilder = ListBuilder.extend({

        initialize: function (options) {
            this.listBuilderModel = new ListBuilderModel();
            ListBuilder.prototype.initialize.call(this, options);
        },

        addDynamicFormConfig: function(elements) {
            var self = this;
            var filterItems = [], excludeNameArr = ["Any"];
            if(self.conf.excludedNames && self.conf.excludedNames.length > 0){
                excludeNameArr = excludeNameArr.concat(self.conf.excludedNames);
            }
            elements.availableElements.urlParameters = {filter: self.getFilterUrl(self.excludeServiceByName(excludeNameArr))};

            elements.search.url = function (currentPara, value){
                console.log(value);
                var filterItems = [], excludeNameArr = ["Any"];
                if(self.conf.excludedNames && self.conf.excludedNames.length > 0){
                    excludeNameArr = excludeNameArr.concat(self.conf.excludedNames);
                }
                filterItems = self.excludeServiceByName(excludeNameArr);
                var filterUrl = self.getFilterUrl(filterItems);
                var updatedPara = {filter: filterUrl};
                if (value) {
                    updatedPara._search = value;
                } else {
                    delete currentPara._search;
                }
                return _.extend(currentPara, updatedPara);
            };

            return elements;
        },

        rowTooltip: function (rowData, renderTooltip){
            var self = this;
            this.listBuilderModel.fetchById(rowData.id, function(model, response, options) {
                var data = response.service,
                    tipData = [];

                if (data) {
                    tipData.push({
                        title: data.name
                    });

                    if (data["is-group"]) {
                        var members = response.service.members.member;
                        if (members) {
                              for (var i=0; i<members.length; i++) {
                                  if (members[i]["is-group"]) {
                                      members[i].label = self.context.getMessage('tooltip_service_group');
                                  }
                                  var value = members[i].label? ": "+ members[i].label : "";
                                  tipData.push({
                                      label: members[i].name + value
                                  });
                                  if (i == 4) {
                                      break;
                                  }
                              }
                              // Show a more link if more than 5 addresses in tooltip
                              var linkId = "service-tooltip-more-link";
                              if (self.conf.id) {
                                  linkId = self.conf.id + "-tooltip-more-link";
                              }

                              if (members.length > 5) {
                                  tipData.push({
                                      link: self.context.getMessage('tooltip_more_link', [members.length - 5]),
                                      id: linkId
                                  });
                              }

                              renderTooltip(tipData);

                              // Bind click event for "more" link
                              if (members.length > 5) {
                                  var link = $('#' + linkId);
                                  link.click($.proxy(self.moreLinkAction, self, link, data.id, data.name));
                              }
                        }
                    } else {
                        var protocol = data.protocols.protocol;
                        var type = protocol[0]["protocol-type"];
                        var port = protocol[0]["dst-port"] || "";

                        for (var index=0; index<protocolTypes.length; index++) {
                            if (protocolTypes[index].id === type) {
                                type = protocolTypes[index].text;
                            }
                        }

                        tipData.push({
                            label: protocol.length > 1? type + "/" + port + " (+)": type + "/" + port
                        });
                        renderTooltip(tipData);
                    }
                }
            });
        },

        moreLinkAction: function(link, id, name) {
            // same to addressListBuilder
            $(link).parentsUntil(".grid-widget", ".tooltipster-content").hide();
            if (!$.isEmptyObject(link)) {
                link.unbind('click');
            }
            this.tooltipOverlay = new OverlayWidget({
                view: new TreeView({parentView: this, ObjId: id, ObjName: name}),
                type: 'medium',
                showScrollbar: true
            });
            this.tooltipOverlay.build();
        },

        initListBuilderConf: function() {
            var self = this;

            var formConfiguration = new ListBuilderConf(this.context);
            var elements = formConfiguration.getValues(this.listBuilderModel);

            this.elements = this.addDynamicFormConfig(elements);
        },

        excludeServiceByName: function(nameArr) {
            var filterArr = [];
            for (var i=0; i<nameArr.length; i++)
            {
                var urlFilter = {
                    property: 'name',
                    modifier: 'ne',
                    value: nameArr[i]
                };
                filterArr.push(urlFilter);
            }
            return filterArr;
        }
    });

    return ServiceListBuilder;
});