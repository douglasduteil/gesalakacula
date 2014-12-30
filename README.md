# gesalakacula [![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url]

> Generate SauceLabs Karma Custom Launchers --- aka --- Ge-Sa-La-Ka-Cu-La-aaaaa

It's intention is to be used with [karma](http://karma-runner.github.io/) and [karma-sauce-launcher](https://github.com/karma-runner/karma-sauce-launcher), which runs unit tests on the [Sauce Labs](https://saucelabs.com/) browsers.

## Installation

`gesalakacula` can be installed using

```sh
$ npm i -D gesalakacula
```

## Usage

```js
// In your karma.conf.js
var geSaLaKaCuLa = require('gesalakacula');

module.exports = function(config) {
  var customLaunchers = geSaLaKaCuLa({
    'Windows 7': {
      'internet explorer': '8..11'
    }
  })

  // [...]

  config.browsers = Object.keys(customLaunchers);
  config.customLaunchers = customLaunchers;
});
```

## Config Object

`gesalakacula` generate launchers from a config object.
This one has 3 main areas: 

```js
{
  // The platforms      (1)
  'Linux': { 
    // The browsers     (2)
    'chrome': [
      // The versions   (3)
    ]
  }
}
```

[You're suppose to use the Sauce Labs platform`(1)`/browser`(2)`/versions`(3)` combos.](https://saucelabs.com/platforms) 

For the versions`(3)` you can use an array or a range string like : `\d+..\d+`.

### Sample 

#### « All The Sauce Labs Browsers Are Mine To Test ! GeSaLaKaCuLa-aaaaa ! »

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/730511/5579685/fdd5958c-903e-11e4-8110-6fc9de08776d.gif" alt=""/>
</p>

```js
geSaLaKaCuLa({
  // Wait for it...
});
// Run on every platforms-browsers-versions on Sauce Labs (known 2015/1/1)
```

## License

    Copyright © 2014 Douglas Duteil <douglasduteil@gmail.com>
    This work is free. You can redistribute it and/or modify it under the
    terms of the Do What The Fuck You Want To Public License, Version 2,
    as published by Sam Hocevar. See the LICENCE file for more details.

[npm-url]: https://npmjs.org/package/gesalakacula
[npm-image]: http://img.shields.io/npm/v/gesalakacula.svg
[travis-url]: http://travis-ci.org/douglasduteil/gesalakacula
[travis-image]: http://travis-ci.org/douglasduteil/gesalakacula.svg?branch=master
