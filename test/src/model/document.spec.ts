import { describe, it } from 'mocha';
import assert from 'assert';
import { create, update, patch, extractHeader, filterBy } from '../../../src/model/document';

describe('model - document', function() {
  describe('create', function() {
    it('should create model (no params)', function() {
      const result = create('my model','userA',{},{});      
      assert(result);
    });
  });

  describe('update', function() {
    describe('normal', function() {
      it('should update model', function() {
        const testModel = create('testmodel','userA',{},{});
        const result = update(testModel, 'testUser', { updated: true }, { updated: true });      
        //console.dir(result, { colors: true });
        assert(result);
        assert(result.meta.version === '1.0.1');
      });
    });

    describe('missing meta section', function() {
      it('should update model', function() {
        const testModel = create('testmodel','userA',{},{});
        testModel.meta = null;
        const result = update(testModel, 'testUser', { updated: true }, { updated: true });      
        //console.dir(result, { colors: true });
        assert(result);
        assert(result.meta.version === '1.0.1');
      });
    });
  });

  describe('patch', function() {
    it('should update model', function() {
      const testModel = create('testmodel','userA',{},{});
      const result = patch(testModel, 'testUser', { updated: true }, { updated: true });      
      //console.dir(result, { colors: true });
      assert(result);
      assert(result.meta.version === '1.0.1');
    });
  });

  describe('extractHeader', function() {
    it('should remove body', function() {
      const testModel = create('testmodel','userA',{},{});
      const result = extractHeader(testModel);      
      //console.dir(result, { colors: true });
      assert(result);
      assert(result.body === undefined);
    });
  });

  describe('filterBy', function() {
    it('should remove body', function() {
      const testModel1 = create('testmodel','userA',{},{});
      const testModel2 = create('testmodel','userA',{},{});
      const result = filterBy([testModel1,testModel2], 'meta.createdBy', 'userA');      
      //console.dir(result, { colors: true });
      assert(result.length == 2);
    });
  });
});