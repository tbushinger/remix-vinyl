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
    describe('payload', function() {
      it('should remove body', function() {
        const testModel1 = create('testmodel','userA',{},{});
        const testModel2 = create('testmodel','userA',{},{});
        const result = filterBy([testModel1,testModel2], 'meta.createdBy', 'userA');      
        //console.dir(result, { colors: true });
        assert(result.length == 2);
      });
    });

    describe('eq operator', function() {
      it('should return 2 items', function() {
        const testModel1 = create('testmodel','userA',{},{});
        const testModel2 = create('testmodel','userA',{},{});
        const result = filterBy([testModel1,testModel2], 'meta.createdBy', 'userA', 'eq');
        assert(result.length == 2);
      });
    });

    describe('neq operator', function() {
      it('should return 2 items', function() {
        const testModel1 = create('testmodel','userB',{},{});
        const testModel2 = create('testmodel','userB',{},{});
        const result = filterBy([testModel1,testModel2], 'meta.createdBy', 'userA', 'neq');
        assert(result.length == 2);
      });
    });

    describe('lt operator', function() {
      it('should return 1 item', function() {
        const testModel1 = create('testmodel','userB',{ count: 1 },{});
        const testModel2 = create('testmodel','userB',{ count: 2 },{});
        const result = filterBy([testModel1,testModel2], 'head.count', 2, 'lt');
        assert(result.length == 1);
      });
    });

    describe('lte operator', function() {
      it('should return 2 items', function() {
        const testModel1 = create('testmodel','userB',{ count: 1 },{});
        const testModel2 = create('testmodel','userB',{ count: 2 },{});
        const result = filterBy([testModel1,testModel2], 'head.count', 2, 'lte');
        assert(result.length == 2);
      });
    });

    describe('gt operator', function() {
      it('should return 1 item', function() {
        const testModel1 = create('testmodel','userB',{ count: 1 },{});
        const testModel2 = create('testmodel','userB',{ count: 2 },{});
        const result = filterBy([testModel1,testModel2], 'head.count', 1, 'gt');
        assert(result.length == 1);
      });
    });

    describe('gte operator', function() {
      it('should return 2 items', function() {
        const testModel1 = create('testmodel','userB',{ count: 1 },{});
        const testModel2 = create('testmodel','userB',{ count: 2 },{});
        const result = filterBy([testModel1,testModel2], 'head.count', '1', 'gte');
        assert(result.length == 2);
      });
    });

    describe('isnull operator', function() {
      it('should return 1 item', function() {
        const testModel1 = create('testmodel','userB',{ count: 1 },{});
        const testModel2 = create('testmodel','userB',{ },{});
        const result = filterBy([testModel1,testModel2], 'head.count', '', 'isnull');
        assert(result.length == 1);
      });
    });

    describe('notnull operator', function() {
      it('should return 1 item', function() {
        const testModel1 = create('testmodel','userB',{ count: 1 },{});
        const testModel2 = create('testmodel','userB',{ },{});
        const result = filterBy([testModel1,testModel2], 'head.count', '', 'notnull');
        assert(result.length == 1);
      });
    });

    describe('incl operator', function() {
      it('should return 2 items', function() {
        const testModel1 = create('testmodel','userB',{},{});
        const testModel2 = create('testmodel','userA',{},{});
        const result = filterBy([testModel1,testModel2], 'meta.createdBy', 'user', 'incl');
        assert(result.length == 2);
      });
    });

    describe('invalid operator', function() {
      it('should default to eq return 1 item', function() {
        const testModel1 = create('testmodel','userB',{},{});
        const testModel2 = create('testmodel','userA',{},{});
        const result = filterBy([testModel1,testModel2], 'meta.createdBy', 'userA', 'invalid');
        assert(result.length == 1);
      });
    });
  });
});