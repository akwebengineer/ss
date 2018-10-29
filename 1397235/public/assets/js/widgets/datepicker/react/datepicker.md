# Datepicker React Component


## Introduction
The Slipstream framework provides a programming construct for plugin developers to attach datepicker widget. The datepicker needs an input field. Click calendar icon to open an interactive calendar in a small overlay. Choose a date, click elsewhere on the page (blur the input), or hit the Esc key to close calendar overlay. If a date is chosen, feedback is shown as the input field value.

Datepicker is a reusable graphical user interface that attaches a calendar to the input field. It is configurable; for example, it could be rendered with a enabled / disabled state.
Datepicker can be added to a container programmatically or as a component.
The current document describes how to add a Datepicker as a React component [Datepicker React Component](public/assets/js/widgets/datepicker/react/datepicker.md).
To add a Datepicker programmatically, refer to [Datepicker Widget](public/assets/js/widgets/datepicker/datepickerWidget.md).

## API
The Datepicker React component gets its configuration from the Datepicker attributes. Once the component is rendered, it could be modified by updates on its state and attributes.


## Attributes
The Datepicker React component has the following attributes:

```javascript
 <Datepicker
    id = <(required) string, defines the id of the datepicker component.>
    value = <(optional) object, the value that needs to be set in the date field | Instance of Date() class.>
    disabled = <(optional) boolean, if it is set to true, the datepicker will have user interaction disabled | otherwise, it will be enabled.>
    dateFormat = <(optional) string, several date formats are supported.>
    minDate = <(optional) object, the value that needs to be set to define minimum range for date field | Instance of Date() class.>
    maxDate = <(optional) object, the value that needs to be set to define maximum range for date field | Instance of Date() class.>
    onChange = <(optional) function, callback that is invoked when the value is selected from the calendar.>
/>
```

For example, a datepicker component could be rendered with the following tag:

```javascript
   <Datepicker
        id="datepicker_interactive"
        value={new Date()}
        onChange={this.handleChange}
        disabled = {true}
  />
```

### id
It defines the id that the input element in the datepicker component will be assigned to. It is a string and it has to be unique in the page/DOM.

### value
It defines the value assigned for the date field. Date field can be set to some value using the setState method. The value accepted is instance of Date().
If not provided, by default it shows empty for the container.

### disabled
It defines the state of datepicker component, so the datefield and the calendar is disabled or enabled after it is rendered.
If not provided, by default the component is enabled.

### dateFormat
It defines dateFormat attribute of the datepicker component, the dateFormat will format the date field to show the value from the calendar as per the defined format.
If not provided, by default dateformat is picked as per the locale of the browser.
######Supported dateFormats are
'mm/dd/yyyy', 'dd/mm/yyyy', 'yyyy/mm/dd', 'mm-dd-yyyy', 'dd-mm-yyyy', 'yyyy-mm-dd', 'mm.dd.yyyy', 'dd.mm.yyyy', 'yyyy.mm.dd'

### minDate
It is used to define minimum (earliest) date with a javascript Date object. It can be used to define the minimum range for dates in the calendar.

### maxDate
It is used to define maximum (latest) date with a javascript Date object. It can be used to define the maximum range for dates in the calendar.

### onChange
It defines the callback that will be invoked when the the value is selected from the calendar to set in date field. In the callback the data provided is the selected date from calendar.

## Usage
To include a datepicker component, define it with at least the id and then render it using React standard methods. For example:

```javascript
    <Datepicker
        id="datepicker_basic"
    />
```

The following example shows how the datepicker component can be used in the context of a React application:

```javascript
    class DatepickerApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                disabled: false,
                value: undefined
            };
            this.handleChange = this.handleChange.bind(this);
            self.datepickerAppInstance = this;
        }

        handleChange(value) {
            console.log("Selected Date is: " + value);
        }

        render() {
            return (
                <Datepicker
                    id="datepicker_interactive"
                    value={this.state.value}
                    disabled={this.state.disabled}
                    onChange={this.handleChange}
                />
            );
        }
    };
    ReactDOM.render(<DatepickerApp/>, pageContainer); //where pageContainer represents where the datepicker input field along with calendar will be rendered
```