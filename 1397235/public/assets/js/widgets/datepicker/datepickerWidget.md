# Date Picker Widget
## Introduction
The Slipstream framework provides a programming construct for plugin developers to attach datepicker widget. The datepicker is tied to a standard form input field. Click calendar icon to open an interactive calendar in a small overlay. Choose a date, click elsewhere on the page (blur the input), or hit the Esc key to close calendar overlay. If a date is chosen, feedback is shown as the input field value.

##### The datepicker will be configured with localized date format:

## API
The datepicker object exposes following functions

```
function DatepickerWidget(conf) {…}
```

Used to attach a new datepicker to input field.
where conf is of the format:

```
{
	container: <reference to the inputField where the datepicker needs to be attached>
}
```

```
function build() {…}
```

Used to attach the datepicker icon with calendar overlay to the input field.

```
function destroy() {…}
```

Used to remove the datepicker functionality completely from the input field. This will return the element back to its pre-init state.

```
function disable(boolean) {…}
```

Used to enable / disable datepicker field & icon.

```
function getDate() {…}
```

Returns selected date as a javascript Date object

```
function setDate(newDate) {…}
```
Sets date with a javascript Date object OR with valid date string.
In case of incorrect input value method returns false. Following are the incorrect input values:- null, undefined, [], {}, true, false.
In case of invalid input value method sets the value in date field & returns false. for eg: invalid date - "19/19/2019", an array [1,2] or object {"key":"1"}
In case of valid input value as per the configured date format, method sets the value in date field & returns true. for eg: valid date - "01/01/2019", "01-01-2019"
```
function minDate(newMinDate) {…}
```

Sets minimum (earliest) date with a javascript Date object

```
function maxDate(newMaxDate) {…}
```

Sets maximum (latest) date with a javascript Date object

### Configuration
The configuration object has the following parameters:

```
{
	container: required, <DOM object id for the input field where datepicker will be attached>
	dateFormat: optional <date format that the datepicker will render for the date | default - 'mm/dd/yyyy' >
}
```

### Supported date formats
'mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy/mm/dd', 'mm-dd-yyyy', 'dd-mm-yyyy', 'yyyy-mm-dd', 'mm.dd.yyyy', 'dd.mm.yyyy', 'yyyy.mm.dd'
Note: if dateFormat is not specified, dateformat is picked as per the locale of the browser.


## Usage
### Steps for using datepicker widget:
##### 1. Under js/views create a object for the widget

Example: widgetView.js

```
define([
    'backbone',
    'widgets/datepicker/datepickerWidget'
], function(Backbone, DatepickerWidget){
    /**
     * Constructs a DatepickerView
     */
    var DatepickerView = Backbone.View.extend({

        initialize: function () {
                    this.render();
                },
        
                render: function () {
                    var $dateElement = $('#datepicker_test');
                    var confObj = {
                        container: $dateElement
                    };
                    var datepickerWidgetObj = new DatepickerWidget(confObj);
                    datepickerWidgetObj.build();
                    return this;
                }
            });
        
            return DatepickerView;
        });
```

##### 2. create the object of the view to attach datepicker under js/views, dateformat will be as per locale

Example: exampleView.js

```
require([ './widgetView'], function (DatepickerView) {
    new DatepickerView({});
});
```

##### 3. Instance methods

Examples

```

/**
 * Instantiate date picker widget 
 */
var $dateElement = $('#datepicker_test');
var confObj = {
    container: $dateElement
};
var datepickerWidgetObj = new DatepickerWidget(confObj);
datepickerWidgetObj.build();

/**
 * Set the date to today using setDate(date) passing in a JavaScript Date object
 */
var today = new Date();
datepickerWidgetObj.setDate(today);

/**
 * Get the date value of the instance
 */
 var dateVal = datepickerWidgetObj.getDate();

/** 
 * Set the minimum and maximum date. 
 * When using two instances of the Date Picker Widget as a date range, 
 * this can be used to enforce start date is never after end date.
 * Also can be used on a single date picker widget to restrict dates 
 * to within a certain range.
 */

var newMaxDate = new Date(Number(today.valueOf() + 604800000);
datepickerWidgetObj.minDate(today);
datepicketWidgetObj.maxDate(newMaxDate);
```






