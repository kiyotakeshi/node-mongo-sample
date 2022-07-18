#!/bin/bash

mongoimport --db "blog" --collection blogs --drop \
--file /docker-entrypoint-initdb.d/01_import_init_data.json \
--jsonArray
