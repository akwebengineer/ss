define([], function () {
    var EditFormConf = function (context) {
        var formSections = {
            sections: [{
                'section_id': 'top10_settings',
                'section_class': 'section_class',
                'elements': [
                    {
                        'element_dropdown': true,
                        'id': 'chartType',
                        'name': 'chartType',
                        'label': context.getMessage('dashlet_chart_type'),
                        'values': [
                            {
                                'value': 'barChart', 
                                'label': context.getMessage('dashlet_bar')
                            },
                            {
                                'value': 'listChart',
                                'label': context.getMessage('dashlet_list')
                            }
                        ]
                    },
                    {
                        'element_dropdown': true,
                        'id': 'show_top',
                        'name': 'show_top',
                        'label': context.getMessage('dashlet_show_top'),
                        'values': [
                            {
                                'label': '1',
                                'value': 1
                            },
                            {
                                'label': '2',
                                'value': 2
                            },
                            {
                                'label': '3',
                                'value': 3
                            },
                            {
                                'label': '4',
                                'value': 4
                            },
                            {
                                'label': '5',
                                'value': 5
                            },
                            {
                                'label': '6',
                                'value': 6
                            },
                            {
                                'label': '7',
                                'value': 7
                            },
                            {
                                'label': '8',
                                'value': 8
                            },
                            {
                                'label': '9',
                                'value': 9
                            },
                            {
                                'label': '10',
                                'value': 10
                            }
                        ]
                    }
                ]
            }]
        };
        this.getValues = function() {
            return {
                'formSections': formSections
            };
        };
    };
    return EditFormConf;
});
