/**
 * A configuration object for i18n messages required in the Grid widget
 *
 * @module i18nGridConfiguration
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['lib/i18n/i18n'], function (i18n) {

    var i18nGridConfiguration = {};

    i18nGridConfiguration.multiselectCellFooter = {
	    selectedLabel    : i18n.getMessage('selected'),
	    ofLabel          : i18n.getMessage('Of'),
	    selectAllText    : i18n.getMessage('Select All'),
	    deselectAllText  : i18n.getMessage('Deselect All')
    };

    i18nGridConfiguration.multiselectCellFooterTooltip = {
		dnd_title : i18n.getMessage('dnd_description_title'),
		dnd_description : i18n.getMessage('dnd_description'),
		dnd_shift_click_title : i18n.getMessage('dnd_shift_click_title'),
		dnd_shift_click_description : i18n.getMessage('dnd_shift_click_description'),
		dnd_options_click_title : i18n.getMessage('dnd_options_click_title'),
		dnd_options_click_description : i18n.getMessage('dnd_options_click_description'),
		dnd_esc_title  : i18n.getMessage('dnd_esc_title'),
		dnd_esc_description : i18n.getMessage('dnd_esc_description')
    };

	i18nGridConfiguration.moreTooltip = {
		no_data: i18n.getMessage('moreTooltip_no_data')
	};

	i18nGridConfiguration.emptyGrid = {
		'noGridData': i18n.getMessage('no_grid_data'),
		'error': i18n.getMessage('grid_data_error')
	};

    return i18nGridConfiguration;

});
