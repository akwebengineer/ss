define([], function () {

 	var eventCategories = function() {

        this.getValues = function() {
            return {
                "results": [
                    "firewall",
                    "webfilter",
                    "vpn",
                    "contentfilter",
                    "antispam",
                    "antivirus",
                    "ips",
                    "screen"
                ]
            }
        }
    }
    return eventCategories;
});

