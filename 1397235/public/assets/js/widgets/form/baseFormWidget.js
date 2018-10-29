/**
 * A module that builds a form from a template and one or two configuration objects.
 * The template is located in the templates folder (form.html) and was written using Mustache
 * The configuration is composed by the elements of the form: conf.elements and
 * the prepopulated values for each elements: conf.values
 *
 * @module FormWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'widgets/baseWidget',
    'widgets/form/formTemplates',
    'widgets/form/formValidator',
    'widgets/form/util/configFormatter',
    'widgets/form/util/formUpdater',
    'widgets/form/lib/ipv4mask',
    'lib/template_renderer/template_renderer',
    'widgets/form/lib/helpBuilder',
    'widgets/form/lib/visibilitySelector',
    'widgets/form/lib/spinnerBuilder',
    'widgets/tooltip/tooltipWidget',
    'jquery.resize'
], /** @lends FormWidget */
    function(BaseWidget, FormTemplates, FormValidator, ConfigFormatter, FormUpdater, ipv4, render_template, HelpBuilder, VisibilitySelector, SpinnerBuilder, TooltipWidget, resize) {

    /**
     * FormWidget constructor
     *
     * @constructor
     * @class FormWidget - Builds a form from a template and configuration objects.
     *
     * @param {Object} conf - configuration object with three parameters:
     * container: define the container where the widget will be rendered
     * elements: define which elements will be part of the form
     * <values>: define the value of the elements
     */
    var FormWidget = function(conf, WidgetsIntegration){

        /**
         * Initializes the form widget with constructor and other variables
         */
        BaseWidget.call(this, {
            "events": conf.events
        });

        this.conf = {
            "container": $(conf.container),
            "elements" : conf.elements,
            "values" : conf.values
        };
        var configFormatter = new ConfigFormatter(conf.elements);
        var formConfigurationById = configFormatter.formatConfigElements(this.conf.elements);
        var templates = new FormTemplates();
        var formValidator = new FormValidator(formConfigurationById);
        var formUpdater = new FormUpdater();
        var widgetsIntegration, addProgressiveDisclosure, helpBuilder, visibilitySelector, resizeCallback;
        var defaults = {
            "tabGridWidgetPadding": 4
        };
        var self = this;

        /**
         * Builds the formWidget in the specified container
         * @returns {Object} current FormWidget object
        */
        this.build =  function () {
            if (WidgetsIntegration) {
                widgetsIntegration = new WidgetsIntegration(formConfigurationById, this.conf);
            }
            var elementsTemplateHtml = render_template(templates.getFormTemplate(), this.conf.elements, templates.getPartialTemplates());
            if(typeof this.conf.values == 'undefined'){
                this.formTemplateHtml =  this.conf.container.html(elementsTemplateHtml);
            } else {
                this.formTemplateHtml = this.conf.container.html(render_template(elementsTemplateHtml, this.conf.values));
            }

            visibilitySelector = new VisibilitySelector(this.formTemplateHtml, formConfigurationById);
            widgetsIntegration && widgetsIntegration.addWidgets(this.formTemplateHtml, visibilitySelector);
            formValidator._init(visibilitySelector);
            formValidator.validateForm(this.formTemplateHtml, conf.elements);
            visibilitySelector.addVisibleElements();
            conf.events && bindEvents();
            this.isValidInput(true); // trigger form validation but ignores required field validation

            helpBuilder = new HelpBuilder(this.formTemplateHtml, conf);
            helpBuilder.addHelpIcons();
            addProgressiveDisclosure(this.formTemplateHtml, this);
            updateFilePath(this.formTemplateHtml);
            setContainerSize();
            bindSubmitCallbackButtons(this.conf, this.formTemplateHtml);
            this.tooltipWidget = new TooltipWidget({
                "container": this.formTemplateHtml
            }).build();
            return this;
        };

        /**
         * Destroys all elements created by the FormWidget in the specified container
         * @returns {Object} current FormWidget object
        */
        this.destroy =  function () {
            this.tooltipWidget.destroy();
            this.conf.container.removeResize(resizeCallback);
            this.conf.container.remove();
            return this;
        };

        /**
         * Validates that all the fields of the form has the right input
         * Validates externally integrated widgets
         * @param {boolean} skipRequiredElements - if it is set to true, it will skip the required elements; the default value is false
         * @returns {Boolean} true is form has valid inputs or false is one or more elements of the form are invalid
        */
        this.isValidInput = function (skipRequiredElements){
            var isValid = false,
                isRemoteValid = false;
            if (this.formTemplateHtml){
                var $form = this.formTemplateHtml.find('> form');
                isRemoteValid = formValidator.isValidRemoteInput($form, skipRequiredElements);
                isValid = formValidator.isValidInput($form, skipRequiredElements);
                if(isValid){
                    var externalIntegratedWidgets = $form.find('[data-integrated-widget]');
                    externalIntegratedWidgets.each(function(){  //showFormInlineError (formValidator) is setting data-invalid attr
                        if($(this).attr('data-invalid') != undefined){
                            isValid =  false;
                            return false;
                        }
                    });
                }
            } else {
                throw new Error("The form widget has to be built first");
            }
            return isValid && isRemoteValid;
        };

        /**
         * Serialize the value of a field depending on how it was passed to the form on the value or initValue properties
         * @param {Object} element - id/name and value of the field
         * @param {Object} $element - jQuery object of the field
         * @param {Object} formValuesByObj - object that will get the serialize value updated
         * @inner
         */
        var getSerializeValue = function (element, $element, formValuesByObj) {
            var elementId = element.name || element.id,
                getKeyProperty = function (value) {
                    if (_.isString(value) && value.indexOf("{{") == 0 && value.indexOf("}}") == value.length - 2) {
                        return value.substring(2, value.length-2);
                    }
                },
                getValueObject = function (keys, value) { //serializes output value based on original input
                    var keys = keys.split("."),
                        keysLength = keys.length,
                        setLastValueObject = function (key,value) {
                            var valueObjTemp = {};
                            valueObjTemp[key] = value;
                            return valueObjTemp;
                        };

                    var valueObj = setLastValueObject(keys[keysLength-1], value);
                    for (var i=keysLength-1; i>0; i--) {
                       valueObj =  setLastValueObject(keys[i-1], valueObj);
                    }
                    return valueObj;
                },
                elementConfigurationId, elementConfiguration, keyProperty, valueObject;

            if (conf.values && element.value) {
                elementConfigurationId = $element.length > 1 ? $element.attr("name") : $element.attr("id");
                elementConfiguration = formConfigurationById[elementConfigurationId];
                if (elementConfiguration && (elementConfiguration.value || elementConfiguration.initValue)) {
                    keyProperty = getKeyProperty(elementConfiguration.value || elementConfiguration.initValue);
                    if (keyProperty && ~keyProperty.indexOf(".")) {
                        valueObject = getValueObject(keyProperty, element.value);
                    }
                }
            }
            formValuesByObj[elementId] = valueObject || element.value;
        };

        /**
         * Sets the size of wrapper containers (like title, content, buttons and footer) according to the maximum height of the form container
         * @inner
         */
        var setContainerSize = function () {
            var nonContentClasses = ["slipstream-content-title", "buttons.slipstream-buttons-wrapper", "slipstream-footer-wrapper"],
                contentClass = ".slipstream-content-wrapper",
                contentId = "slipstream-form-widget-content-id",
                uniqueContentId = _.uniqueId(contentId),
                $content = self.formTemplateHtml.find(contentClass).eq(0).attr(contentId, uniqueContentId),
                $sectionContent = $content.find(".section_content"),
                nonContentHeight = 0,
                contentPadding = 0,
                formContainerMaxHeight = 0,
                newFormContainerMaxHeight, formContainerMinHeight;

            //gets only the elements at the first level so the integrated ones that potentially could have its own form don't get included
            var filterElements = function (elementType) {
                    var $elements = self.formTemplateHtml.find("div[data-widget=" + elementType + "]").filter(function () {
                        return ($(this).closest(contentClass).attr(contentId) == uniqueContentId);
                    });
                    return $elements;
                },
                $gridElements = filterElements("grid"),
                $tabElements = filterElements("tabContainer");

            conf.elements.on_overlay && self.conf.container.css({
                "overflow": "hidden",
                "padding": "0px"
            }); //scrollbar will be available only on content, added inline css since the form container css is not namespaced

            //Gets the height of a container based on its max-height property. If this one it's absent, then it will be retrieved from the height property.
            //The final height value is expected to be in pixels, so it return the number of pixels of the height of the container. If the height is provided in calc function or it not available (none for max-height or any other value for height), then it will return 0
            var getContainerHeight = function (property) {
                var propertyValue = self.conf.container.css(property);
                if (~propertyValue.indexOf("%") || propertyValue == "none") {
                    return getContainerHeight("height");
                } else if (~propertyValue.indexOf("px")) {
                    return parseInt(propertyValue.slice(0, -2));
                }
                return 0;
            };

            //Sets the max height for integrated widgets that relies on a maximum height like the grid widget and tab container widgets
            var setElementsMaxHeight = function (elementsMaxHeight, contentPadding) {
                var setElementMaxHeight = function ($elements, maxHeight) {
                    var elementConfiguration;
                    $elements.each(function () {
                        elementConfiguration = formConfigurationById[this.id];
                        if (elementConfiguration) {
                            if (elementConfiguration.height && elementConfiguration.height.indexOf("%")) {
                                maxHeight *= parseInt(elementConfiguration.height.slice(0, -1)) / 100;
                            }
                            $(this).css("max-height", maxHeight);
                        }
                    });
                };
                if ($gridElements.length) {
                    setElementMaxHeight($gridElements, elementsMaxHeight - contentPadding);
                }
                if ($tabElements.length) {
                    setElementMaxHeight($tabElements, elementsMaxHeight - contentPadding);
                }
            };

            //Sets the max or min height for a form that is on an overlay and additionally sets the max height of all the grids that the form rendersgitgit
            var setContentHeight = function () {
                newFormContainerMaxHeight = getContainerHeight("max-height");
                formContainerMinHeight = getContainerHeight("min-height");
                if (!formContainerMaxHeight || formContainerMaxHeight != newFormContainerMaxHeight) {
                    formContainerMaxHeight = newFormContainerMaxHeight;
                    if (!nonContentHeight) {
                        nonContentClasses.forEach(function (nonContentClass) {
                            nonContentHeight += self.formTemplateHtml.find("." + nonContentClass).eq(0).outerHeight(true);
                        });
                        //padding originated by the content and section containers
                        contentPadding = ($content.innerHeight() - $content.height()) + ($sectionContent.eq(0).outerHeight(true) - $sectionContent.eq(0).height()) * $sectionContent.length;
                    }
                    var maxHeight = formContainerMaxHeight - nonContentHeight,
                        minHeight = formContainerMinHeight ? formContainerMinHeight - nonContentHeight : formContainerMinHeight;
                    conf.elements.on_overlay && $content.css({
                        "max-height": maxHeight,
                        "min-height": minHeight
                    });
                    setElementsMaxHeight(maxHeight, contentPadding + defaults.tabGridWidgetPadding);
                }
            };

            //adds dom update listener
            var resizeContainer = self.conf.container[0];
            resizeCallback = function () {
                setContentHeight();

            };
            if (!_.isEmpty(resizeContainer.__resizeListeners__)) { //TO BE DEPRECATED: fixes issue in the resize library where on removing a previous listener an error is throw if the dom for the attached event is missing
                self.conf.container
                    .append(resizeContainer.__resizeTriggers__)
                    .removeResize(resizeCallback);
            }
            self.conf.container.resize(resizeCallback);
        };

        /**
         * Provides a combination of name/value sets that represents the name of the input field and its value for each element of the form
         * @param {Boolean} isGetValuesObject - If is it set to true, the output of getValues is an Object with the name/id of the input field as a property
         * @returns {Array} Array of Objects with a combination of name/value sets that represents the name of the input field and its value
         */
        this.getValues = function (isGetValuesObject){
            if (this.formTemplateHtml){
                var $form = this.formTemplateHtml.find('form'),
                    formValues = $form.serializeArray(),
                    formValuesFormatted = [],
                    formValuesByObj = {};
                if ($form.find(".fileupload")){
                    var files = $form.find(".fileupload");
                    $.each( files, function( k, v) {
                        if (v){
                            var textID = v.previousElementSibling.previousElementSibling.id;
                            formValues.push({name: textID, value: v.files});
                        }
                    });
                }
                if (widgetsIntegration) {
                    formValues = widgetsIntegration.getWidgetsValue(formValues);
                }

                //removes elements that are not currently visible because of visible elements property or toggle section
                formValues.forEach(function(element){
                    var $element;
                    if (element.name) {
                        $element = $form.find('[name="'+element.name+'"]');
                    } else if (element.id) {
                        $element = $form.find('#'+element.id);
                    }

                    if ($element.closest('.row').css("display") != 'none') {
                        if (isGetValuesObject) {
                            getSerializeValue(element, $element, formValuesByObj)
                        } else {
                            formValuesFormatted.push(element);
                        }
                    }
                });
                if (isGetValuesObject)
                    return formValuesByObj;
                else
                    return formValuesFormatted;
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Shows the form inline error box with the integrated widget by app.
         * @param {Boolean} elementId - elementId of the form element to which widget is integrated
         * @param {Boolean} <optional> show - If it is set to false, it hides the inline form error for specific element
         */
        this.showFormInlineError = function (elementId, show){
            if (this.formTemplateHtml){
                var $element = this.formTemplateHtml.find('form #'+ elementId);
                $element.attr('data-integrated-widget','true');
                if(_.isBoolean(show) && !show) {
                    formValidator.hideFormInlineError($element);
                }else{
                    formValidator.showFormInlineError($element);
                }
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Shows/Hides a container. It optionally updates its content
         * @param {Object} $container - jQuery object that will be shown/hidden
         * @param {String} <optional> errMsg - html String that will be shown in container
         * @param {Boolean} <optional> notShow - If it is set to true, it hides the container
         * @inner
         */
        var toggleContainer = function ($container, errMsg, notShow) {
            if (notShow) {
                $container.hide();
            } else {
                errMsg && $container.find(".content").html(errMsg);
                $container.show();
            }
        };

        /**
         * Shows/Hides the form error content with the content defined in the form configuration (err_div_<*> parameters) or the one defined in the errMsg parameter of this method
         * @param {String} <optional> errMsg - html String that will be shown in the error container of the form
         * @param {Boolean} <optional> notShow - If it is set to true, it hides the form error
         */
        this.showFormError = function (errMsg, notShow) {
            if (this.formTemplateHtml) {
                var $error = this.formTemplateHtml.find('form .alert-box.error-message');
                toggleContainer($error, errMsg, notShow);
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Shows/Hides the form info box with the content defined in the form configuration (form_info property) or the one defined in the errMsg parameter of this method
         * @param {String} <optional> errMsg - html String that will be shown in the info container of the form
         * @param {Boolean} <optional> notShow - If it is set to true, it hides the form info
         */
        this.showFormInfo = function (errMsg, notShow) {
            if (this.formTemplateHtml) {
                var $info = this.formTemplateHtml.find('form .alert-box.info-message');
                toggleContainer($info, errMsg, notShow);
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Insert values from a collection in the id of the elements of the configuration object
         * @param {String} id - DOM id
         * @param {Object} collection - Collection that contains data to be inserted
         * @returns {Object} updated elements of the configuration object
        */
        this.insertValuesFromCollection = function (id, collection){
            configFormatter.insertValuesFromCollection(id, collection);
            return conf.elements;
        };

        /**
         * Insert values from a JSON object in the id of the elements of the configuration object
         * @param {String} id - DOM id
         * @param {Object} JSON object - JSON that contains data to be inserted
         * @returns {Object} updated elements of the configuration object
        */
        this.insertValuesFromJson = function (elementId, json){
            configFormatter.insertValuesFromJson(elementId, json);
            return conf.elements;
        };

        /**
         * Insert values from a JSON object in the section id of the elements of the configuration object
         * @param {String} sectionId - id of the section in the form configuration object
         * @param {Object} sectionConf - JSON with the values to be inserted
         * @param {boolean} insertBefore - if it is set to true, it will insert the section before the sectionId otherwise it will insert it at the specified sectionId
         * @returns {Object} updated elements of the configuration object
         */
        this.insertElementsFromJson = function (sectionId, sectionConf, insertBefore){
            configFormatter.insertElementsFromJson(sectionId, sectionConf, insertBefore);
            return conf.elements;
        };

        /**
         * Insert elements to a container
         * @param {String} id - DOM id
         * @param {Object} elements - Elements in DOM format
         * @returns {Object} Updated form
        */
        this.insertElementsToContainer = function (id, elements){
            var form = null;
            if (this.formTemplateHtml){
                this.formTemplateHtml.find("#"+id).parent().after(elements);
                form = this.formTemplateHtml;
            } else {
                throw new Error("The form widget has to be built first");
            }
            return form;
        };

        /**
         * Inserts dropdown content (option) to a dropdown element (select) after a form has been built
         * @param {dropdownId} ip of the dropdown element
         * @param {Object} JSON with the content to be inserted. It should follow the format [{label:"label",value:"value"}]
         * @param {Boolean} true: remove default content of the dropdown and add JSON object content
         *                  false: append the content of the dropdown at the end of the existing dropdown list,
         */
        this.insertDropdownContentFromJson = function (dropdownId, json, deleteDefaultList){
            var form = null;
            if (this.formTemplateHtml){
                var dropdownContainer = this.formTemplateHtml.find("#"+dropdownId);
                var widgetIdentifier = dropdownContainer.closest(".row").attr('data-widgetidentifier');
                var widgets = this.getInstantiatedWidgets();
                if (widgetIdentifier) {
                    widgets[widgetIdentifier]['instance'].addData(json,deleteDefaultList );
                }
                form = this.formTemplateHtml;
            } else {
                throw new Error("The form widget has to be built first");
            }
            return form;
        };

        /**
         * Copies a row using its className and adds it after the last row with the same className
         * @param {String} rowClassName - className of the row that needs to be copied
         * @param {Boolean} enableDelete - true: delete icon is available. When a row is deleted, an event with the rowClassName name is triggered.
         * @param {Object} elementConf - Elements in DOM format
         * @returns {Object} New added row
         */
        this.copyRow = function (rowClassName, enableDelete, elementConf){
            var newRow = null;
            if (this.formTemplateHtml){
                var sourceRow = this.formTemplateHtml.find('.'+ rowClassName);
                var widgetIdentifier = sourceRow.attr('data-widgetidentifier');
                var widgets = this.getInstantiatedWidgets();

                if(typeof this.sourceRows == 'undefined'){
                    this.sourceRows = {};
                }
                if(typeof this.sourceRows[rowClassName] == 'undefined'){
                    var originalRow = sourceRow;
                    if (sourceRow.length>1){
                        $(sourceRow[0]).addClass('first_element');
                    }
                    var type = "element";
                    if (widgetIdentifier){
                        originalRow = widgets[widgetIdentifier]['element'];
                        type = "widget";
                    }
                    if (enableDelete) {
                        formUpdater.appendDeleteIcon(sourceRow, this.formTemplateHtml, rowClassName);
                    }
                    this.sourceRows[rowClassName] = {
                        "row" : originalRow,
                        "type" : type,
                        "sequential" : 1
                    };
                    sourceRow.attr('data-copy',rowClassName);
                }
                newRow = formUpdater.copyRow(this.sourceRows[rowClassName], elementConf, rowClassName);//elementConf{"label","id","value"}
                $(sourceRow[sourceRow.length-1]).after(newRow);

                if (widgetIdentifier){ //creates a new instance of the element widget after the original source element
                    var els = newRow.find('[data-widget]');
                    var index = this.sourceRows[rowClassName].sequential;
                    $(els).attr('id', $(els).attr('id') + index);
                    widgetsIntegration && widgetsIntegration.addWidget(newRow);
                    if (enableDelete) {
                        formUpdater.appendDeleteIcon(newRow, this.formTemplateHtml, rowClassName,true);
                    }
                    newRow.attr('data-copy',rowClassName+index);
                    formUpdater.renameElements(newRow, elementConf, index);
                    formValidator.validateForm(this.formTemplateHtml);
                }

                this.sourceRows[rowClassName]['sequential']++;
                if (enableDelete) formUpdater.toggleDeleteIcon(this.formTemplateHtml, rowClassName);
            } else {
                throw new Error("The form widget has to be built first");
            }
            return newRow;
        };

        /**
         * Provides an object with the instances of the widgets used during the integration of the form widget
         * with other form element widgets
         */
        this.getInstantiatedWidgets = function(){
            if (widgetsIntegration) {
                return widgetsIntegration.getInstantiatedWidgets();
            } else {
                console.log("Form invoked without widget integration")
            }
        };

        /**
         * Toggle the status of a section from show to hide and vice versa. If the section has the class 'hide', then when the method is called, the hide class will be removed, so that the section will be showed. If the section was showed, when the method is called, the hide class will be added, so that the section will be hidden.
         * @param {String} id - id of the section
         * @param {Object} section - DOM object that represents the section
         * @returns {Object} Updated DOM object that represents the section
         */
        this.toggleSection = function (id, section) {
            if (this.formTemplateHtml) {
                var $section = id ? this.formTemplateHtml.find('#' + id) : $(section);
                $section.toggleClass("hide");
                return $section[0];
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Toggle the status of a row from show to hide and vice versa. If the row has the class 'hide', then when the method is called, the hide class will be removed, so that the section will be showed. If the row was showed, when the method is called, the hide class will be added, so that the row will be hidden.
         * @param {String} id - id of the input element
         * @param {Object} row - DOM object that represents the row, available using the class property of an element
         * @returns {Object} Updated DOM object that represents the row
         */
        this.toggleRow = function (id, row) {
            if (this.formTemplateHtml) {
                var $row = id ? this.formTemplateHtml.find('#' + id).closest(".row") : $(row);
                $row.toggleClass("hide");
                return $row[0];
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         *  Enables progressive disclosure per form section with two nested levels:  icon selection and checkbox selection. When the icon for progressive disclosure is clicked, all elements in the form including the subtitle of the section will be collapsed. When the checkbox for progressive disclosure is clicked, all elements below the checkbox progressive disclosure selector will be hidden.
         */
        addProgressiveDisclosure = function(form, context){
            form.find('.progressive_disclosure').on('click', function () {
                var $this = $(this);
                $this.closest('.form_section').find('.progressive_disclosure_content').toggleClass('collapsed');
                $this.toggleClass('collapsed');
            });
            form.find('.toggle_section input').on('click', function () {
                var $section = $(this).closest('.form_section');
                var $sectionContent = $section.find('.section_content');
                $sectionContent.toggleClass('hide'); //on progressive disclosure, only the content of the section is hidden.
                $section.toggleClass('hide'); //updates all the section to keep it consistent with toggleSection method
                context.toggleSection('',$section); //method shows or hides a section, including title and description.
            });
        };

        /**
         * Update file path once selection is done
         * @inner
         */
        var updateFilePath = function (form) {
            form.find('.fileupload').on('change', function (form) {
                var $this = $(this);
                $this.siblings('.fileupload-text').val(this.value.split('\\').pop());
            });

        };

        /**
         * Provides the index of the section where the identifier of the section is located
         * @param {string} identifier - identifier of the section
         * @returns {integer} index of the section with the identifier
         * @inner
         */
        var getSectionIndex = function (identifier) {
            var identifierType = identifier.substring(0,1) == "#" ? "section_id" : "section_class",
                sectionId = identifier.substring(1);
            for (var i=0; i< conf.elements.sections.length; i++) {
                var section = conf.elements.sections[i];
                if (!_.isUndefined(section[identifierType]) && section[identifierType] == sectionId) {
                    return i;
                }
            }
        };

        /**
         * Adds a section to the form
         * @param {Object} sectionConf - configuration of the new section as per the form widget configuration format
         * @param {string} identifier - class ('.<className>') or id ('#<id>') of the section that will be used as a reference for adding the section. If the parameter is absent, the section will be added at the end of the form.
         * @param {boolean} insertBefore - true/false. If it is set to true the new section will be added before the identifier. If it is set to false or if it is absent, the new section will be added after the section set in the identifier parameter.
         * @returns {Object} DOM object that represents the added section
         */
        this.addSection = function (sectionConf, identifier, insertBefore){
            if (this.formTemplateHtml){
                var $sectionWrapper = $("<div>");
                var elementsTemplateHtml = render_template(templates.getFormTemplate(), {"sections":[sectionConf]}, templates.getPartialTemplates());
                
                $sectionWrapper.append(elementsTemplateHtml);
                formValidator.validateForm($sectionWrapper, sectionConf);

                var $section = $sectionWrapper.find('.form_section').detach(),
                    sectionIndex;
                if (identifier && insertBefore){ //append before a section/class selector
                    this.formTemplateHtml.find(identifier).before($section);
                    sectionIndex = getSectionIndex(identifier);
                    this.insertElementsFromJson(sectionIndex, sectionConf, true);
                } else if (identifier){ //append after a section/class selector
                    sectionIndex = getSectionIndex(identifier) + 1;
                    this.formTemplateHtml.find(identifier).after($section);
                    this.insertElementsFromJson(sectionIndex, sectionConf, true);
                } else { //append at the end of the form content (elements area), just before the buttons
                    this.formTemplateHtml.find('.form-pattern .form-content.row > div').append($section);
                    sectionIndex = conf.elements.sections.length;
                    this.insertElementsFromJson(sectionIndex, sectionConf);
                }

                formConfigurationById = configFormatter.formatConfigElements(conf.elements);
                visibilitySelector.addVisibleElements(formConfigurationById);
                // TODO: Need to be investigated & fixed as part PR:1357690
                widgetsIntegration && widgetsIntegration.addWidgets(this.formTemplateHtml, visibilitySelector, formConfigurationById);
                helpBuilder.addElementsHelp($section);
                addProgressiveDisclosure($section, this);

                return $section[0];
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Adds one or more elements (rows) to the form
         * @param {Array} elementConf - configuration of the new elements as per the form widget configuration format
         * @param {string} identifier - class ('.<className>') or id ('#<id>') of the element (class name of the row) that will be used as a reference for adding the elements.
         * @param {boolean} insertBefore - true/false. If it is set to true the new elements will be added before the identifier. If it is set to false or if it is absent, the new elements will be added after the element set in the identifier parameter.
         * @returns {Object} DOM object that represents the added rows
         */
        this.addElements = function (elementConf, identifier, insertBefore){
            if (this.formTemplateHtml){
                var $sectionWrapper = $("<div>");
                var elementsTemplateHtml = render_template(templates.getFormTemplate(), {"sections":{"elements": elementConf}}, templates.getPartialTemplates());
                $sectionWrapper.append(elementsTemplateHtml);
                formValidator.validateForm($sectionWrapper, elementConf);
                var $rows = $sectionWrapper.find('.section_content > .row').detach();

                if (identifier && insertBefore){ //append before a section/class selector
                    this.formTemplateHtml.find(identifier).before($rows);
                } else if (identifier){ //append after a section/class selector
                    this.formTemplateHtml.find(identifier).after($rows);
                }

                helpBuilder.addElementsHelp($rows);
                return $rows[0];
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Remove elements or section in the form widget
         * @param {string} identifier - class ('.<className>') or id ('#<id>') of the element (class name of the row) or the section
         * @returns {Object} Removed DOM elements
         */
        this.removeElements = function (identifier){
            if (this.formTemplateHtml){
                var removedElements = this.formTemplateHtml.find(identifier);
                removedElements.remove();
                return removedElements;
            } else {
                throw new Error("The form widget has to be built first");
            }
        };

        /**
         * Binds click handler to all the submit callback buttons
         * @param {Object} conf - Form Configuration
         * @param {Object} formTemplateHtml - Form Container
         * @inner
         */
        var bindSubmitCallbackButtons = function(conf, formTemplateHtml) {
            var allButtons = conf.elements.buttons;
            var buttonHash = {};
            if(allButtons){
                for(var i=0;i<allButtons.length;i++) {
                    if (allButtons[i].onSubmit && _.isFunction(allButtons[i].onSubmit)) {
                        buttonHash[allButtons[i].id] = allButtons[i].onSubmit;
                    }
                }
                for(var id in buttonHash) {
                    $("#" + id).on("click", function() {
                        var isValid = self.isValidInput(null);
                        // isValid = true;
                        if (isValid) {
                            var values = self.getValues();
                            addSpinnerOnOverlay(values, formTemplateHtml, buttonHash[$(this).attr('id')]);
                        }
                    });
                }
            }
        };

        /**
         * adds spinner on overlay when submit button is clicked
         * @param {Object} values - form values
         * @param {string} formTemplateHtml - form element on which the spinner needs to be added
         * @param {function} onSubmit - callback after the spinner is done executing
         * @inner
         */
         var addSpinnerOnOverlay = function(values, formTemplateHtml, onSubmit) {
            var spinnerView = new SpinnerBuilder();
            spinnerView.showSpinnerInForm(formTemplateHtml.find("form").attr("id"), formTemplateHtml);
            onSubmit(values, function(){
                spinnerView.removeSpinnerFromForm(formTemplateHtml);
                self.showFormError(null, true);
                formTemplateHtml.trigger("slipstream:server:validation:success");
            }, function(errorMsg){
                spinnerView.removeSpinnerFromForm(formTemplateHtml);
                self.showFormError(errorMsg);
                formTemplateHtml.trigger("slipstream:server:validation:error");
            });
         };

        /**
         * Binds events in the form widget to make it available through callbacks defined in the conf.events property
         * @inner
         */
        var bindEvents = function () {
            var $form = self.formTemplateHtml.find("> form");
            if (conf.events.validated) {
                $form.attr("data-auto-validation", "");
                $form.bind("slipstreamForm.validation:form", function (event, data) {
                    event.stopPropagation();
                    var validatedData = {
                        "isValidInput": data.isValid,
                        "formId": $form.attr("id")
                    };
                    self._invokeHandlers("validated", data.event, validatedData);
                });
            }
        };

    };

    FormWidget.prototype = Object.create(BaseWidget.prototype);
    FormWidget.prototype.constructor = FormWidget;

    return FormWidget;
});