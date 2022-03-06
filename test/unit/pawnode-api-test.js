'use strict';

// libraries

// modules

const testUtil = require('../util/test-util.js');

const getFakeHttps = (retval) => {
  const fakeHttps = {};
  fakeHttps.request = (options, response) => {
    const fakeReq = {};
    const onFns = {};
    fakeReq.on = (fnName, fn) => {
      onFns[fnName] = fn;
    };
    fakeReq.write = (body) => {
      const fn = onFns['data'];
      fn(retval);
    };
    fakeReq.end = () => {
      // console.log('onFns', onFns);
      const fn = onFns['end'];
      fn();
    };
    response(fakeReq);
    return fakeReq;
  };
  return fakeHttps;
};

const getErrorHttps = (retval) => {
  const errorHttps = {};
  errorHttps.request = (options, response) => {
    const fakeReq = {};
    const onFns = {};
    fakeReq.on = (fnName, fn) => {
      onFns[fnName] = fn;
    };
    fakeReq.write = (body) => {
      const fn = onFns['error'];
      try {
        fn(retval);
      } catch (error) {
        if (error.message == '{}') {
          return;
        }
        // console.trace(error);
      }
    };
    fakeReq.end = () => {
      // console.log('onFns', onFns);
      const fn = onFns['end'];
      fn();
    };
    response(fakeReq);
    return fakeReq;
  };
  return errorHttps;
};

const getFakePawnodeApi = (retval) => {
  const pawjs = testUtil.getPawjsWithRealApi();
  pawjs.realPawnodeApi.setUrl('https://localhost');
  pawjs.realPawnodeApi.setUrl('http://localhost');
  pawjs.realPawnodeApi.setModuleRef(getFakeHttps(retval));
  pawjs.realPawnodeApi.setLogRequestErrors(true);
  return pawjs.realPawnodeApi;
};

const getErrorPawnodeApi = (retval) => {
  const pawjs = testUtil.getPawjsWithRealApi();
  pawjs.realPawnodeApi.setUrl('http://localhost');
  pawjs.realPawnodeApi.setModuleRef(getErrorHttps(retval));
  pawjs.realPawnodeApi.setLogRequestErrors(false);
  return pawjs.realPawnodeApi;
};

const callFake = async (retval, fn, arg1, arg2, arg3, arg4) => {
  if (retval === undefined) {
    retval = '{}';
  }
  const api = getFakePawnodeApi(retval);
  // console.log('started api call', fn, arg1, arg2);
  try {
    const retval = await api[fn](arg1, arg2, arg3, arg4);
    // console.log('success api call', fn, arg1, arg2);
    return retval;
  } catch (error) {
    console.trace(error);
  }
};

const callRequestError = async (retval, fn, arg1, arg2, arg3, arg4) => {
  if (retval === undefined) {
    retval = '{}';
  }
  const api = getErrorPawnodeApi(retval);
  // console.log('started api call', fn, arg1, arg2);
  try {
    const retval = await api[fn](arg1, arg2, arg3, arg4);
    // console.log('success api call', fn, arg1, arg2);
    return retval;
  } catch (error) {
    if (error.message == '{}') {
      return;
    }
    if (error.message == retval) {
      return;
    }
    console.trace('callRequestError', error.message);
  }
};

const callResponseError = async (retval, fn, arg1, arg2, arg3, arg4) => {
  if (retval === undefined) {
    retval = '<html/>';
  }
  const api = getFakePawnodeApi(retval);
  // console.log('started api call', fn, arg1, arg2);
  try {
    const retval = await api[fn](arg1, arg2, arg3, arg4);
    // console.log('success api call', fn, arg1, arg2);
    return retval;
  } catch (error) {
    if (error.message == 'Unexpected token < in JSON at position 0') {
      return;
    }
    if (error.message == '{}') {
      return;
    }
    if (error.message == 'fake error') {
      return;
    }
    if (error.message == '{"fake":"error"}') {
      return;
    }
    console.trace(error);
  }
  throw Error(`expected '${retval}' to throw error, but it didn't`);
};

