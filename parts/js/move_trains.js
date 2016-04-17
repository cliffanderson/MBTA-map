    function moveTrains()
      {
        //move old trains to new trains
        var count = 0;

        var intervalid = setInterval(function()
        {
          count++;
          if(count == 30)
          {
            clearInterval(intervalid);
          }

          for(var i in trains)
          {
            var train = trains[i];

            var changeLat = train.future.lat() - train.current.getPosition().lat();
            var changeLng = train.future.lng() - train.current.getPosition().lng();

            train.current.setPosition(new google.maps.LatLng(
              train.current.getPosition().lat() + changeLat/30,
              train.current.getPosition().lng() + changeLng/30));
          }
        }, 50);
      }