const url = 'https://rpc.paw.digital';
const maxHistory = 2;
const maxPending = 2;

const getNewSeed = async (ix) => {
  const seedBytes = new Uint8Array(32);
  window.crypto.getRandomValues(seedBytes);
  const seed = window.pawdigitalPawjs.pawUtil.bytesToHex(seedBytes);
  document.getElementById('seed' + ix).value = seed;
  getAccountHistoryAndPending(ix);
  return false;
};

const getAccountHistoryAndPending = async (ix) => {
  const seed = document.getElementById('seed' + ix).value;
  const privateKey = await window.pawdigitalPawjs.getPrivateKey(seed, 0);
  const publicKey = await window.pawdigitalPawjs.getPublicKey(privateKey);
  const account = window.pawdigitalPawjs.getBananoAccount(publicKey);
  const accountElt = document.getElementById('account' + ix);
  if (accountElt.innerText != account) {
    accountElt.innerText = account;
  }
  getCamoRepresentative(ix, seed);
  getAccountInfo(ix, account).then(async () => {
    changeRepresentativeToCamo(ix, seed).then(async () => {
      setSharedSeed();
    });
  });
  getAccountHistory(ix, account);
  getAccountsPending(ix, account);
  getBananoAccountDeposits(ix);
};

const getAccountInfo = async (ix, account) => {
  window.pawdigitalPawjs.setBananodeApiUrl(url);
  const accountInfo = await window.pawdigitalPawjs.getAccountInfo(
    account,
    true
  );
  document.getElementById('accountInfo' + ix).innerText =
    JSON.stringify(accountInfo);
  if (accountInfo.error) {
    setTimeout(async () => {
      getAccountInfo(ix, account);
    }, 1000);
  }
};

const getAccountHistory = async (ix, account) => {
  window.pawdigitalPawjs.setPawnodeApiUrl(url);
  const history = await window.pawdigitalPawjs.getAccountHistory(
    account,
    maxHistory
  );
  document.getElementById('history' + ix).innerText = JSON.stringify(history);
  if (history.error) {
    setTimeout(async () => {
      getAccountHistory(ix, account);
    }, 1000);
  }
};

const getAccountsPending = async (ix, account) => {
  window.pawdigitalPawjs.setPawnodeApiUrl(url);
  const pending = await window.pawdigitalPawjs.getAccountsPending(
    [account],
    maxPending,
    true
  );
  document.getElementById('pending' + ix).innerText = JSON.stringify(pending);
  if (pending.error) {
    setTimeout(async () => {
      getAccountsPending(ix, account);
    }, 1000);
  }
};

const getCamoRepresentative = (ix, seed) => {
  const privateKey = window.pawdigitalPawjs.getPrivateKey(seed, 0);
  const camoPublicKey = window.pawdigitalPawjs.getCamoPublicKey(privateKey);
  const camoRepresentative =
    window.pawdigitalPawjs.getCamoAccount(camoPublicKey);
  document.getElementById('camoRepresentative' + ix).innerText =
    camoRepresentative;
};

const getPawAccountDeposits = async (ix) => {
  const seed = document.getElementById('seed' + ix).value;
  const privateKey = window.pawdigitalPawjs.getPrivateKey(seed, 0);
  const publicKey = window.pawdigitalPawjs.getPublicKey(privateKey);
  const account = window.pawdigitalPawjs.getPawAccount(publicKey);
  const response = await window.pawdigitalPawjs.receivePawDepositsForSeed(
    seed,
    0,
    account
  );
  document.getElementById('accountDeposits' + ix).innerText =
    JSON.stringify(response);
  if (response.error) {
    setTimeout(async () => {
      getPawAccountDeposits(ix);
    }, 1000);
  }
};

