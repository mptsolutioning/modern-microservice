#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

echo "Attempting to connect to MongoDB at $host..."

until mongostat --host "$host" \
      --username root \
      --password example \
      --authenticationDatabase admin \
      --rowcount 1 > /dev/null 2>&1; do
  echo "Waiting for MongoDB to be ready at $host..."
  sleep 2
done

echo "MongoDB is ready! Executing command..."
exec $cmd