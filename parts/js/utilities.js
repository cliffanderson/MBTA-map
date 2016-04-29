    function requestData(url)
    {
        var request = new XMLHttpRequest();
        console.log("GET " + url);
        request.open('GET', url, false);
        request.send();
        return request.responseText;
    }



    var isLine = function(s)
    {
        if(s.includes("."))
        {
            return false;
        }
        else
        {
            return true;
        }
    }


    var inTrains = function(id, line)
    {
        for(var i in trains)
        {
            if(trains[i].id == id && trains[i].line == line)
            {
                return true;
            }
        }

        return false;
    }
