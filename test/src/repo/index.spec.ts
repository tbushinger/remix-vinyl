import { describe, it } from 'mocha';
import assert from 'assert';
import createRepo from '../../../src/repo';
import { RepoType, Repo } from '../../../src/repo/repo';
import FileRepo from '../../../src/repo/implementation/file.system';
import MemRepo from '../../../src/repo/implementation/memory';

describe('repo - factory', function () {
  describe('create File System Repo', function () {
    it('Should return an FileRepo Object', function () {
      const result: Repo = createRepo(RepoType.FileSystem, '/myPath');
      //console.dir(result, { colors: true });
      assert(result instanceof FileRepo)
    });
  });

  describe('create Memory Repo', function () {
    it('Should return an Memory Repo Object', function () {
      const result: Repo = createRepo(RepoType.Memory);
      //console.dir(result, { colors: true });
      assert(result instanceof MemRepo)
    });
  });
});