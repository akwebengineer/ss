# Overlay React Component


## Introduction
Overlay is a reusable graphical user interface that renders content in a layer on top of a page. It provides a way for the user of an application to access additional information without leaving the current page or loading a new page. It is modal which disables the original page beneath the overlay and requires acknowledgement from the user. User needs to take an action or cancel the overlay until he or she can continue interacting with the original page.

It is configurable; for example, it could be rendered with or without a title, a bottom bar, etc. Overlay can be added to a container programmatically or as a component. The current document describes how to add a overlay as a React component. To add an overlay programmatically, refer to [Overlay Widget](public/assets/js/widgets/overlay/overlayWidget.md)


## API
The Overlay React component gets its configuration from the Overlay properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The Overlay React component has the following properties:

```javascript
 <Overlay
    type = <(required) string, defines the size of the overlay component.>
    height = <(optional) string, defines the height of the overlay component.>
    width = <(optional) string, defines the width of the overlay component.>
    title = <(optional) string, defines the title of the overlay>
    titleHelp = <(optional) Object, adds a help icon next to the title of the overlay.>
    okButton = <(optional) boolean, if it is set to true, a OK button will be added at the bottom bar of the overlay. default: false>
    cancelButton = <(optional) boolean, if it is set to true, a cancel link will be added at the bottom bar of the overlay. default: false>
    showBottombar = <(optional) boolean, if it is set to true, the bottom bar (optionally, with the cancel link and the OK button) will be shown. default: false>
    beforeCancel = <(optional) function, callback that is invoked when the ESC key or cancel link is invoked. If it returns false, then the overlay won't be closed.>
    cancel = <(optional) function, callback that is invoked when the ESC key or cancel link is invoked.>
    beforeSubmit = <(optional) function, callback that is invoked when the user press the enter key or clicks a submit button.>
    submit = <(optional) function, callback that is invoked when the OK button is clicked.>
    class = <(optional) string, defines the CSS classes that could be used to change the border or button colors of the overlay component.>
>
```

For example, a overlay component could be rendered with the following element:

```javascript
   <Overlay
        class="test_overlay_widget"
        type="small"
        title="Overlay Title"
        titleHelp={{
                content: "Tooltip for the title of Overlay",
                ua-help-identifier: "alias_for_title_ua_event_binding",
                ua-help-text: "More..."
            }}
        okButton={true}
        cancelButton={true}
  >
      //content to be rendered on the overlay component
      <div>This is the overlay content</div>
  </Overlay>
```

###type
Optional attribute that is used to display the overlay in center of screen with the defined size. The accepted sizes are:
fullpage - occupies the full page
xlarge | wide - width(1100px); min-height(570px) to max-height(90vh)
large - width(940px); min-height(460px) to max-height(90vh)
medium - width(780px); min-height(460px) to max-height(90vh)
small - width(620px); min-height(350px) to max-height(90vh)
xsmall - width(460px); min-height(150px) to max-height(90vh)
If type is not provided, then height and width should be available.

### height
Optional attribute; string that represents the height of the overlay. Only available if type is not defined.

### width
Optional attribute; string that represents the width of the overlay. Only available if type is not defined.

### title
Adds a title to the overlay.

### titleHelp
Adds a help icon next to the title of the overlay. When the icon is hovered, then a tooltip shows with the content and the link defined in the two following parameters:

- ***content***
Defines the content of the tooltip.

- ***ua-help-identifier***
Adds an alias for user assistance event binding.

- ***ua-help-text***
Assign the text for the ua-help-identifier link.

### okButton
Optional attribute; accepted values: true / false; default value: false; used to show/hide the OK button in the bottom-right corner (after Cancel button) of overlay, which can be used to close the current overlay.

### cancelButton
Optional attribute; accepted values: true / false; default value: false; used to show/hide the Cancel button in the bottom-right corner of overlay, which can be used to close the current overlay.

### showBottombar
Optional attribute; accepted values: true / false; default value: false; used to show/hide the bottom bar of the overlay.

### beforeCancel
 Optional callback function. This method will be called when the user hits ESC, clicking on the cancel button or clicking outside the modal. It can return 'true' or 'false'. Cancel() method will not be invoked only if it returns 'false'.

### cancel
Optional callback function. This method is called when the user clicks on the cancel button.

### beforeSubmit
Optional callback function. This will be called when the user hits ENTER or clicking on the submitEl. It can return 'true' or 'false'. Submit() will not be invoked only if it returns 'false'. For example, this can be used for any validations before submit.

### submit
Optional callback function. This method is called when the user clicks the ok button.

### class
Optional attribute; it represents the CSS classes that will be added to wrapper container of the the overlay. This class name represents the namespace and can be used to access the border and button classes within the overlay and set border or change button color. For example if the class is "test-overlay-widget", then the selector that can be used to change the border of the overlay is:

.test-overlay-widget .overlay-wrapper

and to change the properties of the button in the overlay, the selector that can be used is as follows-

.test-overlay-widget .slipstream-primary-button

Many modifications other than the border and button can be made using different selectors.


## Usage
To include a overlay component, define it with at least the id and name and then render it using React standard methods. For example:

```javascript
    <Overlay
        title="Overlay Title"
        type="large"
        okButton={true}
    >
        <div>A basic content</div>
    </Overlay>
```

The following example shows how the overlay component can be used in the context of a React application:

```javascript
    var OverlayComponentView = function (options) {
        this.el = document.createElement("div");

        this.render = function() {
            ReactDOM.render(
                <Overlay {...options.overlayConfiguration} >
                    <Content {...options.contentConfiguration}/>
                </Overlay>
                , this.el);
        };

    };
```

where options is an Object with two properties: overlayConfiguration and contentConfiguration. overlayConfiguration contains all the properties required to configure the component while contentConfiguration could be an object that represents all properties required to generate the overlay content. For example, overlayConfiguration could be:

```
{
    class: "test_overlay_widget overlayCustomButton",
    beforeSubmit: beforeSubmitCallback,
    submit: submitCallback,
    beforeCancel: beforeCancelCallback,
    cancel: cancelCallback,
    cancelButton: true,
    class: "test_overlay_widget overlayCustomButton",
    okButton: true,
    title: "<span class='errorImg'></span> Overlay Title",
    titleHelp: {
            content: "Tooltip for the title of Overlay",
            ua-help-identifier: "alias_for_title_ua_event_binding",
            ua-help-text: "More..."
        },
    type: "medium"
}
```