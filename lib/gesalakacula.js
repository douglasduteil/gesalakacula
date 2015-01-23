'use strict';

var SAUCELABS_BASE = 'SauceLabs';
var SAUCELABS_PREFIX = 'SL';
var RANGE_REGEX = /(\d+)..(\d+)/;

var processBrowsers = queueLauncherKey('browserName', processLauncherRange);
var processPlatform = queueLauncherKey('platform', processBrowsers);

// The "geSaLaKaCuLa" magic spell !! geSaLaKaCuLaaaaaaaa :D
module.exports = generateSauceLabsKarmaCustomLaunchers;
// The "reKaLa" magic spell !! reKaLaaaaaaaaaaaaaaaaaaaa :D
module.exports.recursiveKarmaLauncher = require('./reKaLa');

////

/**
 * Generate the launcher range.
 * @param {String|Array} range the explicit range to cover (or abstract string)
 *   can be formed like [0,1,2,3] or '0...3'
 * @returns {Array} Array of launcher
 */
function processLauncherRange(range) {
  if (typeof range === 'string') {
    range = range
      .split(',')
      .map(function(rangePart){

        rangePart = rangePart.trim();
        if (!rangePart){
          return [];
        }
        if (!RANGE_REGEX.test(rangePart)){
          return [rangePart];
        }
        var limits = range.match(RANGE_REGEX);
        var min = +limits[1], max = +limits[2];
        var delta = max - min;
        return Array
          .apply(null, { length: delta + 1 })
          .map(function (v, i) { return min + i; });
      })
      .reduce(function (a, b) {
        // flatten
        return a.concat(b);
      }, []);
  }

  if (!Array.isArray(range)){
    range = [];
  }

  return range.map(function (version) {
    return {
      // default
      base: SAUCELABS_BASE,
      version: '' + version
    };
  });
}

/**
 * Generic in queue key assignment.
 * @description
 *   This will assign the  in the result fo a sub process.
 * @param {String} asKey the name to use in the launcher environment
 *   for the current key in the target.
 * @param {Function} subprocess process to use as launcher environment
 * @returns {Function} A target processor.
 */
function queueLauncherKey(asKey, subprocess) {
  return function processTarget(targets) {
    return Object
      .keys(targets)
      .map(function (targetName) {
        return subprocess(targets[targetName])
          .map(function (launcher) {
            launcher[asKey] = targetName;
            return launcher;
          });
      })
      .reduce(function (a, b) {
        // flatten
        return a.concat(b);
      }, []);
  };
}

/**
 * Generate SauceLabs Karma "customLaunchers".
 * @param {Object} config The abstract full config to process
 * @returns {Object} The karma ready "customLaunchers" object.
 */
function generateSauceLabsKarmaCustomLaunchers(config) {
  return processPlatform(config)
    .reduce(function (memo, launcher) {
      var launcherName = [
        SAUCELABS_PREFIX,
        shorty(launcher.platform),
        shorty(launcher.browserName),
        launcher.version
      ].join('_');
      memo[launcherName] = launcher;
      return memo;
    }, {});

  ////

  function shorty(str) {
    return str.indexOf(' ') === -1 ?
      // capitaliseFirstLetter
    str.charAt(0).toUpperCase() + str.slice(1) :
      // abbr
      str.match(/\b(\w)/g).join('').toUpperCase();
  }
}

