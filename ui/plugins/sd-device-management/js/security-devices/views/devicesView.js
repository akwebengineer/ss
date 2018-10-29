define([
    'backbone',
    'widgets/grid/gridWidget',
    '../../../../ui-common/js/common/utils/SmUtil.js',
    '../../../../ui-common/js/views/gridView.js'
], function (Backbone, GridWidget,SmUtil,GridView) {

    var DevicesView = GridView.extend({

        events: {
        	
//          'click a[name="lsys_child"]': "childLSYS",
//          'click a[name="lsys_root"]': "rootLSYS"
        },
        
        childLSYS: function( e ) {
          var clickedRow = $( e.target, this.gridWidget.getSelectedRows( ) ).closest( "tr.jqgrow" );
          var deviceName = $($($($((clickedRow).html())[5]).html())[1]).text();
          var lsysRoot = (deviceName.split(" ")[1]).split("_")[0];
          $searchContainer = this.$el.find('.search-container');
          var addToken = { "searchValue": lsysRoot, "columnName": "name" };
          $searchContainer.trigger("slipstream-add-token", addToken); 
        },
        
        rootLSYS: function( e ) {
          var clickedRow = $( e.target, this.gridWidget.getSelectedRows( ) ).closest( "tr.jqgrow" );
          var deviceName = $($($($((clickedRow).html())[5]).html())[1]).text();
          var lsysRoot = deviceName.split(" ")[0];
          $searchContainer = this.$el.find('.search-container');
          var addToken = { "searchValue": lsysRoot, "columnName": "root-device-name" };
          $searchContainer.trigger("slipstream-add-token", addToken); 
        },
      
        initialize: function(options) {
            console.log("Initialized GridView");
            this.options = options
            this.conf = options.conf;
            this.activity = options.activity;
            this.actionEvents = options.actionEvents;
        },

        render: function() {
            console.log("Rendering GridView");
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: this.conf,
                search : this.options.search,
                cellTooltip : this.cellTooltip,
                actionEvents: ($.isEmptyObject(this.actionEvents)) ? null : this.actionEvents,
                sid: this.getSID()
            }).build();
            $.proxy(new SmUtil().appendGridInfoTemplate,this)();
            return this;
        },
        
        
        /**
         * Cell tooltip for device ILP
         */
        cellTooltip: function (cellData, renderTooltip){
          console.log("In CellTooltip Func");
          renderTooltip(cellData.cellId.toString());
        },
        
        
        /**
         *  Helper method to display a toast/non-persistent notification
         */
        notify: function(type, message) {
            new Slipstream.SDK.Notification()
                .setText(message)
                .setType(type)
                .notify();
        },

        getSID: function() {
            return 'juniper.net:security-device-management:security-device-grid'
        }
    });

    return DevicesView;
});
