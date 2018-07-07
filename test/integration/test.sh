#!/bin/bash
DOC_TYPE=myDocType
DOC_USER=myDocUser
FIXTURES_DIR=./fixtures
URL=http://localhost:3000/documents

curl -d "@${FIXTURES_DIR}/post.json" \
  -H "userid: ${DOC_USER}" \
  -H "Content-Type: application/json" \
  -X POST ${URL}/${DOC_TYPE}