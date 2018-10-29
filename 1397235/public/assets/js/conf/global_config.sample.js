(function() {
    var opts = {
        logo: {
            link: "/mainui",
            tooltip: "logo_tooltip",
            img: {
                src: "/assets/images/icon_logoSD.svg",
                width: "144px",
                height: "24px"
            }
        },
        login :{
            view: "widgets/login/tests/view/customLoginView"
        },
        analytics: {
            piwik: {
                serverUrl: "/_analytics/piwik.php"
            }
        },
        theme: "custom",

        product_name: "product_name",
        product_version: "product_version",
        product_release_year: "product_release_year",
        device_model: 'device_model',

        url: '//www.juniper.net/techpubs/{{language}}/junos-space15.2/junos-space-security-director',
        baseUrl: '//www.juniper.net/techpubs/{{language}}/',
        global_help: {
            actions: [
                {
                    // Selected hosted Getting started html file, if not available select local help file
                    // server configuration will have a proxy mapping for '/documentation' to - http://www.juniper.net/documentation/
                    "label": '{{{global_help_getting_started_label}}}',
                    "urlType": "internal",
                    "trgtURL": {
                        "/documentation/en_US/help/junos-space15.2/topics/concept/adminHelpUrl": {  // /adminHelpUrl is a proxy mapping to the hosted help file for all admin capability
                            "capabilities": ["admin"]
                        },
                        "/documentation/en_US/help/junos-space15.2/topics/concept/defaultHelpUrl": {  // /defaultHelpUrl is a proxy mapping to the hosted help file for all non-admin capability
                            "capabilities": [""]
                        }
                    },
                    // Local Getting Started File packaged in the build
                    "trgtLocalURL": {
                        "/help/en/ix/gsg-concept-adminLink.html": {  // local admin url
                            "capabilities": ["admin"]
                        },
                        "/help/en/ix/gsg-concept-defaultLink.html": {  // local default url
                            "capabilities": [""]
                        }
                    },
                    // Online help center url for the Getting Started
                    "trgtOnlineURL": {
                        "junos-space15.2/help/topics/concept/ap-getting-started.html": {
                            "capabilities": ["admin"]
                        },
                        "junos-space15.2/help/topics/concept/cp-getting-started.html": {
                            "capabilities": [""]
                        }
                    }
                },
                {
                    "label": '{{{global_help_help_center_label}}}',
                    "urlType": "external",
                    "trgtURL": {
                        "cso2.0/help/information-products/pathway-pages/index-adminLink.html": { // admin url
                            "capabilities": ["admin"]
                        },
                        "cso2.0/help/information-products/pathway-pages/index-defaultLink.html": { // default url
                            "capabilities": [""]
                        }
                    }
                },
                {
                    "label": '{{{global_help_faq_label}}}',
                    "urlType": "external",
                    "trgtURL": {
                        "cso2.0/help/topics/concept/ap-FAQs-adminLink.html": { // admin url
                            "capabilities": ["admin"]
                        },
                        "cso2.0/help/topics/concept/ap-FAQs-defaultLink.html": { // default url
                            "capabilities": [""]
                        }
                    }
                },
                {
                    "label": '{{{global_help_release_notes_label}}}',
                    "urlType": "external",
                    "trgtURL": {
                        "nfv2.0/help/information-products/topic-collections/release-notes/release-notes-adminLink.html": { // admin url
                            "capabilities": ["admin"]
                        },
                        "nfv2.0/help/information-products/topic-collections/release-notes/release-notes-defaultLink.html": { // default url
                            "capabilities": [""]
                        }
                    }
                },
                // About html will always be stored locally
                {
                    "label": '{{{global_help_about_label}}}',
                    "urlType": "internal",
                    "trgtURL": {
                        "/documentation/en_US/help/junos-space15.2/topics/concept/ap-about-panel.html": {
                            "capabilities": ["admin"]
                        },
                        "/documentation/en_US/help/junos-space15.2/topics/concept/cp-about-panel.html": {
                            "capabilities": [""]
                        }
                    },
                    "trgtLocalURL": {
                        "/help/en/ix/aboutAdmin.html": { // local admin about url
                            "capabilities": ["admin"]
                        },
                        "/help/en/ix/about.html": { // local default about url
                            "capabilities": [""]
                        }
                    }
                }
            ],
            // Sample mapping for contextual opening the help activity from the application
            displayPanel: {
                "getting_started": {
                    "topics": {
                        "sdwan": "jd0e171" // Id mapping to the content
                    }
                },
                "whats_new": {
                    "topics": {
                        "bugFix": "jd0e10" // Id mapping to the content
                    }
                }
            },
            // Sample mapping for opening an application page or an overlay.
            displayAppOverlay: {
                "add_tenant": {
                    "action": "admin-portal-tenant/tenant_management",
                    "mime_type": "admin-portal-tenant/tenant_management",
                    "customizeIntent": function (originalIntent) { // non-mandatory method, for apps to customize the intent
                        var intent = $.extend(new Slipstream.SDK.Intent(), originalIntent);
                        intent.putExtras({autostart_action: "create"});
                        return intent;
                    }
                }
            }
        },
        feedback: {
            email: 'supports@juniper.net', //receiver's email
            custom_content: 'Custom Content: custom message' //add custom content in the email
        }
    };

    if (typeof define === "function" && define.amd) {
        define(function() {
            return opts;
        });
    } 
    else if (typeof module === "object" && typeof module.exports === "object") {
       module.exports = opts;
    } 
})();
