define([
    '../../conf/importconfigOCRFormConfiguration.js',
], function (OCRConf) {

    describe('Import Config OCR UT', function() {

        var conf;
        it('Checks if the config object is created properly', function() {
            conf = new OCRConf(new Slipstream.SDK.ActivityContext());
            conf.should.exist;
        });

        it('Checks if the configurations are returned properly', function() {
            var values = conf.getValues();
            $.isEmptyObject(values).should.be.equal(false);
            values['form_id'].should.be.equal('ocr-form');
        })
    });

});