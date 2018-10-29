/**
 * A module that builds the spinner used in the grid widget.
 *
 * @module GridSpinner
 * @author Sanket Desai <sanketdesai@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'lib/template_renderer/template_renderer',
    'widgets/grid/lib/gridTemplates',
    'widgets/spinner/spinnerWidget',
    'lib/i18n/i18n'
],  /** @lends GridSpinner */
    function(render_template, GridTemplates, SpinnerWidget, i18n) {

    /**
     * GridSpinner constructor
     *
     * @constructor
     * @class GridSpinner - Builds the spinner used in the grid widget
     *
     * @returns {Object} Current Spinner's object: this
     */
        var GridSpinner = function(conf){

            var activityIndicatorTime = 500, //value consistent with other Slipstream components
                templates = new GridTemplates().getTemplates(),
                $spinnerContainer, 
                $spinnerMaskContainer,
                $indicatorBackground,
                $spinnerMaskIndicatorBackground,
                spinnerSelectedTimeout,
                spinner,
                hasSubgrid = conf.elements.subGrid ? true : false,
                isExpandOnLoad = hasSubgrid && conf.elements.subGrid.expandOnLoad ? true: false;

        /**
         * Adds Spinner to the Grid widget while loading
         * @param {boolean} if using the gridTable as container
         */
            this.showSpinner = function(gridContainer, isUsingGridTable){
                if (isUsingGridTable){
                    $spinnerContainer = gridContainer.find('.ui-jqgrid-view');
                }else{
                    $spinnerContainer = gridContainer.find('.loading');
                }
                
                !isExpandOnLoad && clearTimeout(spinnerSelectedTimeout);              
                spinnerSelectedTimeout = setTimeout(function () { 
                    if (!$indicatorBackground && isUsingGridTable){
                        $spinnerContainer.append(render_template(templates.loadingBackgroundTemplate));
                        $indicatorBackground = $spinnerContainer.find(".slipstream-indicator-background");
                        $indicatorBackground.show();
                    }else{
                        if ($indicatorBackground){
                            $indicatorBackground.show();
                        }else{
                            $spinnerContainer.show();
                        }
                    }  
                    spinner = new SpinnerWidget({
                        "container": $spinnerContainer
                    });  
                    spinner.build();
                }, activityIndicatorTime);
                isExpandOnLoad && gridContainer.data('Slipstream.spinnerSelectedTimeout', spinnerSelectedTimeout);
            };

        /**
         * Hides spinner from the Grid widget after the grid has finished loading
         * @param {boolean} if using the gridTable as container
         * @param {jQuery Object} $gridTable
         */
            this.hideSpinner = function(isUsingGridTable, $gridTable){
                if (isExpandOnLoad && $gridTable){
                    var spinnerTimeout = $gridTable.data('Slipstream.spinnerSelectedTimeout');
                    clearTimeout(spinnerTimeout);
                    $gridTable.removeData('Slipstream.spinnerSelectedTimeout');
                }else{
                    clearTimeout(spinnerSelectedTimeout);
                }
                
                if (spinner) {
                    spinner.destroy();
                    !isUsingGridTable && $spinnerContainer.hide();
                    if ($indicatorBackground && $indicatorBackground.length > 0)
                        $indicatorBackground.hide();
                }
            };

        };


    return GridSpinner;
});