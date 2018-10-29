# DropDown Widget


## Introduction
The DropDown widget is a reusable graphical user interface that allows users to show a searchable dropdown with simple or multiple selection dropdown in the selected container.

## API
The DropDown widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.


## Configuration
The configuration object has the following parameters:

```
{
    container: <DOM object that defines where the widget will be rendered>,
    data: <JSON object that defines the elements that will be showed in the drop down (select elements)>,
    matcher: <javascript function that defines a specific filter functionality>,
    placeholder: <string that defines a short hint for the user>,
    multipleSelection: <object that defines the configuration for multi-value select boxes>,
    showCheckboxes: <boolean, true allows to show a checkbox next to the dropdown option>
    initValue: <The initial value of the dropdown>
    onChange: <function called when the value selection of the dropdown is changed>,
    onSelect: <function called when the value of the dropdown has been updated>,
    onClose: <function called before the dropdown is closed>,
    enableSearch: <true if search should be enabled for the values in the dropdown, false otherwise>,
    remoteData: <JSON object that is used to initiate lazy loading of remote data>
    templateResult: optional, function should return a string containing the text to be displayed, or an object that contains the data that should be displayed.
    templateSelection: optional, function should return a string containing the text to be displayed as selection.
    allowClearSelection: optional. allows to remove all elements from the list of selected options when it is set to true. <true if clear button should be visible, false otherwise> Defaults value is false. placeholder  configuration option should be set when setting allowClearSelection to true.
    dropdownTooltip: Can either be a boolean or an object. Boolean true or an object with functionBefore callback will show tooltip on hovering over the dropdown item.
    width: optional. Allows to define custom width for dropdown widget. It can either be a string or a number.
    height: optional. Allows to update the predefined height to a "small" height. The only value allowed is "small".
    maxHeight: optional. Allows to define custom max height for dropdown widget. It should be a number.
}
```

The container that will have a DropDown widget should be a select tag. For example:

```
<select class="basic-selection-nodata">
    <option value="one">First</option>
    <option value="two" disabled="disabled">Second (disabled)</option>
    <option value="three" selected="selected">Third</option>
</select>
```

A DropDown widget with default values should be instantiated with:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
});
```

A DropDown widget with user defined values could be instantiated with:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application,
    "matcher": newMatcher
}).build();
```

where the "data" should be a JSON object defined in a set of key/value pairs. For example:

```
var application = [{
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
},
{
  "id": "smb",
  "text": "junos-smb-session",
  "selected": true
}]
```

### Container
The container parameter represents the DOM element that will have the drop down widget.

### Data
The data parameter represents the select elements that the drop down will be showing. It could be composed by:

- only html tags; for example:

```
<select class="basic-selection-nodata">
    <option value="one">First</option>
    <option value="two" disabled="disabled">Second (disabled)</option>
    <option value="three" selected="selected">Third</option>
</select>
```

and a widget configuration like:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-nodata')
}).build();
```

will produce a widget with select elements coming only from the html select definition.


- only data from a JSON object (data parameter); for example:

```
<select class="basic-selection-data"></select>
```

and a widget configuration like:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application
}).build();
```

will produce a widget with only select elements coming from the data parameter (application object).

- html tags and widget data configuration; for example:

```
<select class="basic-selection-data">
    <option value="one">First</option>
    <option value="two" disabled="disabled">Second (disabled)</option>
    <option value="three" selected="selected">Third</option>
</select>
```

and a widget configuration like:

```
var dropDown = new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application
}).build();
```

will produce a drop down widget with select elements coming from the data parameter (application object) and the html declaration (option tags).

Data parameter can also define some attributes of the option tag like the disabled and selected. For example:

```
[ ...
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
        "id": "smb",
        "text": "junos-smb-session",
        "selected": true
    },
...]
```

### Initializing the value of the dropdown
The initial value of the dropdown can be set by specifiying the *initValue* property in the configuration object.  This property is an object with the following attributes:

**id**
The identifier associated with the value to be set

**text**
The text value to be set

For example:

```
var someInitialValue = {
    id: 10,
    text: 'California'
};

var dropDown = new DropDownWidget({
   ...
   initValue: someInitialValue
});
```

### Matcher
This parameter allows a javascript function to overwrite the default widget match implementation. It can be used when the match criteria should be only the options starting with the filter word or be case sensitive, etcetera. For example the following matcher function:

