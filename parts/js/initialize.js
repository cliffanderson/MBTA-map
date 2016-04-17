      google.maps.event.addDomListener(window, 'load', initialize);

      var map;
      var trains = []; //train object: {'line': 'Red', 'current': google.maps.Marker(), 'future': google.maps.LatLng(), 'id' : 1234}
      var overlays = []; //overlay object: 'Blue': {'poly': google.maps.PolyLine(), 'markers': google.maps.Marker()[]}
      var images = [];


    //function to initialize
      function initialize()
      {
        var boston = new google.maps.LatLng(42.3479, -71.087667);

        var mapCanvas = document.getElementById('map-canvas');
        var mapOptions =
        {
          //center: new google.maps.LatLng(44.5403, -78.5463),
          center:boston,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(mapCanvas, mapOptions);

        //make roads less invasive
        var styles = [
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [
              { lightness: 100 },
              { visibility: "simplified" }
            ]
          }
        ];
        map.setOptions({styles: styles});

        //add images to array
        for(var i in lines)
        {
            var line = lines[i];
            var url = "";

            if(line.indexOf('CR') !== -1)
            {
                //is a commuter line
                url = 'images/commuter.png';
            }
            else
            {
                url = 'images/' + line + '.png';
            }


          images[lines[i]] =
          {
              url: url,
              anchor: new google.maps.Point(15,15)
          };
        }

          google.maps.event.addListenerOnce(map, 'idle', function()
          {
            var socket = io('http://cliffanderson.net:' + PORT);

            socket.on('trains', function(info)
            {
              //console.log("Got: " + info);
              //put trains on map
              var data = info.split('\n');
              var line;

              for(var i = 0; i < data.length - 1; i++)
              {
                if(isLine(data[i]))
                {
                  line = data[i];
                  continue;
                }

                var nums = data[i].split(' ');

                var train = new Object();

                var lat = nums[0];
                var lng = nums[1];
                var id = nums[2];

                //if this train is new, add and make 'current' and 'future' the same
                //if this train is not new, just change 'future'

                //if new
                if(!inTrains(id, line))
                {
                  var marker = new google.maps.Marker(
                    {
                      position: new google.maps.LatLng(lat, lng),
                      icon: images[line],
                      title: id,
                      map: map
                    }
                  );

                  train.line = line;
                  train.current = marker;
                  train.id = id;
                  train.future = marker.getPosition();
                  trains.push(train);
                }
                else
                {
                  //find current train and change future
                  for(var j in trains)
                  {
                    if(trains[j].id == id && trains[j].line == line)
                    {
                      trains[j].future = new google.maps.LatLng(lat, lng);
                    }
                  }
                }
              }
              moveTrains();
            });

            //load subway lines
            for(var i in lineOverlay)
            {
              var color;

              if(lineOverlay[i].includes('CR'))
              {
                color = '#F524FB';
              }
              else
              {
                  color = colors[lineOverlay[i]];
              }

              loadLine(lineOverlay[i]);
            }
          });
      }