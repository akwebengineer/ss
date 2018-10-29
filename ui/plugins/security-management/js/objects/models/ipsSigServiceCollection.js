/**
 * created by vinamra on 7/17/15
 * Collection for getting IPS Signatures 
 *
 * @copyright Juniper Networks, Inc. 2015
**/

define([
    '../../../../ui-common/js/models/spaceCollection.js'
], function(SpaceCollection) {
    /**
     * IpssigCollection defination.
     */
    var ServiceCollection = SpaceCollection.extend({
        url: '/api/juniper/sd/ips-signature-management/ips-signature-services',
        
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                accept: 'application/vnd.juniper.sd.ips-signature-management.ips-sig-services+json;version=1;q=0.01'
            });
        }
    });

    return ServiceCollection;
});
