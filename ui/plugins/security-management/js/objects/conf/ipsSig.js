/**
 * Created by wasima on 8/5/15.
 */

define([], function () {


    function IpsSig() {

        this.toNestedObject = function(flatValues) {
            var convertedFilters = [];
            if (flatValues['sig-type'] === 'dynamic') {
                if(flatValues['dynRecommended']!==undefined && flatValues['dynRecommended']!==""){
                    convertedFilters.push({
                        "field": "Recommended",
                        "filter-value": flatValues['dynRecommended']
                    });
                }
                if(flatValues['dynDirection']!==undefined && flatValues['dynDirection']!==""){
                    convertedFilters.push({
                        "field": "Direction",
                        "filter-value": flatValues['dynDirection'],
                        "expression": flatValues['dynDirectionExpression']
                    });
                }
                if(flatValues['dynMatchAssurance']!==undefined && flatValues['dynMatchAssurance']!==""){
                    convertedFilters.push({
                        "field": "Confidence",
                        "filter-value": flatValues['dynMatchAssurance']
                    });
                }
                if(flatValues['dynPerformanceImpact']!==undefined && flatValues['dynPerformanceImpact']!==""){
                    convertedFilters.push({
                        "field": "Performance",
                        "filter-value": flatValues['dynPerformanceImpact']
                    });
                }
                if(flatValues['dynObjectType']!==undefined && flatValues['dynObjectType']!==""){
                    convertedFilters.push({
                        "field": "SigType",
                        "filter-value": flatValues['dynObjectType']
                    });
                }
                if(flatValues['dynVendor']!==undefined && flatValues['dynVendor']!== null && flatValues['dynVendor']!== ""){
                    convertedFilters.push({
                        "field": "Vendor",
                        "filter-value": flatValues['dynVendor']
                    });
                }
                if(flatValues['dynCategories']!==undefined && flatValues['dynCategories']!==""){
                    convertedFilters.push({
                        "field": "Category",
                        "filter-value": flatValues['dynCategories']
                    });
                }
                if(flatValues['dynServices']!==undefined && flatValues['dynServices']!==""){
                    convertedFilters.push({
                        "field": "Service",
                        "filter-value": flatValues['dynServices']
                    });
                }
                if(flatValues['dynSeverity']!==undefined && flatValues['dynSeverity']!==""){
                    convertedFilters.push({
                        "field": "Severity",
                        "filter-value": flatValues['dynSeverity']
                    });
                }
            }
            return convertedFilters;
        };


        /**
         * @public
         *
         * This api will convert the nested ips sig object into flat values.
         *
         * @params (object) nestedObj - This is the Backbone Model (nested) that is sent from the form.
         *
         * @return (object) flatValues - The backbone model is hierachial model but flatValue model is single level.
         * */
        this.toFlatValues = function(nestedObj) {

            var flatValues = {}, idpTags;
            flatValues['name'] = nestedObj['name'];
            flatValues['description'] = nestedObj['description'];
            flatValues['category'] = nestedObj['category'];
            flatValues['definition-type'] = nestedObj['definition-type'];
            flatValues['severity'] = nestedObj['severity'];
            flatValues['keywords'] = nestedObj['keywords'];
            flatValues['sig-type'] = nestedObj['sig-type'];
            flatValues['recommended-action'] = nestedObj['recommended-action'];
            flatValues['bugs'] = nestedObj['bugs'];
            flatValues['cves'] = nestedObj['cves'];
            flatValues['certs'] = nestedObj['certs'];

            flatValues['services'] = [];
            flatValues['categories'] = [];
            flatValues['recommended'] = nestedObj['recommended'];

            if(nestedObj['attacks'] != undefined && nestedObj['attacks']['ips-sig-attack'] != undefined ){
                var sigAttack = nestedObj['attacks']['ips-sig-attack'][0];
                if(sigAttack['detectors'] != undefined){
                    if(sigAttack ['detectors']['detector']){
                        flatValues['detectors'] = sigAttack['detectors']['detector'];
                    }
                }
                if(!_.isEmpty(sigAttack['timebinding'])) {
                    flatValues['time-binding-scope'] = sigAttack['timebinding']['scope'];
                    flatValues['time-binding-count'] = (sigAttack['timebinding']['count'] < 0) ? "" : sigAttack['timebinding']['count'];
                }
                flatValues['performance'] = sigAttack['performance'];
                flatValues['match'] = sigAttack['false-positives'];
                flatValues["binding-type"] = "service"; //Values will be overriden in subsequent for loop
                var service = sigAttack['service'];
                if(_.isEmpty(service)){
                    var port = sigAttack['port'];
                    if(port != null && port != undefined && port != ""){
                       if(port.split("/")[0] != ""){
                            flatValues["binding-type"] = port.split("/")[0];
                            if(port.split("/")[0] == "ip"){
                               flatValues['protocol'] = port.split("/")[1];  
                            }
                            else if(port.split("/")[0] == "ipv6"){
                               flatValues['next-header'] = port.split("/")[1];  
                            }
                            else if(port.split("/")[0] == "tcp" || port.split("/")[0] == "udp"){
                               flatValues['port-range'] = port.split("/")[1];  
                            }
                            else if(port.split("/")[0] == "rpc"){
                                flatValues['program-number'] = port.split("/")[1]; 
                            }
                       }  
                    }
                 }
                 else{
                    flatValues["binding-type"] = "service";
                    flatValues["service"] = service;
                 }
                flatValues['expression'] = sigAttack['expression'];
                flatValues['scope'] = sigAttack['scope'];
                flatValues['reset'] = sigAttack['reset'];
                flatValues['order'] = sigAttack['ordered'];
                 if(sigAttack['members'] !== undefined && sigAttack['members']['ips-sig-attack-member'] !== undefined){
                     var sigAttackMember = sigAttack['members']['ips-sig-attack-member'];
                     if(sigAttackMember != undefined){
                        flatValues['grid-array'] =[];
                        flatValues['anomaly-grid-array'] = [];
                        var sigNo = "m0";
                        for(var i in sigAttackMember){
                            var sigCount = parseInt(i)+1;
                            if(!_.isEmpty(sigAttackMember[i].test)){
                                var tmp = {};
                                tmp['anomaly-direction'] = sigAttackMember[i].direction;
                                tmp['anomaly'] = sigAttackMember[i].test;
                                tmp['number'] = sigNo + sigCount;
                                flatValues['anomaly-grid-array'].push(tmp);
                            }
                            else {
                                var temp = {};
                                temp['context'] = sigAttackMember[i].context;
                                temp['direction'] = sigAttackMember[i].direction;
                                temp['pattern'] = sigAttackMember[i].pattern;
                                temp['regex'] = sigAttackMember[i].regex;
                                temp['negated'] = sigAttackMember[i].negated;
                                temp['number'] = sigNo + sigCount;
                                flatValues['grid-array'].push(temp);
                            }
                        }
                     }
                 }
                 else{
                    var sigNo = "m01";
                    if(sigAttack['sig-type'] == "anomaly"){
                        flatValues['anomaly-grid'] = {};
                        flatValues['anomaly-grid']['anomaly-direction'] =  sigAttack['direction'];
                        flatValues['anomaly-grid']['anomaly'] = sigAttack['test'];
                        flatValues['anomaly-grid']['number'] = sigNo;
                    }else{
                        flatValues['overlay-grid'] = {};
                        flatValues['overlay-grid']['context'] = sigAttack['context'];
                        flatValues['overlay-grid']['direction'] = sigAttack['direction'];
                        flatValues['overlay-grid']['pattern'] = sigAttack['pattern'];
                        flatValues['overlay-grid']['regex'] = sigAttack['regex'];
                        flatValues['overlay-grid']['negated'] = sigAttack['negated'];
                        flatValues['overlay-grid']['number'] = sigNo;
                    }             
                }
            }
            //Static Group - Filling Group Members
            if(nestedObj['members'] != undefined && nestedObj['members']['ips-signature'] != undefined ){
                flatValues['members'] = nestedObj['members']['ips-signature'];
            }



            //Dynamic Group - Filters
           if(nestedObj['filters'] != undefined && nestedObj['filters']['ips-sig-filter'] != undefined ){
                $.each(nestedObj['filters']['ips-sig-filter'], function(index, obj) {
                        idpTags = obj['display-field'];

                        if(idpTags === 'Direction') {
                            flatValues['dynDirection'] = obj['display-value'];
                            flatValues['dynDirectionExpression'] = obj['expression'];
                        }
                        else if(idpTags === 'Performance Impact') {
                            flatValues['dynPerformanceImpact'] = obj['display-value'];
                        }
                        else if(idpTags === 'Match Assurance') {
                            flatValues['dynMatchAssurance'] = obj['display-value'];
                        }
                        else if(idpTags === 'SigType') {
                            flatValues['dynObjectType'] = obj['display-value'];
                        }
                        else if(idpTags === 'Vendor') {
                            flatValues['dynVendor'] = obj['display-value'];
                        }
                        else if(idpTags === 'Severity') {
                            flatValues['dynSeverity'] = obj['display-value'];
                        } 
                        else if (idpTags === 'Recommended') {
                            flatValues['dynRecommended'] = obj['display-value'];
                        }
                    });
            }

            if(nestedObj['filters'] != undefined){
                var filterArray = nestedObj['filters']['ips-sig-filter'];
                if(filterArray != null && filterArray != undefined && filterArray.length > 0){
                    for(var i in filterArray){
                        if(filterArray[i]['display-field'] == "Service"){
                            if(filterArray[i]['display-value'] != undefined){
                               var serviceArray = filterArray[i]['display-value'].split(",");
                               flatValues['services'] = serviceArray.slice(0);
                            }
                        }
                        else if(filterArray[i]['display-field'] == "Category"){               
                            if(filterArray[i]['display-value'] != undefined){
                               var categoryArray = filterArray[i]['display-value'].split(",");
                               flatValues['categories'] = categoryArray.slice(0);
                            }
                        }
                    }
                }
            }

            return flatValues;
        };
    }
    return IpsSig;
});