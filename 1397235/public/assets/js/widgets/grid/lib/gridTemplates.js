/**
 * A library that groups templates used by the Grid widget
 *
 * @module GridTemplates
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'text!widgets/grid/templates/gridContainer.html',
    'text!widgets/grid/templates/titleContainer.html',
    'text!widgets/grid/templates/actionContainer.html',
    'text!widgets/grid/templates/partialActionContainerButton.html',
    'text!widgets/grid/templates/partialActionContainerIcon.html',
    'text!widgets/grid/templates/partialActionContainerMenu.html',
    'text!widgets/grid/templates/partialActionContainerDropdown.html',
    'text!widgets/grid/templates/customActionContainer.html',
    'text!widgets/grid/templates/filterContainer.html',
    'text!widgets/grid/templates/subGridContainer.html',
    'text!widgets/grid/templates/inlineSave.html',
    'text!widgets/grid/templates/inlineSaveOverlay.html',
    'text!widgets/grid/templates/moreCell.html',
    'text!widgets/grid/templates/partialMoreCell.html',
    'text!widgets/grid/templates/editCell.html',
    'text!widgets/grid/templates/partialInputCell.html',
    'text!widgets/grid/templates/inputCellEnd.html',
    'text!widgets/grid/templates/editDropdownCell.html',
    'text!widgets/grid/templates/helpTooltip.html',
    'text!widgets/grid/templates/moreTooltip.html',
    'text!widgets/grid/templates/gridHeader.html',
    'text!widgets/grid/templates/gridNestedHeader.html',
    'text!widgets/grid/templates/treeAllCheckbox.html',
    'text!widgets/grid/templates/treeCheckbox.html',
    'text!widgets/grid/templates/treeNoCheckbox.html',
    'text!widgets/grid/templates/columnAction.html',
    'text!widgets/grid/templates/gridDraggableElement.html',
    'text!widgets/grid/templates/gridDraggableDefaultElement.html',
    'text!widgets/grid/templates/gridSortableElement.html',
    'text!widgets/grid/templates/gridNotDroppableMask.html',
    'text!widgets/grid/templates/loadingBackground.html',
    'text!widgets/grid/templates/noResultTemplate.html',
    'text!widgets/grid/templates/footerContainer.html',
    'text!widgets/grid/templates/pagination.html',
    'text!widgets/grid/templates/multiselectCellFooterContainer.html',
    'text!widgets/grid/templates/multiselectCellFooterTooltip.html',
    'text!widgets/grid/templates/rowHoverMenu.html',
    'text!widgets/grid/templates/noRowsDefaultTemplate.html',
    'text!widgets/grid/templates/selectionContainer.html',
    'text!widgets/grid/templates/editMoreCell.html',
    'text!widgets/grid/templates/groupCell.html',
    'text!widgets/grid/templates/partialGroupCell.html',
    'text!widgets/grid/templates/dateCell.html',
    'text!widgets/grid/templates/emptyCell.html',
    'text!widgets/grid/templates/customColumnLabel.html',
    'text!widgets/grid/templates/groupColumnTitle.html',
    'text!widgets/grid/templates/groupColumnTitleTooltip.html',
    'text!widgets/grid/templates/columnFilterDropdownWrapper.html'
], /** @lends GridTemplates */
    function(gridContainer,
             titleContainer,
             actionContainer,
             partialActionContainerButton,
             partialActionContainerIcon,
             partialActionContainerMenu,
             partialActionContainerDropdown,
             customActionContainer,
             filterContainer,
             subGridContainer,
             inlineSave,
             inlineSaveOverlay,
             moreCell,
             partialMoreCell,
             editCell,
             partialInputCell,
             inputCellEnd,
             editDropdownCell,
             helpTooltip,
             moreTooltip,
             gridHeader,
             gridNestedHeader,
             treeAllCheckbox,
             treeCheckbox,
             treeNoCheckbox,
             columnAction,
             gridDraggableElement,
             gridDraggableDefaultElement,
             gridSortableElement,
             gridNotDroppableMask,
             loadingBackgroundTemplate,
             noResultTemplate,
             footerContainer,
             pagination,
             multiselectCellFooterContainer,
             multiselectCellFooterTooltip,
             rowHoverMenu,
             defaultMessageTemplate,
             selectionContainer,
             editMoreCell,
             groupCell,
             partialGroupCell,
             dateCell,
             emptyCell,
             customColumnLabel,
             groupColumnTitle,
        groupColumnTitleTooltip,
        columnFilterDropdownWrapper
    ){

    /*
     * GridTemplates constructor
     *
     * @constructor
     * @class GridTemplates
     */
    var GridTemplates = function () {

        /**
         * Provides partial templates used by the grid widget to create elements of the grid.
         */
          this.getTemplates = function () {
              return {
                  "gridContainer":gridContainer,
                  "titleContainer":titleContainer,
                  "actionContainer":actionContainer,
                  "partialActionContainerButton":partialActionContainerButton,
                  "partialActionContainerIcon":partialActionContainerIcon,
                  "partialActionContainerMenu":partialActionContainerMenu,
                  "partialActionContainerDropdown":partialActionContainerDropdown,
                  "customActionContainer":customActionContainer,
                  "filterContainer":filterContainer,
                  "subGridContainer":subGridContainer,
                  "inlineSave":inlineSave,
                  "inlineSaveOverlay":inlineSaveOverlay,
                  "moreCell": moreCell,
                  "partialMoreCell": partialMoreCell,
                  "editCell": editCell,
                  "partialInputCell": partialInputCell,
                  "inputCellEnd": inputCellEnd,
                  "editDropdownCell": editDropdownCell,
                  "helpTooltip": helpTooltip,
                  "moreTooltip": moreTooltip,
                  "gridHeader": gridHeader,
                  "gridNestedHeader": gridNestedHeader,
                  "treeAllCheckbox": treeAllCheckbox,
                  "treeCheckbox": treeCheckbox,
                  "treeNoCheckbox": treeNoCheckbox,
                  "gridDraggableElement": gridDraggableElement,
                  "gridDraggableDefaultElement": gridDraggableDefaultElement,
                  "gridSortableElement": gridSortableElement,
                  "gridNotDroppableMask": gridNotDroppableMask,
                  "columnAction": columnAction,
                  "loadingBackgroundTemplate": loadingBackgroundTemplate,
                  "noResultContainer": noResultTemplate,
                  "footerContainer": footerContainer,
                  "pagination": pagination,
                  "multiselectCellFooterContainer": multiselectCellFooterContainer,
                  "multiselectCellFooterTooltip": multiselectCellFooterTooltip,
                  "rowHoverMenu": rowHoverMenu,
                  "defaultMessageGridContainer": defaultMessageTemplate,
                  "selectionContainer": selectionContainer,
                  "editMoreCell": editMoreCell,
                  "groupCell": groupCell,
                  "partialGroupCell": partialGroupCell,
                  "dateCell": dateCell,
                  "emptyCell": emptyCell,
                  "customColumnLabel": customColumnLabel,
                  "groupColumnTitle": groupColumnTitle,
                  "groupColumnTitleTooltip": groupColumnTitleTooltip,
                  "columnFilterDropdownWrapper": columnFilterDropdownWrapper
              };
          };

  };

    return GridTemplates;
});
