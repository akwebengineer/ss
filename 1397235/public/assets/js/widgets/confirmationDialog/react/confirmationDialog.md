# ConfirmationDialog React Component


## Introduction
A confirmation dialog widget is an overlay programmed to perform the task of providing a uniform way to plugin developers to write Yes/No kind of confirmation dialogs. The confirmation dialog widget uses the Slipstream overlay widget underneath and hence always renders on top of the current content on the page, disabling any clicks outside the area of the widget. The confirmation dialog can be added to a container programmatically or as a component.
The current document describes how to add a confirmation dialog as a React component. To add an confirmation dialog programmatically, refer to [Confirmation Dialog Widget](public/assets/js/widgets/confirmationDialog/confirmationDialogWidget.md)

## Properties
The ConfirmationDialog React component has the following properties:

```javascript
 <ConfirmationDialog
    kind = <String, to indicate the kind of dialog box>
    >
    <ConfirmationDialog.Title>Test Confirmation Dialog</ConfirmationDialog.Title>
    <ConfirmationDialog.Question>Are you sure you want to respond Yes to this question?</ConfirmationDialog.Question>
    <ConfirmationDialog.DoNotShowAgainMessage>Do not show this message again</ConfirmationDialog.DoNotShowAgainMessage>
    <ConfirmationDialog.Yes onClick={this.yesButtonCallback} value="Yes"/>
    <ConfirmationDialog.No onClick={this.noButtonCallback} value="No"/>
    <ConfirmationDialog.Cancel onClick={this.cancelLinkCallback}>Cancel</ConfirmationDialog.Cancel>
 </ConfirmationDialog>
```

For example, a confirmation dialog component could be rendered with the following element:

```javascript
    <ConfirmationDialog
       kind = 'warning'>
       <ConfirmationDialog.Title>Test Confirmation Dialog</ConfirmationDialog.Title>
       <ConfirmationDialog.Question>Are you sure you want to respond <b>Yes</b> to this question?</ConfirmationDialog.Question>
       <ConfirmationDialog.DoNotShowAgainMessage>Do not show this message again</ConfirmationDialog.DoNotShowAgainMessage>
       <ConfirmationDialog.Yes onClick={this.yesButtonCallback} value="Yes"/>
       <ConfirmationDialog.No onClick={this.noButtonCallback} value="No"/>
       <ConfirmationDialog.Cancel onClick={this.cancelLinkCallback}>Cancel</ConfirmationDialog.Cancel>
    </ConfirmationDialog>
```


**kind** - (optional) string to indicate the kind of dialog box. One of the following: 'warning' (displayed with an outline); when not specified no special outline will be shown on the dialog. Use the 'warning' parameter to capture user attention for important confirmation questions. However, if other design changes like border color, button color, title icon change etc are required, please refer to the overlay documentation [Overlay Widget] (public/assets/js/widgets/overlay/overlay.md). 

# ConfirmationDialog.Title Component - (required) text/html to be shown on the title bar of the dialog.

If any icons are added in the html title and application needs them to be themable then, image should be kept in the form of:

```
<svg class="className">
    <use href="svgPath"/>
</svg>
```

where svg image should not have a fill color of its own, and the fill color should be assigned as the default icon color(from theme variables) using className in css.

If the icon is not defined in the above way then, it will not be themable.

Example of ConfirmationDialog.Title component is as follows:

```
<ConfirmationDialog.Title><svg class="errorIcon"><use href="#icon_error"/></svg>Test Confirmation Dialog</ConfirmationDialog.Title>
```

# ConfirmationDialog.Question Component - (required) text/HTML to be asked in the content of the dialog. 

Usually a question like "Are you sure you want to do this?".

Example of ConfirmationDialog.Question component is as follows:

```
<ConfirmationDialog.Question>Are you sure you want to respond <b>Yes</b> to this question?</ConfirmationDialog.Question>
```

# ConfirmationDialog.DoNotShowAgainMessage Component - (optional) text/HTML to be shown for checkbox to ask user whether s/he wants the dialog to be shown again. 

If not passed in, no checkbox and message are shown.
 
Example of ConfirmationDialog.DoNotShowAgainMessage component is as follows:

```
<ConfirmationDialog.DoNotShowAgainMessage>Do not show this message again</ConfirmationDialog.DoNotShowAgainMessage>
```
***Note***: It is the component user's responsibility to keep a track of the parameter sent back if the checkbox was selected.

# ConfirmationDialog.Yes component - (optional) text to be shown on the primary button on the confirmation dialog

The *onClick* is an attribute that holds a function which will be called with a true/false argument - true if the user selected the "do not show again" checkbox, false otherwise and another argument the destroy function.

The *value* is the text to be shown on the primary button

Example of ConfirmationDialog.Yes component is as follows:

```
<ConfirmationDialog.Yes onClick={this.yesButtonCallback} value="Yes"/>
```

