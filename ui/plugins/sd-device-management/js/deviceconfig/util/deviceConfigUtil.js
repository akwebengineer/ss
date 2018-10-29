/**
 * @author skesarwani
 * This is the file containing utils for device config
 */
define ([], function () {
  var DeviceConfigUtil = function () {
    /**
     * This method checks if the val is null, undefined , or true/false
     */
    this.getBooleanValue = function (val) {
      if(val === null || val === undefined) {
        return false;
      }
      return val;
    };
    this.getStringValue = function (val) {
      if(val === null || val === undefined) {
        return "";
      }
      return val;
    };
  };
  return DeviceConfigUtil;
});

