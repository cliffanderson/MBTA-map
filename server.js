var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var exec = require('child_process').exec;
var fs = require('fs');

var DATA = '';

//handle all web stuff
app.get('/', function(req, res)
{
  res.sendFile(__dirname + '/index.html');
});
app.all('/MBTA-map/*', function(req, res, next)
{
  var path = req.path;
  var file = path.replace('/MBTA-map/', '');

  console.log('MBTA-map request: ' + file);

  //if the request ends with '/' then check for existance of index.html
  if(file.indexOf('/', file.length - 1) !== -1)
  {
    file += 'index.html';
  }

  if(!fs.existsSync(__dirname + '/MBTA-map/' + file))
  {
    res.send('Error - 404');
  }
  else
  {
    res.sendFile(__dirname + '/MBTA-map/' + file);
  }
});

app.all('*', function(req, res, next)
{
  res.send('Error - 404');
});

//start the server
http.listen(3000, function()
{
  console.log('Now listening on *:3000');
});


//handle io stuff
setInterval(function()
{
  io.emit('trains', DATA);
  console.log("EMITTING");
}, 120 * 1000);


io.on('connection', function(socket)
{
  socket.emit('trains', DATA);
  console.log("A client connected");
});

//setup child process for train data
var process = exec('java -jar MBTA.jar 120000');

process.stdout.on('data', function(chunk)
{
  if(chunk.length > 10)
  {
    DATA = chunk;
    console.log("Got " + chunk.length + " bytes");
  }
});
