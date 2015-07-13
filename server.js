var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//handle all web stuff
app.get('/', function(req, res)
{
  console.log('Requested /')
  res.sendFile(__dirname + '/index.html');
});

app.all('/images/*', function(req, res, next)
{
  var path = req.path;
  var image = path.replace('/images/', '');

  console.log('Requested: ' + image);
  res.sendFile(__dirname + '//images//' + image);

  //don't call next() because it messes with the headers being sent
});

app.all('/routes/*', function(req, res, next)
{
  var path = req.path;
  var route = path.replace('/routes/', '');

  console.log('Requested: ' + route);
  res.sendFile(__dirname + '//routes//' + route);
});


http.listen(3000, function()
{
  console.log('Now listening on *:3000');
});


//handle io stuff

setInterval(function()
{
  io.emit('trains', data);
}, 30 * 1000);





io.on('connection', function(socket)
{

});
