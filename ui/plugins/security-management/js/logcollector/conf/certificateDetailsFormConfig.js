define([], function () {

  var Configuration = function(context) {
     
    this.getValues = function() {
     
       return{
                "form_id": "certificate_form",
                "form_name": "certificate_form",
                
                 "sections": [
                                  {
                                      "heading": "Issued To",                                     
                                      "section_id": "section_id",
                                      "section_class": "section_class",                                    
                                      "elements": [

                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("common_name"),
                                              "value": "{{common-nameTo}}"

                                             
                                          },
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("organization_name"),
                                              "value": "{{orgTo}}"
                                             
                                          },
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("organization_unit"),
                                              "value": "{{orgUnitTo}}"
                                             
                                          },
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("serial_number"),
                                              "value": "{{serial-number}}"
                                             
                                          } 
                                         
                                      ]
                                  },
                              
                              {
                                      "heading": "Issued By",                                     
                                      "section_id": "section_id",
                                      "section_class": "section_class",                                    
                                      "elements": [
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("common_name"),
                                              "value": "{{common-name}}"

                                             
                                          },
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("organization_name"),
                                              "value": "{{org}}"
                                             
                                          },
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("organization_unit"),
                                              "value": "{{orgUnit}}"
                                             
                                          }                                         
                                         
                                      ]
                                  },
                                  {
                                      "heading": "Period of Validity",                                     
                                      "section_id": "section_id",
                                      "section_class": "section_class",                                    
                                      "elements": [
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("begins_on"),
                                              "value": "{{begins-on}}"

                                             
                                          },
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("expires_on"),
                                              "value": "{{expires-on}}"
                                             
                                          }                                        
                                         
                                      ]
                                  },
                                  {
                                      "heading": "Fingerprints",                                     
                                      "section_id": "section_id",
                                      "section_class": "section_class",                                    
                                      "elements": [
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("sha_fingerprint"),
                                              "value": "{{sha1-finger-print}}"

                                             
                                          },
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("signature_algorithm"),
                                              "value": "{{signature-algorithm}}"
                                             
                                          },
                                          {
                                              "element_description": true,
                                              "id": "text_field",
                                              "name": "text_feld",
                                              "label": context.getMessage("public_key"),
                                              "value": "{{public-key}}"

                                             
                                          }                                       
                                         
                                      ]
                                  }
                                ]
       };
    };
  };   
    return Configuration;
});