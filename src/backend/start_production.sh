#!/bin/bash

# To use this with pm2, just run pm2 start --name NeuraViz src/backend/start_production.sh

poetry run hypercorn src.api:app -b 0.0.0.0:8083