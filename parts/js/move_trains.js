    function moveTrains()
    {
        //move old trains to new trains
        var count = 0;
        var MOVEMENT_MILLISECONDS = 20000; //How long the movement takes
        var FRAMES = 30; //How many frames the trains have for their entire movement

        var intervalid = setInterval(function()
        {
            if(count >= FRAMES)
            {
                //stop the function from running
                clearInterval(intervalid);
            }

            for(var i in trains)
            {
                var train = trains[i];

                var changeLat = train.future.lat() - train.current.getPosition().lat();
                var changeLng = train.future.lng() - train.current.getPosition().lng();

                train.current.setPosition(new google.maps.LatLng(
                    train.current.getPosition().lat() + changeLat/FRAMES,
                    train.current.getPosition().lng() + changeLng/FRAMES));
            }
            
            count++;
        }, MOVEMENT_MILLISECONDS / FRAMES);
    }
