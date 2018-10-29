define(function () {

    return [
        {
            "name": "nav.widgets",
            "icon": "icon_dashboard",
            "children": [
                {
                    "name":"nav.form_elements",
                    "children":[
                        {
                            "name": "nav.widgets_form"
                        },
                        {
                            "name": "nav.widgets_dropDown"
                        },
                        {
                            "name": "nav.widgets_listBuilder"
                        },
                        {
                            "name": "nav.widgets_slider"
                        },
                        {
                            "name": "nav.widgets_toggleButton"
                        },
                        {
                            "name": "nav.widgets_datePicker"
                        },
                        {
                            "name": "nav.widgets_time"
                        },
                        {
                            "name": "nav.widgets_timeZone"
                        },
                        {
                            "name": "nav.widgets_ipCidr"
                        },
                        {
                            "name": "nav.widgets_scheduleRecurrence"
                        }
                    ]
                },
                {
                    "name":"nav.widgets_grid",
                },
                {
                    "name":"nav.layout",
                    "children":[

                        {
                            "name": "nav.widgets_shortWizard"
                        },
                        {
                            "name": "nav.widgets_tabContainer"
                        },
                        {
                            "name": "nav.widgets_accordion"
                        },
                        {
                            "name": "nav.widgets_layout"
                        },
                        {
                            "name": "nav.widgets_overlay"
                        }
                    ]
                },
                {
                    "name":"nav.cards",
                    "children":[
                        {
                            "name": "nav.widgets_cardLayout"
                        },
                        {
                            "name": "nav.widgets_carousel"
                        }
                    ]
                },
                {
                    "name":"nav.progress",
                    "children":[
                        {
                            "name": "nav.widgets_spinner"
                        },
                        {
                            "name": "nav.widgets_progressBar"
                        }
                    ]
                },  {
                    "name":"nav.utility",
                    "children":[
                        {
                            "name": "nav.widgets_tooltip"
                        },
                        {
                            "name": "nav.widgets_contextMenu"
                        },
                        {
                            "name": "nav.widgets_search"
                        },
                        {
                            "name": "nav.widgets_queryBuilder"
                        },
                        {
                            "name": "nav.widgets_tree"
                        },
                        {
                            "name": "nav.widgets_login"
                        },
                        {
                            "name": "nav.widgets_confirmationDialog"
                        }
                    ]
                },
                {
                    "name":"nav.charts",
                    "children":[
                        {
                            "name": "nav.widgets_barChart"
                        },
                        {
                            "name": "nav.widgets_lineChart"
                        },
                        {
                            "name": "nav.widgets_donutChart"
                        },
                        {
                            "name": "nav.widgets_timeSeries"
                        },
                        {
                            "name": "nav.widgets_timeRange"
                        }
                    ]
                },
                {
                    "name":"nav.nav.topology_map",
                    "children":[
                        {
                            "name": "nav.widgets_topology"
                        },
                        {
                            "name": "nav.widgets_map"
                        }
                    ]
                }
            ]
        },
        {
            "name": "nav.component",
            "icon": "icon_monitors",
            "children":[
                {
                    "name":"nav.card_components"
                },
                {
                    "name":"nav.spinner_components"
                }
            ]
        }
    ];

});
