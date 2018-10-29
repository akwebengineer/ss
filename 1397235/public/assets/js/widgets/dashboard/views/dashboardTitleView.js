/**
 * A view representing the area of the dashboard containing the dasboard title.
 *
 * @module DashboardTitleView
 * @author Kiran Kashalkar <kkashalkar@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'marionette',
    'text!widgets/dashboard/templates/dashboardTitle.html',
    "text!../templates/dashboardHelpTooltip.html",
    'widgets/tooltip/tooltipWidget',
    'widgets/dropDown/dropDownWidget',
    'lib/template_renderer/template_renderer',
    'lib/i18n/i18n',
    'widgets/actionBar/actionBarWidget'
], /** @lends DashboardTitleView */
    function(Marionette,
	        dashboardTitleTpl,
            HelpTemplate,
            TooltipWidget,
            DropDownWidget,
            TemplateRenderer,
            i18n,
            ActionBarWidget) {
	/**
	 * Construct a DashboardTitleView
	 * @constructor
	 * @class DashboardTitleView
	 */
	var DashboardTitleView = Marionette.ItemView.extend({
        template: dashboardTitleTpl,
        modelEvents: {
            'change': function() {
                this.render();
            }
        },
        events: {
        	'click .dashboardAddButton': 'processAddButton',
        	'click .dashboardRefreshButton': 'processRefreshButton',
        },

        ui: {
        },

        /**
         * Initialize the view with passed in options.
         * Render the title in "opened" state
         * @inner
         */
        initialize: function(options) {
        	_.extend(this, options);
        	this._selected_category = "category_all"; //default category
            this._search_text = ""; //default search text
            this.bindEvents();
        },

        /**
         * Bind to events that we want to listen and act on
         * @inner
         */
        bindEvents: function() {
            var self = this;
            self.vent.on('dashlets:refresh:done', function() {
                self.setDashboardRefreshState('refreshed');
            });
        },

        /**
         * Set the refresh state of the dashboard for spinning icon on refresh button
         * @inner
         * @param {String} state - One of the following:
         *      "refreshing" - to start rotating the icon
         *      "refreshed"  - to stop rotating the icon
         */
        setDashboardRefreshState: function(state) {
            this.model.set('dashboardRefreshState', state);
        },

        /**
         * Process clicking of Refresh button
         * @inner
         */
        processRefreshButton: function() {
            this.setDashboardRefreshState('refreshing');
            this.refreshDashlets();
        },
        /**
         * Trigger refreshing of thumbnails
         * @inner
         */
        refreshThumbnails: function(category) {
            if (this._selected_category != category) {
                this._selected_category = category;
                this.vent.trigger('thumbnails:refresh', category, this._search_text);
            }
        },

        /**
         * Trigger refreshing of dashlets
         * @inner
         */
        refreshDashlets: function() {
            this.vent.trigger('dashlets:refresh', "refresh");
        },

        /**
         * Process clicking of Add button
         * @inner
         */
        processAddButton: function() {
        	this.toggleThumbnailContainerState();
        },
        /**
         * Toggle state when Add button is clicked - to update the icon on Add Widget button
         * @inner
         */
        toggleThumbnailContainerState: function() {
        	if (this.model.get('thumbnailContainerState') == 'closed') {
        		this.model.set('thumbnailContainerState', 'opened');
        		this.vent.trigger('thumbnails:show');
        	} else {
        		this.model.set('thumbnailContainerState', 'closed');
        		$('.dashboardAddButton', this.$el).addClass('thumbnailContainerClosed');
        		this.vent.trigger('thumbnails:hide');
        	}
        },
        serializeData: function() {
        	return {
        		dashboard_title: this.model.get('dashboard_title'),
        		add_widget_button_label: i18n.getMessage('add_widget_button_label'),
                dashboard_help_message: i18n.getMessage('dashboard_help_message'),
        		thumbnailContainerState: this.model.get('thumbnailContainerState'),
                dashboardRefreshState: this.model.get('dashboardRefreshState'),
                overview_help_key: this.model.get('overview_help_key'),
        	}
        },
        getTooltipView: function(help) {
            var tooltipView  = TemplateRenderer(HelpTemplate,{
                'help-content':help['content'],
                'ua-help-text':help['ua-help-text'],
                'ua-help-identifier':help['ua-help-identifier']
            });
            return $(tooltipView);
        },
        addTooltipHelp: function(help) {
            new TooltipWidget({
                "elements": {
                    "interactive": true,
                    "maxWidth": 300,
                    "minWidth": 300,
                    "position": "right"
                },
                "container": this.$el.find('.dashboard-overview-help'),
                "view": this.getTooltipView(help)
            }).build();
        },
        addCategoriesDropdown: function() {
            var self = this;

            var categoriesDropdown = new DropDownWidget({
                "container": this.$el.find('.dashboardCategories'),
                "data": this.model.get('categories'),
                "onChange": function (event) {
                    var category = event.target.value;
                    self.refreshThumbnails(category);
                }
            }).build();

            categoriesDropdown.setValue({
                "id": this.model.get('selectedCategory'),
                "text": i18n.getMessage(this.model.get('selectedCategory'))
            });

        },
        addActionBar: function () {
            var self = this;
            var actionBarConfiguration = {
                "container": this.$el.find('.dashboardSearch')[0],
                "actions": [
                    {
                        "separator_type": true
                    },
                    {
                        "search_type": true,
                        "key": "searchAction",
                        "searchOnEnter": false
                    }
                ],
                "events": {
                    "searchAction": {
                        "handler": [function (evt, actionObj) {
                            self.searchActionHandler(actionObj.search);
                        }]
                    }
                }
            };
            new ActionBarWidget(actionBarConfiguration).build();
        },
        searchActionHandler: function (searchText) {
            this._search_text = searchText;
            this.vent.trigger('thumbnails:refresh', this._selected_category, searchText);
        },
        onRender: function() {
            var heading = {
                "title": i18n.getMessage('dashboard_help_message'),
                "title-help":{
                    "content" : i18n.getMessage('dashboard_help_message'),
                    "ua-help-text": i18n.getMessage('more_link'),
                    "ua-help-identifier": this.model.get('overview_help_key')
                }
            };

            if (this.model.get('categories')) {
                this.addCategoriesDropdown();
            }
            this.addActionBar();
            this.addTooltipHelp(heading['title-help']);
        }
    });

    return DashboardTitleView;
});
