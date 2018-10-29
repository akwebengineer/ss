/**
 * A generic view that displays a grid (ILP) 
 *
 * @module GridView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    '../../../ui-common/js/common/utils/SmUtil.js',
    '../../../ui-common/js/mixins/PersistenceMixin.js'
], function (Backbone, GridWidget, SmUtil, PersistenceMixin) {

    var GridView = Backbone.View.extend({

        initialize: function(options) {
            console.log("Initialized GridView");
            this.conf = options.conf;
            this.search = options.search;
            this.activity = options.activity;
            this.actionEvents = options.actionEvents;
            this.preferencesPath = options.preferencesPath;
            this.isAppendGridInfo = options.isAppendGridInfo === undefined ? true : options.isAppendGridInfo;
            this.dontPersistAdvancedSearch = options.dontPersistAdvancedSearch === true ? true : false; //by default persist the search
        },

        render: function() {
            console.log("Rendering GridView");
            var me=this,
                gridConfig = me.conf,
                persistedCols = me.getPersistedConfig();
            //
            if(persistedCols){
                //
                var refrenceColumns = [], mainColumns = [], result = persistedCols.elements.columns.map(function(persistedObj){
                    var ret;
                    if(persistedObj.index !== undefined){
                        refrenceColumns.push(persistedObj.index);
                    }
                    $.each(gridConfig.columns, function(index, gridConfigObject){

                        if(gridConfigObject.index === persistedObj.index){
                            ret = $.extend(true, {}, gridConfigObject, persistedObj);
                            mainColumns.push(ret);
                            return;
                        }
                    });
                    return ret;
                });
                /**
                 * add if any new columns
                 */
                $.each(gridConfig.columns, function(index, gridConfigObject){

                        if (gridConfigObject.index && refrenceColumns.indexOf(gridConfigObject.index) === -1) {
                            var newColumn = $.extend(true, {}, gridConfigObject);
                            mainColumns.push(newColumn);
                        }
                });
                //
                gridConfig.columns = mainColumns;
                if(persistedCols["elements"]["sorting"]){
                    $.extend(gridConfig["sorting"] ? gridConfig["sorting"] : gridConfig["sorting"] = [], persistedCols["elements"]["sorting"]);
                };
                //Search related
                if(!_.isEmpty(persistedCols['search']) && !this.dontPersistAdvancedSearch) {
                  this.search = persistedCols['search'];
                }
            };
            //
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: gridConfig,
                search : this.search,
                onConfigUpdate: $.proxy(me.persistConfig, me),
                cellTooltip: (this.conf.cellTooltip && typeof(this.conf.cellTooltip) == "function") ? this.conf.cellTooltip : this.cellTooltip,
                actionEvents: ($.isEmptyObject(this.actionEvents)) ? null : this.actionEvents
            }).build();
            //
            if(this.isAppendGridInfo){
                $.proxy(new SmUtil().appendGridInfoTemplate,this)();    
            }
            //
            return this;
        },

        /**
         *  Helper method to render a tooltip around an element (cell or item on a cell) which includes a data-tooltip attribute.
         */
        cellTooltip: function (cellData, renderTooltip){
            console.log("cell tooltip");
            renderTooltip(cellData.cellId);
        },
        /**
         *  Helper method to display a toast/non-persistent notification
         */
        notify: function(type, message) {
            new Slipstream.SDK.Notification()
                .setText(message)
                .setType(type)
                .notify();
        }
    });
    /**
     * [view close ]
     */
    GridView.prototype.close = function() {
        if(this.activity){
            this.activity.unSubscribeNotification();
        } else{
            console.log("No Activity assigned to view..")
        }
    };
    _.extend(GridView.prototype, PersistenceMixin);
    //
    return GridView;
});
