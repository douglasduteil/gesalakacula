'use strict';

var path = require('path');
var util = require('util');
var extend = util._extend;

var OPTIONS_DEFAULTS = {
  configFile: './karma.conf.js',
  customLaunchers: {},
  maxConcurrentRun : 3
};

// The "reKaLa" magic spell !! reKaLaaaaaaaaaaaaaaaaaaaa :D
module.exports = recursiveKarmaLauncher;

////

// Limitation : Free Travis account
// Travis can't run a job longer than an hour.
//
// Limitation : Open source Saucelab account
// Saucelab run only 3 tests in parallel.
//
// The average duration of a test is ~1m30s
// In a hour Travis <-> Saucelab can run ~100 tests in browsers
//
// I decide to add an util function to launch those test 3 by 3.

function recursiveKarmaLauncher(opts, doneCallback) {

  var forceExit = false;
  var endingCode = 0;
  var options = extend({}, OPTIONS_DEFAULTS);
  extend(options, opts);

  if (!options.karma){
    throw 'You must give me your "Karma" server !';
  }

  var browsers = Object.keys(options.customLaunchers);
  var usedBrowserCount = 0;
  var browserCount = browsers.length;

  (function launchRecursiveKarma() {


    console.log(util.format(['',
      '////',
      'Progress: %d/%d'
      ].join('\n'),
      usedBrowserCount, browserCount)
    );

    if (!browsers.length) return doneCallback(endingCode);

    var targetBrowsers = browsers.splice(0, options.maxConcurrentRun);
    usedBrowserCount += targetBrowsers.length;

    console.log(util.format([
      'Next run with : %s',
      '////',
      ''].join('\n'),
      targetBrowsers.join(', '))
    );

    var karmaConfig = extend({
      configFile: path.resolve(process.cwd(), options.configFile),
      singleRun: true,
      browsers: targetBrowsers,
      customLaunchers: targetBrowsers.reduce(function (memo, browserName) {
        memo[browserName] = options.customLaunchers[browserName];
        return memo;
      }, {})
    });

    options.karma.start(
      karmaConfig,
      function(code){
        endingCode += +code;
        forceExit ? doneCallback(1) : setTimeout(launchRecursiveKarma);
      }
    );
  }());

  process.on('SIGINT', function() { forceExit = true; });

}
