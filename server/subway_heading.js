var io = require('socket.io')(1234);
var fs = require('fs');
var http = require('http');

var connectedClients = 0;

var trains = ['Green-B', 'Green-C', 'Green-D', 'Green-E', 'Blue', 'Red', 'Orange'];

