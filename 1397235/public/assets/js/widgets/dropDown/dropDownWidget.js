/**
 * A module that builds a Drop Down widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget
 * and the configuration required by the third party library: select2.
 *
 * @module DropDownWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'select2',
    'text!widgets/dropDown/templates/checkboxOption.html',
    'text!widgets/dropDown/templates/clearAll.html',
    'text!widgets/dropDown/templates/iconTemplate.html',
    'lib/template_renderer/template_renderer',
    'widgets/dropDown/lib/tooltipBuilder',
    'lib/i18n/i18n'
], /** @lends DropDownWidget */
function (select2, checkboxOptionTemplate, clearAllTemplate, iconTemplate, render_template, TooltipBuilder, i18n) {

    /**
     * DropDownWidget constructor
     *
     * @constructor
     * @class DropDownWidget - Builds a drop down widget from a configuration object.
     *
     * @param {Object} conf - It requires the following parameters:
     * container: define the container where the widget will be rendered
     * data: define the elements that will be showed in the drop down (select elements). It should be a JSON object and could include disabled (true) and selected (true) for the select options.
     * matcher: defines a javascript function to be used instead of the default filter.
     * placeholder: defines a short hint that describes the expected action in the dropdown.
     * multipleSelection: adds support for multi-value select boxes. It includes the parameters:
     * - maximumSelectionLength: restricts the maximum number of options selected
     * - createTags: allows user to create new tags or select options
     * - allowClearSelection: allows to remove all elements from the list of selected options when it is set to true
     * onChange:  A callback function to be called whenever the value in the dropdown is changed.  The callback takes a
     * single Object as a parameter with the following attributes:
     * - val: The new value selected in the dropdown
     * onClose: A callback function to be called before the dropdown is closed.
     * enableSearch: Boolean true if the drop-down should allow search within the set of values, false otherwise.
     * Defaults to true if not specified.
     * initValue: Specifies the initial value of the dropdown.
     * dropdownTooltip: Can either be a boolean or an object. Boolean true or an object with functionBefore callback will show tooltip on hovering over the dropdown item.
     *
     * @returns {Object} Current DropDownWidget's object: this
     */
    var DropDownWidget = function (conf) {
        var select2Configuration,
            tooltipBuilder,
            self = this,
            reselect = true; // Flag used for setting dropdown selection when either conf.initVal is set or by using setValue()

        var dropdownWidth = {
            smallWidth: '130px',
            mediumWidth: '260px',
            largeWidth: '520px'
        };

        var errorMessages = {
            'noDropdown': 'dropDown widget is not built'
        };
        /*
         * Internal handling of data.text  and implicit return of initial dropdown format
         * @param {Object} Automatically provided by select2 library
         *
         */

        var templateSelection_ = function (data) {
            if (data.text && data.text !== "") {
                return data.text;                 // TODO: Consider the cons of this approach if the user's ajax data has data.text, but the user wants to display a value other than data.text
            }
            if (conf.templateSelection) {
                return conf.templateSelection(data);
            }
        };

        /**
         * Callback for the mousemove event on dropdown items to build tooltip on hover.
         */
        var onHover = function (e) {

            var isTooltipstered = true;
            if (!$(e.target).hasClass('tooltipstered')) {
                isTooltipstered = false;
            }
            data = $(e.target).data('value');
            if (!isTooltipstered && data && (data['tooltip_text'] || _.isObject(conf.dropdownTooltip))) {
                tooltipBuilder.addContentTooltips(e.target);
            }

            if (!isTooltipstered) {
                $(e.target).trigger('mouseenter');
            }
        };

        this.conf = {
            $container: $(conf.container),
            data: conf.data
        };

        var requestDelay = 500;


        /**
         * Default callback for templateResult configuration parameter.
         * The function will add 'value' attribute to select2-results (list elements).
         * If the configuration has the explicit templateResult callback, it will be taken care of.
         * The function will also add checkbox if 'showCheckboxes' configuration parameter is set to true.
         * @param {Object} data object of dropdown configuration.
         * @param {object} container where hover event is triggered.
         */
        var format = function (data, container) {
            var result = '';
            var dropdownValue;

            if (data && !data['loading']) {
                $(container).data('value', data);
            }

            if (conf.templateResult) {
                result = conf.templateResult(data);
            }

            else if (conf.showCheckboxes) {
                if (data.id) {
                    var $res = $(render_template(checkboxOptionTemplate, {
                        'text': data.text,
                        'selected': data.element.selected
                    }));
                    result = $res;
                }
            }

            else {
                result = data.text;
            }

            return result;
        };

        /**
         * Modify the height and/or width of select2-container if 'height' and/or 'width' is provided in configuration
         * @inner
         */
        var modifySize = function () {
            if (conf.width) {
                var resolvedWidth;
                if (_.isString(conf.width)) {
                    switch (conf.width) {
                        case 'small':
                            resolvedWidth = dropdownWidth.smallWidth;
                            break;
                        case 'large':
                            resolvedWidth = dropdownWidth.largeWidth;
                            break;
                        case 'medium':
                            resolvedWidth = dropdownWidth.mediumWidth;
                            break;
                        case 'auto':
                            self.conf.$container.addClass("dropdown-auto-width");

                            break;
                    }
                }
                else if (_.isNumber(conf.width)) {
                    resolvedWidth = conf.width;
                }

                if (!_.isUndefined(resolvedWidth)) {
                    _.extend(select2Configuration, {
                        width: resolvedWidth
                    });
                }
            }
            if (conf.height == "small") { //only supports small and default height
                self.conf.$container.addClass("dropdown-small-height");
            }
        };

        /**
         * Creates a clear selection element trailing the drop drop widget.
         * @inner
         */
        var renderClearSelection = function () {
            var $clearAll = $(render_template(clearAllTemplate, {label: i18n.getMessage('dropdown_clearall')}));
            self.conf.$container.after($clearAll);

            $clearAll.on('click', function (e) {
                self.setValue(null, true);
            });
        };

        /**
         * Builds the Dropdown widget in the specified container
         * @returns {Object} Current "this" of the class
         */
        this.build = function () {
            var $parentContainer = this.conf.$container.parent();
            var selectedValues;
            $parentContainer.addClass('dropdown-widget');

            if (conf.data) {
                this.conf.data = typeof(conf.data) === 'object' ? conf.data : JSON.parse(conf.data);
            }


            select2Configuration = {
                // dropdownParent: $parentContainer, ** TODO: uncomment when absolute positioning bug      **
                //                                   ** is fixed in select2 library.                       **
                //                                   ** see https://github.com/select2/select2/issues/3303 **
                containerCssClass: "dropdown-widget",
                data: this.conf.data,
                placeholder: conf.placeholder,
                matcher: conf.matcher,
                templateSelection: templateSelection_,
                dropdownAutoWidth: true,
                templateResult: format,
                remoteData: conf.remoteData // used for the lazy loading
            };

            if (conf.dropdownTooltip && (_.isObject(conf.dropdownTooltip) || _.isBoolean(conf.dropdownTooltip))) {
                _.extend(select2Configuration, {
                    dropdownCssClass: 'tooltip'
                })
            }

            if (conf.initValue) {
                _.extend(select2Configuration, {
                    initSelection: function (element, callback) {
                        var data = {id: conf.initValue.id, text: conf.initValue.text};
                        callback(data);
                    }
                });
            }

            if (!conf.enableSearch) {
                _.extend(select2Configuration, {
                    minimumResultsForSearch: Infinity
                });
            }


            if (conf.multipleSelection) {
                this.conf.$container.attr('multiple', 'multiple');
                if (conf.multipleSelection.createTags) {
                    _.extend(select2Configuration, {
                        maximumSelectionLength: conf.multipleSelection.maximumSelectionLength,
                        tags: conf.multipleSelection.createTags,
                        tokenSeparators: [',', ' ']
                    })
                } else {
                    _.extend(select2Configuration, {
                        maximumSelectionLength: conf.multipleSelection.maximumSelectionLength
                    })
                }
            }


            /* configuration used to handle virtual scroll & search with virtual scroll*/
            if (conf.remoteData) {
                $.extend(true, select2Configuration, {
                    "ajax": {
                        "cache": true,
                        "headers": conf.remoteData.headers,
                        "url": conf.remoteData.url,
                        "type": conf.remoteData.type || "GET",
                        "delay": conf.remoteData.delay || requestDelay, // delay time after which the remote call will occur
                        "dataType": conf.remoteData.dataType || "json", // default to JSON type
                        "data": function (params) {
                            params.page = params.page || 1;

                            var pageStart = (params.page - 1) * conf.remoteData.numberOfRows;

                            var queryString = {
                                page: params.page,
                                paging: "(start eq " + pageStart + ", limit eq " + conf.remoteData.numberOfRows + ")"
                            };

                            // extend queryString so that on initial drop down load, the _search or q parameter is not used
                            if ((typeof (params.term) != "undefined") && (params.term.trim().length != 0)) {
                                queryString._search = params.term; //search term used by Server call
                                //queryString.q = params.term; //search term used by library
                            } else if (conf.enableSearch) {
                                params.term = " ";
                            }
                            if (_.isFunction(conf.remoteData.data)) {
                                queryString = $.extend(queryString, conf.remoteData.data(queryString));
                            }
                            if (_.isFunction(conf.remoteData.reformatURL)) { // Override URL format with custom callback
                                return conf.remoteData.reformatURL(queryString);
                            }
                            return queryString;
                        },
                        "processResults": function (data, params) {
                            // parse the results into the format expected by Select2, indicates the infinite scrolling
                            return {
                                results: parseData(data),
                                pagination: {
                                    more: (params.page * conf.remoteData.numberOfRows) < conf.remoteData.jsonRecords(data) //total Records
                                },
                                initSelect: initSelectDD(this, conf.initValue) // Method to handle highlighting and selection of initValue after ajax call. "this" refers to select2 object
                            }
                        },
                        "success": conf.remoteData.success,
                        "error": conf.remoteData.error
                    }
                });
                /* parse data to pick the actual array of objects from the returned data */
                var parseData = function (data) {
                    var jsonRootKeys = conf.remoteData.jsonRoot.split(".");
                    var jsonData = data;
                    for (var i = 0; i < jsonRootKeys.length; i++) {
                        jsonData = jsonData[jsonRootKeys[i]];
                    }
                    conf.remoteData.reformatData && (jsonData = conf.remoteData.reformatData(jsonData));
                    return jsonData;
                };

                /*
                 * Highilight and select the item in the dropdown that corresponds to conf.initValue during dropdown build process
                 * @param {Object} corresponds to select2 object
                 * @param {object} corresponds to conf.initValue
                 * @inner
                 */
                var initSelectDD = function (s2, initVal) {
                    if (initVal && reselect) {
                        s2.select(initVal);
                        reselect = false;
                    }
                };

            }

            modifySize();

            if (conf.allowClearSelection || (conf.multipleSelection && conf.multipleSelection.allowClearSelection)) {
                renderClearSelection();
            }
            this.conf.$container.select2(select2Configuration);
            tooltipBuilder = new TooltipBuilder(conf);

            if (conf.maxHeight && _.isNumber(conf.maxHeight)) {
                $parentContainer.find('.select2-selection').css('max-height', conf.maxHeight + 'px');
            }

            this.conf.$container.on('select2:open', function (e) {
                var $select2_dropdown = $('.select2-dropdown');
                if ($select2_dropdown && $select2_dropdown.hasClass('tooltip')) {

                    var $select2_results = $select2_dropdown.find('.select2-results');
                    $select2_results.on('mousemove.fn', '.select2-results__option', onHover);

                }
            });


            this.conf.$container.on('select2:closing', function (e) {

                var $select2_results = $('.select2-dropdown .select2-results');
                $select2_results.off('mousemove.fn', '.select2-results__option', onHover);
                if (tooltipBuilder) {
                    tooltipBuilder.destroyTooltip();
                }
                if (conf.onClose) {
                    conf.onClose(e, selectedValues);
                }
            });

            if (conf.onChange) {
                this.conf.$container.on("change", conf.onChange);
            }

            if (conf.onSelect) {
                this.conf.$container.on("select2:select", conf.onSelect);
            }

            this.conf.$container.on("select2:selecting", function (e) {
                selectedValues = $(this).select2("val");
                if (conf.multipleSelection) {
                    if (selectedValues && ((selectedValues.length) >= conf.multipleSelection.maximumSelectionLength)) {
                        e.preventDefault();
                    }
                }
            });

            createDropDownArrow(); //Create drop down arrow.

            return this;
        };


        /*Reset the data that is set for the drop down
         Not for use with remoteData since addData extends conf.data which is ignored in cases of conf.remoteData
         @param {Array} data to be used for replacing the drop down data
         @param resetData flag to be used for resetting data or appending data
         */
        this.addData = function (selectData, resetData) {
            if (resetData) {
                this.conf.$container.select2().empty();
            }
            selectData = typeof(selectData) === 'object' ? selectData : JSON.parse(selectData);
            this.conf.$container.select2(_.extend(select2Configuration, {data: selectData}));
            createDropDownArrow(); //Ensures that the dropdown icon exists.
        };

        /**
         * Destroys all elements created by the Dropdown widget in the specified container
         * @returns {Object} Current Dropdown object
         */
        this.destroy = function () {
            var $container = this.conf.$container;
            $container.parent().find('.clearAll').remove();

            // Modified with the upgrade of select2 library from 4.0.0 to 4.0.3
            $container.select2("destroy");
            return this;
        };

        /**
         * Get the current value of the dropdown.
         */
        this.getValue = function () {
            return this.conf.$container.select2("val");
        };

        /**
         * Get the current object of dropdown
         *
         * @returns {Array} Selected dropdown objects
         */
        this.getValueObject = function () {

            var $dropdownContainer = this.conf.$container;
            if ($dropdownContainer.data('select2')) {
                var valueObj = $dropdownContainer.select2("data");
                // Workaround for Select2 discarding value object except text and id.
                // Use the previously saved jQuery element data in cases when setValue() is called on a remote dropdown
                if(conf.remoteData && valueObj[0]) {
                    var savedOrigData = $dropdownContainer.find("." + valueObj[0].id).data();
                    if(savedOrigData){
                        valueObj = savedOrigData;
                    }
                }
                var newValueObj = _.map(valueObj, function (key) {
                    return _.omit(key, 'element');
                });
                return newValueObj;
            }
            else {
                throw new Error(errorMessages.noDropdown);
            }
        };

        /**
         *  Set the value of the dropdown
         *  @param {Object} || {String} value - The value to be set into the dropdown
         *  @param {Boolean} triggerChange - Optional parameter which indicates whether to trigger 'change' event or not
         *  ****** @param Type 1: {id: <id of the dropdown value>, text: <data to be displayed in the dropdown>}  For use with remoteData
         *  ****** @param Type 2: <id of the dropdown value> For use with Local data
         *  For remoteData, setValue can be used to change the displayed value to ANY value by passing the params {id: < >, text: < >}.
         *  ****** Care should be taken to pass the same value to the remote data source
         *  ****** If setValue() is used for setting the initial value of a remote dropdown, the text and id must match a value from the expected remote data.
         *  For local data, setValue can be used to change the displayed value to a value that exists in conf.data. The method CANNOT be used to set the display to a value that is not in conf.data.
         *  ****** setValue() with remoteData will append the value to the set of already selected values. Whereas setValue() with localData will replace the already selected values with the values passed as a parameter.
         */
        this.setValue = function (value, triggerChange) {
            var maxAllowedSelectionLength = 1,
                selectedValuesLength = 0,
                triggerChangeRequired = _.isBoolean(triggerChange) ? triggerChange : true,
                changeEvent = triggerChangeRequired ? "change" : "change.select2"; // Select2 requires change event to be triggered after setting the value. Namespace the event with select2 if triggerChange is false. In that case only select2 library will be able to listen for it.

            (conf.multipleSelection) && ( maxAllowedSelectionLength = conf.multipleSelection.maximumSelectionLength);

            (this.conf.$container.select2("val")) && (selectedValuesLength = this.conf.$container.select2("val").length);
            if (conf.remoteData && value) {
                if ((!conf.multipleSelection) || (conf.multipleSelection && selectedValuesLength < maxAllowedSelectionLength)) {
                    var option = new Option(value.text, value.id);
                    // Workaround for Select2 discarding value object except text and id. Save the original value object in the jquery element data to be retrieved when getValueObject() is called
                    $(option).addClass(value.id).data("valueObject", value);
                    this.conf.$container.append(option);
                    option.selected = true;
                    this.conf.$container.trigger(changeEvent);
                }
            }
            else {
                var valueData = value;
                if (_.isArray(value)) {
                    var maxValLength = (value.length < maxAllowedSelectionLength) ? value.length : maxAllowedSelectionLength;
                    valueData = value.slice(0, maxValLength);
                    if (value[0] && _.isObject(value[0])) {
                        valueData = [];
                        for (var i = 0; i < maxValLength; i++) {
                            value[i].id && valueData.push(value[i].id);
                        }
                    }
                }
                else if (_.isObject(value)) {
                    value.id && ( valueData = value.id );
                }

                this.conf.$container.val(valueData).trigger(changeEvent);

            }
            this.conf.$container.trigger("select2:select");
            return value;
        };

        /**
         * Toggle the state of the dropdown widget from opened to closed and vice versa unless the open parameter is available.
         * @param {boolean} open - optional parameter that indicates if the dropdown widget content should be showed opened (true) or closed (false)
         */
        this.toggleState = function (open) {
            var isOpenState = _.isBoolean(open) ? !open : this.conf.$container.select2('isOpen');
            if (isOpenState) {
                this.conf.$container.select2('close');
            } else {
                this.conf.$container.select2('open');
            }
        };

        /**
         * Enables or disables the user interaction of the dropdown widget or any of its elements
         * @param {boolean} state - true for enabled or false for disabled
         * @param {string or array of strings} ids - ids to be enabled or disabled
         * @inner
         */
        var updateItemState = function (state, ids) {
            if (ids) {
                var currentValue = self.getValue();
                ids = _.isString(ids) ? [ids] : ids;
                ids.forEach(function (id) {
                    self.conf.$container.find("option[value=" + id + "]").prop("disabled", !state);
                });
                if (!state && !_.isEmpty(currentValue)) { //disable case: remove item that is disabled but was selected
                    if (conf.multipleSelection) {
                        var newValue = _.difference(currentValue, ids);
                        self.setValue(newValue);
                    } else if (~ids.indexOf(currentValue)) {
                        self.conf.$container.val("");
                    }
                }
                self.conf.$container.select2(select2Configuration); //a known bug in Select2 4.0.0. The disabled property is cached, but the selected (and other properties) are not: https://github.com/select2/select2/issues/3347
                createDropDownArrow(); //Ensures that the dropdown icon exists.
            } else {
                self.conf.$container.prop("disabled", !state);
            }
        };

        /**
         * Creates drop down icon if it does not exist.
         * @inner
         */
        var createDropDownArrow = function () {
            var $parentContainer = self.conf.$container.parent();

            $parentContainer.find('.select2-selection').append(iconTemplate);
        };

        /**
         * Disables the user interaction in the dropdown widget
         * @param {string or array of strings} ids - ids to be enabled or disabled
         */
        this.disable = function (ids) {
            updateItemState(false, ids);
        };

        /**
         * Enables the user interaction in the dropdown widget
         * @param {string or array of strings} ids - ids to be enabled or disabled
         */
        this.enable = function (ids) {
            updateItemState(true, ids);
        };

    };

    return DropDownWidget;
});