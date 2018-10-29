# Form Widget


## Introduction
The form widget is a reusable graphical user interface that allows users to create a form from a configuration object. A form is used to collect information from a user in order to complete some action, such as creating or editing an object, or setting configuration parameters. The form widget output is a container with elements, style, and interactions like help tooltip and validation. It is appended to the container defined in the form widget configuration object. This approach is knows as the programmatic form.
The form can be added to a container programmatically or as a component. The current document describes how to add a form programmatically. To add a form as a React component, refer to [Form React Component](public/assets/js/widgets/form/react/form.md).


## API
The form widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods and any data required by the widget is passed by its constructor. It also exposes some utility methods like isValidInput, insertValuesFromCollection, insertValuesFromJson, insertElementsFromJson, insertElementsToContainer, insertDropdownContentFromJson, copyRow and getInstantiatedWidgets.

### Configuration
The configuration object has three parameters:

```
{
    container: <define the container where the widget will be rendered>,
    elements: <define which elements will be part of the form>
    values: <define the value of the elements used to bind the fields with a data model>
    events: <define the callbacks that will be invoked when an event in the form is invoked>
}
```

For example:

```
    var form = new FormWidget({
                                "container": this.el
                                "elements": configurationObject,
                                "values": valueObject,
                             });
```

where configurationObject and valueObject follows a format specific to the form widget and are explained in the next sections.

#### Elements
The elements parameter is an object that has the following parameters:
- title: the title of the form
- form_id,form_name: the internal id and name of the form
- title-help: adds a tooltip text next to the title of the form. It has two parameters: content and ua-help-identifier. content parameter defines the content of the tooltip and ua-help-identifier parameter adds an alias for user assistance event binding.
- form_info: adds an info container at the top of the form. It has two properties: content and class. content property defines the content of the info box and class property adds a class to the form info container.
- error_div_id, err_div_message, err_div_link, err_div_link_text: the error message that will be showed when the form is submitted and an error happens.
- err_timeout, valid_timeout: time in milliseconds that a validation will take before is triggered for all fields except remote fields
    or
- timeout: can be given an object having error, valid and remote error timeouts. *remote_error* timeout is the time in milliseconds that the remote validation will take before triggering. This is meant for remote fields only. *valid* and *error* timeout is time in milliseconds that a validation will take before it is triggered for all fields except remote fields. Default values for *error* timeout is 500, *valid* timeout is 500 and *remote_error* timeout is 1000.
   If timeout property is defined then err_timeout and valid_timeout will not be taken into consideration.
- on_overlay: defines if the form will be rendered on an overlay. The user of the form widget will still need to instantiate the overlay widget and add include the form widget on its view in order to see the form on an overlay. The on_overlay property only sets the style on the form in a way that it will be rendered properly when it is used on an overlay.
- sections: elements in a form grouped by sections
- buttons, unlabeled, cancel_link: buttons in a form and how it will be showed
- footer: footer of the form
The parameters are optional, so if it's not used, then it will be absent from the form. Sections, buttons and footer parameters are explained with my detail bellow.

For example:

```
configurationObject = {
    "title": "Sample Form Widget",
    "form_id": "sample_form",
    "form_name": "sample_form",
    "title-help": {
                "content": "Tooltip for the title of the Form Widget",
                "ua-help-identifier": "alias_for_title_ua_event_binding"
            },
    "err_div_id": "errorDiv",
    "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
    "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
    "err_div_link_text":"Configuring Basic Settings",
    "timeout": {
      "error": "1000",
      "valid": "5000",
      "remote_error": "1500"
    },
    "on_overlay": true,
    "sections": [ ... ]
    "buttons": [ ...],
    "unlabeled":"true",
    "footer": [
        {
            "text":"By setting the root password I accept the terms of the ",
            "url":"License Agreement",
            "id":"login_agreement"
        }
    ]
};
valueObject = {
        "text": "Sample Form Widget",
        "email": "mvilitanga@gmail.com",
        "url": "www.gmail.com"
    };
```


##### Sections
A form can be composed of multiple sections, each of them contains:
- heading: the title of the section of the form
- heading_text: the details of the section of the form, presented as a text
- section_id: the id of the section
- section_class: the class of the section
- progressive_disclosure: adds an icon next to the title of the section (heading) that allows to close or open the section. The value of the progressive_disclosure property could be: expanded (the section will be showed expanded) or collapsed (the section will be showed collapsed and only the title will be visible). If the progressive_disclosure property is absent, the progressive disclosure icon for the section will not be available.
- toggle_section: adds a checkbox with a label that when it is clicked will show or hide the form elements below the checkbox for the current section. It contains three parameters: label (the label of the checkbox), checked (if the checkbox should be selected by default, value: true/false), and status (if the section should be showed or hidden by default, value: show/hide). If the toggle_section property is absent, the checkbox for the section will not be available.
- elements: the elements of the form section. It is an Array Object and each object represent the parameters the form widget requires to create the element in the form. More details are explained below.

For example:

```
{
    "sections": [
        {
            "heading": "Subtitle",
            "heading_text": "Subtitle text",
            "section_id": "section_id",
            "section_class": "section_class",
            "progressive_disclosure": "collapsed",
            "toggle_section":{
                 "label": "Select to show the form elements of section 1",
                 "status": "hide",
                 "checked": true
            },
            "elements": [
                {
                    "element_text": true,
                    "id": "text_field",
                    "name": "text_feld",
                    "label": "Text",
                    "placeholder": "required",
                    "required": true,
                    "error": "Please enter a value for this field",
                    "help": "Inline help text" ,
                    "field-help": {
                        "content": "Tooltip for a field in the Form Widget",
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    }
                },
                {
                    "element_text": true,
                    "id": "custom_pattern",
                    "name": "custom_pattern",
                    "label": "Custom Pattern",
                    "ua-help": "alias_for_ua_event_binding",
                    "placeholder": "1234",
                    "pattern": "^([0-9]){3,4}$",
                    "error": "Enter a number with 3 or 4 digits"
                },
                {
                    "element_email": true,
                    "id": "text_area",
                    "name": "text_email",
                    "label": "Text email",
                    "placeholder": "",
                    "required": true,
                    "error": "Please enter a valid email",
                    "value": "{{email}}"
                }
            ]
        }
    ],
}
```

**elements**
All elements have a set of parameters that is used by the widget form to generate the equivalent html code. For example, if the form widget has a configuration element like the following one:

```
{
    "element_text": true,
    "id": "text_field",
    "name": "text_feld",
    "label": "Text",
    "placeholder": "required",
    "required": true,
    "ua-help": "alias_for_ua_event_binding",
    "error": "Please enter a value for this field",
    "help": "Inline help text" ,
    "field-help": {
        "content": "Tooltip for a field in the Form Widget",
        "ua-help-identifier": "alias_for_title_ua_event_binding"
    },
    "value": ""
}
```

Then, the form widget will generate a html code like this one:

```
<div class="row">
    <!-- Label -->
        <div class="elementlabel left">
            <label for="remote_validation" class="left inline">Text</label>
            <span class="ua-field-help tooltip tooltipstered" data-ua-id="alias_for_title_ua_event_binding"></span>
        </div>
    <!-- Form element -->
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="validtext" id="text_field" name="text_feld" placeholder="required" required="" value="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a value for this field</small>
        <span class="inline-help help-style">Inline help text</span>
    </div>
</div>
```

The code above can be divided in:
1. The div container with row class. It groups all the element (includes the label and the field)
2. The div container with elementlabel class. It groups all label elements.
3. The div container with elementinput class. It groups the field elements including the error container.

The parameters required by each element are:

1.  **id**
    It represents the id of the input field and its located in the elementinput container.

2.  **name**
    It represents the name of the input field and its located in the elementinput container

3.  **label**
    It represents the label of the input field and its located in the elementlabel container.

4.  **placeholder**
    It is a short hint that describes the expected value of an input field and its located in the elementinput container

5.  **required**
    It hints user that the field is required by adding a * next to the field label (elementlabel container) and is also included as a data parameter of the field to be used during validation.

6.  **notshowrequired**
    It hides the * attribute from the label of the input. It is used the field should be required during validation, but user does not need to see a "*" next to the label.

7.  **ua_help**
    It provides an id to be used by user assistance. It is included in the in the elementlabel container.

8.  **error**
    It defines the message that will be showed to the user when the input value does not comply with the validation for that field. It is included in the in the elementinput container.

9.  **help**
    It is a message intended to help the user to complete the input field successfully. It is included in the in the elementinput container.

10.  **field-help**
    It is a hover message intended to help the user to complete the input field successfully. It has two parameters: content and ua-help-identifier. content parameter defines the content of the tooltip and ua-help-identifier parameter adds an alias for user assistance event binding. It is included in the in the elementlabel container.

11. **value**
    It represents the value that the field will render. It can be bind to a data model. It is included in the in the elementinput container.
    It should be represented as **"{{model_attribute}}"**, where propertyName is the name of the property that can be found in the conf.values object. For example, an email input can be defined as:

```
{
    "element_email": true,
    "id": "text_email",
    "name": "text_email",
    "label": "Text email",
    "placeholder": "",
    "disabled": true,
    "error": "Please enter a valid email",
    "value": "{{email}}"
},
```

while the conf.values could be:

```
{
        "email": "mvilitanga@gmail.com"
}
```

The model_attribute could also be represented in the dot notation. For example:

```
{
    "element_email": true,
    ...
    "value": "{{level1.level2.level3}}"
},
```

and the conf.values should be:

```
{
    "level1": {
        "level2": {
            "level3": "mvilitanga@gmail.com"
        }
    }
}
```
When the getValues method of the widget is called by requesting the Object output format, for example:

```
    formInstance.getValues(true)
```

then the output will be represented with the same hierarchy (Object) as the one used in the input (dot notation).

12. **initValue**
    It represents the default value that a field will render. It applies to the integrated widgets (like dropDown widget, datePicker widget, etc)  and the radio button and check box fields. The format to follow is similar to the one of the value property. For example, for the dropDown widget, a configuration like the following one:

```
{
    "element_dropdown": true,
    "id": "dropdown_field_2_s",
    "name": "dropdown_field_2_s",
    "label": "Dropdown Serialize",
    "required": true,
    "initValue": "{{dropDown_s.dropDown_s1.dropDown_s2.dropDown_s3}}",
    "data": [
        {
            "id": "ftp_s",
            "text": "junos-ftp"
        },
        {
            "id": "tftp_s",
            "text": "junos-tftp",
            "selected": true
        },
        {
            "id": "rtsp_s",
            "text": "junos-rtsp"
        },
        {
            "id": "netbios_s",
            "text": "junos-netbios-session"
        }
    ],
    "error": "Please make a selection"
},
```

should have a conf.values Object like the following:

```
{
    "dropDown_s": {
        "dropDown_s1": {
            "dropDown_s2": {
                "dropDown_s3": "ftp_s"
            }
        }
    }
}
```
In this case from the element_dropdown configuration, instead of tftp_s default selection in the drop down will be updated to ftp_s.

13. **disabled**
    It allows to disable an input if its value is set to true.
14. **hidden**
    It allows to hide an input if its value is set to true.
15. **post_validation**
    It represents the name of the custom event that will be triggered when a validation has been completed. Listeners of the custom event should implement a binding event handler. For example: $(el).bind(custom_event,function(){...});
16. **inlineLabels**
    It adds additional labels next to the form element that could be used to represent units, dimensions etc. It requires an array of objects. Each object should include the *value* parameter to assign a text to the label. Additionally, *class* and *id* are optional parameters. If *id* or *class* are not to be put then in that case, they should be put false or "". Else, they will take the id or class value of the field. For example:
    
        ```
            "inlineLabels":[{
                "id": false
                "value": "of 10"
            },{
                "id": "show_dims",
                "class": "show_dims",
                "value": "m/s"
            }]
        ```

17. **inlineLinks**
    It adds links next to the form element that could be used to open a form overlay and search for additional data. It requires an array of objects. Each object should include the id and the value parameters to assign an id and a label to the link. If *id* or *class* are not to be put then in that case, they should be put false or "". Else, they will take the id or class value of the field. For example:

    ```
        "inlineLinks":[{
            "id": "show_overlay",
            "value": "More"
        }]
    ```

