/**
 * A view to list policy page
 *
 * @module BasePolicyGridView
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'backbone',
  'widgets/grid/gridWidget',
  '../../../../../ui-common/js/common/intentActions.js',
  '../../../../../ui-common/js/views/gridView.js',
  '../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
  'widgets/spinner/spinnerWidget',
  './basePolicyLockTooltipView.js'
], function (Backbone,GridWidget,IntentActions,GridView,SmSSEEventSubscriber,SpinnerWidget,PolicyLockTooltipView) {

    var BasePolicyGridView =GridView.extend({

        events: {
            "click #ruleLink": "launchRulesView",          
            'click #device-count': "launchDevicesView"
        },

        initialize: function (options) {
          var self=this;
          this.conf = options.conf;
          this.actionEvents= options.actionEvents;
          this.context = options.context;
          this.collection = options.collection;
          this.filterSearchSortOptions= {
            FILTER : undefined,
            SEARCH : undefined,
            SORT : undefined
          };
          this.cuid = options.cuid;
          this.filter = options.filter;
          this.search = options.search;
          this.policyManagementConstants = options.policyManagementConstants;
          this.smSSEEventSubscriber =  new SmSSEEventSubscriber();
          this.delayedTask = undefined;
          this.subscribeNotifications();
          /* create spinner */
          this.spinner = new SpinnerWidget({
                "container": this.el
           });
          this.bindModelEvents();
         },

        subscribeNotifications : function () {
            //Subscribe to the SSE event
            var self = this;
            var notificationSubscriptionConfig = {
                'uri' : [self.policyManagementConstants.BASE_POLICY_URL,
                        self.policyManagementConstants.getPolicyLockUrl(),
                        self.policyManagementConstants.getPolicyUnlockUrl()],
                'autoRefresh' : true,
                'callback' : function () {
                  console.log("Notification received for policy grid page");
                  var fireHandleNotification = $.proxy(self.handleNotification,self);
                  if(self.delayedTask) {
                    clearTimeout(self.delayedTask);
                  }
                  self.delayedTask = _.delay(fireHandleNotification,500);
                }
            };
            var sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self.view);
            self.sseEventSubscriptions =self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);

            return self.sseEventSubscriptions;
        },

        handleNotification : function(){
          var self=this;
          self.delayedTask=undefined;
          $(self.$el).trigger("showloading"); 
          self.collection.fetch({url :self.collection.url(),filterSearchSortOptions:self.filterSearchSortOptions});
        },

        unSubscribeNotifications: function(){
            this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
            this.smSSEEventSubscriber = null;
            this.sseEventSubscriptions = null;
        },

        close: function() {
          this.resetFilterSearchSortOptions();
          this.unSubscribeNotifications();
        },

        /*Method to set search parameter*/
        setSearchOptions: function (searchToken) {
          var me = this;
          me.filterSearchSortOptions["SEARCH"] = searchToken;
        },

        /*Method to set filter parameter*/
        setFilterOptions: function (searchFilter) {
          var me = this;
          me.filterSearchSortOptions["FILTER"] = searchFilter;
        },

        /*Method to set sort parameter*/
        setSortOptions: function (sortOptions) {
          var me = this;
          me.filterSearchSortOptions["SORT"] = sortOptions;
        },

        /*Method to reset filter,search and sort options so that on reload the page will be rendered with all data*/
        resetFilterSearchSortOptions: function () {
          var me = this;
          me.filterSearchSortOptions["FILTER"] = undefined;
          me.filterSearchSortOptions["SORT"] = undefined;
          me.filterSearchSortOptions["SEARCH"] = undefined;
        },

        /* Method to handle sorting which is invoked from customSortCallback in the grid configuration
         * Sets the columnName and sortOrder and re-fetches the collection*/
        handleSorting: function (columnIndex, columnName, sortOrder) {
          var self = this, sortingOptions = {};
          sortingOptions.columnName = columnName;
          sortingOptions.sortOrder = sortOrder;
          self.setSortOptions(sortingOptions);
          $(self.$el).trigger("showloading"); 
          self.collection.fetch({url: self.collection.url(),filterSearchSortOptions:self.filterSearchSortOptions});
        },

        // On click of device count launch the Devices view
        launchDevicesView: function (e) {
           var self=this;
           var policyObj = JSON.parse($(e.target).attr('data-policy-obj'));
           // Launch the activity for associated rules view
           var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
               {
                   mime_type: self.getDeviceMimetype()
               }
           );
           intent.putExtras({data: policyObj});
           this.options.context.startActivity(intent);
        },

        getDeviceMimetype: function() {
        },

        render: function() {
            var me=this;
            this.conf.filter = me.addSearchFilter();
            me.gridWidget = new GridWidget({
                container: this.el,
                elements: this.conf,
                actionEvents: ($.isEmptyObject(this.actionEvents)) ? null : this.actionEvents,
                cellTooltip:$.proxy(me.cellTooltip,me),
                sid: me.getSID()
            });
            
          $(me.$el).trigger("showloading"); 
           me.buildGridWidget();


            if(me.filter || me.search){
              var filter = me.filter;
              var filterTokens = [];
              if(filter) {
                filterTokens.push(filter);
              }
              if(me.search) {    
                filterTokens.push(me.search);
              }  
              me.gridWidgetObject.search(filterTokens);
            } else {
                me.collection.fetch({url :me.collection.url(),filterSearchSortOptions:me.filterSearchSortOptions});
            }    

            return this;
        },

        buildGridWidget: function() {
            var me = this;
            $.when(me.gridWidget.build()).done(function(response) {
                me.gridWidgetObject = response;
            });

        },

        cellTooltip:function(cellData, renderTooltip) {
            var me = this, policyId = cellData.rawData.id;
            $.ajax({
                type: 'GET',
                url: me.collection.url()+policyId+"/locks",
                dataType:"json",
                headers: {
                    'accept': me.policyManagementConstants.POLICY_LOCK_ACCEPT
                },
                success: function(data) {
                    var lockTooltip = new PolicyLockTooltipView({policyId:policyId, lockInfo: data, context: me.context, gridEl: me.$el});
                    lockTooltip.render();
                    renderTooltip(lockTooltip.$el);
                }
            });
        },

      addSearchFilter : function(){
        var me = this;
        return {
          searchResult: function (tokens, renderGridData) {
            var searchFilter = "",
              searchArr = [],
              searchToken = "",
              andOperator = " and ";

            if (!$.isEmptyObject(tokens)) {
              for (var i = 0; i < tokens.length; i += 2) {
                var token = tokens[i],
                  formattedToken = "";
                if ($.isArray(token)) {
                  formattedToken = me.collection.formatSearchString(token);
                } else {
                  searchArr.push(token);
                }
                if (!_.isEmpty(formattedToken)) {
                  searchFilter !== "" ? (searchFilter += "+and+" + formattedToken) : searchFilter = formattedToken;
                }
              }
            }
            if (searchArr.length == 1) {
              searchToken += searchArr[0];
            } else if (searchArr.length > 1) {
              searchToken += "(" + searchArr.join(andOperator) + ")";
            }
            me.setSearchOptions(searchToken);
            me.setFilterOptions(searchFilter);
            me.collection.fetch({url: me.collection.url(),filterSearchSortOptions:me.filterSearchSortOptions});
            renderGridData({});
          },
          columnFilter: true,
          showFilter: {
            quickFilters: [{
              "label":this.context.getMessage("hide_empty_devices"),
              "key":me.policyManagementConstants.HIDE_POLICIES_WITH_NO_DEVICES
            },{
              "label":this.context.getMessage("hide_empty_rules"),
              "key":me.policyManagementConstants.HIDE_POLICIES_WITH_NO_RULES
            }]
          }
        };
      },

        bindModelEvents : function() {
          var self = this;
          self.collection.bind('fetchComplete', function (collection, response, options) {
            var policies = self.getPolicies(collection),
                gridWidgetObject = self.gridWidgetObject,
                selectedRows = gridWidgetObject.getSelectedRows(),
                totalCount = policies.length,
                requestedCount = options.rows,
                page = options.page,
                totalPages = Math.ceil(totalCount/requestedCount), selectedRowIdsList = [],newSelectedRowIdsList = [];

            $.each(selectedRows, function (i, policy) {
              selectedRowIdsList.push(policy["id"]);
              if(self.collection.get(policy["id"])) {
                newSelectedRowIdsList.push(policy["id"]);
              }
            });
            gridWidgetObject.toggleRowSelection(selectedRowIdsList,'unselected');

            self.clearGrid();
            gridWidgetObject.addPageRows(policies, {
              numberOfPage: 1,
              totalPages: 1,
              totalRecords: totalCount});
            self.collection.resetCollection = false;
            self.addTreeViewRendering();
            gridWidgetObject.toggleRowSelection(newSelectedRowIdsList,'selected');
            $(self.$el).trigger('policygridreloadcomplete');
            $(self.$el).trigger('destroyloading');

          });
/* show & destroy spinner */
          $(this.$el).bind('showloading', function() {self.showSpinner()})
          .bind('destroyloading', function() {self.destroySpinner()});

          self.$el.bind("policygridnodeexpand", function (e, policy) {
              self.groupExpandCollapseHandler(policy, "expand");
          })
          .bind("policygridnodecollapse", function (e, policy) {
              self.groupExpandCollapseHandler(policy, "collapse");
          });
        },
       /* show spinner */
        showSpinner : function() {
            this.spinner.build();
        },
        /* destroy spinner */
        destroySpinner : function() {
            if( this.spinner) {
             this.spinner.destroy();
            }
            
        },

        clearGrid: function() {
            var self = this;
            $('#'+self.conf.tableId).jqGrid('clearGridData');
        },

        getPolicies : function(collection) {
          return _.pluck(collection.toJSON(), 'policy');
        },  

        groupExpandCollapseHandler : function(policy,eventName) {
          this.reloadGridData(policy);
        },        

        // On click of policy name launch the rules view
        launchRulesView: function (e) {
           var self=this;
           var policyId = $(e.target).attr('data-policy-obj');
           var launchWizard = $(e.target).attr('launchWizard');
           // Launch the activity for associated rules view
           var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
               {
                   mime_type: self.getMimeType()
               }
           );
           intent.putExtras({objectId: policyId, launchWizard: launchWizard, view:'rules'});
           this.options.context.startActivity(intent);
        },

        getMimeType : function() {

        },

        getGridTable: function() {
          var tableId = "#"+this.conf.tableId;
          return this.$el.find(tableId);
        },

        emptyGridRows: function() {
          var self = this;
          var gridTable = self.getGridTable();
          gridTable.jqGrid('clearGridData');
        },

        getTreeColumnPosition: function() {
          var $this = this.getGridTable(), cm = $this.jqGrid('getGridParam', 'colModel'), iCol,
              l = cm.length;

          for (iCol = 0; iCol < l; iCol++) {
            if (cm[iCol].name === "sequence-number") {
              return iCol;
            }
          }
        },

        getIconsColumnPosition: function() {
          var $this = this.getGridTable(), cm = $this.jqGrid('getGridParam', 'colModel'), iCol,
              l = cm.length;

          for (iCol = 0; iCol < l; iCol++) {
            if (cm[iCol].name === "icons") {
              return iCol;
            }
          }
        },

        addTreeViewRendering: function() {
          var me = this, $this = me.getGridTable(), iCol = me.getTreeColumnPosition(), iconsCol = me.getIconsColumnPosition();
          $this.each(function () {
            var $t = this, rows = $t.rows;
            $.each(rows, function (index, row) {

              var rowObject = me.collection.get(row.id);
              var nameCell = row.cells[iCol], treeClickDiv;
              var iconsCell = row.cells[iconsCol];
              if (nameCell) {
                treeClickDiv = $(nameCell).find("div.treeclick");
                if (treeClickDiv === undefined || treeClickDiv.length === 0) {
                  return;
                }

                // hide checkbox on group line

                var treeParent = treeClickDiv.closest('tr');

                  // hide input box
                treeParent.children(':first-child').html("");
                $(iconsCell).html(""); // hide icon inner html

                treeParent.addClass('removeRowHover');

                treeParent.unbind("click");
                treeParent.bind("click", function (e) {
                  var dataIDs = me.getDataIds($this),
                      dataID = dataIDs[index-1], //putting index to previous node as the table has header but data ID list does not have
                      rowObject = me.collection.get(dataID),
                      isExpanded = rowObject.get('expanded'),
                      isStatic = rowObject.get('isStatic');
                  if (isStatic) {
                    if (isExpanded) {
                      $(this).trigger('policygridnodecollapse', rowObject);
                    } else {
                      $(this).trigger('policygridnodeexpand', rowObject);
                    }
                  }
                });
              }
            });
          });
        },

        getDataIds: function(el) {
            return el.getDataIDs();
        },

        toggleSelections: function (policy) {
          if(policy.get('expanded')) {
            policy.set('expanded',false);
          } else {
            policy.set('expanded',true);
          }
        },

        reloadGridData : function(groupPolicy) {
          var me=this,policies=[];
          me.toggleSelections(groupPolicy);
          var allPolicies = _.pluck(me.collection.toJSON(), 'policy');
          var isExpanded = false,
            groupPolicyPosition = "PRE";
          $.each(allPolicies,function(i,policy){
            var isStatic = policy["isStatic"]?policy["isStatic"]:false,
            policyPosition= policy["policy-position"];
            if(isStatic){
              policies.push(policy);
              isExpanded = policy["expanded"];
              groupPolicyPosition = policy["policy-position"];
            } else {
              if(isExpanded && groupPolicyPosition == policyPosition){
                policies.push(policy);
              }
            }
          });
          me.emptyGridRows();
          var gridWidgetObject = me.gridWidgetObject,
                totalCount = policies.length,
                page = 1,
                totalPages = 1;

            gridWidgetObject.addPageRows(policies, {
              numberOfPage: page,
              totalPages: totalPages,
              totalRecords: totalCount});
            me.collection.resetCollection = false;
            me.addTreeViewRendering();
            
            $(me.$el).trigger('policygridreloadcomplete');
        },

        /**
         * Returns the SID for the policy
         * @returns {string} sid
         */
        getSID: function() {
            return;
        }
    });

    return BasePolicyGridView;
});
