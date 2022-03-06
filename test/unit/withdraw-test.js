'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const pawTest = require('./paw-test.json');

const testUtil = require('../util/test-util.js');

const seed0 = pawTest.seed0;
const seedIx = pawTest.seedIx;
const coinDatas = testUtil.getCoinDatas(pawTest);
const amountPaws = '1';

describe('withdraw', () => {
  coinDatas.forEach((coinData) => {
    it(
      coinData.coin + ' sendWithdrawalFromSeed valid account matches expected',
      async () => {
        const pawjs = testUtil.getpawjsWithMockApi();

        let expectedResponse;
        if (coinData.coin == 'paw') {
          expectedResponse =
            '5631DAB5FAF51C8163E054E332951E6BE765BFEFA1AE609A8E942D5B090FCE09';
        }
        if (coinData.coin == 'nano') {
          expectedResponse =
            '344E03CA1D0298189B11865FA410E785A3AAEF81D6EFDA95FEA9B7130F3C2476';
        }
        const sendWithdrawalFromSeed =
          coinData.getSendWithdrawalFromSeedFn(pawjs);
        const toAccount = coinData.toAccount;
        const actualResponse = await sendWithdrawalFromSeed(
          seed0,
          seedIx,
          toAccount,
          amountPaws
        );
        expect(actualResponse).to.deep.equal(expectedResponse);
      }
    );
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
