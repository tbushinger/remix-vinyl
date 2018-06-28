import { describe, it } from 'mocha';
import assert from 'assert';
import { Repo } from '../../../../src/repo/repo';
import { create } from '../../../../src/model/document';
import MongoDbRepo from '../../../../src/repo/implementation/mongodb';
import createMockMongoClient from './mocks/mongoClient';

const mockClient = createMockMongoClient();
const repo: Repo = new MongoDbRepo(mockClient, 'mongodb://localhost:27017', 'test');
const testModel = create('testmodel','userA',{},{});
const testModelFail = create('testmodel','userA',{ fail: true },{});

describe('repo - mongodb', function() {
  describe('connect', function() {
    it('error condition should throw err', function(done) {
      const badRepo: Repo = new MongoDbRepo(mockClient, null, 'test');
      badRepo.save(testModel.schema.type, testModel).catch((err) => {
        //console.log(err);
        assert(err);
        done();
      })
    });
  });
   
  describe('create', function() {
    it('Should return a DocType Object', async function() {
      const result = await repo.save(testModel.schema.type, testModel);
      //console.dir(result, { colors: true });
      assert(result === testModel);
    });

    it('Should return an error', function(done) {
      repo.save(testModel.schema.type, testModelFail).catch((error) => {
        //console.log(error);
        assert(error);
        done();
      })
    });
  });

  describe('list', function() {
    it('Should return a DocType List', async function() {
      const result = await repo.list(testModel.schema.type);
      //console.dir(result, { colors: true });
      assert(result.length != undefined);
    });
  });

  describe('get', function() {
    it('Should return an DocType Object', async function() {
      const result = await repo.get(testModel.schema.type, testModel.id);
      //console.dir(result, { colors: true });
      assert(result);
    });
  });

  describe('remove', function() {
    it('Should return true', async function() {
      const result = await repo.remove(testModel.schema.type, testModel.id);
      assert(result);
    });
  });
});
