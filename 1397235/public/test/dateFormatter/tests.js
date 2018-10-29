define(['moment-tz'], function(moment) {
	describe('Date Formatter tests', function() {
      describe('Some format tests', function() {
          describe('format 1', function() {
              var fmt = "dddd, MMMM Do YYYY";

              describe('from Date object', function() {
                  var date = new Date(2015, 6, 16);
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal JS date object', function() {
                      assert.equal(formatted_date, "Thursday, July 16th 2015");
                  });   
              });

              describe('from string', function() {
                  var date = new Date(2015, 6, 16).toISOString();
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal ISO string date', function() {
                      assert.equal(formatted_date, "Thursday, July 16th 2015");
                  });   
              });
          });

          describe('format 2', function() {
              var fmt = "Mo Do YYYY";

              describe('from Date object', function() {
                  var date = new Date(2014, 9, 21);
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal JS date object', function() {
                      assert.equal(formatted_date, "10th 21st 2014");
                  });   
              });

              describe('from string', function() {
                  var date = new Date(2014, 9, 21).toISOString();
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal ISO string date', function() {
                      assert.equal(formatted_date, "10th 21st 2014");
                  });   
              });
          });

          describe('format 1, i18n French', function() {
              var fmt = "dddd, MMMM Do YYYY";

              // validate that language bundles are loaded
              moment.locale('fr');

              describe('from Date object', function() {
                  var date = new Date(2015, 6, 16);
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, fmt);

                  it('formatted date should equal JS date object', function() {
                      assert.equal(formatted_date, "jeudi, juillet 16 2015");
                  });  

                  moment.locale('en');
              });
          });

          describe('Predefined formats', function() {
              var date = new Date();
              var amoment = moment(date);
              var timezone = moment.tz.guess();

              describe('Short format without seconds', function() {
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, {format: "short"});
                  var expected_date = amoment.tz(timezone).format("ll, LT");

                  it('formatted date should conform to short format without seconds', function() {
                      assert.equal(formatted_date, expected_date);
                  });   
              });

              describe('Short format with seconds', function() {
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, {format: "short", options: {seconds:true}});
                  var expected_date = amoment.tz(timezone).format("ll, LTS");

                  it('formatted date should conform to short format with seconds', function() {
                      assert.equal(formatted_date, expected_date);
                  });   
              });

              describe('Long format without seconds', function() {
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, {format: "long"});
                  var expected_date =  amoment.tz(timezone).format("ll, LT, UTC Z z");
                  
                  it('formatted date should conform to long format without seconds', function() {
                      assert.equal(formatted_date, expected_date);
                  });   
              });

              describe('Long format with seconds', function() {
                  var formatted_date = Slipstream.SDK.DateFormatter.format(date, {format: "long", options: {seconds:true}});
                  var expected_date = amoment.tz(timezone).format("ll, LTS, UTC Z z");
                  
                  it('formatted date should conform to long format with seconds', function() {
                      assert.equal(formatted_date, expected_date);
                  });   
              });
          });
      });
   });
});