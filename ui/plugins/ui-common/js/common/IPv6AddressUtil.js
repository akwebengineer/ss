/**
 * A module provides common methods to validate IPv6Address.
 *
 * @module IPv6AddressUtil
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'lib/validator/extendedValidator'
], function (validator) {
    var IPv6AddressUtil = {
        /**
         * Validate if a string is a valid IPv6 address range
         * 
         * @param ipv6Address  the IPv6 string range, like startAddr-endAddr
         * @return
         */
        isValidIPV6Range: function(ipv6Address) {
            if($.trim(ipv6Address)) {
                var ipv6 = ipv6Address.split("-");

                if (ipv6.length !== 2) {
                    return false;
                }

                if(this.isValidIPv6(ipv6[0]) && this.isValidIPv6(ipv6[1])) {
                    var startAddr = this.getIPv6StringArray(ipv6[0].toUpperCase());
                    var endAddr = this.getIPv6StringArray(ipv6[1].toUpperCase());

                    if (startAddr > endAddr) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }

            return false;
        },
        /**
         * Validate if a string is a valid IPv6 address
         * 
         * @param ipv6addr
         * @return
         */
        isValidIPv6: function(ipv6addr) {
            if(!ipv6addr){
                return false;
            }

            ipv6addr = ipv6addr.replace(/\s+/g,'');

            return validator.isIpv6(ipv6addr);
        },
        /**
         * Convert an IPv6 String into a comparable string
         * 
         * @param ipv6addr  the IPv6 String
         * @return the IPv6 string array
         */
        getIPv6StringArray: function (ip_string) {
            ip_string = ip_string.replace(/\s+/g,'');
            // replace ipv4 address if any
            var ipv4 = ip_string.match(/(.*:)([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$)/);
            var ipv6_string = ip_string;

            if (ipv4) {
                // Keep the ipv6 part
                ipv6_string = ipv4[1];
                // Convert the ipv4 part to hexadecimal
                ipv4 = ipv4[2].split(".");
                for (var k = 0; k < 4; k ++) {
                    var byte = parseInt(ipv4[k], 10);
                    ipv4[k] = ("0" + byte.toString(16)).substr(-2);
                }
                ipv6_string += ipv4[0] + ipv4[1] + ':' + ipv4[2] + ipv4[3];
            }

            // take care of leading and trailing ::
            ipv6_string = ipv6_string.replace(/^:|:$/g, '');

            var ipv6 = ipv6_string.split(':');

            for (var i = 0; i < ipv6.length; i ++) {
                var hex = ipv6[i];
                if (hex !== "") {
                    // normalize leading zeros
                    ipv6[i] = ("0000" + hex).substr(-4);
                }
                else {
                    // normalize grouped zeros ::
                    hex = [];
                    for (var j = ipv6.length; j <= 8; j ++) {
                        hex.push('0000');
                    }
                    ipv6[i] = hex.join(':');
                }
            }

            return ipv6.join(':');
        },
        /**
         * Validate if address&cidr is a valid IPv6 network, for example: 1::1:0/112 is valid, 1::1:0/111 is not
         * 
         * @param ip_string  the IPv6 String
         * @param cidr  the CIDR value
         * @return true/false
         */
        validateIpv6Network: function(ip_string, cidr) {
            var address = this.getIPv6StringArray(ip_string),
                bits16StrArr = address.split(':'),
                remainingBits = 128 - cidr,
                bits8NumberArr = [];
            // Split the ipv6 string into 16 numbers
            for(var i = 0; i < 8; i++){
                var bits16Str = bits16StrArr[i];
                bits8NumberArr.push(parseInt(bits16Str.substring(0, 2), 16));
                bits8NumberArr.push(parseInt(bits16Str.substr(2),16));
            }
            var numberOfFullRemainingOctets = Math.floor(remainingBits / 8);
            var numOfPartialRemainingBits = remainingBits % 8;
            for(var i = 15; i > 15 - numberOfFullRemainingOctets; i--) {
                var part = bits8NumberArr[i];
                if(part !== 0){
                    return false;
                }
            }
            if(numOfPartialRemainingBits==0) {
                return true;
            }else{
                var remainingPartNumber = bits8NumberArr[16 - numberOfFullRemainingOctets - 1];
                var remainingValue = remainingPartNumber << (32 - numOfPartialRemainingBits);
                if(remainingValue){
                    return false;
                }else{
                    return true;
                }
            }
        },
        /*
        validates IPv4 address.
        TODO IPv6    
        */
        
        isValidIPAddress : function(ipv4addr){
            var me=this,
                isValidIP=false,
                regExIPAddress = /^(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])\.(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])\.(\d\d?)|(1\d\d)|(0\d\d)|(2[0-4]\d)|(2[0-5])$/;
            if (ipv4addr && regExIPAddress.test(ipv4addr)){
                isValidIP = true;
            }
            return isValidIP;
        }
    };

    return IPv6AddressUtil;
});
