#!/bin/bash
git pull
docker container stop website
docker container rm website
docker-compose build
docker create --restart always --name website -p 80:80 zornco-site:latest
docker start website
