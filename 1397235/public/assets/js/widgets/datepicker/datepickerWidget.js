/**
 * Datepicker widget uses Jquery UI datepicker for attaching calender popup to input field.
 * Date format will be picked based on the locale
 *
 * @module Datepicker
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'jqueryui',
    'text!widgets/datepicker/templates/icons.html',
    'widgets/datepicker/conf/datepicker.i18n',
    'lib/i18n/i18n'
], /** @lends Datepicker */ function (jQueryDatepicker, iconsTemplate, i18nConf, i18n) {

    /**
     * DatepickerWidget constructor
     *
     * @constructor
     * @class DatepickerWidget
     * @param {Object} confObj - Datepicker's configuration object
     * @return {Object} instance of datepicker object
     *
     * conf object
     * @param {String} container - required - id for the input field where datepicker will be attached
     * @param {String} dateFormat - optional - date format that the datepicker will render for the date.
     * @example
     * var conf={
             container: '#inputField',
             dateFormat: 'mm/dd/yyyy',
             };
     */

    var DatepickerWidget = function (confObj) {

        var $dateElement = $(confObj.container);
        var locale = window.navigator.language || window.navigator.userLanguage;
        var self = this;

        /*
         * Getter returns selected date as a javascript Date object
         * @return {Date} Javascript Date Object
         *
         */
        this.getDate = function () {
            return $dateElement.datepicker("getDate");
        };

        /*
         * Sets date with a javascript Date object or with valid date string
         *
         * @param {Date} Javascript Date Object with desired date.
         * @return {Date} boolean: return value based on either the value is correctly set or error thrown
         *
         */
        this.setDate = function (newDate) {

            if (!newDate || _.isBoolean(newDate) || (!_.isDate(newDate) && _.isObject(newDate) && _.isEmpty(newDate))) {
                // Do not set date if input value is {undefined, null, [], {}, true, false}
                return false;
            }

            try {
                var dateFormat = $dateElement.datepicker("option", "dateFormat");

                if (newDate instanceof Date) {
                    newDate = $.datepicker.formatDate(dateFormat, newDate);
                }
                // validate the dateformat against the date
                $.datepicker.parseDate(dateFormat, newDate);

                $dateElement.datepicker("setDate", newDate);
                return true;

            } catch (error) {
                console.log("datePickerWidget - Incorrect date value '" + newDate + "' for format: " + confObj.uiDateFormat);
                $dateElement.val(newDate);  // update the input field to show the incorrect date value
                return false;
            }

        };


        /*
         * Set minimum (earliest) date with a javascript Date object
         *
         * @param {Date} Javascript Date Object with desired minimum date.
         *
         */
        this.minDate = function (newMinDate) {
            $dateElement.datepicker("option", "minDate", newMinDate);
            cleanExtraIcon();
        };


        /*
         * Set maximum (latest) date with a javascript Date object
         *
         * @param {Date} Javascript Date Object with desired maximum date.
         *
         */
        this.maxDate = function (newMaxDate) {
            $dateElement.datepicker("option", "maxDate", newMaxDate);
            cleanExtraIcon();
        };

        /*
         * Enables / Disables the input field & date picker icon
         *
         * @param {Boolean} value as true / false
         *
         */
        this.disable = function (value) {
            $dateElement.datepicker("option", "disabled", value);
            cleanExtraIcon();
        };

        /**
         * Attach datepicker icon with calendar overlay to the input field.
         *
         * @return {Object} this DatepickerWidget object
         */
        this.build = function () {

            var jqueryDateFormat;

            // remove '-' from locales
            locale = locale.toLowerCase().replace(/-/g, '_');

            if (!locale || !i18nConf["regional_" + locale]) { //last OR fixes IE10 issue where i18nConf["regional_" + locale] is undefined
                locale = 'en';
            }

            if (confObj.dateFormat) {
                // if custom dateformat provided, insert it in the container as attribute for validations
                $dateElement.attr("data-dateformat", confObj.dateFormat);
                // if custom dateformat provided, override the locale dateformat
                jqueryDateFormat = confObj.dateFormat.toLowerCase().trim().replace("yyyy", "yy");
                i18nConf["regional_" + locale].dateFormat = jqueryDateFormat;
                if (!$dateElement.attr("placeholder")) {
                    $dateElement.attr("placeholder", confObj.dateFormat.toUpperCase());
                }
                confObj.uiDateFormat = confObj.dateFormat;
            } else {
                // insert dateFormat in the container as attribute for validations
                var localeDateFormat = i18nConf["regional_" + locale].dateFormat.replace("yy", "yyyy");
                $dateElement.attr("data-dateformat", localeDateFormat);
                if (!$dateElement.attr("placeholder")) {
                    $dateElement.attr("placeholder", localeDateFormat.toUpperCase());
                }
                confObj.uiDateFormat = localeDateFormat;
            }

            // bind jquery UI datepicker
            $.datepicker.setDefaults({
                inline: true,
                showOn: "button",
                buttonImage: "/assets/images/icon_date_picker.svg",
                buttonImageOnly: true,
                buttonText: i18n.getMessage('selectDate'),
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                showButtonPanel: true,
                yearRange: '-20:+20',
                currentText: i18n.getMessage('Today'),
                dayNames: [i18n.getMessage('Sunday'), i18n.getMessage('Monday'), i18n.getMessage('Tuesday'), i18n.getMessage('Wednesday'), i18n.getMessage('Thursday'), i18n.getMessage('Friday'), i18n.getMessage('Saturday')],
                dayNamesShort: [i18n.getMessage('Su'), i18n.getMessage('Mo'), i18n.getMessage('Tu'), i18n.getMessage('We'), i18n.getMessage('Th'), i18n.getMessage('Fr'), i18n.getMessage('Sa')],
                dayNamesMin: [i18n.getMessage('Sun'), i18n.getMessage('Mon'), i18n.getMessage('Tue'), i18n.getMessage('Wed'), i18n.getMessage('Thu'), i18n.getMessage('Fri'), i18n.getMessage('Sat')],
                monthNames: [i18n.getMessage('January'), i18n.getMessage('February'), i18n.getMessage('March'), i18n.getMessage('April'), i18n.getMessage('May'), i18n.getMessage('June'), i18n.getMessage('July'), i18n.getMessage('August'), i18n.getMessage('September'), i18n.getMessage('October'), i18n.getMessage('November'), i18n.getMessage('December')],
                monthNamesShort: [i18n.getMessage('Jan'), i18n.getMessage('Feb'), i18n.getMessage('Mar'), i18n.getMessage('Apr'), i18n.getMessage('May'), i18n.getMessage('Jun'), i18n.getMessage('Jul'), i18n.getMessage('Aug'), i18n.getMessage('Sep'), i18n.getMessage('Oct'), i18n.getMessage('Nov'), i18n.getMessage('Dec')]
            });


            setOptions($dateElement); // Method to set options for the datepicker

            if ($("#datepicker_wrapper").length == 0) {
                $("#ui-datepicker-div").wrap("<div id='datepicker_wrapper'></div>");
            }

            addIconsTheme($dateElement); // Method to provide icons theming

            var custom_goToToday = $.datepicker._gotoToday;
            $.datepicker._gotoToday = function (id) {
                custom_goToToday.call(this, id);
                this._selectDate(id);
            };
            return this;
        };

        /*
         * Method used to convert the lib provided tags for handling the images with the svg tags.
         * Icons including the main datepicker icon
         *
         */
        var addIconsTheme = function ($dateElement) {
            var datepickerImageIcon = $dateElement.parent().find("img.ui-datepicker-trigger"); //Main datepicker icon with img tag

            // if the element is present in dom, swap with svg tag
            if (!_.isUndefined(datepickerImageIcon[0])) { // TODO: Remove the undefined check as part of PR:1357690
                var svgIconImage = $(iconsTemplate); // select respective svg tag from template
                var eventsData = $._data(datepickerImageIcon[0], "events"); // get the existing handlers before replacing
                svgIconImage.on("click", eventsData.click[0].handler); //Attach handlers to new svg tag
                datepickerImageIcon.replaceWith(svgIconImage);
            }
        };

        /*
         * Method to set the options on the date element container
         */
        var setOptions = function ($dateElement) {
            $dateElement.datepicker({
                onSelect: function () {
                    onSelectHandler();
                },
                "dateFormat": i18nConf["regional_" + locale].dateFormat
            });
        };

        /*
         * Executing callback handler provided by app with the date value
         */
        var onSelectHandler = function () {
            confObj.onChange && confObj.onChange(self.getDate());
        };
        /*
         * When the methods are called on the datepicker lib puts the image tag
         * Since the image is converted in the svg, the extra img tag needs to be removed
         */
        var cleanExtraIcon = function () {
            $("img.ui-datepicker-trigger").remove();
        };

        /**
         * Remove datepicker functionality completely from the input field. This will return the element back to its pre-init state.
         *
         * @return {Object} this DatepickerWidget object
         */
        this.destroy = function () {
            $dateElement.datepicker("destroy");
            $('#ui-datepicker-div, svg.ui-datepicker-trigger').remove();
            return this;
        };
    };

    return DatepickerWidget;
});