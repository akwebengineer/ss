define([
    'backbone',
    'lib/template_renderer/template_renderer',
    'text!explorer/widgets/templates/widgetLib.html',
    'text!explorer/widgets/templates/nav.html',
    'explorer/widgets/conf/widgetLibConf'
], function (Backbone, render_template, body,nav,config) {
	var start = Backbone.View.extend({
		events: {
			"click .collapsible-header" : "collapsibleMenu",
			"click #display-toggle":"displayToggle",
			"click #side-overlay":function(){this.sideClickfunc("#side-overlay")},
			"click #side-tabContainer":function(){this.sideClickfunc("#side-tabContainer")},
			"click #side-timeRange":function(){this.sideClickfunc("#side-timeRange")},
			"click #side-tooltip":function(){this.sideClickfunc("#side-tooltip")},
			"click #side-tree":function(){this.sideClickfunc("#side-tree")},
			"click #side-search":function(){this.sideClickfunc("#side-search")},
			"click #side-shortWizard":function(){this.sideClickfunc("#side-shortWizard")},
			"click #side-login":function(){this.sideClickfunc("#side-login")},
			"click #side-scheduleRecurrence":function(){this.sideClickfunc("#side-scheduleRecurrence")},
			"click #side-map":function(){this.sideClickfunc("#side-map")},
			"click #side-layout":function(){this.sideClickfunc("#side-layout")},
			"click #side-contextMenu":function(){this.sideClickfunc("#side-contextMenu")},
			"click #side-dashboard":function(){this.sideClickfunc("#side-dashboard")},
			"click #side-bar":function(){this.sideClickfunc("#side-bar")},
			"click #side-carousel":function(){this.sideClickfunc("#side-carousel")},
			"click #side-confirmation":function(){this.sideClickfunc("#side-confirmation")},
			"click #side-date":function(){this.sideClickfunc("#side-dat")},
			"click #side-donut":function(){this.sideClickfunc("#side-donut")},
			"click #side-drop":function(){this.sideClickfunc("#side-drop")},
			"click #side-form":function(){this.sideClickfunc("#side-form")},
			"click #side-grid":function(){this.sideClickfunc("#side-grid")},
			"click #side-ip":function(){this.sideClickfunc("#side-ip")},
			"click #side-line":function(){this.sideClickfunc("#side-line")},
			"click #side-list":function(){this.sideClickfunc("#side-list")},
			"click #side-progress":function(){this.sideClickfunc("#side-progress")},
			"click #side-spinner":function(){this.sideClickfunc("#side-spinner")},
			"click #side-time":function(){this.sideClickfunc("#side-time")},
			"click #side-timez":function(){this.sideClickfunc("#side-timez")},
			"click #side-timesc":function(){this.sideClickfunc("#side-timesc")},
			"click #overlay":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=overlay&formVal=arr&formExt=false")},
			"click #tabContainer":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=tabContainer&formVal=arr&formExt=false")},
			"click #timeRange":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=timeRange&formVal=arr&formExt=false")},
			"click #tooltip":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=tooltip&formVal=arr&formExt=false")},
			"click #tree":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=tree&formVal=arr&formExt=false")},
			"click #search":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=search&formVal=arr&formExt=false")},
			"click #shortWizard":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=shortWizard&formVal=arr&formExt=false")},
			"click #scheduleRecurrence":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=scheduleRecurrence&formVal=arr&formExt=false")},
			"click #map":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=map&formVal=arr&formExt=false")},
			"click #login":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=login&formVal=arr&formExt=false")},
			"click #layout":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=layout&formVal=arr&formExt=false")},
			"click #dashboard":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=dashboard&formVal=arr&formExt=false")},
			"click #contextMenu":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=contextMenu&formVal=arr&formExt=false")},
			"click #bar":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=barChart&formVal=arr&formExt=false")},
			"click #carousel":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=carousel&formVal=arr&formExt=true")},
			"click #confirmation":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=confirmationDialog&formVal=arr&formExt=false")},
			"click #date":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=datepicker&formVal=arr&formExt=true")},
			"click #donut":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=donutChart&formVal=arr&formExt=false")},
			"click #drop":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=dropDown&formVal=obj&formExt=true")},
			"click #form":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=form&formVal=obj&formExt=true")},
			"click #grid":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=grid&formVal=obj&formExt=false")},			
			"click #ip":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=ipCidr&formVal=arr&formExt=false")},
			"click #line":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=lineChart&formVal=arr&formExt=false")},
			"click #list":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=listBuilderNew&formVal=obj&formExt=true")},
			"click #progress":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=progressBar&formVal=arr&formExt=false")},
			"click #spinner":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=spinner&formVal=arr&formExt=false")},
			"click #time":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=time&formVal=arr&formExt=true")},
			"click #timez":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=timeZone&formVal=arr&formExt=true")},
			"click #timesc":function(){window.open("/assets/js/explorer/widgets/tabs.html#widget=timeSeriesChart&formVal=arr&formExt=false")},
		},
		initialize: function(){
			this.addContent(this.$el.find("#nav-mobile"), nav,config.nav);
			this.addContent(this.$el.find("#card-body"), body,config.lib);
			this.sideIds =["#side-overlay","#side-tree","#side-tooltip","#side-timeRange","#side-tabContainer","#side-shortWizard","#side-search","#side-scheduleRecurrence","#side-map","#side-login","#side-layout","#side-dashboard","#side-contextMenu","#side-bar","#side-carousel","#side-confirmation","#side-date","#side-donut","#side-drop","#side-form","#side-grid","#side-ip","#side-line","#side-list","#side-progress","#side-spinner","#side-time","#side-timez","#side-timesc"];
			this.cardIds =["#overlay","#tree","#tooltip","#timeRange","#tabContainer","#shortWizard","#search","#scheduleRecurrence","#map","#login","#layout","#dashboard","#contextMenu","#bar","#carousel","#confirmation","#date","#donut","#drop","#form","#grid","#ip","#line","#list","#progress","#spinner","#time","#timez","#timesc"];
		},
		addActive: function(id){
			$(id).css("background-color","#80cbc4");
			$(id).css("color","white");
		},
		removeActive: function(id){
			$(id).css("background-color","white");
			$(id).css("color","black");
		},
		removeCard :function(id){
			$(id).css("display","none");
		},
		addCard :function(id){
			$(id).css("display","block");
		},
		sideClickfunc :function(id){
			this.addActive(id);
			for(var ii=0;ii<this.sideIds.length;ii++){
				if(this.sideIds[ii] != id){
					this.removeActive(this.sideIds[ii]);
				}
			}
			var card=id.replace("side-","");
			for(var ii=0;ii<this.cardIds.length;ii++){
				if(this.cardIds[ii] != card){
					this.removeCard(this.cardIds[ii]);
				}
				else{
					this.addCard(this.cardIds[ii]);
				}
			}
		},
		toggleToList:function(){
			for(var ii=0;ii<this.cardIds.length;ii++){
				$(this.cardIds[ii]).removeClass("l3");
				$(this.cardIds[ii]).addClass("l12");
				$(this.cardIds[ii]).css("height",130);
				$(this.cardIds[ii]).find('.card').css("height",90);
				$(this.cardIds[ii]).find('.card-content').css("height",90);
			}
		},
		toggleToCard: function(){
			for(var ii=0;ii<this.cardIds.length;ii++){
				$(this.cardIds[ii]).removeClass("l12");
				$(this.cardIds[ii]).addClass("l3");
				$(this.cardIds[ii]).css("height","");
				$(this.cardIds[ii]).find('.card').css("height","");
				$(this.cardIds[ii]).find('.card-content').css("height","");
			}
		},
		displayToggle: function(){
			if($('#display-toggle').html() == "menu"){
				$('#display-toggle').html("view_module")
				this.toggleToList();
			}
			else{
				$('#display-toggle').html("menu")
				this.toggleToCard();
			}
		},
		collapsibleMenu: function(){
			if($(".collapsible-body").css("display") == "none"){
				$(".collapsible-body").css("display","block");
				for(var ii=0;ii<this.cardIds.length;ii++){
						this.addCard(this.cardIds[ii]);
				}
			}
			else{
				$(".collapsible-body").css("display","none");
				for(var ii=0;ii<this.cardIds.length;ii++){
						this.addCard(this.cardIds[ii]);
				}
			}
		},
		addContent:function($container, template, configuration) {
            $container.append((render_template(template,configuration)));
            
        }
	});
	return start;
});