    /*
       Function to request a text-based resource on the web and return its contents

       Arguments:
		 url: The url of the resource (e.g. 'routes/Orange.txt')

    */
    function requestData(url)
    {
        var request = new XMLHttpRequest();
        console.log("GET " + url);
        request.open('GET', url, false);
        request.send();
        return request.responseText;
    }


    /*
       Function to determine if a string is the name of a train line

       Arguments:
                 s: The string to test (e.g. 'Blue' or '42.34978 -71.07855 3652')
    */
    function isLine(s)
    {
        return s.includes(".");
    }


    /*
       Function to determine if a specific train is in the array of trains on the map

       Arguments:
                 id: The id of the train (e.g. 3692)
                 line: The line of the train (e.g. 'Red')
    */
    function inTrains(id, line)
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



    setInterval(function()
    {
	var counter = document.getElementById("counter")
	var num = counter.innerHTML
	num = num - 1
	counter.innerHTML = num
    }, 1000)