const call = async (retval, fn, arg1, arg2, arg3, arg4) => {
  await callFake(retval.fake, fn, arg1, arg2, arg3, arg4);
  await callRequestError(retval.fake, fn, arg1, arg2, arg3, arg4);
  await callResponseError(retval.error, fn, arg1, arg2, arg3, arg4);
};

describe('pawnode-api', () => {
  it('setUrl', async () => {
    await call({}, 'setUrl', '');
  });
  it('setUrl', async () => {
    await call({}, 'setUrl', undefined);
  });
  describe('setAuth', () => {
    it('setAuth blank', async () => {
      await call({}, 'setAuth', '');
    });
    it('setAuth fake', async () => {
      await call({}, 'setAuth', 'fakeAuth');
    });
  });
  it('getBlockCount', async () => {
    await call({}, 'getBlockCount');
  });
  it('getFrontiers', async () => {
    await call({}, 'getFrontiers', '', -1);
  });
  it('getBlockAccount', async () => {
    await call({}, 'getBlockAccount', '');
  });
  describe('getAccountsPending', () => {
    it('getAccountsPending', async () => {
      await call({}, 'getAccountsPending', '', -1, '');
    });
    it('getAccountsPending', async () => {
      await call({}, 'getAccountsPending', '', -1, true);
    });
    it('getAccountsPending', async () => {
      await call({}, 'getAccountsPending', '', -1);
    });
  });
  it('getGeneratedWork', async () => {
    await call({}, 'getGeneratedWork', '');
  });
  describe('process', () => {
    const fakeReq = '{"hash":"fake hash"}';
    it('process', async () => {
      await call({ fake: fakeReq }, 'process', '', '');
    });
    it('process', async () => {
      await call(
        { fake: fakeReq, error: '{"error":"fake error"}' },
        'process',
        '',
        ''
      );
    });
    it('process', async () => {
      await call(
        { fake: fakeReq, error: '{"fake":"error"}' },
        'process',
        '',
        ''
      );
    });
    it('process', async () => {
      await call({ fake: fakeReq }, 'process', { work: true }, '');
    });
  });
  describe('getBlocks', () => {
    it('getBlocks', async () => {
      await call({}, 'getBlocks', '', '');
    });
    it('getBlocks', async () => {
      await call({}, 'getBlocks', '');
    });
  });
  describe('getAccountInfo', () => {
    it('getAccountInfo', async () => {
      await call({}, 'getAccountInfo', '');
    });
    it('getAccountInfo', async () => {
      await call({}, 'getAccountInfo', '', '');
    });
    it('getAccountInfo', async () => {
      await call({}, 'getAccountInfo', '', true);
    });
  });
  describe('getAccountHistory', () => {
    it('getAccountHistory', async () => {
      await call({}, 'getAccountHistory', '', -1, '', true);
    });
    it('getAccountHistory', async () => {
      await call({}, 'getAccountHistory', '', -1);
    });
  });

  describe('getPrevious', () => {
    it('getPrevious', async () => {
      await call({}, 'getPrevious', '');
    });
    it('getPrevious', async () => {
      await call({ fake: '{"frontiers":""}' }, 'getPrevious', '');
    });
    it('getPrevious', async () => {
      await call({ fake: '{"frontiers":{"":""}}' }, 'getPrevious', '');
    });
  });
  it('getAccountRepresentative', async () => {
    await call({}, 'getAccountRepresentative', '');
  });
  describe('getAccountBalanceRaw', () => {
    it('getAccountBalanceRaw', async () => {
      await call({}, 'getAccountBalanceRaw', '');
    });
    it('getAccountBalanceRaw', async () => {
      const fakeResp = {};
      fakeResp.balances = {};
      fakeResp.balances[''] = '';
      await call(
        { fake: JSON.stringify(fakeResp) },
        'getAccountBalanceRaw',
        ''
      );
    });
  });
  describe('getAccountsBalances', () => {
    it('getAccountsBalances', async () => {
      await call({}, 'getAccountsBalances', ['']);
    });
    it('getAccountsBalances', async () => {
      const fakeResp = {};
      fakeResp.balances = {};
      fakeResp.balances[''] = '';
      await call({ fake: JSON.stringify(fakeResp) }, 'getAccountsBalances', [
        '',
      ]);
    });
  });
  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
