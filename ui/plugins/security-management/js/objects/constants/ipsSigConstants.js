define([

], function(){
    var IPSSigConstatnts= {
        INFO:'Info',
        MINOR:'Minor',
        MAJOR:'Major',
        WARNING:'Warning',
        CRITICAL:'Critical',
        HIGH:'High',
        MEDIUM:'Medium',
        LOW:'Low',
        UNKNOWN:'Unknown',
        IPD:'Standalone IDP',
        ISG:'Screen OS',
        MX:'MX Series',
        SRX_HIGH:'SRX High-End',
        SRX_BRANCH:'SRX Branch',
        J_SERIES:'J Series',
        NO_ACTION:'No Action',
        CLOSE_CLIENT_SERVER:'Close Client and Server',
        CLOSE_CLIENT:'Close Client',
        CLOSE_SERVER:'Close Server',
        IGNORE:'Ignore',
        DROP:'Drop',
        DROP_PACKET:'Drop Packet',
        DYNAMIC:'Dynamic Group',
        STATIC:'Static Group',
        SIGNATURE:'Signature',
        ANOMALY:'Protocol Anomaly',
        COMPOUND_ATTACK:'Compound Attack',
        UPDATED: 'Updated',
        NEW_ADD:'New Added',
        PREDEFINED:'PREDEFINED',
        CUSTOM:'CUSTOM',
        ANY : 'Any',
        CTS : 'Client to server',
        STC : 'Server to client',
        HIGH : 'High',
        LOW : 'Low',
        MEDIUM : 'Medium',
        UNKNOWN : 'Unknown',

        IPS_SIG_URL : "/api/juniper/sd/ips-signature-management/ips-signatures",
        IPS_SIG_ACCEPT_HEADER : "application/vnd.juniper.sd.ips-signature-management.ips-signature+json;version=1;q=0.01",
        IPS_SIG_CONTENT_HEADER : "application/vnd.juniper.sd.ips-signature-management.ips-signature+json;version=1;charset=UTF-8"
    };

    return IPSSigConstatnts;

});
