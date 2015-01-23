//

var expect = require('chai').expect;

var geSaLaKaCuLa = require('../lib/gesalakacula');
var reKaLa = geSaLaKaCuLa.recursiveKarmaLauncher;

describe('GeSaLaKaCuLa', function () {

  it('should support string range notation', function () {
    expect(geSaLaKaCuLa({ 'A': { 'B': '0..1' } })).to.eql({
      'SL_A_B_0': {
        'base': 'SauceLabs',
        'browserName': 'B',
        'platform': 'A',
        'version': '0'
      },
      'SL_A_B_1': {
        'base': 'SauceLabs',
        'browserName': 'B',
        'platform': 'A',
        'version': '1'
      }
    });
  });

  it('should support string coma notation', function () {
    expect(geSaLaKaCuLa({ 'A': { 'B': '0 , 2..3, 9' } })).to.eql({
      'SL_A_B_0': {
        'base': 'SauceLabs',
        'browserName': 'B',
        'platform': 'A',
        'version': '0'
      },
      'SL_A_B_2': {
        'base': 'SauceLabs',
        'browserName': 'B',
        'platform': 'A',
        'version': '2'
      },
      'SL_A_B_3': {
        'base': 'SauceLabs',
        'browserName': 'B',
        'platform': 'A',
        'version': '3'
      },
      'SL_A_B_9': {
      'base': 'SauceLabs',
        'browserName': 'B',
        'platform': 'A',
        'version': '9'
    }
    });
  });


  it('should support array notation', function () {
    expect(geSaLaKaCuLa({ 'A': { 'B': [0, 2] } })).to.eql({
      'SL_A_B_0': {
        'base': 'SauceLabs',
        'browserName': 'B',
        'platform': 'A',
        'version': '0'
      },
      'SL_A_B_2': {
        'base': 'SauceLabs',
        'browserName': 'B',
        'platform': 'A',
        'version': '2'
      }
    });
  });

  it('should shortcut the launcher name', function () {
    expect(
      geSaLaKaCuLa({ 'Long Platform Name': { 'Long Browser Name': [0] } })
    ).to.eql({
        'SL_LPN_LBN_0': {
          'base': 'SauceLabs',
          'browserName': 'Long Browser Name',
          'platform': 'Long Platform Name',
          'version': '0'
        }
      });
  });

  describe('incomplete config', function () {
    it('should generate nothing', function () {
      expect(geSaLaKaCuLa({})).to.eql({});
      expect(geSaLaKaCuLa({ A: {} })).to.eql({});
      expect(geSaLaKaCuLa({ A: { B: {} } })).to.eql({});
      expect(geSaLaKaCuLa({ A: { B: [] } })).to.eql({});
      expect(geSaLaKaCuLa({ A: { B: '' } })).to.eql({});
    });
  });

});

describe('ReKaLa', function () {

  describe('with incomplete config', function () {
    it('should throw if karma is not found', function () {
      expect(reKaLa).to.throw('You must give me your "Karma" server !');
    });
  });

});
