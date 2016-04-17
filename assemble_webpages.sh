#!/usr/bin/env bash
#Script to merge many javascript & html files into one

HTML='parts/html/'
JS='parts/js/'

#Assemble subway map
echo "Assembling subway map"
cat $HTML"map_html_begin.html" > MBTA-map/subway.html
cat $JS"subway_lines.js" >> MBTA-map/subway.html

cat $JS"initialize.js" >> MBTA-map/subway.html
cat $JS"load_line.js" >> MBTA-map/subway.html
cat $JS"move_trains.js" >> MBTA-map/subway.html
cat $JS"utilities.js" >> MBTA-map/subway.html

cat $HTML"map_html_end.html" >> MBTA-map/subway.html


#Assemble commuter map
echo "Assembling commuter map"
cat $HTML"map_html_begin.html" > MBTA-map/commuter.html
cat $JS"commuter_lines.js" >> MBTA-map/commuter.html

cat $JS"initialize.js" >> MBTA-map/commuter.html
cat $JS"load_line.js" >> MBTA-map/commuter.html
cat $JS"move_trains.js" >> MBTA-map/commuter.html
cat $JS"utilities.js" >> MBTA-map/commuter.html

cat $HTML"map_html_end.html" >> MBTA-map/commuter.html



echo "done"
