import assert from "assert";
import { describe, it } from "mocha";
import createDocumentService from "../../../../src/service/document";
import DocumentService from "../../../../src/service/document/document";
import DocumentServiceImpl from "../../../../src/service/document/implementation/document";
import { Repo } from "../../../../src/repo/repo";
import createMockRepo from "./mocks/repo";

const repo: Repo = createMockRepo();
let service : DocumentService;

describe('document - index', function() { 
  describe('createDocumentService', function() {
    describe('first call', function() {
      it('Should return new DocumentService Object', async function() {
        service = createDocumentService(repo);
        assert(service instanceof DocumentServiceImpl);
      });
    });
    
    describe('second call', function() {
      it('Should return an existing DocumentService Object', async function() {
        service = createDocumentService(repo);
        assert(service instanceof DocumentServiceImpl);
      });
    });
  });
});