```
var newMatcher = function (params, data) {
    // if there are no search terms, return all of the data
    if ($.trim(params.term) === '') {
        return data;
    }
    // params.term should be the term that is used for searching and data.text is the text that is displayed for the data object
    if (data.text.indexOf(params.term) > -1) {
        var modifiedData = $.extend({}, data, true);
        modifiedData.text += ' (matched)'; //return search with modified object
        return modifiedData;
    }
    // return 'null' if the term should not be displayed
    return null;
}
```

adds the word 'matched' at the end of each result when the function is added in the configuration of the Drop Down widget, like in the following:

```
new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "matcher": newMatcher
}).build();
```

### Multiple Selection
The multipleSelection parameter defines an object that allows to add multiple selection to a simple dropdown. It has the following parameters:
- maximumSelectionLength: restricts the maximum number of options selected
- createTags: allows user to create new entries to the list of available options.
- allowClearSelection: allows to remove all elements from the list of selected options when it is set to true (Will be depracated in future releases and moved up to dropdown config. See allowClearSelection under dropdown config options)

For example:

```
var dropDown = new DropDownWidget({
    "container": this.containers.multipleDefault,
    "data": application,
    "multipleSelection": {
        maximumSelectionLength: 3,
        createTags: true,
        allowClearSelection: true
    },
    "placeholder": "Select an option"
});
```

### Lazy loading / Infinite scrolling
The parameter defines an object that allows to add the lazy loading of the records. This option is advisable with huge data set.

   - remoteData: required, if virtual scroll is to be used.if used it will ignore the 'data' parameter used for static listing of values in drop down. It is composed by following under mentioned configuration parameters.
	 - headers: an object of additional header key/value pairs to send along with requests.
	 - url: required, a string containing the URL to which the request is sent.
	 - type: defaults to 'GET'.  Accepts http verbs: GET, POST, PUT etc.
		 - NOTE: The widget does not support CRUD operations with differnet verbs. Regardless of the type being used, the dropdown uses it to retrieve data from the url provided.
	 - data: data to be appended to the request. Accepts a callback that should return the data object.
        - NOTE: This callback is passed query parameters such as page, paging, _search which can be modified in the returned data object. Properties that are not modified will be retained in the query.
	 - delay: optional, the number of milliseconds to wait for the user to stop typing before issuing the ajax request. Default value is 250.
	 - dataType: optional, the type of data that is expected back from the server. Default value is json.
	 - numberOfRows: required, defines the number of rows that will be requested from the API to show the next set of rows for virtual scrolling (pagination).
	 - jsonRoot: required, defines where the data begins in the JSON response.
	 - jsonRecords: required, defines a function that returns the total number of records for API response.
	 - reformatData: optional, defines a callback that will be called to format the data response from API
	 - success: optional, a function to be called if the request succeeds. This indicates the server request was successful & can be used to parse the data.
	 - error: optional, a function to be called if the request fails. This indicates the error in API response & can be used to handle error conditions related to data manipulation.
	 - reformatURL
	    Default URL parameters are deserialized and available for customization. reformatURL defines a callback which will be provided the deserialized URL params as the input. The callback could return a modified version of the provided input param or return an entirely new object. Either ways, the object should represent deserialized URL parameters.
	    For example, the reformatUrl callback could be the following:

Example 1:

```
    var reformatUrl = function (originalUrlParams) {
    /** The input parameter (originalUrlParams) will be in the following format
    //  {
    //    page: 1,
    //    paging: "(start eq  1, limit eq 500)"
    //  }
    **/
        originalUrl.paging.replace('start eq', 'from');
        originalUrl.paging.replace('limit eq', 'size');
        originalUrl.concat('&sorter=display_name:asc')
        return originalUrl;
    };
```

Example 2:
```
    var reformatUrl = function () {
        var deserialzedURLParams = {
            from: 1,
            size: 500
        };
        return deserialzedURLParams;
    };
```


For example:

