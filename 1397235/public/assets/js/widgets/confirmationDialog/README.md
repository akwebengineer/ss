# Confirmation Dialog Widget
A confirmation dialog widget is an overlay programmed to perform the task of providing a uniform way to plugin developers to write Yes/No kind of confirmation dialogs. The confirmation dialog widget uses the Slipstream overlay widget underneath and hence always renders on top of the current content on the page, disabling any clicks outside the area of the widget. The confirmation dialog can be added to a container programmatically or as a component.


## Programmatic -new ConfirmationDialogWidget(conf)-
The confirmation dialog is shown by creating an *instance* of the confirmation dialog widget and then building it. During the instantiation, all the options required to configure the widget should be passed. For example, to add the confirmation dialog in the testContainer container:

```javascript
    new ConfirmationDialogWidget({
         title: 'Test Confirmation Dialog',
         question: 'Are you sure you want to respond Yes to this question?',
         yesButtonLabel: 'Yes',
         noButtonLabel: 'No',
         kind: 'warning'
     }).build();
```

Any update required after the confirmation dialog is built can be done using the methods exposed by the widget.

More details can be found at [ConfirmationDialog Widget](public/assets/js/widgets/confirmationDialog/confirmationDialogWidget.md)


## Component Based -React: <ConfirmationDialog>-
The confirmation dialog can be added to a container/page using the Confirmation Dialog component. Currently, there is support for *React* components only; therefore, a ConfirmationDialog component should be rendered on the container using React. For example, to include the confirmation dialog, add the component:

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

Any update needed after the confirmation dialog is rendered can be done using the properties of a React component.

More details can be found at [ConfirmationDialog React Component](public/assets/js/widgets/confirmationDialog/react/confirmationDialog.md)