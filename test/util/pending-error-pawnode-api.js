'use strict';

const pawnodeApi = require('./mock-pawnode-api.js');

const pawjs = require('../../index.js');

const getAccountsPending = async (accounts, count) => {
  return undefined;
};

exports.getAccountBalanceRaw = pawnodeApi.getAccountBalanceRaw;
exports.getAccountRepresentative = pawnodeApi.getAccountRepresentative;
exports.getPrevious = pawnodeApi.getPrevious;
exports.process = pawnodeApi.getPrevious;
exports.getGeneratedWork = pawnodeApi.getGeneratedWork;
exports.getAccountInfo = pawnodeApi.getAccountInfo;
exports.getAccountsPending = getAccountsPending;
exports.getAccountHistory = pawnodeApi.getAccountHistory;
exports.getFrontiers = pawnodeApi.getFrontiers;
