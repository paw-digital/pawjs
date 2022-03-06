'use strict';

// libraries
const chai = require('chai');

// modules
const pawjs = require('../../index.js');
const assert = chai.assert;
const expect = chai.expect;

const getTimeNanos = () => {
  return BigInt(process.hrtime.bigint());
};

const getCoinDatas = (pawTest) => {
  if (pawTest == undefined) {
    throw Error('pawTest is a required parameter.');
  }
  return [
    {
      coin: 'paw',
      coinPrefix: 'paw',
      getChangeRepresentativeForSeedFn: (pawjs) => {
        return pawjs.changePawRepresentativeForSeed;
      },
      getSendWithdrawalFromSeedFn: (pawjs) => {
        return pawjs.sendPawWithdrawalFromSeed;
      },
      getSendAmountToAccountFn: (pawjs) => {
        return pawjs.sendAmountToPawAccount;
      },
      getSendAmountToAccountWithRepresentativeAndPreviousFn: (pawjs) => {
        return pawjs.sendAmountToPawAccountWithRepresentativeAndPrevious;
      },
      getAccountFromSeedFn: (pawjs) => {
        return pawjs.getPawAccountFromSeed;
      },
      getReceiveDepositsForSeedFn: (pawjs) => {
        return pawjs.receivePawDepositsForSeed;
      },
      getOpenAccountFromSeedFn: (pawjs) => {
        return pawjs.openPawAccountFromSeed;
      },
      getReceiveCamoDepositsForSeedFn: (pawjs) => {
        return pawjs.receiveCamoPawDepositsForSeed;
      },
      getCamoReceiveFn: (pawjs) => {
        return pawjs.camoPawReceive;
      },
      getCamoSendFn: (pawjs) => {
        return pawjs.camoPawSend;
      },
      getCamoAccountBalanceRawFn: (pawjs) => {
        return pawjs.getCamoPawAccountBalanceRaw;
      },
      getCamoGetNextPrivateKeyForReceiveFn: (pawjs) => {
        return pawjs.getCamoPawNextPrivateKeyForReceive;
      },
      getCamoSendWithdrawalFromSeedFn: (pawjs) => {
        return pawjs.camoPawSendWithdrawalFromSeed;
      },
      getCamoSharedAccountDataFn: (pawjs) => {
        return pawjs.getCamoPawSharedAccountData;
      },
      getCamoGetAccountsPendingFn: (pawjs) => {
        return pawjs.camoPawGetAccountsPending;
      },
      representative1: pawTest.pawRepresentative1,
      toAccount: pawTest.pawAccount,
      bad: {
        seed: 'F975E272ECAF243CB30D3DAB4473F14A482A255A46AE140B1F96F5A1F32F3D51',
        account:
          'paw_1bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq',
      },
    },
    {
      coin: 'nano',
      coinPrefix: 'nano',
      getChangeRepresentativeForSeedFn: (pawjs) => {
        return pawjs.changeNanoRepresentativeForSeed;
      },
      getSendWithdrawalFromSeedFn: (pawjs) => {
        return pawjs.sendNanoWithdrawalFromSeed;
      },
      getSendAmountToAccountFn: (pawjs) => {
        return pawjs.sendAmountToNanoAccount;
      },
      getSendAmountToAccountWithRepresentativeAndPreviousFn: (pawjs) => {
        return pawjs.sendAmountToNanoAccountWithRepresentativeAndPrevious;
      },
      getAccountFromSeedFn: (pawjs) => {
        return pawjs.getNanoAccountFromSeed;
      },
      getReceiveDepositsForSeedFn: (pawjs) => {
        return pawjs.receiveNanoDepositsForSeed;
      },
      getOpenAccountFromSeedFn: (pawjs) => {
        return pawjs.openNanoAccountFromSeed;
      },
      getReceiveCamoDepositsForSeedFn: (pawjs) => {
        return pawjs.receiveCamoNanoDepositsForSeed;
      },
      getCamoReceiveFn: (pawjs) => {
        return pawjs.camoNanoReceive;
      },
      getCamoSendFn: (pawjs) => {
        return pawjs.camoNanoSend;
      },
      getCamoAccountBalanceRawFn: (pawjs) => {
        return pawjs.getCamoNanoAccountBalanceRaw;
      },
      getCamoGetNextPrivateKeyForReceiveFn: (pawjs) => {
        return pawjs.getCamoNanoNextPrivateKeyForReceive;
      },
      getCamoSendWithdrawalFromSeedFn: (pawjs) => {
        return pawjs.camoNanoSendWithdrawalFromSeed;
      },
      getCamoSharedAccountDataFn: (pawjs) => {
        return pawjs.getCamoNanoSharedAccountData;
      },
      getCamoGetAccountsPendingFn: (pawjs) => {
        return pawjs.camoNanoGetAccountsPending;
      },
      representative1: pawTest.nanoRepresentative1,
      toAccount: pawTest.nanoAccount,
      bad: {
        seed: 'F975E272ECAF243CB30D3DAB4473F14A482A255A46AE140B1F96F5A1F32F3D51',
        account:
          'nano_1bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq',
      },
    },
  ];
};

