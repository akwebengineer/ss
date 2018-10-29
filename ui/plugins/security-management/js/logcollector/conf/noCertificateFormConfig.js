define([], function () {

  var Configuration = function(context) {
     
    this.getValues = function() {
     
       return{
                "form_id": "no_certificate_form",
                "form_name": "no_certificate_form",
                 "sections": [
                                  {
                                      "heading": context.getMessage('no_certifiacte')

                                     
                                  }                              
                              
                                ]
       };
    };
  };   
    return Configuration;
});