18. **inlineIcons**
    It adds icons next to the form element that could be used to open a form overlay and search for additional data. It requires an array of objects. Each object should include the id and the class parameter to assign to the icon. The class should provide the image for the icon and any adjustment in the height and width. If *id* or *class* are not to be put then in that case, they should be put false or "". Else, they will take the id or class value of the field. For example:

    ```
        "inlineIcons":[{
                "class": "test-elementicon1",
                "id": "add-element-icon"
        }]
    ```

    There is an option to add 'label' next to the icon. Following is the example
    where 'Label' will be next to first icon and not second icon (since 'label' property is not defined) .
    ```
        "inlineIcons":[{
                 "icon": {
                           "default": {
                               icon_url: "#icon_inline_ok",
                               icon_class: "icon_inline_ok-dims"
                           },
                           "label": "Save" // label will shown next to icon
                       },
                       "id": "test-element-icon3"
                   },
                   {
                       "icon": {
                           "default": {
                               icon_url: "#icon_inline_cancel",
                               icon_class: "icon_inline_cancel-dims"
                           }
                       },
                       "id": "test-element-icon4"
                  }]
    ```

19. **inlineButtons**
    It adds buttons next to the form element that could be used to open a form overlay and search for additional data. It requires an array of objects. Each object should include the id, name, and value to be assigned to each button. The button is showed with the default Slipstream primary color (blue), if the isInactive is added and set to true, the the button will be showed with Slipstream secondary color (gray). If *id*, *class* or *name* are not to be put then in that case, they should be put false or "". Else, they will take the id, class or name value of the field, respectively. For example:

    ```
        "inlineButtons":[{
            "id": "input_button",
            "name": "input_button",
            "value": "Test"
        },{
            "id": "input_button1",
            "name": "input_button2",
            "value": "Test2",
            "isInactive": true
        }]
    ```

20. **disableAutocomplete**
    Set disableAutocomplete=true to disable the autocomplete feature of an input. Autocomplete will be enabled by default.
    This property can be configured to the whole form also, that will disable autocomplete feature for all the elements in this form.

21. **visibility**
    Defines elements (visibilityIds) that could be hidden or showed, enabled or disabled, required or not required based on the element value. The element can also be linked to another elements (linkedIds), so if all elements or some of them have an expected value, then the elements listed in the visibilityIds will be showed, enabled or required.
    The visibility property could be defined as a string, an array of element ids or an Object. In the case of string or array of strings, if the element validation passes, then the elements in the visibility property will be showed. Otherwise, it will be hidden. For more complex cases, the visibility property can be defined as an object that includes the followed properties:
    - **visibilityIds** a string, array of strings or a callback that defines the element ids that will be hidden or showed, enabled or disabled, required or not required based on the value of the element and the ones defined in the linkedIds property or based on the isExpectedValue callback. If a sectionId is defined in the visibilityIds property, then the section will be shown/hidden. 
    - **linkedIds** a string or array of strings or a callback that defines the element ids that this element is linked to before its visibilityIds elements are updated. The value doesn't need to match the ones defined by linkedIds configuration of the the elements defined in this property. It makes sense though if an element a is linked to element b, then element b should be linked to a.
    - **isExpectedValue** a callback that should return a boolean to indicate if the elements in visibilityIds property should be updated (showed/hidden, enabled/disabled or required/not required). It is invoked with the elementData parameter which is an array of objects with the following properties:
    - $el: jQuery Object of the element
    - value: value of the element
    - isValidValue: boolean that indicates id the element has passed the element validation (client side validation).
    If isExpectedValue is absent, then its value will default to the AND of all isValidValue property of the elements and its linkedIds.
    - **required** a boolean or a callback that defines if the visibilityIds elements will be updated to required in case it passes the validation of the elements and linkedIds elements or the isExpectedValue callback. Otherwise, it will keep them as not required. It assumes the elements that are going to be enabled/disabled are not hidden.
    The callback is invoked with the elementData parameter as described in the isExpectedValue property.
    - **disabled** a boolean or a callback that defines if the visibilityIds elements will be disabled in case it passes the validation of the elements and linkedIds elements or the isExpectedValue callback. It assumes the elements that are going to be disabled/enabled are not hidden.
    If required or disabled properties are absent, then the elements defined in visibilityIds will be showed/hidden. It assumes the visibilityIds are already hidden ("hidden": true).
    The callback is invoked with the elementData parameter as described in the isExpectedValue property.

    For example, the following configuration will allow to hide the array of elements defined in the visibilityIds property (for example: the element with id: "text_string_v_4_1","text_string_v_4_2") if the isExpectedValue callback returns true:

```
{
        "element_email": true,
        "id": "text_email_v_4",
        "name": "text_email_v_4",
        "label": "Email x ShowHide nxn",
        "error": "Please enter a valid email",
        "visibility": {
            "linkedIds": "text_url_v_1",
            "visibilityIds": ["text_string_v_4_1","text_string_v_4_2"],
            "isExpectedValue": function (data) {
                for (var i=0; i<data.length; i++){
                    var elementData = data[i];
                    if (!elementData.isValidValue || elementData.value=="test")
                        return false;
                }
                return true;
            }
        }
    },
    {
        "element_string": true,
        "id": "text_url_v_1",
        "name": "text_url_v_1",
        "label": "Text",
        "error": "Please enter a valid value",
        "visibility": {
            "linkedIds": "text_email_v_4",
            "visibilityIds": ["text_string_v_4_1","text_string_v_4_2"],
            "isExpectedValue": function (data) {
                for (var i=0; i<data.length; i++){
                    var elementData = data[i];
                    if (!elementData.isValidValue || elementData.value=="test")
                        return false;
                }
                return true;
            }
        },
        "help": "Do not use the word test if you want to show more elements"
    },
    {
        "element_string": true,
        "id": "text_string_v_4_1",
        "name": "text_string_v_4_1",
        "label": "Text email Show nxn 1",
        "error": "Please enter a valid value",
        "hidden": true
    },
    {
        "element_string": true,
        "id": "text_string_v_4_2",
        "name": "text_string_v_4_2",
        "label": "Text email Show nxn 2",
        "error": "Please enter a valid value",
        "hidden": true
    }
```

 The visibility property is available for any input element, element_dropdown, element_radio, element_checkbox and element_toggleButton. It is not available for the element_grid, element_tabContainer, element_slider and element_ipCidr.

22. **element_<*>**
    element_* stands for the type of elements that the form widget supports and they are described in the following paragraphs.

**element_text**. If it is set to true, the form widget will render an input element of type text and use "validtext" validation.  Validtext checks that input text is not null.

For example, if the element_text is included in the following object:

```
{
    "element_text": true,
    "id": "text_field",
    "name": "text_feld",
    "label": "Text",
    "placeholder": "required",
    "required": true,
    "ua-help": "alias_for_ua_event_binding",
    "error": "Please enter a value for this field",
    "help": "Inline help text" ,
    "field-help": {
        "content": "Tooltip for text field",
        "ua-help-identifier": "alias_for_title_ua_event_binding"
    },
    "value": ""
}
```

Then, the input field will be rendered as:

```
<div class="elementinput left">
    <!-- Input field -->
    <input type="text" data-validation="validtext" id="text_field" name="text_feld" placeholder="required" required="" value="">
    <!-- Error display -->
    <small class="error errorimage">Please enter a value for this field</small>
    <span class="inline-help help-style">Inline help text</span>
</div>
```

Additionally, the pattern parameter allows user to define a regex pattern and is supported by *element_text*. When it is added, the field validation will be tested against the user defined pattern.
Regex pattern can be as following types
- String: default type. Any backslash as part of regex pattern needs to be escaped by user. If backslash not escaped, the regex will not work as expected.
- Regex Object: with this type, either user can provide valid '/ regex /' OR 'new RegExp("regex")' notation.

For example, if the element_text is included in the following object with String type pattern:


```
{
    "element_text": true,
    "id": "custom_pattern",
    "name": "custom_pattern",
    "label": "Custom Pattern",
    "field-help": {
        "content": "Tooltip for a field in the Form Widget",
        "ua-help-identifier": "alias_for_title_ua_event_binding"
    },
    "placeholder": "1234",
    "pattern": "^([0-9]){3,4}$",
    "error": "Enter a number with 3 or 4 digits"
}
```

It will be rendered as:

```
<div class="elementinput left">
    <!-- Input field -->
    <input type="text" id="custom_pattern" name="custom_pattern" placeholder="1234" data-pattern="^([0-9]){3,4}$">
    <!-- Error display -->
    <small class="error errorimage">Enter a number with 3 or 4 digits</small>
    <span class="inline-help"></span>
</div>
```

Regex Pattern Example including the regex object in configuration


```
{
    "element_text": true,
    "id": "custom_pattern_regexObj",
    "name": "custom_pattern_regexObj",
    "label": "Custom Regex Object",
    "placeholder": "https://localhost",
    "pattern": /^(http(s?):[/][/])(www\.)?(\S)+$/,
   //"pattern": new RegExp("^(http(s?):[/][/])(www\\.)?(\\S)+$"),
    "error": "Enter valid url string"
}
```

It will be rendered as:

```
<div class="elementinput left">
    <!-- Input field -->
    <input type="text" id="custom_pattern_regexObj" name="custom_pattern_regexObj" placeholder="https://localhost" data-regexobj-pattern="/^(http(s?):[\/][\/])(www\.)?(\S)+$/">
    <!-- Error display -->
    <small class="error errorimage">Enter valid url string</small>
    <span class="inline-help"></span>
</div>
```

Additionally, the pattern parameter allows user to define a custom callback and is supported by all the element types except *element_file*, *element_fingerprint*, *element_multiple_error* and all integrated widgets. When it is added, the field validation will be tested against the user defined callback. In two of the cases in which this feature is supported, namely, *element_radio* and *element_checkbox*, the *inputValue* sent to the callback is in the form of a hash having *key* as the checkbox value and *value* as the checkbox selection (true if checked and false if unchecked). eg. {"option1":true, "option2": false, "option3": false}.
Please Note: asynchronous call is not supported within this callback. In order to make asynchronous calls, use *remote* configuration.
The remote validation and callback validation are exclusive.

For example, if our custom callback is this

```
var callbackValue = function (inputValue){

        if (inputValue == "Test Callback Value")
            return true;
        return {valid: false, error: "Callback Custom Error!"};
    };
```

for the following configuration:

```
{
    "element_text": true,
    "id": "custom_callback_Obj",
    "name": "custom_callback_Obj",
    "label": "Custom Callback",
    "class": "class1 class2  element_delete",
    "error": "Enter valid string",
    "callbackValidation": callbackValue,
    "inlineButtons":[{
        "id": "input_button2",
        "class": "input_button",
        "name": "input_button2",
        "value": "Test"
    }]
}
```

Pattern parameter is used to perform client side validation. If remote validation is required, then a remote configuration should be included. This works where only remote validation is used, as below, or, when used with element_multiple_error when both client and server side validation is needed. 

Following are the two ways to do remote validation-

1) *Remote Validation defined in an object*

If remote validation is required to be done using an object then an object is passed as value to the parameter "remote".
For example:

```
{
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
},
```

Where remote represents parameters required to do a REST API request. The expected response text should be true or false, but using the response parameter, the response can be reformatted. The remote object is composed by:
 - error: The error string to use if remote validation determines the input is invalid
 - url: a string that represents the REST API. In case the url needs to be composed by input data, a callback function can be defined instead of the URL string. The url callback function is invoked with the value of the element that needs validation.
- type: the type of request to make: "POST","GET","PUT", or "DELETE".
- headers: additional parameters required for the header of the url request. this parameter is optional.
- reponse: optional parameter and represents the callback function required to reformat the API response to comply, with the expected return value of 'true' or 'false'. The response callback function is invoked with two parameters: the status of the response and the response text. It is called once the API request is completed.
Finally, a custom event with a name composed by the "remote_" and the id of the element will be triggered with the true/false data if the value was valid or invalid.

2) *Remote Validation defined in a callback*

If remote validation is required to be done using an function callback then an a function is passed as value to the parameter "remote". For example:

```
{
    "element_text": true,
    ...
    "remote": remoteValidate,
    "error": true,
    ...
}
```

