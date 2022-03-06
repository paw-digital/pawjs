'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const pawTest = require('./paw-test.json');

const testUtil = require('../util/test-util.js');
const Pawjs = testUtil.getPawjsWithMockApi();

const pawAccount = pawTest.pawAccount;
const nanoAccount = pawTest.nanoAccount;

describe('account-validation', () => {
  describe('paw', () => {
    it('getPawAccountValidationInfo valid account matches expected', () => {
      const validationInfo =
        Pawjs.getPawAccountValidationInfo(pawAccount);
      expect(validationInfo).to.deep.equal({
        valid: true,
        message: 'valid',
      });
    });
    it('getPawAccountValidationInfo null account matches expected', () => {
      const validationInfo = Pawjs.getPawAccountValidationInfo(null);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid PAW Account (null)',
      });
    });
    it('getPawAccountValidationInfo undefined account matches expected', () => {
      const validationInfo = Pawjs.getPawAccountValidationInfo(undefined);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid PAW Account (undefined)',
      });
    });
    it('getPawAccountValidationInfo too short account matches expected', () => {
      const badAccount = 'paw_1bad1not64chars';
      const validationInfo =
        Pawjs.getPawAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid PAW Account (not 64 characters)',
      });
    });
    it('getPawAccountValidationInfo malformed prefix account matches expected', () => {
      const badAccount =
        'paw_4bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
      const validationInfo =
        Pawjs.getPawAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid PAW Account (does not start with paw_1 or paw_3)',
      });
    });
    it('getPawAccountValidationInfo incorrect alphabet account matches expected', () => {
      const badAccount =
        'paw_1BAD1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
      const validationInfo =
        Pawjs.getPawAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message:
          'Invalid PAW account (characters after paw_ must be one of:13456789abcdefghijkmnopqrstuwxyz)',
      });
    });
    it('getPawAccountValidationInfo checksum alphabet account matches expected', () => {
      const badAccount =
        'paw_1111111111111111111111111111111111111111111111111111hifc8npq';
      const validationInfo =
        Pawjs.getPawAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message:
          'Invalid PAW account (Incorrect checksum hifc8npq <> hifc8npp)',
      });
    });
  });
  describe('nano', () => {
    it('getNanoAccountValidationInfo valid account matches expected', () => {
      const validationInfo = Pawjs.getNanoAccountValidationInfo(nanoAccount);
      expect(validationInfo).to.deep.equal({
        valid: true,
        message: 'valid',
      });
    });
    it('getNanoAccountValidationInfo null account matches expected', () => {
      const validationInfo = Pawjs.getNanoAccountValidationInfo(null);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO Account (null)',
      });
    });
    it('getNanoAccountValidationInfo undefined account matches expected', () => {
      const validationInfo = Pawjs.getNanoAccountValidationInfo(undefined);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO Account (undefined)',
      });
    });
    it('getNanoAccountValidationInfo too short account matches expected', () => {
      const badAccount = 'nano_1bad1not65chars';
      const validationInfo = Pawjs.getNanoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO Account (not 65 characters)',
      });
    });
    it('getNanoAccountValidationInfo malformed prefix account matches expected', () => {
      const badAccount =
        'nano_4bad1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
      const validationInfo = Pawjs.getNanoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message: 'Invalid NANO Account (does not start with nano_1 or nano_3)',
      });
    });
    it('getNanoAccountValidationInfo incorrect alphabet account matches expected', () => {
      const badAccount =
        'nano_1BAD1ppzmj146pdxgbmph3wmeg15t8zk1yfwbozysoxtti3xqa15qufta5tq';
      const validationInfo = Pawjs.getNanoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message:
          'Invalid NANO account (characters after nano_ must be one of:13456789abcdefghijkmnopqrstuwxyz)',
      });
    });
    it('getNanoAccountValidationInfo checksum alphabet account matches expected', () => {
      const badAccount =
        'nano_1111111111111111111111111111111111111111111111111111hifc8npq';
      const validationInfo = Pawjs.getNanoAccountValidationInfo(badAccount);
      expect(validationInfo).to.deep.equal({
        valid: false,
        message:
          'Invalid NANO account (Incorrect checksum hifc8npq <> hifc8npp)',
      });
    });
  });

  beforeEach(async () => {});

  afterEach(async () => {
    testUtil.deactivate();
  });
});
