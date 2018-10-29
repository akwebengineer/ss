/**
 * Refresh certificates Form Configuration
 *
 * @module refreshCertificatesFormConf
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 *
 **/
define( [ ],
    function( ) {

      var RefreshCertificatesFormConfiguration = function( context ) {

        this.getValues = function( ) {
          return {
            "title": context.getMessage( 'refresh_device_certificates_form' ),
            "title-help":{
              "content" : context.getMessage("refresh_device_certificates_form_help"),
              "ua-help-text":context.getMessage("more_link"),
              "ua-help-identifier": context.getHelpKey("SECURITY_DIRECTOR_CERTIFICATE_REFRESHING")
            },
            "form_id": "refresh_device_certificates",
            "form_name": "refresh_device_certificates_form",
            "on_overlay": true,
            "height": "auto",
            "sections": [
              {
                "section_id": "device_list_grid",
                "heading": context.getMessage( 'refresh_device_certificates_form_header_text' ),
                "elements": [ ]
              }
            ],
            "buttons": [
              {
                "id": "refresh_device_certificates_confirm_button",
                "name": "refresh_device_certificates_confirm_button",
                "value": context.getMessage( 'ok' )
              }
            ],
            "cancel_link": {
              "id": "refresh_device_certificates_cancel_button",
              "name": "refresh_device_certificates_cancel_button",
              "value": context.getMessage( 'cancel' )
            }
          };
        };
      };

      return RefreshCertificatesFormConfiguration;

    } );
