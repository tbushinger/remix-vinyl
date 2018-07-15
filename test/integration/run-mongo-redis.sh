#!/bin/bash
docker-compose build
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml -f docker-compose.redis.yml up -d remix
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml -f docker-compose.redis.yml up -d mongodb
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml -f docker-compose.redis.yml up -d redis
sleep 10s
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml -f docker-compose.redis.yml up harness
#docker-compose logs remix
docker-compose -f docker-compose.yml -f docker-compose.mongodb.yml -f docker-compose.redis.yml down