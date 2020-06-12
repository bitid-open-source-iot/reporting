var log4js = require("log4js");
var logger;

var module = function() {
    var pubLogger = {
        init: function (settings) {
            log4js.configure(settings);
            logger = log4js.getLogger( "file-appender" );
        },
        LogData: function(strError,strDebug) {
            try {
                if (strError != '') {
                    console.log(strError);
                    logger.error(strError);// store log in file
                } else {
                    if (__settings.showConsoleLogs == 1) {
                        console.log(strDebug);
                    };
                    logger.debug(strDebug);// store log in file
                };
                return;
            } catch(e) {
                console.log('Error in writeLog');
            };
        }
    }

    return pubLogger
};

exports.module = module;