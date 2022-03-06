'use strict';

// STARTED TOP nodejs/browser hack
(function () {
  // FINISHED TOP nodejs/browser hack

  const pawUtil = require('./app/scripts/paw-util.js');
  const realPawnodeApi = require('./app/scripts/Pawnode-api.js');
  const camoUtil = require('./app/scripts/camo-util.js');
  const depositUtil = require('./app/scripts/deposit-util.js');
  const withdrawUtil = require('./app/scripts/withdraw-util.js');
  const loggingUtil = require('./app/scripts/logging-util.js');

  const PAW_PREFIX = 'paw_';

  const NANO_PREFIX = 'nano_';

  let pawnodeApi = realPawnodeApi;

  /**
   * Sets the Pawnode Api (useful for overriding some methods)
   * @memberof Main
   * @param {string} _pawnodeApi the new pawnodeApi
   * @return {undefined} returns nothing.
   */
  const setPawnodeApi = (_pawnodeApi) => {
    pawnodeApi = _pawnodeApi;
  };

  /**
   * Sets the Pawnode Api Authorization
   * @memberof Main
   * @param {string} auth the new authorization
   * @return {undefined} returns nothing.
   */
  const setAuth = (auth) => {
    if (pawnodeApi !== undefined) {
      pawnodeApi.setAuth(auth);
    }
  };

  /**
   * converts amount from decimal to pawParts.
   * @memberof PawUtil
   * @param {string} decimalAmount the decimal amount of paws.
   * @return {PawParts} returns the paw parts of the decimal amount.
   */
  const getPawPartsFromDecimal = (decimalAmount) => {
    const raw = getPawDecimalAmountAsRaw(decimalAmount);
    const pawParts = getPawPartsFromRaw(raw);
    return pawParts;
  };

  /**
   * converts amount from pawParts to decimal.
   * @memberof PawUtil
   * @param {PawParts} pawParts the paw parts to describe.
   * @return {string} returns the decimal amount of paws.
   */
  const getPawPartsAsDecimal = (pawParts) => {
    let pawDecimal = '';
    const paw = pawParts[pawParts.majorName];
    if (paw !== undefined) {
      pawDecimal += paw;
    } else {
      pawDecimal += '0';
    }

    const pawoshi = pawParts[pawParts.minorName];
    if (pawoshi !== undefined || pawParts.raw !== undefined) {
      pawDecimal += '.';
    }

    if (pawoshi !== undefined) {
      if (pawoshi.length == 1) {
        pawDecimal += '0';
      }
      pawDecimal += pawoshi;
    }

    if (pawParts.raw !== undefined) {
      if (pawoshi === undefined) {
        pawDecimal += '00';
      }
      const count = 27 - pawParts.raw.length;
      if (count < 0) {
        throw Error(
          `too many numbers in pawParts.raw '${
            pawParts.raw
          }', remove ${-count} of them.`
        );
      }
      pawDecimal += '0'.repeat(count);
      pawDecimal += pawParts.raw;
    }

    return pawDecimal;
  };

  /**
   * converts amount from decimal to raw.
   * @memberof PawUtil
   * @param {string} amount the decimal amount.
   * @return {string} returns amount in raw.
   */
  const getPawDecimalAmountAsRaw = (amount) => {
    const amountStr = amount.toString();
    const decimal = amountStr.indexOf('.');
    let pawBigInt;
    if (decimal < 0) {
      pawBigInt = BigInt(getRawStrFromPawStr(amountStr));
    } else {
      pawBigInt = BigInt(
        getRawStrFromPawStr(amountStr.substring(0, decimal))
      );
    }
    let pawoshiBigInt;
    if (decimal < 0) {
      pawoshiBigInt = BigInt(0);
    } else {
      let pawoshiRaw = amountStr.substring(decimal + 1);
      // console.log('pawoshiRaw', pawoshiRaw);
      // console.log('pawoshiRaw.length', pawoshiRaw.length);
      const count = 29 - pawoshiRaw.length;
      if (count < 0) {
        throw Error(
          `too many numbers past the decimal in '${amountStr}', remove ${-count} of them.`
        );
      }
      pawoshiRaw += '0'.repeat(count);
      pawoshiBigInt = BigInt(pawoshiRaw);
    }
    const rawBigInt = pawoshiBigInt + pawBigInt;
    const rawStr = rawBigInt.toString(10);
    return rawStr;
  };

  /**
   * describes the paw parts in an english description.
   * @memberof PawUtil
   * @param {PawParts} pawParts the paw parts to describe.
   * @return {string} returns the description of the paw parts.
   */
  const getPawPartsDescription = (pawParts) => {
    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    let pawAmountDesc = '';
    if (pawParts[pawParts.majorName] !== '0') {
      pawAmountDesc += numberWithCommas(pawParts[pawParts.majorName]);
      pawAmountDesc += ' ';
      pawAmountDesc += pawParts.majorName;
    }
    if (pawParts[pawParts.minorName] !== '0') {
      if (pawAmountDesc.length > 0) {
        pawAmountDesc += ' ';
      }
      pawAmountDesc += pawParts[pawParts.minorName];
      pawAmountDesc += ' ';
      pawAmountDesc += pawParts.minorName;
    }
    if (pawParts.raw !== '0') {
      if (pawAmountDesc.length > 0) {
        pawAmountDesc += ' ';
      }
      pawAmountDesc += numberWithCommas(pawParts.raw);
      pawAmountDesc += ' raw';
    }

    if (pawAmountDesc.length === 0) {
      pawAmountDesc = '0 ';
      pawAmountDesc += pawParts.majorName;
    }

    return pawAmountDesc;
  };

  /**
   * Sends the amount to the account with an optional representative and
   * previous block hash.
   * If the representative is not sent, it will be pulled from the api.
   * If the previous is not sent, it will be pulled from the api.
   * Be very careful with previous, as setting it incorrectly
   * can cause an incorrect amount of funds to be sent.
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} destAccount the destination account.
   * @param {string} amountRaw the amount to send, in raw.
   * @param {string} representative the representative (optional).
   * @param {string} previousHash the previous hash (optional).
   * @return {Promise<string>} returns the hash returned by the send.
   */
  const sendAmountToPawAccountWithRepresentativeAndPrevious = async (
    seed,
    seedIx,
    destAccount,
    amountRaw,
    representative,
    previousHash
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const hash =
      await pawUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(
        pawnodeApi,
        privateKey,
        destAccount,
        amountRaw,
        representative,
        previousHash,
        PAW_PREFIX
      );
    return hash;
  };

  /**
   * Sends the amount to the account with an optional representative and
   * previous block hash.
   * If the representative is not sent, it will be pulled from the api.
   * If the previous is not sent, it will be pulled from the api.
   * Be very careful with previous, as setting it incorrectly
   * can cause an incorrect amount of funds to be sent.
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} destAccount the destination account.
   * @param {string} amountRaw the amount to send, in raw.
   * @param {string} representative the representative (optional).
   * @param {string} previousHash the previous hash (optional).
   * @return {Promise<string>} returns the hash returned by the send.
   */
  const sendAmountToNanoAccountWithRepresentativeAndPrevious = async (
    seed,
    seedIx,
    destAccount,
    amountRaw,
    representative,
    previousHash
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const hash =
      await pawUtil.sendFromPrivateKeyWithRepresentativeAndPrevious(
        pawnodeApi,
        privateKey,
        destAccount,
        amountRaw,
        representative,
        previousHash,
        NANO_PREFIX
      );
    return hash;
  };

  /**
   * Sends the amount to the paw account with a callback for success and failure.
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} destAccount the destination account.
   * @param {string} amountRaw the amount to send, in raw.
   * @param {string} successCallback the callback to call upon success.
   * @param {string} failureCallback the callback to call upon failure.
   * @return {Promise<string>} returns the hash returned by the send.
   */
  const sendAmountToPawAccount = async (
    seed,
    seedIx,
    destAccount,
    amountRaw,
    successCallback,
    failureCallback
  ) => {
    return await pawUtil
      .send(
        pawnodeApi,
        seed,
        seedIx,
        destAccount,
        amountRaw,
        successCallback,
        failureCallback,
        PAW_PREFIX
      )
      .catch((error) => {
        // console.trace(error);
        throw Error(error);
      });
  };

  /**
   * Sends the amount to the nano account with a callback for success and failure.
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} destAccount the destination account.
   * @param {string} amountRaw the amount to send, in raw.
   * @param {string} successCallback the callback to call upon success.
   * @param {string} failureCallback the callback to call upon failure.
   * @return {Promise<string>} returns the hash returned by the send.
   */
  const sendAmountToNanoAccount = async (
    seed,
    seedIx,
    destAccount,
    amountRaw,
    successCallback,
    failureCallback
  ) => {
    return await pawUtil
      .send(
        pawnodeApi,
        seed,
        seedIx,
        destAccount,
        amountRaw,
        successCallback,
        failureCallback,
        NANO_PREFIX
      )
      .catch((error) => {
        // console.trace(error);
        throw Error(error);
      });
  };

  /**
   * Sets the rep for an account with a given seed.
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @return {Promise<string>} returns the hash returned by the change.
   */
  const changePawRepresentativeForSeed = async (
    seed,
    seedIx,
    representative
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const response = await pawUtil.change(
      pawnodeApi,
      privateKey,
      representative,
      PAW_PREFIX
    );
    return response;
  };

  /**
   * Sets the rep for an account with a given seed.
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @return {Promise<string>} returns the hash returned by the change.
   */
  const changeNanoRepresentativeForSeed = async (
    seed,
    seedIx,
    representative
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const response = await pawUtil.change(
      pawnodeApi,
      privateKey,
      representative,
      NANO_PREFIX
    );
    return response;
  };

  /**
   * Recieve deposits for a nano account with a given seed.
   * @memberof DepositUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @param {string} specificPendingBlockHash a specific block hash to receive (optional).
   * @return {Promise<object>} returns the response returned by the receive.
   */
  const receiveNanoDepositsForSeed = async (
    seed,
    seedIx,
    representative,
    specificPendingBlockHash
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = await pawUtil.getPublicKey(privateKey);
    const account = pawUtil.getAccount(publicKey, NANO_PREFIX);
    const response = await depositUtil.receive(
      loggingUtil,
      pawnodeApi,
      account,
      privateKey,
      representative,
      specificPendingBlockHash,
      NANO_PREFIX
    );
    return response;
  };

  /**
   * Recieve deposits for a paw account with a given seed.
   * @memberof DepositUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @param {string} specificPendingBlockHash a specific block hash to receive (optional).
   * @return {Promise<object>} returns the response returned by the receive.
   */
  const receivePawDepositsForSeed = async (
    seed,
    seedIx,
    representative,
    specificPendingBlockHash
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = await pawUtil.getPublicKey(privateKey);
    const account = pawUtil.getAccount(publicKey, PAW_PREFIX);
    const response = await depositUtil.receive(
      loggingUtil,
      pawnodeApi,
      account,
      privateKey,
      representative,
      specificPendingBlockHash,
      PAW_PREFIX
    );
    return response;
  };

  /**
   * Send a withdrawal from a paw account with a given seed.
   * @memberof WithdrawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} toAccount the account to send to.
   * @param {string} amountPaws the amount of paws.
   * @param {string} representative the new representative (optional).
   * @param {string} previous the new previous (optional).
   * @return {Promise<object>} returns the response returned by the withdraw.
   */
  const sendPawWithdrawalFromSeed = async (
    seed,
    seedIx,
    toAccount,
    amountPaws,
    representative,
    previous
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const response = withdrawUtil.withdraw(
      loggingUtil,
      pawnodeApi,
      privateKey,
      toAccount,
      amountPaws,
      PAW_PREFIX,
      representative,
      previous
    );
    return response;
  };

  /**
   * Send a withdrawal from a nano account with a given seed.
   * @memberof WithdrawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} toAccount the account to send to.
   * @param {string} amountPaws the amount of paws.
   * @param {string} representative the new representative (optional).
   * @param {string} previous the new previous (optional).
   * @return {Promise<object>} returns the response returned by the withdraw.
   */
  const sendNanoWithdrawalFromSeed = async (
    seed,
    seedIx,
    toAccount,
    amountPaws,
    representative,
    previous
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const response = withdrawUtil.withdraw(
      loggingUtil,
      pawnodeApi,
      privateKey,
      toAccount,
      amountPaws,
      NANO_PREFIX,
      representative,
      previous
    );
    return response;
  };

  /**
   * Get the balance, in raw, for an account.
   *
   * (use other methods like getPawPartsFromRaw to convert to paw or pawoshi)
   *
   * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
   * @memberof PawnodeApi
   * @param {string} account the account to use.
   * @return {Promise<string>} the account's balance, in raw.
   */
  const getAccountBalanceRaw = async (account) => {
    return await pawnodeApi.getAccountBalanceRaw(account);
  };

  /**
   * Get the balance and pending values, in raw, as an object like this one:
   * { balance: '123', pending: '123' } for an account.
   *
   * (use other methods like getPawPartsFromRaw to convert to paw or pawoshi)
   *
   * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
   * @memberof PawnodeApi
   * @param {string} account the account to use.
   * @return {Promise<object>} the account's balances, in raw.
   */
  const getAccountBalanceAndPendingRaw = async (account) => {
    return await pawnodeApi.getAccountBalanceAndPendingRaw(account);
  };

  /**
   * Get the balances and pending values, in raw, as an object for all given account. Returns the Node object without transformation.
   *
   * (use other methods like getPawPartsFromRaw to convert to paw or pawoshi)
   *
   * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_balances}
   * @memberof PawnodeApi
   * @param {string_array} accounts the account to use.
   * @return {Promise<object>} the account's balances, in raw.
   */
  const getAccountsBalances = async (accounts) => {
    return await pawnodeApi.getAccountsBalances(accounts);
  };

  /**
   * Get the history for an account.
   *
   * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_history}
   * @memberof PawnodeApi
   * @param {string} account the account to use.
   * @param {string} count the count to use (use -1 for all).
   * @param {string} head the head to start at (optional).
   * @param {string} raw if true, return raw history (optional).
   * @return {Promise<object>} the account's history.
   */
  const getAccountHistory = async (account, count, head, raw) => {
    return await pawnodeApi.getAccountHistory(account, count, head, raw);
  };

  /**
   * Get the paw account with a given seed and index.
   *
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @return {Promise<string>} the account.
   */
  const getPawAccountFromSeed = async (seed, seedIx) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = await pawUtil.getPublicKey(privateKey);
    const account = pawUtil.getAccount(publicKey, PAW_PREFIX);
    return account;
  };

  /**
   * Get the paw account with a given seed and index.
   *
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @return {Promise<string>} the account.
   */
  const getNanoAccountFromSeed = async (seed, seedIx) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = await pawUtil.getPublicKey(privateKey);
    const account = pawUtil.getAccount(publicKey, NANO_PREFIX);
    return account;
  };

  /**
   * Sets the URL to use for the node behind the Pawnode Api
   * @memberof Main
   * @param {string} url the new url
   * @return {undefined} returns nothing.
   */
  const setPawnodeApiUrl = (url) => {
    pawnodeApi.setUrl(url);
  };

  /**
   * Get the account info for an account.
   *
   * Calls {@link https://docs.nano.org/commands/rpc-protocol/#account_info}
   * @memberof PawnodeApi
   * @param {string} account the account to use.
   * @param {boolean} representativeFlag the representativeFlag to use (optional).
   * @return {Promise<object>} the account's info.
   */
  const getAccountInfo = async (account, representativeFlag) => {
    return await pawnodeApi.getAccountInfo(account, representativeFlag);
  };

  /**
   * Get the network block count.
   *
   * Calls {@link https://docs.nano.org/commands/rpc-protocol/#block_count}
   * @memberof PawnodeApi
   * @return {Promise<object>} the block count.
   */
  const getBlockCount = async () => {
    return await pawnodeApi.getBlockCount();
  };

  /**
   * Open a paw account with a given seed.
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @param {string} pendingBlockHash the pending block hash.
   * @param {string} pendingValueRaw the pending block hash.
   * @return {Promise<string>} returns the hash returned by the open.
   */
  const openPawAccountFromSeed = async (
    seed,
    seedIx,
    representative,
    pendingBlockHash,
    pendingValueRaw
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = await pawUtil.getPublicKey(privateKey);
    return await pawUtil.open(
      pawnodeApi,
      privateKey,
      publicKey,
      representative,
      pendingBlockHash,
      pendingValueRaw,
      PAW_PREFIX
    );
  };

  /**
   * Open a nano account with a given seed.
   * @memberof PawUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} representative the representative.
   * @param {string} pendingBlockHash the pending block hash.
   * @param {string} pendingValueRaw the pending block hash.
   * @return {Promise<string>} returns the hash returned by the open.
   */
  const openNanoAccountFromSeed = async (
    seed,
    seedIx,
    representative,
    pendingBlockHash,
    pendingValueRaw
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = await pawUtil.getPublicKey(privateKey);
    return await pawUtil.open(
      pawnodeApi,
      privateKey,
      publicKey,
      representative,
      pendingBlockHash,
      pendingValueRaw,
      NANO_PREFIX
    );
  };

  /**
   * Get the hash for a given block.
   *
   * @memberof PawUtil
   * @param {string} block the seed to use to find the account.
   * @return {string} the block's hash.
   */
  const getBlockHash = (block) => {
    return pawUtil.hash(block);
  };

  /**
   * signs a hash.
   *
   * @memberof PawUtil
   * @param {string} privateKey the private key to use to sign.
   * @param {string} hash the hash to sign.
   * @return {string} the block's hash.
   */
  const signHash = (privateKey, hash) => {
    return pawUtil.signHash(privateKey, hash);
  };

  /**
   * verifys a hash.
   *
   * @memberof PawUtil
   * @param {string} hash the hash to verify.
   * @param {string} signature the signature to verify.
   * @param {string} publicKey the public key to use to sign.
   * @return {string} true if verification passed.
   */
  const verify = (hash, signature, publicKey) => {
    return pawUtil.verify(hash, signature, publicKey);
  };

  /**
   * Get the signature for a given block (gets the hash of the block, and signs the hash).
   *
   * @memberof PawUtil
   * @param {string} privateKey the private key used to sign the block.
   * @param {string} block the block to sign.
   * @return {string} the block's signature.
   */
  const getSignature = (privateKey, block) => {
    return pawUtil.sign(privateKey, block);
  };

  /**
   * Converts a hex string to bytes in a Uint8Array.
   *
   * @memberof PawUtil
   * @param {string} hex the hex string to use.
   * @return {Uint8Array} the bytes in a Uint8Array.
   */
  const getBytesFromHex = (hex) => {
    return pawUtil.hexToBytes(hex);
  };

  /**
   * Converts bytes in a Uint8Array to a hex string.
   *
   * @memberof PawUtil
   * @param {Uint8Array} bytes the bytes to use.
   * @return {string} the hex string.
   */
  const getHexFromBytes = (bytes) => {
    return pawUtil.bytesToHex(bytes);
  };

  /**
   * gets work bytes using the CPU.
   *
   * @memberof PawUtil
   * @param {string} hash the hash to use to calculate work bytes.
   * @param {Uint8Array} workBytes the Uint8Array(8) used to store temporary calculations.
   * @return {string} the work bytes as a hex string.
   */
  const getWorkUsingCpu = (hash, workBytes) => {
    return pawUtil.getHashCPUWorker(hash, workBytes);
  };

  /**
   * receives paw funds at a camo address.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {Promise<string_array>} the received hashes in an array.
   */
  const camoPawReceive = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.receive(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      PAW_PREFIX
    );
  };

  /**
   * receives nano funds at a camo address.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {Promise<string_array>} the received hashes in an array.
   */
  const camoNanoReceive = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.receive(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      NANO_PREFIX
    );
  };

  /**
   * finds a new private key to recieve more paw funds. the key would have no history.
   *
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @return {Promise<string>} the private key to use.
   */
  const getCamoPawNextPrivateKeyForReceive = async (seed) => {
    return await camoUtil.getFirstUnopenedPrivateKey(
      pawnodeApi,
      seed,
      PAW_PREFIX
    );
  };

  /**
   * finds a new private key to recieve more paw funds. the key would have no history.
   *
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @return {Promise<string>} the private key to use.
   */
  const getCamoNanoNextPrivateKeyForReceive = async (seed) => {
    return await camoUtil.getFirstUnopenedPrivateKey(
      pawnodeApi,
      seed,
      NANO_PREFIX
    );
  };

  /**
   * sends paw funds to a camo address.
   *
   * @memberof CamoUtil
   * @param {string} fundingPrivateKey the private key that sends the funds.
   * @param {string} fromCamoPrivateKey the private key used to generate the shared seed.
   * @param {string} toCamoPublicKey the public key that receives the funds.
   * @param {string} amountPaws the amount of paws.
   * @return {Promise<string_array>} the sent hashes in an array.
   */
  const camoPawSend = async (
    fundingPrivateKey,
    fromCamoPrivateKey,
    toCamoPublicKey,
    amountPaws
  ) => {
    const amountRaw = getRawStrFromPawStr(amountPaws);
    return await camoUtil.send(
      pawnodeApi,
      fundingPrivateKey,
      fromCamoPrivateKey,
      toCamoPublicKey,
      amountRaw,
      PAW_PREFIX
    );
  };

  /**
   * sends camo funds to a camo address.
   *
   * @memberof CamoUtil
   * @param {string} fundingPrivateKey the private key that sends the funds.
   * @param {string} fromCamoPrivateKey the private key used to generate the shared seed.
   * @param {string} toCamoPublicKey the public key that receives the funds.
   * @param {string} amountPaws the amount of paws.
   * @return {Promise<string_array>} the sent hashes in an array.
   */
  const camoNanoSend = async (
    fundingPrivateKey,
    fromCamoPrivateKey,
    toCamoPublicKey,
    amountPaws
  ) => {
    const amountRaw = getRawStrFromNanoStr(amountPaws);
    return await camoUtil.send(
      pawnodeApi,
      fundingPrivateKey,
      fromCamoPrivateKey,
      toCamoPublicKey,
      amountRaw,
      NANO_PREFIX
    );
  };

  /**
   * sends paw funds to a camo account.
   * This function uses seed index 0 to generate the shared secret,
   * and seed index "seedIx" to get the private key that contains funds to send.
   *
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} toAccount the account to send to.
   * @param {string} amountPaws the amount of paws.
   * @return {Promise<string_array>} the sent hashes in an array.
   */
  const camoPawSendWithdrawalFromSeed = async (
    seed,
    seedIx,
    toAccount,
    amountPaws
  ) => {
    const accountValid = getCamoAccountValidationInfo(toAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const fundingPrivateKey = pawUtil.getPrivateKey(seed, seedIx);
    const fromCamoPrivateKey = pawUtil.getPrivateKey(seed, 0);
    const toCamoPublicKey = pawUtil.getAccountPublicKey(toAccount);
    return await camoPawSend(
      fundingPrivateKey,
      fromCamoPrivateKey,
      toCamoPublicKey,
      amountPaws
    );
  };

  /**
   * sends nano funds to a camo account.
   * This function uses seed index 0 to generate the shared secret,
   * and seed index "seedIx" to get the private key that contains funds to send.
   *
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} toAccount the account to send to.
   * @param {string} amountPaws the amount of paws.
   * @return {Promise<string_array>} the sent hashes in an array.
   */
  const camoNanoSendWithdrawalFromSeed = async (
    seed,
    seedIx,
    toAccount,
    amountPaws
  ) => {
    const accountValid = getCamoAccountValidationInfo(toAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const fundingPrivateKey = pawUtil.getPrivateKey(seed, seedIx);
    const fromCamoPrivateKey = pawUtil.getPrivateKey(seed, 0);
    const toCamoPublicKey = pawUtil.getAccountPublicKey(toAccount);
    return await camoNanoSend(
      fundingPrivateKey,
      fromCamoPrivateKey,
      toCamoPublicKey,
      amountPaws
    );
  };

  /**
   * get the pending blocks for the camo paw account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} fromAccount the account to recieve from.
   * @param {number} sharedSeedIx the index to use with the shared seed.
   * @param {number} count the max count to get.
   * @return {Promise<string_array>} the pending hashes in an array.
   */
  const camoPawGetAccountsPending = async (
    seed,
    seedIx,
    fromAccount,
    sharedSeedIx,
    count
  ) => {
    const accountValid = getCamoAccountValidationInfo(fromAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const toPrivateKey = pawUtil.getPrivateKey(seed, seedIx);
    const fromPublicKey = pawUtil.getAccountPublicKey(fromAccount);
    return await camoUtil.getAccountsPending(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      sharedSeedIx,
      count,
      PAW_PREFIX
    );
  };

  /**
   * get the pending blocks for the camo nano account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} fromAccount the account to recieve from.
   * @param {number} sharedSeedIx the index to use with the shared seed.
   * @param {number} count the max count to get.
   * @return {Promise<string_array>} the pending hashes in an array.
   */
  const camoNanoGetAccountsPending = async (
    seed,
    seedIx,
    fromAccount,
    sharedSeedIx,
    count
  ) => {
    const accountValid = getCamoAccountValidationInfo(fromAccount);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const toPrivateKey = pawUtil.getPrivateKey(seed, seedIx);
    const fromPublicKey = pawUtil.getAccountPublicKey(fromAccount);
    return await camoUtil.getAccountsPending(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      sharedSeedIx,
      count,
      NANO_PREFIX
    );
  };

  /**
   * returns data on whether a camo account is valid or not, and why.
   * @param {string} account the account to check.
   * @return {object} the account validity data.
   */
  const getCamoAccountValidationInfo = (account) => {
    const accountValid = camoUtil.isCamoAccountValid(account);
    return accountValid;
  };

  /**
   * get the paw shared account, used as an intermediary to send finds between the seed and the camo account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @return {Promise<string>} the shared account.
   */
  const getCamoPawSharedAccountData = async (
    seed,
    seedIx,
    account,
    sharedSeedIx
  ) => {
    const accountValid = getCamoAccountValidationInfo(account);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = pawUtil.getAccountPublicKey(account);
    return await camoUtil.getSharedAccountData(
      pawnodeApi,
      privateKey,
      publicKey,
      sharedSeedIx,
      PAW_PREFIX
    );
  };

  /**
   * get the nano shared account, used as an intermediary to send finds between the seed and the camo account.
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @return {Promise<string>} the shared account.
   */
  const getCamoNanoSharedAccountData = async (
    seed,
    seedIx,
    account,
    sharedSeedIx
  ) => {
    const accountValid = getCamoAccountValidationInfo(account);
    if (!accountValid.valid) {
      throw Error(accountValid.message);
    }
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = pawUtil.getAccountPublicKey(account);
    return await camoUtil.getSharedAccountData(
      pawnodeApi,
      privateKey,
      publicKey,
      sharedSeedIx,
      NANO_PREFIX
    );
  };

  /**
   * Recieve paw deposits for a camo account with a given seed.
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @param {string} specificPendingBlockHash the pending block to recieve.
   * @return {Promise<string>} the response from receiving the block.
   */
  const receiveCamoPawDepositsForSeed = async (
    seed,
    seedIx,
    account,
    sharedSeedIx,
    specificPendingBlockHash
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = pawUtil.getAccountPublicKey(account);
    const sharedSecret = await camoUtil.getSharedSecretFromRepresentative(
      pawnodeApi,
      privateKey,
      publicKey,
      PAW_PREFIX
    );
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const privateKey = pawUtil.getPrivateKey(sharedSeed, sharedSeedIx);
      const camoPublicKey = await camoUtil.getCamoPublicKey(privateKey);
      const camoRepresentative = await camoUtil.getCamoAccount(camoPublicKey);
      const repPublicKey = await pawUtil.getAccountPublicKey(
        camoRepresentative
      );
      const representative = await pawUtil.getAccount(
        repPublicKey,
        PAW_PREFIX
      );
      const response = await receivePawDepositsForSeed(
        sharedSeed,
        sharedSeedIx,
        representative,
        specificPendingBlockHash
      );
      return response;
    } else {
      return undefined;
    }
  };

  /**
   * Recieve nano deposits for a camo account with a given seed.
   * @memberof CamoUtil
   * @param {string} seed the seed to use to find the account.
   * @param {string} seedIx the index to use with the seed.
   * @param {string} account the camo account to send or recieve from.
   * @param {string} sharedSeedIx the index to use with the shared seed.
   * @param {string} specificPendingBlockHash the pending block to recieve.
   * @return {Promise<string>} the response from receiving the block.
   */
  const receiveCamoNanoDepositsForSeed = async (
    seed,
    seedIx,
    account,
    sharedSeedIx,
    specificPendingBlockHash
  ) => {
    const privateKey = pawUtil.getPrivateKey(seed, seedIx);
    const publicKey = pawUtil.getAccountPublicKey(account);
    const sharedSecret = await camoUtil.getSharedSecretFromRepresentative(
      pawnodeApi,
      privateKey,
      publicKey,
      NANO_PREFIX
    );
    if (sharedSecret) {
      const sharedSeed = sharedSecret;
      const privateKey = pawUtil.getPrivateKey(sharedSeed, sharedSeedIx);
      const camoPublicKey = await camoUtil.getCamoPublicKey(privateKey);
      const camoRepresentative = await camoUtil.getCamoAccount(camoPublicKey);
      const repPublicKey = await pawUtil.getAccountPublicKey(
        camoRepresentative
      );
      const representative = await pawUtil.getAccount(
        repPublicKey,
        NANO_PREFIX
      );
      const response = await receiveNanoDepositsForSeed(
        sharedSeed,
        sharedSeedIx,
        representative,
        specificPendingBlockHash
      );
      return response;
    } else {
      return undefined;
    }
  };

  /**
   * gets the total paw account balance, in raw.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {Promise<string>} the account balance, in raw.
   */
  const getCamoPawAccountBalanceRaw = async (
    toPrivateKey,
    fromPublicKey
  ) => {
    return await camoUtil.getBalanceRaw(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      PAW_PREFIX
    );
  };

  /**
   * gets the total nano account balance, in raw.
   *
   * @memberof CamoUtil
   * @param {string} toPrivateKey the private key that receives the funds.
   * @param {string} fromPublicKey the public key that sent the funds.
   * @return {Promise<string>} the account balance, in raw.
   */
  const getCamoNanoAccountBalanceRaw = async (toPrivateKey, fromPublicKey) => {
    return await camoUtil.getBalanceRaw(
      pawnodeApi,
      toPrivateKey,
      fromPublicKey,
      NANO_PREFIX
    );
  };

  /**
   * Get the network block count.
   *
   * Calls {@link https://docs.nano.org/commands/rpc-protocol/#accounts_pending}
   * @memberof PawnodeApi
   * @param {string_array} accounts the array of pending accounts.
   * @param {number} count the max count to get.
   * @param {string} source if true, get source.
   * @return {Promise<object>} the account's pending blocks.
   */
  const getAccountsPending = async (accounts, count, source) => {
    return await pawnodeApi.getAccountsPending(accounts, count, source);
  };

  /**
   * Converts an amount into a raw amount.
   *
   * @memberof PawUtil
   * @param {string} amountStr the amount, as a string.
   * @param {string} amountPrefix the amount, as a string.
   * @return {string} the paw as a raw value.
   */
  const getRawStrFromPawStr = (amountStr) => {
    return pawUtil.getRawStrFromMajorAmountStr(amountStr, PAW_PREFIX);
  };

  /**
   * Converts an amount into a raw amount.
   *
   * @memberof PawUtil
   * @param {string} amountStr the amount, as a string.
   * @param {string} amountPrefix the amount, as a string.
   * @return {string} the paw as a raw value.
   */
  const getRawStrFromPanoshiStr = (amountStr) => {
    return pawUtil.getRawStrFromMinorAmountStr(amountStr, PAW_PREFIX);
  };
  /**
   * Converts an amount into a raw amount.
   *
   * @memberof PawUtil
   * @param {string} amountStr the amount, as a string.
   * @param {string} amountPrefix the amount, as a string.
   * @return {string} the paw as a raw value.
   */
  const getRawStrFromNanoStr = (amountStr) => {
    return pawUtil.getRawStrFromMajorAmountStr(amountStr, NANO_PREFIX);
  };

  /**
   * Converts an amount into a raw amount.
   *
   * @memberof PawUtil
   * @param {string} amountStr the amount, as a string.
   * @param {string} amountPrefix the amount, as a string.
   * @return {string} the paw as a raw value.
   */
  const getRawStrFromNanoshiStr = (amountStr) => {
    return pawUtil.getRawStrFromMinorAmountStr(amountStr, NANO_PREFIX);
  };

  /**
   * Get the paw account for a given public key.
   *
   * @memberof PawUtil
   * @param {string} publicKey the public key.
   * @return {string} the account.
   */
  const getPawAccount = (publicKey) => {
    return pawUtil.getAccount(publicKey, PAW_PREFIX);
  };

  /**
   * Get the paw account for a given public key.
   *
   * @memberof PawUtil
   * @param {string} publicKey the public key.
   * @return {string} the account.
   */
  const getNanoAccount = (publicKey) => {
    return pawUtil.getAccount(publicKey, NANO_PREFIX);
  };

  /**
   * Get the paw parts (paw, pawoshi, raw) for a given raw value.
   *
   * @memberof PawUtil
   * @param {string} amountRawStr the raw amount, as a string.
   * @return {PawParts} the paw parts.
   */
  const getPawPartsFromRaw = (amountRawStr) => {
    return pawUtil.getAmountPartsFromRaw(amountRawStr, PAW_PREFIX);
  };

  /**
   * Get the nano parts nano, nanoshi, raw) for a given raw value.
   *
   * @memberof PawUtil
   * @param {string} amountRawStr the raw amount, as a string.
   * @return {PawParts} the paw parts.
   */
  const getNanoPartsFromRaw = (amountRawStr) => {
    return pawUtil.getAmountPartsFromRaw(amountRawStr, NANO_PREFIX);
  };

  // STARTED BOTTOM nodejs/browser hack
  const exports = (() => {
    // istanbul ignore if
    if (typeof BigInt === 'undefined') {
      return;
    }
    const exports = {};
    exports.PAW_PREFIX = PAW_PREFIX;
    exports.NANO_PREFIX = NANO_PREFIX;
    exports.PREFIXES = [PAW_PREFIX, NANO_PREFIX];
    exports.sendNanoWithdrawalFromSeed = sendNanoWithdrawalFromSeed;
    exports.sendPawWithdrawalFromSeed = sendPawWithdrawalFromSeed;
    exports.getAccountsPending = getAccountsPending;
    exports.getPawAccountFromSeed = getPawAccountFromSeed;
    exports.getNanoAccountFromSeed = getNanoAccountFromSeed;
    exports.getAccountInfo = getAccountInfo;
    exports.getBlockCount = getBlockCount;

    exports.pawUtil = pawUtil;
    exports.pawnodeApi = pawnodeApi;
    exports.camoUtil = camoUtil;
    exports.depositUtil = depositUtil;
    exports.withdrawUtil = withdrawUtil;
    exports.loggingUtil = loggingUtil;
    exports.realPawnodeApi = realPawnodeApi;

    exports.setPawnodeApi = setPawnodeApi;
    exports.setAuth = setAuth;
    exports.getPawPartsFromDecimal = getPawPartsFromDecimal;
    exports.getPawPartsAsDecimal = getPawPartsAsDecimal;
    exports.getPawDecimalAmountAsRaw = getPawDecimalAmountAsRaw;
    exports.getPawPartsDescription = getPawPartsDescription;
    exports.getAccountHistory = getAccountHistory;
    exports.openPawAccountFromSeed = openPawAccountFromSeed;
    exports.openNanoAccountFromSeed = openNanoAccountFromSeed;
    exports.getBlockHash = getBlockHash;
    exports.getAccountBalanceRaw = getAccountBalanceRaw;
    exports.getAccountBalanceAndPendingRaw = getAccountBalanceAndPendingRaw;
    exports.getAccountsBalances = getAccountsBalances;
    exports.getPawPartsFromRaw = getPawPartsFromRaw;
    exports.getNanoPartsFromRaw = getNanoPartsFromRaw;
    exports.getPrivateKey = pawUtil.getPrivateKey;
    exports.getPublicKey = pawUtil.getPublicKey;
    exports.getAccount = pawUtil.getAccount;
    exports.getNanoAccount = getNanoAccount;
    exports.getPawAccount = getPawAccount;
    exports.getAccountPublicKey = pawUtil.getAccountPublicKey;
    exports.sendAmountToNanoAccount = sendAmountToNanoAccount;
    exports.sendAmountToPawAccount = sendAmountToPawAccount;
    exports.sendAmountToPawAccountWithRepresentativeAndPrevious =
      sendAmountToPawAccountWithRepresentativeAndPrevious;
    exports.sendAmountToNanoAccountWithRepresentativeAndPrevious =
      sendAmountToNanoAccountWithRepresentativeAndPrevious;
    exports.changePawRepresentativeForSeed =
      changePawRepresentativeForSeed;
    exports.changeNanoRepresentativeForSeed = changeNanoRepresentativeForSeed;
    exports.getSignature = getSignature;
    exports.signHash = signHash;
    exports.verify = verify;
    exports.getBytesFromHex = getBytesFromHex;
    exports.getHexFromBytes = getHexFromBytes;
    exports.getWorkUsingCpu = getWorkUsingCpu;
    exports.getZeroedWorkBytes = pawUtil.getZeroedWorkBytes;
    exports.isWorkValid = pawUtil.isWorkValid;
    exports.getNanoAccountValidationInfo =
      pawUtil.getNanoAccountValidationInfo;
    exports.getPawAccountValidationInfo =
      pawUtil.getPawAccountValidationInfo;
    exports.receivePawDepositsForSeed = receivePawDepositsForSeed;
    exports.receiveNanoDepositsForSeed = receiveNanoDepositsForSeed;
    exports.getRawStrFromPawStr = getRawStrFromPawStr;
    exports.getRawStrFromPanoshiStr = getRawStrFromPanoshiStr;
    exports.getRawStrFromNanoStr = getRawStrFromNanoStr;
    exports.getRawStrFromNanoshiStr = getRawStrFromNanoshiStr;
    exports.setPawnodeApiUrl = setPawnodeApiUrl;
    exports.getCamoPublicKey = camoUtil.getCamoPublicKey;
    exports.getSharedSecret = camoUtil.getSharedSecret;
    exports.camoPawReceive = camoPawReceive;
    exports.camoNanoReceive = camoNanoReceive;
    exports.camoPawSend = camoPawSend;
    exports.camoNanoSend = camoNanoSend;
    exports.camoPawSendWithdrawalFromSeed = camoPawSendWithdrawalFromSeed;
    exports.camoNanoSendWithdrawalFromSeed = camoNanoSendWithdrawalFromSeed;
    exports.getCamoAccount = camoUtil.getCamoAccount;
    exports.getCamoPawAccountBalanceRaw = getCamoPawAccountBalanceRaw;
    exports.getCamoNanoAccountBalanceRaw = getCamoNanoAccountBalanceRaw;
    exports.getCamoPawNextPrivateKeyForReceive =
      getCamoPawNextPrivateKeyForReceive;
    exports.getCamoNanoNextPrivateKeyForReceive =
      getCamoNanoNextPrivateKeyForReceive;
    exports.camoPawGetAccountsPending = camoPawGetAccountsPending;
    exports.camoNanoGetAccountsPending = camoNanoGetAccountsPending;
    exports.getCamoPawSharedAccountData = getCamoPawSharedAccountData;
    exports.getCamoNanoSharedAccountData = getCamoNanoSharedAccountData;
    exports.receiveCamoPawDepositsForSeed = receiveCamoPawDepositsForSeed;
    exports.receiveCamoNanoDepositsForSeed = receiveCamoNanoDepositsForSeed;
    exports.getCamoAccountValidationInfo = getCamoAccountValidationInfo;

    return exports;
  })();

  // istanbul ignore else
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    window.pawdigitalPawjs = exports;
  }
})();
// FINISHED BOTTOM nodejs/browser hack
