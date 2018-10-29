/*
Configuration for setting up the form in demo page
*/

define([
], function () {

    var configurationSample = {};

    configurationSample.elements = {
        "title": "Carousel Demo",
        "form_id": "carouselDemo",
        "form_name": "carouselDemo",
        "title-help": {
            "content": "Configure carousel options for demo",
            "ua-help-identifier": "alias_for_title_ua_event_binding"
        },
        "err_div_id": "errorDiv",
        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
        "err_div_link_text":"Configuring Basic Settings",
        "err_timeout": "1000",
        "valid_timeout": "5000",
        "sections": [
            {
                "heading": "Instantiate carousel with options below",
                "heading_text": "Fill in options to see the carousel",
                "section_id": "section_id_1",
                
                "elements": [
                   {
                        "element_text": true,
                        "id": "height",
                        "name": "height",
                        "label": "height",
                        "field-help": {
                            "content": "String, optional. Defines a unique height for each slide. It could be represented as a string composed by the number of units and the type of unit (for example: 540px) or it could be represented by a number data type in which case, the height is assumed in pixels. If it is absent, the height of the slides will be 100px.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{height}}",   
                        "pattern": ".*"
                    },
                    {
                        "element_number": true,
                        "id": "numberOfSlides",
                        "name": "numberOfSlides",
                        "label": "numberOfSlides",
                        "required": false,
                        "field-help": {
                            "content": "Number, optional. Defines the number of slides that will be showed by default when the carousel is rendered while there is enough width in the container to show all the slides.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "min_value":"0",
                        "max_value":"1000",
                        "value": "{{slides}}",
                        "error": "Please enter a number between 0 and 1000"   
                    },
                    {
                        "element_dropdown": true,
                        "id": "item1",
                        "name": "item1",
                        "label": "Add item",
                        "required": true,
//                        "dropdown_disabled": true,
                        "values": [ //to be deprecated, use data instead
                            
                            {
                                "label": "view1",
                                "value": "view1"
                            },
                            {
                                "label": "view2",
                                "value": "view2"
                                
                            },
                            {
                                "label": "view3",
                                "value": "view3"
                                //"disabled": true
                                
                            },
                            {
                                "label": "view4",
                                "value": "view4"
                                
                            },
                            {
                                "label": "view5",
                                "value": "view5"
                                
                            },
                            {
                                "label": "view6",
                                "value": "view6"
                                
                            },
                            {
                                "label": "view7",
                                "value": "view7"
                                
                            },
                            {
                                "label": "view8",
                                "value": "view8"
                                
                            },
                            {
                                "label": "view9",
                                "value": "view9"
                                
                            },
                            {
                                "label": "view10",
                                "value": "view10"
                                
                            }
                        ],
                        "field-help": {
                            "content": "Add views to be displayed in cards of carousel widget",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "error": "Please make a selection"
                    },
                    {
                        "element_dropdown": true,
                        "id": "item2",
                        "name": "item2",
                        "label": "Add item",
                        "required": true,
                        "class":"itemCopy",
//                        "dropdown_disabled": true,
                        "values": [ //to be deprecated, use data instead
                            
                            {
                                "label": "view1",
                                "value": "view1"
                            },
                            {
                                "label": "view2",
                                "value": "view2"
                                
                            },
                            {
                                "label": "view3",
                                "value": "view3"
                                //"disabled": true
                                
                            },
                            {
                                "label": "view4",
                                "value": "view4"
                                
                            },
                            {
                                "label": "view5",
                                "value": "view5"
                                
                            },
                            {
                                "label": "view6",
                                "value": "view6"
                                
                            },
                            {
                                "label": "view7",
                                "value": "view7"
                                
                            },
                            {
                                "label": "view8",
                                "value": "view8"
                                
                            },
                            {
                                "label": "view9",
                                "value": "view9"
                                
                            },
                            {
                                "label": "view10",
                                "value": "view10"
                                
                            }
                        ],
                        "field-help": {
                            "content": "Add views to be displayed in cards of carousel widget",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "error": "Please make a selection"
                    }
                ]
            },
            {
                "heading": "Responsive parameters",
                "heading_text": "Optional parameter that defaults to a set of breakpoints that keep slides width in a range of 280px and 450px. It defines the values required to make the carousel responsive. It allows to define the breakpoints that needs to be reached so the carousel starts showing less or more items.",
                "section_id": "section_id_2",
                "section_class": "section_class",
                "progressive_disclosure": "collapsed",
                "elements": [
                {
                        "element_text": true,
                        "id": "responsiveBreakpoint",
                        "name": "responsiveBreakpoint",
                        "class":"breakpoint",
                        "label": "responsive breakpoint",
                        "field-help": {
                            "content": "maximum number of pixels that the container could have to use the settings defined in the settings property of this Object. ",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "",   
                        "pattern": ".*"
                    },
                    {
                        "element_number": true,
                        "id": "slideShow",
                        "name": "slideShow",
                        "label": "slidesToShow",
                        "class":"breakpoint",
                        "required": false,
                        "field-help": {
                            "content": "slides to show on the screen with the breakpoint.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "min_value":"0",
                        "max_value":"1000",
                        "value": "",
                        "error": "Please enter a number between 0 and 1000"   
                    },
                    {
                        "element_number": true,
                        "id": "slideScroll",
                        "name": "slideScroll",
                        "label": "slidesToScroll",
                        "class":"breakpoint",
                        "required": false,
                        "field-help": {
                            "content": "slides to scroll at a time with the breakpoint.",
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "min_value":"0",
                        "max_value":"1000",
                        "value": "",
                        "error": "Please enter a number between 0 and 1000"   
                    }
                ]
            }
            
        ],

        "buttonsClass":"buttons_row",
        "buttons": [
             // add buttons
             
            {
                "id": "addItem",
                "name": "addItem",
                "type": "button",
                "value": "Add Another Item"
            },
            {
                "id": "addBreakpoint",
                "name": "addBreakpoint",
                "type": "button",
                "value": "Add Another Breakpoint"
            },
            {
                "id": "generate",
                "name": "generate",
                "value": "Generate",
                "isInactive": true
            }
        ]
        
    };

    configurationSample.values = {
        "height":"100px",
        "slides":"4"
    };

    return configurationSample;

});