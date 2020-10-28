#!/bin/bash
git pull
docker-compose stop
docker container rm site-git_web_1 site-git_proxy_1
docker-compose up -d
