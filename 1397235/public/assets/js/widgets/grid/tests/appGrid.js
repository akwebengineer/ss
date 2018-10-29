/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/tests/appSimpleGrid',
    'widgets/grid/tests/appSimpleGridNodata',
    'widgets/grid/tests/appSimpleGrid_Inline',
    'widgets/grid/tests/appSimpleGridAdvancedFilter',
    'widgets/grid/tests/appSpaceUrlSimpleGrid',
    'widgets/grid/tests/appSpaceCollectionSimpleGrid',
    'widgets/grid/tests/appModelViewGrid',
    'widgets/grid/tests/appModelViewGrid_advanceFilter',
    'widgets/grid/tests/appSpaceGroupGrid',
    'widgets/grid/tests/appNestedGrid',
    'widgets/grid/tests/appTreeGrid',
    'widgets/grid/tests/appTreeGrid_Preselection',
    'widgets/grid/tests/appTreeGridModelView',
    'widgets/grid/tests/appTreeGridModelView_pagination',
    'widgets/grid/tests/appTreeGrid_manyRow',
    'widgets/grid/tests/appSmallGrid',
    'widgets/grid/tests/appListGrid',
    'widgets/grid/tests/appGetDataGrid',
    'widgets/grid/tests/appDragNDropGrid',
    'widgets/grid/tests/appSimpleGrid_cellFormatters',
    'widgets/grid/tests/appSimpleGrid_rbac',
    'widgets/grid/tests/appSimpleGrid_reload',
    'widgets/grid/tests/appSimpleGrid_getset',
    'widgets/grid/tests/appTreeGrid_getset',
    'widgets/grid/tests/appSimpleGrid_simplified',
    'widgets/grid/tests/appMultipleGrids',
    'widgets/grid/tests/appSimpleGrid_local',
    'text!widgets/grid/tests/templates/gridExample.html',
    'lib/template_renderer/template_renderer'
], function (Backbone, SimpleGrid, SimpleGridNoData, SimpleGridInline, AppSimpleGridAdvancedFilter, SpaceUrlSimpleGrid, SpaceCollectionSimpleGrid,
        ModelViewGrid, ModelViewGridAdvanceFilter, GroupGrid, NestedGrid, TreeGrid, TreeGridPreselection, TreeGridModelView, TreeGridModelViewPagination, TreeGridManyRow, SmallGrid, ListGrid,
        GetDataGrid, DragNDropGrid, SimpleGridCellFormatters, SimpleGridRbac,
        SimpleGridReload, SimpleGridGetSet, TreeGridGetSet, SimpleGridSimplified, MultipleGrids, SimpleGridLocal, example, render_template) {
    var GridView = Backbone.View.extend({

        events: {
            'click .simple_grid a': function(){this.renderGrid(SimpleGrid)},
            'click .simple_inline_grid a': function(){this.renderGrid(SimpleGridInline)},
            'click .simple_grid_advanced_filter a': function(){this.renderGrid(AppSimpleGridAdvancedFilter)},
            'click .space_grid a': function(){this.renderGrid(SpaceUrlSimpleGrid)},
            'click .space_collection-grid a': function(){this.renderGrid(SpaceCollectionSimpleGrid)},
            'click .model_grid a': function(){this.renderGrid(ModelViewGrid)},
            'click .model_grid_advance_filter a': function(){this.renderGrid(ModelViewGridAdvanceFilter)},
            'click .group_grid a': function(){this.renderGrid(GroupGrid)},
            'click .nested_grid a': function(){this.renderGrid(NestedGrid)},
            'click .tree_grid a': function(){this.renderGrid(TreeGrid)},
            'click .tree_grid_preselection a': function(){this.renderGrid(TreeGridPreselection)},
            'click .model_tree_grid a': function(){this.renderGrid(TreeGridModelView)},
            'click .model_tree_grid_pagination a': function(){this.renderGrid(TreeGridModelViewPagination)},
            'click .tree_grid_many_rows a': function(){this.renderGrid(TreeGridManyRow)},
            'click .small_grid a': function(){this.renderGrid(SmallGrid)},
            'click .get_data_grid a': function(){this.renderGrid(GetDataGrid)},
            'click .dragndrop_grid a': function(){this.renderGrid(DragNDropGrid)},
            'click .simple_grid_noData a': function(){this.renderGrid(SimpleGridNoData)},
            'click .simple_grid_with_cell_formatters a': function(){this.renderGrid(SimpleGridCellFormatters)},
            'click .simple_grid_with_rbac a': function(){this.renderGrid(SimpleGridRbac)},
            'click .simple_grid_with_reload a': function(){this.renderGrid(SimpleGridReload)},
            'click .simple_grid_get_set_cols a': function(){this.renderGrid(SimpleGridGetSet)},
            'click .tree_grid_get_set_cols a': function(){this.renderGrid(TreeGridGetSet)},
            'click .simple_grid_simplified a': function(){this.renderGrid(SimpleGridSimplified)},
            'click .list_grid a': function(){this.renderGrid(ListGrid)},
            'click .multiple_grid a': function(){this.renderGrid(MultipleGrids)},
            'click .simple_grid_local a': function(){this.renderGrid(SimpleGridLocal)}
        },
        initialize: function(){
            this.addContent(this.$el, example);
        },
        renderGrid: function (GridView) {
            this.$el.find('.test_grid_widget').hide();
            new GridView({
                el: '#grid_demo'
            });
        },
        renderLayout: function (GridView) {
            this.$el.find('.test_grid_widget').hide();
            new GridView({
                el: '#grid_demo'
            });
        },
        addContent:function($container, template) {
            $container.append((render_template(template)));

        }

    });

    return GridView;
});