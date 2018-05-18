import { describe, it } from 'mocha';
import assert from 'assert';
import createRepo from '../../../src/repo/factory';
import { RepoType,  Repo } from '../../../src/repo/repo';
import FileRepo from '../../../src/repo/implementation/file.system';

describe('repo - factory', function() {
  describe('create', function() {
    it('Should return an FileRepo Object', function() {
      const result: Repo = createRepo(RepoType.FileSystem, '/myPath');
      //console.dir(result, { colors: true });
      assert(result instanceof FileRepo)
    });
  });
});