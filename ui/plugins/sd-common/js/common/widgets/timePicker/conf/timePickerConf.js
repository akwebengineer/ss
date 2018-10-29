/**
 * A configuration object with the parameters required to build Time Picker Widget
 *
* @module sd-common (Time Picker Widget)
* @author Shini <shinig@juniper.net>
* @copyright Juniper Networks, Inc. 2016
**/

define([ ],
    function() {

        var TimePickerConfiguration = function(conf) {

        this.getValues = function() {

            var duration_unit =[];
            if(conf.units)
            {
                for( var i in conf.units)
                {
                    duration_unit.push({
                        "text": conf.units[i],
                        "id": conf.units[i]
                    });
                }
            }
            return {
            "form_id": "time-picker-form_id",
            "form_name": "time-picker-form",
            "sections": [
            {
                "section_id": "add-time-span",
                "elements": [
                {
                    "element_number": true,
                    "id": "duration",
                    "name": "duration",
                    "label": "Last",
                    "min_value":"1",
                    "max_value":"1000000000",
                    "placeholder": "",
                    "notshowrequired": true,
                    "value": "1",
                    "error": "",
                    "class":"duration-element-input left"
                },{
                    "element_dropdown": true,
                    "id": "duration-unit",
                    "name": "duration-unit",
                    "label": "",
                    "required": true,
                    "notshowrequired": true,
                    "initValue": "{{duration_unit}}",
                   // "values":duration_unit,
                    "data":duration_unit,
                    "class": "unit-element-input left"
                }
                ]
            }]
            }
        }
    };

    return TimePickerConfiguration;
    });