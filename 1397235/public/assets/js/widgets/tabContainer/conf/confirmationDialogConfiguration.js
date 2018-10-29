/**
 * A  configuration object with the parameters required to build a Confirmation Dialog widget
 *
 * @module confirmationDialogConfiguration
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define(['lib/i18n/i18n'], function (i18n) {

    var confirmationDialogConfiguration = {};

    confirmationDialogConfiguration.delete = {
        title: i18n.getMessage('tabcontainer_remove_confirm_title'),
        question: i18n.getMessage('tabcontainer_remove_confirm_message'),
        yesButtonLabel: i18n.getMessage('yes_button_label'),
        noButtonLabel: i18n.getMessage('no_button_label')
    };

    return confirmationDialogConfiguration;

});
