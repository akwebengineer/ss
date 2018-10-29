/**
 * A view that uses the formWidget to a produce a form for the row
 *
 * @module Add Row View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/grid/tests/conf/formConfiguration',
    'widgets/form/formWidget',
    'text!widgets/grid/tests/templates/listGrid.html',
    'widgets/grid/tests/view/listAutocompleteNestedGridView'
], function(Backbone, formConfiguration, FormWidget, listGrid, ListNestedGridView){
    var FormView = Backbone.View.extend({

        events: {
            'click #row_save': 'saveView',
            'click #row_cancel': 'cancelView',
            'click .simplified_source': 'addSourceSearchList',
            'click .simplified_destination': 'addDestinationSearchList',
            'click .more_info': 'updateRightPanel'
        },

        initialize: function () {
            this.setContainers();
        },

        render: function (defaultRow, saveRow) {
            this.emptyContainers();
            this.$updateTitle.append(this.options.layoutOptions.gridHeader);
            this.saveRow = saveRow;
            this.form = new FormWidget({
                "elements": formConfiguration.Simplified,
                "container": this.$updateContent,
                'values': defaultRow
            }).build();
            this.adjustStyle(this.options.layoutOptions);
            this.addSourceSearchList();
            return this;
        },

        addSourceSearchList: function() {
            var inputClass = "simplified_source",
                $sourceInput = this.$el.find("."+ inputClass + " .elementinput");
            $sourceInput = $sourceInput.eq($sourceInput.length-1).addClass("list-grid-wrapper");
            this.addSearchList($sourceInput, inputClass, _.bind(this.addSourceSearchList, this));
        },

        addDestinationSearchList: function() {
            var inputClass = "simplified_destination",
                $sourceInput = this.$el.find("."+ inputClass + " .elementinput");
            $sourceInput = $sourceInput.eq($sourceInput.length-1).addClass("list-grid-wrapper");
            this.addSearchList($sourceInput, inputClass, _.bind(this.addDestinationSearchList, this));
        },

        addSearchList: function ($searchInput, searchListId, addNextCallback) {
            var $searchDescription = $searchInput.find(".optionselection"),
                gridClass = searchListId + "_list",
                self = this,
                $searchList;

            if (!$searchInput.find(".list_grid").length) {
                $searchDescription.hide();
                $searchInput.append(listGrid);
                $searchInput.find(".list_grid").addClass(gridClass);
                this[searchListId] = new ListNestedGridView({
                    "el": '.'+ gridClass,
                    "id": "gridlist_"+searchListId,
                    "updateDescription": function (value) {
                        $searchInput.find(".list_grid_view").remove();
                        self.form.copyRow(searchListId);
                        $searchDescription.find(".description").text(value);
                        $searchDescription.show();
                        addNextCallback();
                    }
                }).render();
            } else {
                $searchList = $searchInput.find(".list_grid_view");
                $searchList.show();
                this[searchListId].focusSearchInput();
            }
        },

        adjustStyle: function (gridHeaderLayout, replaceHeader) {
            var self = this;
            if (replaceHeader) {
                this.$updateTitle.empty().append(gridHeaderLayout.gridHeader);
            }
            this.$updateContent.css({
                "margin-left": gridHeaderLayout.columnOffset
            });

            gridHeaderLayout.columns.forEach(function(column) {
                var $row = self.$updateContent.find(".simplified_"+column.name),
                    columnMargin = 15,
                    columnWidth = column.width - 2*columnMargin;
                $row.find(".elementinput").css({
                    "width": columnWidth,
                    "margin-right": columnMargin,
                    "margin-left": columnMargin
                });

                if ($row.find(".select2").length) {
                    $row.find(".select2").width(columnWidth);
                }
            });
        },

        setContainers: function () {
            this.$updateTitle = this.$el.find(".update-row-title");
            this.$updateContent = this.$el.find(".update-row-form");
        },

        emptyContainers: function () {
            var emptyContainer = function ($container) {
                if ($container.children()) {
                    $container.empty();
                }
            };
            emptyContainer(this.$updateTitle);
            emptyContainer(this.$updateContent);
        },

        saveView: function (e){
            if (this.form.isValidInput()) {
                var formValues = this.form.getValues(),
                    rowValues = {};
                formValues.forEach(function(value){
                    rowValues[value.name] = value.value;
                });
                this.saveRow(rowValues, this.operation);
                this.cancelView();
            }
        },

        cancelView: function (e){
            this.$el.hide();
            this.options.cancelRow();
        },

        updateRightPanel: function () {
            this.options.updateRightPanel();
        }

    });

    return FormView;
});