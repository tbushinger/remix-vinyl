# remix-vinyl #
## Virtual file/document service ##
The purpose of this project is to provide a simple API service to  support full CRUD operations and management of JSON documents.

## Features ##
 * scaleable - from standalone single service to highly available configurations
 * indexing - for faster searching and document listing
 * supported storage/indexing back ends - mongodb, redis, file system, and in memory

## Prerequisites ##
The assumption is made you the following products installed and understand their usage:
 * [Node JS](https://nodejs.org/en/) (8.9 or greater)
 * [Docker](https://www.docker.com/)
 * [Docker Compose](https://docs.docker.com/compose/compose-file/) (3.0 or greater)

## Getting Started ##

At the command prompt CD into the `remix-vinyl` project folder.  Then run
```bash
npm install
```

Next, test the server by running command
```bash
npm run dev:up
```

You will see this output:
```bash
Creating network "remix-vinyl_default" with the default driver
Creating remix-vinyl_remix-vinyl_1 ... done
Attaching to remix-vinyl_remix-vinyl_1
remix-vinyl_1  |
remix-vinyl_1  | > remix-vinyl@1.0.0 start /usr/src/app
remix-vinyl_1  | > node ./dist/index
remix-vinyl_1  |
```

Then you can down the server with this command:
```hash
npm run dev:down
```

The `dev:up` runs the default in-memory configuration of the service.  This configuration is in the `docker-compose.yml` file.  Notice the defineable environment settings.

```yml
version: '3'

services:
  remix-vinyl:
    image: tbushinger/remix-vinyl
    environment:
     # Internal Node App Settings
     - NODE_ENV=production
     - PORT=3000
     - DEFAULT_USER=system
     # Document Database settings (type could be 'memory', 'fileSystem', 'mongodb', or 'redis')
     - DOC_REPO_TYPE=memory
     # Document directory (if type if filesystem) 
     - DOC_REPO_DIR=_data
     - DOC_REPO_HOST=localhost
     - DOC_REPO_PORT=27017
     # Storage database (if type is 'mongodb')
     - DOC_REPO_DB=rmxStorage
     # Index Database settings
     - DOC_INDEX_TYPE=memory
     # Document directory (if type if filesystem)
     - DOC_INDEX_DIR=_index
     - DOC_INDEX_HOST=localhost
     - DOC_INDEX_PORT=6379
     - DOC_INDEX_DB=rmxIndex
     # Connect tries to connect to external resources such as mongodb and redis
     # is since the while the container start together, the services inside may need time to initialize
     - CONNECT_TRIES=10
     # wait time in ms
     - RETRY_INTERVAL=1000
    ports:
     - 3000:3000
```

The next section will demonstrate the specific API calls and format of the documents

## Demo ##

This demo will do the following:
 * Up a service with a file system storage and in memory indexer
 * Make GET/POST requests using curl
 * Down the service

To run the demo enter this command:
```bash
npm run demo:all
```
```bash
=======================
POST /documents/mydoc
creating a new document
=======================
{"id":"1831da71-5f6e-4a32-834d-afac66ed5683","schema":{"version":"1.0.0","type":"mydoc-index"},"meta":{"version":"1.0.0","createdOn":"2018-09-15T20:28:00.821Z","createdBy":"system","updatedOn":"2018-09-15T20:28:00.821Z","updatedBy":"system"},"head":{"indexedId":1,"indexedName":"myNameIndex"}}

=======================
GET /documents/mydoc
Getting a list of document by type
=======================
[{"id":"1831da71-5f6e-4a32-834d-afac66ed5683","schema":{"version":"1.0.0","type":"mydoc-index"},"meta":{"version":"1.0.0","createdOn":"2018-09-15T20:28:00.821Z","createdBy":"system","updatedOn":"2018-09-15T20:28:00.821Z","updatedBy":"system"},"head":{"indexedId":1,"indexedName":"myNameIndex"}}]

=======================
GET /documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0
Getting a complete single document
=======================
{"id":"54c0447e-78e7-475a-bfc7-031048bf0fa0","schema":{"version":"1.0.0","type":"mydoc"},"meta":{"version":"1.0.5","createdOn":"2018-09-11T13:34:00.709Z","updatedOn":"2018-09-11T13:55:28.167Z"},"head":{"indexedId":2,"indexedName":"myUpdateNameIndex","indexedAddedData":"moreData"},"body":{"documentData":"Some Updated Document Data","documentAddedData":"More Data"}}
```

## API Methods ##

This section documents the API methods used in the demo above.

### Creating a Document ###

This example creates a new document of type `myDoc`

```bash
curl -d  "@post.json" \
  -H "Content-Type: application/json" \
  -X POST http://remix-vinyl:3000/documents/mydoc

# localhost
curl -d  "@post.json" \
  -H "Content-Type: application/json" \
  -X POST http://localhost:3000/documents/mydoc

```
Url pattern:
```bash
  POST /documents/[document type]
```

Lets take a look at `post.json`.
```json
{
    "head": {
        "indexedId": 1,
        "indexedName": "myNameIndex"
    },
    "body": {
        "documentData": "Some Document Data"
    }
}
```

The `head` section represents data which will be 
 * Displayed in document lists
 * Indexed for searching and filtering

The `body` is the content of the document.  NOTE: for performance reasons, data in this section cannot be used in filtering and searching

The output should look like this:
```json
{
  "id":"1831da71-5f6e-4a32-834d-afac66ed5683",
  "schema": {
    "version":"1.0.0",
    "type":"mydoc-index"
  },
  "meta": {
    "version":"1.0.0",
    "createdOn":"2018-09-15T20:28:00.821Z",
    "createdBy":"system",
    "updatedOn":"2018-09-15T20:28:00.821Z",
    "updatedBy":"system"
  },
  "head": {
    "indexedId":1,
    "indexedName":"myNameIndex"
  }
}
```

Note these sections:
 * id - generated unique id
 * schema - system document type and version
 * meta - user, timestamp, and version data
 * head - list/index fields

The `body` is not returned for updates and inserts.

You can specify a user by adding a `userid` key to the request header

```bash
curl -d  "@post.json" \
  -H "Content-Type: application/json" \
  -H "userid: myuser" \
  -X POST http://remix-vinyl:3000/documents/mydoc

# localhost
curl -d  "@post.json" \
  -H "Content-Type: application/json" \
  -H "userid: myuser" \
  -X POST http://localhost:3000/documents/mydoc

```

### Getting a list of Documents ###

This example returns a list documents of type `myDoc`

```bash
curl -X GET http://remix-vinyl:3000/documents/mydoc

# localhost
curl -X GET http://localhost:3000/documents/mydoc

```
Url pattern:
```bash
  GET /documents/[document type]
```

The output should look like this:
```json
[
  {
    "id":"1831da71-5f6e-4a32-834d-afac66ed5683",
    "schema": {
      "version":"1.0.0",
      "type":"mydoc-index"
    },
    "meta": {
      "version":"1.0.0",
      "createdOn":"2018-09-15T20:28:00.821Z",
      "createdBy":"system",
      "updatedOn":"2018-09-15T20:28:00.821Z",
      "updatedBy":"system"
    },
    "head": {
      "indexedId":1,
      "indexedName":"myNameIndex"
    }
  },
  ...
]
```

Note these sections:
 * id - generated unique id
 * schema - system document type and version
 * meta - user, timestamp, and version data
 * head - list/index fields

The `body` is not returned in lists

### Getting a single Document ###

This example fetches a new document of type `myDoc` with the id `54c0447e-78e7-475a-bfc7-031048bf0fa0`

```bash
curl -X GET http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

# localhost
curl -X GET http://localhost:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

```
Url pattern:
```bash
  GET /documents/[document type]/[document id]
```

The output should look like this:
```json
{
  "id":"54c0447e-78e7-475a-bfc7-031048bf0fa0",
  "schema":{
    "version":"1.0.0",
    "type":"mydoc"
  },
  "meta":{
    "version":"1.0.0",
    "createdBy":"system",
    "createdOn":"2018-09-11T13:34:00.709Z",
    "updatedBy":"system",
    "updatedOn":"2018-09-11T13:34:00.709Z"
  },
  "head":{
    "indexedId":2,
    "indexedName":"myNameIndex",
  },
  "body":{
    "documentData":"Some Document Data",
  }
}
```

Note these sections:
 * id - generated unique id
 * schema - system document type and version
 * meta - user, timestamp, and version data
 * head - list/index fields
 * body - user-defined content

### Updating/Replacing a Document ###

This example a replaces the head and body sections of an existing document of type `myDoc` for id `54c0447e-78e7-475a-bfc7-031048bf0fa0`

```bash
curl -d  "@put.json" \
  -H "Content-Type: application/json" \
  -X PUT http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

# localhost
curl -d  "@put.json" \
  -H "Content-Type: application/json" \
  -X PUT http://localhost/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

```
Url pattern:
```bash
  PUT /documents/[document type]/[document id]
```

Lets take a look at `put.json`.
```json
{
    "head": {
        "indexedId": 2,
        "indexedName": "myUpdateNameIndex"
    },
    "body": {
        "documentData": "Some Updated Document Data"
    }
}
```

The `head` section represents data which will be 
 * Displayed in document lists
 * Indexed for searching and filtering

The `body` is the content of the document.

For document replacements, BOTH sections should have properties to replace the document correctly.

The output should look like this:
```json
{
  "id":"54c0447e-78e7-475a-bfc7-031048bf0fa0",
  "schema":{
    "version":"1.0.0",
    "type":"mydoc-index"
  },
  "meta":{
    "version":"1.0.1",
    "createdBy":"system",
    "createdOn":"2018-09-11T13:34:00.709Z",
    "updatedBy":"system",
    "updatedOn":"2018-09-17T18:52:31.383Z",
  },
  "head":{
    "indexedId":2,
    "indexedName":"myUpdateNameIndex"
  }
}
```

Note these sections:
 * id
 * schema - system document type and version
 * meta - updating user, updating timestamp, and incremented version data
 * head - updated list/index fields (if modified)

The `body` is not returned for updates and inserts.

You can specify a user by adding a `userid` key to the request header

```bash
curl -d  "@put.json" \
  -H "Content-Type: application/json" \
  -H "userid: myuser" \
  -X PUT http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

# localhost
curl -d  "@put.json" \
  -H "Content-Type: application/json" \
  -H "userid: myuser" \
  -X PUT http://localhost/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0
```

### Partial update of a Document ###

This example a allows for partial updates of the head and body sections of an existing document of type `myDoc` for id `54c0447e-78e7-475a-bfc7-031048bf0fa0`

```bash
curl -d  "@patch.json" \
  -H "Content-Type: application/json" \
  -X PATCH http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

## localhost
curl -d  "@patch.json" \
  -H "Content-Type: application/json" \
  -X PATCH http://localhost:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

```
Url pattern:
```bash
  PATCH /documents/[document type]/[document id]
```

Lets take a look at `patch.json`.
```json
{
    "head": {
        "indexedAddedData": "moreData"
    },
    "body": {
        "documentAddedData": "More Data"
    }
}
```

The output should look like this:
```json
{
  "id":"54c0447e-78e7-475a-bfc7-031048bf0fa0",
  "schema":{
    "version":"1.0.0",
    "type":"mydoc-index"
  },
  "meta":{
    "version":"1.0.2",
    "createdOn":"2018-09-11T13:34:00.709Z",
    "createdBy":"system",
    "updatedOn":"2018-09-17T18:52:31.397Z",
    "updatedBy":"system"
  },
  "head":{
    "indexedId":2,
    "indexedName":"myUpdateNameIndex",
    "indexedAddedData":"moreData"
  }}
```

Note these sections:
 * id
 * schema - system document type and version
 * meta - updating user, updating timestamp, and incremented version data
 * head - updated list/index with additional fields or updated ones

The `body` would also include updated or additional fields

### Deleting a Document ###

This example demonstrates deleting an existing document of type `myDoc` for id `54c0447e-78e7-475a-bfc7-031048bf0fa0`

```bash
curl -X DELETE http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

## localhost
curl -X DELETE http://localhost:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

```
Url pattern:
```bash
  DELETE /documents/[document type]/[document id]
```

### Searching/filtering Documents ###

## Development ##

## High Availability ##

## Use with File System ##