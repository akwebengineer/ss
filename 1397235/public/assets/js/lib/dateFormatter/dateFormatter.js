define(['moment-tz'], function(moment) {
	var timezone = moment.tz.guess();

    var DateFormatter = {
		/**
		 * Format a date in ISO8601 format
		 *
		 * @param {Object | String} date - a Date object or a date string in ISO8601 format.
		 * @param {String | object} format_options - Options describing how the date should be formatted.
		 * See {@link https://ssd-git.juniper.net/spog/slipstream/blob/master/docs/DateFormatter.md DateFormatter}.
		 * @return The date formatted according to the supplied format_string.
		 */
		format: function(date, format_options) {
			var amoment = moment(date)
			var formatString;

			if (_.isString(format_options)) {
				formatString = format_options;   
			}
			else if (_.isObject(format_options)) { // an object specifying a pre-defined date format
                formatString = getPredefinedFormatString(format_options);
			}
			else {
				throw new Error("Format options must be a string or an object");
			}

			return amoment.tz(timezone).format(formatString);
		}
	}

	/**
	 *  Get the current browser locale
	 * 
	 *  @return The current locale setting for the browser
	 */
	function get_browser_locale() {
	    return navigator.language || navigator.userLanguage;
	}

	/**
     * Format the date using a predefined format.
     *
     * @param {String | object} format_options - Options describing how the date should be formatted.
	 * See {@link https://ssd-git.juniper.net/spog/slipstream/blob/master/docs/DateFormatter.md DateFormatter}.
	 * @return The date formatted according to the supplied format_string.
     */
	function getPredefinedFormatString(format_options) {
		var formatString;
        var timeFormat = (format_options.options && format_options.options.seconds && "LTS") || "LT";

		switch (format_options.format) {
			case "short":
			    formatString = "ll, " + timeFormat;
			    break;
			case "long":
			    formatString = "ll, " + timeFormat + ", UTC Z z"
			    break;
		}

		return formatString;
	}

    // set the current locale
    moment.locale(get_browser_locale());

	return DateFormatter;
});