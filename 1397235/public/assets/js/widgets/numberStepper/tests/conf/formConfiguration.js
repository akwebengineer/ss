/**
 * A configuration object with the parameters required to build a form
 *
 * @module formConfiguration
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var formConfiguration = {
        "sections": [
            {
                "elements": [
                    {
                        "element_number": true,
                        "name": "text_number_1",
                        "id": "text_number_1",
                        "label": "With numberStepper false (only Integer)",
                        "numberStepper": false,
                        "error":"Enter a number"
                    },
                    {
                        "element_number": true,
                        "name": "text_number_2",
                        "id": "text_number_2",
                        "label": "With numberStepper true (only Integer)",
                        "required": false,
                        "min_value":"2",
                        "max_value":"8",
                        "error": "Please enter a number between 2 and 8",
                        "value": 4,
                        "numberStepper": true
                    },
                    {
                        "element_number": true,
                        "name": "text_number_3",
                        "id": "text_number_3",
                        "label": "With numberStepper not defined (only Integer)",
                        "required": false,
                        "min_value":"2",
                        "max_value":"8",
                        "error": "Please enter a number between 2 and 8",
                        "value": 4,
                        "numberStepper": true
                    },
                    {
                        "element_float": true,
                        "name": "text_float_3",
                        "id": "text_float_3",
                        "label": "Float type with numberStepper false",
                        "required": false,
                        "min_value":"2",
                        "max_value":"8.5",
                        "error": "Please enter a number between 2 and 8.5",
                        "value": "4.04",
                        "numberStepper": false
                    },
                    {
                        "element_float": true,
                        "name": "text_float_4",
                        "id": "text_float_4",
                        "label": "Float type with numberStepper true",
                        "required": false,
                        "min_value":"2",
                        "max_value":"8.5",
                        "error": "Please enter a number between 2 and 8.5",
                        "value": "4.01",
                        "numberStepper": true
                    },
                    {
                        "element_float": true,
                        "name": "text_float_5",
                        "id": "text_float_5",
                        "label": "Float type with numberStepper not defined",
                        "required": false,
                        "min_value":"2",
                        "max_value":"8.5",
                        "error": "Please enter a number between 2 and 8.5",
                        "value": "4.04",
                        "disabled": true
                    }
                ]
            }
        ],
        "buttons": [
            {
                "id": "get-form-value",
                "name": "get-form-value",
                "value": "Get Values"
            },
            {
                "id": "validate-form-values",
                "name": "validate-form-values",
                "value": "Submit"
            }
        ]
    };

    return formConfiguration;

});
