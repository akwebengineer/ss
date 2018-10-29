define(['../../../ui-common/js/common/utils/deviceManager.js'],
    function (DeviceManager) {
        var DeviceNameFormatter = function () {
        };

        DeviceNameFormatter.prototype.formatDeviceName = function (data) {
            var deviceManager = new DeviceManager();
            var cellValue = data.name;
            if (!cellValue) {
                return "";
            }
            if (deviceManager.isLsys(data)) {
                cellValue = cellValue + "(" + data["root-device-name"] + ")";
                cellValue = data["cluster"] ? cellValue + "(Cluster)"
                    : cellValue;
            } else if (deviceManager.isRootLsysDevice(data)) {
                // cellValue = cellValue + " <font color='3366cc'>" + data["lsys-count"] + " LSYS(s)</font>";
                cellValue = data["cluster"] ? cellValue + "(Cluster)"
                    : cellValue;
            }
            return cellValue;
        };
        return DeviceNameFormatter;
    });