```
var dropDown = new DropDownWidget({
    "container": this.containers.SimpleDataInfiniteScroll,
    "enableSearch": true,
    "remoteData": {
           headers: {
               "accept" : "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01",
               "Content-Type": "application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01"
           },
           "url": "/api/juniper/sd/address-management/addresses?sortby=(name(ascending))",
           "numberOfRows": 10,
           "jsonRoot": "addresses.address",
           "jsonRecords": function(data) {
               return data['addresses']['total']
           },
           "reformatData": reformatDataFunc,
           "reformatURL": function (originalUrl) {
                var deserialzedURLParams = {
                    from: 1,
                    size: 500
                };
                return deserialzedURLParams;
            },
           "success": function(data){console.log("call succeeded")},
           "error": function(){console.log("error while fetching data")}
       },
     "templateResult": formatRemoteResult,
     "templateSelection": formatRemoteResultSelection
});

var formatRemoteResult =  function (data) {
    if (data.loading) return data.text;
    var markup = data.name;
    return markup;
};

var formatRemoteResultSelection =  function (data) {
   return data.name;
};

var reformatDataFunc = function(data){
  var formattedData = [];
  $.each( data, function( i, val ) {
    var obj = $.extend( {}, val );
    obj.id = val['uuid'];
    obj.text = val['name'];
    formattedData.push(obj);
  });

  return formattedData;
};
```

### dropdownTooltip

If this parameter is set to true, it will show tooltip on hovering over the dropdown items.

```
new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application,
    "dropdownTooltip": true
}).build();
```

To provide content to be rendered on the tooltip,

- set 'tooltip_text' parameter in dropdown data.

For example:

```
[{
        "id": "ftp",
        "text": "junos-ftp",
        "tooltip_text": "FTP tooltip"
    },
    {
        "id": "tftp",
        "text": "junos-tftp",
        "disabled": true,
    },
    {
        "id": "rtsp",
        "text": "junos-rtsp",
        "tooltip_text": "RTSP tooltip"
    }
}]
```

If 'dropdownTooltip' parameter is assigned to an object which has 'functionBefore' callback, it will show tooltip on hovering over the dropdown items. The content for the tooltip should be provided from the assigned callback function.

The callback expects a string or an HTML view to render in tooltip widget. It provides the dropdownData and renderTooltip parameter.renderTooltip is a callback that should be invoked to provide the view to be showed in the tooltip. dropDownData is the 'id' of the dropdown item on which hover event is triggered. App can use this variable to know which dropdown item is hovered.

For example:

```
var dropdownTooltipObj = {
    "functionBefore": this.dropdownTooltip
};
dropdownTooltip: function (dropdownData, renderTooltip){
   $.ajax({
      type: 'GET',
      url: '/assets/js/widgets/dropDown/tests/dataSample/applicationTooltipAjax.json',
      success: function(data) {

          data.forEach(function(item) {
              if(item['id'] == dropdownData) {
                  renderTooltip(item['tooltip_text']);
              }
          });
      }
  });
}
new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application,
    "dropdownTooltip": dropdownTooltipObj
}).build();
```

Example to render custom HTML view on tooltip:

```
var dropdownTooltipObj = {
    "functionBefore": this.dropdownTooltip
};
dropdownTooltip: function (dropdownData, renderTooltip){
 var tooltip_data = $("<span> this is <br/> sample template </span>");
 renderTooltip(tooltip_data);
}
```

By default, 'dropdownTooltip' object will get the priority. if 'dropdownTooltip' is set to true, then corresponding value of 'tooltip_text' parameter in dropdown data will be displayed on tooltip. If no 'tooltip_text' parameter is provided, the tooltip won't be rendered for that dropdown item.

### width

This parameter can either be a string or a number. In case of a number, it will be used as a fixed width for dropdown.
If parameter is a string, the widget expects either of these values: 'small', 'large', 'medium' or 'auto'

small - width(130px);
large - width(520px);
medium - width(260px);
auto - adjust to the size of the current selection

### height

This parameter only allows the value "small" and it is intended to provide a smaller height of the default dropdown. For example:

```
new DropDownWidget({
    "container": dropdownContainer,
    "height": "small"
}).build();
```

### maxHeight

maxHeight defines to what extent the drop down widget can grow vertically. Once the widget reaches its maxHeight, a scroll bar is introduced. If no maxHeight is defined, the drop down widget uses its default value of 90 px.
Note: maxHeight is a number without 'px'.

```
new DropDownWidget({
     "container": this.containers.multipleMaxHeight,
     "data": sampleData.confData,
     "multipleSelection": {
         maximumSelectionLength: 15
     },
     "placeholder": "Select an option",
         "maxHeight": 60
}).build();
```

## Methods

### build
Adds the dom elements and events of the DropDown widget in the specified container. For example:

```
dropDown.build();
```

### destroy
Clean up the specified container from the resources created by the DropDown widget.

```
dropDown.destroy();
```

### setValue
Set the value of the dropdown

