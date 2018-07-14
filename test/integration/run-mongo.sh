#!/bin/bash
docker-compose build
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml up -d mongodb
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml up -d remix
sleep 5s
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml up harness
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml down