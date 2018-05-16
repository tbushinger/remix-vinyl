import assert from 'assert';
import { create } from '../../../src/model/document';

describe('model - document', function() {
  describe('create', function() {
    it('should create model (no params)', function() {
      const result = create('my model');      
      assert(result);
    });
  });
/*
  describe('update', function() {
    it('should update model', function() {
      const testModel = model.create('testmodel');
      const result = model.update(testModel, 'testUser', { updated: true }, { updated: true });      
      //console.log(result);
      assert(result.meta.version === '1.0.1');
      assert(result.head.updated);
      assert(result.body.updated);      
    });
  });
*/
});