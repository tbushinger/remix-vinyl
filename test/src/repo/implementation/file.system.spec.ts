import { describe, it } from 'mocha';
import assert from 'assert';
import { RepoType,  Repo } from '../../../../src/repo/repo';
import { create } from '../../../../src/model/document';
import FileRepo from '../../../../src/repo/implementation/file.system';

const mock = require('mock-require');

const repo: Repo = new FileRepo('./_testData')
const testModel = create('testmodel','userA',{},{});

describe('repo - file.system', function() {
  
  describe('create', function() {
    it('Should return a DocType Object', async function() {
      const result = await repo.save(testModel.schema.type, testModel);
      //console.dir(result, { colors: true });
      assert(result === testModel);
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
