/**
 * A module that integrates the form widget with other widgets that build elements of a form
 *
 * @module WidgetsIntegration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/numberStepper/numberStepperWidget',
    'widgets/datepicker/datepickerWidget',
    'widgets/ipCidr/ipCidrWidget',
    'widgets/time/timeWidget',
    'widgets/timeZone/timeZoneWidget',
    'widgets/dropDown/dropDownWidget',
    'widgets/form/lib/visibilitySelector',
    'widgets/grid/gridWidget',
    'widgets/toggleButton/toggleButtonWidget',
    'widgets/tabContainer/tabContainerWidget',
    'widgets/slider/sliderWidget',
    'widgets/form/lib/formPasswordStrength'
], /** @lends WidgetsIntegration */
    function (NumberStepperWidget, DatepickerWidget, IpCidrWidget, TimeWidget, TimeZoneWidget, DropDownWidget, VisibilitySelector, GridWidget, ToggleButtonWidget, TabContainerWidget, SliderWidget, FormPasswordStrength) {

    /**
     * WidgetsIntegration constructor
     *
     * @constructor
     * @class WidgetsIntegration
     *
     * @param {Object} formConfigurationElementsById - configuration of the form by element id
     * @param {Object} formConfiguration - configuration of the form
     *
     */
    var WidgetsIntegration = function (formConfigurationElementsById, formConfiguration) {

        var formConfigurationById = formConfigurationElementsById,
            instantiatedWidgets = {},
            commonElementProperties = ['id', 'class', 'label', 'name', 'required', 'field-help', 'notshowrequired', 'error', 'inlineLinks', 'inlineIcons', 'inlineButtons', 'help'],
            $form, visibilitySelector, formPasswordStrength;

        /**
         * Iterate through the form and extracts all of the elements that need to be integrated with the form and
         * adds them to the form widget
         * The elements are identified by the data-widget attribute
         * @param {Object} form - form that require integration with widgets that build elements of a form
         * @param {Object} visibilitySelectorInstance - instance of the VisibilitySelector class
         * @param {Object} updatedFormConfigurationById - configuration of the form by element id
         * @returns {Object} form with added element widgets
         */
        this.addWidgets = function (form, visibilitySelectorInstance, updatedFormConfigurationById) {
            $form = form;
            visibilitySelector = visibilitySelectorInstance;
            updatedFormConfigurationById && (formConfigurationById = updatedFormConfigurationById);
            formPasswordStrength = new FormPasswordStrength($form);
            var els = form.find('[data-widget]');
            for (var i = 0; i < els.length; i++) {
                this.buildWidget(els[i]);
            }
            return form;
        };

        this.addWidget = function (ele) {
            var els = ele.find('[data-widget]');
            this.buildWidget(els);
            return ele;
        };

        /**
         * Identifies the widget that needs to be built and provides the parameters required to have the widget build.
         * The container is updated with the html and events built by the element widget
         * @param {Object} ele - Dom element that requires integration with a element widget
         */
        this.buildWidget = function (ele) {
            var $ele = $(ele),
                widgetIdentifier = $ele.data('widget') + "_" + $ele.attr('id'),
                initValue;

            //sets the instantiatedWidgets Object and data-widgetidentifier attribute for elements built from other widgets (datePicker, time, timeZone, etc.)
            var setInstantiatedWidget = function ($ele) {
                var $parentRow = getParentRow($ele);
                instantiatedWidgets[widgetIdentifier] = { "element": $parentRow.clone(true, true) };
                $parentRow.attr('data-widgetidentifier', widgetIdentifier);
            };
            /**
             * gets the value of a form element from the value configuration of the form widget. it follows the "{{value}}" format, the same that is used in binding data to an input element
             * @param $ele form element for which the initial value needs to be returned
             * @param eleId element id
             * @param initValue Initial value given for the field in the configuration
             * @return initial value
             */
            var getInitValue = function ($ele, eleId, initValue) {
                var elementConfiguration = formConfigurationById[eleId],
                    getValue = function (valueKey) {
                        var keys = valueKey.split("."),
                            value = formConfiguration["values"][keys[0]];
                        for (var i = 1; i < keys.length; i++) {
                            value = value[keys[i]];
                            if (typeof(value) == "undefined")
                                return;
                        }
                        return value;
                    },
                    initVal = elementConfiguration && _.isUndefined(initValue)? elementConfiguration.initValue : initValue;
                if (initVal) {
                    if (_.isString(initVal) && initVal.substring(0, 2) == "{{" && initVal.slice(-2) == "}}") {
                        var valueKey = initVal.substring(2, initVal.length - 2);
                        if (formConfiguration["values"]) {
                            if (~valueKey.indexOf("."))
                                return getValue(valueKey);
                            else
                                return formConfiguration["values"][valueKey];
                        }
                    } else {
                        return initVal;
                    }
                }
            };

            switch ($ele.data('widget')) {
                case 'datePicker':
                    setInstantiatedWidget($ele);
                    instantiatedWidgets[widgetIdentifier]['instance'] = new DatepickerWidget({
                        dateFormat: $ele.data('dateformat'),
                        container: ele
                    }).build();
                    instantiatedWidgets[widgetIdentifier]['instance'].disable($ele.attr('disabled') === 'disabled');

                    var $parentContainer = getGroupContainer($ele);
                    if ($parentContainer.length) {
                        initValue = getInitValue($parentContainer, $parentContainer.attr('id'));
                        initValue && (initValue = initValue.date);
                    } else {
                        initValue = getInitValue($ele, $ele.attr('id'));
                    }
                    initValue && instantiatedWidgets[widgetIdentifier]['instance'].setDate(initValue);

                    break;
                case 'ipCidr':
                    setInstantiatedWidget($ele);
                    var ipCidrRow = getParentRow($ele).empty();
                    var eleData = $ele.data();
                    if (eleData['ip_field_help_content'] || eleData['ip_field_help_alias']) {
                        eleData['ip_field-help'] = {
                            'content': eleData['ip_field_help_content'],
                            'ua-help-identifier': eleData['ip_field_help_alias']
                        };
                        delete eleData['ip_field_help_content'];
                        delete eleData['ip_field_help_alias'];
                    }
                    if (eleData['subnet_field_help_content'] || eleData['subnet_field_help_alias']) {
                        eleData['subnet_field-help'] = {
                            'content': eleData['subnet_field_help_content'],
                            'ua-help-identifier': eleData['subnet_field_help_alias']
                        };
                        delete eleData['subnet_field_help_content'];
                        delete eleData['subnet_field_help_alias'];
                    }

                    //adds custom validation data to an element if the object is available in the elements configuration object
                    var customValidationCallback = formConfigurationById[$ele.attr('id')]['customValidationCallback'];
                    customValidationCallback && (eleData['customValidationCallback'] = customValidationCallback);

                    instantiatedWidgets[widgetIdentifier]['instance'] = new IpCidrWidget({
                        "container": ipCidrRow,
                        "elements": eleData
                    }).build();

                    initValue = getInitValue($ele, $ele.attr('id'));
                    initValue && instantiatedWidgets[widgetIdentifier]['instance'].setValues(initValue.ip, initValue.cidr, initValue.subnet);

                    //adds id
                    formConfigurationById[$ele.attr('id')].id && ipCidrRow.attr("id", formConfigurationById[$ele.attr('id')].id);
                    break;
                case 'time':
                    var eleId = $ele.attr('id');
                    setInstantiatedWidget($ele);
                    instantiatedWidgets[widgetIdentifier]['instance'] = new TimeWidget({
                        "container": ele
                    }).build();
                    initValue = getInitValue($ele, eleId);
                    $ele.unwrap();

                    if (initValue) {
                        instantiatedWidgets[widgetIdentifier]['instance'].setTimePeriod(initValue.period);
                        instantiatedWidgets[widgetIdentifier]['instance'].setTime(initValue.time);
                    }
                    formConfigurationById[eleId] && formConfigurationById[eleId].disabled && instantiatedWidgets[widgetIdentifier]['instance'].disable(true);
                    break;
                case 'timeZone':
                    setInstantiatedWidget($ele);
                    instantiatedWidgets[widgetIdentifier]['instance'] = new TimeZoneWidget({
                        "container": ele
                    }).build();

                    initValue = getInitValue($ele, $ele.attr('id'));
                    initValue && instantiatedWidgets[widgetIdentifier]['instance'].setSelectedTimezone(initValue);
                    break;
                case 'dateTime':
                    setInstantiatedWidget($ele);
                    var $widgetContainer = getGroupContainer($ele),
                        widgetContainerId = $widgetContainer.attr('id');
                    initValue = getInitValue($widgetContainer, widgetContainerId);

                    var parentContainer = $ele.parent();
                    $ele.detach();
                    parentContainer.after($ele);
                    instantiatedWidgets[widgetIdentifier]['instance'] = new TimeWidget({
                        "container": $ele
                    }).build();
                    $ele.find('.elementlabel').remove();

                    if (initValue) {
                        instantiatedWidgets[widgetIdentifier]['instance'].setTimePeriod(initValue.period);
                        instantiatedWidgets[widgetIdentifier]['instance'].setTime(initValue.time);
                    }
                    formConfigurationById[widgetContainerId] && (formConfigurationById[widgetContainerId].disabled || formConfigurationById[widgetContainerId]['timeWidget'].disabled) && instantiatedWidgets[widgetIdentifier]['instance'].disable(true);
                    break;
                case 'dropDown':
                    setInstantiatedWidget($ele);
                    var formElementProperties = ['element_dropdown', 'values', 'dropdown_disabled'],
                        elementConfiguration = formConfigurationById[$ele.attr('id')],
                        dropDownWidgetConfiguration = getWidgetConfiguration(elementConfiguration, commonElementProperties.concat(formElementProperties));
                    initValue = getInitValue($ele, $ele.attr('id'));
                    dropDownWidgetConfiguration.onSelect = visibilitySelector.updateBasedOnDropdown($ele.attr('id'), widgetIdentifier, instantiatedWidgets);

                    if (typeof(initValue) == 'undefined') {
                        dropDownWidgetConfiguration.initValue = initValue;
                    } else {
                        delete dropDownWidgetConfiguration.initValue;
                    }

                    _.isUndefined(elementConfiguration.values) && $ele.empty(); //remove option elements autogenerated by Mustache when values property is not available (and taking the default label from the row configuration).
                    dropDownWidgetConfiguration.container = ele;

                    dropDownWidgetConfiguration.onClose = function(e, prevSelectedValue) {
                        var $currentSelection = $(e.target);
                        if(!_.isUndefined($currentSelection.data('select2')) && $currentSelection.val() == "" && _.isUndefined(prevSelectedValue)) {
                            $currentSelection.trigger('change');
                        }
                    };

                    instantiatedWidgets[widgetIdentifier]['instance'] = new DropDownWidget(dropDownWidgetConfiguration).build();
                    if (initValue) {
                        if (!_.isObject(initValue))
                            initValue = {"id": initValue};
                        instantiatedWidgets[widgetIdentifier]['instance'].setValue(initValue);
                    }
                    break;
                case 'checkBox':
                case 'radioButton':
                    var elementId = getGroupContainer($ele).attr('id');

                    initValue = getInitValue($ele, elementId);
                    if (initValue) {
                        $ele.find('input').prop('checked', false);
                        if (_.isArray(initValue)) {
                            initValue.forEach(function (value) { //loops through the values set in the form configuration
                                if (_.isObject(value)) {
                                    if (!_.isEmpty(value) && _.isString(value.id) && _.isBoolean(value.checked)) {
                                        $ele.find('#' + value.id).prop('checked', value.checked);
                                    } else {
                                        if (value)
                                            console.log("incorrect values provided for the initValue of check box or radio button: " + value.id);
                                        else
                                            console.log("incorrect values provided for the initValue of check box or radio button");
                                    }
                                } else {
                                    $ele.find('#' + value).prop('checked', true);
                                }
                            });
                        } else {
                            $ele.find('#' + initValue).prop('checked', true);
                        }
                    }
                    break;
                case 'grid':
                    setInstantiatedWidget($ele);
                    var formElementProperties = ['element_grid'],
                        elementConfiguration = formConfigurationById[$ele.attr('id')],
                        gridWidgetConfiguration = getWidgetConfiguration(elementConfiguration, commonElementProperties.concat(formElementProperties));
                    if (formConfiguration.container.height() || ~formConfiguration.container.css("max-height").indexOf("px")) {
                        $ele.css("max-height", formConfiguration.container.height() || formConfiguration.container.css("max-height"));
                    }
                    instantiatedWidgets[widgetIdentifier]['instance'] = new GridWidget(_.extend({
                        "container": ele
                    }, gridWidgetConfiguration)).build();
                    break;
                case 'password':
                    var password_element_id = $ele.find('input').attr('id');
                    var passwordStrengthConf = formConfigurationById[password_element_id].showPasswordStrength;
                    if (!_.isUndefined(passwordStrengthConf) && (_.isObject(passwordStrengthConf) || (passwordStrengthConf === true))) {
                        formPasswordStrength.createPasswordStrengthBar(password_element_id, passwordStrengthConf, $ele);
                    }
                    break;
                case 'toggleButton':
                    setInstantiatedWidget($ele);
                    var formElementProperties = ['element_toggleButton', 'onfocus'],
                        elementConfiguration = formConfigurationById[$ele.attr('id')],
                        toggleButtonWidgetConfiguration = getWidgetConfiguration(elementConfiguration, commonElementProperties.concat(formElementProperties));

                    initValue = getInitValue($ele, $ele.attr('id'));
                    if (toggleButtonWidgetConfiguration && toggleButtonWidgetConfiguration.initValue) {
                        delete toggleButtonWidgetConfiguration.initValue;
                        toggleButtonWidgetConfiguration.on = initValue;
                    }

                    var $eleParent = $ele.parent('.elementinput').empty();
                    instantiatedWidgets[widgetIdentifier]['instance'] = new ToggleButtonWidget(_.extend({
                        "container": $eleParent,
                        "id": elementConfiguration.id,
                        "name": elementConfiguration.name
                    }, toggleButtonWidgetConfiguration)).build();
                    break;
                case 'tabContainer':
                    setInstantiatedWidget($ele);
                    var formElementProperties = ['element_tabContainer'],
                        elementConfiguration = formConfigurationById[$ele.attr('id')],
                        tabContainerWidgetConfiguration = getWidgetConfiguration(elementConfiguration, commonElementProperties.concat(formElementProperties));

                    if (formConfiguration.container.height() || ~formConfiguration.container.css("max-height").indexOf("px")) {
                        var maxHeight = formConfiguration.container.height() || parseInt(formConfiguration.container.css("max-height").slice(0, -2));
                        if (_.isString(elementConfiguration.height) && ~elementConfiguration.height.indexOf("%")) {
                            maxHeight *= elementConfiguration.height.slice(0,-1)/100;
                            delete tabContainerWidgetConfiguration.height; //height is taking care from the integration point (form) instead of the tabContainer widget
                        }
                        $ele.css("max-height", maxHeight); //stamp a height based on percentage
                    }
                    instantiatedWidgets[widgetIdentifier]['instance'] = new TabContainerWidget(_.extend({
                        "container": ele
                    }, tabContainerWidgetConfiguration)).build();
                    break;
                case 'numberStepper':
                    var elementId = $ele.attr("id"),
                        formElementProperties = ['error', 'label', 'ua-help', 'help', 'field-help', 'hidden'],
                        elementConfiguration = formConfigurationById[elementId],
                        buildNumberStepper = false,
                        initValue;

                    if(elementConfiguration) {
                        initValue = getInitValue($ele, elementId, elementConfiguration.value);
                        if(elementConfiguration.element_number) {
                            if(!_.isUndefined(elementConfiguration.numberStepper)) {
                                buildNumberStepper = elementConfiguration.numberStepper ? true: false;
                            } else {
                                buildNumberStepper = true;
                            }
                        }
                        else if(elementConfiguration.element_float) {
                            if(!_.isUndefined(elementConfiguration.numberStepper)) {
                                buildNumberStepper = elementConfiguration.numberStepper ? true: false;
                                if(elementConfiguration.numberStepper) {
                                    elementConfiguration._numberFormat = "n";
                                    elementConfiguration.step = 0.01;
                                }
                            }
                        }
                    }
                    var numberStepperConfiguration = getWidgetConfiguration(elementConfiguration, formElementProperties);
                    if(!_.isUndefined(numberStepperConfiguration))
                        numberStepperConfiguration.value = initValue;
                    if(buildNumberStepper) {
                        var internalAttributes = ['required', 'post_validation', 'onfocus'];
                        for(var i=0;i<internalAttributes.length;i++) {
                            numberStepperConfiguration['_'+internalAttributes[i]] = numberStepperConfiguration[internalAttributes[i]];
                            delete numberStepperConfiguration[internalAttributes[i]];
                        }
                        var inputWrapper = $ele.find("input");
                        if(inputWrapper.length > 0) {
                            $ele.removeAttr("id data-widget");
                            inputWrapper.remove();
                            setInstantiatedWidget($ele);
                            var numberStepperConf = {
                                'container': $ele
                            };
                            instantiatedWidgets[widgetIdentifier]['instance'] = new NumberStepperWidget(_.extend(numberStepperConf, numberStepperConfiguration)).build();
                        }
                    } else {
                        $ele = $ele.find("input");
                        $ele.unwrap();
                    }
                    break;
                case 'slider':
                    setInstantiatedWidget($ele);
                    var formElementProperties = ['element_slider'],
                        elementConfiguration = formConfigurationById[$ele.attr('id')],
                        sliderWidgetConfiguration = getWidgetConfiguration(elementConfiguration, commonElementProperties.concat(formElementProperties));

                    var $eleParent = $ele.parent('.elementinput').empty();
                    instantiatedWidgets[widgetIdentifier]['instance'] = new SliderWidget(_.extend({
                        "container": $eleParent
                    }, sliderWidgetConfiguration)).build();
                    break;
                default:
                    break;
            }
            return instantiatedWidgets[widgetIdentifier];
        };

        /**
         * Iterate through the instantiated widgets and extract the values assigned to the element. It is required that by elements built from a grid widget or slider widget. Other widgets like the date picker, date time, or ipCidr provides direct access to its value, so this method is not required.
         * @param {Array} formValues - values retrieved from the form that represents the name of the element and its value
         * @returns {Array} original form values plus the ones associates with the grid widget and slider widget instances
         */
        this.getWidgetsValue = function (formValues) {
            var gridPrefix = "grid_",
                sliderPrefix = "slider_",
                isGrid, isSlider,
                widgetInstance, widgetValue, widgetPrefix;

            for (var key in instantiatedWidgets) {
                isGrid = key.indexOf(gridPrefix) == 0;
                isSlider = key.indexOf(sliderPrefix) == 0;

                if (isGrid || isSlider) {
                    widgetInstance = instantiatedWidgets[key].instance;

                    if (isGrid) {
                        widgetInstance.removeEditModeOnRow();
                        widgetPrefix = gridPrefix;
                        widgetValue = widgetInstance.getAllVisibleRows();
                    } else if (isSlider) {
                        widgetPrefix = sliderPrefix;
                        widgetValue = widgetInstance.getValues()
                    }

                    formValues.push({
                        "id": key.substring(widgetPrefix.length),
                        "value": widgetValue
                    });
                }
            }
            return formValues;
        };

        /**
         * Provides the widget configuration by removing the properties that belong to the form element
         * @param {Object} elementConfiguration - Element configuration from the form element configuration
         * @param {Array} commonProperties - Properties that are only related to a form element
         * @returns {Object} Widget configuration without the properties that are common to a form element
         * @inner
         */
        var getWidgetConfiguration = function (elementConfiguration, commonProperties) {
            var widgetConfiguration = _.extend({}, elementConfiguration);
            for (var key in widgetConfiguration) {
                if (~commonProperties.indexOf(key)) {
                    delete widgetConfiguration[key]
                }
            }
            return widgetConfiguration;
        };

        /**
         * Provides the container of a form element. The container is identified by the closest parent of the element that has a row class.
         * @param {Object} $ele - jQuery object of an element
         * @returns {Object} JQuery object with row class and parent of the input "ele"
         * @inner
         */
        var getParentRow = function ($ele) {
            return $ele.closest(".row");
        };

        /**
         * Provides the container of a form element. The container is identified by the closest parent of the element that has a elementgroup class.
         * @param {Object} $ele - jQuery object of an element
         * @returns {Object} JQuery object with row class and parent of the input "ele"
         * @inner
         */
        var getGroupContainer = function ($ele) {
            return $ele.closest(".elementgroup");
        };

        /**
         * Provides an object with instances of the widgets used during the integration of the form widget
         * with other form element widgets
         * @returns {Object} Integrated form element widgets objects
         */
        this.getInstantiatedWidgets = function () {
            return instantiatedWidgets;
        };

    };

    return WidgetsIntegration;
});