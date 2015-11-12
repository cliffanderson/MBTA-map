var io = require('socket.io')(1234);


var exec = require('child_process').exec;
var fs = require('fs');
var http = require('http');

var connectedClients = 0;

var numTrains = 19;
var totalData = '';
var DATA = ''; //stores most recent complete totalData

//handle connections
io.on('connection', function(socket)
{
	socket.emit('trains', DATA);
	console.log('Sent ' + DATA.length + ' bytes to the client ');
	console.log('A client connected!');
	connectedClients++;
	
	//handle disconnections
	socket.on('disconnect', function()
	{
		console.log('A client disconnected');
		connectedClients--;
	});
});


//make calls to mbta api for train location data
var api_key = process.argv[2];
if(api_key === undefined)
{
	console.log("ERROR: no api key!");
}


var publishData = function(finishedData)
{
	numTrains--;
	totalData += finishedData;
	
	if(numTrains === 0)
	{
		console.log('All train data loaded');
		//send to clients
		console.log('Sending to clients...');
		io.emit('trains', totalData);
		
		numTrains = 19;
		DATA = totalData;
		totalData = '';
	}
}

var trains = ['Green-B', 'Green-C', 'Green-D', 'Green-E', 'Blue', 'Red', 'Orange', 
'CR-Fairmount', 'CR-Fitchburg', 'CR-Worcester', 'CR-Franklin', 'CR-Greenbush',
'CR-Haverhill', 'CR-Kingston', 'CR-Lowell', 'CR-Middleborough', 'CR-Needham',
'CR-Newburyport', 'CR-Providence'];

var fetchTrainData = function(route, callback)
{
	var rawData = '';
	var finishedData = route;
	finishedData += '\n';
	
	var url = 'http://realtime.mbta.com/developer/api/v2/vehiclesbyroute?api_key=' + api_key +
	'&route=' + route + '&format=json';
	
	http.get(url, function(res)
	{
		res.setEncoding('utf8');
		res.on('data', function(data)
		{
			rawData += data;
		});
		
		res.on('end', function()
		{
			if(rawData.indexOf('error') === -1)
			{
				var obj = JSON.parse(rawData);
				var directions = obj.direction; //array of size 2 (inbound and outbound)
				for(var dir = 0; dir < directions.length; dir++)
				{
					var trips = directions[dir].trip; //array of trips
					for(var trip = 0; trip < trips.length; trip++)
					{
						var vehicle = trips[trip].vehicle;
						finishedData += vehicle.vehicle_lat + ' ' + vehicle.vehicle_lon + ' ' + vehicle.vehicle_id + '\n';
					}
				}
				//this is where the data is fully formed
				//there are issues with asynchronusly getting data from the web
				callback(finishedData);
			}
		});
	});
}

setInterval(function()
{
	console.log('connected clients: ' + connectedClients);
	if(connectedClients !== 0)
	{
		loadAllTrains();
	}
}, 30000);

var loadAllTrains = function()
{	
	for(var i = 0; i < trains.length; i++)
	{
		var route = trains[i];
		fetchTrainData(route, publishData);
	}
	
}

//initial load
loadAllTrains();