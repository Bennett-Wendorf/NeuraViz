#!/bin/bash

# To use this with pm2, just run pm2 start --name NeuraViz start_production.sh

pipenv run hypercorn api:app -b 0.0.0.0:8083