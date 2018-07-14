#!/bin/bash
docker-compose build
docker-compose up -d remix
sleep 5s
docker-compose up harness
docker-compose down