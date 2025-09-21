#!/usr/bin/env bash
cd build
mkdir -p uploads sys
cp ../.env ./.env
cp -r ../views ./views
cp -r ../static/css ./static/css
cp -r ../static/assets ./static/assets
cp -r ../static/temp ./static/temp
cp -r ../static/screenshots ./static/screenshots


cp ../static/Signature.svg ./static/Signature.svg
cp ../static/logo2.svg ./static/logo2.svg
cp ../static/NoPreview.png ./static/NoPreview.png
cp ../static/logo1.png ./static/logo1.png
cp ../static/favicon.ico ./static/favicon.ico

