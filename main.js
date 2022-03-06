'use strict';

const index = require('./index.js');
const pawUtil = require('./app/scripts/paw-util.js');
const pawnodeApi = require('./app/scripts/pawnode-api.js');
const camoUtil = require('./app/scripts/camo-util.js');
const loggingUtil = require('./app/scripts/logging-util.js');
const depositUtil = require('./app/scripts/deposit-util.js');
const crypto = require('crypto');
const fs = require('fs');

const configs = {};
configs.paw = {};
configs.paw.prefix = index.PAW_PREFIX;
configs.paw.pawnodeUrl = 'https://rpc.paw.digital';
configs.nano = {};
configs.nano.prefix = index.NANO_PREFIX;
configs.nano.bananodeUrl = 'https://app.natrium.io/api';

const commands = {};

commands['cbgetaccount'] = async (seed) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const privateKey = pawUtil.getPrivateKey(seed, 0);
  const publicKey = await pawUtil.getPublicKey(privateKey);
  const camoPublicKey = camoUtil.getCamoPublicKey(privateKey);
  const camoAccount = pawUtil.getAccount(camoPublicKey, config.prefix);
  console.log('camo paw getaccount public key', publicKey);
  console.log('camo paw getaccount camo public key', camoPublicKey);
  console.log('camo paw getaccount camo account', camoAccount);
};

commands['cbcheckpending'] = async (seed) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const privateKey = pawUtil.getPrivateKey(seed, 0);
  const publicKey = await pawUtil.getPublicKey(privateKey);
  const account = pawUtil.getAccount(publicKey);
  const accountsPending = await pawnodeApi.getAccountsPending([account], -1);
  const blocks = Object.keys(accountsPending.blocks[account]);
  console.log('camo paw checkpending account', account);
  console.log(
    'camo paw checkpending ',
    blocks.length,
    'pending blocks',
    blocks
  );
};

commands['cbregister'] = async (seed) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const privateKey = pawUtil.getPrivateKey(seed, 0);
  const publicKey = await pawUtil.getPublicKey(privateKey);
  const account = pawUtil.getAccount(publicKey);
  const camoPublicKey = camoUtil.getCamoPublicKey(privateKey);
  const camoAccount = pawUtil.getAccount(camoPublicKey);
  const pendingResponse = await camoUtil.receiveSeed(
    pawnodeApi,
    seed,
    config.prefix
  );
  console.log('camo paw register pendingResponse', pendingResponse);
  console.log('camo paw register pawAccount', account);
  console.log('camo paw register camoAccount', camoAccount);
  const response = await pawUtil.sendFromPrivateKeyWithRepresentative(
    pawnodeApi,
    privateKey,
    account,
    1,
    camoAccount,
    config.prefix
  );
  console.log('camo paw register account response', response);
};

commands['cbcheckaccount'] = async (account) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const representative = await pawnodeApi.getAccountRepresentative(account);
  console.log('camo paw checkaccount representative', representative);
};

commands['cbcheckseed'] = async (seed) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const privateKey = pawUtil.getPrivateKey(seed, 0);
  const publicKey = await pawUtil.getPublicKey(privateKey);
  const account = pawUtil.getAccount(publicKey);
  console.log('checkseed pawAccount', account);
  const representative = await pawnodeApi.getAccountRepresentative(account);
  console.log('checkseed camoAccount', representative);
};

commands['cbsendraw'] = async (
  fundingPrivateKey,
  seed,
  toAccount,
  amountRaw
) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const privateKey = pawUtil.getPrivateKey(seed, 0);
  const toPublicKey = pawUtil.getAccountPublicKey(toAccount);
  const hashes = await camoUtil.send(
    pawnodeApi,
    fundingPrivateKey,
    privateKey,
    toPublicKey,
    amountRaw
  );
  console.log('camo paw sendraw response', hashes);
};

commands['cbreceive'] = async (seed, fromPawAccount) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const toPrivateKey = pawUtil.getPrivateKey(seed, 0);
  const fromPublicKey = pawUtil.getAccountPublicKey(fromPawAccount);
  const hashes = await camoUtil.receive(
    pawnodeApi,
    toPrivateKey,
    fromPublicKey
  );
  console.log('camo paw receive response', hashes);
};

