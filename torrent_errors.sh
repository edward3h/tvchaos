#!/bin/bash


cd "${0%/*}"
source .env

ERROR_IDS=$(transmission-remote $TRANSMISSION_HOST -l | grep -E -o '[0-9]+\* ' | xargs | sed -e 's/\*\ /,/g;s/\*//')

echo "Torrents with errors ${ERROR_IDS}"
echo "delete from downloads where transmission_id in (${ERROR_IDS});" | mysql --defaults-file=.mysql.cnf
transmission-remote $TRANSMISSION_HOST -t $ERROR_IDS --remove

