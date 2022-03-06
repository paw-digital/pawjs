'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const pawTest = require('./paw-test.json');

const testUtil = require('../util/test-util.js');
const coinDatas = testUtil.getCoinDatas(pawTest);

const expectedWorkStart = 'FD7B270000000000';
const expectedWork = 'FD7B280000000000';
const expectedWorkHash =
  '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F';

const privateKey = pawTest.privateKey;
const block = pawTest.block;
const signature = pawTest.signature;
const hash = pawTest.hash;
const accountPublicKey = pawTest.accountPublicKey;
const pawSeed = pawTest.seed;

describe('block-sign', () => {
  coinDatas.forEach((coinData) => {
    const bad = coinData.bad;
    const pawAccount = coinData.toAccount;
    it(coinData.coin + ' send works, good account', (done) => {
      const pawjs = testUtil.getPawjsWithMockApi();
      const successCallback = () => {
        done();
      };
      const failureCallback = (error) => {
        throw error;
      };
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(pawjs);
      sendAmountToAccount(
        pawSeed,
        0,
        pawAccount,
        1,
        successCallback,
        failureCallback
      );
    });
    it(coinData.coin + ' send works, bad account', (done) => {
      const pawjs = testUtil.getPawjsWithMockApi();
      const successCallback = () => {
        done();
      };
      const failureCallback = (error) => {
        throw error;
      };
      const sendAmountToAccount = coinData.getSendAmountToAccountFn(pawjs);
      sendAmountToAccount(
        bad.seed,
        0,
        bad.account,
        1,
        successCallback,
        failureCallback
      );
    });
  });

  it('accountPublicKey matches expected', () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expectedAccountPublicKey = accountPublicKey;
    const actualAccountPublicKey = pawjs.getAccountPublicKey(block.account);
    expect(expectedAccountPublicKey).to.deep.equal(actualAccountPublicKey);
  });
  it('hash of block matches expected', () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expectedHash = hash;
    const actualHash = pawjs.getBlockHash(block);
    expect(expectedHash).to.deep.equal(actualHash);
  });
  it('signature of block matches expected', async () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const expectedSignature = signature;
    const actualSignature = await pawjs.getSignature(privateKey, block);
    expect(expectedSignature).to.deep.equal(actualSignature);
  });
  it('getHexFromBytes and getHexFromBytes works', () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const workBytes = pawjs.getBytesFromHex(expectedWorkStart);
    const actualWorkStart = pawjs.getHexFromBytes(workBytes);
    expect(expectedWorkStart).to.deep.equal(actualWorkStart);
  });
  it('getZeroedWorkBytes', () => {
    const expectedWorkBytes = new Uint8Array(8);
    const pawjs = testUtil.getPawjsWithMockApi();
    const actualWorkBytes = pawjs.getZeroedWorkBytes();
    expect(expectedWorkBytes).to.deep.equal(actualWorkBytes);
  });
  it('getWork works', () => {
    const pawjs = testUtil.getPawjsWithMockApi();
    const workBytes = pawjs.getBytesFromHex(expectedWorkStart).reverse();
    const actualWork = pawjs.getWorkUsingCpu(expectedWorkHash, workBytes);
    expect(expectedWork).to.deep.equal(actualWork);
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
