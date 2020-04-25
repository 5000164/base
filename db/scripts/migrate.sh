#!/usr/bin/env bash

docker run --rm -v $(realpath ../db.db):/flyway/db.db -v $(realpath ../migration):/flyway/sql -v $(realpath ../conf):/flyway/conf flyway/flyway migrate
