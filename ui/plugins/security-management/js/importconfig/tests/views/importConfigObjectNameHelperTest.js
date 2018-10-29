define([
    '../../views/importConfigObjectNameHelper.js'
], function (Helper) {

    describe('Import Config Object Name Helper UT', function () {
        var helper;
        describe('Basic functionality', function () {
            var gridtable;
            before(function () {
                gridtable = {
                    internalGrid: {
                        jqGrid: function () {

                        }
                    }
                };
                helper = new Helper(gridtable);

            });

            it('checks if the utility functions are available', function () {
                helper.should.exist;
            });

            it('Returns the ocr tooltip view when invoked', function () {
                var view = helper.getOCRToolTipView();
                (new view({}) instanceof Backbone.View).should.be.equal(true);
            });

            it('Returns the overlay widget when invoked', function () {
                var widget = helper.getOverlayWidget();
                widget.should.exist;
            });


            it('Returns the grid data for any row id', function () {
                var widget, rowId = '123', stub;
                stub = sinon.stub(gridtable.internalGrid, 'jqGrid');
                helper.getRowData(rowId);

                stub.called.should.be.equal(true);
                stub.args[0][0].should.be.equal('getRowData');
                stub.args[0][1].should.be.equal(rowId);

                stub.restore();


            });

        });

    });

});
