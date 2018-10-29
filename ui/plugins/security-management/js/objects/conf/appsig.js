/**
 * Created by vinutht on 5/20/15.
 */

define([], function () {


    function AppSig() {
        /**
         * @public
         *
         * REST Endpoint consumes a complex JSON object.
         * I am constructing this complex JSON object here by taking the values from flat FormValues.
         * This api will convert from flatvalues to nestedObject
         *
         * @param (object) flatValues - JSON object with single level (not nested or hierarchial)
         * @return (object) nestedObj - JSON object which is nested or hierarchial.
         *
         * */

        this.toNestedObject = function(flatValues) {
            var appsigObj;

            if(flatValues['type'] === 'application') {
                appsigObj = {
                    "pattern-sets": {
                        "pattern-set": {
                            "port": "",
                            "max-transactions": flatValues['max_transaction'],
                            "protocol": flatValues['protocol'],
                            "type": "application",
                            "ordered": flatValues['chain_order'],
                            "members": flatValues["members"]
                        }
                    },
                    "description": flatValues['description'],
                    "name": flatValues['name'],
                    "app-sig-tags": {
                        "idp-common-value": [
                            {
                                "name": "Category",
                                "value": flatValues['category']
                            },
                            {
                                "name": "Subcategory",
                                "value": flatValues['sub_category']
                            },
                            {
                                "name": "Characteristic",
                                "value": ""
                            },
                            {
                                "name": "Risk",
                                "value": flatValues['risk']
                            }
                        ]
                    },
                    "definition-type": "CUSTOM",
                    "category": flatValues['category'],
                    "sub-category": flatValues['sub_category'],
                    "risk": flatValues['risk'],
                    "application-name": flatValues['name'],
                    "type": "application"
                };

            }
            else if(flatValues['type'] === 'protocol') {
                appsigObj = {
                    "pattern-sets": {
                        "pattern-set": {
                            "port": flatValues['port_range'],
                            "stcpattern": flatValues['server_to_client'],
                            "mindata": flatValues['min_data'],
                            "ctspattern": flatValues['client_to_server']
                        }
                    },
                    "description": flatValues['description'],
                    "name": flatValues['name'],
                    "app-sig-tags": {
                        "idp-common-value": [{
                            "name": "Category",
                            "value": flatValues['category']
                        },
                            {
                                "name": "Subcategory",
                                "value": flatValues['sub_category']
                            },
                            {
                                "name": "Risk",
                                "value": flatValues['risk']
                            }
                        ]
                    },
                    "type": "protocol",
                    "category": flatValues['category'],
                    "sub-category": flatValues['sub_category'],
                    "risk": flatValues['risk']
                };
            }
            return appsigObj;
        };


        /**
         * @public
         *
         * This api will convert the nested app sig object into flat values.
         *
         * @params (object) nestedObj - This is the Backbone Model (nested) that is sent from the form.
         *
         * @return (object) flatValues - The backbone model is hierachial model but flatValue model is single level.
         * */
        this.toFlatValues = function(nestedObj) {

            var flatValues = {}, idpTags;
            if(nestedObj['app-sig-type']==='group'){
                flatValues['name'] = nestedObj['name'];
                flatValues['description'] = nestedObj['description'];
                flatValues['type'] = nestedObj['type'];
                flatValues['disable_state'] = nestedObj['disable-state'];
                if(nestedObj['group-nested-members'] != undefined)
                flatValues['members'] = nestedObj['group-nested-members']['group-nested-member'];

            }
            else{
            //This check is just to ensure we are in the edit or clone mode
                if(nestedObj['name'] !== undefined) {
                    flatValues['name'] = nestedObj['name'];
                    flatValues['description'] = nestedObj['description'];
                    $.each(nestedObj['app-sig-tags']['idp-common-value'], function(index, obj) {
                        idpTags = obj['name'];
                        if(idpTags === 'Category') {
                            flatValues['category'] = obj['value'];
                         }
                        else if(idpTags === 'Subcategory') {
                            flatValues['sub_category'] = obj['value'];
                        }
                        else if(idpTags === 'Risk') {
                            flatValues['risk'] = obj['value'];
                        }
                    });

                    flatValues['port_range'] = nestedObj['pattern-sets']['pattern-set']['port'];
                    flatValues['server_to_client'] = nestedObj['pattern-sets']['pattern-set']['stcpattern'];
                    flatValues['client_to_server'] = nestedObj['pattern-sets']['pattern-set']['ctspattern'];
                    flatValues['min_data'] = nestedObj['pattern-sets']['pattern-set']['mindata'];
                    flatValues['type'] = nestedObj['type'];
                    flatValues['max_transaction'] = nestedObj['pattern-sets']['pattern-set']['max-transactions'];
                    flatValues['protocol'] = nestedObj['pattern-sets']['pattern-set']['protocol'];
                    flatValues['chain_order'] = nestedObj['pattern-sets']['pattern-set']['ordered'];
                    flatValues['members'] = nestedObj['pattern-sets']['pattern-set']['members'];

                }
            }

            return flatValues;
        };

    }


    return AppSig;
});
