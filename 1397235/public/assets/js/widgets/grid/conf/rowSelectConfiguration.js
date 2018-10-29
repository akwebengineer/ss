/**
 * A module that provides grid selection functionality.
 *
 * @module RowSelectConfiguration
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([], /** @lends RowSelectConfiguration */
function () {

    var RowSelectConfiguration = function () {

        var sdGridRowIds = null,
            sdServicesDisabledRowIds = [],
//            sdServicesDisabledRowIds = [163840, 163850, 557400], //enable it for testing row interaction disabled
            self = this;

        /**
         * Loads data for the url and invokes callbacks if success or error
         * @param {Object} setIdsSuccess - success callback
         * @param {Object} setIdsError -  error callback
         * @inner
        */
        var loadAllIds = function (url, setIdsSuccess, setIdsError) {
            $.ajax({
                type: 'GET',
                url: url,
                headers: {
                    "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                    "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
                },
                success: function (data) {
                    setIdsSuccess(data);
                },
                error: function () {
                    setIdsError("Getting all row ids in the grid FAILED.");
                }
            });
        };

        /**
         * Gets all row ids for grids with two pages
         * @param {Object} setIdsSuccess - success callback
         * @param {Object} setIdsError -  error callback
         * @param {Object} tokens - search token
         * @param {Object} parameters
         */
        this.getAllRowIdsTwoPages = function (setIdsSuccess, setIdsError, tokens, parameters) {
            console.log(parameters);
            var pspRows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'];
            if (!_.isEmpty(tokens)) {
                if (~tokens.indexOf("PSP")) {
                    setIdsSuccess(pspRows);
                } else {
                    loadAllIds("/assets/js/widgets/grid/tests/dataSample/allFilteredPoliciesIds.json", setIdsSuccess, setIdsError);
                }
            } else {
                loadAllIds("/assets/js/widgets/grid/tests/dataSample/allPoliciesIds.json", setIdsSuccess, setIdsError);
            }
        };

        /**
         * Gets all row ids for grids with one page
         * @param {Object} setIdsSuccess - success callback
         * @param {Object} setIdsError -  error callback
         * @param {Object} tokens - search token
         * @param {Object} parameters
         */
        this.getAllRowIdsOnePage = function (setIdsSuccess, setIdsError, tokens, parameters) {
            console.log(parameters);
            var pspRows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'];
            if (!_.isEmpty(tokens) && ~tokens.indexOf("PSP")) {
                    setIdsSuccess(pspRows);
            } else {
                loadAllIds("/assets/js/widgets/grid/tests/dataSample/allPoliciesIdsOnePage.json", setIdsSuccess, setIdsError);
            }
        };

        this.getSDServicesDisabledRowsIds = function () {
            return sdServicesDisabledRowIds;
        };

        /**
         * Gets all row ids for a SD API
         * @param {Object} setIdsSuccess - success callback
         * @param {Object} setIdsError -  error callback
         * @param {Object} tokens - search token
         * @param {Object} parameters
         */
        this.getRowIds = function (setIdsSuccess, setIdsError, tokens, parameters) {
//        console.log(tokens);
            console.log(parameters);
            var pspRows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'];
            if (tokens && ~tokens.indexOf("PSP")) {
                setIdsSuccess(pspRows);
            } else {
                if (!sdGridRowIds) {
                    $.ajax({
                        type: 'GET',
                        url: '/api/juniper/sd/service-management/services',
                        headers: {
                            "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                            "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
                        },
                        success: function (data) {
                            sdGridRowIds = (data.services.service).map(function (value, index) {
                                return value.id;
                            });
                            sdGridRowIds = _.difference(sdGridRowIds, self.getSDServicesDisabledRowsIds());
                            setIds();
                        },
                        error: function () {
                            setIdsError("Getting all row ids in the grid FAILED.");
                        }
                    });
                } else {
                    setIds();
                }
            }

            function setIds() {
                setIdsSuccess(sdGridRowIds);
            }
        };

        /**
         * gets a set of rowIds in provided range between startRange and endRange
         * @param {Object} setIdsInRangeSuccess - success callback
         * @param {Object} setIdsInRangeError -  error callback
         * @param {Object} tokens - search token
         * @param {Object} parameters
         * @param {Integer} start - start index on the selection
         * @param {Integer} limit - number of rows after start index of selection. End index can be calculated by start + limit.
         */
        this.getRowIdsInRange = function (setIdsInRangeSuccess, setIdsInRangeError, tokens, parameters, start, limit) {
            console.log(parameters);

            if (!sdGridRowIds) {
                $.ajax({
                    type: 'GET',
                    url: '/api/juniper/sd/service-management/services',
                    headers: {
                        "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                        "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
                    },
                    success: function (data) {
                        sdGridRowIds = (data.services.service).map(function (value, index) {
                            return value.id;
                        });
                        sdGridRowIds = _.difference(sdGridRowIds, self.getSDServicesDisabledRowsIds());
                        setIdsInRange();
                    },
                    error: function () {
                        setIdsInRangeError("Getting the range of row ids in the grid FAILED.");
                    }
                });
            } else {
                setIdsInRange();
            }

            function setIdsInRange() {
                var rowIdsInRange = $(sdGridRowIds).slice(start-1, start+limit);
                setIdsInRangeSuccess(rowIdsInRange); //returning set of ids within startRange and EndRange
            }
        };

        /**
         * gets all row ids
         * @param {Object} setIdsSuccess - success callback
         * @param {Object} setIdsError -  error callback
         */
        this.getTreeRowIds = function (setIdsSuccess, setIdsError) {
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/tree/allTreeIds.json',
                success: function (data) {
                    setIdsSuccess(data);
                },
                error: function () {
                    setIdsError("Getting all row ids in the grid FAILED.");
                }
            });
        };

        /**
         * gets a set of rowIds in provided range between startRange and endRange
         * @param {Object} setIdsInRangeSuccess - success callback
         * @param {Object} setIdsInRangeError -  error callback
         * @param {Object} tokens - search token
         * @param {Object} parameters
         * @param {string} startRange - rowId start range
         * @param {string} EndRange - rowId end range
         */
        this.getTreeRowIdsInRange = function (setIdsInRangeSuccess, setIdsInRangeError, tokens, parameters, startRange, EndRange) {
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/tree/allTreeIds.json',
                success: function (data) {
                    setIdsInRangeSuccess(data); //data - row ids within startRange and EndRange
                },
                error: function () {
                    setIdsInRangeError("Getting all row ids in range from the grid FAILED.");
                }
            });
        };

        /**
         * gets all row ids for tree grids with preselection
         * @param {Object} setIdsSuccess - success callback
         * @param {Object} setIdsError -  error callback
         */
        this.getPreselectionTreeRowIds = function (setIdsSuccess, setIdsError) {
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/tree/allPreselectionTreeIds.json',
                success: function (data) {
                    setIdsSuccess(data);
                },
                error: function () {
                    setIdsError("Getting all row ids in the grid FAILED.");
                }
            });
        };

    };

    return RowSelectConfiguration;
});