/**
 * A view to do assign to domain
 *
 * @module AssignToDomainView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/tree/treeWidget',
    'widgets/overlay/overlayWidget',
    '../common/widgets/progressBarForm.js',
    './assignToDomainResultView.js',
    '../conf/assignToDomainFormConf.js',
    '../conf/assignToDomainResultFormConf.js'
], function(Backbone, FormWidget, TreeWidget, OverlayWidget, progressBarForm, ResultView, FormConf, ResultFormConf) {
    var ASSIGN_TO_DOMAIN_ACCEPT = 'application/vnd.sd.assign-to-domain-response+json;version=1;q=0.01',
        ASSIGN_TO_DOMAIN_CONTENT_TYPE = 'application/vnd.sd.assign-to-domain-request+json;version=1;charset=UTF-8',
        GET_DOMAIN_BASE_URL = '/api/space/domain-management/domains',
        GET_DOMAIN_ACCEPT = 'application/vnd.net.juniper.space.domain-management.domain+json;version=1;q=0.01';

    var removeArrDuplicateItems = function(arr) {
        var res = [], hash = {};
        for(var i=0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                res.push(elem);
                hash[elem] = true;
            }
        }
        return res;
    }

    var AssignToDomainView = Backbone.View.extend({

        events: {
            'click #assign-to-domain-assign': "submit",
            'click #assign-to-domain-cancel': "cancel"
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
            this.activity.finish();
            this.activity.overlay.destroy();
        },

        submit: function(event) {
            event.preventDefault();
            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            var selectNode = this.domainTree.getSelectedNodes();
            if(selectNode.length > 0){
                this.assignToDomain(selectNode[0]);
                this.activity.overlay.destroy();
                this.showProgressBar();
            }else{
                this.form.showFormError(this.context.getMessage("assign_to_domain_select_error"));
            }
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = this.activity.context;
            this.selectedRows = options.data.selectedRows.selectedRows;
            this.featureRelatedConf = options.data.featureRelatedConf;
            this.domainMap = {};
        },

        render: function() {
            var self = this;
            var objectTypeText = this.featureRelatedConf.objectTypeText ? this.featureRelatedConf.objectTypeText : '';
            var formConfiguration = new FormConf({'context': this.context, 'objectTypeText': objectTypeText});
            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });

            this.form.build();
            this.$el.addClass("security-management");
            this.showDomainTree();
            return this;
        },

        showDomainTree: function(container) {
            var self = this;
            var container = this.$el.find('#assign-to-domain-tree').parent().parent().empty();
            this.domainTree = new TreeWidget({
                container: container,
                showCheckboxes: true,
                search: true,
                url: function(node) {
                    if (node.id == '#') {
                        return GET_DOMAIN_BASE_URL;
                    }

                    return node.data['@href'];
                },
                dataFilter: function(data) {
                    data = JSON.parse(data);

                    var hasChildren;
                    var nodes = {
                        data: data.domain,
                        id: data.domain.id,
                        text: data.domain.name
                    };
                    self.addDatatoDomainMap(nodes.id, nodes.text);

                    if (data.domain.children && data.domain.children.domain) {
                        nodes.children = [];
                        if(Array.isArray(data.domain.children.domain)){
                            for (var i = 0, j = data.domain.children.domain.length; i < j; i++) {
                                hasChildren = (data.domain.children.domain[i]['child-count'] > 0) ? true : false;
                                nodes.children[i] = {
                                    data: _.clone(data.domain.children.domain[i]),
                                    id: data.domain.children.domain[i].id,
                                    text: data.domain.children.domain[i].name,
                                    children: hasChildren
                                }
                                self.addDatatoDomainMap(nodes.children[i].id, nodes.children[i].text);
                            }
                        }else{
                            hasChildren = (data.domain.children.domain['child-count'] > 0) ? true : false;
                            nodes.children[0] = {
                                data: _.clone(data.domain.children.domain),
                                id: data.domain.children.domain.id,
                                text: data.domain.children.domain.name,
                                children: hasChildren
                            }
                            self.addDatatoDomainMap(nodes.children[0].id, nodes.children[0].text);
                        }
                    }

                    return JSON.stringify(nodes);
                },
                ajaxOptions: {
                    headers: {
                        'Accept': GET_DOMAIN_ACCEPT
                    }
                },
                onLoad: function() {
                    var idArr = Object.keys(self.domainMap);
                    // Expand the first layer
                    self.domainTree.expandNode(idArr[0]);
                }
            }).build();
        },

        assignToDomain: function(selectNode) {
            var self = this,
                domainId = selectNode.id,
                targetIdArr = this.selectedRows.map(function(item){
                    return item.id;
                });
            var assign_to_domain_url = this.featureRelatedConf.assign_to_domain_url;
            if(!assign_to_domain_url) {
                console.log('assign_to_domain_url is not configured.');
                return;
            }
            var requestBody = {
                    "assign-to-domain": {
                        "target-ids": {
                            "target-id": targetIdArr
                        },
                        "assign-with-warning": this.$el.find('#assign-to-domain-ignore-warnings-enable').is(':checked')? 'true' : 'false'
                    }
                };

            $.ajax({
                type: 'POST',
                url: assign_to_domain_url + "/" + domainId,
                headers: {
                    "Accept": ASSIGN_TO_DOMAIN_ACCEPT,
                    "Content-Type": ASSIGN_TO_DOMAIN_CONTENT_TYPE
                },
                data: JSON.stringify(requestBody),
                dataType: "json",
                success: function(data, textStatus) {
                    self.progressBarOverlay.destroy();
                    self.showResultView(data['assign-to-domain-response'], selectNode);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    self.progressBarOverlay.destroy();
                    self.activity.finish();
                    self.notify('error', self.context.getMessage('assign_to_domain_error', ['Antispam Profile']));
                    console.log("Failed to assign to domain.");
                }
            });
        },

        showProgressBar: function() {
            var objectTypeText = this.featureRelatedConf.objectTypeText ? this.featureRelatedConf.objectTypeText : '';
            this.progressBar = new progressBarForm({
                statusText: this.context.getMessage("assign_to_domain_progress_bar_text", [objectTypeText]),
                title: this.context.getMessage("assign_to_domain_progress_bar_title")
            });

            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                showScrollbar: false
            });
            this.progressBarOverlay.build();
        },

        showResultView: function(response, selectNode) {
            var trackStr = this.getNodeTrack(selectNode);
            this.resultView = new ResultView({
                parentView: this,
                data: {
                    response: response,
                    domainTrack: trackStr,
                    objectTypeText: this.featureRelatedConf.objectTypeText ? this.featureRelatedConf.objectTypeText : ''
                }
            });

            this.resultViewOverlay = new OverlayWidget({
                view: this.resultView,
                type: 'medium',
                showScrollbar: false
            });
            this.resultViewOverlay.build();
        },

        addDatatoDomainMap: function(id, text) {
            if(! this.domainMap[id]){
                this.domainMap[id] = text;
            }
        },

        getNodeTrack: function(selectNode) {
            var trackStr = selectNode.text,
                parentsArr = selectNode.parents;
            var newParentArr = removeArrDuplicateItems(parentsArr);
            for(var i = 0; i < newParentArr.length; i++){
                var id = newParentArr[i];
                if(id !== '#'){
                    trackStr = this.domainMap[id] + '/' + trackStr;
                }
            }
            return trackStr;
        },


        /**
         *  Helper method to display a toast/non-persistent notification
         */
        notify: function(type, message) {
            new Slipstream.SDK.Notification()
                .setText(message)
                .setType(type)
                .notify();
        }
    });

    return AssignToDomainView;
});