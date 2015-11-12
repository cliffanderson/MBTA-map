var io = require('socket.io')(1234);


var exec = require('child_process').exec;
var fs = require('fs');
var http = require('http');

var DATA = '';
var connectedClients = 0;

//handle connections
io.on('connection', function(socket)
{
	socket.emit('trains', DATA);
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

var numTrains = 19;
var totalData = '';
var publishData = function(finishedData)
{
	numTrains--;
	totalData += finishedData;
	
	if(numTrains === 0)
	{
		//send to clients
		io.emit('trains', totalData);
		console.log('emitting data');
		
		numTrains = 19;
		totalData = '';
	}
}

var trains = ['Green-B', 'Green-C', 'Green-D', 'Green-E', 'Blue', 'Red', 'Orange', 
'CR-Fairmount', 'CR-Fitchburg', 'CR-Worcester', 'CR-Franklin', 'CR-Greenbush',
'CR-Haverhill', 'CR-Kingston', 'CR-Lowell', 'CR-Middleborough', 'CR-Needham',
'CR-Newburyport', 'CR-Providence'];

var fetchTrainData = function(route, callback)
{
	var finishedData = route;
	finishedData += '\n';
	
	var url = 'http://realtime.mbta.com/developer/api/v2/vehiclesbyroute?api_key=' + api_key +
	'&route=' + route + '&format=json';
	
	http.get(url, function(res)
	{
		res.setEncoding('utf8');
		res.on('data', function(data)
		{
			finishedData += data;
		});
		
		res.on('end', function()
		{
			console.log(typeof data);
			console.log('Data received: ' + data);
			if(data.indexOf('error') === -1)
			{
				var obj = JSON.parse(data);
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
	console.log('called');

setInterval(function()
{
	console.log('connected clients: ' + connectedClients);
	if(connectedClients !== 0)
	{
		for(var i = 0; i < trains.length; i++)
		{
			var route = trains[i];
			fetchTrainData(route, publishData);
		}
	}
}, 30000);



