/**
 * A view that uses a render a Spinner widget on form widget for remote Validation
 *
 * @module SpinnerBuilder
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/spinner/spinnerWidget',
    'lib/template_renderer/template_renderer',
    'text!widgets/form/templates/spinnerLoader.html',
    'text!widgets/spinner/templates/loadingBackground.html',
], function(Backbone, SpinnerWidget, render_template, spinnerLoader, LoadingBackgroundTemplate){
    var SpinnerView = function() {


        /**
         * Adds Spinner to the Form widget while validating remote validation fields
         * @param {string} id is the container id to which spinner is added
         */
        this.showSpinner = function(id){
            this.spinner = new SpinnerWidget({
                container: "#"+id
            }).build();
        };

        /**
         * Adds Spinner to the Form widget while validating remote validation fields
         * @param {string} id is the container id to which spinner is added
         */
        this.showSpinnerInInputField = function(inputField, loaderId){
            if(inputField.siblings(".slipstream-input-spinner").length==0) {
                inputField.after(render_template(spinnerLoader, {id: loaderId}));
                if (!spinnerExists(inputField, loaderId)) {
                    this.showSpinner(loaderId);
                }
            }
        };

        /**
         * Adds Spinner to the Form
         * @param {string} id is the form container id to which spinner is added
         * @param {object} formTemplate is form element on which the spinner needs to be added
         */
        this.showSpinnerInForm = function(spinnerContainer, formTemplate){
            this.showSpinner(spinnerContainer);
            formTemplate.append(LoadingBackgroundTemplate);
        };
        /**
         * Removes Spinner from the Form
         * @param {object} formTemplate is form element on which the spinner needs to be added
         */
        this.removeSpinnerFromForm = function(formTemplate) {
            this.close();
            formTemplate.find('.slipstream-indicator-background').remove();
        };
        var spinnerExists = function(inputField, loaderId) {
            var spinnerContainer = inputField.find("#"+loaderId+" .indeterminateSpinnerContainer");
            if(spinnerContainer.length == 0){
                return false;
            }
            return true;
        };

        this.close = function(){
            this.spinner.destroy();
        };
    };

    return SpinnerView;
});