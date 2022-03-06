'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const pawTest = require('./paw-test.json');

const testUtil = require('../util/test-util.js');

const invalidPawAccount =
  'paw_111111111111111111111111111111111111111111111111111111111112';

const invalidNanoAccount =
  'nano_211111111111111111111111111111111111111111111111111111111111';

const invalidCamoAccount =
  'camo_21111111111111111111111111111111111111111111111111111111111';

describe('corner-cases', () => {
  it('decToHex matches expected', () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expected = '01';
    const actual = pawjs.pawUtil.decToHex(1);
    expect(expected).to.deep.equal(actual);
  });
  it('setAuth', () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    pawjs.setAuth('');
  });
  it('getAccountPublicKey error Undefined PAW Account', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const message = 'Undefined PAW Account';
    await testUtil.expectErrorMessage(message, pawjs.getAccountPublicKey);
  });
  it('getAccountPublicKey error `Not a string', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const message = `Not a string: '[object Promise]'`;
    const promise = new Promise((resolve) => {
      resolve();
    });
    await testUtil.expectErrorMessage(
      message,
      pawjs.getAccountPublicKey,
      promise
    );
  });
  it('getAccountPublicKey error Invalid PAW Account prefix', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const message = "Invalid PAW Account prefix ''";
    await testUtil.expectErrorMessage(
      message,
      pawjs.getAccountPublicKey,
      ''
    );
  });
  it('getAccountPublicKey error Invalid PAW Account', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const message = `Invalid PAW Account \'${invalidPawAccount}\', does not match regex '^[13456789abcdefghijkmnopqrstuwxyz]+$'`;
    await testUtil.expectErrorMessage(
      message,
      pawjs.getAccountPublicKey,
      invalidPawAccount
    );
  });
  it('getAccountPublicKey error Invalid NANO Account', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const message = `Invalid NANO Account prefix \'${invalidNanoAccount}\'`;
    await testUtil.expectErrorMessage(
      message,
      pawjs.getAccountPublicKey,
      invalidNanoAccount
    );
  });
  it('getAccountPublicKey error Invalid CAMO PAW Account prefix', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const message = `Invalid CAMO PAW Account prefix \'${invalidCamoAccount}\'`;
    await testUtil.expectErrorMessage(
      message,
      pawjs.getAccountPublicKey,
      invalidCamoAccount
    );
  });
  it('getAccountPublicKey camo', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expected = pawTest.accountPublicKey;
    const actual = pawjs.getAccountPublicKey(pawTest.camoAccount);
    expect(expected).to.deep.equal(actual);
  });
  it('getRawStrFromPawoshiStr matches expected', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expected = '1000000000000000000000000000';
    const actual = pawjs.getRawStrFromPawoshiStr(1);
    expect(expected).to.deep.equal(actual);
  });
  it('getRawStrFromNanoshiStr matches expected', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expected = '1000000000000000000000000';
    const actual = pawjs.getRawStrFromNanoshiStr(1);
    expect(expected).to.deep.equal(actual);
  });
  it('getPawAccount matches expected', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expected = 'paw_7rmwcs5x';
    const actual = pawjs.getPawAccount('');
    expect(expected).to.deep.equal(actual);
  });
  it('getNanoAccount matches expected', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expected = 'nano_7rmwcs5x';
    const actual = pawjs.getNanoAccount('');
    expect(expected).to.deep.equal(actual);
  });
  it('getBlockCount matches expected', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expected = { count: '1000', unchecked: '10' };
    const actual = await pawjs.getBlockCount();
    expect(expected).to.deep.equal(actual);
  });
  it('getPawDecimalAmountAsRaw matches expected, full decimal', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const decimalAmount = '1.23456789012345678901234567890';
    const expectedRaw = '123456789012345678901234567890';
    const actualRaw = await pawjs.getPawDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const pawParts = await pawjs.getPawPartsFromRaw(actualRaw);
    const actualDesc = await pawjs.getPawPartsDescription(pawParts);
    const expectedDesc =
      '1 paw 23 pawoshi 456,789,012,345,678,901,234,567,890 raw';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getPawDecimalAmountAsRaw matches expected, whole number', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const decimalAmount = '1234';
    const expectedRaw = '123400000000000000000000000000000';
    const actualRaw = await pawjs.getPawDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const pawParts = await pawjs.getPawPartsFromRaw(actualRaw);
    const actualDesc = await pawjs.getPawPartsDescription(pawParts);
    const expectedDesc = '1,234 paw';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getPawDecimalAmountAsRaw matches expected, pawoshi only', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const decimalAmount = '0.12';
    const expectedRaw = '12000000000000000000000000000';
    const actualRaw = await pawjs.getPawDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const pawParts = await pawjs.getPawPartsFromRaw(actualRaw);
    const actualDesc = await pawjs.getPawPartsDescription(pawParts);
    const expectedDesc = '12 pawoshi';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getPawDecimalAmountAsRaw matches expected, raw only', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const decimalAmount = '0.0012';
    const expectedRaw = '120000000000000000000000000';
    const actualRaw = await pawjs.getPawDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const pawParts = await pawjs.getPawPartsFromRaw(actualRaw);
    const actualDesc = await pawjs.getPawPartsDescription(pawParts);
    const expectedDesc = '120,000,000,000,000,000,000,000,000 raw';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getPawDecimalAmountAsRaw matches expected, zero', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const decimalAmount = '0';
    const expectedRaw = '0';
    const actualRaw = await pawjs.getPawDecimalAmountAsRaw(decimalAmount);
    expect(actualRaw).to.deep.equal(expectedRaw);
    const pawParts = await pawjs.getPawPartsFromRaw(actualRaw);
    const actualDesc = await pawjs.getPawPartsDescription(pawParts);
    const expectedDesc = '0 paw';
    expect(actualDesc).to.deep.equal(expectedDesc);
  });
  it('getPawDecimalAmountAsRaw matches expected error', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const decimalAmount = '1.234567890123456789012345678901';
    const message =
      "too many numbers past the decimal in '1.234567890123456789012345678901', remove 1 of them.";
    await testUtil.expectErrorMessage(
      message,
      pawjs.getPawDecimalAmountAsRaw,
      decimalAmount
    );
  });
  describe('getPawPartsAsDecimal', () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    it('getPawPartsAsDecimal matches expected, zero, paw,pawoshi,raw', async () => {
      const actualPawParts = await pawjs.getPawPartsFromDecimal('0');
      expect(actualPawParts.paw).to.equal('0');
      expect(actualPawParts.pawoshi).to.equal('0');
      expect(actualPawParts.raw).to.equal('0');
      const actualDecimal = await pawjs.getPawPartsAsDecimal(
        actualPawParts
      );
      const expectedDecimal = '0.00000000000000000000000000000';
      expect(actualDecimal).to.deep.equal(expectedDecimal);
    });
    it('getPawPartsAsDecimal matches expected, zero, raw only', async () => {
      const actualPawParts = await pawjs.getPawPartsFromDecimal('0');
      delete actualPawParts.paw;
      delete actualPawParts.pawoshi;
      expect(actualPawParts.paw).to.equal(undefined);
      expect(actualPawParts.pawoshi).to.equal(undefined);
      expect(actualPawParts.raw).to.equal('0');
      const actualDecimal = await pawjs.getPawPartsAsDecimal(
        actualPawParts
      );
      const expectedDecimal = '0.00000000000000000000000000000';
      expect(actualDecimal).to.deep.equal(expectedDecimal);
    });
    it('getPawPartsAsDecimal matches expected, zero, pawoshi only', async () => {
      const actualPawParts = await pawjs.getPawPartsFromDecimal('0');
      delete actualPawParts.paw;
      delete actualPawParts.raw;
      expect(actualPawParts.paw).to.equal(undefined);
      expect(actualPawParts.pawoshi).to.equal('0');
      expect(actualPawParts.raw).to.equal(undefined);
      const actualDecimal = await pawjs.getPawPartsAsDecimal(
        actualPawParts
      );
      const expectedDecimal = '0.00';
      expect(actualDecimal).to.deep.equal(expectedDecimal);
    });
    it('getPawPartsAsDecimal matches expected, zero, paw only', async () => {
      const actualPawParts = await pawjs.getPawPartsFromDecimal('0');
      delete actualPawParts.pawoshi;
      delete actualPawParts.raw;
      expect(actualPawParts.paw).to.equal('0');
      expect(actualPawParts.pawoshi).to.equal(undefined);
      expect(actualPawParts.raw).to.equal(undefined);
      const actualDecimal = await pawjs.getPawPartsAsDecimal(
        actualPawParts
      );
      const expectedDecimal = '0';
      expect(actualDecimal).to.deep.equal(expectedDecimal);
    });
    it('getPawPartsAsDecimal matches expected error', async () => {
      const actualDecimalAmount = '1.23456789012345678901234567890';
      const actualPawParts = await pawjs.getPawPartsFromDecimal(
        actualDecimalAmount
      );
      actualPawParts.raw += '1';
      const message =
        "too many numbers in pawParts.raw '4567890123456789012345678901', remove 1 of them.";
      await testUtil.expectErrorMessage(
        message,
        pawjs.getPawPartsAsDecimal,
        actualPawParts
      );
    });
  });
  it('sign from hardware wallet', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const pawnodeApi = require('../util/mock-pawnode-api.js');
    // console.log(`STARTED hw`, pawjs.pawnodeApi);
    const destAccount =
      'paw_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7';
    const amountRaw = '1';
    const expected =
      'EA94473875A88E3777C7FF4251410F09B82AACECE02901D78FDAE4BC571AF77D';
    const accountSigner = {};
    accountSigner.getPublicKey = async () => {
      return await pawjs.getPublicKey(destAccount);
    };
    accountSigner.signBlock = async () => {
      return '';
    };
    try {
      const actual = await pawjs.pawUtil.sendFromPrivateKey(
        pawnodeApi,
        accountSigner,
        destAccount,
        amountRaw,
        pawjs.PAW_PREFIX
      );
      expect(expected).to.deep.equal(actual);
    } catch (e) {
      console.trace(e);
    }
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