```
dropDown.setValue(value, triggerChange);
```

value can either be an Object or a String, depending on the type of the dropdown.
  - For remote data dropdown - value must be an object of the format {"id": <id of the dropdown>, "text": <text to be displayed in the dropdown>}
  - For local data dropdown -
        When String value is passed, it must be the id of the dropdown option and the parameter is used as is.
        When Object is passed, value.id is used and value.text is ignored

*  For remoteData, setValue can be used to change the displayed value to ANY value by passing the params {id: < >, text: < >}.
*  ****** Care should be taken to pass the same value to the remote data source
*  ****** If setValue() is used for setting the initial value of a remote dropdown, the text and id must match a value from the expected remote data.
*  For local data, setValue can be used to change the displayed value to a value that exists in conf.data. The method CANNOT be used to set the display to a value that is not in conf.data.

triggerChange is an optional parameter which indicates whether to trigger 'change' event or not
   - The 'change' event will be triggered, if the parameter is not provided or is set as true.
   - If the parameter is set as false then 'change' event will not trigger and 'onChange' callback won't be called as well.

For example;

```
var dropDown = new DropDownWidget({...});
// For local data - String Input
dropDown.setValue("California");

// For local data - object Input ()
dropDown.setValue({
      "id": "12345",
      "text": "California"
  });

// For remote data - string input
dropDown.setValue({
      "id": "12345",
      "text": "California"
  });

// To suspend 'change' event
dropDown.setValue("California", false);
```

### getValue
Get the value of the dropdown

```
var value = dropDown.getValue();
```

For example:

```
var dropDown = new DropDownWiddget({...});
...
var value = dropDown.getValue();
console.log("dropdown value=", value);

> California
```

### getValueObject
Get the object of selected dropdown element

```
var data = dropDown.getValueObject();
```

For example,

```
var dropDown = new DropDownWidget({...});
...
var data = dropDown.getValueObject();

> data[0] = {disabled: false, id: 'tcp', text: 'tcp', selected: false}
```
NOTE: The value object will not expose any additional attributes set in data parameter. Only these four attributes will be provided as a part of this object: -> 'id', 'text', 'disabled' and 'selected'.


### addData
Append or reset data in the dropdown based on the resetData parameter:
resetData = true  will replace the dropdown list with new list
resetData = false will append the new list to existing list

 *** Not for use with remoteData since addData extends conf.data which is ignored in cases of conf.remoteData ***

```
var value = dropDown.addData(dataArray, resetData);
```

For example:

```
var dropDown = new DropDownWiddget({...});
dropDown.addData(application, true);
```

### disable
Allows to disable the dropdown widget or to disable one or more items in the dropdown widget when the item id (string) or items id (array) is passed as a parameter.

For example:

1. To disable the dropdown widget:

```
var dropDown = new DropDownWiddget({...});
dropDown.disable();
```

2. To disable an item in the dropdown widget:

```
var dropDown = new DropDownWiddget({...});
dropDown.disable("one");
```

3. To disable multiple items in the dropdown widget:

```
var dropDown = new DropDownWiddget({...});
dropDown.disable(["one", "two", "three"]);
```

*Note*: Disable of item(s) is not available when the dropdown is built using lazy loading.


### enable
Allows to enable the dropdown widget or to enable one or more items in the dropdown widget when the item id (string) or items id (array) is passed as a parameter.

For example:

1. To enable the dropdown widget:

```
var dropDown = new DropDownWiddget({...});
dropDown.enable();
```

2. To enable an item in the dropdown widget:

```
var dropDown = new DropDownWiddget({...});
dropDown.enable("one");
```

3. To enable multiple items in the dropdown widget:

```
var dropDown = new DropDownWiddget({...});
dropDown.enable(["one", "two", "three"]);
```

*Note*: Enable of item(s) is not available when the dropdown is built using lazy loading.


## Usage
To include the DropDown widget, a select element should be defined. For example:

```
<select class="basic-selection-data"></select>
```

The Javascript code that will be used to render a drop down for the HTML markup above with simple selection could be:

```
new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application,
}).build();
```


The Javascript code that will be used to render a drop down for the HTML markup above with multiple selection could be:

```
new DropDownWidget({
    "container": this.$el.find('.basic-selection-data'),
    "data": application,
    "multipleSelection": {
        maximumSelectionLength: 3,
        createTags: true,
        allowClearSelection: true
    }
}).build();
```