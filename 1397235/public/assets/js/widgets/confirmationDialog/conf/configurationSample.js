/**
 * A sample configuration object that shows the parameters required to build a confirmation dialog widget
 *
 * @module configurationSample
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var configurationSample = {};

    configurationSample.simpleConfirmationDialog = {
        title: 'Test Confirmation Dialog',
        // question: 'Are you sure you want to respond Yes to this question? <br /> <br /> Are you sure you want to respond Yes to this question?<br /> <br /> Are you sure you want to respond Yes to this question?<br /> <br /> Are you sure you want to respond Yes to this question?<br /> <br /> Are you sure you want to respond Yes to this question?<br /> <br /> Are you sure you want to respond Yes to this question?<br /> <br /> Are you sure you want to respond Yes to this question?',
        question: 'Are you sure you want to respond Yes to this question?',
        yesButtonLabel: 'Yes',
        noButtonLabel: 'No',
        cancelLinkLabel: 'Cancel',
        yesButtonTrigger: 'yesEventTriggered',
        noButtonTrigger: 'noEventTriggered',
        cancelLinkTrigger: 'cancelEventTriggered',
        // kind: 'warning',
        doNotShowAgainMessage: 'Do not show this message again'
    };

    return configurationSample;

});