'use strict';

var path = require('path');
var extend = require('util')._extend;

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

function recursiveKarmaLauncher(opts) {

  var options = extend({}, OPTIONS_DEFAULTS)
  extend(options, opts);

  if (!options.karma){
    throw 'You must give me your "Karma" server !';
  }

  var browsers = Object.keys(options.customLaunchers);

  (function launchRecursiveKarma() {

    if (!browsers.length) return;

    var targetBrowsers = browsers.splice(0, options.maxConcurrentRun);

    console.log('\n\n////\n' + browsers.length + ' browsers left --- ' +
      Math.ceil(browsers.length / options.maxConcurrentRun) + ' steps left');
    console.log('Next run with : ' + targetBrowsers.join(', ') + '\n////\n\n');

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
      setTimeout.bind(null, launchRecursiveKarma)
    );
  }());

}
