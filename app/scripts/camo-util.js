'use strict';

// STARTED TOP nodejs/browser hack
(function () {
  // FINISHED TOP nodejs/browser hack
  const nacl = require('../../libraries/tweetnacl/nacl.js');

  const pawUtil = require('./paw-util.js');

  const blake = require('../../libraries/blake2b/blake2b.js');

  const LOG_SWEEP_SEED_TO_INDEX = false;

  const LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO = false;

  const LOG_SEND = false;

  const LOG_RECEIVE = false;

  /**
   * Gets the camo public key from a private key.
   *
   * a normal paw public key is used in ECDSA.
   *
   * a camo public key is used in ECDH.
   *
   * this is why the derivation is different for the two keys.
   *
   * @memberof CamoUtil
   * @param {string} privateKey the private key.
   * @return {string} the camo public key.
   */
  const getCamoPublicKey = (privateKey) => {
    const privateKeyBytes = pawUtil.hexToBytes(privateKey);
    const camoPublicKeyBytes = getCamoPublicKeyBytes(privateKeyBytes);
    const camoPublicKey = pawUtil.bytesToHex(camoPublicKeyBytes);
    return camoPublicKey;
  };

  const getCamoPublicKeyBytes = (privateKeyBytes) => {
    const camoPrivateKeyBytes = nacl.camo.hashsecret(privateKeyBytes);
    const camoPublicKeyBytes = nacl.camo.scalarMult.base(camoPrivateKeyBytes);
    return camoPublicKeyBytes;
  };

  const getSharedSecretBytes = (privateKeyBytes, publicKeyBytes) => {
    const camoPrivateKeyBytes = nacl.camo.hashsecret(privateKeyBytes);
    const secretBytes = nacl.camo.scalarMult(
      camoPrivateKeyBytes,
      publicKeyBytes
    );

    const context = blake.blake2bInit(32);
    blake.blake2bUpdate(context, secretBytes);
    const hashedSecretBytes = blake.blake2bFinal(context);

    return hashedSecretBytes;
  };

  /**
   * Gets the shared secret from a camo public key and a private key.
   *
   * @memberof CamoUtil
   * @param {string} privateKey the private key.
   * @param {string} publicKey the public key.
   * @return {string} the shared secret.
   */
  const getSharedSecret = (privateKey, publicKey) => {
    const privateKeyBytes = pawUtil.hexToBytes(privateKey);
    const publicKeyBytes = pawUtil.hexToBytes(publicKey);
    const secretBytes = getSharedSecretBytes(privateKeyBytes, publicKeyBytes);
    const secret = pawUtil.bytesToHex(secretBytes);
    return secret;
  };

  const isUnopenedPrivateKeyInSeed = async (
    pawnodeApi,
    seed,
    seedIx,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    return await isUnopenedPrivateKey(pawnodeApi, privateKey, amountPrefix);
  };

  const isUnopenedPrivateKey = async (
    pawnodeApi,
    privateKey,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    const publicKey = await pawUtil.getPublicKey(privateKey);
    const account = pawUtil.getAccount(publicKey, amountPrefix);
    // console.log( 'account', account );
    const history = await pawnodeApi.getAccountHistory(account, 1);
    // console.log( 'history', JSON.stringify( history, undefined, '  ' ) );
    const historyHistory = history.history;
    // console.log( 'historyHistory', JSON.stringify( historyHistory, undefined, '  ' ) );
    const historyHistoryLength = historyHistory.length;
    // console.log( 'historyHistoryLength', historyHistoryLength );
    const historyHistoryLengthIsZero = historyHistoryLength == 0;

    // console.log( 'isUnopenedPrivateKey', account, historyHistoryLengthIsZero );

    return historyHistoryLengthIsZero;
  };

  const getFirstUnopenedPrivateKey = async (
    pawnodeApi,
    seed,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (seed === undefined) {
      throw Error('seed is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    let seedIx = 0;
    let isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed(
      pawnodeApi,
      seed,
      seedIx,
      amountPrefix
    );
    while (!isUnopenedPrivateKeyFlag) {
      seedIx++;
      isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed(
        pawnodeApi,
        seed,
        seedIx,
        amountPrefix
      );
    }
    //    console.log( 'getFirstUnopenedPrivateKey', seed, seedIx );
    return pawUtil.getPrivateKey(seed, seedIx);
  };

  const receiveSeed = async (pawnodeApi, seed, amountPrefix) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (seed === undefined) {
      throw Error('seed is a required parameter.');
    }
    const unopenedAccounts = [];
    const privateKeyByAccount = {};
    const publicKeyByAccount = {};
    const representativeByAccount = {};

    const getAccount = async (seed, seedIx) => {
      const privateKey = pawUtil.getPrivateKey(seed, seedIx);
      const publicKey = await pawUtil.getPublicKey(privateKey);
      const account = pawUtil.getAccount(publicKey, amountPrefix);
      const camoPublicKey = getCamoPublicKey(privateKey);
      const camoAccount = pawUtil.getAccount(camoPublicKey, amountPrefix);

      privateKeyByAccount[account] = privateKey;
      publicKeyByAccount[account] = publicKey;
      representativeByAccount[account] = camoAccount;

      return account;
    };

    let seedIx = 0;
    let isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed(
      pawnodeApi,
      seed,
      seedIx,
      amountPrefix
    );
    unopenedAccounts.push(await getAccount(seed, seedIx, amountPrefix));
    while (!isUnopenedPrivateKeyFlag) {
      /* istanbul ignore if */
      if (LOG_RECEIVE) {
        console.log(
          'INTERIM camo.receiveSeed',
          'unopenedAccounts',
          'seedIx',
          seedIx
        );
      }

      seedIx++;
      unopenedAccounts.push(await getAccount(seed, seedIx));
      isUnopenedPrivateKeyFlag = await isUnopenedPrivateKeyInSeed(
        pawnodeApi,
        seed,
        seedIx,
        amountPrefix
      );
    }
    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log('accountsPending request', unopenedAccounts);
    }
    const accountsPending = await pawnodeApi.getAccountsPending(
      unopenedAccounts,
      -1
    );
    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log('accountsPending response', accountsPending);
    }

    const accounts = Object.keys(accountsPending.blocks);

    const accountOpenAndReceiveBlocks = [];

    for (let accountIx = 0; accountIx < accounts.length; accountIx++) {
      const account = accounts[accountIx];
      const privateKey = privateKeyByAccount[account];
      const publicKey = publicKeyByAccount[account];
      const representative = representativeByAccount[account];
      let isAccountOpenFlag = await pawUtil.isAccountOpen(
        pawnodeApi,
        account
      );
      const pendingBlockHashs = Object.keys(accountsPending.blocks[account]);
      for (
        let pendingBlockHashIx = 0;
        pendingBlockHashIx < pendingBlockHashs.length;
        pendingBlockHashIx++
      ) {
        const pendingBlockHash = pendingBlockHashs[pendingBlockHashIx];
        const pendingValueRaw =
          accountsPending.blocks[account][pendingBlockHash];
        if (pendingBlockHashIx !== 0) {
          isAccountOpenFlag = false;
        }

        const blockHash = await receiveBlock(
          pawnodeApi,
          isAccountOpenFlag,
          account,
          privateKey,
          publicKey,
          representative,
          pendingBlockHash,
          pendingValueRaw,
          amountPrefix
        );

        accountOpenAndReceiveBlocks.push(blockHash);
      }
    }

    return accountOpenAndReceiveBlocks;
  };

  const receiveBlock = async (
    pawnodeApi,
    isAccountOpenFlag,
    account,
    privateKey,
    publicKey,
    representative,
    pendingBlockHash,
    pendingValueRaw,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (isAccountOpenFlag === undefined) {
      throw Error('isAccountOpenFlag is a required parameter.');
    }
    /* istanbul ignore if */
    if (account === undefined) {
      throw Error('account is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (publicKey === undefined) {
      throw Error('publicKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (representative === undefined) {
      throw Error('representative is a required parameter.');
    }
    /* istanbul ignore if */
    if (pendingBlockHash === undefined) {
      throw Error('pendingBlockHash is a required parameter.');
    }
    /* istanbul ignore if */
    if (pendingValueRaw === undefined) {
      throw Error('pendingValueRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    const frontiers = await pawnodeApi.getFrontiers(account, 1);
    if (isAccountOpenFlag) {
      const previous = frontiers.frontiers[account];
      const hash = pendingBlockHash;
      const valueRaw = pendingValueRaw;
      const receiveBlockHash = await pawUtil.receive(
        pawnodeApi,
        privateKey,
        publicKey,
        representative,
        previous,
        hash,
        valueRaw,
        amountPrefix
      );

      /* istanbul ignore if */
      if (LOG_SWEEP_SEED_TO_INDEX) {
        console.log(
          `accountsPending receiveBlockHash[${accountIx}]`,
          account,
          receiveBlockHash
        );
      }
      return receiveBlockHash;
    } else {
      const pending = pendingBlockHash;
      const openBlockHash = await pawUtil.open(
        pawnodeApi,
        privateKey,
        publicKey,
        representative,
        pending,
        pendingValueRaw,
        amountPrefix
      );

      /* istanbul ignore if */
      if (LOG_SWEEP_SEED_TO_INDEX) {
        console.log(
          `accountsPending openBlockHash[${accountIx}]`,
          account,
          openBlockHash
        );
      }
      return openBlockHash;
    }
  };

  const getSharedSecretFromRepresentative = async (
    pawnodeApi,
    toPrivateKey,
    fromPublicKey,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (toPrivateKey === undefined) {
      throw Error('toPrivateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (fromPublicKey === undefined) {
      throw Error('fromPublicKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    const fromAccount = pawUtil.getAccount(fromPublicKey, amountPrefix);
    const fromRepresentative = await pawnodeApi.getAccountRepresentative(
      fromAccount
    );
    if (fromRepresentative) {
      const fromCamoPublicKey =
        pawUtil.getAccountPublicKey(fromRepresentative);
      const sharedSecret = getSharedSecret(toPrivateKey, fromCamoPublicKey);
      return sharedSecret;
    } else {
      return undefined;
    }
  };

  const getBalanceRaw = async (
    pawnodeApi,
    toPrivateKey,
    fromPublicKey,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    const sharedSecret = await getSharedSecretFromRepresentative(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      amountPrefix
    );

    const seed = sharedSecret;

    const ZERO = BigInt(0);

    let balanceRaw = ZERO;

    let seedIx = 0;
    let accountHasBalance = true;
    while (accountHasBalance) {
      const privateKey = pawUtil.getPrivateKey(seed, seedIx);
      const publicKey = await pawUtil.getPublicKey(privateKey);
      const account = pawUtil.getAccount(publicKey, amountPrefix);
      const accountBalanceRaw = await pawnodeApi.getAccountBalanceRaw(account);

      const accountBalanceRawBigInt = BigInt(accountBalanceRaw);
      // console.log( 'getBalanceRaw', account, accountBalanceRawBigInt);

      if (accountBalanceRawBigInt == ZERO) {
        accountHasBalance = false;
      } else {
        balanceRaw += accountBalanceRawBigInt;
        seedIx++;
      }
    }

    return balanceRaw.toString();
  };

  // def myfunc(x):
  //    powers = []
  //    i = 1
  //    while i <= x:
  //        if i & x:
  //            powers.append(i)
  //        i <<= 1
  //    return powers

  const splitBigIntIntoPowersOfTwo = (value) => {
    // const ZERO = BigInt( 0 );
    const ONE = BigInt(1);

    /* istanbul ignore if */
    if (LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO) {
      console.log('STARTED splitBigIntIntoPowersOfTwo', 'value', value);
    }

    const powersOfTwo = [];

    let divisor = ONE;

    /* istanbul ignore if */
    if (LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO) {
      console.log(
        `INTERIM splitBigIntIntoPowersOfTwo`,
        'value',
        value,
        'divisor',
        divisor
      );
    }
    while (divisor <= value) {
      /* istanbul ignore if */
      if (LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO) {
        console.log(
          `INTERIM splitBigIntIntoPowersOfTwo`,
          'while ( divisor <= value )',
          'value',
          value,
          'divisor',
          divisor
        );
      }
      if (divisor & value) {
        /* istanbul ignore if */
        if (LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO) {
          console.log(
            `INTERIM splitBigIntIntoPowersOfTwo`,
            '(divisor & value)=true',
            'value',
            value,
            'divisor',
            divisor
          );
        }
        powersOfTwo.push(divisor);
      } else {
        /* istanbul ignore if */
        if (LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO) {
          console.log(
            `INTERIM splitBigIntIntoPowersOfTwo`,
            '(divisor & value)=false',
            'value',
            value,
            'divisor',
            divisor
          );
        }
      }

      divisor <<= ONE;

      /* istanbul ignore if */
      if (LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO) {
        console.log(`INTERIM splitBigIntIntoPowersOfTwo`, value, divisor);
      }
    }

    /* istanbul ignore if */
    if (LOG_SPLIT_BIG_INT_INTO_POWERS_OF_TWO) {
      console.log('SUCCESS splitBigIntIntoPowersOfTwo', value, powersOfTwo);
    }

    return powersOfTwo;
  };

  const send = async (
    pawnodeApi,
    fundingPrivateKey,
    fromPrivateKey,
    toPublicKey,
    amountRaw,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (fundingPrivateKey === undefined) {
      throw Error('fundingPrivateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (fromPrivateKey === undefined) {
      throw Error('fromPrivateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (toPublicKey === undefined) {
      throw Error('toPublicKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountRaw === undefined) {
      throw Error('amountRaw is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log('camo.send.amountRaw', amountRaw);
    }

    const pawParts = pawUtil.getAmountPartsFromRaw(
      amountRaw,
      amountPrefix
    );

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log('camo.send.pawParts', pawParts);
    }

    const powersOfTwoBigInts = splitBigIntIntoPowersOfTwo(
      BigInt(pawParts[pawParts.majorName])
    );

    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log('camo.send.powersOfTwoBigInts', powersOfTwoBigInts);
    }

    const amounts = [];

    if (pawParts[pawParts.minorName] !== '0') {
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log(
          'camo.send.pawParts[pawParts.minorName]',
          pawParts[pawParts.minorName]
        );
      }
      const pawoshiRaw = pawUtil.getRawStrFromMinorAmountStr(
        pawParts[pawParts.minorName],
        amountPrefix
      );
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('camo.send.pawoshiRaw', pawoshiRaw);
      }
      amounts.push(pawoshiRaw);
    }
    if (pawParts.raw !== '0') {
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log('camo.send.raw', pawParts.raw);
      }
      amounts.push(pawParts.raw);
    }

    for (
      let powersOfTwoBigIntIx = 0;
      powersOfTwoBigIntIx < powersOfTwoBigInts.length;
      powersOfTwoBigIntIx++
    ) {
      const powersOfTwoBigInt = powersOfTwoBigInts[powersOfTwoBigIntIx];
      const powersOfTwoRaw = pawUtil.getRawStrFromMajorAmountStr(
        powersOfTwoBigInt.toString(),
        amountPrefix
      );
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log(
          `camo.send.powersOfTwoRaw[${powersOfTwoBigIntIx}]`,
          powersOfTwoRaw
        );
      }
      amounts.push(powersOfTwoRaw);
    }

    const sharedSecret = await getSharedSecretFromRepresentative(
      pawnodeApi,
      fromPrivateKey,
      toPublicKey,
      amountPrefix
    );
    /* istanbul ignore if */
    if (LOG_SEND) {
      console.log('camo.send.sharedSecret', sharedSecret);
    }

    const destSeed = sharedSecret;

    const hashes = [];

    let previous;

    for (let amountIx = 0; amountIx < amounts.length; amountIx++) {
      const amount = amounts[amountIx];
      const amountRaw = amount;
      const destSeedIx = amountIx;
      const destPrivateKey = pawUtil.getPrivateKey(destSeed, destSeedIx);
      const destPublicKey = await pawUtil.getPublicKey(destPrivateKey);
      const destAccount = pawUtil.getAccount(destPublicKey, amountPrefix);
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log(
          `STARTED camo.send[${destSeedIx}]`,
          fundingPrivateKey,
          destAccount,
          amountRaw
        );
      }
      const hash =
        await pawUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(
          pawnodeApi,
          fundingPrivateKey,
          destAccount,
          amountRaw,
          undefined,
          previous,
          amountPrefix
        );
      /* istanbul ignore if */
      if (LOG_SEND) {
        console.log(
          `SUCCESS camo.send[${destSeedIx}]`,
          'destPrivateKey',
          destPrivateKey,
          'hash',
          hash
        );
      }
      previous = hash;
      hashes.push(hash);
    }

    return hashes;
  };

  const receive = async (
    pawnodeApi,
    toPrivateKey,
    fromPublicKey,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (toPrivateKey === undefined) {
      throw Error('toPrivateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (fromPublicKey === undefined) {
      throw Error('fromPublicKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }

    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log('STARTED camo.receive', toPrivateKey, fromPublicKey);
    }

    const sharedSecret = await getSharedSecretFromRepresentative(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      amountPrefix
    );
    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log('INTERIM camo.receive', 'sharedSecret', sharedSecret);
    }
    const seed = sharedSecret;

    const returnValue = await receiveSeed(pawnodeApi, seed, amountPrefix);
    /* istanbul ignore if */
    if (LOG_RECEIVE) {
      console.log('SUCCESS camo.receive', returnValue);
    }
    return returnValue;
  };

  /**
   * Get the camo account for a given camo public key.
   *
   * @memberof CamoUtil
   * @param {string} camoPublicKey the camo public key.
   * @return {string} the camo account.
   */
  const getCamoAccount = (camoPublicKey) => {
    const accountSuffix = pawUtil.getAccountSuffix(camoPublicKey);
    return `camo_${accountSuffix}`;
  };

  /**
   * @memberof CamoUtil
   * checks if a camo account is valid.
   * @param {string} camoAccount the camo account.
   * @return {boolean} true if the camo account is valid.
   */
  const isCamoAccountValid = (camoAccount) => {
    if (
      !camoAccount.startsWith('camo_1') &&
      !camoAccount.startsWith('camo_3')
    ) {
      const retval = {};
      retval.valid = false;
      retval.message = `Invalid CAMO PAW Account prefix '${camoAccount}'`;
      return retval;
    }
    if (camoAccount.length !== 65) {
      const retval = {};
      retval.valid = false;
      retval.message = `Invalid CAMO PAW Account length ${camoAccount.length} of '${camoAccount}'`;
      return retval;
    }
    const accountSuffix = camoAccount.substring(5, 65);
    const isSuffixValid = pawUtil.isAccountSuffixValid(accountSuffix);
    if (!isSuffixValid.valid) {
      const retval = {};
      retval.valid = false;
      retval.message = `Invalid CAMO PAW Account '${camoAccount}', ${isSuffixValid.message}`;
      return retval;
    }
    const retval = {};
    retval.valid = true;
    retval.message = '';
    return retval;
  };

  const getSharedAccountData = async (
    pawnodeApi,
    privateKey,
    publicKey,
    sharedSeedIx,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (privateKey === undefined) {
      throw Error('privateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (publicKey === undefined) {
      throw Error('publicKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (sharedSeedIx === undefined) {
      throw Error('sharedSeedIx is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    const sharedSecret = await getSharedSecretFromRepresentative(
      pawnodeApi,
      privateKey,
      publicKey,
      amountPrefix
    );
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const sharedPrivateKey = pawUtil.getPrivateKey(
        sharedSeed,
        sharedSeedIx
      );
      const sharedPublicKey = await pawUtil.getPublicKey(sharedPrivateKey);
      const sharedAccount = pawUtil.getAccount(
        sharedPublicKey,
        amountPrefix
      );
      const data = {};
      data.sharedSeed = sharedSeed;
      data.sharedPrivateKey = sharedPrivateKey;
      data.sharedPublicKey = sharedPublicKey;
      data.sharedAccount = sharedAccount;
      return data;
    } else {
      return undefined;
    }
  };

  const getAccountsPending = async (
    pawnodeApi,
    toPrivateKey,
    fromPublicKey,
    sharedSeedIx,
    count,
    amountPrefix
  ) => {
    /* istanbul ignore if */
    if (pawnodeApi === undefined) {
      throw Error('pawnodeApi is a required parameter.');
    }
    /* istanbul ignore if */
    if (toPrivateKey === undefined) {
      throw Error('toPrivateKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (fromPublicKey === undefined) {
      throw Error('fromPublicKey is a required parameter.');
    }
    /* istanbul ignore if */
    if (sharedSeedIx === undefined) {
      throw Error('sharedSeedIx is a required parameter.');
    }
    /* istanbul ignore if */
    if (count === undefined) {
      throw Error('count is a required parameter.');
    }
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
      throw Error('amountPrefix is a required parameter.');
    }
    const accountData = await getSharedAccountData(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      sharedSeedIx,
      amountPrefix
    );
    if (accountData) {
      const accounts = [accountData.sharedAccount];
      return pawnodeApi.getAccountsPending(accounts, count);
    }
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    const exports = {};

    exports.receiveSeed = receiveSeed;
    exports.receive = receive;
    exports.send = send;
    exports.getBalanceRaw = getBalanceRaw;
    // exports.isHashInPendingOfPrivateKey = isHashInPendingOfPrivateKey;
    // exports.sweepSeedToIndex = sweepSeedToIndex;
    exports.getSharedSecret = getSharedSecret;
    exports.getSharedSecretBytes = getSharedSecretBytes;
    exports.getCamoPublicKey = getCamoPublicKey;
    exports.getCamoPublicKeyBytes = getCamoPublicKeyBytes;
    // exports.getSharedSeed = getSharedSeed;
    exports.getFirstUnopenedPrivateKey = getFirstUnopenedPrivateKey;
    // exports.openAccountWithPrivateKey = openAccountWithPrivateKey;
    exports.getCamoAccount = getCamoAccount;
    exports.isCamoAccountValid = isCamoAccountValid;
    exports.getAccountsPending = getAccountsPending;
    exports.getSharedAccountData = getSharedAccountData;
    exports.receiveBlock = receiveBlock;
    exports.getSharedSecretFromRepresentative =
      getSharedSecretFromRepresentative;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.pawdigital.pawjs.camoUtil = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