commands['nsendraw'] = async (privateKey, destAccount, amountRaw) => {
  const config = configs.nano;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const response = await pawUtil.sendFromPrivateKey(
    pawnodeApi,
    privateKey,
    destAccount,
    amountRaw,
    config.prefix
  );
  console.log('nano sendnano response', response);
};

commands['ncheckpending'] = async (account, maxAccountsPending) => {
  const config = configs.nano;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const pending = await pawnodeApi.getAccountsPending(
    [account],
    parseInt(maxAccountsPending)
  );
  console.log('nano checkpending response', pending);
};

commands['ngetaccount'] = async (privateKey) => {
  const config = configs.nano;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const publicKey = await pawUtil.getPublicKey(privateKey);
  console.log('nano getaccount publicKey', publicKey);
  const account = pawUtil.getAccount(publicKey, config.prefix);
  console.log('nano getaccount account', account);
};

commands['ngetprivatekey'] = async (seed, seedIx) => {
  const config = configs.nano;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const privateKey = pawUtil.getPrivateKey(seed, seedIx);
  console.log('nano getprivatekey privateKey', privateKey);
};

commands['nreceive'] = async (privateKey, specificPendingBlockHash) => {
  const config = configs.nano;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const publicKey = await pawUtil.getPublicKey(privateKey);
  const account = pawUtil.getAccount(publicKey, config.prefix);
  let representative = await pawnodeApi.getAccountRepresentative(account);
  if (!representative) {
    representative = account;
  }
  const response = await depositUtil.receive(
    loggingUtil,
    pawnodeApi,
    account,
    privateKey,
    representative,
    specificPendingBlockHash,
    config.prefix
  );
  console.log('nano receive response', response);
};

commands['naccountinfo'] = async (account) => {
  const config = configs.nano;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const response = await pawnodeApi.getAccountInfo(account, true);
  response.balanceParts = await pawUtil.getAmountPartsFromRaw(
    response.balance,
    config.prefix
  );
  console.log('nano accountinfo response', response);
};

commands['bsendraw'] = async (privateKey, destAccount, amountRaw) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  try {
    const response = await pawUtil.sendFromPrivateKey(
      pawnodeApi,
      privateKey,
      destAccount,
      amountRaw,
      config.prefix
    );
    console.log('paw sendpaw response', response);
  } catch (error) {
    console.log('paw sendpaw error', error.message);
  }
};

commands['bsendjson'] = async (privateKey, file) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  try {
    const jsonStr = fs.readFileSync(file, 'UTF-8');
    const json = JSON.parse(jsonStr);
    const responses = [];
    const publicKey = await pawUtil.getPublicKey(privateKey);
    const account = pawUtil.getAccount(publicKey, config.prefix);
    console.log('paw sendjson account', account);

    const pending = await pawnodeApi.getAccountsPending(
      [account],
      parseInt(1)
    );
    console.log('paw sendjson pending', pending);
    if (pending.blocks) {
      if (pending.blocks[account]) {
        const pendingBlockhashes = [...Object.keys(pending.blocks[account])];
        const specificPendingBlockHash = pendingBlockhashes[0];
        console.log(
          'paw sendjson aborting, found pending block ',
          specificPendingBlockHash
        );
        let representative = await pawnodeApi.getAccountRepresentative(
          account
        );
        if (!representative) {
          representative = account;
        }
        const response = await depositUtil.receive(
          loggingUtil,
          pawnodeApi,
          account,
          privateKey,
          representative,
          specificPendingBlockHash,
          config.prefix
        );
        console.log('paw sendjson aborted, found pending blocks', response);
        return;
      }
    }

    for (let ix = 0; ix < json.accounts.length; ix++) {
      const elt = json.accounts[ix];
      let destAccount = elt.account;
      if (destAccount.startsWith('nano_')) {
        destAccount = 'paw_' + destAccount.substring(5);
      }
      let amountRaw;
      if (elt.amount !== undefined) {
        amountRaw = await index.getPawDecimalAmountAsRaw(elt.amount);
      }
      if (elt.balance !== undefined) {
        amountRaw = await index.getPawDecimalAmountAsRaw(elt.balance);
      }
      console.log('paw sendjson', destAccount, amountRaw);

      const response = await pawUtil.sendFromPrivateKey(
        pawnodeApi,
        privateKey,
        destAccount,
        amountRaw,
        config.prefix
      );
      responses.push(response);
    }
    console.log('paw sendjson responses', responses);
  } catch (error) {
    console.trace(error);
    console.log('paw sendjson error', error.message);
  }
};

