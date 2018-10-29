define(
		[],
		function() {
			var TimeKeeper = {};
			TimeKeeper.getFirstDayOfNthHalfOfYear =  function(firstHalfOfYear) {
		        var rightNow = new Date();
		        var month = 1;
		        if (false === firstHalfOfYear) {
		            month = 7;
		        }
		        return new Date(rightNow.getFullYear(), month, 1, 0, 0, 0, 0);
		    };
		    TimeKeeper.getTZOffsetInMillis = function(date) {
		        var temp = date.toGMTString();
		        var gmt = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
		        return (date - gmt);
		    };
		    TimeKeeper.leftPad = function(string, size, character) {
		        var result = String(string);
		        character = character || " ";
		        while (result.length < size) {
		            result = character + result;
		        }
		        return result;
		    };
		    TimeKeeper.getGMTOffset = function(date, colon) {
		        var offset = date.getTimezoneOffset();
		        return (offset > 0 ? "-" : "+")
		            + TimeKeeper.leftPad(Math.floor(Math.abs(offset) / 60), 2, "0")
		            + (colon ? ":" : "")
		            + TimeKeeper.leftPad(Math.abs(offset % 60), 2, "0");
		    };
		    TimeKeeper.getTZOffsetString = function(date, colon) {
		        var millis = TimeKeeper.getTZOffsetInMillis(date);
		        var minutes = Math.floor(millis / (1000 * 60));
		        var tzStr = (minutes < 0 ? "-" : "+") +
		        TimeKeeper.leftPad(Math.floor(Math.abs(minutes) / 60), 2, "0") +
		                (colon ? ":" : "") +
		                TimeKeeper.leftPad(Math.abs(minutes) % 60, 2, "0");
		        return tzStr;
		    };
		    TimeKeeper.getTZString = function(date, withOffsetIfUTC, colon) {
		    	var tzStr = date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
		        if(tzStr === 'AM' || tzStr === 'PM') {
		        	tzStr = 'GMT' + getGMTOffset(date,false);

		        }

		        if ((('UTC' === tzStr) || ('GMT' === tzStr)) && (withOffsetIfUTC)) {
		           var millis = TimeKeeper.getTZOffsetInMillis(date);
		           if (0 === millis) {
		               return '';
		           }
		           tzStr = tzStr + TimeKeeper.getTZOffsetString(date, withOffsetIfUTC, colon);
		        }
		        return tzStr;
		    };
		    TimeKeeper.getLocale = function() {
		        if ( navigator ) {
		            if ( navigator.language ) {
		                return navigator.language;
		            }
		            else if ( navigator.browserLanguage ) {
		                return navigator.browserLanguage;
		            }
		            else if ( navigator.userLanguage ) {
		                    return navigator.userLanguage;
		            }
		            else if ( navigator.systemLanguage ) {
		                        return navigator.systemLanguage;
		            }
		        }
		    };
		    TimeKeeper.getTZStringForTimeOfYear = function(firstHalfOfYear, withOffsetIfUTC, colon) {
		        var firstOfMonth = TimeKeeper.getFirstDayOfNthHalfOfYear(firstHalfOfYear);
		        return TimeKeeper.getTZString(firstOfMonth, withOffsetIfUTC, colon);
		    };
		    TimeKeeper.getTZOffsetStringForTimeOfYear = function(firstHalfOfYear, colon) {
		        var firstOfMonth = TimeKeeper.getFirstDayOfNthHalfOfYear(firstHalfOfYear);
		        return TimeKeeper.getTZOffsetString(firstOfMonth, colon);
		    };
		    TimeKeeper.getXDate = function() {
		    	return TimeKeeper.getTZStringForTimeOfYear(true, true, false) + 
		    	',' + TimeKeeper.getTZOffsetStringForTimeOfYear(true, false) +
		    	',' + TimeKeeper.getTZStringForTimeOfYear(false, true, false) +
		    	',' + TimeKeeper.getTZOffsetStringForTimeOfYear(false, false) +
		    	',' + TimeKeeper.getLocale();
		    };
			return TimeKeeper;

			
		});