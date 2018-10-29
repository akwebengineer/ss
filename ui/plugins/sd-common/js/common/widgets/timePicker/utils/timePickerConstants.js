/**
 * Constants for Time Picker Widget
 *
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([

], function() {
    var TimePickerConstants = {
        "DURATION_UNITS":{
            "MINUTES": "Minutes",
            "HOURS": "Hours",
            "DAYS": "Days",
            "WEEKS": "Weeks",
            "MONTHS": "Months"
        },
        "DURATION_UNIT_VALUES":{
            "Minutes": "0",
            "Hours": "1",
            "Days": "2",
            "Weeks": "3",
            "Months": "4"
        },
        "DURATION_UNIT_MAPPING":{
            "0": "Minutes",
            "1": "Hours",
            "2": "Days",
            "3": "Weeks",
            "4": "Months"
        }
    };

    return TimePickerConstants;
});
