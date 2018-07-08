#!/bin/bash
DOC_TYPE=myDocType
DOC_USER=myDocUser
FIXTURES_DIR=./fixtures
URL=http://remix:3000/documents

sleep 5s

curl -d "@${FIXTURES_DIR}/post.json" \
  -H "userid: ${DOC_USER}" \
  -H "Content-Type: application/json" \
  -X POST ${URL}/${DOC_TYPE}