/**
 * A configuration object with the parameters required to generate sample topology
 *
 * @module topologyConfiguration
 * @copyright Juniper Networks, Inc. 2017
 */

define([], function () {

    var topologyConfiguration = {};

    topologyConfiguration.fileTopologyData = {
        "name": "File 1",
        "id": "Node100",
        "size": "medium",
        "children": [
            {
                "name": "File 1-1",
                "id": "9da54794-9816-488f-9cb1-37c2b169bf70",
                "children": [
                    {
                        "name": "File 1-1-1",
                        "id": "30aec4ab-199d-4204-8ff1-741c90755fa8",
                        "children": [
                            {
                                "name": "File 1-1-1-1",
                                "id": "75b6d171-b7a0-4781-8893-5ba5eeb2dbd7",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-1-1-2",
                                "id": "7fee8ddd-ad47-49c0-85db-b991ec79d9de",
                                "children": [
                                    {
                                        "name": "File 1-1-1-2-1",
                                        "id": "67cc28f1-1d6a-4281-92ce-d3963e039eb5",
                                        "children": [],
                                        "type": "file_malicious",

                                        "link": {

                                            "type": "contacted_default"
                                        }
                                    },
                                    {
                                        "name": "File 1-1-1-2-2",
                                        "id": "481fb61f-9f21-4b99-bc33-a2d68a4f9df7",
                                        "children": [],
                                        "type": "file_suspected",

                                        "link": {

                                            "type": "dropped_default"
                                        }
                                    },
                                    {
                                        "name": "File 1-1-1-2-3",
                                        "id": "97e8b50e-e014-43a4-bfdc-8c69ef1bcd0e",
                                        "children": [],
                                        "type": "file_suspected",

                                        "link": {

                                            "type": "dropped_default"
                                        }
                                    },
                                    {
                                        "name": "File 1-1-1-2-4",
                                        "id": "51024a65-bf22-40cf-a09f-1e69b7dc2938",
                                        "children": [],
                                        "type": "file_suspected",

                                        "link": {

                                            "type": "contacted_default"
                                        }
                                    }
                                ],
                                "type": "file_malicious",

                                "link": {

                                    "type": "started_default"
                                }
                            }
                        ],
                        "type": "file_suspected",

                        "link": {

                            "type": "started_default"
                        }
                    },
                    {
                        "name": "File 1-1-2",
                        "id": "22158500-8a54-4191-814a-5786148c214a",
                        "children": [
                            {
                                "name": "File 1-1-2-1",
                                "id": "eb35368c-07c9-42cd-8399-4331f6c13b64",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-1-2-2",
                                "id": "5447e405-3461-42eb-86d6-1bfa1504162f",
                                "children": [],
                                "type": "file_malicious",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-1-2-3",
                                "id": "03af47fb-4474-4a77-8b93-89d311810679",
                                "children": [],
                                "type": "file_malicious",

                                "link": {

                                    "type": "contacted_default"
                                }
                            }
                        ],
                        "type": "file_malicious",

                        "link": {

                            "type": "started_default"
                        }
                    }
                ],
                "type": "file_suspected",

                "link": {

                    "type": "started_default"
                }
            },
            {
                "name": "File 1-2",
                "id": "ffb00ac2-6e7c-42aa-b5d7-5e2a7f1d5ac1",
                "children": [
                    {
                        "name": "File 1-2-2",
                        "id": "96528085-8f09-435b-9553-d0ee8233ea4c",
                        "children": [
                            {
                                "name": "File 1-2-2-1",
                                "id": "51be47a0-8582-45e4-bfee-bfb8202bc49d",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-2-2",
                                "id": "76e306aa-aaac-41be-8630-dd4b94f365fa",
                                "children": [],
                                "type": "file_malicious",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-2-3",
                                "id": "135fd5d0-3a22-4460-8500-124d87ec6136",
                                "children": [],
                                "type": "file_malicious",

                                "link": {

                                    "type": "contacted_default"
                                }
                            },
                            {
                                "name": "File 1-2-2-4",
                                "id": "cfa69962-d53c-4968-a6ba-899d943c951f",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "dropped_default"
                                }
                            },
                            {
                                "name": "File 1-2-2-5",
                                "id": "f585717d-0271-40b9-97a5-00c881ec0de0",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "dropped_default"
                                }
                            },
                            {
                                "name": "File 1-2-2-6",
                                "id": "ee724c67-6729-4fd8-933d-d224789fccd4",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "contacted_default"
                                }
                            }
                        ],
                        "type": "file_suspected",

                        "link": {

                            "type": "started_default"
                        }
                    },
                    {
                        "name": "File 1-2-1",
                        "id": "b40972ba-5ed9-48eb-8188-18b87ef87f67",
                        "children": [
                            {
                                "name": "File 1-2-1-1",
                                "id": "39dac33c-98ff-4bc4-a244-010af8a6cbc2",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-2",
                                "id": "fd714750-049e-421f-86a7-a5b9e1117958",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-3",
                                "id": "c36a85f5-462e-44c3-86b3-3543dc1bad04",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-4",
                                "id": "fcde26a5-db7c-48fb-b726-a83f939481a6",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-5",
                                "id": "ea6264dd-7601-43b7-b2c8-3c62a596b54f",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-6",
                                "id": "476748a9-ca0f-4b03-8a3f-58585aa0f45c",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-7",
                                "id": "c263613f-9086-4db1-ba55-3bfb4c1e2fb2",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-8",
                                "id": "f64b782c-a726-46dd-8dc7-8015555e5183",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-9",
                                "id": "336e6304-cd4f-4268-9462-fbca0840493c",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-10",
                                "id": "7dc93c5e-771a-4157-bc3c-a56e0aca17fb",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "started_default"
                                }
                            }
                        ],
                        "type": "file_malicious",

                        "link": {

                            "type": "started_default"
                        }
                    }
                ],
                "type": "file_malicious",

                "link": {

                    "type": "started_default"
                }
            }
        ],
        "type": "file_default",
        "link": {

            "type": ""
        }
    };

    topologyConfiguration.fileTopologyIcons = {
        "file_malicious": "/assets/js/widgets/topology/tests/img/icon_file_malicious.svg",
        "file_suspected": "/assets/js/widgets/topology/tests/img/icon_file_suspected.svg",
        "file_default": "/assets/js/widgets/topology/tests/img/icon_file_default.svg",
        "internet_suspected": "/assets/js/widgets/topology/tests/img/icon_internet_suspected.svg",
        "dropped_default": "/assets/js/widgets/topology/tests/img/icon_dropped_default.svg",
        "started_default": "/assets/js/widgets/topology/tests/img/icon_started_default.svg",
        "contacted_default": "/assets/js/widgets/topology/tests/img/icon_contacted_default.svg"
    };

    topologyConfiguration.subNodesTopologyData = {
        "name": "Hub 1",
        "id": "1",
        "size": "large",
        "children": [
            {
                "name": "US West",
                "id": "11",
                "size": "large",
                "children": [],
                "subNodes": [
                    {
                        "name": "Link A",
                        "id": "1121WA",
                        "size": "medium",
                        "type": "cloud",
                        "link": {
                            "type": "sub_node_link_error"
                        }
                    },
                    {
                        "name": "Link B",
                        "id": "1122WB",
                        "size": "medium",
                        "type": "mpls",
                        "link": {
                            "type": "sub_node_link"
                        }
                    },
                    {
                        "name": "Link C",
                        "id": "1123WC",
                        "size": "medium",
                        "type": "mpls",
                        "link": {
                            "type": "sub_node_link"
                        }
                    }
                ],
                "type": "vpn-custom",
                "link": {
                    "type": "vpn_link",
                    "size": "small"
                }
            },
            {
                "name": "US East",
                "id": "12",
                "size": "large",
                "children": [],
                "subNodes": [
                    {
                        "name": "Link A",
                        "id": "1121EA",
                        "size": "medium",
                        "type": "cloud",
                        "link": {
                            "type": "sub_node_link_error"
                        }
                    },
                    {
                        "name": "Link B",
                        "id": "1122EB",
                        "size": "medium",
                        "type": "mpls",
                        "link": {
                            "type": "sub_node_link"
                        }
                    },
                    {
                        "name": "Link C",
                        "id": "1123EC",
                        "size": "medium",
                        "type": "mpls",
                        "link": {
                            "type": "sub_node_link"
                        }
                    },
                    {
                        "name": "Link D",
                        "id": "1123sEC",
                        "size": "medium",
                        "type": "mpls",
                        "link": {
                            "type": "sub_node_link"
                        }
                    }
                ],
                "type": "vpn",
                "link": {
                    "type": "vpn_link",
                    "size": "small"
                }
            },
            {
                "name": "Internet Breakout",
                "id": "33",
                "size": "large",
                "children": [],
                "type": "internet_breakout",
                "link": {
                    "type": "",
                    "size": "small"
                }
            }
        ],
        "type": "hub",
        "link": {
            "type": ""
        }
    };

    topologyConfiguration.subNodesTopologyIcons = {
        "site": "/assets/js/widgets/topology/tests/img/icon_site.svg",
        "vpn": "/assets/js/widgets/topology/tests/img/icon_VPN.svg",
        "vpn-custom": "/assets/js/widgets/topology/tests/img/icon_VPN.svg",
        "cloud": "/assets/js/widgets/topology/tests/img/icon_cloud_link.svg",
        "mpls": "/assets/js/widgets/topology/tests/img/icon_mpls_link.svg",
        "internet_breakout": "/assets/js/widgets/topology/tests/img/icon_internet_breakout.svg",
        "hub": "/assets/js/widgets/topology/tests/img/icon_hub.svg",
        "sub_node_link": "/assets/js/widgets/topology/tests/img/icon_link_up.svg",
        "sub_node_link_error": "/assets/js/widgets/topology/tests/img/icon_link_down.svg"
    };

    topologyConfiguration.defaultStylesData = {
        "name": "File 1",
        "id": "1",
        "children": [
            {
                "name": "File 1-1",
                "id": "11",
                "children": [],
                "type": "file_suspected",

                "link": {

                    "type": "link_default"
                }
            },
            {
                "name": "File 1-2",
                "id": "12",
                "children": [
                    {
                        "name": "File 1-2-1",
                        "id": "121",
                        "children": [
                            {
                                "name": "File 1-2-1-1",
                                "id": "1211",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-2",
                                "id": "1212",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-3",
                                "id": "1213",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-4",
                                "id": "1214",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-5",
                                "id": "1215",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-6",
                                "id": "1216",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-7",
                                "id": "1217",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-8",
                                "id": "1218",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            },
                            {
                                "name": "File 1-2-1-9",
                                "id": "1219",
                                "children": [],
                                "type": "file_suspected",

                                "link": {

                                    "type": "link_default"
                                }
                            }
                        ],
                        "type": "file_malicious",

                        "link": {

                            "type": "link_default"
                        }
                    }
                ],
                "type": "file_malicious",

                "link": {

                    "type": "link_default"
                }
            },
            {
                "name": "File 1-3",
                "id": "13",
                "children": [
                    {
                        "name": "File 1-3-1",
                        "id": "131",
                        "children": [],
                        "type": "file_suspected",
                        "link": {
                            "type": "link_default"
                        }
                    },
                ],
                "type": "file_suspected",
                "link": {
                    "type": "link_default"
                }
            },
        ],
        "type": "file_default",
        "link": {

            "type": ""
        }
    };

    topologyConfiguration.defaultStylesIcons = {
        "file_malicious": "/assets/js/widgets/topology/tests/img/icon_file_malicious.svg",
        "file_suspected": "/assets/js/widgets/topology/tests/img/icon_file_suspected.svg",
        "file_default": "/assets/js/widgets/topology/tests/img/icon_file_default.svg",
        "link_default": "/assets/js/widgets/topology/tests/img/icon_started_default.svg"
    };

    topologyConfiguration.dragNdropData = {
        "name": "Site",
        "id": "123",
        "children": [
            {
                "name": "VPN 1",
                "id": "11",
                "size": "large",
                "children": [],
                "type": "vpn",
                "link": {
                    "id": "11link",
                    "size": "medium",
                    "type": "attachment_point"
                },
                "addOn": {
                    "name": "Site_addOn2",
                    "size": "medium",
                    "type": "attachment_point",
                    "position": "bottom"
                }
            },
            {
                "name": "VPN 2",
                "id": "12",
                "size": "large",
                "children": [],
                "type": "vpn",
                "link": {
                    "id": "12link",
                    "size": "medium",
                    "type": "attachment_point"
                }
            },
            {
                "name": "VPN 3",
                "id": "13",
                "size": "large",
                "children": [
                    {
                        "name": "File 1-3-1",
                        "id": "14",
                        "size": "large",
                        "children": [],
                        "type": "internet_breakout",
                        "link": {
                            "id": "14link",
                            "size": "medium",
                            "type": "attachment_point"
                        }
                    }
                ],
                "type": "vpn",
                "link": {
                    "size": "medium",
                    "id": "13link",
                    "type": "attachment_point"
                }
            }
        ],
        "size": "large",
        "type": "site",
        "addOn": {
            "name": "Site_addOn",
            "size": "large",
            "type": "attachment_point",
            "position": "top"
        },
        "link": {

            "type": ""
        }
    };

    topologyConfiguration.dragNdropIcons = {
        "site": "/assets/js/widgets/topology/tests/img/icon_site.svg",
        "vpn": "/assets/js/widgets/topology/tests/img/icon_VPN.svg",
        "internet_breakout": "/assets/js/widgets/topology/tests/img/icon_internet_breakout.svg",
        "attachment_point": "/assets/js/widgets/topology/tests/img/icon_attachment_point_cloud.svg",
        "security_service" : "/assets/js/widgets/topology/tests/img/icon_security_service.svg",
        "routing_service": "/assets/js/widgets/topology/tests/img/icon_routing_service.svg",
        "multi_service": "/assets/js/widgets/topology/tests/img/icon_multi_service.svg",
        "internet_sevices": "/assets/js/widgets/topology/tests/img/icon_internet_sevices.svg"
    };

    topologyConfiguration.forceDirectedTopologyData = {
        nodes: [
            {name: "Primary Hub", id: "123_node", type: "hub", size: "medium"},
            {name: "Secondary Hub", id: "456_node", type: "hub", size: "medium"},
            {name: "Spoke 3", id: "457_node", type: "spoke", size: "medium"},
            {name: "Spoke 4", id: "458_node", type: "spoke", size: "medium"},
            {name: "Spoke 5", id: "459_node", type: "spoke", size: "medium"},
            {name: "Spoke 6", id: "461_node", type: "spoke", size: "medium"},
            {name: "Spoke 7", id: "462_node", type: "spoke", size: "medium"},
            {name: "Spoke 8", id: "463_node", type: "spoke", size: "medium"},
            {name: "Spoke 9", id: "464_node", type: "spoke", size: "medium"},
            {name: "Spoke 10", id: "465_node", type: "spoke", size: "medium"},
            {name: "Spoke 303", id: "303_node", type: "spoke", size: "medium"},
            {name: "Spoke 304", id: "304_node", type: "spoke", size: "medium"}
        ],
        links: [
            {source: "123_node", target: "456_node", id: "445_link", name: "445_link", bidirectional: true, type: "bidirectional_link", weight:10},
            {source: "123_node", target: "457_node", id: "449_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "123_node", target: "458_node", id: "450_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "123_node", target: "459_node", id: "451_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "123_node", target: "461_node", id: "452_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "123_node", target: "462_node", id: "453_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "123_node", target: "463_node", id: "454_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "123_node", target: "464_node", id: "455_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "123_node", target: "465_node", id: "456_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "456_node", target: "457_node", id: "457_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "456_node", target: "458_node", id: "458_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "456_node", target: "461_node", id: "460_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "456_node", target: "462_node", id: "461_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "456_node", target: "463_node", id: "462_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "456_node", target: "464_node", id: "463_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "456_node", target: "465_node", id: "464_link", name: "449_link", type: "contacted_default", weight:0},
            {source: "456_node", target: "123_node", id: "465_link", name: "445_link", bidirectional: true, type: "bidirectional_link", weight:10}
        ]
    };

    topologyConfiguration.networkTopologyData = {
        //Node positions for 'absolute' layout
        nodes: [
            {name: "Internet", id: "123_node", type: "internet_breakout", size: "medium", position: {left: 500, top: 50}},
            {name: "Firewall Cluster", id: "456_node", type: "firewall", size: "medium", position: {left: 540, top: 190}},
            {name: "EX 4200-48PX", id: "461_node", type: "switching_service", size: "medium", position: {left: 750, top: 330}},
            {name: "EX 4200-48PX", id: "457_node", type: "switching_service", size: "medium", position: {left: 190, top: 330}},
            {name: "EX 4200-48PX", id: "458_node", type: "switching_service", size: "medium", position: {left: 470, top: 330}},
            {name: "EX 4200-48PX", id: "459_node", type: "switching_service", size: "medium", position: {left: 610, top: 330}},
            {name: "Switches", id: "462_node", type: "multi_service", size: "medium", position: {left: 750, top: 470}},
            {name: "Switches", id: "463_node", type: "multi_service", size: "medium", position: {left: 500, top: 470}},
            {name: "Switches", id: "464_node", type: "multi_service", size: "medium", position: {left: 610, top: 470}},
            {name: "EX 2200-24T-4G", id: "465_node", type: "switching_service", size: "medium", position: {left: 50, top: 470}},
            {name: "EX 2200-24T-4G", id: "303_node", type: "switching_service", size: "medium", position: {left: 190, top: 470}},
            {name: "EX 2200-24T-4G", id: "304_node", type: "switching_service", size: "medium", position: {left: 330, top: 470}}
        ],
        //Node positions for 'hierarchical / spring' layout
        /*nodes: [
            {name: "Internet", id: "123_node", type: "internet_breakout", size: "medium"},
            {name: "Firewall Cluster", id: "456_node", type: "firewall", size: "medium"},
            {name: "EX 4200-48PX", id: "461_node", type: "switching_service", size: "medium"},
            {name: "EX 4200-48PX", id: "457_node", type: "switching_service", size: "medium"},
            {name: "EX 4200-48PX", id: "458_node", type: "switching_service", size: "medium"},
            {name: "EX 4200-48PX", id: "459_node", type: "switching_service", size: "medium"},
            {name: "Switches", id: "462_node", type: "multi_service", size: "medium"},
            {name: "Switches", id: "463_node", type: "multi_service", size: "medium"},
            {name: "Switches", id: "464_node", type: "multi_service", size: "medium"},
            {name: "EX 2200-24T-4G", id: "465_node", type: "switching_service", size: "medium"},
            {name: "EX 2200-24T-4G", id: "303_node", type: "switching_service", size: "medium"},
            {name: "EX 2200-24T-4G", id: "304_node", type: "switching_service", size: "medium"}
        ],*/
        links: [
            {source: "123_node", target: "456_node", id: "445_link", name: "445_link", type: "contacted_default"},
            {source: "456_node", target: "457_node", id: "449_link", name: "449_link", type: "contacted_default"},
            {source: "456_node", target: "458_node", id: "450_link", name: "449_link", type: "bidirectional_link"},
            {source: "456_node", target: "459_node", id: "451_link", name: "449_link", type: "contacted_default"},
            {source: "456_node", target: "461_node", id: "452_link", name: "449_link", type: "contacted_default"},
            {source: "461_node", target: "462_node", id: "453_link", name: "449_link", type: "contacted_default"},
            {source: "458_node", target: "463_node", id: "454_link", name: "449_link", type: "contacted_default"},
            {source: "459_node", target: "464_node", id: "455_link", name: "449_link", type: "contacted_default"},
            {source: "457_node", target: "465_node", id: "456_link", name: "449_link", type: "contacted_default"},
            {source: "457_node", target: "465_node", id: "459_link", name: "449_link", type: "contacted_default"},
            {source: "457_node", target: "303_node", id: "457_link", name: "449_link", type: "contacted_default"},
            {source: "457_node", target: "304_node", id: "458_link", name: "449_link", type: "dropped_default"}
        ]
    };

    topologyConfiguration.ipsecTopologyData = {
        nodes: [{name: "Firewall Cluster", id: "123_node", type: "firewall", size: "large"},
            {name: "Internet", id: "456_node", type: "internet_breakout", size: "large"},
            {name: "EX 4200-48PX", id: "461_node", type: "switching_service", size: "large"},
            {name: "EX 4200-48PX", id: "457_node", type: "internet_sevices", size: "large"}],
        links: [{source: "123_node", target: "456_node", id: "445_link", name: "445_link", type: "connected"},
            {source: "456_node", target: "461_node", id: "449_link", name: "449_link", type: "connected"},
            {source: "461_node", target: "457_node", id: "450_link", name: "450_link", type: "connected"}]
    };

    topologyConfiguration.simpleNetwork = {
        nodes: [{name: "Firewall Cluster", id: "123_node", type: "firewall", position: {left: 50, top: 200}},
            {name: "Internet", id: "456_node", type: "internet_breakout", position: {left: 942, top: 50}},
            {name: "EX 4200-48PX", id: "461_node", type: "switching_service", position: {left: 342, top: 197}},
            {name: "EX 4200-48PX", id: "457_node", type: "internet_sevices", position: {left: 944, top: 350}}],
        links: [{source: "461_node", target: "456_node", id: "445_link", name: "445_link", type: "connected"},
            {source: "123_node", target: "461_node", id: "449_link", name: "449_link", type: "connected"},
            {source: "461_node", target: "457_node", id: "450_link", name: "450_link", type: "connected"}]
    };

    topologyConfiguration.forceDirectedTopologyIcons = {
        "vpn": "img/icon_VPN.svg",
        "switching_service": "img/icon_switching_service.svg",
        "firewall": "img/icon_firewall.svg",
        "internet_breakout": "img/icon_internet_breakout.svg",
        "security_service": "img/icon_security_service.svg",
        "routing_service": "img/icon_routing_service.svg",
        "multi_service": "img/icon_multi_service.svg",
        "internet_sevices": "img/icon_internet_sevices.svg",
        "mpls": "img/icon_mpls_link.svg",
        "hub": "img/icon_hub.svg",
        "spoke": "img/icon_spoke.svg"
    };

    return topologyConfiguration;

});