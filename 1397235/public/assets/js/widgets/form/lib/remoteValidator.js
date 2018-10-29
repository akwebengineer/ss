/**
 * A module that implements remote validation by calling a REST API that will test the input data. An event is triggered the validation has been completed.
 *
 * @module RemoteValidator
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/form/lib/spinnerBuilder'
], /** @lends RemoteValidator */
    function(SpinnerBuilder){

    /**
     * @class RemoteValidator
     */
    var RemoteValidator = function(){

        var valid;
        /**
         * Tests if an HTML input element has a valid value by invoking a REST API.
         * The API call is asynchronous and it is expected to return true if the value is 'valid' or 'false' if it is invalid.
         * The configuration object consists of the element that requires validation (el) and the parameters to call the API (remote).
         * @param {Object} remote - configuration required to test if the element is valid. It consists of:
         * url: it represents the REST API to be called; in case the url needs to be composed by the input data, a callback function can be defined instead of the string. The url callback function is invoked with the value of the element that needs validation.
         * type:  the type of request to make ("POST","GET","PUT","DELETE")
         * response: a callback function that can be used to reformat the API response to comply with the expected return value of 'true' or 'false'. The response callback function is invoked with two parameters: the status of the response and the response text. It is called once the API request is completed.
         *
         * or optionally,
         *
         * @param {Object} remote - can be a callback function that can be used for remote validation
         * @param {Object} el - element that needs validation
         * @param {function} removeErrorFunction - reference to removeErrorMessage function in formValidatorLib
         * @returns {boolean} true if the element validation is valid, false if the elements fails the validation.
         * A custom event with a name composed by the "remote_" and the id of the element will be triggered with the true/false data if the value was valid or invalid.
         */
        this.validateDataOnRemote = function (remote, el, removeErrorFunction){
            var defer = addSpinnerAndShowValidating(el, removeErrorFunction);
            if(typeof(remote) == "function"){
                remote(el, function(isValid, errorMsg) {
                    if(_.isEqual(isValid,false)) {
                        remote.error = errorMsg;
                    }
                    valid = isValid;
                    defer.resolve();
                });

            }
            else {
                var url = remote.url;
                if (typeof(url) == "function")
                    url = url(el.value, el);
                $.ajax({
                    url: url,
                    headers: remote.headers,
                    type: remote.type,
                    context: remote,
                    complete: function (e, xhr, settings) {
                        var formatResponse = this.response,
                            isValid = e.responseText;
                        if (formatResponse) {
                            isValid = formatResponse(e.status, e.responseText);
                        }
                        if(!_.isBoolean(isValid)){
                            isValid = _.isEqual(isValid,"true");
                        }
                        valid = isValid;
                        defer.resolve();
                    }
                });
            }
        };


        /**
         * Adds a spinner while the remote validation processes & disables submit button
         * @param {Object} el - element that needs validation
         * @param {function} removeErrorFunction - reference to removeErrorMessage function in formValidatorLib
         * @returns {Object} promise object
         */
        var addSpinnerAndShowValidating = function(el, removeErrorFunction){
            var isPromiseDone = false,
                $el = $(el),
                defer = $.Deferred(),
                loaderId = el.id+"-loader",
                spinnerView = new SpinnerBuilder(),
                hasFocus = false;
            $el.show(function () {
                if(!isPromiseDone) {
                    var remoteValidationField = $(this);
                    spinnerView.showSpinnerInInputField($el, loaderId);
                    if(removeErrorFunction)
                        removeErrorFunction(el);
                    hasFocus = $el.is(":focus");
                    remoteValidationField.attr('disabled', 'disabled');
                    if (!remoteValidationField.hasClass("isActiveRemote")) {
                        remoteValidationField.addClass("isActiveRemote");
                    }
                    remoteValidationField.trigger('slipstreamForm.validation:remote:spinner', $el.siblings("#" + loaderId).find(".indeterminateSpinnerContainer"));
                }
            });
            $.when(defer).done(function () {
                var loadingSpan = $el.siblings("span.slipstream-input-spinner");
                loadingSpan.remove();
                $el.removeAttr('disabled');
                isPromiseDone = true;
                if(hasFocus) {
                    $el.focus();
                }
                $el.trigger('remote_' + el.id, valid);
            });
            return defer;
        };
    };

    return RemoteValidator;
});