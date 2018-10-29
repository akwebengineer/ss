# TimeZone React Component


## Introduction
The TimeZone selector is a reusable graphical user interface that renders a control for selecting a timezone.
A TimeZone selector can be added to a container programmatically or as a component. The current document describes how to add a TimeZone selector as a React component. To add a TimeZone selector programmatically, refer to [TimeZone Widget](public/assets/js/widgets/timezone/timeZoneWidget.md)


## API
The TimeZone React component gets its configuration from the TimeZone element properties. Once the component is rendered, it can be modified by updates to it's state and properties.


## Properties
The TimeZone React component has the following properties:

```javascript
<TimeZone
     value = <(optional) value in Olson format. If omitted, the client timezone is selected>
     onChange = <(optional) function, callback that is invoked when a new timezone selection is made>
/>
```

For example, a TimeZone selector component could be rendered as follows:

```javascript
<TimeZone
     value = 'America/Honolulu'
     onChange = function(selectedTzInfo) {...}
/>
```

### value
The timezone (in Olson format) that is selected when the TimeZone selector component is rendered.

### onChange
If provided, the onChange callback will be called whenever the selected timezone is changed. The callback will be passed a single object parameter with the following properties:

__timezone__ The Olson value of the selected timezone.

__timezoneText__ The full timezone text displayed in the selector.

## Usage
To include a TimeZone selector component, define it with the optional *value*  and *onChange* properties.  For example:

```javascript
    <TimeZone
        value = 'America/Honolulu'
        onChange = function(selectedTzInfo) {...}
    />
```

The following example shows how the timezone selector component can be used in the context of a React application:

```javascript
    class TimeZoneApp extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                value: 'America/Honolulu'
            }

            this.handleChange = (data) => console.log(data);
        }

        render() {
            return (
                <TimeZone
                    onChange = {this.handleChange}
                    value = {this.state.value}
                />
            );
        }
    };

    ReactDOM.render(
          <TimeZoneApp/>, 
          container // the container into which the TimezoneApp will be rendered  
    );
```