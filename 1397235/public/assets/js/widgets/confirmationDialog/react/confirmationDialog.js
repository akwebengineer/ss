/**
 * A module that builds a Confirmation Dialog React component using the Confirmation Dialog widget
 * The configuration is included as a part of the Confirmation Dialog element properties
 *
 * @module ConfirmationDialog
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'prop-types',
    'widgets/confirmationDialog/confirmationDialogWidget'
], function (React, ReactDOM, PropTypes, ConfirmationDialogWidget) {

    let additionalProps = {};
    class ConfirmationDialog extends React.Component {

        constructor(props) {
            super(props);
            this.yesHandler = this.yesHandler.bind(this);
            this.noHandler = this.noHandler.bind(this);
            this.cancelHandler = this.cancelHandler.bind(this);
        }

        yesHandler(doNotShowAgain) {
            this.callback["yes"](doNotShowAgain, this.confirmationDialogWidget.destroy);
        }

        noHandler() {
            this.callback["no"](this.confirmationDialogWidget.destroy);
        }

        cancelHandler() {
            this.callback["cancel"](this.confirmationDialogWidget.destroy);
        }
        componentDidMount() {
            this.callback = {};
            var title = this.refs.Title;
            var question = this.refs.Question;
            var doNotShowAgainMessage = this.refs.DoNotShowAgainMessage;
            var yesButtonLabel = this.refs.Yes;
            var noButtonLabel = this.refs.No;
            var cancelLinkLabel = this.refs.Cancel;

            if(title)
                additionalProps["title"] = title.refs.Title.getContent().innerHTML;
            if(question)
                additionalProps["question"] = question.refs.Question.getContent().innerHTML;
            if(doNotShowAgainMessage)
                additionalProps["doNotShowAgainMessage"] = doNotShowAgainMessage.refs.DoNotShowAgainMessage.getContent().innerHTML;
            if(yesButtonLabel) {
                additionalProps["yesButtonCallback"] = this.yesHandler;
                additionalProps["yesButtonLabel"] = yesButtonLabel.getValue();
                this.callback["yes"] = yesButtonLabel.getOnClick();
            }
            if(noButtonLabel) {
                additionalProps["noButtonCallback"] = this.noHandler;
                additionalProps["noButtonLabel"] = noButtonLabel.getValue();
                this.callback["no"] = noButtonLabel.getOnClick();
            }
            if(cancelLinkLabel) {
                additionalProps["cancelLinkCallback"] = this.cancelHandler;
                additionalProps["cancelLinkLabel"] = cancelLinkLabel.refs.Cancel.getContent().innerHTML;
                this.callback["cancel"] = cancelLinkLabel.getOnClick();
            }

            this.confirmationDialogWidget = new ConfirmationDialogWidget({
                ...this.props,
                ...additionalProps
            }).build();
        }

        componentWillUnmount() {
            this.confirmationDialogWidget.destroy();
        }

        render() {
            return (<div className="confirmationDialog-component" ref="parent">
                        {
                            React.Children.map(this.props.children, child => {
                                return React.cloneElement(child,{
                                    ref: child.type.displayName
                                })
                            })
                        }
                    </div>);
        }

    }

    ConfirmationDialog.propTypes = {
        kind: PropTypes.string
    };

    class Content extends React.Component {
        getContent() {
            return this.refs.title;
        }

        render() {
            return <span ref="title">{this.props.children}</span>;
        }
    }

    class Title extends React.Component {
        render() {
            return (<Content ref="Title">{this.props.children}</Content>);
        }
    }
    Title.displayName = "Title";
    ConfirmationDialog.Title = Title;

    class Question extends React.Component {
        render() {
            return (<Content ref="Question">{this.props.children}</Content>);
        }
    }
    Question.displayName = "Question";
    ConfirmationDialog.Question = Question;

    class DoNotShowAgainMessage extends React.Component {
        render() {
            return (<Content ref="DoNotShowAgainMessage">{this.props.children}</Content>);
        }
    }
    DoNotShowAgainMessage.displayName = "DoNotShowAgainMessage";
    ConfirmationDialog.DoNotShowAgainMessage = DoNotShowAgainMessage;

    class Yes extends React.Component {
        getValue() {
            return this.props.value;
        }
        getOnClick() {
            return this.props.onClick;
        }
        render() {
            return null;
        }
    }
    Yes.displayName = "Yes";
    ConfirmationDialog.Yes = Yes;

    class No extends React.Component {
        getValue() {
            return this.props.value;
        }
        getOnClick() {
            return this.props.onClick;
        }
        render() {
            return null;
        }
    }
    No.displayName = "No";
    ConfirmationDialog.No = No;

    class Cancel extends React.Component {
        getOnClick() {
            return this.props.onClick;
        }
        render() {
            return (<Content ref="Cancel">{this.props.children}</Content>);
        }
    }
    Cancel.displayName = "Cancel";
    ConfirmationDialog.Cancel = Cancel;

    return ConfirmationDialog;

});