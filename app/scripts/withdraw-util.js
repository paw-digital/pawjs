'use strict';

// STARTED TOP nodejs/browser hack
(function () {
  // FINISHED TOP nodejs/browser hack
  const pawUtil = require('./paw-util.js');

  const LOG_WITHDRAW = false;

  const withdraw = async (
    loggingUtil,
    pawnodeApi,
    privateKey,
    toAccount,
    amountPaws,
    accountPrefix,
    representative,
    previous
  ) => {
    /* istanbul ignore if */
    if (loggingUtil === undefined) {
      throw Error('loggingUtil is required.');
    }
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is required.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is required.');
    }
    /* istanbul ignore if */
    if (toAccount === undefined) {
      throw Error('toAccount is required.');
    }
    /* istanbul ignore if */
    if (amountPaws === undefined) {
      throw Error('amountPaws is required.');
    }
    /* istanbul ignore if */
    if (accountPrefix === undefined) {
      throw Error('accountPrefix is required.');
    }
    const publicKey = await pawUtil.getPublicKey(privateKey);
    const fromAccount = pawUtil.getAccount(publicKey, accountPrefix);
    const amountRaw = pawUtil.getRawStrFromMajorAmountStr(
      amountPaws.toString(),
      accountPrefix
    );
    /* istanbul ignore if */
    if (LOG_WITHDRAW) {
      loggingUtil.log(
        'STARTED withdraw fromAccount',
        fromAccount,
        'toAccount',
        toAccount,
        'amountRaw',
        amountRaw
      );
    }
    const response =
      await pawUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(
        pawnodeApi,
        privateKey,
        toAccount,
        amountRaw,
        representative,
        previous,
        accountPrefix
      );
    /* istanbul ignore if */
    if (LOG_WITHDRAW) {
      loggingUtil.log(
        'SUCCESS withdraw fromAccount',
        fromAccount,
        'toAccount',
        toAccount,
        'amountRaw',
        amountRaw,
        'response',
        response
      );
    }
    return response;
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};
    exports.withdraw = withdraw;
    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.pawdigital.pawjs.withdrawUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
