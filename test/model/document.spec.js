const assert = require('assert');
const model = require('../../model/document');

describe('model - document', function() {
  describe('create', function() {
    it('should create model (no params)', function() {
      const result = model.create('my model');      
      assert(result.id);
      assert(result.schema);
      assert(result.meta);
      assert(result.head);
      assert(result.body);      
    });
  });

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
});