Example of yesButtonCallback is as follows:

```
yesButtonCallback(doNotShowAgain, destroy) {
    console.log('Yes button callback called with do not show checkbox', doNotShowAgain? 'selected': 'unselected');
    destroy();
};
```

***Note***: Component needs to be destroyed by calling it's destroy() method in yesButtonCallback function. This is so that the view can show other overlays such as a progress indicator on some action happening and destroy the confirmation dialog once done successfully or unsuccessfully.

# ConfirmationDialog.No component - (optional) text to be shown on the secondary button on the confirmation dialog

The *onClick* is an attribute that holds a function which will be called with an argument that is the destroy function.

The *value* is the text to be shown on the secondary button

Example of ConfirmationDialog.No component is as follows:

```
<ConfirmationDialog.No onClick={this.noButtonCallback} value="No"/>
```

Example of noButtonCallback is as follows:

```
noButtonCallback(destroy) {
    console.log('No button callback called');
    destroy();
};
```

***Note***: Component needs to be destroyed by calling it's destroy() method in noButtonCallback function. This is so that the view can show other overlays such as a progress indicator on some action happening and destroy the confirmation dialog once done successfully or unsuccessfully.

# ConfirmationDialog.Cancel component - (optional) text/HTML to be shown as a cancel link on the confirmation dialog

The *onClick* is an attribute that holds a function which will be called with an argument that is the destroy function.

Example of ConfirmationDialog.Cancel component is as follows:

```
<ConfirmationDialog.Cancel onClick={this.cancelLinkCallback}>Cancel</Cancel>
```

Example of cancelLinkCallback is as follows:

```
cancelLinkCallback(destroy) {
    console.log('Cancel link callback called');
    destroy();
};
```

***Note***: Component needs to be destroyed by calling it's destroy() method in cancelLinkCallback function. This is so that the view can show other overlays such as a progress indicator on some action happening and destroy the confirmation dialog once done successfully or unsuccessfully.

## Usage
To include a ConfirmationDialog component, define it with at least the Title, Question, Yes and then render it using React standard methods. For example:

```javascript
    <ConfirmationDialog
        kind = 'warning'>
        <ConfirmationDialog.Title>Test Confirmation Dialog</ConfirmationDialog.Title>
        <ConfirmationDialog.Question>Are you sure you want to respond <b>Yes</b> to this question?</ConfirmationDialog.Question>
        <ConfirmationDialog.DoNotShowAgainMessage>Do not show this message again</ConfirmationDialog.DoNotShowAgainMessage>
        <ConfirmationDialog.Yes onClick={this.yesButtonCallback} value="Yes"/>
        <ConfirmationDialog.No onClick={this.noButtonCallback} value="No"/>
        <ConfirmationDialog.Cancel onClick={this.cancelLinkCallback}>Cancel</ConfirmationDialog.Cancel>
     </ConfirmationDialog>
```

The following example shows how the confirmation dialog component can be used in the context of a React application:

```javascript
    class ConfirmationDialogApp extends React.Component {
    
            constructor(props) {
                super(props);
                this.yesButtonCallback = this.yesButtonCallback.bind(this);
                this.noButtonCallback = this.noButtonCallback.bind(this);
                this.cancelLinkCallback = this.cancelLinkCallback.bind(this);
            }
            // use either the callback or the trigger. Here both are used only as an example
            yesButtonCallback(doNotShowAgain, destroy) {
                console.log('Yes button callback called with do not show checkbox', doNotShowAgain? 'selected': 'unselected');
    
                // you can do other things here such as open a progress view overlay
    
                // remember to destroy the dialog once done
                destroy();
            };
    
            noButtonCallback(destroy) {
                console.log('No button callback called');
    
                // you can do other things here such as open a progress view overlay
    
                // remember to destroy the dialog once done
                destroy();
            };
    
            cancelLinkCallback(destroy) {
                console.log('Cancel link callback called');
    
                // you can do other things here such as open a progress view overlay
    
                // remember to destroy the dialog once done
                destroy();
            };
            render() {
    
                return (
                    <ConfirmationDialog>
                        <ConfirmationDialog.Title>Test Confirmation Dialog</ConfirmationDialog.Title>
                        <ConfirmationDialog.Question>Are you sure you want to respond <b>Yes</b> to this question?</ConfirmationDialog.Question>
                        <ConfirmationDialog.DoNotShowAgainMessage>Do not show this message again</ConfirmationDialog.DoNotShowAgainMessage>
                        <ConfirmationDialog.Yes onClick={this.yesButtonCallback} value="Yes"/>
                        <ConfirmationDialog.No onClick={this.noButtonCallback} value="No"/>
                        <ConfirmationDialog.Cancel onClick={this.cancelLinkCallback}>Cancel</ConfirmationDialog.Cancel>
                    </ConfirmationDialog>
                );
            }
        }
```