Where remote represents parameters required to do a REST API request. The expected response text should be true or false, but using the response parameter, the response can be reformatted. The remote object is composed by:
 - error: takes true in order to show the error message
 - remote: has a user defined function that takes two parameters namely the dom object and the response callback, that is called in order to make the rest api call and return the value of isValid as true/false to its callback function. Example of user defined function:
 
```
var remoteValidate = function (el, responsecallback){
        var url = "/api/form-test/remote-validation/callback/developer-new-generation/";
        url += el.value;
        $.ajax({
            url: url,
            complete: function (e, xhr, settings) {
                var errorMsg = "Developer's name is invalid, try some other name!";
                var isValid = e.responseText;
                responsecallback(isValid, errorMsg);
            }
        });
    };
```
responsecallback represents the callback function required to reformat the API response to comply, with the expected return value of 'true' or 'false'. The response callback function is invoked with two parameters: the response text and the error message. It should be called once the API request is completed.

**element_password**. If it is set to true, the form widget will render an input element of type password and use a "multiple" validation. Multiple validation checks if the input value is valid according to one or more criteria or pattern. The list of validations are available in the pattern-error parameter and are tested in the order in which the patterns are listed. Each pattern-error should have the pattern that needs to be validated, any additional data that the pattern might need, and the error message. The name of the patterns can be the same as the data-validation parameter listed for other elements. The error parameter in the root of the object should be marked as "true". "showPasswordStrength" parameter can be set as an object or boolean true to show the password strength meter below password element.

For example, if the element_password is included in the following object:

```
{
    "element_password": true,
    "id": "password_pattern",
    "name": "password_pattern",
    "label": "Password Pattern",
    "placeholder": "Sp0g-Sp0g",
    "required": true,
    "notshowrequired": true,
    "pattern-error": [
        {
            "pattern": "length",
            "min_length":"6",
            "max_length":"8",
            "error": "Must be 6 characters or more."
        },
        {
            "pattern": "hasnumbersymbol",
            "error": "At least one number and one symbol is required."
        },
        {
            "pattern": "hasmixedcasenumber",
            "error": "A combination of mixed case letters and one number is required."
        },
        {
            "pattern": "hasmixedcasesymbol",
            "error": "A combination of mixed case letters and one symbol is required."
        },
        {
            "pattern": "hassymbol",
            "error": "At least one symbol is required."
        },
        {
            "pattern": "hasnumber",
            "error": "At least one number is required."
        },   {
            "pattern": "hasmixedcase",
            "error": "A combination of mixed case letters is required."
        },
        {
            "pattern": "validtext",
            "error": "A combination of mixed case letters, numbers, and symbols is required."
        }
    ],
    "error": true,
    "help": "Must be 6 characters or more. A combination of mixed case letters, numbers, and symbols is required."
}
```

Then, the input field will be rendered as:

```
<div class="elementinput left">
    <!-- Input field -->
    <input type="password" data-validation="multiple" data-validation_length="Must be 6 characters or more." data-minlength="6" data-maxlength="8" data-validation_hasnumbersymbol="At least one number and one symbol is required." data-validation_hasmixedcasenumber="A combination of mixed case letters and one number is required." data-validation_hasmixedcasesymbol="A combination of mixed case letters and one symbol is required." data-validation_hassymbol="At least one symbol is required." data-validation_hasnumber="At least one number is required." data-validation_hasmixedcase="A combination of mixed case letters is required." data-validation_validtext="A combination of mixed case letters, numbers, and symbols is required." id="password_pattern" name="password_pattern" placeholder="Sp0g-Sp0g" required="">
    <!-- Error display -->
    <small class="error errorimage">true</small>
    <span class="inline-help help-style">Must be 6 characters or more. A combination of mixed case letters, numbers, and symbols is required.</span>
</div>
```

Additionally, an element_password can use a simple validation to check if the input value is the same as other input password field ("dependency" parameter that has the id of the other input password field).

In this case, the element_password is included in the following object:

```
{
    "element_password": true,
    "id": "confirm_password_pattern",
    "name": "confirm_password_pattern",
    "label": "Confirm Password",
    "placeholder": "Sp0g-Sp0g",
    "required": true,
    "notshowrequired": true,
    "dependency": "password_pattern",
    "error": "Passwords must match"
}
```

It will be rendered as:


```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="password" data-validation="multiple" id="confirm_password_pattern" name="confirm_password_pattern" placeholder="Sp0g-Sp0g" required="" data-equalto="password_pattern">
        <!-- Error display -->
        <small class="error errorimage">Passwords must match</small>
        <span class="inline-help"></span>
    </div>
```

**showPasswordStrength configuration parameter for element_password**

If this parameter is set as an object or set to true, it will show the password-strength bar below the element_password. The rules and score to show the password-strength can be configured and passed with the object. If 'showPasswordStrength' is set to true, the default configuration parameters (progress-bar style, rules and score) and password-strength meter style from 'pwstrength' library will be used.


The pwStrength library expects configuration to follow this structure:

options = {
    common: {},
    rules: {},
    ui: {}
};

** The configuration for each section **

common: (common configuration options)

minChar: 6 (default) Use this option to set the minimum required characters to consider the password as weak.
onLoad: callback when password-strength meter is created. No argument is passed.
onKeyUp: callback to listen when user types the password. Keyup event will be passed as first argument and an object will be passed as second argument. The object will consist of score and verdict text (weak, good, strong) 

ui: (configuration options related to user interface)

showProgressBar: true (default). If set to true, the password-strength meter will be shown for given element.
verdicts: The text to be displayed based on the score of password-strength meter. For example,  [Weakest, weak, good, strong, strongest]. the array should be of 5 elements to show different strength categories.
showVerdicts: true (default). The verdicts in above configuration will be shown if this option is set to true.
useVerdictCssClass: false (default). If set to true, a css class will be added to each verdict. This class can be used to assign different color or styling to each verdict text.
viewports: An object to specify different div to show the elements of the password-strength meter. Each one can be a CSS selector or a DOM node reference.
for example,

```
viewports: {
      "progress":'.progress-location', (selector for password-strength meter)
      "verdict": '.verdict-location', (selector to show the verdicts)
    }

```
To follow the password-strength meter styling supported by form, the 'ui' option in above object has to be configured like this:

```
ui: {   
    "showProgressBar": true,
    "useVerdictCssClass": true,
    "verdicts": ["Weak", "Weak", "Good", "Good", "Strong"],
    "viewports": {
        "progress":'.progress-location',
        "verdict": '.verdict-location'
    } 
}

```

rules: (configuration options for validation rules)

extra: {} (default). An object in which custom rules functions can be created.
scores: Score for calculating the password strength. 
Default scores for the rules are:
      
   {
      wordNotEmail: -100,
      wordLength: -50,
      wordSimilarToUsername: -100,
      wordSequences: -50,
      wordTwoCharacterClasses: 2,
      wordRepetitions: -25,
      wordLowercase: 1,
      wordUppercase: 3,
      wordOneNumber: 3,
      wordThreeNumbers: 5,
      wordOneSpecialChar: 3,
      wordTwoSpecialChar: 5,
      wordUpperLowerCombo: 2,
      wordLetterNumberCombo: 2,
      wordLetterNumberCharCombo: 2
    }

activated: An object in which all the validation rules can be activated.
default set of active rules are:
    
    {
      wordNotEmail: true,
      wordLength: true,
      wordSimilarToUsername: true,
      wordSequences: true,
      wordTwoCharacterClasses: false,
      wordRepetitions: false,
      wordLowercase: true,
      wordUppercase: true,
      wordOneNumber: true,
      wordThreeNumbers: true,
      wordOneSpecialChar: true,
      wordTwoSpecialChar: true,
      wordUpperLowerCombo: true,
      wordLetterNumberCombo: true,
      wordLetterNumberCharCombo: true
    }
        


Example configuration object:

```

var options = {
    ui: {   
            "showProgressBar": true,
            "useVerdictCssClass": true,
            "verdicts": ["Weak", "Weak", "Good", "Good", "Strong"],
            "viewports": {
                "progress":'.progress-location',
                "verdict": '.verdict-location'
            } 
        }

    rules: {
        "extra": {
            oneLowerCase: function(options, word, score) {
                if(!word.match(/(?=.*[a-z])/)) {
                    return score;
                }
                return 0;
            }
        },
        "activated": {
            "oneLowerCase": true
        },
        "score": {
            "oneLowerCase": 5
        }
    }
}

```

The password-strength bar which will use the above settings can be integrated in the form using this configuration:

```

{
    "element_password": true,
    "id": "confirm_password_pattern",
    "name": "confirm_password_pattern",
    "label": "Confirm Password",
    "placeholder": "Sp0g-Sp0g",
    "required": true,
    "notshowrequired": true,
    "dependency": "password_pattern",
    "error": "Passwords must match",
    "showPasswordStrength": options
}

```

**element_multiple_error**. If it is set to true, the form widget will render an input element of type text and use a "multiple" validation. Multiple validation checks if the input value is valid according to one or more criteria or pattern. The list of validations are available in the pattern-error parameter and are tested in the order in which the patterns are listed. Each pattern-error should have the pattern that needs to be validated, any additional data that the pattern might need, and the error message. The name of the patterns can be the same as the data-validation parameter listed for other elements. The error parameter in the root of the object should be marked as "true".
                            User can also provide multiple regex patterns including 'String' and 'regex Object' type. Patterns will be executed as first come basis from the configuration. 'regexId' is mandatory unique attribute while defining regex patterns. If the regex returns false, an error wil be shown just below the element.

For example, if the element_password is included in the following object:

```
{
    "element_multiple_error": true,
    "id": "username",
    "name": "username",
    "label": "Multiple error",
    "pattern-error": [
        {
            "pattern": "hasnotsymbol",
            "error": "Must not include a symbol."
        },
        {
            "pattern": "hasnotspace",
            "error": "Must not include a space."
        },
        {
            "regexId":"regex1",
            "pattern": "^([a-zA-Z0-9_]){3,10}$",
            "error": "Must be alphanumeric with 3 to 10 characters."
        },
        {
            "regexId":"regex2",
            "pattern": "^[_]{1}",
            "error": "Must begin with underscore"
        }
    ],
    "error": true
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
    <!-- Input field -->
        <input type="text" data-validation="multiple" data-validation_hasnotsymbol="Must not include a symbol." data-validation_hasnotspace="Must not include a space." id="username" name="username">
        <!-- Error display -->
        <small class="error errorimage">true</small>
        <span class="inline-help"></span>
    </div>
```

**element_email**. If it is set to true, the form widget will render an input element of type email and use a "email" validation. Email validation checks if the input value is a valid email.

For example, if the element_email is included in the following object:

```
{
    "element_email": true,
    "id": "text_area",
    "name": "text_email",
    "label": "Text email",
    "placeholder": "",
    "required": true,
    "error": "Please enter a valid email",
    "value": "{{email}}"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="email" data-validation="email" id="text_area" name="text_email" placeholder="" required="" value="mvilitanga@gmail.com">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid email</small>
        <span class="inline-help"></span>
    </div>
```

**element_url**. If it is set to true, the form widget will render an input element of type url and use "url" validation. Url validation checks if the input value is a valid url.

For example, if the element_url is included in the following object:

```
{
    "element_url": true,
    "id": "text_url",
    "name": "text_url",
    "label": "Text url",
    "placeholder": "http://www.juniper.net",
    "error": "Please enter a valid URL",
    "value": "{{url}}"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="url" data-validation="url" id="text_url" name="text_url" placeholder="http://www.juniper.net" value="www.gmail.com">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid URL</small>
        <span class="inline-help"></span>
    </div>
```

**element_string**. If it is set to true, the form widget will render an input element of type text and use  a"string" validation. String validation checks if the input value is a string that contains only letters (a-zA-Z).

For example, if the element_string is included in the following object:

```
{
    "element_string": true,
    "id": "text_string",
    "name": "text_string",
    "label": "Text string",
    "placeholder": "",
    "error": "Please enter a valid string that contains only letters (a-zA-Z)",
    "value": "{{text}}"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="alpha" id="text_string" name="text_string" placeholder="" value="Sample Form Widget">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid string that contains only letters (a-zA-Z)</small>
        <span class="inline-help"></span>
    </div>
```

