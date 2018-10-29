define(function () {
    return {
        imports: [
            "import1",
            "import2"
        ],
        elements: [
            {
                "name": "nav.monitors",
                "icon": "icon_monitors",
                "children": [
                    {
                        "name": "nav.log_and_events",
                        "children": [
                            {
                                "name": "nav.logs_events_all_event_categories"
                            }, {
                                "name": "nav.logs_events_firewall"
                            }, {
                                "name": "nav.logs_events_web_filtering"
                            }, {
                                "name": "nav.logs_events_vpn"
                            }, {
                                "name": "nav.logs_events_content_filtering"
                            }, {
                                "name": "nav.logs_events_anti_spam"
                            }, {
                                "name": "nav.logs_events_anti_virus"
                            }, {
                                "name": "nav.logs_events_ips"
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
