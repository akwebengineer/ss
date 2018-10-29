define(function() {
	Slipstream.module("SDK", /** @lends DateFormatter */ function(SDK, Slipstream, Backbone, Marionette, $, _) {
		SDK.DateFormatter = {};

		/**
		 * Format a date in ISO8601 format
		 *
		 * @param {Object | String} date - a Date object or a date string in ISO8601 format.
		 * @param {String | object} format_options - Options describing how the date should be formatted.
		 * See {@link https://ssd-git.juniper.net/spog/slipstream/blob/master/docs/DateFormatter.md DateFormatter}.
		 * @return The date formatted according to the supplied format_string.
		 */
		SDK.DateFormatter.format = function(date, format_options) {
			return Slipstream.request("dateFormatter:format", date, format_options);
		}
	});

	return Slipstream.SDK.DateFormatter;
});