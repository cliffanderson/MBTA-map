echo "Delete existing site"
rm -r /var/www/html/MBTA-map/

echo "Copy new site"
cp -r MBTA-map /var/www/html/

echo "Done"
