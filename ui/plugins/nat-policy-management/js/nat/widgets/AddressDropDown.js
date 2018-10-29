/**
 * A module that builds an Address Drop Down widget.
 * @module AddressDropDownWidget
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/dropDown/dropDownWidget',
     '../../../../nat-policy-management/js/nat/common/constants/natPolicyManagementConstants.js'
],  
    function(DropDown, NATManagementConstants) {
    	
    	var AddressDropDownWidget = function(conf){

          var THIS = conf.THIS,
          	  self = this;
	          container = conf.container,
	          onchange = conf.onchange,
	          urlFilters = conf.urlFilters;

            this.getAddressesURL = function(filter,connective) {
                var baseUrl = NATManagementConstants.ADDRESSES_URL;

                if (Array.isArray(filter)) {
                    if (filter.length === 0) {
                        return baseUrl;
                    }

                    connective = connective || "and";
                    // Multiple filters support
                    var tmpUrl = baseUrl + "?filter=(";

                    for (var i=0; i<filter.length; i++) {
                        tmpUrl += filter[i].property + " " + filter[i].modifier + " '" + filter[i].value + "'";
                        if (i !== filter.length-1) {
                            tmpUrl += " "+ connective +" ";
                        }
                    }
                    tmpUrl += ")";

                    return tmpUrl;
                } else if (Object.prototype.toString.call(filter) === "[object String]") {
                    return baseUrl + "?filter=(" + filter + ")";
                } else if (filter) {
                    // single filter
                    return baseUrl += "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
                }

                return baseUrl;
            };	
	        THIS.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
	        this.addressDropDown = new DropDown({
	                  "container": THIS.$el.find("."+container),
	                  "enableSearch": true,
	                  "remoteData": {
	                      headers: {
	                          "accept" : NATManagementConstants.ADDRESSES_ACCEPT_HEADER,
	                          "Content-Type": NATManagementConstants.ADDRESSES_CONTENT_HEADER
	                      },
	                      "url": self.getAddressesURL(urlFilters,"or"),
	                      "numberOfRows": 500,
	                      "jsonRoot": "addresses.address",
	                      "jsonRecords": function(data) {
	                          return data['addresses']['total']
	                      },
	                      "success": function(data){},
	                      "error": function(){console.log("error while fetching data")}
	                  },
	                  "templateResult": conf.formatRemoteResult,
	                  "templateSelection": conf.formatRemoteResultSelection,
	                  "onChange": function(event) {
	                      if (onchange) {onchange($(this).val(),THIS);}
	                   }
	        });
			this.build = function () {
				return this.addressDropDown.build();
			};
			
		};
		 
 return AddressDropDownWidget;
});