# Slider

The slider is a reusable graphical user interface that renders a bar with one or multiple handles and allows to select one or more range of values. It is configurable; for example, it could define the number of handles, the value assigned to them, the scale of the slider bar, etc. The slider can be added to a container programmatically (widget) or as a component (React).


## Widget
The slider is added to a container by creating an *instance* of the slider widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the slider will be built. For example, to add the slider in the testContainer container:

```javascript
    new SliderWidget({
      container: sliderContainer
          handles: [{
              value: 0
          },{
              value: 25
          },{
              value: 45
          }],
          scale: {
              range: {
                  min: 0,
                  max: 100
              }
          }
    }).build();
```

Any update required after the slider is built can be done using the methods exposed by the widget.

More details can be found at [Slider Widget](public/assets/js/widgets/slider/sliderWidget.md)


## React
The slider can be rendered using the Slider *component* and the SliderHandle component (its children) and configured using a set of properties. For example, to include the slider, add the components:

```javascript
    <Slider
        scale={{
            range: {
                min: 0,
                max: 100
            }
        }}
    >
        <SliderHandle value={0}/>
        <SliderHandle value={25}/>
        <SliderHandle value={45}/>
    </Slider>
```
and then render and update its state using standard React methods. 

More details can be found at [Slider React Component](public/assets/js/widgets/slider/react/slider.md)