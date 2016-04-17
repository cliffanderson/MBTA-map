#!/usr/bin/env bash
#Script to move all web files to the correct locations on disk

echo "Delete existing site"
rm -r /var/www/html/MBTA-map/

echo "Copy new site"
cp -r MBTA-map /var/www/html/

echo "Make subway map default"
cp /var/www/html/MBTA-map/subway.html /var/www/html/MBTA-map/index.html

echo "Done"