**element_number**. If it is set to true, the form widget will render an input element of type text and use a "number" validation. Number validation checks if the input value is a string that only contains numbers. Additionally, the validation could test that the value is bigger than a minimun number and/or smaller than a maximum number. Also, user can turn off number stepper by setting *numberStepper* property to false, by default, it is set to true.
When the *numberStepper* is set to true, the buttons can be used to increase/decrease the number by the step of 1.
For example, if the element_number is included in the following object:

```
{
    "element_number": true,
    "id": "text_number",
    "name": "text_number",
    "label": "Text number",
    "min_value":"2",
    "max_value":"8",
    "placeholder": "",
    "numberStepper": true,
    "error": "Please enter a number between 2 and 8"
},
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <div data-widget="numberStepper"><span class="numberStepper-widget">
            <span class="ui-spinner ui-widget ui-widget-content ui-corner-all">
                <input type="text" class="number-stepper ui-spinner-input" data-widget="numberStepper" data-validation="number" min="2" max="8" id="text_number" name="text_number" placeholder="" autofocus="" aria-valuemin="2" aria-valuemax="8" autocomplete="off" role="spinbutton">
                <a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false">
                    <span class="ui-button-text">
                        <span class="ui-icon ui-icon-triangle-1-n">▲</span>
                    </span>
                </a>
                <a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false">
                    <span class="ui-button-text">
                        <span class="ui-icon ui-icon-triangle-1-s">▼</span>
                    </span>
                </a>
            </span>
    </span>
    </div>
    <!-- Error-UA display -->
    <small class="error errorimage">Please enter a number between 2 and 8</small>
    <span class="inline-help"></span>
```

**element_alphanumeric**. If it is set to true, the form widget will render an input element of type text and use a "alphanumeric" validation. Alphanumeric validation checks if the input value is a string that only contains letters and numbers.

For example, if the element_alphanumeric is included in the following object:

```
{
    "element_alphanumeric": true,
    "id": "text_alphanumeric",
    "name": "text_alphanumeric",
    "label": "Text alphanumeric",
    "placeholder": "",
    "error": "Please enter a string that contains only letters and numbers"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="alphanumeric" id="text_alphanumeric" name="text_alphanumeric" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a string that contains only letters and numbers</small>
        <span class="inline-help"></span>
    </div>
```

**element_hexadecimal**. If it is set to true, the form widget will render an input element of type text and use a "hexadecimal" validation. Hexadecimal validation checks if the input value is a hexadecimal number.

For example, if the element_hexadecimal is included in the following object:

```
{
    "element_hexadecimal": true,
    "id": "text_hexadecimal",
    "name": "text_hexadecimal",
    "label": "Text hexadecimal",
    "placeholder": "",
    "error": "Please enter a valid hexadecimal number"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="hexadecimal" id="text_hexadecimal" name="text_hexadecimal" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid hexadecimal number</small>
        <span class="inline-help"></span>
    </div>
```


**element_color**. If it is set to true, the form widget will render an input element of type text and use a "color" validation. Color validation checks if the input value is a hexadecimal color.

For example, if the element_color is included in the following object:

```
{
    "element_color": true,
    "id": "text_color",
    "name": "text_color",
    "label": "Text color",
    "placeholder": "",
    "error": "Please enter a valid hexadecimal color"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="color" id="text_color" name="text_color" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid hexadecimal color</small>
        <span class="inline-help"></span>
    </div>
```

**element_lowercase**. If it is set to true, the form widget will render an input element of type text and use a "lowercase" validation. Lowercase validation checks if the input value is a string in lowercase.

For example, if the element_lowercase is included in the following object:

```
{
    "element_lowercase": true,
    "id": "text_lowercase",
    "name": "text_lowercase",
    "label": "Text lowercase",
    "placeholder": "",
    "error": "Please enter a valid string in lowercase"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="lowercase" id="text_lowercase" name="text_lowercase" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid string in lowercase</small>
        <span class="inline-help"></span>
    </div>
```

**element_uppercase**. If it is set to true, the form widget will render an input element of type text and use a "uppercase" validation. Uppercase validation checks if the input value is a string in uppercase.

For example, if the element_uppercase is included in the following object:

```
{
    "element_uppercase": true,
    "id": "text_uppercase",
    "name": "text_uppercase",
    "label": "Text uppercase",
    "placeholder": "",
    "error": "Please enter a valid string in uppercase"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="uppercase" id="text_uppercase" name="text_uppercase" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid string in uppercase</small>
        <span class="inline-help"></span>
    </div>
```

**element_integer**. If it is set to true, the form widget will render an input element of type text and use a "integer" validation. Integer validation checks if the input value is an integer number.

For example, if the element_integer is included in the following object:

```
{
    "element_integer": true,
    "id": "text_integer",
    "name": "text_integer",
    "label": "Text integer",
    "placeholder": "",
    "error": "Please enter a valid integer"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
         <!-- Input field -->
         <input type="text" data-validation="integer" id="text_integer" name="text_integer" placeholder="">
         <!-- Error display -->
         <small class="error errorimage">Please enter a valid integer</small>
         <span class="inline-help"></span>
     </div>
```

**element_float**. If it is set to true, the form widget will render an input element of type text and use a "float" validation. User has an option to enable the number stepper by setting *numberStepper* property true. By default, it is false. User can also give the *min_value* and *max_value* of the float input. Float validation checks if the input value is an float number.
When the *numberStepper* is set to true, the buttons can be used to increase/decrease the number by the step of 0.1.
For example, if the element_integer is included in the following object:

```
{
    "element_float": true,
    "id": "text_float",
    "name": "text_float",
    "label": "Text float",
    "min_value":"2.00",
    "max_value":"5.25",
    "placeholder": "",
    "error": "Please enter a valid float"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="float" id="text_float" name="text_float" placeholder="" min="2.00" max="5.25">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid float</small>
        <span class="inline-help"></span>
    </div>
```

**element_divisible**. If it is set to true, the form widget will render an input element of type text and use a "divisible" validation. Divisible validation checks if the input value is a number that's divisible by another number. The value of the divisor is added using the parameter "divisible_by".

For example, if the element_divisible is included in the following object:

```
{
    "element_divisible": true,
    "divisible_by":"5",
    "id": "text_divisible",
    "name": "text_divisible",
    "label": "Text divisible",
    "placeholder": "",
    "error": "Please enter a number that is divisible by 5"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="divisible" data-divisibleby="5" id="text_divisible" name="text_divisible" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a number that is divisible by 5</small>
        <span class="inline-help"></span>
    </div>
```

**element_length**. If it is set to true, the form widget will render an input element of type text and use a "length" validation. Length validation checks if the input value's length falls in a range. The value of the minimum length is added using the parameter "min_length" and the value of the maximum length is added using the "max_length" parameter.

For example, if the element_length is included in the following object:

```
{
    "element_length": true,
    "min_length":"2",
    "max_length":"5",
    "id": "text_length",
    "name": "text_length",
    "label": "Text length",
    "placeholder": "",
    "error": "Please enter a string that is greater than or equal to 2 but less than or equal to 5"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="length" data-minlength="2" data-maxlength="5" id="text_length" name="text_length" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a string that is greater than or equal to 2 but less than or equal to 5</small>
        <span class="inline-help" style="display: none;"></span>
    </div>
```

**element_date**. If it is set to true, the form widget will render an input element of type date and use a "date" validation. Date validation checks if the input value is a date.

For example, if the element_date is included in the following object:

```
{
   "element_date": true,
   "id": "text_date",
   "name": "text_date",
   "label": "Text date",
   "placeholder": "",
   "error": "Please enter a valid date"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="date" data-validation="date" id="text_date" name="text_date" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid date</small>
        <span class="inline-help"></span>
    </div>
```

**element_afterdate**. If it is set to true, the form widget will render an input element of type date and use a "afterdate" validation. Afterdate validation checks if the input value is a date that is after the specified date (defaults to now). The value of the after date is added using the "after_date" parameter.

For example, if the element_afterdate is included in the following object:

```
{
    "element_afterdate": true,
    "after_date":"05/28/2014",
    "id": "text_afterdate",
    "name": "text_afterdate",
    "label": "Text afterdate",
    "placeholder": "",
    "error": "Please enter a date after May 28, 2014"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="date" data-validation="afterdate" data-afterdate="05/28/2014" id="text_afterdate" name="text_afterdate" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a date after May 28, 2014</small>
        <span class="inline-help"></span>
    </div>
```

**element_beforedate**. If it is set to true, the form widget will render an input element of type date and use a "beforedate" validation. Beforedate validation checks if the input value is a date that is before the specified date (defaults to now). The value of the before date is added using the "before_date" parameter.

For example, if the element_beforedate is included in the following object:

```
{
    "element_beforedate": true,
    "before_date":"06/20/2014",
    "id": "text_beforedate",
    "name": "text_beforedate",
    "label": "Text beforedate",
    "placeholder": "",
    "error": "Please enter a date before June 20, 2014"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="date" data-validation="beforedate" data-beforedate="06/20/2014" id="text_beforedate" name="text_beforedate" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a date before June 20, 2014</small>
        <span class="inline-help"></span>
    </div>
```

**element_time**. If it is set to true, the form widget will render an input element of type time and use a "time" validation. Time validation checks if the input value is a valid time either if it is in the 24 hours or 12 hours format.

For example, if the element_time is included in the following object:

```
{
    "element_time": true,
    "id": "text_time",
    "name": "text_time",
    "label": "Text time",
    "placeholder": "",
    "error": "Please enter a valid time"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="time" data-validation="time" id="text_time" name="text_time" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid time</small>
        <span class="inline-help"></span>
    </div>
```

**element_inarray**. If it is set to true, the form widget will render an input element of type text and use a "inarray" validation. Inarray validation checks if the input value is in a array of allowed values. The allowed values are added using the "values" parameter.

For example, if the element_inarray is included in the following object:

```
{
    "element_inarray": true,
    "id": "text_inarray",
    "name": "text_inarray",
    "label": "Text inarray",
    "placeholder": "",
    "values": [
        {"value": "4"},
        {"value": "5"},
        {"value": "6"}
    ],
    "error": "Please enter one of the allowed values: 4, 5 or 6"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
    <!-- Input field -->
        <input type="text" data-validation="inarray" data-array="4,5,6," id="text_inarray" name="text_inarray" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter one of the allowed values: 4, 5 or 6</small>
        <span class="inline-help" style="display: none;"></span>
    </div>
```

**element_creditcard**. If it is set to true, the form widget will render an input element of type text and use a "creditcard" validation. Creditcard validation checks if the input value is a credit card number.

For example, if the element_creditcard is included in the following object:

```
{
    "element_creditcard": true,
    "id": "text_creditcard",
    "name": "text_creditcard",
    "label": "Text creditcard",
    "placeholder": "",
    "error": "Please enter a valid credit card"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
    <!-- Input field -->
        <input type="text" data-validation="creditcard" id="text_creditcard" name="text_creditcard" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid credit card</small>
        <span class="inline-help"></span>
    </div>
```

**element_ip**. If it is set to true, the form widget will render an input element of type text and use an "ip" validation. Ip validation checks if the input value is a valid IP address (version 4 or 6). The version is added using the "ip_version" parameter: "4" for version 4 and "6" for version 6.

For example, if the element_ip is included in the following object:

```
{
    "element_ip": true,
    "ip_version": "4",
    "id": "text_ip",
    "name": "text_ip",
    "label": "Text ip",
    "placeholder": "",
    "error": "Please enter a valid IP address version 4"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" data-validation="ip" data-ipversion="4" id="text_ip" name="text_ip" placeholder="">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid IP address version 4</small>
        <span class="inline-help"></span>
    </div>
```

**element_textarea**. If it is set to true, the form widget will render a textarea element. It has the parameters:
- id: if of the texarea
- name: name of the texarea
- label: label showed at the left of the text area
- required: if it is set to true, the text area will be a required field
- pattern: defines a regex that can be used to validate the value of the text area. Regex value can be configured of type 'String' and valid 'regex Object'. if the regex returns false, an error wil be showed below the text area.
- rows: defines the number of rows (height) that the text area should show. Default value is 2 rows.
- placeholder: ghost text showed on the text area
- error: message that will be showed below the text area for a required or pattern specific text area
- value: default value for the text area
- post_validation: custom event that could be triggered after the validation is completed.

For example, if the element_textarea is included in the following object:

