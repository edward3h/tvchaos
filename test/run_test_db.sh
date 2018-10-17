#!/usr/bin/env bash


real=$(realpath "$0")
cd $(dirname "$real")

docker run --name tvchaos-mariadb -e MYSQL_ROOT_PASSWORD=tvchaostest -d mariadb:5
docker run --link tvchaos-mariadb:mysql --rm mariadb sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD" -c"CREATE DATABASE eternal_tvchaos"'
docker run -it --link tvchaos-mariadb:mysql --rm mariadb sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD"' < resources/data/dump_2018-10-15.sql