const changeRepresentativeToCamo = async (ix, seed) => {
  const accountInfoStr = document.getElementById('accountInfo' + ix).innerText;
  console.log('STARTED changeRepresentativeToCamo', ix);
  const accountInfo = JSON.parse(accountInfoStr);
  const privateKey = window.pawdigitalPawjs.getPrivateKey(seed, 0);
  const camoPublicKey = window.pawdigitalPawjs.getCamoPublicKey(privateKey);
  const representative =
    window.pawdigitalPawjs.getPawAccount(camoPublicKey);
  if (accountInfo.representative) {
    if (accountInfo.representative != representative) {
      console.log(
        `INTERIM changeRepresentativeToCamo need to change rep from ${accountInfo.representative} to ${representative}`
      );
      const response =
        await window.pawdigitalPawjs.changePawRepresentativeForSeed(
          seed,
          0,
          representative
        );
      console.log(
        'SUCCESS changeRepresentativeToCamo response',
        JSON.stringify(response)
      );
      if (response.error) {
        console.log(
          'FAILURE RETRY changeRepresentativeToCamo response',
          JSON.stringify(response)
        );
        setTimeout(async () => {
          changeRepresentativeToCamo(ix, seed);
        }, 1000);
      } else {
        console.log(
          'SUCCESS changeRepresentativeToCamo response',
          JSON.stringify(response)
        );
      }
    } else {
      console.log('SKIPPED changeRepresentativeToCamo', ix, 'set correctly.');
    }
  } else {
    console.log(
      'SKIPPED changeRepresentativeToCamo',
      ix,
      'account not opened yet.'
    );
  }
};

const getPawAsCamo = (pawAccount) => {
  if (pawAccount) {
    // console.log('STARTED getPawAsCamo', pawAccount);
    const publicKey = window.pawdigitalPawjs.getAccountPublicKey(pawAccount);
    const camoAccount = window.pawdigitalPawjs.getCamoAccount(publicKey);
    // console.log('SUCCESS getPawAsCamo', pawAccount, camoAccount);
    return camoAccount;
  }
};

const setSharedSeed = async () => {
  const seed1 = document.getElementById('seed1').value;
  if (seed1.length == 0) {
    return;
  }
  const seed2 = document.getElementById('seed2').value;
  if (seed2.length == 0) {
    return;
  }
  const accountInfo1Str = document.getElementById('accountInfo1').innerText;
  if (accountInfo1Str.length == 0) {
    return;
  }
  const accountInfo2Str = document.getElementById('accountInfo2').innerText;
  if (accountInfo2Str.length == 0) {
    return;
  }
  const accountInfo1 = JSON.parse(accountInfo1Str);
  const accountInfo2 = JSON.parse(accountInfo2Str);

  const camoRepresentative1 = document.getElementById(
    'camoRepresentative1'
  ).innerText;
  const camoRepresentative2 = document.getElementById(
    'camoRepresentative2'
  ).innerText;

  const accountInfoRepresentativeAsCamo1 = getPawAsCamo(
    accountInfo1.representative
  );
  const accountInfoRepresentativeAsCamo2 = getPawAsCamo(
    accountInfo2.representative
  );

  if (camoRepresentative1 != accountInfoRepresentativeAsCamo1) {
    console.log(
      'SKIPPED setSharedSeed, account1 rep not set.',
      camoRepresentative1,
      accountInfoRepresentativeAsCamo1
    );
    return;
  }
  if (camoRepresentative2 != accountInfoRepresentativeAsCamo2) {
    console.log(
      'SKIPPED setSharedSeed, account2 rep not set.',
      camoRepresentative2,
      accountInfoRepresentativeAsCamo2
    );
    return;
  }

  const account1 = document.getElementById('account1').innerText;
  if (account1.length == 0) {
    return;
  }
  const account2 = document.getElementById('account2').innerText;
  if (account2.length == 0) {
    return;
  }
  const account1AsCamo = getPawAsCamo(account1);
  const account2AsCamo = getPawAsCamo(account2);

  const sharedData12 =
    await window.pawdigitalPawjs.getCamoPawSharedAccountData(
      seed1,
      0,
      account2AsCamo,
      0
    );
  const sharedData21 =
    await window.pawdigitalPawjs.getCamoPawSharedAccountData(
      seed2,
      0,
      account1AsCamo,
      0
    );

  if (sharedData12.sharedSeed == sharedData21.sharedSeed) {
    const seed3Elt = document.getElementById('seed3');
    if (seed3Elt.value != sharedData12.sharedSeed) {
      document.getElementById('seed3').value = sharedData12.sharedSeed;
      getAccountHistoryAndPending(3);
    }
  } else {
    console.log(
      'SKIPPED setSharedSeed, derivations do not match',
      sharedData12,
      sharedData21
    );
  }
};

const onLoad = () => {
  loadSeeds();
  getAccountHistoryAndPending(1);
  getAccountHistoryAndPending(2);
};
