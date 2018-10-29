/**
 *  Create Filter View for Create/Modify filter
 *
 *  @module EventViewer
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone',
	    'backbone.syphon',
	    '../conf/createFilterConfigs.js',
	    '../models/eventFilterModel.js',
	    'widgets/form/formWidget',
	    'widgets/tooltip/tooltipWidget',
        "../../../../ui-common/js/common/utils/filterUtil.js"
	    ],
function( Backbone, Syphon, Configs, EventFilterModel, FormWidget, TooltipWidget, FilterUtil) {

	var CreateFilterView = Backbone.View.extend({

  		events: {
            'click #save-new-filter': "submit",
            'click #cancel-new-filter': "cancel"
        },

       	initialize:function(options){
			console.log(options);
			this.activity = this.options.activity;
			this.context = this.options.context;
			this.category = this.options.eventCategory;
			this.filterObj = this.options.filterObj;
            this.filterUtil = new FilterUtil();
            this.filterObj["humanReadableFilterString"] = this.filterUtil.formatFilterStringToHumanReadableString(this.filterObj["filter-string"], this.options.context);
			this.filterMgmt = this.options.filterMgmt;
			this.model = new EventFilterModel();
			this.filterId = this.filterObj['id'];
            this.listenTo(this.model, "sync", this.onSync);
            this.listenTo(this.model, "error", this.onError);
			
            //this.model.clear();
		},

		render: function(){
			console.log('Create filter view rendered');
			if(typeof(this.filterId) != "undefined") {
                this.model.set('id', this.filterId);
                this.model.formMode = "EDIT";
            }

			var formConfigs = new Configs(this.context),
                formElements = formConfigs.getValues();

            this.formWidget = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.filterObj
            });
            this.addDynamicFormConfig(formElements);
            this.formWidget.build();

            // Add tooltip for content size limit
            var stringView  = this.filterObj['humanReadableFilterString'];
            this.tooltipWidgetContentView = new TooltipWidget({
                "container": this.$el.find('#human-readable-filter-string'),
                "view": stringView
            });
            this.tooltipWidgetContentView.build();

			return this;
		},

        /**
         * Model event handler
         * Called when ReST call fails
         */
        onError: function(model, response) {
            console.log('failed: ' + JSON.stringify(response));
            this.formWidget.showFormError(response.responseText);
        },

        /**
         * Model event handler
         * Called when ReST call is success
         */
        onSync: function(model, response) {
            var name = this.model.get('filter-name');
                filterId = this.model.get('id'),
                msg = "";

            $.ajax({
                url: '/api/juniper/seci/filter-management/filter-usage-by-user?event-filter-id='+filterId,
                method: "PUT"
            });
            if(this.model.formMode == "EDIT") {
                msg = "Filter " + name +  "  has been successfully updated";
                new Slipstream.SDK.Notification().setText(msg).setType('success').notify();
                this.filterMgmt['filter-id'] = filterId;
                this.filterMgmt['filter-name'] = name;
            }else {
                msg = "Filter " + name +  "  has been successfully created";
                new Slipstream.SDK.Notification().setText(msg).setType('success').notify();
            }
            this.activity.overlayWidgetObj.destroy();
        },
        /**
         * Called when Cancel button is clicked on the overlay.
         * @param {Object} event - The event object
         */
        cancel: function(event) {
            event.preventDefault();
            this.options.activity.overlayWidgetObj.destroy();
        },

        /**
         * Called when OK button is clicked on the overlay.
         * @param {Object} event - The event object
         */
        submit: function(event) {
            event.preventDefault();
            // Check is form valid
            if (! this.formWidget.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            var params = Syphon.serialize(this),
                selectedFilterId = this.filterObj['selected-filterid'],
                tags = params['filter-tags'] || "";

            if(tags == "all") {
                jsonObj = {
                    "filter-tag" : ["firewall",  "webfilter",  "vpn", "contentfilter",  "antispam",  "antivirus",  "ips"]
                };
            } else {
                jsonObj = {
                    "filter-tag" : [
                    ]
                };
                jsonObj['filter-tag'].push(tags);
            }

            if(typeof(selectedFilterId) != "undefined") {
                this.model.set('id', selectedFilterId);
            }
            jsonDataObj = {
                "filter-name" : params['filter-name'],
                "filter-description": params['filter-name'],
                "visibility": "PUBLIC",
                "aggregation": params['aggregation'],
                "starttime": params['start-time'],
                "endtime": params['end-time'],
                "duration": params['duration'],
                "filter-string":this.filterObj['filter-string'],
                "time-unit": params['time-unit'],
                "filter-tags": jsonObj,
                "formatted-filter": this.filterObj['formatted-filter']
            };

            this.model.set(jsonDataObj);
            this.model.save();
        },
       /*
        * Add dynamic form title
        */
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            switch (this.model.formMode) {
                case 'EDIT':
                    dynamicProperties.title = this.context.getMessage('ev_save_filter_form_edit');
                    break;
                default:
                    dynamicProperties.title = this.context.getMessage('ev_save_filter_form_create');
                    break;
            }
             _.extend(formConfiguration, dynamicProperties);
        }

	});

	return CreateFilterView;
});