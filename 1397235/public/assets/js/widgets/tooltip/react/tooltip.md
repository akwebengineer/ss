# Tooltip React Component


## Introduction
The Tooltip widget is a reusable graphical user interface that allows users to show a tooltip in the selected container. 
The current document describes how to add a tooltip as a React component. To add a tooltip programmatically, refer to [Tooltip Widget](public/assets/js/widgets/tooltip/tooltipWidget.md)


## API
The tooltip React component gets its configuration from the tooltip properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The tooltip React component has the following properties:

```javascript
 <Tooltip
    minWidth = <(optional) number, set a minimum width for the tooltip. Default: 0 (auto width).>
    maxWidth = <(optional) number, set a maximum width for the tooltip. Default: null (no max width).>
    offsetX = <(optional) number, offsets the tooltip (in pixels) farther left/right from the origin. Default: 0.>
    offsetY = <(optional) number, offsets the tooltip (in pixels) farther up/down from the origin. Default: 0.>
    position = <(optional) string, set the position of the tooltip. Default: 'top'.>
    interactive = <(optional) boolean, gives users the possibility to interact with the content of the tooltip.>
    disabled = <(optional) boolean, defines if the state of tooltips is disabled. Default: false.>
    onlyOne = <(optional), if we only want one tooltip open at a time. Default: false.>
    trigger = <(optional) string, indicates when tooltip should open.>
    contentCloning = <(optional) boolean, indicates if it is a clone of this object that should actually be used. Default: false.>
    functionBefore = <(optional) function, callback invoked before the tooltip opens.>
    functionReady = <(optional) function, callback invoked when the tooltip and its contents have been added to the DOM.>
>
    {content} <(required), define the tooltip content.> 
</Tooltip>
```

For example, a tooltip component could be rendered with the following element:

```javascript
let content = (
    <span>This is my tooltip.</span>
);

<span>
    Tooltip on hover over the text
    <Tooltip>
        {content}
    </Tooltip>
</span>
```
When hovering on its parent container, which is <span> in this example, the tooltip will be generated.

### content
It defines the content of the tooltip. 

### minWidth
It defines a minimum width for the tooltip. Default: 0 (auto width).

### maxWidth
It defines a maximum width for the tooltip. Default: null (no max width).

### offsetX
It defines the offset of the tooltip (in pixels) that is left/right from the origin. Default: 0.

### offsetY
It defines the offset of the tooltip (in pixels) that is up/down from the origin. Default: 0.

### position
It defines the position of the tooltip. Default: 'top'.
Option: 'top', 'bottom', 'right', 'left'

### interactive
It gives users the possibility to interact with the content of the tooltip. Default: false.
If users are able to make clicks, fill forms or do other interactions inside the tooltip, have to set this option to true.

### disabled
It defines if the state of tooltips is disabled. Default: false.

### onlyOne
If we only want one tooltip open at a time, close all tooltips currently open and not already disappearing. Default: false.

### trigger
It defines when tooltip should open. Default: 'hover'. 
When the trigger is 'click', the close icon for tooltips will be available.
Option: 'hover', 'click'

### contentCloning
If you provide a jQuery object to the 'content' option, this sets if it is a clone of this object that should actually be used. Default: false

### functionBefore
It defines a custom callback to be invoked before the tooltip opens. This function may prevent or hold off the opening. Default: function(origin, continueTooltip) { continueTooltip(); }
 - origin: it's the HTML element on which the tooltip is set.
 - continueTooltip: a tooltip callback method to continue display the tooltip content.

### functionReady
It defines a custom callback to be invoked when the tooltip and its contents have been added to the DOM. Default: function(origin, tooltip) {}
 - origin: it's the HTML element on which the tooltip is set.
 - tooltip: it's the root HTML element of the tooltip.

## Usage
To use the tooltip component -

```javascript
let content = (
    <span>This is my tooltip.</span>
);

<span>
    Tooltip on hover over the text
    <Tooltip>
        {content}
    </Tooltip>
</span>
```

The following example shows how the Tooltip component can be used in the context of a React application:

```javascript
//creates a React component from the tooltip component
class TooltipApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "This is my link's tooltip message!",
            disabled: false
        };
        this.enable = this.enable.bind(this);
        this.disable = this.disable.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }

    enable() {
        this.setState({
            disabled: false
        });
    }

    disable() {
        this.setState({
            disabled: true
        });
    }

    updateContent(){
        this.setState({
            content: "This is new content!"
        });
    }

    render() {
        return (
            <div>
                <ol>
                    <li>
                        Tooltip with simple text on the link:
                        <a href="http://google.com" id="testLink"> Test of a link 
                            <Tooltip
                                {...this.state}
                                position = "top"
                            >
                                <div>{this.state.content}</div>
                                <div className = {this.state.className}>More content</div>
                            </Tooltip>
                        </a>
                    </li>
                    <li>
                        <span>
                            Tooltip with link on hover over the text
                            <Tooltip>
                                <span>
                                    This text is in bold case 
                                    <a href="http://www.google.com">somelink</a>
                                </span>
                            </Tooltip>
                        </span>
                    </li>
                </ol>
                <span className="slipstream-primary-button" onClick={this.enable}>Enable #1</span>
                <span className="slipstream-primary-button" onClick={this.disable}>Disable #1</span>
                <span className="slipstream-primary-button" onClick={this.updateContent}>Update Content #1</span>
            </div>
        );
    }
};

//render React components
ReactDOM.render(<TooltipApp />, this.el);
```