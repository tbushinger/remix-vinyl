const assert = require('assert');
const fs = require('fs');
const path = require('path');
const request = require('request');

const baseUrl = process.env.TARGET_SERVER_URL;
const fixtureDir = path.join(__dirname, 'fixtures');
const postData = JSON.parse(fs.readFileSync(`${fixtureDir}/post.json`));
const putData = JSON.parse(fs.readFileSync(`${fixtureDir}/put.json`));
const patchData = JSON.parse(fs.readFileSync(`${fixtureDir}/patch.json`));

const myDocType = 'myDocType';
const myDocUser = 'myDocUser';
const myDocUser2 = 'myDocUser2';
const myDocUser3 = 'myDocUser3';
let myDocId = null;

describe('REST Calls', () => {
  describe('url test', () => {
    it(`url should be "${baseUrl}"`, () => {
      assert.equal(process.env.TARGET_SERVER_URL, baseUrl);
    });
  });

  describe('POST', () => {
    it('Should return a status of 200', (done) => {

      const options = {
        uri: `${baseUrl}/${myDocType}`,
        method: 'POST',
        json: postData,
        headers: {
          'userid': myDocUser
        }
      };

      request(options, (error, response, body) => {
        assert(!error)
        assert.equal(response.statusCode, 200);
        myDocId = body.id;
        //console.log(body)
        done();
      });
    });
  });

  describe('PUT', () => {
    it('Should return a status of 200', (done) => {

      const options = {
        uri: `${baseUrl}/${myDocType}/${myDocId}`,
        method: 'PUT',
        json: putData,
        headers: {
          'userid': myDocUser2
        }
      };

      request(options, (error, response, body) => {
        assert(!error)
        assert.equal(response.statusCode, 200);
        //console.log(body)
        done();
      });
    });
  });

  describe('PATCH', () => {
    it('Should return a status of 200', (done) => {

      const options = {
        uri: `${baseUrl}/${myDocType}/${myDocId}`,
        method: 'PATCH',
        json: patchData,
        headers: {
          'userid': myDocUser3
        }
      };

      request(options, (error, response, body) => {
        assert(!error)
        assert.equal(response.statusCode, 200);
        //console.log(body)
        done();
      });
    });
  });

  describe('GET', () => {
    it('Should return a status of 200', (done) => {

      const options = {
        uri: `${baseUrl}/${myDocType}/${myDocId}`,
        method: 'GET'
      };

      request(options, (error, response, body) => {
        assert(!error)
        assert.equal(response.statusCode, 200);
        //console.log(body)
        done();
      });
    });
  });

  describe('GET', () => {
    it('Should return a status of 200', (done) => {

      const options = {
        uri: `${baseUrl}/${myDocType}`,
        method: 'GET'
      };

      request(options, (error, response, body) => {
        assert(!error)
        assert.equal(response.statusCode, 200);
        //console.log(body)
        done();
      });
    });
  });

  describe('GET', () => {
    it('Should return a status of 200', (done) => {

      const options = {
        uri: `${baseUrl}/search/${myDocType}?path=meta.createdBy&value=myDocUser&op=eq`,
        method: 'GET'
      };

      request(options, (error, response, body) => {
        assert(!error)
        assert.equal(response.statusCode, 200);
        //console.log(body)
        done();
      });
    });
  });

  describe('DELETE', () => {
    it('Should return a status of 200', (done) => {

      const options = {
        uri: `${baseUrl}/${myDocType}/${myDocId}`,
        method: 'DELETE'
      };

      request(options, (error, response, body) => {
        assert(!error)
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

});