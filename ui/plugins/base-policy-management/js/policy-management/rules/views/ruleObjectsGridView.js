/***
 * @author skesarwani
 * This is the container view for the rules objects grid like Address, Services etc
 */
define(['widgets/dropDown/dropDownWidget'], function (DropDownWidget) {
  var RuleObjectsGridView = Backbone.View.extend({
    initialize : function (context, objectsViewData) {
      var me = this;
      me.context = context;
      me.objectsViewData = objectsViewData;

    },
    close : function () {
      this.doClose();
    },
    render : function () {
      var me = this;
      var $gridDiv = $("<div id=\"ruleObjectGridPanel\"></div>");
      me.gridDivEl = $gridDiv[0];
      me.$el.append($gridDiv);
      return this;

    },
    doClose : function () {
      //This method will close the current viewed objects grid activity view
      var me = this;
      if(me.gridDivEl) {
        me.gridDivEl.__view.close();
        delete me.gridDivEl.__view;
      }
      $(me.gridDivEl).remove();
    },

    findObjectById : function (id) {
      var me = this;
      return $.grep(me.objectsViewData, function (item) {
        return item.id === id;
      });
    },
    beforeDragCallback : function (callbackData) {
      var me = this, draggedItemsData = callbackData.data, draggedItemsRowData = callbackData.draggableRows,
        $dragHelper = callbackData.helper, tmpObj;

      //Add the information about the items being dragged in before drag
      //This info is consumed in the dropped cell to validate and merge
      $dragHelper[0].draggedItems = draggedItemsRowData;
      tmpObj = me.findObjectById(me.objectViewId)[0];
      //Object type that is being dragged
      if(tmpObj.dragNDrop.dragObjectType) {
        $dragHelper[0].dragObjectType = tmpObj.dragNDrop.dragObjectType;
      }
      return true;
    },
    setRuleGridId : function(ruleGridId) {
      this.ruleGridId = ruleGridId;
    },
    launchActivity : function (sharedObjectId) {
      var me = this;
      me.objectViewId = sharedObjectId;
      //Start the address grid activity
      if(_.isEmpty(me.objectViewId)) {
        return;
      }
      var tmpObj = me.findObjectById(me.objectViewId)[0],

        intent = new Slipstream.SDK.Intent(tmpObj['action'], {
          mime_type: tmpObj['mime_type']
        });
      intent.putExtras({
        'containerDiv' : 'ruleObjectGridPanel',
        'colConfig' : [{
          "name": "name",
          dragNDrop : {
            isDraggableHelperData : true
          }
        }],
        'gridConfig' : {
          'title' : undefined,
          'title-help': undefined,
          'subTitle' : tmpObj.text,
          'dragNDrop' : {
            'connectWith' : {
              selector: '#'+me.ruleGridId,
              groupId: tmpObj.dragNDrop ? tmpObj.dragNDrop.groupId : undefined
            },
            moveRow : {
              beforeDrag : $.proxy(me.beforeDragCallback, me)
            }
          }
        }
      });
      me.context.startActivity(intent);
    }
  });
  return RuleObjectsGridView;
});
