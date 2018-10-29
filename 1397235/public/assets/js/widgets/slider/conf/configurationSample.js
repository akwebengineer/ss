/**
 * A sample configuration object that shows the parameters required to build a slider widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var configurationSample = {};

    var percentageLabelCallbacks = {
        format: function (value) {
            return value + "%";
        },
        unformat: function (value) {
            return value.replace("%", "");
        }
    };
    var fromLabelCallbacks = {
        format: function (value, index) {
            return "Handle #" + index + ": " + value;
        },
        unformat: function (value, index) {
            var stringIndex = value.indexOf(index) + 3;
            return value.substring(stringIndex);
        }
    };

    configurationSample.oneRangeCloseStartOpenEnd = {
        "handles": [{
            "value": 40,
            "connect": {
                "right": false
            }
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            },
            "numberOfValues": 5
        },
        "options": {
            "step": 1,
            "label": percentageLabelCallbacks
        }
    };

    configurationSample.oneRangeCloseStartOpenEndReadOnly = {
        "handles": [{
            "value": 60,
            "disabled": true,
            "connect": {
                "right": false,
                "left": {
                    "color": "green"
                }
            }
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            }
        }
    };

    configurationSample.oneRangeOpenStartOpenEnd = {
        "handles": [{
            "value": 28.5,
            "connect": {
                "left": false
            }
        }, {
            "value": 69.9,
            "connect": {
                "left": {
                    "color": "#ff9933"
                },
                "right": false //only the last handle has right property
            }
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            },
            "numberOfValues": 6,
            "density": 5
        }
    };

    configurationSample.threeRangeCloseStartCloseEnd = {
        "handles": [{
            "value": 5
        }, {
            "value": 8
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 10
            },
            "numberOfValues": 11
        },
        "options": {
            "step": 1,
            "label": false
        }
    };

    configurationSample.twoRangeOpenStartOpenEnd = {
        "handles": [{
            "value": 20,
            "connect": {
                "left": false
            }
        }, {
            "value": 40,
            "connect": {
                "left": {
                    "color": "pink"
                }
            }
        }, {
            "value": 60,
            "connect": {
                "left": {
                    "color": "purple"
                },
                "right": false //only the last handle has right property
            }
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            },
            "density": 5
        },
        "options": {
            "step": 1,
            "handleDistance": {
                "min": 2,
                "max": 50
            }
        }
    };

    configurationSample.fourRangeCloseStartCloseEnd = {
        "handles": [{
            "value": 30
        }, {
            "value": 50
        }, {
            "value": 70
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            },
            "numberOfValues": 6,
            "density": 5
        },
        "options": {
            "step": 1,
            "handleDistance": {
                "min": 2,
                "max": 50
            },
            "label": _.extend(fromLabelCallbacks, {
                width: "auto"
            })
        }
    };

    configurationSample.fourRangeOpenStartCloseEnd = {
        "handles": [{
            "value": 0,
            "label": false,
            "connect": {
                "left": false
            }
        }, {
            "value": 25
        }, {
            "value": 45,
            "connect": {
                "left": false
            }
        }, {
            "value": 85,
            "connect": {
                "right": {
                    "color": "brown"
                }
            }
        }],
        "scale": {
            "range": {
                "min": 0,
                "max": 100
            },
            "numberOfValues": 6,
            "density": 5
        },
        "options": {
            "step": 5
        }
    };

    return configurationSample;

});