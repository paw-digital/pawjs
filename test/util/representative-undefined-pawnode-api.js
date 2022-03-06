'use strict';

const pawnodeApi = require('./mock-pawnode-api.js');

const pawjs = require('../../index.js');

const getAccountRepresentative = (account) => {
  return undefined;
};

exports.getAccountBalanceRaw = pawnodeApi.getAccountBalanceRaw;
exports.getAccountRepresentative = getAccountRepresentative;
exports.getPrevious = pawnodeApi.getPrevious;
exports.process = pawnodeApi.process;
exports.getGeneratedWork = pawnodeApi.getGeneratedWork;
exports.getAccountInfo = pawnodeApi.getAccountInfo;
exports.getAccountsPending = pawnodeApi.getAccountsPending;
exports.getAccountHistory = pawnodeApi.getAccountHistory;
exports.getFrontiers = pawnodeApi.getFrontiers;
