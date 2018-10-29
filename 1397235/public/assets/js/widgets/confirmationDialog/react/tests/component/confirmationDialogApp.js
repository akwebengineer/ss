/**
 * A view that uses the ConfirmationDialog component (created from the ConfirmationDialog widget) to create a React component from the Confirmation Dialog component so states can be handled by the user of the ConfirmationDialog component
 *
 * @module ConfirmationDialogApp
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/confirmationDialog/react/confirmationDialog'
], function (React, ReactDOM, ConfirmationDialog) {

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

    return ConfirmationDialogApp;

});