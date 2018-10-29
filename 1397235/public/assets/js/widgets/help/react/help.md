# Help React Component


## Introduction
The help widget is a reusable graphical interface that allows users to show the help on the page. The current document describes how to add a help as a React component. To add a help programmatically, refer to [Help Widget](public/assets/js/widgets/help/helpWidget.md)


## API
The help React component gets its configuration from the Help properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The Help React component has the following properties:

```javascript
 <Help
    size = <(Optional) Define the size of help icon.>
    disabled = <(Optional) boolean, Defines if the state of help icon is disabled. Default: false.>
 >
   {{Content = <(Required) A string or html that represents the content of the help tooltip.>}}
 </Help>
```

The HelpLink React component has the following properties (Optional):

```javascript
<HelpLink
    id = <(Optional) It is used to create the link to an external help page.>
 >
    {{Content = <(Required) The text that will be used as a link to an external help page.>}}
</HelpLink>
```

For example, a help component could be rendered with the following element:

```javascript
<Help>
    Tooltip that shows how to access view help from the Help Widget
    <HelpLink id="alias_for_ua_event_binding">More...</HelpLink>
</Help>
```

## Help Component Properties

### size
It defines the size of help icon. Only "small" size is avaliable. Otherwise, the help widget will use the default size.

### disabled
It defines if the state of help icon is disabled. Default: false.

## HelpLink Component Properties

The HelpLink Compoent is optional for the Help Component.

### id
It defines the [help identifer](https://ssd-git.juniper.net/spog/slipstream/blob/master/docs/help.md) used to create the link to an external help page.

## Usage
To use the help component - 

```javascript
<Help>
    Tooltip that shows how to access view help from the Help Widget
    <HelpLink id="alias_for_ua_event_binding">More...</HelpLink>
</Help>
```

The following example shows how the help component can be used in the context of a React application:

```javascript
    class HelpApp extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (
                <div>
                    <h3>Defaul Size</h3>
                    <ul>
                        <li>Example 1
                            <Help>
                                Tooltip that shows how to access view help from the Help Widget
                                <HelpLink id="alias_for_ua_event_binding">More...</HelpLink>
                            </Help>
                        </li>
                        <li>Example 2
                            <Help>
                                This is an inline help example for example 2
                            </Help>
                        </li>
                    </ul>                    
                </div>
            );
        }
    };

    //render React components
    ReactDOM.render(<HelpApp />, pageContainer); //where pageContainer represents where the Help will be rendered
```