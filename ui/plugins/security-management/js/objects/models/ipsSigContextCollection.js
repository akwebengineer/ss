/***
  **



* */
define(['../../../../ui-common/js/models/spaceCollection.js'],
    function (SpaceCollection) {
    /**
     * Context Collection definition.
     */
    var ContextCollection = SpaceCollection.extend({
        url: '/api/juniper/sd/ips-signature-management/ips-signature-contexts',
        
        initialize: function() {
            // initialize base object properly
            SpaceCollection.prototype.initialize.call(this, {
                //jsonRoot: 'collection.combo-bean',
               // jsonRoot: 'latest-idp-sig-contexts.latest-idp-sig-context',
                accept: 'application/vnd.juniper.sd.ips-signature-management.ips-sig-contexts+json;version=1;q=0.01'
            });
        }
    });

    return ContextCollection;
});

