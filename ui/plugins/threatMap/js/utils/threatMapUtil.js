/**
 *  Threatmap util mixin file
 *
 *  @module ThreatMap
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2016
 * */

define(['./threatMapConstants.js',], function(ThreatMapConstants) {

    var ThreatMapUtil = {

        getTheStatus: function(srcTotalCount, dstTotalCount, isTooTip){
            var me = this, countryCode = this.model.countryDetails.get('countryCode');

            if(srcTotalCount !== 0 || dstTotalCount !== 0) {
                me.setTheFlag(srcTotalCount, dstTotalCount, isTooTip);
            } else {
                me.disableButtons('#block-outbound');
                me.disableButtons('#block-inbound');
                me.disableButtons('#block-traffic');
                $('#block-traffic').css('cursor', 'default');
                if (srcTotalCount === 0) {
                    me.outboundFlag = ThreatMapConstants.FlagTypes.NODATA;
                }
                if (dstTotalCount === 0) {
                    me.inboundFlag = ThreatMapConstants.FlagTypes.NODATA;
                }
            }
            if(countryCode == ThreatMapConstants.Country.UNKNOWN) {
                me.disableButtons('#block-outbound');
                me.disableButtons('#block-inbound');
                me.disableButtons('#block-traffic');
                $('#block-traffic').css('cursor', 'default');
                $('#ev-link').removeClass('total-events-count').addClass('total-events-inactive');
                $('#right-panel-view div .individual-threat-count').removeClass('individual-threat-count').addClass('individual-threat-count-disabled');
            }
        },
        setTheFlag: function(srcTotalCount, dstTotalCount, isTooTip) {
            var me = this;
            if(isTooTip) {
                if (srcTotalCount > 0) {
                    me.outboundFlag = ThreatMapConstants.FlagTypes.OUTBOUND;
                }
                if (dstTotalCount > 0) {
                    me.inboundFlag = ThreatMapConstants.FlagTypes.INBOUND;
                }
            }
            if (srcTotalCount === 0) {
                me.disableButtons('#block-outbound');
            }
            if (dstTotalCount === 0) {
                me.disableButtons('#block-inbound');
            }
        },

        disableButtons: function(buttonID) {
            $(buttonID).prop('disabled', true);
            $(buttonID).addClass('disabled');
        }
    }

	return ThreatMapUtil;
});