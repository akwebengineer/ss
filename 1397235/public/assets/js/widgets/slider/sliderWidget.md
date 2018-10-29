# Slider Widget


## Introduction
The slider widget is a reusable graphical user interface that renders a bar with one or multiple handles that allows to select one or more range of values.
The slider can be added to a container programmatically or as a component. The current document describes how to add a slider programmatically. To add a slider as a React component, refer to [Slider React Component](public/assets/js/widgets/slider/react/slider.md).


## API
The slider widget follows the widget programming interface standards, therefore it exposes: build and destroy methods. Any configuration required by the widget is passed to its constructor.


## Configuration
The configuration object has the following properties:

```javascript
{
    container:  <(required) DOM object that defines where the widget will be rendered>
    handles: <(required) Object, defines the handles, labels and connections around the handles>
    scale: <(required) Object, defines the parameter required to render a scale at the bottom of the slider>
    options: <(optional) Object, defines additional properties used to modify the interaction in the slider>
}
```

### container
The container property represents the DOM element that will contain the slider widget.

### handles
It defines an array of Objects with the handles, the labels and the connections around the handles. It is a required property and each Object is defined by the value of the handle, the label assigned to the handle, if it is disabled and the connection of the handle.

#### value
It defines the position of the handle along the scale. Its data type is a number and it is a required property.

#### connect
It represents the connections between adjacent handles or slider endpoints. It's an object that can include *left* and *right* properties.  The *right* property is only valid for the last defined handle.
 - *left*: it defines the connection at the left of the handle. If its set as a boolean with the value *true*, it will be rendered in a color that indicates range selection. If it is set to false, it will be rendered as if the connector is not part of a range. The default value is true. It could be also represented as an Object and it could include a color property which allows to update the predefined color of the connection. The value of the color property should be a string with the hexadecimal value of the color to be updated.
- *right*: ONLY defined for the last handle in the array of handles, it defines the connection at the right of the handle. If its set as a boolean with the value *true*, it will be rendered in a color that indicates range selection. If it is set to false, it will be rendered as if the connection is not part of a range. The default value is true. It could be also represented as an Object and it could include a color property which allows to update the predefined color of the connection. The value of the color property should be a string with the hexadecimal value of the color to be updated.
Each connection that shows as a active range has predefined colors for 1, 2, 3 and 4 handles. Beyond that number of handles, a unique color will be shown and the color property of the "left" or "right" properties will need to be used.

#### label
 It represents the value displayed for the handle. Its data type is a boolean and if it's set to true, the default value of the handle will be shown. If it's set to false, no label will be shown. If the label property of the options object is set to false, the value set in this property will be ignored. The default value is true.


For example, the handles property in a slider configuration could be:

```javascript
var sliderConfiguration = {
    ...
    "handles": [{
        "value": 0,
        "label": false,
        "connect": {
            "left": false
        }
    },{
        "value": 25
    },{
        "value": 45,
        "connect": {
            "left": false
        }
    },{
        "value": 85,
        "connect": {
            "right": {
                "color": "brown"
            }
        }
    }
    ...
}
```

#### disabled
It disables the option to change the value of a handle. Additionally, the handle will not be visible. The disabled property is a boolean that is true by default (enabled). For example:

```javascript
var sliderConfiguration = {
    ...
    "handles": [{
        "value": 40,
        "disabled": true,
        "connect": {
            "right": false
        }
    }],
    ...
}
```


### scale
 It defines the total range of values for the slider. It is a required property and its data type is an Object. It has the following properties: range, numberOfValues and density.

#### range
 It is a required property and it is represented by an Object with the min and max properties.
- *min*: it is the smallest value in the scale.
- *max*: it is the biggest value is the scale.

#### numberOfValues
It defines how many values between the scale's min and max values to be displayed.

#### density
 It represents the number of divisions between any two numbers in the scale. It helps as a reference for the possible location of a number in a scale.

For example, the scale property in a slider configuration could be:

