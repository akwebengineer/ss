/**
 Takes the configuration for the context menu and
 1.creates the action events
 2.binds the handlers to the events
 3.sets the item status
 **/

define([
],function(){
  var BaseContextMenuHandler = function(options) {
    this.initialize(options);
  }
  _.extend(BaseContextMenuHandler.prototype, {

    initialize: function(options) {
      var me = this;
      me.context = options.context;
      me.view = options.view;
      me.actionEvents ={};
      me.contextMenu = options.contextMenu;
    },

    /*
     Returns the configuration object provided by the subclass if set or else creates the default
     */
    getContextMenu: function(){
      var me = this;
      return me.contextMenu;
    },

    /*
     creates the context menu which will shown on the grid
     */
    createContextMenu: function(gridConfiguration){
      var me = this, contextMenu = me.getContextMenu(),
          contextMenuItems = contextMenu.getContextMenuItems(me.view.state),
          customContextMenu = [];
      if ($.isEmptyObject(contextMenuItems) || !$.isArray(contextMenuItems)){
        return;
      }
      else{
        $.each(contextMenuItems, function(i, menu) {
          customContextMenu.push(menu);
          if(menu.hasSubMenu){
            var items = menu.items;
            $.each(items, function(j, item){
                me.addActionEvent(item);
            })
          }else{
            me.addActionEvent(menu);
          }

        });
        me.addContextMenuItem(gridConfiguration, customContextMenu);
      }
    },

    /*
     adds the events to the action event object which will be passed to the grid widget
     bind the event handlers for the events if specified
     */
    addActionEvent: function(menu){
        var me = this, item = {};
        
        if (menu.capabilities) {
            item[menu.key] = {
                name: menu.key,
                capabilities: menu.capabilities
            };
        } else {
            item[menu.key] = menu.key;
        }
        $.extend(me.actionEvents, item);
        if(menu.handler !== undefined){
            me.bindActionEvents(menu);
        }
    },

    /*
     Sets the status(enable/disable)of the custom menu items using the map that has the
     status handlers provided in the configuration
     */
    setItemStatus: function(key,isItemEnabled, selected){
      if(key == "edit" && selected.length >1){
        return true;
      }
      return false;
    },

    /*
     Adds the context menu item dynamically
     Creates the context menu object if it does not exist and then adds the custom
     context menu array
     */
    addContextMenuItem: function(conf, items) {
      var me = this;
      conf.contextMenu = conf.contextMenu || {};
      conf.contextMenu.custom = conf.contextMenu.custom || [];

      conf.contextMenu.custom = conf.contextMenu.custom.concat(items);
      conf.contextMenuItemStatus = me.setItemStatus;
    },

    /*
     Binds the custom events to the handlers provided in the configuration
     */
    bindActionEvents: function(menu){
        var me = this,
            eventName = menu.key,
            eventHandler = menu.handler,
            scope = menu.scope ? menu.scope : menu,
            lockRequired = menu.lockRequired !== undefined?menu.lockRequired:false;

        if (typeof (eventHandler) !== 'function') {
            return;
        }

        me.view.$el.bind(eventName, function(e, selected){
            eventHandler.apply(scope,[eventName,selected, me.view]);
        });
    }
  });
  return BaseContextMenuHandler;

});