commands['bcheckpending'] = async (account, maxAccountsPending) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const pending = await pawnodeApi.getAccountsPending(
    [account],
    parseInt(maxAccountsPending)
  );
  console.log('paw checkpending response', pending);
};

commands['bgetaccount'] = async (privateKey) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const publicKey = await pawUtil.getPublicKey(privateKey);
  console.log('paw getaccount publicKey', publicKey);
  const account = pawUtil.getAccount(publicKey, index.PAW_PREFIX);
  console.log('paw getaccount account', account);
};

commands['bgetprivatekey'] = async (seed, seedIx) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const privateKey = pawUtil.getPrivateKey(seed, seedIx);
  console.log('paw getprivatekey privateKey', privateKey);
};

commands['breceive'] = async (privateKey, specificPendingBlockHash) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const publicKey = await pawUtil.getPublicKey(privateKey);
  const account = pawUtil.getAccount(publicKey, index.PAW_PREFIX);
  let representative = await pawnodeApi.getAccountRepresentative(account);
  if (!representative) {
    representative = account;
  }
  const response = await depositUtil.receive(
    loggingUtil,
    pawnodeApi,
    account,
    privateKey,
    representative,
    specificPendingBlockHash,
    config.prefix
  );
  console.log('paw receive response', response);
};

commands['baccountinfo'] = async (account) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  console.log('paw accountinfo account', account);
  try {
    pawUtil.getAccountPublicKey(account);
  } catch (error) {
    console.log('paw accountinfo error', error);
    return;
  }
  const response = await pawnodeApi.getAccountInfo(account, true);
  if (response.error !== undefined) {
    console.log('paw accountinfo response', response);
    return;
  }

  response.balanceParts = await pawUtil.getAmountPartsFromRaw(
    response.balance,
    config.prefix
  );
  response.balanceDescription = await index.getPawPartsDescription(
    response.balanceParts
  );
  response.balanceDecimal = await index.getPawPartsAsDecimal(
    response.balanceParts
  );
  console.log('paw accountinfo response', response);
};

commands['bamountraw'] = async (amount) => {
  const response = index.getPawDecimalAmountAsRaw(amount);
  console.log('bamountraw response', response);
};

commands['getseed'] = async () => {
  const response = crypto.randomBytes(32).toString('hex').toUpperCase();
  console.log('getseed response', response);
};

commands['reprocess'] = async (subtype, hash) => {
  const config = configs.paw;
  pawnodeApi.setUrl(config.pawnodeUrl);
  const blocks = await pawnodeApi.getBlocks([hash], true);
  const block = blocks.blocks[hash];
  console.log('reprocess block', block);
  const response = await pawnodeApi.process(block, subtype);
  console.log('reprocess response', response);
};

const run = async () => {
  console.log('pawjs');
  if (process.argv.length < 3) {
    console.log('#usage:');
    console.log(
      'https://github.com/paw-digital/pawjs/blob/master/docs/camo-cli.md'
    );
    console.log(
      'https://github.com/paw-digital/pawjs/blob/master/docs/paw-cli.md'
    );
    console.log(
      'https://github.com/paw-digital/pawjs/blob/master/docs/nano-cli.md'
    );
  } else {
    const command = process.argv[2];
    const arg0 = process.argv[3];
    const arg1 = process.argv[4];
    const arg2 = process.argv[5];
    const arg3 = process.argv[6];

    const fn = commands[command];
    if (fn == undefined) {
      console.log('unknown command', command);
    } else {
      await fn(arg0, arg1, arg2, arg3);
    }
  }
};

run();
