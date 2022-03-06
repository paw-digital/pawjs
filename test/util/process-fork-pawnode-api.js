'use strict';

const pawnodeApi = require('./mock-pawnode-api.js');

const pawjs = require('../../index.js');

const process = async (block, subtype) => {
  if (block == undefined) {
    throw Error(`'block' is a required parameter.'`);
  }
  if (subtype == undefined) {
    throw Error(`'subtype' is a required parameter.'`);
  }
  const hash = pawjs.getBlockHash(block);
  return new Promise((resolve, reject) => {
    const json = {};
    json.error = 'Fork';
    reject(Error(JSON.stringify(json)));
  });
};

exports.getAccountBalanceRaw = pawnodeApi.getAccountBalanceRaw;
exports.getAccountRepresentative = pawnodeApi.getAccountRepresentative;
exports.getPrevious = pawnodeApi.getPrevious;
exports.process = process;
exports.getGeneratedWork = pawnodeApi.getGeneratedWork;
exports.getAccountInfo = pawnodeApi.getAccountInfo;
exports.getAccountsPending = pawnodeApi.getAccountsPending;
exports.getAccountHistory = pawnodeApi.getAccountHistory;
exports.getFrontiers = pawnodeApi.getFrontiers;
