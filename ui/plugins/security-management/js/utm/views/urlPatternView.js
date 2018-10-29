/**
 * View to create a URL Pattern
 *
 * @module UrlPatternView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/grid/lib/tooltipBuilder',
    '../conf/urlPatternFormConfiguration.js',
    '../conf/urlPatternFormUrlGrid.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    'text!../templates/utmTextAreaErrorMessage.html',
    './utmUtility.js'
], function (Backbone, Syphon, FormWidget, GridWidget, TooltipBuilder, UrlPatternForm, UrlPatternFormGrid, ResourceView, ErrorTemplate, UTMUtility) {

    var UrlPatternView = ResourceView.extend({

        events: {
            'click #utm-urlpattern-save': "submit",
            'click #utm-urlpattern-cancel': "cancel",
            'click #utm-urlpattern-addurl-to-grid': "addRow"
        },

        submit: function(event) {
            var self = this;

            event.preventDefault();

            this.gridWidget.removeEditModeOnRow();

            if (! this.form.isValidInput() || ! this.isTextareaValid() || ! this.isUrlListValid()) {
                console.log('form is invalid');
                return;
            }

            var properties = Syphon.serialize(this),
                selectedItems,
                patterns = [];

            selectedItems = this.urlListCollection.toJSON();

            // URL list should not be empty
            if (selectedItems.length === 0) {
                this.form.showFormError(this.context.getMessage('utm_url_patterns_url_list_error'));
                return;
            }

            selectedItems.forEach(function (object) {
                patterns.push(object.id);
            });


            properties['address-patterns'] = {};
            properties['address-patterns']['address-pattern'] = patterns;

            this.bindModelEvents();
            this.model.set(properties);
            this.model.save();
        },

        isUrlListValid: function() {
            var isValid = true,
                errorElements = this.form.formTemplateHtml.find('#utm-urlpattern-url-list').find('.error');
            if(errorElements.length){
                isValid = errorElements.is(":hidden");
            }
            return isValid;
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('utm_url_patterns_grid_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('utm_url_patterns_grid_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('utm_url_patterns_grid_clone');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            this.urlListCollection = new Backbone.Collection();

            this.successMessageKey = 'utm_url_patterns_create_success';
            this.editMessageKey = 'utm_url_patterns_edit_success';
            this.fetchErrorKey = 'utm_url_patterns_fetch_error';
            this.fetchCloneErrorKey = 'utm_url_patterns_fetch_clone_error';

            _.extend(this, UTMUtility);
        },

        render: function() {
            var self = this,
                formConfiguration = new UrlPatternForm(this.context),
                formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            this.addSubsidiaryFunctions(formElements);

            this.$el.addClass("security-management");
            this.addGridWidget('utm-urlpattern-url-list', new UrlPatternFormGrid(this.context));
            
            return this;
        },
        addGridWidget: function(id, gridConf) {
            var self = this,
                elements = gridConf.getValues(),
                gridContainer = self.$el.find('#' + id);

            elements.jsonRecords = function(data) {
                data = data || [];
                return data.length;
            };
            elements.filter.searchResult = function (tokens, renderGridData) {
                var data = self.urlListCollection.toJSON(),
                    result = [];
                // if there are no search terms, return all of the data
                if ($.trim(tokens) === '') {
                    result = data.map(function(item) {
                        return {url: item.id};
                    });
                    renderGridData(result);
                    return;
                }

                for (var i=0; i<data.length; i++) {
                    if (data[i].id.indexOf(tokens) > -1) {
                        result.push({url:data[i].id});
                    }
                }
                renderGridData(result);
                return;
            };
            var conf = {
                    container: gridContainer,
                    elements: elements,
                    actionEvents: gridConf.getEvents(),
                    cellTooltip: self.cellTooltip
                };

            self.gridWidget = new GridWidget(conf);

            $.when(self.gridWidget.build()).done(function() {
                var tooltipBuilder = new TooltipBuilder(gridContainer, conf),
                    gridTable = gridContainer.find('.gridTable');
                self.bindGridEvents(gridConf.getEvents());

                self.urlListCollection.on("add", function(data) {
                    self.gridWidget.addRow({url:data.get("id")});
                });

                var patterns = self.model.get('address-patterns');
                if (patterns && patterns["address-pattern"]) {
                    patterns["address-pattern"] = [].concat(patterns["address-pattern"]);
                    patterns["address-pattern"] = patterns["address-pattern"].map(function(item) {
                        self.urlListCollection.add({id: item});
                        return {url: item};
                    });
                }
                tooltipBuilder.addContentTooltips(gridTable, {});
                self.$el.find('.gridTable').bind('customValidation', function(e, isValid){
                    var ele = e.target,
                        value = ele.value,
                        rowid = $(ele).closest('tr').attr('id');
                        originalValue = gridContainer.find('#'+rowid).data('jqgrid.record_data').url;
                        isValueValid = true,
                        errorMessage = '';
                    var updateErrorMessage = function(ele, isValid, message) {
                        var $parent = $(ele).parent(),
                            errorTemplate = Slipstream.SDK.Renderer.render(ErrorTemplate, {error: message});

                        if(! isValid){
                            if ($parent.find('.error').length){
                                $parent.find('.error').text(message);
                                $parent.find('.error').show();
                            }else{
                                $parent.append(errorTemplate);
                                $parent.find('.error').show();
                            }
                        }else{
                            $parent.find('.error').remove();
                        }
                    };
                    if (/true/.test(isValid)){
                        var re = /^\s*$/;
                        if (re.test(value)) {
                            isValueValid = false;
                            errorMessage = self.context.getMessage('utm_url_patterns_url_blank_error');
                        }
                        if (isValueValid && originalValue !== value && self.urlListCollection.get(value)) {
                            isValueValid = false;
                            errorMessage = self.context.getMessage('utm_url_patterns_existent_single_url_error', [value]);
                        }
                        updateErrorMessage(ele, isValueValid, errorMessage);
                    }
                });
            });
        },
        cellTooltip: function (cellData, renderTooltip){
            renderTooltip(_.escape(cellData.$cell.context.innerText));
        },
        bindGridEvents: function(definedEvents) {
            // edit button for url
            if (definedEvents.updateEvent) {
                this.$el.bind(definedEvents.updateEvent, $.proxy(this.updateAction, this));
            }
            // delete button for url
            if (definedEvents.deleteEvent) {
                this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteAction, this));
            }
        },
        addRow: function(event) {
            var urlField = this.$el.find('#utm-urlpattern-addurl');

            urlField.parent().find('.errorimage').remove();

            if ($.trim(urlField.val()).length !== 0){
                var urlList = $.trim(urlField.val()).split(","),
                    urlListArray = this.findDuplicates(urlList),
                    existentList = [],
                    self = this;

                $.each(urlListArray, function( index, value ) {
                    if (self.urlListCollection.get(value)) {
                        existentList.push(value);
                    } else {
                        self.urlListCollection.add({id: value});
                    }
                });

                if (existentList.length > 0) {
                    var addUrlError = this.context.getMessage('utm_url_patterns_existent_url_error', [existentList.join(",")]),
                        error = urlField.parent().append(Slipstream.SDK.Renderer.render(ErrorTemplate, {error: addUrlError}));

                    urlField.parent().addClass("error").prev().addClass("error");
                    error.show();
                    urlField.val(existentList.join(","));
                } else {
                    urlField.val("");
                }
            }else{
                var addUrlError = this.context.getMessage('utm_url_patterns_empty_url_error'),
                    error = urlField.parent().append(Slipstream.SDK.Renderer.render(ErrorTemplate, {error: addUrlError}));

                urlField.parent().addClass("error").prev().addClass("error");
                error.show();
            }
            
        },
        findDuplicates : function(arr) {
            var i, len = arr.length, output = [], obj = {}, key, k;

            for (i = 0; i < len; i++) {
                key = JSON.stringify($.trim(arr[i]));
                if (!obj[key] && key.length !== 2) {
                    obj[key] = 1;
                }
            }
            for (k in obj) {
              if (obj.hasOwnProperty(k)) {
                output.push(JSON.parse(k));
              }
            }
            return output;
        },
        updateAction: function(e, row) {
            var model = this.urlListCollection.get(row.originalData.url);
            model.set({id: row.updatedRow.url});
            row.originalData.url = row.updatedRow.url;
        },
        deleteAction : function(e, row) {
            for (var i=0; i<row.deletedRows.length; i++) {
                var url = row.deletedRows[i].url;
                this.urlListCollection.remove(this.urlListCollection.findWhere({"id": url}));
            }
        }
    });

    return UrlPatternView;
});