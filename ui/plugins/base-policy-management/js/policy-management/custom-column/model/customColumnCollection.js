/**
 * This is collection of models for custom column grid
 *@author skesarwani 
 */
define(['../../../../../ui-common/js/models/spaceCollection.js',
        './customColumnModel.js'], function(SpaceCollection, CustomColumnModel) {
  var CustomColumCollection = SpaceCollection.extend({
    model : CustomColumnModel,
    initialize : function(models, options) {
      SpaceCollection.prototype.initialize.call(this, options || {});
      this.jsonRoot = 'custom-columns.custom-column';
    }
  });
  return CustomColumCollection;
});