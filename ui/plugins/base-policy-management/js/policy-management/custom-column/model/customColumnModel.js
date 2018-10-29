/**
 * This is model for custom column
 *@author skesarwani 
 */
define(['../../../../../ui-common/js/models/spaceModel.js'], function (SpaceModel) {
  var CustomColumnModel = SpaceModel.extend({
    idAttribute : "id",
    initialize : function (attrs, options) {
      SpaceModel.prototype.initialize.call(this, options||{});
      this.jsonRoot = "custom-column";
    }
  });
  return CustomColumnModel;
});
