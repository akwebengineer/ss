/**
 * A stateful React component that creates an input field in a form and includes pattern validation required to validate a form
 *
 * @module Input
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/form/react/lib/util'
], function (React, ReactDOM, Util) {

    class Input extends React.Component {
        getType(pattern) {
            let validationType;
            if (pattern.length == 1) {
                validationType = pattern[0];
            }
            switch (validationType) {
                case "email":
                    return "email";
                case "url":
                    return "url";
                case "time":
                    return "time";
                case "date":
                case "afterdate":
                case "beforedate":
                    return "date";
                default:
                    return "text";
            }
        }

        getValidation(pattern) {
            switch (pattern.length) {
                case 0:
                    return;
                case 1:
                    return {"data-validation": pattern};
                default:
                    return {"data-validation": "multiple"};
            }
        }

        getValidationMessages(patternMessages) {
            var validationMessages = {};
            if (patternMessages.length > 1) {
                patternMessages.forEach(function (patternMessage, index) {
                    validationMessages["data-validation_" + (index+1) + "_" + patternMessage.property] = patternMessage.value;
                });
            }
            return validationMessages;
        }
        render() {
            const {children, pattern, ...props} = this.props,
                type = this.getType(pattern),
                validation = this.getValidation(pattern),
                validationMessages = this.getValidationMessages(this.props.patternmessages);
            return (
                <input
                    type={type}
                    {...validation}
                    {...validationMessages}
                    {...props}
                />
            )
        }
    }

    Input.displayName = "FieldControl";

    return Input;

});