```
{
    "element_textarea": true,
    "id": "text_area",
    "name": "text_area",
    "label": "Textarea",
    "pattern": "^([0-9]){3,4}$",
    "required": true,
    "placeholder": "",
    "error": "Enter a number with 3 or 4 digits",
    "post_validation": "validTextarea"
}
```

Then, the text area field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <textarea data-validation="validtext" id="text_area" name="text_area" placeholder="" required="" data-pattern="^([0-9]){3,4}$"></textarea>
        <!-- Error-UA display -->
        <small class="error errorimage">Enter a number with 3 or 4 digits</small>
        <span class="inline-help"></span>
    </div>
```

To listen for the post validation event, the user of the widget could bind the element that has the post_validation property and provide a callback function that will have the event and the isValid parameters. The isValid parameter will be true if the value was valid (element validation) or false otherwise. For example:

```
    this.$el.find('#text_area').bind("validTextarea", function(e, isValid){
        console.log("the validation was completed and the result is: " + isValid);
    });
```

**element_description**. If it is set to true, the form widget will render a label element along with with the HTML tags rendered. No validation is available.

For example, if the element_description is included in the following object:

```
{
    "element_description": true,
    "label": "Description",
    "value": "Description"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <span>
            <label>Description</label>
        </span>
        <!-- Error display -->
        <span class="inline-help"></span>
    </div>
```

**element_description_encode**. If it is set to true, the form widget will render a label element with the value as is, not rendering the html tags. There are no validation available.

For example, if the element_description_encode is included in the following object:

```
{
    "element_description_encode": true,
    "label": "Description Encode",
    "value": "Description <b>Encode</b>"
}
```

Then, the input field will be rendered as:


```
    <div class="elementinput left">
        <!-- Input field -->
        <span>
            <label>Description <b>Encode</b></label>
        </span>
        <!-- Error display -->
        <span class="inline-help"></span>
    </div>
```

**element_checkbox**. If it is set to true, the form widget will render an input element of type checkbox for each of its values objects ("values" parameter). Required field validation is available. The name of each value should be the same and it should match the id of the element.

For example, if the element_checkbox is included in the following object:

```
{
    "element_checkbox": true,
    "id": "enable_disable ",
    "label": "Checkbox",
    "required": true,
    "values":[
        {
            "id": "checkbox_enable",
            "name": "enable_disable",
            "label": "Option 1",
            "value": "enable",
            "checked": true,
            "visibility": "show_hide_element0"

        },
        {
            "id": "checkbox_disable",
            "name": "enable_disable",
            "label": "Option 2",
            "value": "disable"
        }
    ],
    "error": "Please make a selection"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left elementgroup" data-widget="checkBox" id="enable_disable">
        <!-- Input field -->
        <div class="optionselection">
            <input type="checkbox" data-validation="validtext" id="checkbox_enable" name="enable_disable" value="enable" checked="" required="">
            <label for="checkbox_enable">Option 1</label>
        </div>
        <div class="optionselection">
            <input type="checkbox" data-validation="validtext" id="checkbox_disable" name="enable_disable" value="disable" required="">
            <label for="checkbox_disable">Option 2</label>
        </div>
        <!-- Error display -->
        <small class="error errorimage">Please make a selection</small>
        <span class="inline-help"></span>
        </div>
    </div>
```

The values property of the element_checkbox could include an object with the visibility property. In this case, the visibility property could be a string or an array of strings with all the elements ids that should be showed if the value gets selected. So, for the example above, if the user check on Option 1(id: checkbox_enable), then the form element with id: show_hide_element0 will be showed. If it is unselected, then the element will be hidden. The show_hide_element0 should have been defined like the following:

```
    {
        "element_string": true,
        "id": "show_hide_element0",
        "name": "show_hide_element0",
        "label": "Show Hide 0",
        "hidden": true
    },
```

The visibility property can also be defined as an Object and include additional configuration like callbacks for the expected value, elements that can be disabled or make them required. Details of this object can be found in the elements section of this document.

**element_radio**. If it is set to true, the form widget will render an input element of type radio for each of its values objects ("values" parameter). Required field validation is available. The name of each value should be the same and it should match the id of the element.

For example, if the element_radio is included in the following object:

```
{
    "element_radio": true,
    "id": "radio_field",
    "label": "Radio Buttons",
    "required": true,
    "values": [
        {
            "id": "radio1",
            "name": "radio_button",
            "label": "Option 1",
            "value": "option1",
            "visibility": ["show_hide_element31","show_hide_element32"]
        },
        {
            "id": "radio2",
            "name": "radio_button",
            "label": "Option 2",
            "value": "option2"
        }
    ],
    "help": "Radio Buttons help text",
    "error": "Please make a selection"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <div class="optionselection">
            <input type="radio" data-validation="validtext" id="radio1" name="radio_button" value="option1" required="">
            <label for="radio1">Option 1</label>
        </div>
        <div class="optionselection">
            <input type="radio" data-validation="validtext" id="radio2" name="radio_button" value="option2" required="">
            <label for="radio2">Option 2</label>
        </div>
        <!-- Error display -->
        <small class="error errorimage">Please make a selection</small>
        <span class="inline-help help-style">Radio Buttons help text</span>
    </div>
```

The values property of the element_radio could include an object with the visibility property. In this case, the visibility property could be a string or an array of strings with all the elements ids that should be showed if the value gets selected. So, for the example above, if the user check on Option 1(id: radio1), then the form element with ids: show_hide_element31 and show_hide_element32 will be showed. If it is unselected, then the element will be hidden. The show_hide_element31 (and show_hide_element32)  should have been defined like the following:

```
   {
        "element_string": true,
        "id": "show_hide_element32",
        "name": "show_hide_element32",
        "label": "Show Hide 22",
        "hidden": true
    },
```

The visibility property can also be defined as an Object and include additional configuration like callbacks for the expected value, elements that can be disabled or make them required. Details of this object can be found in the elements section of this document.

**element_dropdown**. If it is set to true, the form widget will render a select element with the option elements representing the element's possible options (data" parameter). Required field validation is available.

For example, the element_dropdown can be defined with the following Object:

``` javacript
{
    "element_dropdown": true,
    "id": "dropdown_field",
    "name": "dropdown_field",
    "label": "Dropdown",
    "required": true,
    "data": [
        {
            "id": "ftp",
            "text": "junos-ftp",
            "visibility": "show_hide_element"
        },
        {
            "id": "tftp",
            "text": "junos-tftp",
            "disabled": true
        },
        {
            "id": "rtsp",
            "text": "junos-rtsp"
        },
        {
            "id": "netbios",
            "text": "junos-netbios-session"
        }
    ],
    "help": "Dropdown help text",
    "error": "Please make a selection"
}
```

The visibility property can also be defined as an Object and include additional configuration like callbacks for the expected value, elements that can be disabled or make them required. Details of this object can be found in the elements section of this document.

Then, the form element will be rendered as a select element and its html markup is generated using the dropDown widget.

The drop down element has properties common to other form elements like id, class, label, name, field-help, error, inlineLinks, inlineIcons, inlineButtons, and help. Other properties are specific to the dropDown widget. More details about the drop down configuration and methods can be found at:

[Drop Down Widget](public/assets/js/widgets/dropDown/dropDown.md)

The data property could include an object with the visibility property. It allows to show an element based on a dropdown selection. It could be a string or an array of strings with all the form element ids that needs to be showed/hide. For example, for the configuration above, if the form includes the show_hide_element like in the following configuration:

```
    {
        "element_string": true,
        "id": "show_hide_element",
        "name": "show_hide_element",
        "label": "Show Hide",
        "hidden": true
    },
```

If the user select junos-ftp in the dropdown, then the row in the form (label and input) with an element with id show_hide_element will be showed. If the user change the selection, then the element will be hidden. The feature is available for simple selection of the dropdown widget.

Finally, the values parameter of the dropdown widget will be deprecated. Instead, it is recommended to use the data property which is defined by a set of id/text instead of the set of value/label pairs defined with the values parameter. The same format id/text is used in the dropDown widget for remoteData and  initValue properties and for the template callback.

initValue can be represented as an Object (id/text) or a simple string. The value of the id or the string will be the one used to select an element.

**element_file**. If it is set to true, the form widget will render a file element. Required field validation is available.

For example, if the element_file is included in the following object:

```
{
    "element_file": true,
    "id": "text_file",
    "name": "text_file",
    "label": "File Upload",
    "required": true,
    "placeholder": "",
    "fileupload_button_label": "Browse",
    "error": "Please select a valid file"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
    <!-- Input field -->
        <div class="fileupload_container">
            <input type="text" class="fileupload-text" disabled="disabled" id="text_file" name="text_file" placeholder required>
            <span class="slipstream-primary-button fileupload-button">Browse</span>
            <input type="file" class="fileupload">
        </div>
        <!-- Error display -->
        <small class="error errorimage">Please select a valid file</small>
        <span class="inline-help"></span>
    </div>
```


**element_fingerprint**. If it is set to true, the form widget will render an input element of type text and use a "fingerprint" validation. Fingerprint validation checks if the input value is a valid SSH public key fingerprint ( Example: 4a:a7:b6:f1:87:cd:bd:c3:4c:6d:1d:2f:9a:e4:32:8b ).

For example, if the element_fingerprint is included in the following object:

```
{
	"element_fingerprint": true,
    "id": "text_fingerprint",
    "name": "text_fingerprint",
    "label": "Text fingerprint",
    "placeholder": "",
    "error": "Please enter a valid fingerprint"
}
```

Then, the input field will be rendered as:

```
    <div class="elementinput left">
        <!-- Input field -->
        <input type="text" placeholder="" name="text_fingerprint" id="text_fingerprint" data-validation="fingerprint">
        <!-- Error display -->
        <small class="error errorimage">Please enter a valid fingerprint</small>
        <span class="inline-help"></span>
    </div>
```


#### Buttons
The buttons section is composed by two set of elements: parameters and the buttons array.

The available parameters are:

**buttonsClass**.
The class or classes assigned to the row that contains the buttons.

**unlabeled**.
If unlabeled attribute is set to true, then the buttons will be align to the left. If unlabeled is not added in the configuration object, then the buttons will be shown in the input column.

**buttonsAlignedRight**.
If buttonsAlignedRight attribute is set to true, then the buttons will be align to the right.

**cancel_link**
Adds a cancel link next to the buttons. It requires the id and value parameters which represent the id and the label of the link. For example:

```
    "cancel_link": {
        "id": "cancel_form",
        "value": "Cancel"
    },
```

**buttons**
The buttons array represent the set of buttons that will be showed at the end of the form. It's composed by a set of button objects with id, name and value. An optional parameter **isInactive** allows to set the background of the button to an inactive color. An optional parameter **onSubmit** when given a callback, will show a spinner on submit if client validation passes. This callback will take three parameters, *data* which is all the values of the form, *success* which is a success callback and *error* which is an error callback. The spinner will wait for server side call to return a success or error. If it is a success, the success callback is executed which will remove the spinner. If it is an error, then the error callback is executed with the error message. This error message will show up at the top of the form. In case of form on overlay, application user is responsible to destroy the overlay after the callback returns value. An example submitCallback can be defined as follows:

```
var submitCallback1 = function(data, success, error){
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

```

For example, if the buttons section has the following configuration:

```
    "unlabeled":"true",
    "buttons": [
        {
            "id": "update",
            "name": "update",
            "value": "Update"
        }
    ]
```

Then, the buttons section will be rendered as:

```
    <div class="row">
        <div class="elementinput left">
            <input type="submit" class="button" id="update" name="update" value="Update">
        </div>
    </div>
```


##### Footer
The footer section is composed by a text, url and id that will be presented at the end of the form.

For example, if the buttons section has the following configuration:

```
    "footer": [
        {
            "text":"By setting the root password I accept the terms of the ",
            "url":"License Agreement",
            "id":"login_agreement"
        }
    ]
```

Then, the footer section will be rendered as:

```
    <div class="row">
        <div class="footer">
            <h6>By setting the root password I accept the terms of the
                    <a id="login_agreement">License Agreement</a>
            </h6>
        </div>
    </div>
```


#### Values
A form can have elements with predefined values that can be defined in the configuration (elements property) as explained in the section above, or values that can be specific for some user or set of data. These values could be extracted from the model of a view. In the last case, a data binding happens.

Form widget provides data binding to all of its form elements:
1. input (all the elements minus the ones below)
2. check box (element_checkbox)
3. radio button (element_radio)
4. dropDown widget (element_dropdown)
5. datePicker widget (element_datePickerWidget)
6. time widget (element_timeWidget)
7. dateTime widget (element_dateTimeWidget)
8. timeZone widget (element_timeZoneWidget)
9. ipCidr widget (element_ipCidrWidget)
10. toggleButton widget (element_toggleButton)

1. **input**
To include data binding in an input field, the user of the form widget should add `{{model_attribute}}` in the value property. For example, for element_email, the value can be defined as:

```
    "value": "{{email}}"
```

If the values property from the form widget configuration has the following email:

```
    "email": "mvilitanga@gmail.com",
```

Then, the email element will be rendered as:

```
    <input type="email" data-validation="email" id="text_area" name="text_email" placeholder="" required="" value="mvilitanga@gmail.com">
```

2. **element_checkbox**
To include data binding in a check box field, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_checkbox, the initValue can be defined as:

```
{
    "element_checkbox": true,
    "id": "checkbox_field",
    "initValue": "{{checkBox123}}",
    ...
    "values": [
        {
            "id": "checkbox_enable1",
            "name": "checkbox_enable",
            "label": "Option 1",
            "value": "enable",
            "checked": true
        },
        {
            "id": "checkbox_enable2",
            "name": "checkbox_enable",
            "label": "Option 2",
            "value": "disable",
            "checked": false
        },
        {
            "id": "checkbox_disable",
            "name": "checkbox_enable",
            "label": "Option 3",
            "disabled": true,
            "value": "disable"
        }
    ]
},
```

The initValue can be defined as a string, array of strings or array of Objects. For the string case (or array of string), it should have the id of the input to check. For the Object case, it should be pairs of id and checked properties. For example, if the values property from the form widget configuration includes the checkBox123 property:

```
    "checkBox123": [
        {
            "id": "checkbox_enable2",
            "checked": true
        },
        {
            "id": "checkbox_disable",
            "checked": true
        }
    ],
```

Then, the check box element will have the checkbox_enable2 and checkbox_disable items checked. Other settings in this form element won't be updated.

3. **element_radio**
To include data binding in a radio button field, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_radio, the initValue can be defined as:

```
{
    "element_radio": true,
    "id": "radio_field",
    "initValue": "{{radioButton123}}",
    ...
    "values": [
        {
            "id": "radio1",
            "name": "radio_button",
            "label": "Option 1",
            "value": "option1",
            "disabled": true
        },
        {
            "id": "radio2",
            "name": "radio_button",
            "label": "Option 2",
            "value": "option2"
        },
        {
            "id": "radio3",
            "name": "radio_button",
            "label": "Option 3",
            "value": "option3",
            "checked": true
        }
    ]
},
```

The initValue can be defined as a string, array of strings or array of Objects. For the string case (or array of strings), it should have the id of the input to select. For the Object case, it should be pairs of only id and checked properties. If the values property from the form widget configuration includes the radioButton123 property:

```
    "radioButton123": [
        {
            "id": "radio1",
            "checked": false
        },
        {
            "id": "radio2",
            "checked": true
        }
    ],
```

Then, the radio button element will have only the radio2 item checked. Other settings in this form element won't be updated.

4. **element_dropdown**
To include data binding in a drop down field, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_dropdown, the initValue can be defined as:

```
{
    "element_dropdown": true,
    "initValue": "{{dropDown123}}",
    ...
    "data": [
        {
            "id": "ftp",
            "text": "junos-ftp"
        },
        {
            "id": "tftp",
            "text": "junos-tftp",
            "disabled": true
        },
        {
            "id": "rtsp",
            "text": "junos-rtsp"
        },
        {
            "id": "netbios",
            "text": "junos-netbios-session",
            "selected": true
        }
    ]
},
```

If the values property from the form widget configuration includes the dropDown123 property:

```
    "dropDown123": {
        "id": "rtsp",
        "text": "junos-rtsp"
    },
```

Then, the drop down element will have the rtsp item selected.

5. **element_datePickerWidget**
To include data binding in a date picker widget field, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_datePickerWidget, the initValue can be defined as:

```
{
    "element_datePickerWidget": true,
    "id": "text_datepickerWidget",
    "initValue": "{{datePicker123}}",
    ...
},
```

The initValue should be defined as a string OR Date object. If the values property from the form widget configuration includes the datePicker123 property:

```
    "datePicker123": "6/20/2010",
```

Then, the datePicker widget element will have the value of the datePicker123 property assigned.


The initValue is of unacceptable format by datepicker, the incorrect value will still be shown in the form field.
Validation check will catch the incorrect date value for the field.

```
    "datePicker123": "inCorrectDate",
```

Then, the datePicker widget element will show the string "inCorrectDate" & form validator can be used to validate the field.

6. **element_timeWidget**
To include data binding in a time widget field, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_timeWidget, the initValue can be defined as:

```
{
    "element_timeWidget": true,
    "id": "text_timeWidget",
    "initValue": "{{time123}}"
    ...
},
```

If the values property from the form widget configuration includes the time123 property (an object with time and period properties):

```
    "time123": {
        "time": "06:11:00",
        "period": "PM"
    },
```

Then, the time widget element will have the value of the time123 property assigned.

7. **element_dateTimeWidget**
To include data binding in a date time element, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_timeWidget, the initValue can be defined as:

```
{
    "element_dateTimeWidget": true,
    "id": "text_dateTimeWidget",
    "initValue": "{{dateTime123}}",
    "datePickerWidget": {
        "id": "text_dateTime_date_Widget",
        ...
    },
    "timeWidget":{
        "id": "text_dateTime_time_Widget",
        ...
    }
},
```

If the values property from the form widget configuration includes the dateTime123 property (an object with date, time and period properties):

```
    "dateTime123": {
        "date": "3/11/2010",
        "time": "03:11:00",
        "period": "PM"
    },
```

Then, the time widget element will have the value of the dateTime123 property assigned.

8. **element_timeZoneWidget**
To include data binding in a time zone widget element, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_timeZoneWidget, the initValue can be defined as:

```
{
    "element_timeZoneWidget": true,
    "id": "text_timeZoneWidget",
    ...
    "initValue": "{{timeZone123}}"
},
```

If the values property from the form widget configuration includes the timeZone123 property:

```
   "timeZone123": "America/New_York",
```

Then, the time widget element will have the timeZone123 value assigned.

9. **element_ipCidrWidget**
To include data binding in a ipCidr widget element, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_ipCidrWidget, the initValue can be defined as:

```
{
    "element_ipCidrWidget": true,
    "id": "text_ipCidrWidget1",
    ...
    "initValue": "{{ipCidr123}}",
},
```

If the values property from the form widget configuration includes the ipCidr123 property (an object with ip, and cidr properties):

```
    "ipCidr123": {
        "ip": "1.2.3.4",
        "cidr": "12"
    },
```

Then, the ipCidr widget element will have the ipCidr123 value assigned.

10. **element_toggleButton**
To include data binding in a toggleButton widget element, the user of the form widget should add `{{model_attribute}}` in the initValue property. For example, for element_toggleButton, the initValue can be defined as:

```
{
    "element_toggleButton": true,
    "id": "togglebutton_field_1",
    "name": "togglebutton_field_1",
    "label": "Toggle Button",
    "initValue": "{{toggleButtonValue}}"
}
```

If the values property from the form widget configuration includes the toggleButtonValue property (true or false values):

```
    "toggleButtonValue": true,
```

Then, the toggleButton widget element will have the toggleButtonValue value assigned. In the case of the example, the toggleButton widget will be switched to state "on" (true).

element_toggleButton can include the visibility property which allows to show/hide other form elements based on the toggle button value. The available properties are the same as the one described in the elements section for any form element.

### Events
It is represented by an Object (hash) with each key representing the event that needs to be bound. The value of a key should be an Object that contains the handler property. Handler is an array that defines the callbacks that will be invoked when an event is triggered. 

For example, the validated event is triggered when a user updates an input field and the field is automatically "validated" as per its input type:

```
	var updateSaveButton = function (event, data) {
		console.log(data.isValidInput);
		console.log(data.formId);
	};
	var formEvents = {
        "validated": {
            "handler": [updateSaveButton]
        }
    };
    new FormWidget({
            "elements": formConfiguration,
            "container": formContainer,
            "events": formEvents
        }).build();
```

The callback/function will be invoked with two parameters: event and data. event represents the element that triggered the event and data represents the information associated with that element in the context of its event. 

The available events in a form are:

####validated
It is triggered when a form is validated, validation could happen few seconds after a user has provided a value to an input element, when the element is blurred or when the form is submitted. The callbacks provided in its handler property will be invoked when the validated event is triggered. It will be called with the event and data parameters. event represents the element that triggered the event. data is an Object with two properties: isValidInput and formId. isValidInput is a boolean that informs if all elements in a form have a valid input. formId is a string with the id of the form.

*ToBeDeprecated*: A form can be bound to the "valid" and "invalid" events that will get triggered when a form validation passes ("valid") or fails ("invalid"). Using the events configuration should be used instead.


### Build
Adds the dom elements and events of the form widget in the specified container. For example:

```
    form.build();
```

### Destroy
Clean up the specified container from the resources created by the list builder widget.

```
    form.destroy();
```

## Usage
To add a form widget in a container, follow these steps:
1. Instantiate the form widget and provide a configuration object with the configuration object of the elements that the form should have, the object for the data binding in the values parameter, and the container where the form widget will be rendered
2. Call the build method of the form widget

Optionally, the destroy method can be called to clean up resources created by the form widget.

```
    var form = new FormWidget({
        "elements": formConf.elements,
        "values": formConf.values,
        "container": this.el
    });
    form.build();
```

utility methods like isValidInput, insertValuesFromCollection, insertValuesFromJson, insertElementsFromJson, and insertElementsToContainer.


## Utility methods
The form widget exposes additional methods intended to help user to add elements that were not available when the widget was instantiated or to provide additional information. These methods are: isValidInput, insertValuesFromCollection, insertValuesFromJson, insertElementsFromJson, and insertElementsToContainer.


### isValidInput
It validates that all the fields of the form has the right input using the validation pattern provided for each element as explained in the "elements" section of this document. The input parameter is a boolean that allows to skip the required elements. It returns true if the form has valid inputs or false if one or more elements of the form are invalid.


### getValues
It provides a combination of name/value sets that represents the name of the input field and its value for each element of the form. *name* property needs to be defined for the getValues to return value of a field.


### showFormError
It shows/hides the form error box with the content defined in the form configuration (err_div_<*> properties) or the one defined in the errMsg property of this method. It has two optional parameters: errMsg and notShow. errMsg is html String that will be shown in the error container of the form. notShow is a boolean that if it is set to true, then the error container of the form will be hidden. For example:

```
formInstance.showFormError("Updated <b>Error</b> Message");
```


### showFormInfo
It shows/hides the form info box with the content defined in the form configuration (form_info parameter) or the one defined in the errMsg property of this method. It has two optional parameters: errMsg and notShow. errMsg is html String that will be shown in the info container of the form. notShow is a boolean that if it is set to true, then the info container of the form will be hidden. For example:

```
formInstance.showFormInfo("Updated <b>Info</b> Message");
```


### insertValuesFromCollection
It inserts values from a collection model in the specified id of the configuration object of the form. The input parameter is the id of the element to be updated and an object of the collection model. The method returns the updated configuration object.


### insertValuesFromJson
It inserts values from a JSON object in the specified id of the configuration object of the form. The input parameter is the id of the element to be updated and a JSON object. The method returns the updated configuration object. For example:


### insertElementsFromJson
It inserts elements from a JSON object in the specified id of the configuration object of the form. The input parameter is the id of the element to be updated and a JSON object. The method returns the updated configuration object.

```
this.formWidget.insertElementsFromJson('0', JSON.stringify(summaryList));
```


### insertElementsToContainer
It inserts elements in a container that is referenced by an input id. The input parameter is the DOM id of the element to be updated and a JSON object. The method returns the updated form.


### insertDropdownContentFromJson
It inserts dropdown content (option) to a dropdown element (select) after a form has been built. It takes as parameters the id of the dropdown, a JSON object with the content to be inserted, and a boolean to clear existing options.  The object should follow the format [{"text":"label","id":"value"},{"text":"label1","id":"value1"}]. It also takes a deleteDefaultList parameter that if it's set to true, it removes default content of the dropdown and add JSON object content. If it's set to false, it appends the content of the dropdown at the end of the existing dropdown list. 


### copyRow
It copies a row using its className and adds it after the last row with the same className. It also allows delete the row by adding the delete icon at the end of the row. When the element is a simple element, the elementConf parameter allows to set the new row with new name, id, and value.


### getInstantiatedWidgets
It provides an object with the instances of the widgets used during the integration of the form widget with other form element widgets. It is explained with more details in the next section.


### toggleSection
Toggle the status of a section from show to hide and vice versa. If the section has the class 'hide', then when the method is called, the hide class will be removed, so that the section will be showed. If the section was showed, when the method is called, the hide class will be added, so that the section will be hidden. For example:

```
    formInstance.toggleSection("section_id_10");
```


### toggleRow
Toggle the status of a row from show to hide and vice versa. If the row has the class 'hide', then when the method is called, the hide class will be removed, so that the section will be showed. If the row was showed, when the method is called, the hide class will be added, so that the row will be hidden.  For example:

```
    formInstance.toggleRow("custom_callback_Obj");
```


### addSection
Adds a section to the form. It requires the sectionConf parameter. It represents the configuration of the new section as per the form widget configuration format. Additionally, the identifier and the insertBefore parameters can be added. identifier represents the class ('.<className>') or the id ('#<id>') of the section that will be used as a reference for adding the section. If the parameter is absent, the section will be added at the end of the form. insertBefore parameter is a boolean that if is set to true, the new section will be added before the identifier. If it is set to false or if it is absent, the new section will be added after the section set in the identifier parameter. If more than one class reference is found for the identifier (more than one row class), then the section will be added before/after each identifier. If the identifier is an id, then only the last id found will be used as a reference. For example:

```
form.addSection(dynamicSection, '#section_id', true);
```

where form is an instance of the Form widget and dynamicSection is:

```
var dynamicSection = {
    "heading": "Appended Section",
    "heading_text": "Subtitle for appended section",
    "section_id": "appended_section_id_1",
    "elements": [
        {
            "element_description": true,
            "id": "text_description",
            "label": "Appended Description",
            "value": "Description 1"
        },
        {
            "element_textarea": true,
            "id": "text_area_1",
            "name": "text_area_1",
            "label": "Textarea",
            "pattern": "^([0-9]){3,4}$",
            "placeholder": "",
            "error": "Enter a number with 3 or 4 digits",
            "post_validation": "validTextarea"
        },
        {
            "element_multiple_error": true,
            "id": "username_1",
            "name": "username_1",
            "label": "Username",
            "pattern-error": [
                {
                    "pattern": "hassymbol",
                    "error": "Must include a symbol."
                },
                {
                    "pattern": "hasnotspace",
                    "error": "Must not include a space."
                },
                {
                    "pattern": "validtext",
                    "error": "This field is required."
                }
            ],
            "error": true,
            "help": "Must only contain alphanumerics, underscores or hyphens and begin with an alphanumeric or an underscore character."
        }
    ]
};
```


### addElements
Adds elements to the form by adding new row elements. It requires the elementConf parameter. It represents the configuration of the new elements as per the form widget configuration format. Additionally, the identifier and the insertBefore parameters can be added. The string identifier represents the class ('.<className>') or the id ('#<id>') of the element that will be used as a reference for adding the new elements. insertBefore parameter is a boolean that if is set to true, the new element(s) will be added before the identifier. If it is set to false or if it is absent, the new element(s) will be added after the element set in the identifier parameter. If more than one class reference is found for the identifier (more than one row class), then the elements will be added before/after each identifier. If the identifier is an id, then only the last id found will be used.

For example:

```
form.addElements(dynamicElements, '.text_alphanumeric_class');
```

where form is an instance of the Form widget and dynamicSection is:

```
var dynamicElements = [
      {
      "element_alphanumeric": true,
      "id": "text_alphanumeric_1",
      "name": "text_alphanumeric_1",
      "label": "Text alphanumeric Dyn1",
      "required": true,
      "placeholder": "",
      "error": "Please enter a string that contains only letters and numbers"
      },
      {
          "element_hexadecimal": true,
          "id": "text_hexadecimal_1",
          "name": "text_hexadecimal_1",
          "label": "Text hexadecimal Dyn1",
          "placeholder": "",
          "error": "Please enter a valid hexadecimal number"
      }
  ];
```


### removeElements
Remove elements or sections in the form. It required the identifier parameter. It is a string represents the class ('.<className>') or the id ('#<id>') of the element that will be removed. For example:

```
    form.removeElements('#section_id3');
```


### showFormInlineError
Shows or hides the form inline error box with the app integrated widgets. It requires elementId of the form element to which widget is integrated. Second parameter is optional, type boolean, used to hide the inline error.

```
    form.showFormInlineError('#elementId');
```

where form is an instance of the Form widget.


## Integration with other widgets
The form widget can work in conjunction with the following widgets:
- DatePicker widget
- IpCidr widget
- Time widget
- TimeZone widget
- Grid widget
- TabContainer widget
- ToggleButton widget
- Slider widget

To add it in a form, the configuration object of the form should include the parameters that each widget requires.

### DatePicker widget
It should include a **element_datePickerWidget** parameter and define a **dateFormat**. The rest of parameters follows the same rules as a regular element of the form widget.

 For example, if the datePicker element has the following configuration:

```
    {
        "element_datePickerWidget": true,
        "id": "text_datepickerWidget",
        "name": "text_datepickerWidget",
        "label": "Date Picker Widget",
        "required": true,
        "placeholder": "MM/DD/YYYY",
        "dateFormat": "mm/dd/yyyy",
        "pattern-error": [
            {
                "pattern": "length",
                "min_length":"10",
                "max_length":"10",
                "error": "Incomplete MM/DD/YYYY"
            },
            {
                "pattern": "date",
                "error": "Must be MM/DD/YYYY"
            },
            {
                "pattern": "validtext",
                "error": "Please enter a valid date."
            }
        ],
        "error": true
    },
```

Then, the datePicker input will be rendered as:

```
    <input type="text" data-widget="datePicker" widget-type="datepicker" id="text_datepickerWidget" name="text_datepickerWidget" placeholder="MM/DD/YYYY" required="" data-validation="multiple" data-validation_length="Incomplete MM/DD/YYYY" data-minlength="10" data-maxlength="10" data-validation_date="Must be MM/DD/YYYY" data-validation_validtext="Please enter a valid date." data-dateformat="mm/dd/yyyy" class="hasDatepicker"><img class="ui-datepicker-trigger" src="/assets/images/date_picker_icon.png" alt="..." title="...">
```

### IpCidr widget
It should include a **element_ipCidrWidget** parameter. The rest of parameters are optional and will be used to overwrite the default values provided by the IpCidr widget.

 For example, if the ipCidrWidget element has the following configuration:

```
    {
        "element_ipCidrWidget": true,
        "id": "text_ipCidrWidget1",
        "label": "IP/CIDR Widget",
        "ip_id": "text_ip1",
        "ip_name": "text_ip1",
        "ip_placeholder": "IP v4 or v6",
        "ip_required": "true",
        "ip_field-help": {
            "content": "IP v6 example",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "ip_error": "Invalid IP address",
        "cidr_id": "text_cidr",
        "cidr_name": "text_cidr",
        "cidr_placeholder": "CIDR",
        "cidr_error": "Invalid CIDR",
        "subnet_label": "Subnet",
        "subnet_id": "text_subnet",
        "subnet_name": "text_subnet",
        "subnet_placeholder": "Subnet placeholder",
        "subnet_error": "Please enter a valid subnet mask"
    },
```

Then, the ipCidr widget element will be rendered as:

```
    <div class="row  show ip-cidr-widget" data-widgetidentifier="ipCidr_text_ipCidrWidget1">    <!-- Form element -->
        <div class="row row_ip ">
            <!-- Label -->
                <div class="elementlabel left">
                    <label for="text_ip1" class="left inline  required  ">
                    IP/CIDR Widget
                    </label>
                        <span class="ua-field-help tooltip tooltipstered" data-ua-id="alias_for_title_ua_event_binding"></span>
            </div>
            <!-- Form field -->
            <div class="elementinput left">
                <input type="text" data-validation="ipv4v6" class="input_ip" data-ipversion="" id="text_ip1" name="text_ip1" placeholder="IP v4 or v6" required="" value="" data-trigger="enableCidrSubnet">
                <!-- Error-UA display -->
                <small class="error errorimage">Invalid IP address</small>
                <span class="inline-help"></span>
            </div>
        </div>
        <!-- Form element -->
        <div class="row row_cidr ">
            <!-- Label -->
                <div class="elementlabel left">
                    <label for="text_cidr" class="left inline  ">
                    /
                    </label>
                </div>
        <!-- Form field -->
            <div class="elementinput left">
                <input type="text" data-validation="cidrv4" class="input_cidr" id="text_cidr" name="text_cidr" placeholder="CIDR" disabled="" value="" data-trigger="updateSubnet">
                <!-- Error-UA display -->
                <small class="error errorimage">Invalid CIDR</small>
                <span class="inline-help"></span>
            </div>
        </div>
        <span class="row ip_cidr"></span>
        <!-- Form element -->
        <div class="row row_subnet ">
            <!-- Label -->
                <div class="elementlabel left">
                    <label for="text_subnet" class="left inline  ">
                    Subnet
                    </label>
                </div>
        <!-- Form field -->
            <div class="elementinput left">
            <input type="text" data-validation="inarray" class="input_subnet" id="text_subnet" name="text_subnet" placeholder="Subnet placeholder" disabled="" value="" data-trigger="updateCidr" data-array="128.0.0.0,192.0.0.0,224.0.0.0,240.0.0.0,248.0.0.0,252.0.0.0,254.0.0.0,255.0.0.0,255.128.0.0,255.192.0.0,255.224.0.0,255.240.0.0,255.248.0.0,255.252.0.0,255.254.0.0,255.255.0.0,255.255.128.0,255.255.192.0,255.255.224.0,255.255.240.0,255.255.248.0,255.255.252.0,255.255.254.0,255.255.255.0,255.255.255.128,255.255.255.192,255.255.255.224,255.255.255.240,255.255.255.248,255.255.255.252,255.255.255.254,255.255.255.255,">
                <!-- Error-UA display -->
                <small class="error errorimage">Please enter a valid subnet mask</small>
                <span class="inline-help"></span>
            </div>
        </div>
    </div>
```

### Time widget
The time widget is integrated to the form widget. To include it, the configuration object of the Form Widget (elements parameter) should include an element_timeWidget parameter like the following:

```
{
    "element_timeWidget": true,
    "id": "text_timeWidget",
    "name": "text_timeWidget"
}
```

### TimeZone widget
The timeZone widget is integrated to the form widget. To include it, the configuration object of the Form Widget (elements parameter) should include an element_timeZoneWidget parameter like the following:

```
{
    "element_timeZoneWidget": true,
    "id": "timezone_widget",
    "label": "Timezone"
}
```

Each widget is showed independently. When the datePicker widget and the time widget needs to be presented in the same line, then a combined version is available. The datePicker widget parameters should be added in the datePickerWidget parameters and the time widget parameters should be added in the timeWidget parameter. Each one contains the same parameters as if the widget were defined independently. Also, the label and the required parameters provide the label and the required validation for the combined element. For example:

```
{
    "element_dateTimeWidget": true,
    "label": "Date Time Widget",
    "required": true,
    "datePickerWidget": {
        "id": "text_dateTime_date_Widget",
        "name": "text_dateTime_date_Widget",
        "placeholder": "MM/DD/YYYY",
        "dateFormat": "mm/dd/yyyy",
        "pattern-error": [
            {
                "pattern": "length",
                "min_length":"10",
                "max_length":"10",
                "error": "Incomplete MM/DD/YYYY"
            },
            {
                "pattern": "date",
                "error": "Must be MM/DD/YYYY"
            },
            {
                "pattern": "validtext",
                "error": "This is a required field"
            },
            {
                "pattern": "afterdate",
                "after_date": "01/01/2010",
                "error": "Please enter a date after Jan 01, 2010"
            }
        ],
        "error": true,
        "notshowvalid": true
    },
    "timeWidget":{
        "id": "text_dateTime_time_Widget",
        "name": "text_dateTime_time_Widget"
    }
}
```

### Grid widget
The grid widget is integrated to the form widget. To include it, the configuration object of the Form Widget (elements parameter) should include an element_grid parameter like the following:

```
{
    "element_grid": true,
    "id": "text_grid",
    "name": "text_grid",
    "label": "Grid Integration",
    "elements": gridConfiguration.elements,
    "actionEvents" : gridConfiguration.actions,
    "error": "Grid validation failed"
}
```

Where the id is a required field, name, label and error are used by the form widget to render the grid properly in the form widget. The rest of parameters (elements, actionEvents, search, cellTooltip, etc.) corresponds to the grid widget configuration and more details can be found at [Grid](public/assets/js/widgets/grid/grid.md) widget.

When the form is rendered, the grid will be automatically added. When the getValues method from the form widget is invoked, then the getAllVisibleRows method from the grid widget will be called to get all the values for that grid.

### TabContainer widget
The tabContainer widget is integrated to the form widget. To include it, the configuration object of the Form Widget (elements parameter) should include an element_tabContainer parameter like the following:

```
{
    "element_tabContainer": true,
    "id": "text_tab",
    "name": "text_tab",
    "label": "Tab Integration",
    "tabs": tabConfiguration,
    "height": "15%"
}
```

Where the id is a required field, name and label are used by the form widget to render the tabContainer widget properly in the form widget. The rest of parameters (tabs, height, etc.) corresponds to the tabContainer widget configuration and more details can be found at [TabContainer](public/assets/js/widgets/tabContainer/tabContainer.md) widget.

The integration of the tabContainer widget to the form widget is intended to optimize the height of the tabContainer into the available form container. If the tabContainer have other forms, then the overall form validation and the output of the getValues method might include the tabContainer form content. Element id should be used to identify the correct form value of the main form.

### Toggle button widget
The toggle button widget is integrated to the form widget. To include it, the configuration object of the Form Widget (elements parameter) should include an element_toggleButton parameter like the following:

```
{
    "element_toggleButton": true,
    "id": "togglebutton_field_1",
    "name": "togglebutton_field_1",
    "on": true,
    "label": "Toggle Button"
}
```

Where the id is a required field. name and label are used by the form widget to render the toggle button properly in the form widget. The rest of parameters corresponds to the toggle button widget configuration and more details can be found at [ToggleButtonWidget](public/assets/js/widgets/toggleButton/toggleButtonWidget.md) widget.

When the form is rendered, the toggle button will be automatically added. When the getValues method from the form widget is invoked, then the on state will be returned. If the toggle button is on "on" state, then the value will be "true". If the toggle button is on "off" state, then the value is undefined.

### Slider widget
The slider widget is integrated to the form widget. To include it, the configuration object of the Form Widget (elements parameter) should include an element_slider parameter like the following:

```
{
    "element_slider": true,
    "id": "text_slider",
    "name": "text_slider",
    "label": "Slider Integration",
    "handles": [{
        "value": 40,
        "connect": {
            "right": false
        }
    }],
    "scale": {
        "range": {
            "min": 0,
            "max": 100
        },
        "numberOfValues": 3
    }
}
```

Where the id is a required field. name and label are used by the form widget to render the slider button properly in the form widget. The rest of parameters corresponds to the slider widget configuration and more details can be found at [Slider](public/assets/js/widgets/slider/slider.md) widget.

When the form is rendered, the slider will be automatically added. When the getValues method from the form widget is invoked, then the the slider value(s) will be returned. If the slider is setting only one value, a string will be returned. If multiples values can be set in the slider, then an array of strings will be returned.

## Instance of the widgets
The form widget instantiates other widgets to include them in the form. The instantiated widgets might contain methods that can be required later after the form has been built.
The method *getInstantiatedWidgets* returns the instance of the widgets used during the integration process. For instance:

```
var widgets = form.getInstantiatedWidgets();
```

will return an object with the instantiated widgets:

```
Object {ipCidr: IpCidrWidget, datePicker: DatepickerWidget, time: TimeWidget, timeZone: TimeZoneWidget}
```

To use one of the methods of the integrated widget:

#### Step1
Identify the id of the widget that was integrated. The id will be composed by:
<id of the widget>_<id of the element>

**id of the widget**
Each element widget has the following default id:
- DatePicker widget: datePicker
- IpCidr widget: ipCidr
- Time widget: time
- TimeZone widget: timeZone

**id of the element**
It represents the id assigned to the element. If id is not available, then, the widget identifier will be <id of the widget>. Nevertheless, when a form has more of one element widget, the id is required.

For example, for following configuration object:

```
    {
      "element_timeWidget": true,
      "id": "text_timeWidget"
    }
```
The id of the widget will be: time_text_timeWidget

####Step2
Get the widget object from integrated form widget based on mentioned id in configuration object.

For example to use the getTime method of the Time Widget:

```
var timeWidget = formWidget.getInstantiatedWidgets()['instance']['time_text_timeWidget'];
var time = timeWidget.getTime();
```

## Declarative Form
The form widget output provides the html markup, visual style and user interaction according to Slipstream User Experience specifications. An alternative approach to the form widget is the usage of a declarative form that could be useful when the layout of the form that needs to be built differs from the one that the form widget auto generates. In this case, application or plugin developers could use html markup to define a form. This markup should follow the same visual style (classes, containers) than the ones that are automatically generated by the form widget so the form could show the same visual style. To include the same user interaction, the declarative form will also need to include the [Tooltip](public/assets/js/widgets/tooltip/tooltip.md) widget to achieve help tooltips and [Validator](public/assets/js/widgets/form/formValidator.md) framework to validate user inputs.

For example, a form that needs to have a two column layout and some input, check box and radio buttons elements could use a declarative form like the following:

```javascript
<form id="declarative_sample_form" name="sample_form" class="form-pattern validate" novalidate="" data-err-timeout="1000" data-valid-timeout="5000" form-pattern-validator="">

    <div class="slipstream-content-title">
        <div>
            Sample Form Widget
            <span class="ua-field-help tooltip" data-ua-id="alias_for_title_ua_event_binding" title="tittle with tooltip"></span>
        </div>
    </div>
    <h5>Subtitle</h5>
    <h6>Subtitle text</h6>

    <div>
        <div class = "left twoColumns">
            <div class="row">
                <!-- Label -->
                <div class="elementlabel left">
                    <label for="text_string" class="left inline">Text string</label>
                    <span class="ua-field-help form-element tooltip" data-ua-id="alias_for_ua_event_binding2" title="input field with tooltip"></span>
                </div>
                <!-- Form Fields -->
                <div class="elementinput left">
                    <!-- Input fields -->
                    <input type="text" data-validation="validtext" id="text_field" name="text_feld" placeholder="required" required="" value="">
                    <!-- Error Display -->
                    <small class="error errorimage">Please enter a value for this field</small>
                    <span class="inline-help help-style">Inline help text</span>
                </div>
            </div>
            <div class="row">
                <!-- Label -->
                <div class="elementlabel left">
                    <label for="text_area" class="left inline required">Text email</label>
                </div>
                <!-- Form Fields -->
                <div class="elementinput left">
                    <!-- Input fields -->
                    <input type="email" data-validation="email" id="text_area" name="text_email" placeholder="" required="" value="mvilitanga@gmail.com">
                    <!-- Error Display -->
                    <small class="error errorimage">Please enter a valid email</small>
                </div>
            </div>
            <div class="row">
                <!-- Label -->
                <div class="elementlabel left">
                    <label for="text_url" class="left inline">Text url</label>
                </div>
                <!-- Form Fields -->
                <div class="elementinput left">
                    <!-- Input fields -->
                    <input type="url" data-validation="url" id="text_url" name="text_url" placeholder="http://www.juniper.net" value="www.gmail.com">
                    <!-- Error Display -->
                    <small class="error errorimage">Please enter a valid URL</small>
                    <span class="inline-help"></span>
                </div>
            </div>
        </div>
        <div class="left">
            <div class="row  show">
                <!-- Label -->
                <div class="elementlabel left">
                    <label for="checkbox_field" class="left inline  required">
                        Checkbox
                    </label>
                </div>
                <!-- Form field -->
                <div class="elementinput left">
                    <!-- Input field -->
                    <div class="optionselection">
                        <input type="checkbox" data-validation="validtext" id="checkbox_enable" name="enable_disable" value="enable" checked="" required="">
                        <label for="checkbox_enable">Option 1</label>
                    </div>
                    <div class="optionselection">
                        <input type="checkbox" data-validation="validtext" id="checkbox_disable" name="enable_disable" value="disable" disabled="" required="">
                        <label for="checkbox_disable" class="disabled">Option 2</label>
                    </div>
                    <!-- Error-UA display -->
                    <small class="error errorimage">Please make a selection</small>
                    <span class="inline-help"></span>
                </div>
            </div>
            <div class="row">
                <!-- Label -->
                <div class="elementlabel left">
                    <label for="radio_field" class="left inline">Radio Button</label>
                </div>
                <!-- Form Fields -->
                <div class="elementinput left">
                    <!-- Input fields -->
                    <div class="optionselection">
                        <input type="radio" data-validation="validtext" id="radio1" name="radio_button" value="option1">
                        <label for="radio1">Option 1</label>
                    </div>
                    <div class="optionselection">
                        <input type="radio" data-validation="validtext" id="radio2" name="radio_button" value="option2">
                        <label for="radio2">Option 2</label>
                    </div>
                    <!-- Error Display -->
                    <small class="error errorimage">Please make a selection</small>
                    <span class="inline-help help-style">Radio Buttons help text</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Buttons -->
    <div class="buttons row buttons_row clear">
        <div class="elementinput left ">
            <input type="submit" class="slipstream-primary-button slipstream-secondary-button" id="add_section" name="add_section" value="Add Section">
            <input type="submit" class="slipstream-primary-button " id="get_values" name="get_values" value="Get Values">
        </div>
    </div>

</form>
```

Where input fields follow the structure: label and field sections. The field section includes an input with data-validation attribute and the error display area. This format should be used in order to have the form validator applied and be able to show any error during client side validation. For example, an input field that is a required element and has email pattern validation should have the following html markup:

```javascript
    <div class="row">
        <!-- Label -->
        <div class="elementlabel left">
            <label for="text_area" class="left inline required">Text email</label>
        </div>
        <!-- Form Fields -->
        <div class="elementinput left">
            <!-- Input fields -->
            <input type="email" data-validation="email" id="text_area" name="text_email" placeholder="" required="" value="mvilitanga@gmail.com">
            <!-- Error Display -->
            <small class="error errorimage">Please enter a valid email</small>
        </div>
    </div>
```
Details of how the html markup for form elements should be defined is described in the elements section of this document.

A declarative form will also need to include the form validator and the tooltip widget as per the following example:

```javascript
    var form = this.$el.append(declarativeForm);
    new FormValidator().validateForm(form);
    new TooltipWidget({
        "container": form
    }).build();
```

Additionally, some form elements might require other widgets like the datePicker widget, dropDown widget, ipCidr widget, date widget, time widget, and timeZone. In this case, the corresponding widget documentation and the externally integrated widget section in the form widget documentation should be followed:
[Date Picker](public/assets/js/widgets/datepicker/datepickerWidget.md),
[Drop Down](public/assets/js/widgets/dropDown/dropDown.md),
[Ip Cidr](public/assets/js/widgets/ipCidr/ipCidr.md),
[Time](public/assets/js/widgets/time/timeWidget.md),
[Time Zone](public/assets/js/widgets/timeZone/timeZone.md)

More details of the html markup that each element should have can be found in the [Validator](public/assets/js/widgets/form/formValidator.md) or in this document in the elements section.

## Externally Integrated widget
User can append the widgets externally. In order to show the validation error message, they have to add the undermentioned with the following structure.

For example
```
    <!-- Input field -->
    <span id="gridWidgetInForm" data-integrated-widget="true">
        <div>integrated widget ...</div>
    </span>
        <!-- Error-UA display -->
    <small class="error errorimage">Grid validation failed</small>
```