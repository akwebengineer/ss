# Slider React Component


## Introduction
The slider widget is a reusable graphical user interface that renders a bar with one or multiple handles that allows to select one or more range of values.
The slider can be added to a container programmatically or as a component. The current document describes how to add a slider as a React component. To add a slider programmatically, refer to [Slider Widget](public/assets/js/widgets/slider/sliderWidget.md)


## API
The slider React component gets its configuration from the Slider properties. It should include a SliderHandle component for each of the handles in the slider. SliderHandle component is added a component child of the Slider component. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The Slider React component has the following properties:

```javascript
<Slider
    scale = <(required) Object, defines the parameter required to render a scale at the bottom of the slider>
    step = <(optional) number, how many steps will the handle jump before moving to the next value>
    handleDistance = <(optional) Object, defines the minimum and maximum distance allowed between any two adjacent handles>
    label = <(optional) Object, defines the current value of each handle>
    onChange = <(optional) function, callback that is invoked when a slider handle changes value>
>
```

The SliderHandle React component has the following properties:

```javascript
<SliderHandle
    value = <(required) string, defines the value assigned to the handle>
    connect = <(required) Object, defines the handle bar connector>
    label = <Object, defines the description of each handle>
    disabled = <boolean, defines if the handle value can not be updated>
>
```

For example, a slider component could be rendered with the following element:

```javascript
    <Slider scale={scaleConfiguration}>
      <SliderHandle value={0}/>
      <SliderHandle value={25}/>
      <SliderHandle value={45}/>
    </Slider>
```

where scaleConfiguration could be an Object already defined as:

```javascript
    let scaleConfiguration = {
        range: {
          min: 0,
          max: 100
        }
    }
```

## Slider Component Properties

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
<Slider
    scale={{
        "range": {
            "min": 0,
            "max": 100
        },
        "numberOfValues": 6,
        "density": 5
    }}
    ...
>
    <SliderHandle value={0}/>
    <SliderHandle value={25}/>
    <SliderHandle value={45}/>
</Slider>
```



### step
 It represents how many steps will the handle jump before moving to the next value. Its data type is number. If it's 0 (default value), the handle can be moved to values that includes one decimal; for example, from 10.0 to 10.1 and so on. Any step value bigger than 0 will produce an Integer value. For example, a step of value 1 will allow the handle to move from 5 to 6 and a step of value 5 will allow the handle to move from 5 to 10.

### handleDistance
 It provides the minimum and maximum distance allowed between any two adjacent handles. It is an object composed by the min and max properties.
- *min*: It defines the minimum distance allowed between two adjacent handles.
- *max*: It defines the maximum distance allowed between two adjacent handles.

### label
 It represents the current value of the handle. It could be a boolean or an Object. If it's set to true, the default value of the handle will be shown. If it's set to false, no label will be shown for any of the handles.

 If it's defined as an Object, it should include the format and unformat callbacks. The object could also include the width property.
  - *format*: Callback that allows to define a new label for all handles. If the formatted label does not fit the assigned width, and its width was defined as a number, then the label will show ellipsis. If the width was defined as "auto", then all label will be shown. The callback will be invoked with the parameters value and index. value represents the current value of the handle and index represents the index of the handle respect to other ones, left to right and starting from 0.
  - *unformat*: Callbacks that returns the value that was passed to the format callback when generating the label. It should be a number. The callback will be invoked with the parameters value and index. value represents the current value of the handle and index represents the index of the handle respect to other ones, left to right and starting from 0.
  - *width*: Defines the maximum width of the label (in pixels) that can be displayed. If all the label should be shown, the value should be "auto".

For example, the options property in a slider configuration could be:

```javascript
<Slider
    step={1},
    handleDistance={{
        min: 2,
        max: 50
    }},
    label={{
        format: function (value, index) {
             return "From: " + value;
         },
         unformat: function (value, index) {
             return value.replace("From: ", "");
         },
        width: 70
    }}
    ...
>
    <SliderHandle value={0}/>
    <SliderHandle value={25}/>
    <SliderHandle value={45}/>
</Slider>
```

### onChange
It defines the callback that will be invoked when the value of the slider handle is updated; i.e. when the handle is dragged from one position and dropped to a new position.


## SliderHandle Component Properties
It defines the handles in a slider and it should be defined as a child of the Slider component. It is a required property and each SliderHandle component is defined by the value of the handle, the label assigned to the handle, if it is disabled and the connection of the handle. Each SliderHandle component could have the following properties:

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
    <Slider {...sliderConfiguration}>
        <SliderHandle
            value={0}
            label={false}
            connect={{
                left: false
            }}
        />
        <SliderHandle value={25}/>
        <SliderHandle
            value={45}
            label={false}
            connect={{
                "right": {color: "brown"}
            }}
        />
    </Slider>
```

#### disabled
It disables the option to change the value of a handle. Additionally, the handle will not be visible. The disabled property is a boolean that is true by default (enabled). For example:

```javascript
    <Slider {...sliderConfiguration}>
        <SliderHandle
            value={0}
            disabled={true}
            connect={{
                right: false
            }}
        />
        <SliderHandle value={25}/>
    </Slider>
```

## Usage
To include a Slider component, define it with at least the scale property and at least one SliderHandle component then render it using React standard methods. For example:

```javascript
    <Slider
        scale={{
            range: {
                min: 0,
                max: 100
            }
        }}
    >
        <SliderHandle value={25}/>
    </Slider>
```

The following example shows how the slider component can be used in the context of a React application:

```javascript
   define([
       'react',
       'react-dom',
       'es6!widgets/slider/react/slider',
   ], function (React, ReactDOM, SliderComponent) {

           const Slider = SliderComponent.Slider,
               SliderHandle = SliderComponent.SliderHandle;

           class SliderApp extends React.Component {

               constructor(props) {
                   super(props);
                   this.state = {
                       value: [5, 8],
                       scale: {
                           range: {
                               min: 0,
                               max: 10
                           }
                       }
                   };
                   this.onChange = this.onChange.bind(this);
                   this.getValue = this.getValue.bind(this);
               }

               onChange(e, data) {
                   this.setState({value: data.values});
                   console.log(data);
               }

               getValue(e) {
                   console.log(this.state.value);
               }

               render() {
                   return (
                       <div>
                           <Slider
                               scale={this.state.scale}
                               onChange={this.onChange}
                           >
                               <SliderHandle value={this.state.value[0]}/>
                               <SliderHandle value={this.state.value[1]}/>
                           </Slider>
                           <div className="slider-buttons">
                               <span className="slipstream-primary-button" onClick={this.getValue}>Get Value</span>
                           </div>
                       </div>
                   );
               }
           }

       return SliderApp;

   });
```

To render the Slider, use the standard React methods:

```
    ReactDOM.render(<SliderApp/>, pageContainer); //where pageContainer represents where the Slider will be rendered
```