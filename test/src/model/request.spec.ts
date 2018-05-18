import { describe, it } from 'mocha';
import assert from 'assert';
import { extract } from '../../../src/model/request';

describe('model - request', function() {
  describe('extract', function() {
    it('should return currect object', function() {
      const result = extract({ headers: {}, payload: "{}", params: {} });
      //onsole.dir(result, { colors: true });
      assert(result.userid === 'composer');
      assert(result.jsonData);
    });
  });
  
  describe('extract (specified userId)', function() {
    it('should return currect object', function() {
      const result = extract({ headers: { userid: 'userA'}, payload: "{}", params: {} });
      //console.dir(result, { colors: true });
      assert(result.userid === 'userA');
      assert(result.jsonData);
    });
  });

  describe('extract (no payload)', function() {
    it('should return currect object', function() {
      const result = extract({ headers: { userid: 'userA'}, params: {} });
      //console.dir(result, { colors: true });
      assert(!(result.jsonData));
    });
  });
});