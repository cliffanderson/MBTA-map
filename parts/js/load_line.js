      function loadLine(line)
      {
        var color;
        if(line.includes('CR'))
        {
          color = '#F524FB';
        }
        else
        {
          color = colors[line];
        }


        var overlay = new Object();
        var path = [];

        var data = requestData('routes/' + line + '.txt').split('\n');

        var markers = [];

        for(var i = 0; i < data.length; i++)
        {
          if(data[i] == '') continue;

          var pieces = data[i].split(' ');

          var lat = pieces[pieces.length-2];
          var lng = pieces[pieces.length-1];
          var place = new google.maps.LatLng(lat, lng);

          path.push(place);


          var name = '';

          for(var j = 0; j < pieces.length - 2; j++)
          {
            name += pieces[j];
          }

          //marker to represent station
          var marker = new google.maps.Marker(
            {
              position: place,
              icon:
              {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
              },
              map: map,
              title: name
            }
          );

          markers.push(marker);

        }

        //put path on map
        var pathOnMap = new google.maps.Polyline(
          {
            path: path,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 4
          }
        );

        pathOnMap.setMap(map);

        overlay.poly = pathOnMap;
        overlay.markers = markers;

        overlays[line] = overlay;
        }