define([
    '../../conf/importConfigOCRToolTipConf.js',
], function (OCRToolTipConf) {

    describe('Import Config OCR Tooltip UT', function() {

        var conf;
        it('Checks if the config object is created properly', function() {
            conf = OCRToolTipConf;
            conf.should.exist;
        });

        it('Checks if the configurations are returned properly', function() {
            var values = conf.ocr;
            $.isEmptyObject(values).should.be.equal(false);
            values['form_id'].should.be.equal('create_policy');
        })
    });

});