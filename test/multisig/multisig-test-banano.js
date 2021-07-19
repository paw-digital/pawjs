'use strict';

// libraries
const chai = require('chai');
const elliptic = require('elliptic');
const crypto = require('crypto');

// modules
const expect = chai.expect;
const ec = new elliptic.eddsa('ed25519');

const getRandomBytes32Base16 = () => {
  return crypto.randomBytes(32).toString('hex').toUpperCase();
};

const signAndVerify = async (a, aZ, b, bZ, msgHashHex) => {
  const msgHash = Buffer.from(msgHashHex, 'hex');
  function getPlayerData(secret, zValue) {
    // hex string, array or Buffer
  	const key = ec.keyFromSecret(secret);

  	return {
  		'secretKeyBytes': key.privBytes(),
  		'publicKeyBytes': key.pubBytes(),
  		'publicKeyPoint': ec.decodePoint(key.pubBytes()),
  		'messagePrefix': key.messagePrefix(),
  		'zValue': zValue,
  	};
  }

  function getSignatureComponentsForPlayer(playerData, message) {
  	const r = ec.hashInt(playerData.messagePrefix, message, playerData.zValue);
  	const R = ec.g.mul(r);
  	const Rencoded = ec.encodePoint(R);
  	const t = ec.hashInt(Rencoded);

  	return {
  		'rHash': r,
  		'RPoint': R,
  		'RPointCommitment': t,
  	};
  }

  function getAggregatedRPoint(RPoints) {
  	let aggregatedRPoint = null;

  	for (let i = 0; i < RPoints.length; i++) {
  		if (aggregatedRPoint === null) {
  			aggregatedRPoint = RPoints[i];
  		} else {
  			aggregatedRPoint = aggregatedRPoint.add(RPoints[i]); // point addition
  		}
  	}

  	return aggregatedRPoint;
  }

  function getAHashSignatureComponent(playerPublicKeyPoint, pubKeys) {
  	const hashArguments = [ec.encodePoint(playerPublicKeyPoint)];

  	for (let i = 0; i < pubKeys.length; i++) {
  		hashArguments.push(ec.encodePoint(pubKeys[i]));
  	}

  	return ec.hashInt.apply(ec, hashArguments);
  }

  function getAggregatedPublicKeyPoint(pubKeys) {
  	let aggregatedPublicKeyPoint = null;
  	let aHashComponent = null;
  	let aggregationComponentPoint = null;

  	for (let i = 0; i < pubKeys.length; i++) {
  		aHashComponent = getAHashSignatureComponent(pubKeys[i], pubKeys);
  		aggregationComponentPoint = pubKeys[i].mul(aHashComponent);

  		if (aggregatedPublicKeyPoint === null) {
  			aggregatedPublicKeyPoint = aggregationComponentPoint;
  		} else {
  			aggregatedPublicKeyPoint = aggregatedPublicKeyPoint.add(aggregationComponentPoint);
  		}
  	}

  	return aggregatedPublicKeyPoint; // need to convert to key?
  }

  function getKHash(aggregatedRPoint, aggregatedPublicKeyPoint, message) {
  	return ec.hashInt(ec.encodePoint(aggregatedRPoint), ec.encodePoint(aggregatedPublicKeyPoint), message);
  }

  function getSignatureContribution(aggregatedRPoint, pubKeys, message, playerData, signatureComponents) {
  	const aggregatedPublicKeyPoint = getAggregatedPublicKeyPoint(pubKeys);
  	const aHashSignatureComponent = getAHashSignatureComponent(playerData['publicKeyPoint'], pubKeys);
  	const kHash = getKHash(aggregatedRPoint, aggregatedPublicKeyPoint, message);

  	let signatureContribution = kHash.mul(ec.decodeInt(playerData['secretKeyBytes']));
  	signatureContribution = signatureContribution.mul(aHashSignatureComponent); // not absolutely certain about the order of operations here.
  	signatureContribution = signatureComponents['rHash'].add(signatureContribution); // bigint addition
  	signatureContribution = signatureContribution.umod(ec.curve.n); // appears to not be needed? Rust implementation doesn't seem to have it, even for single sig.

  	return signatureContribution;
  }

  function getAggregatedSignature(signatureContributions) {
  	let aggregatedSignature = null;

  	for (let i = 0; i < signatureContributions.length; i++) {
  		if (aggregatedSignature === null) {
  			aggregatedSignature = signatureContributions[i];
  		} else {
  			aggregatedSignature = aggregatedSignature.add(signatureContributions[i]); // bigint addition
  		}
  	}

  	return ec.makeSignature({R: aggregatedRPoint, S: aggregatedSignature, Rencoded: ec.encodePoint(aggregatedRPoint)});
  }

  const playerData1 = getPlayerData(a, aZ);
  const signatureComponents1 = getSignatureComponentsForPlayer(playerData1, msgHash);

  const playerData2 = getPlayerData(b, bZ);
  const signatureComponents2 = getSignatureComponentsForPlayer(playerData2, msgHash);

  // when the second player's data is uncommented, verification fails

  const pubKeys = [
  	playerData1.publicKeyPoint,
  	playerData2.publicKeyPoint,
  ];

  const RPoints = [
  	signatureComponents1.RPoint,
  	signatureComponents2.RPoint,
  ];

  const aggregatedRPoint = getAggregatedRPoint(RPoints);
  const signatureContribution1 = getSignatureContribution(aggregatedRPoint, pubKeys, msgHash, playerData1, signatureComponents1);
  const signatureContribution2 = getSignatureContribution(aggregatedRPoint, pubKeys, msgHash, playerData2, signatureComponents2);

  const signatureContributions = [
  	signatureContribution1,
  	signatureContribution2,
  ];

  const aggregatedSignature = getAggregatedSignature(signatureContributions, aggregatedRPoint);

  const aggregatedPublicKeyPoint = getAggregatedPublicKeyPoint(pubKeys);
  const aggPubKey = ec.keyFromPublic(aggregatedPublicKeyPoint);
  // console.log('Attempting to verify aggregated signature...');
  const verified = ec.verify(msgHash, aggregatedSignature, aggPubKey);
  // console.log('Verification Passed: ' + verified);
  expect(true).to.deep.equal(verified);
};

describe('multisig', () => {
  describe('banano', async () => {
    it('example', async () => {
      // const msgHash = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const msgHash = '000102030405060708090A';
      const a = '31760bf21992fed876573423a3a1d4bffc41d692bb4f65f44ae21778f7fb941d';
      const aZ = 'c9b67f7c8830b7c5a8d28acd9edee6d7082a02d1b2c8b11392296ea2965879b9';
      const b = '6364c231f6d9755adf4960d7ed628b4e5e7a23ba2e191ff72df590fdf42383b9';
      const bZ = '7b9b11bc0f882c436540c00ae3a7f5c18adf83fca2caa93454b17a6706552c00';
      await signAndVerify(a, aZ, b, bZ, msgHash);
    });
    it('random', async () => {
      const a = getRandomBytes32Base16();
      const aZ = getRandomBytes32Base16();
      const b = getRandomBytes32Base16();
      const bZ = getRandomBytes32Base16();
      const msgHash = getRandomBytes32Base16();
      await signAndVerify(a, aZ, b, bZ, msgHash);
    });
  });
});