```javascript
var sliderConfiguration = {
    ...
    "scale": {
        "range": {
            "min": 0,
            "max": 100
        },
        "numberOfValues": 6,
        "density": 5
    },
    ...
```

### options
It defines additional properties used to define the interaction in the slider. It is an Object with the step, handleDistance and label properties.

#### step
 It represents how many steps will the handle jump before moving to the next value. Its data type is number. If it's 0 (default value), the handle can be moved to values that includes one decimal; for example, from 10.0 to 10.1 and so on. Any step value bigger than 0 will produce an Integer value. For example, a step of value 1 will allow the handle to move from 5 to 6 and a step of value 5 will allow the handle to move from 5 to 10.

#### handleDistance
 It provides the minimum and maximum distance allowed between any two adjacent handles. It is an object composed by the min and max properties.
- *min*: It defines the minimum distance allowed between two adjacent handles.
- *max*: It defines the maximum distance allowed between two adjacent handles.

#### label
 It represents the current value of the handle. It could be a boolean or an Object. If it's set to true, the default value of the handle will be shown. If it's set to false, no label will be shown for any of the handles.

 If it's defined as an Object, it should include the format and unformat callbacks. The object could also include the width property.
  - *format*: Callback that allows to define a new label for all handles. If the formatted label does not fit the assigned width, and its width was defined as a number, then the label will show ellipsis. If the width was defined as "auto", then all label will be shown. The callback will be invoked with the parameters value and index. value represents the current value of the handle and index represents the index of the handle respect to other ones, left to right and starting from 0.
  - *unformat*: Callbacks that returns the value that was passed to the format callback when generating the label. It should be a number. The callback will be invoked with the parameters value and index. value represents the current value of the handle and index represents the index of the handle respect to other ones, left to right and starting from 0.
  - *width*: Defines the maximum width of the label (in pixels) that can be displayed. If all the label should be shown, the value should be "auto".

For example, the options property in a slider configuration could be:

```javascript
var sliderConfiguration = {
    ...
    "options": {
        "step": 1,
        "handleDistance": {
            "min": 2,
            "max": 50
        },
        "label": {
            format: function (value, index) {
                 return "From: " + value;
             },
             unformat: function (value, index) {
                 return value.replace("From: ", "");
             },
            width: 70
       }
    }
    ...
```

For example, a slider widget could be instantiated with the following configuration:

```javascript
    var sliderWidget = new SliderWidget({
        "container": sliderContainer
        "handles": [{
            "value": 0,
            "label": false,
            "connect": {
                "left": false
            }
        },{
            "value": 25
        },{
            "value": 45,
            "connect": {
                "left": false
            }
        },{
            "value": 85,
            "connect": {
                "right": {
                    "color": "purple"
                }
            }
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            },
            "numberOfValues": 6,
            "density": 5
        },
        "options": {
            "step": 5
        }
    });
```

## Methods

###build
Adds the dom elements and events of the slider widget in the specified container. For example:

```
    sliderWidget.build();
```

### destroy
Removes the slider widget from the container.

```
    sliderWidget.destroy();
```

### getValues
Gets the value of the slider widget. It returns an array with all the current values of the slider handles. For example:

```
    sliderWidget.getValues();
```

### setValues
Sets the values of the handles in the slider widget. The input parameter is an array with the values to be assigned to each handle in the order that are shown in the slider (left to right). The value could be null for no change in the handle original value. For example:

```
    sliderWidget.setValues([11, 20, 28]);
```

## Events

### handleValueUpdated
It is triggered every time a slider value is changed by moving a handle. The returned object is composed by the handle position (handle property) that was moved and the array with all the current values of the slider handles (values property). For example:


```javascript
    sliderContainer.bind("slipstreamSlider.handleValueUpdated", function (e, valueObj){
       console.log(valueObj);
    });
```

## Usage
To include a slider widget, define at least the container, sections (handles), and scale (range). For example:

```
    new SliderWidget({
        "handles": [{
           "value": 5
        },{
           "value": 8
        }]
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            }
        }
    }).build();
```