/**
 * View to LDAP Grid View
 *
 * @module LDAPGridView
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/grid/gridWidget',
    '../conf/ldapServerGridConf.js',
    '../views/ldapServerFormView.js',
    'widgets/overlay/overlayWidget'
], function (
    Backbone,
    Syphon,
    GridWidget,
    LdapServerGridConf,
    LdapServerFormView,
    OverlayWidget
    ) {

    var LdapServerGridView =  Backbone.View.extend({
        /**
         * Initialize Backbone view
         * @param options
         */
        initialize: function(options) {

            this.parentView = options.parentView;
            this.context = options.context;
            this.buildGrid();

        },
        /**
         * build common gridwidget for Ldap server
         * @returns {LdapServerGridView}
         */
        buildGrid: function() {
            var self = this,
                formConfiguration = new LdapServerGridConf(self.context),
                elements = formConfiguration.getValues(),
                container = self.parentView.$el.find('#access_profile_ldap_server').empty();
            self.gridWidget = new GridWidget({
                container: container,
                actionEvents : {createEvent: "addEvent", updateEvent: "editEvent",deleteEvent: "deleteAction"},
                elements: elements
            });

            self.gridWidget.build();
            container.find(".grid-widget").addClass("elementinput-ldap-server-grid");
            self.bindGridEvents();
            return self;
        },
        /**
         * bind add and edit event to the LDAP server grid
         */
        bindGridEvents: function () {
            var self = this;
            self.parentView.$el.bind( "addEvent", $.proxy(self.onAddLdapServer, self));
            self.parentView.$el.bind( "editEvent", $.proxy(self.onEditLdapServer, self));

        },
        /**
         * add LDAP server event handler
         */
        onAddLdapServer: function(){
            this.buildLdapServerOverlay();
        },
        /**
         * edit LDAP server event handler
         */
        onEditLdapServer: function(e, row){
            this.buildLdapServerOverlay(row);
        },
        /**
         * buit overlay for add/edit LDAP server view
         * @param row
         */
        buildLdapServerOverlay: function(row){
            this.overlay = new OverlayWidget({
                view : new LdapServerFormView({activity:this, rowData:row}),
                type : 'large',
                showScrollbar : true
            });

            this.overlay.build();
//            if(!this.overlay.getOverlayContainer().hasClass(this.context["ctx_name"])){
//                this.overlay.getOverlayContainer().addClass(this.context["ctx_name"]);
//            }
        },
        /**
         * fetch grid data
         * @returns {grid visible rows}
         */
        getAllVisibleRows: function(){
            return this.gridWidget.getAllVisibleRows();
        },
        addGridData: function(data){
           if(data){
               this.gridWidget.addRow(data)
           }
        }

    });

    return LdapServerGridView;
});