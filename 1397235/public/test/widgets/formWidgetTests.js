define([
    'widgets/form/conf/configurationSample',
    'widgets/dropDown/tests/dataSample/sampleData',
    'widgets/form/conf/configurationSampleBySections',
    'widgets/form/conf/dynamicConfigurationSample',
    'widgets/form/tests/conf/gridConfiguration',
    'widgets/form/formWidget'
], function (formConfiguration, sampleData, formConfigurationBySections, dynamicElementsConfiguration, gridConfiguration, FormWidget) {
    describe('FormWidget - Unit tests:', function () {

        var $test_widget_container = $('#test_widget'),
            containerId = 0,
            mockjaxConf = {
                url: /^\/form-test\/remote-validation\/object\/developer-first-generation\/([a-zA-Z0-9\-\_]*)$/,
                urlParams: ["client"],
                response: function (settings) {
                    var client = settings.urlParams.client,
                        clients = ["Andrew", "Vidushi", "Dennis", "Brian", "Kyle", "Miriam", "Aslam", "Kiran", "Sujatha", "Eva"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 1
            };

        var createContainer = function () {
            var $container = $("<div id = form-container-id" + containerId++ + "></div>");
            $test_widget_container.append($container);
            return $container;
        };

        var cleanUp = function (thisObj) {
            thisObj.formWidgetObj.destroy();
            thisObj.$formContainer.remove();
            thisObj = null;
        };

        var elementsConfigurationById = function (conf) {
            var formConf = {};
            var sections = conf.sections,
                i, j, elements, element;
            for (i = 0; sections && i < sections.length; i++) {

                if (sections[i].toggle_section)
                    sections[i].toggle_section.status = "show"; //make visible all sections

                elements = sections[i].elements;
                for (j = 0; elements && j < elements.length; j++) {
                    element = elements[j];
                    element.id && (formConf[element.id] = element);
                }
            }
            return formConf;
        }(formConfiguration.elements);

        describe('Widget Interface', function () {
            before(function () {
                this.formWidgetObj = new FormWidget({
                    "elements": formConfiguration.elements,
                    "container": createContainer()
                });
            });
            it('should exist', function () {
                this.formWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.formWidgetObj.build, 'The form widget must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.formWidgetObj.destroy, 'The form widget must have a function named destroy.');
            });
        });

        describe('Template', function () {
            var configurationSample;
            var elementSection;
            before(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });

            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                };
            };

            it('should contain <form> as firstchild', function () {
                var tc = new TestContext();
                tc.$formContainer.find(">:first-child").is("form").should.be.true;
                tc.destroy();
            });
            it('should contain "form-pattern" as class for <form> element', function () {
                var tc = new TestContext();
                tc.$formContainer.find(">:first-child").hasClass('form-pattern').should.be.true;
                tc.destroy();
            });
            it('should contain "validate" as class for <form> element', function () {
                var tc = new TestContext();
                tc.$formContainer.find(">:first-child").hasClass('validate').should.be.true;
                tc.destroy();
            });
            it('should contain title', function () {
                var tc = new TestContext();
                tc.$formContainer.find(".form-pattern h3").text().should.exist;
                tc.destroy();
            });
            it('should contain inline help', function () {
                elementSection.push(formConfigurationBySections.ipv4Orv6);
                var tc = new TestContext();
                var $text_ip_v4Orv6InlineHelp = tc.$formContainer.find("#text_ip_v4Orv6").siblings(".inline-help");
                assert.isTrue($text_ip_v4Orv6InlineHelp.css("display") != "none", "inline help should be visible");
                tc.destroy();
            });
        });

        describe('Drop Down Widget Integration', function () {
            var configurationSample;
            var elementSection;

            var dropdownWidth = {
                smallWidth: 130,
                mediumWidth: 260,
                largeWidth: 520
            };

            var userDefinedWidth = 350;

            before(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });

            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });

            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "values": formConfiguration.values,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };
            it('should render the select and options tags for the drop down element', function () {
                elementSection.push(formConfigurationBySections.dropdown2);
                var tc = new TestContext();
                var dropDownId = 'dropdown_field_2',
                    $dropDownSelect = tc.$formContainer.find('#' + dropDownId),
                    $dropDownOption = $dropDownSelect.find('option').length,
                    dropDownConfiguration = elementsConfigurationById[dropDownId];

                assert.equal(dropDownConfiguration.data.length, $dropDownOption, 'the number of options (values/data property) for the element_dropdown configuration has the same number of option tags in the DOM when the element dropdown is built and rendered');

                var $option1 = $($dropDownSelect.find('option')[1]);
                assert.equal(dropDownConfiguration.data[1].id, $option1.val(), 'the id/value for an option (data/values property) in the dropdown configuration has the correct value when the element is built and rendered');
                assert.equal(dropDownConfiguration.data[1].text, $option1.text(), 'the text/label for an option (data/values property) in the dropdown configuration has the correct text when the element is built and rendered');
                tc.destroy();
            });
            it('should validate if the drop down element satisfies the required field', function () {
                elementSection.push(formConfigurationBySections.dropdown1);
                elementSection.push(formConfigurationBySections.dropdown2);
                var tc = new TestContext();
                var dropDownId1 = 'dropdown_field_1',
                    $dropDownElement1 = tc.$formContainer.find('#' + dropDownId1).parent(),
                    dropDownConfiguration1 = elementsConfigurationById[dropDownId1],
                    dropDownId2 = 'dropdown_field_2',
                    $dropDownElement2 = tc.$formContainer.find('#' + dropDownId2).parent(),
                    dropDownConfiguration2 = elementsConfigurationById[dropDownId2];

                var selectedIndex;
                var hasSelectedOption = function (values) {
                    selectedIndex = null;
                    for (var i = 0; i < values.length; i++) {
                        if (values[i].selected) {
                            selectedIndex = i;
                            return true;
                        }
                    }
                    return false;
                };

                //form validation is triggered
                tc.formWidgetObj.isValidInput();

                //form configuration is verified for a required element with no default value
                assert.isTrue(dropDownConfiguration1.required, 'the configuration of the drop down element has a required property set to true');
                assert.isFalse(hasSelectedOption(dropDownConfiguration1.values), 'the configuration of the drop down element does not include an option with a default value');
                assert.equal(dropDownConfiguration1.values[0].value, '', 'the value of the first option of the the drop down is empty');

                //form element should show an error after the form is validated since the element is a required field
                assert.isTrue($dropDownElement1.hasClass('error'), 'the dropdown element is a required field and has an error indication after the form validation is triggered');

                //form configuration is verified for a required element with no default value
                assert.isTrue(dropDownConfiguration2.required, 'the configuration of the drop down element has a required property set to true');
                assert.isTrue(hasSelectedOption(dropDownConfiguration2.data), 'the configuration of the drop down element does include an option with a default value');
                assert.isNotNull(dropDownConfiguration2.data[selectedIndex].id, 'the value of the selected option of the the drop down is not null');

                //form element should not show an error after the form is validated since the element is a required field
                assert.isFalse($dropDownElement2.hasClass('error'), 'the dropdown element is a required field and does not have an error indication after the form validation is triggered');
                tc.destroy();
            });
            it('should validate if the drop down element populates using json object', function () {
                elementSection.push(formConfigurationBySections.dropdown3);
                var tc = new TestContext();
                var dropdownId = 'dropdown_field_3_s',
                    dropdownContainer = tc.$formContainer.find("#" + dropdownId);
                var dropdownJSONObject = [{"text": "label", "id": "value"}, {"text": "label1", "id": "value1"}];
                tc.formWidgetObj.insertDropdownContentFromJson(dropdownId, dropdownJSONObject, false);
                assert.isTrue(dropdownContainer.find("option").length == 6, 'the json values get appended to drop down element has a deleteDefaultList property set to false');
                tc.formWidgetObj.insertDropdownContentFromJson(dropdownId, dropdownJSONObject, true);
                assert.isTrue(dropdownContainer.find("option").length == 2, 'the json values get appended to drop down element has a deleteDefaultList property set to true');
                tc.destroy();
            });
            it('should have small width if width configuration parameter is set to "small"', function () {
                elementSection.push(formConfigurationBySections.dropdown1);
                var tc = new TestContext();
                var dropdownId = 'dropdown_field_1',
                    dropdownContainer = tc.$formContainer.find("#" + dropdownId),
                    width = dropdownContainer.siblings().width();

                assert.equal(width, dropdownWidth.smallWidth, 'does not have small width');
                tc.destroy();
            });
            it('should have medium width if width configuration parameter is set to "medium"', function () {
                elementSection.push(formConfigurationBySections.dropdown4);
                var tc = new TestContext();
                var dropdownId = 'dropdown_field_4',
                    dropdownContainer = tc.$formContainer.find("#" + dropdownId),
                    width = dropdownContainer.siblings().width();

                assert.equal(width, dropdownWidth.mediumWidth, 'does not have medium width');
                tc.destroy();
            });
            it('should have large width if width configuration parameter is set to "large"', function () {
                elementSection.push(formConfigurationBySections.dropdown2);
                var tc = new TestContext(),
                    dropdownId = 'dropdown_field_2',
                    dropdownContainer = tc.$formContainer.find("#" + dropdownId),
                    width = dropdownContainer.siblings().width();
                assert.equal(width, dropdownWidth.largeWidth, 'does not have large width');
                tc.destroy();
            });
            it('should have user-defined width if width configuration parameter is set to specific number', function () {
                elementSection.push(formConfigurationBySections.dropdown3_v2);
                var tc = new TestContext(),
                    dropdownId = 'dropdown_field_3',
                    dropdownContainer = tc.$formContainer.find("#" + dropdownId),
                    width = dropdownContainer.siblings().width();
                assert.equal(width, userDefinedWidth, 'does not have user-defined width');
                tc.destroy();
            });
        });

        describe('Grid Widget Integration', function () {
            var configurationSample,
                elementSection,
                tc;
            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };
            before(function (done) {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
                elementSection.push(formConfigurationBySections.gridConfig);
                tc = new TestContext();
                var gridId = 'text_grid';
                this.$gridContainer = tc.$formContainer.find('#' + gridId);
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                });
            });
            after(function () {
                this.$gridContainer.remove();
                tc.destroy();
            });

            it('should contain a grid', function () {
                assert.equal(this.$gridContainer.find('.ui-jqgrid').length, 1, "the grid has been created and the container with ui-jqgrid class should have a child container");
            });
            it('should contain the header of the grid', function () {
                assert.isTrue(this.$gridContainer.find('.ui-jqgrid-labels th').length > 0, "column headers has been created and the grid widget should have added at least one column");
            });
            it('should contain the content of the grid', function () {
                assert.isTrue(this.$gridContainer.find('.ui-jqgrid-btable tr').length > 1, "data has been rendered and the grid widget should have created a least more than one row");
            });
        });

        describe('Slider Widget Integration', function () {
            before(function () {
                this.$formContainer = createContainer();
                var formConfiguration = $.extend(true, {}, formConfigurationBySections.basicStructure);
                formConfiguration.sections[0].elements.push(formConfigurationBySections.slider);
                this.formWidgetObj = new FormWidget({
                    "elements": formConfiguration,
                    "container": this.$formContainer[0]
                }).build();
                this.$form = this.$formContainer.find("form" + "#" + formConfigurationBySections.basicStructure["form_id"]);
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain a slider', function () {
                assert.equal(this.$form.find('.slider-widget').length, 1, "the slider has been created and the container with slider-widget class should have a child container");
            });
            it('should provide the slider value on getValues', function () {
                var formValues = this.formWidgetObj.getValues();
                assert.equal(formValues.length, 1, "the getVelues of the form is available");
                assert.equal(formConfigurationBySections.slider.id, formValues[0].id, "the value of getValues includes the slider id");
                assert.isTrue(_.isString(formValues[0].value), "The value of the slider is available and it should be a string for single slider value");
                assert.isTrue(formValues[0].value == formConfigurationBySections.slider.handles[0].value, "the value of getValues is the same as the one provided in the slider configuration in the form");
            });
        });

        describe('Help Widget Integration', function () {
            var configurationSample;
            before(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);

                var elementSection = configurationSample.sections[0].elements;
                elementSection.push(formConfigurationBySections.radioFieldConfigWithHelp);
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
            });
            after(function () {
                this.formWidgetObj.destroy();
                this.$formContainer.remove();
            });

            it('should contain a help widget', function () {
                assert.equal(this.$formContainer.find('.help-widget').length, 1, "the help widget has been created.");
            });
        });

        describe('Data Binding Integration', function () {
            var configurationSample;
            var elementSection;
            before(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });
            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });
            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "values": formConfiguration.values,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                };
                this.instantiatedWidgets = this.formWidgetObj.getInstantiatedWidgets();
            };
            //gets the value assigned during data bindings
            var getValue = function (elementConfiguration, value) {
                var getObjectValue = function (valueKey) {
                    var keys = valueKey.split("."),
                        value = formConfiguration["values"][keys[0]];
                    for (var i = 1; i < keys.length; i++) {
                        value = value[keys[i]];
                        if (typeof(value) == "undefined")
                            return;
                    }
                    return value;
                };
                if (elementConfiguration && elementConfiguration[value]) {
                    if (_.isString(elementConfiguration[value]) && elementConfiguration[value].substring(0, 2) == "{{" && elementConfiguration[value].slice(-2) == "}}") {
                        var valueKey = elementConfiguration[value].substring(2, elementConfiguration[value].length - 2);
                        if (formConfiguration["values"]) {
                            if (~valueKey.indexOf("."))
                                return getObjectValue(valueKey);
                            else
                                return formConfiguration["values"][valueKey];
                        }
                    } else {
                        return elementConfiguration[value];
                    }
                }
            };
            it('should set the value of an input element', function () {
                elementSection.push(formConfigurationBySections.emailConfig);
                var tc = new TestContext(),
                    elementId = 'text_email',
                    $element = tc.$formContainer.find('#' + elementId),
                    elementValue = $element.val(),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "value");
                assert.equal(elementValue, bindingValue, 'the value in the input element should be the one set in the values object of the form configuration');
                tc.destroy();
            });
            it('should set the value of a datePicker widget element', function () {
                elementSection.push(formConfigurationBySections.datePickerConfig);
                var tc = new TestContext();
                var elementId = 'text_datepickerWidget',
                    elementValue = tc.instantiatedWidgets["datePicker_" + elementId]["instance"].getDate(),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "initValue");
                var month = elementValue.getUTCMonth() + 1; //months from 1-12
                var day = elementValue.getUTCDate();
                var year = elementValue.getUTCFullYear();
                assert.equal(month + "/" + day + "/" + year, bindingValue, 'the date value in the datePicker widget element should be the one set in the values object of the form configuration');
                tc.destroy();
            });
            it('should set the value of a time widget element with 24 hour period', function () {
                elementSection.push(formConfigurationBySections.timeConfig);
                var tc = new TestContext();
                var elementId = 'text_timeWidget',
                    elementValue = tc.instantiatedWidgets["time_" + elementId]["instance"].getTime(),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "initValue");
                assert.equal(elementValue, bindingValue.time, 'the time value in the time widget element should be the one set in the values object of the form configuration');
                tc.destroy();
            });
            it('should set the value of a dateTime element with PM period', function () {
                elementSection.push(formConfigurationBySections.dateTimeConfig);
                var tc = new TestContext();
                var elementId = 'text_dateTimeWidget',
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "initValue"),
                    dateElementId = 'text_dateTime_date_Widget',
                    dateElementValue = tc.instantiatedWidgets["datePicker_" + dateElementId]["instance"].getDate(),
                    timeElementId = 'text_dateTime_time_Widget',
                    timeElementValue = tc.instantiatedWidgets["dateTime_" + timeElementId]["instance"].getTime();
                var month = dateElementValue.getUTCMonth() + 1; //months from 1-12
                var day = dateElementValue.getUTCDate();
                var year = dateElementValue.getUTCFullYear();
                assert.equal(month + "/" + day + "/" + year, bindingValue.date, 'the date value in the datePicker widget element should be the one set in the values object of the form configuration');
                assert.equal(timeElementValue, bindingValue.time + " " + bindingValue.period, 'the time value in the time widget element should be the one set in the values object of the form configuration');
                tc.destroy();
            });
            it('should set the value of a time widget element', function () {
                elementSection.push(formConfigurationBySections.ipCidrConfig);
                var tc = new TestContext();
                var elementId = 'text_ipCidrWidget1',
                    elementValue = tc.instantiatedWidgets["ipCidr_" + elementId]["instance"].getValues(),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "initValue");
                assert.equal(elementValue.ip.value, bindingValue.ip, 'the ip value in the ipCidr widget element should be the one set in the values object of the form configuration');
                assert.equal(elementValue.cidr.value, bindingValue.cidr, 'the cidr value in the ipCidr widget element should be the one set in the values object of the form configuration');
                tc.destroy();
            });
            it('should set the value of a dropDown widget element', function () {
                elementSection.push(formConfigurationBySections.dropdown3_v2);
                var tc = new TestContext();
                var elementId = 'dropdown_field_3',
                    elementValue = tc.instantiatedWidgets["dropDown_" + elementId]["instance"].getValue(),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "initValue");
                assert.equal(elementValue[0], bindingValue.id, 'the dropdown value in the dropDown widget element should be the one set in the values object of the form configuration');
                tc.destroy();
            });
            it('should set the value of a check box element', function () {
                elementSection.push(formConfigurationBySections.checkboxConfig);
                var tc = new TestContext();
                var elementId = 'checkbox_field',
                    $elements = tc.$formContainer.find('#' + elementId + ' :checked'),
                    elementsValue = [],
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = [];
                getValue(elementConfiguration, "initValue").forEach(function (value) {
                    if (value.checked) {
                        bindingValue.push(value.id);
                    }
                });
                $elements.each(function (id, element) {
                    if (element.checked) {
                        elementsValue.push(element.id);
                    }
                });
                assert.includeMembers(elementsValue, bindingValue, 'the checked items in the checkbox element should be a super set of the ones set in the values object of the form configuration');
                tc.destroy();
            });
            it('should set the value of a radio button element', function () {
                elementSection.push(formConfigurationBySections.radioFieldConfig);
                var tc = new TestContext();
                var elementId = 'radio_field',
                    $elements = tc.$formContainer.find('#' + elementId + ' :checked'),
                    elementsValue = [],
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = [];
                getValue(elementConfiguration, "initValue").forEach(function (value) {
                    if (value.checked) {
                        bindingValue.push(value.id);
                    }
                });
                $elements.each(function (id, element) {
                    if (element.checked) {
                        elementsValue.push(element.id);
                    }
                });
                assert.includeMembers(elementsValue, bindingValue, 'the checked item in the radio button element should be a super set of the ones set in the values object of the form configuration');
                tc.destroy();
            });
            it('should read a value that has the dot notation of an input element', function () {
                elementSection.push(formConfigurationBySections.endpointConfig);
                var tc = new TestContext();
                var elementId = 'endpointsetting_s',
                    $element = tc.$formContainer.find('#' + elementId),
                    elementValue = $element.val(),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "value");
                assert.equal(elementValue, bindingValue, 'the value in the input element should be the one set in the values object of the form configuration');
                tc.destroy();
            });
            it('should serialize the value of an input element', function () {
                elementSection.push(formConfigurationBySections.endpointConfig);
                var tc = new TestContext();
                var elementId = 'endpointsetting_s',
                    elementConfiguration = elementsConfigurationById[elementId];
                if (elementConfiguration && elementConfiguration.value && ~elementConfiguration.value.indexOf(".")) {
                    var formValues = tc.formWidgetObj.getValues(true);
                    assert.isObject(formValues[elementId], 'the value for the input element should be an Object since it was defined by dot notation');
                } else {
                    assert.isTrue(true, 'for the serialized element, the dot notation was not found and the unit test was not executed');
                }
                tc.destroy();
            });
            it('should read a value that has the dot notation of a dropdown element', function () {
                elementSection.push(formConfigurationBySections.dropdown2_v2);
                var tc = new TestContext();
                var elementId = 'dropdown_field_2_s',
                    $element = tc.$formContainer.find('#' + elementId),
                    elementValue = $element.val(),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "initValue");
                assert.equal(elementValue, bindingValue, 'the value in the dropdown element should be the one set in the values object of the form configuration');
                tc.destroy();
            });
            it('should serialize the value of a dropdown element', function () {
                elementSection.push(formConfigurationBySections.dropdown2_v2);
                var tc = new TestContext();
                var elementId = 'dropdown_field_2_s',
                    elementConfiguration = elementsConfigurationById[elementId];
                if (elementConfiguration && elementConfiguration.initValue && ~elementConfiguration.initValue.indexOf(".")) {
                    var formValues = tc.formWidgetObj.getValues(true);
                    assert.isObject(formValues[elementId], 'the value for the input element should be an Object since it was defined by dot notation');
                } else {
                    assert.isTrue(true, 'for the serialized element, the dot notation was not found and the unit test was not executed');
                }
                tc.destroy();
            });
            it('should read a value that has the dot notation of a check box element', function () {
                elementSection.push(formConfigurationBySections.checkboxConfig_v2);
                var tc = new TestContext();
                var elementId = 'checkbox_enable_s',
                    $element = tc.$formContainer.find('#' + elementId),
                    $elementValue = $element.find("input:checked"),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "initValue"),
                    elementValue = [];
                if ($elementValue.length == 1) {
                    elementValue = $elementValue[0].id;
                    assert.equal(elementValue, bindingValue, 'the value in the check box element should be the one set in the values object of the form configuration');
                } else if ($elementValue.length > 1) {
                    for (var i = 0; i < $elementValue.length; i++) {
                        elementValue.push($elementValue[i].id);
                    }
                    assert.sameMembers(elementValue, bindingValue, 'the value in the check box element should be the one set in the values object of the form configuration');
                } else {
                    assert.isTrue(true, 'for the serialized element, a matching value was not found and the unit test was not executed');
                }
                tc.destroy();
            });
            it('should serialize the value of a check box element', function () {
                elementSection.push(formConfigurationBySections.checkboxConfig_v2);
                var tc = new TestContext();
                var elementId = 'checkbox_enable_s',
                    elementConfiguration = elementsConfigurationById[elementId];
                if (elementConfiguration && elementConfiguration.initValue && ~elementConfiguration.initValue.indexOf(".")) {
                    var formValues = tc.formWidgetObj.getValues(true);
                    assert.isObject(formValues[elementId], 'the value for the input element should be an Object since it was defined by dot notation');
                } else {
                    assert.isTrue(true, 'for the serialized check box, the dot notation was not found and the unit test was not executed');
                }
                tc.destroy();
            });
            it('should read a value that has the dot notation of a radio button element', function () {
                elementSection.push(formConfigurationBySections.radioFieldConfig_v2);
                var tc = new TestContext();
                var elementId = 'radio_button_s',
                    $element = tc.$formContainer.find('#' + elementId),
                    $elementValue = $element.find("input:checked"),
                    elementConfiguration = elementsConfigurationById[elementId],
                    bindingValue = getValue(elementConfiguration, "initValue"),
                    elementValue = [];
                if ($elementValue.length == 1) {
                    elementValue = $elementValue[0].id;
                    assert.equal(elementValue, bindingValue, 'the value in the radio button element should be the one set in the values object of the form configuration');
                } else {
                    assert.isTrue(true, 'for the serialized radio button, a matching value was not found and the unit test was not executed');
                }
                tc.destroy();
            });
            it('should serialize the value of a checkbox element', function () {
                elementSection.push(formConfigurationBySections.radioFieldConfig_v2);
                var tc = new TestContext();
                var elementId = 'radio_button_s',
                    elementConfiguration = elementsConfigurationById[elementId];
                if (elementConfiguration && elementConfiguration.initValue && ~elementConfiguration.initValue.indexOf(".")) {
                    var formValues = tc.formWidgetObj.getValues(true);
                    assert.isObject(formValues[elementId], 'the value for the input element should be an Object since it was defined by dot notation');
                } else {
                    assert.isTrue(true, 'for the serialized element, the dot notation was not found and the unit test was not executed');
                }
                tc.destroy();
            });
        });

        describe('Custom Callback Form Validation in Input field', function () {
            var configurationSample;
            var elementSection;

            beforeEach(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
                $test_widget_container.css("display", "block");
            });
            afterEach(function () {
                $test_widget_container.css("display", "none");
            });
            var callbackValue = function (inputValue) {
                if (inputValue == "Test Callback Value") {
                    return true;
                }
                return {value: inputValue, valid: false, error: "Callback Custom Error!"};
            };
            var callbackValidationUrlConfig = {
                "element_lowercase": true,
                "id": "custom_callback_Obj",
                "name": "custom_callback_Obj",
                "label": "Custom Callback",
                "class": "class1 class2  element_delete",
                "field-help": {
                    "content": "'Test Callback Value' is valid"
                },
                "error": "Default Error",
                "required": true,
                "callbackValidation": callbackValue
            };
            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };

            it('should automatically validate if the field doesn\'t throw error if the value is correct', function () {
                elementSection.push(callbackValidationUrlConfig);
                var tc = new TestContext();
                var $input = tc.$formContainer.find("#custom_callback_Obj");
                $input.val('Test Callback Value').blur();
                assert.isTrue(_.isUndefined($input.attr("data-invalid")), "the field with the correct value should not show an error");
                assert.isTrue(tc.formWidgetObj.isValidInput(), "isValid is true");
                tc.destroy();
            });
            it('should automatically validate if the field throws error if the value is wrong', function () {
                elementSection.push(callbackValidationUrlConfig);
                var tc = new TestContext();
                var $input = tc.$formContainer.find("#custom_callback_Obj");
                $input.val('abc').blur();
                assert.isTrue(!_.isUndefined($input.attr("data-invalid")), "the field with the wrong value should show an error");
                assert.isFalse(tc.formWidgetObj.isValidInput(), "isValid is false");
                tc.destroy();
            });
            it('should automatically validate if the field throws error defined by user if the value is wrong', function () {
                elementSection.push(callbackValidationUrlConfig);
                var tc = new TestContext();
                var $input = tc.$formContainer.find("#custom_callback_Obj");
                $input.val('abc').blur();
                assert.isTrue(_.isEqual($input.parent().find(".error").html(), "Callback Custom Error!"), "the field with the wrong value should show an error");
                assert.isTrue(!_.isEqual($input.parent().find(".error").html(), "Enter valid string"), "the field with the wrong value should show an error");
                tc.destroy();
            });
            it('should give isValid true if the field empty and required false', function () {
                callbackValidationUrlConfig.required = false;
                elementSection.push(callbackValidationUrlConfig);
                var tc = new TestContext();
                var $input = tc.$formContainer.find("#custom_callback_Obj");
                assert.isTrue(_.isUndefined($input.attr("data-invalid")), "the field with the empty value should not show an error");
                assert.isTrue(tc.formWidgetObj.isValidInput(), "isValid is true");
                tc.destroy();
            });
            it('should give isValid true if the field empty and required false', function () {
                callbackValidationUrlConfig.required = false;
                elementSection.push(callbackValidationUrlConfig);
                var tc = new TestContext();
                var $input = tc.$formContainer.find("#custom_callback_Obj");
                $input.val('abc').blur();
                assert.isTrue(!_.isUndefined($input.attr("data-invalid")), "the field with the wrong value should show an error");
                assert.isFalse(tc.formWidgetObj.isValidInput(), "isValid is false");
                tc.destroy();
            });
        });
        describe('Custom Callback Form Validation in checkbox field', function () {
            var configurationSample;
            var elementSection;

            beforeEach(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
                elementSection.push(formConfigurationBySections.callbackUrlValidationConfig);
            });
            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });
            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };

            it('should automatically validate if the field doesn\'t throw error if the value is correct', function () {
                var tc = new TestContext();
                var $checkboxInput = tc.$formContainer.find("#checkbox_field1");
                var $checkbox1 = $checkboxInput.find("#checkbox_enable11");
                $checkbox1.attr("checked", true).blur();
                var $checkboxError = $checkboxInput.find("small.error");
                assert.isTrue($checkboxError.css("display") == "none", "the field with the correct value should not show an error");
                assert.isTrue(tc.formWidgetObj.isValidInput(), "isValid is true");
                $checkbox1.attr("checked", false).blur();
                tc.destroy();
            });
            it('should automatically validate if the field throws callback custom error if the value is wrong', function () {
                var tc = new TestContext();
                var $checkboxInput = tc.$formContainer.find("#checkbox_field1");
                var $checkbox2 = $checkboxInput.find("#checkbox_enable21");
                $checkbox2.attr("checked", true).blur();
                var $checkboxError = $checkboxInput.find("small.error");
                assert.isTrue($checkboxError.css("display") == "block", "the field with the incorrect value should show an error");
                assert.isTrue($checkboxError.text() == "Callback Custom Error!", "the field with the incorrect value should show callback custom error");
                assert.isFalse(tc.formWidgetObj.isValidInput(), "isValid is false");
                $checkbox2.attr("checked", false).blur();
                tc.destroy();
            });
            it('should automatically validate if the required field throws default error if the value is empty', function () {
                var tc = new TestContext();
                var $checkboxInput = tc.$formContainer.find("#checkbox_field1");
                var $checkboxError = $checkboxInput.find("small.error");
                assert.isFalse(tc.formWidgetObj.isValidInput(), "isValid is false");
                assert.isTrue($checkboxError.css("display") == "block", "the field with the empty value should show an error");
                assert.isTrue($checkboxError.text() == "Please make a selection", "the field with the empty value should show default error");
                assert.isFalse(tc.formWidgetObj.isValidInput(), "isValid is false");
                tc.destroy();
            });
            it('should automatically validate if the non-required field throws no error if the value is empty', function () {
                elementSection[0].required = false;
                var tc = new TestContext();
                var $checkboxInput = tc.$formContainer.find("#checkbox_field1");
                var $checkboxError = $checkboxInput.find("small.error");
                assert.isTrue($checkboxError.css("display") == "none", "the field with the empty value should show no error");
                assert.isTrue(tc.formWidgetObj.isValidInput(), "isValid is true");
                tc.destroy();
            });
        });

        describe('Form Validation', function () {
            var configurationSample,
                elementSection,
                formValues;
            before(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
                formValues = _.extend(formConfiguration.values, {
                    "url": "gmailcom"
                });
                delete formValues.ipCidr;
            });

            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });

            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "values": formValues,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                };
            };
            it('should automatically validate if the field value is correct when the form is built', function () {
                elementSection.push(formConfigurationBySections.urlConfig);
                var tc = new TestContext();
                var $urlInput = tc.$formContainer.find("#text_url");
                assert.isTrue($urlInput.parent().hasClass("error"), "the field with the wrong value should show an error");
                $urlInput.val('www.rpp.com.pe').blur();
                assert.isFalse($urlInput.parent().hasClass("error"), "the field with the correct value should not show an error");
                tc.destroy();
            });
            it('should automatically skip required fields when the form is built, including the fields from an integrated widget', function () {
                elementSection.push(formConfigurationBySections.ipCidrConfig_v2);
                var tc = new TestContext();
                var $urlInput = tc.$formContainer.find("#text_ipCidrWidget");
                assert.isFalse($urlInput.parent().hasClass("error"), "the field with the wrong value should not show an error");
                tc.destroy();
            });
            it('should only validate not required fields on isValidInput(true)', function () {
                elementSection.push(formConfigurationBySections.ipCidrConfig_v2);
                elementSection.push(formConfigurationBySections.requiredConfig);
                var tc = new TestContext();
                tc.formWidgetObj.isValidInput(true); //skip required fields
                var excludeRquiredFields = tc.$formContainer.find('.elementinput.error').length;
                tc.formWidgetObj.isValidInput(); //validate all fields
                var includeRequiredFields = tc.$formContainer.find('.elementinput.error').length;
                assert.isTrue(excludeRquiredFields < includeRequiredFields, "number of elements after excluding required elements in validation should be less than form validation that includes required elements");
                tc.destroy();
            });
        });

        describe('Form Validation - element_number', function () {
            var configurationSample;
            var elementSection;

            beforeEach(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });

            var elementConfig = {
                "id": "text_number_test",
                "element_number": true,
                "name": "text_number_test",
                "label": "Text number test"
            };

            var values = {
                "val": 1
            };

            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0],
                    "values": values
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };

            describe('Form Validation - element_number - UI interaction validations', function () {
                afterEach(function () {
                    configurationSample.sections[0].elements = [];
                    elementSection = configurationSample.sections[0].elements;
                });
                it('should not show error on non-required field with -Empty- input value', function () {

                    var testElementConfig = {
                        "required": false,
                        "min_value": "2"
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#" + testElementConfig.id);
                    assert.isFalse($numberInput.closest(".elementinput").hasClass("error"), "Initially there should be no error on empty field");
                    $numberInput.focus().blur();
                    assert.isFalse($numberInput.closest(".elementinput").hasClass("error"), "Should show error when focus is out of field without value input");
                    tc.destroy();
                });

                it('should not show error on non-required field with -Valid- input value', function () {
                    var testElementConfig = {
                        "required": false
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#" + testElementConfig.id);
                    $numberInput.val("1").blur();
                    assert.isFalse($numberInput.closest(".elementinput").hasClass("error"), "non-required number element should not show an error on valid input value ");
                    tc.destroy();
                });

                it('should show error on non-required field with -Invalid- input value', function () {
                    var testElementConfig = {
                        "required": false,
                        "min_value": "2"
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#" + testElementConfig.id);
                    $numberInput.val("1").blur();
                    assert.isTrue($numberInput.closest(".elementinput").hasClass("error"), "non-required number element should show an error on invalid input value ");
                    tc.destroy();
                });

                it('should show error on required field with -Empty- input value if focus out', function () {
                    var testElementConfig = {
                        "required": true,
                        "min_value": "2"
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#" + testElementConfig.id);
                    assert.isFalse($numberInput.closest(".elementinput").hasClass("error"), "Initially there should be no error on empty field");
                    $numberInput.focus().blur();
                    assert.isTrue($numberInput.closest(".elementinput").hasClass("error"), "Should show error when focus is out of field without value input");
                    tc.destroy();
                });

                it('should not show error on required field with -Valid- input value', function () {
                    var testElementConfig = {
                        "required": true
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#" + testElementConfig.id);
                    $numberInput.val("1").blur();
                    assert.isFalse($numberInput.closest(".elementinput").hasClass("error"), "Initially there should be no error on empty field");
                    tc.destroy();
                });

                it('should show error on required field with invalid input value', function () {
                    var testElementConfig = {
                        "required": true,
                        "min_value": "2"
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#" + testElementConfig.id);
                    $numberInput.val("1").blur();
                    assert.isTrue($numberInput.closest(".elementinput").hasClass("error"), "Should show error when invalid input value");
                    tc.destroy();
                });

                it('should automatically skip required fields (number) when the form is built, including the fields from an integrated widget', function () {
                    var testElementConfig = {
                        "required": true
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#" + testElementConfig.id);
                    assert.isFalse($numberInput.closest(".elementinput").hasClass("error"), "the required on page load with empty value should not show an error");
                    tc.destroy();
                });
            });

            describe('Form Validation - element_number - method isValidInput()', function () {
                beforeEach(function () {
                    // The top most container div "test_widget" is where the unit tests run.
                    // As it is not displayed in UI, the method validation fails to capture the element visible checks, hence need to show the container for each tests
                    $test_widget_container.show();
                });

                afterEach(function () {
                    $test_widget_container.hide();
                    configurationSample.sections[0].elements = [];
                    elementSection = configurationSample.sections[0].elements;
                });

                it('should not show error on non-required field with -Empty- input value', function () {
                    var testElementConfig = {
                        "required": false
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    assert.isTrue(tc.formWidgetObj.isValidInput());
                    tc.destroy();
                });

                it('should show error on non-required field with -Invalid- input value', function () {
                    var testElementConfig = {
                        "required": false,
                        "min_value": "2",
                        "value": 1
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    assert.isFalse(tc.formWidgetObj.isValidInput());
                    tc.destroy();
                });

                it('should not show error on non-required field with -Valid- input value', function () {
                    var testElementConfig = {
                        "required": false,
                        "min_value": "2",
                        "value": 3
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    assert.isTrue(tc.formWidgetObj.isValidInput());
                    tc.destroy();
                });

                it('should show error on required field with -Empty- input value', function () {
                    var testElementConfig = {
                        "required": true
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    assert.isFalse(tc.formWidgetObj.isValidInput());
                    tc.destroy();
                });

                it('should show error on required field with -Invalid- input value', function () {
                    var testElementConfig = {
                        "required": true,
                        "min_value": "2",
                        "value": 1
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    assert.isFalse(tc.formWidgetObj.isValidInput());
                    tc.destroy();
                });

                it('should not show error on required field with -Valid- input value', function () {
                    var testElementConfig = {
                        "required": true,
                        "min_value": "2",
                        "value": 3
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    assert.isTrue(tc.formWidgetObj.isValidInput());
                    tc.destroy();

                });

                it('should automatically skip required fields (number) with empty values - when the form is built', function () {
                    var testElementConfig = {
                        "required": true
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $formElement = tc.$formContainer.find("#" + configurationSample.form_id);
                    assert.isDefined($formElement, "Respective configuration form element should exist.");
                    assert.isUndefined($formElement.attr('data-invalid'), "On form built, required field with empty value should not show error");
                    tc.destroy();
                });

                it('should not skip required fields (number) with Valid values - when the form is built', function () {
                    var testElementConfig = {
                        "required": true,
                        "min_value": "2",
                        "value": 3
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $formElement = tc.$formContainer.find("#" + configurationSample.form_id);
                    assert.isDefined($formElement, "Respective configuration form element should exist.");
                    assert.isUndefined($formElement.attr('data-invalid'), "On form built, required field with empty value should not show error");
                    tc.destroy();
                });

                it('should not skip required fields (number) with Invalid values - when the form is built', function () {
                    var testElementConfig = {
                        "required": true,
                        "min_value": "2",
                        "value": 1
                    };
                    elementSection.push($.extend(testElementConfig, elementConfig));
                    var tc = new TestContext();
                    var $formElement = tc.$formContainer.find("#" + configurationSample.form_id);
                    assert.isDefined($formElement, "Respective configuration form element should exist.");
                    assert.equal($formElement.attr('data-invalid'), 'true', "On form built, required field with empty value should not show error");
                    tc.destroy();
                });
            });

            describe('Form Validation - element_number - NumberStepper show/not show', function () {
                beforeEach(function () {
                    // The top most container div "test_widget" is where the unit tests run.
                    // As it is not displayed in UI, the method validation fails to capture the element visible checks, hence need to show the container for each tests
                    $test_widget_container.show();
                });

                afterEach(function () {
                    $test_widget_container.hide();
                    configurationSample.sections[0].elements = [];
                    elementSection = configurationSample.sections[0].elements;
                });

                it('When numberStepper property not defined then numberStepper is integrated', function () {
                    var testElementConfig = {
                        "element_number": true,
                        "id": "text_number_2",
                        "value": "{{val}}"
                    };
                    elementSection.push(testElementConfig);
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#text_number_2");
                    assert.isTrue($numberInput.hasClass("ui-spinner-input"), "The number stepper exists");
                    assert.isTrue($numberInput.val() == "1", "The value is picked from the values object");
                    tc.destroy();
                });

                it('When numberStepper property set to false then numberStepper is not integrated', function () {
                    var testElementConfig = {
                        "element_number": true,
                        "id": "text_number_2",
                        "numberStepper": false,
                        "value": "{{val}}"
                    };
                    elementSection.push(testElementConfig);
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#text_number_2");
                    assert.isFalse($numberInput.hasClass("ui-spinner-input"), "The number stepper does not exist");
                    assert.isTrue($numberInput.val() == "1", "The value is picked from the values object");
                    tc.destroy();
                });

                it('When numberStepper property set to true then numberStepper is not integrated', function () {
                    var testElementConfig = {
                        "element_number": true,
                        "id": "text_number_2",
                        "numberStepper": true
                    };
                    elementSection.push(testElementConfig);
                    var tc = new TestContext();
                    assert.isTrue(tc.$formContainer.find("#text_number_2").hasClass("ui-spinner-input"), "The number stepper exists");
                    tc.destroy();
                });
            });

            describe('Form Validation - element_float - NumberStepper show/not show', function () {
                beforeEach(function () {
                    // The top most container div "test_widget" is where the unit tests run.
                    // As it is not displayed in UI, the method validation fails to capture the element visible checks, hence need to show the container for each tests
                    $test_widget_container.show();
                });

                afterEach(function () {
                    $test_widget_container.hide();
                    configurationSample.sections[0].elements = [];
                    elementSection = configurationSample.sections[0].elements;
                });

                it('When numberStepper property not defined then numberStepper is not integrated', function () {
                    var testElementConfig = {
                        "element_float": true,
                        "id": "text_float_2"
                    };
                    elementSection.push(testElementConfig);
                    var tc = new TestContext();
                    assert.isFalse(tc.$formContainer.find("#text_float_2").hasClass("ui-spinner-input"), "The number stepper exists");
                    tc.destroy();
                });

                it('When numberStepper property set to false then numberStepper is not integrated', function () {
                    var testElementConfig = {
                        "element_float": true,
                        "id": "text_float_2",
                        "numberStepper": false
                    };
                    elementSection.push(testElementConfig);
                    var tc = new TestContext();
                    assert.isFalse(tc.$formContainer.find("#text_float_2").hasClass("ui-spinner-input"), "The number stepper does not exist");
                    tc.destroy();
                });

                it('When numberStepper property set to true then numberStepper is not integrated', function () {
                    var testElementConfig = {
                        "element_float": true,
                        "id": "text_float_2",
                        "numberStepper": true
                    };
                    elementSection.push(testElementConfig);
                    var tc = new TestContext();
                    assert.isTrue(tc.$formContainer.find("#text_float_2").hasClass("ui-spinner-input"), "The number stepper exists");
                    tc.destroy();
                });
            });

            describe('NumberStepper step Validation', function() {
                beforeEach(function () {
                    // The top most container div "test_widget" is where the unit tests run.
                    // As it is not displayed in UI, the method validation fails to capture the element visible checks, hence need to show the container for each tests
                    $test_widget_container.show();
                });

                afterEach(function () {
                    $test_widget_container.hide();
                    configurationSample.sections[0].elements = [];
                    elementSection = configurationSample.sections[0].elements;
                });

                it('In element_number, When numberStepper property is true, then the up/down arrow increase the step by 1', function () {
                    var testElementConfig = {
                        "element_number": true,
                        "id": "text_number_1",
                        "value": "1"
                    };
                    elementSection.push(testElementConfig);
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#text_number_1");
                    assert.isTrue($numberInput.val() == "1", "Initial value is 1");
                    $numberInput.spinner("stepUp");
                    assert.isTrue($numberInput.val() == "2", "New value is 2");
                    tc.destroy();
                });
                it('In element_float, When numberStepper property is true, then the up/down arrow increase the step by 1', function () {
                    var testElementConfig = {
                        "element_float": true,
                        "id": "text_float_1",
                        "value": "1.01",
                        "numberStepper": true
                    };
                    elementSection.push(testElementConfig);
                    var tc = new TestContext();
                    var $numberInput = tc.$formContainer.find("#text_float_1");
                    assert.isTrue($numberInput.val() == "1.01", "Initial value is 1.01");
                    $numberInput.spinner("stepUp");
                    assert.isTrue($numberInput.val() == "1.02", "New value is 1.02");
                    tc.destroy();
                });
            });
        });

        describe('Field Multiple Validation', function () {
            beforeEach(function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": formConfiguration.elements,
                    "container": this.$formContainer[0]
                }).build();
                this.$hostname = this.$formContainer.find("#hostname");
                this.$errorElement = this.$hostname.parent().find('.error');
            });
            afterEach(function () {
                cleanUp(this);
            });
            it('should first validate if Hostname satisfies Required Field', function () {
                this.$hostname.val('');
                this.$hostname.blur();
                this.$errorElement.text().should.equal("This field is required.");
            });
            it('should first validate if Hostname satisfies Required Field', function () {
                this.$hostname.val('abcdefghij1234567890abcdefghij1234567890abcdefghij1234567890abcdefghij1234567890');
                this.$hostname.blur();
                this.$errorElement.text().should.equal("Must not exceed 64 characters.");
            });
            it('should first validate if Hostname satisfies Required Field', function () {
                this.$hostname.val('hostname!');
                this.$hostname.blur();
                this.$errorElement.text().should.equal("Only alphanumeric characters, dashes and underscores allowed.");
            });
            it('should first validate if Hostname satisfies Required Field', function () {
                this.$hostname.val('hostname');
                this.$hostname.blur();
                this.$errorElement.text().trim().should.equal('true');
            });
        });

        describe('Multiple Validation - element_dateTimeWidget', function () {
            var dateTimeElementId = "text_dateTimeWidget";
            var dateElementId = "text_dateTime_date_Widget";
            var formConfigValues = formConfiguration.values;

            before(function () {
                this.$formContainer = createContainer();
                formConfigValues.dateTime.date = "12/12/2000";

                this.formWidgetObj = new FormWidget({
                    "elements": formConfiguration.elements,
                    "container": this.$formContainer[0],
                    "values": formConfigValues
                }).build();
                this.$dateTimeWidget = this.$formContainer.find("#" + dateTimeElementId);
                this.$dateWidget = this.$dateTimeWidget.find("#" + dateElementId);
                this.$errorElement = this.$dateTimeWidget.find('.error');
            });
            after(function () {
                cleanUp(this);
            });
            it('should have data-afterdate as attribute', function () {
                assert.notEqual(this.$dateWidget.attr('data-afterdate'), undefined, "pattern-error afterdate should have attribute in dom");
            });

            it('Should show error when the date is after the specified config "after_date" parameter', function () {
                this.$errorElement.text().should.equal("Please enter a date after Jan 01, 2010");
            });
        });

        describe('Remote URL Validation integration with spinner', function () {
            var configurationSample;
            var elementSection;
            var mockJaxId = $.mockjax(mockjaxConf);
            beforeEach(function () {
                configurationSample = $.extend(true, {
                    "buttonsClass": "buttons_row",
                    "buttons": [
                        {
                            "id": "get_isvalid",
                            "name": "get_isvalid",
                            "value": "Next",
                            "type": "button",
                            "onSubmit": true
                        }
                    ]
                }, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });

            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });
            after(function() {
                $.mockjax.clear([mockJaxId]);
            });
            var buildNameUrl = function (inputvalue) {
                var url = "/form-test/remote-validation/object/developer-first-generation/";
                url += inputvalue;
                return url;
            };
            var remoteValidationUrlConfig = {
                "element_text": true,
                "id": "remote_validation",
                "name": "remote_validation",
                "label": "Remote URL Validation",
                "remote": {
                    "url": buildNameUrl, //should return url string
                    "type": "GET",
                    //"response": processResponse //should return "true" if isValid
                    "headers": {
                        "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                        "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
                    },
                    "error": "Must not contain the name of a developer"
                },
                "error": true
            };
            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };
            describe('Remote URL Validation field displays spinner', function () {
                it('When value is entered in Remote URL Validation field, spinner shows till the remote call happens', function (done) {
                    elementSection.push(remoteValidationUrlConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationUrlConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote:spinner', function (e, spinnerContainer) { //waits for data to be loaded
                        assert.isTrue($(spinnerContainer).length > 0, "spinner exists");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Eva").keydown();
                });
            });
            describe('Remote URL Validation field with default value displays spinner', function () {
                it('When value is entered in Remote URL Validation field, spinner shows till the remote call happens', function (done) {
                    var remoteUrlConfig = $.extend(true, {"value": "Eva"}, remoteValidationUrlConfig);
                    elementSection.push(remoteUrlConfig);
                    var tc = new TestContext();
                    var spinnerField = tc.$formContainer.find("#" + remoteValidationUrlConfig.id + "-loader .indeterminateSpinnerContainer");
                    assert.isTrue(spinnerField.length > 0, "spinner exists");
                    tc.destroy();
                    done();
                });
            });

        });

        describe('Remote Method Validation integration with spinner', function () {
            var configurationSample;
            var elementSection;
            var mockJaxId = $.mockjax(mockjaxConf);
            beforeEach(function () {
                configurationSample = $.extend(true, {
                    "buttonsClass": "buttons_row",
                    "buttons": [
                        {
                            "id": "get_isvalid",
                            "name": "get_isvalid",
                            "value": "Next",
                            "type": "button",
                            "onSubmit": true
                        }
                    ]
                }, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });

            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });

            after(function() {
                $.mockjax.clear([mockJaxId]);
            });

            var remoteValidate = function (el, callback) {
                var url = "/form-test/remote-validation/callback/developer-first-generation/";
                url += el.value;
                $.ajax({
                    url: url,
                    complete: function (e, xhr, settings) {
                        var errorMsg = "Developer's name is invalid, try some other name!";
                        var isValid = e.responseText;
                        isValid = _.isEqual(isValid, "true");
                        callback(isValid, errorMsg);
                    }
                });
            };

            var remoteValidationMethodConfig = {
                "element_text": true,
                "id": "remote_validation2",
                "name": "remote_validation2",
                "label": "Remote Callback Validation",
                "remote": remoteValidate,
                "error": true
            };

            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                };
            };
            describe('Remote URL Validation field displays spinner', function () {
                it('When value is entered in Remote URL Validation field, spinner shows till the remote call happens', function (done) {
                    elementSection.push(remoteValidationMethodConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationMethodConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote:spinner', function (e, spinnerContainer) { //waits for data to be loaded
                        assert.isTrue($(spinnerContainer).length > 0, "spinner exists");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Eva").keydown();
                });
            });
            describe('Remote Method Validation field with default value displays spinner', function () {
                it('When value is entered in Remote Method Validation field, spinner shows till the remote call happens', function (done) {
                    var remoteMethodConfig = $.extend(true, {"value": "Eva"}, remoteValidationMethodConfig);
                    elementSection.push(remoteMethodConfig);
                    var tc = new TestContext();
                    var spinnerField = tc.$formContainer.find("#" + remoteValidationMethodConfig.id + "-loader .indeterminateSpinnerContainer");
                    assert.isTrue(spinnerField.length > 0, "spinner exists");
                    tc.destroy();
                    done();
                });
            });
        });

        describe('Remote Validation defined in an object', function () {
            var configurationSample;
            var elementSection;

            var mockJaxId = $.mockjax(mockjaxConf);

            beforeEach(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });

            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });

            before(function () {
                $test_widget_container.css("display", "block");
            });
            after(function () {
                $.mockjax.clear([mockJaxId]);
                $test_widget_container.css("display", "none");
            });
            var buildNameUrl = function (inputvalue) {
                var url = "/form-test/remote-validation/object/developer-first-generation/";
                url += inputvalue;
                return url;
            };
            var remoteValidationUrlConfig = {
                "element_text": true,
                "id": "remote_validation",
                "name": "remote_validation",
                "label": "Remote URL Validation",
                "remote": {
                    "url": buildNameUrl, //should return url string
                    "type": "GET",
                    //"response": processResponse //should return "true" if isValid
                    "headers": {
                        "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                        "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
                    },
                    "error": "Must not contain the name of a developer"
                },
                "error": true
            };
            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };

            describe('Remote URL Validation with correct input value and no default value', function () {
                it('Remote URL Validation with correct input value and no default value', function (done) {
                    elementSection.push(remoteValidationUrlConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationUrlConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) { //waits for data to be loaded
                        assert.equal(isValid, true, "This person is not a developer");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Miriam1").blur();
                });
            });
            describe('Remote URL Validation with incorrect input value and no default value', function () {
                it('Remote URL Validation with incorrect input value and no default value', function (done) {
                    elementSection.push(remoteValidationUrlConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationUrlConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) { //waits for data to be loaded
                        assert.equal(isValid, false, "This person is a developer");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Miriam").blur();
                });
            });
            describe('Remote URL Validation with correct default value', function () {
                it('Remote URL Validation with correct default value', function (done) {
                    var remoteUrlConfig = $.extend(true, {"value": "Miriam1"}, remoteValidationUrlConfig);
                    elementSection.push(remoteUrlConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteUrlConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) { //waits for data to be loaded
                        assert.equal(isValid, true, "This person is not a developer");
                        tc.destroy();
                        done();
                    });
                });
            });
            describe('Remote URL Validation with incorrect default value', function () {
                it('Remote URL Validation with incorrect default value', function (done) {
                    var remoteUrlConfig = $.extend(true, {"value": "Miriam"}, remoteValidationUrlConfig);
                    elementSection.push(remoteUrlConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteUrlConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) { //waits for data to be loaded
                        assert.equal(isValid, false, "This person is a developer");
                        tc.destroy();
                        done();
                    });
                });
            });
            describe('If error occurs IsValidvalue should be false while processing', function () {
                it('If error occurs IsValidvalue should be false', function () {
                    elementSection.push(remoteValidationUrlConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationUrlConfig.id);
                    $nameInput.val("Miriam").blur();
                    var isValid = tc.formWidgetObj.isValidInput();
                    assert.equal(isValid, false, "isValid is false");
                    tc.destroy();
                });
            });
            describe('If error occurs IsValidvalue should be false after processing', function () {
                it('If error occurs IsValidvalue should be false', function (done) {
                    elementSection.push(remoteValidationUrlConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationUrlConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) {
                        assert.equal(tc.$formContainer.find(".error").find("small.error").css("display"), "block", "error shows up");
                        var isValid1 = tc.formWidgetObj.isValidInput();
                        assert.equal(isValid1, false, "isValid is false");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Miriam").blur();
                });
            });
            describe('If no error occurs IsValidvalue should be true', function () {
                it('If no error occurs IsValidvalue should be true', function (done) {
                    elementSection.push(remoteValidationUrlConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationUrlConfig.id);

                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) { //waits for data to be loaded
                        var isValid = tc.formWidgetObj.isValidInput();
                        assert.equal(isValid, true, "isValid is true");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Swena").blur();
                });
            });
        });

        describe('Remote Validation defined in a callback', function () {
            var configurationSample;
            var elementSection;
            var mockJaxConfNew = jQuery.extend({}, mockjaxConf);
            mockJaxConfNew.url = /^\/form-test\/remote-validation\/callback\/developer-new-generation\/([a-zA-Z0-9\-\_]*)$/;
            mockJaxConfNew.response = function (settings) {
                var client = settings.urlParams.client,
                    clients = ["Sujatha", "Andrew", "Miriam", "Vidushi", "Eva", "Sanket", "Arvind", "Viswesh", "Swena"];
                this.responseText = "true";
                if ($.inArray(client, clients) !== -1) {
                    this.responseText = "false";
                }
            };
            var mockJaxId = $.mockjax(mockJaxConfNew);
            beforeEach(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });
            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });
            var remoteValidate = function (el, callback) {
                var url = "/form-test/remote-validation/callback/developer-new-generation/";
                url += el.value;
                $.ajax({
                    url: url,
                    complete: function (e, xhr, settings) {
                        var errorMsg = "Developer's name is invalid, try some other name!";
                        var isValid = e.responseText;
                        isValid = _.isEqual(isValid, "true");
                        callback(isValid, errorMsg);
                    }
                });
            };

            var remoteValidationMethodConfig = {
                "element_text": true,
                "id": "remote_validation2",
                "name": "remote_validation2",
                "label": "Remote Callback Validation",
                "remote": remoteValidate,
                "error": "Enter Valid Text"
            };

            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                };
            };
            before(function () {
                $test_widget_container.css("display", "block");
            });
            after(function () {
                $.mockjax.clear([mockJaxId]);
                $test_widget_container.css("display", "none");
            });

            describe('Remote Method Validation with correct input value and no default value', function () {
                it('Remote Method Validation with correct input value and no default value', function (done) {
                    elementSection.push(remoteValidationMethodConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationMethodConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) { //waits for data to be loaded
                        assert.equal(isValid, true, "This person is not a developer");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Swena1").blur();
                });
            });
            describe('Remote Method Validation with incorrect input value and no default value', function () {
                it('Remote Method Validation with incorrect input value and no default value', function (done) {
                    elementSection.push(remoteValidationMethodConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationMethodConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) {
                        assert.equal(isValid, false, "This person is a developer");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Swena").blur();
                });
            });
            describe('Remote Method Validation with correct default value', function () {
                it('Remote Method Validation with correct default value', function (done) {
                    var remoteMethodConfig = $.extend(true, {"value": "Swena1"}, remoteValidationMethodConfig);
                    elementSection.push(remoteMethodConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteMethodConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) {
                        assert.equal(isValid, true, "This person is not a developer");
                        tc.destroy();
                        done();
                    });
                });
            });
            describe('Remote Method Validation with incorrect default value', function () {
                it('Remote Method Validation with incorrect default value', function (done) {
                    var remoteMethodConfig = $.extend(true, {"value": "Swena"}, remoteValidationMethodConfig);
                    elementSection.push(remoteMethodConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteMethodConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) {
                        assert.equal(isValid, false, "This person is a developer");
                        tc.destroy();
                        done();
                    });
                });
            });
            describe('If no error occurs IsValidvalue should be true', function () {
                it('If no error occurs IsValidvalue should be true', function (done) {
                    elementSection.push(remoteValidationMethodConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationMethodConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) { //waits for data to be loaded
                        var isValid = tc.formWidgetObj.isValidInput();
                        assert.equal(isValid, true, "isValid is true");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Swena1").blur();
                });
            });
            describe('If error occurs IsValidvalue should be false while processing', function () {
                it('If error occurs IsValidvalue should be false', function () {
                    elementSection.push(remoteValidationMethodConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationMethodConfig.id);
                    $nameInput.val("Miriam").blur();
                    var isValid = tc.formWidgetObj.isValidInput();
                    assert.equal(isValid, false, "isValid is false");
                    tc.destroy();
                });
            });
            describe('If error occurs IsValidvalue should be false after processing', function () {
                it('If error occurs IsValidvalue should be false', function (done) {
                    elementSection.push(remoteValidationMethodConfig);
                    var tc = new TestContext();
                    var $nameInput = tc.$formContainer.find("#" + remoteValidationMethodConfig.id);
                    $nameInput.bind('slipstreamForm.validation:remote', function (e, isValid) {
                        assert.equal(tc.$formContainer.find(".error").find("small.error").css("display"), "block", "error shows up");
                        var isValid1 = tc.formWidgetObj.isValidInput();
                        assert.equal(isValid1, false, "isValid is false");
                        tc.destroy();
                        done();
                    });
                    $nameInput.val("Miriam").blur();
                });
            });
        });

        describe('onSubmit Callback', function () {
            var configurationSample;
            var elementSection;
            var mockJaxId1 = $.mockjax({
                url: /^\/form-test\/submit-callback\/spinner-build-test1\/$/,
                status: 500,
                response: function (settings) {
                    this.responseText = "true";
                },
                responseTime: 1
            });
            var mockJaxId2 = $.mockjax({
                url: /^\/form-test\/submit-callback\/spinner-build-test2\/$/,
                response: function (settings) {
                    this.responseText = "true";
                },
                responseTime: 1
            });
            beforeEach(function () {
                configurationSample = $.extend(true, {
                    "err_div_id": "errorDiv",
                    "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": "Configuring Basic Settings",
                    "buttonsClass": "buttons_row",
                    "buttons": [
                        {
                            "id": "get_isvalid_and_wait",
                            "name": "get_isvalid_and_wait",
                            "onSubmit": submitCallback1,
                            "value": "Next1",
                            "type": "button"
                        },
                        {
                            "id": "get_isvalid_and_spin",
                            "name": "get_isvalid_and_spin",
                            "onSubmit": submitCallback2,
                            "value": "Next2",
                            "type": "button"
                        }
                    ]
                }, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });
            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });
            after(function() {
                $.mockjax.clear([mockJaxId1, mockJaxId2]);
            });
            var submitCallback1 = function (data, success, error) {
                var url = "/form-test/submit-callback/spinner-build-test1/";
                console.log("form.getValues()outputs:");
                console.log(data);
                $.ajax({
                    url: url,
                    success: function (e, xhr, settings) {
                        success();
                    },
                    error: function (e, xhr, settings) {
                        error("Server Validation not successful!");
                    }
                });
            };

            var submitCallback2 = function (data, success, error) {
                var url = "/form-test/submit-callback/spinner-build-test2/";
                console.log("form.getValues()outputs:");
                console.log(data);
                $.ajax({
                    url: url,
                    success: function (e, xhr, settings) {
                        success();
                    },
                    error: function (e, xhr, settings) {
                        error("Please try again later, Your account is blocked!");
                    }
                });
            };

            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };

            describe('Spinner shows up when client validation passes for buttons', function () {
                it('Spinner shows up when client validation passes for button 1', function () {
                    var tc = new TestContext();
                    $("#get_isvalid_and_wait").trigger("click");
                    assert.isTrue(tc.$formContainer.find(".indeterminateSpinnerContainer .icon_spinner").length > 0, "Spinner shows up");
                    tc.destroy();
                });
                it('Spinner shows up when client validation passes for button 2', function () {
                    var tc = new TestContext();
                    $("#get_isvalid_and_spin").trigger("click");
                    assert.isTrue(tc.$formContainer.find(".indeterminateSpinnerContainer .icon_spinner").length > 0, "Spinner shows up");
                    tc.destroy();
                });
            });

            describe('Error shows up on error callback', function () {
                it('Error shows up on error callback', function (done) {
                    var tc = new TestContext();
                    tc.$formContainer.bind("slipstream:server:validation:error", function () {
                        var errorDiv = $(this).find("#errorDiv");
                        assert.isTrue(errorDiv.find(".content").html() == "Server Validation not successful!", "Error text is correct");
                        assert.isTrue(errorDiv.css('display') == "block", "Error shows up");
                        tc.destroy();
                        done();
                    });
                    $("#get_isvalid_and_wait").trigger("click");
                });
            });

            describe('Error doesn\'t show up on success callback', function () {
                it('Error doesn\'t show up on success callback', function (done) {
                    var tc = new TestContext();
                    tc.$formContainer.bind("slipstream:server:validation:success", function () {
                        var errorDiv = $(this).find("#errorDiv");
                        assert.isTrue(errorDiv.css('display') == "none", "Error does not show up");
                        tc.destroy();
                        done();
                    });
                    $("#get_isvalid_and_spin").trigger("click");
                });
            });

        });

        describe('Element Visibility', function () {
            before(function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": formConfiguration.elements,
                    "values": formConfiguration.values,
                    "container": this.$formContainer[0]
                }).build();
                this.instantiatedWidgets = this.formWidgetObj.getInstantiatedWidgets();
                this.$form = this.$formContainer.find("form" + "#" + formConfiguration.elements["form_id"]);
            });
            after(function () {
                cleanUp(this);
            });

            var getVisibilityIds = function (elementConfiguration) {
                    var getArray = function (value) {
                            if (typeof(value) == "string")
                                return [value];
                            return value;
                        },
                        isArrayOrString = function (value) {
                            return (_.isArray(value) || _.isString(value));
                        };
                    return getArray(isArrayOrString(elementConfiguration.visibility) ? elementConfiguration.visibility : elementConfiguration.visibility.visibilityIds)
                },
                getValuesByVisibility = function (values) {
                    var valuesByVisibility = {}, valueByVisibility;
                    for (var i = 0; i < values.length; i++) {
                        var elementOption = values[i];
                        if (elementOption.visibility) {
                            valueByVisibility = getVisibilityIds(elementOption);
                            valueByVisibility && (valuesByVisibility[elementOption.id] = valueByVisibility);
                        }
                    }
                    return valuesByVisibility;
                };

            it('should show or hide visibility elements for the dropdown widget when it is rendered the first time', function () {
                var elementId = 'dropdown_field_2_v',
                    elementConfiguration = elementsConfigurationById[elementId],
                    dropdownInstance = this.instantiatedWidgets["dropDown_" + elementId]["instance"],
                    valuesByVisibility = getValuesByVisibility(elementConfiguration.data);

                var initValue = dropdownInstance.getValue(),
                    visibleElementIds = valuesByVisibility[initValue],
                    visibleElementDisplay;

                if (visibleElementIds) { //element visibles
                    for (var i = 0; i < visibleElementIds.length; i++) { //
                        visibleElementDisplay = this.$formContainer.find("#" + visibleElementIds[i]).closest('.row').css("display");
                        assert.equal(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                    }
                    for (var key in valuesByVisibility) {
                        if (key != initValue) { //the other values in the dropdown should have their visibility container hidden
                            visibleElementIds = valuesByVisibility[key];
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = this.$formContainer.find("#" + visibleElementIds[i]).closest('.row').css("display");
                                assert.equal(visibleElementDisplay, 'none', 'for the no selected elements, the row containers of the ids with visibility should be hidden');
                            }
                        }
                    }
                } else { //no element visibles
                    for (var key in valuesByVisibility) {
                        visibleElementIds = valuesByVisibility[key];
                        for (var i = 0; i < visibleElementIds.length; i++) {
                            visibleElementDisplay = this.$formContainer.find("#" + visibleElementIds[i]).closest('.row').css("display");
                            assert.equal(visibleElementDisplay, 'none', 'for the no selected elements, the row containers of the ids with visibility should be hidden');
                        }
                    }
                }
            });

            it('should show or hide visibility elements for the dropdown widget when a value is set', function () {
                var elementId = 'dropdown_field_2_v',
                    elementConfiguration = elementsConfigurationById[elementId],
                    dropdownInstance = this.instantiatedWidgets["dropDown_" + elementId]["instance"],
                    valuesByVisibility = getValuesByVisibility(elementConfiguration.data),
                    newValue = {
                        "id": "rtsp_v",
                        "text": "junos-rtsp"
                    };

                //sets a value for the dropDown
                dropdownInstance.setValue(newValue);

                var initValue = newValue.id,
                    visibleElementIds = valuesByVisibility[initValue],
                    visibleNonSelectedElementIds, visibleElementDisplay;

                if (visibleElementIds) { //element visible
                    for (var i = 0; i < visibleElementIds.length; i++) { //
                        visibleElementDisplay = this.$formContainer.find("#" + visibleElementIds[i]).closest('.row').css("display");
                        assert.equal(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                    }
                    for (var key in valuesByVisibility) {
                        if (key != initValue) { //the other values in the dropdown should have their visibility container hidden
                            visibleNonSelectedElementIds = valuesByVisibility[key];
                            for (var i = 0; i < visibleNonSelectedElementIds.length; i++) {
                                visibleElementDisplay = this.$formContainer.find("#" + visibleNonSelectedElementIds[i]).closest('.row').css("display");
                                if (~visibleElementIds.indexOf(visibleNonSelectedElementIds[i])) {
                                    assert.equal(visibleElementDisplay, 'block', 'for the no selected elements, the row containers of the ids with visibility should be hidden unless the selected item in the dropdown, shows the element. In this case, the element should be displayed');
                                } else {
                                    assert.equal(visibleElementDisplay, 'none', 'for the no selected elements, the row containers of the ids with visibility should be hidden');
                                }
                            }
                        }
                    }
                } else { //no element visible
                    for (var key in valuesByVisibility) {
                        visibleNonSelectedElementIds = valuesByVisibility[key];
                        for (var i = 0; i < visibleNonSelectedElementIds.length; i++) {
                            visibleElementDisplay = this.$formContainer.find("#" + visibleNonSelectedElementIds[i]).closest('.row').css("display");
                            assert.equal(visibleElementDisplay, 'none', 'for the no selected elements, the row containers of the ids with visibility should be hidden');
                        }
                    }
                }
            });

            it('should show or hide visibility elements for a check box element', function () {
                var self = this,
                    elementId = 'checkbox_enable_v',
                    $elements = this.$formContainer.find('#' + elementId + ' input'),
                    elementConfiguration = elementsConfigurationById[elementId],
                    valuesByVisibility = getValuesByVisibility(elementConfiguration.values),
                    visibleElementIds, visibleElementDisplay;

                $elements.each(function (id, element) {
                    visibleElementIds = valuesByVisibility[element.id];
                    if (visibleElementIds) {
                        if (element.checked) {
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = self.$formContainer.find("#" + visibleElementIds[i]).closest('.row').css("display");
                                assert.equal(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                            }
                        } else {
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = self.$formContainer.find("#" + visibleElementIds[i]).closest('.row').css("display");
                                assert.equal(visibleElementDisplay, 'none', 'for the no selected elements, the row containers of the ids with visibility should be hidden');
                            }
                        }
                    }
                });
            });

            it('should show or hide visibility elements for a radio button element', function () {
                var self = this,
                    elementId = 'radio_button_v',
                    $elements = this.$formContainer.find('#' + elementId + ' input'),
                    elementConfiguration = elementsConfigurationById[elementId],
                    valuesByVisibility = getValuesByVisibility(elementConfiguration.values),
                    visibleElementIds, visibleElementDisplay;

                $elements.each(function (id, element) {
                    visibleElementIds = valuesByVisibility[element.id];
                    if (visibleElementIds) {
                        if (element.checked) {
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = self.$formContainer.find("#" + visibleElementIds[i]).closest('.row').css("display");
                                assert.equal(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                            }
                        } else {
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = self.$formContainer.find("#" + visibleElementIds[i]).closest('.row').css("display");
                                assert.equal(visibleElementDisplay, 'none', 'for the no selected elements, the row containers of the ids with visibility should be hidden');
                            }
                        }
                    }
                });
            });

            it('should show or hide visibility elements for a toggleButton widget element', function () {
                var self = this,
                    elementId = 'toggle_button_v',
                    $element = this.$formContainer.find('#' + elementId),
                    elementConfiguration = elementsConfigurationById[elementId],
                    visibleElementIds = getVisibilityIds(elementConfiguration),
                    visibleElementDisplay;

                visibleElementIds.forEach(function (visibleElementId) {
                    visibleElementDisplay = self.$formContainer.find("#" + visibleElementId).closest('.row').css("display");
                    assert.equal(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                });

                //switch toggleButton widget to hide visibility elements
                $element.trigger("click");

                visibleElementIds.forEach(function (visibleElementId) {
                    visibleElementDisplay = self.$formContainer.find("#" + visibleElementId).closest('.row').css("display");
                    assert.notEqual(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                });

                //switch again toggleButton widget, this time programmatically to show visibility elements
                this.instantiatedWidgets["toggleButton_" + elementId].instance.setValue(true);
                //switch toggleButton widget programmatically
                visibleElementIds.forEach(function (visibleElementId) {
                    visibleElementDisplay = self.$formContainer.find("#" + visibleElementId).closest('.row').css("display");
                    assert.equal(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                });
            });

            it('should show or hide visibility elements for a input element', function () {
                var self = this,
                    elementId = 'text_email_v_1',
                    $element = this.$formContainer.find('#' + elementId),
                    elementConfiguration = elementsConfigurationById[elementId],
                    visibleElementIds = getVisibilityIds(elementConfiguration),
                    visibleElementDisplay;

                $element.val('mvilitanga@gmail.com');

                //form validation is triggered
                this.formWidgetObj.isValidInput();

                visibleElementIds.forEach(function (visibleElementId) {
                    visibleElementDisplay = self.$formContainer.find("#" + visibleElementId).closest('.row').css("display");
                    assert.equal(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                });
            });

            it('should enable visibility elements for a input element', function () {
                var self = this,
                    elementId = 'text_email_v_2',
                    $element = this.$formContainer.find('#' + elementId),
                    elementConfiguration = elementsConfigurationById[elementId],
                    visibleElementIds = getVisibilityIds(elementConfiguration),
                    disabledAttribute;

                $element.val('mvilitanga@gmail.com');

                //form validation is triggered
                this.formWidgetObj.isValidInput();

                if (elementConfiguration.visibility && elementConfiguration.visibility.disabled) {
                    visibleElementIds.forEach(function (visibleElementId) {
                        disabledAttribute = self.$formContainer.find("#" + visibleElementId).attr('disabled');
                        assert.equal(disabledAttribute, 'disabled', 'for the selected element, the row containers of the ids with visibility should be displayed');
                    });
                } else {
                    assert.isTrue(false, 'for the selected element, the disabled property was not found and the unit test was not executed');
                }
            });

            it('should mark as required visibility elements for a input element', function () {
                var self = this,
                    elementId = 'text_email_v_3',
                    $element = this.$formContainer.find('#' + elementId),
                    elementConfiguration = elementsConfigurationById[elementId],
                    visibleElementIds = getVisibilityIds(elementConfiguration),
                    requiredAttribute;

                $element.val('mvilitanga@gmail.com');

                //form validation is triggered
                this.formWidgetObj.isValidInput();

                if (elementConfiguration.visibility && elementConfiguration.visibility.required) {
                    visibleElementIds.forEach(function (visibleElementId) {
                        requiredAttribute = self.$formContainer.find("#" + visibleElementId).attr('required');
                        assert.equal(requiredAttribute, 'required', 'for the selected element, the row containers of the ids with visibility should be displayed');
                    });
                } else {
                    assert.isTrue(true, 'for the selected element, the required property was not found and the unit test was not executed');
                }
            });

        });

        describe('isValidInput value on toggling required fields in a section with progressive disclosure', function () {
            var configurationSample;
            var elementSection;

            beforeEach(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                configurationSample.sections = dynamicElementsConfiguration.sectionWithVisibility;
                elementSection = configurationSample.sections[0].elements;
                $test_widget_container.css("display", "block");
            });
            afterEach(function () {
                $test_widget_container.css("display", "none");
            });
            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.$progressiveDisclosureCarat = this.$formContainer.find(".progressive_disclosure").eq(0);
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };
            it('isValid for show or hide visibility elements with required true for a toggleButton widget element', function () {
                elementSection[1].required = true;
                var tc = new TestContext();
                var elementId = 'toggle_button_v_1',
                    $element = tc.$formContainer.find('#' + elementId);
                assert.equal(tc.formWidgetObj.isValidInput(), true, "isValid is true as the required field is not available -visibility hidden-");

                //collapse section
                tc.$progressiveDisclosureCarat.trigger("click");
                assert.equal(tc.formWidgetObj.isValidInput(), true, "isValid is true as the required field is not available -visibility hidden-, even when the section is collapsed");

                //expand section and switch toggleButton widget
                tc.$progressiveDisclosureCarat.trigger("click");
                $element.trigger("click");
                assert.equal(tc.formWidgetObj.isValidInput(), false, "isValid is true as the required field is available but not value is provided");

                //collapse section
                tc.$progressiveDisclosureCarat.trigger("click");
                assert.equal(tc.formWidgetObj.isValidInput(), false, "isValid is true as the required field is available but not value is provided, even when the section is collapsed");

                tc.destroy();
            });
            it('isValid for show or hide visibility elements with required false for a toggleButton widget element', function () {
                elementSection[1].required = false;
                var tc = new TestContext();
                var elementId = 'toggle_button_v_1',
                    $element = tc.$formContainer.find('#' + elementId);
                assert.equal(tc.formWidgetObj.isValidInput(), true, "isValid is true as there are not required fields, even the ones that are not available -visibility hidden-");
                //collapse section
                tc.$progressiveDisclosureCarat.trigger("click");
                assert.equal(tc.formWidgetObj.isValidInput(), true, "isValid is true as there are not required fields even the ones with visibility hidden and when the section is collapsed");

                //expand section and switch toggleButton widget
                tc.$progressiveDisclosureCarat.trigger("click");
                $element.trigger("click");
                assert.equal(tc.formWidgetObj.isValidInput(), true, "isValid is true as none of the fields are required");

                //collapse section
                tc.$progressiveDisclosureCarat.trigger("click");
                assert.equal(tc.formWidgetObj.isValidInput(), true, "isValid is true as none of the fields are required, even when the section is collapsed");
                tc.destroy();
            });

        });

        describe('Section and Visibility', function () {
            var configurationSample;
            before(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    // "values": formConfiguration.values,
                    "container": this.$formContainer[0]
                }).build();
                this.$form = this.$formContainer.find("form" + "#" + configurationSample["form_id"]);
            });
            after(function () {
                cleanUp(this);
            });

            var getVisibilityIds = function (elementConfiguration) {
                    var getArray = function (value) {
                            if (typeof(value) == "string")
                                return [value];
                            return value;
                        },
                        isArrayOrString = function (value) {
                            return (_.isArray(value) || _.isString(value));
                        };
                    return getArray(isArrayOrString(elementConfiguration.visibility) ? elementConfiguration.visibility : elementConfiguration.visibility.visibilityIds)
                },
                getValuesByVisibility = function (values) {
                    var valuesByVisibility = {}, valueByVisibility;
                    for (var i = 0; i < values.length; i++) {
                        var elementOption = values[i];
                        if (elementOption.visibility) {
                            valueByVisibility = getVisibilityIds(elementOption);
                            valueByVisibility && (valuesByVisibility[elementOption.id] = valueByVisibility);
                        }
                    }
                    return valuesByVisibility;
                };

            it('should add a section with show/hide content (toggle_section)', function () {
                var section = dynamicElementsConfiguration.section2,
                    sectionId = section["section_id"],
                    $section = this.$form.find("#" + sectionId);
                assert.isFalse(_.isElement($section[0]), "section does not exist");
                this.formWidgetObj.addSection(section);
                $section = this.$form.find("#" + sectionId);
                assert.isTrue(_.isElement($section[0]), "section is added");
                var $sectionToggle = $section.find(".toggle_section input");
                assert.isTrue(_.isElement($sectionToggle[0]), "section toggle checkbox is added");
                var $sectionContent = $section.find(".section_content");
                assert.isTrue($sectionContent.hasClass("hide"), "the content of the section is hidden");
                $sectionToggle.trigger("click");
                assert.isFalse($sectionContent.hasClass("hide"), "the content of the section is showed");
            });

            it('should add a section with visible content', function() {
                var section = dynamicElementsConfiguration.section3,
                    sectionId = section["section_id"],
                    $section = this.$form.find("#" + sectionId);
                assert.isFalse(_.isElement($section[0]), "section does not exist");
                this.formWidgetObj.addSection(section);
                $section = this.$form.find("#" + sectionId);
                assert.isTrue(_.isElement($section[0]), "section is added");
                var $sectionContent = $section.find(".section_content");
                assert.isFalse($sectionContent.hasClass("hide"), "the content of the section is showed");
            });

            it('should show or hide visibility elements for a check box element', function () {
                var self = this,
                    section = dynamicElementsConfiguration.section3,
                    elementId = 'checkbox_field_2_sec_3',
                    $elements = this.$form.find('#' + elementId + ' input'),
                    elementConfiguration = section.elements[0],
                    valuesByVisibility = getValuesByVisibility(elementConfiguration.values),
                    visibleElementIds, visibleElementDisplay;

                $elements.each(function (id, element) {
                    visibleElementIds = valuesByVisibility[element.id];
                    if (visibleElementIds) {
                        if (element.checked) {
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = self.$form.find("#" + visibleElementIds[i]).closest('.row').css("display");
                                assert.equal(visibleElementDisplay, 'block', 'for the selected element, the row containers of the ids with visibility should be displayed');
                            }
                        } else {
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = self.$form.find("#" + visibleElementIds[i]).closest('.row').css("display");
                                assert.equal(visibleElementDisplay, 'none', 'for the no selected elements, the row containers of the ids with visibility should be hidden');
                            }
                        }
                    }
                });
            });

            it('should show or hide visibility sections for an element', function () {
                var self = this,
                    elementId = 'radio_button_v_section',
                    elementConfiguration = elementsConfigurationById[elementId],
                    $elements = this.$form.find('#' + elementId + ' input'),
                    valuesByVisibility = getValuesByVisibility(elementConfiguration.values),
                    visibleElementIds, visibleElementDisplay;

                $elements.each(function (id, element) {
                    visibleElementIds = valuesByVisibility[element.id];
                    if (visibleElementIds) {
                        if (element.checked) {
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = self.$form.find("#" + visibleElementIds[i]).css("display");
                                assert.equal(visibleElementDisplay, 'block', 'for the selected element, the section of the id with visibility should be displayed');
                            }
                        } else {
                            for (var i = 0; i < visibleElementIds.length; i++) {
                                visibleElementDisplay = self.$form.find("#" + visibleElementIds[i]).css("display");
                                assert.equal(visibleElementDisplay, 'none', 'for the no selected elements, the section of the ids with visibility should be hidden');
                            }
                        }
                    }
                });
            });
        });

        // TO-DO: These require a jqueryui version upgrade to run correctly as they show the TypeError: Cannot read property 'toString' of undefined. Should be taken care of as a part of SPOG-1612
        describe('addSection Method Widget Integration', function() {
            before(function(){
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": formConfiguration.elements,
                    "values": formConfiguration.values,
                    "container": this.$formContainer[0]
                }).build();
                this.$form = this.$formContainer.find("form"+"#"+formConfiguration.elements["form_id"]);
            });
            after(function(){
                cleanUp(this);
            });
            it('Dropdown Widget Integration', function() {
                var sectionConf = _.extend({}, dynamicElementsConfiguration.section3),
                    sectionId = "new_section",
                    dropdownId = 'dropdown_field_sec_3';

                sectionConf["section_id"] = sectionId;

                var $section = this.$form.find("#" + sectionId);

                assert.isFalse(_.isElement($section[0]), "section does not exist");
                this.formWidgetObj.addSection(sectionConf);
                $section = this.$form.find("#" + sectionId);
                assert.isTrue(_.isElement($section[0]), "section is added");
                assert.isTrue($section.find("#" + dropdownId).hasClass("select2-hidden-accessible"), "dropdown widget is integrated");
            });
        });

        describe('Inline options', function () {
            var configurationSample;
            var elementSection;

            before(function () {
                configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                elementSection = configurationSample.sections[0].elements;
            });

            afterEach(function () {
                configurationSample.sections[0].elements = [];
                elementSection = configurationSample.sections[0].elements;
            });

            var TestContext = function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "values": formConfiguration.values,
                    "container": this.$formContainer[0]
                }).build();
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                }
            };
            describe('Inline labels', function () {
                it('should have two elementinlinelabel class elements', function () {
                    elementSection.push(formConfigurationBySections.inlineConfig);
                    var tc = new TestContext();
                    var inlineFieldId = 'text_field_inline',
                        $inlineField = tc.$formContainer.find('#' + inlineFieldId),
                        numInlineLabels = $inlineField.closest(".elementinput").siblings(".elementinlinelabel").length;
                    assert.isTrue(numInlineLabels > 0, "inline labels exist");
                    assert.equal(numInlineLabels, elementSection[0].inlineLabels.length, 'the number of inline labels is 2');
                    tc.destroy();
                });
            });
            describe('Inline links', function () {
                it('should have elementlink class element', function () {
                    elementSection.push(formConfigurationBySections.inlineConfig);
                    var tc = new TestContext();
                    var inlineFieldId = 'text_field_inline',
                        $inlineField = tc.$formContainer.find('#' + inlineFieldId),
                        numInlineLinks = $inlineField.closest(".elementinput").siblings(".elementlink").length;
                    assert.isTrue(numInlineLinks > 0, "inline links exist");
                    assert.equal(numInlineLinks, elementSection[0].inlineLinks.length, 'the number of inline links is 1');
                    tc.destroy();
                });
            });
            describe('Inline Icon', function () {
                it('should have elementicon class element', function () {
                    elementSection.push(formConfigurationBySections.inlineConfig);
                    var tc = new TestContext();
                    var inlineFieldId = 'text_field_inline',
                        $inlineField = tc.$formContainer.find('#' + inlineFieldId),
                        numInlineIcons = $inlineField.closest(".elementinput").siblings().find(".elementicon").length;
                    assert.isTrue(numInlineIcons > 0, "inline icons exist");
                    assert.equal(numInlineIcons, elementSection[0].inlineIcons.length, 'the number of inline icons is 1');
                    tc.destroy();
                });

                it('should have label shown -  if provided in config', function () {
                    elementSection.push(formConfigurationBySections.inlineConfig);
                    var tc = new TestContext();
                    var inlineFieldId = 'text_field_inline',
                        $inlineField = tc.$formContainer.find('#' + inlineFieldId),
                        numInlineIconsLabels = $inlineField.closest(".elementinput").siblings().find(".elementiconlabel").length;
                    assert.isTrue(numInlineIconsLabels > 0, "inline icons Labels should exist");
                    tc.destroy();
                });

            });
        });

        describe('showFormError and showFormInfo methods', function () {
            before(function () {
                this.$formContainer = createContainer();
                this.formWidgetObj = new FormWidget({
                    "elements": formConfigurationBySections.basicStructureInfoError,
                    "container": this.$formContainer[0]
                }).build();
                this.$form = this.$formContainer.find("form" + "#" + formConfigurationBySections.basicStructureInfoError["form_id"]);
            });
            after(function () {
                cleanUp(this);
            });
            it('showFormError method', function () {
                var $error = this.$form.find(".error-message").eq(0), //first case before integrated widgets
                    newError = "updated";

                //$error is hidden by default
                assert.equal($error.css("display"), 'none', 'the error container is hidden by default');

                this.formWidgetObj.showFormError();
                assert.equal($error.css("display"), 'block', 'the error container is shown');

                this.formWidgetObj.showFormError(newError);
                assert.equal($error.find(".content").text(), newError, 'the error message is updated');

                this.formWidgetObj.showFormError(undefined, true);
                assert.equal($error.css("display"), 'none', 'the error container is not shown');
                assert.equal($error.find(".content").text(), newError, 'the error message is not updated');
            });
            it('showFormInfo method', function () {
                var $info = this.$form.find(".info-message").eq(0), //first case before integrated widgets
                    newInfo = "updated";

                //$info is hidden by default
                assert.equal($info.css("display"), 'none', 'the info container is hidden by default');

                this.formWidgetObj.showFormInfo();
                assert.equal($info.css("display"), 'block', 'the info container is shown');

                this.formWidgetObj.showFormInfo(newInfo);
                assert.equal($info.find(".content").text(), newInfo, 'the info message is updated');

                this.formWidgetObj.showFormInfo(undefined, true);
                assert.equal($info.css("display"), 'none', 'the info container is not shown');
                assert.equal($info.find(".content").text(), newInfo, 'the info message is not updated');
            });
        });

        describe('toggleSection and toggleRow methods', function () {
            before(function () {
                this.$formContainer = createContainer();
                var configurationSample = $.extend(true, {}, formConfigurationBySections.basicStructure);
                configurationSample.sections = dynamicElementsConfiguration.twoSections;
                this.formWidgetObj = new FormWidget({
                    "elements": configurationSample,
                    "container": this.$formContainer[0]
                }).build();
                this.$form = this.$formContainer.find("form" + "#" + formConfigurationBySections.basicStructure["form_id"]);
            });
            after(function () {
                cleanUp(this);
            });
            it('toggleSection method', function () {
                var sectionId = "section_id_1",
                    $section = this.$form.find("#" + sectionId);

                assert.equal($section.css("display"), 'none', 'the section is hidden by default using the hidden property');

                this.formWidgetObj.toggleSection(sectionId);
                assert.equal($section.css("display"), 'block', 'the section is shown after toggleSection');
                var inputId = "text_url_check",
                    $row = this.$form.find("#" + inputId).closest(".row");
                assert.equal($row.css("display"), 'none', 'the hidden element remains hidden after toggleSection');
            });
            it('toggleRow method', function () {
                var inputId = "text_url_s_v",
                    $row = this.$form.find("#" + inputId).closest(".row");

                assert.equal($row.css("display"), 'block', 'the row is shown by default');

                this.formWidgetObj.toggleRow(inputId);
                assert.equal($row.css("display"), 'none', 'the row is hidden after toggleRow');

            });
        });

        describe('Events', function () {
            var TestContext = function (events) {
                var formConfiguration = $.extend(true, {}, formConfigurationBySections.basicStructure),
                    formId = formConfigurationBySections.basicStructure["form_id"];
                this.addFormElement = function (element) {
                    formConfiguration.sections[0].elements.push(element);
                };
                this.build = function () {
                    this.$formContainer = createContainer();
                    this.formWidgetObj = new FormWidget({
                        "elements": formConfiguration,
                        "events": events,
                        "container": this.$formContainer[0]
                    }).build();
                    this.$form = this.$formContainer.find("form" + "#" + formId);
                };
                this.destroy = function () {
                    this.formWidgetObj.destroy();
                    this.$formContainer.remove();
                };
            };
            describe('validated', function () {
                it('should invoke validated handler with and without required field', function () {
                    var validatedData,
                        validatedHandler = function (event, data) {
                            validatedData = data;
                        },
                        events = {
                            "validated": {
                                "handler": [validatedHandler]
                            }
                        };
                    var testContext = new TestContext(events);
                    testContext.addFormElement(formConfigurationBySections.nonRequiredInput);
                    testContext.addFormElement(formConfigurationBySections.requiredInput);
                    testContext.build();

                    //non-required field
                    var $emailInput = testContext.$formContainer.find("#text_email_v_1");
                    assert.isFalse($emailInput.parent().hasClass("error"), "the field is not required and shouldn't show an error");
                    $emailInput.val('mvilitanga@gmail.com').blur();
                    assert.isTrue(_.isObject(validatedData), "the validated callback is invoked and provides a data Object");
                    assert.isFalse(validatedData.isValidInput, "the value of isValidInput is false because required field value is missing");

                    //required field
                    var $emailInput2 = testContext.$formContainer.find("#text_email_v_2");
                    assert.isTrue($emailInput2.parent().hasClass("error"), "the field is required and it should show an error after the form is validated");
                    $emailInput2.val('').blur();
                    assert.isFalse(validatedData.isValidInput, "the value of isValidInput is false because required field value is missing");
                    $emailInput2.val('mvilitanga@gmail.com').blur();
                    assert.isTrue(validatedData.isValidInput, "the value of isValidInput is true because required field value is available");

                    testContext.destroy();
                });
                it('should invoke validated handler with a required field', function () {
                    var validatedData,
                        validatedHandler = function (event, data) {
                            validatedData = data;
                        },
                        events = {
                            "validated": {
                                "handler": [validatedHandler]
                            }
                        };
                    var testContext = new TestContext(events);
                    testContext.addFormElement(formConfigurationBySections.requiredInput);
                    testContext.build();

                    var $emailInput2 = testContext.$formContainer.find("#text_email_v_2");
                    assert.isFalse($emailInput2.parent().hasClass("error"), "the field is required but it shouldn't show an error when the form is loaded");
                    $emailInput2.val('').blur();
                    assert.isTrue(_.isObject(validatedData), "the validated callback is invoked and provides a data Object");
                    assert.isFalse(validatedData.isValidInput, "the value of isValidInput is false because required field value is missing");
                    $emailInput2.val('mvilitanga@gmail.com').blur();
                    assert.isTrue(validatedData.isValidInput, "the value of isValidInput is true because required field value is available");

                    testContext.destroy();
                });
                it('should invoke validated handler without required field', function () {
                    var validatedData,
                        validatedHandler = function (event, data) {
                            validatedData = data;
                        },
                        events = {
                            "validated": {
                                "handler": [validatedHandler]
                            }
                        };
                    var testContext = new TestContext(events);
                    testContext.addFormElement(formConfigurationBySections.nonRequiredInput);
                    testContext.build();

                    //non-required field
                    var $emailInput = testContext.$formContainer.find("#text_email_v_1");
                    assert.isFalse($emailInput.parent().hasClass("error"), "the field is not required and shouldn't show an error");
                    $emailInput.val('').blur();
                    assert.isTrue(_.isObject(validatedData), "the validated callback is invoked and provides a data Object");
                    assert.isTrue(validatedData.isValidInput, "the value of isValidInput is true because required the field is not required");

                    testContext.destroy();
                });
            });
        });

    });
});
