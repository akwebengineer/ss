define(['backbone', 
		'../conf/appSecureConfigs.js', 
		'widgets/listBuilderNew/listBuilderWidget',
		'../conf/selectDevicesFormConfiguration.js',
		'text!../templates/deviceSelectionTemplate.html',
		'widgets/form/formWidget',
		'lib/template_renderer/template_renderer', 
		'../../../sd-common/js/devices/widgets/devicesListBuilder.js',
		'../service/appSecureService.js'],
		function(Backbone, 
				Config, 
				ListBuilderWidget, 
				FormConfig, 
				Template, 
				FormWidget, 
				TemplateRenderer, 
				DevicesListBuilder,
				AppSecureService){
	var DeviceSelectionView = Backbone.View.extend({

	    events: {
	    	"click #linkSelectDevicesCancel": "onCancelClick",
	    	"click #btnSelectDevicesOk": "onOkClick",
	      	"change input:radio[name=app_vis_device_selection_radio]:checked": "onDeviceTypeSelection"
	    },
	    onOkClick: function(event){
	    	var me=this,
	    		invokeGetSelected;
			event.preventDefault();
			invokeGetSelected = function(data){
				me.listBuilder.destroy();
				me.options.getSelectedItems(data);
			};
			//
			if(me.$el.find("#app_vis_device_selection_all").is(":checked") === true){
				var data = {
					devices:{
						device:[]
					}
				};
				invokeGetSelected(data);
			}else{
				me.listBuilder.getSelectedItems(function(data){
					var selectedIds=[];
					//
					if(data.devices.total > 0){
						data.devices.device.forEach(function(element){
							selectedIds.push(element['id']);
						});
						//
						me.service.getPlatformDeviceIds(selectedIds, function(response){
							console.log(response);
							var returnData={
								devices:{
									device:[]
								}
							};
							response['device-id-map']['idEntry'].forEach(function(element){
								var obj = {
									"id": element['sd-device-id'],
									"plt-ids":[]
								};
								element['platform-device-ids'].forEach(function(pltFormDeviceElementId){
									obj["plt-ids"].push({
										"id": pltFormDeviceElementId
									});
								})
								returnData.devices.device.push(obj);
							});
							invokeGetSelected(returnData);
						});
						//						
					}else{
						invokeGetSelected(data);
					}
				});
			}
	    },
		onCancelClick: function(){
	    	this.listBuilder.destroy();
	    	this.options.cancelOverlay();
		},
		initialize:function(options){
			console.log("Device selector initialized");
			var me=this;
			me.options = options;
			me.service = new AppSecureService();
			me.configs = new Config(options.context);
		},
		setDeviceType: function(){
			var me=this;
			if(me.options.selectedDeviceIDs.length > 0){
				me.$el.find("#app_vis_device_selection_all").attr("checked", false);
				me.$el.find("#app_vis_device_selection_selective").attr("checked", true);
			}else{
				me.$el.find("#app_vis_device_selection_all").attr("checked", true);
				me.$el.find("#app_vis_device_selection_selective").attr("checked", false);
				me.$el.find(".list-builder").hide();
			}
		},
		render: function(){
			var me=this,
				form,
				formConfig = new FormConfig(me.options.context);
			//
            form = new FormWidget({
                container: this.el,
                elements: formConfig.getValues()
            });
			form.build();
			//
			me.addListBuilder();
			//
			me.setDeviceType();
			//
			//
			/*
			me.$el.append(TemplateRenderer(Template));
			me.containers = {
				"mainContainer": me.$el.find(".app-vis-device-selection-container")
			};
			//
			me.listBuilder = new ListBuilderWidget({
				"elements": me.configs.getDeviceConfig(me.options.selectedDeviceIDs),
				"container":me.containers.mainContainer
			});
			me.listBuilder.build();*/
			return me;
		},
		//
		addListBuilder: function (selectedItems) {
	      var me = this;
	      var listContainer = this.$el.find('#app_vis_deviceListBuilder');
	      listContainer.attr("readonly", "");

	      me.listBuilder = new DevicesListBuilder({
	          context: me.options.context,
	          container: listContainer,
	          selectedItems: me.options.selectedDeviceIDs//array of id's
	      });

	      me.listBuilder.build(function() {
	          listContainer.find('.new-list-builder-widget').unwrap();
	      });
    	},
	    onDeviceTypeSelection: function(event){
	    	//
	    	var me=this;
	    	if(event.currentTarget.value === "SELECTIVE-DEVICES"){
				me.$el.find(".list-builder").show();
	    	}else{
	    		me.$el.find(".list-builder").hide();
	    	}
	    	//
	    }
    	//
	});
	return DeviceSelectionView;
});