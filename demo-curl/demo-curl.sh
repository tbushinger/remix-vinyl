#!/bin/bash

cp -R demo-data _data

sleep 1

echo "======================="
echo "POST /documents/mydoc"
echo "creating a new document"
echo "======================="

curl -d  "@post.json" \
  -H "Content-Type: application/json" \
  -X POST http://remix-vinyl:3000/documents/mydoc

echo ""
echo ""
echo "======================="
echo "GET /documents/mydoc"
echo "Getting a list of document by type"
echo "======================="

curl -X GET http://remix-vinyl:3000/documents/mydoc

echo ""
echo ""
echo "======================="
echo "GET /documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0"
echo "Getting a complete single document"
echo "======================="

curl -X GET http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

echo ""
echo ""
echo "======================="
echo "PUT /documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0"
echo "Replacing an entire document"
echo "======================="

curl -d  "@put.json" \
  -H "Content-Type: application/json" \
  -X PUT http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

echo ""
echo ""
echo "======================="
echo "PATCH /documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0"
echo "Updating or added properties in a document"
echo "======================="

curl -d  "@patch.json" \
  -H "Content-Type: application/json" \
  -X PATCH http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

echo ""
echo ""
echo "======================="
echo "DELETE /documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0"
echo "Deletes a document"
echo "======================="

curl -X DELETE http://remix-vinyl:3000/documents/mydoc/54c0447e-78e7-475a-bfc7-031048bf0fa0

echo ""
echo ""
echo "======================="
echo "GET /documents/search?path=head.myNameIndex&value=myNameIndex&op=eq"
echo "Search 'indexedName' for 'myNameIndex' in 'head' section with operator 'eq'"
echo "======================="

curl -X GET http://remix-vinyl:3000/documents/search?path=head.myNameIndex&value=myNameIndex&op=eq

echo ""
echo ""
echo "======================="
echo "GET /documents/search?path=head.myNameIndex&value=Name&op=contains"
echo "Search 'indexedName' for any text 'Name' in 'head' section with operator 'contains'"
echo "======================="

curl -X GET http://remix-vinyl:3000/documents/search?path=head.myNameIndex&value=Name&op=contains

echo ""
echo ""
echo "======================="
echo "GET /documents/search?path=head.indexedId&value=0&op=gt"
echo "Search 'indexedId' for any value > 0 'head' section with operator gt"
echo "other ops include gte, lt, and lte"
echo "======================="

curl -X GET http://remix-vinyl:3000/documents/search?path=head.indexedId&value=0&op=gt

rm -R _data/demo-data