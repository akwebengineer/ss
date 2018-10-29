define(['backbone'],
function( Backbone) {
    var DeviceManager = function(){
        var me = this;

        me.isLsys = function( rowObject ){

          var isLsys = false;
          if(rowObject["device-type"] == "LSYS"){
            isLsys = true;
          }
          return isLsys;
          
        };
        
        me.isRootLsysDevice = function( rowObject ){
          
          var isLsysRoot = false;
          if (rowObject["device-family"] && rowObject["device-family"] != "" && rowObject["device-family"] == "junos-es"
              && rowObject["software-release"] && rowObject["software-release"] != "" && !me.isLsys(rowObject)) {
            
            var softwareRelease = rowObject["software-release"];
            var deviceReleaseStrArray = softwareRelease.split("R");

            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("W");
            }
            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("I");
            }
            if (deviceReleaseStrArray.length == 1) {
              deviceReleaseStrArray = softwareRelease.split("X");
            }

            if (deviceReleaseStrArray.length > 1) {
              var majorRelease = deviceReleaseStrArray[0];
              if (majorRelease == 11.2 || majorRelease > 11.2) {
                var dplatform = rowObject["platform"];
                if (dplatform && dplatform != "") {
                  dplatform = dplatform.toLowerCase();
                  if (dplatform == "srx5800" || dplatform == "srx5600" || dplatform == "srx3600" || dplatform == "srx3400")
                    isLsysRoot = true;
                  else if (dplatform == "srx1400" && majorRelease != 11.2)
                    isLsysRoot = true;
                }
              }
            }
          }
          return isLsysRoot;
          
        };

    };
    
    return DeviceManager;
});
