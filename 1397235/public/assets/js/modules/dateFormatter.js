define(['lib/dateFormatter/dateFormatter'], function(dateFormatter) {
	Slipstream.module("Date_Formatter", /** @lends Date_Formatter */ function(DateFormatter, Slipstream, Backbone, Marionette, $, _) {
		/**
		 * Format a date in ISO8601 format
		 *
		 * @param {Object | String} date - a Date object or a date string in ISO8601 format.
		 * @param {String | object} format_options - Options describing how the date should be formatted.
		 * See {@link https://ssd-git.juniper.net/spog/slipstream/blob/master/docs/DateFormatter.md DateFormatter}.
		 * @return The date formatted according to the supplied format_options.
		 */
		Slipstream.reqres.setHandler("dateFormatter:format", function(date, format_options) {
	        return dateFormatter.format(date, format_options);
		});
	});
});