define([], function () {

  var Configuration = function(context) {
     
    this.getValues = function() {
     
       return{
                "title" : context.getMessage('node_password_change'),
                "form_id": "change_password_form",
                "form_name": "change_password_form",
                "title-help": {
                    "content": context.getMessage("node_password_change_title")
                },
                "on_overlay": true,
                "sections": [
                          {
                              "elements": [
                                  
                                    
                                    // {
                                    //     "element_password": true,
                                    //     "id": "old_password",
                                    //     "name": "old_password",
                                    //     "label": context.getMessage('old_password'),
                                    //     "placeholder": "",
                                    //     "class": "tab-widget",
                                    //     "required": true,
                                    //     "notshowrequired": false
                                    // },
                                    {
                                        "element_password": true,
                                        "id": "new_password",
                                        "name": "new_password",
                                        "label": context.getMessage('new_password'),
                                        "placeholder": "",
                                        "required": true,
                                        "pattern-error": [
                                            {
                                                "pattern": "length",
                                                "min_length":"6",
                                                "max_length":"15",
                                                "error": "Must be 6 to 15 characters."
                                            },
                                            {
                                                "pattern": "hasnumbersymbol",
                                                "error": "At least one number and one symbol is required."
                                            },
                                            {
                                                "pattern": "hasmixedcasenumber",
                                                "error": "A combination of mixed case letters and one number is required."
                                            },
                                            {
                                                "pattern": "hasmixedcasesymbol",
                                                "error": "A combination of mixed case letters and one symbol is required."
                                            },
                                            {
                                                "pattern": "hassymbol",
                                                "error": "At least one symbol is required."
                                            },
                                            {
                                                "pattern": "hasnumber",
                                                "error": "At least one number is required."
                                            },   {
                                                "pattern": "hasmixedcase",
                                                "error": "A combination of mixed case letters is required."
                                            },
                                            {
                                                "pattern": "validtext",
                                                "error": "A combination of mixed case letters, numbers, and symbols is required."
                                            }
                                        ],
                                        "error": true,
                                        "help": "Must be 6 to 15 characters. A combination of mixed case letters, numbers, and symbols is required."
                                    },
                                    {
                                        "element_password": true,
                                        "id": "confirm_password",
                                        "name": "confirm_password",
                                        "label": context.getMessage('confirm_password'),
                                        "placeholder": "",
                                        "required": true,
                                        "required": true,
                                        "dependency": "new_password",
                                        "error": "Passwords must match"
                                    }
                                 
                              ]

                          }
                         
                      ],
                "buttonsAlignedRight": true,
                "buttons": [                   
                    {
                        "id": "change-password-save",
                        "name": "change-password-save",
                        "value": context.getMessage('ok')
                    }
                ],
                "cancel_link": {
                    "id": "change-password-cancel",
                    "value": context.getMessage("cancel")
                }
       };
    };
  };   
    return Configuration;
});