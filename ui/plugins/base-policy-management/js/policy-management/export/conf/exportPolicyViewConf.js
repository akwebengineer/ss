define( [ ],
    function( ) {

      var exportPolicyToHtmlViewConf = function( context ) {

        this.getExportPolicyFormElements = function( ) {
          return {
            "title": context.getMessage('export_policy'),
            "tooltip": context.getMessage('export_policy'),
            "form_id" : "export_Policy_confirmation",
            "on_overlay" : true,
            "title-help": {
                "content": context.getMessage( 'policy_export_tooltip' ),
                "ua-help-text": context.getMessage("more_link"),
                "ua-help-identifier": context.getHelpKey("POLICY_EXPORTING")
            },
            "sections": [
              {
                "heading": context.getMessage('export_policy_heading'),
                "section_id": "exportPolicesToHTMLMessageId",
                "elements": [ ]
              }
            ],
            "buttonsAlignedRight": true,
            "cancel_link": {
              "id": "cancelExportPolicy",
              "value": "Cancel",
            },
            "buttons": [
              {
                "id": "exportPolicy",
                "name": "exportPolicy",
                "value": "Export"
              }
            ]
          };
        };
      };

      return exportPolicyToHtmlViewConf;

    } );