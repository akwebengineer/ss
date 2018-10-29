/**
 * View to display grid overlay after clicking cell link
 * 
 * @module DeployStatusView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'widgets/overlay/overlayWidget',
    '../../../../ui-common/js/views/gridView.js',
    '../conf/deployStatusLogGridConfiguration.js',
], function (OverlayWidget, GridView, DeployStatusLogGridConfiguration) {

    var DeployStatusView = GridView.extend({

        events: {
            "click .cellLink": "openLink"
        },

        openLink: function(e) {
            var linkValue = $(e.target).attr('data-cell');
            var detailconf = new DeployStatusLogGridConfiguration(this.activity.getContext(), linkValue).getValues();

            var detailview = new GridView({
              conf: detailconf
            });

            this.overlay = new OverlayWidget({
                view: detailview,
                okButton: true,
                showScrollbar: true,
                showBottombar: true,
                type: 'wide'
            });
            this.overlay.build();
        }
    });

    return DeployStatusView;
});
