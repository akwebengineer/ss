/**
 * Utility Class for Common usage
 * This class will be used across SM
 * @module SmUtil
 * @author Vinay<vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['text!../../../../ui-common/js/templates/gridManualRefreshTemplate.html'], function (GridManualRefreshTemplate) {

  var SmUtil = function() {
    /*
     * build dynamic url work if the urls is in the format #0, #1, #2.. so on only the #i will be replaced with the array values
     * and array values are expected to be in the same order
     */
    this.buildDynamicURL = function(url, valueArray) {
      for (var i = 0; i < valueArray.length; i++) {
        url = url.replace(new RegExp("#"+i,'g'), valueArray[i]);
      }
      return url;
    };

    this.roundOff = function(count){                
                if (count <= 9999){
                    return count;
                }
                else if (count < 999999 && count > 9999 ){
                    return Math.floor(count/1000) + "k";
                }
                else if ( count > 999999 ){
                    return Math.floor(count/100000) + "m";
                }

            };

    /**
     * creates the namespace under window for given "." separated string example "Juniper.sm"
     * @param nameSpaceString
     * @returns {Window}
     */
    this.declareNameSpace = function(nameSpaceString) {
      var names = nameSpaceString.split('.'),
          parent = window;

      $.each(names, function(i, name) {
        parent[name] = parent[name] || {};
        parent = parent[name];
      });

      return parent;
    };

    /**
     * checks whether the required capabilty has Access to resource
     * @param capability
     * @returns {Boolean}
     */
    this.checkPermission = function(capability) {
      var capability = _.isArray(capability)? capability : [capability];
      if (Slipstream && Slipstream.SDK && Slipstream.SDK.RBACResolver) {
        var rbacResolver = new Slipstream.SDK.RBACResolver();
        return rbacResolver.verifyAccess(capability);
      }
    };

     /**
     * [columnCellToolTipFormater this can be used as cell formator or
     * just directly by passing the text value which in turn return a span with tooltip]
     * @param  {[type]} cellValue [description]
     * @param  {[type]} options   [description]
     * @param  {[type]} rowObject [description]
     * @return {[html string]}           [a span with tooltip]
     */
    this.columnCellToolTipFormater = function(cellValue, options, rowObject){
      return "<span class='tooltip' title="+cellValue+">"+cellValue+"</span>"
    };
    /**
     * [appendGridInfoTemplate add a manual refresh container and then handle the refresh img click event]
     */
    this.appendGridInfoTemplate = function(){
        var gridInfoContainer = this.$el.find('.action-filter-container'),
        maunalRefreshDiv = Slipstream.SDK.Renderer.render(GridManualRefreshTemplate, {reloadMessage: (this.options.context || this.options.activity.context).getMessage('grid_manual_refresh_message')});
        gridInfoContainer.prepend(maunalRefreshDiv);
        this.gridWidget.manualRefreshContainer = this.$el.find('#infoDiv');
        this.$el.find('img').click($.proxy(function(){
            this.reloadGrid();
            this.manualRefreshContainer.hide();
        },this.gridWidget));
    };
    
    this.calculateGridHeightForOverlay = function (preOccupiedHeight) {
      var toBePaddedHeight = $(window).height()*0.9 - preOccupiedHeight - (120) ;
      return toBePaddedHeight;
    };
    /**
     * Merge two arrays of objects based on a unique key
     *
     * Returns true if indeed a merge happened else false
     * @param array1
     * @param array2
     * @param key
     * @param retArr
     * @returns {boolean}
     */
    this.mergeObjectArrays = function(array1, array2, key, retArr) {
      var returnArray = _.isEmpty(array1) ? [] : $.extend(true, [], array1), map = {}, isMerged = false;
      $.each(array1, function(index, item){
        map[item[key]] = true;
      });

      array2 = array2 || [];
      $.each(array2, function(i, element) {
        if (map[element[key]] === undefined) {
          isMerged = true;
          returnArray.push(element);
        }
      });
      if(isMerged === true) {
        $.each(returnArray, function(i, element) {
          retArr[retArr.length] = element;
        });
      }
      return isMerged;
    };
  };


    /**
     * checks whether the debug mode is turned on
     * @returns {Boolean}
     */
    SmUtil.prototype.isDebugMode = function() {
        if(window.location.search.indexOf("debug=true") !== -1){
            return true;
        }
        return false;
    };


  return SmUtil;
});