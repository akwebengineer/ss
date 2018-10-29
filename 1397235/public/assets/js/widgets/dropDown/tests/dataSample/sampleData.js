/**
 * Sample test data to Dropdown unit test cases for local & remote calls
 * @author Vidushi Gupta<vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {
    var sampleData = {};

    sampleData.confData = [
        {
            "id": "ftp",
            "text": "junos-ftp"
        },
        {
            "id": "tftp",
            "text": "junos-tftp",
            "disabled": true
        },
        {
            "id": "rtsp",
            "text": "junos-rtsp"
        },
        {
            "id": "netbios",
            "text": "junos-netbios-session"
        },
        {
            "id": "smb",
            "text": "junos-smb-session",
            "selected": true
        },
        {
            "id": "esp",
            "text": "esp"
        },
        {
            "id": "ike",
            "text": "ike"
        },
        {
            "id": "ike_nat",
            "text": "ike_nat_traversal"
        },
        {
            "id": "tcp",
            "text": "tcp"
        },
        {
            "id": "ssh",
            "text": "ssh_state_synch"
        },
        {
            "id": "gre",
            "text": "gre"
        },
        {
            "id": "udp",
            "text": "udp"
        },
        {
            "id": "pptp",
            "text": "pptp"
        },
        {
            "id": "junos_ssh",
            "text": "junos-ssh"
        },
        {
            "id": "junos_telnet",
            "text": "junos-telnet"
        },
        {
            "id": "junos_smtp",
            "text": "junos-smtp"
        },
        {
            "id": "junos_tacacs",
            "text": "junos-tacacs"
        },
        {
            "id": "junos_tacacs_ds",
            "text": "junos-tacacs-ds"
        }
    ];

    sampleData.searchData = [
        {
            "id": "data1",
            "text": "searchData1"
        },
        {
            "id": "data2",
            "text": "searchData2"
        },
        {
            "id": "data3",
            "text": "searchData3"
        }
    ];

    sampleData.noTextField = [
        {
            "id": "ftpnew",
            //"text": "junos-ftp-new",
            "name": "junos-ftp-new"
        },
        {
            "id": "tftpnew",
            //"text": "junos-tftp-new",
            "name": "junos-tftp-new"
        }
    ];

    sampleData.twoFields = [
        {
            "id": "ftpnew",
            "text": "junos-ftp-new"
        },
        {
            "id": "tftpnew",
            "text": "junos-tftp-new"
        }
    ];

    sampleData.testConfigData = [
        {
            "id": "12340",
            "text": "text1"
        },
        {
            "id": "12341",
            "text": "text2"
        },
        {
            "id": "12342",
            "text": "text3"
        },
        {
            "id": "12343",
            "text": "text4"
        }
    ];

    sampleData.addTestData = [
        {
            "id": "newData1",
            "text": "new-data-value-1"
        },
        {
            "id": "newData2",
            "text": "new-data-value-2"
        }
    ];

    sampleData.tooltipData = [
        {
            "id": "ftp",
            "text": "junos-ftp"
        },
        {
            "id": "tftp",
            "text": "junos-tftp",
            "disabled": true
        },
        {
            "id": "rtsp",
            "text": "junos-rtsp",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "netbios",
            "text": "junos-netbios-session",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "smb",
            "text": "junos-smb-session",
            "selected": true,
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "esp",
            "text": "esp",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "ike",
            "text": "ike",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "ike_nat",
            "text": "ike_nat_traversal",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "tcp",
            "text": "tcp",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "ssh",
            "text": "ssh_state_synch",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "gre",
            "text": "gre",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "udp",
            "text": "udp",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "pptp",
            "text": "pptp",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "junos_ssh",
            "text": "junos-ssh",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "junos_telnet",
            "text": "junos-telnet",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "junos_smtp",
            "text": "junos-smtp",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "junos_tacacs",
            "text": "junos-tacacs",
            "tooltip_text": "sample tooltip"
        },
        {
            "id": "junos_tacacs_ds",
            "text": "junos-tacacs-ds",
            "tooltip_text": "sample tooltip"
        }
    ];

    sampleData.short = [
        {
            "id": "ftp",
            "text": "junos-ftp"
        },
        {
            "id": "tftp",
            "text": "junos-tftp",
            "disabled": true
        },
        {
            "id": "rtsp",
            "text": "junos-rtsp"
        },
        {
            "id": "esp",
            "text": "esp"
        },
        {
            "id": "ike",
            "text": "ike"
        },
        {
            "id": "ike_nat",
            "text": "ike_nat_traversal"
        },
        {
            "id": "tcp",
            "text": "tcp"
        },
        {
            "id": "ssh",
            "text": "ssh_state_synch"
        },
        {
            "id": "gre",
            "text": "gre"
        },
        {
            "id": "udp",
            "text": "udp"
        },
        {
            "id": "pptp",
            "text": "pptp"
        }
    ];
    
    sampleData.mappingData = [
        {
            "uuid": "ftp",
            "name": "junos-ftp"
        },
        {
            "uuid": "tftp",
            "name": "junos-tftp",
            "disabled": true
        },
        {
            "uuid": "rtsp",
            "name": "junos-rtsp"
        },
        {
            "uuid": "netbios",
            "name": "junos-netbios-session"
        },
        {
            "uuid": "smb",
            "name": "junos-smb-session",
            "selected": true
        },
        {
            "uuid": "esp",
            "name": "esp"
        },
        {
            "uuid": "ike",
            "name": "ike"
        },
        {
            "uuid": "ike_nat",
            "name": "ike_nat_traversal"
        },
        {
            "uuid": "tcp",
            "name": "tcp"
        },
        {
            "uuid": "ssh",
            "name": "ssh_state_synch"
        },
        {
            "uuid": "gre",
            "name": "gre"
        },
        {
            "uuid": "udp",
            "name": "udp"
        },
        {
            "uuid": "pptp",
            "name": "pptp"
        },
        {
            "uuid": "junos_ssh",
            "name": "junos-ssh"
        },
        {
            "uuid": "junos_telnet",
            "name": "junos-telnet"
        },
        {
            "uuid": "junos_smtp",
            "name": "junos-smtp"
        },
        {
            "uuid": "junos_tacacs",
            "name": "junos-tacacs"
        },
        {
            "uuid": "junos_tacacs_ds",
            "name": "junos-tacacs-ds"
        }
    ];

    sampleData.enableDisableData = [
        {
            "id": "",
            "text": "Select a value"
        },
        {
            "id": "12340",
            "text": "text1"
        },
        {
            "id": "12341",
            "text": "text2",
            "selected": true
        },
        {
            "id": "12342",
            "text": "text3"
        },
        {
            "id": "12343",
            "text": "text4",
            "disabled": true
        }
    ];

    return sampleData
});