const getPawjsWithMockApi = () => {
  const pawnodeApi = require('./mock-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const getPawjsWithRealApi = () => {
  const pawnodeApi = require('./mock-pawnode-api.js');
  pawjs.setPawnodeApi(pawjs.realPawnodeApi);
  return pawjs;
};

const getPawjsWithErrorApi = () => {
  const pawnodeApi = require('./everything-error-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const getPawjsWithProcessErrorApi = () => {
  const pawnodeApi = require('./process-error-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const getPawjsWithProcessForkApi = () => {
  const pawnodeApi = require('./process-fork-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const getPawjsWithPendingErrorApi = () => {
  const pawnodeApi = require('./pending-error-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const getPawjsWithAccountRepresentativeUndefinedApi = () => {
  const pawnodeApi = require('./representative-undefined-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const getPawjsWithAccountInfoBalanceErrorApi = () => {
  const pawnodeApi = require('./account-info-balance-error-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const getPawjsWithAccountInfoErrorApi = () => {
  const pawnodeApi = require('./account-info-error-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const getPawjsWithCamoApi = () => {
  const pawnodeApi = require('./camo-pawnode-api.js');
  pawjs.setPawnodeApi(pawnodeApi);
  return pawjs;
};

const expectErrorMessage = async (
  errorMessage,
  fn,
  arg1,
  arg2,
  arg3,
  arg4,
  arg5,
  arg6
) => {
  try {
    await fn(arg1, arg2, arg3, arg4, arg5, arg6);
  } catch (err) {
    assert.isDefined(err);
    // console.trace('expectErrorMessage', errorMessage, fn, err.message);
    expect(errorMessage).to.deep.equal(err.message);
    if (err.message != errorMessage) {
      // console.trace('expectErrorMessage', errorMessage, fn, err);
      assert.fail(`expected:'${errorMessage}'<>actual:'${err.message}'`);
    }
    return;
  }
  assert.fail(`no error was thrown, expected err.message='${errorMessage}'`);
};

const deactivate = () => {
  pawjs.setPawnodeApi(undefined);
  pawjs.setAuth(undefined);
};

exports.getTimeNanos = getTimeNanos;
exports.getPawjsWithRealApi = getPawjsWithRealApi;
exports.getPawjsWithMockApi = getPawjsWithMockApi;
exports.getPawjsWithErrorApi = getPawjsWithErrorApi;
exports.getPawjsWithProcessErrorApi = getPawjsWithProcessErrorApi;
exports.getPawjsWithAccountInfoBalanceErrorApi =
  getPawjsWithAccountInfoBalanceErrorApi;
exports.getPawjsWithAccountInfoErrorApi = getPawjsWithAccountInfoErrorApi;
exports.getPawjsWithCamoApi = getPawjsWithCamoApi;
exports.getPawjsWithPendingErrorApi = getPawjsWithPendingErrorApi;
exports.getPawjsWithAccountRepresentativeUndefinedApi =
  getPawjsWithAccountRepresentativeUndefinedApi;
exports.getPawjsWithProcessForkApi = getPawjsWithProcessForkApi;
exports.expectErrorMessage = expectErrorMessage;
exports.getCoinDatas = getCoinDatas;
exports.deactivate = deactivate;
