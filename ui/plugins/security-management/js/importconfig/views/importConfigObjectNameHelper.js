define(
	[
        './importConfigOCRToolTipView.js',        
        'widgets/overlay/overlayWidget'
	], 
	function(OCRToolTipView, OverlayWidget) {
		return function(gridTable) {
			this.getOCRToolTipView = function() {
				return OCRToolTipView;
			};

			this.getOverlayWidget = function() {
				return OverlayWidget;
			};

			this.getRowData = function(rowId) {
				return gridTable.internalGrid.jqGrid('getRowData', rowId);
			};			
		}
	}
);